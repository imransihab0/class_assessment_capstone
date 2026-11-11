import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { Project } from "../../types";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../lib/utils";
import { Send, AlertCircle, CheckCircle } from "lucide-react";

interface ApplyModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  project,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentUser } = useAuth();
  const applyForProject = useMutation(api.applications.applyForProject);

  const [coverLetter, setCoverLetter] = useState(
    "Hello! I am a student developer from Daffodil International University. I have carefully reviewed your project requirements and would love to deliver high-quality work within your expected deadline. You can check my verified portfolio items for similar work."
  );
  const [proposedRate, setProposedRate] = useState<number>(project ? project.budget : 15);
  const [estimatedTimelineDays, setEstimatedTimelineDays] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync default proposed rate when project changes
  React.useEffect(() => {
    if (project) {
      setProposedRate(project.budget);
    }
  }, [project]);

  if (!project) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError("Please sign in or select a student persona.");
      return;
    }
    if (coverLetter.trim().length < 20) {
      setError("Please write a meaningful cover letter (at least 20 characters).");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await applyForProject({
        projectId: project._id,
        studentId: currentUser._id,
        coverLetter,
        proposedRate: Number(proposedRate),
        estimatedTimelineDays: Number(estimatedTimelineDays),
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Project Proposal"
      subtitle={`Applying to: ${project.title}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-stone-900">
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Project Snapshot */}
        <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#E7E1D5] flex items-center justify-between text-xs">
          <div>
            <span className="text-stone-500 block text-[11px] font-medium">Client Budget</span>
            <span className="font-extrabold text-stone-900">
              {formatCurrency(project.budget, project.projectType)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-stone-500 block text-[11px] font-medium">Category</span>
            <span className="font-bold text-emerald-800">{project.category}</span>
          </div>
        </div>

        {/* Proposed Bid & Timeline */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Your Bid Amount ($) *
            </label>
            <input
              type="number"
              min={1}
              required
              value={proposedRate}
              onChange={(e) => setProposedRate(Number(e.target.value))}
              className="w-full bg-[#FAF8F5] border border-[#DCD5C8] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white font-semibold"
            />
            <span className="text-[10px] text-stone-500 mt-0.5 block">
              {project.projectType === "Hourly" ? "Per hour" : "Total project fee"}
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Delivery Days *
            </label>
            <input
              type="number"
              min={1}
              required
              value={estimatedTimelineDays}
              onChange={(e) => setEstimatedTimelineDays(Number(e.target.value))}
              className="w-full bg-[#FAF8F5] border border-[#DCD5C8] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white font-semibold"
            />
            <span className="text-[10px] text-stone-500 mt-0.5 block">Estimated duration</span>
          </div>
        </div>

        {/* Cover Letter */}
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1">
            Cover Letter & Pitch *
          </label>
          <textarea
            required
            rows={4}
            placeholder="Explain why you are the ideal student for this project, relevant coursework or tools..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-[#DCD5C8] rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white leading-relaxed"
          />
        </div>

        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900 font-medium">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-700" />
          <span>
            Applying as <strong>{currentUser?.name || "Student"}</strong> ({currentUser?.role})
          </span>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-[#EFEAE1] flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" variant="dark" isLoading={isSubmitting} className="gap-1.5 font-bold">
            <Send className="w-3.5 h-3.5" />
            Send Proposal
          </Button>
        </div>
      </form>
    </Modal>
  );
};
