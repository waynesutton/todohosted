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