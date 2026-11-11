import React from "react";
import {
  Compass,
  Users,
  Briefcase,
  FileText,
  User,
  Star,
  Shield,
  Sparkles,
  ArrowRight,
  PlusSquare,
  GraduationCap,
  Crown,
  KeyRound
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Badge } from "../common/Badge";

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenPlusPlan: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenPlusPlan,
}) => {
  const { currentUser } = useAuth();
  const isPlus = Boolean(currentUser?.isPlusMember);

  // Filter navigation items strictly based on role to keep everything clean
  const getNavItems = () => {
    const common = [
      { id: "browse", label: "Find Project", icon: Compass, badge: "Feed" },
      { id: "reviews", label: "Rating & Reviews", icon: Star, badge: "5 Marks" },
    ];

    if (!currentUser) {
      return [
        ...common,
        { id: "login", label: "Sign In", icon: KeyRound, badge: "Auth" },
        { id: "register", label: "Register", icon: User, badge: "Join" },
      ];
    }

    if (currentUser.role === "student") {
      return [
        { id: "browse", label: "Find Project", icon: Compass, badge: "Feed" },
        { id: "recommended", label: "Recommended For You", icon: Sparkles, badge: "5 Marks", highlight: true },
        { id: "matcher", label: "Talent Matcher", icon: Users, badge: "Bonus 5M", bonus: true },
        { id: "my-proposals", label: "My Proposals", icon: FileText, badge: "Status" },
        { id: "profile", label: "Student Profile & Portfolio", icon: User, badge: "Skills" },
        { id: "reviews", label: "Rating & Reviews", icon: Star, badge: "5 Marks" },
      ];
    }

    if (currentUser.role === "client") {
      return [
        { id: "browse", label: "Find Project", icon: Compass, badge: "Feed" },
        { id: "post-project", label: "Post a Project", icon: PlusSquare, badge: "Post" },
        { id: "client-dashboard", label: "Client Management", icon: Briefcase, badge: "Hire/Review", highlight: true },
        { id: "matcher", label: "Talent Matcher", icon: Users, badge: "Bonus 5M", bonus: true },
        { id: "reviews", label: "Rating & Reviews", icon: Star, badge: "5 Marks" },
      ];
    }

    if (currentUser.role === "admin") {
      return [
        { id: "admin", label: "Admin Oversight Console", icon: Shield, badge: "10 Marks", highlight: true },
        { id: "browse", label: "Browse All Projects", icon: Compass, badge: "Feed" },
        { id: "matcher", label: "Talent Matcher", icon: Users, badge: "Bonus 5M", bonus: true },
        { id: "reviews", label: "Rating & Reviews", icon: Star, badge: "5 Marks" },
      ];
    }

    return common;
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 shrink-0 bg-[#F8F5EE] border-r border-[#E7E1D5] min-h-[calc(100vh-65px)] flex flex-col justify-between p-4 hidden md:flex text-stone-900 transition-colors">
      <div className="space-y-6">
        {/* Logo matching Prilans mockup */}
        <div className="flex items-center gap-2.5 px-3 py-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
            <GraduationCap className="w-5 h-5 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-stone-900">Prilans</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">DIU</span>
            </div>
            <p className="text-[10px] text-stone-500 -mt-0.5">Student Freelance Hub</p>
          </div>
        </div>

        {/* User Card matching Mockup */}
        <div className="p-3 bg-white border border-[#E7E1D5] rounded-2xl flex items-center gap-3 relative overflow-hidden shadow-xs">
          {currentUser ? (
            <>
              {isPlus && (
                <div className="absolute top-1.5 right-1.5">
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    <Crown className="w-2.5 h-2.5 text-amber-600" />
                    PLUS
                  </span>
                </div>
              )}

              <img
                src={
                  currentUser.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                }
                alt={currentUser.name}
                className={`w-10 h-10 rounded-xl object-cover ring-2 ${
                  isPlus ? "ring-amber-400" : "ring-stone-200"
                }`}
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-stone-900 truncate">
                  {currentUser.name}
                </h4>
                <p className="text-[10px] text-stone-500 truncate capitalize">
                  {currentUser.role} Account
                </p>
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-bold text-stone-900">Guest Visitor</p>
                <p className="text-[10px] text-stone-500">Sign in to your account</p>
              </div>
              <button
                onClick={() => onSelectTab("login")}
                className="px-2.5 py-1 bg-stone-900 hover:bg-black text-white rounded-lg text-xs font-bold shrink-0"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-3 mb-2">
            Assessment Menu
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? "bg-white text-stone-900 border border-[#DCD5C8] font-bold shadow-xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-[#EFE8DD]"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? "text-emerald-700"
                        : "text-stone-400 group-hover:text-stone-700"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ${
                      item.bonus
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : item.highlight
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                        : isActive
                        ? "bg-stone-900 text-white"
                        : "bg-[#EFE8DD] text-stone-500 group-hover:text-stone-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Plus Plan Promo Box matching Mockup in Creamy Theme */}
      <div className="mt-6 p-4 bg-white border border-amber-200/90 rounded-2xl relative overflow-hidden shadow-xs group">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Plus Plan</span>
          </div>
          {isPlus && (
            <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              ACTIVE
            </span>
          )}
        </div>

        <p className="text-[11px] text-stone-600 leading-snug mb-3">
          {isPlus
            ? "Your Plus perks are active! Priority placement & exclusive projects unlocked."
            : "Get exclusive project opportunities and apply for the top positions available today."}
        </p>

        <button
          onClick={onOpenPlusPlan}
          className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 group transition-colors"
        >
          <span>{isPlus ? "Manage Plus Plan" : "Upgrade Now"}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </aside>
  );
};
