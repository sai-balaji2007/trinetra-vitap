/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  PlayCircle,
  FileText,
  FlaskConical,
  ClipboardCheck,
  Star,
  Users,
  MessageSquare,
  Award,
  AlertCircle,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';

interface CourseDetailPageProps {
  courseId: string;
  onBack: () => void;
  onStartLearning: (courseId: string, lessonId?: string) => void;
  onOpenAuth: () => void;
  onOpenCommunity: (courseId: string) => void;
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({
  courseId,
  onBack,
  onStartLearning,
  onOpenAuth,
  onOpenCommunity,
}) => {
  const {
    courses,
    modules,
    lessons,
    enrollments,
    lessonProgress,
    currentUser,
    enrollInCourse,
    discussions,
  } = usePlatform();

  const [enrolling, setEnrolling] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const course = courses.find((c) => c.id === courseId);
  const courseModules = useMemo(
    () => modules.filter((m) => m.courseId === courseId).sort((a, b) => a.order - b.order),
    [modules, courseId]
  );
  const courseLessons = useMemo(
    () => lessons.filter((l) => l.courseId === courseId).sort((a, b) => a.order - b.order),
    [lessons, courseId]
  );
  const enrollment = enrollments.find((e) => e.courseId === courseId);
  const courseDiscussions = discussions.filter((d) => d.courseId === courseId && !d.parentId);

  if (!course) {
    return (
      <div className="py-16 text-center text-sm text-[#a7b0c0]">
        Course not found.{' '}
        <button onClick={onBack} className="text-[#4b8bff] underline cursor-pointer">
          Return to Catalog
        </button>
      </div>
    );
  }

  const handleEnroll = async () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setEnrolling(true);
    setErrorMsg(null);
    try {
      await enrollInCourse(course.id);
      onStartLearning(course.id);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Enrollment failed.');
    } finally {
      setEnrolling(false);
    }
  };

  const lessonTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="w-4 h-4 text-[#4b8bff]" />;
      case 'practical':
        return <FlaskConical className="w-4 h-4 text-emerald-400" />;
      case 'quiz':
        return <ClipboardCheck className="w-4 h-4 text-[#f04432]" />;
      default:
        return <FileText className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="py-8 md:py-12 bg-[#080d1a] text-white min-h-[80vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#a7b0c0] hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course Catalog</span>
        </button>

        {/* Course Hero Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#10182a] border border-slate-800 rounded-3xl p-6 sm:p-8">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
              <span className="px-2.5 py-1 rounded bg-[#4b8bff]/15 text-[#4b8bff] border border-[#4b8bff]/30">
                {course.category}
              </span>
              <span className="px-2.5 py-1 rounded bg-[#080d1a] text-slate-300 border border-slate-700">
                {course.difficulty}
              </span>
              {course.isDemoCourse ? (
                <span className="px-2.5 py-1 rounded bg-amber-500/15 text-amber-300 border border-amber-500/40">
                  Demo Course (Introductory Material)
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
                  Instructor Published
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {course.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#a7b0c0] leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-5 pt-2 text-xs text-[#a7b0c0]">
              <span>
                Instructor: <strong className="text-white">{course.instructorName}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <strong className="text-white">{course.rating.toFixed(1)}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#4b8bff]" />
                {course.enrollmentCount} Enrolled
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {course.durationHours} Hours
              </span>
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#f04432]" />
                {courseModules.length} Modules · {courseLessons.length} Lessons
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-between gap-4 bg-[#080d1a] border border-slate-800 rounded-2xl p-4">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full aspect-video object-cover rounded-xl border border-slate-800"
            />

            {errorMsg && (
              <div className="p-2.5 bg-[#f04432]/15 border border-[#f04432]/40 rounded-lg text-[11px] text-rose-200 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#f04432]" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-2.5">
              {enrollment ? (
                <button
                  onClick={() => onStartLearning(course.id)}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Continue Learning ({enrollment.progressPercent}% Complete) →
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full py-3 bg-[#f04432] hover:bg-[#d63a2b] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-[0_0_20px_rgba(240,68,50,0.3)]"
                >
                  {enrolling ? 'Enrolling...' : currentUser ? 'Enroll in Course (Free Demo)' : 'Sign In & Enroll'}
                </button>
              )}

              <button
                onClick={() => onOpenCommunity(course.id)}
                className="w-full py-2.5 bg-[#10182a] hover:bg-slate-800 border border-slate-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#4b8bff]" />
                <span>Course Q&A ({courseDiscussions.length} Threads)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Objectives & Prerequisites */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Learning Objectives</span>
            </h2>
            <ul className="space-y-2 text-xs text-[#a7b0c0]">
              {course.learningObjectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4b8bff] mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-[#4b8bff]" />
                <span>Prerequisites</span>
              </h2>
              <ul className="space-y-1.5 text-xs text-[#a7b0c0]">
                {(course.prerequisites.length > 0 ? course.prerequisites : ['None']).map((p, i) => (
                  <li key={i}>• {p}</li>
                ))}
              </ul>
            </div>
            <div className="pt-3 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-300">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Includes downloadable PDF lecture notes, interactive 3D/Virtual Lab activities, and a verified Completion Certificate upon passing the Final Assessment.
              </span>
            </div>
          </div>
        </div>

        {/* Structured Course Curriculum */}
        <div className="p-6 sm:p-8 bg-[#10182a] border border-slate-800 rounded-2xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white">Course Curriculum & Modules</h2>
            <span className="text-xs font-mono text-[#a7b0c0]">
              {courseModules.length} Modules · {courseLessons.length} Lessons
            </span>
          </div>

          <div className="space-y-4">
            {courseModules.map((mod) => {
              const modLessons = courseLessons.filter((l) => l.moduleId === mod.id);
              return (
                <div
                  key={mod.id}
                  className="bg-[#080d1a] border border-slate-800 rounded-2xl overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-white">{mod.title}</h3>
                      {mod.description && (
                        <p className="text-xs text-[#a7b0c0] mt-0.5">{mod.description}</p>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-[#4b8bff] shrink-0">
                      {modLessons.length} items
                    </span>
                  </div>
                  <div className="divide-y divide-slate-800/70">
                    {modLessons.map((les) => {
                      const done = lessonProgress.some(
                        (p) => p.lessonId === les.id && p.completed
                      );
                      return (
                        <button
                          key={les.id}
                          onClick={() => onStartLearning(course.id, les.id)}
                          className="w-full text-left px-4 py-3 hover:bg-[#10182a] flex items-center justify-between gap-3 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {lessonTypeIcon(les.type)}
                            <span className="text-xs sm:text-sm text-slate-200 truncate">
                              {les.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono text-[#a7b0c0]">
                            <span className="uppercase">{les.type}</span>
                            <span>{les.durationMinutes}m</span>
                            {done && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
