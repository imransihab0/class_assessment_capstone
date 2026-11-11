import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Feature 1: User Accounts & Roles
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.optional(v.string()), // Added for role-based authentication
    role: v.union(v.literal("student"), v.literal("client"), v.literal("admin")),
    avatar: v.optional(v.string()),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    isActive: v.boolean(),
    isPlusMember: v.optional(v.boolean()),
    plusTier: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  // Feature 2: Student Skill Profile
  studentProfiles: defineTable({
    userId: v.id("users"),
    fullName: v.string(),
    university: v.string(),
    department: v.string(),
    studentId: v.string(),
    yearOfStudy: v.string(),
    skills: v.array(v.string()),
    experienceLevel: v.string(), // "Entry Level", "Intermediate", "Expert"
    hourlyRate: v.number(),
    availability: v.string(), // "Available for Work", "Part-Time", "Busy"
    bio: v.string(),
    githubUrl: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    portfolioWebsite: v.optional(v.string()),
    completedProjectsCount: v.number(),
    averageRating: v.number(),
    totalReviewsCount: v.number(),
    isVerified: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_experienceLevel", ["experienceLevel"]),

  // Advanced Feature 2: Student Portfolio Management
  portfolios: defineTable({
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
    createdAt: v.number(),
  }).index("by_studentId", ["studentId"]),

  // Feature 3, 4, 5: Projects / Job Requests
  projects: defineTable({
    clientId: v.id("users"),
    clientName: v.string(),
    clientCompany: v.optional(v.string()),
    clientAvatar: v.optional(v.string()),
    title: v.string(),
    description: v.string(),
    category: v.string(), // "Web Development", "UI/UX Design", "Graphic Design", "Mobile App", "Content Writing", "Programming & AI"
    requiredSkills: v.array(v.string()),
    experienceLevel: v.string(), // "Entry Level", "Intermediate", "Expert", "Any"
    projectType: v.string(), // "Fixed Price", "Hourly"
    budget: v.number(),
    location: v.string(), // e.g. "Remote", "Dhaka, Bangladesh", "United States", "Germany"
    deadline: v.string(),
    proposalsCount: v.number(),
    status: v.string(), // "open", "in-progress", "completed", "cancelled"
    isPlusExclusive: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index("by_clientId", ["clientId"])
    .index("by_category", ["category"])
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  // Feature 6, 7 & Advanced 3: Applications & Proposals
  applications: defineTable({
    projectId: v.id("projects"),
    studentId: v.id("users"),
    studentName: v.string(),
    studentEmail: v.string(),
    studentAvatar: v.optional(v.string()),
    studentDepartment: v.optional(v.string()),
    coverLetter: v.string(),
    proposedRate: v.number(),
    estimatedTimelineDays: v.number(),
    status: v.string(), // "pending", "shortlisted", "accepted", "rejected", "completed"
    clientFeedback: v.optional(v.string()),
    isPlusApplication: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_projectId", ["projectId"])
    .index("by_studentId", ["studentId"])
    .index("by_status", ["status"]),

  // Advanced Feature 4: Rating and Review System
  reviews: defineTable({
    projectId: v.id("projects"),
    projectTitle: v.string(),
    fromUserId: v.id("users"),
    toUserId: v.id("users"),
    fromName: v.string(),
    toName: v.string(),
    fromRole: v.string(), // "client" or "student"
    rating: v.number(), // 1 to 5
    comment: v.string(),
    createdAt: v.number(),
  })
    .index("by_toUserId", ["toUserId"])
    .index("by_projectId", ["projectId"]),

  // Realtime System Notifications
  notifications: defineTable({
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    type: v.string(), // "application", "status_change", "review", "system"
    read: v.boolean(),
    link: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
});
