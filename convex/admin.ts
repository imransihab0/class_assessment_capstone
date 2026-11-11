import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getPlatformStats = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const studentProfiles = await ctx.db.query("studentProfiles").collect();
    const projects = await ctx.db.query("projects").collect();
    const applications = await ctx.db.query("applications").collect();
    const reviews = await ctx.db.query("reviews").collect();

    const studentsCount = users.filter((u) => u.role === "student").length;
    const clientsCount = users.filter((u) => u.role === "client").length;

    const openProjects = projects.filter((p) => p.status === "open").length;
    const inProgressProjects = projects.filter((p) => p.status === "in-progress").length;
    const completedProjects = projects.filter((p) => p.status === "completed").length;

    const totalVolume = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
    const averageRating =
      reviews.length > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
        : 5.0;

    // Categories breakdown
    const categoryCounts: Record<string, number> = {};
    for (const p of projects) {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    }

    // Skills demand frequency
    const skillCounts: Record<string, number> = {};
    for (const p of projects) {
      for (const s of p.requiredSkills) {
        skillCounts[s] = (skillCounts[s] || 0) + 1;
      }
    }

    const topSkills = Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return {
      totalUsers: users.length,
      studentsCount,
      clientsCount,
      totalProjects: projects.length,
      openProjects,
      inProgressProjects,
      completedProjects,
      totalApplications: applications.length,
      totalReviews: reviews.length,
      totalVolume,
      averageRating,
      categoryCounts,
      topSkills,
    };
  },
});

export const getAdminOverview = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const projects = await ctx.db.query("projects").collect();
    const applications = await ctx.db.query("applications").collect();

    // Enrich recent applications with project & student
    const recentApplications = [];
    for (const app of applications.slice(-10).reverse()) {
      const project = await ctx.db.get(app.projectId);
      recentApplications.push({
        ...app,
        projectTitle: project?.title || "Unknown Project",
      });
    }

    return {
      users: users.sort((a, b) => b.createdAt - a.createdAt),
      projects: projects.sort((a, b) => b.createdAt - a.createdAt),
      recentApplications,
    };
  },
});

export const deleteProjectByAdmin = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    // Cascade delete all applications for this project
    const apps = await ctx.db
      .query("applications")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();
    for (const a of apps) {
      await ctx.db.delete(a._id);
    }

    // Cascade delete all reviews for this project
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();
    for (const r of reviews) {
      await ctx.db.delete(r._id);
    }

    await ctx.db.delete(args.projectId);
    return true;
  },
});
