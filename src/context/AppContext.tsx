import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AuthScreen,
  UserProfile, 
  StudyPartner, 
  ActiveTab, 
  WorkspaceSubTab, 
  ChatMessage, 
  StudyRoom, 
  WhiteboardElement,
  Achievement,
  SessionNote,
  FileAttachment,
  PendingFriendRequest,
  StudyPod,
  GlobalCommunity,
  CommunityPost,
  ScheduledSession,
  ActivityFeedItem,
  AppNotification,
  LeaderboardUser,
  StudyStatus
} from '../types';
import { 
  MOCK_PARTNERS, 
  MOCK_STUDY_ROOMS, 
  MOCK_ACHIEVEMENTS, 
  SAMPLE_FILES,
  INITIAL_FRIEND_REQUESTS,
  INITIAL_STUDY_PODS,
  INITIAL_COMMUNITIES,
  INITIAL_ACTIVITY_FEED,
  INITIAL_NOTIFICATIONS,
  INITIAL_SCHEDULED_SESSIONS,
  INITIAL_LEADERBOARDS
} from '../data/mockData';

interface AppContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  authScreen: AuthScreen;
  setAuthScreen: (screen: AuthScreen) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  authTokens: { accessToken?: string; refreshToken?: string } | null;
  setAuthTokens: (tokens: { accessToken?: string; refreshToken?: string } | null) => void;
  handleLogout: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  workspaceSubTab: WorkspaceSubTab;
  setWorkspaceSubTab: (subTab: WorkspaceSubTab) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (status: boolean) => void;
  activePartner: StudyPartner | null;
  setActivePartner: (partner: StudyPartner | null) => void;
  activeRoom: StudyRoom | null;
  setActiveRoom: (room: StudyRoom | null) => void;
  learningCircle: StudyPartner[];
  addToLearningCircle: (partner: StudyPartner) => void;
  removeFromLearningCircle: (partnerId: string) => void;
  pendingFriendRequests: PendingFriendRequest[];
  acceptFriendRequest: (reqId: string) => void;
  declineFriendRequest: (reqId: string) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  togglePinMessage: (msgId: string) => void;
  toggleStarMessage: (msgId: string) => void;
  addReactionMessage: (msgId: string, emoji: string) => void;
  deleteChatMessage: (msgId: string) => void;
  whiteboardElements: WhiteboardElement[];
  setWhiteboardElements: React.Dispatch<React.SetStateAction<WhiteboardElement[]>>;
  sessionNotes: SessionNote[];
  saveSessionNote: (title: string, content: string) => void;
  sessionFiles: FileAttachment[];
  addSessionFile: (file: FileAttachment) => void;
  studyRooms: StudyRoom[];
  achievements: Achievement[];
  theme: 'dark' | 'light' | 'oled';
  setTheme: (theme: 'dark' | 'light' | 'oled') => void;
  isMicMuted: boolean;
  setIsMicMuted: React.Dispatch<React.SetStateAction<boolean>>;
  isVideoOff: boolean;
  setIsVideoOff: React.Dispatch<React.SetStateAction<boolean>>;
  isScreenSharing: boolean;
  setIsScreenSharing: React.Dispatch<React.SetStateAction<boolean>>;
  isFocusMode: boolean;
  setIsFocusMode: React.Dispatch<React.SetStateAction<boolean>>;
  showSessionSummary: boolean;
  setShowSessionSummary: (show: boolean) => void;
  friendRequests: string[]; // partner IDs
  sendFriendRequest: (partnerId: string) => void;
  blockedUserIds: string[];
  blockUser: (userId: string) => void;
  reportUser: (userId: string, reason: string) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  startStudySession: (partner: StudyPartner) => void;
  endStudySession: () => void;
  sessionDuration: number;
  quickMatchOpen: boolean;
  setQuickMatchOpen: (open: boolean) => void;

  // New Prompt 5 properties
  studyPods: StudyPod[];
  activePod: StudyPod | null;
  setActivePod: (pod: StudyPod | null) => void;
  createPod: (podData: Partial<StudyPod>) => void;
  joinPod: (podId: string) => void;
  leavePod: (podId: string) => void;
  addPodChatMessage: (podId: string, text: string) => void;
  addPodTask: (podId: string, title: string) => void;
  togglePodTask: (podId: string, taskId: string) => void;

  globalCommunities: GlobalCommunity[];
  activeCommunity: GlobalCommunity | null;
  setActiveCommunity: (comm: GlobalCommunity | null) => void;
  joinCommunity: (commId: string) => void;
  leaveCommunity: (commId: string) => void;
  createCommunityPost: (commId: string, post: Partial<CommunityPost>) => void;
  likeCommunityPost: (commId: string, postId: string) => void;
  addCommunityComment: (commId: string, postId: string, commentText: string) => void;

  followingUserIds: string[];
  toggleFollowUser: (userId: string) => void;

  studyStatus: StudyStatus;
  setStudyStatus: (status: StudyStatus) => void;

  scheduledSessions: ScheduledSession[];
  scheduleStudySession: (session: Partial<ScheduledSession>) => void;

  activityFeed: ActivityFeedItem[];
  addActivityItem: (item: Partial<ActivityFeedItem>) => void;

  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;

  leaderboards: LeaderboardUser[];

  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
}

