/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { QuizAttempt } from '../types/lms';

interface QuizEngineProps {
  quizId: string;
  courseId: string;
  onOpenAuth: () => void;
  onViewCertificate?: () => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  quizId,
  courseId,
  onOpenAuth,
  onViewCertificate,
}) => {
  const { quizzes, questions, quizAttempts, currentUser, submitQuizAttempt, certificates } =
    usePlatform();

  const quiz = quizzes.find((q) => q.id === quizId);
  const quizQuestions = useMemo(
    () => questions.filter((q) => q.quizId === quizId),
    [questions, quizId]
  );

  const existingAttempt = quizAttempts.find((a) => a.quizId === quizId);
  const earnedCert = certificates.find((c) => c.courseId === courseId);

  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [secondsLeft, setSecondsLeft] = useState((quiz?.timeLimitMinutes || 10) * 60);
  const [submitting, setSubmitting] = useState(false);
  const [latestResult, setLatestResult] = useState<QuizAttempt | null>(existingAttempt || null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setLatestResult(existingAttempt || null);
    setStarted(false);
    setCurrentIdx(0);
    setAnswers({});
    setSecondsLeft((quiz?.timeLimitMinutes || 10) * 60);
  }, [quizId, quiz?.timeLimitMinutes]);

  // Countdown timer when active
  useEffect(() => {
    if (!started || latestResult) return;
    if (secondsLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [started, latestResult, secondsLeft]);

  if (!quiz) {
    return (
      <div className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl text-xs text-[#a7b0c0]">
        Assessment data is not available for this lesson.
      </div>
    );
  }

  const handleSelectSingle = (qId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: [option] }));
  };

  const handleToggleMulti = (qId: string, option: string) => {
    setAnswers((prev) => {
      const current = prev[qId] || [];
      const exists = current.includes(option);
      return {
        ...prev,
        [qId]: exists ? current.filter((o) => o !== option) : [...current, option],
      };
    });
  };

  const handleShortAnswer = (qId: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: [text] }));
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const attempt = await submitQuizAttempt({
        quizId: quiz.id,
        courseId,
        answers,
      });
      setLatestResult(attempt);
      setStarted(false);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  const startRetake = () => {
    setLatestResult(null);
    setAnswers({});
    setCurrentIdx(0);
    setSecondsLeft(quiz.timeLimitMinutes * 60);
    setStarted(true);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Pre-start or completed view
  if (!started) {
    return (
      <div className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-mono text-[#4b8bff] uppercase tracking-wider">
              {quiz.isFinalAssessment ? 'Final Course Assessment' : 'Module Knowledge Check'}
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">{quiz.title}</h3>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-[#a7b0c0]">
            <span className="px-2.5 py-1 bg-[#080d1a] border border-slate-800 rounded-lg">
              {quizQuestions.length} Questions
            </span>
            <span className="px-2.5 py-1 bg-[#080d1a] border border-slate-800 rounded-lg flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#f04432]" />
              {quiz.timeLimitMinutes} mins
            </span>
            <span className="px-2.5 py-1 bg-[#080d1a] border border-slate-800 rounded-lg">
              Pass: {quiz.passingScore}%
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#f04432]/15 border border-[#f04432]/40 rounded-xl text-xs text-rose-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#f04432]" />
            <span>{errorMsg}</span>
          </div>
        )}

        {latestResult ? (
          <div className="space-y-6">
            {/* Result Summary */}
            <div
              className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                latestResult.passed
                  ? 'bg-emerald-950/30 border-emerald-700/60'
                  : 'bg-rose-950/30 border-[#f04432]/50'
              }`}
            >
              <div className="flex items-start gap-3">
                {latestResult.passed ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-7 h-7 text-[#f04432] shrink-0" />
                )}
                <div>
                  <h4 className="text-base font-bold text-white">
                    {latestResult.passed ? 'Assessment Passed!' : 'Passing Threshold Not Met'}
                  </h4>
                  <p className="text-xs text-[#a7b0c0] mt-0.5">
                    Score: <strong className="text-white">{latestResult.score}/{latestResult.maxScore}</strong> ({latestResult.percentage}%) · Required: {quiz.passingScore}%
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {earnedCert && onViewCertificate && (
                  <button
                    onClick={onViewCertificate}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>View Certificate</span>
                  </button>
                )}
                <button
                  onClick={startRetake}
                  className="px-4 py-2 bg-[#080d1a] hover:bg-slate-800 border border-slate-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#4b8bff]" />
                  <span>Retake Assessment</span>
                </button>
              </div>
            </div>

            {/* Detailed Question Breakdown with Explanations */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Detailed Answer Review & Explanations</h4>
              {quizQuestions.map((qn, idx) => {
                const userAns = (latestResult.answers[qn.id] || []).map((s) => s.trim().toLowerCase());
                const correct = qn.correctAnswers.map((s) => s.trim().toLowerCase());
                const isCorrect =
                  qn.type === 'multi'
                    ? userAns.length === correct.length && correct.every((c) => userAns.includes(c))
                    : qn.type === 'short'
                      ? userAns.some((u) => correct.includes(u))
                      : userAns.length > 0 && correct.includes(userAns[0]);

                return (
                  <div
                    key={qn.id}
                    className="p-4 bg-[#080d1a] border border-slate-800 rounded-xl space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-white">
                        Q{idx + 1}. {qn.prompt}
                      </span>
                      <span
                        className={`font-mono px-2 py-0.5 rounded shrink-0 ${
                          isCorrect
                            ? 'bg-emerald-950 text-emerald-400'
                            : 'bg-rose-950 text-[#f04432]'
                        }`}
                      >
                        {isCorrect ? `+${qn.points} pts` : '0 pts'}
                      </span>
                    </div>
                    <p className="text-[#a7b0c0]">
                      Your answer:{' '}
                      <span className="text-white font-mono">
                        {(latestResult.answers[qn.id] || []).join(', ') || 'No answer'}
                      </span>{' '}
                      · Correct:{' '}
                      <span className="text-emerald-400 font-mono">
                        {qn.correctAnswers.join(', ')}
                      </span>
                    </p>
                    {qn.explanation && (
                      <p className="text-slate-300 bg-[#10182a] p-2.5 rounded-lg border border-slate-800">
                        <strong>Explanation:</strong> {qn.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-[#a7b0c0] leading-relaxed">
              This timed assessment evaluates conceptual accuracy across multiple-choice, multi-select, true/false, and short numerical questions. You can retake this assessment if needed.
            </p>
            {quizQuestions.length === 0 ? (
              <div className="p-4 bg-[#080d1a] border border-slate-800 rounded-xl text-xs text-amber-300">
                The instructor has not added questions to this quiz yet.
              </div>
            ) : !currentUser ? (
              <button
                onClick={onOpenAuth}
                className="px-5 py-2.5 bg-[#f04432] hover:bg-[#d63a2b] text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <span>Sign In to Start Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setSecondsLeft(quiz.timeLimitMinutes * 60);
                  setStarted(true);
                }}
                className="px-5 py-2.5 bg-[#4b8bff] hover:bg-[#3d7be6] text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <span>Start Timed Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // Active Timed Quiz Interface
  const activeQ = quizQuestions[currentIdx];
  const selected = answers[activeQ?.id || ''] || [];

  return (
    <div className="p-6 bg-[#10182a] border border-slate-800 rounded-2xl space-y-6">
      {/* Top Timer & Progress */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-mono text-[#4b8bff]">
            Question {currentIdx + 1} of {quizQuestions.length}
          </span>
          <h3 className="text-base font-bold text-white">{quiz.title}</h3>
        </div>
        <div
          className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-bold flex items-center gap-1.5 ${
            secondsLeft < 60
              ? 'bg-[#f04432]/20 border-[#f04432] text-[#f04432]'
              : 'bg-[#080d1a] border-slate-700 text-cyan-400'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTimer(secondsLeft)}</span>
        </div>
      </div>

      {/* Question Navigator */}
      <div className="flex flex-wrap gap-1.5">
        {quizQuestions.map((q, idx) => {
          const answered = (answers[q.id] || []).some((a) => a.trim().length > 0);
          return (
            <button
              key={q.id}
              onClick={() => setCurrentIdx(idx)}
              className={`w-8 h-8 rounded-lg font-mono text-xs font-bold border transition-colors cursor-pointer ${
                idx === currentIdx
                  ? 'bg-[#4b8bff] border-[#4b8bff] text-white'
                  : answered
                    ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                    : 'bg-[#080d1a] border-slate-800 text-[#a7b0c0] hover:text-white'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Question Card */}
      {activeQ && (
        <div className="p-5 bg-[#080d1a] border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#a7b0c0]">
            <span className="uppercase">
              {activeQ.type === 'multi'
                ? 'Multiple Correct (Select all that apply)'
                : activeQ.type === 'tf'
                  ? 'True / False'
                  : activeQ.type === 'short'
                    ? 'Short Numerical / Text Answer'
                    : 'Single Choice MCQ'}
            </span>
            <span>{activeQ.points} Points</span>
          </div>

          <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
            {activeQ.prompt}
          </p>

          {activeQ.type === 'short' ? (
            <input
              type="text"
              value={selected[0] || ''}
              onChange={(e) => handleShortAnswer(activeQ.id, e.target.value)}
              placeholder="Type your exact value or short answer..."
              className="w-full px-4 py-2.5 bg-[#10182a] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#4b8bff]"
            />
          ) : (
            <div className="space-y-2">
              {activeQ.options.map((opt) => {
                const isSelected = selected.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() =>
                      activeQ.type === 'multi'
                        ? handleToggleMulti(activeQ.id, opt)
                        : handleSelectSingle(activeQ.id, opt)
                    }
                    className={`w-full text-left px-4 py-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-[#4b8bff]/15 border-[#4b8bff] text-white font-semibold'
                        : 'bg-[#10182a] border-slate-800 text-[#a7b0c0] hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                        activeQ.type === 'multi' ? 'rounded-sm' : 'rounded-full'
                      } ${isSelected ? 'bg-[#4b8bff] border-[#4b8bff]' : 'border-slate-600'}`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Footer Nav & Submit */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="px-4 py-2 bg-[#080d1a] border border-slate-800 disabled:opacity-40 text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-2">
          {currentIdx < quizQuestions.length - 1 ? (
            <button
              onClick={() => setCurrentIdx((i) => Math.min(quizQuestions.length - 1, i + 1))}
              className="px-4 py-2 bg-[#4b8bff] hover:bg-[#3d7be6] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <span>Next Question</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-5 py-2.5 bg-[#f04432] hover:bg-[#d63a2b] disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <span>{submitting ? 'Grading...' : 'Submit Assessment'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
