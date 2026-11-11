import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listProjects = query({
  args: {
    search: v.optional(v.string()),
    category: v.optional(v.string()),
    experienceLevel: v.optional(v.string()),
    projectType: v.optional(v.string()),
    minBudget: v.optional(v.number()),
    maxBudget: v.optional(v.number()),
    minProposals: v.optional(v.number()),
    maxProposals: v.optional(v.number()),
    location: v.optional(v.string()),
    sortBy: v.optional(v.string()), // "newest", "budget_high", "budget_low", "proposals"
  },
  handler: async (ctx, args) => {
    let projects = await ctx.db.query("projects").collect();

    // Filter by status (only open or in-progress)
    projects = projects.filter((p) => p.status === "open" || p.status === "in-progress");

    // Search query filter (title, description, required skills, category)
    if (args.search && args.search.trim() !== "") {
      const q = args.search.toLowerCase().trim();
      projects = projects.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.requiredSkills.some((s) => s.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (args.category && args.category !== "All" && args.category !== "Any") {
      projects = projects.filter((p) => p.category === args.category);
    }

    // Experience Level filter
    if (args.experienceLevel && args.experienceLevel !== "Any") {
      projects = projects.filter(
        (p) => p.experienceLevel === args.experienceLevel || p.experienceLevel === "Any"
      );
    }

    // Project Type filter (Hourly vs Fixed Price)
    if (args.projectType && args.projectType !== "Any") {
      projects = projects.filter((p) => p.projectType === args.projectType);
    }

    // Budget range filter
    if (args.minBudget !== undefined) {
      projects = projects.filter((p) => p.budget >= args.minBudget!);
    }
    if (args.maxBudget !== undefined) {
      projects = projects.filter((p) => p.budget <= args.maxBudget!);
    }

    // Proposals range filter (Bug fix: proper min and max boundary checking)
    if (args.minProposals !== undefined) {
      projects = projects.filter((p) => p.proposalsCount >= args.minProposals!);
    }
    if (args.maxProposals !== undefined) {
      projects = projects.filter((p) => p.proposalsCount <= args.maxProposals!);
    }

    // Location filter
    if (args.location && args.location.trim() !== "" && args.location !== "Any") {
      const loc = args.location.toLowerCase();
      projects = projects.filter(
        (p) =>
          p.location.toLowerCase().includes(loc) ||
          (loc === "remote" && p.location.toLowerCase().includes("remote"))
      );
    }

    // Sorting
    if (args.sortBy === "budget_high") {
      projects.sort((a, b) => b.budget - a.budget);
    } else if (args.sortBy === "budget_low") {
      projects.sort((a, b) => a.budget - b.budget);
    } else if (args.sortBy === "proposals") {
      projects.sort((a, b) => a.proposalsCount - b.proposalsCount);
    } else {
      // Default: newest first
      projects.sort((a, b) => b.createdAt - a.createdAt);
    }

    return projects;
  },
});

export const getProjectById = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) return null;
    const client = await ctx.db.get(project.clientId);
    return {
      ...project,
      client,
    };
  },
});

export const createProject = mutation({
  args: {
    clientId: v.id("users"),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    requiredSkills: v.array(v.string()),
    experienceLevel: v.string(),
    projectType: v.string(),
    budget: v.number(),
    location: v.string(),
    deadline: v.string(),
    isPlusExclusive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const client = await ctx.db.get(args.clientId);
    const clientName = client?.name || "Client";
    const clientAvatar =
      client?.avatar ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(clientName)}`;

    const projectId = await ctx.db.insert("projects", {
      clientId: args.clientId,
      clientName: clientName,
      clientCompany: client?.bio || "Independent Recruiter",
      clientAvatar: clientAvatar,
      title: args.title,
      description: args.description,
      category: args.category,
      requiredSkills: args.requiredSkills,
      experienceLevel: args.experienceLevel,
      projectType: args.projectType,
      budget: args.budget,
      location: args.location || "Remote",
      deadline: args.deadline,
      proposalsCount: 0,
      status: "open",
      isPlusExclusive: args.isPlusExclusive || (args.budget >= 500),
      createdAt: Date.now(),
    });

    return projectId;
  },
});

export const updateProjectStatus = mutation({
  args: {
    projectId: v.id("projects"),
    status: v.string(), // "open", "in-progress", "completed", "cancelled"
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.projectId, { status: args.status });
    return true;
  },
});

export const listClientProjects = query({
  args: { clientId: v.id("users") },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_clientId", (q) => q.eq("clientId", args.clientId))
      .collect();

    // Attach applications count and list
    const result = [];
    for (const p of projects) {
      const apps = await ctx.db
        .query("applications")
        .withIndex("by_projectId", (q) => q.eq("projectId", p._id))
        .collect();
      result.push({
        ...p,
        applications: apps,
      });
    }
    return result;
  },
});
