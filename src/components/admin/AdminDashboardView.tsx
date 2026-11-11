import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "../../context/AuthContext";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { formatCurrency, formatDate } from "../../lib/utils";
import {
  Shield,
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  FileText,
  Star,
  Trash2,
  CheckCircle,
  AlertOctagon,
  Lock,
  Unlock
} from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";

export const AdminDashboardView: React.FC = () => {
  const { currentUser } = useAuth();
  const stats = useQuery(api.admin.getPlatformStats);
  const overview = useQuery(api.admin.getAdminOverview);
  const toggleUserStatus = useMutation(api.users.toggleUserStatus);
  const deleteProject = useMutation(api.admin.deleteProjectByAdmin);

  const [activeTab, setActiveTab] = useState<"overview" | "users" | "projects">("overview");

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="p-12 text-center bg-white border border-[#E7E1D5] rounded-3xl space-y-3 shadow-xs max-w-lg mx-auto my-12">
        <Shield className="w-10 h-10 text-stone-900 mx-auto" />
        <h3 className="text-base font-bold text-stone-900">Administrator Console Restricted</h3>
        <p className="text-xs text-stone-500">
          This console is strictly reserved for the DIU Capstone Committee. Please sign in with administrator credentials (<code>admin@ok.com</code>).
        </p>
        <div className="pt-2">
          <Button onClick={() => (window.location.href = "/login")}>Sign In as Admin</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E1D5]">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-bold text-stone-900">Capstone Admin & Oversight Console</h2>
            <Badge variant="success">Feature 8 • 10 Marks</Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Daffodil International University Software Engineering Capstone Assessment Panel
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1.5 bg-[#F4EFE6] p-1 rounded-xl border border-[#E7E1D5] text-xs">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "overview"
                ? "bg-emerald-700 text-white font-bold shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Metrics Overview
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "users"
                ? "bg-emerald-700 text-white font-bold shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            User Moderation
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "projects"
                ? "bg-emerald-700 text-white font-bold shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Projects Oversight
          </button>
        </div>
      </div>

      {/* KPI Stat Cards (10 Marks requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-[#E7E1D5] p-4 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Students</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-xl font-black text-stone-900">{stats?.studentsCount || 0}</p>
          <span className="text-[10px] text-emerald-800 font-semibold">Enrolled & Verified</span>
        </div>

        <div className="bg-white border border-[#E7E1D5] p-4 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Clients</span>
            <Briefcase className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-black text-stone-900">{stats?.clientsCount || 0}</p>
          <span className="text-[10px] text-blue-700 font-semibold">Registered Employers</span>
        </div>

        <div className="bg-white border border-[#E7E1D5] p-4 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Active Jobs</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-black text-stone-900">
            {(stats?.openProjects || 0) + (stats?.inProgressProjects || 0)}
          </p>
          <span className="text-[10px] text-amber-700 font-semibold">{stats?.totalProjects || 0} Total Posted</span>
        </div>

        <div className="bg-white border border-[#E7E1D5] p-4 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Proposals</span>
            <FileText className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xl font-black text-stone-900">{stats?.totalApplications || 0}</p>
          <span className="text-[10px] text-purple-700 font-semibold">Applications Filed</span>
        </div>

        <div className="bg-white border border-[#E7E1D5] p-4 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Platform Value</span>
            <DollarSign className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-xl font-black text-stone-900">${stats?.totalVolume?.toLocaleString() || 0}</p>
          <span className="text-[10px] text-teal-700 font-semibold">Estimated Volume</span>
        </div>

        <div className="bg-white border border-[#E7E1D5] p-4 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Avg Rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-xl font-black text-stone-900">{stats?.averageRating || 5.0}★</p>
          <span className="text-[10px] text-amber-700 font-semibold">{stats?.totalReviews || 0} Reviews</span>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <div className="bg-white border border-[#E7E1D5] rounded-2xl p-5 space-y-3 shadow-xs">
            <h3 className="text-sm font-bold text-stone-900">Project Category Distribution</h3>
            <div className="space-y-2.5">
              {stats?.categoryCounts &&
                Object.entries(stats.categoryCounts).map(([cat, count]) => {
                  const percentage = stats.totalProjects > 0
                    ? Math.round((count / stats.totalProjects) * 100)
                    : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-700 font-medium">{cat}</span>
                        <span className="text-stone-500">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[#FAF7F2] border border-[#E7E1D5] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Demanded Skills Bar */}
          <div className="bg-white border border-[#E7E1D5] rounded-2xl p-5 space-y-3 shadow-xs">
            <h3 className="text-sm font-bold text-stone-900">Top Demanded Skills on Platform</h3>
            <div className="space-y-2.5">
              {stats?.topSkills &&
                stats.topSkills.map((item) => (
                  <div key={item.skill} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-700 font-medium">{item.skill}</span>
                      <span className="text-emerald-800 font-bold">{item.count} jobs</span>
                    </div>
                    <div className="w-full h-2 bg-[#FAF7F2] border border-[#E7E1D5] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-600 rounded-full"
                        style={{ width: `${Math.min(100, item.count * 20)}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="bg-white border border-[#E7E1D5] rounded-2xl overflow-hidden shadow-xs">
          <div className="px-5 py-4 border-b border-[#E7E1D5] flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900">User Accounts Moderation</h3>
            <span className="text-xs text-stone-500">{overview?.users.length || 0} Registered</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-[#FAF7F2] text-stone-600 uppercase text-[10px] tracking-wider border-b border-[#E7E1D5]">
                <tr>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E1D5]">
                {overview?.users.map((u) => (
                  <tr key={u._id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="px-5 py-3 font-semibold text-stone-900 flex items-center gap-2">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-6 h-6 rounded-md object-cover ring-1 ring-[#E7E1D5]"
                      />
                      <span>{u.name}</span>
                    </td>
                    <td className="px-5 py-3">
                      <Badge
                        variant={
                          u.role === "student"
                            ? "info"
                            : u.role === "client"
                            ? "warning"
                            : "success"
                        }
                      >
                        {u.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-stone-600">{u.email}</td>
                    <td className="px-5 py-3 text-stone-600">{u.location || "Remote"}</td>
                    <td className="px-5 py-3">
                      {u.isActive ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Active
                        </span>
                      ) : (
                        <span className="text-rose-600 font-bold flex items-center gap-1">
                          <AlertOctagon className="w-3.5 h-3.5" /> Suspended
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button
                        size="sm"
                        variant={u.isActive ? "danger" : "secondary"}
                        onClick={() =>
                          toggleUserStatus({ userId: u._id, isActive: !u.isActive })
                        }
                        className="text-[11px] py-1 px-2.5 gap-1"
                      >
                        {u.isActive ? (
                          <>
                            <Lock className="w-3 h-3" /> Suspend
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3 h-3" /> Activate
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "projects" && (
        <div className="bg-white border border-[#E7E1D5] rounded-2xl overflow-hidden shadow-xs">
          <div className="px-5 py-4 border-b border-[#E7E1D5] flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900">Project Posts Moderation</h3>
            <span className="text-xs text-stone-500">{overview?.projects.length || 0} Total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-[#FAF7F2] text-stone-600 uppercase text-[10px] tracking-wider border-b border-[#E7E1D5]">
                <tr>
                  <th className="px-5 py-3">Project Title</th>
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Budget</th>
                  <th className="px-5 py-3">Bids</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E1D5]">
                {overview?.projects.map((p) => (
                  <tr key={p._id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="px-5 py-3 font-semibold text-stone-900 max-w-xs truncate">
                      {p.title}
                    </td>
                    <td className="px-5 py-3 text-stone-700">{p.clientName}</td>
                    <td className="px-5 py-3 text-stone-500">{p.category}</td>
                    <td className="px-5 py-3 text-emerald-800 font-bold">
                      {formatCurrency(p.budget, p.projectType)}
                    </td>
                    <td className="px-5 py-3">{p.proposalsCount}</td>
                    <td className="px-5 py-3">
                      <Badge variant="outline">{p.status}</Badge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => deleteProject({ projectId: p._id })}
                        className="text-[11px] py-1 px-2.5 gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
