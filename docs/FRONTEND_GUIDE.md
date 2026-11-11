# Frontend Engineering & User Experience Guide
## Course: SE331 - Software Engineering Design Capstone Project
### Member 3 Deliverable: Frontend & User Experience

---

### 1. UI Blueprint & Reference Mock Reproduction

The user interface is faithfully modeled after the provided capstone assessment specification ("Prilans" / "SkillBridge DIU" Freelance Platform):

```
+---------------------------------------------------------------------------------------------------+
|  [Logo: Prilans]   [ Search Projects, Skills, or Roles... ]   [Remote v]   [Find Projects]  [Role] |
+---------------------------------------------------------------------------------------------------+
| SIDEBAR               | MAIN CONTENT AREA                                                         |
|                       |                                                                           |
| [User Avatar/Info]    | HERO BANNER: "Find Millions of Projects Here!"                            |
| Ahmad Nasrullah       | Subtitle: Explore our newest project opportunities and apply today.        |
| Senior Web Dev        |                                                                           |
|                       | FILTERS (Left Sub-panel)       | PROJECT CARDS FEED                       |
| MAIN MENU:            | - Categories (Web, App, UI/UX) | Showing Results (Total: N)               |
| * Find Projects       | - Experience Level:            | Sort By: Newest v                        |
| * Find Freelancers    |   [x] Any  [ ] Entry Level     | +--------------------------------------+ |
|   (Bonus Talent Match)|   [ ] Intermediate [ ] Expert  | | Let's Collaborate on HAV's Redesign  | |
| * My Proposals        | - Project Type:                | | Verified * Germany * 10 proposals     | |
| * Post a Project      |   [Hourly] [Fixed Price]       | | Skills: [Web Design] [UI/UX] [Figma] | |
| * My Portfolio        | - Price Range:                 | | Budget: $15.00/hr  [ Apply Now ]     | |
| * Client Dashboard    |   [x] Any  [ ] <$100           | +--------------------------------------+ |
| * Admin Dashboard     |   [ ] $100-$500 [ ] $500-$1K   | | Build/Edit Landing Page Course       | |
|                       | - Number of Proposals:         | | Verified * USA * 3 proposals         | |
| [Plus Plan Promo Box] |   [ ] <5  [ ] 5-10  [ ] 10-15  | | Budget: $350.00 Fixed [ Apply Now ]  | |
+---------------------------------------------------------------------------------------------------+
```

---

### 2. Feature-by-Feature Marks Coverage

| No | Feature | Marks Allocated | Component & View |
| :--- | :--- | :--- | :--- |
| 1 | Student Registration / Login | 8 Marks | `AuthContext` + Role Switcher + Auth Modal |
| 2 | Create Student Skill Profile | 8 Marks | `StudentProfileModal` / `ProfileView` |
| 3 | Publish Project / Job Request | 8 Marks | `PostProjectModal` with dynamic skills tagging |
| 4 | Browse Available Projects | 7 Marks | `ProjectFeed` + Responsive Cards |
| 5 | Search & Filter Projects | 7 Marks | `FilterSidebar` + Query search input |
| 6 | Apply for a Project | 8 Marks | `ApplyProposalModal` with rate & cover letter |
| 7 | View Application Status | 7 Marks | `ApplicationsView` (Pending/Accepted/Rejected) |
| 8 | Admin Dashboard | 10 Marks | `AdminDashboardView` (KPIs, Users, Analytics) |
| 9 | Skill-Based Project Recommendations | 5 Marks (Advanced) | `RecommendedProjectsTab` (Overlap %) |
| 10 | Student Portfolio Management | 5 Marks (Advanced) | `PortfolioManager` (Add/Edit projects) |
| 11 | Project Application Status Updates | 5 Marks (Advanced) | `ClientDashboardView` (Shortlist/Hire) |
| 12 | Rating & Review System | 5 Marks (Advanced) | `ReviewModal` & Star Rating Badges |
| 13 | Bonus: Student Recommendation by Skills | 5 Marks (Bonus) | `TalentMatcher` (Skill similarity score) |
| **Total** | **All 13 Assessment Items** | **88 / 88 Marks** | **100% Comprehensive Coverage** |
