import React from "react";
import { FilterState } from "../../types";
import { RotateCcw } from "lucide-react";

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  totalResults: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const categories = [
    "All Categories",
    "Web Design",
    "Web Development",
    "UI/UX Design",
    "Graphic Design",
    "Content Writing",
    "Programming & AI",
  ];

  const experienceLevels = ["Any", "Entry Level", "Intermediate", "Expert"];

  const priceRanges = [
    { label: "Any", min: undefined, max: undefined },
    { label: "Less than $100", min: 0, max: 100 },
    { label: "$100 to $500", min: 100, max: 500 },
    { label: "$500 to $1k", min: 500, max: 1000 },
    { label: "$1k to $5k", min: 1000, max: 5000 },
    { label: "$5k+", min: 5000, max: undefined },
  ];

  const proposalRanges = [
    { label: "Any Proposals", min: undefined, max: undefined },
    { label: "Less than 5", min: 0, max: 4 },
    { label: "5 to 10", min: 5, max: 10 },
    { label: "10 to 15", min: 11, max: 15 },
    { label: "15 to 20", min: 16, max: 20 },
  ];

  const isProposalSelected = (prop: { min?: number; max?: number }) => {
    return filters.minProposals === prop.min && filters.maxProposals === prop.max;
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-white border border-[#E7E1D5] rounded-3xl p-5 space-y-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-stone-900">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#EFEAE1]">
        <div>
          <h3 className="text-sm font-extrabold text-stone-900">Filters</h3>
          <p className="text-[11px] text-stone-500 font-medium">{totalResults} projects matching</p>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-stone-500 hover:text-stone-900 font-semibold flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-stone-800 block">Category</label>
        <select
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
          className="w-full bg-[#FAF8F5] border border-[#DCD5C8] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 font-medium"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat === "All Categories" ? "All" : cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Experience Level Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-stone-800 block">Experience Level</label>
        <div className="space-y-1.5">
          {experienceLevels.map((lvl) => (
            <label
              key={lvl}
              className="flex items-center gap-2.5 text-xs text-stone-700 hover:text-stone-900 cursor-pointer select-none font-medium"
            >
              <input
                type="radio"
                name="experienceLevel"
                checked={filters.experienceLevel === lvl}
                onChange={() => onChange({ ...filters, experienceLevel: lvl })}
                className="w-3.5 h-3.5 text-emerald-700 accent-emerald-700 cursor-pointer"
              />
              <span>{lvl}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Project Type Filter (Hourly vs Fixed Price) */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-stone-800 block">Project Type</label>
        <div className="grid grid-cols-2 gap-2 bg-[#F4EFE6] p-1 rounded-xl border border-[#E0D7C7]">
          <button
            type="button"
            onClick={() =>
              onChange({
                ...filters,
                projectType: filters.projectType === "Hourly" ? "Any" : "Hourly",
              })
            }
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
              filters.projectType === "Hourly"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Hourly
          </button>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...filters,
                projectType: filters.projectType === "Fixed Price" ? "Any" : "Fixed Price",
              })
            }
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
              filters.projectType === "Fixed Price"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Fixed Price
          </button>
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-stone-800 block">Price Range</label>
        <div className="space-y-1.5">
          {priceRanges.map((range) => (
            <label
              key={range.label}
              className="flex items-center gap-2.5 text-xs text-stone-700 hover:text-stone-900 cursor-pointer select-none font-medium"
            >
              <input
                type="radio"
                name="priceRange"
                checked={filters.priceRange === range.label}
                onChange={() =>
                  onChange({
                    ...filters,
                    priceRange: range.label,
                    minBudget: range.min,
                    maxBudget: range.max,
                  })
                }
                className="w-3.5 h-3.5 text-emerald-700 accent-emerald-700 cursor-pointer"
              />
              <span>{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Number of Proposals Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-stone-800 block">Number of Proposals</label>
        <div className="space-y-1.5">
          {proposalRanges.map((prop) => (
            <label
              key={prop.label}
              className="flex items-center gap-2.5 text-xs text-stone-700 hover:text-stone-900 cursor-pointer select-none font-medium"
            >
              <input
                type="radio"
                name="proposalsFilter"
                checked={isProposalSelected(prop)}
                onChange={() =>
                  onChange({
                    ...filters,
                    minProposals: prop.min,
                    maxProposals: prop.max,
                  })
                }
                className="w-3.5 h-3.5 text-emerald-700 accent-emerald-700 cursor-pointer"
              />
              <span>{prop.label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};
