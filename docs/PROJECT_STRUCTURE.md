# Project Structure & Architecture Guide
## Course: SE331 - Software Engineering Design Capstone Project
### Member 2 Deliverable: Basic Structure of the Project

---

### 1. Repository Directory Structure

```
class_assessment_capstone/
├── convex/                          # Member 1: Realtime Database & Backend
│   ├── schema.ts                    # Full typed schema with indices
│   ├── users.ts                     # User identity, roles, auth
│   ├── studentProfiles.ts           # Student skills & educational profile
│   ├── portfolios.ts                # Portfolio CRUD & project exhibits
│   ├── projects.ts                  # Job posting, browsing, & query filters
│   ├── applications.ts              # Proposal submissions & status workflows
│   ├── reviews.ts                   # Rating & review mechanism
│   ├── matching.ts                  # Algorithmic recommendation engines
│   ├── admin.ts                     # Admin analytics & moderation
│   └── seed.ts                      # Demonstration & grading seed data
├── docs/                            # Capstone Academic Documentation
│   ├── SYSTEM_DESIGN.md             # Member 1: System architecture & ERD
│   ├── PROJECT_STRUCTURE.md         # Member 2: Scaffolding, TanStack & Vercel
│   └── FRONTEND_GUIDE.md            # Member 3: UI, Components, & Workflows
├── src/                             # Member 2 & 3: Application Source
│   ├── assets/                      # Static logos, avatars, icons
│   ├── components/
│   │   ├── common/                  # Reusable UI (Buttons, Badges, Modals, Inputs)
│   │   ├── layout/                  # Navigation Header, Mock-matching Sidebar
│   │   ├── projects/                # Job Card, Filter Sidebar, Post Job Modal
│   │   ├── applications/            # Proposal Modal, Status Tracker Table
│   │   ├── profile/                 # Student Skill Editor, Portfolio Gallery
│   │   ├── matching/                # Bonus Talent Matcher & Recommendation Cards
│   │   └── admin/                   # Platform Analytics & Management Panels
│   ├── context/
│   │   └── AuthContext.tsx          # Realtime Role Switcher (Student/Client/Admin)
│   ├── lib/
│   │   └── utils.ts                 # Formatting, currency, classnames
│   ├── types/
│   │   └── index.ts                 # TypeScript Data Models & Contract Types
│   ├── App.tsx                      # Root App with Tab/Route Management
│   ├── index.css                    # Tailwind CSS directives & theme rules
│   └── main.tsx                     # TanStack Query & Convex Root Provider
├── .env.example                     # Environment template
├── .env.local                       # Local environment variables
├── index.html                       # HTML5 Root Document
├── package.json                     # Scripts, dependencies, metadata
├── postcss.config.js                # PostCSS plugins
├── tailwind.config.js               # Tailwind custom color palette
├── tsconfig.json                    # TypeScript compiler options
├── vercel.json                      # Vercel Deployment SPA rewrites & cache rules
└── vite.config.ts                   # Vite bundler with path aliasing
```

---

### 2. Technology Stack Selection & Rationales

1. **Vite.js & React 18**:
   - Ultra-fast HMR (Hot Module Replacement) and optimized tree-shaken production bundles.
   - Zero-config TypeScript support.

2. **TanStack React Query**:
   - Provides client-side caching, optimistic updates, query invalidation, and seamless integration alongside reactive streams.
   - Synchronizes state gracefully between client components.

3. **Convex Cloud Realtime Backend**:
   - Document-oriented reactive database with end-to-end TypeScript safety.
   - Live query subscriptions: changes to projects, bids, and reviews reflect instantly without manual polling.

4. **Tailwind CSS**:
   - Utility-first design system customized to reproduce the DIU assignment's reference screenshot ("Prilans" design).

---

### 3. Vercel Deployment Configuration

The application is configured for zero-friction Vercel deployment via `vercel.json`:
- **SPA Rewrites**: All incoming route requests `/(.*)` map to `/index.html` preventing 404 errors on deep page refreshes.
- **Cache Headers**: Static assets under `/assets/` are set to `max-age=31536000, immutable`.
- **Environment Variables**: `VITE_CONVEX_URL` configured in Vercel project dashboard.
