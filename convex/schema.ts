import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    text: v.string(),
    sender: v.string(),
    timestamp: v.number(),
    likes: v.optional(v.number()),
    textVector: v.optional(v.array(v.number())),
    isComplete: v.optional(v.boolean()),
  })
    .vectorIndex("by_text", {
      vectorField: "textVector",
      dimensions: 100, // Using smaller dimensions for basic text similarity
    })
    .searchIndex("search_text", {
      searchField: "text",
    }),
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
    upvotes: v.optional(v.number()),
    downvotes: v.optional(v.number()),
  }),
});
