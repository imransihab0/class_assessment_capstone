import { mutation } from "./_generated/server";

export const seedDatabase = mutation({
  handler: async (ctx) => {
    // Check if users already exist
    const existingUsers = await ctx.db.query("users").collect();
    if (existingUsers.length > 0) {
      return { message: "Database already seeded", count: existingUsers.length };
    }

    return await executeSeed(ctx);
  },
});

export const reseedDatabase = mutation({
  handler: async (ctx) => {
    // Clean all collections
    const users = await ctx.db.query("users").collect();
    for (const u of users) await ctx.db.delete(u._id);

    const profiles = await ctx.db.query("studentProfiles").collect();
    for (const p of profiles) await ctx.db.delete(p._id);

    const portfolios = await ctx.db.query("portfolios").collect();
    for (const pf of portfolios) await ctx.db.delete(pf._id);

    const projects = await ctx.db.query("projects").collect();
    for (const pj of projects) await ctx.db.delete(pj._id);

    const apps = await ctx.db.query("applications").collect();
    for (const a of apps) await ctx.db.delete(a._id);

    const reviews = await ctx.db.query("reviews").collect();
    for (const r of reviews) await ctx.db.delete(r._id);

    const notifs = await ctx.db.query("notifications").collect();
    for (const n of notifs) await ctx.db.delete(n._id);

    return await executeSeed(ctx);
  },
});

