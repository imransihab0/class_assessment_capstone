import React, { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { ProjectCard } from "./components/projects/ProjectCard";
import { FilterSidebar } from "./components/projects/FilterSidebar";
import { PostProjectModal } from "./components/projects/PostProjectModal";
import { ProjectDetailsModal } from "./components/projects/ProjectDetailsModal";
import { ApplyModal } from "./components/applications/ApplyModal";
import { MyProposalsView } from "./components/applications/MyProposalsView";
import { ClientDashboardView } from "./components/client/ClientDashboardView";
import { StudentProfileView } from "./components/profile/StudentProfileView";
import { RecommendedProjectsView } from "./components/matching/RecommendedProjectsView";
import { BonusTalentMatcher } from "./components/matching/BonusTalentMatcher";
import { ReviewsView } from "./components/reviews/ReviewsView";
import { ReviewModal } from "./components/reviews/ReviewModal";
import { PlusPlanModal } from "./components/subscription/PlusPlanModal";
import { AdminDashboardView } from "./components/admin/AdminDashboardView";
import { LoginPage } from "./components/auth/LoginPage";
import { RegisterPage } from "./components/auth/RegisterPage";
import { Project, FilterState, UserRole } from "./types";
import { Id } from "../convex/_generated/dataModel";
import { Sparkles, ArrowUpDown } from "lucide-react";
import { Button } from "./components/common/Button";

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || "/");
  const [activeTab, setActiveTab] = useState<string>("browse");

  // Sync state with browser location URL
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname || "/";
      setCurrentPath(path);

      if (path === "/" || path === "/browse") {
        setActiveTab("browse");
      } else if (path === "/recommended") {
        setActiveTab("recommended");
      } else if (path === "/matcher") {
        setActiveTab("matcher");
      } else if (path === "/my-proposals") {
        setActiveTab("my-proposals");
      } else if (path === "/post-project") {
        setActiveTab("post-project");
      } else if (path === "/client-dashboard") {
        setActiveTab("client-dashboard");
      } else if (path === "/profile") {
        setActiveTab("profile");
      } else if (path === "/reviews") {
        setActiveTab("reviews");
      } else if (path === "/admin") {
        setActiveTab("admin");
      }
    };

    handleLocationChange();
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const navigateTo = (path: string, tab?: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    if (tab) {
      setActiveTab(tab);
    }
  };

  const navigateTab = (tab: string) => {
    setActiveTab(tab);
    const path = tab === "browse" ? "/" : `/${tab}`;
    window.history.pushState({}, "", path);
    setCurrentPath(path);
  };

  // Search & Filter State (faithful to exam question mockup)
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    location: "Any",
    category: "All",
    experienceLevel: "Any",
    projectType: "Any",
    priceRange: "Any",
    minBudget: undefined,
    maxBudget: undefined,
    minProposals: undefined,
    maxProposals: undefined,
    sortBy: "newest",
  });

  // Modals state
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isPlusPlanOpen, setIsPlusPlanOpen] = useState(false);
  const [selectedProjectForDetails, setSelectedProjectForDetails] = useState<Project | null>(null);
  const [selectedProjectForApply, setSelectedProjectForApply] = useState<Project | null>(null);

  // Review Modal state
  const [reviewModalState, setReviewModalState] = useState<{
    isOpen: boolean;
    projectId: Id<"projects"> | null;
    toUserId: Id<"users"> | null;
    toUserName: string;
  }>({
    isOpen: false,
    projectId: null,
    toUserId: null,
    toUserName: "",
  });

  // Query projects from Convex with all filters (including minProposals and maxProposals)
  const projects = useQuery(api.projects.listProjects, {
    search: filters.search || undefined,
    category: filters.category !== "All" ? filters.category : undefined,
    experienceLevel: filters.experienceLevel !== "Any" ? filters.experienceLevel : undefined,
    projectType: filters.projectType !== "Any" ? filters.projectType : undefined,
    minBudget: filters.minBudget,
    maxBudget: filters.maxBudget,
    minProposals: filters.minProposals,
    maxProposals: filters.maxProposals,
    location: filters.location !== "Any" ? filters.location : undefined,
    sortBy: filters.sortBy,
  }) as Project[] | undefined;

  const handleResetFilters = () => {
    setFilters({
      search: "",
      location: "Any",
      category: "All",
      experienceLevel: "Any",
      projectType: "Any",
      priceRange: "Any",
      minBudget: undefined,
      maxBudget: undefined,
      minProposals: undefined,
      maxProposals: undefined,
      sortBy: "newest",
    });
  };

  const handleOpenReviewModal = (
    projectId: Id<"projects">,
    toUserId: Id<"users">,
    toUserName: string
  ) => {
    setReviewModalState({
      isOpen: true,
      projectId,
      toUserId,
      toUserName,
    });
  };

  // Check auth routes
  const isLoginRoute = currentPath === "/login" || currentPath.startsWith("/login");
  const isRegisterRoute = currentPath === "/register";

  if (isLoginRoute) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-stone-900 flex flex-col font-sans">
        <Header
          searchQuery=""
          onSearchChange={() => {}}
          locationFilter="Any"
          onLocationChange={() => {}}
          onExecuteSearch={() => navigateTo("/", "browse")}
          onOpenPostJob={() => setIsPostJobOpen(true)}
          onNavigateTab={(tab) => {
            if (tab === "register") navigateTo("/register");
            else navigateTab(tab);
          }}
          onOpenPlusPlan={() => setIsPlusPlanOpen(true)}
        />
        <main className="flex-1 flex items-center justify-center p-4">
          <LoginPage
            onLoginSuccess={(role) => {
              if (role === "client") {
                navigateTab("client-dashboard");
              } else if (role === "admin") {
                navigateTab("admin");
              } else {
                navigateTab("browse");
              }
            }}
            onNavigateRegister={() => navigateTo("/register")}
            onNavigateHome={() => navigateTo("/", "browse")}
          />
        </main>
      </div>
    );
  }

  if (isRegisterRoute) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-stone-900 flex flex-col font-sans">
        <Header
          searchQuery=""
          onSearchChange={() => {}}
          locationFilter="Any"
          onLocationChange={() => {}}
          onExecuteSearch={() => navigateTo("/", "browse")}
          onOpenPostJob={() => setIsPostJobOpen(true)}
          onNavigateTab={(tab) => {
            if (tab === "login") navigateTo("/login");
            else navigateTab(tab);
          }}
          onOpenPlusPlan={() => setIsPlusPlanOpen(true)}
        />
        <main className="flex-1 flex items-center justify-center p-4">
          <RegisterPage
            onRegisterSuccess={(role) => {
              if (role === "client") {
                navigateTab("client-dashboard");
              } else if (role === "admin") {
                navigateTab("admin");
              } else {
                navigateTab("browse");
              }
            }}
            onNavigateLogin={() => navigateTo("/login")}
            onNavigateHome={() => navigateTo("/", "browse")}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 flex flex-col font-sans">
      {/* Header with Search, Persona Switcher & Plus Action */}
      <Header
        searchQuery={filters.search}
        onSearchChange={(q) => setFilters((prev) => ({ ...prev, search: q }))}
        locationFilter={filters.location}
        onLocationChange={(loc) => setFilters((prev) => ({ ...prev, location: loc }))}
        onExecuteSearch={() => navigateTab("browse")}
        onOpenPostJob={() => setIsPostJobOpen(true)}
        onNavigateTab={(tab) => navigateTab(tab)}
        onOpenPlusPlan={() => setIsPlusPlanOpen(true)}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar (Matching Exam Mockup "Prilans" with interactive Plus Plan) */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => navigateTab(tab)}
          onOpenPlusPlan={() => setIsPlusPlanOpen(true)}
        />

        {/* Content Viewport */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {/* TAB 1: BROWSE PROJECTS (Direct Replica of Problem Statement Mockup) */}
          {activeTab === "browse" && (
            <div className="space-y-6">
              {/* Hero Banner Matching Exam Mockup Screenshot with Creamy Aesthetic */}
              <div className="bg-gradient-to-r from-[#EDE6D8] via-[#FAF7F2] to-[#EDE6D8] border border-[#DDD3C2] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-2xl space-y-2 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 text-emerald-800 border border-[#DDD3C2] text-xs font-semibold shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    SE331 Software Engineering Design Capstone
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
                    Find Millions of Projects Here!
                  </h1>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Explore our newest project opportunities and apply for the top positions available today.
                    Connecting university students with small businesses and individuals who need affordable services.
                  </p>
                </div>
              </div>

              {/* Feed Grid with Left Filter Sidebar Matching Mockup */}
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Filter Sidebar Component */}
                <FilterSidebar
                  filters={filters}
                  onChange={(newFilters) => setFilters(newFilters)}
                  onReset={handleResetFilters}
                  totalResults={projects?.length || 0}
                />

                {/* Right Results & Project Cards List */}
                <div className="flex-1 space-y-4 w-full">
                  {/* Results Header Bar Matching Screenshot */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#E7E1D5] px-4 py-3 rounded-2xl shadow-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-stone-900">Showing Results</span>
                      <span className="text-xs text-stone-500">({projects?.length || 0})</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-stone-500 flex items-center gap-1 font-medium">
                        <ArrowUpDown className="w-3 h-3 text-stone-400" />
                        Sort by:
                      </span>
                      <select
                        value={filters.sortBy}
                        onChange={(e) =>
                          setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
                        }
                        className="bg-[#FAF7F2] border border-[#E7E1D5] rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none cursor-pointer"
                      >
                        <option value="newest">Newest First</option>
                        <option value="budget_high">Budget: High to Low</option>
                        <option value="budget_low">Budget: Low to High</option>
                        <option value="proposals">Lowest Proposals</option>
                      </select>
                    </div>
                  </div>

                  {/* Cards Feed */}
                  {projects && projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projects.map((project) => (
                        <ProjectCard
                          key={project._id}
                          project={project}
                          onApply={(p) => setSelectedProjectForApply(p)}
                          onViewDetails={(p) => setSelectedProjectForDetails(p)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-16 text-center bg-white border border-[#E7E1D5] rounded-2xl space-y-3 shadow-xs">
                      <p className="text-base font-bold text-stone-900">No projects found</p>
                      <p className="text-xs text-stone-500">
                        Try adjusting your search criteria or resetting filters.
                      </p>
                      <Button size="sm" variant="outline" onClick={handleResetFilters}>
                        Reset All Filters
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RECOMMENDED FOR YOU (Advanced Feature 1: 5 Marks) */}
          {activeTab === "recommended" && (
            <RecommendedProjectsView
              onApply={(p) => setSelectedProjectForApply(p)}
              onViewDetails={(p) => setSelectedProjectForDetails(p)}
              onNavigateToProfile={() => navigateTab("profile")}
            />
          )}

          {/* TAB 3: BONUS TALENT MATCHER (Bonus Challenge: 5 Marks) */}
          {activeTab === "matcher" && <BonusTalentMatcher />}

          {/* TAB 4: MY PROPOSALS (Feature 6 & 7: 8 + 7 Marks) */}
          {activeTab === "my-proposals" && (
            <MyProposalsView onNavigateToBrowse={() => navigateTab("browse")} />
          )}

          {/* TAB 5: POST A PROJECT (Feature 3: 8 Marks) */}
          {activeTab === "post-project" && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="p-6 bg-white border border-[#E7E1D5] rounded-3xl space-y-3 text-center shadow-xs">
                <h2 className="text-xl font-bold text-stone-900">Publish a Project / Job Request</h2>
                <p className="text-xs text-stone-500">
                  Feature 3 (8 Marks): Small businesses & individuals publish needs for student talent.
                </p>
                <Button size="md" onClick={() => setIsPostJobOpen(true)} className="font-bold">
                  Open Project Publishing Dialog
                </Button>
              </div>
            </div>
          )}

          {/* TAB 6: CLIENT MANAGEMENT (Advanced Feature 3: 5 Marks) */}
          {activeTab === "client-dashboard" && (
            <ClientDashboardView
              onOpenPostJob={() => setIsPostJobOpen(true)}
              onOpenReviewModal={handleOpenReviewModal}
            />
          )}

          {/* TAB 7: STUDENT SKILL PROFILE & PORTFOLIO (Feature 2 & Advanced Feature 2: 8 + 5 Marks) */}
          {activeTab === "profile" && <StudentProfileView />}

          {/* TAB 8: RATING & REVIEWS (Advanced Feature 4: 5 Marks) */}
          {activeTab === "reviews" && <ReviewsView />}

          {/* TAB 9: ADMIN DASHBOARD (Feature 8: 10 Marks) */}
          {activeTab === "admin" && <AdminDashboardView />}
        </main>
      </div>

      {/* MODALS */}
      <PostProjectModal
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
      />

      <PlusPlanModal
        isOpen={isPlusPlanOpen}
        onClose={() => setIsPlusPlanOpen(false)}
      />

      <ApplyModal
        project={selectedProjectForApply}
        isOpen={!!selectedProjectForApply}
        onClose={() => setSelectedProjectForApply(null)}
        onSuccess={() => {
          navigateTab("my-proposals");
        }}
      />

      <ProjectDetailsModal
        project={selectedProjectForDetails}
        isOpen={!!selectedProjectForDetails}
        onClose={() => setSelectedProjectForDetails(null)}
        onApply={(p) => setSelectedProjectForApply(p)}
        onMatchBonus={() => {
          navigateTab("matcher");
        }}
      />

      <ReviewModal
        isOpen={reviewModalState.isOpen}
        onClose={() =>
          setReviewModalState({
            isOpen: false,
            projectId: null,
            toUserId: null,
            toUserName: "",
          })
        }
        projectId={reviewModalState.projectId}
        toUserId={reviewModalState.toUserId}
        toUserName={reviewModalState.toUserName}
      />
    </div>
  );
}
export default App;
