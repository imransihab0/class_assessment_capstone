import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const submitReview = mutation({
  args: {
    projectId: v.id("projects"),
    fromUserId: v.id("users"),
    toUserId: v.id("users"),
    rating: v.number(), // 1 to 5
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");

    const fromUser = await ctx.db.get(args.fromUserId);
    const toUser = await ctx.db.get(args.toUserId);
    if (!fromUser || !toUser) throw new Error("User not found");

    const reviewId = await ctx.db.insert("reviews", {
      projectId: args.projectId,
      projectTitle: project.title,
      fromUserId: args.fromUserId,
      toUserId: args.toUserId,
      fromName: fromUser.name,
      toName: toUser.name,
      fromRole: fromUser.role === "client" ? "client" : "student",
      rating: Math.max(1, Math.min(5, args.rating)),
      comment: args.comment,
      createdAt: Date.now(),
    });

    // If review is given to a student, recalculate student's average rating
    const studentProfile = await ctx.db
      .query("studentProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.toUserId))
      .first();

    if (studentProfile) {
      const allReviews = await ctx.db
        .query("reviews")
        .withIndex("by_toUserId", (q) => q.eq("toUserId", args.toUserId))
        .collect();

      const totalRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0);
      const avg = Number((totalRating / allReviews.length).toFixed(1));

      await ctx.db.patch(studentProfile._id, {
        averageRating: avg,
        totalReviewsCount: allReviews.length,
        completedProjectsCount: (studentProfile.completedProjectsCount || 0) + 1,
      });
    }

    // Send notification
    await ctx.db.insert("notifications", {
      userId: args.toUserId,
      title: "New Review Received",
      message: `${fromUser.name} gave you a ${args.rating}-star review for "${project.title}"`,
      type: "review",
      read: false,
      createdAt: Date.now(),
    });

    return reviewId;
  },
});

export const getReviewsForUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_toUserId", (q) => q.eq("toUserId", args.userId))
      .collect();

    reviews.sort((a, b) => b.createdAt - a.createdAt);
    return reviews;
  },
});

export const getProjectReviews = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});
