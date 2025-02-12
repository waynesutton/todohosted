import { internalMutation } from "./_generated/server";

export const clearAllData = internalMutation(async (ctx) => {
  // Delete all todos
  const todos = await ctx.db.query("todos").collect();
  await Promise.all(todos.map((todo) => ctx.db.delete(todo._id)));

  // Delete all messages
  const messages = await ctx.db.query("messages").collect();
  await Promise.all(messages.map((message) => ctx.db.delete(message._id)));

  console.log("Daily cleanup completed:", {
    todosDeleted: todos.length,
    messagesDeleted: messages.length,
  });
}); 