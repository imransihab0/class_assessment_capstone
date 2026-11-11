import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "../../context/AuthContext";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { formatCurrency, formatDate } from "../../lib/utils";
import {
  Briefcase,
  Check,
  X,
  Star,
  Users,
  MessageSquare,
  ExternalLink,
  PlusCircle,
  Crown,
  Sparkles
} from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";

interface ClientDashboardViewProps {
  onOpenPostJob: () => void;
  onOpenReviewModal: (projectId: Id<"projects">, studentUserId: Id<"users">, studentName: string) => void;
}

export const ClientDashboardView: React.FC<ClientDashboardViewProps> = ({
  onOpenPostJob,
  onOpenReviewModal,
}) => {
  const { currentUser } = useAuth();
  const updateStatus = useMutation(api.applications.updateApplicationStatus);

  const [selectedProjectId, setSelectedProjectId] = useState<Id<"projects"> | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [activeAppId, setActiveAppId] = useState<Id<"applications"> | null>(null);

  const clientProjects = useQuery(
    api.projects.listClientProjects,
    currentUser && currentUser.role === "client" ? { clientId: currentUser._id } : "skip"
  );

  // If no project selected yet, select first
  React.useEffect(() => {
    if (clientProjects && clientProjects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(clientProjects[0]._id);
    }
  }, [clientProjects, selectedProjectId]);

  const activeProject = clientProjects?.find((p) => p._id === selectedProjectId);

  const applications = useQuery(
    api.applications.getProjectApplications,
    selectedProjectId ? { projectId: selectedProjectId } : "skip"
  );

  const handleUpdate = async (
    applicationId: Id<"applications">,
    status: string,
    studentUserId: Id<"users">,
    studentName: string
  ) => {
    await updateStatus({
      applicationId,
      status,
      clientFeedback: feedbackText || undefined,
    });
    setFeedbackText("");
    setActiveAppId(null);

    // If marked completed, trigger review prompt
    if (status === "completed" && selectedProjectId) {
      onOpenReviewModal(selectedProjectId, studentUserId, studentName);
    }
  };

  if (!currentUser) {
    return (
      <div className="p-12 text-center bg-white border border-[#E7E1D5] rounded-3xl space-y-3 shadow-xs max-w-lg mx-auto my-12">
        <Briefcase className="w-10 h-10 text-stone-400 mx-auto" />
        <h3 className="text-base font-bold text-stone-900">Sign In to Access Client Portal</h3>
        <p className="text-xs text-stone-500">
          Please log in with your client account to manage projects, review student proposals, and hire talent.
        </p>
        <div className="pt-2">
          <Button onClick={() => (window.location.href = "/login")}>Sign In</Button>
        </div>
      </div>
    );
  }

  if (currentUser.role !== "client") {
    return (
      <div className="p-8 text-center bg-white border border-[#E7E1D5] rounded-3xl space-y-3 shadow-xs max-w-lg mx-auto my-12">
        <Briefcase className="w-10 h-10 text-amber-600 mx-auto" />
        <h3 className="text-base font-bold text-stone-900">Client Portal Access Restricted</h3>
        <p className="text-xs text-stone-600">
          You are currently signed in as <strong>{currentUser.name}</strong> ({currentUser.role}). Only client accounts can manage posted jobs and hire applicants.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E1D5]">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-bold text-stone-900">Client Management Portal</h2>
            <Badge variant="info">Advanced Feature: 5 Marks</Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Review student candidates, manage proposals, shortlist, and hire top DIU talent.
          </p>
        </div>

        <Button size="sm" onClick={onOpenPostJob} className="gap-1.5 font-bold">
          <PlusCircle className="w-4 h-4" />
          Post Another Job
        </Button>
      </div>

      {/* Project Selector Carousel */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-stone-700 block">
          Select Your Posted Job Request:
        </label>
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2">
          {clientProjects && clientProjects.length > 0 ? (
            clientProjects.map((p) => (
              <button
                key={p._id}
                onClick={() => setSelectedProjectId(p._id)}
                className={`p-3 rounded-xl border text-left shrink-0 w-64 transition-all ${
                  selectedProjectId === p._id
                    ? "bg-[#F4EFE6] border-emerald-600 shadow-xs ring-1 ring-emerald-600/30"
                    : "bg-white border-[#E7E1D5] hover:border-[#DDD3C2]"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase">
                    {p.status}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    {p.applications?.length || 0} bids
                  </span>
                </div>
                <h4 className="text-xs font-bold text-stone-900 truncate">{p.title}</h4>
                <p className="text-[11px] text-stone-500 mt-1">
                  {formatCurrency(p.budget, p.projectType)}
                </p>
              </button>
            ))
          ) : (
            <div className="p-4 bg-[#FAF7F2] border border-[#E7E1D5] rounded-xl text-xs text-stone-500 w-full flex items-center justify-between">
              <span>No projects posted yet under this user account.</span>
              <Button size="sm" onClick={onOpenPostJob} className="text-xs py-1">
                Post Job Now
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Selected Project Applicants View */}
      {activeProject && (
        <div className="space-y-4">
          <div className="p-4 bg-white border border-[#E7E1D5] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
            <div>
              <span className="text-[11px] text-emerald-800 font-semibold uppercase tracking-wider">
                {activeProject.category} • {activeProject.experienceLevel}
              </span>
              <h3 className="text-base font-bold text-stone-900">{activeProject.title}</h3>
              <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                {activeProject.description}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs text-stone-500 block">Total Budget</span>
              <span className="text-base font-bold text-emerald-800">
                {formatCurrency(activeProject.budget, activeProject.projectType)}
              </span>
            </div>
          </div>

          <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-700" />
            Applicant Proposals ({applications?.length || 0})
          </h3>

          {applications && applications.length > 0 ? (
            <div className="space-y-3">
              {applications.map((app) => {
                const isPlusCandidate = Boolean(app.isPlusApplication || app.user?.isPlusMember);

                return (
                  <div
                    key={app._id}
                    className={`bg-white border rounded-2xl p-5 space-y-4 transition-all relative overflow-hidden shadow-xs ${
                      isPlusCandidate
                        ? "border-amber-300 bg-amber-50/20 ring-1 ring-amber-300/40"
                        : "border-[#E7E1D5] hover:border-[#DDD3C2]"
                    }`}
                  >
                    {isPlusCandidate && (
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-stone-950 font-black text-[10px] px-3 py-0.5 rounded-bl-xl uppercase tracking-wider flex items-center gap-1 shadow-xs">
                        <Crown className="w-3 h-3 text-stone-950" />
                        Priority Plus Applicant
                      </div>
                    )}

                    {/* Applicant Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            app.studentAvatar ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                          }
                          alt={app.studentName}
                          className={`w-11 h-11 rounded-xl object-cover ring-2 ${
                            isPlusCandidate ? "ring-amber-400" : "ring-[#E7E1D5]"
                          }`}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1">
                              <span>{app.studentName}</span>
                              {isPlusCandidate && <Crown className="w-3 h-3 text-amber-600" />}
                            </h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                              {app.studentDepartment || "Software Engineering"}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500">
                            {app.profile?.university || "Daffodil International University"} •{" "}
                            Rating: ⭐ {app.profile?.averageRating?.toFixed(1) || "5.0"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500">Bid:</span>
                        <span className="text-base font-bold text-emerald-800">
                          {formatCurrency(app.proposedRate, activeProject.projectType)}
                        </span>
                        <span className="text-xs text-stone-400">
                          ({app.estimatedTimelineDays} days)
                        </span>
                      </div>
                    </div>

                    {/* Skills */}
                    {app.profile?.skills && (
                      <div className="flex flex-wrap gap-1.5">
                        {app.profile.skills.map((s, i) => (
                          <Badge key={i} variant="skill">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Cover Letter */}
                    <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E7E1D5] text-xs text-stone-700 leading-relaxed">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                        Applicant's Pitch
                      </span>
                      {app.coverLetter}
                    </div>

                    {/* Optional Feedback Input */}
                    {activeAppId === app._id && (
                      <div className="space-y-2 p-3 bg-[#FAF7F2] rounded-xl border border-[#DDD3C2]">
                        <label className="text-xs font-semibold text-stone-700 block">
                          Optional Feedback / Message to Student:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Loved your proposal, let's proceed with milestones..."
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          className="w-full bg-white border border-[#DDD3C2] rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    )}

                    {/* Actions & Status */}
                    <div className="pt-3 border-t border-[#E7E1D5] flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500">Status:</span>
                        <Badge
                          variant={
                            app.status === "accepted"
                              ? "success"
                              : app.status === "shortlisted"
                              ? "info"
                              : app.status === "completed"
                              ? "success"
                              : app.status === "rejected"
                              ? "danger"
                              : "warning"
                          }
                        >
                          {app.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        {activeAppId !== app._id && (
                          <button
                            type="button"
                            onClick={() => setActiveAppId(app._id)}
                            className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Add note</span>
                          </button>
                        )}

                        {app.status !== "shortlisted" && app.status !== "accepted" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                              handleUpdate(app._id, "shortlisted", app.studentId, app.studentName)
                            }
                            className="text-xs"
                          >
                            Shortlist
                          </Button>
                        )}

                        {app.status !== "accepted" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleUpdate(app._id, "accepted", app.studentId, app.studentName)
                            }
                            className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Accept & Hire
                          </Button>
                        )}

                        {app.status === "accepted" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleUpdate(app._id, "completed", app.studentId, app.studentName)
                            }
                            className="text-xs bg-teal-700 hover:bg-teal-800 text-white font-bold gap-1"
                          >
                            <Star className="w-3.5 h-3.5" />
                            Mark Completed & Review
                          </Button>
                        )}

                        {app.status !== "rejected" && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() =>
                              handleUpdate(app._id, "rejected", app.studentId, app.studentName)
                            }
                            className="text-xs"
                          >
                            <X className="w-3.5 h-3.5" />
                            Reject
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
              No applications received for this job yet. Switch persona to student to submit a proposal!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
