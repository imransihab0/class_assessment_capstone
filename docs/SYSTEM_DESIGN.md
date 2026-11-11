# System Design & Architecture Document
## Course: SE331 - Software Engineering Design Capstone Project
### Assessment 2: Student Freelance & Project Marketplace ("SkillBridge DIU / Prilans")

---

### 1. Executive Summary & Team Division

| Role | Member Responsibilities | Deliverables |
| :--- | :--- | :--- |
| **Member 1** | **Core System Design & Backend Design** | System Architecture, ERD, Schema Definition, Convex Backend Functions, Matching Algorithms, Seed Data |
| **Member 2** | **Basic Project Structure & Infrastructure** | Scaffolding (Vite + React + TS), TanStack Query / Routing, Context & Role Switcher, Base Layout & Components, Vercel Config |
| **Member 3** | **Frontend Engineering & User Experience** | UI Matching Mock Screenshot, Browse & Filter Pages, Application Flow, Portfolio Manager, Rating UI, Admin Dashboard |

---

### 2. High-Level System Architecture

The platform connects university students with small businesses and individuals seeking technical and creative services. The architecture utilizes a modern reactive Jamstack pattern:

```mermaid
graph TD
    Client[Browser / Client App: React + Vite + TypeScript]
    TanStack[TanStack Query Cache & State Management]
    Router[Routing & Navigation System]
    ConvexClient[Convex React Client / WebSocket Sync]
    
    subgraph Frontend["Frontend Layer (Vercel Edge Hosted)"]
        Client --> Router
        Router --> TanStack
        TanStack --> ConvexClient
    end

    subgraph Backend["Convex Cloud Realtime Backend"]
        ConvexClient <--> WS[Realtime WebSocket Gateway]
        WS --> QueryEngine[Query & Mutation Engine]
        QueryEngine --> MatchingEngine[Skill Matching & Recommendation Engine]
        QueryEngine --> Tables[(Document Storage Tables)]
        Tables --> DB_Users[users]
        Tables --> DB_Profiles[studentProfiles]
        Tables --> DB_Portfolios[portfolios]
        Tables --> DB_Projects[projects]
        Tables --> DB_Apps[applications]
        Tables --> DB_Reviews[reviews]
        Tables --> DB_Notifs[notifications]
    end
```

---

### 3. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USER ||--o{ STUDENT_PROFILE : "has profile"
    USER ||--o{ PROJECT : "posts (as client)"
    USER ||--o{ APPLICATION : "submits (as student)"
    USER ||--o{ REVIEW : "writes/receives"
    USER ||--o{ NOTIFICATION : "receives"
    
    STUDENT_PROFILE ||--o{ PORTFOLIO : "contains"
    
    PROJECT ||--o{ APPLICATION : "receives"
    PROJECT ||--o{ REVIEW : "evaluated by"

    USER {
        id string PK
        name string
        email string
        role string
        avatar string
        bio string
        createdAt number
    }

    STUDENT_PROFILE {
        id string PK
        userId string FK
        university string
        department string
        studentId string
        skills array
        experienceLevel string
        hourlyRate number
        availability string
        bio string
        githubUrl string
        linkedinUrl string
        averageRating number
        totalReviewsCount number
    }

    PORTFOLIO {
        id string PK
        studentId string FK
        title string
        description string
        category string
        projectUrl string
        imageUrl string
        skills array
        completedDate string
    }

    PROJECT {
        id string PK
        clientId string FK
        title string
        description string
        category string
        requiredSkills array
        experienceLevel string
        projectType string
        budget number
        location string
        deadline string
        proposalsCount number
        status string
        createdAt number
    }

    APPLICATION {
        id string PK
        projectId string FK
        studentId string FK
        coverLetter string
        proposedRate number
        estimatedTimelineDays number
        status string
        clientFeedback string
        createdAt number
        updatedAt number
    }

    REVIEW {
        id string PK
        projectId string FK
        fromUserId string FK
        toUserId string FK
        fromRole string
        rating number
        comment string
        createdAt number
    }

    NOTIFICATION {
        id string PK
        userId string FK
        title string
        message string
        type string
        read boolean
        link string
        createdAt number
    }
```

---

### 4. Skill Matching & Recommendation Engine Formulation

The platform features two distinct algorithmic matching mechanisms:

#### A. Skill-Based Project Recommendations (For Students)
Recommends projects to students based on skill alignment:
$$\text{MatchScore}_{\text{proj}}(S, P) = \left( \frac{|Skills_S \cap Skills_P|}{|Skills_P|} \times 0.70 \right) + \left( \text{ExpMatch}(E_S, E_P) \times 0.30 \right)$$
- If required skills overlap $\ge 40\%$, the project is flagged as a "Recommended Match".

#### B. Bonus Challenge: Talent Matcher (Student Recommendations for Projects)
Ranks students suitable for a specific project request:
$$\text{CandidateScore}(P, S) = w_1 \cdot \text{SkillOverlap} + w_2 \cdot \text{RatingFactor} + w_3 \cdot \text{ExpFactor} + w_4 \cdot \text{PortfolioRelevance}$$
Where:
- $w_1 = 0.50$ (Direct skill intersection)
- $w_2 = 0.25$ (Normalized student rating / 5.0)
- $w_3 = 0.15$ (Experience level parity)
- $w_4 = 0.10$ (Presence of verified portfolio items matching the project category)

---

### 5. Application Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> Pending: Student Submits Application
    Pending --> Shortlisted: Client Reviews & Shortlists
    Pending --> Rejected: Client Declines
    Shortlisted --> Accepted: Client Hires Student
    Shortlisted --> Rejected: Client Declines
    Accepted --> InProgress: Work Underway
    InProgress --> Completed: Project Delivered & Approved
    Completed --> Reviewed: Client & Student Submit Ratings
    Reviewed --> [*]
```

---

### 6. Backend API & Convex Functions Catalog

- `users.ts`: `getCurrentUser`, `listUsers`, `switchRole`, `createUser`
- `studentProfiles.ts`: `getProfile`, `upsertProfile`, `listTopStudents`, `getStudentById`
- `portfolios.ts`: `listPortfolios`, `addPortfolio`, `deletePortfolio`, `updatePortfolio`
- `projects.ts`: `listProjects`, `getProjectById`, `createProject`, `updateProjectStatus`, `listClientProjects`
- `applications.ts`: `applyForProject`, `getStudentApplications`, `getProjectApplications`, `updateApplicationStatus`
- `reviews.ts`: `submitReview`, `getUserReviews`, `getProjectReview`
- `matching.ts`: `getRecommendedProjectsForStudent`, `getRecommendedStudentsForProject` (Bonus Challenge)
- `admin.ts`: `getPlatformStats`, `getAdminOverview`, `moderateProject`, `moderateUser`
- `seed.ts`: Realistic initial dataset for DIU student profiles, demo jobs, and portfolios
