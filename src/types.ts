export type AuthScreen = 
  | 'splash' 
  | 'welcome' 
  | 'login' 
  | 'register' 
  | 'verify-email' 
  | 'forgot-password' 
  | 'reset-password' 
  | 'onboarding';

export type LearnerRole = 
  | 'School Student' 
  | 'College Student' 
  | 'University Student' 
  | 'Working Professional' 
  | 'Teacher' 
  | 'Researcher' 
  | 'Other';

export type StudyStyleOption = 
  | 'One-to-One' 
  | 'Small Group' 
  | 'Community' 
  | 'Silent Study' 
  | 'Discussion' 
  | 'Project Collaboration' 
  | 'Mock Interview' 
  | 'Teaching Others';

export type CurrentPurposeOption = 
  | 'Study' 
  | 'Revise' 
  | 'Teach' 
  | 'Practice Interviews' 
  | 'Solve Problems' 
  | 'Find Project Partners' 
  | 'Learn Something New';

export interface SubjectSkillMap {
  subject: string;
  category: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface NotificationPreferences {
  friendRequests: boolean;
  studyReminders: boolean;
  messages: boolean;
  calls: boolean;
  learningGoals: boolean;
  achievements: boolean;
}

export interface IntelligentOnboardingData {
  profilePhotoUrl?: string;
  learnerRole?: LearnerRole;
  learningGoals: string[];
  subjects: SubjectSkillMap[];
  studyStyles: StudyStyleOption[];
  currentPurpose?: CurrentPurposeOption;
  preferredLanguages: string[];
  studyAvailability: string[];
  timezone: string;
  notificationPreferences: NotificationPreferences;
}

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type StudyStyle = 
  | '1-on-1 Deep Focus' 
  | 'Small Group Discussion' 
  | 'Silent Pomodoro Co-working' 
  | 'Mock Interview & Quiz' 
  | 'Pair Programming' 
  | 'Concept Teaching & Revision';

export type CurrentMood = 
  | 'Need Help' 
  | 'Want to Teach' 
  | 'Exam Crunch' 
  | 'Casual Discussion' 
  | 'Project Partner';

export type AvailabilityStatus = 'Available Now' | 'In Session' | 'Scheduled';

export type StudyStatus = 'Available' | 'In Session' | 'Do Not Disturb' | 'Looking for Pod' | 'Busy' | 'Away' | 'Offline';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  email: string;
  goal: string; // e.g., "Pass USMLE Step 1", "Crack FAANG Tech Interview"
  subjects: string[];
  skillLevel: SkillLevel;
  language: string;
  languages?: string[];
  timezone: string;
  country: string;
  studyStyle: StudyStyle;
  currentMood: CurrentMood;
  studyHoursTotal: number;
  streakDays: number;
  learningCircleCount: number;
  rating: number; // e.g. 4.9
  studyStatus?: StudyStatus;
  currentActivity?: string;
  followersCount?: number;
  followingCount?: number;
  projects?: { title: string; description: string; link?: string }[];
  badges?: string[];
}

export interface StudyPartner extends UserProfile {
  matchScore?: number;
  matchReason?: string;
  icebreakers?: string[];
  suggestedAgenda?: string[];
  isOnline: boolean;
  currentFocusSubject?: string;
  isFollowing?: boolean;
}

export interface PendingFriendRequest {
  id: string;
  sender: StudyPartner;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  createdAt: string;
  message?: string;
}

export type PodRole = 'Creator' | 'Moderator' | 'Member';

export interface PodMember {
  userId: string;
  name: string;
  avatar: string;
  role: PodRole;
  joinedAt: string;
  studyHoursInPod: number;
  isOnline?: boolean;
}

export interface StudyPodTask {
  id: string;
  title: string;
  completed: boolean;
  assignedTo?: string;
  dueDate?: string;
}

export interface StudyPodAnnouncement {
  id: string;
  title: string;
  text: string;
  authorName: string;
  createdAt: string;
}

export interface ScheduledSession {
  id: string;
  title: string;
  subject: string;
  inviteeNames: string[];
  date: string;
  time: string;
  durationMinutes: number;
  sessionType: 'Text' | 'Voice' | 'Video' | 'Whiteboard';
  recurring: 'None' | 'Daily' | 'Weekly' | 'Monthly';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  createdBy: string;
  podId?: string;
}

