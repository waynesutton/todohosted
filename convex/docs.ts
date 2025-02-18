import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getPageDocs = query({
  args: {
    pageId: v.id("pages"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pageDocs")
      .withIndex("by_page", (q) => q.eq("pageId", args.pageId))
      .collect();
  },
});

export const createDoc = mutation({
  args: {
    pageId: v.id("pages"),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("pageDocs", {
      pageId: args.pageId,
      title: args.title,
      content: args.content,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateDoc = mutation({
  args: {
    id: v.id("pageDocs"),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      title: args.title,
      content: args.content,
      updatedAt: Date.now(),
    });
  },
});

export const deleteDoc = mutation({
  args: {
    id: v.id("pageDocs"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const deleteAllPageDocs = mutation({
  args: {
    pageId: v.id("pages"),
  },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("pageDocs")
      .withIndex("by_page", (q) => q.eq("pageId", args.pageId))
      .collect();

    for (const doc of docs) await ctx.db.delete(doc._id);
  },
});
