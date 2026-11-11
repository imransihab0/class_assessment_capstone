import React from "react";
import { Star } from "lucide-react";
import { cn } from "../../lib/utils";

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showValue?: boolean;
  reviewsCount?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxStars = 5,
  size = "md",
  interactive = false,
  onRatingChange,
  showValue = false,
  reviewsCount,
}) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const starSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };

  const current = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, index) => {
          const starVal = index + 1;
          const isFilled = current >= starVal;
          const isHalf = !isFilled && current >= starVal - 0.5;

          return (
            <button
              type="button"
              key={index}
              disabled={!interactive}
              onClick={() => interactive && onRatingChange?.(starVal)}
              onMouseEnter={() => interactive && setHoverRating(starVal)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={cn(
                "transition-transform",
                interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
              )}
            >
              <Star
                className={cn(
                  starSizes[size],
                  isFilled
                    ? "text-amber-400 fill-amber-400"
                    : isHalf
                    ? "text-amber-400 fill-amber-400/50"
                    : "text-slate-600 fill-slate-800"
                )}
              />
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className="text-xs font-semibold text-amber-400 ml-0.5">
          {rating.toFixed(1)}
        </span>
      )}

      {reviewsCount !== undefined && (
        <span className="text-xs text-slate-500">
          ({reviewsCount} {reviewsCount === 1 ? "review" : "reviews"})
        </span>
      )}
    </div>
  );
};
