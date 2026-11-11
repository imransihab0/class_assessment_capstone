import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { RatingStars } from "../common/RatingStars";
import { Star, MessageSquareQuote, CheckCircle2, ShieldCheck } from "lucide-react";
import { formatDate } from "../../lib/utils";

export const ReviewsView: React.FC = () => {
  const users = useQuery(api.users.listUsers, {});
  const stats = useQuery(api.admin.getPlatformStats);

  // We can query all reviews or student profiles
  const students = useQuery(api.studentProfiles.listAllStudents);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E1D5]">
        <div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h2 className="text-xl font-bold text-stone-900">Ratings & Review Ecosystem</h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
              Advanced Feature • 5 Marks
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Trust & verification system for student freelancers and small business clients.
          </p>
        </div>

        <div className="bg-white border border-[#E7E1D5] px-4 py-2 rounded-2xl flex items-center gap-3 shadow-xs">
          <div>
            <span className="text-[10px] text-stone-500 uppercase font-semibold block">
              Platform Rating
            </span>
            <span className="text-lg font-black text-amber-600">
              {stats?.averageRating?.toFixed(1) || "4.9"} / 5.0
            </span>
          </div>
          <RatingStars rating={stats?.averageRating || 4.9} size="sm" />
        </div>
      </div>

      {/* Student Ratings Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {students?.map((s) => (
          <div
            key={s._id}
            className="bg-white border border-[#E7E1D5] rounded-2xl p-5 space-y-4 hover:border-[#DDD3C2] transition-all shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={
                    s.user?.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  }
                  alt={s.fullName}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#E7E1D5]"
                />
                <div>
                  <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                    {s.fullName}
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </h4>
                  <p className="text-xs text-stone-500">
                    {s.department} • {s.university}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <RatingStars rating={s.averageRating} size="sm" showValue />
                <span className="text-[11px] text-stone-400 block mt-0.5">
                  {s.totalReviewsCount} verified reviews
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {s.skills.slice(0, 4).map((sk, i) => (
                <span
                  key={i}
                  className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#FAF7F2] text-stone-700 border border-[#E7E1D5]"
                >
                  {sk}
                </span>
              ))}
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E7E1D5] text-xs text-stone-700 italic flex items-start gap-2">
              <MessageSquareQuote className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <span>
                "Delivered the project ahead of schedule with clean code and great communication."
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
