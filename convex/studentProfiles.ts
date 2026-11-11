import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getProfileByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("studentProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const upsertProfile = mutation({
  args: {
    userId: v.id("users"),
    fullName: v.string(),
    university: v.string(),
    department: v.string(),
    studentId: v.string(),
    yearOfStudy: v.string(),
    skills: v.array(v.string()),
    experienceLevel: v.string(),
    hourlyRate: v.number(),
    availability: v.string(),
    bio: v.string(),
    githubUrl: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    portfolioWebsite: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("studentProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        fullName: args.fullName,
        university: args.university,
        department: args.department,
        studentId: args.studentId,
        yearOfStudy: args.yearOfStudy,
        skills: args.skills,
        experienceLevel: args.experienceLevel,
        hourlyRate: args.hourlyRate,
        availability: args.availability,
        bio: args.bio,
        githubUrl: args.githubUrl,
        linkedinUrl: args.linkedinUrl,
        portfolioWebsite: args.portfolioWebsite,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("studentProfiles", {
        userId: args.userId,
        fullName: args.fullName,
        university: args.university,
        department: args.department,
        studentId: args.studentId,
        yearOfStudy: args.yearOfStudy,
        skills: args.skills,
        experienceLevel: args.experienceLevel,
        hourlyRate: args.hourlyRate,
        availability: args.availability,
        bio: args.bio,
        githubUrl: args.githubUrl,
        linkedinUrl: args.linkedinUrl,
        portfolioWebsite: args.portfolioWebsite,
        completedProjectsCount: 0,
        averageRating: 5.0,
        totalReviewsCount: 0,
        isVerified: true,
        createdAt: Date.now(),
      });
    }
  },
});

export const listAllStudents = query({
  handler: async (ctx) => {
    const profiles = await ctx.db.query("studentProfiles").collect();
    const result = [];
    for (const p of profiles) {
      const user = await ctx.db.get(p.userId);
      const portfolios = await ctx.db
        .query("portfolios")
        .withIndex("by_studentId", (q) => q.eq("studentId", p.userId))
        .collect();
      result.push({
        ...p,
        user,
        portfolios,
      });
    }
    return result;
  },
});

export const getStudentDetails = query({
  args: { studentUserId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.studentUserId);
    const profile = await ctx.db
      .query("studentProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.studentUserId))
      .first();
    const portfolios = await ctx.db
      .query("portfolios")
      .withIndex("by_studentId", (q) => q.eq("studentId", args.studentUserId))
      .collect();
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_toUserId", (q) => q.eq("toUserId", args.studentUserId))
      .collect();

    return {
      user,
      profile,
      portfolios,
      reviews,
    };
  },
});
