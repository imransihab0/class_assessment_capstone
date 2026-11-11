# Software Engineering Design Capstone Project
## Course: SE331 - Assessment 2
### Project Title: Student Freelance & Project Marketplace ("SkillBridge DIU / Prilans")
**Institution:** Daffodil International University (DIU)  
**Faculty:** Science and Information Technology  
**Department:** Department of Software Engineering  

---

## 🎯 Project Overview & Problem Statement
Many university students possess valuable technical and creative skills but struggle to find opportunities to apply them. At the same time, small businesses and individuals need affordable services such as website development, graphic design, content writing, and programming.

This project delivers a responsive freelance marketplace that connects students with clients needing their services, faithfully styled after the assessment specification mockups.

---

## 👥 Three-Part Division of Responsibility

| Member | Focus Area | Responsibilities & Deliverables |
| :--- | :--- | :--- |
| **Member 1** | **Core System Design & Backend Design** | • System Architecture & ERD Diagram (`docs/SYSTEM_DESIGN.md`)<br>• Realtime Database Schema (`convex/schema.ts`)<br>• Query & Mutation Business Logic (`convex/*.ts`)<br>• Recommendation & Matching Algorithms (`convex/matching.ts`)<br>• Database Seeding (`convex/seed.ts`) |
| **Member 2** | **Basic Structure of the Project** | • Scaffolding with Vite.js + React 18 + TypeScript (`docs/PROJECT_STRUCTURE.md`)<br>• TanStack Query state hydration & client caching<br>• Modular Navigation & Assessment Persona Switcher (`src/context/AuthContext.tsx`)<br>• Vercel configuration & SPA rewrites (`vercel.json`)<br>• Production bundling pipeline |
| **Member 3** | **Frontend & User Experience** | • Pixel-perfect UI mirroring problem statement mockup (`docs/FRONTEND_GUIDE.md`)<br>• Job Browsing & Search/Filter Panels (`src/components/projects/`)<br>• Student Skill Profile & Portfolio Editor (`src/components/profile/`)<br>• Client Proposal Review & Hiring Workflow (`src/components/client/`)<br>• Bonus Talent Matching UI (`src/components/matching/`)<br>• Admin Oversight Dashboard (`src/components/admin/`) |

---

## 📊 Feature & Marks Breakdown (88 / 88 Marks)

### 1. Required Features (63 Marks)
| Feature | Marks | Status | Implementation Details |
| :--- | :---: | :---: | :--- |
| **Student registration/login** | **8** | ✅ Complete | Role-based accounts, auth state, and interactive persona switcher in top bar |
| **Create student skill profile** | **8** | ✅ Complete | University, department, student ID, experience level, rate, and skill tags |
| **Publish a project/job request** | **8** | ✅ Complete | Multi-category job creator with dynamic skill tags and budget models |
| **Browse available projects** | **7** | ✅ Complete | Card feed matching mockup with verified badge, country, bids, and budget |
| **Search/filter projects** | **7** | ✅ Complete | Realtime filters for category, experience, project type, price, and proposal count |
| **Apply for a project** | **8** | ✅ Complete | Modal submission with custom pitch, bid amount, and timeline |
| **View application status** | **7** | ✅ Complete | Real-time status tracking (Pending, Shortlisted, Accepted, Rejected, Completed) |
| **Admin dashboard** | **10** | ✅ Complete | Platform KPIs, category distribution, user suspension, and job moderation |
| **Subtotal** | **63** | | **100% Complete** |

### 2. Advanced Features (20 Marks)
| Feature | Marks | Status | Implementation Details |
| :--- | :---: | :---: | :--- |
| **Skill-based project recommendations** | **5** | ✅ Complete | Mathematical skill overlap algorithm recommending high-fit projects |
| **Student portfolio management** | **5** | ✅ Complete | Exhibit management with title, category, description, live links, and image |
| **Project application status updates** | **5** | ✅ Complete | Client dashboard to Shortlist, Accept/Hire, or Decline applicants |
| **Rating and review system** | **5** | ✅ Complete | Verified 5-star ratings, testimonials, and dynamic student average calculation |
| **Subtotal** | **20** | | **100% Complete** |

### 3. Bonus Challenge (5 Marks)
| Feature | Marks | Status | Implementation Details |
| :--- | :---: | :---: | :--- |
| **Student Recommendation Matching Mechanism** | **5** | ✅ Complete | Algorithmic talent matcher ranking students by skill overlap (50%), rating (25%), experience level (15%), and portfolio relevance (10%) |
| **Total Marks Available** | **88 / 88** | | **All Requirements Satisfied** |

---

## 🛠️ Technology Stack
- **Frontend Framework:** React 18 + TypeScript + Vite.js
- **State Management & Caching:** TanStack React Query (`@tanstack/react-query`)
- **Database & Realtime Backend:** Convex Cloud (`https://helpful-mallard-265.convex.cloud`)
- **Styling:** Tailwind CSS + Lucide React Icons
- **Deployment Target:** Vercel (Configured with `vercel.json`)

---

## 🚀 Quickstart & Development Instructions

### 1. Prerequisites
- Node.js (v18+) or Bun (v1.0+)
- Convex account credentials (already configured in `.env.local`)

### 2. Install Dependencies
```bash
npm install
# or
bun install
```

### 3. Start Backend & Development Server
```bash
# Terminal 1: Run Convex functions dev watcher
npx convex dev

# Terminal 2: Run Vite development server
npm run dev
# or
bun run dev
```

Visit `http://localhost:5173` to test the application.

### 4. Build for Production
```bash
npm run build
```

---

## 🌐 Vercel Deployment Guide
1. Push repository to GitHub or GitLab.
2. In the Vercel dashboard, click **Add New Project** and select this repository.
3. Configure the following environment variable in Vercel:
   - `VITE_CONVEX_URL`: `https://helpful-mallard-265.convex.cloud`
4. Click **Deploy**. Vercel will automatically run `npm run build` and route all SPA paths according to `vercel.json`.

---

## 🧪 Testing the Assessment Demo (Examiner Guide)
Use the **Persona Switcher** in the top navigation bar to test all user perspectives:
- **Ahmad Nasrullah (Student):** Browse projects, test the **Skill-Based Recommendations (5M)** tab, submit a proposal, edit skills, and manage portfolio items.
- **HAV Innovations (Client):** Go to **Client Management**, review incoming applications, click **Shortlist** or **Accept & Hire (5M)**, and submit a 5-star review.
- **DIU Capstone Coordinator (Admin):** Open **Admin Dashboard (10M)** to see platform metrics, active jobs breakdown, and toggle account suspension.
- **Bonus Feature (5M):** Open the **Find Freelancers / Matcher** tab to see students ranked for any project with full algorithmic breakdown.
