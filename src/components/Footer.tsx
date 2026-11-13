/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavigationPage } from '../types/simulation';

interface FooterProps {
  onNavigate: (page: NavigationPage) => void;
  onRequestDemo: () => void;
  onOpenCurriculum: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onRequestDemo,
  onOpenCurriculum,
}) => {
  return (
    <footer className="bg-[#050811] border-t border-slate-800/80 text-[#a7b0c0] text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-white">TRINETRA</span>
              <span className="text-[10px] font-mono text-[#f04432] bg-[#f04432]/10 border border-[#f04432]/30 px-1.5 py-0.5 rounded">
                Virtual Labs
              </span>
            </div>
            <p className="text-[#a7b0c0] leading-relaxed text-xs">
              "Experience Learning Beyond Boundaries." Structured STEM online courses, timed assessments, verified certificates, and browser-native virtual laboratories for engineering and science learners.
            </p>
          </div>

          {/* Learning Platform */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Learning Platform</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-white transition-colors cursor-pointer">
                  Course Catalog (10 STEM Tracks)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('labs')} className="hover:text-white transition-colors cursor-pointer">
                  Virtual STEM Laboratories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors cursor-pointer">
                  Student Learning Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('verify-certificate')} className="hover:text-white transition-colors cursor-pointer">
                  Verify Certificate ID
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('community')} className="hover:text-white transition-colors cursor-pointer">
                  Course Q&A Community
                </button>
              </li>
            </ul>
          </div>

          {/* Institution & Pricing */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Institution & Discovery</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-white transition-colors cursor-pointer">
                  3D Simulation Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('institutions')} className="hover:text-white transition-colors cursor-pointer">
                  For Colleges & Institutions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors cursor-pointer">
                  Pricing & Campus License
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer">
                  About TRINETRA
                </button>
              </li>
              <li>
                <button onClick={onOpenCurriculum} className="hover:text-white transition-colors cursor-pointer">
                  CBSE & AICTE Syllabus Mapping
                </button>
              </li>
            </ul>
          </div>

          {/* Academic Accreditation */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Pedagogical Framework</h4>
            <p className="leading-relaxed text-[#a7b0c0]">
              Aligned with CBSE Class 11–12 Practicals, AICTE Model Engineering Curriculum, and Indian technical universities. Virtual lab logs clearly identify simulated mathematical models.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#a7b0c0]">
          <div>
            © {new Date().getFullYear()} TRINETRA EdTech Innovations Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('contact')} className="hover:text-white cursor-pointer">Contact</button>
            <button onClick={() => onNavigate('verify-certificate')} className="hover:text-white cursor-pointer">Verify Certificate</button>
            <button onClick={onRequestDemo} className="hover:text-white cursor-pointer">Request Demo</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
