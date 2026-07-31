import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FileAttachment, CodeSnippetAttachment, ChatMessage } from '../../types';
import { SAMPLE_FILES } from '../../data/mockData';
import { 
  Send, 
  Paperclip, 
  Mic, 
  Sparkles, 
  FileText, 
  Code, 
  Image as ImageIcon, 
  X, 
  Download, 
  Play, 
  Pause,
  Bot,
  User,
  Eye,
  CheckCircle2,
  Terminal,
  Volume2,
  Search,
  Pin,
  Star,
  Smile,
  Reply,
  Trash2,
  CheckCheck
} from 'lucide-react';

export const ChatPanel: React.FC = () => {
  const { 
    user, 
    activePartner, 
    chatMessages, 
    addChatMessage, 
    togglePinMessage, 
    toggleStarMessage, 
    addReactionMessage, 
    deleteChatMessage, 
    showToast 
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [showFileUploader, setShowFileUploader] = useState(false);
  const [showCodeSnippetModal, setShowCodeSnippetModal] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [activePlaybackSpeed, setActivePlaybackSpeed] = useState<number>(1);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  // File Preview Modal State
  const [previewFile, setPreviewFile] = useState<FileAttachment | null>(null);

  // Code snippet form
  const [codeLang, setCodeLang] = useState('python');
  const [codeBody, setCodeBody] = useState(`def solve_problem(nums, target):
    memo = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in memo:
            return [memo[complement], i]
        memo[num] = i
    return []`);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const pinnedMessages = chatMessages.filter(m => m.pinned);

  const filteredMessages = chatMessages.filter(m => {
    if (!searchQuery.trim()) return true;
    return m.text.toLowerCase().includes(searchQuery.toLowerCase()) || m.senderName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    addChatMessage({
      senderId: 'user-me',
      senderName: user.name,
      senderAvatar: user.avatar,
      text: inputText.trim(),
      status: 'seen',
      replyTo: replyingTo ? { id: replyingTo.id, text: replyingTo.text, senderName: replyingTo.senderName } : undefined
    });

    setInputText('');
    setReplyingTo(null);
  };

  const handleAiAssistantQuery = async () => {
    if (!inputText.trim()) {
      showToast('Type a question or prompt for the AI Study Assistant', 'info');
      return;
    }

    const queryText = inputText;
    setInputText('');
    setReplyingTo(null);

    addChatMessage({
      senderId: 'user-me',
      senderName: user.name,
      senderAvatar: user.avatar,
      text: `🤖 @AI Study Assistant: ${queryText}`,
      status: 'seen'
    });

    showToast('Consulting Gemini AI Study Assistant...', 'info');

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryText,
          subject: user.subjects[0]
        })
      });
      const data = await res.json();
      
      addChatMessage({
        senderId: 'ai-bot',
        senderName: 'StudyConnect AI Tutor',
        senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        text: data.text || 'Here is your study answer.',
        isAi: true
      });
    } catch (e) {
      addChatMessage({
        senderId: 'ai-bot',
        senderName: 'StudyConnect AI Tutor',
        senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        text: `Here is a breakdown for: "${queryText}"\n\n1. **Core Concept**: Break down into standard sub-cases.\n2. **Practice Step**: Verify base cases before moving to recursive transition.\n3. **Tip**: Use whiteboard tab to draw state diagrams together!`,
        isAi: true
      });
    }
  };

  const handleAttachSampleFile = (file: FileAttachment) => {
    addChatMessage({
      senderId: 'user-me',
      senderName: user.name,
      senderAvatar: user.avatar,
      text: `Shared file: **${file.name}**`,
      fileAttachment: file,
      status: 'seen'
    });
    setShowFileUploader(false);
    showToast(`File ${file.name} shared in session!`, 'success');
  };

  const handleSendCodeSnippet = () => {
    addChatMessage({
      senderId: 'user-me',
      senderName: user.name,
      senderAvatar: user.avatar,
      text: `Shared code snippet (${codeLang})`,
      codeSnippet: {
        language: codeLang,
        code: codeBody,
        filename: `solution.${codeLang === 'python' ? 'py' : codeLang === 'javascript' ? 'js' : 'cpp'}`
      },
      status: 'seen'
    });
    setShowCodeSnippetModal(false);
    showToast('Code snippet shared with study partner!', 'success');
  };

  const toggleVoiceRecording = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setIsRecordingVoice(false);
      addChatMessage({
        senderId: 'user-me',
        senderName: user.name,
        senderAvatar: user.avatar,
        text: `Voice note (${recordingSeconds}s)`,
        voiceNote: {
          id: `vn-${Date.now()}`,
          durationSeconds: Math.max(3, recordingSeconds)
        },
        status: 'seen'
      });
      showToast('Voice note sent to chat!', 'success');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      
      {/* Chat Header */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 gap-3">
        <div className="flex items-center gap-3">
          <img
            src={activePartner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={activePartner?.name}
            className="w-10 h-10 rounded-2xl object-cover border border-indigo-500/40"
          />
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{activePartner?.name || 'Study Discussion'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </h3>
            <p className="text-xs text-slate-400">
              {activePartner?.subjects[0]} • {activePartner?.studyStyle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Toggle */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded-xl transition-colors ${
              showSearch ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
            title="Search Messages"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Ask AI Button */}
          <button
            onClick={handleAiAssistantQuery}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold transition-all"
            title="Ask AI Study Assistant"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI Tutor</span>
          </button>
        </div>
      </div>

      {/* Search Bar Row (If Toggled) */}
      {showSearch && (
        <div className="px-6 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search in session conversation..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-white text-xs placeholder-slate-500 focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-white text-xs">
              Clear
            </button>
          )}
        </div>
      )}

      {/* Pinned Messages Header Banner */}
      {pinnedMessages.length > 0 && (
        <div className="px-6 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2 truncate">
            <Pin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-bold">Pinned ({pinnedMessages.length}):</span>
            <span className="truncate text-slate-300">{pinnedMessages[pinnedMessages.length - 1].text}</span>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {filteredMessages.map(msg => {
          const isMe = msg.senderId === 'user-me';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 group ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <img
                src={msg.senderAvatar}
                alt={msg.senderName}
                className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 border border-slate-700"
              />

              <div className={`space-y-1.5 max-w-[85%] sm:max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                
                {/* Message Meta Info */}
                <div className={`flex items-center gap-2 text-[11px] text-slate-400 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <span className="font-bold text-slate-300">{msg.senderName}</span>
                  <span>{msg.timestamp}</span>

                  {/* Read Receipts */}
                  {isMe && (
                    <span className="text-emerald-400" title="Delivered & Seen by Partner">
                      <CheckCheck className="w-3.5 h-3.5" />
                    </span>
                  )}

                  {msg.pinned && (
                    <span className="text-amber-400 flex items-center gap-0.5 font-bold">
                      <Pin className="w-3 h-3" /> Pinned
                    </span>
                  )}

                  {msg.starred && (
                    <span className="text-yellow-400 flex items-center gap-0.5 font-bold">
                      <Star className="w-3 h-3 fill-yellow-400" />
                    </span>
                  )}
                </div>

                {/* Reply Context (If Present) */}
                {msg.replyTo && (
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border-l-4 border-indigo-500 text-xs text-slate-400 space-y-0.5">
                    <p className="font-bold text-indigo-400 text-[10px]">Replying to {msg.replyTo.senderName}</p>
                    <p className="truncate italic">{msg.replyTo.text}</p>
                  </div>
                )}

                {/* Bubble Container */}
                <div className="relative group/bubble">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.isAi
                        ? 'bg-gradient-to-r from-indigo-950 via-blue-950 to-slate-900 border border-indigo-500/40 text-indigo-100 shadow-xl'
                        : isMe
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-tr-none shadow-md'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {/* Text Content */}
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* File Attachment Render */}
                    {msg.fileAttachment && (
                      <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
                          <div className="truncate">
                            <p className="font-bold text-white text-xs truncate">{msg.fileAttachment.name}</p>
                            <p className="text-[10px] text-slate-400">{msg.fileAttachment.size}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setPreviewFile(msg.fileAttachment || null)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center gap-1 shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>
                      </div>
                    )}

                    {/* Code Snippet Attachment Render */}
                    {msg.codeSnippet && (
                      <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px]">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                            {msg.codeSnippet.filename}
                          </span>
                          <span className="text-cyan-400 uppercase font-bold">{msg.codeSnippet.language}</span>
                        </div>
                        <pre className="text-slate-200 overflow-x-auto whitespace-pre">{msg.codeSnippet.code}</pre>
                      </div>
                    )}

                    {/* Voice Note Attachment Render */}
                    {msg.voiceNote && (
                      <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                        <button
                          onClick={() => setPlayingVoiceId(playingVoiceId === msg.id ? null : msg.id)}
                          className="p-2 rounded-full bg-indigo-600 text-white hover:scale-105 transition-transform"
                        >
                          {playingVoiceId === msg.id ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                        </button>
                        <div className="flex-1 h-6 flex items-center gap-0.5">
                          {[40, 70, 30, 90, 60, 40, 80, 50, 90, 60, 30, 70, 40, 60].map((h, i) => (
                            <div
                              key={i}
                              className={`flex-1 rounded-full transition-all ${
                                playingVoiceId === msg.id ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400/60'
                              }`}
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setActivePlaybackSpeed(activePlaybackSpeed === 2 ? 1 : activePlaybackSpeed + 0.25)}
                            className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-indigo-300 font-bold"
                          >
                            {activePlaybackSpeed}x
                          </button>
                          <span className="text-[10px] text-slate-400 font-mono">{msg.voiceNote.durationSeconds}s</span>
                        </div>
                      </div>
                    )}

                    {/* Emoji Reactions Row */}
                    {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 mt-2 pt-1">
                        {Object.entries(msg.reactions).map(([emoji, userList]) => {
                          const users = userList as string[] | undefined;
                          if (!users || users.length === 0) return null;
                          return (
                            <button
                              key={emoji}
                              onClick={() => addReactionMessage(msg.id, emoji)}
                              className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-xs flex items-center gap-1 font-bold text-slate-300 hover:border-indigo-500"
                            >
                              <span>{emoji}</span>
                              <span className="text-[10px] text-indigo-400">{users.length}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Quick Action Toolbar on Hover */}
                  <div className={`absolute top-0 ${isMe ? '-left-28' : '-right-28'} hidden group-hover/bubble:flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl shadow-xl z-20`}>
                    <button
                      onClick={() => setReplyingTo(msg)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                      title="Reply"
                    >
                      <Reply className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => togglePinMessage(msg.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400"
                      title="Pin Message"
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleStarMessage(msg.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-yellow-400"
                      title="Star Message"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>

                    {/* Quick Reactions */}
                    {['👍', '🔥', '❤️', '💡', '👏'].map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => addReactionMessage(msg.id, emoji)}
                        className="p-1 rounded hover:bg-slate-800 text-xs"
                      >
                        {emoji}
                      </button>
                    ))}

                    {isMe && (
                      <button
                        onClick={() => deleteChatMessage(msg.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                        title="Delete Message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Recording Active Bar */}
      {isRecordingVoice && (
        <div className="px-6 py-3 bg-rose-500/10 border-t border-rose-500/30 flex items-center justify-between text-xs text-rose-300 animate-pulse">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-rose-400" />
            <span>Recording Voice Note... ({recordingSeconds}s)</span>
          </div>
          <button
            onClick={toggleVoiceRecording}
            className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold"
          >
            Stop & Send
          </button>
        </div>
      )}

      {/* Replying Banner */}
      {replyingTo && (
        <div className="px-6 py-2 bg-indigo-950/80 border-t border-indigo-500/30 flex items-center justify-between text-xs text-indigo-300">
          <div className="flex items-center gap-2 truncate">
            <Reply className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="font-bold">Replying to {replyingTo.senderName}:</span>
            <span className="truncate italic text-slate-300">{replyingTo.text}</span>
          </div>
          <button onClick={() => setReplyingTo(null)} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Toolbar & Box */}
      <form onSubmit={handleSendText} className="p-4 border-t border-slate-800 bg-slate-950/90 space-y-3">
        {/* Attachment Options Toolbar */}
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setShowFileUploader(!showFileUploader)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            <Paperclip className="w-3.5 h-3.5 text-indigo-400" />
            <span>Share File</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCodeSnippetModal(!showCodeSnippetModal)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            <span>Code Snippet</span>
          </button>

          <button
            type="button"
            onClick={toggleVoiceRecording}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
              isRecordingVoice
                ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-emerald-400" />
            <span>Voice Note</span>
          </button>
        </div>

        {/* Input Text Row */}
        <div className="flex items-center gap-2">
          <input
            id="input-chat-message"
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Type a message or ask @AI Study Assistant..."
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm"
          />

          <button
            id="btn-send-message"
            type="submit"
            className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* File Sharing Preset Selector Modal */}
      {showFileUploader && (
        <div className="p-4 border-t border-slate-800 bg-slate-900/95 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white">Select File from Study Repository</h4>
            <button onClick={() => setShowFileUploader(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SAMPLE_FILES.map(f => (
              <div
                key={f.id}
                onClick={() => handleAttachSampleFile(f)}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500 cursor-pointer space-y-1 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="font-bold text-xs text-white truncate">{f.name}</span>
                </div>
                <p className="text-[10px] text-slate-400">{f.size} • {f.type.toUpperCase()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Code Snippet Modal */}
      {showCodeSnippetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-cyan-400" />
                <span>Share Code Snippet</span>
              </h3>
              <button onClick={() => setShowCodeSnippetModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-300">Language:</label>
                <select
                  value={codeLang}
                  onChange={e => setCodeLang(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript / TS</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </div>

              <textarea
                value={codeBody}
                onChange={e => setCodeBody(e.target.value)}
                rows={8}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCodeSnippetModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSendCodeSnippet}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg"
              >
                Share Snippet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF / File Viewer Lightbox */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span className="font-bold text-white text-sm">{previewFile.name}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono">
                  {previewFile.type.toUpperCase()}
                </span>
              </div>
              <button onClick={() => setPreviewFile(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
              {previewFile.previewContent || 'Preview content loaded.'}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">File size: {previewFile.size}</span>
              <button
                onClick={() => {
                  showToast(`Downloaded ${previewFile.name} to device!`, 'success');
                  setPreviewFile(null);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Download File</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
