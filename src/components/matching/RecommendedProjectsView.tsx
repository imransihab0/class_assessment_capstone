import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "../../context/AuthContext";
import { ProjectCard } from "../projects/ProjectCard";
import { Project } from "../../types";
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "../common/Button";

interface RecommendedProjectsViewProps {
  onApply: (project: Project) => void;
  onViewDetails: (project: Project) => void;
  onNavigateToProfile: () => void;
}

export const RecommendedProjectsView: React.FC<RecommendedProjectsViewProps> = ({
  onApply,
  onViewDetails,
  onNavigateToProfile,
}) => {
  const { currentUser } = useAuth();

  const recommendedProjects = useQuery(
    api.matching.getRecommendedProjectsForStudent,
    currentUser ? { studentUserId: currentUser._id } : "skip"
  );

  const profile = useQuery(
    api.studentProfiles.getProfileByUserId,
    currentUser ? { userId: currentUser._id } : "skip"
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-[#FAF7F2] to-white border border-[#DDD3C2] rounded-3xl p-6 relative overflow-hidden shadow-xs">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Advanced Feature 1 • 5 Marks
          </div>

          <h2 className="text-2xl font-black text-stone-900">
            Skill-Based Project Recommendations
          </h2>

          <p className="text-xs text-stone-600 leading-relaxed">
            Our recommendation algorithm computes the intersection between your declared profile skills (
            {profile?.skills?.join(", ") || "No skills set"}) and live project requirements, weighted by experience level parity.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Button size="sm" variant="outline" onClick={onNavigateToProfile} className="text-xs gap-1.5 font-semibold">
            Update My Skills in Profile
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Recommended Projects Grid */}
      {recommendedProjects && recommendedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedProjects.map((p: any) => (
            <div key={p._id} className="relative">
              <ProjectCard
                project={p}
                onApply={onApply}
                onViewDetails={onViewDetails}
                matchScore={p.matchScore}
                matchedSkills={p.matchedSkills}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white border border-[#E7E1D5] rounded-2xl space-y-3 shadow-xs">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
          <h3 className="text-sm font-bold text-stone-900">No Direct Matches Found Yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adding more skills to your profile (e.g. "React", "WordPress", "UI/UX", "Figma", "Python") to trigger automated matches.
          </p>
          <Button size="sm" onClick={onNavigateToProfile}>
            Configure Profile Skills
          </Button>
        </div>
      )}
    </div>
  );
};