async function executeSeed(ctx: any) {
  // 1. Create Users
  // Student 1 (Ahmad Nasrullah from the UI mockup with Plus Plan active!)
  const student1Id = await ctx.db.insert("users", {
    name: "Ahmad Nasrullah",
    email: "ahmad.nasrullah@diu.edu.bd",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bio: "Software Engineering Senior @ Daffodil International University | Full Stack Web & UI/UX Specialist",
    location: "Dhaka, Bangladesh",
    isActive: true,
    isPlusMember: true,
    plusTier: "DIU Student Plus",
    createdAt: Date.now() - 30 * 86400000,
  });

  // Student 2 (Sadia Afrin - UI/UX & Graphic Designer)
  const student2Id = await ctx.db.insert("users", {
    name: "Sadia Afrin",
    email: "sadia.se@diu.edu.bd",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    bio: "Creative UI/UX & Brand Identity Designer. 3rd Year Software Engineering at DIU.",
    location: "Dhaka, Bangladesh",
    isActive: true,
    isPlusMember: false,
    createdAt: Date.now() - 25 * 86400000,
  });

  // Student 3 (Tanvir Ahmed - Backend & Python Dev)
  const student3Id = await ctx.db.insert("users", {
    name: "Tanvir Ahmed",
    email: "tanvir.cs@diu.edu.bd",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    bio: "DIU CSE Student specializing in Python, FastAPI, Node.js and scalable backend systems.",
    location: "Sylhet, Bangladesh",
    isActive: true,
    isPlusMember: true,
    plusTier: "DIU Student Plus",
    createdAt: Date.now() - 20 * 86400000,
  });

  // Client 1 (HAV Tech Innovations - Germany)
  const client1Id = await ctx.db.insert("users", {
    name: "HAV Innovations",
    email: "recruitment@havtech.de",
    role: "client",
    avatar: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80",
    bio: "Berlin-based European Design & Tech Agency looking for talented student developers.",
    location: "Berlin, Germany",
    isActive: true,
    createdAt: Date.now() - 40 * 86400000,
  });

  // Client 2 (EduPulse USA)
  const client2Id = await ctx.db.insert("users", {
    name: "EduPulse Global",
    email: "contact@edupulse.org",
    role: "client",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    bio: "EdTech platform in California creating online university preparatory courses.",
    location: "San Francisco, USA",
    isActive: true,
    createdAt: Date.now() - 35 * 86400000,
  });

  // Client 3 (Bengal Shop E-Commerce)
  const client3Id = await ctx.db.insert("users", {
    name: "Bengal Artisans Hub",
    email: "founder@bengalhub.com",
    role: "client",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    bio: "E-Commerce startup supporting local handmade goods across South Asia.",
    location: "Dhaka, Bangladesh",
    isActive: true,
    createdAt: Date.now() - 28 * 86400000,
  });

  // Admin User (Single dedicated admin account: admin@ok.com / admin123)
  const adminId = await ctx.db.insert("users", {
    name: "DIU Capstone Administrator",
    email: "admin@ok.com",
    password: "admin123",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    bio: "Administrator & Assessment Coordinator, Dept. of Software Engineering, Daffodil International University",
    location: "Ashulia Campus, DIU",
    isActive: true,
    createdAt: Date.now() - 60 * 86400000,
  });

  // 2. Create Student Profiles
  await ctx.db.insert("studentProfiles", {
    userId: student1Id,
    fullName: "Ahmad Nasrullah",
    university: "Daffodil International University",
    department: "Software Engineering",
    studentId: "DIU-SE-2022-0491",
    yearOfStudy: "4th Year (Senior)",
    skills: ["Web Design", "UI/UX Design", "Landing Page", "Web Development", "WordPress", "React", "Tailwind CSS", "Figma"],
    experienceLevel: "Intermediate",
    hourlyRate: 15,
    availability: "Available for Work",
    bio: "Passionate front-end developer and UI designer from Daffodil International University. Experienced in crafting modern landing pages, responsive React applications, and WordPress solutions.",
    githubUrl: "https://github.com/ahmad-nasrullah",
    linkedinUrl: "https://linkedin.com/in/ahmad-nasrullah",
    portfolioWebsite: "https://ahmadnasrullah.dev",
    completedProjectsCount: 12,
    averageRating: 4.9,
    totalReviewsCount: 10,
    isVerified: true,
    createdAt: Date.now() - 30 * 86400000,
  });

  await ctx.db.insert("studentProfiles", {
    userId: student2Id,
    fullName: "Sadia Afrin",
    university: "Daffodil International University",
    department: "Software Engineering",
    studentId: "DIU-SE-2023-1102",
    yearOfStudy: "3rd Year",
    skills: ["Graphic Design", "Logo Design", "UI/UX Design", "Figma", "Adobe Photoshop", "Website Redesign"],
    experienceLevel: "Entry Level",
    hourlyRate: 12,
    availability: "Part-Time",
    bio: "Design enthusiast focused on branding, user interface design, visual identity, and social media creative assets.",
    githubUrl: "https://github.com/sadia-designs",
    linkedinUrl: "https://linkedin.com/in/sadia-afrin",
    portfolioWebsite: "https://behance.net/sadiaafrin",
    completedProjectsCount: 8,
    averageRating: 5.0,
    totalReviewsCount: 7,
    isVerified: true,
    createdAt: Date.now() - 25 * 86400000,
  });

  await ctx.db.insert("studentProfiles", {
    userId: student3Id,
    fullName: "Tanvir Ahmed",
    university: "Daffodil International University",
    department: "Computer Science & Engineering",
    studentId: "DIU-CSE-2021-0844",
    yearOfStudy: "Final Year",
    skills: ["Programming & AI", "Python", "Node.js", "Web Development", "PostgreSQL", "FastAPI"],
    experienceLevel: "Expert",
    hourlyRate: 25,
    availability: "Available for Work",
    bio: "Back-end engineer and machine learning enthusiast. Skilled in RESTful APIs, database optimization, and scalable web architectures.",
    githubUrl: "https://github.com/tanvir-tech",
    linkedinUrl: "https://linkedin.com/in/tanvir-ahmed-dev",
    portfolioWebsite: "https://tanvir-portfolio.vercel.app",
    completedProjectsCount: 15,
    averageRating: 4.8,
    totalReviewsCount: 9,
    isVerified: true,
    createdAt: Date.now() - 20 * 86400000,
  });

  // 3. Portfolios
  await ctx.db.insert("portfolios", {
    studentId: student1Id,
    title: "Smart Edu-Learning Portal UI",
    description: "Interactive learning platform with course management, responsive dashboard, and real-time student progress tracking.",
    category: "Web Development",
    projectUrl: "https://smart-edu-diu.vercel.app",
    githubUrl: "https://github.com/ahmad-nasrullah/smart-edu",
    imageUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&auto=format&fit=crop&q=80",
    skills: ["React", "Tailwind CSS", "UI/UX Design"],
    completedDate: "October 2026",
    featured: true,
    createdAt: Date.now() - 15 * 86400000,
  });

  await ctx.db.insert("portfolios", {
    studentId: student1Id,
    title: "HAV Fashion eCommerce Redesign",
    description: "Complete redesign of online apparel storefront optimizing checkout conversion by 28%.",
    category: "Web Design",
    projectUrl: "https://hav-fashion.demo.app",
    githubUrl: "https://github.com/ahmad-nasrullah/hav-fashion",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
    skills: ["Web Design", "Figma", "WordPress", "Landing Page"],
    completedDate: "September 2026",
    featured: true,
    createdAt: Date.now() - 25 * 86400000,
  });

  await ctx.db.insert("portfolios", {
    studentId: student2Id,
    title: "EcoBrand Identity & Mobile Mockups",
    description: "Comprehensive branding kit including logo guidelines, typography, palette, and Figma high-fidelity mobile prototypes.",
    category: "UI/UX Design",
    projectUrl: "https://dribbble.com/shots/ecobrand",
    imageUrl: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&auto=format&fit=crop&q=80",
    skills: ["Graphic Design", "Logo Design", "Figma"],
    completedDate: "August 2026",
    featured: true,
    createdAt: Date.now() - 20 * 86400000,
  });

  // 4. Projects (Faithfully reproducing the Exam Mockup!)
  const proj1Id = await ctx.db.insert("projects", {
    clientId: client1Id,
    clientName: "HAV Innovations",
    clientCompany: "HAV Studios Germany",
    clientAvatar: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80",
    title: "Let's Collaborate on HAV's Website Redesign",
    description: "We are looking for a creative person who can redesign & build beautiful landing pages in WordPress sites. Strong UI/UX sense and clean HTML/CSS skills are essential.",
    category: "Web Design",
    requiredSkills: ["Web Design", "UI/UX Design", "Landing Page", "Web Development", "WordPress"],
    experienceLevel: "Entry Level",
    projectType: "Hourly",
    budget: 15,
    location: "Germany",
    deadline: "2026-12-15",
    proposalsCount: 10,
    status: "open",
    isPlusExclusive: false,
    createdAt: Date.now() - 5 * 86400000,
  });

  const proj2Id = await ctx.db.insert("projects", {
    clientId: client2Id,
    clientName: "EduPulse Global",
    clientCompany: "EduPulse Online Academy",
    clientAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    title: "Build/Edit Landing Page for Online Course",
    description: "Have a current landing page for my course/service already. Can either edit that to set my new course or build a brand new one with high conversion potential.",
    category: "Web Design",
    requiredSkills: ["Website Redesign", "Web Design", "Landing Page", "Graphic Design", "Logo Design", "UI/UX Design"],
    experienceLevel: "Entry Level",
    projectType: "Fixed Price",
    budget: 350,
    location: "United States",
    deadline: "2026-11-30",
    proposalsCount: 30,
    status: "open",
    isPlusExclusive: false,
    createdAt: Date.now() - 4 * 86400000,
  });

  const proj3Id = await ctx.db.insert("projects", {
    clientId: client3Id,
    clientName: "Bengal Artisans Hub",
    clientCompany: "Bengal Handicrafts Ltd.",
    clientAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    title: "Web Designer for E-Commerce Website",
    description: "Need a new e-commerce website on WordPress/Shopify. Redesign menu, layout and create pages and product catalog with smooth checkout integration.",
    category: "Web Development",
    requiredSkills: ["Web Design", "Responsive Design", "Web Development", "WordPress"],
    experienceLevel: "Intermediate",
    projectType: "Hourly",
    budget: 25,
    location: "Bangladesh",
    deadline: "2026-12-01",
    proposalsCount: 15,
    status: "open",
    isPlusExclusive: false,
    createdAt: Date.now() - 3 * 86400000,
  });

  const proj4Id = await ctx.db.insert("projects", {
    clientId: client1Id,
    clientName: "HAV Innovations",
    clientCompany: "HAV Studios Germany",
    clientAvatar: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80",
    title: "Website Designer for Tech SaaS Platform",
    description: "We're looking for a website designer who can help us redesign our company website, we prefer based designs using Figma and modern component libraries.",
    category: "UI/UX Design",
    requiredSkills: ["Web Design", "Adobe Photoshop", "Figma", "Prototyping", "Logo Design"],
    experienceLevel: "Expert",
    projectType: "Fixed Price",
    budget: 500,
    location: "Canada",
    deadline: "2026-12-20",
    proposalsCount: 19,
    status: "open",
    isPlusExclusive: true,
    createdAt: Date.now() - 2 * 86400000,
  });

  const proj5Id = await ctx.db.insert("projects", {
    clientId: client2Id,
    clientName: "EduPulse Global",
    clientCompany: "EduPulse Online Academy",
    clientAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    title: "Full-Stack Python & React Dashboard for Student Analytics",
    description: "Looking for an experienced student to build an interactive analytics dashboard summarizing test scores, course completions, and performance charts.",
    category: "Programming & AI",
    requiredSkills: ["Programming & AI", "Python", "React", "PostgreSQL", "FastAPI"],
    experienceLevel: "Intermediate",
    projectType: "Fixed Price",
    budget: 650,
    location: "Remote",
    deadline: "2026-12-10",
    proposalsCount: 6,
    status: "open",
    isPlusExclusive: true,
    createdAt: Date.now() - 1 * 86400000,
  });

  // 5. Sample Applications
  await ctx.db.insert("applications", {
    projectId: proj1Id,
    studentId: student1Id,
    studentName: "Ahmad Nasrullah",
    studentEmail: "ahmad.nasrullah@diu.edu.bd",
    studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    studentDepartment: "Software Engineering",
    coverLetter: "Hello HAV Innovations team! As a Software Engineering student at DIU with extensive WordPress and Figma experience, I have redesigned 10+ landing pages. I can deliver pixel-perfect responsive layouts within your timeline.",
    proposedRate: 15,
    estimatedTimelineDays: 14,
    status: "shortlisted",
    isPlusApplication: true,
    clientFeedback: "Impressive portfolio and direct experience with similar landing pages!",
    createdAt: Date.now() - 3 * 86400000,
    updatedAt: Date.now() - 1 * 86400000,
  });

  await ctx.db.insert("applications", {
    projectId: proj2Id,
    studentId: student2Id,
    studentName: "Sadia Afrin",
    studentEmail: "sadia.se@diu.edu.bd",
    studentAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    studentDepartment: "Software Engineering",
    coverLetter: "Hi EduPulse! I specialize in educational landing page redesigns and logo enhancement. I would love to make your online course stand out with high-converting visual hierarchy.",
    proposedRate: 320,
    estimatedTimelineDays: 7,
    status: "accepted",
    isPlusApplication: false,
    clientFeedback: "Hired! Looking forward to reviewing the first draft.",
    createdAt: Date.now() - 2 * 86400000,
    updatedAt: Date.now() - 12 * 3600000,
  });

  await ctx.db.insert("applications", {
    projectId: proj3Id,
    studentId: student1Id,
    studentName: "Ahmad Nasrullah",
    studentEmail: "ahmad.nasrullah@diu.edu.bd",
    studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    studentDepartment: "Software Engineering",
    coverLetter: "Assalamu Alaikum! I am very excited to help Bengal Artisans modernize their online store. I have built several WooCommerce and WordPress stores with local payment integration.",
    proposedRate: 22,
    estimatedTimelineDays: 20,
    status: "pending",
    isPlusApplication: true,
    createdAt: Date.now() - 1 * 86400000,
    updatedAt: Date.now() - 1 * 86400000,
  });

  // 6. Sample Reviews
  await ctx.db.insert("reviews", {
    projectId: proj1Id,
    projectTitle: "Let's Collaborate on HAV's Website Redesign",
    fromUserId: client1Id,
    toUserId: student1Id,
    fromName: "HAV Innovations",
    toName: "Ahmad Nasrullah",
    fromRole: "client",
    rating: 5,
    comment: "Ahmad is one of the most diligent student developers we've worked with! Outstanding eye for detail and fast delivery.",
    createdAt: Date.now() - 10 * 86400000,
  });

  await ctx.db.insert("reviews", {
    projectId: proj2Id,
    projectTitle: "Build/Edit Landing Page for Online Course",
    fromUserId: client2Id,
    toUserId: student2Id,
    fromName: "EduPulse Global",
    toName: "Sadia Afrin",
    fromRole: "client",
    rating: 5,
    comment: "Sadia's design transformed our enrollment rate. Professional communication throughout the sprint!",
    createdAt: Date.now() - 5 * 86400000,
  });

  // 7. Initial Notifications
  await ctx.db.insert("notifications", {
    userId: student1Id,
    title: "Proposal Shortlisted! 🎉",
    message: "HAV Innovations shortlisted your proposal for 'Let's Collaborate on HAV's Website Redesign'.",
    type: "status_change",
    read: false,
    link: "/proposals",
    createdAt: Date.now() - 1 * 86400000,
  });

  return { success: true, seededCount: 5 };
}
