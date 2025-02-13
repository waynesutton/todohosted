import { mutation, query, action, ActionCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id, Doc } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { api } from "./_generated/api";

// Updated textToVector: Sum each character's code into one of 100 buckets, then normalize.
function textToVector(text: string): number[] {
  const vector = new Array(100).fill(0);
  const lower = text.toLowerCase();
  for (let i = 0; i < lower.length; i++) {
    vector[i % 100] += lower.charCodeAt(i);
  }
  // Normalize each bucket by an arbitrary factor (here 1000)
  return vector.map((val) => val / 1000);
}

export const get = query(async (ctx) => {
  return await ctx.db.query("messages").order("asc").collect();
});

export const send = mutation(async (ctx, { text, sender }: { text: string; sender: string }) => {
  // Generate vector for the new message
  const vector = textToVector(text);
  console.log("New message:", text);
  console.log("Generated vector:", vector);

  // Insert message with vector
  const messageId = await ctx.db.insert("messages", {
    text,
    sender,
    timestamp: Date.now(),
    likes: 0,
    textVector: vector,
  });

  return messageId;
});

export const toggleLike = mutation(async (ctx, { id }: { id: Id<"messages"> }) => {
  const message = await ctx.db.get(id);
  if (!message) return;

  const currentLikes = message.likes ?? 0;
  await ctx.db.patch(id, { likes: currentLikes + 1 });
});

// Add a helper query for checking messages
export const getMessagesStatus = query(async (ctx) => {
  const messages = await ctx.db.query("messages").collect();
  return {
    messages,
    total: messages.length,
    withVectors: messages.filter((m) => m.textVector).length,
  };
});

// Fix the search function
export const searchMessages = action({
  args: {
    query: v.string(),
  },
  returns: v.array(v.id("messages")),
  handler: async (ctx, { query }) => {
    try {
      const results: Doc<"messages">[] = await ctx.runQuery(api.messages.searchExact, { query });
      return results.map((r) => r._id);
    } catch (error) {
      console.error("Search error:", error);
      return [];
    }
  },
});

export const searchExact = query({
  args: {
    query: v.string(),
  },
  returns: v.array(
    v.object({
      _id: v.id("messages"),
      _creationTime: v.number(),
      text: v.string(),
      sender: v.string(),
      timestamp: v.number(),
      likes: v.optional(v.number()),
      textVector: v.optional(v.array(v.number())),
      isComplete: v.optional(v.boolean()),
    })
  ),
  handler: async (ctx, { query }) => {
    return await ctx.db
      .query("messages")
      .withSearchIndex("search_text", (q) => q.search("text", query))
      .take(5);
  },
});

// Add backfill function
export const backfillVectors = mutation(async (ctx) => {
  // Get all messages without vectors
  const messages = await ctx.db
    .query("messages")
    .filter((q) => q.eq(q.field("textVector"), undefined))
    .collect();

  // Add vectors to each message
  for (const message of messages) {
    const vector = textToVector(message.text);
    await ctx.db.patch(message._id, { textVector: vector });
  }

  return messages.length;
});

// Add a query to check vector status
export const checkVectors = query(async (ctx) => {
  const messages = await ctx.db.query("messages").collect();
  return {
    total: messages.length,
    withVectors: messages.filter((m) => m.textVector).length,
    withoutVectors: messages.filter((m) => !m.textVector).length,
  };
});

export const deleteAllMessages = mutation(async (ctx) => {
  const messages = await ctx.db.query("messages").collect();
  for (const message of messages) {
    await ctx.db.delete(message._id);
  }
  return messages.length;
});

export const deleteMessage = mutation(async (ctx, { id }: { id: Id<"messages"> }) => {
  await ctx.db.delete(id);
});

export const patchMessage = mutation({
  args: {
    id: v.id("messages"),
    patch: v.object({
      text: v.optional(v.string()),
      textVector: v.optional(v.array(v.number())),
      isComplete: v.optional(v.boolean()),
    }),
  },
  returns: v.null(),
  handler: async (ctx, { id, patch }) => {
    await ctx.db.patch(id, patch);
    return null;
  },
});

// Added askAI action for Streaming Chat Completions With HTTP Actions
export const askAI = mutation({
  args: { prompt: v.string() },
  returns: v.id("messages"),
  handler: async (ctx, { prompt }) => {
    // Create a placeholder message
    const messageId = await ctx.db.insert("messages", {
      text: "",
      sender: "AI",
      timestamp: Date.now(),
      likes: 0,
      textVector: [],
      isComplete: false,
    });

    // Schedule streaming in the background
    await ctx.scheduler.runAfter(0, api.messages.streamResponse, {
      messageId,
      prompt,
    });

    return messageId;
  },
});

export const streamResponse = action({
  args: {
    messageId: v.id("messages"),
    prompt: v.string(),
  },
  returns: v.null(),
  handler: async (ctx: ActionCtx, args) => {
    const { messageId, prompt } = args;
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.OPENAI_API_KEY,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          stream: true,
        }),
      });

      if (!response.ok) throw new Error("OpenAI API request failed: " + response.statusText);

      if (!response.body) throw new Error("Response body is null");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let text = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the chunk and update the message
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const json = JSON.parse(data);
              const content = json.choices[0]?.delta?.content;
              if (content) {
                text += content;
                // Update using patchMessage mutation
                await ctx.runMutation(api.messages.patchMessage, {
                  id: messageId,
                  patch: { text, textVector: textToVector(text) },
                });
              }
            } catch (e) {
              console.error("Error parsing JSON:", e);
            }
          }
        }
      }

      // Mark the message as complete
      await ctx.runMutation(api.messages.patchMessage, {
        id: messageId,
        patch: { isComplete: true },
      });
    } catch (error) {
      console.error("OpenAI API Error:", error);
      let errorMessage = "Error: Failed to get AI response";

      if (error instanceof Error) {
        if (error.message.includes("401")) {
          errorMessage =
            "Error: Invalid or missing OpenAI API key. Please check your environment variables.";
        } else if (error.message.includes("429")) {
          errorMessage = "Error: OpenAI API rate limit exceeded. Please try again later.";
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }

      await ctx.runMutation(api.messages.patchMessage, {
        id: messageId,
        patch: { text: errorMessage, isComplete: true },
      });
    }
    return null;
  },
});

export const sendMessage = mutation({
  args: {
    text: v.string(),
    sender: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if message is a reminder
    if (args.text.toLowerCase().startsWith("remind me")) {
      const reminderText = args.text.slice("remind me".length).trim();
      // Create todo
      await ctx.db.insert("todos", {
        text: reminderText,
        completed: false,
        upvotes: 0,
        downvotes: 0,
      });
    }

    // Still save the original message
    await ctx.db.insert("messages", {
      text: args.text,
      sender: args.sender,
      timestamp: Date.now(),
      likes: 0,
      textVector: textToVector(args.text),
    });
  },
});
