import { StudentProfile, StudentSession, TrackingEvent, TalkToAashnaSubmission, FeedbackSubmission } from '../types';

const STORAGE_STUDENTS_KEY = 'the_write_magic_students_v2';
const STORAGE_SESSIONS_KEY = 'the_write_magic_sessions_v2';
const STORAGE_EVENTS_KEY = 'the_write_magic_events_v2';
const STORAGE_TALK_SUBMISSIONS_KEY = 'the_write_magic_talk_submissions_v2';
const STORAGE_FEEDBACK_KEY = 'the_write_magic_feedback_v2';
const STORAGE_CURRENT_STUDENT_KEY = 'the_write_magic_current_student_v2';

// Seed sample students and organizations - default to empty to keep dashboard completely clean
const SEED_STUDENTS: StudentProfile[] = [];

const SEED_TALK_SUBMISSIONS: TalkToAashnaSubmission[] = [];

const SEED_FEEDBACK: FeedbackSubmission[] = [];

const SEED_EVENTS: TrackingEvent[] = [];

class AnalyticsTracker {
  private currentStudent: StudentProfile | null = null;
  private currentSession: StudentSession | null = null;
  private activeTimerInterval: any = null;
  private lastActivityTimestamp: number = Date.now();
  private isUserActive: boolean = true;
  private inactivityThresholdMs = 45000; // 45 seconds inactivity timeout

  constructor() {
    this.initializeData();
    this.setupHeartbeatListeners();
  }

  private initializeData() {
    try {
      const legacySeedStudentIds = new Set([
        'stud-aanya-01',
        'stud-leo-02',
        'stud-maya-03',
        'stud-rohan-04',
        'stud-zara-05',
        'stud-tariq-06',
        'teacher-sunshine-01',
      ]);
      const legacySeedTalkIds = new Set(['talk-sub-01', 'talk-sub-02', 'talk-sub-03', 'talk-sub-04']);
      const legacySeedFeedbackIds = new Set(['fb-01', 'fb-02', 'fb-03', 'fb-04']);

      const rawStudents = localStorage.getItem(STORAGE_STUDENTS_KEY);
      if (rawStudents) {
        const parsed: StudentProfile[] = JSON.parse(rawStudents);
        const cleaned = parsed.filter(
          (s) =>
            !legacySeedStudentIds.has(s.id) &&
            s.organization !== 'Sunshine Primary School' &&
            s.organization !== 'Oakwood Learning Academy' &&
            s.organization !== 'Little Scholars NGO'
        );
        localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(cleaned));
      } else {
        localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify([]));
      }

      const rawTalk = localStorage.getItem(STORAGE_TALK_SUBMISSIONS_KEY);
      if (rawTalk) {
        const parsed: TalkToAashnaSubmission[] = JSON.parse(rawTalk);
        const cleaned = parsed.filter((t) => !legacySeedTalkIds.has(t.id));
        localStorage.setItem(STORAGE_TALK_SUBMISSIONS_KEY, JSON.stringify(cleaned));
      } else {
        // Try to recover from backup if available
        const backup = localStorage.getItem(STORAGE_TALK_SUBMISSIONS_KEY + '_backup');
        if (backup) {
          localStorage.setItem(STORAGE_TALK_SUBMISSIONS_KEY, backup);
        } else {
          localStorage.setItem(STORAGE_TALK_SUBMISSIONS_KEY, JSON.stringify([]));
        }
      }

      const rawFeedback = localStorage.getItem(STORAGE_FEEDBACK_KEY);
      if (rawFeedback) {
        const parsed: FeedbackSubmission[] = JSON.parse(rawFeedback);
        const cleaned = parsed.filter((f) => !legacySeedFeedbackIds.has(f.id));
        localStorage.setItem(STORAGE_FEEDBACK_KEY, JSON.stringify(cleaned));
      } else {
        localStorage.setItem(STORAGE_FEEDBACK_KEY, JSON.stringify([]));
      }

