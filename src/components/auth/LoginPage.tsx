import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { UserRole } from "../../types";
import { Lock, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "../common/Button";

interface LoginPageProps {
  onLoginSuccess: (role: UserRole) => void;
  onNavigateRegister: () => void;
  onNavigateHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateRegister,
  onNavigateHome,
}) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const user = await login(email, password);
      onLoginSuccess(user.role);
    } catch (err: any) {
      setError(err?.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto p-4">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={onNavigateHome}
          className="text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors inline-flex items-center gap-1.5"
        >
          ← Back to Marketplace
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-[#E7E1D5] rounded-3xl p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 rounded-2xl bg-[#F4EFE6] border border-[#E7E1D5] flex items-center justify-center mx-auto text-emerald-800 font-black text-lg shadow-xs">
            P
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Sign In</h1>
          <p className="text-xs text-stone-500">
            Enter your email and password to access your account
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E7E1D5] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E7E1D5] rounded-xl pl-10 pr-10 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs gap-1.5"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        {/* Switch to Register */}
        <div className="pt-2 text-center text-xs text-stone-500 border-t border-[#E7E1D5]">
          <span>Don't have an account? </span>
          <button
            type="button"
            onClick={onNavigateRegister}
            className="text-emerald-800 font-bold hover:underline"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
};
