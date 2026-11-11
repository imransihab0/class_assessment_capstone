import React from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { Badge } from "../common/Badge";
import { Project } from "../../types";
import { formatCurrency } from "../../lib/utils";
import { MapPin, Users, ShieldCheck, Sparkles } from "lucide-react";

interface ProjectDetailsModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (project: Project) => void;
  onMatchBonus?: (project: Project) => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  project,
  isOpen,
  onClose,
  onApply,
  onMatchBonus,
}) => {
  if (!project) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project.title}
      subtitle={`Posted by ${project.clientName} • ${project.category}`}
      maxWidth="2xl"
    >
      <div className="space-y-6 text-stone-900">
        {/* Key Metrics Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E7E1D5]">
          <div>
            <span className="text-[11px] text-stone-500 block font-medium">Budget</span>
            <span className="text-base font-extrabold text-stone-900">
              {formatCurrency(project.budget, project.projectType)}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-stone-500 block font-medium">Experience</span>
            <span className="text-sm font-bold text-stone-800">
              {project.experienceLevel}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-stone-500 block font-medium">Location</span>
            <span className="text-sm font-semibold text-stone-800 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              {project.location}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-stone-500 block font-medium">Proposals</span>
            <span className="text-sm font-semibold text-stone-800 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-stone-400" />
              {project.proposalsCount} Bids
            </span>
          </div>
        </div>

        {/* Project Description */}
        <div>
          <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            Project Overview & Scope
          </h4>
          <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line bg-[#FAF8F5] p-4 rounded-2xl border border-[#E7E1D5]">
            {project.description}
          </p>
        </div>

        {/* Required Skills */}
        <div>
          <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            Required Technical & Creative Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.requiredSkills.map((skill, i) => (
              <Badge key={i} variant="skill" className="px-3 py-1 text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Client Profile Box */}
        <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E7E1D5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={
                project.clientAvatar ||
                "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80"
              }
              alt={project.clientName}
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-stone-300"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h5 className="text-xs font-bold text-stone-900">{project.clientName}</h5>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <p className="text-[11px] text-stone-500">
                {project.clientCompany || "Verified Client on SkillBridge"}
              </p>
            </div>
          </div>

          {onMatchBonus && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                onClose();
                onMatchBonus(project);
              }}
              className="text-xs gap-1 border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100"
            >
              <Sparkles className="w-3 h-3 text-amber-700" />
              Talent Matcher (Bonus)
            </Button>
          )}
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-[#EFEAE1] flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            size="sm"
            variant="dark"
            onClick={() => {
              onClose();
              onApply(project);
            }}
            className="px-5 font-bold"
          >
            Apply for this Project
          </Button>
        </div>
      </div>
    </Modal>
  );
};
