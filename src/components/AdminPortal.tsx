/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  BookOpen,
  Flag,
  CheckCircle2,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  BarChart3,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { UserRole } from '../types/lms';

interface AdminPortalProps {
  onOpenAuth: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onOpenAuth }) => {
  const {
    currentUser,
    courses,
    allUsers,
    allEnrollmentsCount,
    certificates,
    discussions,
    changeUserRole,
    moderateCourse,
    clearDiscussionFlag,
    deleteDiscussion,
  } = usePlatform();

  const [notice, setNotice] = useState<string | null>(null);

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="py-20 bg-[#080d1a] text-white min-h-[75vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 bg-[#10182a] border border-slate-800 rounded-3xl text-center space-y-4">
          <Lock className="w-10 h-10 text-[#f04432] mx-auto" />
          <h1 className="text-xl font-extrabold">Super-Admin Portal Restricted</h1>
          <p className="text-xs text-[#a7b0c0]">
            Platform user governance, RBAC role assignments, course approval, and flagged discussion moderation require Administrator privileges.
          </p>
          <button
            onClick={onOpenAuth}
            className="px-5 py-2.5 bg-[#4b8bff] hover:bg-[#3d7be6] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Sign In as Administrator
          </button>
        </div>
      </div>
    );
  }

  const publishedCount = courses.filter((c) => c.published).length;
  const draftCount = courses.filter((c) => !c.published).length;
  const flaggedThreads = discussions.filter((d) => d.isFlagged || d.reportedCount > 0);
  const instructorCount = allUsers.filter((u) => u.role === 'instructor').length;

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="py-10 md:py-14 bg-[#080d1a] text-white min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-slate-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono text-[#f04432] uppercase tracking-wider">
              Platform Governance & RBAC Oversight
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-0.5">Super-Admin Console</h1>
            <p className="text-xs sm:text-sm text-[#a7b0c0] mt-1">
              Real-time platform analytics, role management across students/instructors/admins, course moderation, and safety queue.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-[#10182a] px-3.5 py-2 rounded-xl border border-emerald-700/40">
            <ShieldCheck className="w-4 h-4" />
            <span>Authenticated: {currentUser.displayName}</span>
          </div>
        </div>

        {notice && (
          <div className="p-3.5 bg-emerald-950/40 border border-emerald-700/50 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notice}</span>
          </div>
        )}

        {/* Real Platform Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 bg-[#10182a] border border-slate-800 rounded-2xl">
            <span className="text-[11px] text-[#a7b0c0] block">Total Users</span>
            <strong className="text-2xl font-mono text-white">{allUsers.length}</strong>
          </div>
          <div className="p-4 bg-[#10182a] border border-slate-800 rounded-2xl">
            <span className="text-[11px] text-[#a7b0c0] block">Instructors</span>
            <strong className="text-2xl font-mono text-[#4b8bff]">{instructorCount}</strong>
          </div>
          <div className="p-4 bg-[#10182a] border border-slate-800 rounded-2xl">
            <span className="text-[11px] text-[#a7b0c0] block">Published / Draft Courses</span>
            <strong className="text-2xl font-mono text-emerald-400">
              {publishedCount} / {draftCount}
            </strong>
          </div>
          <div className="p-4 bg-[#10182a] border border-slate-800 rounded-2xl">
            <span className="text-[11px] text-[#a7b0c0] block">Total Enrollments</span>
            <strong className="text-2xl font-mono text-white">{allEnrollmentsCount}</strong>
          </div>
          <div className="p-4 bg-[#10182a] border border-slate-800 rounded-2xl">
            <span className="text-[11px] text-[#a7b0c0] block">Flagged Reports</span>
            <strong className="text-2xl font-mono text-[#f04432]">{flaggedThreads.length}</strong>
          </div>
        </div>

        {/* User Management & RBAC Table */}
        <div className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#4b8bff]" /> User Management & Role-Based Access Control
            </h2>
            <span className="text-xs font-mono text-[#a7b0c0]">{allUsers.length} Accounts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[#a7b0c0]">
                  <th className="py-2 pr-4">User</th>
                  <th className="py-2 pr-4">UID</th>
                  <th className="py-2 pr-4">Institution</th>
                  <th className="py-2">Assigned Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {allUsers.map((u) => (
                  <tr key={u.uid}>
                    <td className="py-3 pr-4 font-bold text-white">{u.displayName}</td>
                    <td className="py-3 pr-4 font-mono text-slate-400 text-[11px]">{u.uid}</td>
                    <td className="py-3 pr-4 text-[#a7b0c0]">{u.institution || '—'}</td>
                    <td className="py-3">
                      <select
                        value={u.role}
                        onChange={async (e) => {
                          const nextRole = e.target.value as UserRole;
                          await changeUserRole(u.uid, nextRole);
                          showNotice(`Updated ${u.displayName} to ${nextRole}.`);
                        }}
                        className="px-2.5 py-1 bg-[#080d1a] border border-slate-700 rounded-lg text-white font-mono"
                      >
                        <option value="student">student</option>
                        <option value="instructor">instructor</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Course Performance & Content Moderation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <BarChart3 className="w-4 h-4 text-emerald-400" /> Course Performance & Approval
            </h2>
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {courses.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 bg-[#080d1a] border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-bold text-white block truncate">{c.title}</span>
                    <span className="text-[11px] font-mono text-[#a7b0c0]">
                      {c.category} · {c.enrollmentCount} enrolled · ★ {c.rating.toFixed(1)}
                    </span>
                  </div>
                  <button
                    onClick={async () => {
                      await moderateCourse(c.id, !c.published);
                      showNotice(
                        `${c.title} is now ${!c.published ? 'Published' : 'Unpublished'}.`
                      );
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shrink-0 cursor-pointer ${
                      c.published
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50'
                        : 'bg-amber-950 text-amber-300 border border-amber-700/50'
                    }`}
                  >
                    {c.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{c.published ? 'Published' : 'Unpublished'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Flagged Discussions Queue */}
          <div className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Flag className="w-4 h-4 text-[#f04432]" /> Flagged Discussion Moderation Queue
            </h2>
            {flaggedThreads.length === 0 ? (
              <div className="p-6 bg-[#080d1a] border border-slate-800 rounded-xl text-xs text-[#a7b0c0] text-center">
                No flagged community posts awaiting review. Certificates issued in session: {certificates.length}.
              </div>
            ) : (
              <div className="space-y-3">
                {flaggedThreads.map((d) => (
                  <div key={d.id} className="p-3.5 bg-[#080d1a] border border-[#f04432]/40 rounded-xl text-xs space-y-2">
                    <div className="flex justify-between">
                      <strong className="text-white">{d.title}</strong>
                      <span className="text-[#f04432] font-mono">Reports: {d.reportedCount}</span>
                    </div>
                    <p className="text-[#a7b0c0]">{d.body}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          await clearDiscussionFlag(d.id);
                          showNotice('Discussion restored & flag cleared.');
                        }}
                        className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg font-bold cursor-pointer"
                      >
                        Approve & Restore
                      </button>
                      <button
                        onClick={async () => {
                          await deleteDiscussion(d.id);
                          showNotice('Flagged discussion removed.');
                        }}
                        className="px-3 py-1 bg-rose-950 text-[#f04432] rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
