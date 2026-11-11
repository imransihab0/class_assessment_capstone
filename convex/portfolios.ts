import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listPortfoliosByStudent = query({
  args: { studentId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("portfolios")
      .withIndex("by_studentId", (q) => q.eq("studentId", args.studentId))
      .collect();
  },
});

export const addPortfolio = mutation({
  args: {
    studentId: v.id("users"),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    projectUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    skills: v.array(v.string()),
    completedDate: v.string(),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("portfolios", {
      studentId: args.studentId,
      title: args.title,
      description: args.description,
      category: args.category,
      projectUrl: args.projectUrl,
      githubUrl: args.githubUrl,
      imageUrl: args.imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60",
      skills: args.skills,
      completedDate: args.completedDate,
      featured: args.featured,
      createdAt: Date.now(),
    });
  },
});

export const updatePortfolio = mutation({
  args: {
    portfolioId: v.id("portfolios"),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    projectUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    skills: v.array(v.string()),
    completedDate: v.string(),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.portfolioId, {
      title: args.title,
      description: args.description,
      category: args.category,
      projectUrl: args.projectUrl,
      githubUrl: args.githubUrl,
      imageUrl: args.imageUrl,
      skills: args.skills,
      completedDate: args.completedDate,
      featured: args.featured,
    });
    return true;
  },
});

export const deletePortfolio = mutation({
  args: { portfolioId: v.id("portfolios") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.portfolioId);
    return true;
  },
});
