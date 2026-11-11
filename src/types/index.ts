import { Id } from "../../convex/_generated/dataModel";

export type UserRole = "student" | "client" | "admin";

export interface User {
  _id: Id<"users">;
  _creationTime: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  location?: string;
  isActive: boolean;
  isPlusMember?: boolean;
  plusTier?: string;
  createdAt: number;
}

export interface StudentProfile {
  _id: Id<"studentProfiles">;
  _creationTime: number;
  userId: Id<"users">;
  fullName: string;
  university: string;
  department: string;
  studentId: string;
  yearOfStudy: string;
  skills: string[];
  experienceLevel: string; // "Entry Level" | "Intermediate" | "Expert"
  hourlyRate: number;
  availability: string;
  bio: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioWebsite?: string;
  completedProjectsCount: number;
  averageRating: number;
  totalReviewsCount: number;
  isVerified: boolean;
  createdAt: number;
}

export interface PortfolioItem {
  _id: Id<"portfolios">;
  _creationTime: number;
  studentId: Id<"users">;
  title: string;
  description: string;
  category: string;
  projectUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  skills: string[];
  completedDate: string;
  featured: boolean;
  createdAt: number;
}

export interface Project {
  _id: Id<"projects">;
  _creationTime: number;
  clientId: Id<"users">;
  clientName: string;
  clientCompany?: string;
  clientAvatar?: string;
  title: string;
  description: string;
  category: string;
  requiredSkills: string[];
  experienceLevel: string;
  projectType: string; // "Fixed Price" | "Hourly"
  budget: number;
  location: string;
  deadline: string;
  proposalsCount: number;
  status: string; // "open" | "in-progress" | "completed" | "cancelled"
  isPlusExclusive?: boolean;
  createdAt: number;
  client?: User;
}

export interface Application {
  _id: Id<"applications">;
  _creationTime: number;
  projectId: Id<"projects">;
  studentId: Id<"users">;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  studentDepartment?: string;
  coverLetter: string;
  proposedRate: number;
  estimatedTimelineDays: number;
  status: "pending" | "shortlisted" | "accepted" | "rejected" | "completed";
  clientFeedback?: string;
  isPlusApplication?: boolean;
  createdAt: number;
  updatedAt: number;
  project?: Project;
}

export interface Review {
  _id: Id<"reviews">;
  _creationTime: number;
  projectId: Id<"projects">;
  projectTitle: string;
  fromUserId: Id<"users">;
  toUserId: Id<"users">;
  fromName: string;
  toName: string;
  fromRole: "client" | "student";
  rating: number;
  comment: string;
  createdAt: number;
}

export interface NotificationItem {
  _id: Id<"notifications">;
  _creationTime: number;
  userId: Id<"users">;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link?: string;
  createdAt: number;
}

export interface FilterState {
  search: string;
  location: string;
  category: string;
  experienceLevel: string;
  projectType: string;
  priceRange: string;
  minBudget?: number;
  maxBudget?: number;
  minProposals?: number;
  maxProposals?: number;
  sortBy: string;
}
