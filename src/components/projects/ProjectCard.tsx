import React from "react";
import { CheckCircle2, MapPin, Users, Clock, Bookmark, Sparkles, Crown, Check } from "lucide-react";
import { Project } from "../../types";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { formatCurrency, timeAgo } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface ProjectCardProps {
  project: Project;
  onApply: (project: Project) => void;
  onViewDetails: (project: Project) => void;
  matchScore?: number;
  matchedSkills?: string[];
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onApply,
  onViewDetails,
  matchScore,
  matchedSkills,
}) => {
  const { currentUser } = useAuth();

  // Check if current user has already applied to this project
  const existingApplication = useQuery(
    api.applications.checkIfApplied,
    currentUser && currentUser.role === "student"
      ? { projectId: project._id, studentId: currentUser._id }
      : "skip"
  );

  const hasApplied = Boolean(existingApplication);

  return (
    <div className="bg-white hover:bg-[#FDFBF7] border border-[#E7E1D5] hover:border-[#D5CCBC] rounded-3xl p-5 sm:p-6 transition-all duration-200 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between group">
      <div>
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider bg-[#F4EFE6] px-2 py-0.5 rounded-md border border-[#E0D7C7]">
              {project.experienceLevel || "Entry Level"}
            </span>

            {project.isPlusExclusive && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300">
                <Crown className="w-2.5 h-2.5 text-amber-600" />
                PLUS EXCLUSIVE
              </span>
            )}

            {matchScore !== undefined && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                <Sparkles className="w-3 h-3 text-emerald-700" />
                {matchScore}% Match
              </span>
            )}
          </div>

          <button className="text-stone-400 hover:text-stone-700 transition-colors p-1">
            <Bookmark className="w-4 h-4" />
          </button>
        </div>

        {/* Project Title */}
        <h3
          onClick={() => onViewDetails(project)}
          className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors cursor-pointer line-clamp-1 mb-2 tracking-tight"
        >
          {project.title}
        </h3>

        {/* Client & Proposal Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mb-3.5">
          <div className="flex items-center gap-1 text-emerald-700 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-100" />
            <span>Verified</span>
          </div>

          <div className="flex items-center gap-1 text-stone-500">
            <MapPin className="w-3 h-3 text-stone-400" />
            <span>{project.location || "Remote"}</span>
          </div>

          <div className="flex items-center gap-1 text-stone-500">
            <Users className="w-3 h-3 text-stone-400" />
            <span>{project.proposalsCount || 0} proposals</span>
          </div>

          <div className="flex items-center gap-1 text-stone-400 text-[11px] ml-auto">
            <Clock className="w-3 h-3" />
            <span>{timeAgo(project.createdAt)}</span>
          </div>
        </div>

        {/* Description Snippet */}
        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Skills Tags Matching Mockup in Creamy Warm Style */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.requiredSkills.map((skill, index) => {
            const isMatched = matchedSkills?.some(
              (ms) => ms.toLowerCase() === skill.toLowerCase()
            );

            return (
              <span
                key={index}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                  isMatched
                    ? "bg-emerald-50 text-emerald-900 border border-emerald-300"
                    : "bg-[#F4EFE6] text-stone-700 border border-[#DDD3C2]"
                }`}
              >
                {skill}
              </span>
            );
          })}
        </div>
      </div>

      {/* Card Footer: Budget & Apply Button */}
      <div className="pt-3.5 border-t border-[#EFEAE1] flex items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-stone-900">
              {formatCurrency(project.budget, project.projectType)}
            </span>
          </div>
          <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider">
            {project.projectType}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(project)}
            className="text-xs py-1.5"
          >
            Details
          </Button>

          {hasApplied ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300">
              <Check className="w-3.5 h-3.5" />
              Applied ({existingApplication?.status})
            </span>
          ) : (
            <Button
              size="sm"
              variant="dark"
              onClick={() => onApply(project)}
              className="text-xs py-1.5 px-4 font-bold bg-stone-900 hover:bg-black text-white shadow-xs"
            >
              Apply Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
