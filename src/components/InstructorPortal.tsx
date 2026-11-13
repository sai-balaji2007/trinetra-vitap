/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Plus,
  BookOpen,
  Layers,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Megaphone,
  ClipboardCheck,
  Lock,
  CheckCircle2,
  Database,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { COURSE_CATEGORIES, CourseCategory, DifficultyLevel, LessonType, QuestionType } from '../types/lms';
import { buildCourseThumbnail } from '../data/demoCourses';

interface InstructorPortalProps {
  onOpenAuth: () => void;
}

export const InstructorPortal: React.FC<InstructorPortalProps> = ({ onOpenAuth }) => {
  const {
    currentUser,
    isDemoMode,
    courses,
    modules,
    lessons,
    quizzes,
    questions,
    enrollments,
    quizAttempts,
    createCourse,
    deleteUnpublishedCourse,
    togglePublishCourse,
    createModule,
    createLesson,
    uploadFileToStorage,
    createQuiz,
    addQuestion,
    deleteQuestion,
    sendCourseAnnouncement,
    seedDemoCatalogToFirestore,
  } = usePlatform();

  const [tab, setTab] = useState<'courses' | 'curriculum' | 'quizzes' | 'learners'>('courses');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Course creation form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CourseCategory>('Physics');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Beginner');
  const [durationHours, setDurationHours] = useState(4);
  const [description, setDescription] = useState('');
  const [objectivesText, setObjectivesText] = useState('');
  const [prereqText, setPrereqText] = useState('');

  // Selected course for curriculum / quiz builder
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');

  // Module & Lesson creation
  const [modTitle, setModTitle] = useState('');
  const [modDesc, setModDesc] = useState('');

  const [lessonModId, setLessonModId] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonType, setLessonType] = useState<LessonType>('article');
  const [lessonMinutes, setLessonMinutes] = useState(12);
  const [lessonMarkdown, setLessonMarkdown] = useState('');
  const [lessonPdfTitle, setLessonPdfTitle] = useState('');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('');
  const [lessonPdfUrl, setLessonPdfUrl] = useState('');
  const [lessonQuizId, setLessonQuizId] = useState('');
  const [lessonExpId, setLessonExpId] = useState('phy-ohms');
  const [uploadPct, setUploadPct] = useState<number | null>(null);

  // Quiz & Question Bank creation
  const [quizTitle, setQuizTitle] = useState('');
  const [quizMinutes, setQuizMinutes] = useState(15);
  const [quizPassScore, setQuizPassScore] = useState(70);
  const [quizIsFinal, setQuizIsFinal] = useState(true);
  const [activeQuizId, setActiveQuizId] = useState(quizzes[0]?.id || '');

  const [qType, setQType] = useState<QuestionType>('mcq');
  const [qPrompt, setQPrompt] = useState('');
  const [qOptionsText, setQOptionsText] = useState('Option A, Option B, Option C, Option D');
  const [qCorrectText, setQCorrectText] = useState('Option A');
  const [qExplanation, setQExplanation] = useState('');

  // Announcement state
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');

  const flash = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 3500);
  };

  if (!currentUser || (currentUser.role !== 'instructor' && currentUser.role !== 'admin')) {
    return (
      <div className="py-20 bg-[#080d1a] text-white min-h-[75vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 bg-[#10182a] border border-slate-800 rounded-3xl text-center space-y-4">
          <Lock className="w-10 h-10 text-[#f04432] mx-auto" />
          <h1 className="text-xl font-extrabold">Instructor Studio Access Restricted</h1>
          <p className="text-xs text-[#a7b0c0]">
            Only accounts with Instructor or Administrator privileges can create courses, upload lesson files, manage question banks, and grade assessments. Students cannot access instructor CMS actions.
          </p>
          <button
            onClick={onOpenAuth}
            className="px-5 py-2.5 bg-[#4b8bff] hover:bg-[#3d7be6] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Sign In / Switch Demo Role
          </button>
        </div>
      </div>
    );
  }

  const managedCourses = useMemo(
    () =>
      currentUser.role === 'admin'
        ? courses
        : courses.filter(
            (c) => c.instructorId === currentUser.uid || c.isDemoCourse
          ),
    [courses, currentUser]
  );

  const courseModules = modules.filter((m) => m.courseId === selectedCourseId);
  const courseQuizzes = quizzes.filter((q) => q.courseId === selectedCourseId);
  const activeQuizQuestions = questions.filter((q) => q.quizId === activeQuizId);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await createCourse({
      title,
      description,
      category,
      difficulty,
      durationHours,
      learningObjectives: objectivesText.split('\n').map((s) => s.trim()).filter(Boolean),
      prerequisites: prereqText.split(',').map((s) => s.trim()).filter(Boolean),
      thumbnail: buildCourseThumbnail(category, '#4b8bff', category.slice(0, 4).toUpperCase()),
      published: false,
    });
    setSelectedCourseId(created.id);
    setTitle('');
    setDescription('');
    setObjectivesText('');
    flash(`Draft course "${created.title}" created. Add modules & lessons, then click Publish.`);
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>, target: 'video' | 'pdf') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadPct(0);
    const url = await uploadFileToStorage(file, target === 'video' ? 'videos' : 'notes', setUploadPct);
    if (target === 'video') setLessonVideoUrl(url);
    else setLessonPdfUrl(url);
    setUploadPct(null);
    flash(`${file.name} uploaded successfully.`);
  };

  return (
    <div className="py-10 md:py-14 bg-[#080d1a] text-white min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-mono text-[#f04432] uppercase tracking-wider">
              Instructor Course Authoring & Analytics
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-0.5">Instructor Studio</h1>
            <p className="text-xs sm:text-sm text-[#a7b0c0] mt-1">
              Build modular courses, upload video/PDF resources, configure timed question banks, and monitor student performance.
            </p>
          </div>

          {!isDemoMode && (
            <button
              onClick={async () => {
                const count = await seedDemoCatalogToFirestore();
                flash(`Synced ${count} demo courses and modules to Cloud Firestore.`);
              }}
              className="px-4 py-2 bg-[#10182a] hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-cyan-400 flex items-center gap-2 cursor-pointer"
            >
              <Database className="w-4 h-4" />
              <span>Sync Demo Courses to Firestore</span>
            </button>
          )}
        </div>

        {statusMsg && (
          <div className="p-3.5 bg-emerald-950/40 border border-emerald-700/60 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Portal Tabs */}
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['courses', '1. Courses & Publishing'],
              ['curriculum', '2. Modules & Lessons'],
              ['quizzes', '3. Quizzes & Question Bank'],
              ['learners', '4. Enrollments & Announcements'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                tab === id
                  ? 'bg-[#4b8bff] border-[#4b8bff] text-white'
                  : 'bg-[#10182a] border-slate-800 text-[#a7b0c0] hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* TAB 1: COURSES */}
        {tab === 'courses' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form
              onSubmit={handleCreateCourse}
              className="lg:col-span-5 p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-3"
            >
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#f04432]" />
                <span>Create New Course</span>
              </h2>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Course Title (e.g., Signals & Linear Systems)"
                className="w-full px-3.5 py-2.5 bg-[#080d1a] border border-slate-700 rounded-xl text-xs text-white"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CourseCategory)}
                  className="px-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-xs text-white"
                >
                  {COURSE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  className="px-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-xs text-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <label className="block text-xs text-[#a7b0c0]">
                Duration (Hours):
                <input
                  type="number"
                  min={1}
                  max={100}
                  step={0.5}
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-xs text-white"
                />
              </label>
              <textarea
                rows={3}
                required
                minLength={10}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Course description (min. 10 characters)..."
                className="w-full px-3.5 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-xs text-white"
              />
              <textarea
                rows={2}
                value={objectivesText}
                onChange={(e) => setObjectivesText(e.target.value)}
                placeholder="Learning objectives (one per line)"
                className="w-full px-3.5 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-xs text-white"
              />
              <input
                type="text"
                value={prereqText}
                onChange={(e) => setPrereqText(e.target.value)}
                placeholder="Prerequisites (comma-separated)"
                className="w-full px-3.5 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-xs text-white"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-[#f04432] hover:bg-[#d63a2b] text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Create Draft Course
              </button>
            </form>

            <div className="lg:col-span-7 p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-4">
              <h2 className="text-base font-bold text-white">Your Courses ({managedCourses.length})</h2>
              <div className="space-y-3">
                {managedCourses.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 bg-[#080d1a] border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{c.title}</span>
                        <span
                          className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                            c.published
                              ? 'bg-emerald-950 text-emerald-400'
                              : 'bg-slate-800 text-amber-300'
                          }`}
                        >
                          {c.published ? 'PUBLISHED' : 'DRAFT'}
                        </span>
                      </div>
                      <span className="text-[#a7b0c0] block">
                        {c.category} · {c.totalModules} Modules · {c.totalLessons} Lessons
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setSelectedCourseId(c.id);
                          setTab('curriculum');
                        }}
                        className="px-3 py-1.5 bg-[#10182a] border border-slate-700 rounded-lg font-semibold cursor-pointer"
                      >
                        Edit Content
                      </button>
                      <button
                        onClick={() => togglePublishCourse(c.id)}
                        className="px-3 py-1.5 bg-[#4b8bff]/15 border border-[#4b8bff]/40 text-[#4b8bff] rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {c.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{c.published ? 'Unpublish' : 'Publish'}</span>
                      </button>
                      {!c.published && (
                        <button
                          onClick={() => deleteUnpublishedCourse(c.id)}
                          className="p-1.5 bg-rose-950/60 text-[#f04432] rounded-lg cursor-pointer"
                          title="Delete unpublished draft"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MODULES & LESSONS */}
        {tab === 'curriculum' && (
          <div className="space-y-6">
            <div className="p-4 bg-[#10182a] border border-slate-800 rounded-2xl flex flex-wrap items-center gap-3 text-xs">
              <span className="font-bold text-white">Target Course:</span>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="px-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-white"
              >
                {managedCourses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add Module */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const m = await createModule({
                    courseId: selectedCourseId,
                    title: modTitle,
                    description: modDesc,
                  });
                  setLessonModId(m.id);
                  setModTitle('');
                  setModDesc('');
                  flash(`Module "${m.title}" added.`);
                }}
                className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-3"
              >
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#4b8bff]" /> Add Course Module
                </h3>
                <input
                  type="text"
                  required
                  value={modTitle}
                  onChange={(e) => setModTitle(e.target.value)}
                  placeholder="Module Title (e.g., Module 1: Fourier Analysis)"
                  className="w-full px-3.5 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-xs text-white"
                />
                <textarea
                  rows={2}
                  value={modDesc}
                  onChange={(e) => setModDesc(e.target.value)}
                  placeholder="Short module summary..."
                  className="w-full px-3.5 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-xs text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4b8bff] text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Add Module
                </button>
              </form>

              {/* Add Lesson with File Upload */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const targetMod = lessonModId || courseModules[0]?.id;
                  if (!targetMod) {
                    flash('Please add a Module first.');
                    return;
                  }
                  const created = await createLesson({
                    courseId: selectedCourseId,
                    moduleId: targetMod,
                    title: lessonTitle,
                    type: lessonType,
                    durationMinutes: lessonMinutes,
                    videoUrl: lessonVideoUrl,
                    contentMarkdown: lessonMarkdown,
                    pdfNotesTitle: lessonPdfTitle || lessonTitle,
                    pdfNotesUrl: lessonPdfUrl,
                    pdfNotesContent: lessonMarkdown,
                    quizId: lessonType === 'quiz' ? lessonQuizId : undefined,
                    experimentId: lessonType === 'practical' ? lessonExpId : undefined,
                  });
                  setLessonTitle('');
                  setLessonMarkdown('');
                  setLessonVideoUrl('');
                  setLessonPdfUrl('');
                  flash(`Lesson "${created.title}" saved.`);
                }}
                className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-3"
              >
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#f04432]" /> Add Lesson / Upload Content
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={lessonModId || courseModules[0]?.id || ''}
                    onChange={(e) => setLessonModId(e.target.value)}
                    className="px-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-xs text-white"
                  >
                    {courseModules.map((m) => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                  <select
                    value={lessonType}
                    onChange={(e) => setLessonType(e.target.value as LessonType)}
                    className="px-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="video">Video Lecture</option>
                    <option value="article">Written Lesson</option>
                    <option value="practical">Virtual Lab Activity</option>
                    <option value="quiz">Timed Quiz</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    placeholder="Lesson Title"
                    className="col-span-2 px-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-xs text-white"
                  />
                  <input
                    type="number"
                    min={1}
                    value={lessonMinutes}
                    onChange={(e) => setLessonMinutes(Number(e.target.value))}
                    placeholder="Mins"
                    className="px-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                {lessonType === 'video' && (
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <label className="px-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl cursor-pointer flex items-center gap-1.5 text-cyan-400">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload MP4 Video</span>
                      <input type="file" accept="video/*" className="hidden" onChange={(e) => handleUploadFile(e, 'video')} />
                    </label>
                    <input
                      type="text"
                      value={lessonVideoUrl}
                      onChange={(e) => setLessonVideoUrl(e.target.value)}
                      placeholder="Or paste video URL"
                      className="flex-1 px-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                )}

                {lessonType === 'quiz' && (
                  <select
                    value={lessonQuizId}
                    onChange={(e) => setLessonQuizId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="">Select Quiz to Link</option>
                    {courseQuizzes.map((q) => (
                      <option key={q.id} value={q.id}>{q.title}</option>
                    ))}
                  </select>
                )}

                {lessonType === 'practical' && (
                  <select
                    value={lessonExpId}
                    onChange={(e) => setLessonExpId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="phy-projectile">3D Projectile & Pendulum Lab</option>
                    <option value="phy-ohms">Ohm’s Law Lab</option>
                    <option value="ece-led">LED Circuit Lab</option>
                    <option value="ece-logic">3D Digital Logic Breadboard</option>
                    <option value="cs-vsepr">3D Molecular Geometry</option>
                  </select>
                )}

                <textarea
                  rows={3}
                  required
                  value={lessonMarkdown}
                  onChange={(e) => setLessonMarkdown(e.target.value)}
                  placeholder="Rich educational lesson notes & formulas..."
                  className="w-full px-3.5 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-xs text-white"
                />

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <label className="px-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl cursor-pointer flex items-center gap-1.5 text-emerald-400">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload PDF Notes</span>
                    <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleUploadFile(e, 'pdf')} />
                  </label>
                  <input
                    type="text"
                    value={lessonPdfTitle}
                    onChange={(e) => setLessonPdfTitle(e.target.value)}
                    placeholder="PDF Notes Title"
                    className="flex-1 px-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-white"
                  />
                </div>
                {uploadPct !== null && (
                  <span className="text-[11px] font-mono text-cyan-400">Uploading: {uploadPct}%</span>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#f04432] hover:bg-[#d63a2b] text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Save Lesson to Course
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: QUIZZES & QUESTION BANK */}
        {tab === 'quizzes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-5">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const qz = await createQuiz({
                    courseId: selectedCourseId,
                    title: quizTitle,
                    timeLimitMinutes: quizMinutes,
                    passingScore: quizPassScore,
                    isFinalAssessment: quizIsFinal,
                  });
                  setActiveQuizId(qz.id);
                  setQuizTitle('');
                  flash(`Quiz "${qz.title}" created.`);
                }}
                className="p-5 bg-[#10182a] border border-slate-800 rounded-2xl space-y-3 text-xs"
              >
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-[#4b8bff]" /> Create Quiz / Final Exam
                </h3>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-white"
                >
                  {managedCourses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
                <input
                  type="text"
                  required
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="Quiz Title"
                  className="w-full px-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-white"
                />
                <div className="grid grid-cols-2 gap-3">
                  <label>Time (mins)<input type="number" min={1} max={180} value={quizMinutes} onChange={(e) => setQuizMinutes(Number(e.target.value))} className="w-full mt-1 px-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-white" /></label>
                  <label>Pass %<input type="number" min={0} max={100} value={quizPassScore} onChange={(e) => setQuizPassScore(Number(e.target.value))} className="w-full mt-1 px-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-white" /></label>
                </div>
                <label className="flex items-center gap-2 text-slate-300">
                  <input type="checkbox" checked={quizIsFinal} onChange={(e) => setQuizIsFinal(e.target.checked)} />
                  <span>Designate as Final Certificate Assessment</span>
                </label>
                <button type="submit" className="w-full py-2 bg-[#4b8bff] text-white font-bold rounded-xl cursor-pointer">
                  Create Quiz
                </button>
              </form>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const qz = quizzes.find((item) => item.id === activeQuizId);
                  if (!qz) return;
                  await addQuestion({
                    quizId: qz.id,
                    courseId: qz.courseId,
                    type: qType,
                    prompt: qPrompt,
                    options:
                      qType === 'tf'
                        ? ['True', 'False']
                        : qType === 'short'
                          ? []
                          : qOptionsText.split(',').map((s) => s.trim()).filter(Boolean),
                    correctAnswers: qCorrectText.split(',').map((s) => s.trim()).filter(Boolean),
                    explanation: qExplanation,
                    points: 10,
                  });
                  setQPrompt('');
                  setQExplanation('');
                  flash('Question added to quiz bank.');
                }}
                className="p-5 bg-[#10182a] border border-slate-800 rounded-2xl space-y-3 text-xs"
              >
                <h3 className="text-sm font-bold text-white">Add Question to Bank</h3>
                <select
                  value={activeQuizId}
                  onChange={(e) => setActiveQuizId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-white"
                >
                  {quizzes.map((q) => (
                    <option key={q.id} value={q.id}>{q.title}</option>
                  ))}
                </select>
                <select
                  value={qType}
                  onChange={(e) => setQType(e.target.value as QuestionType)}
                  className="w-full px-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-white"
                >
                  <option value="mcq">Multiple Choice (Single)</option>
                  <option value="multi">Multi-Correct</option>
                  <option value="tf">True / False</option>
                  <option value="short">Short Answer</option>
                </select>
                <textarea
                  rows={2}
                  required
                  value={qPrompt}
                  onChange={(e) => setQPrompt(e.target.value)}
                  placeholder="Question prompt..."
                  className="w-full px-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-white"
                />
                {(qType === 'mcq' || qType === 'multi') && (
                  <input
                    type="text"
                    value={qOptionsText}
                    onChange={(e) => setQOptionsText(e.target.value)}
                    placeholder="Options (comma-separated)"
                    className="w-full px-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-white"
                  />
                )}
                <input
                  type="text"
                  required
                  value={qCorrectText}
                  onChange={(e) => setQCorrectText(e.target.value)}
                  placeholder="Correct answer(s), comma-separated"
                  className="w-full px-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-white"
                />
                <input
                  type="text"
                  value={qExplanation}
                  onChange={(e) => setQExplanation(e.target.value)}
                  placeholder="Solution explanation shown after grading"
                  className="w-full px-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-white"
                />
                <button type="submit" className="w-full py-2 bg-[#f04432] text-white font-bold rounded-xl cursor-pointer">
                  Add Question
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white">
                Question Bank ({activeQuizQuestions.length} Questions)
              </h3>
              <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
                {activeQuizQuestions.map((qn, i) => (
                  <div key={qn.id} className="p-3.5 bg-[#080d1a] border border-slate-800 rounded-xl text-xs flex justify-between gap-3">
                    <div className="space-y-1">
                      <span className="font-mono text-[#4b8bff] uppercase text-[10px]">{qn.type} · {qn.points} pts</span>
                      <p className="font-semibold text-white">Q{i + 1}. {qn.prompt}</p>
                      <p className="text-emerald-400 font-mono text-[11px]">Answer: {qn.correctAnswers.join(', ')}</p>
                    </div>
                    <button
                      onClick={() => deleteQuestion(qn.id)}
                      className="p-1.5 text-slate-400 hover:text-[#f04432] self-start cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LEARNERS & ANNOUNCEMENTS */}
        {tab === 'learners' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white">Student Enrollments & Quiz Scores</h3>
              {enrollments.length === 0 && quizAttempts.length === 0 ? (
                <p className="text-xs text-[#a7b0c0]">No student enrollments or attempts recorded in this session yet.</p>
              ) : (
                <div className="space-y-2 text-xs">
                  {enrollments.map((e) => (
                    <div key={e.id} className="p-3 bg-[#080d1a] border border-slate-800 rounded-xl flex justify-between">
                      <span>User: <strong className="font-mono">{e.userId}</strong></span>
                      <span className="text-emerald-400 font-mono">{e.progressPercent}%</span>
                    </div>
                  ))}
                  {quizAttempts.map((a) => (
                    <div key={a.id} className="p-3 bg-[#080d1a] border border-slate-800 rounded-xl flex justify-between">
                      <span>Quiz {a.quizId}</span>
                      <span className="font-mono text-cyan-400">{a.percentage}% ({a.passed ? 'PASS' : 'FAIL'})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await sendCourseAnnouncement(selectedCourseId, annTitle, annMessage);
                setAnnTitle('');
                setAnnMessage('');
                flash('Course announcement dispatched to enrolled students.');
              }}
              className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-3 text-xs"
            >
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#f04432]" /> Send Course Announcement
              </h3>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-white"
              >
                {managedCourses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
              <input
                type="text"
                required
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                placeholder="Announcement Title"
                className="w-full px-3.5 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-white"
              />
              <textarea
                rows={3}
                required
                value={annMessage}
                onChange={(e) => setAnnMessage(e.target.value)}
                placeholder="Message to enrolled learners..."
                className="w-full px-3.5 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-white"
              />
              <button type="submit" className="px-5 py-2.5 bg-[#f04432] text-white font-bold rounded-xl cursor-pointer">
                Broadcast Announcement
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
