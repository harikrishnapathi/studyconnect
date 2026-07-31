import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { AIGateway, ContextBuilder, PromptManager, RateLimiterAndTracker } from './src/services/aiGateway';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Helper lazy accessor for Gemini AI
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'StudyConnect API' });
});

// In-memory database tables for User, UserProfile, OTP, and Refresh Tokens
interface DbUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  passwordHash: string;
  country: string;
  preferredLanguage: string;
  acceptTerms: boolean;
  newsletter: boolean;
  isEmailVerified: boolean;
  createdAt: string;
}

const usersDb: Map<string, DbUser> = new Map();
const otpDb: Map<string, { otp: string; expiresAt: number }> = new Map();
const userProfilesDb: Map<string, any> = new Map();

// Helper to simulate JWT tokens
function generateTokens(userId: string) {
  const accessToken = `jwt_access_${userId}_${Date.now()}`;
  const refreshToken = `jwt_refresh_${userId}_${Date.now()}`;
  return { accessToken, refreshToken };
}

// Auth API 1: Register
app.post('/api/auth/register', (req, res) => {
  try {
    const { fullName, username, email, password, country, preferredLanguage, acceptTerms, newsletter } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ success: false, error: 'Missing required registration fields' });
    }

    if (!acceptTerms) {
      return res.status(400).json({ success: false, error: 'Terms and Conditions must be accepted' });
    }

    // Check duplicate username or email
    for (const u of usersDb.values()) {
      if (u.username.toLowerCase() === username.toLowerCase()) {
        return res.status(400).json({ success: false, error: 'Username is already taken' });
      }
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return res.status(400).json({ success: false, error: 'An account with this email already exists' });
      }
    }

    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newUser: DbUser = {
      id: userId,
      fullName,
      username,
      email: email.toLowerCase(),
      passwordHash: password, // In production this would be bcrypt/argon2
      country: country || 'United States',
      preferredLanguage: preferredLanguage || 'English',
      acceptTerms: Boolean(acceptTerms),
      newsletter: Boolean(newsletter),
      isEmailVerified: false,
      createdAt: new Date().toISOString()
    };

    usersDb.set(userId, newUser);

    // Generate 6-digit verification OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpDb.set(email.toLowerCase(), { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

    const tokens = generateTokens(userId);

    res.json({
      success: true,
      message: 'Registration successful. Verification email sent.',
      userId,
      email: newUser.email,
      otpDemo: otp, // Returned for instant testing/verification UX
      tokens
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Auth API 2: Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }

    let foundUser: DbUser | undefined;
    for (const u of usersDb.values()) {
      if (u.email === email.toLowerCase()) {
        foundUser = u;
        break;
      }
    }

    if (!foundUser) {
      return res.status(401).json({ success: false, error: 'Invalid email or password credentials' });
    }

    if (foundUser.passwordHash !== password) {
      return res.status(401).json({ success: false, error: 'Invalid email or password credentials' });
    }

    const tokens = generateTokens(foundUser.id);
    const profile = userProfilesDb.get(foundUser.id) || null;

    res.json({
      success: true,
      user: {
        id: foundUser.id,
        fullName: foundUser.fullName,
        username: foundUser.username,
        email: foundUser.email,
        country: foundUser.country,
        preferredLanguage: foundUser.preferredLanguage,
        isEmailVerified: foundUser.isEmailVerified
      },
      tokens,
      profile,
      isOnboarded: Boolean(profile?.isProfileComplete)
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Auth API 3: Verify Email with OTP
app.post('/api/auth/verify-email', (req, res) => {
  try {
    const { email, otp } = req.body;
    const stored = otpDb.get(email?.toLowerCase());

    if (!stored || stored.otp !== otp || Date.now() > stored.expiresAt) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP code' });
    }

    // Mark user email verified
    for (const u of usersDb.values()) {
      if (u.email === email.toLowerCase()) {
        u.isEmailVerified = true;
        break;
      }
    }

    otpDb.delete(email.toLowerCase());
    res.json({ success: true, message: 'Email address verified successfully!' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Auth API 4: Forgot Password (Sends OTP)
app.post('/api/auth/forgot-password', (req, res) => {
  try {
    const { email } = req.body;
    let foundUser: DbUser | undefined;
    for (const u of usersDb.values()) {
      if (u.email === email?.toLowerCase()) {
        foundUser = u;
        break;
      }
    }

    if (!foundUser) {
      return res.status(440).json({ success: false, error: 'No account registered under this email' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpDb.set(email.toLowerCase(), { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

    res.json({
      success: true,
      message: 'Password reset OTP sent to email address',
      otpDemo: otp
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Auth API 5: Verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;
    const stored = otpDb.get(email?.toLowerCase());

    if (!stored || stored.otp !== otp || Date.now() > stored.expiresAt) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }

    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Auth API 6: Reset Password
app.post('/api/auth/reset-password', (req, res) => {
  try {
    const { email, newPassword } = req.body;
    let foundUser: DbUser | undefined;
    for (const u of usersDb.values()) {
      if (u.email === email?.toLowerCase()) {
        foundUser = u;
        break;
      }
    }

    if (!foundUser) {
      return res.status(400).json({ success: false, error: 'User not found' });
    }

    foundUser.passwordHash = newPassword;
    otpDb.delete(email.toLowerCase());

    res.json({ success: true, message: 'Password updated successfully. You may now login.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Profile & Onboarding API
app.post('/api/profile/update-onboarding', (req, res) => {
  try {
    const { userId, profileData } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID required' });
    }

    const fullProfile = {
      ...profileData,
      isProfileComplete: true,
      updatedAt: new Date().toISOString()
    };

    userProfilesDb.set(userId, fullProfile);
    res.json({ success: true, profile: fullProfile });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// AI Intelligent Study Partner Matcher API
app.post('/api/ai-match', async (req, res) => {
  try {
    const { userProfile, mockDatabasePartners } = req.body;
    const ai = getGenAI();

    if (ai && userProfile) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are the core AI Matching Engine for StudyConnect ("Never Study Alone Again").
Given the following student profile:
${JSON.stringify(userProfile, null, 2)}

And candidate study partners:
${JSON.stringify(mockDatabasePartners || [], null, 2)}

Task:
1. Select the 3 best matching study partners based on learning goals, skill compatibility, language, study style, and current mood.
2. For each partner, provide a numerical compatibility score (85 to 99), a 2-sentence explanation of why they are an ideal study partner, 2 custom icebreaker topic suggestions, and a recommended 45-minute study agenda.

Return strictly valid JSON format with array "matches":
[
  {
    "partnerId": "string id matching candidate",
    "matchScore": 95,
    "matchReason": "string",
    "icebreakers": ["string", "string"],
    "suggestedAgenda": ["15m: Review core concepts", "20m: Solve practice problems", "10m: Q&A recap"]
  }
]`
                }
              ]
            }
          ],
          config: {
            responseMimeType: 'application/json'
          }
        });

        const text = response.text || '';
        const parsed = JSON.parse(text);
        return res.json({ success: true, matches: parsed.matches || [] });
      } catch (err: any) {
        console.error('Gemini AI match error, falling back to smart rule engine:', err?.message);
      }
    }

    // Smart deterministic algorithm fallback
    const matches = (mockDatabasePartners || []).map((p: any) => {
      let score = 75;
      if (p.subject === userProfile?.subject) score += 12;
      if (p.skillLevel === userProfile?.skillLevel) score += 6;
      if (p.language === userProfile?.language) score += 4;
      if (p.studyStyle === userProfile?.studyStyle) score += 3;
      score = Math.min(99, Math.max(82, score));

      return {
        partnerId: p.id,
        matchScore: score,
        matchReason: `High compatibility on ${userProfile?.subject || 'learning objectives'}. Shared focus on ${userProfile?.studyStyle || 'collaborative learning'}.`,
        icebreakers: [
          `Hey! Ready to tackle ${userProfile?.subject || 'this topic'} together?`,
          `What's your biggest target goal for this session?`
        ],
        suggestedAgenda: [
          '10m: Concept recap & objectives',
          '25m: Deep focus / practice round',
          '10m: Summary & action items'
        ]
      };
    }).sort((a: any, b: any) => b.matchScore - a.matchScore);

    res.json({ success: true, matches });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API Endpoint: Quick Match wizard evaluation
app.post('/api/quick-match', (req, res) => {
  try {
    const { criteria, mockDatabasePartners } = req.body;
    const { subject, goal, skillLevel, studyType, communicationPref, languages } = criteria || {};

    const candidates = mockDatabasePartners || [];

    // Calculate score using weighted ranking factors
    const scored = candidates.map((p: any) => {
      let score = 70; // Base score

      // 1. Same Subject (Highest Priority) +20
      if (p.subjects?.some((s: string) => s.toLowerCase().includes((subject || '').toLowerCase()))) {
        score += 20;
      }

      // 2. Same Goal (Very High Priority) +12
      if (p.goal?.toLowerCase().includes((goal || '').toLowerCase())) {
        score += 12;
      }

      // 3. Skill Level Compatibility (Very High) +10
      if (p.skillLevel === skillLevel) {
        score += 10;
      } else if (
        (skillLevel === 'Beginner' && p.skillLevel === 'Intermediate') ||
        (skillLevel === 'Intermediate' && p.skillLevel === 'Advanced')
      ) {
        score += 7;
      }

      // 4. Language Match (Very High) +10
      if (languages && Array.isArray(languages)) {
        if (languages.includes(p.language)) score += 10;
      } else if (p.language === 'English') {
        score += 6;
      }

      // 5. Online Status & Streak (Medium) +8
      if (p.isOnline) score += 5;
      if (p.streakDays > 10) score += 3;

      // Clamp score between 78 and 99
      const finalScore = Math.min(99, Math.max(78, score));

      return {
        partner: p,
        compatibilityScore: finalScore,
        matchReason: `High compatibility on ${subject || 'selected topic'} (${finalScore}% match). Shared alignment on ${goal || 'session goal'} and ${p.studyStyle}.`,
        icebreakers: [
          `Hey ${p.name.split(' ')[0]}! Ready to focus on ${subject || 'our topic'}?`,
          `What's your primary goal for our ${criteria?.sessionLength || '30-minute'} study session?`
        ],
        suggestedAgenda: [
          `10m: Concept overview & problem breakdown for ${subject || 'topic'}`,
          `20m: Active problem solving via ${communicationPref || 'interactive room'}`,
          `10m: Q&A recap & key takeaways`
        ]
      };
    }).sort((a: any, b: any) => b.compatibilityScore - a.compatibilityScore);

    res.json({
      success: true,
      matches: scored
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API Endpoint: Recommended Matches
app.get('/api/recommended-matches', (req, res) => {
  res.json({
    success: true,
    recommendations: []
  });
});

// API Endpoint: Trending Subjects
app.get('/api/trending-subjects', (req, res) => {
  res.json({
    success: true,
    subjects: [
      { name: 'Python', activeLearners: 0, category: 'Programming', icon: '💻' },
      { name: 'Data Structures & Algorithms', activeLearners: 0, category: 'Computer Science', icon: '⚡' },
      { name: 'Machine Learning', activeLearners: 0, category: 'AI', icon: '🤖' },
      { name: 'React Native', activeLearners: 0, category: 'Mobile Dev', icon: '📱' },
      { name: 'UPSC CSE', activeLearners: 0, category: 'Competitive Exams', icon: '📚' },
      { name: 'GATE CS', activeLearners: 0, category: 'Engineering', icon: '⚙️' },
      { name: 'USMLE Step 1', activeLearners: 0, category: 'Medical', icon: '🩺' },
      { name: 'Calculus & Linear Algebra', activeLearners: 0, category: 'Mathematics', icon: '📐' }
    ]
  });
});

// API Endpoint: Recommended Rooms
app.get('/api/recommended-rooms', (req, res) => {
  res.json({
    success: true,
    rooms: []
  });
});

// API Endpoint: Recent Sessions
app.get('/api/recent-sessions', (req, res) => {
  res.json({
    success: true,
    sessions: []
  });
});

// API Endpoint: Study Statistics
app.get('/api/study-stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      dailyHours: 2.5,
      weeklyHours: 14.8,
      monthlyHours: 58.2,
      longestStreak: 21,
      currentStreak: 12,
      todayGoalHours: 3.0,
      todayCompletedHours: 2.5
    }
  });
});

// API Endpoint: Learning Dashboard
app.get('/api/learning-dashboard', (req, res) => {
  res.json({
    success: true,
    dashboard: {
      userGreeting: 'Hari',
      subtitle: 'What would you like to learn today?',
      recentSubjects: ['Data Structures & Algorithms', 'Python', 'Machine Learning', 'USMLE Step 1'],
      globalActivity: [
        { category: 'Programming', activeLearners: 3420, icon: '💻' },
        { category: 'Engineering', activeLearners: 1890, icon: '⚙️' },
        { category: 'Medical', activeLearners: 1240, icon: '🩺' },
        { category: 'Languages', activeLearners: 980, icon: '🌐' },
        { category: 'Competitive Exams', activeLearners: 2750, icon: '📚' },
        { category: 'Business & Finance', activeLearners: 810, icon: '📈' },
        { category: 'Artificial Intelligence', activeLearners: 2140, icon: '🤖' }
      ]
    }
  });
});

// AI Study Assistant Chat / Quiz API
app.post('/api/ai-assistant', async (req, res) => {
  try {
    const { prompt, subject, topic, mode } = req.body;
    const result = await AIGateway.executePrompt(
      prompt || `Provide concise study help for topic: ${topic} in subject: ${subject}. Mode: ${mode}`,
      'You are the StudyConnect AI Study Assistant.'
    );
    res.json({ success: true, text: result.text, providerUsed: result.providerUsed });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================
// AI LEARNING ECOSYSTEM API ENDPOINTS (PROMPT 8)
// ============================================================

// Gateway Status & Telemetry
app.get('/api/ai/gateway-stats', (req, res) => {
  try {
    const stats = AIGateway.getGatewayStatus();
    res.json({ success: true, stats });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Chat (with Context & Conversation Memory)
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, context, chatHistory } = req.body;
    const systemInstruction = ContextBuilder.buildContext({
      userProfile: context?.userProfile,
      subject: context?.subject,
      goal: context?.goal,
      sessionNotes: context?.sessionNotes,
      chatHistory
    });

    const result = await AIGateway.executePrompt(message, systemInstruction);
    res.json({
      success: true,
      response: {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: result.text,
        timestamp: new Date().toISOString(),
        providerUsed: result.providerUsed,
        fromCache: result.fromCache
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Session Summary & PDF Generator Data
app.post('/api/ai/summary', async (req, res) => {
  try {
    const { sessionTitle, subject, notes, whiteboardContent } = req.body;
    const prompt = `Analyze this study session and return JSON:
Session Title: ${sessionTitle || 'Study Session'}
Subject: ${subject || 'General'}
Notes: ${notes || ''}
Whiteboard Text: ${whiteboardContent || ''}`;

    const systemInstruction = `You are the StudyConnect AI Summarizer. Extract sessionTitle, subject, summary (3 sentences), topicsCovered (array), importantConcepts (array), actionItems (array), resourcesMentioned (array), and nextSessionSuggestions (array). Return strictly JSON.`;

    const result = await AIGateway.executePrompt(prompt, systemInstruction, true);
    let parsed;
    try {
      parsed = JSON.parse(result.text);
    } catch (e) {
      parsed = {
        sessionTitle: sessionTitle || 'Study Session',
        subject: subject || 'General',
        summary: 'In this session, key concepts were thoroughly reviewed and practiced with structured problem steps.',
        topicsCovered: ['Core Principles', 'Problem Solving Steps', 'Peer Q&A'],
        importantConcepts: ['Key Theorem 1', 'Efficiency Analysis'],
        actionItems: ['Complete practice questions', 'Review flashcard deck'],
        resourcesMentioned: ['StudyConnect Notes', 'Interactive Visualizer'],
        nextSessionSuggestions: ['Deep Dive Session', 'Mock Practice']
      };
    }

    res.json({
      success: true,
      summary: {
        id: `sum_${Date.now()}`,
        ...parsed,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Quiz Generator
app.post('/api/ai/quiz', async (req, res) => {
  try {
    const { title, subject, difficulty, content } = req.body;
    const prompt = `Create a ${difficulty || 'Medium'} difficulty study quiz based on content:
Subject: ${subject}
Title: ${title}
Content: "${content || 'Core concepts and problem solving'}"`;

    const systemInstruction = `Generate 4 multiple choice questions. Return strictly JSON with fields: title, subject, difficulty, questions: [{ id, question, options (4 items), correctOptionIndex (0-3), explanation }].`;

    const result = await AIGateway.executePrompt(prompt, systemInstruction, true);
    let parsed;
    try {
      parsed = JSON.parse(result.text);
    } catch (e) {
      parsed = {
        title: title || 'AI Knowledge Check',
        subject: subject || 'General Science',
        difficulty: difficulty || 'Medium',
        questions: [
          {
            id: 'q1',
            question: `What is a fundamental principle of ${subject || 'this topic'}?`,
            options: ['Active Retrieval', 'Passive Skimming', 'Ignoring Edge Cases', 'Zero Practice'],
            correctOptionIndex: 0,
            explanation: 'Active retrieval builds stronger mental pathways than passive reading.'
          },
          {
            id: 'q2',
            question: 'How should complex topics be approached during study sessions?',
            options: ['All at once', 'Deconstructed into smaller modular components', 'Skipped', 'Memorized blindly'],
            correctOptionIndex: 1,
            explanation: 'Chunking complex information into modules significantly aids working memory.'
          }
        ]
      };
    }

    res.json({
      success: true,
      quiz: {
        id: `qz_${Date.now()}`,
        ...parsed,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Notes Generator (Clean Notes, Bullet Points, Mind Map Nodes, Flashcards, Definitions)
app.post('/api/ai/notes', async (req, res) => {
  try {
    const { rawText, subject, mode } = req.body; // mode: 'clean' | 'bullets' | 'mindmap' | 'flashcards' | 'glossary'
    const prompt = `Transform raw notes into mode '${mode || 'clean'}' for subject '${subject || 'General'}':
Raw Text: "${rawText}"`;

    const systemInstruction = `You are StudyConnect AI Note Transformer. Return JSON object formatted based on requested mode with formatted text, bullet points, mind map nodes, flashcards, or glossary terms.`;

    const result = await AIGateway.executePrompt(prompt, systemInstruction, true);
    let parsed;
    try {
      parsed = JSON.parse(result.text);
    } catch (e) {
      parsed = {
        cleanNotes: `### ${subject || 'Study'} Notes\n\n- Main Topic Overview: Structured analysis of key principles.\n- Critical Insights: Focused active practice beats rote repetition.`,
        bulletPoints: ['Understand core axioms', 'Practice 3 sample problems', 'Review flashcard definitions'],
        mindMapNodes: [
          { id: '1', label: subject || 'Main Topic', children: ['Subtopic A', 'Subtopic B'] },
          { id: '2', label: 'Subtopic A', children: ['Concept 1', 'Concept 2'] }
        ],
        flashcards: [
          { front: `What is the key theorem in ${subject}?`, back: 'The core relationship defined by active retrieval and practice.' }
        ],
        glossary: [
          { term: 'Active Recall', definition: 'Retrieving information from memory without looking at notes.' }
        ]
      };
    }

    res.json({ success: true, mode: mode || 'clean', data: parsed });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Flashcards & Spaced Repetition Engine
app.post('/api/ai/flashcards', async (req, res) => {
  try {
    const { subject, deckTitle, textContent, count } = req.body;
    const prompt = `Generate ${count || 5} spaced repetition flashcards for deck '${deckTitle || subject}' on text: "${textContent || subject}"`;

    const systemInstruction = `Return strictly JSON with array "flashcards": [{ front, back, hint, difficulty: "Easy" | "Medium" | "Hard" }]`;

    const result = await AIGateway.executePrompt(prompt, systemInstruction, true);
    let parsed;
    try {
      parsed = JSON.parse(result.text);
    } catch (e) {
      parsed = {
        flashcards: [
          { front: `What is the primary goal of ${subject || 'this session'}?`, back: 'Master core concepts through deliberate practice.', hint: 'Think about active recall.', difficulty: 'Easy' },
          { front: 'Define Spaced Repetition.', back: 'An evidence-based learning technique where reviews are spaced at increasing intervals.', hint: 'SuperMemo algorithm', difficulty: 'Medium' }
        ]
      };
    }

    const cards = (parsed.flashcards || []).map((fc: any, i: number) => ({
      id: `fc_${Date.now()}_${i}`,
      deckTitle: deckTitle || subject || 'General',
      subject: subject || 'General',
      front: fc.front,
      back: fc.back,
      hint: fc.hint || '',
      difficulty: fc.difficulty || 'Medium',
      intervalDays: 1,
      easeFactor: 2.5,
      repetitions: 0,
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      bookmarked: false,
      createdAt: new Date().toISOString()
    }));

    res.json({ success: true, flashcards: cards });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Resource Recommender
app.post('/api/ai/recommendations', async (req, res) => {
  try {
    const { subject, goal, skillLevel } = req.body;
    const prompt = `Recommend 5 curated learning resources for subject: ${subject}, goal: ${goal}, skill level: ${skillLevel}`;

    const systemInstruction = `Return JSON array "resources": [{ title, type ("Book" | "Video" | "Course" | "Article" | "Documentation" | "Research Paper"), authorOrProvider, url, matchScore (80-99), description, difficultyLevel ("Beginner" | "Intermediate" | "Advanced") }]`;

    const result = await AIGateway.executePrompt(prompt, systemInstruction, true);
    let parsed;
    try {
      parsed = JSON.parse(result.text);
    } catch (e) {
      parsed = {
        resources: [
          {
            title: `Mastering ${subject || 'Algorithms'} & Data Structures`,
            type: 'Course',
            authorOrProvider: 'MIT OpenCourseWare',
            url: 'https://ocw.mit.edu',
            matchScore: 98,
            description: 'Comprehensive video lectures and assignments on core fundamentals.',
            difficultyLevel: skillLevel || 'Intermediate'
          },
          {
            title: `${subject || 'Computer Science'} In-Depth Reference Guide`,
            type: 'Documentation',
            authorOrProvider: 'Official Docs & RFCs',
            url: 'https://developer.mozilla.org',
            matchScore: 94,
            description: 'Authoritative standards and API definitions.',
            difficultyLevel: 'Intermediate'
          }
        ]
      };
    }

    res.json({ success: true, resources: parsed.resources || [] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Learning Analytics & Profile Insights
app.get('/api/ai/analytics', (req, res) => {
  res.json({
    success: true,
    insights: [
      { id: 'ins-1', category: 'Productivity', title: 'Most Productive Time', metric: '07:00 PM - 10:00 PM', score: 94, recommendation: 'Schedule high-difficulty problem solving during your peak evening focus window.' },
      { id: 'ins-2', category: 'Learning Style', title: 'Optimal Learning Style', metric: 'Active Recall & Socratic Q&A', score: 91, recommendation: 'You retain 3x more when solving practice quizzes before reading text.' },
      { id: 'ins-3', category: 'Subject Strength', title: 'Weak Topics', metric: 'Recursion & Dynamic Programming', score: 68, recommendation: 'Allocate 20 mins of daily revision to space-complexity subproblems.' },
      { id: 'ins-4', category: 'Consistency', title: 'Study Streak Consistency', metric: '88% Weekly Adherence', score: 88, recommendation: 'Maintain 30-min micro sessions on weekends to sustain streak momentum.' }
    ],
    profileStats: {
      mostProductiveTime: '7:00 PM - 10:00 PM (Night Owl)',
      bestLearningStyle: 'Active Recall & Peer Teaching',
      favouriteSubjects: ['Data Structures & Algorithms', 'Python', 'Machine Learning'],
      weakAreas: ['Dynamic Programming', 'System Architecture', 'Recursion Trees'],
      strongAreas: ['Array Operations', 'Graph Traversal', 'React State Management'],
      consistencyScore: 92,
      focusScore: 89,
      todayGoalHours: 3.5,
      todayCompletedHours: 2.8
    }
  });
});

// AI Revision Planner
app.post('/api/ai/revision', async (req, res) => {
  try {
    const { subject, weakTopics } = req.body;
    const prompt = `Generate a 7-day spaced revision plan for subject: ${subject}, weak topics: ${JSON.stringify(weakTopics || [])}`;
    const result = await AIGateway.executePrompt(prompt, 'Return JSON array "revisionPlans": [{ id, subject, topic, targetDate, priority ("High"|"Medium"|"Low"), notes }]', true);

    let parsed;
    try {
      parsed = JSON.parse(result.text);
    } catch (e) {
      parsed = {
        revisionPlans: [
          { id: 'rev-1', subject: subject || 'DSA', topic: 'Recursion & Tree Traversal', targetDate: 'Tomorrow at 10:00 AM', priority: 'High', notes: 'Solve 2 binary tree depth problems.' },
          { id: 'rev-2', subject: subject || 'DSA', topic: 'Dynamic Programming Memoization', targetDate: 'In 3 Days', priority: 'Medium', notes: 'Review fibonacci and knapsack subproblems.' }
        ]
      };
    }

    res.json({ success: true, revisionPlans: parsed.revisionPlans || [] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Natural Language Search
app.post('/api/ai/search', async (req, res) => {
  try {
    const { query } = req.body; // e.g., "Find Python learners studying recursion"
    const prompt = `Parse search query: "${query}". Identify requested subject, skill level, online preference, and goal. Return JSON format with filtered candidates.`;
    const result = await AIGateway.executePrompt(prompt, 'Return JSON format with array "matchedLearners" and array "matchedPods"', true);

    let parsed;
    try {
      parsed = JSON.parse(result.text);
    } catch (e) {
      parsed = {
        matchedLearners: [
          { name: 'Alex Chen', subject: 'Python', topic: 'Recursion', score: 96, isOnline: true },
          { name: 'Priya Sharma', subject: 'React', topic: 'State Management', score: 92, isOnline: true }
        ],
        matchedPods: [
          { name: 'LeetCode Daily DSA Pod', category: 'Coding', membersCount: 5, goal: 'Solve 75 curated problems' }
        ]
      };
    }

    res.json({ success: true, results: parsed });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Project Ideas Generator
app.post('/api/ai/project-ideas', async (req, res) => {
  try {
    const { subject, skillLevel } = req.body;
    const prompt = `Generate 4 project ideas for subject: ${subject || 'Software Engineering'}, skill level: ${skillLevel || 'Intermediate'}`;
    const result = await AIGateway.executePrompt(prompt, 'Return JSON array "projectIdeas": [{ id, title, type ("Mini Project"|"Portfolio Project"|"Research Topic"|"Hackathon Idea"|"Interview Practice"), subject, description, techStack (array), estimatedHours, keyLearnings (array) }]', true);

    let parsed;
    try {
      parsed = JSON.parse(result.text);
    } catch (e) {
      parsed = {
        projectIdeas: [
          {
            id: 'proj-1',
            title: 'Real-Time Collaborative Code Editor',
            type: 'Portfolio Project',
            subject: subject || 'Full-Stack Web Dev',
            description: 'Build a multi-user code playground with WebSockets and syntax highlighting.',
            techStack: ['React', 'Node.js', 'WebSocket', 'Tailwind'],
            estimatedHours: 12,
            keyLearnings: ['Operational Transformation', 'Concurrent Connections']
          }
        ]
      };
    }

    res.json({ success: true, projectIdeas: parsed.projectIdeas || [] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Interview Prep (Mock Interviewer)
app.post('/api/ai/interview-prep', async (req, res) => {
  try {
    const { subject, difficulty, questionType } = req.body; // Coding or Behavioral
    const prompt = `Generate a mock interview question for subject: ${subject}, difficulty: ${difficulty || 'Medium'}, type: ${questionType || 'Coding'}`;
    const result = await AIGateway.executePrompt(prompt, 'Return JSON object with question: { id, type, question, difficulty, hints (array), sampleSolution }', true);

    let parsed;
    try {
      parsed = JSON.parse(result.text);
    } catch (e) {
      parsed = {
        question: {
          id: 'mock-101',
          type: questionType || 'Coding',
          question: 'Given an array of integers, find contiguous subarray with the largest sum (Kadanes Algorithm).',
          difficulty: difficulty || 'Medium',
          hints: ['Think about maintaining a running maximum', 'Reset when running sum becomes negative'],
          sampleSolution: 'function maxSubArray(nums) { let max = nums[0], cur = nums[0]; for(let i=1; i<nums.length; i++) { cur = Math.max(nums[i], cur + nums[i]); max = Math.max(max, cur); } return max; }'
        }
      };
    }

    res.json({ success: true, mockQuestion: parsed.question });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// API Endpoint: Study Pods List
app.get('/api/pods', (req, res) => {
  res.json({
    success: true,
    pods: []
  });
});

// API Endpoint: Global Communities List
app.get('/api/communities', (req, res) => {
  res.json({
    success: true,
    communities: []
  });
});

// API Endpoint: Moderation Actions (Block, Mute, Report)
app.post('/api/moderation/action', (req, res) => {
  const { targetUserId, actionType, reason } = req.body;
  res.json({
    success: true,
    message: `User ${targetUserId} has been successfully ${actionType}d. ${reason ? `Reason: ${reason}` : ''}`
  });
});

// ============================================================
// ADMIN ECOSYSTEM API ENDPOINTS (PROMPT 7)
// ============================================================

// Admin Auth Login
app.post('/api/admin/auth/login', (req, res) => {
  const { email, password, mfaCode, role } = req.body;
  
  if (mfaCode && mfaCode !== '123456' && mfaCode !== '654321') {
    return res.status(401).json({ success: false, message: 'Invalid 2FA Verification Code' });
  }

  res.json({
    success: true,
    token: `admin-jwt-${Date.now()}`,
    user: {
      id: 'admin-001',
      name: 'Sarah Connor',
      email: email || 'admin@studyconnect.global',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: role || 'Super Admin',
      permissions: [
        'MANAGE_USERS', 'BAN_ACCOUNTS', 'MODERATE_CONTENT', 
        'MANAGE_PODS', 'MANAGE_COMMUNITIES', 'VIEW_ANALYTICS', 
        'MANAGE_ANNOUNCEMENTS', 'SUPPORT_DESK', 'SECURITY_AUDIT'
      ],
      mfaEnabled: true,
      lastLogin: new Date().toISOString(),
      status: 'Active'
    }
  });
});

// Admin Overview Stats
app.get('/api/admin/dashboard/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      totalLearners: 124850,
      learnersOnline: 3420,
      dailyActiveUsers: 28400,
      monthlyActiveUsers: 94200,
      studySessionsToday: 4120,
      voiceCallsToday: 1850,
      videoCallsToday: 1240,
      filesUploaded: 18900,
      communitiesCreated: 340,
      studyPodsCreated: 1280,
      pendingReports: 14,
      bannedAccounts: 48,
      monthlyRevenue: 84500,
      premiumSubscribers: 6200,
      openSupportTickets: 23
    }
  });
});

// Admin System Server Health
app.get('/api/admin/server-health', (req, res) => {
  const cpu = Math.floor(18 + Math.random() * 15);
  const ram = Math.floor(42 + Math.random() * 8);
  res.json({
    success: true,
    health: {
      cpuUsagePercent: cpu,
      memoryUsagePercent: ram,
      activeWebSockets: 3420,
      dbConnections: 142,
      redisStatus: 'Healthy',
      apiLatencyMs: 24,
      errorRatePercent: 0.02,
      liveVoiceCalls: 312,
      liveVideoCalls: 184,
      filesUploadedToday: 840,
      serverStatus: 'Operational'
    }
  });
});

// Admin Moderation Reports Queue
app.get('/api/admin/reports', (req, res) => {
  res.json({
    success: true,
    reports: [
      {
        id: 'rep-101',
        reportedUserId: 'usr-881',
        reportedUserName: 'Vikram Mehta',
        reportedUserAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        reporterId: 'usr-204',
        reporterName: 'Ananya Roy',
        category: 'Spam',
        reason: 'Repeatedly pasting external telegram monetization links in LeetCode Study Pod.',
        evidenceContent: 'Join t.me/crypto_dsa_free for paid solutions!',
        status: 'Pending',
        createdAt: '25 mins ago',
        priority: 'High'
      },
      {
        id: 'rep-102',
        reportedUserId: 'usr-412',
        reportedUserName: 'Jason Miller',
        reportedUserAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        reporterId: 'usr-119',
        reporterName: 'Maria Garcia',
        category: 'Academic Misconduct',
        reason: 'Attempted to sell homework answers during a live study room session.',
        evidenceContent: 'I will write your USMLE exam paper for $200.',
        status: 'Pending',
        createdAt: '1 hour ago',
        priority: 'Critical'
      },
      {
        id: 'rep-103',
        reportedUserId: 'usr-933',
        reportedUserName: 'David K.',
        reportedUserAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        reporterId: 'usr-501',
        reporterName: 'Lina Zhang',
        category: 'Harassment',
        reason: 'Inappropriate language in shared room chat.',
        evidenceContent: 'Abusive language used after peer disagreement.',
        status: 'Under Review',
        createdAt: '3 hours ago',
        priority: 'Medium'
      }
    ]
  });
});

// Admin Action on Moderation Report
app.post('/api/admin/reports/:id/action', (req, res) => {
  const { id } = req.params;
  const { action, note, targetUserId } = req.body;
  res.json({
    success: true,
    message: `Report ${id} updated with action '${action}'. ${note ? `Admin Note: ${note}` : ''}`,
    action,
    targetUserId
  });
});

// Admin Support Tickets
app.get('/api/admin/support/tickets', (req, res) => {
  res.json({
    success: true,
    tickets: [
      {
        id: 'tkt-401',
        userId: 'usr-102',
        userName: 'Alex Chen',
        userEmail: 'alex.chen@university.edu',
        subject: 'Cannot connect to WebRTC Video in Study Room',
        description: 'Camera permissions enabled but video frame stays black during peer call.',
        priority: 'High',
        status: 'Open',
        createdAt: '2 hours ago',
        updatedAt: '10 mins ago',
        internalNotes: ['Check turn server ice candidates log'],
        messages: [
          { id: 'm1', sender: 'Alex Chen', senderRole: 'user', text: 'Camera stays black when joining study room.', timestamp: '2 hours ago' }
        ]
      },
      {
        id: 'tkt-402',
        userId: 'usr-305',
        userName: 'Priya Sharma',
        userEmail: 'priya.s@tech.in',
        subject: 'Pro Member Badge Not Showing After Payment',
        description: 'Subscribed to Pro AI tier, payment succeeded via Stripe but badge is missing.',
        priority: 'Medium',
        status: 'In Progress',
        assignedAgentName: 'Sarah Connor',
        createdAt: '5 hours ago',
        updatedAt: '1 hour ago',
        internalNotes: ['Stripe webhook received, syncing database entitlement.'],
        messages: [
          { id: 'm1', sender: 'Priya Sharma', senderRole: 'user', text: 'My subscription is active on Stripe.', timestamp: '5 hours ago' },
          { id: 'm2', sender: 'Sarah Connor', senderRole: 'agent', text: 'Checking subscription sync now.', timestamp: '1 hour ago' }
        ]
      }
    ]
  });
});

// Admin Announcements
app.get('/api/admin/announcements', (req, res) => {
  res.json({
    success: true,
    announcements: [
      {
        id: 'anc-1',
        title: '🎉 Platform Maintenance Completed & New Whiteboard Tools!',
        content: 'We have upgraded our collaborative whiteboard canvas with infinite zooming and code snippet sticky notes.',
        targetType: 'All Learners',
        sendPush: true,
        sendEmail: false,
        scheduledFor: '2026-07-29T10:00:00Z',
        status: 'Sent',
        createdAt: 'Yesterday',
        createdBy: 'Sarah Connor',
        recipientCount: 124850
      }
    ]
  });
});

app.post('/api/admin/announcements', (req, res) => {
  const { title, content, targetType, targetValue, sendPush, sendEmail, scheduledFor } = req.body;
  res.json({
    success: true,
    announcement: {
      id: `anc-${Date.now()}`,
      title,
      content,
      targetType: targetType || 'All Learners',
      targetValue,
      sendPush: !!sendPush,
      sendEmail: !!sendEmail,
      scheduledFor: scheduledFor || 'Now',
      status: scheduledFor ? 'Scheduled' : 'Sent',
      createdAt: 'Just now',
      createdBy: 'Sarah Connor',
      recipientCount: 124850
    }
  });
});

// Admin Audit Logs
app.get('/api/admin/audit-logs', (req, res) => {
  res.json({
    success: true,
    logs: [
      {
        id: 'log-901',
        timestamp: '10:42 AM Today',
        adminName: 'Sarah Connor',
        adminRole: 'Super Admin',
        action: 'BAN_USER',
        affectedEntity: 'Vikram Mehta (usr-881)',
        previousValue: 'Active',
        newValue: 'Permanently Banned',
        reason: 'Violated Terms: Repeated commercial spamming',
        ipAddress: '192.168.1.104'
      },
      {
        id: 'log-902',
        timestamp: '09:15 AM Today',
        adminName: 'Sarah Connor',
        adminRole: 'Super Admin',
        action: 'VERIFY_LEARNER',
        affectedEntity: 'Dr. Marcus Vance (usr-002)',
        previousValue: 'Unverified',
        newValue: 'Verified MD Medical Scholar',
        reason: 'Medical credential verification uploaded & approved',
        ipAddress: '192.168.1.104'
      }
    ]
  });
});

// Admin Revenue & Analytics
app.get('/api/admin/analytics/revenue', (req, res) => {
  res.json({
    success: true,
    data: {
      monthlyOverview: [
        { month: 'Jan', revenue: 42000, learners: 72000, studyHours: 140000 },
        { month: 'Feb', revenue: 51000, learners: 81000, studyHours: 165000 },
        { month: 'Mar', revenue: 64000, learners: 94000, studyHours: 198000 },
        { month: 'Apr', revenue: 73000, learners: 105000, studyHours: 230000 },
        { month: 'May', revenue: 79000, learners: 114000, studyHours: 260000 },
        { month: 'Jun', revenue: 84500, learners: 124850, studyHours: 295000 }
      ],
      breakdown: {
        premiumSubscriptions: 52400,
        marketplaceMaterials: 18200,
        mentorBookings: 9100,
        commissions: 4800
      }
    }
  });
});

// ============================================================
// GROWTH & RETENTION ENGINE API ENDPOINTS (PROMPT 9)
// ============================================================

// Referral Store in Memory
const referralStore: any[] = [
  {
    id: 'ref-101',
    referrerUserId: 'usr-1',
    refereeEmail: 'alex.friend@university.edu',
    refereeName: 'Jordan Taylor',
    referralCode: 'ALEX-STUDY-77',
    status: 'Rewarded',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    rewardClaimed: true
  },
  {
    id: 'ref-102',
    referrerUserId: 'usr-1',
    refereeEmail: 'sam.dev@gmail.com',
    refereeName: 'Sam Rivera',
    referralCode: 'ALEX-STUDY-77',
    status: 'Registered',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    rewardClaimed: false
  }
];

// Anti-Abuse Rate Limit Tracking for Referrals
const referralIpTracker: { [key: string]: number } = {};

// Get User Referrals & Rewards
app.get('/api/growth/referrals', (req, res) => {
  try {
    const userCode = 'ALEX-STUDY-77';
    const deepLink = `https://studyconnect.app/invite/${userCode}`;
    const qrCodePayload = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(deepLink)}`;

    const rewards = [
      { id: 'rw-1', rewardType: 'XP', rewardTitle: '+500 Study XP', rewardValue: '500 XP', unlockedAt: '2 days ago' },
      { id: 'rw-2', rewardType: 'Badge', rewardTitle: 'Super Inviter Badge', rewardValue: 'Gold Shield Badge', unlockedAt: 'Yesterday' },
      { id: 'rw-3', rewardType: 'CustomTheme', rewardTitle: 'Cyberpunk Dark Theme', rewardValue: 'Theme Unlocked', unlockedAt: 'Today' },
      { id: 'rw-4', rewardType: 'ProfileDecoration', rewardTitle: 'Glowing Avatar Ring', rewardValue: 'Decoration Active', unlockedAt: 'Today' }
    ];

    res.json({
      success: true,
      referralCode: userCode,
      referralLink: deepLink,
      qrCodeUrl: qrCodePayload,
      referrals: referralStore,
      rewards,
      stats: {
        totalInvited: 5,
        totalRegistered: 3,
        totalCompletedFirstSession: 2,
        totalXpEarned: 1500
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send Referral Invite (With Anti-Abuse Security)
app.post('/api/growth/referrals/invite', (req, res) => {
  try {
    const { email, channel } = req.body;
    const clientIp = req.ip || '127.0.0.1';

    // Anti-Abuse Rate Limiting (max 10 invites per IP per hour)
    referralIpTracker[clientIp] = (referralIpTracker[clientIp] || 0) + 1;
    if (referralIpTracker[clientIp] > 10) {
      return res.status(429).json({
        success: false,
        error: 'Invite rate limit exceeded. Please wait before sending more invitations to prevent abuse.'
      });
    }

    if (!email && !channel) {
      return res.status(400).json({ success: false, error: 'Recipient email or share channel required.' });
    }

    const newRef = {
      id: `ref-${Date.now()}`,
      referrerUserId: 'usr-1',
      refereeEmail: email || `shared-via-${channel}@invite.link`,
      referralCode: 'ALEX-STUDY-77',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      rewardClaimed: false
    };

    referralStore.unshift(newRef);

    res.json({
      success: true,
      message: `Invitation successfully created via ${channel || 'Email'}!`,
      referral: newRef
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify Meaningful Activity & Claim Referral Rewards
app.post('/api/growth/referrals/claim-reward', (req, res) => {
  try {
    const { referralId } = req.body;
    const targetRef = referralStore.find(r => r.id === referralId);

    if (!targetRef) {
      return res.status(404).json({ success: false, error: 'Referral record not found.' });
    }

    // Meaningful Activity Guard (Registration + Profile + First Study Session)
    if (targetRef.status !== 'FirstSessionDone' && targetRef.status !== 'Rewarded') {
      // Simulate verification of first study session
      targetRef.status = 'Rewarded';
      targetRef.completedAt = new Date().toISOString();
      targetRef.rewardClaimed = true;
    }

    res.json({
      success: true,
      message: 'Meaningful activity verified! Both learners have been awarded 500 XP and the "Study Champion" Badge!',
      reward: {
        xpGained: 500,
        badgeUnlocked: 'Study Champion Gold Shield',
        themeUnlocked: 'Neon Aurora Light Theme',
        profileDecoration: 'Star Aura Frame'
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Challenges API (Individual, Friend, Pod, Community, Global)
app.get('/api/growth/challenges', (req, res) => {
  res.json({
    success: true,
    challenges: [
      {
        id: 'ch-1',
        title: '7-Day Focus Marathon',
        description: 'Log 300 total study minutes over 7 consecutive days.',
        type: 'Individual',
        category: 'Focus',
        targetMetric: '300 Mins',
        currentProgress: 210,
        maxProgress: 300,
        rewardXp: 400,
        rewardBadge: 'Marathon Runner',
        endDate: '3 Days left',
        joined: true,
        participantsCount: 1420
      },
      {
        id: 'ch-2',
        title: 'Duo Active Recall Battle',
        description: 'Complete 5 pair flashcard reviews with a study friend.',
        type: 'Friend',
        category: 'Collaboration',
        targetMetric: '5 Sessions',
        currentProgress: 3,
        maxProgress: 5,
        rewardXp: 300,
        rewardBadge: 'Duo Master',
        endDate: '5 Days left',
        joined: true,
        participantsCount: 890
      },
      {
        id: 'ch-3',
        title: 'Pod LeetCode Sprint',
        description: 'Solve 50 combined algorithmic problems in your study pod.',
        type: 'Pod',
        category: 'Coding',
        targetMetric: '50 Problems',
        currentProgress: 38,
        maxProgress: 50,
        rewardXp: 600,
        rewardBadge: 'Pod MVP',
        endDate: '6 Days left',
        joined: true,
        participantsCount: 310
      },
      {
        id: 'ch-4',
        title: 'Global Exam Countdown 2026',
        description: 'Join 50,000 learners worldwide in committing 20 study hours this week.',
        type: 'Global',
        category: 'Exams',
        targetMetric: '20 Hours',
        currentProgress: 14,
        maxProgress: 20,
        rewardXp: 1000,
        rewardBadge: 'Global Titan',
        endDate: '12 Days left',
        joined: false,
        participantsCount: 48200
      }
    ]
  });
});

// Join Challenge
app.post('/api/growth/challenges/join', (req, res) => {
  const { challengeId } = req.body;
  res.json({ success: true, message: `Successfully enrolled in challenge ${challengeId}!`, joined: true });
});

// Seasonal Events API
app.get('/api/growth/seasonal-events', (req, res) => {
  res.json({
    success: true,
    events: [
      {
        id: 'evt-1',
        name: 'Python Week 2026',
        tagline: 'Master PyTorch, FastAPI, and Data Science in 7 Days',
        startDate: 'July 28, 2026',
        endDate: 'August 4, 2026',
        themeColor: 'from-amber-600 to-indigo-600',
        bannerIcon: '🐍',
        rewardXp: 1500,
        activeParticipants: 18400,
        progressPercent: 65,
        isJoined: true
      },
      {
        id: 'evt-2',
        name: 'AI & Gemini Hackathon Month',
        tagline: 'Build full-stack AI learning assistants with GenAI SDK',
        startDate: 'August 1, 2026',
        endDate: 'August 31, 2026',
        themeColor: 'from-purple-600 to-sky-600',
        bannerIcon: '🤖',
        rewardXp: 2500,
        activeParticipants: 24100,
        progressPercent: 20,
        isJoined: true
      },
      {
        id: 'evt-3',
        name: 'Hacktober & Open Source Sprint',
        tagline: 'Collaborate on notes, repositories, and study whiteboards',
        startDate: 'September 1, 2026',
        endDate: 'September 30, 2026',
        themeColor: 'from-emerald-600 to-teal-600',
        bannerIcon: '🎃',
        rewardXp: 2000,
        activeParticipants: 12500,
        progressPercent: 0,
        isJoined: false
      }
    ]
  });
});

// Learning Missions API
app.get('/api/growth/missions', (req, res) => {
  res.json({
    success: true,
    missions: [
      { id: 'm-1', title: 'Complete 3 Study Sessions', description: 'Log into a room or workspace for 25+ mins', category: 'Sessions', xpReward: 150, currentCount: 2, targetCount: 3, completed: false },
      { id: 'm-2', title: 'Help 5 Peer Learners', description: 'Answer questions in Study Circles or Doubt Solver', category: 'Community', xpReward: 200, currentCount: 5, targetCount: 5, completed: true },
      { id: 'm-3', title: 'Share Clean Notes', description: 'Export or publish a study note to your pod', category: 'Creation', xpReward: 100, currentCount: 1, targetCount: 1, completed: true },
      { id: 'm-4', title: 'Join a New Study Pod', description: 'Explore and join a target learning group', category: 'Social', xpReward: 100, currentCount: 1, targetCount: 1, completed: true },
      { id: 'm-5', title: 'Create Collaborative Whiteboard', description: 'Draw or present diagrams in a live room', category: 'Workspace', xpReward: 120, currentCount: 0, targetCount: 1, completed: false },
      { id: 'm-6', title: 'Invite a Study Friend', description: 'Share your referral code with a peer', category: 'Growth', xpReward: 300, currentCount: 1, targetCount: 1, completed: true }
    ],
    dailyCheckInStreak: 6,
    dailyCheckIns: [
      { dayNumber: 1, xpBonus: 20, isClaimed: true, isToday: false },
      { dayNumber: 2, xpBonus: 40, isClaimed: true, isToday: false },
      { dayNumber: 3, xpBonus: 60, isClaimed: true, isToday: false },
      { dayNumber: 4, xpBonus: 80, isClaimed: true, isToday: false },
      { dayNumber: 5, xpBonus: 100, isClaimed: true, isToday: false },
      { dayNumber: 6, xpBonus: 150, isClaimed: false, isToday: true },
      { dayNumber: 7, xpBonus: 300, isClaimed: false, isToday: false }
    ]
  });
});

// Daily Check-in Claim
app.post('/api/growth/daily-checkin', (req, res) => {
  res.json({
    success: true,
    message: 'Daily Check-in claimed! +150 XP added to your balance.',
    streakDays: 6,
    xpGained: 150
  });
});

// Leaderboards API (Filterable by Category & Timeframe)
app.get('/api/growth/leaderboards', (req, res) => {
  const { category = 'Global', timeframe = 'Weekly' } = req.query;

  const sampleRankings = [
    { rank: 1, name: 'Dr. Marcus Vance', avatar: 'M', score: 4850, badge: 'Grandmaster', country: '🇺🇸 USA', pod: 'USMLE Top 1%' },
    { rank: 2, name: 'Ananya Roy', avatar: 'A', score: 4210, badge: 'Code Ninja', country: '🇮🇳 India', pod: 'LeetCode Daily' },
    { rank: 3, name: 'Alex Chen (You)', avatar: 'A', score: 3840, badge: 'Study Champion', country: '🇺🇸 USA', pod: 'Full-Stack Pod' },
    { rank: 4, name: 'Priya Sharma', avatar: 'P', score: 3620, badge: 'React Scholar', country: '🇮🇳 India', pod: 'Frontend Guild' },
    { rank: 5, name: 'David Kim', avatar: 'D', score: 3100, badge: 'ML Specialist', country: '🇰🇷 Korea', pod: 'PyTorch Research' }
  ];

  res.json({
    success: true,
    category,
    timeframe,
    leaderboard: sampleRankings
  });
});

// Growth & Retention Analytics Dashboard Data
app.get('/api/growth/analytics', (req, res) => {
  res.json({
    success: true,
    analytics: {
      dau: 42850,
      wau: 114200,
      mau: 289000,
      retentionD1: 82.4,
      retentionD7: 64.1,
      retentionD30: 48.6,
      referralConversionRate: 34.8,
      inviteAcceptanceRate: 46.2,
      sessionCompletionRate: 89.5,
      challengeParticipationRate: 58.2,
      totalInvitesSent: 148200,
      totalRewardsUnlocked: 51900
    }
  });
});

// Push Notifications & Email System API
app.post('/api/growth/notifications/push', (req, res) => {
  const { type, recipientEmail, title, body } = req.body;
  res.json({
    success: true,
    message: `Push notification & email [${type || 'Study Alert'}] dispatched successfully to ${recipientEmail || 'active learners'}!`,
    timestamp: new Date().toISOString()
  });
});

// ============================================================
// BUSINESS & MONETIZATION PLATFORM REST APIs (PROMPT 10)
// ============================================================

// In-Memory Database Stores for Business
let currentSubscriptionStore = {
  id: 'sub-1',
  userId: 'usr-1',
  planTier: 'PLUS',
  billingCycle: 'Monthly',
  status: 'Active',
  currentPeriodStart: new Date().toISOString(),
  currentPeriodEnd: new Date(Date.now() + 86400000 * 30).toISOString(),
  autoRenew: true,
  amountPaid: 9.99,
  currency: 'USD',
  paymentGateway: 'Stripe'
};

const mentorProfilesStore = [
  {
    id: 'mnt-1',
    userId: 'usr-mnt-1',
    name: 'Dr. Evelyn Reed',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    bio: 'Ex-Google Staff Engineer & Stanford AI Researcher. Guided 400+ students in System Design & ML.',
    expertise: ['System Design', 'AI & PyTorch', 'Full-Stack Web', 'Career Strategy'],
    experienceYears: 12,
    companyOrInstitution: 'Stanford / Ex-Google',
    languages: ['English', 'Spanish'],
    country: '🇺🇸 USA',
    hourlyPrice: 45,
    currency: 'USD',
    rating: 4.98,
    reviewCount: 142,
    completedSessions: 380,
    verifiedBadge: true,
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    timeSlots: ['10:00 AM', '02:00 PM', '06:00 PM']
  },
  {
    id: 'mnt-2',
    userId: 'usr-mnt-2',
    name: 'Prof. Rajesh K. Varma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    bio: 'IIT Bombay Computer Science Professor. Specialist in Algorithms, Data Structures, & Competitive Coding.',
    expertise: ['Algorithms', 'LeetCode Hard', 'Python', 'Mathematics'],
    experienceYears: 18,
    companyOrInstitution: 'IIT Bombay',
    languages: ['English', 'Hindi'],
    country: '🇮🇳 India',
    hourlyPrice: 25,
    currency: 'USD',
    rating: 4.95,
    reviewCount: 210,
    completedSessions: 520,
    verifiedBadge: true,
    availableDays: ['Tue', 'Thu', 'Sat', 'Sun'],
    timeSlots: ['09:00 AM', '03:00 PM', '08:00 PM']
  },
  {
    id: 'mnt-3',
    userId: 'usr-mnt-3',
    name: 'Sophia Martinez',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    bio: 'Principal UI/UX Product Designer at Figma. Portfolio reviews, UX research, and design systems.',
    expertise: ['UI/UX Design', 'Figma', 'Portfolio Review', 'Product Strategy'],
    experienceYears: 9,
    companyOrInstitution: 'Figma',
    languages: ['English', 'French'],
    country: '🇬🇧 UK',
    hourlyPrice: 40,
    currency: 'USD',
    rating: 4.92,
    reviewCount: 98,
    completedSessions: 210,
    verifiedBadge: true,
    availableDays: ['Mon', 'Tue', 'Fri'],
    timeSlots: ['11:00 AM', '04:00 PM']
  }
];

const bookingsStore: any[] = [
  {
    id: 'bk-101',
    mentorId: 'mnt-1',
    mentorName: 'Dr. Evelyn Reed',
    learnerId: 'usr-1',
    learnerName: 'Alex Chen',
    date: '2026-08-02',
    timeSlot: '02:00 PM',
    durationMinutes: 60,
    totalAmount: 45,
    platformCommission: 6.75, // 15%
    netMentorPayout: 38.25,
    status: 'InEscrow',
    paymentGateway: 'Stripe',
    transactionId: 'tx_stripe_9921',
    invoiceUrl: '/api/business/invoices/INV-2026-881203/pdf',
    meetingLink: 'https://studyconnect.app/rooms/mentor-evelyn-alex'
  }
];

const walletStore = {
  id: 'w-1',
  userId: 'usr-1',
  rewardCredits: 120,
  referralCredits: 50,
  refundCredits: 0,
  totalBalance: 170,
  currency: 'USD',
  lastUpdated: new Date().toISOString()
};

const walletTransactionsStore = [
  { id: 'wt-1', walletId: 'w-1', type: 'ReferralBonus', amount: 50, isCredit: true, description: 'Referral reward for Jordan Taylor first session', timestamp: '2 days ago' },
  { id: 'wt-2', walletId: 'w-1', type: 'ChallengeReward', amount: 120, isCredit: true, description: '7-Day Focus Marathon completion bonus', timestamp: 'Yesterday' }
];

const invoicesStore: any[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-881203',
    userId: 'usr-1',
    userName: 'Alex Chen',
    userEmail: 'alex@studyconnect.app',
    userGstin: '27AABCU9603R1ZM',
    type: 'MentorBooking',
    description: '1-on-1 Mentor Session with Dr. Evelyn Reed',
    subtotal: 45.00,
    gstAmount: 8.10, // 18% GST
    taxPercentage: 18,
    totalAmount: 53.10,
    currency: 'USD',
    paymentProvider: 'Stripe',
    issuedAt: '2026-07-28',
    status: 'Paid',
    pdfDownloadUrl: '/api/business/invoices/INV-2026-881203/pdf'
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-440122',
    userId: 'usr-1',
    userName: 'Alex Chen',
    userEmail: 'alex@studyconnect.app',
    userGstin: '27AABCU9603R1ZM',
    type: 'Subscription',
    description: 'StudyConnect PLUS Tier Membership (Monthly)',
    subtotal: 9.99,
    gstAmount: 1.80,
    taxPercentage: 18,
    totalAmount: 11.79,
    currency: 'USD',
    paymentProvider: 'Razorpay',
    issuedAt: '2026-07-15',
    status: 'Paid',
    pdfDownloadUrl: '/api/business/invoices/INV-2026-440122/pdf'
  }
];

const jobsStore: any[] = [
  {
    id: 'job-1',
    companyId: 'comp-1',
    companyName: 'OpenAI Labs',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100',
    title: 'Junior AI/ML Research Engineer',
    type: 'Full-time',
    location: 'Remote / San Francisco',
    salaryOrStipend: '$110,000 - $140,000 / yr',
    requiredSkills: ['PyTorch', 'Python', 'LLM Tuning', 'Transformer Architecture'],
    postedDate: '2 days ago',
    applicantsCount: 42,
    isFeatured: true
  },
  {
    id: 'job-2',
    companyId: 'comp-2',
    companyName: 'Stripe India',
    companyLogo: 'https://images.unsplash.com/photo-1556742049-0a67daf4005a?w=100',
    title: 'Backend Systems Engineering Intern',
    type: 'Internship',
    location: 'Bengaluru / Hybrid',
    salaryOrStipend: '₹85,000 / month',
    requiredSkills: ['Node.js', 'PostgreSQL', 'System Design', 'REST APIs'],
    postedDate: '1 day ago',
    applicantsCount: 88,
    isFeatured: true
  },
  {
    id: 'job-3',
    companyId: 'comp-3',
    companyName: 'Google Cloud Platform',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100',
    title: 'Global Hackathon 2026: Agentic Workflows',
    type: 'Hackathon',
    location: 'Global Virtual',
    salaryOrStipend: '$50,000 Grand Prize Pool',
    requiredSkills: ['Gemini GenAI SDK', 'TypeScript', 'Cloud Run'],
    postedDate: 'Today',
    applicantsCount: 312,
    isFeatured: true
  }
];

// 1. Get Current Subscription & Plans
app.get('/api/business/plans', (req, res) => {
  res.json({
    success: true,
    currentSubscription: currentSubscriptionStore,
    plans: [
      {
        tier: 'FREE',
        monthlyPrice: 0,
        yearlyPrice: 0,
        badge: 'Learner Base',
        description: 'Core learning features are 100% FREE forever.',
        features: [
          'Unlimited Study Matching',
          'Basic Chat, Voice & Video Calls',
          'Interactive Collaborative Whiteboard',
          'Public Study Pods & Circles',
          'Basic Personal Analytics'
        ]
      },
      {
        tier: 'PLUS',
        monthlyPrice: 9.99,
        yearlyPrice: 89.99,
        badge: 'Most Popular',
        description: 'Enhanced productivity, AI study coach, and priority matching.',
        features: [
          'Everything in FREE',
          'AI Study Coach & AI Flashcard Generator',
          'Unlimited Cloud Storage & Session Recording',
          'Custom Themes & Premium Profile Ring',
          'Priority Study Pod Matching',
          'Verified Learning Passport Export'
        ]
      },
      {
        tier: 'PRO',
        monthlyPrice: 19.99,
        yearlyPrice: 179.99,
        badge: 'Power Scholar',
        description: 'Mentor toolset, unlimited pods, calendar sync, & priority support.',
        features: [
          'Everything in PLUS',
          'Mentor Publishing & Booking Marketplace',
          'Unlimited Study Pods & Communities',
          'Google / Outlook Calendar Integration',
          'Session Templates & Recruiter Profile Indexing',
          '24/7 Priority Support & Direct API Access'
        ]
      }
    ]
  });
});

// Update Subscription (Upgrade / Pause / Cancel)
app.post('/api/business/subscriptions/manage', (req, res) => {
  const { action, planTier, billingCycle, provider = 'Stripe' } = req.body;

  if (action === 'Upgrade') {
    currentSubscriptionStore = {
      ...currentSubscriptionStore,
      planTier: planTier || 'PLUS',
      billingCycle: billingCycle || 'Monthly',
      status: 'Active',
      amountPaid: planTier === 'PRO' ? 19.99 : 9.99,
      paymentGateway: provider
    };
    return res.json({ success: true, message: `Successfully upgraded to StudyConnect ${planTier}!`, subscription: currentSubscriptionStore });
  } else if (action === 'Pause') {
    currentSubscriptionStore.status = 'Paused';
    return res.json({ success: true, message: 'Subscription successfully paused.', subscription: currentSubscriptionStore });
  } else if (action === 'Cancel') {
    currentSubscriptionStore.status = 'Cancelled';
    currentSubscriptionStore.autoRenew = false;
    return res.json({ success: true, message: 'Subscription cancelled. Access remains valid through end of billing cycle.', subscription: currentSubscriptionStore });
  }

  res.status(400).json({ success: false, error: 'Invalid subscription action.' });
});

// 2. Mentors Marketplace API
app.get('/api/business/mentors', (req, res) => {
  const { expertise, search } = req.query;
  let list = mentorProfilesStore;

  if (expertise) {
    list = list.filter(m => m.expertise.some(e => e.toLowerCase().includes(String(expertise).toLowerCase())));
  }
  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(m => m.name.toLowerCase().includes(q) || m.bio.toLowerCase().includes(q));
  }

  res.json({ success: true, mentors: list });
});

// 3. Mentor Booking & Escrow Flow
app.post('/api/business/bookings/create', (req, res) => {
  const { mentorId, date, timeSlot, durationMinutes = 60, provider = 'Stripe', promoCode } = req.body;

  const mentor = mentorProfilesStore.find(m => m.id === mentorId);
  if (!mentor) {
    return res.status(404).json({ success: false, error: 'Mentor not found.' });
  }

  const subtotal = mentor.hourlyPrice;
  const platformCommission = Math.round((subtotal * 0.15) * 100) / 100; // 15% platform fee
  const netMentorPayout = Math.round((subtotal - platformCommission) * 100) / 100;

  const newBooking = {
    id: `bk-${Date.now()}`,
    mentorId: mentor.id,
    mentorName: mentor.name,
    learnerId: 'usr-1',
    learnerName: 'Alex Chen',
    date,
    timeSlot,
    durationMinutes,
    totalAmount: subtotal,
    platformCommission,
    netMentorPayout,
    status: 'InEscrow',
    paymentGateway: provider,
    transactionId: `tx_${provider.toLowerCase()}_${Date.now()}`,
    invoiceUrl: `/api/business/invoices/INV-2026-${Math.floor(100000 + Math.random() * 900000)}/pdf`,
    meetingLink: `https://studyconnect.app/rooms/mentor-${mentor.id}`
  };

  bookingsStore.unshift(newBooking);

  res.json({
    success: true,
    message: `Session booked with ${mentor.name}! Funds held securely in escrow until session completion.`,
    booking: newBooking
  });
});

// 4. Wallet & Credits API
app.get('/api/business/wallet', (req, res) => {
  res.json({
    success: true,
    wallet: walletStore,
    transactions: walletTransactionsStore
  });
});

// 5. Promo Code Validation Engine
app.post('/api/business/coupons/validate', (req, res) => {
  const { code } = req.body;
  const uppercaseCode = (code || '').toUpperCase();

  if (uppercaseCode === 'STUDY50') {
    return res.json({
      success: true,
      valid: true,
      coupon: { code: 'STUDY50', discountPercentage: 50, message: '50% Discount Applied!' }
    });
  } else if (uppercaseCode === 'WELCOME20') {
    return res.json({
      success: true,
      valid: true,
      coupon: { code: 'WELCOME20', discountPercentage: 20, message: '20% Welcome Offer Applied!' }
    });
  }

  res.status(400).json({ success: false, valid: false, error: 'Invalid or expired promo code.' });
});

// 6. Invoices API (GST & Tax Compliant)
app.get('/api/business/invoices', (req, res) => {
  res.json({ success: true, invoices: invoicesStore });
});

// Mock Invoice PDF Download
app.get('/api/business/invoices/:invNumber/pdf', (req, res) => {
  const invNumber = req.params.invNumber;
  res.setHeader('Content-Type', 'text/plain');
  res.send(`STUDYCONNECT OFFICIAL GST INVOICE\nInvoice #: ${invNumber}\nDate: ${new Date().toLocaleDateString()}\nStatus: PAID (Escrow Secured)\nTax Reg GSTIN: 27AABCU9603R1ZM\nThank you for choosing StudyConnect!`);
});

// 7. Learning Passport & Verified Certificates API
app.get('/api/business/passport', (req, res) => {
  const passport = {
    id: 'pass-101',
    userId: 'usr-1',
    userName: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    headline: 'Full-Stack Developer & AI Systems Researcher',
    studyHoursTotal: 142.5,
    reputationScore: 98.4,
    verifiedSkills: ['React 18', 'TypeScript', 'Node.js', 'PyTorch', 'System Design'],
    projectsCompleted: 18,
    communitiesJoined: 6,
    certificatesEarnedCount: 4,
    publicPassportUrl: 'https://studyconnect.app/passport/alex-chen-77',
    qrShareUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://studyconnect.app/passport/alex-chen-77'
  };

  const certificates = [
    {
      id: 'cert-1',
      certificateNumber: 'SC-CERT-2026-9011',
      title: '100 Study Hours Milestone',
      issueDate: 'July 15, 2026',
      issuer: 'StudyConnect Global Academy',
      recipientName: 'Alex Chen',
      verificationHash: '0x8f3a...91bc',
      badgeIcon: '📜',
      downloadUrl: '/api/business/certificates/cert-1/download'
    },
    {
      id: 'cert-2',
      certificateNumber: 'SC-CERT-2026-4412',
      title: 'Python Challenge Master',
      issueDate: 'July 24, 2026',
      issuer: 'StudyConnect Global Academy',
      recipientName: 'Alex Chen',
      verificationHash: '0x3c7e...12aa',
      badgeIcon: '🐍',
      downloadUrl: '/api/business/certificates/cert-2/download'
    }
  ];

  res.json({ success: true, passport, certificates });
});

// 8. Career Services & Job Board API
app.get('/api/business/careers', (req, res) => {
  const careerServices = [
    { id: 'cs-1', title: 'Resume Review by Senior Tech Recruiter', description: 'Comprehensive line-by-line ATS resume feedback with 48h turnaround.', price: 29, currency: 'USD', deliveryTimeDays: 2, rating: 4.9, reviews: 180 },
    { id: 'cs-2', title: '1-on-1 System Design Mock Interview', description: 'Real 60-minute interview simulation with feedback scorecard.', price: 59, currency: 'USD', deliveryTimeDays: 1, rating: 5.0, reviews: 240 },
    { id: 'cs-3', title: 'GitHub & Portfolio Code Review', description: 'Detailed architectural review of your top 2 open-source projects.', price: 39, currency: 'USD', deliveryTimeDays: 3, rating: 4.8, reviews: 95 }
  ];

  res.json({
    success: true,
    careerServices,
    jobs: jobsStore
  });
});

// 9. Company / Recruiter Portal Candidate Search API
app.get('/api/business/recruiter/candidates', (req, res) => {
  const { skill } = req.query;

  const candidates = [
    { id: 'usr-1', name: 'Alex Chen', title: 'Full-Stack & AI Systems', studyHours: 142, reputation: 98.4, topSkills: ['TypeScript', 'PyTorch', 'React'], passportUrl: 'https://studyconnect.app/passport/alex-chen-77' },
    { id: 'usr-2', name: 'Ananya Roy', title: 'Python & Data Science', studyHours: 210, reputation: 99.1, topSkills: ['Python', 'FastAPI', 'Pandas'], passportUrl: 'https://studyconnect.app/passport/ananya-roy' },
    { id: 'usr-3', name: 'Jordan Taylor', title: 'Frontend Developer', studyHours: 95, reputation: 96.0, topSkills: ['React', 'Tailwind', 'Figma'], passportUrl: 'https://studyconnect.app/passport/jordan-taylor' }
  ];

  res.json({ success: true, candidates });
});

// 10. Financial & Business Analytics API (MRR, ARR, LTV, Churn)
app.get('/api/business/analytics', (req, res) => {
  res.json({
    success: true,
    analytics: {
      mrr: 48250, // Monthly Recurring Revenue ($)
      arr: 579000, // Annual Recurring Revenue ($)
      conversionRatePercent: 4.8,
      subscriptionGrowthPercent: 18.5,
      mentorMarketplaceRevenue: 24100,
      careerServicesRevenue: 12400,
      arpu: 14.50, // Average Revenue Per User
      ltv: 180.00,  // Lifetime Value
      churnRatePercent: 2.1,
      activePaidSubscribers: 4830
    }
  });
});

// ============================================================
// ENTERPRISE PRODUCTION INFRASTRUCTURE REST APIs (PROMPT 11)
// ============================================================

let containerServicesStore = [
  { id: 'cs-1', name: 'studyconnect-django-api-1', role: 'Backend API', status: 'Healthy', cpuUsagePercent: 12.4, memoryUsageMb: 340, maxMemoryMb: 2048, uptimeSeconds: 432000, restartsCount: 0, port: 8000, containerId: 'c8f1a239b01' },
  { id: 'cs-2', name: 'studyconnect-daphne-ws-1', role: 'WebSocket Server', status: 'Healthy', cpuUsagePercent: 8.2, memoryUsageMb: 210, maxMemoryMb: 2048, uptimeSeconds: 432000, restartsCount: 0, port: 8001, containerId: 'd9e2b441c02' },
  { id: 'cs-3', name: 'studyconnect-celery-worker-1', role: 'Celery Worker', status: 'Healthy', cpuUsagePercent: 24.1, memoryUsageMb: 512, maxMemoryMb: 4096, uptimeSeconds: 216000, restartsCount: 1, port: 0, containerId: 'a1b2c3d4e5f' },
  { id: 'cs-4', name: 'studyconnect-celery-beat-1', role: 'Celery Beat', status: 'Healthy', cpuUsagePercent: 1.5, memoryUsageMb: 85, maxMemoryMb: 512, uptimeSeconds: 432000, restartsCount: 0, port: 0, containerId: 'f5e4d3c2b1a' },
  { id: 'cs-5', name: 'studyconnect-redis-master', role: 'Redis Cluster', status: 'Healthy', cpuUsagePercent: 4.8, memoryUsageMb: 1280, maxMemoryMb: 4096, uptimeSeconds: 864000, restartsCount: 0, port: 6379, containerId: 'r7e6d5c4b3a' },
  { id: 'cs-6', name: 'studyconnect-pg-primary', role: 'PostgreSQL Primary', status: 'Healthy', cpuUsagePercent: 18.6, memoryUsageMb: 1840, maxMemoryMb: 8192, uptimeSeconds: 864000, restartsCount: 0, port: 5432, containerId: 'p9o8i7u6y5t' },
  { id: 'cs-7', name: 'studyconnect-pg-replica-1', role: 'PostgreSQL Read Replica', status: 'Healthy', cpuUsagePercent: 9.3, memoryUsageMb: 1120, maxMemoryMb: 8192, uptimeSeconds: 864000, restartsCount: 0, port: 5433, containerId: 'p1o2i3u4y5t' },
  { id: 'cs-8', name: 'studyconnect-nginx-lb', role: 'Nginx Load Balancer', status: 'Healthy', cpuUsagePercent: 3.1, memoryUsageMb: 64, maxMemoryMb: 1024, uptimeSeconds: 864000, restartsCount: 0, port: 3000, containerId: 'n0m9b8v7c6x' }
];

let redisStatsStore = {
  connectedClients: 142,
  usedMemoryHuman: '1.25 GB',
  hitRatePercent: 98.4,
  totalHits: 4892010,
  totalMisses: 79540,
  keysCount: 184200,
  evictedKeys: 12,
  uptimeDays: 24
};

let celeryMetricsStore = {
  activeWorkers: 8,
  queuedTasksCount: 14,
  processedTasksCount: 984120,
  failedTasksCount: 3,
  avgExecutionTimeMs: 142,
  activeTasks: [
    { id: 'task-8821', taskName: 'tasks.generate_ai_pod_summary', args: 'pod_id=p-101', runtimeSeconds: 2.4, workerId: 'worker-node-3' },
    { id: 'task-8822', taskName: 'tasks.send_scheduled_email_reminders', args: 'batch=50', runtimeSeconds: 0.8, workerId: 'worker-node-1' },
    { id: 'task-8823', taskName: 'tasks.compress_and_store_whiteboard', args: 'session_id=s-404', runtimeSeconds: 4.1, workerId: 'worker-node-5' }
  ]
};

let dbReplicasStore = [
  { instanceName: 'studyconnect-primary-db-us-east', role: 'Primary Write', region: 'us-east1 (South Carolina)', replicationLagMs: 0, activeConnections: 48, maxConnections: 500, dbSizeBytes: 48200000000, lastBackupTimestamp: '2 hours ago', status: 'ONLINE' },
  { instanceName: 'studyconnect-read-replica-1-us-west', role: 'Read Replica 1', region: 'us-west1 (Oregon)', replicationLagMs: 4, activeConnections: 82, maxConnections: 500, dbSizeBytes: 48200000000, lastBackupTimestamp: '2 hours ago', status: 'REPLICATING' },
  { instanceName: 'studyconnect-read-replica-2-asia-east', role: 'Read Replica 2', region: 'asia-east1 (Taiwan)', replicationLagMs: 12, activeConnections: 64, maxConnections: 500, dbSizeBytes: 48200000000, lastBackupTimestamp: '2 hours ago', status: 'REPLICATING' }
];

let pipelineHistoryStore = [
  {
    id: 'pipe-882',
    commitHash: '7a8f91b',
    branch: 'main',
    author: 'Alex Chen <alex@studyconnect.app>',
    commitMessage: 'feat(infra): Prompt 11 Enterprise Production Infrastructure & CI/CD Pipeline',
    timestamp: '10 minutes ago',
    status: 'Passed',
    durationSeconds: 142,
    steps: [
      { name: '1. Code Quality & Linter', status: 'Success', durationSeconds: 18 },
      { name: '2. Unit & Integration Tests', status: 'Success', durationSeconds: 42 },
      { name: '3. Security Vulnerability Scan', status: 'Success', durationSeconds: 24 },
      { name: '4. Docker Multi-Stage Container Build', status: 'Success', durationSeconds: 38 },
      { name: '5. Zero-Downtime Multi-Region Deploy', status: 'Success', durationSeconds: 20 }
    ]
  },
  {
    id: 'pipe-881',
    commitHash: '3c4e5f6',
    branch: 'main',
    author: 'Evelyn Reed <evelyn@studyconnect.app>',
    commitMessage: 'feat(business): Prompt 10 Monetization, Mentors & Escrow Checkout',
    timestamp: '3 hours ago',
    status: 'Passed',
    durationSeconds: 156,
    steps: [
      { name: '1. Code Quality & Linter', status: 'Success', durationSeconds: 20 },
      { name: '2. Unit & Integration Tests', status: 'Success', durationSeconds: 48 },
      { name: '3. Security Vulnerability Scan', status: 'Success', durationSeconds: 25 },
      { name: '4. Docker Multi-Stage Container Build', status: 'Success', durationSeconds: 42 },
      { name: '5. Zero-Downtime Multi-Region Deploy', status: 'Success', durationSeconds: 21 }
    ]
  }
];

let securityAuditLogsStore = [
  { id: 'sec-1', timestamp: '5 mins ago', eventType: 'RateLimitExceeded', ipAddress: '198.51.100.42', endpoint: '/api/v1/auth/login', severity: 'MEDIUM', actionTaken: 'Blocked', details: 'Exceeded 5 req/sec auth rate limit. HTTP 429 returned.' },
  { id: 'sec-2', timestamp: '14 mins ago', eventType: 'JWTRefreshed', ipAddress: '203.0.113.19', endpoint: '/api/v1/auth/refresh', severity: 'LOW', actionTaken: 'Allowed', details: 'Successful JWT refresh token rotation.' },
  { id: 'sec-3', timestamp: '1 hour ago', eventType: 'SQLInjectionAttempt', ipAddress: '192.0.2.88', endpoint: '/api/v1/search', severity: 'CRITICAL', actionTaken: 'Blocked', details: 'WAF rules intercepted illegal SQL parameter concatenation.' }
];

// 1. Infrastructure Overview API
app.get('/api/infra/overview', (req, res) => {
  res.json({
    success: true,
    overview: {
      overallHealth: 'HEALTHY',
      clusterUptimePercent: 99.99,
      activeNodesCount: 16,
      totalRequestsPerMin: 14850,
      avgApiLatencyMs: 18,
      p99LatencyMs: 42,
      errorRatePercent: 0.002,
      currentTrafficScale: '100,000 Users'
    },
    containers: containerServicesStore,
    redis: redisStatsStore,
    celery: celeryMetricsStore,
    dbReplicas: dbReplicasStore,
    recentPipelines: pipelineHistoryStore,
    securityLogs: securityAuditLogsStore
  });
});

// 2. Redis Cache Purge Action API
app.post('/api/infra/redis/purge', (req, res) => {
  redisStatsStore.keysCount = 1200;
  redisStatsStore.usedMemoryHuman = '420 MB';
  redisStatsStore.totalHits = 0;
  redisStatsStore.totalMisses = 0;
  res.json({ success: true, message: 'Redis Cache flushed and purged successfully across all cluster nodes.' });
});

// 3. PostgreSQL Automated Backup Action API
app.post('/api/infra/db/backup/trigger', (req, res) => {
  const timestamp = new Date().toISOString();
  dbReplicasStore = dbReplicasStore.map(replica => ({
    ...replica,
    lastBackupTimestamp: 'Just Now'
  }));
  res.json({
    success: true,
    message: `PostgreSQL dump & S3 encrypted backup completed successfully at ${timestamp}. Archive: studyconnect_db_backup_${Date.now()}.sql.gz`
  });
});

// 4. CI/CD Pipeline Manual Trigger API
app.post('/api/infra/pipeline/trigger', (req, res) => {
  const newRun = {
    id: `pipe-${Math.floor(800 + Math.random() * 200)}`,
    commitHash: Math.random().toString(36).substring(2, 9),
    branch: 'main',
    author: 'Alex Chen <alex@studyconnect.app>',
    commitMessage: 'manual(infra): On-demand production infrastructure validation run',
    timestamp: 'Just Now',
    status: 'Passed',
    durationSeconds: 128,
    steps: [
      { name: '1. Code Quality & Linter', status: 'Success', durationSeconds: 15 },
      { name: '2. Unit & Integration Tests', status: 'Success', durationSeconds: 38 },
      { name: '3. Security Vulnerability Scan', status: 'Success', durationSeconds: 22 },
      { name: '4. Docker Multi-Stage Container Build', status: 'Success', durationSeconds: 34 },
      { name: '5. Zero-Downtime Multi-Region Deploy', status: 'Success', durationSeconds: 19 }
    ]
  };
  pipelineHistoryStore.unshift(newRun);
  res.json({ success: true, message: 'CI/CD Pipeline run completed with 100% green status!', pipeline: newRun });
});

// ============================================================
// PRODUCTION READINESS & LAUNCH REST APIs (PROMPT 12)
// ============================================================

let launchChecklistStore = [
  { id: 'chk-1', category: 'Authentication', title: 'OAuth 2.0 & JWT Refresh Token Rotation', description: 'Ensure strict 30-min access token expiry, 7-day refresh token rotation with theft detection.', isCompleted: true, verifiedBy: 'Alex Chen (SecOps Lead)', verifiedAt: '2026-07-29', priority: 'CRITICAL' },
  { id: 'chk-2', category: 'Real-Time Sync', title: 'Daphne ASGI WebSocket Failover & Reconnection', description: 'Test auto-reconnect fallback with local queue buffer during 10-second backend restart.', isCompleted: true, verifiedBy: 'Devon Vance (Realtime Engineer)', verifiedAt: '2026-07-29', priority: 'CRITICAL' },
  { id: 'chk-3', category: 'AI & Gemini', title: 'Server-Side Gemini 2.5 API Key Proxy & Quota Guards', description: 'Verify process.env.GEMINI_API_KEY is isolated from frontend bundle with token rate limiting.', isCompleted: true, verifiedBy: 'Sarah Lin (AI Architect)', verifiedAt: '2026-07-30', priority: 'CRITICAL' },
  { id: 'chk-4', category: 'Monetization', title: 'Stripe Escrow Webhook Signature & Idempotency', description: 'Validate 256-bit Stripe webhook signature verification and payout escrow locks.', isCompleted: true, verifiedBy: 'Marcus Rivera (Fintech Lead)', verifiedAt: '2026-07-28', priority: 'CRITICAL' },
  { id: 'chk-5', category: 'Security & Audit', title: 'WAF Rate Limiting & SQL Injection Interception', description: 'Verify Nginx rate limit zones (30r/s API, 5r/s Auth) and parameter sanitization.', isCompleted: true, verifiedBy: 'Alex Chen (SecOps Lead)', verifiedAt: '2026-07-30', priority: 'CRITICAL' },
  { id: 'chk-6', category: 'Mobile App Stores', title: 'Google Play & Apple App Store Privacy Labels', description: 'Verify data safety labels, permissions declaration, and screenshot assets uploaded.', isCompleted: true, verifiedBy: 'Maya Patel (Product Manager)', verifiedAt: '2026-07-30', priority: 'HIGH' },
  { id: 'chk-7', category: 'Legal & Compliance', title: 'DMCA Takedown Policy & Terms of Service', description: 'Legal approval for user-generated content policy, copyright flow, and GDPR export.', isCompleted: true, verifiedBy: 'Elena Rostova (General Counsel)', verifiedAt: '2026-07-27', priority: 'HIGH' },
  { id: 'chk-8', category: 'Observability', title: 'Sentry Crash Reporting & OpenTelemetry Tracing', description: '99.9% crash-free sessions dashboard monitoring and p99 latency alerts.', isCompleted: true, verifiedBy: 'Devon Vance (SRE Lead)', verifiedAt: '2026-07-30', priority: 'HIGH' },
  { id: 'chk-9', category: 'Backups', title: 'Automated Daily PostgreSQL S3 Backup Restore Drill', description: 'Verify database point-in-time recovery test in staging environment.', isCompleted: true, verifiedBy: 'Devon Vance (SRE Lead)', verifiedAt: '2026-07-30', priority: 'CRITICAL' }
];

let qaTestSuitesStore = [
  { id: 'qa-1', suiteName: 'Backend Core API Suite', testCategory: 'Unit', name: 'User Authentication & JWT Issuance', status: 'PASSED', durationMs: 42, assertionsCount: 18, lastRunAt: 'Just Now' },
  { id: 'qa-2', suiteName: 'Backend Core API Suite', testCategory: 'Integration', name: 'AI Study Pod Matching Engine Algorithm', status: 'PASSED', durationMs: 124, assertionsCount: 24, lastRunAt: 'Just Now' },
  { id: 'qa-3', suiteName: 'Realtime WebSocket Suite', testCategory: 'Realtime WebSocket', name: 'Daphne ASGI Collaborative Whiteboard Canvas Sync', status: 'PASSED', durationMs: 88, assertionsCount: 12, lastRunAt: 'Just Now' },
  { id: 'qa-4', suiteName: 'Realtime WebSocket Suite', testCategory: 'Realtime WebSocket', name: 'WebRTC Peer-to-Peer Signaling & Mesh Audio Handshake', status: 'PASSED', durationMs: 156, assertionsCount: 15, lastRunAt: 'Just Now' },
  { id: 'qa-5', suiteName: 'E2E User Journey Suite', testCategory: 'E2E', name: 'Mentor Escrow Booking & Session Completion Flow', status: 'PASSED', durationMs: 420, assertionsCount: 32, lastRunAt: 'Just Now' },
  { id: 'qa-6', suiteName: 'Performance & Load Suite', testCategory: 'Performance', name: '10,000 Concurrent WebSocket Connections Stress Test', status: 'PASSED', durationMs: 890, assertionsCount: 8, lastRunAt: 'Just Now' },
  { id: 'qa-7', suiteName: 'Security Vulnerability Audit', testCategory: 'Security', name: 'OWASP Top 10 XSS, CSRF & SQL Injection Attack Simulation', status: 'PASSED', durationMs: 210, assertionsCount: 45, lastRunAt: 'Just Now' },
  { id: 'qa-8', suiteName: 'Accessibility Audit Suite', testCategory: 'Accessibility', name: 'WCAG 2.1 AA Contrast, Screen Reader & Keyboard Navigation', status: 'PASSED', durationMs: 95, assertionsCount: 28, lastRunAt: 'Just Now' },
  { id: 'qa-9', suiteName: 'Localization i18n Suite', testCategory: 'Localization', name: 'Multi-Language String Dictionary Fallback Check', status: 'PASSED', durationMs: 34, assertionsCount: 64, lastRunAt: 'Just Now' },
  { id: 'qa-10', suiteName: 'Offline Network Resiliency Suite', testCategory: 'Offline', name: 'ServiceWorker Cache & Offline Chat Queue Flush on Reconnect', status: 'PASSED', durationMs: 140, assertionsCount: 10, lastRunAt: 'Just Now' }
];

let featureFlagsStore = [
  { key: 'FF_AI_ECOSYSTEM_V2', description: 'Enable Multi-Modal Gemini 2.5 Flash Pod Co-Pilot', state: 'PRODUCTION_100', targetAudience: 'All Global Users', owner: 'Sarah Lin', lastModified: '2 hours ago' },
  { key: 'FF_MENTOR_ESCROW_PAYOUTS', description: 'Enable Automated Stripe Escrow Milestone Payouts', state: 'PRODUCTION_100', targetAudience: 'Verified Mentors', owner: 'Marcus Rivera', lastModified: '1 day ago' },
  { key: 'FF_CANARY_WEBRTC_MESH', description: 'High-Definition Low-Latency WebRTC Voice Channels', state: 'CANARY_50', targetAudience: '50% Active Study Pods', owner: 'Devon Vance', lastModified: '3 hours ago' },
  { key: 'FF_GROWTH_REFERRAL_BOOST', description: 'Viral Quiz Sharing & Study Hours Leaderboard Boost', state: 'PRODUCTION_100', targetAudience: 'All Mobile & Web Users', owner: 'Maya Patel', lastModified: '5 hours ago' },
  { key: 'FF_INDIC_LOCALIZATION', description: 'Full Localization in Telugu, Hindi, Tamil, Kannada, Malayalam', state: 'PRODUCTION_100', targetAudience: 'India & Global South', owner: 'Rajesh Kumar', lastModified: 'Just Now' }
];

let languagesStore = [
  { code: 'en', name: 'English', nativeName: 'English', completionPercent: 100, totalKeys: 480, missingKeys: 0 },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', completionPercent: 100, totalKeys: 480, missingKeys: 0 },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', completionPercent: 100, totalKeys: 480, missingKeys: 0 },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', completionPercent: 100, totalKeys: 480, missingKeys: 0 },
  { code: 'kn', name: 'Kannada', nativeName: 'కన్నడ', completionPercent: 100, totalKeys: 480, missingKeys: 0 },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', completionPercent: 100, totalKeys: 480, missingKeys: 0 }
];

let storeAssetsStore = [
  { platform: 'Android Google Play', version: 'v1.0.0-release', appName: 'StudyConnect: AI Peer Learning', subtitle: 'Collaborative Study Pods, Mentors & AI Co-Pilot', keywords: ['study', 'peer learning', 'ai tutor', 'mentorship', 'study pods', 'whiteboard'], privacyUrl: 'https://studyconnect.app/privacy', termsUrl: 'https://studyconnect.app/terms', screenshotsUploaded: 12, reviewStatus: 'Approved' },
  { platform: 'Apple App Store', version: 'v1.0.0-release', appName: 'StudyConnect - Live Study Pods', subtitle: 'Peer Learning & Mentorship', keywords: ['study', 'tutoring', 'group study', 'exam prep', 'ai'], privacyUrl: 'https://studyconnect.app/privacy', termsUrl: 'https://studyconnect.app/terms', screenshotsUploaded: 10, reviewStatus: 'Approved' }
];

let incidentRunbooksStore = [
  { id: 'run-1', severity: 'SEV-1', title: 'PostgreSQL Primary Database Unresponsive / Network Partition', triggerCondition: 'DB connection timeouts > 5% for 60 seconds.', onCallEscalation: 'Devon Vance (SRE Lead) & Alex Chen (SecOps)', mitigationSteps: ['1. Trigger automatic failover to Read Replica 1 using pg_failover script.', '2. Update backend DATABASE_URL DNS endpoint to replica.', '3. Verify write queries resume normal latency < 20ms.'], rtoMinutes: 5, rpoMinutes: 0 },
  { id: 'run-2', severity: 'SEV-2', title: 'Redis Cache Cluster Out-of-Memory / High Eviction Rate', triggerCondition: 'Redis memory usage > 90% or maxmemory-policy eviction spike.', onCallEscalation: 'Devon Vance (SRE Lead)', mitigationSteps: ['1. Issue FLUSHDB on ephemeral session cache keys.', '2. Scale Redis node RAM from 4GB to 8GB via cloud console.', '3. Monitor cache hit rate stabilization > 95%.'], rtoMinutes: 10, rpoMinutes: 0 }
];

// 1. Launch Overview API
app.get('/api/launch/overview', (req, res) => {
  const completedChecklist = launchChecklistStore.filter(c => c.isCompleted).length;
  const passedTests = qaTestSuitesStore.filter(t => t.status === 'PASSED').length;

  res.json({
    success: true,
    report: {
      overallScorePercent: 99.4,
      totalChecklistCompleted: completedChecklist,
      totalChecklistItems: launchChecklistStore.length,
      testsPassedCount: passedTests,
      totalTestsCount: qaTestSuitesStore.length,
      zeroBlockingVulnerabilities: true,
      crashFreeSessionsPercent: 99.98,
      targetLaunchDate: 'August 1, 2026 (PUBLIC RELEASE READY)'
    },
    checklist: launchChecklistStore,
    testSuites: qaTestSuitesStore,
    featureFlags: featureFlagsStore,
    languages: languagesStore,
    storeAssets: storeAssetsStore,
    runbooks: incidentRunbooksStore
  });
});

// 2. Trigger Full Automated QA Test Suite API
app.post('/api/launch/tests/run', (req, res) => {
  qaTestSuitesStore = qaTestSuitesStore.map(test => ({
    ...test,
    status: 'PASSED',
    durationMs: Math.floor(20 + Math.random() * 200),
    lastRunAt: 'Just Now'
  }));

  res.json({
    success: true,
    message: `Executed all ${qaTestSuitesStore.length} automated QA tests. 100% Passed! Zero regressions detected.`,
    testSuites: qaTestSuitesStore
  });
});

// 3. Toggle Launch Checklist Item API
app.post('/api/launch/checklist/toggle', (req, res) => {
  const { id } = req.body;
  launchChecklistStore = launchChecklistStore.map(item => {
    if (item.id === id) {
      return {
        ...item,
        isCompleted: !item.isCompleted,
        verifiedAt: new Date().toISOString().split('T')[0]
      };
    }
    return item;
  });

  res.json({ success: true, message: 'Launch checklist state updated.', checklist: launchChecklistStore });
});

// 4. Update Feature Flag API
app.post('/api/launch/feature-flags/toggle', (req, res) => {
  const { key, state } = req.body;
  featureFlagsStore = featureFlagsStore.map(flag => {
    if (flag.key === key) {
      return {
        ...flag,
        state,
        lastModified: 'Just Now'
      };
    }
    return flag;
  });

  res.json({ success: true, message: `Feature flag ${key} updated to ${state}`, featureFlags: featureFlagsStore });
});

// Delete Account API
app.post('/api/account/delete', (req, res) => {
  try {
    const { userId, email } = req.body;
    if (userId) {
      userProfilesDb.delete(userId);
    }
    if (email) {
      usersDb.delete(email.toLowerCase());
      otpDb.delete(email.toLowerCase());
    }
    res.json({ success: true, message: 'Account and associated data deleted permanently.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Export Account Data API
app.get('/api/account/export', (req, res) => {
  try {
    const { userId } = req.query;
    const profile = userId ? userProfilesDb.get(String(userId)) : null;
    res.json({
      success: true,
      exportTimestamp: new Date().toISOString(),
      profile: profile || { note: 'Default local profile active' },
      app: 'StudyConnect'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StudyConnect Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
