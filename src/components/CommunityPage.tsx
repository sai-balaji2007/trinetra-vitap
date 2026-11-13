/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { MessageSquare, Flag, Send, CornerDownRight, AlertCircle } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';

interface CommunityPageProps {
  initialCourseId?: string;
  onOpenAuth: () => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({
  initialCourseId,
  onOpenAuth,
}) => {
  const { courses, discussions, currentUser, createDiscussion, reportDiscussion } = usePlatform();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    initialCourseId || courses[0]?.id || 'course_physics_kinematics'
  );
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [reportedNotice, setReportedNotice] = useState<string | null>(null);

  const threads = useMemo(
    () =>
      discussions.filter(
        (d) => d.courseId === selectedCourseId && !d.parentId && !d.isFlagged
      ),
    [discussions, selectedCourseId]
  );

  const repliesByParent = useMemo(() => {
    const map: Record<string, typeof discussions> = {};
    discussions
      .filter((d) => d.courseId === selectedCourseId && d.parentId && !d.isFlagged)
      .forEach((r) => {
        if (!map[r.parentId!]) map[r.parentId!] = [];
        map[r.parentId!].push(r);
      });
    return map;
  }, [discussions, selectedCourseId]);

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setErrorMsg(null);
    try {
      await createDiscussion({ courseId: selectedCourseId, title, body });
      setTitle('');
      setBody('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to post question.');
    }
  };

  const handleReplySubmit = async (parentId: string) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!replyText.trim()) return;
    await createDiscussion({
      courseId: selectedCourseId,
      parentId,
      title: 'Reply',
      body: replyText,
    });
    setReplyText('');
    setReplyTargetId(null);
  };

  const handleReport = async (id: string) => {
    await reportDiscussion(id);
    setReportedNotice('Discussion flagged and sent to Super-Admin moderation queue.');
    setTimeout(() => setReportedNotice(null), 3500);
  };

  return (
    <div className="py-10 md:py-14 bg-[#080d1a] text-white min-h-[80vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#10182a] border border-[#4b8bff]/40 rounded-full text-xs font-semibold text-[#4b8bff]">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Course Q&A & Peer Discussion</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Academic Discussion Forum</h1>
            <p className="text-xs sm:text-sm text-[#a7b0c0]">
              Ask conceptual doubts, share lab calculations, and get answers from peers and faculty instructors.
            </p>
          </div>

          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="px-4 py-2.5 bg-[#10182a] border border-slate-700 rounded-xl text-xs text-white max-w-xs focus:outline-none focus:border-[#4b8bff]"
          >
            {courses
              .filter((c) => c.published)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
          </select>
        </div>

        {reportedNotice && (
          <div className="p-3 bg-amber-950/40 border border-amber-600/40 rounded-xl text-xs text-amber-200">
            {reportedNotice}
          </div>
        )}

        {/* New Question Form */}
        <form
          onSubmit={handleCreateThread}
          className="p-5 bg-[#10182a] border border-slate-800 rounded-2xl space-y-3"
        >
          <h2 className="text-sm font-bold text-white">Ask a Course Question</h2>
          {errorMsg && (
            <div className="text-xs text-[#f04432] flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> {errorMsg}
            </div>
          )}
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Question summary (e.g., Why does 45° maximize projectile range on level ground?)"
            className="w-full px-4 py-2.5 bg-[#080d1a] border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#4b8bff]"
          />
          <textarea
            rows={3}
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Include your calculation steps, lab parameters, or specific question..."
            className="w-full px-4 py-2.5 bg-[#080d1a] border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#4b8bff]"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-[#4b8bff] hover:bg-[#3d7be6] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{currentUser ? 'Post Question' : 'Sign In to Post'}</span>
            </button>
          </div>
        </form>

        {/* Thread List */}
        <div className="space-y-4">
          {threads.length === 0 ? (
            <div className="p-8 bg-[#10182a] border border-slate-800 rounded-2xl text-center text-xs text-[#a7b0c0]">
              No discussions started for this course yet. Be the first to ask a question!
            </div>
          ) : (
            threads.map((thread) => {
              const replies = repliesByParent[thread.id] || [];
              return (
                <div
                  key={thread.id}
                  className="p-5 bg-[#10182a] border border-slate-800 rounded-2xl space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <strong className="text-white">{thread.authorName}</strong>
                        <span
                          className={`font-mono px-1.5 py-0.5 rounded uppercase ${
                            thread.authorRole === 'instructor'
                              ? 'bg-[#f04432]/20 text-[#f04432]'
                              : thread.authorRole === 'admin'
                                ? 'bg-purple-500/20 text-purple-300'
                                : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {thread.authorRole}
                        </span>
                        <span className="text-slate-500 font-mono">
                          {new Date(thread.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white">{thread.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {thread.body}
                      </p>
                    </div>

                    <button
                      onClick={() => handleReport(thread.id)}
                      title="Report inappropriate content"
                      className="p-1.5 text-slate-400 hover:text-[#f04432] rounded-lg hover:bg-slate-800 cursor-pointer shrink-0"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Replies */}
                  {replies.length > 0 && (
                    <div className="pl-4 sm:pl-6 border-l border-slate-800 space-y-3">
                      {replies.map((rep) => (
                        <div key={rep.id} className="p-3 bg-[#080d1a] rounded-xl text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CornerDownRight className="w-3.5 h-3.5 text-[#4b8bff]" />
                              <strong className="text-white">{rep.authorName}</strong>
                              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-[#4b8bff] uppercase">
                                {rep.authorRole}
                              </span>
                            </div>
                            <button
                              onClick={() => handleReport(rep.id)}
                              className="text-slate-500 hover:text-[#f04432] cursor-pointer"
                            >
                              <Flag className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-slate-300 leading-relaxed">{rep.body}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Inline Reply Box */}
                  {replyTargetId === thread.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your reply..."
                        className="flex-1 px-3 py-2 bg-[#080d1a] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#4b8bff]"
                      />
                      <button
                        onClick={() => handleReplySubmit(thread.id)}
                        className="px-4 py-2 bg-[#4b8bff] text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => setReplyTargetId(null)}
                        className="px-3 py-2 bg-slate-800 text-xs rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReplyTargetId(thread.id)}
                      className="text-xs font-semibold text-[#4b8bff] hover:underline cursor-pointer"
                    >
                      + Reply to Thread
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
