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

export const get = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("messages"),
      _creationTime: v.number(),
      content: v.string(),
      text: v.string(),
      userId: v.optional(v.string()),
      username: v.string(),
      sender: v.optional(v.string()),
      isAi: v.optional(v.boolean()),
      threadId: v.optional(v.string()),
      timestamp: v.number(),
      likes: v.optional(v.number()),
      isComplete: v.optional(v.boolean()),
      textVector: v.optional(v.array(v.number())),
    })
  ),
  handler: async (ctx) => await ctx.db.query("messages").order("asc").collect(),
});

export const send = mutation({
  args: {
    content: v.string(),
    userId: v.string(),
    username: v.string(),
    threadId: v.optional(v.string()),
    isAi: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const vector = textToVector(args.content);
    await ctx.db.insert("messages", {
      content: args.content,
      text: args.content, // For backward compatibility
      userId: args.userId,
      username: args.username,
      sender: args.username, // For backward compatibility
      isAi: args.isAi,
      threadId: args.threadId,
      timestamp: Date.now(),
      likes: 0,
      isComplete: true,
      textVector: vector,
    });
  },
});

export const toggleLike = mutation({
  args: {
    id: v.id("messages"),
  },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    const message = await ctx.db.get(id);
    if (!message) return null;

    const currentLikes = message.likes ?? 0;
    await ctx.db.patch(id, { likes: currentLikes + 1 });
    return null;
  },
});

export const getMessagesStatus = query({
  args: {},
  returns: v.object({
    messages: v.array(
      v.object({
        _id: v.id("messages"),
        _creationTime: v.number(),
        text: v.string(),
        content: v.optional(v.string()),
        sender: v.optional(v.string()),
        timestamp: v.optional(v.number()),
        likes: v.optional(v.number()),
        textVector: v.optional(v.array(v.number())),
        isComplete: v.optional(v.boolean()),
      })
    ),
    total: v.number(),
    withVectors: v.number(),
  }),
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").collect();
    return {
      messages,
      total: messages.length,
      withVectors: messages.filter((m) => m.textVector).length,
    };
  },
});

export const searchMessages = action({
  args: {
    query: v.string(),
    pageId: v.id("pages"),
  },
  returns: v.array(v.id("pageMessages")),
  handler: async (ctx: ActionCtx, { query, pageId }): Promise<Id<"pageMessages">[]> => {
    try {
      const results = await ctx.runQuery(api.pageMessages.getMessages, { pageId });
      return results
        .filter((m) => m.text.toLowerCase().includes(query.toLowerCase()))
        .map((r) => r._id);
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
      content: v.optional(v.string()),
      sender: v.optional(v.string()),
      timestamp: v.optional(v.number()),
      likes: v.optional(v.number()),
      textVector: v.optional(v.array(v.number())),
      isComplete: v.optional(v.boolean()),
    })
  ),
  handler: async (ctx, { query }) =>
    await ctx.db
      .query("messages")
      .withSearchIndex("search_text", (q) => q.search("text", query))
      .take(5),
});

export const backfillVectors = mutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("textVector"), undefined))
      .collect();

    for (const message of messages) {
      if (message.text) {
        const vector = textToVector(message.text);
        await ctx.db.patch(message._id, { textVector: vector });
      }
    }

    return messages.length;
  },
});

export const checkVectors = query({
  args: {},
  returns: v.object({
    total: v.number(),
    withVectors: v.number(),
    withoutVectors: v.number(),
  }),
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").collect();
    return {
      total: messages.length,
      withVectors: messages.filter((m) => m.textVector).length,
      withoutVectors: messages.filter((m) => !m.textVector).length,
    };
  },
});

export const deleteAllMessages = mutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").collect();
    for (const message of messages) await ctx.db.delete(message._id);

    return messages.length;
  },
});

export const deleteMessage = mutation({
  args: {
    id: v.id("messages"),
  },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return null;
  },
});

export const patchMessage = mutation({
  args: {
    id: v.id("messages"),
    patch: v.object({
      text: v.optional(v.string()),
      content: v.optional(v.string()),
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

export const list = query({
  args: {
    threadId: v.optional(v.string()),
  },
  returns: v.array(
    v.object({
      _id: v.id("messages"),
      _creationTime: v.number(),
      content: v.string(),
      text: v.string(),
      userId: v.optional(v.string()),
      username: v.string(),
      sender: v.optional(v.string()),
      isAi: v.optional(v.boolean()),
      threadId: v.optional(v.string()),
      timestamp: v.number(),
      likes: v.optional(v.number()),
      isComplete: v.optional(v.boolean()),
      textVector: v.optional(v.array(v.number())),
    })
  ),
  handler: async (ctx, args) => {
    if (args.threadId)
      return await ctx.db
        .query("messages")
        .withIndex("by_threadId", (q) => q.eq("threadId", args.threadId))
        .order("desc")
        .take(50);

    return await ctx.db.query("messages").order("desc").take(50);
  },
});
