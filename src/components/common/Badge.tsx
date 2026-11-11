import React from "react";
import { cn } from "../../lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline" | "skill";
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className,
}) => {
  const base = "inline-flex items-center font-semibold rounded-lg whitespace-nowrap transition-colors";

  const variants = {
    default: "bg-[#EFE8DD] text-stone-800 border border-[#DDD3C2]",
    skill: "bg-[#FAF7F2] text-stone-800 border border-[#DDD3C2] hover:border-stone-400 text-xs px-2.5 py-1 rounded-full",
    success: "bg-emerald-50 text-emerald-800 border border-emerald-200/80",
    warning: "bg-amber-50 text-amber-900 border border-amber-200",
    danger: "bg-rose-50 text-rose-800 border border-rose-200",
    info: "bg-sky-50 text-sky-800 border border-sky-200",
    outline: "bg-white text-stone-700 border border-[#DCD5C8]",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span className={cn(base, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};
