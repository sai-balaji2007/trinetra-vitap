/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LabCanvas } from './components/LabCanvas';
import { LabControlDock } from './components/LabControlDock';
import { TelemetryDrawer } from './components/TelemetryDrawer';
import { VelocityTimeGraph } from './components/VelocityTimeGraph';
import { HomeContentSections } from './components/HomeContentSections';
import { BenefitsGrid } from './components/BenefitsGrid';
import { PricingSection } from './components/PricingSection';
import { AboutPage } from './components/AboutPage';
import { ExplorePage } from './components/ExplorePage';
import { DashboardPage } from './components/DashboardPage';
import { InstitutionsPage } from './components/InstitutionsPage';
import { ContactPage } from './components/ContactPage';
import { PilotModal } from './components/PilotModal';
import { CurriculumModal } from './components/CurriculumModal';
import { Footer } from './components/Footer';
import { AuthModal, AuthModalMode } from './components/AuthModal';
import { NotificationsPanel } from './components/NotificationsPanel';
import { CourseCatalogPage } from './components/CourseCatalogPage';
import { CourseDetailPage } from './components/CourseDetailPage';
import { CoursePlayerPage } from './components/CoursePlayerPage';
import { VirtualLabsPage } from './components/VirtualLabsPage';
import { CommunityPage } from './components/CommunityPage';
import { CertificateModal, CertificateVerifyPage } from './components/CertificateVerifyPage';
import { InstructorPortal } from './components/InstructorPortal';
import { AdminPortal } from './components/AdminPortal';
import {
  ChemistryParams,
  ElectronicsParams,
  LabExperimentType,
  LAB_EXPERIMENTS,
  NavigationPage,
  PhysicsParams,
  TelemetryPoint,
  VelocityTimePoint,
} from './types/simulation';
import {
  MousePointer,
  RotateCcw,
  Maximize2,
  Minimize2,
  TrendingUp,
  BookOpen,
} from 'lucide-react';

