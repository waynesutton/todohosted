import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const clearAllData = internalMutation({
  args: {},
  returns: v.object({
    pageTodosDeleted: v.number(),
    messagesDeleted: v.number(),
    pageMessagesDeleted: v.number(),
    pageNotesDeleted: v.number(),
    pageDocsDeleted: v.number(),
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

    // Delete all page notes
    const pageNotes = await ctx.db.query("pageNotes").collect();
    await Promise.all(pageNotes.map((note) => ctx.db.delete(note._id)));

    // Delete all page docs
    const pageDocs = await ctx.db.query("pageDocs").collect();
    await Promise.all(pageDocs.map((doc) => ctx.db.delete(doc._id)));

    // Send default system message to all pages
    const pages = await ctx.db.query("pages").collect();
    for (const page of pages) {
      await ctx.db.insert("pageMessages", {
        pageId: page._id,
        sender: "System",
        text: 'Start typing to chat, use "@ai" to ask OpenAI, type "remind me" to set a reminder, or type "note:" to create a new note.',
        timestamp: Date.now(),
      });
    }

    console.log("Cleanup completed:", {
      pageTodosDeleted: pageTodos.length,
      messagesDeleted: messages.length,
      pageMessagesDeleted: pageMessages.length,
      pageNotesDeleted: pageNotes.length,
      pageDocsDeleted: pageDocs.length,
    });

    return {
      pageTodosDeleted: pageTodos.length,
      messagesDeleted: messages.length,
      pageMessagesDeleted: pageMessages.length,
      pageNotesDeleted: pageNotes.length,
      pageDocsDeleted: pageDocs.length,
    };
  },
});
