import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const getPages = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("pages"),
      _creationTime: v.number(),
      slug: v.string(),
      title: v.string(),
      createdAt: v.number(),
      isActive: v.boolean(),
    })
  ),
  handler: async (ctx) => {
    return await ctx.db.query("pages").collect();
  },
});

export const getPageBySlug = query({
  args: { slug: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("pages"),
      _creationTime: v.number(),
      slug: v.string(),
      title: v.string(),
      createdAt: v.number(),
      isActive: v.boolean(),
    }),
    v.null()
  ),
  handler: async (ctx, { slug }) => {
    const pages = await ctx.db
      .query("pages")
      .filter((q) => q.eq(q.field("slug"), slug))
      .collect();
    return pages[0] ?? null;
  },
});

export const createPage = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
  },
  returns: v.id("pages"),
  handler: async (ctx, { slug, title }) => {
    // Check if slug already exists
    const existingPage = await ctx.db
      .query("pages")
      .filter((q) => q.eq(q.field("slug"), slug))
      .first();

    if (existingPage) throw new Error("Page with this URL already exists");

    const pageId = await ctx.db.insert("pages", {
      slug,
      title,
      createdAt: Date.now(),
      isActive: true,
    });

    return pageId;
  },
});

export const togglePageStatus = mutation({
  args: { id: v.id("pages") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    const page = await ctx.db.get(id);
    if (!page) throw new Error("Page not found");

    await ctx.db.patch(id, { isActive: !page.isActive });
    return null;
  },
});

export const deletePage = mutation({
  args: { id: v.id("pages") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    const page = await ctx.db.get(id);
    if (!page) throw new Error("Page not found");

    // Delete all messages and todos associated with this page
    const pageMessages = await ctx.db
      .query("pageMessages")
      .filter((q) => q.eq(q.field("pageId"), id))
      .collect();

    const pageTodos = await ctx.db
      .query("pageTodos")
      .filter((q) => q.eq(q.field("pageId"), id))
      .collect();

    // Delete messages
    for (const message of pageMessages) {
      await ctx.db.delete(message._id);
    }

    // Delete todos
    for (const todo of pageTodos) {
      await ctx.db.delete(todo._id);
    }

    // Finally, delete the page
    await ctx.db.delete(id);
    return null;
  },
});
