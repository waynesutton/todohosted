import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  channels: defineTable({
    name: v.string(),
  }),

  users: defineTable({
    name: v.string(),
  }),

  messages: defineTable({
    content: v.string(),
    text: v.string(),
    userId: v.optional(v.string()),
    username: v.string(),
    sender: v.optional(v.string()),
    isAi: v.optional(v.boolean()),
    threadId: v.optional(v.string()),
    timestamp: v.number(),
    likes: v.optional(v.number()),
    isComplete: v.optional(v.boolean()),
    textVector: v.optional(v.array(v.number())),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_threadId", ["threadId"])
    .searchIndex("search_text", {
      searchField: "text",
      filterFields: ["sender"],
    }),

  pages: defineTable({
    slug: v.string(),
    title: v.string(),
    createdAt: v.number(),
    isActive: v.boolean(),
  }).index("by_slug", ["slug"]),

  pageMessages: defineTable({
    pageId: v.id("pages"),
    sender: v.string(),
    text: v.string(),
    likes: v.optional(v.number()),
    isComplete: v.optional(v.boolean()),
    timestamp: v.number(),
  }).index("by_page", ["pageId"]),

  pageTodos: defineTable({
    pageId: v.id("pages"),
    text: v.string(),
    completed: v.boolean(),
    upvotes: v.optional(v.number()),
    downvotes: v.optional(v.number()),
    timestamp: v.number(),
  }).index("by_page", ["pageId"]),

  pageNotes: defineTable({
    pageId: v.id("pages"),
    title: v.string(),
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_page", ["pageId"]),
});
