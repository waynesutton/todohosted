import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getMessages = query({
  args: { pageId: v.id("pages") },
  handler: async (ctx, { pageId }) => {
    return await ctx.db
      .query("pageMessages")
      .filter((q) => q.eq(q.field("pageId"), pageId))
      .collect();
  },
});

export const send = mutation({
  args: {
    pageId: v.id("pages"),
    text: v.string(),
    sender: v.string(),
  },
  handler: async (ctx, { pageId, text, sender }) => {
    const page = await ctx.db.get(pageId);
    if (!page) throw new Error("Page not found");
    if (!page.isActive) throw new Error("Page is not active");

    const messageId = await ctx.db.insert("pageMessages", {
      pageId,
      text,
      sender,
      timestamp: Date.now(),
    });

    return messageId;
  },
});

export const toggleLike = mutation({
  args: { id: v.id("pageMessages") },
  returns: v.number(),
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.id);
    if (!message) throw new Error("Message not found");

    const currentLikes = message.likes ?? 0;
    const newLikes = currentLikes + 1;

    await ctx.db.patch(args.id, { likes: newLikes });
    return newLikes;
  },
});

export const deleteMessage = mutation({
  args: { id: v.id("pageMessages") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const deleteAllMessages = mutation({
  args: { pageId: v.id("pages") },
  handler: async (ctx, { pageId }) => {
    const messages = await ctx.db
      .query("pageMessages")
      .filter((q) => q.eq(q.field("pageId"), pageId))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
  },
});

export const patchMessage = mutation({
  args: {
    id: v.id("pageMessages"),
    patch: v.object({
      text: v.optional(v.string()),
      isComplete: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, { id, patch }) => {
    await ctx.db.patch(id, patch);
  },
});
