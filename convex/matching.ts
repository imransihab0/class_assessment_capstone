import { v } from "convex/values";
import { query } from "./_generated/server";

// Advanced Feature 1 (5 marks): Skill-based project recommendations for a student
export const getRecommendedProjectsForStudent = query({
  args: { studentUserId: v.id("users") },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("studentProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.studentUserId))
      .first();

    if (!profile || !profile.skills || profile.skills.length === 0) {
      return [];
    }

    const studentSkillsLower = profile.skills.map((s) => s.toLowerCase().trim());
    const openProjects = await ctx.db
      .query("projects")
      .withIndex("by_status", (q) => q.eq("status", "open"))
      .collect();

    const scoredProjects = openProjects.map((project) => {
      const requiredLower = project.requiredSkills.map((s) => s.toLowerCase().trim());
      
      const matched = project.requiredSkills.filter((origSkill) =>
        studentSkillsLower.includes(origSkill.toLowerCase().trim())
      );
      const missing = project.requiredSkills.filter(
        (origSkill) => !studentSkillsLower.includes(origSkill.toLowerCase().trim())
      );

      const skillRatio = requiredLower.length > 0 ? matched.length / requiredLower.length : 0;
      let score = skillRatio * 70; // 70% weight on skill overlap

      // Experience level alignment (30% weight)
      if (project.experienceLevel === "Any" || project.experienceLevel === profile.experienceLevel) {
        score += 30;
      } else if (profile.experienceLevel === "Expert" && project.experienceLevel !== "Expert") {
        score += 25;
      } else if (profile.experienceLevel === "Intermediate" && project.experienceLevel === "Entry Level") {
        score += 25;
      } else {
        score += 10;
      }

      const matchScore = Math.min(100, Math.round(score));

      return {
        ...project,
        matchScore,
        matchedSkills: matched,
        missingSkills: missing,
      };
    });

    // Only return projects that have at least 1 matching skill or >= 30% score
    const filtered = scoredProjects.filter((p) => p.matchedSkills.length > 0 || p.matchScore >= 40);

    // Sort by match score descending
    filtered.sort((a, b) => b.matchScore - a.matchScore);

    return filtered;
  },
});

// Bonus Challenge (5 marks): Develop a matching mechanism that recommends students based on the skills required by a project
export const getRecommendedStudentsForProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) return [];

    const projectSkillsLower = project.requiredSkills.map((s) => s.toLowerCase().trim());
    const profiles = await ctx.db.query("studentProfiles").collect();

    const scoredCandidates = [];

    for (const profile of profiles) {
      const user = await ctx.db.get(profile.userId);
      if (!user || !user.isActive) continue;

      const studentSkillsLower = profile.skills.map((s) => s.toLowerCase().trim());

      const matchedSkills = project.requiredSkills.filter((s) =>
        studentSkillsLower.includes(s.toLowerCase().trim())
      );

      const missingSkills = project.requiredSkills.filter(
        (s) => !studentSkillsLower.includes(s.toLowerCase().trim())
      );

      // 1. Skill Overlap Score (50% max)
      const skillScore = projectSkillsLower.length > 0
        ? (matchedSkills.length / projectSkillsLower.length) * 50
        : 25;

      // 2. Rating & Reliability Score (25% max)
      const ratingScore = ((profile.averageRating || 5.0) / 5.0) * 25;

      // 3. Experience Level Alignment (15% max)
      let expScore = 5;
      if (project.experienceLevel === "Any" || project.experienceLevel === profile.experienceLevel) {
        expScore = 15;
      } else if (profile.experienceLevel === "Expert") {
        expScore = 15;
      } else if (profile.experienceLevel === "Intermediate" && project.experienceLevel === "Entry Level") {
        expScore = 12;
      }

      // 4. Portfolio Relevance Factor (10% max)
      const portfolios = await ctx.db
        .query("portfolios")
        .withIndex("by_studentId", (q) => q.eq("studentId", profile.userId))
        .collect();

      const hasRelevantPortfolio = portfolios.some(
        (pf) =>
          pf.category.toLowerCase() === project.category.toLowerCase() ||
          pf.skills.some((ps) => projectSkillsLower.includes(ps.toLowerCase().trim()))
      );

      const portfolioScore = hasRelevantPortfolio ? 10 : 3;

      const totalScore = Math.min(100, Math.round(skillScore + ratingScore + expScore + portfolioScore));

      // Check if student has already applied
      const existingApplication = await ctx.db
        .query("applications")
        .withIndex("by_projectId", (q) => q.eq("projectId", project._id))
        .filter((q) => q.eq(q.field("studentId"), profile.userId))
        .first();

      scoredCandidates.push({
        profile,
        user,
        portfolios,
        matchScore: totalScore,
        matchedSkills,
        missingSkills,
        hasApplied: !!existingApplication,
        applicationStatus: existingApplication?.status || null,
        breakdown: {
          skillScore: Math.round(skillScore),
          ratingScore: Math.round(ratingScore),
          expScore,
          portfolioScore,
        },
      });
    }

    // Sort by match score descending
    scoredCandidates.sort((a, b) => b.matchScore - a.matchScore);

    return scoredCandidates;
  },
});
