import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const get = query(async (ctx) => {
  return await ctx.db.query("messages").order("asc").collect();
});

export const send = mutation(async (ctx, { text, sender }: { text: string; sender: string }) => {
  await ctx.db.insert("messages", {
    text,
    sender,
    timestamp: Date.now(),
    likes: 0,
  });
});

export const toggleLike = mutation(async (ctx, { id }: { id: Id<"messages"> }) => {
  const message = await ctx.db.get(id);
  if (!message) return;

  const currentLikes = message.likes ?? 0;
  await ctx.db.patch(id, { likes: currentLikes + 1 });
});
