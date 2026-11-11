import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { RatingStars } from "../common/RatingStars";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "../../context/AuthContext";
import { Id } from "../../../convex/_generated/dataModel";
import { Star } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: Id<"projects"> | null;
  toUserId: Id<"users"> | null;
  toUserName: string;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  projectId,
  toUserId,
  toUserName,
}) => {
  const { currentUser } = useAuth();
  const submitReview = useMutation(api.reviews.submitReview);

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !projectId || !toUserId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!comment.trim()) {
      setError("Please write a feedback comment.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await submitReview({
        projectId,
        fromUserId: currentUser._id,
        toUserId,
        rating,
        comment,
      });

      setComment("");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Performance Review & Rating"
      subtitle={`Evaluating: ${toUserName} for project completion`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            {error}
          </div>
        )}

        <div className="text-center py-3 bg-[#FAF7F2] rounded-xl border border-[#E7E1D5] space-y-2">
          <label className="text-xs font-semibold text-stone-700 block">
            Select Star Rating:
          </label>
          <div className="flex justify-center">
            <RatingStars
              rating={rating}
              size="lg"
              interactive
              onRatingChange={(r) => setRating(r)}
            />
          </div>
          <span className="text-xs text-amber-600 font-bold block">
            {rating === 5
              ? "5.0 - Outstanding Work! ★★★★★"
              : rating === 4
              ? "4.0 - Very Good ★★★★☆"
              : rating === 3
              ? "3.0 - Satisfactory ★★★☆☆"
              : `${rating}.0 Stars`}
          </span>
        </div>

        <div>
          <label className="text-xs font-semibold text-stone-700 block mb-1">
            Detailed Review & Feedback *
          </label>
          <textarea
            required
            rows={4}
            placeholder="Share feedback on technical quality, communication, deadline adherence..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-[#E7E1D5] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="pt-3 border-t border-[#E7E1D5] flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting} className="font-bold">
            Publish Review (5 Marks)
          </Button>
        </div>
      </form>
    </Modal>
  );
};
