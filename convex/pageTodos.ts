import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getTodos = query({
  args: { pageId: v.id("pages") },
  handler: async (ctx, { pageId }) => {
    return await ctx.db
      .query("pageTodos")
      .filter((q) => q.eq(q.field("pageId"), pageId))
      .collect();
  },
});

export const add = mutation({
  args: {
    pageId: v.id("pages"),
    text: v.string(),
  },
  handler: async (ctx, { pageId, text }) => {
    const page = await ctx.db.get(pageId);
    if (!page) throw new Error("Page not found");
    if (!page.isActive) throw new Error("Page is not active");

    const todoId = await ctx.db.insert("pageTodos", {
      pageId,
      text,
      completed: false,
      upvotes: 0,
      downvotes: 0,
      timestamp: Date.now(),
    });

    return todoId;
  },
});

export const toggle = mutation({
  args: { id: v.id("pageTodos") },
  handler: async (ctx, { id }) => {
    const todo = await ctx.db.get(id);
    if (!todo) throw new Error("Todo not found");

    await ctx.db.patch(id, { completed: !todo.completed });
  },
});

export const remove = mutation({
  args: { id: v.id("pageTodos") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const upvote = mutation({
  args: { id: v.id("pageTodos") },
  handler: async (ctx, { id }) => {
    const todo = await ctx.db.get(id);
    if (!todo) throw new Error("Todo not found");

    await ctx.db.patch(id, { upvotes: (todo.upvotes ?? 0) + 1 });
    return (todo.upvotes ?? 0) + 1;
  },
});

export const downvote = mutation({
  args: { id: v.id("pageTodos") },
  handler: async (ctx, { id }) => {
    const todo = await ctx.db.get(id);
    if (!todo) throw new Error("Todo not found");

    await ctx.db.patch(id, { downvotes: (todo.downvotes ?? 0) + 1 });
    return (todo.downvotes ?? 0) + 1;
  },
});

export const deleteAllTodos = mutation({
  args: { pageId: v.id("pages") },
  handler: async (ctx, { pageId }) => {
    const todos = await ctx.db
      .query("pageTodos")
      .filter((q) => q.eq(q.field("pageId"), pageId))
      .collect();

    for (const todo of todos) {
      await ctx.db.delete(todo._id);
    }
  },
});
