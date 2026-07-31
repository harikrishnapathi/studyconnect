import { 
  StudyPartner, 
  StudyRoom, 
  Achievement, 
  Flashcard, 
  FileAttachment, 
  StudyPod, 
  GlobalCommunity, 
  PendingFriendRequest, 
  ScheduledSession, 
  ActivityFeedItem, 
  AppNotification, 
  LeaderboardUser 
} from '../types';

export const POPULAR_SUBJECTS = [
  'Data Structures & Algorithms',
  'Organic Chemistry',
  'USMLE Step 1 Cardiology',
  'Linear Algebra & Calculus',
  'System Design & Microservices',
  'JEE Physics & Mechanics',
  'IELTS Speaking & Writing',
  'Machine Learning & PyTorch',
  'Neuroscience & Biology',
  'Macroeconomics & Finance',
  'Quantum Physics',
  'Constitutional Law'
];

export const LEARNING_GOALS = [
  'Grind LeetCode for Tech Interviews',
  'Clear USMLE / MCAT Medical Board Exams',
  'Ace JEE / NEET Competitive Exams',
  'Score 8.0+ in IELTS / TOEFL',
  'Master Full-Stack Web Architecture',
  'Complete Advanced University Math',
  'Prepare for CFA Level 1 Exam',
  'Fluent Conversational Spanish / German'
];

export const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
];

export const MOCK_PARTNERS: StudyPartner[] = [];

export const MOCK_STUDY_ROOMS: StudyRoom[] = [];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Study Flame 7-Day',
    description: 'Maintained an active study streak for 7 consecutive days.',
    icon: '🔥',
    unlocked: false,
    progress: 0,
    maxProgress: 7,
    category: 'streak'
  },
  {
    id: 'ach-2',
    title: 'Century Scholar',
    description: 'Clocked 100+ total hours of collaborative study sessions.',
    icon: '🏆',
    unlocked: false,
    progress: 0,
    maxProgress: 100,
    category: 'hours'
  },
  {
    id: 'ach-3',
    title: 'Global Peer Network',
    description: 'Added 10 study partners to your Learning Circle.',
    icon: '🌐',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    category: 'social'
  },
  {
    id: 'ach-4',
    title: 'Whiteboard Wizard',
    description: 'Created 25+ collaborative whiteboard diagrams.',
    icon: '🎨',
    unlocked: false,
    progress: 0,
    maxProgress: 25,
    category: 'mastery'
  },
  {
    id: 'ach-5',
    title: 'Night Owl Marathoner',
    description: 'Completed a 3+ hour focus session after midnight.',
    icon: '🦉',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: 'streak'
  }
];

export const SAMPLE_FILES: FileAttachment[] = [];

export const SAMPLE_FLASHCARDS: Flashcard[] = [];

export const INITIAL_FRIEND_REQUESTS: PendingFriendRequest[] = [];

export const INITIAL_STUDY_PODS: StudyPod[] = [];

export const INITIAL_COMMUNITIES: GlobalCommunity[] = [];

export const INITIAL_ACTIVITY_FEED: ActivityFeedItem[] = [];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [];

export const INITIAL_SCHEDULED_SESSIONS: ScheduledSession[] = [];

export const INITIAL_LEADERBOARDS: LeaderboardUser[] = [];
