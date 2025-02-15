import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getNotes = query({
  args: { pageId: v.id("pages") },
  handler: async (ctx, { pageId }) => {
    const notes = await ctx.db
      .query("pageNotes")
      .withIndex("by_page", (q) => q.eq("pageId", pageId))
      .order("desc")
      .collect();
    return notes;
  },
});

export const createNote = mutation({
  args: { pageId: v.id("pages"), title: v.string(), content: v.string() },
  handler: async (ctx, { pageId, title, content }) => {
    const timestamp = Date.now();
    return await ctx.db.insert("pageNotes", {
      pageId,
      title,
      content,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const updateNote = mutation({
  args: { id: v.id("pageNotes"), title: v.string(), content: v.string() },
  handler: async (ctx, { id, title, content }) => {
    const timestamp = Date.now();
    await ctx.db.patch(id, {
      title,
      content,
      updatedAt: timestamp,
    });
  },
});

export const deleteNote = mutation({
  args: { id: v.id("pageNotes") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const deleteAllNotes = mutation({
  args: { pageId: v.id("pages") },
  handler: async (ctx, { pageId }) => {
    const notes = await ctx.db
      .query("pageNotes")
      .withIndex("by_page", (q) => q.eq("pageId", pageId))
      .collect();

    for (const note of notes) {
      await ctx.db.delete(note._id);
    }
  },
});

export const getAllNotes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("pageNotes").collect();
  },
});
