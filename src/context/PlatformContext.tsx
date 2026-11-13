/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile as updateFirebaseAuthProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import {
  auth,
  BOOTSTRAP_ADMIN_EMAIL,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
  storage,
  testFirestoreConnection,
} from '../firebase/config';
import {
  AppNotification,
  Certificate,
  Course,
  CourseModule,
  DiscussionThread,
  Enrollment,
  Lesson,
  LessonProgress,
  NotificationType,
  Quiz,
  QuizAttempt,
  QuizQuestion,
  SavedExperimentReport,
  UserProfile,
  UserRole,
} from '../types/lms';
import {
  DEMO_COURSES,
  DEMO_LESSONS,
  DEMO_MODULES,
  DEMO_QUESTIONS,
  DEMO_QUIZZES,
} from '../data/demoCourses';

const DEMO_STORAGE_KEY = 'trinetra_lms_demo_state_v2';

interface LocalPersistedState {
  customCourses: Course[];
  customModules: CourseModule[];
  customLessons: Lesson[];
  customQuizzes: Quiz[];
  customQuestions: QuizQuestion[];
  enrollments: Enrollment[];
  lessonProgress: LessonProgress[];
  quizAttempts: QuizAttempt[];
  certificates: Certificate[];
  discussions: DiscussionThread[];
  notifications: AppNotification[];
  experiments: SavedExperimentReport[];
}

const EMPTY_LOCAL_STATE: LocalPersistedState = {
  customCourses: [],
  customModules: [],
  customLessons: [],
  customQuizzes: [],
  customQuestions: [],
  enrollments: [],
  lessonProgress: [],
  quizAttempts: [],
  certificates: [],
  discussions: [
    {
      id: 'disc_welcome_phy',
      courseId: 'course_physics_kinematics',
      authorId: 'demo_instructor_1',
      authorName: 'Dr. Arvind Narayanan',
      authorRole: 'instructor',
      title: 'Welcome to Classical Mechanics — Ask doubts on Module 1 & Lab trials here',
      body: 'Post screenshots or numerical values from your 3D Projectile trials if your simulated horizontal range differs from analytical v₀²sin(2θ)/g due to air drag.',
      reportedCount: 0,
      isFlagged: false,
      createdAt: '2026-10-16T10:00:00.000Z',
    },
    {
      id: 'disc_welcome_ece',
      courseId: 'course_electronics_digital',
      authorId: 'demo_instructor_1',
      authorName: 'Prof. Ananya Sen',
      authorRole: 'instructor',
      title: 'Tip: Verifying NAND Universal Equivalence in the Breadboard Lab',
      body: 'Try switching the logic gate selector to NAND and setting both A=1 and B=1. Compare the oscilloscope output against your De Morgan simplification table.',
      reportedCount: 0,
      isFlagged: false,
      createdAt: '2026-10-17T11:30:00.000Z',
    },
  ],
  notifications: [],
  experiments: [],
};

function loadLocalState(): LocalPersistedState {
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) return EMPTY_LOCAL_STATE;
    const parsed = JSON.parse(raw) as Partial<LocalPersistedState>;
    return {
      ...EMPTY_LOCAL_STATE,
      ...parsed,
    };
  } catch {
    return EMPTY_LOCAL_STATE;
  }
}

