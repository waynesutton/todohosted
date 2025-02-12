import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const get = query(async (ctx) => {
  return await ctx.db.query("todos").collect();
});

export const add = mutation(async (ctx, { text }: { text: string }) => {
  await ctx.db.insert("todos", {
    text,
    completed: false,
    upvotes: 0,
    downvotes: 0
  });
});

export const toggle = mutation(async (ctx, { id }: { id: Id<"todos"> }) => {
  const todo = await ctx.db.get(id);
  if (!todo) return;
  await ctx.db.patch(id, { completed: !todo.completed });
});

export const remove = mutation(async (ctx, { id }: { id: Id<"todos"> }) => {
  await ctx.db.delete(id);
});

export const upvote = mutation(async ({ db }, { id }: { id: Id<"todos"> }) => {
  const todo = await db.get(id);
  if (!todo) return;
  await db.patch(id, { upvotes: (todo.upvotes ?? 0) + 1 });
});

export const downvote = mutation(async ({ db }, { id }: { id: Id<"todos"> }) => {
  const todo = await db.get(id);
  if (!todo) return;
  await db.patch(id, { downvotes: (todo.downvotes ?? 0) + 1 });
});

export const deleteAllTodos = mutation(async (ctx) => {
  const todos = await ctx.db.query("todos").collect();
  for (const todo of todos) {
    await ctx.db.delete(todo._id);
  }
  return todos.length;
}); 