export interface StudyPod {
  id: string;
  name: string;
  description: string;
  category: string;
  avatar: string;
  coverImage: string;
  members: PodMember[];
  maxMembers: number; // 3 to 8
  visibility: 'Public' | 'Private' | 'Invite Only';
  tags: string[];
  goal: string;
  streakDays: number;
  announcements: StudyPodAnnouncement[];
  pinnedResources: FileAttachment[];
  taskList: StudyPodTask[];
  scheduledSessions: ScheduledSession[];
  chatMessages: ChatMessage[];
  myRole?: PodRole;
}

export interface CommunityComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  authorName: string;
  authorAvatar: string;
  authorRole?: string;
  title: string;
  content: string;
  postType: 'Discussion' | 'Question' | 'Resource' | 'Announcement';
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  comments: CommunityComment[];
  timestamp: string;
  tags: string[];
}

export interface GlobalCommunity {
  id: string;
  name: string;
  category: string;
  icon: string;
  coverImage: string;
  description: string;
  membersCount: number;
  joined: boolean;
  topContributors: { name: string; avatar: string; points: number }[];
  pinnedResources: FileAttachment[];
  posts: CommunityPost[];
}

export interface ActivityFeedItem {
  id: string;
  actorName: string;
  actorAvatar: string;
  action: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  badge?: string;
}

export interface AppNotification {
  id: string;
  type: 'FriendRequest' | 'PodInvite' | 'CommunityInvite' | 'UpcomingSession' | 'Achievement' | 'Mention' | 'Reaction';
  title: string;
  message: string;
  senderAvatar?: string;
  timestamp: string;
  read: boolean;
  actionData?: any;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  country: string;
  hoursLogged: number;
  streakDays: number;
  badge: string;
}

export type ActiveTab = 
  | 'home' 
  | 'matching' 
  | 'workspace' 
  | 'circle' 
  | 'pods' 
  | 'communities' 
  | 'rooms' 
  | 'leaderboards' 
  | 'stats' 
  | 'settings' 
  | 'notifications'
  | 'admin'
  | 'ai-ecosystem'
  | 'growth-engine'
  | 'business-platform'
  | 'infrastructure'
  | 'production-readiness';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isAi?: boolean;
  fileAttachment?: FileAttachment;
  voiceNote?: VoiceNoteAttachment;
  codeSnippet?: CodeSnippetAttachment;
  pinned?: boolean;
  starred?: boolean;
  status?: 'sent' | 'delivered' | 'seen';
  replyTo?: { id: string; text: string; senderName: string };
  reactions?: { [emoji: string]: string[] }; // emoji -> array of user names
}

export interface FileAttachment {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'word' | 'excel' | 'powerpoint' | 'image' | 'video' | 'zip' | 'code' | 'txt' | 'markdown' | 'audio';
  category?: 'Documents' | 'Images' | 'Code' | 'Media' | 'Archives';
  url: string;
  previewContent?: string;
  uploadedBy?: string;
  uploadedAt?: string;
}

export interface VoiceNoteAttachment {
  id: string;
  durationSeconds: number;
  audioUrl?: string;
}

export interface CodeSnippetAttachment {
  language: string;
  code: string;
  filename: string;
}

export type ToolType = 'select' | 'pen' | 'eraser' | 'rectangle' | 'circle' | 'arrow' | 'line' | 'text' | 'sticky' | 'laser';

