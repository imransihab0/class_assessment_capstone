import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "../../context/AuthContext";
import { Application } from "../../types";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { formatCurrency, formatDate } from "../../lib/utils";
import { FileText, Clock, CheckCircle2, XCircle, AlertCircle, MessageSquare } from "lucide-react";

export const MyProposalsView: React.FC<{ onNavigateToBrowse: () => void }> = ({
  onNavigateToBrowse,
}) => {
  const { currentUser } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const applications = useQuery(
    api.applications.getStudentApplications,
    currentUser ? { studentId: currentUser._id } : "skip"
  ) as Application[] | undefined;

  const filtered = applications?.filter((app) => {
    if (filterStatus === "all") return true;
    return app.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge variant="success">Accepted / Hired 🎉</Badge>;
      case "shortlisted":
        return <Badge variant="info">Shortlisted ⭐</Badge>;
      case "completed":
        return <Badge variant="success">Completed ✅</Badge>;
      case "rejected":
        return <Badge variant="danger">Declined</Badge>;
      default:
        return <Badge variant="warning">Under Review</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E1D5]">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-700" />
            My Project Applications & Status
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Track submitted bids, interview requests, and client status updates in real-time.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-[#F4EFE6] p-1 rounded-xl border border-[#E7E1D5] text-xs overflow-x-auto">
          {["all", "pending", "shortlisted", "accepted", "completed", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize whitespace-nowrap transition-colors ${
                filterStatus === tab
                  ? "bg-emerald-700 text-white font-bold shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {filtered && filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((app) => (
            <div
              key={app._id}
              className="bg-white border border-[#E7E1D5] rounded-2xl p-5 hover:border-[#DDD3C2] transition-all space-y-4 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    {app.project?.title || "Project Opportunity"}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                    <span>Client: {app.project?.clientName || "Client"}</span>
                    <span>•</span>
                    <span>Category: {app.project?.category || "General"}</span>
                    <span>•</span>
                    <span>Applied: {formatDate(app.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(app.status)}
                </div>
              </div>

              {/* Proposal Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#FAF7F2] p-3 rounded-xl border border-[#E7E1D5] text-xs">
                <div>
                  <span className="text-stone-500 block text-[11px]">Your Bid</span>
                  <span className="font-bold text-emerald-800 text-sm">
                    {formatCurrency(app.proposedRate, app.project?.projectType)}
                  </span>
                </div>

                <div>
                  <span className="text-stone-500 block text-[11px]">Proposed Timeline</span>
                  <span className="font-semibold text-stone-800 text-sm">
                    {app.estimatedTimelineDays} Days
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <span className="text-stone-500 block text-[11px]">Last Updated</span>
                  <span className="font-semibold text-stone-800 text-sm">
                    {formatDate(app.updatedAt)}
                  </span>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Your Cover Letter
                </p>
                <p className="text-xs text-stone-700 leading-relaxed bg-[#FAF7F2] p-3 rounded-xl border border-[#E7E1D5]">
                  {app.coverLetter}
                </p>
              </div>

              {/* Client Feedback (If any) */}
              {app.clientFeedback && (
                <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-blue-900">
                  <MessageSquare className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-blue-900 block">Client Message:</span>
                    <span className="text-blue-800">{app.clientFeedback}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E7E1D5] p-8 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E7E1D5] flex items-center justify-center mx-auto text-stone-500">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900">No applications found in this tab</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Browse open projects and submit proposals to gain real-world client experience.
          </p>
          <Button size="sm" onClick={onNavigateToBrowse}>
            Explore Open Projects
          </Button>
        </div>
      )}
    </div>
  );
};
