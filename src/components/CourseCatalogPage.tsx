/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Clock,
  Star,
  Users,
  BookOpen,
  Layers,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { COURSE_CATEGORIES, Course, DifficultyLevel } from '../types/lms';

interface CourseCatalogPageProps {
  onSelectCourse: (courseId: string) => void;
  onStartLearning: (courseId: string) => void;
}

export const CourseCatalogPage: React.FC<CourseCatalogPageProps> = ({
  onSelectCourse,
  onStartLearning,
}) => {
  const { courses, enrollments } = usePlatform();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | DifficultyLevel>('All');
  const [durationFilter, setDurationFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'popular' | 'rating'>('featured');

  const publishedCourses = useMemo(
    () => courses.filter((c) => c.published),
    [courses]
  );

  const enrolledIds = useMemo(
    () => new Set(enrollments.map((e) => e.courseId)),
    [enrollments]
  );

  const featuredCourses = useMemo(
    () => publishedCourses.filter((c) => c.featured).slice(0, 3),
    [publishedCourses]
  );

  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = publishedCourses.filter((c) => {
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.instructorName.toLowerCase().includes(q);
      const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
      const matchesDiff = selectedDifficulty === 'All' || c.difficulty === selectedDifficulty;
      const matchesDur =
        durationFilter === 'all'
          ? true
          : durationFilter === 'short'
            ? c.durationHours <= 4
            : durationFilter === 'medium'
              ? c.durationHours > 4 && c.durationHours <= 5.5
              : c.durationHours > 5.5;
      return matchesSearch && matchesCat && matchesDiff && matchesDur;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'popular') return b.enrollmentCount - a.enrollmentCount;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return Number(b.featured) - Number(a.featured);
    });
  }, [publishedCourses, searchQuery, selectedCategory, selectedDifficulty, durationFilter, sortBy]);

  const renderCourseCard = (course: Course) => {
    const isEnrolled = enrolledIds.has(course.id);
    const enrollment = enrollments.find((e) => e.courseId === course.id);

    return (
      <div
        key={course.id}
        className="flex flex-col justify-between bg-[#10182a] border border-slate-800 hover:border-[#4b8bff]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 group"
      >
        <div>
          {/* Thumbnail */}
          <div className="relative aspect-video bg-[#080d1a] overflow-hidden border-b border-slate-800">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#080d1a]/90 text-[#4b8bff] border border-[#4b8bff]/40">
                {course.category}
              </span>
              {course.isDemoCourse ? (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Demo Course
                </span>
              ) : (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Instructor Published
                </span>
              )}
            </div>
            <span className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-[#080d1a]/90 text-slate-200 border border-slate-700">
              {course.difficulty}
            </span>
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            <h3
              onClick={() => onSelectCourse(course.id)}
              className="text-base font-bold text-white group-hover:text-[#4b8bff] transition-colors leading-snug cursor-pointer"
            >
              {course.title}
            </h3>
            <p className="text-xs text-[#a7b0c0]">
              Instructor: <strong className="text-slate-200">{course.instructorName}</strong>
            </p>
            <p className="text-xs text-[#a7b0c0] leading-relaxed line-clamp-2">
              {course.description}
            </p>

            {/* Quick metadata */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-[#a7b0c0]">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#4b8bff]" />
                {course.totalModules} Mod
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-[#f04432]" />
                {course.totalLessons} Les
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {course.durationHours}h
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-5 py-4 bg-[#0c1424] border-t border-slate-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs font-mono text-[#a7b0c0]">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              {course.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {course.enrollmentCount}
            </span>
          </div>

          {isEnrolled ? (
            <button
              onClick={() => onStartLearning(course.id)}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resume ({enrollment?.progressPercent || 0}%)</span>
            </button>
          ) : (
            <button
              onClick={() => onSelectCourse(course.id)}
              className="px-3.5 py-2 bg-[#4b8bff] hover:bg-[#3d7be6] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Syllabus</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="py-10 md:py-14 bg-[#080d1a] text-white min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#10182a] border border-[#4b8bff]/40 rounded-full text-xs font-semibold text-[#4b8bff]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TRINETRA 2.0 Course Management System</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Structured STEM Courses & Virtual Labs
            </h1>
            <p className="text-xs sm:text-sm text-[#a7b0c0] leading-relaxed">
              Enroll in modular engineering and science courses combining video lectures, formatted technical notes, interactive 3D labs, timed assessments, and verified certificates. Demonstration courses are clearly labeled until faculty publish institution-specific tracks.
            </p>
          </div>
          <div className="text-xs font-mono text-[#a7b0c0] bg-[#10182a] px-4 py-2.5 rounded-xl border border-slate-800 shrink-0">
            <strong className="text-white">{publishedCourses.length}</strong> Active Courses ·{' '}
            <strong className="text-[#4b8bff]">{COURSE_CATEGORIES.length}</strong> Categories
          </div>
        </div>

        {/* Search & Filter Panel */}
        <div className="p-4 sm:p-5 bg-[#10182a] border border-slate-800 rounded-2xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="relative md:col-span-5">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, topics, or instructor..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#080d1a] border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#4b8bff]"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as 'All' | DifficultyLevel)}
                className="w-full px-3 py-2.5 bg-[#080d1a] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#4b8bff]"
              >
                <option value="All">All Difficulty Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={durationFilter}
                onChange={(e) =>
                  setDurationFilter(e.target.value as 'all' | 'short' | 'medium' | 'long')
                }
                className="w-full px-3 py-2.5 bg-[#080d1a] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#4b8bff]"
              >
                <option value="all">Any Duration</option>
                <option value="short">Up to 4 hrs</option>
                <option value="medium">4 – 5.5 hrs</option>
                <option value="long">5.5+ hrs</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center gap-1.5 bg-[#080d1a] border border-slate-700 rounded-xl px-3 py-2.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#4b8bff] shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as 'featured' | 'newest' | 'popular' | 'rating')
                  }
                  className="bg-transparent text-xs text-white w-full focus:outline-none"
                >
                  <option value="featured" className="bg-[#080d1a]">Featured</option>
                  <option value="popular" className="bg-[#080d1a]">Most Popular</option>
                  <option value="rating" className="bg-[#080d1a]">Highest Rated</option>
                  <option value="newest" className="bg-[#080d1a]">Newest</option>
                </select>
              </div>
            </div>
          </div>

          {/* All 10 Course Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-[#f04432] text-white'
                  : 'bg-[#080d1a] text-[#a7b0c0] hover:text-white border border-slate-800'
              }`}
            >
              All Categories
            </button>
            {COURSE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#4b8bff] text-white font-semibold'
                    : 'bg-[#080d1a] text-[#a7b0c0] hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Section (shown when no filters applied) */}
        {!searchQuery && selectedCategory === 'All' && selectedDifficulty === 'All' && featuredCourses.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Featured STEM Foundations</h2>
              <span className="text-xs font-mono text-[#a7b0c0]">Recommended Starting Tracks</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCourses.map(renderCourseCard)}
            </div>
          </div>
        )}

        {/* Full Filtered Catalog */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#a7b0c0]">
            <h2 className="text-lg font-bold text-white">
              {selectedCategory === 'All' ? 'All Courses' : `${selectedCategory} Courses`}
            </h2>
            <span>
              Showing <strong className="text-white">{filteredCourses.length}</strong> matching courses
            </span>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(renderCourseCard)}
            </div>
          ) : (
            <div className="p-12 bg-[#10182a] border border-slate-800 rounded-2xl text-center space-y-3">
              <p className="text-sm text-[#a7b0c0]">
                No published courses match <strong className="text-white">{selectedCategory}</strong> with your current filters yet.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedDifficulty('All');
                  setDurationFilter('all');
                }}
                className="px-4 py-2 bg-[#4b8bff] hover:bg-[#3d7be6] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