export interface WhiteboardElement {
  id: string;
  type: ToolType;
  points?: { x: number; y: number }[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color: string;
  strokeWidth: number;
  text?: string;
  backgroundColor?: string;
}

export interface StudyRoom {
  id: string;
  title: string;
  subject: string;
  hostName: string;
  hostAvatar: string;
  participantCount: number;
  maxParticipants: number;
  studyStyle: StudyStyle;
  tags: string[];
  isPrivate: boolean;
  code?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  category: 'streak' | 'hours' | 'social' | 'mastery';
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export type WorkspaceSubTab = 'chat' | 'video' | 'whiteboard' | 'notes' | 'files' | 'participants' | 'tools';

export interface SessionNote {
  id: string;
  sessionId: string;
  title: string;
  content: string;
  lastSavedAt: string;
  updatedBy: string;
}

export interface SessionSummaryReport {
  sessionId: string;
  subject: string;
  durationSeconds: number;
  messagesSent: number;
  filesShared: number;
  whiteboardEdits: number;
  notesCreated: number;
  achievementsEarned: string[];
  streakDays: number;
  partner: StudyPartner;
}

export interface QuickMatchCriteria {
  subject: string;
  goal: string;
  skillLevel: SkillLevel;
  studyType: StudyStyleOption;
  sessionLength: string;
  communicationPref: 'Text Chat' | 'Voice' | 'Video' | 'Whiteboard' | 'Any';
  languages: string[];
}

export interface GlobalActivityCategory {
  category: string;
  activeLearners: number;
  icon: string;
}

export interface RecentSessionItem {
  id: string;
  subject: string;
  partnerName: string;
  partnerAvatar: string;
  durationMinutes: number;
  date: string;
  rating: number;
  notesPinned?: string;
}

// ==========================================
// ADMIN ECOSYSTEM TYPES (PROMPT 7)
// ==========================================

export type AdminRole = 
  | 'Super Admin'
  | 'Platform Admin'
  | 'Community Moderator'
  | 'Study Pod Moderator'
  | 'Support Executive'
  | 'Content Reviewer'
  | 'Analytics Manager'
  | 'Security Administrator';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: AdminRole;
  permissions: string[];
  mfaEnabled: boolean;
  lastLogin: string;
  status: 'Active' | 'Suspended';
}

export type ReportCategory = 
  | 'Spam'
  | 'Abuse'
  | 'Harassment'
  | 'Fake Profile'
  | 'Copyright'
  | 'Academic Misconduct'
  | 'Inappropriate Files'
  | 'Fraud';

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface ModerationReport {
  id: string;
  reportedUserId: string;
  reportedUserName: string;
  reportedUserAvatar: string;
  reporterId: string;
  reporterName: string;
  category: ReportCategory;
  reason: string;
  evidenceContent: string;
  status: 'Pending' | 'Under Review' | 'Resolved' | 'Dismissed';
  createdAt: string;
  priority: TicketPriority;
  assignedAdmin?: string;
}

export interface SupportTicketMessage {
  id: string;
  sender: string;
  senderRole: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedAgentId?: string;
  assignedAgentName?: string;
  createdAt: string;
  updatedAt: string;
  internalNotes: string[];
  messages: SupportTicketMessage[];
}

export interface SystemAnnouncement {
  id: string;
  title: string;
  content: string;
  targetType: 'All Learners' | 'Country' | 'Community' | 'Study Pod' | 'Subject';
  targetValue?: string;
  sendPush: boolean;
  sendEmail: boolean;
  scheduledFor: string;
  status: 'Draft' | 'Scheduled' | 'Sent';
  createdAt: string;
  createdBy: string;
  recipientCount?: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  adminName: string;
  adminRole: AdminRole;
  action: string;
  affectedEntity: string;
  previousValue?: string;
  newValue?: string;
  reason: string;
  ipAddress: string;
}

export interface ServerHealthMetrics {
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  activeWebSockets: number;
  dbConnections: number;
  redisStatus: 'Healthy' | 'Degraded' | 'Offline';
  apiLatencyMs: number;
  errorRatePercent: number;
  liveVoiceCalls: number;
  liveVideoCalls: number;
  filesUploadedToday: number;
  serverStatus: 'Operational' | 'High Load' | 'Degraded';
}

export interface AdminOverviewStats {
  totalLearners: number;
  learnersOnline: number;
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  studySessionsToday: number;
  voiceCallsToday: number;
  videoCallsToday: number;
  filesUploaded: number;
  communitiesCreated: number;
  studyPodsCreated: number;
  pendingReports: number;
  bannedAccounts: number;
  monthlyRevenue: number;
  premiumSubscribers: number;
  openSupportTickets: number;
}

// ============================================================
// AI LEARNING ECOSYSTEM MODELS (PROMPT 8)
// ============================================================

export type AIProvider = 'Google Gemini' | 'OpenAI' | 'Anthropic' | 'Open-Source LLM' | 'Local Engine';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  tokens?: number;
}

