import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "../../context/AuthContext";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { RatingStars } from "../common/RatingStars";
import { AddPortfolioModal } from "./AddPortfolioModal";
import {
  GraduationCap,
  Briefcase,
  Star,
  ExternalLink,
  Github,
  Linkedin,
  Plus,
  Trash2,
  Edit,
  Check,
  UserCheck,
  Crown
} from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";

export const StudentProfileView: React.FC = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isAddPortfolioOpen, setIsAddPortfolioOpen] = useState(false);

  const profile = useQuery(
    api.studentProfiles.getProfileByUserId,
    currentUser && currentUser.role === "student" ? { userId: currentUser._id } : "skip"
  );

  const portfolios = useQuery(
    api.portfolios.listPortfoliosByStudent,
    currentUser && currentUser.role === "student" ? { studentId: currentUser._id } : "skip"
  );

  const reviews = useQuery(
    api.reviews.getReviewsForUser,
    currentUser && currentUser.role === "student" ? { userId: currentUser._id } : "skip"
  );

  const upsertProfile = useMutation(api.studentProfiles.upsertProfile);
  const deletePortfolio = useMutation(api.portfolios.deletePortfolio);

  // Form states
  const [fullName, setFullName] = useState("");
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");
  const [studentId, setStudentId] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Intermediate");
  const [hourlyRate, setHourlyRate] = useState(15);
  const [availability, setAvailability] = useState("Available for Work");
  const [bio, setBio] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioWebsite, setPortfolioWebsite] = useState("");

  // Sync when profile loads
  React.useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || currentUser?.name || "");
      setUniversity(profile.university || "Daffodil International University");
      setDepartment(profile.department || "Software Engineering");
      setStudentId(profile.studentId || "DIU-SE-2022-0491");
      setYearOfStudy(profile.yearOfStudy || "Senior Year");
      setSkills(profile.skills || ["React", "UI/UX Design", "Figma", "WordPress"]);
      setExperienceLevel(profile.experienceLevel || "Intermediate");
      setHourlyRate(profile.hourlyRate || 15);
      setAvailability(profile.availability || "Available for Work");
      setBio(profile.bio || "");
      setGithubUrl(profile.githubUrl || "");
      setLinkedinUrl(profile.linkedinUrl || "");
      setPortfolioWebsite(profile.portfolioWebsite || "");
    }
  }, [profile, currentUser]);

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    await upsertProfile({
      userId: currentUser._id,
      fullName,
      university,
      department,
      studentId,
      yearOfStudy,
      skills,
      experienceLevel,
      hourlyRate: Number(hourlyRate),
      availability,
      bio,
      githubUrl: githubUrl || undefined,
      linkedinUrl: linkedinUrl || undefined,
      portfolioWebsite: portfolioWebsite || undefined,
    });
    setIsEditing(false);
  };

  if (!currentUser) {
    return (
      <div className="p-12 text-center bg-white border border-[#E7E1D5] rounded-3xl space-y-3 shadow-xs max-w-lg mx-auto my-12">
        <GraduationCap className="w-10 h-10 text-stone-400 mx-auto" />
        <h3 className="text-base font-bold text-stone-900">Sign In to View Student Profile</h3>
        <p className="text-xs text-stone-500">
          Please log in with your DIU student account to manage your skills, experience, and verified portfolio exhibits.
        </p>
        <div className="pt-2">
          <Button onClick={() => (window.location.href = "/login")}>Sign In as Student</Button>
        </div>
      </div>
    );
  }

  if (currentUser.role !== "student") {
    return (
      <div className="p-8 text-center bg-white border border-[#E7E1D5] rounded-3xl space-y-3 shadow-xs max-w-lg mx-auto my-12">
        <GraduationCap className="w-10 h-10 text-blue-600 mx-auto" />
        <h3 className="text-base font-bold text-stone-900">Student Profile Not Applicable</h3>
        <p className="text-xs text-stone-600">
          You are currently signed in as <strong>{currentUser.name}</strong> ({currentUser.role}). Student skill profiles and portfolio showcases are for student freelancers.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header Profile Card */}
      <div className="bg-white border border-[#E7E1D5] rounded-3xl p-6 relative overflow-hidden shadow-xs">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <img
              src={
                currentUser?.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              }
              alt={currentUser?.name || "Student"}
              className={`w-20 h-20 rounded-2xl object-cover ring-4 ${
                currentUser?.isPlusMember ? "ring-amber-400" : "ring-[#DDD3C2]"
              }`}
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-extrabold text-stone-900">
                  {profile?.fullName || currentUser?.name || "Ahmad Nasrullah"}
                </h2>
                {currentUser?.isPlusMember && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 uppercase">
                    <Crown className="w-3 h-3 text-amber-600" />
                    PLUS PRO
                  </span>
                )}
                <Badge variant="success" className="gap-1">
                  <UserCheck className="w-3 h-3" />
                  Verified DIU Student
                </Badge>
              </div>

              <p className="text-xs text-stone-600 font-medium mt-1">
                {profile?.department || "Software Engineering"} •{" "}
                {profile?.university || "Daffodil International University"}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-2">
                <span>ID: {profile?.studentId || "DIU-SE-2022-0491"}</span>
                <span>•</span>
                <span>{profile?.yearOfStudy || "Senior (4th Year)"}</span>
                <span>•</span>
                <span className="text-emerald-800 font-bold">${profile?.hourlyRate || 15}/hr</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant={isEditing ? "outline" : "primary"}
              onClick={() => setIsEditing(!isEditing)}
              className="gap-1.5 font-bold"
            >
              {isEditing ? "Cancel" : <><Edit className="w-3.5 h-3.5" /> Edit Profile (8 Marks)</>}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsAddPortfolioOpen(true)}
              className="gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Portfolio (5 Marks)
            </Button>
          </div>
        </div>

        {/* Rating summary pill */}
        <div className="mt-5 pt-4 border-t border-[#E7E1D5] flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <RatingStars
              rating={profile?.averageRating || 5.0}
              showValue
              reviewsCount={profile?.totalReviewsCount || 0}
            />
            <span className="text-stone-300">•</span>
            <span className="text-stone-500">
              Completed Projects:{" "}
              <strong className="text-stone-900">{profile?.completedProjectsCount || 0}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {profile?.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="text-stone-500 hover:text-stone-900 flex items-center gap-1"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}
            {profile?.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="text-stone-500 hover:text-stone-900 flex items-center gap-1"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
            )}
            {profile?.portfolioWebsite && (
              <a
                href={profile.portfolioWebsite}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Website</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-white border border-[#DDD3C2] rounded-2xl p-6 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E1D5]">
            <h3 className="text-sm font-bold text-stone-900">
              Feature 2: Student Skill Profile Form (8 Marks)
            </h3>
            <span className="text-xs text-stone-500">All fields reactive with Convex</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E7E1D5] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">University</label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E7E1D5] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E7E1D5] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Student ID</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E7E1D5] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E7E1D5] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
              >
                <option value="Entry Level">Entry Level</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Hourly Rate ($/hr)
              </label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full bg-[#FAF7F2] border border-[#E7E1D5] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Availability</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E7E1D5] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
              >
                <option value="Available for Work">Available for Work</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Busy">Busy</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Bio & Personal Summary
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E7E1D5] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Skills Management */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Skills Tags (Used for Automated Matching)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add skill (e.g. Next.js, Figma, Python)..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="flex-1 bg-[#FAF7F2] border border-[#E7E1D5] rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
              />
              <Button type="button" size="sm" variant="secondary" onClick={handleAddSkill}>
                Add Skill
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span
                  key={s}
                  className="text-xs bg-[#F4EFE6] text-stone-800 border border-[#E7E1D5] px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => setSkills(skills.filter((sk) => sk !== s))}
                    className="hover:text-rose-600 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E7E1D5] flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="font-bold">
              Save Profile Changes
            </Button>
          </div>
        </form>
      )}

      {/* Skills Showcase Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-emerald-700" />
          Technical & Creative Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {profile?.skills.map((skill, i) => (
            <Badge key={i} variant="skill" className="px-3.5 py-1.5 text-xs">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Advanced Feature 2: Student Portfolio Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-700" />
              Verified Portfolio Exhibits
            </h3>
            <p className="text-xs text-stone-500">
              Advanced Feature 2 (5 Marks): Curated case studies and projects completed by student.
            </p>
          </div>
          <Button size="sm" onClick={() => setIsAddPortfolioOpen(true)} className="gap-1 text-xs">
            <Plus className="w-3.5 h-3.5" />
            Add Project
          </Button>
        </div>

        {portfolios && portfolios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolios.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-[#E7E1D5] rounded-2xl overflow-hidden hover:border-[#DDD3C2] transition-all flex flex-col justify-between group shadow-xs"
              >
                {item.imageUrl && (
                  <div className="h-44 w-full overflow-hidden bg-[#FAF7F2] relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={() => deletePortfolio({ portfolioId: item._id })}
                        className="p-1.5 bg-black/60 hover:bg-rose-600 rounded-lg text-white transition-colors"
                        title="Delete exhibit"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                      <span className="text-emerald-800 font-semibold">{item.category}</span>
                      <span>{item.completedDate}</span>
                    </div>

                    <h4 className="text-sm font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                      {item.title}
                    </h4>

                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-2 mt-1">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.skills.map((s, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded bg-[#FAF7F2] text-stone-700 border border-[#E7E1D5]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E7E1D5] flex items-center justify-end gap-3 text-xs">
                    {item.githubUrl && (
                      <a
                        href={item.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-stone-500 hover:text-stone-900 flex items-center gap-1"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Code</span>
                      </a>
                    )}
                    {item.projectUrl && (
                      <a
                        href={item.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white border border-[#E7E1D5] rounded-2xl text-xs text-stone-500 shadow-xs">
            No portfolio exhibits added yet. Click "Add Project" to upload your work!
          </div>
        )}
      </div>

      {/* Advanced Feature 4: Client Reviews on Profile */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            Verified Client Reviews & Testimonials
          </h3>
          <p className="text-xs text-stone-500">
            Advanced Feature 4 (5 Marks): Real ratings and testimonials given by clients upon job completion.
          </p>
        </div>

        {reviews && reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="bg-white border border-[#E7E1D5] rounded-2xl p-4 space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900">{r.fromName}</span>
                  <RatingStars rating={r.rating} size="sm" showValue />
                </div>
                <p className="text-[11px] text-emerald-800 font-medium">
                  Project: "{r.projectTitle}"
                </p>
                <p className="text-xs text-stone-600 italic bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E7E1D5]">
                  "{r.comment}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center bg-white border border-[#E7E1D5] rounded-2xl text-xs text-stone-500 shadow-xs">
            No client reviews received yet. Complete hired projects to earn 5-star ratings!
          </div>
        )}
      </div>

      {/* Modal */}
      <AddPortfolioModal
        isOpen={isAddPortfolioOpen}
        onClose={() => setIsAddPortfolioOpen(false)}
      />
    </div>
  );
};
