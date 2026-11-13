/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, CheckCircle2, Download, Search, ShieldCheck, X, AlertCircle } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { Certificate } from '../types/lms';
import { downloadCertificatePDF } from '../utils/pdfGenerator';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  if (!certificate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#0c1424] border-2 border-[#4b8bff]/60 rounded-3xl p-6 sm:p-10 text-white space-y-6 shadow-2xl">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-[#4b8bff]" />
            <span className="text-xs font-mono text-[#4b8bff] uppercase tracking-wider">
              Verified TRINETRA Credential
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 bg-[#080d1a] border border-slate-800 rounded-2xl text-center space-y-3">
          <span className="text-xs font-mono text-[#f04432] uppercase tracking-widest block font-bold">
            TRINETRA — Experience Learning Beyond Boundaries
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            CERTIFICATE OF COMPLETION
          </h3>
          <p className="text-xs text-[#a7b0c0]">This is to proudly certify that</p>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#4b8bff]">
            {certificate.studentName}
          </div>
          <p className="text-xs text-[#a7b0c0] max-w-md mx-auto leading-relaxed">
            has successfully completed all required modules, practical laboratory activities, and the
            final assessment for <strong className="text-white">{certificate.courseTitle}</strong>.
          </p>
          <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono text-slate-400">
            <div>Instructor: {certificate.instructorName}</div>
            <div>Issued: {new Date(certificate.issuedAt).toLocaleDateString()}</div>
            <div className="text-emerald-400">ID: {certificate.certificateCode}</div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => downloadCertificatePDF(certificate)}
            className="px-5 py-2.5 bg-[#4b8bff] hover:bg-[#3d7be6] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Official PDF Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const CertificateVerifyPage: React.FC = () => {
  const { verifyCertificateCode, certificates } = usePlatform();
  const [codeInput, setCodeInput] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<Certificate | null | undefined>(undefined);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeInput.trim()) return;
    setSearching(true);
    const hit = await verifyCertificateCode(codeInput);
    setResult(hit);
    setSearching(false);
  };

  return (
    <div className="py-12 md:py-16 bg-[#080d1a] text-white min-h-[75vh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#10182a] border border-[#4b8bff]/40 rounded-full text-xs font-semibold text-[#4b8bff]">
            <ShieldCheck className="w-4 h-4" />
            <span>Public Credential Registry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Verify a TRINETRA Certificate
          </h1>
          <p className="text-xs sm:text-sm text-[#a7b0c0]">
            Enter the unique verification code printed at the bottom of any TRINETRA Certificate of Completion (e.g., TRN-2026-XXXXXX) to authenticate student mastery.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="p-5 bg-[#10182a] border border-slate-800 rounded-2xl flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="Enter Certificate ID (e.g., TRN-2026-AB12CD)"
              className="w-full pl-10 pr-4 py-2.5 bg-[#080d1a] border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-[#4b8bff]"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-6 py-2.5 bg-[#4b8bff] hover:bg-[#3d7be6] text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            {searching ? 'Verifying...' : 'Verify Credential'}
          </button>
        </form>

        {result !== undefined && (
          <div>
            {result ? (
              <div className="p-6 bg-emerald-950/25 border border-emerald-700/60 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Authentic Verified Credential</span>
                  </div>
                  <button
                    onClick={() => downloadCertificatePDF(result)}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#080d1a] p-4 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 block">Recipient</span>
                    <strong className="text-white text-sm">{result.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Course Completed</span>
                    <strong className="text-white text-sm">{result.courseTitle}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Issuing Instructor</span>
                    <span className="text-slate-200">{result.instructorName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Issued On</span>
                    <span className="text-slate-200 font-mono">
                      {new Date(result.issuedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-rose-950/25 border border-[#f04432]/40 rounded-2xl flex items-center gap-3 text-xs text-rose-200">
                <AlertCircle className="w-5 h-5 text-[#f04432] shrink-0" />
                <span>
                  No verified certificate matched code <strong className="font-mono">{codeInput}</strong>. Please double-check the characters and try again.
                </span>
              </div>
            )}
          </div>
        )}

        {certificates.length > 0 && (
          <div className="p-5 bg-[#10182a] border border-slate-800 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Your Earned Certificates (Click to inspect)
            </h3>
            <div className="space-y-2">
              {certificates.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCodeInput(c.certificateCode);
                    setResult(c);
                  }}
                  className="w-full text-left p-3 bg-[#080d1a] hover:border-[#4b8bff]/50 border border-slate-800 rounded-xl flex items-center justify-between text-xs cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-white block">{c.courseTitle}</span>
                    <span className="text-slate-400 font-mono">{c.certificateCode}</span>
                  </div>
                  <span className="text-[#4b8bff] font-semibold">Inspect →</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
