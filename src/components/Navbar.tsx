/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  X,
  Bell,
  ChevronDown,
  UserCircle2,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';
import { NavigationPage } from '../types/simulation';
import { usePlatform } from '../context/PlatformContext';

interface NavbarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  onRequestDemo: () => void;
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onRequestDemo,
  onOpenAuth,
  onOpenNotifications,
}) => {
  const { currentUser, notifications } = usePlatform();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const primaryLinks: { id: NavigationPage; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'courses', label: 'Courses' },
    { id: 'labs', label: 'Virtual Labs' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'community', label: 'Community' },
  ];

  const moreLinks: { id: NavigationPage; label: string }[] = [
    { id: 'explore', label: '3D Simulation Catalog' },
    { id: 'verify-certificate', label: 'Verify Certificate' },
    { id: 'institutions', label: 'For Institutions' },
    { id: 'pricing', label: 'Pricing Plans' },
    { id: 'about', label: 'About TRINETRA' },
    { id: 'contact', label: 'Contact Desk' },
  ];

  const canTeach =
    currentUser?.role === 'instructor' || currentUser?.role === 'admin';
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080d1a]/95 border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 whitespace-nowrap shrink-0 group text-left cursor-pointer"
        >
          <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-[#4b8bff] transition-colors">
            TRINETRA
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono text-[#f04432] bg-[#f04432]/10 border border-[#f04432]/30 px-2 py-0.5 rounded uppercase tracking-wider">
            LMS & Virtual Labs
          </span>
        </button>

        {/* Zone 2: Clean Single-Line Nav Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs sm:text-sm font-medium text-[#a7b0c0]">
          {primaryLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
                currentPage === link.id ||
                (link.id === 'courses' &&
                  (currentPage === 'course-detail' || currentPage === 'learn'))
                  ? 'text-white font-bold border-b-2 border-[#f04432]'
                  : 'hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}

          {canTeach && (
            <button
              onClick={() => onNavigate('instructor')}
              className={`whitespace-nowrap shrink-0 flex items-center gap-1 py-1 cursor-pointer ${
                currentPage === 'instructor'
                  ? 'text-[#4b8bff] font-bold border-b-2 border-[#4b8bff]'
                  : 'text-[#4b8bff]/90 hover:text-[#4b8bff]'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Instructor</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className={`whitespace-nowrap shrink-0 flex items-center gap-1 py-1 cursor-pointer ${
                currentPage === 'admin'
                  ? 'text-[#f04432] font-bold border-b-2 border-[#f04432]'
                  : 'text-[#f04432]/90 hover:text-[#f04432]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}

          {/* More Dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen((o) => !o)}
              className="whitespace-nowrap shrink-0 flex items-center gap-1 py-1 hover:text-white cursor-pointer"
            >
              <span>Platform</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {moreOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-[#10182a] border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50">
                {moreLinks.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onNavigate(m.id);
                      setMoreOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-[#080d1a] transition-colors cursor-pointer ${
                      currentPage === m.id ? 'text-white font-bold' : 'text-[#a7b0c0]'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
                <div className="border-t border-slate-800 mt-1 pt-1 px-2">
                  <button
                    onClick={() => {
                      setMoreOpen(false);
                      onRequestDemo();
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs font-bold text-[#f04432] hover:bg-[#080d1a] rounded-lg cursor-pointer"
                  >
                    Request College Pilot →
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: Notifications & Auth */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenNotifications}
            className="relative p-2 bg-[#10182a] hover:bg-slate-800 border border-slate-800 rounded-xl text-[#a7b0c0] hover:text-white cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#f04432] text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenAuth}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              currentUser
                ? 'bg-[#10182a] hover:bg-slate-800 border border-slate-700 text-white'
                : 'bg-[#f04432] hover:bg-[#d63a2b] text-white shadow-[0_0_15px_rgba(240,68,50,0.3)]'
            }`}
          >
            <UserCircle2 className="w-4 h-4 text-[#4b8bff]" />
            <span>
              {currentUser ? currentUser.displayName.split(' ')[0] : 'Sign In / Join'}
            </span>
          </button>
        </div>

        {/* Mobile Actions */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 text-slate-300 hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#f04432] text-[9px] flex items-center justify-center text-white">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={onOpenAuth}
            className="px-3 py-1.5 text-xs font-bold text-white bg-[#f04432] rounded-lg"
          >
            {currentUser ? currentUser.displayName.split(' ')[0] : 'Sign In'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-[#10182a] px-4 py-4 space-y-1.5 max-h-[80vh] overflow-y-auto">
          {[...primaryLinks, ...moreLinks].map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 px-3 text-sm font-medium rounded-lg ${
                currentPage === link.id
                  ? 'bg-[#4b8bff]/15 text-[#4b8bff] font-bold'
                  : 'text-[#a7b0c0] hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
          {canTeach && (
            <button
              onClick={() => {
                onNavigate('instructor');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 px-3 text-sm font-bold text-[#4b8bff]"
            >
              Instructor Studio
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 px-3 text-sm font-bold text-[#f04432]"
            >
              Super-Admin Console
            </button>
          )}
        </div>
      )}
    </header>
  );
};
