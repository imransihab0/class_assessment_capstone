import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "../../context/AuthContext";
import {
  Sparkles,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Star,
  Award,
  Crown,
  Check,
  GraduationCap
} from "lucide-react";

interface PlusPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlusPlanModal: React.FC<PlusPlanModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const togglePlus = useMutation(api.users.togglePlusMembership);
  const [isActivating, setIsActivating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isAlreadyPlus = Boolean(currentUser?.isPlusMember);

  const handleActivate = async (tier: string) => {
    if (!currentUser) return;
    try {
      setIsActivating(true);
      await togglePlus({
        userId: currentUser._id,
        isPlusMember: !isAlreadyPlus,
        tier,
      });

      setSuccessMessage(
        !isAlreadyPlus
          ? "🎉 Congratulations! Plus Plan has been activated on your profile."
          : "Plus Plan downgraded to Standard tier."
      );
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Prilans Plus Plan Membership"
      subtitle="Exclusive perks designed to help DIU students win high-paying freelance projects"
      maxWidth="xl"
    >
      <div className="space-y-6">
        {successMessage && (
          <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs font-bold text-center animate-in fade-in">
            {successMessage}
          </div>
        )}

        {/* Hero banner */}
        <div className="bg-gradient-to-r from-amber-50 via-emerald-50 to-teal-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
            <Crown className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              Accelerate Your Student Freelance Career
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 uppercase">
                Plus Benefits
              </span>
            </h4>
            <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
              Plus members receive <strong>3x more client profile visits</strong> and <strong>first-priority ranking</strong> in the employer candidate lists.
            </p>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E7E1D5] space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Priority Proposal Placement</span>
            </div>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              Your bids are pinned at the top with a distinctive gold border so employers see you first.
            </p>
          </div>

          <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E7E1D5] space-y-1.5">
            <div className="flex items-center gap-2 text-amber-800 font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Verified DIU Gold Pro Badge</span>
            </div>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              A verified institution badge proves your academic credibility and skills authenticity.
            </p>
          </div>

          <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E7E1D5] space-y-1.5">
            <div className="flex items-center gap-2 text-teal-800 font-bold">
              <Star className="w-4 h-4 text-teal-600" />
              <span>Exclusive High-Budget Jobs</span>
            </div>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              Apply to verified client projects with budgets over $500 reserved exclusively for Plus talent.
            </p>
          </div>

          <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E7E1D5] space-y-1.5">
            <div className="flex items-center gap-2 text-purple-800 font-bold">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Unlimited Bids & AI Matching</span>
            </div>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              No proposal quotas. Unlimited applications with instant automated skill matching recommendations.
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Card 1: DIU Student Free Special */}
          <div className="p-5 rounded-2xl border-2 border-emerald-600 bg-emerald-50/40 relative flex flex-col justify-between shadow-xs">
            <div className="absolute -top-3 left-4 bg-emerald-700 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Recommended for DIU
            </div>

            <div>
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm mb-1">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>DIU Student Plan</span>
              </div>
              <div className="flex items-baseline gap-1 my-2">
                <span className="text-3xl font-black text-stone-900">$0</span>
                <span className="text-xs text-stone-500">/ 100% Free for DIU Students</span>
              </div>
              <p className="text-[11px] text-stone-600 mb-4">
                Sponsored by Dept. of Software Engineering for capstone students.
              </p>

              <ul className="space-y-2 text-xs text-stone-700 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Unlimited Proposal Submissions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Priority Placement on Client Bids</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Verified DIU Student Badge</span>
                </li>
              </ul>
            </div>

            <Button
              size="sm"
              onClick={() => handleActivate("DIU Student Plus")}
              isLoading={isActivating}
              className={`w-full font-bold ${
                isAlreadyPlus
                  ? "bg-[#FAF7F2] hover:bg-[#F4EFE6] text-stone-700 border border-[#DDD3C2]"
                  : "bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
              }`}
            >
              {isAlreadyPlus ? "Cancel Plus Membership" : "Activate Free Student Plus"}
            </Button>
          </div>

          {/* Card 2: Professional Freelancer */}
          <div className="p-5 rounded-2xl border border-[#E7E1D5] bg-white flex flex-col justify-between shadow-xs">
            <div>
              <div className="text-stone-900 font-bold text-sm mb-1">External Freelancer</div>
              <div className="flex items-baseline gap-1 my-2">
                <span className="text-3xl font-black text-stone-900">$9.99</span>
                <span className="text-xs text-stone-500">/ month</span>
              </div>
              <p className="text-[11px] text-stone-500 mb-4">
                Standard subscription for non-institutional freelancers.
              </p>

              <ul className="space-y-2 text-xs text-stone-600 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>50 Bids / Month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>Standard Pro Badge</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>Proposal Analytics</span>
                </li>
              </ul>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleActivate("Pro Freelancer")}
              isLoading={isActivating}
              className="w-full text-xs font-semibold"
            >
              Choose Pro Plan
            </Button>
          </div>
        </div>

        <div className="pt-2 text-center text-[11px] text-stone-500">
          Logged in as: <strong>{currentUser?.name}</strong> • Status:{" "}
          <span className={isAlreadyPlus ? "text-emerald-700 font-bold" : "text-stone-500"}>
            {isAlreadyPlus ? "Active Plus Member ★" : "Standard Tier"}
          </span>
        </div>
      </div>
    </Modal>
  );
};