function makeSafeId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now()}_${rand}`.replace(/[^a-zA-Z0-9_-]/g, '_');
}

function stripUndefined<T extends object>(obj: T): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) {
      clean[k] = v;
    }
  }
  return clean;
}

export interface PlatformContextValue {
  currentUser: UserProfile | null;
  authReady: boolean;
  firebaseConnected: boolean;
  isDemoMode: boolean;
  authError: string | null;
  clearAuthError: () => void;

  // Merged Datasets (Published / Instructor / Demo)
  courses: Course[];
  modules: CourseModule[];
  lessons: Lesson[];
  quizzes: Quiz[];
  questions: QuizQuestion[];

  // User-specific & platform records
  enrollments: Enrollment[];
  lessonProgress: LessonProgress[];
  quizAttempts: QuizAttempt[];
  certificates: Certificate[];
  discussions: DiscussionThread[];
  notifications: AppNotification[];
  experiments: SavedExperimentReport[];
  allUsers: UserProfile[];
  allEnrollmentsCount: number;

  // Auth Actions
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (params: {
    displayName: string;
    email: string;
    password: string;
    institution: string;
    degree: string;
  }) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  refreshAuthState: () => Promise<void>;
  logout: () => Promise<void>;
  enterDemoMode: (role: UserRole) => void;
  updateProfile: (updates: {
    displayName: string;
    institution: string;
    degree: string;
    bio: string;
  }) => Promise<void>;

  // Student Learning Actions
  enrollInCourse: (courseId: string) => Promise<void>;
  toggleLessonComplete: (courseId: string, lessonId: string) => Promise<void>;
  toggleBookmark: (courseId: string, lessonId: string) => Promise<void>;
  saveLessonNote: (courseId: string, lessonId: string, note: string) => Promise<void>;
  submitQuizAttempt: (params: {
    quizId: string;
    courseId: string;
    answers: Record<string, string[]>;
  }) => Promise<QuizAttempt>;
  verifyCertificateCode: (code: string) => Promise<Certificate | null>;
  saveExperimentReport: (report: Omit<SavedExperimentReport, 'id' | 'userId' | 'createdAt'>) => Promise<void>;

  // Instructor CMS Actions
  createCourse: (courseInput: {
    title: string;
    description: string;
    category: Course['category'];
    difficulty: Course['difficulty'];
    durationHours: number;
    learningObjectives: string[];
    prerequisites: string[];
    thumbnail?: string;
    published?: boolean;
  }) => Promise<Course>;
  updateCourse: (courseId: string, updates: Partial<Course>) => Promise<void>;
  deleteUnpublishedCourse: (courseId: string) => Promise<void>;
  togglePublishCourse: (courseId: string) => Promise<void>;
  createModule: (input: { courseId: string; title: string; description: string }) => Promise<CourseModule>;
  createLesson: (input: {
    courseId: string;
    moduleId: string;
    title: string;
    type: Lesson['type'];
    durationMinutes: number;
    videoUrl?: string;
    contentMarkdown: string;
    pdfNotesTitle: string;
    pdfNotesUrl?: string;
    pdfNotesContent: string;
    experimentId?: string;
    quizId?: string;
  }) => Promise<Lesson>;
  uploadFileToStorage: (
    file: File,
    folder: 'videos' | 'notes' | 'thumbnails',
    onProgress?: (pct: number) => void
  ) => Promise<string>;
  createQuiz: (input: {
    courseId: string;
    moduleId?: string;
    title: string;
    timeLimitMinutes: number;
    passingScore: number;
    isFinalAssessment: boolean;
  }) => Promise<Quiz>;
  addQuestion: (input: Omit<QuizQuestion, 'id' | 'instructorId' | 'isPublic'>) => Promise<QuizQuestion>;
  deleteQuestion: (questionId: string) => Promise<void>;
  sendCourseAnnouncement: (courseId: string, title: string, message: string) => Promise<void>;
  seedDemoCatalogToFirestore: () => Promise<number>;

  // Community & Admin Moderation Actions
  createDiscussion: (input: {
    courseId: string;
    title: string;
    body: string;
    parentId?: string;
  }) => Promise<void>;
  reportDiscussion: (discussionId: string) => Promise<void>;
  deleteDiscussion: (discussionId: string) => Promise<void>;
  clearDiscussionFlag: (discussionId: string) => Promise<void>;
  changeUserRole: (uid: string, role: UserRole) => Promise<void>;
  moderateCourse: (courseId: string, published: boolean) => Promise<void>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [firebaseConnected, setFirebaseConnected] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [localState, setLocalState] = useState<LocalPersistedState>(() => loadLocalState());

  // Firestore synced collections
  const [fsCourses, setFsCourses] = useState<Course[]>([]);
  const [fsModules, setFsModules] = useState<CourseModule[]>([]);
  const [fsLessons, setFsLessons] = useState<Lesson[]>([]);
  const [fsQuizzes, setFsQuizzes] = useState<Quiz[]>([]);
  const [fsQuestions, setFsQuestions] = useState<QuizQuestion[]>([]);
  const [fsEnrollments, setFsEnrollments] = useState<Enrollment[]>([]);
  const [fsLessonProgress, setFsLessonProgress] = useState<LessonProgress[]>([]);
  const [fsQuizAttempts, setFsQuizAttempts] = useState<QuizAttempt[]>([]);
  const [fsCertificates, setFsCertificates] = useState<Certificate[]>([]);
  const [fsDiscussions, setFsDiscussions] = useState<DiscussionThread[]>([]);
  const [fsNotifications, setFsNotifications] = useState<AppNotification[]>([]);
  const [fsExperiments, setFsExperiments] = useState<SavedExperimentReport[]>([]);
  const [fsAllUsers, setFsAllUsers] = useState<UserProfile[]>([]);

  // Persist local demo state
  useEffect(() => {
    try {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(localState));
    } catch {
      // Ignore quota errors
    }
  }, [localState]);

  // Verify Firestore connectivity on mount
  useEffect(() => {
    testFirestoreConnection().then(setFirebaseConnected);
  }, []);

  const isDemoMode = Boolean(currentUser?.isDemoSession);

  // Sync Firebase Auth user -> UserProfile in Firestore
  const syncFirebaseUserProfile = useCallback(async (fbUser: FirebaseUser) => {
    const now = new Date().toISOString();
    const isBootstrapAdmin =
      fbUser.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase() && fbUser.emailVerified;

    try {
      const userRef = doc(db, 'users', fbUser.uid);
      const privateRef = doc(db, 'users', fbUser.uid, 'private', 'profile');
      const snap = await getDoc(userRef);

      let profile: UserProfile;
      if (snap.exists()) {
        const data = snap.data() as Record<string, unknown>;
        const existingRole = (data.role as UserRole) || 'student';
        const effectiveRole: UserRole = isBootstrapAdmin ? 'admin' : existingRole;

        profile = {
          uid: fbUser.uid,
          displayName: String(data.displayName || fbUser.displayName || fbUser.email?.split('@')[0] || 'Student'),
          email: fbUser.email || '',
          emailVerified: fbUser.emailVerified,
          role: effectiveRole,
          institution: String(data.institution || ''),
          degree: String(data.degree || ''),
          bio: String(data.bio || ''),
          streakDays: typeof data.streakDays === 'number' ? data.streakDays : 1,
          xp: typeof data.xp === 'number' ? data.xp : 0,
          createdAt: String(data.createdAt || now),
          updatedAt: now,
          isDemoSession: false,
        };

        if (isBootstrapAdmin && existingRole !== 'admin') {
          await updateDoc(userRef, { role: 'admin', updatedAt: now });
          await setDoc(doc(db, 'admins', fbUser.uid), { uid: fbUser.uid, promotedAt: now });
        }
      } else {
        const initialRole: UserRole = isBootstrapAdmin ? 'admin' : 'student';
        const displayName =
          fbUser.displayName?.trim() || fbUser.email?.split('@')[0] || 'TRINETRA Learner';

        const firestoreUserDoc = {
          uid: fbUser.uid,
          displayName,
          role: initialRole,
          institution: '',
          degree: '',
          bio: '',
          streakDays: 1,
          xp: 0,
          createdAt: now,
          updatedAt: now,
        };
        await setDoc(userRef, firestoreUserDoc);

        if (isBootstrapAdmin) {
          await setDoc(doc(db, 'admins', fbUser.uid), { uid: fbUser.uid, promotedAt: now });
        }

        profile = {
          ...firestoreUserDoc,
          email: fbUser.email || '',
          emailVerified: fbUser.emailVerified,
          isDemoSession: false,
        };
      }

      // Sync private profile doc (isolated PII)
      await setDoc(privateRef, {
        uid: fbUser.uid,
        email: fbUser.email || '',
        emailVerified: fbUser.emailVerified,
        updatedAt: now,
      });

      setCurrentUser(profile);
    } catch (err) {
      console.warn('Firestore profile sync warning:', err);
      // Fallback profile if offline or awaiting email verification
      setCurrentUser({
        uid: fbUser.uid,
        displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Learner',
        email: fbUser.email || '',
        emailVerified: fbUser.emailVerified,
        role: isBootstrapAdmin ? 'admin' : 'student',
        institution: '',
        degree: '',
        bio: '',
        streakDays: 1,
        xp: 0,
        createdAt: now,
        updatedAt: now,
        isDemoSession: false,
      });
    }
  }, []);

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        await syncFirebaseUserProfile(fbUser);
      } else {
        setCurrentUser((prev) => (prev?.isDemoSession ? prev : null));
      }
      setAuthReady(true);
    });
    return () => unsub();
  }, [syncFirebaseUserProfile]);

  // Public Firestore catalog & discussion listeners
  useEffect(() => {
    const unsubs: (() => void)[] = [];

    const listenPublicCollection = <T,>(
      colName: string,
      filterField: string,
      filterVal: unknown,
      setter: React.Dispatch<React.SetStateAction<T[]>>
    ) => {
      const q = query(collection(db, colName), where(filterField, '==', filterVal));
      const u = onSnapshot(
        q,
        (snap) => {
          setter(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) }) as T));
        },
        (err) => {
          console.warn(`Public listener warning (${colName}):`, err.message);
        }
      );
      unsubs.push(u);
    };

    listenPublicCollection<Course>('courses', 'published', true, setFsCourses);
    listenPublicCollection<CourseModule>('modules', 'isPublic', true, setFsModules);
    listenPublicCollection<Lesson>('lessons', 'isPublic', true, setFsLessons);
    listenPublicCollection<Quiz>('quizzes', 'isPublic', true, setFsQuizzes);
    listenPublicCollection<QuizQuestion>('questions', 'isPublic', true, setFsQuestions);
    listenPublicCollection<DiscussionThread>('discussions', 'isFlagged', false, setFsDiscussions);

    return () => unsubs.forEach((u) => u());
  }, []);

  // Authenticated user-scoped Firestore listeners (guarded on firebaseUser != null)
  useEffect(() => {
    if (!firebaseUser || !currentUser || currentUser.isDemoSession) {
      setFsEnrollments([]);
      setFsLessonProgress([]);
      setFsQuizAttempts([]);
      setFsCertificates([]);
      setFsNotifications([]);
      setFsExperiments([]);
      setFsAllUsers([]);
      return;
    }

    const unsubs: (() => void)[] = [];
    const uid = firebaseUser.uid;
    const role = currentUser.role;

    const attachUserListener = <T,>(
      colName: string,
      field: string,
      val: string,
      setter: React.Dispatch<React.SetStateAction<T[]>>
    ) => {
      const q = query(collection(db, colName), where(field, '==', val));
      const u = onSnapshot(
        q,
        (snap) => {
          setter(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) }) as T));
        },
        (err) => {
          console.warn(`User listener warning (${colName}):`, err.message);
        }
      );
      unsubs.push(u);
    };

    attachUserListener<Enrollment>('enrollments', 'userId', uid, setFsEnrollments);
    attachUserListener<LessonProgress>('lessonProgress', 'userId', uid, setFsLessonProgress);
    attachUserListener<QuizAttempt>('quizAttempts', 'userId', uid, setFsQuizAttempts);
    attachUserListener<Certificate>('certificates', 'userId', uid, setFsCertificates);
    attachUserListener<AppNotification>('notifications', 'userId', uid, setFsNotifications);
    attachUserListener<SavedExperimentReport>('experiments', 'userId', uid, setFsExperiments);

    // If instructor, also listen to their own unpublished courses
    if (role === 'instructor') {
      const qCourses = query(collection(db, 'courses'), where('instructorId', '==', uid));
      unsubs.push(
        onSnapshot(
          qCourses,
          (snap) => {
            const own = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Course);
            setFsCourses((prev) => {
              const map = new Map<string, Course>();
              prev.forEach((c) => map.set(c.id, c));
              own.forEach((c) => map.set(c.id, c));
              return Array.from(map.values());
            });
          },
          (err) => console.warn('Instructor courses listener:', err.message)
        )
      );
    }

    // If admin, listen to all courses, all users, and all discussions (including flagged)
    if (role === 'admin') {
      unsubs.push(
        onSnapshot(
          collection(db, 'courses'),
          (snap) => setFsCourses(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Course)),
          (err) => console.warn('Admin courses listener:', err.message)
        )
      );
      unsubs.push(
        onSnapshot(
          collection(db, 'users'),
          (snap) =>
            setFsAllUsers(
              snap.docs.map((d) => {
                const data = d.data() as Record<string, unknown>;
                return {
                  uid: d.id,
                  displayName: String(data.displayName || 'User'),
                  email: '',
                  emailVerified: true,
                  role: (data.role as UserRole) || 'student',
                  institution: String(data.institution || ''),
                  degree: String(data.degree || ''),
                  bio: String(data.bio || ''),
                  streakDays: Number(data.streakDays || 0),
                  xp: Number(data.xp || 0),
                  createdAt: String(data.createdAt || ''),
                  updatedAt: String(data.updatedAt || ''),
                };
              })
            ),
          (err) => console.warn('Admin users listener:', err.message)
        )
      );
      unsubs.push(
        onSnapshot(
          collection(db, 'discussions'),
          (snap) =>
            setFsDiscussions(
              snap.docs.map((d) => ({ id: d.id, ...d.data() }) as DiscussionThread)
            ),
          (err) => console.warn('Admin discussions listener:', err.message)
        )
      );
    }

    return () => unsubs.forEach((u) => u());
  }, [firebaseUser, currentUser?.uid, currentUser?.role, currentUser?.isDemoSession]);

  // Merged Datasets (Demo + Firestore + Local custom)
  const courses = useMemo(() => {
    const map = new Map<string, Course>();
    DEMO_COURSES.forEach((c) => map.set(c.id, c));
    localState.customCourses.forEach((c) => map.set(c.id, c));
    fsCourses.forEach((c) => map.set(c.id, c));
    return Array.from(map.values());
  }, [fsCourses, localState.customCourses]);

  const modules = useMemo(() => {
    const map = new Map<string, CourseModule>();
    DEMO_MODULES.forEach((m) => map.set(m.id, m));
    localState.customModules.forEach((m) => map.set(m.id, m));
    fsModules.forEach((m) => map.set(m.id, m));
    return Array.from(map.values()).sort((a, b) => a.order - b.order);
  }, [fsModules, localState.customModules]);

  const lessons = useMemo(() => {
    const map = new Map<string, Lesson>();
    DEMO_LESSONS.forEach((l) => map.set(l.id, l));
    localState.customLessons.forEach((l) => map.set(l.id, l));
    fsLessons.forEach((l) => map.set(l.id, l));
    return Array.from(map.values()).sort((a, b) => a.order - b.order);
  }, [fsLessons, localState.customLessons]);

  const quizzes = useMemo(() => {
    const map = new Map<string, Quiz>();
    DEMO_QUIZZES.forEach((q) => map.set(q.id, q));
    localState.customQuizzes.forEach((q) => map.set(q.id, q));
    fsQuizzes.forEach((q) => map.set(q.id, q));
    return Array.from(map.values());
  }, [fsQuizzes, localState.customQuizzes]);

  const questions = useMemo(() => {
    const map = new Map<string, QuizQuestion>();
    DEMO_QUESTIONS.forEach((q) => map.set(q.id, q));
    localState.customQuestions.forEach((q) => map.set(q.id, q));
    fsQuestions.forEach((q) => map.set(q.id, q));
    return Array.from(map.values());
  }, [fsQuestions, localState.customQuestions]);

  // Scoped records based on Demo vs Real Firebase Session
  const activeUid = currentUser?.uid || '';

  const enrollments = useMemo(() => {
    if (!currentUser) return [];
    const map = new Map<string, Enrollment>();
    localState.enrollments
      .filter((e) => e.userId === activeUid)
      .forEach((e) => map.set(e.id, e));
    if (!isDemoMode) {
      fsEnrollments.forEach((e) => map.set(e.id, e));
    }
    return Array.from(map.values());
  }, [currentUser, activeUid, isDemoMode, localState.enrollments, fsEnrollments]);

  const lessonProgress = useMemo(() => {
    if (!currentUser) return [];
    const map = new Map<string, LessonProgress>();
    localState.lessonProgress
      .filter((p) => p.userId === activeUid)
      .forEach((p) => map.set(p.id, p));
    if (!isDemoMode) {
      fsLessonProgress.forEach((p) => map.set(p.id, p));
    }
    return Array.from(map.values());
  }, [currentUser, activeUid, isDemoMode, localState.lessonProgress, fsLessonProgress]);

  const quizAttempts = useMemo(() => {
    if (!currentUser) return [];
    const map = new Map<string, QuizAttempt>();
    localState.quizAttempts
      .filter((a) => a.userId === activeUid)
      .forEach((a) => map.set(a.id, a));
    if (!isDemoMode) {
      fsQuizAttempts.forEach((a) => map.set(a.id, a));
    }
    return Array.from(map.values());
  }, [currentUser, activeUid, isDemoMode, localState.quizAttempts, fsQuizAttempts]);

  const certificates = useMemo(() => {
    if (!currentUser) return [];
    const map = new Map<string, Certificate>();
    localState.certificates
      .filter((c) => c.userId === activeUid)
      .forEach((c) => map.set(c.id, c));
    if (!isDemoMode) {
      fsCertificates.forEach((c) => map.set(c.id, c));
    }
    return Array.from(map.values());
  }, [currentUser, activeUid, isDemoMode, localState.certificates, fsCertificates]);

  const discussions = useMemo(() => {
    const map = new Map<string, DiscussionThread>();
    localState.discussions.forEach((d) => map.set(d.id, d));
    fsDiscussions.forEach((d) => map.set(d.id, d));
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [localState.discussions, fsDiscussions]);

  const notifications = useMemo(() => {
    if (!currentUser) return [];
    const map = new Map<string, AppNotification>();
    localState.notifications
      .filter((n) => n.userId === activeUid)
      .forEach((n) => map.set(n.id, n));
    if (!isDemoMode) {
      fsNotifications.forEach((n) => map.set(n.id, n));
    }
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [currentUser, activeUid, isDemoMode, localState.notifications, fsNotifications]);

  const experiments = useMemo(() => {
    if (!currentUser) return [];
    const map = new Map<string, SavedExperimentReport>();
    localState.experiments
      .filter((r) => r.userId === activeUid)
      .forEach((r) => map.set(r.id, r));
    if (!isDemoMode) {
      fsExperiments.forEach((r) => map.set(r.id, r));
    }
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [currentUser, activeUid, isDemoMode, localState.experiments, fsExperiments]);

  const allUsers = useMemo(() => {
    if (fsAllUsers.length > 0) return fsAllUsers;
    const base: UserProfile[] = [
      {
        uid: 'demo_student_1',
        displayName: 'Demo Student (Aarav Verma)',
        email: 'student.demo@trinetra.edu.in',
        emailVerified: true,
        role: 'student',
        institution: 'TRINETRA Sandbox University',
        degree: 'B.Tech Engineering',
        bio: 'Local demonstration student account.',
        streakDays: 3,
        xp: 120,
        createdAt: '2026-10-15T09:00:00.000Z',
        updatedAt: '2026-10-15T09:00:00.000Z',
        isDemoSession: true,
      },
      {
        uid: 'demo_instructor_1',
        displayName: 'Dr. Arvind Narayanan',
        email: 'instructor.demo@trinetra.edu.in',
        emailVerified: true,
        role: 'instructor',
        institution: 'TRINETRA Faculty Council',
        degree: 'Ph.D. Physics & Engineering',
        bio: 'Demo faculty profile for course authoring.',
        streakDays: 5,
        xp: 450,
        createdAt: '2026-10-15T09:00:00.000Z',
        updatedAt: '2026-10-15T09:00:00.000Z',
        isDemoSession: true,
      },
    ];
    if (currentUser && !base.some((u) => u.uid === currentUser.uid)) {
      base.unshift(currentUser);
    }
    return base;
  }, [fsAllUsers, currentUser]);

  const allEnrollmentsCount = useMemo(() => {
    const courseSum = courses.reduce((acc, c) => acc + (c.enrollmentCount || 0), 0);
    return Math.max(courseSum, enrollments.length);
  }, [courses, enrollments.length]);

  const clearAuthError = () => setAuthError(null);

  // Helper to push a notification
  const pushNotification = useCallback(
    async (userId: string, title: string, message: string, type: NotificationType) => {
      const id = makeSafeId('notif');
      const item: AppNotification = {
        id,
        userId,
        title: title.slice(0, 150),
        message: message.slice(0, 580),
        type,
        read: false,
        createdAt: new Date().toISOString(),
      };

      if (firebaseUser && firebaseUser.emailVerified && !isDemoMode) {
        try {
          await setDoc(doc(db, 'notifications', id), item);
          return;
        } catch (err) {
          console.warn('Notification Firestore write fallback to local:', err);
        }
      }
      setLocalState((prev) => ({ ...prev, notifications: [item, ...prev.notifications] }));
    },
    [firebaseUser, isDemoMode]
  );

  // Auth Actions
  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google Sign-In failed';
      setAuthError(msg);
      throw err;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      if (code === 'auth/operation-not-allowed') {
        setAuthError(
          'Email/Password sign-in is not yet enabled in Firebase Console -> Authentication -> Sign-in method. Please use Google Sign-In or Local Demo Mode below.'
        );
      } else {
        setAuthError(err instanceof Error ? err.message : 'Sign in failed.');
      }
      throw err;
    }
  };

  const registerWithEmail = async (params: {
    displayName: string;
    email: string;
    password: string;
    institution: string;
    degree: string;
  }) => {
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, params.email.trim(), params.password);
      await updateFirebaseAuthProfile(cred.user, { displayName: params.displayName.trim() });
      await sendEmailVerification(cred.user);

      const now = new Date().toISOString();
      const userDoc = {
        uid: cred.user.uid,
        displayName: params.displayName.trim(),
        role: 'student' as UserRole,
        institution: params.institution.trim(),
        degree: params.degree.trim(),
        bio: '',
        streakDays: 1,
        xp: 0,
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(doc(db, 'users', cred.user.uid), userDoc);
      await setDoc(doc(db, 'users', cred.user.uid, 'private', 'profile'), {
        uid: cred.user.uid,
        email: params.email.trim(),
        emailVerified: false,
        updatedAt: now,
      });
      setCurrentUser({
        ...userDoc,
        email: params.email.trim(),
        emailVerified: false,
        isDemoSession: false,
      });
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      if (code === 'auth/operation-not-allowed') {
        setAuthError(
          'Email/Password registration is not yet enabled in Firebase Console -> Authentication -> Sign-in method. Use Google Sign-In or Local Demo Mode.'
        );
      } else {
        setAuthError(err instanceof Error ? err.message : 'Registration failed.');
      }
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Failed to send reset email.');
      throw err;
    }
  };

  const resendVerificationEmail = async () => {
    if (!auth.currentUser) return;
    await sendEmailVerification(auth.currentUser);
  };

  const refreshAuthState = async () => {
    if (!auth.currentUser) return;
    await reload(auth.currentUser);
    await syncFirebaseUserProfile(auth.currentUser);
  };

  const logout = async () => {
    if (auth.currentUser) {
      await signOut(auth);
    }
    setCurrentUser(null);
  };

  const enterDemoMode = (role: UserRole) => {
    const now = new Date().toISOString();
    const profiles: Record<UserRole, UserProfile> = {
      student: {
        uid: 'demo_student_1',
        displayName: 'Aarav Verma (Demo Student)',
        email: 'student.demo@trinetra.edu.in',
        emailVerified: true,
        role: 'student',
        institution: 'TRINETRA Sandbox Institute of Technology',
        degree: 'B.Tech — Electronics & Computer Science',
        bio: 'Exploring virtual STEM courses and interactive 3D labs in Local Demo Mode.',
        streakDays: 1,
        xp: 0,
        createdAt: now,
        updatedAt: now,
        isDemoSession: true,
      },
      instructor: {
        uid: 'demo_instructor_1',
        displayName: 'Dr. Arvind Narayanan (Demo Instructor)',
        email: 'instructor.demo@trinetra.edu.in',
        emailVerified: true,
        role: 'instructor',
        institution: 'TRINETRA Faculty Council',
        degree: 'Professor of Physics & Digital Systems',
        bio: 'Authoring STEM courses, assessments, and virtual lab worksheets.',
        streakDays: 4,
        xp: 350,
        createdAt: now,
        updatedAt: now,
        isDemoSession: true,
      },
      admin: {
        uid: 'demo_admin_1',
        displayName: 'Platform Admin (Demo Super-Admin)',
        email: 'admin.demo@trinetra.edu.in',
        emailVerified: true,
        role: 'admin',
        institution: 'TRINETRA Platform Governance',
        degree: 'System & Academic Oversight',
        bio: 'Moderating courses, users, and discussion quality.',
        streakDays: 7,
        xp: 900,
        createdAt: now,
        updatedAt: now,
        isDemoSession: true,
      },
    };
    setAuthError(null);
    setCurrentUser(profiles[role]);
  };

  const updateProfile = async (updates: {
    displayName: string;
    institution: string;
    degree: string;
    bio: string;
  }) => {
    if (!currentUser) throw new Error('Sign in required.');
    const now = new Date().toISOString();

    if (firebaseUser && !isDemoMode) {
      const path = `users/${currentUser.uid}`;
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          displayName: updates.displayName.trim(),
          institution: updates.institution.trim(),
          degree: updates.degree.trim(),
          bio: updates.bio.trim(),
          updatedAt: now,
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, path);
      }
    }

    setCurrentUser((prev) => (prev ? { ...prev, ...updates, updatedAt: now } : null));
  };

  // Check if a course doc exists in Firestore
  const checkCourseExistsInFirestore = async (courseId: string): Promise<boolean> => {
    try {
      const s = await getDoc(doc(db, 'courses', courseId));
      return s.exists();
    } catch {
      return false;
    }
  };

  // Seed Demo Courses to Firestore (for Admins/Instructors)
  const seedDemoCatalogToFirestore = useCallback(async (): Promise<number> => {
    if (!firebaseUser || !firebaseUser.emailVerified || isDemoMode) {
      throw new Error('Verified Firebase Admin or Instructor session required to sync to Firestore.');
    }
    let count = 0;
    for (const c of DEMO_COURSES) {
      await setDoc(doc(db, 'courses', c.id), stripUndefined({ ...c, instructorId: firebaseUser.uid }));
      count++;
    }
    for (const m of DEMO_MODULES) {
      await setDoc(doc(db, 'modules', m.id), stripUndefined({ ...m, instructorId: firebaseUser.uid }));
    }
    for (const l of DEMO_LESSONS) {
      const { videoScript: _vs, ...rest } = l;
      await setDoc(doc(db, 'lessons', l.id), stripUndefined({ ...rest, instructorId: firebaseUser.uid }));
    }
    for (const q of DEMO_QUIZZES) {
      await setDoc(doc(db, 'quizzes', q.id), stripUndefined({ ...q, instructorId: firebaseUser.uid }));
    }
    for (const qn of DEMO_QUESTIONS) {
      await setDoc(doc(db, 'questions', qn.id), stripUndefined({ ...qn, instructorId: firebaseUser.uid }));
    }
    return count;
  }, [firebaseUser, isDemoMode]);

  // Enrollment
  const enrollInCourse = async (courseId: string) => {
    if (!currentUser) throw new Error('Please sign in to enroll in this course.');
    const course = courses.find((c) => c.id === courseId);
    if (!course) throw new Error('Course not found.');

    const enrollId = `${currentUser.uid}_${courseId}`;
    if (enrollments.some((e) => e.id === enrollId)) return;

    const now = new Date().toISOString();
    const record: Enrollment = {
      id: enrollId,
      userId: currentUser.uid,
      courseId,
      instructorId: course.instructorId,
      status: 'active',
      progressPercent: 0,
      completedLessonsCount: 0,
      enrolledAt: now,
      updatedAt: now,
    };

    const existsInFs = firebaseUser && !isDemoMode && (await checkCourseExistsInFirestore(courseId));
    if (existsInFs && firebaseUser?.emailVerified) {
      const path = `enrollments/${enrollId}`;
      try {
        await setDoc(doc(db, 'enrollments', enrollId), record);
        try {
          await updateDoc(doc(db, 'courses', courseId), {
            enrollmentCount: (course.enrollmentCount || 0) + 1,
            updatedAt: now,
          });
        } catch {
          // Optional counter increment
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }
    } else {
      setLocalState((prev) => ({
        ...prev,
        enrollments: [...prev.enrollments, record],
      }));
    }

    await pushNotification(
      currentUser.uid,
      'Course Enrollment Confirmed',
      `You are now enrolled in "${course.title}". Start Module 1 to track progress and earn your certificate.`,
      'enrollment'
    );
  };

  // Issue certificate if eligible (all course lessons complete + final quiz passed)
  const checkAndIssueCertificate = useCallback(
    async (
      courseId: string,
      updatedProgress: LessonProgress[],
      latestAttempt?: QuizAttempt
    ): Promise<Certificate | null> => {
      if (!currentUser) return null;
      const course = courses.find((c) => c.id === courseId);
      if (!course) return null;

      // Already issued?
      const existingCert = certificates.find((c) => c.courseId === courseId && c.userId === currentUser.uid);
      if (existingCert) return existingCert;

      const courseLessons = lessons.filter((l) => l.courseId === courseId);
      const completedLessonIds = new Set(
        updatedProgress.filter((p) => p.courseId === courseId && p.completed).map((p) => p.lessonId)
      );
      const allLessonsDone =
        courseLessons.length > 0 && courseLessons.every((l) => completedLessonIds.has(l.id));

      const finalQuizId = course.finalQuizId;
      const passedFinal =
        (latestAttempt && latestAttempt.quizId === finalQuizId && latestAttempt.passed) ||
        quizAttempts.some((a) => a.quizId === finalQuizId && a.passed);

      if (!allLessonsDone || !passedFinal) return null;

      const certId = makeSafeId('cert');
      const code = `TRN-${new Date().getFullYear()}-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;

      const cert: Certificate = {
        id: certId,
        certificateCode: code,
        userId: currentUser.uid,
        studentName: currentUser.displayName,
        courseId: course.id,
        courseTitle: course.title,
        instructorName: course.instructorName,
        quizId: finalQuizId,
        verified: true,
        issuedAt: new Date().toISOString(),
      };

      const fsReady =
        firebaseUser &&
        firebaseUser.emailVerified &&
        !isDemoMode &&
        (await checkCourseExistsInFirestore(courseId));

      if (fsReady) {
        try {
          const quizDoc = await getDoc(doc(db, 'quizzes', finalQuizId));
          const attemptDoc = await getDoc(doc(db, 'quizAttempts', `${currentUser.uid}_${finalQuizId}`));
          if (quizDoc.exists() && attemptDoc.exists() && attemptDoc.data()?.passed === true) {
            await setDoc(doc(db, 'certificates', certId), cert);
          } else {
            setLocalState((prev) => ({ ...prev, certificates: [...prev.certificates, cert] }));
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `certificates/${certId}`);
        }
      } else {
        setLocalState((prev) => ({ ...prev, certificates: [...prev.certificates, cert] }));
      }

      await pushNotification(
        currentUser.uid,
        'Verified Certificate Earned!',
        `Congratulations! Certificate ${code} has been issued for completing "${course.title}".`,
        'certificate'
      );
      return cert;
    },
    [currentUser, courses, certificates, lessons, quizAttempts, firebaseUser, isDemoMode, pushNotification]
  );

  const upsertLessonProgress = async (
    courseId: string,
    lessonId: string,
    mutator: (prev: LessonProgress) => LessonProgress
  ) => {
    if (!currentUser) throw new Error('Sign in required.');
    const progressId = `${currentUser.uid}_${lessonId}`;
    const existing = lessonProgress.find((p) => p.id === progressId) || {
      id: progressId,
      userId: currentUser.uid,
      courseId,
      lessonId,
      completed: false,
      bookmarked: false,
      personalNote: '',
      updatedAt: new Date().toISOString(),
    };
    const nextRecord: LessonProgress = {
      ...mutator(existing),
      updatedAt: new Date().toISOString(),
    };

    const nextProgressList = [
      ...lessonProgress.filter((p) => p.id !== progressId),
      nextRecord,
    ];

    // Recalculate course enrollment progress
    const courseLessons = lessons.filter((l) => l.courseId === courseId);
    const completedCount = courseLessons.filter((l) =>
      nextProgressList.some((p) => p.lessonId === l.id && p.completed)
    ).length;
    const progressPercent =
      courseLessons.length > 0 ? Math.round((completedCount / courseLessons.length) * 100) : 0;

    const enrollId = `${currentUser.uid}_${courseId}`;
    const existingEnroll = enrollments.find((e) => e.id === enrollId);

    const fsCourseReady =
      firebaseUser &&
      firebaseUser.emailVerified &&
      !isDemoMode &&
      (await checkCourseExistsInFirestore(courseId));

    if (fsCourseReady) {
      const pPath = `lessonProgress/${progressId}`;
      try {
        await setDoc(doc(db, 'lessonProgress', progressId), nextRecord);
        if (existingEnroll) {
          await updateDoc(doc(db, 'enrollments', enrollId), {
            status: progressPercent === 100 ? 'completed' : 'active',
            progressPercent,
            completedLessonsCount: completedCount,
            updatedAt: nextRecord.updatedAt,
          });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, pPath);
      }
    } else {
      setLocalState((prev) => ({
        ...prev,
        lessonProgress: [
          ...prev.lessonProgress.filter((p) => p.id !== progressId),
          nextRecord,
        ],
        enrollments: prev.enrollments.map((e) =>
          e.id === enrollId
            ? {
                ...e,
                status: progressPercent === 100 ? 'completed' : 'active',
                progressPercent,
                completedLessonsCount: completedCount,
                updatedAt: nextRecord.updatedAt,
              }
            : e
        ),
      }));
    }

    if (nextRecord.completed && !existing.completed) {
      // Award XP on completion
      const nextXp = (currentUser.xp || 0) + 25;
      setCurrentUser((prev) => (prev ? { ...prev, xp: nextXp } : null));
      if (firebaseUser && !isDemoMode) {
        updateDoc(doc(db, 'users', currentUser.uid), {
          xp: nextXp,
          updatedAt: nextRecord.updatedAt,
        }).catch(() => {});
      }
      if (progressPercent === 100) {
        const course = courses.find((c) => c.id === courseId);
        await pushNotification(
          currentUser.uid,
          'Course Modules Complete',
          `You have completed 100% of lessons in "${course?.title || 'your course'}". Pass the Final Assessment to unlock your certificate.`,
          'completion'
        );
      }
      await checkAndIssueCertificate(courseId, nextProgressList);
    }
  };

  const toggleLessonComplete = async (courseId: string, lessonId: string) => {
    await upsertLessonProgress(courseId, lessonId, (p) => ({ ...p, completed: !p.completed }));
  };

  const toggleBookmark = async (courseId: string, lessonId: string) => {
    await upsertLessonProgress(courseId, lessonId, (p) => ({ ...p, bookmarked: !p.bookmarked }));
  };

  const saveLessonNote = async (courseId: string, lessonId: string, note: string) => {
    await upsertLessonProgress(courseId, lessonId, (p) => ({ ...p, personalNote: note }));
  };

  // Quiz submission & auto-grading
  const submitQuizAttempt = async (params: {
    quizId: string;
    courseId: string;
    answers: Record<string, string[]>;
  }): Promise<QuizAttempt> => {
    if (!currentUser) throw new Error('Sign in required to submit quiz.');
    const quiz = quizzes.find((q) => q.id === params.quizId);
    if (!quiz) throw new Error('Quiz not found.');

    const quizQuestions = questions.filter((q) => q.quizId === params.quizId);
    let score = 0;
    let maxScore = 0;

    for (const qn of quizQuestions) {
      maxScore += qn.points;
      const userAns = (params.answers[qn.id] || []).map((s) => s.trim().toLowerCase()).filter(Boolean);
      const correct = qn.correctAnswers.map((s) => s.trim().toLowerCase());

      if (qn.type === 'multi') {
        const isExactMatch =
          userAns.length === correct.length &&
          correct.every((c) => userAns.includes(c));
        if (isExactMatch) score += qn.points;
      } else if (qn.type === 'short') {
        const matched = userAns.some((ans) => correct.includes(ans));
        if (matched) score += qn.points;
      } else {
        if (userAns.length > 0 && correct.includes(userAns[0])) score += qn.points;
      }
    }

    const effectiveMax = Math.max(1, maxScore);
    const percentage = Math.round((score / effectiveMax) * 100);
    const passed = percentage >= quiz.passingScore;

    const attemptId = `${currentUser.uid}_${params.quizId}`;
    const attempt: QuizAttempt = {
      id: attemptId,
      userId: currentUser.uid,
      quizId: params.quizId,
      courseId: params.courseId,
      instructorId: quiz.instructorId,
      score,
      maxScore: effectiveMax,
      percentage,
      passed,
      answers: params.answers,
      submittedAt: new Date().toISOString(),
    };

    let savedToFirestore = false;
    if (firebaseUser && firebaseUser.emailVerified && !isDemoMode) {
      try {
        const qSnap = await getDoc(doc(db, 'quizzes', params.quizId));
        if (qSnap.exists()) {
          await setDoc(doc(db, 'quizAttempts', attemptId), attempt);
          savedToFirestore = true;
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `quizAttempts/${attemptId}`);
      }
    }

    if (!savedToFirestore) {
      setLocalState((prev) => ({
        ...prev,
        quizAttempts: [...prev.quizAttempts.filter((a) => a.id !== attemptId), attempt],
      }));
    }

    // Mark associated quiz lesson as complete if passed
    const quizLesson = lessons.find((l) => l.quizId === params.quizId);
    if (passed && quizLesson) {
      const progressId = `${currentUser.uid}_${quizLesson.id}`;
      const existingProg = lessonProgress.find((p) => p.id === progressId);
      if (!existingProg?.completed) {
        await upsertLessonProgress(params.courseId, quizLesson.id, (p) => ({ ...p, completed: true }));
      }
    }

    await pushNotification(
      currentUser.uid,
      passed ? `Passed: ${quiz.title}` : `Quiz Completed: ${quiz.title}`,
      `Score: ${score}/${effectiveMax} (${percentage}%). Required passing score: ${quiz.passingScore}%.`,
      'quiz'
    );

    if (passed && quiz.isFinalAssessment) {
      await checkAndIssueCertificate(params.courseId, lessonProgress, attempt);
    }

    return attempt;
  };

  // Certificate public lookup by verification code
  const verifyCertificateCode = async (code: string): Promise<Certificate | null> => {
    const normalized = code.trim().toUpperCase();
    const localHit = [...certificates, ...localState.certificates].find(
      (c) => c.certificateCode.toUpperCase() === normalized
    );
    if (localHit) return localHit;

    try {
      const q = query(collection(db, 'certificates'), where('certificateCode', '==', normalized));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const d = snap.docs[0];
        return { id: d.id, ...(d.data() as Record<string, unknown>) } as Certificate;
      }
    } catch {
      // Fallback: check individual get or ignore
    }
    return null;
  };

  // Save Virtual Experiment Observation Report
  const saveExperimentReport = async (
    report: Omit<SavedExperimentReport, 'id' | 'userId' | 'createdAt'>
  ) => {
    const uid = currentUser?.uid || 'guest_lab_user';
    const id = makeSafeId('exp');
    const full: SavedExperimentReport = {
      ...report,
      id,
      userId: uid,
      createdAt: new Date().toISOString(),
    };

    if (firebaseUser && firebaseUser.emailVerified && !isDemoMode) {
      try {
        await setDoc(doc(db, 'experiments', id), stripUndefined(full));
        return;
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `experiments/${id}`);
      }
    }

    setLocalState((prev) => ({
      ...prev,
      experiments: [full, ...prev.experiments],
    }));
  };

  // Instructor CMS CRUD
  const ensureInstructorOrAdmin = () => {
    if (!currentUser || (currentUser.role !== 'instructor' && currentUser.role !== 'admin')) {
      throw new Error('Only Instructors or Administrators can perform this action.');
    }
  };

  const createCourse: PlatformContextValue['createCourse'] = async (input) => {
    ensureInstructorOrAdmin();
    const now = new Date().toISOString();
    const id = makeSafeId('course');
    const newCourse: Course = {
      id,
      title: input.title.trim(),
      thumbnail: input.thumbnail || DEMO_COURSES[0].thumbnail,
      instructorId: currentUser!.uid,
      instructorName: currentUser!.displayName,
      description: input.description.trim(),
      learningObjectives: input.learningObjectives.filter(Boolean),
      difficulty: input.difficulty,
      durationHours: input.durationHours,
      category: input.category,
      prerequisites: input.prerequisites.filter(Boolean),
      totalModules: 0,
      totalLessons: 0,
      syllabus: [],
      rating: 5.0,
      enrollmentCount: 0,
      published: Boolean(input.published),
      isDemoCourse: false,
      featured: false,
      finalQuizId: '',
      createdAt: now,
      updatedAt: now,
    };

    if (firebaseUser && firebaseUser.emailVerified && !isDemoMode) {
      try {
        await setDoc(doc(db, 'courses', id), stripUndefined(newCourse));
        return newCourse;
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `courses/${id}`);
      }
    }

    setLocalState((prev) => ({ ...prev, customCourses: [newCourse, ...prev.customCourses] }));
    return newCourse;
  };

  const updateCourse = async (courseId: string, updates: Partial<Course>) => {
    ensureInstructorOrAdmin();
    const now = new Date().toISOString();
    const existing = courses.find((c) => c.id === courseId);
    if (!existing) throw new Error('Course not found.');
    const merged: Course = { ...existing, ...updates, updatedAt: now };

    if (firebaseUser && firebaseUser.emailVerified && !isDemoMode) {
      try {
        await setDoc(doc(db, 'courses', courseId), stripUndefined(merged));
        return;
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `courses/${courseId}`);
      }
    }

    setLocalState((prev) => ({
      ...prev,
      customCourses: [merged, ...prev.customCourses.filter((c) => c.id !== courseId)],
    }));
  };

  const deleteUnpublishedCourse = async (courseId: string) => {
    ensureInstructorOrAdmin();
    const existing = courses.find((c) => c.id === courseId);
    if (!existing) return;
    if (existing.published && currentUser?.role !== 'admin') {
      throw new Error('Published courses must be unpublished before deletion.');
    }

    if (firebaseUser && firebaseUser.emailVerified && !isDemoMode) {
      try {
        await deleteDoc(doc(db, 'courses', courseId));
        return;
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `courses/${courseId}`);
      }
    }
    setLocalState((prev) => ({
      ...prev,
      customCourses: prev.customCourses.filter((c) => c.id !== courseId),
    }));
  };

  const togglePublishCourse = async (courseId: string) => {
    ensureInstructorOrAdmin();
    const existing = courses.find((c) => c.id === courseId);
    if (!existing) return;
    await updateCourse(courseId, { published: !existing.published });
  };

  const createModule: PlatformContextValue['createModule'] = async (input) => {
    ensureInstructorOrAdmin();
    const course = courses.find((c) => c.id === input.courseId);
    if (!course) throw new Error('Course not found.');
    const existingMods = modules.filter((m) => m.courseId === input.courseId);
    const id = makeSafeId('mod');
    const mod: CourseModule = {
      id,
      courseId: input.courseId,
      instructorId: currentUser!.uid,
      title: input.title.trim(),
      description: input.description.trim(),
      order: existingMods.length + 1,
      isPublic: true,
      createdAt: new Date().toISOString(),
    };

    if (firebaseUser && firebaseUser.emailVerified && !isDemoMode) {
      try {
        await setDoc(doc(db, 'modules', id), stripUndefined(mod));
        await updateDoc(doc(db, 'courses', course.id), {
          totalModules: existingMods.length + 1,
          syllabus: [...(course.syllabus || []), mod.title],
          updatedAt: new Date().toISOString(),
        });
        return mod;
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `modules/${id}`);
      }
    }

    setLocalState((prev) => ({
      ...prev,
      customModules: [...prev.customModules, mod],
      customCourses: [
        {
          ...course,
          totalModules: existingMods.length + 1,
          syllabus: [...(course.syllabus || []), mod.title],
          updatedAt: new Date().toISOString(),
        },
        ...prev.customCourses.filter((c) => c.id !== course.id),
      ],
    }));
    return mod;
  };

  const createLesson: PlatformContextValue['createLesson'] = async (input) => {
    ensureInstructorOrAdmin();
    const course = courses.find((c) => c.id === input.courseId);
    if (!course) throw new Error('Course not found.');
    const existingLessons = lessons.filter((l) => l.courseId === input.courseId);
    const id = makeSafeId('les');
    const newLesson: Lesson = {
      id,
      courseId: input.courseId,
      moduleId: input.moduleId,
      instructorId: currentUser!.uid,
      title: input.title.trim(),
      type: input.type,
      order: existingLessons.length + 1,
      durationMinutes: input.durationMinutes,
      videoUrl: input.videoUrl?.trim() || undefined,
      contentMarkdown: input.contentMarkdown,
      pdfNotesTitle: input.pdfNotesTitle.trim() || input.title.trim(),
      pdfNotesUrl: input.pdfNotesUrl?.trim() || undefined,
      pdfNotesContent: input.pdfNotesContent || input.contentMarkdown,
      resources: [],
      quizId: input.quizId || undefined,
      experimentId: input.experimentId || undefined,
      isPublic: true,
      createdAt: new Date().toISOString(),
    };

    if (firebaseUser && firebaseUser.emailVerified && !isDemoMode) {
      try {
        await setDoc(doc(db, 'lessons', id), stripUndefined(newLesson));
        await updateDoc(doc(db, 'courses', course.id), {
          totalLessons: existingLessons.length + 1,
          updatedAt: new Date().toISOString(),
        });
        return newLesson;
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `lessons/${id}`);
      }
    }

    setLocalState((prev) => ({
      ...prev,
      customLessons: [...prev.customLessons, newLesson],
      customCourses: [
        {
          ...course,
          totalLessons: existingLessons.length + 1,
          updatedAt: new Date().toISOString(),
        },
        ...prev.customCourses.filter((c) => c.id !== course.id),
      ],
    }));
    return newLesson;
  };

  const uploadFileToStorage: PlatformContextValue['uploadFileToStorage'] = async (
    file,
    folder,
    onProgress
  ) => {
    if (firebaseUser && firebaseUser.emailVerified && !isDemoMode) {
      const storageRef = ref(storage, `trinetra/${folder}/${Date.now()}_${file.name}`);
      const task = uploadBytesResumable(storageRef, file);
      return await new Promise<string>((resolve, reject) => {
        task.on(
          'state_changed',
          (snap) => {
            if (onProgress && snap.totalBytes > 0) {
              onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
            }
          },
          (err) => reject(err),
          async () => {
            const url = await getDownloadURL(task.snapshot.ref);
            resolve(url);
          }
        );
      });
    }
    // Demo mode or unauthenticated local preview object URL
    if (onProgress) onProgress(100);
    return URL.createObjectURL(file);
  };

  const createQuiz: PlatformContextValue['createQuiz'] = async (input) => {
    ensureInstructorOrAdmin();
    const id = makeSafeId('quiz');
    const newQuiz: Quiz = {
      id,
      courseId: input.courseId,
      moduleId: input.moduleId || undefined,
      instructorId: currentUser!.uid,
      title: input.title.trim(),
      timeLimitMinutes: input.timeLimitMinutes,
      passingScore: input.passingScore,
      isFinalAssessment: input.isFinalAssessment,
      isPublic: true,
      createdAt: new Date().toISOString(),
    };

    if (firebaseUser && firebaseUser.emailVerified && !isDemoMode) {
      try {
        await setDoc(doc(db, 'quizzes', id), stripUndefined(newQuiz));
        if (input.isFinalAssessment) {
          await updateDoc(doc(db, 'courses', input.courseId), {
            finalQuizId: id,
            updatedAt: new Date().toISOString(),
          });
        }
        return newQuiz;
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `quizzes/${id}`);
      }
    }

    setLocalState((prev) => ({
      ...prev,
      customQuizzes: [...prev.customQuizzes, newQuiz],
    }));
    if (input.isFinalAssessment) {
      await updateCourse(input.courseId, { finalQuizId: id });
    }
    return newQuiz;
  };

  const addQuestion: PlatformContextValue['addQuestion'] = async (input) => {
    ensureInstructorOrAdmin();
    const id = makeSafeId('qn');
    const newQ: QuizQuestion = {
      ...input,
      id,
      instructorId: currentUser!.uid,
      isPublic: true,
    };

    if (firebaseUser && firebaseUser.emailVerified && !isDemoMode) {
      try {
        await setDoc(doc(db, 'questions', id), stripUndefined(newQ));
        return newQ;
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `questions/${id}`);
      }
    }
    setLocalState((prev) => ({ ...prev, customQuestions: [...prev.customQuestions, newQ] }));
    return newQ;
  };

  const deleteQuestion = async (questionId: string) => {
    ensureInstructorOrAdmin();
    if (firebaseUser && firebaseUser.emailVerified && !isDemoMode) {
      try {
        await deleteDoc(doc(db, 'questions', questionId));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `questions/${questionId}`);
      }
    }
    setLocalState((prev) => ({
      ...prev,
      customQuestions: prev.customQuestions.filter((q) => q.id !== questionId),
    }));
  };

  const sendCourseAnnouncement = async (courseId: string, title: string, message: string) => {
    ensureInstructorOrAdmin();
    // Notify active user + enrolled users
    const targets = new Set<string>([currentUser!.uid]);
    enrollments
      .filter((e) => e.courseId === courseId)
      .forEach((e) => targets.add(e.userId));

    for (const uid of targets) {
      await pushNotification(uid, title, message, 'announcement');
    }
  };

  // Community Discussions
  const createDiscussion: PlatformContextValue['createDiscussion'] = async (input) => {
    if (!currentUser) throw new Error('Sign in required to post in discussions.');
    const id = makeSafeId('disc');
    const thread: DiscussionThread = {
      id,
      courseId: input.courseId,
      parentId: input.parentId || undefined,
      authorId: currentUser.uid,
      authorName: currentUser.displayName,
      authorRole: currentUser.role,
      title: input.title.trim(),
      body: input.body.trim(),
      reportedCount: 0,
      isFlagged: false,
      createdAt: new Date().toISOString(),
    };

    if (firebaseUser && firebaseUser.emailVerified && !isDemoMode) {
      try {
        await setDoc(doc(db, 'discussions', id), stripUndefined(thread));
        return;
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `discussions/${id}`);
      }
    }
    setLocalState((prev) => ({ ...prev, discussions: [thread, ...prev.discussions] }));
  };

  const reportDiscussion = async (discussionId: string) => {
    const target = discussions.find((d) => d.id === discussionId);
    if (!target) return;
    const nextCount = target.reportedCount + 1;
    const isFlagged = nextCount >= 1;

    if (firebaseUser && firebaseUser.emailVerified && !isDemoMode) {
      try {
        await updateDoc(doc(db, 'discussions', discussionId), {
          reportedCount: nextCount,
          isFlagged,
        });
        return;
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `discussions/${discussionId}`);
      }
    }

    setLocalState((prev) => ({
      ...prev,
      discussions: prev.discussions.map((d) =>
        d.id === discussionId ? { ...d, reportedCount: nextCount, isFlagged } : d
      ),
    }));
  };

  const deleteDiscussion = async (discussionId: string) => {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Admin privileges required.');
    }
    if (firebaseUser && firebaseUser.emailVerified && !isDemoMode) {
      try {
        await deleteDoc(doc(db, 'discussions', discussionId));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `discussions/${discussionId}`);
      }
    }
    setLocalState((prev) => ({
      ...prev,
      discussions: prev.discussions.filter((d) => d.id !== discussionId),
    }));
  };

  const clearDiscussionFlag = async (discussionId: string) => {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Admin privileges required.');
    }
    if (firebaseUser && firebaseUser.emailVerified && !isDemoMode) {
      try {
        await updateDoc(doc(db, 'discussions', discussionId), {
          reportedCount: 0,
          isFlagged: false,
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `discussions/${discussionId}`);
      }
    }
    setLocalState((prev) => ({
      ...prev,
      discussions: prev.discussions.map((d) =>
        d.id === discussionId ? { ...d, reportedCount: 0, isFlagged: false } : d
      ),
    }));
  };

  // Super-Admin User Role Management & Moderation
  const changeUserRole = async (uid: string, role: UserRole) => {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Only Super-Admins can modify user roles.');
    }
    if (firebaseUser && firebaseUser.emailVerified && !isDemoMode) {
      try {
        await updateDoc(doc(db, 'users', uid), {
          role,
          updatedAt: new Date().toISOString(),
        });
        if (role === 'admin') {
          await setDoc(doc(db, 'admins', uid), {
            uid,
            promotedAt: new Date().toISOString(),
          });
        } else {
          await deleteDoc(doc(db, 'admins', uid)).catch(() => {});
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
      }
    }
    setFsAllUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, role } : u)));
  };

  const moderateCourse = async (courseId: string, published: boolean) => {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Only Super-Admins can moderate platform courses.');
    }
    await updateCourse(courseId, { published });
  };

  const markNotificationRead = async (notificationId: string) => {
    if (firebaseUser && firebaseUser.emailVerified && !isDemoMode) {
      try {
        await updateDoc(doc(db, 'notifications', notificationId), { read: true });
      } catch {
        // Fallback to local
      }
    }
    setLocalState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
    }));
  };

  const markAllNotificationsRead = async () => {
    for (const n of notifications.filter((item) => !item.read)) {
      await markNotificationRead(n.id);
    }
  };

  const value: PlatformContextValue = {
    currentUser,
    authReady,
    firebaseConnected,
    isDemoMode,
    authError,
    clearAuthError,

    courses,
    modules,
    lessons,
    quizzes,
    questions,

    enrollments,
    lessonProgress,
    quizAttempts,
    certificates,
    discussions,
    notifications,
    experiments,
    allUsers,
    allEnrollmentsCount,

    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    resetPassword,
    resendVerificationEmail,
    refreshAuthState,
    logout,
    enterDemoMode,
    updateProfile,

    enrollInCourse,
    toggleLessonComplete,
    toggleBookmark,
    saveLessonNote,
    submitQuizAttempt,
    verifyCertificateCode,
    saveExperimentReport,

    createCourse,
    updateCourse,
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

    createDiscussion,
    reportDiscussion,
    deleteDiscussion,
    clearDiscussionFlag,
    changeUserRole,
    moderateCourse,
    markNotificationRead,
    markAllNotificationsRead,
  };

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
};

export function usePlatform(): PlatformContextValue {
  const ctx = useContext(PlatformContext);
  if (!ctx) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return ctx;
}
