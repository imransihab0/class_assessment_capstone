import React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "dark";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const variants = {
    primary:
      "bg-emerald-700 hover:bg-emerald-800 text-white focus:ring-emerald-600 shadow-sm active:scale-[0.98]",
    secondary:
      "bg-[#EFE8DD] hover:bg-[#E4DCCE] text-stone-900 border border-[#DDD3C2] focus:ring-stone-400 active:scale-[0.98]",
    outline:
      "bg-white hover:bg-[#FAF8F5] text-stone-700 border border-[#DCD5C8] hover:border-stone-400 focus:ring-stone-400 shadow-xs",
    danger:
      "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 focus:ring-rose-500",
    ghost:
      "bg-transparent text-stone-600 hover:text-stone-900 hover:bg-[#EFEAE1] focus:ring-stone-400",
    dark:
      "bg-stone-900 hover:bg-black text-white border border-stone-800 focus:ring-stone-700 shadow-sm active:scale-[0.98]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-xs sm:text-sm gap-2",
    lg: "px-5 py-2.5 text-sm sm:text-base gap-2.5",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block animate-spin mr-2">◌</span>
      ) : null}
      {children}
    </button>
  );
};
