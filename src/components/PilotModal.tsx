/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, CheckCircle2, Building, Mail, User, MapPin, Send, Sparkles } from 'lucide-react';

interface PilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: 'student' | 'college';
}

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Delhi NCR',
  'Gujarat',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
  'Other State / UT',
];

export const PilotModal: React.FC<PilotModalProps> = ({ isOpen, onClose, initialRole = 'college' }) => {
  const [role, setRole] = useState<'faculty' | 'hod' | 'principal' | 'student'>(
    initialRole === 'student' ? 'student' : 'faculty'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [state, setState] = useState('Karnataka');
  const [labInterest, setLabInterest] = useState('all');
  const [batchSize, setBatchSize] = useState('100-500');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !institution.trim()) {
      setError('Please provide your name, academic email, and institution name.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    // Simulate instant pilot booking response
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 750);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setError('');
    setName('');
    setEmail('');
    setInstitution('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0c1424] border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-slate-100">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="mb-6">
              <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
                Institutional Pilot & Student Demo
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Request a Trinetra 3D Lab Demo
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Experience full access to our 50+ simulation modules and institutional faculty dashboard.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded-lg text-xs text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  I am requesting as a:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'faculty', label: 'Professor' },
                    { id: 'hod', label: 'HOD' },
                    { id: 'principal', label: 'Principal' },
                    { id: 'student', label: 'Student' },
                  ].map((r) => (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setRole(r.id as any)}
                      className={`py-1.5 px-2 text-xs font-medium rounded-lg border text-center transition-colors ${
                        role === r.id
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                          : 'bg-[#141e33] text-slate-300 border-slate-700 hover:text-white'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Academic Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Rajesh Sharma"
                    className="w-full px-3 py-2 bg-[#121c30] border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Academic / Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rajesh@vtu.ac.in"
                    className="w-full px-3 py-2 bg-[#121c30] border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* College / Institution Name */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  College / University / School Name *
                </label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. BMS College of Engineering, Bengaluru"
                  className="w-full px-3 py-2 bg-[#121c30] border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* State & Lab of Interest */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    State in India
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121c30] border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s} className="bg-slate-900">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Primary Lab Focus
                  </label>
                  <select
                    value={labInterest}
                    onChange={(e) => setLabInterest(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121c30] border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="all" className="bg-slate-900">All Labs (Physics, Chem, Electronics)</option>
                    <option value="physics" className="bg-slate-900">Physics Mechanics Lab</option>
                    <option value="chemistry" className="bg-slate-900">Chemistry & Molecular Lab</option>
                    <option value="electronics" className="bg-slate-900">Electronics & BEEE Lab</option>
                  </select>
                </div>
              </div>

              {/* Batch Size (if faculty/college) */}
              {role !== 'student' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Expected Student Batch Size
                  </label>
                  <select
                    value={batchSize}
                    onChange={(e) => setBatchSize(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121c30] border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="50-100" className="bg-slate-900">50 - 100 students (Single Section)</option>
                    <option value="100-500" className="bg-slate-900">100 - 500 students (Department-wide)</option>
                    <option value="500-1500" className="bg-slate-900">500 - 1,500 students (First-Year College Batch)</option>
                    <option value="1500+" className="bg-slate-900">1,500+ students (Campus Enterprise License)</option>
                  </select>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-4 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Scheduling Live Pilot...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Pilot Request</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation Success Screen */
          <div className="py-4 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white">Pilot Request Confirmed!</h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
              Thank you, <strong className="text-white">{name}</strong>. We have provisioned a 14-day institutional sandbox pass for <strong className="text-cyan-400">{institution}</strong> ({state}).
            </p>

            <div className="p-4 bg-[#141e33] border border-slate-800 rounded-xl text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Sandbox Pass ID:</span>
                <span className="text-cyan-300">TRN-PILOT-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Contact Email:</span>
                <span className="text-slate-200">{email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Live Faculty Walkthrough:</span>
                <span className="text-emerald-400">Calendar invite dispatched</span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-colors"
            >
              Return to 3D Sandbox
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
