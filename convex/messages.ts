import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

// Updated textToVector: Sum each character's code into one of 100 buckets, then normalize.
function textToVector(text: string): number[] {
  const vector = new Array(100).fill(0);
  const lower = text.toLowerCase();
  for (let i = 0; i < lower.length; i++) {
    vector[i % 100] += lower.charCodeAt(i);
  }
  // Normalize each bucket by an arbitrary factor (here 1000)
  return vector.map(val => val / 1000);
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
  handler: async (ctx, args) => {
    // Generate vector for search query
    const queryVector = textToVector(args.query);
    
    try {
      // Use vector search with proper index
      const results = await ctx.vectorSearch("messages", "by_text", {
        vector: queryVector,
        limit: 5,
      });

      return results.map((r) => r._id);
    } catch (error) {
      console.error("Vector search error:", error);
      return [];
    }
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
    withVectors: messages.filter(m => m.textVector).length,
    withoutVectors: messages.filter(m => !m.textVector).length,
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