export interface AIConversation {
  id: string;
  userId: string;
  title: string;
  provider: AIProvider;
  model: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
  tokenCount: number;
  contextTags: string[];
}

export interface AIInsight {
  id: string;
  userId: string;
  category: 'Productivity' | 'Learning Style' | 'Subject Strength' | 'Focus' | 'Consistency';
  title: string;
  metric: string;
  score: number;
  recommendation: string;
  createdAt: string;
}

export interface AISummary {
  id: string;
  sessionId?: string;
  sessionTitle: string;
  subject: string;
  summary: string;
  topicsCovered: string[];
  importantConcepts: string[];
  actionItems: string[];
  resourcesMentioned: string[];
  nextSessionSuggestions: string[];
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface AIQuiz {
  id: string;
  title: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: QuizQuestion[];
  sourceNoteId?: string;
  userScore?: number;
  completedAt?: string;
  createdAt: string;
}

export interface Flashcard {
  id: string;
  deckTitle: string;
  subject: string;
  front: string;
  back: string;
  hint?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  dueDate: string;
  bookmarked: boolean;
  createdAt: string;
}

export interface RevisionPlan {
  id: string;
  userId: string;
  subject: string;
  topic: string;
  targetDate: string;
  status: 'Upcoming' | 'Completed' | 'Overdue';
  priority: 'High' | 'Medium' | 'Low';
  reviewCount: number;
  notes?: string;
}

export interface StudyRecommendation {
  id: string;
  type: 'Study' | 'Learner' | 'Community' | 'Pod' | 'Resource';
  title: string;
  description: string;
  category: string;
  compatibilityScore?: number;
  actionUrl?: string;
  metadata?: any;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  template: string;
  variables: string[];
  provider: AIProvider;
  isSystem: boolean;
}

export interface AIUsage {
  id: string;
  userId: string;
  provider: AIProvider;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  timestamp: string;
  costEstimated: number;
}

export interface AIGatewayStatus {
  activeProvider: AIProvider;
  fallbackProvider: AIProvider;
  rateLimitPerMin: number;
  currentRequestsPerMin: number;
  cacheHitRatio: number;
  safetyFilterEnabled: boolean;
  totalTokensToday: number;
  estimatedCostToday: number;
}

export interface AIProfileStats {
  mostProductiveTime: string;
  bestLearningStyle: string;
  favouriteSubjects: string[];
  weakAreas: string[];
  strongAreas: string[];
  consistencyScore: number;
  focusScore: number;
  todayGoalHours: number;
  todayCompletedHours: number;
}

export interface AIResourceItem {
  id: string;
  title: string;
  type: 'Book' | 'Video' | 'Course' | 'Article' | 'Documentation' | 'Research Paper';
  authorOrProvider: string;
  url: string;
  matchScore: number;
  description: string;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface AIProjectIdea {
  id: string;
  title: string;
  type: 'Mini Project' | 'Portfolio Project' | 'Research Topic' | 'Hackathon Idea' | 'Interview Practice';
  subject: string;
  description: string;
  techStack: string[];
  estimatedHours: number;
  keyLearnings: string[];
}

export interface MockInterviewQuestion {
  id: string;
  type: 'Coding' | 'Behavioral';
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  hints: string[];
  sampleSolution: string;
  userAnswer?: string;
  aiFeedback?: {
    score: number;
    strengths: string[];
    improvements: string[];
    suggestedAnswer: string;
  };
}

export interface AIReminderItem {
  id: string;
  title: string;
  type: 'Study Reminder' | 'Revision Reminder' | 'Assignment Reminder' | 'Exam Reminder' | 'Challenge Reminder';
  dateTime: string;
  subject: string;
  isCompleted: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

// ============================================================
// GROWTH & RETENTION ENGINE MODELS (PROMPT 9)
// ============================================================

export interface Referral {
  id: string;
  referrerUserId: string;
  refereeEmail: string;
  refereeName?: string;
  referralCode: string;
  status: 'Pending' | 'Registered' | 'ProfileCompleted' | 'FirstSessionDone' | 'Rewarded';
  createdAt: string;
  completedAt?: string;
  rewardClaimed?: boolean;
}

export interface ReferralReward {
  id: string;
  userId: string;
  referralId: string;
  rewardType: 'XP' | 'Badge' | 'PremiumTrial' | 'CustomTheme' | 'ProfileDecoration';
  rewardTitle: string;
  rewardValue: string;
  unlockedAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'Individual' | 'Friend' | 'Pod' | 'Community' | 'Global';
  category: string;
  targetMetric: string; // e.g., '10 Sessions', '500 Mins', '100 Flashcards'
  currentProgress: number;
  maxProgress: number;
  rewardXp: number;
  rewardBadge: string;
  endDate: string;
  joined: boolean;
  participantsCount: number;
}

export interface SeasonalEvent {
  id: string;
  name: 'Python Week' | 'AI Week' | 'Interview Month' | 'UPSC Marathon' | 'Hacktober' | 'Exam Countdown' | string;
  tagline: string;
  startDate: string;
  endDate: string;
  themeColor: string;
  bannerIcon: string;
  rewardXp: number;
  activeParticipants: number;
  progressPercent: number;
  isJoined: boolean;
}

export interface LearningMission {
  id: string;
  title: string; // e.g. "Complete 3 Sessions", "Help 5 Learners", "Share Notes", "Join Community", "Create Whiteboard", "Invite Friend"
  description: string;
  category: string;
  xpReward: number;
  currentCount: number;
  targetCount: number;
  completed: boolean;
}

export interface DailyCheckIn {
  dayNumber: number;
  xpBonus: number;
  isClaimed: boolean;
  isToday: boolean;
}

export interface SocialMilestoneReaction {
  id: string;
  authorName: string;
  authorAvatar: string;
  milestoneTitle: string;
  reactionType: 'Congratulate' | 'Celebrate' | 'Flame' | 'Support';
  message: string;
  timestamp: string;
}

export interface GrowthAnalytics {
  dau: number;
  wau: number;
  mau: number;
  retentionD1: number;
  retentionD7: number;
  retentionD30: number;
  referralConversionRate: number;
  inviteAcceptanceRate: number;
  sessionCompletionRate: number;
  challengeParticipationRate: number;
  totalInvitesSent: number;
  totalRewardsUnlocked: number;
}

export interface EmailTemplateItem {
  id: string;
  type: 'Welcome' | 'Reminder' | 'Weekly Progress' | 'Monthly Report' | 'Achievement' | 'Referral';
  recipientEmail: string;
  subject: string;
  body: string;
  sentAt: string;
  status: 'Delivered' | 'Pending' | 'Queued';
}

// ============================================================
// BUSINESS & MONETIZATION PLATFORM MODELS (PROMPT 10)
// ============================================================

export type PaymentGatewayProvider = 'Stripe' | 'Razorpay' | 'Cashfree' | 'PayPal' | 'GooglePay' | 'ApplePay';

export interface PlanFeature {
  text: string;
  includedInFree: boolean;
  includedInPlus: boolean;
  includedInPro: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planTier: 'FREE' | 'PLUS' | 'PRO';
  billingCycle: 'Monthly' | 'Quarterly' | 'Yearly';
  status: 'Active' | 'Paused' | 'Cancelled' | 'Expired';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  autoRenew: boolean;
  amountPaid: number;
  currency: string;
  paymentGateway: PaymentGatewayProvider;
}

export interface MentorProfile {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  bio: string;
  expertise: string[];
  experienceYears: number;
  companyOrInstitution: string;
  languages: string[];
  country: string;
  hourlyPrice: number;
  currency: string;
  rating: number;
  reviewCount: number;
  completedSessions: number;
  verifiedBadge: boolean;
  availableDays: string[];
  timeSlots: string[];
  introVideoUrl?: string;
}

export interface MentorBooking {
  id: string;
  mentorId: string;
  mentorName: string;
  learnerId: string;
  learnerName: string;
  date: string;
  timeSlot: string;
  durationMinutes: number;
  totalAmount: number;
  platformCommission: number;
  netMentorPayout: number;
  status: 'Requested' | 'Confirmed' | 'InEscrow' | 'Completed' | 'Refunded' | 'Cancelled';
  paymentGateway: PaymentGatewayProvider;
  transactionId: string;
  invoiceUrl: string;
  meetingLink?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  userGstin?: string;
  type: 'Subscription' | 'MentorBooking' | 'CareerService';
  description: string;
  subtotal: number;
  gstAmount: number; // 18% GST calculation
  taxPercentage: number;
  totalAmount: number;
  currency: string;
  paymentProvider: PaymentGatewayProvider;
  issuedAt: string;
  status: 'Paid' | 'Refunded' | 'Failed';
  pdfDownloadUrl: string;
}

export interface Wallet {
  id: string;
  userId: string;
  rewardCredits: number;
  referralCredits: number;
  refundCredits: number;
  totalBalance: number;
  currency: string;
  lastUpdated: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: 'ReferralBonus' | 'SessionRefund' | 'ChallengeReward' | 'MentorPayout' | 'SubscriptionCredit';
  amount: number;
  isCredit: boolean;
  description: string;
  timestamp: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discountPercentage: number;
  flatDiscountAmount: number;
  type: 'Percentage' | 'Flat' | 'Referral';
  expiryDate: string;
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
}

export interface LearningPassport {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  headline: string;
  studyHoursTotal: number;
  reputationScore: number;
  verifiedSkills: string[];
  projectsCompleted: number;
  communitiesJoined: number;
  certificatesEarnedCount: number;
  publicPassportUrl: string;
  qrShareUrl: string;
}

export interface VerifiedCertificate {
  id: string;
  certificateNumber: string;
  title: '100 Study Hours' | 'Python Challenge Master' | 'AI Learning Specialist' | 'Mentor Recognition' | 'Pod Leader MVP' | string;
  issueDate: string;
  issuer: 'StudyConnect Global Academy';
  recipientName: string;
  recipientUserId: string;
  verificationHash: string;
  badgeIcon: string;
  downloadUrl: string;
}

export interface CareerServiceOffer {
  id: string;
  title: 'Resume Review' | 'Portfolio Review' | '1-on-1 Mock Interview' | 'Career Guidance' | 'Job Referral Network';
  description: string;
  price: number;
  currency: string;
  deliveryTimeDays: number;
  rating: number;
  reviews: number;
}

export interface JobListing {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  type: 'Full-time' | 'Internship' | 'Hackathon' | 'Research' | 'Freelance';
  location: string;
  salaryOrStipend: string;
  requiredSkills: string[];
  postedDate: string;
  applicantsCount: number;
  isFeatured: boolean;
}

export interface CompanyProfile {
  id: string;
  name: string;
  logo: string;
  industry: string;
  website: string;
  location: string;
  verifiedEmployer: boolean;
  openJobsCount: number;
}

export interface BusinessAnalytics {
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
  conversionRatePercent: number;
  subscriptionGrowthPercent: number;
  mentorMarketplaceRevenue: number;
  careerServicesRevenue: number;
  arpu: number; // Average Revenue Per User
  ltv: number;  // Lifetime Value
  churnRatePercent: number;
  activePaidSubscribers: number;
}

// ============================================================
// ENTERPRISE PRODUCTION INFRASTRUCTURE MODELS (PROMPT 11)
// ============================================================

export interface ContainerServiceStatus {
  id: string;
  name: string;
  role: 'Backend API' | 'WebSocket Server' | 'Celery Worker' | 'Celery Beat' | 'Redis Cluster' | 'PostgreSQL Primary' | 'PostgreSQL Read Replica' | 'Nginx Load Balancer' | 'Frontend SPA';
  status: 'Healthy' | 'Degraded' | 'Deploying' | 'Stopped';
  cpuUsagePercent: number;
  memoryUsageMb: number;
  maxMemoryMb: number;
  uptimeSeconds: number;
  restartsCount: number;
  port: number;
  containerId: string;
}

export interface RedisCacheStats {
  connectedClients: number;
  usedMemoryHuman: string;
  hitRatePercent: number;
  totalHits: number;
  totalMisses: number;
  keysCount: number;
  evictedKeys: number;
  uptimeDays: number;
}

export interface CeleryQueueMetrics {
  activeWorkers: number;
  queuedTasksCount: number;
  processedTasksCount: number;
  failedTasksCount: number;
  avgExecutionTimeMs: number;
  activeTasks: {
    id: string;
    taskName: string;
    args: string;
    runtimeSeconds: number;
    workerId: string;
  }[];
}

export interface DbReplicaStatus {
  instanceName: string;
  role: 'Primary Write' | 'Read Replica 1' | 'Read Replica 2';
  region: string;
  replicationLagMs: number;
  activeConnections: number;
  maxConnections: number;
  dbSizeBytes: number;
  lastBackupTimestamp: string;
  status: 'ONLINE' | 'REPLICATING' | 'FAILOVER_READY';
}

export interface PipelineStep {
  name: string;
  status: 'Success' | 'Running' | 'Failed' | 'Queued';
  durationSeconds: number;
}

export interface PipelineRun {
  id: string;
  commitHash: string;
  branch: string;
  author: string;
  commitMessage: string;
  timestamp: string;
  status: 'Passed' | 'Failed' | 'In Progress';
  durationSeconds: number;
  steps: PipelineStep[];
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  eventType: 'RateLimitExceeded' | 'FailedLogin' | 'XSSBlocked' | 'SQLInjectionAttempt' | 'JWTRefreshed' | 'DDoSProtectionTriggered';
  ipAddress: string;
  endpoint: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  actionTaken: 'Blocked' | 'Challenged' | 'Logged' | 'Allowed';
  details: string;
}

export interface InfraHealthOverview {
  overallHealth: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  clusterUptimePercent: number;
  activeNodesCount: number;
  totalRequestsPerMin: number;
  avgApiLatencyMs: number;
  p99LatencyMs: number;
  errorRatePercent: number;
  currentTrafficScale: '1,000 Users' | '10,000 Users' | '100,000 Users' | '1 Million Users' | '10 Million Users';
}

// ============================================================
// PRODUCTION READINESS & LAUNCH MODELS (PROMPT 12)
// ============================================================

export interface QATestItem {
  id: string;
  suiteName: string;
  testCategory: 'Unit' | 'Integration' | 'Realtime WebSocket' | 'E2E' | 'Performance' | 'Security' | 'Accessibility' | 'Localization' | 'Offline';
  name: string;
  status: 'PASSED' | 'FAILED' | 'RUNNING' | 'SKIPPED';
  durationMs: number;
  assertionsCount: number;
  lastRunAt: string;
  logs?: string;
}

export interface LaunchChecklistItem {
  id: string;
  category: 'Authentication' | 'Real-Time Sync' | 'AI & Gemini' | 'Monetization' | 'Security & Audit' | 'Mobile App Stores' | 'Legal & Compliance' | 'Observability' | 'Backups';
  title: string;
  description: string;
  isCompleted: boolean;
  verifiedBy: string;
  verifiedAt: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface FeatureFlagItem {
  key: string;
  description: string;
  state: 'OFF' | 'STAGING' | 'CANARY_10' | 'CANARY_50' | 'PRODUCTION_100';
  targetAudience: string;
  owner: string;
  lastModified: string;
}

export type SupportedLanguage = 'en' | 'te' | 'hi' | 'ta' | 'kn' | 'ml';

export interface LanguageTranslationMeta {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  completionPercent: number;
  totalKeys: number;
  missingKeys: number;
}

export interface IncidentRunbookItem {
  id: string;
  severity: 'SEV-1' | 'SEV-2' | 'SEV-3';
  title: string;
  triggerCondition: string;
  onCallEscalation: string;
  mitigationSteps: string[];
  rtoMinutes: number;
  rpoMinutes: number;
}

export interface StoreAssetMeta {
  platform: 'Android Google Play' | 'Apple App Store';
  version: string;
  appName: string;
  subtitle: string;
  keywords: string[];
  privacyUrl: string;
  termsUrl: string;
  screenshotsUploaded: number;
  reviewStatus: 'Approved' | 'In Review' | 'Ready for Submission';
}

export interface ProductionReadinessReport {
  overallScorePercent: number;
  totalChecklistCompleted: number;
  totalChecklistItems: number;
  testsPassedCount: number;
  totalTestsCount: number;
  zeroBlockingVulnerabilities: boolean;
  crashFreeSessionsPercent: number;
  targetLaunchDate: string;
}





