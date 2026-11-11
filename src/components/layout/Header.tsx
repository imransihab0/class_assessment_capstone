import React, { useState } from "react";
import {
  Search,
  MapPin,
  Bell,
  CheckCircle2,
  ChevronDown,
  PlusCircle,
  Menu,
  X,
  Sparkles,
  Compass,
  Users,
  Briefcase,
  FileText,
  User as UserIcon,
  Star,
  Shield,
  Crown,
  LogIn,
  LogOut,
  KeyRound,
  GraduationCap
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  locationFilter: string;
  onLocationChange: (loc: string) => void;
  onExecuteSearch: () => void;
  onOpenPostJob: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenPlusPlan: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  locationFilter,
  onLocationChange,
  onExecuteSearch,
  onOpenPostJob,
  onNavigateTab,
  onOpenPlusPlan,
}) => {
  const { currentUser, logout, isLoggedIn } = useAuth();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Live notifications
  const notifications = useQuery(
    api.notifications.getUserNotifications,
    currentUser ? { userId: currentUser._id } : "skip"
  );
  const markAllRead = useMutation(api.notifications.markAllRead);

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;
  const isPlus = Boolean(currentUser?.isPlusMember);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onExecuteSearch();
    }
  };

  const mobileNavItems = [
    { id: "browse", label: "Find Project", icon: Compass },
    { id: "recommended", label: "Recommended For You", icon: Sparkles },
    { id: "matcher", label: "Find Freelancers / Matcher", icon: Users },
    { id: "post-project", label: "Post a Project", icon: PlusCircle },
    { id: "my-proposals", label: "My Proposals", icon: FileText },
    { id: "client-dashboard", label: "Client Management", icon: Briefcase },
    { id: "profile", label: "Student Profile & Portfolio", icon: UserIcon },
    { id: "reviews", label: "Rating & Reviews", icon: Star },
    { id: "admin", label: "Admin Dashboard", icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E7E1D5] px-4 lg:px-8 py-3 transition-colors">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-stone-600 hover:text-stone-900 rounded-xl hover:bg-[#EFE8DD] transition-colors"
          title="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Search Bar Bar Matching the Exam Mockup in Creamy Theme */}
        <div className="flex-1 max-w-2xl flex items-center bg-white border border-[#DCD5C8] rounded-2xl px-2 py-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2 pl-2 flex-1">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              placeholder="Search projects, skills, or titles..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none"
            />
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 border-l border-[#EFEAE1] text-xs text-stone-500">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <select
              value={locationFilter}
              onChange={(e) => onLocationChange(e.target.value)}
              className="bg-transparent text-stone-700 text-xs focus:outline-none cursor-pointer font-medium"
            >
              <option value="Any">Any Location</option>
              <option value="Remote">Remote Only</option>
              <option value="Bangladesh">Bangladesh / DIU</option>
              <option value="United States">United States</option>
              <option value="Germany">Germany</option>
            </select>
          </div>

          <Button
            size="sm"
            variant="dark"
            onClick={onExecuteSearch}
            className="rounded-xl ml-1 font-bold text-xs px-4 py-2 bg-stone-900 hover:bg-black text-white"
          >
            Find Projects
          </Button>
        </div>

        {/* Action Controls & Assessment Persona Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Plus Plan Button */}
          <button
            onClick={onOpenPlusPlan}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isPlus
                ? "bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 shadow-xs"
                : "bg-white text-stone-800 border border-[#DCD5C8] hover:border-amber-400 hover:bg-[#FAF8F5] shadow-xs"
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>{isPlus ? "Plus Active" : "Plus Plan"}</span>
          </button>

          {/* Post Project Shortcut for Clients */}
          <Button
            size="sm"
            onClick={onOpenPostJob}
            className="hidden lg:inline-flex bg-emerald-700 hover:bg-emerald-800 text-white font-bold gap-1.5 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            Post Project
          </Button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 text-stone-500 hover:text-stone-900 rounded-xl hover:bg-[#EFE8DD] transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-600 rounded-full ring-2 ring-white" />
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E7E1D5] rounded-2xl shadow-xl z-50 overflow-hidden text-stone-900">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#EFEAE1] bg-[#FAF8F5]">
                  <span className="text-xs font-bold text-stone-900">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => currentUser && markAllRead({ userId: currentUser._id })}
                      className="text-[11px] text-emerald-700 font-bold hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-[#EFEAE1]">
                  {notifications && notifications.length > 0 ? (
                    notifications.slice(0, 5).map((n) => (
                      <div
                        key={n._id}
                        className={`p-3 text-xs hover:bg-[#FAF8F5] transition-colors ${
                          !n.read ? "bg-amber-50/40" : ""
                        }`}
                      >
                        <p className="font-bold text-stone-900">{n.title}</p>
                        <p className="text-stone-600 mt-0.5">{n.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-stone-400">
                      No notifications yet
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account or Sign In Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[#DCD5C8] transition-all text-left shadow-xs"
              >
                <img
                  src={
                    currentUser.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  }
                  alt={currentUser.name}
                  className={`w-7 h-7 rounded-xl object-cover ring-1 ${
                    isPlus ? "ring-amber-500" : "ring-stone-300"
                  }`}
                />
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-stone-900 leading-tight flex items-center gap-1">
                    <span>{currentUser.name}</span>
                    {isPlus && <Crown className="w-2.5 h-2.5 text-amber-600 shrink-0" />}
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span className="text-[10px] text-stone-500 capitalize font-medium">
                      {currentUser.role} View
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* User Account Menu (Current Logged In User Only - No Demo Switchers) */}
              {showPersonaMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E7E1D5] rounded-2xl shadow-xl z-50 p-2 text-stone-900">
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7E1D5] mb-2">
                    <p className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <span>{currentUser.name}</span>
                      {isPlus && <Crown className="w-3 h-3 text-amber-600" />}
                    </p>
                    <p className="text-[11px] text-stone-500 truncate mt-0.5">{currentUser.email}</p>
                    <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-900 text-white">
                      {currentUser.role} Account
                    </span>
                  </div>

                  <div className="space-y-1">
                    {currentUser.role === "student" && (
                      <button
                        onClick={() => {
                          setShowPersonaMenu(false);
                          onNavigateTab("profile");
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs text-stone-700 hover:bg-[#FAF8F5] transition-colors"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-stone-500" />
                        <span>My Student Profile</span>
                      </button>
                    )}

                    {currentUser.role === "client" && (
                      <button
                        onClick={() => {
                          setShowPersonaMenu(false);
                          onNavigateTab("client-dashboard");
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs text-stone-700 hover:bg-[#FAF8F5] transition-colors"
                      >
                        <Briefcase className="w-3.5 h-3.5 text-stone-500" />
                        <span>My Posted Projects</span>
                      </button>
                    )}

                    {currentUser.role === "admin" && (
                      <button
                        onClick={() => {
                          setShowPersonaMenu(false);
                          onNavigateTab("admin");
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs text-stone-700 hover:bg-[#FAF8F5] transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5 text-stone-500" />
                        <span>Admin Oversight Console</span>
                      </button>
                    )}

                    <div className="pt-1 mt-1 border-t border-[#EFEAE1]">
                      <button
                        onClick={() => {
                          logout();
                          setShowPersonaMenu(false);
                          onNavigateTab("login");
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs text-rose-700 hover:bg-rose-50 transition-colors font-bold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onNavigateTab("login")}
                className="text-xs font-bold"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Button>
              <Button
                size="sm"
                onClick={() => onNavigateTab("register")}
                className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                <span>Register</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-[#E7E1D5] space-y-1 animate-in slide-in-from-top-2 duration-150">
          <p className="text-[10px] font-bold text-stone-500 uppercase px-2 mb-1">
            Menu Navigation
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigateTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold text-stone-700 hover:bg-white hover:text-stone-900 border border-transparent hover:border-[#E7E1D5] transition-all"
                >
                  <Icon className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => {
                onOpenPlusPlan();
                setIsMobileMenuOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs"
            >
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>Plus Plan</span>
            </button>

            <button
              onClick={() => {
                onNavigateTab("login");
                setIsMobileMenuOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-[#DCD5C8] text-stone-800 text-xs font-bold shadow-xs"
            >
              <KeyRound className="w-3.5 h-3.5 text-stone-600" />
              <span>Login Portals</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
