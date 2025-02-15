import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const get = query({
  args: {
    pageId: v.optional(v.id("pages")),
  },
  returns: v.array(
    v.object({
      _id: v.id("pageTodos"),
      _creationTime: v.number(),
      pageId: v.id("pages"),
      text: v.string(),
      completed: v.boolean(),
      upvotes: v.optional(v.number()),
      downvotes: v.optional(v.number()),
      timestamp: v.number(),
    })
  ),
  handler: async (ctx, { pageId }) => {
    if (!pageId) return [];
    return await ctx.db
      .query("pageTodos")
      .withIndex("by_page", (q) => q.eq("pageId", pageId))
      .collect();
  },
});

export const add = mutation({
  args: {
    pageId: v.id("pages"),
    text: v.string(),
  },
  returns: v.id("pageTodos"),
  handler: async (ctx, { pageId, text }) =>
    await ctx.db.insert("pageTodos", {
      pageId,
      text,
      completed: false,
      upvotes: 0,
      downvotes: 0,
      timestamp: Date.now(),
    }),
});

export const toggle = mutation({
  args: {
    id: v.id("pageTodos"),
  },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    const todo = await ctx.db.get(id);
    if (!todo) return null;
    await ctx.db.patch(id, { completed: !todo.completed });
    return null;
  },
});

export const remove = mutation({
  args: {
    id: v.id("pageTodos"),
  },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return null;
  },
});

export const upvote = mutation({
  args: {
    id: v.id("pageTodos"),
  },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    const todo = await ctx.db.get(id);
    if (!todo) return null;
    await ctx.db.patch(id, { upvotes: (todo.upvotes ?? 0) + 1 });
    return null;
  },
});

export const downvote = mutation({
  args: {
    id: v.id("pageTodos"),
  },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    const todo = await ctx.db.get(id);
    if (!todo) return null;
    await ctx.db.patch(id, { downvotes: (todo.downvotes ?? 0) + 1 });
    return null;
  },
});

export const deleteAllTodos = mutation({
  args: { pageId: v.id("pages") },
  handler: async (ctx, { pageId }) => {
    const todos = await ctx.db
      .query("pageTodos")
      .withIndex("by_page", (q) => q.eq("pageId", pageId))
      .collect();

    for (const todo of todos) await ctx.db.delete(todo._id);
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("pageTodos").collect();
  },
});
