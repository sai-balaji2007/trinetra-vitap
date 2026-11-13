/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2, MessageSquare, Globe, Sparkles } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [role, setRole] = useState('Professor / Faculty');
  const [subject, setSubject] = useState('Institutional Pilot Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in your name, email, and message.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="py-12 md:py-20 bg-[#080d1a] text-white min-h-[80vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#10182a] border border-[#4b8bff]/40 rounded-full text-xs font-semibold text-[#4b8bff] uppercase tracking-wider">
            <span>Direct Communication</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Connect with the TRINETRA Team
          </h1>
          <p className="text-xs sm:text-sm text-[#a7b0c0] leading-relaxed">
            Have inquiries about institutional partnerships, pilot access, custom university curriculum
            mapping, or student subscriptions? Our engineering and academic team is here to assist.
          </p>
        </div>

        {/* 2-Column Layout: Contact Form & Office/Social Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column */}
          <div className="lg:col-span-7 p-6 sm:p-8 bg-[#10182a] border border-slate-800 rounded-3xl">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-white mb-2">Send Us a Direct Message</h3>

                {error && (
                  <div className="p-3 bg-red-950/70 border border-red-800 text-xs text-red-300 rounded-xl">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Priya Nair"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#080d1a] border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#4b8bff]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. priya.nair@annauniv.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#080d1a] border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#4b8bff]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Institution / Organization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Anna University, Chennai"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#080d1a] border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#4b8bff]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Primary Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#080d1a] border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#4b8bff]"
                    >
                      <option className="bg-slate-900">Professor / Faculty</option>
                      <option className="bg-slate-900">Head of Department (HOD)</option>
                      <option className="bg-slate-900">College Principal / Dean</option>
                      <option className="bg-slate-900">Student / Researcher</option>
                      <option className="bg-slate-900">EdTech / Industry Partner</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Subject of Inquiry
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#080d1a] border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#4b8bff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your laboratory requirements, student batch size, or questions..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#080d1a] border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#4b8bff] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-[#f04432] hover:bg-[#d63a2b] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-[0_0_15px_rgba(240,68,50,0.3)] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Sending Transmission...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message to Academic Desk</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Message Dispatched Successfully!</h3>
                <p className="text-xs text-[#a7b0c0] leading-relaxed max-w-sm mx-auto">
                  Thank you, <strong className="text-white">{name}</strong>. Our academic partnerships team has received your message and will respond to <strong className="text-cyan-400">{email}</strong> within 1 business day.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            )}
          </div>

          {/* Contact Details & Social Links Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-[#10182a] border border-slate-800 rounded-3xl space-y-5">
              <h3 className="text-base font-bold text-white">Academic Headquarters</h3>

              <div className="space-y-4 text-xs text-[#a7b0c0]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#4b8bff] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">TRINETRA EdTech Innovations Pvt. Ltd.</strong>
                    <span>Technology Incubation Corridor, Outer Ring Road, Bengaluru, Karnataka 560103</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#f04432] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Email Inquiries:</strong>
                    <span>partnerships@trinetralabs.edu.in</span>
                    <span className="block text-[11px] text-slate-500">support@trinetralabs.edu.in</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Institutional Helpline:</strong>
                    <span>+91 (080) 4920-TRIN (Mon–Fri, 9am–6pm IST)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Placeholders */}
            <div className="p-6 bg-[#10182a] border border-slate-800 rounded-3xl space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Follow Our Development
              </h3>
              <p className="text-xs text-[#a7b0c0]">
                Connect with our engineering and pedagogical teams on social channels:
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {['LinkedIn', 'Twitter / X', 'YouTube Edu', 'GitHub', 'Discord STEM'].map((soc) => (
                  <span
                    key={soc}
                    className="px-3 py-1.5 rounded-lg bg-[#080d1a] border border-slate-800 text-slate-300 hover:text-white hover:border-[#4b8bff] transition-colors cursor-pointer"
                  >
                    {soc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
