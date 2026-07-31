import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Save, 
  Sparkles, 
  Download, 
  Share2, 
  Check, 
  List, 
  Code, 
  Heading1, 
  Heading2, 
  Bold, 
  Italic, 
  Copy, 
  CheckSquare,
  Zap,
  HelpCircle
} from 'lucide-react';

export const SessionNotesPanel: React.FC = () => {
  const { sessionNotes, saveSessionNote, activePartner, showToast } = useApp();

  const currentNote = sessionNotes[0] || {
    id: 'sn-1',
    sessionId: 'sess-active',
    title: 'Shared Study Notes',
    content: '',
    lastSavedAt: 'Just now',
    updatedBy: 'Me'
  };

  const [title, setTitle] = useState(currentNote.title);
  const [content, setContent] = useState(currentNote.content);
  const [isSaving, setIsSaving] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiOutputModal, setAiOutputModal] = useState<{ title: string; text: string } | null>(null);

  const handleSave = () => {
    setIsSaving(true);
    saveSessionNote(title, content);
    setTimeout(() => setIsSaving(false), 500);
  };

  const insertText = (syntaxPrefix: string, syntaxSuffix: string = '') => {
    setContent(prev => `${prev}\n${syntaxPrefix}Sample Text${syntaxSuffix}`);
  };

  const handleExport = (format: 'txt' | 'md' | 'pdf') => {
    const filename = `${title.toLowerCase().replace(/\s+/g, '_')}_notes.${format}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded ${filename} successfully! 📄`, 'success');
  };

  const handleAiSummarize = () => {
    setAiGenerating(true);
    showToast('AI is analyzing session notes...', 'info');
    setTimeout(() => {
      setAiGenerating(false);
      setAiOutputModal({
        title: '✨ AI Key Concepts Summary',
        text: `• **Core Focus**: Dynamic Programming and Recursion State Trees.\n• **Key Takeaway**: Memoization transforms exponential O(2^n) time complexity into linear O(n) by caching computed states.\n• **Partner Tip**: Always define the base cases before writing state transition formulas.`
      });
    }, 1200);
  };

  const handleAiGenerateQuiz = () => {
    setAiGenerating(true);
    showToast('AI is generating 3 quiz questions...', 'info');
    setTimeout(() => {
      setAiGenerating(false);
      setAiOutputModal({
        title: '🃏 AI Flashcards & Active Recall Quiz',
        text: `Q1: What is the main difference between Memoization (Top-Down) and Tabulation (Bottom-Up)?\nA1: Memoization uses recursion with a lookup cache, while Tabulation fills a table iteratively from base cases.\n\nQ2: What is the time and space complexity of memoized Fibonacci?\nA2: Time O(N), Auxiliary Space O(N) for recursion stack and hash table.`
      });
    }, 1200);
  };

  const handleAiExtractActionItems = () => {
    setAiGenerating(true);
    showToast('AI extracting action items...', 'info');
    setTimeout(() => {
      setAiGenerating(false);
      setAiOutputModal({
        title: '📋 AI Extracted Action Items',
        text: `[ ] Solve 3 LeetCode Medium DP problems (House Robber, Coin Change, Longest Increasing Subsequence)\n[ ] Review partner's shared Stanford Cheatsheet PDF\n[ ] Schedule next 45-min review session on Saturday at 4 PM`
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="bg-transparent text-white font-bold text-base focus:outline-none focus:border-b border-indigo-500 transition-all"
            />
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <Check className="w-3 h-3" /> Auto-synced
              </span>
              <span>•</span>
              <span>Last edited by {currentNote.updatedBy}</span>
              {activePartner && (
                <>
                  <span>•</span>
                  <span className="text-slate-300">Co-editing with {activePartner.name}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Sync'}</span>
          </button>

          <div className="relative group">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <div className="absolute right-0 top-full mt-2 w-44 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl hidden group-hover:block p-2 z-30">
              <button
                onClick={() => handleExport('md')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                Markdown (.md)
              </button>
              <button
                onClick={() => handleExport('txt')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                Plain Text (.txt)
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                PDF Document (.pdf)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Formatting & AI Quick Actions Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900/60 gap-2">
        
        {/* Rich Formatting Tools */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => insertText('# ')}
            className="p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800 text-slate-300 hover:text-white"
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertText('## ')}
            className="p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800 text-slate-300 hover:text-white"
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertText('**', '**')}
            className="p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800 text-slate-300 hover:text-white"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertText('*', '*')}
            className="p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800 text-slate-300 hover:text-white"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertText('- ')}
            className="p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800 text-slate-300 hover:text-white"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertText('- [ ] ')}
            className="p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800 text-slate-300 hover:text-white"
            title="Task List"
          >
            <CheckSquare className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertText('```python\n', '\n```')}
            className="p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800 text-slate-300 hover:text-white"
            title="Code Block"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        {/* AI Assistant Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAiSummarize}
            disabled={aiGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-md transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Summarize</span>
          </button>

          <button
            onClick={handleAiGenerateQuiz}
            disabled={aiGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-extrabold shadow-md transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>AI Quiz Cards</span>
          </button>

          <button
            onClick={handleAiExtractActionItems}
            disabled={aiGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-extrabold shadow-md transition-all"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Action Items</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 p-6 flex flex-col">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Start typing collaborative session notes, formulas, or code snippets here... Markdown supported!"
          className="w-full flex-1 p-5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500 resize-none leading-relaxed shadow-inner"
        />
      </div>

      {/* AI Modal Output */}
      {aiOutputModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-purple-400 font-extrabold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>{aiOutputModal.title}</span>
              </div>
              <button
                onClick={() => setAiOutputModal(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs whitespace-pre-wrap leading-relaxed">
              {aiOutputModal.text}
            </pre>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setContent(prev => `${prev}\n\n### ${aiOutputModal.title}\n${aiOutputModal.text}`);
                  setAiOutputModal(null);
                  showToast('Appended AI output to session notes!', 'success');
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
              >
                Append to Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
