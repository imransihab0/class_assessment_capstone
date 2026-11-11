import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Project } from "../../types";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { RatingStars } from "../common/RatingStars";
import {
  Sparkles,
  Award,
  Users,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";

export const BonusTalentMatcher: React.FC = () => {
  const projects = useQuery(api.projects.listProjects, {});
  const [selectedProjectId, setSelectedProjectId] = useState<Id<"projects"> | null>(null);

  React.useEffect(() => {
    if (projects && projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0]._id);
    }
  }, [projects, selectedProjectId]);

  const activeProject = projects?.find((p) => p._id === selectedProjectId);

  const matchedStudents = useQuery(
    api.matching.getRecommendedStudentsForProject,
    selectedProjectId ? { projectId: selectedProjectId } : "skip"
  );

  return (
    <div className="space-y-6">
      {/* Bonus Header Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-[#FAF7F2] to-white border border-amber-200 rounded-3xl p-6 relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              Bonus Challenge • 5 Marks
            </div>

            <h2 className="text-2xl font-black text-stone-900">
              Talent Matcher: Student Recommendations for Projects
            </h2>

            <p className="text-xs text-stone-600 leading-relaxed">
              Algorithmic engine that scans all student profiles and calculates compatibility based on:
              <strong> Skill Overlap (50%)</strong>, <strong>Client Rating (25%)</strong>, <strong>Experience Alignment (15%)</strong>, and <strong>Portfolio Relevance (10%)</strong>.
            </p>
          </div>

          <div className="bg-white border border-amber-200 p-3 rounded-2xl shrink-0 text-center shadow-xs">
            <Zap className="w-6 h-6 text-amber-600 mx-auto mb-1 animate-pulse" />
            <span className="text-xs font-bold text-stone-900 block">AI Match Score</span>
            <span className="text-[10px] text-stone-500">Calculated in Real-Time</span>
          </div>
        </div>
      </div>

      {/* Select Project To Match */}
      <div className="bg-white border border-[#E7E1D5] rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold text-stone-800">
            Select Project / Job Request to Rank Candidates:
          </label>
          <span className="text-xs text-emerald-800 font-medium">
            Category: {activeProject?.category || "Web"}
          </span>
        </div>

        <select
          value={selectedProjectId || ""}
          onChange={(e) => setSelectedProjectId(e.target.value as Id<"projects">)}
          className="w-full bg-[#FAF7F2] border border-[#E7E1D5] rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
        >
          {projects?.map((p) => (
            <option key={p._id} value={p._id} className="bg-white">
              {p.title} (${p.budget} • {p.requiredSkills.join(", ")})
            </option>
          ))}
        </select>

        {activeProject && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E7E1D5] text-xs">
            <span className="text-stone-500">Target Skills:</span>
            {activeProject.requiredSkills.map((s, i) => (
              <span
                key={i}
                className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Ranked Students Candidates Feed */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
          <Users className="w-4 h-4 text-amber-600" />
          Ranked Students for "{activeProject?.title}" ({matchedStudents?.length || 0} candidates)
        </h3>

        {matchedStudents && matchedStudents.length > 0 ? (
          <div className="space-y-4">
            {matchedStudents.map((item: any, rank: number) => {
              const p = item.profile;
              const u = item.user;
              const score = item.matchScore;

              return (
                <div
                  key={p._id}
                  className="bg-white border border-[#E7E1D5] rounded-2xl p-5 hover:border-[#DDD3C2] transition-all space-y-4 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Student Info */}
                    <div className="flex items-start gap-3.5">
                      <div className="relative">
                        <img
                          src={
                            u?.avatar ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                          }
                          alt={p.fullName}
                          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#E7E1D5]"
                        />
                        <span className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center shadow-xs">
                          #{rank + 1}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-stone-900">{p.fullName}</h4>
                          <span className="text-xs text-stone-500">({p.studentId})</span>
                        </div>

                        <p className="text-xs text-stone-600 mt-0.5">
                          {p.department} • {p.university}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs">
                          <RatingStars rating={p.averageRating} size="sm" showValue />
                          <span className="text-stone-300">•</span>
                          <span className="text-emerald-800 font-bold">${p.hourlyRate}/hr</span>
                          <span className="text-stone-300">•</span>
                          <span className="text-stone-500">{p.experienceLevel}</span>
                        </div>
                      </div>
                    </div>

                    {/* Compatibility Score Pill */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-2xl">
                      <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                        Match Score
                      </span>
                      <span className="text-2xl font-black text-amber-700">{score}%</span>
                      <span className="text-[10px] text-stone-500">
                        {item.matchedSkills.length} of {activeProject?.requiredSkills.length} skills
                      </span>
                    </div>
                  </div>

                  {/* Skills Alignment Bar */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#FAF7F2] p-3 rounded-xl border border-[#E7E1D5] text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Matched Required Skills:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {item.matchedSkills.length > 0 ? (
                          item.matchedSkills.map((s: string, i: number) => (
                            <span
                              key={i}
                              className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200"
                            >
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-stone-400 text-[11px]">None overlapping</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 text-stone-400" />
                        Missing Required Skills:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {item.missingSkills.length > 0 ? (
                          item.missingSkills.map((s: string, i: number) => (
                            <span
                              key={i}
                              className="text-[11px] px-2 py-0.5 rounded bg-white text-stone-600 border border-[#E7E1D5]"
                            >
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-emerald-800 text-[11px] font-semibold">
                            Full 100% Skill Coverage!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Algorithmic Weight Breakdown */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E7E1D5] text-[11px] text-stone-500">
                    <div className="flex items-center gap-3">
                      <span>Skills: <strong>{item.breakdown.skillScore}/50</strong></span>
                      <span>Rating: <strong>{item.breakdown.ratingScore}/25</strong></span>
                      <span>Exp: <strong>{item.breakdown.expScore}/15</strong></span>
                      <span>Portfolio: <strong>{item.breakdown.portfolioScore}/10</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.hasApplied ? (
                        <span className="text-emerald-800 font-semibold bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs">
                          Applied ({item.applicationStatus})
                        </span>
                      ) : (
                        <Button size="sm" variant="dark" className="text-xs py-1 px-3">
                          Invite to Apply
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-white border border-[#E7E1D5] rounded-2xl text-xs text-stone-500 shadow-xs">
            No students found for this project category yet.
          </div>
        )}
      </div>
    </div>
  );
};