      const rawEvents = localStorage.getItem(STORAGE_EVENTS_KEY);
      if (rawEvents) {
        const parsed: TrackingEvent[] = JSON.parse(rawEvents);
        const cleaned = parsed.filter((e) => !legacySeedStudentIds.has(e.studentId));
        localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(cleaned));
      } else {
        localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify([]));
      }

      // Check current student
      const savedStudent = localStorage.getItem(STORAGE_CURRENT_STUDENT_KEY);
      if (savedStudent) {
        const parsed = JSON.parse(savedStudent);
        if (
          !legacySeedStudentIds.has(parsed.id) &&
          parsed.organization !== 'Sunshine Primary School' &&
          parsed.organization !== 'Oakwood Learning Academy' &&
          parsed.organization !== 'Little Scholars NGO'
        ) {
          this.currentStudent = parsed;
          this.startSession(this.currentStudent!);
        } else {
          localStorage.removeItem(STORAGE_CURRENT_STUDENT_KEY);
          this.currentStudent = null;
        }
      }
    } catch {
      // Ignore
    }
  }

  public clearDemoData() {
    try {
      localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify([]));
      localStorage.setItem(STORAGE_TALK_SUBMISSIONS_KEY, JSON.stringify([]));
      localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify([]));
      localStorage.setItem(STORAGE_FEEDBACK_KEY, JSON.stringify([]));
      localStorage.removeItem(STORAGE_CURRENT_STUDENT_KEY);
      this.currentStudent = null;
    } catch {
      // Ignore
    }
  }

  private setupHeartbeatListeners() {
    if (typeof window === 'undefined') return;

    const resetActivity = () => {
      this.lastActivityTimestamp = Date.now();
      this.isUserActive = true;
    };

    window.addEventListener('mousemove', resetActivity, { passive: true });
    window.addEventListener('keydown', resetActivity, { passive: true });
    window.addEventListener('touchstart', resetActivity, { passive: true });
    window.addEventListener('click', resetActivity, { passive: true });
    window.addEventListener('scroll', resetActivity, { passive: true });

    // 1-second interval heartbeat
    if (this.activeTimerInterval) clearInterval(this.activeTimerInterval);
    this.activeTimerInterval = setInterval(() => {
      const now = Date.now();
      if (now - this.lastActivityTimestamp > this.inactivityThresholdMs) {
        this.isUserActive = false;
      }

      if (this.currentSession && this.currentStudent) {
        this.currentSession.durationSeconds += 1;
        if (this.isUserActive) {
          this.currentSession.activeSeconds += 1;
          this.currentStudent.totalActiveSeconds += 1;
        }
      }
    }, 1000);
  }

  // Register or Login Student
  public authenticateStudent(name: string, organization: string): StudentProfile {
    const trimmedName = name.trim();
    const trimmedOrg = organization.trim() || 'Independent Young Author';

    const students = this.getAllStudents();
    // Match returning student by case-insensitive name and organization
    let student = students.find(
      (s) =>
        s.name.toLowerCase() === trimmedName.toLowerCase() &&
        s.organization.toLowerCase() === trimmedOrg.toLowerCase()
    );

    const nowFormatted = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

    if (student) {
      // Returning student
      student.lastActive = nowFormatted;
      student.sessionCount += 1;
      this.updateStudent(student);
      this.currentStudent = student;
    } else {
      // New student registration
      const randomEmojis = ['🌟', '🦄', '🚀', '🎨', '🌸', '🦁', '🐬', '🐼', '✨', '🐾'];
      const emoji = randomEmojis[Math.floor(Math.random() * randomEmojis.length)];
      const newId = 'stud-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 4);

      student = {
        id: newId,
        name: trimmedName,
        organization: trimmedOrg,
        firstUsed: new Date().toISOString().split('T')[0],
        lastActive: nowFormatted,
        totalActiveSeconds: 0,
        sessionCount: 1,
        storiesCount: 0,
        evaluationsCount: 0,
        avatarEmoji: emoji,
      };

      const updatedList = [student, ...students];
      localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(updatedList));
      this.currentStudent = student;
      this.trackEvent('student_registered', 'Auth', { name: trimmedName, organization: trimmedOrg });
    }

    localStorage.setItem(STORAGE_CURRENT_STUDENT_KEY, JSON.stringify(student));
    this.startSession(student);
    this.trackEvent('student_login', 'Auth', { returning: !!student });

    return student;
  }

  public logoutStudent() {
    if (this.currentSession) {
      this.trackEvent('session_ended', 'Auth', {
        durationSeconds: this.currentSession.durationSeconds,
        activeSeconds: this.currentSession.activeSeconds,
      });
      this.saveSession(this.currentSession);
    }
    this.currentStudent = null;
    this.currentSession = null;
    localStorage.removeItem(STORAGE_CURRENT_STUDENT_KEY);
  }

  public getCurrentStudent(): StudentProfile | null {
    if (this.currentStudent) return this.currentStudent;
    try {
      const saved = localStorage.getItem(STORAGE_CURRENT_STUDENT_KEY);
      if (saved) {
        this.currentStudent = JSON.parse(saved);
        return this.currentStudent;
      }
    } catch {
      // Ignore
    }
    return null;
  }

  private startSession(student: StudentProfile) {
    const sessionId = 'sess-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 3);
    const newSession: StudentSession = {
      id: sessionId,
      studentId: student.id,
      studentName: student.name,
      organization: student.organization,
      startTime: new Date().toISOString(),
      durationSeconds: 0,
      activeSeconds: 0,
      featuresUsed: ['Home'],
      device: typeof navigator !== 'undefined' && /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'Mobile / Tablet' : 'Desktop / Laptop',
    };
    this.currentSession = newSession;
    this.trackEvent('session_started', 'App', { device: newSession.device });
  }

  // Track Event
  public trackEvent(
    eventName: string,
    feature?: string,
    metadata?: Record<string, any>,
    storyId?: string,
    imageId?: string
  ) {
    const student = this.getCurrentStudent();
    if (!student) return;

    if (this.currentSession && feature && !this.currentSession.featuresUsed.includes(feature)) {
      this.currentSession.featuresUsed.push(feature);
    }

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    const newEvent: TrackingEvent = {
      id: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      studentId: student.id,
      studentName: student.name,
      organization: student.organization,
      eventName,
      timestamp: now.toISOString(),
      formattedTime,
      sessionId: this.currentSession?.id || 'sess-default',
      feature,
      storyId,
      imageId,
      metadata,
    };

    try {
      const events = this.getAllEvents();
      const updated = [newEvent, ...events].slice(0, 1000); // keep up to 1000 recent events
      localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  }

  // Talk to Aashna Submissions
  public submitTalkToAashna(submission: Omit<TalkToAashnaSubmission, 'id' | 'submittedAt' | 'status'>): TalkToAashnaSubmission {
    const student = this.getCurrentStudent();
    const newSubmission: TalkToAashnaSubmission = {
      ...submission,
      id: 'talk-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      studentId: student?.id || submission.studentId,
      studentName: student?.name || submission.studentName,
      organization: student?.organization || submission.organization,
      submittedAt: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
      status: 'New',
    };

    const all = this.getAllTalkSubmissions();
    const updated = [newSubmission, ...all];
    localStorage.setItem(STORAGE_TALK_SUBMISSIONS_KEY, JSON.stringify(updated));
    try {
      localStorage.setItem(STORAGE_TALK_SUBMISSIONS_KEY + '_backup', JSON.stringify(updated));
    } catch {
      // Ignore
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('write_magic_submission_updated', { detail: newSubmission }));
    }

    this.trackEvent(
      submission.type === 'story_share' ? 'writing_shared' : 'session_request_submitted',
      'Talk to Aashna',
      { type: submission.type, title: submission.storyTitle || submission.topic }
    );

    return newSubmission;
  }

  public updateTalkSubmissionStatus(id: string, status: TalkToAashnaSubmission['status'], notes?: string) {
    const all = this.getAllTalkSubmissions();
    const updated = all.map((sub) => {
      if (sub.id === id) {
        return {
          ...sub,
          status,
          adminNotes: notes !== undefined ? notes : sub.adminNotes,
        };
      }
      return sub;
    });
    localStorage.setItem(STORAGE_TALK_SUBMISSIONS_KEY, JSON.stringify(updated));
    try {
      localStorage.setItem(STORAGE_TALK_SUBMISSIONS_KEY + '_backup', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  }

  public deleteTalkSubmission(id: string) {
    const all = this.getAllTalkSubmissions();
    const updated = all.filter((sub) => sub.id !== id);
    localStorage.setItem(STORAGE_TALK_SUBMISSIONS_KEY, JSON.stringify(updated));
    try {
      localStorage.setItem(STORAGE_TALK_SUBMISSIONS_KEY + '_backup', JSON.stringify(updated));
    } catch {
      // Ignore
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('write_magic_submission_updated'));
    }
  }

  // Feedback Management
  public submitFeedback(feedback: {
    studentId?: string;
    studentName?: string;
    organization?: string;
    userRole?: 'student' | 'teacher' | 'parent' | 'guest';
    category: 'complaint' | 'concern' | 'suggestion' | 'praise' | 'general';
    rating?: number;
    title: string;
    feedbackText: string;
    featureArea?: string;
    contactEmail?: string;
  }): FeedbackSubmission {
    const newFeedback: FeedbackSubmission = {
      id: `fb-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      studentId: feedback.studentId || this.currentStudent?.id || 'guest',
      studentName: feedback.studentName || this.currentStudent?.name || 'Anonymous Learner',
      organization: feedback.organization || this.currentStudent?.organization || 'The Write Magic Community',
      userRole: feedback.userRole || 'student',
      category: feedback.category,
      rating: feedback.rating || 5,
      title: feedback.title,
      feedbackText: feedback.feedbackText,
      featureArea: feedback.featureArea || 'General',
      submittedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }),
      status: 'New',
      contactEmail: feedback.contactEmail,
    };

    const all = this.getAllFeedback();
    const updated = [newFeedback, ...all];
    localStorage.setItem(STORAGE_FEEDBACK_KEY, JSON.stringify(updated));

    this.trackEvent('feedback_submitted', 'Feedback Tab', {
      category: feedback.category,
      rating: feedback.rating,
      featureArea: feedback.featureArea,
    });

    return newFeedback;
  }

  public getAllFeedback(): FeedbackSubmission[] {
    try {
      const raw = localStorage.getItem(STORAGE_FEEDBACK_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // Ignore
    }
    return SEED_FEEDBACK;
  }

  public updateFeedbackStatus(id: string, status: FeedbackSubmission['status'], adminNotes?: string) {
    const all = this.getAllFeedback();
    const updated = all.map((fb) => {
      if (fb.id === id) {
        return {
          ...fb,
          status,
          adminNotes: adminNotes !== undefined ? adminNotes : fb.adminNotes,
        };
      }
      return fb;
    });
    localStorage.setItem(STORAGE_FEEDBACK_KEY, JSON.stringify(updated));
  }

  public deleteFeedback(id: string) {
    const all = this.getAllFeedback();
    const updated = all.filter((fb) => fb.id !== id);
    localStorage.setItem(STORAGE_FEEDBACK_KEY, JSON.stringify(updated));
  }

  public exportFeedbackCSV(): string {
    const feedbacks = this.getAllFeedback();
    const headers = [
      'Feedback ID',
      'Name',
      'Organization',
      'Role',
      'Category',
      'Rating',
      'Feature Area',
      'Title',
      'Feedback Text',
      'Submitted At',
      'Status',
      'Admin Notes',
      'Contact Email',
    ];

    const rows = feedbacks.map((f) => [
      `"${f.id}"`,
      `"${f.studentName || ''}"`,
      `"${f.organization || ''}"`,
      `"${f.userRole || ''}"`,
      `"${f.category || ''}"`,
      `"${f.rating || ''}"`,
      `"${f.featureArea || ''}"`,
      `"${(f.title || '').replace(/"/g, '""')}"`,
      `"${(f.feedbackText || '').replace(/"/g, '""')}"`,
      `"${f.submittedAt || ''}"`,
      `"${f.status || ''}"`,
      `"${(f.adminNotes || '').replace(/"/g, '""')}"`,
      `"${f.contactEmail || ''}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  // Read utilities
  public getAllStudents(): StudentProfile[] {
    try {
      const raw = localStorage.getItem(STORAGE_STUDENTS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // Ignore
    }
    return SEED_STUDENTS;
  }

  public getAllEvents(): TrackingEvent[] {
    try {
      const raw = localStorage.getItem(STORAGE_EVENTS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // Ignore
    }
    return SEED_EVENTS;
  }

  public getAllTalkSubmissions(): TalkToAashnaSubmission[] {
    try {
      const raw = localStorage.getItem(STORAGE_TALK_SUBMISSIONS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      const backup = localStorage.getItem(STORAGE_TALK_SUBMISSIONS_KEY + '_backup');
      if (backup) {
        const backupParsed = JSON.parse(backup);
        if (Array.isArray(backupParsed) && backupParsed.length > 0) {
          localStorage.setItem(STORAGE_TALK_SUBMISSIONS_KEY, backup);
          return backupParsed;
        }
      }
    } catch {
      // Ignore
    }
    return [];
  }

  public updateStudent(updatedStudent: StudentProfile) {
    const students = this.getAllStudents();
    const updated = students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s));
    localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(updated));
  }

  public recordStorySaved() {
    if (this.currentStudent) {
      this.currentStudent.storiesCount += 1;
      this.updateStudent(this.currentStudent);
    }
  }

  public recordEvaluationCompleted() {
    if (this.currentStudent) {
      this.currentStudent.evaluationsCount += 1;
      this.updateStudent(this.currentStudent);
    }
  }

  private saveSession(session: StudentSession) {
    try {
      const raw = localStorage.getItem(STORAGE_SESSIONS_KEY);
      const sessions: StudentSession[] = raw ? JSON.parse(raw) : [];
      sessions.unshift({ ...session, endTime: new Date().toISOString() });
      localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(sessions.slice(0, 500)));
    } catch {
      // Ignore
    }
  }

  // Export CSV
  public exportActivityCSV(): string {
    const events = this.getAllEvents();
    const headers = [
      'Student Name',
      'Organization',
      'Student ID',
      'Event Name',
      'Feature',
      'Timestamp',
      'Session ID',
      'Story ID',
      'Image ID',
      'Details',
    ];

    const rows = events.map((e) => [
      `"${e.studentName || ''}"`,
      `"${e.organization || ''}"`,
      `"${e.studentId || ''}"`,
      `"${e.eventName || ''}"`,
      `"${e.feature || ''}"`,
      `"${e.timestamp || ''}"`,
      `"${e.sessionId || ''}"`,
      `"${e.storyId || ''}"`,
      `"${e.imageId || ''}"`,
      `"${e.metadata ? JSON.stringify(e.metadata).replace(/"/g, '""') : ''}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}

export const analytics = new AnalyticsTracker();
