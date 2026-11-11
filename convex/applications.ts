import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const applyForProject = mutation({
  args: {
    projectId: v.id("projects"),
    studentId: v.id("users"),
    coverLetter: v.string(),
    proposedRate: v.number(),
    estimatedTimelineDays: v.number(),
  },
  handler: async (ctx, args) => {
    // Check for existing application
    const existing = await ctx.db
      .query("applications")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .filter((q) => q.eq(q.field("studentId"), args.studentId))
      .first();

    if (existing) {
      throw new Error("You have already submitted an application for this project.");
    }

    const student = await ctx.db.get(args.studentId);
    if (!student) {
      throw new Error("Student record not found.");
    }

    const profile = await ctx.db
      .query("studentProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.studentId))
      .first();

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found.");
    }

    const appId = await ctx.db.insert("applications", {
      projectId: args.projectId,
      studentId: args.studentId,
      studentName: student.name,
      studentEmail: student.email,
      studentAvatar: student.avatar,
      studentDepartment: profile?.department || "Software Engineering",
      coverLetter: args.coverLetter,
      proposedRate: args.proposedRate,
      estimatedTimelineDays: args.estimatedTimelineDays,
      status: "pending",
      isPlusApplication: Boolean(student.isPlusMember),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Increment proposals count on project
    await ctx.db.patch(args.projectId, {
      proposalsCount: (project.proposalsCount || 0) + 1,
    });

    // Notify the client
    await ctx.db.insert("notifications", {
      userId: project.clientId,
      title: student.isPlusMember ? "⭐ Priority Plus Proposal Received" : "New Proposal Received",
      message: `${student.name} ${student.isPlusMember ? "(Plus Member)" : ""} applied for "${project.title}" with a bid of $${args.proposedRate}`,
      type: "application",
      read: false,
      link: `/projects/${args.projectId}`,
      createdAt: Date.now(),
    });

    return appId;
  },
});

export const checkIfApplied = query({
  args: {
    projectId: v.id("projects"),
    studentId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    if (!args.studentId) return null;
    return await ctx.db
      .query("applications")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .filter((q) => q.eq(q.field("studentId"), args.studentId))
      .first();
  },
});

export const getStudentApplications = query({
  args: { studentId: v.id("users") },
  handler: async (ctx, args) => {
    const apps = await ctx.db
      .query("applications")
      .withIndex("by_studentId", (q) => q.eq("studentId", args.studentId))
      .collect();

    const enriched = [];
    for (const app of apps) {
      const project = await ctx.db.get(app.projectId);
      enriched.push({
        ...app,
        project,
      });
    }

    // Sort by latest
    enriched.sort((a, b) => b.createdAt - a.createdAt);
    return enriched;
  },
});

export const getProjectApplications = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const apps = await ctx.db
      .query("applications")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();

    const enriched = [];
    for (const app of apps) {
      const profile = await ctx.db
        .query("studentProfiles")
        .withIndex("by_userId", (q) => q.eq("userId", app.studentId))
        .first();

      const user = await ctx.db.get(app.studentId);

      enriched.push({
        ...app,
        profile,
        user,
      });
    }

    // Plus priority proposals appear first, then newest
    enriched.sort((a, b) => {
      const aPlus = Boolean(a.isPlusApplication || a.user?.isPlusMember);
      const bPlus = Boolean(b.isPlusApplication || b.user?.isPlusMember);
      if (aPlus && !bPlus) return -1;
      if (!aPlus && bPlus) return 1;
      return b.createdAt - a.createdAt;
    });

    return enriched;
  },
});

export const updateApplicationStatus = mutation({
  args: {
    applicationId: v.id("applications"),
    status: v.string(), // "shortlisted", "accepted", "rejected", "completed"
    clientFeedback: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const app = await ctx.db.get(args.applicationId);
    if (!app) throw new Error("Application not found");

    const project = await ctx.db.get(app.projectId);

    await ctx.db.patch(args.applicationId, {
      status: args.status,
      clientFeedback: args.clientFeedback,
      updatedAt: Date.now(),
    });

    // If accepted/hired, update project status to in-progress
    if (args.status === "accepted" && project) {
      await ctx.db.patch(project._id, { status: "in-progress" });
    }

    // If completed, update project status to completed
    if (args.status === "completed" && project) {
      await ctx.db.patch(project._id, { status: "completed" });
    }

    // Notify the student
    await ctx.db.insert("notifications", {
      userId: app.studentId,
      title: `Application Status: ${args.status.toUpperCase()}`,
      message: `Your application for "${project?.title || "project"}" has been marked as ${args.status}.`,
      type: "status_change",
      read: false,
      link: `/proposals`,
      createdAt: Date.now(),
    });

    return true;
  },
});
