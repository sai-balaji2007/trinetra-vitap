/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Building2,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { UserRole } from '../types/lms';

export type AuthModalMode = 'signin' | 'register' | 'reset' | 'profile';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthModalMode;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
}) => {
  const {
    currentUser,
    isDemoMode,
    authError,
    clearAuthError,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    resetPassword,
    resendVerificationEmail,
    refreshAuthState,
    logout,
    enterDemoMode,
    updateProfile,
  } = usePlatform();

  const [mode, setMode] = useState<AuthModalMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [bio, setBio] = useState('');
  const [busy, setBusy] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      clearAuthError();
      setInfoMessage(null);
      if (currentUser && initialMode === 'profile') {
        setMode('profile');
      } else if (currentUser) {
        setMode('profile');
      } else {
        setMode(initialMode === 'profile' ? 'signin' : initialMode);
      }
      if (currentUser) {
        setDisplayName(currentUser.displayName);
        setInstitution(currentUser.institution || '');
        setDegree(currentUser.degree || '');
        setBio(currentUser.bio || '');
      }
    }
  }, [isOpen, initialMode, currentUser]);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setBusy(true);
    setInfoMessage(null);
    try {
      await loginWithGoogle();
      onClose();
    } catch {
      // handled in context authError
    } finally {
      setBusy(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setInfoMessage(null);
    try {
      await loginWithEmail(email, password);
      onClose();
    } catch {
      // handled in context
    } finally {
      setBusy(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setInfoMessage('Password must be at least 6 characters.');
      return;
    }
    setBusy(true);
    setInfoMessage(null);
    try {
      await registerWithEmail({ displayName, email, password, institution, degree });
      setInfoMessage(
        'Account created! A verification link has been sent to your email. Please verify your address to unlock full Firestore cloud sync.'
      );
    } catch {
      // handled in context
    } finally {
      setBusy(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setInfoMessage(null);
    try {
      await resetPassword(email);
      setInfoMessage('Password reset email dispatched. Check your inbox and spam folder.');
    } catch {
      // handled in context
    } finally {
      setBusy(false);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setInfoMessage(null);
    try {
      await updateProfile({ displayName, institution, degree, bio });
      setInfoMessage('Student profile updated successfully.');
    } catch (err) {
      setInfoMessage(err instanceof Error ? err.message : 'Update failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleDemoAccess = (role: UserRole) => {
    enterDemoMode(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#10182a] border border-slate-700/80 rounded-2xl p-6 sm:p-8 text-white shadow-2xl my-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-mono text-[#4b8bff] uppercase tracking-wider">
              TRINETRA Account Portal
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">
              {currentUser
                ? 'Account & Student Profile'
                : mode === 'register'
                  ? 'Create Student Account'
                  : mode === 'reset'
                    ? 'Reset Password'
                    : 'Sign In to TRINETRA'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Messages */}
        {(authError || infoMessage) && (
          <div
            className={`mt-4 p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
              authError
                ? 'bg-[#f04432]/10 border-[#f04432]/40 text-rose-200'
                : 'bg-emerald-950/60 border-emerald-700/50 text-emerald-200'
            }`}
          >
            {authError ? (
              <AlertCircle className="w-4 h-4 text-[#f04432] shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <span className="leading-relaxed">{authError || infoMessage}</span>
          </div>
        )}

        {/* Signed-in Profile View */}
        {currentUser ? (
          <div className="mt-5 space-y-5">
            <div className="p-3.5 bg-[#080d1a] border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{currentUser.displayName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4b8bff]/15 text-[#4b8bff] border border-[#4b8bff]/30 uppercase">
                    {currentUser.role}
                  </span>
                  {isDemoMode && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/40">
                      LOCAL DEMO MODE
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#a7b0c0] mt-0.5">{currentUser.email}</p>
              </div>
              <button
                onClick={async () => {
                  await logout();
                  setMode('signin');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-lg cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-[#f04432]" />
                <span>Sign Out</span>
              </button>
            </div>

            {!isDemoMode && !currentUser.emailVerified && (
              <div className="p-3.5 bg-amber-950/40 border border-amber-600/40 rounded-xl text-xs text-amber-200 space-y-2">
                <p className="font-semibold">Email Verification Pending</p>
                <p className="text-amber-200/80">
                  Verify your email address before submitting cloud quizzes, certificates, or discussions.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={async () => {
                      await resendVerificationEmail();
                      setInfoMessage('Verification link re-sent to your email.');
                    }}
                    className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg font-semibold cursor-pointer"
                  >
                    Resend Verification Email
                  </button>
                  <button
                    onClick={async () => {
                      await refreshAuthState();
                      setInfoMessage('Verification status refreshed.');
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>I’ve Verified — Refresh</span>
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-3">
              <div>
                <label className="text-xs text-[#a7b0c0] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#4b8bff]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#a7b0c0] block mb-1">College / School</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g., NIT Surathkal"
                    className="w-full px-3.5 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#4b8bff]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#a7b0c0] block mb-1">Degree / Branch</label>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g., B.Tech ECE"
                    className="w-full px-3.5 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#4b8bff]"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-[#a7b0c0] block mb-1">Academic Bio</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Learning goals or research interests..."
                  className="w-full px-3.5 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#4b8bff]"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full py-2.5 bg-[#4b8bff] hover:bg-[#3d7be6] disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                {busy ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        ) : (
          <div className="mt-5 space-y-5">
            {/* Google Sign-In CTA */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={busy}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#4b8bff]" />
              <span>Continue with Google (Firebase Auth)</span>
            </button>

            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <div className="h-px bg-slate-800 flex-1" />
              <span>OR WITH EMAIL & PASSWORD</span>
              <div className="h-px bg-slate-800 flex-1" />
            </div>

            {/* Mode Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-[#080d1a] p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`py-1.5 rounded-lg font-semibold cursor-pointer ${
                  mode === 'signin' ? 'bg-[#4b8bff] text-white' : 'text-[#a7b0c0] hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`py-1.5 rounded-lg font-semibold cursor-pointer ${
                  mode === 'register' ? 'bg-[#4b8bff] text-white' : 'text-[#a7b0c0] hover:text-white'
                }`}
              >
                Register
              </button>
              <button
                type="button"
                onClick={() => setMode('reset')}
                className={`py-1.5 rounded-lg font-semibold cursor-pointer ${
                  mode === 'reset' ? 'bg-[#4b8bff] text-white' : 'text-[#a7b0c0] hover:text-white'
                }`}
              >
                Reset
              </button>
            </div>

            {mode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-3">
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#080d1a] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#4b8bff]"
                  />
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#080d1a] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#4b8bff]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-2.5 bg-[#f04432] hover:bg-[#d63a2b] disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  {busy ? 'Signing in...' : 'Sign In to Dashboard'}
                </button>
              </form>
            )}

            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full pl-10 pr-3.5 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#4b8bff]"
                  />
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Academic or personal email"
                    className="w-full pl-10 pr-3.5 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#4b8bff]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="College / School"
                      className="w-full pl-9 pr-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#4b8bff]"
                    />
                  </div>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="Degree / Stream"
                      className="w-full pl-9 pr-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#4b8bff]"
                    />
                  </div>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (min. 6 characters)"
                    className="w-full pl-10 pr-3.5 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#4b8bff]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-2.5 bg-[#f04432] hover:bg-[#d63a2b] disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  {busy ? 'Creating Account...' : 'Register & Send Verification Email'}
                </button>
              </form>
            )}

            {mode === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Registered email address"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#080d1a] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#4b8bff]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-2.5 bg-[#4b8bff] hover:bg-[#3d7be6] disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  {busy ? 'Sending...' : 'Send Password Reset Link'}
                </button>
              </form>
            )}

            {/* Local Demo Sandbox Switcher */}
            <div className="p-4 bg-[#080d1a] border border-amber-500/30 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Local Demo Mode (Instant Evaluation)</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Browser-Local Only</span>
              </div>
              <p className="text-[11px] text-[#a7b0c0] leading-relaxed">
                Preview Student, Instructor CMS, or Super-Admin moderation workflows immediately without creating a cloud account.
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoAccess('student')}
                  className="py-1.5 px-2 bg-[#10182a] hover:bg-slate-800 border border-slate-700 rounded-lg text-[11px] font-semibold text-white cursor-pointer"
                >
                  Demo Student
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoAccess('instructor')}
                  className="py-1.5 px-2 bg-[#10182a] hover:bg-slate-800 border border-slate-700 rounded-lg text-[11px] font-semibold text-[#4b8bff] cursor-pointer"
                >
                  Demo Instructor
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoAccess('admin')}
                  className="py-1.5 px-2 bg-[#10182a] hover:bg-slate-800 border border-slate-700 rounded-lg text-[11px] font-semibold text-[#f04432] cursor-pointer"
                >
                  Demo Admin
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
