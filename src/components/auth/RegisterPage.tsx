import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { UserRole } from "../../types";
import { Lock, Mail, User, Eye, EyeOff, ArrowRight, GraduationCap, Briefcase } from "lucide-react";
import { Button } from "../common/Button";

interface RegisterPageProps {
  onRegisterSuccess: (role: UserRole) => void;
  onNavigateLogin: () => void;
  onNavigateHome: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegisterSuccess,
  onNavigateLogin,
  onNavigateHome,
}) => {
  const { registerUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "client">("student");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const user = await registerUser(name, email, role, password);
      onRegisterSuccess(user.role);
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please try again.");
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
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Create Account</h1>
          <p className="text-xs text-stone-500">
            Select your role and get started on Prilans
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
          {/* Role Selection (Student or Client only; Admin accounts cannot be self-registered) */}
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  role === "student"
                    ? "bg-[#F4EFE6] border-emerald-600 shadow-xs ring-1 ring-emerald-600"
                    : "bg-[#FAF7F2] border-[#E7E1D5] hover:border-[#DDD3C2]"
                }`}
              >
                <GraduationCap className={`w-5 h-5 ${role === "student" ? "text-emerald-700" : "text-stone-500"}`} />
                <span className="text-xs font-bold text-stone-900">Student</span>
                <span className="text-[10px] text-stone-500">Find gigs & build portfolio</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("client")}
                className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  role === "client"
                    ? "bg-[#F4EFE6] border-emerald-600 shadow-xs ring-1 ring-emerald-600"
                    : "bg-[#FAF7F2] border-[#E7E1D5] hover:border-[#DDD3C2]"
                }`}
              >
                <Briefcase className={`w-5 h-5 ${role === "client" ? "text-emerald-700" : "text-stone-500"}`} />
                <span className="text-xs font-bold text-stone-900">Client</span>
                <span className="text-[10px] text-stone-500">Post projects & hire students</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E7E1D5] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
              />
            </div>
          </div>

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
                placeholder="At least 6 characters"
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
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        {/* Switch to Login */}
        <div className="pt-2 text-center text-xs text-stone-500 border-t border-[#E7E1D5]">
          <span>Already have an account? </span>
          <button
            type="button"
            onClick={onNavigateLogin}
            className="text-emerald-800 font-bold hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};
