import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query(async (ctx) => {
  return await ctx.db.query("messages").order("asc").collect();
});

export const send = mutation(async (ctx, { text, sender }: { text: string; sender: string }) => {
  await ctx.db.insert("messages", {
    text,
    sender,
    timestamp: Date.now(),
  });
});
