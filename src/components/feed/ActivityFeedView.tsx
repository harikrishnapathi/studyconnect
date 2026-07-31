import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActivityFeedItem } from '../../types';
import { 
  Flame, 
  ThumbsUp, 
  MessageSquare, 
  Sparkles, 
  Share2, 
  Plus, 
  Send, 
  Award,
  Globe,
  Clock
} from 'lucide-react';

export const ActivityFeedView: React.FC = () => {
  const { activityFeed, addActivityItem, user, showToast } = useApp();

  const [postInput, setPostInput] = useState('');
  const [commentMap, setCommentMap] = useState<Record<string, string>>({});
  const [items, setItems] = useState<ActivityFeedItem[]>(activityFeed);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postInput.trim()) return;
    const newItem: ActivityFeedItem = {
      id: `act-${Date.now()}`,
      actorName: user.name,
      actorAvatar: user.avatar,
      action: postInput,
      timestamp: 'Just now',
      likes: 0,
      commentsCount: 0,
      badge: 'Active Scholar'
    };
    setItems([newItem, ...items]);
    addActivityItem(newItem);
    setPostInput('');
    showToast('Activity posted to network feed! 🚀', 'success');
  };

  const handleToggleLike = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const isLiked = !item.isLiked;
      return {
        ...item,
        isLiked,
        likes: isLiked ? item.likes + 1 : item.likes - 1
      };
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
        <div className="inline-flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Peer Activity Stream</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Network Feed</h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Real-time study milestones, session completions, and problem achievements across your Learning Network.
        </p>
      </div>

      {/* Post Creation Card */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center gap-3">
          <img src={user.avatar} alt="" className="w-10 h-10 rounded-full border border-slate-700" />
          <input
            type="text"
            value={postInput}
            onChange={e => setPostInput(e.target.value)}
            placeholder="Share a study milestone or update with your Learning Circle..."
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handlePostSubmit}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post</span>
          </button>
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-6">
        {items.map(item => (
          <div key={item.id} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={item.actorAvatar} alt="" className="w-11 h-11 rounded-2xl object-cover border border-slate-700" />
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{item.actorName}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-[9px]">
                        {item.badge}
                      </span>
                    )}
                  </h3>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {item.timestamp}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-medium bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
              {item.action}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
              <button
                onClick={() => handleToggleLike(item.id)}
                className={`flex items-center gap-1.5 font-bold transition-colors ${
                  item.isLiked ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{item.likes} Likes</span>
              </button>

              <span className="text-slate-400 font-bold">{item.commentsCount} Comments</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
