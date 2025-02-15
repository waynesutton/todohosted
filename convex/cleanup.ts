import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const clearAllData = internalMutation({
  args: {},
  returns: v.object({
    pageTodosDeleted: v.number(),
    messagesDeleted: v.number(),
    pageMessagesDeleted: v.number(),
  }),
  handler: async (ctx) => {
    // Delete all page todos
    const pageTodos = await ctx.db.query("pageTodos").collect();
    await Promise.all(pageTodos.map((todo) => ctx.db.delete(todo._id)));

  // Delete all messages
  const messages = await ctx.db.query("messages").collect();
  await Promise.all(messages.map((message) => ctx.db.delete(message._id)));

    // Delete all page messages
    const pageMessages = await ctx.db.query("pageMessages").collect();
    await Promise.all(pageMessages.map((message) => ctx.db.delete(message._id)));

  console.log("Daily cleanup completed:", {
      pageTodosDeleted: pageTodos.length,
    messagesDeleted: messages.length,
      pageMessagesDeleted: pageMessages.length,
    });

    return {
      pageTodosDeleted: pageTodos.length,
      messagesDeleted: messages.length,
      pageMessagesDeleted: pageMessages.length,
    };
  },
});