function AppShell() {
  const { certificates } = usePlatform();

  // Navigation & Deep-Link State
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  const [activeCourseId, setActiveCourseId] = useState<string>('course_physics_kinematics');
  const [activeLessonId, setActiveLessonId] = useState<string | undefined>(undefined);
  const [activeLabExperimentId, setActiveLabExperimentId] = useState<string>('phy-ohms');
  const [communityCourseId, setCommunityCourseId] = useState<string | undefined>(undefined);
  const [certPreviewCourseId, setCertPreviewCourseId] = useState<string | null>(null);

  // Modals
  const [pilotModalOpen, setPilotModalOpen] = useState(false);
  const [pilotInitialRole, setPilotInitialRole] = useState<'student' | 'college'>('college');
  const [curriculumModalOpen, setCurriculumModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('signin');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Home 3D Sandbox State
  const [experiment, setExperiment] = useState<LabExperimentType>('physics');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [resetSignal, setResetSignal] = useState<number>(0);
  const [showTelemetry, setShowTelemetry] = useState<boolean>(false);
  const [showVelocityGraph, setShowVelocityGraph] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [physicsParams, setPhysicsParams] = useState<PhysicsParams>({
    subMode: 'projectile',
    gravity: 9.81,
    velocity: 18.0,
    angle: 45,
    airResistance: 0.1,
    pendulumLength: 1.5,
    pendulumInitialAngle: 25,
    mass: 1.0,
  });

  const [chemistryParams, setChemistryParams] = useState<ChemistryParams>({
    molecule: 'H2O',
    vibrationSpeed: 1.0,
    orbitalOpacity: 0.35,
    temperature: 298,
    showDipole: true,
    showBondAngles: true,
  });

  const [electronicsParams, setElectronicsParams] = useState<ElectronicsParams>({
    subMode: 'logic',
    gateType: 'AND',
    inputA: true,
    inputB: true,
    supplyVoltage: 5.0,
    frequency: 60,
    resistance: 1000,
    capacitance: 10,
  });

  const [currentTelemetry, setCurrentTelemetry] = useState<TelemetryPoint | null>(null);
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>([]);
  const [velocityTimeHistory, setVelocityTimeHistory] = useState<VelocityTimePoint[]>([]);
  const lastCaptureTimeRef = useRef<number>(0);

  const handleTelemetryUpdate = useCallback(
    (point: TelemetryPoint) => {
      setCurrentTelemetry(point);
      const now = performance.now();
      if (now - lastCaptureTimeRef.current > 100) {
        lastCaptureTimeRef.current = now;
        setTelemetryHistory((prev) => {
          const next = [...prev, point];
          return next.length > 50 ? next.slice(next.length - 50) : next;
        });
        const v =
          point.velocityVal ??
          (experiment === 'physics'
            ? point.val2
            : experiment === 'chemistry'
              ? point.val1 * 0.25
              : point.val1);
        setVelocityTimeHistory((prev) => {
          const next = [...prev, { time: point.time, velocity: v }];
          return next.length > 60 ? next.slice(next.length - 60) : next;
        });
      }
    },
    [experiment]
  );

  const handleReset = () => {
    setResetSignal((s) => s + 1);
    setTelemetryHistory([]);
    setVelocityTimeHistory([]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const navigateTo = (page: NavigationPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchDemo = (labId?: LabExperimentType) => {
    if (labId) {
      setExperiment(labId);
      handleReset();
    }
    setCurrentPage('home');
    setTimeout(() => {
      document.getElementById('sandbox')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleOpenPilot = (role: 'student' | 'college' = 'college') => {
    setPilotInitialRole(role);
    setPilotModalOpen(true);
  };

  const handleOpenAuth = (mode: AuthModalMode = 'signin') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const activeExpMeta = LAB_EXPERIMENTS.find((e) => e.id === experiment)!;
  const certToPreview = certPreviewCourseId
    ? certificates.find((c) => c.courseId === certPreviewCourseId) || null
    : null;

  return (
    <div className="min-h-screen bg-[#080d1a] text-white flex flex-col font-sans selection:bg-[#f04432]/30 selection:text-white">
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        onRequestDemo={() => handleOpenPilot('college')}
        onOpenAuth={() => handleOpenAuth('signin')}
        onOpenNotifications={() => setNotificationsOpen(true)}
      />

      <main className="flex-1">
        {/* HOME PAGE (Preserved Hero + 3D Lab Sandbox + Content + Benefits + Pricing) */}
        {currentPage === 'home' && (
          <>
            <Hero
              onExploreSimulations={() => navigateTo('courses')}
              onDiscoverTrinetra={() => navigateTo('about')}
              onLaunchDemo={() => handleLaunchDemo()}
              onOpenCurriculum={() => setCurriculumModalOpen(true)}
            />

            <section
              id="sandbox"
              className={`relative py-8 md:py-12 bg-[#060a12] border-b border-slate-800/80 ${
                isFullscreen
                  ? 'fixed inset-0 z-50 w-screen h-screen m-0 p-0 overflow-hidden'
                  : ''
              }`}
            >
              <div
                className={`max-w-7xl mx-auto px-4 sm:px-6 mb-4 ${
                  isFullscreen ? 'hidden' : 'block'
                }`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-semibold text-[#f04432] bg-[#f04432]/10 border border-[#f04432]/30 px-2 py-0.5 rounded">
                        {activeExpMeta.badge}
                      </span>
                      <span className="text-xs text-[#a7b0c0] font-medium">
                        {activeExpMeta.syllabusAlignment}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      {activeExpMeta.title}:{' '}
                      <span className="text-[#a7b0c0] font-normal">{activeExpMeta.subtitle}</span>
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
                    <span className="hidden lg:flex items-center gap-1.5 bg-[#10182a] border border-slate-800 px-2.5 py-1.5 rounded-lg text-[#a7b0c0]">
                      <MousePointer className="w-3.5 h-3.5 text-[#4b8bff]" />
                      <span>Click + Drag to Rotate</span>
                    </span>
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10182a] hover:bg-slate-800 text-white border border-slate-700/80 rounded-lg font-semibold transition-colors shadow-sm cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#f04432]" />
                      <span>Reset</span>
                    </button>
                    <button
                      onClick={() => setShowVelocityGraph(!showVelocityGraph)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer ${
                        showVelocityGraph
                          ? 'bg-[#4b8bff]/20 text-[#4b8bff] border-[#4b8bff]/60'
                          : 'bg-[#10182a] text-[#a7b0c0] border-slate-700 hover:text-white'
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-[#4b8bff]" />
                      <span>v-t Graph</span>
                    </button>
                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold bg-[#10182a] text-[#a7b0c0] border-slate-700 hover:text-white cursor-pointer"
                    >
                      {isFullscreen ? (
                        <>
                          <Minimize2 className="w-3.5 h-3.5" />
                          <span>Exit Full-Screen</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Full-Screen</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setCurriculumModalOpen(true)}
                      className="hidden sm:flex items-center gap-1 text-[#4b8bff] hover:underline cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Lab Manual</span>
                    </button>
                  </div>
                </div>
              </div>

              <div
                className={`relative mx-auto ${
                  isFullscreen ? 'w-full h-full p-0' : 'max-w-7xl px-4 sm:px-6'
                }`}
              >
                <div
                  className={`relative overflow-hidden border border-slate-800 shadow-2xl bg-[#080d1a] ${
                    isFullscreen ? 'w-full h-full rounded-none border-0' : 'rounded-2xl'
                  }`}
                >
                  {isFullscreen && (
                    <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
                      <button
                        onClick={() => setIsFullscreen(false)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#080d1a]/90 border border-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        <Minimize2 className="w-3.5 h-3.5 text-[#f04432]" />
                        <span>Exit Full-Screen (Esc)</span>
                      </button>
                      <button
                        onClick={handleReset}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#080d1a]/90 border border-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-[#f04432]" />
                        <span>Reset</span>
                      </button>
                    </div>
                  )}

                  <LabCanvas
                    experiment={experiment}
                    physicsParams={physicsParams}
                    chemistryParams={chemistryParams}
                    electronicsParams={electronicsParams}
                    isPlaying={isPlaying}
                    speedMultiplier={speedMultiplier}
                    onTelemetryUpdate={handleTelemetryUpdate}
                    resetSignal={resetSignal}
                    isFullscreen={isFullscreen}
                  />

                  <VelocityTimeGraph
                    isOpen={showVelocityGraph}
                    onClose={() => setShowVelocityGraph(false)}
                    data={velocityTimeHistory}
                    currentVelocity={
                      currentTelemetry?.velocityVal ??
                      (experiment === 'physics'
                        ? (currentTelemetry?.val2 ?? 0)
                        : (currentTelemetry?.val1 ?? 0) * 0.25)
                    }
                    unit={experiment === 'physics' ? 'm/s' : experiment === 'chemistry' ? 'pm/s' : 'V/s'}
                  />

                  <LabControlDock
                    experiment={experiment}
                    setExperiment={(exp) => {
                      setExperiment(exp);
                      setTelemetryHistory([]);
                      setVelocityTimeHistory([]);
                    }}
                    physicsParams={physicsParams}
                    setPhysicsParams={setPhysicsParams}
                    chemistryParams={chemistryParams}
                    setChemistryParams={setChemistryParams}
                    electronicsParams={electronicsParams}
                    setElectronicsParams={setElectronicsParams}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    speedMultiplier={speedMultiplier}
                    setSpeedMultiplier={setSpeedMultiplier}
                    onReset={handleReset}
                    showTelemetry={showTelemetry}
                    setShowTelemetry={setShowTelemetry}
                    showVelocityGraph={showVelocityGraph}
                    setShowVelocityGraph={setShowVelocityGraph}
                    isFullscreen={isFullscreen}
                    setIsFullscreen={setIsFullscreen}
                  />

                  <TelemetryDrawer
                    isOpen={showTelemetry}
                    onClose={() => setShowTelemetry(false)}
                    experiment={experiment}
                    history={telemetryHistory}
                    currentPoint={currentTelemetry}
                    physicsParams={physicsParams}
                    chemistryParams={chemistryParams}
                    electronicsParams={electronicsParams}
                  />
                </div>
              </div>
            </section>

            <HomeContentSections
              onNavigateExplore={() => navigateTo('courses')}
              onRequestPilot={() => handleOpenPilot('college')}
              onLaunchSimulation={(labId) => handleLaunchDemo(labId)}
            />
            <BenefitsGrid />
            <PricingSection onRequestPilot={handleOpenPilot} />
          </>
        )}

        {/* COURSES CATALOG */}
        {currentPage === 'courses' && (
          <CourseCatalogPage
            onSelectCourse={(courseId) => {
              setActiveCourseId(courseId);
              navigateTo('course-detail');
            }}
            onStartLearning={(courseId) => {
              setActiveCourseId(courseId);
              setActiveLessonId(undefined);
              navigateTo('learn');
            }}
          />
        )}

        {/* COURSE DETAIL & SYLLABUS */}
        {currentPage === 'course-detail' && (
          <CourseDetailPage
            courseId={activeCourseId}
            onBack={() => navigateTo('courses')}
            onStartLearning={(courseId, lessonId) => {
              setActiveCourseId(courseId);
              setActiveLessonId(lessonId);
              navigateTo('learn');
            }}
            onOpenAuth={() => handleOpenAuth('signin')}
            onOpenCommunity={(courseId) => {
              setCommunityCourseId(courseId);
              navigateTo('community');
            }}
          />
        )}

        {/* DISTRACTION-FREE COURSE PLAYER */}
        {currentPage === 'learn' && (
          <CoursePlayerPage
            courseId={activeCourseId}
            initialLessonId={activeLessonId}
            onExit={() => navigateTo('course-detail')}
            onOpenAuth={() => handleOpenAuth('signin')}
            onLaunchLabExperiment={(expId) => {
              setActiveLabExperimentId(expId);
              navigateTo('labs');
            }}
            onViewCertificate={(courseId) => setCertPreviewCourseId(courseId)}
          />
        )}

        {/* DEDICATED VIRTUAL LABS HUB */}
        {currentPage === 'labs' && <VirtualLabsPage initialExperimentId={activeLabExperimentId} />}

        {/* STUDENT LEARNING DASHBOARD (100% REAL STORED PROGRESS) */}
        {currentPage === 'dashboard' && (
          <DashboardPage
            onOpenAuth={(mode) => handleOpenAuth(mode || 'signin')}
            onStartLearning={(courseId, lessonId) => {
              setActiveCourseId(courseId);
              setActiveLessonId(lessonId);
              navigateTo('learn');
            }}
            onBrowseCourses={() => navigateTo('courses')}
            onOpenVirtualLabs={() => navigateTo('labs')}
          />
        )}

        {/* INSTRUCTOR CMS STUDIO */}
        {currentPage === 'instructor' && (
          <InstructorPortal onOpenAuth={() => handleOpenAuth('signin')} />
        )}

        {/* SUPER-ADMIN CONSOLE */}
        {currentPage === 'admin' && <AdminPortal onOpenAuth={() => handleOpenAuth('signin')} />}

        {/* COURSE Q&A COMMUNITY */}
        {currentPage === 'community' && (
          <CommunityPage
            initialCourseId={communityCourseId}
            onOpenAuth={() => handleOpenAuth('signin')}
          />
        )}

        {/* CERTIFICATE VERIFICATION */}
        {currentPage === 'verify-certificate' && <CertificateVerifyPage />}

        {/* PRESERVED BRAND PAGES */}
        {currentPage === 'about' && (
          <AboutPage
            onNavigateExplore={() => navigateTo('explore')}
            onRequestContact={() => navigateTo('contact')}
          />
        )}
        {currentPage === 'explore' && (
          <ExplorePage onLaunchSimulation={(labId) => handleLaunchDemo(labId)} />
        )}
        {currentPage === 'institutions' && (
          <InstitutionsPage onRequestPilot={() => handleOpenPilot('college')} />
        )}
        {currentPage === 'pricing' && (
          <PricingSection onRequestPilot={handleOpenPilot} isStandalonePage={true} />
        )}
        {currentPage === 'contact' && <ContactPage />}
      </main>

      <Footer
        onNavigate={navigateTo}
        onRequestDemo={() => handleOpenPilot('college')}
        onOpenCurriculum={() => setCurriculumModalOpen(true)}
      />

      {/* Global Modals & Drawers */}
      <PilotModal
        isOpen={pilotModalOpen}
        onClose={() => setPilotModalOpen(false)}
        initialRole={pilotInitialRole}
      />

      <CurriculumModal
        isOpen={curriculumModalOpen}
        onClose={() => setCurriculumModalOpen(false)}
        onSelectExperiment={(exp) => {
          setExperiment(exp);
          handleLaunchDemo(exp);
        }}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      <NotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      <CertificateModal
        certificate={certToPreview}
        onClose={() => setCertPreviewCourseId(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <PlatformProvider>
      <AppShell />
    </PlatformProvider>
  );
}
