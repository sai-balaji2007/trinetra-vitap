/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Award,
  Bookmark,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Download,
  Edit3,
  Flame,
  FlaskConical,
  Lock,
  Play,
  Sparkles,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { Certificate } from '../types/lms';
import { downloadCertificatePDF, downloadExperimentReportPDF } from '../utils/pdfGenerator';
import { CertificateModal } from './CertificateVerifyPage';

interface DashboardPageProps {
  onOpenAuth: (mode?: 'signin' | 'register' | 'profile') => void;
  onStartLearning: (courseId: string, lessonId?: string) => void;
  onBrowseCourses: () => void;
  onOpenVirtualLabs: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onOpenAuth,
  onStartLearning,
  onBrowseCourses,
  onOpenVirtualLabs,
}) => {
  const {
    currentUser,
    isDemoMode,
    courses,
    lessons,
    quizzes,
    enrollments,
    lessonProgress,
    quizAttempts,
    certificates,
    experiments,
  } = usePlatform();

  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  // Real computed metrics from stored user records
  const completedLessonsCount = useMemo(
    () => lessonProgress.filter((p) => p.completed).length,
    [lessonProgress]
  );

  const avgQuizScore = useMemo(() => {
    if (quizAttempts.length === 0) return null;
    const sum = quizAttempts.reduce((acc, a) => acc + a.percentage, 0);
    return Math.round(sum / quizAttempts.length);
  }, [quizAttempts]);

  const recentLessons = useMemo(() => {
    return [...lessonProgress]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
      .map((prog) => ({
        progress: prog,
        lesson: lessons.find((l) => l.id === prog.lessonId),
        course: courses.find((c) => c.id === prog.courseId),
      }))
      .filter((item) => item.lesson && item.course);
  }, [lessonProgress, lessons, courses]);

  const bookmarkedLessons = useMemo(() => {
    return lessonProgress
      .filter((p) => p.bookmarked)
      .map((prog) => ({
        progress: prog,
        lesson: lessons.find((l) => l.id === prog.lessonId),
        course: courses.find((c) => c.id === prog.courseId),
      }))
      .filter((item) => item.lesson && item.course);
  }, [lessonProgress, lessons, courses]);

  const recommendedCourses = useMemo(() => {
    const enrolledIds = new Set(enrollments.map((e) => e.courseId));
    return courses.filter((c) => c.published && !enrolledIds.has(c.id)).slice(0, 3);
  }, [courses, enrollments]);

  const completedCourses = useMemo(
    () => enrollments.filter((e) => e.status === 'completed' || e.progressPercent === 100),
    [enrollments]
  );

  // Earned achievements computed strictly from real milestones
  const achievements = useMemo(
    () => [
      {
        id: 'first_enroll',
        title: 'First Step',
        desc: 'Enrolled in your first STEM course',
        unlocked: enrollments.length >= 1,
      },
      {
        id: 'lesson_explorer',
        title: 'Concept Explorer',
        desc: 'Completed at least 3 course lessons',
        unlocked: completedLessonsCount >= 3,
      },
      {
        id: 'quiz_achiever',
        title: 'Assessment Achiever',
        desc: 'Passed a timed course assessment',
        unlocked: quizAttempts.some((a) => a.passed),
      },
      {
        id: 'lab_scientist',
        title: 'Lab Researcher',
        desc: 'Saved a Virtual Lab observation report',
        unlocked: experiments.length >= 1,
      },
      {
        id: 'certified',
        title: 'Certified Graduate',
        desc: 'Earned a verified TRINETRA Certificate',
        unlocked: certificates.length >= 1,
      },
    ],
    [enrollments.length, completedLessonsCount, quizAttempts, experiments.length, certificates.length]
  );

  // Protected route gate
  if (!currentUser) {
    return (
      <div className="py-20 bg-[#080d1a] text-white min-h-[75vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 bg-[#10182a] border border-slate-800 rounded-3xl text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#4b8bff]/15 border border-[#4b8bff]/40 flex items-center justify-center">
            <Lock className="w-7 h-7 text-[#4b8bff]" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-white">Student Learning Dashboard</h1>
            <p className="text-xs sm:text-sm text-[#a7b0c0] leading-relaxed">
              Sign in or create a free TRINETRA account to track real course enrollments, lesson progress, quiz attempts, saved lab reports, and verified certificates.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onOpenAuth('signin')}
              className="flex-1 py-3 bg-[#f04432] hover:bg-[#d63a2b] text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Sign In / Demo Mode
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              className="flex-1 py-3 bg-[#080d1a] hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const initials = currentUser.displayName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="py-10 md:py-14 bg-[#080d1a] text-white min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Session Status Banner */}
        {isDemoMode && (
          <div className="p-3.5 bg-amber-950/30 border border-amber-500/40 rounded-xl text-xs text-amber-200 flex flex-wrap items-center justify-between gap-2">
            <span>
              <strong>Local Demo Mode Active:</strong> Progress is stored locally in your browser under this demo profile.
            </span>
            <button
              onClick={() => onOpenAuth('signin')}
              className="text-amber-300 underline font-semibold cursor-pointer"
            >
              Switch Account
            </button>
          </div>
        )}

        {/* Personalized Welcome & Profile Header */}
        <div className="p-6 sm:p-8 bg-[#10182a] border border-slate-800 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#f04432] to-[#4b8bff] p-0.5 shrink-0">
              <div className="w-full h-full bg-[#080d1a] rounded-[14px] flex items-center justify-center font-extrabold text-xl text-white">
                {initials || 'TR'}
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  Welcome back, {currentUser.displayName}
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4b8bff]/20 text-[#4b8bff] border border-[#4b8bff]/40 uppercase">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-[#a7b0c0] mt-1">
                {currentUser.degree || 'Add your degree / stream'} ·{' '}
                {currentUser.institution || 'Add your institution'}
              </p>
              <button
                onClick={() => onOpenAuth('profile')}
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#4b8bff] hover:underline cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Real Computed Stat Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="px-3.5 py-2.5 bg-[#080d1a] border border-slate-800 rounded-xl text-center">
              <div className="text-sm font-mono font-bold text-white">{enrollments.length}</div>
              <span className="text-[10px] text-[#a7b0c0]">Enrolled</span>
            </div>
            <div className="px-3.5 py-2.5 bg-[#080d1a] border border-slate-800 rounded-xl text-center">
              <div className="text-sm font-mono font-bold text-emerald-400">
                {completedLessonsCount}
              </div>
              <span className="text-[10px] text-[#a7b0c0]">Lessons Done</span>
            </div>
            <div className="px-3.5 py-2.5 bg-[#080d1a] border border-slate-800 rounded-xl text-center">
              <div className="text-sm font-mono font-bold text-[#4b8bff]">
                {avgQuizScore !== null ? `${avgQuizScore}%` : '—'}
              </div>
              <span className="text-[10px] text-[#a7b0c0]">Avg Quiz</span>
            </div>
            <div className="px-3.5 py-2.5 bg-[#080d1a] border border-slate-800 rounded-xl text-center">
              <div className="text-sm font-mono font-bold text-amber-400">
                {certificates.length}
              </div>
              <span className="text-[10px] text-[#a7b0c0]">Certificates</span>
            </div>
            <div className="px-3.5 py-2.5 bg-[#080d1a] border border-slate-800 rounded-xl text-center col-span-2 sm:col-span-1">
              <div className="flex items-center justify-center gap-1 text-sm font-mono font-bold text-[#f04432]">
                <Flame className="w-3.5 h-3.5" />
                <span>{currentUser.streakDays || 1}d</span>
              </div>
              <span className="text-[10px] text-[#a7b0c0]">{currentUser.xp || 0} XP</span>
            </div>
          </div>
        </div>

        {/* Enrolled Courses & Progress */}
        <div className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#4b8bff]" />
              <span>Enrolled Courses & Completion Status</span>
            </h2>
            <button
              onClick={onBrowseCourses}
              className="text-xs font-semibold text-[#4b8bff] hover:underline cursor-pointer"
            >
              Browse All Courses →
            </button>
          </div>

          {enrollments.length === 0 ? (
            <div className="p-8 bg-[#080d1a] border border-slate-800 rounded-2xl text-center space-y-3">
              <p className="text-xs sm:text-sm text-[#a7b0c0]">
                You haven’t enrolled in any courses yet. Enroll in a course to start tracking your progress and earning verified certificates.
              </p>
              <button
                onClick={onBrowseCourses}
                className="px-5 py-2.5 bg-[#f04432] hover:bg-[#d63a2b] text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Explore Course Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrollments.map((enr) => {
                const course = courses.find((c) => c.id === enr.courseId);
                if (!course) return null;
                return (
                  <div
                    key={enr.id}
                    className="p-4 bg-[#080d1a] border border-slate-800 rounded-2xl flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#4b8bff]">{course.category}</span>
                        <span className="text-slate-400">
                          {enr.completedLessonsCount} lessons completed
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white">{course.title}</h3>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#4b8bff] to-emerald-400"
                          style={{ width: `${enr.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-emerald-400 font-bold">
                        {enr.progressPercent}% Complete
                      </span>
                      <button
                        onClick={() => onStartLearning(course.id)}
                        className="px-3.5 py-1.5 bg-[#4b8bff] hover:bg-[#3d7be6] text-white font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Continue Learning</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 2-Column Grid: Recent Lessons & Quiz History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recently Accessed & Bookmarked Lessons */}
          <div className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>Recent & Bookmarked Lessons</span>
            </h2>

            {recentLessons.length === 0 && bookmarkedLessons.length === 0 ? (
              <p className="text-xs text-[#a7b0c0]">
                Lessons you complete, bookmark, or annotate will appear here for quick access.
              </p>
            ) : (
              <div className="space-y-2.5">
                {recentLessons.map(({ progress, lesson, course }) => (
                  <button
                    key={progress.id}
                    onClick={() => onStartLearning(course!.id, lesson!.id)}
                    className="w-full text-left p-3 bg-[#080d1a] hover:border-[#4b8bff]/40 border border-slate-800 rounded-xl flex items-center justify-between gap-2 text-xs cursor-pointer"
                  >
                    <div className="min-w-0">
                      <span className="font-bold text-white block truncate">{lesson!.title}</span>
                      <span className="text-[11px] text-[#a7b0c0] truncate block">
                        {course!.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {progress.bookmarked && (
                        <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      )}
                      {progress.completed && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quiz Performance */}
          <div className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <ClipboardCheck className="w-4 h-4 text-[#f04432]" />
              <span>Quiz & Assessment Performance</span>
            </h2>

            {quizAttempts.length === 0 ? (
              <p className="text-xs text-[#a7b0c0]">
                No quiz attempts submitted yet. Complete a module check or final assessment inside any course.
              </p>
            ) : (
              <div className="space-y-2.5">
                {quizAttempts.map((att) => {
                  const q = quizzes.find((item) => item.id === att.quizId);
                  return (
                    <div
                      key={att.id}
                      className="p-3 bg-[#080d1a] border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-white block truncate">
                          {q?.title || att.quizId}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {new Date(att.submittedAt).toLocaleDateString()} · {att.score}/{att.maxScore} pts
                        </span>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-lg font-mono font-bold shrink-0 ${
                          att.passed
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/60'
                            : 'bg-rose-950 text-[#f04432] border border-[#f04432]/40'
                        }`}
                      >
                        {att.percentage}% {att.passed ? 'PASS' : 'FAIL'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Certificates & Saved Virtual Lab Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Earned Certificates */}
          <div className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Verified Certificates ({certificates.length})</span>
              </h2>
              <span className="text-[11px] font-mono text-[#a7b0c0]">
                {completedCourses.length} Courses Completed
              </span>
            </div>

            {certificates.length === 0 ? (
              <p className="text-xs text-[#a7b0c0]">
                Complete 100% of lessons and pass the Final Assessment in any course to unlock your downloadable verified certificate.
              </p>
            ) : (
              <div className="space-y-2.5">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-3.5 bg-[#080d1a] border border-emerald-700/40 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <span className="font-bold text-white block truncate">{cert.courseTitle}</span>
                      <span className="font-mono text-[11px] text-emerald-400">
                        ID: {cert.certificateCode}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedCert(cert)}
                        className="px-2.5 py-1.5 bg-[#10182a] hover:bg-slate-800 border border-slate-700 rounded-lg font-semibold cursor-pointer"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => downloadCertificatePDF(cert)}
                        className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Virtual Lab Reports */}
          <div className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-cyan-400" />
                <span>Saved Lab Reports ({experiments.length})</span>
              </h2>
              <button
                onClick={onOpenVirtualLabs}
                className="text-xs font-semibold text-cyan-400 hover:underline cursor-pointer"
              >
                Open Virtual Labs →
              </button>
            </div>

            {experiments.length === 0 ? (
              <p className="text-xs text-[#a7b0c0]">
                Record observations inside the Virtual Laboratories and click Save Lab Log to store reports here.
              </p>
            ) : (
              <div className="space-y-2.5">
                {experiments.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3.5 bg-[#080d1a] border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <span className="font-bold text-white block truncate">{exp.title}</span>
                      <span className="text-[11px] font-mono text-[#a7b0c0]">
                        {exp.category} · {exp.observations.length} Trials Recorded
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        downloadExperimentReportPDF({
                          title: exp.title,
                          category: exp.category,
                          objective: exp.objective,
                          theory: 'Simulated mathematical laboratory report',
                          components: [],
                          parameters: exp.parameters,
                          observations: exp.observations,
                          conclusion: exp.conclusion,
                        })
                      }
                      className="px-3 py-1.5 bg-[#4b8bff]/15 text-[#4b8bff] border border-[#4b8bff]/40 rounded-lg font-bold flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Achievements */}
        <div className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Learning Milestones & Achievements</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                  ach.unlocked
                    ? 'bg-[#080d1a] border-amber-500/50 text-white'
                    : 'bg-[#080d1a]/50 border-slate-800/70 text-slate-500 opacity-65'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{ach.title}</span>
                  <Sparkles
                    className={`w-3.5 h-3.5 ${ach.unlocked ? 'text-amber-400' : 'text-slate-600'}`}
                  />
                </div>
                <p className="text-[11px] leading-snug">{ach.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Courses */}
        {recommendedCourses.length > 0 && (
          <div className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-base font-bold text-white">Recommended Next Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedCourses.map((c) => (
                <div
                  key={c.id}
                  className="p-4 bg-[#080d1a] border border-slate-800 rounded-xl flex flex-col justify-between gap-3"
                >
                  <div>
                    <span className="text-[10px] font-mono text-[#4b8bff]">{c.category}</span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{c.title}</h3>
                    <p className="text-xs text-[#a7b0c0] mt-1 line-clamp-2">{c.description}</p>
                  </div>
                  <button
                    onClick={() => onStartLearning(c.id)}
                    className="text-xs font-bold text-[#4b8bff] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Explore Course</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <CertificateModal certificate={selectedCert} onClose={() => setSelectedCert(null)} />
    </div>
  );
};
