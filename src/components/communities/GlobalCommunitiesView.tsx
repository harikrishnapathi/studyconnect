import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GlobalCommunity, CommunityPost } from '../../types';
import { 
  Globe, 
  Plus, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Pin, 
  Trophy, 
  Mic, 
  Search, 
  X, 
  ChevronLeft,
  Sparkles,
  Send,
  UserCheck,
  UserPlus,
  BookOpen
} from 'lucide-react';

export const GlobalCommunitiesView: React.FC = () => {
  const { 
    globalCommunities, 
    activeCommunity, 
    setActiveCommunity, 
    joinCommunity, 
    leaveCommunity, 
    createCommunityPost, 
    likeCommunityPost, 
    addCommunityComment,
    showToast,
    user 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  // New Post State
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<'Discussion' | 'Question' | 'Resource'>('Discussion');

  // Comment input per post state
  const [commentInputMap, setCommentInputMap] = useState<Record<string, string>>({});

  const filteredCommunities = globalCommunities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCommunity || !postTitle.trim()) return;
    createCommunityPost(activeCommunity.id, {
      title: postTitle,
      content: postContent,
      postType
    });
    setShowCreatePostModal(false);
    setPostTitle('');
    setPostContent('');
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputMap[postId];
    if (!text || !text.trim() || !activeCommunity) return;
    addCommunityComment(activeCommunity.id, postId, text);
    setCommentInputMap(prev => ({ ...prev, [postId]: '' }));
  };

  // IF AN ACTIVE COMMUNITY IS OPEN, SHOW DETAILED COMMUNITY PAGE
  if (activeCommunity) {
    return (
      <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-6 animate-in fade-in duration-300">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveCommunity(null)}
            className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Communities</span>
          </button>

          <button
            onClick={() => showToast('Live Voice Stage / Audio Space launched! 🎙️', 'success')}
            className="px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-colors"
          >
            <Mic className="w-4 h-4" />
            <span>Launch Live Stage</span>
          </button>
        </div>

        {/* Community Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
          <img src={activeCommunity.coverImage} alt="" className="w-full h-40 object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
          
          <div className="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 -mt-12">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-slate-900 border-2 border-indigo-500 flex items-center justify-center text-4xl shadow-xl">
                {activeCommunity.icon}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{activeCommunity.name}</h1>
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold text-[10px]">
                    {activeCommunity.category}
                  </span>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm max-w-xl">{activeCommunity.description}</p>
                <p className="text-xs text-slate-400 pt-1 font-semibold">
                  {activeCommunity.membersCount.toLocaleString()} Global Scholars
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {activeCommunity.joined ? (
                <button
                  onClick={() => leaveCommunity(activeCommunity.id)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 font-bold text-xs transition-colors"
                >
                  Leave
                </button>
              ) : (
                <button
                  onClick={() => joinCommunity(activeCommunity.id)}
                  className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-colors flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Join Community</span>
                </button>
              )}

              <button
                onClick={() => setShowCreatePostModal(true)}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Post</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* MAIN DISCUSSION FEED */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              <span>Discussion Feed ({activeCommunity.posts.length})</span>
            </h3>

            {activeCommunity.posts.length > 0 ? (
              activeCommunity.posts.map(post => (
                <div key={post.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={post.authorAvatar} alt="" className="w-10 h-10 rounded-full border border-slate-700" />
                      <div>
                        <h4 className="text-xs font-bold text-white">{post.authorName}</h4>
                        <span className="text-[10px] text-indigo-400 font-semibold">{post.authorRole}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-bold text-[10px] border border-slate-700">
                      {post.postType}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-bold text-white">{post.title}</h2>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{post.content}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map(t => (
                      <span key={t} className="px-2.5 py-0.5 rounded-xl bg-slate-950 text-slate-400 text-[10px] border border-slate-800">
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => likeCommunityPost(activeCommunity.id, post.id)}
                        className={`flex items-center gap-1.5 font-bold transition-colors ${
                          post.isLiked ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </button>

                      <div className="flex items-center gap-1.5 text-slate-400 font-bold">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.commentsCount} Comments</span>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-500">{post.timestamp}</span>
                  </div>

                  {/* Comments Section */}
                  <div className="space-y-3 pt-3 border-t border-slate-800/50">
                    {post.comments.map(c => (
                      <div key={c.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-bold text-white">{c.authorName}</span>
                          <span>{c.timestamp}</span>
                        </div>
                        <p className="text-slate-300">{c.content}</p>
                      </div>
                    ))}

                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={commentInputMap[post.id] || ''}
                        onChange={e => setCommentInputMap({ ...commentInputMap, [post.id]: e.target.value })}
                        placeholder="Write a comment..."
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No posts yet in this community. Be the first to start a conversation!</p>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR: TOP CONTRIBUTORS & PINNED RESOURCES */}
          <div className="space-y-6">
            
            {/* Top Contributors */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Top Community Contributors</span>
              </h3>
              <div className="space-y-3">
                {activeCommunity.topContributors.map((tc, idx) => (
                  <div key={tc.name} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-500">#{idx + 1}</span>
                      <img src={tc.avatar} alt="" className="w-8 h-8 rounded-full border border-slate-700" />
                      <span className="text-xs font-bold text-white">{tc.name}</span>
                    </div>
                    <span className="text-xs font-bold text-amber-400">{tc.points} pts</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* CREATE POST MODAL */}
        {showCreatePostModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white">Create Community Post</h3>
                <button onClick={() => setShowCreatePostModal(false)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Post Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Discussion', 'Question', 'Resource'] as const).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setPostType(t)}
                        className={`py-2 rounded-2xl text-xs font-bold transition-colors ${
                          postType === t ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Post Title</label>
                  <input
                    type="text"
                    value={postTitle}
                    onChange={e => setPostTitle(e.target.value)}
                    placeholder="Headline or core question..."
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Body Content</label>
                  <textarea
                    value={postContent}
                    onChange={e => setPostContent(e.target.value)}
                    placeholder="Provide details, code snippets, or notes..."
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-colors"
                >
                  Publish Post
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  }

  // DEFAULT VIEW: LIST OF GLOBAL COMMUNITIES
  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Globe className="w-4 h-4" />
            <span>Global Knowledge Hubs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Global Communities</h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Join thousands of scholars in subject-specific global communities to share knowledge, questions, and resources.
          </p>
        </div>

        <div className="w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search communities..."
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommunities.map(comm => (
          <div
            key={comm.id}
            onClick={() => setActiveCommunity(comm)}
            className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 shadow-xl space-y-4 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.01]"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-3xl shadow-inner">
                  {comm.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{comm.name}</h3>
                    {comm.joined && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[9px]">
                        Joined
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-indigo-400 font-semibold">{comm.category}</p>
                </div>
              </div>

              <p className="text-slate-400 text-xs line-clamp-2">{comm.description}</p>

              <div className="text-[11px] text-slate-500 font-semibold pt-2 border-t border-slate-800/80">
                {comm.membersCount.toLocaleString()} Members
              </div>
            </div>

            <button className="w-full py-2.5 rounded-2xl bg-slate-950 border border-slate-800 hover:bg-indigo-600 hover:text-white text-indigo-400 font-bold text-xs transition-colors">
              Explore Community
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