const defaultUser: UserProfile = {
  id: 'user-me',
  name: 'Alex Chen',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  bio: 'Software Engineering student & AI enthusiast. Preparing for LeetCode Mediums & System Design.',
  email: 'alex.chen@university.edu',
  goal: 'Grind LeetCode for Tech Interviews',
  subjects: ['Data Structures & Algorithms', 'System Design & Microservices'],
  skillLevel: 'Intermediate',
  language: 'English',
  timezone: 'PST (UTC-8)',
  country: 'United States',
  studyStyle: '1-on-1 Deep Focus',
  currentMood: 'Need Help',
  studyHoursTotal: 42.5,
  streakDays: 7,
  learningCircleCount: 12,
  rating: 4.96
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('studyconnect_user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  const [authScreen, setAuthScreen] = useState<AuthScreen>('splash');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('studyconnect_logged_in') === 'true';
  });
  const [authTokens, setAuthTokens] = useState<{ accessToken?: string; refreshToken?: string } | null>(() => {
    const saved = localStorage.getItem('studyconnect_tokens');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [quickMatchOpen, setQuickMatchOpen] = useState<boolean>(false);
  const [workspaceSubTab, setWorkspaceSubTab] = useState<WorkspaceSubTab>('chat');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('studyconnect_onboarded') === 'true';
  });

  const [activePartner, setActivePartner] = useState<StudyPartner | null>(null);
  const [activeRoom, setActiveRoom] = useState<StudyRoom | null>(null);
  
  const [learningCircle, setLearningCircle] = useState<StudyPartner[]>([]);

  const [studyRooms] = useState<StudyRoom[]>(MOCK_STUDY_ROOMS);
  const [achievements] = useState<Achievement[]>(MOCK_ACHIEVEMENTS);

  const [theme, setTheme] = useState<'dark' | 'light' | 'oled'>('dark');

  // Media & Focus mode
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [showSessionSummary, setShowSessionSummary] = useState<boolean>(false);
  const [friendRequests, setFriendRequests] = useState<string[]>([]);
  const [pendingFriendRequests, setPendingFriendRequests] = useState<PendingFriendRequest[]>(INITIAL_FRIEND_REQUESTS);

  // Prompt 5 State Management
  const [studyPods, setStudyPods] = useState<StudyPod[]>(INITIAL_STUDY_PODS);
  const [activePod, setActivePod] = useState<StudyPod | null>(null);

  const [globalCommunities, setGlobalCommunities] = useState<GlobalCommunity[]>(INITIAL_COMMUNITIES);
  const [activeCommunity, setActiveCommunity] = useState<GlobalCommunity | null>(null);

  const [followingUserIds, setFollowingUserIds] = useState<string[]>([]);
  const [studyStatus, setStudyStatus] = useState<StudyStatus>('Available');

  const [scheduledSessions, setScheduledSessions] = useState<ScheduledSession[]>(INITIAL_SCHEDULED_SESSIONS);
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>(INITIAL_ACTIVITY_FEED);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [leaderboards] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARDS);

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Safety
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Session timer & files
  const [sessionDuration, setSessionDuration] = useState<number>(0);
  const [sessionFiles, setSessionFiles] = useState<FileAttachment[]>(SAMPLE_FILES);

  // Session Notes state
  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>([]);

  // Chat messages initial state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Collaborative Whiteboard elements
  const [whiteboardElements, setWhiteboardElements] = useState<WhiteboardElement[]>([]);

  // Persist user, onboarding and auth state
  useEffect(() => {
    localStorage.setItem('studyconnect_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('studyconnect_onboarded', String(hasCompletedOnboarding));
  }, [hasCompletedOnboarding]);

  useEffect(() => {
    localStorage.setItem('studyconnect_logged_in', String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    if (authTokens) {
      localStorage.setItem('studyconnect_tokens', JSON.stringify(authTokens));
    } else {
      localStorage.removeItem('studyconnect_tokens');
    }
  }, [authTokens]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthTokens(null);
    setHasCompletedOnboarding(false);
    setAuthScreen('welcome');
    localStorage.removeItem('studyconnect_logged_in');
    localStorage.removeItem('studyconnect_tokens');
    localStorage.removeItem('studyconnect_onboarded');
    showToast('Securely logged out of StudyConnect.', 'info');
  };

  // Session timer ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const addToLearningCircle = (partner: StudyPartner) => {
    if (!learningCircle.some(p => p.id === partner.id)) {
      setLearningCircle(prev => [...prev, partner]);
      showToast(`Added ${partner.name} to your Learning Circle! 🤝`, 'success');
    } else {
      showToast(`${partner.name} is already in your Learning Circle.`, 'info');
    }
  };

  const removeFromLearningCircle = (partnerId: string) => {
    setLearningCircle(prev => prev.filter(p => p.id !== partnerId));
    showToast(`Removed partner from Learning Circle.`, 'info');
  };

  const addChatMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, newMsg]);

    // Simulate partner response after user sends message (if not AI response)
    if (msg.senderId === 'user-me' && activePartner && !msg.isAi) {
      setTimeout(() => {
        const partnerResponses = [
          `That makes total sense! Let's solve a quick problem on this right now.`,
          `Awesome point. Should we sketch that on the Whiteboard or hop on a 2-min voice call?`,
          `I just tested that logic, works perfectly! Want to try a mock problem next?`,
          `Great observation! I've added a note to our shared study log.`
        ];
        const randomResp = partnerResponses[Math.floor(Math.random() * partnerResponses.length)];
        
        setChatMessages(prev => [
          ...prev,
          {
            id: `msg-resp-${Date.now()}`,
            senderId: activePartner.id,
            senderName: activePartner.name,
            senderAvatar: activePartner.avatar,
            text: randomResp,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 2500);
    }
  };

  const togglePinMessage = (msgId: string) => {
    setChatMessages(prev => prev.map(m => m.id === msgId ? { ...m, pinned: !m.pinned } : m));
    showToast('Message pin status updated', 'info');
  };

  const toggleStarMessage = (msgId: string) => {
    setChatMessages(prev => prev.map(m => m.id === msgId ? { ...m, starred: !m.starred } : m));
    showToast('Message star updated', 'info');
  };

  const addReactionMessage = (msgId: string, emoji: string) => {
    setChatMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const currentReactions = m.reactions || {};
      const userList = currentReactions[emoji] || [];
      const hasReacted = userList.includes(user.name);
      const updatedList = hasReacted ? userList.filter(u => u !== user.name) : [...userList, user.name];
      const updatedReactions = { ...currentReactions, [emoji]: updatedList };
      return { ...m, reactions: updatedReactions };
    }));
  };

  const deleteChatMessage = (msgId: string) => {
    setChatMessages(prev => prev.filter(m => m.id !== msgId));
    showToast('Message deleted', 'info');
  };

  const saveSessionNote = (title: string, content: string) => {
    const updatedNote: SessionNote = {
      id: `sn-${Date.now()}`,
      sessionId: 'sess-active',
      title,
      content,
      lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      updatedBy: user.name
    };
    setSessionNotes([updatedNote]);
    showToast('Session notes synced & auto-saved! 📝', 'success');
  };

  const addSessionFile = (file: FileAttachment) => {
    setSessionFiles(prev => [file, ...prev]);
    showToast(`Shared file: ${file.name}`, 'success');
  };

  const sendFriendRequest = (partnerId: string) => {
    if (!friendRequests.includes(partnerId)) {
      setFriendRequests(prev => [...prev, partnerId]);
      showToast('Friend request sent successfully! 🤝', 'success');
    } else {
      showToast('Friend request is already pending.', 'info');
    }
  };

  const blockUser = (userId: string) => {
    setBlockedUserIds(prev => [...prev, userId]);
    if (activePartner?.id === userId) {
      setActivePartner(null);
    }
    showToast(`User blocked. You will no longer match or see messages from this account.`, 'warning');
  };

  const reportUser = (userId: string, reason: string) => {
    showToast(`Report submitted to StudyConnect moderation team. Thank you for keeping our network safe.`, 'success');
  };

  const acceptFriendRequest = (reqId: string) => {
    const req = pendingFriendRequests.find(r => r.id === reqId);
    if (req) {
      if (!learningCircle.some(p => p.id === req.sender.id)) {
        setLearningCircle(prev => [...prev, req.sender]);
      }
      setPendingFriendRequests(prev => prev.filter(r => r.id !== reqId));
      showToast(`Accepted! ${req.sender.name} is now in your Learning Circle as a Learning Partner. 🤝`, 'success');
    }
  };

  const declineFriendRequest = (reqId: string) => {
    setPendingFriendRequests(prev => prev.filter(r => r.id !== reqId));
    showToast('Learning Partner request declined.', 'info');
  };

  const createPod = (podData: Partial<StudyPod>) => {
    const newPod: StudyPod = {
      id: `pod-${Date.now()}`,
      name: podData.name || 'New Study Pod',
      description: podData.description || 'A high-focus learning group on StudyConnect.',
      category: podData.category || 'General Learning',
      avatar: podData.avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
      coverImage: podData.coverImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      maxMembers: podData.maxMembers || 6,
      visibility: podData.visibility || 'Public',
      tags: podData.tags || ['StudyPod', 'Focus'],
      goal: podData.goal || 'Master study goals together',
      streakDays: 1,
      myRole: 'Creator',
      members: [
        { userId: 'user-me', name: user.name, avatar: user.avatar, role: 'Creator', joinedAt: 'Just now', studyHoursInPod: 0, isOnline: true }
      ],
      announcements: [],
      pinnedResources: [],
      taskList: [],
      scheduledSessions: [],
      chatMessages: []
    };
    setStudyPods(prev => [newPod, ...prev]);
    setActivePod(newPod);
    setActiveTab('pods');
    showToast(`Created Study Pod "${newPod.name}" successfully! 🚀`, 'success');
  };

  const joinPod = (podId: string) => {
    setStudyPods(prev => prev.map(p => {
      if (p.id !== podId) return p;
      if (p.members.some(m => m.userId === 'user-me')) return p;
      const updatedMembers = [
        ...p.members,
        { userId: 'user-me', name: user.name, avatar: user.avatar, role: 'Member' as const, joinedAt: 'Today', studyHoursInPod: 0, isOnline: true }
      ];
      return { ...p, members: updatedMembers, myRole: 'Member' as const };
    }));
    showToast('Joined Study Pod successfully! 🤝', 'success');
  };

  const leavePod = (podId: string) => {
    setStudyPods(prev => prev.map(p => {
      if (p.id !== podId) return p;
      return {
        ...p,
        members: p.members.filter(m => m.userId !== 'user-me'),
        myRole: undefined
      };
    }));
    if (activePod?.id === podId) setActivePod(null);
    showToast('Left Study Pod.', 'info');
  };

  const addPodChatMessage = (podId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: `pod-msg-${Date.now()}`,
      senderId: 'user-me',
      senderName: user.name,
      senderAvatar: user.avatar,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setStudyPods(prev => prev.map(p => {
      if (p.id !== podId) return p;
      return { ...p, chatMessages: [...p.chatMessages, newMsg] };
    }));
    if (activePod?.id === podId) {
      setActivePod(prev => prev ? { ...prev, chatMessages: [...prev.chatMessages, newMsg] } : null);
    }
  };

  const addPodTask = (podId: string, title: string) => {
    const newTask = { id: `t-${Date.now()}`, title, completed: false, assignedTo: user.name };
    setStudyPods(prev => prev.map(p => {
      if (p.id !== podId) return p;
      return { ...p, taskList: [...p.taskList, newTask] };
    }));
    if (activePod?.id === podId) {
      setActivePod(prev => prev ? { ...prev, taskList: [...prev.taskList, newTask] } : null);
    }
    showToast('Added task to Study Pod! 📋', 'success');
  };

  const togglePodTask = (podId: string, taskId: string) => {
    setStudyPods(prev => prev.map(p => {
      if (p.id !== podId) return p;
      return {
        ...p,
        taskList: p.taskList.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
      };
    }));
    if (activePod?.id === podId) {
      setActivePod(prev => prev ? {
        ...prev,
        taskList: prev.taskList.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
      } : null);
    }
  };

  const joinCommunity = (commId: string) => {
    setGlobalCommunities(prev => prev.map(c => {
      if (c.id !== commId) return c;
      return { ...c, joined: true, membersCount: c.membersCount + 1 };
    }));
    showToast(`Joined community! 🌐`, 'success');
  };

  const leaveCommunity = (commId: string) => {
    setGlobalCommunities(prev => prev.map(c => {
      if (c.id !== commId) return c;
      return { ...c, joined: false, membersCount: Math.max(0, c.membersCount - 1) };
    }));
    showToast('Left community.', 'info');
  };

  const createCommunityPost = (commId: string, postData: Partial<CommunityPost>) => {
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      communityId: commId,
      authorName: user.name,
      authorAvatar: user.avatar,
      authorRole: 'Active Learner',
      title: postData.title || 'Community Post',
      content: postData.content || '',
      postType: postData.postType || 'Discussion',
      likes: 1,
      isLiked: true,
      commentsCount: 0,
      comments: [],
      timestamp: 'Just now',
      tags: postData.tags || ['StudyConnect']
    };
    setGlobalCommunities(prev => prev.map(c => {
      if (c.id !== commId) return c;
      return { ...c, posts: [newPost, ...c.posts] };
    }));
    if (activeCommunity?.id === commId) {
      setActiveCommunity(prev => prev ? { ...prev, posts: [newPost, ...prev.posts] } : null);
    }
    showToast('Post published to Global Community! 🚀', 'success');
  };

  const likeCommunityPost = (commId: string, postId: string) => {
    setGlobalCommunities(prev => prev.map(c => {
      if (c.id !== commId) return c;
      return {
        ...c,
        posts: c.posts.map(p => {
          if (p.id !== postId) return p;
          const isLiked = !p.isLiked;
          return { ...p, isLiked, likes: isLiked ? p.likes + 1 : p.likes - 1 };
        })
      };
    }));
    if (activeCommunity?.id === commId) {
      setActiveCommunity(prev => prev ? {
        ...prev,
        posts: prev.posts.map(p => {
          if (p.id !== postId) return p;
          const isLiked = !p.isLiked;
          return { ...p, isLiked, likes: isLiked ? p.likes + 1 : p.likes - 1 };
        })
      } : null);
    }
  };

  const addCommunityComment = (commId: string, postId: string, commentText: string) => {
    const newComment = {
      id: `comm-c-${Date.now()}`,
      authorName: user.name,
      authorAvatar: user.avatar,
      content: commentText,
      timestamp: 'Just now'
    };
    setGlobalCommunities(prev => prev.map(c => {
      if (c.id !== commId) return c;
      return {
        ...c,
        posts: c.posts.map(p => {
          if (p.id !== postId) return p;
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComment]
          };
        })
      };
    }));
    if (activeCommunity?.id === commId) {
      setActiveCommunity(prev => prev ? {
        ...prev,
        posts: prev.posts.map(p => {
          if (p.id !== postId) return p;
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComment]
          };
        })
      } : null);
    }
    showToast('Comment added!', 'success');
  };

  const toggleFollowUser = (userId: string) => {
    if (followingUserIds.includes(userId)) {
      setFollowingUserIds(prev => prev.filter(id => id !== userId));
      setUser(prev => ({ ...prev, followingCount: Math.max(0, (prev.followingCount || 10) - 1) }));
      showToast('Unfollowed learner.', 'info');
    } else {
      setFollowingUserIds(prev => [...prev, userId]);
      setUser(prev => ({ ...prev, followingCount: (prev.followingCount || 10) + 1 }));
      showToast('Following learner! You will see their public activity in your feed. 🔔', 'success');
    }
  };

  const scheduleStudySession = (sessionData: Partial<ScheduledSession>) => {
    const newSession: ScheduledSession = {
      id: `sch-${Date.now()}`,
      title: sessionData.title || 'Scheduled Study Session',
      subject: sessionData.subject || user.subjects[0] || 'General Study',
      inviteeNames: sessionData.inviteeNames || ['Study Partner'],
      date: sessionData.date || new Date().toISOString().split('T')[0],
      time: sessionData.time || '18:00',
      durationMinutes: sessionData.durationMinutes || 60,
      sessionType: sessionData.sessionType || 'Video',
      recurring: sessionData.recurring || 'None',
      status: 'Scheduled',
      createdBy: user.name
    };
    setScheduledSessions(prev => [newSession, ...prev]);

    // Create Notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'UpcomingSession',
      title: 'Study Session Scheduled',
      message: `"${newSession.title}" set for ${newSession.date} at ${newSession.time}`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(`Session scheduled with ${newSession.inviteeNames.join(', ')}! 📅`, 'success');
  };

  const addActivityItem = (item: Partial<ActivityFeedItem>) => {
    const newItem: ActivityFeedItem = {
      id: `act-${Date.now()}`,
      actorName: item.actorName || user.name,
      actorAvatar: item.actorAvatar || user.avatar,
      action: item.action || 'completed a study session',
      timestamp: 'Just now',
      likes: 0,
      commentsCount: 0,
      badge: item.badge || 'Active Scholar'
    };
    setActivityFeed(prev => [newItem, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const startStudySession = (partner: StudyPartner) => {
    setActivePartner(partner);
    setActiveTab('workspace');
    setWorkspaceSubTab('chat');
    setSessionDuration(0);
    setIsFocusMode(false);
    setShowSessionSummary(false);
    showToast(`Study Session connected with ${partner.name}! 🎓`, 'success');
  };

  const endStudySession = () => {
    setShowSessionSummary(true);
    setUser(prev => ({
      ...prev,
      studyHoursTotal: parseFloat((prev.studyHoursTotal + (sessionDuration / 3600)).toFixed(1))
    }));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        authScreen,
        setAuthScreen,
        isLoggedIn,
        setIsLoggedIn,
        authTokens,
        setAuthTokens,
        handleLogout,
        activeTab,
        setActiveTab,
        workspaceSubTab,
        setWorkspaceSubTab,
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
        activePartner,
        setActivePartner,
        activeRoom,
        setActiveRoom,
        learningCircle,
        addToLearningCircle,
        removeFromLearningCircle,
        pendingFriendRequests,
        acceptFriendRequest,
        declineFriendRequest,
        chatMessages,
        addChatMessage,
        togglePinMessage,
        toggleStarMessage,
        addReactionMessage,
        deleteChatMessage,
        whiteboardElements,
        setWhiteboardElements,
        sessionNotes,
        saveSessionNote,
        sessionFiles,
        addSessionFile,
        studyRooms,
        achievements,
        theme,
        setTheme,
        isMicMuted,
        setIsMicMuted,
        isVideoOff,
        setIsVideoOff,
        isScreenSharing,
        setIsScreenSharing,
        isFocusMode,
        setIsFocusMode,
        showSessionSummary,
        setShowSessionSummary,
        friendRequests,
        sendFriendRequest,
        blockedUserIds,
        blockUser,
        reportUser,
        showToast,
        toast,
        startStudySession,
        endStudySession,
        sessionDuration,
        quickMatchOpen,
        setQuickMatchOpen,

        // Prompt 5
        studyPods,
        activePod,
        setActivePod,
        createPod,
        joinPod,
        leavePod,
        addPodChatMessage,
        addPodTask,
        togglePodTask,

        globalCommunities,
        activeCommunity,
        setActiveCommunity,
        joinCommunity,
        leaveCommunity,
        createCommunityPost,
        likeCommunityPost,
        addCommunityComment,

        followingUserIds,
        toggleFollowUser,

        studyStatus,
        setStudyStatus,

        scheduledSessions,
        scheduleStudySession,

        activityFeed,
        addActivityItem,

        notifications,
        markNotificationRead,

        leaderboards,

        isSearchOpen,
        setIsSearchOpen,
        globalSearchQuery,
        setGlobalSearchQuery
      }}
    >
      <div className={theme === 'oled' ? 'bg-black text-white' : theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-[#0b0f19] text-slate-100 font-sans antialiased min-h-screen'}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
