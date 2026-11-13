/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  FlaskConical,
  Menu,
  Play,
  Pause,
  Save,
  Sparkles,
  Award,
  ClipboardCheck,
  Video,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { downloadLessonNotesPDF } from '../utils/pdfGenerator';
import { QuizEngine } from './QuizEngine';
import { Lesson } from '../types/lms';

interface CoursePlayerPageProps {
  courseId: string;
  initialLessonId?: string;
  onExit: () => void;
  onOpenAuth: () => void;
  onLaunchLabExperiment: (experimentId: string) => void;
  onViewCertificate: (courseId: string) => void;
}

export const CoursePlayerPage: React.FC<CoursePlayerPageProps> = ({
  courseId,
  initialLessonId,
  onExit,
  onOpenAuth,
  onLaunchLabExperiment,
  onViewCertificate,
}) => {
  const {
    courses,
    modules,
    lessons,
    enrollments,
    lessonProgress,
    certificates,
    currentUser,
    enrollInCourse,
    toggleLessonComplete,
    toggleBookmark,
    saveLessonNote,
  } = usePlatform();

  const course = courses.find((c) => c.id === courseId);
  const courseModules = useMemo(
    () => modules.filter((m) => m.courseId === courseId).sort((a, b) => a.order - b.order),
    [modules, courseId]
  );
  const courseLessons = useMemo(
    () => lessons.filter((l) => l.courseId === courseId).sort((a, b) => a.order - b.order),
    [lessons, courseId]
  );

  const [activeLessonId, setActiveLessonId] = useState<string>(
    initialLessonId || courseLessons[0]?.id || ''
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Interactive scripted video lecture state
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoSegmentIdx, setVideoSegmentIdx] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.5 | 2>(1);

  // Personal notes state
  const [noteDraft, setNoteDraft] = useState('');
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);

  useEffect(() => {
    if (initialLessonId) {
      setActiveLessonId(initialLessonId);
    } else if (!activeLessonId && courseLessons[0]) {
      setActiveLessonId(courseLessons[0].id);
    }
  }, [initialLessonId, courseLessons]);

  const activeLesson: Lesson | undefined =
    courseLessons.find((l) => l.id === activeLessonId) || courseLessons[0];

  const activeProgress = lessonProgress.find((p) => p.lessonId === activeLesson?.id);

  useEffect(() => {
    setNoteDraft(activeProgress?.personalNote || '');
    setNoteSavedFeedback(false);
    setVideoPlaying(false);
    setVideoSegmentIdx(0);
  }, [activeLesson?.id, activeProgress?.personalNote]);

  // Auto-advance interactive lecture captions when playing
  useEffect(() => {
    if (!videoPlaying || !activeLesson?.videoScript?.length) return;
    const ms = Math.round(6000 / playbackSpeed);
    const timer = setInterval(() => {
      setVideoSegmentIdx((prev) => {
        if (prev + 1 >= (activeLesson.videoScript?.length || 1)) {
          setVideoPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, ms);
    return () => clearInterval(timer);
  }, [videoPlaying, playbackSpeed, activeLesson?.videoScript]);

  if (!course || !activeLesson) {
    return (
      <div className="py-16 text-center text-sm text-[#a7b0c0]">
        Lesson content not available.{' '}
        <button onClick={onExit} className="text-[#4b8bff] underline cursor-pointer">
          Back to Course
        </button>
      </div>
    );
  }

  const enrollment = enrollments.find((e) => e.courseId === courseId);
  const earnedCert = certificates.find((c) => c.courseId === courseId);
  const currentIdx = courseLessons.findIndex((l) => l.id === activeLesson.id);
  const prevLesson = currentIdx > 0 ? courseLessons[currentIdx - 1] : null;
  const nextLesson =
    currentIdx >= 0 && currentIdx < courseLessons.length - 1 ? courseLessons[currentIdx + 1] : null;

  const completedCount = courseLessons.filter((l) =>
    lessonProgress.some((p) => p.lessonId === l.id && p.completed)
  ).length;
  const progressPercent =
    courseLessons.length > 0 ? Math.round((completedCount / courseLessons.length) * 100) : 0;

  const relatedLessons = courseLessons
    .filter((l) => l.id !== activeLesson.id)
    .slice(0, 3);

  const ensureAuthAndRun = async (fn: () => Promise<void>) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!enrollment) {
      await enrollInCourse(course.id);
    }
    await fn();
  };

  const handleSaveNote = async () => {
    await ensureAuthAndRun(async () => {
      await saveLessonNote(course.id, activeLesson.id, noteDraft);
      setNoteSavedFeedback(true);
      setTimeout(() => setNoteSavedFeedback(false), 2500);
    });
  };

  const downloadResourceText = (title: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = title.replace(/[^a-zA-Z0-9._-]+/g, '_');
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#060a12] text-white min-h-[85vh] flex flex-col">
      {/* Top Distraction-Free Player Header */}
      <div className="bg-[#0c1424] border-b border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onExit}
            className="p-2 bg-[#080d1a] hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white cursor-pointer"
            title="Exit Course Player"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            className="p-2 bg-[#080d1a] hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white cursor-pointer"
            title="Toggle Curriculum Sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#4b8bff] uppercase">
                {course.category}
              </span>
              {course.isDemoCourse && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300">
                  Demo Course
                </span>
              )}
            </div>
            <h1 className="text-sm sm:text-base font-bold text-white truncate">{course.title}</h1>
          </div>
        </div>

        {/* Course Progress Bar & Certificate Shortcut */}
        <div className="flex items-center gap-4">
          <div className="w-36 sm:w-48">
            <div className="flex justify-between text-[11px] font-mono text-[#a7b0c0] mb-1">
              <span>Course Progress</span>
              <span className="text-white font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4b8bff] to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {earnedCert && (
            <button
              onClick={() => onViewCertificate(course.id)}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Certificate</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Split Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Curriculum Sidebar */}
        {sidebarOpen && (
          <aside className="w-full lg:w-80 bg-[#0b1120] border-b lg:border-b-0 lg:border-r border-slate-800 shrink-0 overflow-y-auto max-h-[45vh] lg:max-h-[calc(100vh-120px)]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-[#a7b0c0]">
              <span>MODULES & LESSONS</span>
              <span>
                {completedCount}/{courseLessons.length} done
              </span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {courseModules.map((mod) => {
                const modLessons = courseLessons.filter((l) => l.moduleId === mod.id);
                const modCompleted = modLessons.filter((l) =>
                  lessonProgress.some((p) => p.lessonId === l.id && p.completed)
                ).length;
                const modDone = modLessons.length > 0 && modCompleted === modLessons.length;

                return (
                  <div key={mod.id} className="p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2 px-1">
                      <h3 className="text-xs font-bold text-slate-200 leading-snug">{mod.title}</h3>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                          modDone
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {modCompleted}/{modLessons.length}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {modLessons.map((les) => {
                        const isActive = les.id === activeLesson.id;
                        const isDone = lessonProgress.some(
                          (p) => p.lessonId === les.id && p.completed
                        );
                        const isBookmarked = lessonProgress.some(
                          (p) => p.lessonId === les.id && p.bookmarked
                        );

                        return (
                          <button
                            key={les.id}
                            onClick={() => setActiveLessonId(les.id)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-[#4b8bff]/20 border border-[#4b8bff]/50 text-white font-semibold'
                                : 'hover:bg-[#10182a] text-[#a7b0c0]'
                            }`}
                          >
                            <span className="truncate">{les.title}</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {isBookmarked && <Bookmark className="w-3 h-3 text-amber-400 fill-amber-400" />}
                              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* Active Lesson Content Area */}
        <div className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-6">
          {/* Lesson Top Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-mono text-[#4b8bff] uppercase tracking-wider">
                {activeLesson.type} · {activeLesson.durationMinutes} min
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                {activeLesson.title}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() =>
                  ensureAuthAndRun(() => toggleBookmark(course.id, activeLesson.id))
                }
                className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                  activeProgress?.bookmarked
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                    : 'bg-[#10182a] border-slate-700 text-[#a7b0c0] hover:text-white'
                }`}
              >
                <Bookmark
                  className={`w-3.5 h-3.5 ${activeProgress?.bookmarked ? 'fill-amber-300' : ''}`}
                />
                <span>{activeProgress?.bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>

              <button
                onClick={() =>
                  ensureAuthAndRun(() => toggleLessonComplete(course.id, activeLesson.id))
                }
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                  activeProgress?.completed
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-[#4b8bff] hover:bg-[#3d7be6] text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{activeProgress?.completed ? 'Completed' : 'Mark Lesson Complete'}</span>
              </button>
            </div>
          </div>

          {/* VIDEO PLAYER (Uploaded MP4/WebM OR Interactive Lecture Script Player) */}
          {activeLesson.type === 'video' && (
            <div className="bg-[#0b1120] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              {activeLesson.videoUrl ? (
                <video
                  src={activeLesson.videoUrl}
                  controls
                  className="w-full aspect-video bg-black"
                />
              ) : (
                <div className="p-6 sm:p-8 space-y-5 bg-gradient-to-br from-[#080d1a] via-[#10182a] to-[#0b1326]">
                  <div className="flex items-center justify-between text-xs font-mono text-[#a7b0c0]">
                    <span className="flex items-center gap-1.5 text-[#4b8bff]">
                      <Video className="w-4 h-4" />
                      Interactive Concept Briefing Player
                    </span>
                    <span>
                      Slide {videoSegmentIdx + 1} / {activeLesson.videoScript?.length || 1}
                    </span>
                  </div>

                  {activeLesson.videoScript && activeLesson.videoScript[videoSegmentIdx] ? (
                    <div className="p-6 bg-[#080d1a]/90 border border-[#4b8bff]/30 rounded-2xl min-h-[160px] flex flex-col justify-center space-y-3">
                      <span className="text-xs font-mono text-[#f04432]">
                        [{activeLesson.videoScript[videoSegmentIdx].time}]
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        {activeLesson.videoScript[videoSegmentIdx].heading}
                      </h3>
                      <p className="text-sm text-slate-200 leading-relaxed">
                        {activeLesson.videoScript[videoSegmentIdx].caption}
                      </p>
                    </div>
                  ) : null}

                  {/* Player Scrubber & Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setVideoPlaying((p) => !p)}
                        className="px-4 py-2 bg-[#f04432] hover:bg-[#d63a2b] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                      >
                        {videoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{videoPlaying ? 'Pause Briefing' : 'Play Briefing'}</span>
                      </button>

                      {activeLesson.videoScript?.map((seg, i) => (
                        <button
                          key={i}
                          onClick={() => setVideoSegmentIdx(i)}
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono border cursor-pointer ${
                            i === videoSegmentIdx
                              ? 'bg-[#4b8bff] border-[#4b8bff] text-white font-bold'
                              : 'bg-[#080d1a] border-slate-800 text-[#a7b0c0]'
                          }`}
                        >
                          {seg.time}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() =>
                        setPlaybackSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1))
                      }
                      className="px-3 py-1.5 bg-[#080d1a] border border-slate-700 rounded-lg text-xs font-mono text-cyan-400 cursor-pointer"
                    >
                      Speed: {playbackSpeed}x
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PRACTICAL LAB LAUNCHER CARD */}
          {activeLesson.type === 'practical' && (
            <div className="p-6 bg-gradient-to-r from-[#10182a] to-[#0c1424] border border-emerald-500/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <FlaskConical className="w-4 h-4" />
                  <span>INTERACTIVE VIRTUAL LABORATORY ACTIVITY</span>
                </div>
                <p className="text-sm font-bold text-white">
                  Complete the guided simulation trials and record your observations.
                </p>
                <p className="text-xs text-[#a7b0c0]">
                  Simulated mathematical & 3D lab model — export your PDF report after recording trials.
                </p>
              </div>
              <button
                onClick={() =>
                  onLaunchLabExperiment(activeLesson.experimentId || 'phy-projectile')
                }
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shrink-0 flex items-center gap-2 cursor-pointer"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Open Virtual Lab Workbench →</span>
              </button>
            </div>
          )}

          {/* QUIZ ENGINE */}
          {activeLesson.type === 'quiz' && activeLesson.quizId && (
            <QuizEngine
              quizId={activeLesson.quizId}
              courseId={course.id}
              onOpenAuth={onOpenAuth}
              onViewCertificate={() => onViewCertificate(course.id)}
            />
          )}

          {/* WRITTEN LESSON CONTENT */}
          <div className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#4b8bff]" />
                <span>Lesson Notes & Technical Reference</span>
              </h3>
              <div className="flex items-center gap-2">
                {activeLesson.pdfNotesUrl && (
                  <a
                    href={activeLesson.pdfNotesUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-[#080d1a] hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-cyan-400 rounded-lg flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Uploaded PDF</span>
                  </a>
                )}
                <button
                  onClick={() =>
                    downloadLessonNotesPDF({
                      courseTitle: course.title,
                      lessonTitle: activeLesson.title,
                      instructorName: course.instructorName,
                      notesTitle: activeLesson.pdfNotesTitle,
                      content: activeLesson.pdfNotesContent || activeLesson.contentMarkdown,
                    })
                  }
                  className="px-3 py-1.5 bg-[#4b8bff]/15 hover:bg-[#4b8bff]/25 border border-[#4b8bff]/40 text-[#4b8bff] text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Notes</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
              {activeLesson.contentMarkdown}
            </div>

            {/* Downloadable Extra Resources */}
            {activeLesson.resources.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white block">
                  Downloadable Lesson Resources
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeLesson.resources.map((res, i) => (
                    <button
                      key={i}
                      onClick={() => downloadResourceText(res.title, res.content)}
                      className="p-3 bg-[#080d1a] hover:border-[#4b8bff]/50 border border-slate-800 rounded-xl flex items-center justify-between text-left cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-xs font-bold text-white block truncate">
                          {res.title}
                        </span>
                        <span className="text-[11px] text-[#a7b0c0] block truncate">
                          {res.description}
                        </span>
                      </div>
                      <Download className="w-4 h-4 text-[#4b8bff] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* PERSONAL LEARNING NOTES */}
          <div className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Your Personal Lesson Notes</h3>
              {noteSavedFeedback && (
                <span className="text-xs text-emerald-400 font-mono">Saved ✓</span>
              )}
            </div>
            <textarea
              rows={3}
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="Write formulas, observations, or exam reminders for this lesson..."
              className="w-full p-3.5 bg-[#080d1a] border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#4b8bff]"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 bg-[#080d1a] hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 text-[#4b8bff]" />
                <span>Save Personal Notes</span>
              </button>
            </div>
          </div>

          {/* Previous / Next Navigation & Related Lessons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => prevLesson && setActiveLessonId(prevLesson.id)}
              disabled={!prevLesson}
              className="px-4 py-2.5 bg-[#10182a] hover:bg-slate-800 disabled:opacity-40 border border-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Lesson</span>
            </button>

            <button
              onClick={() => nextLesson && setActiveLessonId(nextLesson.id)}
              disabled={!nextLesson}
              className="px-4 py-2.5 bg-[#4b8bff] hover:bg-[#3d7be6] disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next Lesson</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {relatedLessons.length > 0 && (
            <div className="p-5 bg-[#10182a] border border-slate-800 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-[#a7b0c0] uppercase tracking-wider">
                Related Lessons in This Course
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedLessons.map((rl) => (
                  <button
                    key={rl.id}
                    onClick={() => setActiveLessonId(rl.id)}
                    className="p-3 bg-[#080d1a] hover:border-[#4b8bff]/50 border border-slate-800 rounded-xl text-left cursor-pointer"
                  >
                    <span className="text-[10px] font-mono text-[#4b8bff] uppercase">
                      {rl.type}
                    </span>
                    <span className="text-xs font-semibold text-white block mt-0.5 line-clamp-2">
                      {rl.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
