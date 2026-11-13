/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'student' | 'instructor' | 'admin';

export const COURSE_CATEGORIES = [
  'Physics',
  'Electronics',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Computer Science',
  'Programming',
  'Mathematics',
  'Engineering Fundamentals',
  'Artificial Intelligence',
  'Practical Laboratory',
] as const;

export type CourseCategory = (typeof COURSE_CATEGORIES)[number];

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  role: UserRole;
  institution: string;
  degree: string;
  bio: string;
  streakDays: number;
  xp: number;
  createdAt: string;
  updatedAt: string;
  isDemoSession?: boolean;
}

export interface Course {
  id: string;
  title: string;
  thumbnail: string;
  instructorId: string;
  instructorName: string;
  description: string;
  learningObjectives: string[];
  difficulty: DifficultyLevel;
  durationHours: number;
  category: CourseCategory;
  prerequisites: string[];
  totalModules: number;
  totalLessons: number;
  syllabus: string[];
  rating: number;
  enrollmentCount: number;
  published: boolean;
  isDemoCourse: boolean;
  featured: boolean;
  finalQuizId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseModule {
  id: string;
  courseId: string;
  instructorId: string;
  title: string;
  description: string;
  order: number;
  isPublic: boolean;
  createdAt: string;
}

export type LessonType = 'video' | 'article' | 'quiz' | 'practical';

export interface LessonResource {
  title: string;
  type: 'pdf' | 'csv' | 'code' | 'sheet';
  description: string;
  content: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  moduleId: string;
  instructorId: string;
  title: string;
  type: LessonType;
  order: number;
  durationMinutes: number;
  videoUrl?: string;
  videoScript?: { time: string; heading: string; caption: string }[];
  contentMarkdown: string;
  pdfNotesTitle: string;
  pdfNotesUrl?: string;
  pdfNotesContent: string;
  resources: LessonResource[];
  quizId?: string;
  experimentId?: string;
  isPublic: boolean;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  instructorId: string;
  status: 'active' | 'completed';
  progressPercent: number;
  completedLessonsCount: number;
  enrolledAt: string;
  updatedAt: string;
}

export interface LessonProgress {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  bookmarked: boolean;
  personalNote: string;
  updatedAt: string;
}

export type QuestionType = 'mcq' | 'multi' | 'tf' | 'short';

export interface Quiz {
  id: string;
  courseId: string;
  moduleId?: string;
  instructorId: string;
  title: string;
  timeLimitMinutes: number;
  passingScore: number; // percentage 0-100
  isFinalAssessment: boolean;
  isPublic: boolean;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  courseId: string;
  instructorId: string;
  type: QuestionType;
  prompt: string;
  options: string[];
  correctAnswers: string[];
  explanation: string;
  points: number;
  isPublic: boolean;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  courseId: string;
  instructorId: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  answers: Record<string, string[]>;
  submittedAt: string;
}

export interface Certificate {
  id: string;
  certificateCode: string;
  userId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  quizId: string;
  verified: boolean;
  issuedAt: string;
}

export interface DiscussionThread {
  id: string;
  courseId: string;
  parentId?: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  title: string;
  body: string;
  reportedCount: number;
  isFlagged: boolean;
  createdAt: string;
}

export type NotificationType =
  | 'enrollment'
  | 'lesson'
  | 'quiz'
  | 'completion'
  | 'certificate'
  | 'announcement';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

export interface LabObservationRow {
  trial: number;
  inputs: Record<string, string | number>;
  outputs: Record<string, string | number>;
  timestamp: string;
}

export interface SavedExperimentReport {
  id: string;
  userId: string;
  category: string;
  title: string;
  objective: string;
  parameters: Record<string, string | number>;
  observations: LabObservationRow[];
  conclusion: string;
  isSimulated: boolean;
  isPublic: boolean;
  createdAt: string;
}
