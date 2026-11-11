import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "../../context/AuthContext";
import { Plus, X } from "lucide-react";

interface PostProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostProjectModal: React.FC<PostProjectModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const createProject = useMutation(api.projects.createProject);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Web Design");
  const [experienceLevel, setExperienceLevel] = useState("Entry Level");
  const [projectType, setProjectType] = useState("Fixed Price");
  const [budget, setBudget] = useState(300);
  const [location, setLocation] = useState("Remote");
  const [deadline, setDeadline] = useState("2026-12-30");

  const [skillInput, setSkillInput] = useState("");
  const [requiredSkills, setRequiredSkills] = useState<string[]>([
    "Web Design",
    "UI/UX Design",
    "WordPress",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddSkill = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (skillInput.trim() && !requiredSkills.includes(skillInput.trim())) {
      setRequiredSkills([...requiredSkills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError("Please sign in or select a client persona.");
      return;
    }
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }
    if (requiredSkills.length === 0) {
      setError("Please specify at least one required skill.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await createProject({
        clientId: currentUser._id,
        title,
        description,
        category,
        requiredSkills,
        experienceLevel,
        projectType,
        budget: Number(budget),
        location,
        deadline,
      });

      // Reset
      setTitle("");
      setDescription("");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to publish project request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Publish a Project / Job Request"
      subtitle="Connect with talented university students for your development or creative tasks"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-stone-900">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1">
            Project Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Build/Edit Landing Page for Online Course"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-[#DCD5C8] rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#DCD5C8] rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white"
            >
              <option value="Web Design">Web Design</option>
              <option value="Web Development">Web Development</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Graphic Design">Graphic Design</option>
              <option value="Content Writing">Content Writing</option>
              <option value="Programming & AI">Programming & AI</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Experience Level Required
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#DCD5C8] rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white"
            >
              <option value="Any">Any Level</option>
              <option value="Entry Level">Entry Level (Student Friendly)</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1">
            Project Description *
          </label>
          <textarea
            required
            rows={3}
            placeholder="Describe deliverables, scope, required tech stack, and timeline..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-[#DCD5C8] rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white"
          />
        </div>

        {/* Required Skills Management */}
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1">
            Required Skills (Used by Algorithmic Matcher)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="e.g. React, Figma, WordPress, Python..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              className="flex-1 bg-[#FAF8F5] border border-[#DCD5C8] rounded-xl px-3.5 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleAddSkill()}
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {requiredSkills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 text-xs bg-[#F4EFE6] text-stone-800 border border-[#DDD3C2] px-2.5 py-1 rounded-lg font-semibold"
              >
                {s}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(s)}
                  className="hover:text-rose-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Budget & Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Pricing Model
            </label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#DCD5C8] rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
            >
              <option value="Fixed Price">Fixed Price ($)</option>
              <option value="Hourly">Hourly Rate ($/hr)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Budget Amount ($)
            </label>
            <input
              type="number"
              min={5}
              required
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full bg-[#FAF8F5] border border-[#DCD5C8] rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Location / Mode
            </label>
            <input
              type="text"
              placeholder="e.g. Remote, Germany, USA"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#DCD5C8] rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#EFEAE1] flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" variant="dark" isLoading={isSubmitting}>
            Publish Project Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};
