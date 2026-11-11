import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "../../context/AuthContext";
import { Plus, X, Image as ImageIcon } from "lucide-react";

interface AddPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPortfolioModal: React.FC<AddPortfolioModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const addPortfolio = useMutation(api.portfolios.addPortfolio);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [projectUrl, setProjectUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [completedDate, setCompletedDate] = useState("November 2026");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>(["React", "TypeScript"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await addPortfolio({
        studentId: currentUser._id,
        title,
        description,
        category,
        projectUrl: projectUrl || undefined,
        githubUrl: githubUrl || undefined,
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
        skills,
        completedDate,
        featured: true,
      });

      setTitle("");
      setDescription("");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to add portfolio item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Portfolio Project Exhibit"
      subtitle="Showcase your best software engineering, design, or writing work to clients"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            {error}
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-stone-700 block mb-1">
            Project Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Smart DIU Campus Bus Tracker"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-[#E7E1D5] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E7E1D5] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
            >
              <option value="Web Development">Web Development</option>
              <option value="Web Design">Web Design</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Graphic Design">Graphic Design</option>
              <option value="Programming & AI">Programming & AI</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Completed Date
            </label>
            <input
              type="text"
              placeholder="e.g. October 2026"
              value={completedDate}
              onChange={(e) => setCompletedDate(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E7E1D5] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-stone-700 block mb-1">
            Project Description *
          </label>
          <textarea
            required
            rows={3}
            placeholder="Key achievements, technologies used, problem solved..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-[#E7E1D5] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
          />
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Live Demo URL
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E7E1D5] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              GitHub URL
            </label>
            <input
              type="url"
              placeholder="https://github.com/..."
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E7E1D5] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-stone-700 block mb-1">
            Project Preview Image URL (Unsplash or direct image)
          </label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-[#E7E1D5] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
          />
        </div>

        {/* Skills Tagging */}
        <div>
          <label className="text-xs font-semibold text-stone-700 block mb-1">Skills Used</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add skill tag..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              className="flex-1 bg-[#FAF7F2] border border-[#E7E1D5] rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
            />
            <Button type="button" size="sm" variant="secondary" onClick={handleAddSkill}>
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span
                key={s}
                className="text-xs bg-[#F4EFE6] text-stone-800 border border-[#E7E1D5] px-2.5 py-0.5 rounded-lg flex items-center gap-1"
              >
                {s}
                <button
                  type="button"
                  onClick={() => setSkills(skills.filter((sk) => sk !== s))}
                  className="hover:text-rose-600 font-bold"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-[#E7E1D5] flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            Save Portfolio Item
          </Button>
        </div>
      </form>
    </Modal>
  );
};
