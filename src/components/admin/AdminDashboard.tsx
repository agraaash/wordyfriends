import React, { useState, useMemo, useEffect } from 'react';
import { StudentProfile, TrackingEvent, TalkToAashnaSubmission, StoryImage, FeedbackSubmission } from '../../types';
import { analytics } from '../../utils/analyticsTracker';
import { STORY_IMAGES_REPOSITORY, IMAGE_CATEGORIES } from '../../data/storyImagesData';
import { storySparksManager } from '../../utils/storySparksManager';
import { adminAuth } from '../../utils/adminAuth';
import imgLibraryDoor from '../../assets/images/storybook_library_door_1787491956550.jpg';
import {
  Users,
  Building2,
  Clock,
  BookOpen,
  Sparkles,
  Mail,
  Download,
  Search,
  Filter,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Layers,
  BarChart3,
  TrendingUp,
  Image as ImageIcon,
  LogOut,
  ChevronRight,
  X,
  ExternalLink,
  MessageSquare,
  FileText,
  Flame,
  Award,
  Plus,
  Trash2,
  Edit3,
  Star,
  Check,
  Eye,
  RefreshCw,
  AlertTriangle,
  Heart,
  Key,
  ShieldCheck,
} from 'lucide-react';
import { sounds } from '../../utils/sound';

interface AdminDashboardProps {
  adminEmail: string;
  onLogout: () => void;
  onNavigateToStudentApp: () => void;
}

type AdminTab = 'students' | 'organizations' | 'features' | 'images' | 'talk_submissions' | 'feedback';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminEmail,
  onLogout,
  onNavigateToStudentApp,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('students');
  const [searchStudentQuery, setSearchStudentQuery] = useState('');
  const [filterOrg, setFilterOrg] = useState('all');
  const [selectedStudentForTimeline, setSelectedStudentForTimeline] = useState<StudentProfile | null>(null);
  const [selectedTalkSubmission, setSelectedTalkSubmission] = useState<TalkToAashnaSubmission | null>(null);
  const [adminNoteText, setAdminNoteText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Feedback State
  const [feedbacks, setFeedbacks] = useState<FeedbackSubmission[]>(() => analytics.getAllFeedback());
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackSubmission | null>(null);
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState<string>('all');
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState<string>('all');
  const [feedbackSearchQuery, setFeedbackSearchQuery] = useState<string>('');
  const [feedbackAdminNoteText, setFeedbackAdminNoteText] = useState<string>('');

  // Story Sparks Admin State
  const [sparksList, setSparksList] = useState<StoryImage[]>(() => storySparksManager.getAllSparks());
  const [sparkCategoryFilter, setSparkCategoryFilter] = useState('all');
  const [sparkSearchQuery, setSparkSearchQuery] = useState('');
  const [sparkStatusFilter, setSparkStatusFilter] = useState<'all' | 'featured' | 'custom'>('all');
  const [editingSpark, setEditingSpark] = useState<StoryImage | null>(null);
  const [isAddingSpark, setIsAddingSpark] = useState(false);
  const [sparkDeleteConfirmId, setSparkDeleteConfirmId] = useState<string | null>(null);


  // New Spark Form State
  const [newSparkForm, setNewSparkForm] = useState({
    title: '',
    category: 'school',
    tag: 'School & Fun',
    emoji: '🏫',
    imageUrl: imgLibraryDoor,
    prompt: '',
    starterSentence: '',
    guidedQuestions: ['', ''],
    suggestedWords: '',
  });

  // Load live data from Analytics Tracker
  const [students, setStudents] = useState<StudentProfile[]>(() => analytics.getAllStudents());
  const [events, setEvents] = useState<TrackingEvent[]>(() => analytics.getAllEvents());
  const [talkSubmissions, setTalkSubmissions] = useState<TalkToAashnaSubmission[]>(() => analytics.getAllTalkSubmissions());

  const refreshData = () => {
    setStudents(analytics.getAllStudents());
    setEvents(analytics.getAllEvents());
    setTalkSubmissions(analytics.getAllTalkSubmissions());
    setFeedbacks(analytics.getAllFeedback());
    setSparksList(storySparksManager.getAllSparks());
  };

  useEffect(() => {
    const handleStorageOrSubmissionChange = () => {
      refreshData();
    };

    window.addEventListener('storage', handleStorageOrSubmissionChange);
    window.addEventListener('write_magic_submission_updated', handleStorageOrSubmissionChange);
    return () => {
      window.removeEventListener('storage', handleStorageOrSubmissionChange);
      window.removeEventListener('write_magic_submission_updated', handleStorageOrSubmissionChange);
    };
  }, []);

  const handleToggleFeaturedSpark = (sparkId: string) => {
    sounds.playPop();
    const updated = sparksList.map((s) => {
      if (s.id === sparkId) {
        const next = !s.isFeatured;
        storySparksManager.updateSpark(sparkId, { isFeatured: next });
        return { ...s, isFeatured: next };
      }
      return s;
    });
    setSparksList(updated);
  };

  const handleDeleteSpark = (sparkId: string) => {
    sounds.playPop();
    storySparksManager.deleteSpark(sparkId);
    setSparksList(storySparksManager.getAllSparks());
    setSparkDeleteConfirmId(null);
  };

  const handleSaveEditedSpark = () => {
    if (!editingSpark) return;
    sounds.playCorrect();
    storySparksManager.updateSpark(editingSpark.id, editingSpark);
    setSparksList(storySparksManager.getAllSparks());
    setEditingSpark(null);
  };

  const handleCreateNewSpark = () => {
    if (!newSparkForm.title.trim() || !newSparkForm.prompt.trim()) return;
    sounds.playCelebration();

    const categoryObj = IMAGE_CATEGORIES.find((c) => c.id === newSparkForm.category);
    const words = newSparkForm.suggestedWords
      .split(',')
      .map((w) => w.trim())
      .filter(Boolean);
    const questions = newSparkForm.guidedQuestions.filter((q) => q.trim().length > 0);

    storySparksManager.addSpark({
      title: newSparkForm.title.trim(),
      category: newSparkForm.category,
      categoryLabel: categoryObj?.name || 'Creative Story',
      tag: newSparkForm.tag.trim() || categoryObj?.name || 'Spark',
      emoji: newSparkForm.emoji.trim() || categoryObj?.emoji || '✨',
      imageUrl: newSparkForm.imageUrl.trim(),
      prompt: newSparkForm.prompt.trim(),
      starterSentence: newSparkForm.starterSentence.trim() || undefined,
      guidedQuestions: questions.length > 0 ? questions : undefined,
      suggestedWords: words.length > 0 ? words : ['curious', 'adventure', 'magical'],
    });

    setSparksList(storySparksManager.getAllSparks());
    setIsAddingSpark(false);
    setNewSparkForm({
      title: '',
      category: 'school',
      tag: 'School & Fun',
      emoji: '🏫',
      imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80',
      prompt: '',
      starterSentence: '',
      guidedQuestions: ['', ''],
      suggestedWords: '',
    });
  };

  const filteredSparks = useMemo(() => {
    return sparksList.filter((s) => {
      const matchCat = sparkCategoryFilter === 'all' || s.category === sparkCategoryFilter;
      const matchSearch =
        sparkSearchQuery.trim() === '' ||
        s.title.toLowerCase().includes(sparkSearchQuery.toLowerCase()) ||
        s.prompt.toLowerCase().includes(sparkSearchQuery.toLowerCase()) ||
        s.tag.toLowerCase().includes(sparkSearchQuery.toLowerCase());
      const matchStatus =
        sparkStatusFilter === 'all' ||
        (sparkStatusFilter === 'featured' && s.isFeatured) ||
        (sparkStatusFilter === 'custom' && s.id.startsWith('custom_'));
      return matchCat && matchSearch && matchStatus;
    });
  }, [sparksList, sparkCategoryFilter, sparkSearchQuery, sparkStatusFilter]);

  // Distinct Organizations
  const organizations = useMemo(() => {
    const orgs = new Set<string>();
    students.forEach((s) => {
      if (s.organization) orgs.add(s.organization);
    });
    return Array.from(orgs);
  }, [students]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        searchStudentQuery.trim() === '' ||
        s.name.toLowerCase().includes(searchStudentQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchStudentQuery.toLowerCase());
      const matchOrg = filterOrg === 'all' || s.organization === filterOrg;
      return matchSearch && matchOrg;
    });
  }, [students, searchStudentQuery, filterOrg]);

  // Overall Aggregate Metrics
  const totalStudentsCount = students.length;
  const totalOrgsCount = organizations.length;
  const totalSessionsCount = students.reduce((acc, s) => acc + s.sessionCount, 0);
  const totalActiveSeconds = students.reduce((acc, s) => acc + s.totalActiveSeconds, 0);
  const totalActiveMinutes = Math.round(totalActiveSeconds / 60);
  const totalStoriesCount = students.reduce((acc, s) => acc + s.storiesCount, 0);
  const totalEvaluationsCount = students.reduce((acc, s) => acc + s.evaluationsCount, 0);
  const totalTalkCount = talkSubmissions.length;

  // Dynamic Feature Usage Breakdown derived from real events
  const featureUsageBreakdown = useMemo(() => {
    const counts: Record<string, number> = {
      'Write Studio & Canvas': 0,
      'Story Sparks & Image Selection': 0,
      'Evaluate My Writing (AI Feedback)': 0,
      'Apply Grammar & Spelling Fixes': 0,
      'Sentence Simplification': 0,
      'Surprise Me Random Spark': 0,
      'My Stories Bookshelf': 0,
      'Talk to Aashna Submissions': talkSubmissions.length,
      'Word Detective Vocabulary Game': 0,
      'Speaking Practice Studio': 0,
    };

    events.forEach((e) => {
      const name = (e.eventName || '').toLowerCase();
      const feat = (e.feature || '').toLowerCase();
      if (name.includes('write') || feat.includes('write')) counts['Write Studio & Canvas']++;
      if (name.includes('image') || name.includes('spark') || feat.includes('spark')) counts['Story Sparks & Image Selection']++;
      if (name.includes('eval') || feat.includes('eval')) counts['Evaluate My Writing (AI Feedback)']++;
      if (name.includes('grammar') || name.includes('fix') || feat.includes('fix')) counts['Apply Grammar & Spelling Fixes']++;
      if (name.includes('simplif') || feat.includes('simplif')) counts['Sentence Simplification']++;
      if (name.includes('random') || name.includes('surprise')) counts['Surprise Me Random Spark']++;
      if (name.includes('story') || name.includes('save') || feat.includes('story')) counts['My Stories Bookshelf']++;
      if (name.includes('talk') || name.includes('aashna')) counts['Talk to Aashna Submissions']++;
      if (name.includes('vocab') || name.includes('word') || feat.includes('vocab')) counts['Word Detective Vocabulary Game']++;
      if (name.includes('speak') || feat.includes('speak')) counts['Speaking Practice Studio']++;
    });

    const maxUses = Math.max(...Object.values(counts), 1);
    return Object.entries(counts).map(([feature, uses]) => ({
      feature,
      uses,
      pct: uses === 0 ? 0 : Math.round((uses / maxUses) * 100),
    }));
  }, [events, talkSubmissions]);

  // Export CSV
  const handleExportCSV = () => {
    sounds.playPop();
    const csvContent = analytics.exportActivityCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `the_write_magic_activity_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle status update on submission
  const handleUpdateStatus = (subId: string, newStatus: TalkToAashnaSubmission['status']) => {
    sounds.playPop();
    analytics.updateTalkSubmissionStatus(subId, newStatus);
    refreshData();
    if (selectedTalkSubmission && selectedTalkSubmission.id === subId) {
      setSelectedTalkSubmission((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleSaveAdminNote = (subId: string) => {
    analytics.updateTalkSubmissionStatus(subId, selectedTalkSubmission?.status || 'New', adminNoteText);
    refreshData();
    if (selectedTalkSubmission) {
      setSelectedTalkSubmission((prev) => (prev ? { ...prev, adminNotes: adminNoteText } : null));
    }
  };

  // Feedback Handlers
  const handleUpdateFeedbackStatus = (feedbackId: string, newStatus: FeedbackSubmission['status']) => {
    sounds.playPop();
    analytics.updateFeedbackStatus(feedbackId, newStatus);
    refreshData();
    if (selectedFeedback && selectedFeedback.id === feedbackId) {
      setSelectedFeedback((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleSaveFeedbackNote = (feedbackId: string) => {
    analytics.updateFeedbackStatus(feedbackId, selectedFeedback?.status || 'New', feedbackAdminNoteText);
    refreshData();
    if (selectedFeedback) {
      setSelectedFeedback((prev) => (prev ? { ...prev, adminNotes: feedbackAdminNoteText } : null));
    }
  };

  const handleDeleteFeedback = (feedbackId: string) => {
    sounds.playPop();
    analytics.deleteFeedback(feedbackId);
    refreshData();
    if (selectedFeedback && selectedFeedback.id === feedbackId) {
      setSelectedFeedback(null);
    }
  };

  const handleExportFeedbackCSV = () => {
    sounds.playPop();
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(analytics.exportFeedbackCSV());
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `the_write_magic_user_feedback_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Professional Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-indigo-600/30">
            ✨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                The Write Magic
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Developer Analytics
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Authenticated Administrator: <span className="font-mono text-slate-300">{adminEmail}</span>
            </p>
          </div>
        </div>

        {/* Top Right Action Items */}
        <div className="flex items-center gap-2 sm:gap-3">

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="Download CSV of all student events"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={onNavigateToStudentApp}
            className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-xs font-semibold text-indigo-300 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Student App</span>
          </button>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 border border-slate-700 text-slate-400 transition-all cursor-pointer"
            title="Sign out of developer portal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-4 sm:p-8 space-y-6">
        {/* Top Key Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Total Students */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Users className="w-3 h-3 text-indigo-400" />
              <span>Students</span>
            </span>
            <p className="text-2xl font-bold text-white">{totalStudentsCount}</p>
            <span className="text-[10px] text-indigo-400">across {totalOrgsCount} orgs</span>
          </div>

          {/* Total Organizations */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-emerald-400" />
              <span>Organizations</span>
            </span>
            <p className="text-2xl font-bold text-white">{totalOrgsCount}</p>
            <span className="text-[10px] text-emerald-400">active partners</span>
          </div>

          {/* Active Time */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Active Time</span>
            </span>
            <p className="text-2xl font-bold text-white">{totalActiveMinutes}m</p>
            <span className="text-[10px] text-amber-400">{totalSessionsCount} sessions total</span>
          </div>

          {/* Stories Created */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-sky-400" />
              <span>Stories Saved</span>
            </span>
            <p className="text-2xl font-bold text-white">{totalStoriesCount}</p>
            <span className="text-[10px] text-sky-400">creative drafts</span>
          </div>

          {/* Evaluations Run */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Evaluations</span>
            </span>
            <p className="text-2xl font-bold text-white">{totalEvaluationsCount}</p>
            <span className="text-[10px] text-purple-400">word & sentence checks</span>
          </div>

          {/* Talk to Aashna Submissions */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Mail className="w-3 h-3 text-rose-400" />
              <span>Submissions</span>
            </span>
            <p className="text-2xl font-bold text-white">{totalTalkCount}</p>
            <span className="text-[10px] text-rose-400">Talk to Aashna</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'students', label: '👥 Student Activity & Timelines' },
            { id: 'organizations', label: '🏫 Organization Analytics' },
            { id: 'features', label: '📊 Feature Usage & Engagement' },
            { id: 'images', label: '🖼️ 150+ Image Analytics' },
            { id: 'talk_submissions', label: `💌 Talk to Aashna (${talkSubmissions.length})` },
            { id: 'feedback', label: `💬 User Feedback (${feedbacks.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Student Activity Table */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            {/* Search & Org Filter */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchStudentQuery}
                  onChange={(e) => setSearchStudentQuery(e.target.value)}
                  placeholder="Search students by name..."
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={filterOrg}
                  onChange={(e) => setFilterOrg(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="all">All Organizations ({organizations.length})</option>
                  {organizations.map((org) => (
                    <option key={org} value={org}>
                      {org}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Student</th>
                      <th className="py-3.5 px-4">Organization</th>
                      <th className="py-3.5 px-4">Last Active</th>
                      <th className="py-3.5 px-4 text-center">Sessions</th>
                      <th className="py-3.5 px-4 text-center">Active Time</th>
                      <th className="py-3.5 px-4 text-center">Stories</th>
                      <th className="py-3.5 px-4 text-center">Evaluations</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-500">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Users className="w-8 h-8 text-slate-600" />
                            <p className="text-sm font-semibold text-slate-400">No student activity recorded yet</p>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto">
                              Dashboard is clean with no test entries. Real students will automatically appear here as they log in and write stories.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((s) => {
                        const activeMins = Math.round(s.totalActiveSeconds / 60);
                        return (
                          <tr
                            key={s.id}
                            className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                            onClick={() => setSelectedStudentForTimeline(s)}
                          >
                            <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2.5">
                              <span className="text-base">{s.avatarEmoji || '🌸'}</span>
                              <span>{s.name}</span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-400">{s.organization}</td>
                            <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">{s.lastActive}</td>
                            <td className="py-3.5 px-4 text-center font-semibold text-indigo-400">{s.sessionCount}</td>
                            <td className="py-3.5 px-4 text-center font-mono text-amber-400">{activeMins}m active</td>
                            <td className="py-3.5 px-4 text-center font-semibold text-sky-400">{s.storiesCount}</td>
                            <td className="py-3.5 px-4 text-center font-semibold text-purple-400">{s.evaluationsCount}</td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedStudentForTimeline(s);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 font-bold text-[11px] transition-all cursor-pointer"
                              >
                                Timeline & Analytics →
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Organizations Overview */}
        {activeTab === 'organizations' && (
          <div className="space-y-4">
            {organizations.length === 0 ? (
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 space-y-2">
                <Building2 className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-400">No organizations registered yet</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Partner schools and organizations will be grouped and analyzed automatically once students input their school during onboarding.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {organizations.map((org) => {
                  const orgStudents = students.filter((s) => s.organization === org);
                  const orgStories = orgStudents.reduce((acc, s) => acc + s.storiesCount, 0);
                  const orgActiveSecs = orgStudents.reduce((acc, s) => acc + s.totalActiveSeconds, 0);
                  const orgEvaluations = orgStudents.reduce((acc, s) => acc + s.evaluationsCount, 0);
                  const avgActivePerStudent = orgStudents.length ? Math.round(orgActiveSecs / orgStudents.length / 60) : 0;

                  return (
                    <div key={org} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-indigo-400" />
                          <span>{org}</span>
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                          {orgStudents.length} Active Students
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-800/80">
                        <div className="bg-slate-950 p-2 rounded-xl">
                          <span className="text-[9px] uppercase text-slate-400 block">Stories</span>
                          <span className="text-sm font-bold text-sky-400">{orgStories}</span>
                        </div>
                        <div className="bg-slate-950 p-2 rounded-xl">
                          <span className="text-[9px] uppercase text-slate-400 block">Evaluations</span>
                          <span className="text-sm font-bold text-purple-400">{orgEvaluations}</span>
                        </div>
                        <div className="bg-slate-950 p-2 rounded-xl">
                          <span className="text-[9px] uppercase text-slate-400 block">Avg Active</span>
                          <span className="text-sm font-bold text-amber-400">{avgActivePerStudent}m</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Feature Usage & Engagement */}
        {activeTab === 'features' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Feature Usage Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Feature Usage Breakdown</span>
              </h3>

              <div className="space-y-2 text-xs">
                {featureUsageBreakdown.map((item, idx) => (
                  <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{item.feature}</span>
                      <span className="font-mono text-indigo-400 font-bold">{item.uses} uses</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Writing Engagement Stats */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Writing Engagement & Feedback Acceptance</span>
              </h3>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 block font-bold">Total Stories Created</span>
                  <p className="text-2xl font-bold text-white mt-1">{totalStoriesCount}</p>
                  <span className="text-[10px] text-emerald-400">{totalStoriesCount > 0 ? `${totalStoriesCount} student stories` : 'No stories saved yet'}</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 block font-bold">Total AI Evaluations</span>
                  <p className="text-2xl font-bold text-white mt-1">{totalEvaluationsCount}</p>
                  <span className="text-[10px] text-indigo-400">{totalEvaluationsCount > 0 ? 'Writing feedback requests' : 'No evaluations requested yet'}</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 block font-bold">Avg Active Session Time</span>
                  <p className="text-2xl font-bold text-white mt-1">{totalSessionsCount > 0 ? `${(totalActiveMinutes / totalSessionsCount).toFixed(1)}m` : '0m'}</p>
                  <span className="text-[10px] text-amber-400">per student session</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 block font-bold">Total Student Sessions</span>
                  <p className="text-2xl font-bold text-white mt-1">{totalSessionsCount}</p>
                  <span className="text-[10px] text-sky-400">{totalSessionsCount > 0 ? 'Sessions recorded' : 'No sessions recorded yet'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Story Sparks Repository & Image Management */}
        {activeTab === 'images' && (
          <div className="space-y-6">
            {/* Top Bar with Metrics & Add Button */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Story Sparks Repository Management ({sparksList.length} total sparks)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Curate, add new prompts, edit guided questions & story starters, and feature top sparks for students.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAddingSpark(true)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Story Spark</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={sparkSearchQuery}
                  onChange={(e) => setSparkSearchQuery(e.target.value)}
                  placeholder="Search sparks by title, prompt text, keywords..."
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Category Filter */}
              <select
                value={sparkCategoryFilter}
                onChange={(e) => setSparkCategoryFilter(e.target.value)}
                className="w-full sm:w-auto px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Categories ({sparksList.length})</option>
                {IMAGE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.name}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={sparkStatusFilter}
                onChange={(e) => setSparkStatusFilter(e.target.value as any)}
                className="w-full sm:w-auto px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Sparks</option>
                <option value="featured">⭐ Featured Only</option>
                <option value="custom">✨ Custom Admin Added</option>
              </select>
            </div>

            {/* Sparks Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredSparks.map((spark) => (
                <div
                  key={spark.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group hover:border-slate-700 transition-all"
                >
                  {/* Hero Image */}
                  <div className="h-40 relative overflow-hidden bg-slate-950">
                    <img
                      src={spark.imageUrl}
                      alt={spark.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Category Tag */}
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/90 text-slate-200 border border-slate-700 backdrop-blur-xs flex items-center gap-1">
                      <span>{spark.emoji}</span>
                      <span>{spark.categoryLabel || spark.tag}</span>
                    </span>

                    {/* Featured Star Toggle */}
                    <button
                      onClick={() => handleToggleFeaturedSpark(spark.id)}
                      className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        spark.isFeatured
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'bg-slate-900/80 text-slate-400 hover:text-amber-400'
                      }`}
                      title={spark.isFeatured ? 'Featured on home' : 'Click to feature on home'}
                    >
                      <Star className={`w-3.5 h-3.5 ${spark.isFeatured ? 'fill-current' : ''}`} />
                    </button>

                    {/* Title Overlay */}
                    <div className="absolute bottom-2 left-2 right-2">
                      <h4 className="text-xs font-bold text-white line-clamp-1">{spark.title}</h4>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between text-xs">
                    <div className="space-y-1.5">
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {spark.prompt}
                      </p>

                      {spark.starterSentence && (
                        <p className="text-[10px] text-emerald-400 bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-900/50 line-clamp-1">
                          <span className="font-bold">Starter:</span> "{spark.starterSentence}"
                        </p>
                      )}

                      {/* Word Sparks */}
                      {spark.suggestedWords && spark.suggestedWords.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap pt-1">
                          {spark.suggestedWords.slice(0, 3).map((w, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
                            >
                              {w}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom Admin Actions */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <div className="text-[10px] text-indigo-400 font-mono">
                        <span>Picks: </span>
                        <span className="font-bold">{spark.timesSelected || 0}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingSpark(spark)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                          title="Edit Story Spark details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setSparkDeleteConfirmId(spark.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 transition-all cursor-pointer"
                          title="Delete Story Spark"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredSparks.length === 0 && (
              <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-4xl">🔍</span>
                <p className="text-sm font-bold text-white">No Story Sparks found</p>
                <p className="text-xs text-slate-400">Try adjusting your search terms or category filters.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Talk to Aashna Submissions */}
        {activeTab === 'talk_submissions' && (
          <div className="space-y-4">
            {/* Filter by Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Submissions & Session Requests ({talkSubmissions.length})
                </h3>
                <button
                  onClick={() => {
                    sounds.playPop();
                    refreshData();
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Reload submissions from storage"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-300 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Session Requested">Session Requested</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Submissions Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Student & Org</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Topic / Story Title</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {talkSubmissions.filter((s) => statusFilter === 'all' || s.status === statusFilter).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Mail className="w-8 h-8 text-slate-600" />
                          <p className="text-sm font-semibold text-slate-400">No submissions found</p>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            No student story submissions or 1-on-1 session requests recorded yet.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    talkSubmissions
                      .filter((s) => statusFilter === 'all' || s.status === statusFilter)
                      .map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-white">
                            <div>{sub.studentName}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{sub.organization}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                sub.type === 'story_share'
                                  ? 'bg-sky-500/20 text-sky-300'
                                  : 'bg-purple-500/20 text-purple-300'
                              }`}
                            >
                              {sub.type === 'story_share' ? '📖 Story Share' : '💬 Session Request'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-200 font-medium">
                            {sub.storyTitle || sub.topic || 'Message'}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{sub.submittedAt}</td>
                          <td className="py-3.5 px-4">
                            <select
                              value={sub.status}
                              onChange={(e) =>
                                handleUpdateStatus(sub.id, e.target.value as TalkToAashnaSubmission['status'])
                              }
                              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none"
                            >
                              <option value="New">🟡 New</option>
                              <option value="Reviewed">🔵 Reviewed</option>
                              <option value="Session Requested">🟣 Session Requested</option>
                              <option value="Scheduled">🟢 Scheduled</option>
                              <option value="Completed">✅ Completed</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => {
                                sounds.playPop();
                                setSelectedTalkSubmission(sub);
                                setAdminNoteText(sub.adminNotes || '');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 font-bold text-[11px] transition-all cursor-pointer mr-1.5"
                            >
                              View & Reply →
                            </button>
                            <button
                              onClick={() => {
                                sounds.playPop();
                                analytics.deleteTalkSubmission(sub.id);
                                refreshData();
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                              title="Delete submission entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: User Feedback Management */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            {/* Feedback KPI Summaries */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Feedback</span>
                <p className="text-2xl font-bold text-white">{feedbacks.length}</p>
                <span className="text-[10px] text-indigo-400">All submissions</span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                  <span>🐞 Complaints</span>
                </span>
                <p className="text-2xl font-bold text-rose-300">
                  {feedbacks.filter((f) => f.category === 'complaint').length}
                </p>
                <span className="text-[10px] text-rose-400/80">Issues & bugs</span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1">
                  <span>⚠️ Concerns</span>
                </span>
                <p className="text-2xl font-bold text-orange-300">
                  {feedbacks.filter((f) => f.category === 'concern').length}
                </p>
                <span className="text-[10px] text-orange-400/80">Questions & clarity</span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <span>💡 Suggestions</span>
                </span>
                <p className="text-2xl font-bold text-amber-300">
                  {feedbacks.filter((f) => f.category === 'suggestion').length}
                </p>
                <span className="text-[10px] text-amber-400/80">Feature ideas</span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1">
                  <span>💖 Praise</span>
                </span>
                <p className="text-2xl font-bold text-pink-300">
                  {feedbacks.filter((f) => f.category === 'praise').length}
                </p>
                <span className="text-[10px] text-pink-400/80">Positive reviews</span>
              </div>
            </div>

            {/* Filter & Action Controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={feedbackSearchQuery}
                    onChange={(e) => setFeedbackSearchQuery(e.target.value)}
                    placeholder="Search feedback text, user, topic..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={feedbackCategoryFilter}
                  onChange={(e) => setFeedbackCategoryFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="complaint">🐞 Complaints</option>
                  <option value="concern">⚠️ Concerns</option>
                  <option value="suggestion">💡 Suggestions</option>
                  <option value="praise">💖 Praise</option>
                </select>

                {/* Status Filter */}
                <select
                  value={feedbackStatusFilter}
                  onChange={(e) => setFeedbackStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="New">🟡 New</option>
                  <option value="Under Review">🔵 Under Review</option>
                  <option value="Planned">🟣 Planned</option>
                  <option value="Resolved">🟢 Resolved</option>
                </select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleExportFeedbackCSV}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Export Feedback CSV</span>
                </button>
              </div>
            </div>

            {/* Feedback List Table */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">User & Role</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Topic & Rating</th>
                      <th className="py-3.5 px-4">Feedback Message</th>
                      <th className="py-3.5 px-4">Submitted</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {feedbacks.filter((f) => {
                      const matchCat = feedbackCategoryFilter === 'all' || f.category === feedbackCategoryFilter;
                      const matchStat = feedbackStatusFilter === 'all' || f.status === feedbackStatusFilter;
                      const matchQuery =
                        !feedbackSearchQuery.trim() ||
                        f.feedbackText.toLowerCase().includes(feedbackSearchQuery.toLowerCase()) ||
                        f.title.toLowerCase().includes(feedbackSearchQuery.toLowerCase()) ||
                        f.studentName.toLowerCase().includes(feedbackSearchQuery.toLowerCase()) ||
                        f.organization.toLowerCase().includes(feedbackSearchQuery.toLowerCase());
                      return matchCat && matchStat && matchQuery;
                    }).length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <MessageSquare className="w-8 h-8 text-slate-600" />
                            <p className="text-sm font-semibold text-slate-400">No feedback submissions found</p>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto">
                              No feedback or suggestions have been submitted yet.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      feedbacks
                        .filter((f) => {
                          const matchCat = feedbackCategoryFilter === 'all' || f.category === feedbackCategoryFilter;
                          const matchStat = feedbackStatusFilter === 'all' || f.status === feedbackStatusFilter;
                          const matchQuery =
                            !feedbackSearchQuery.trim() ||
                            f.feedbackText.toLowerCase().includes(feedbackSearchQuery.toLowerCase()) ||
                            f.title.toLowerCase().includes(feedbackSearchQuery.toLowerCase()) ||
                            f.studentName.toLowerCase().includes(feedbackSearchQuery.toLowerCase()) ||
                            f.organization.toLowerCase().includes(feedbackSearchQuery.toLowerCase());
                          return matchCat && matchStat && matchQuery;
                        })
                        .map((fb) => (
                          <tr key={fb.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-white flex items-center gap-1.5">
                                <span>{fb.studentName}</span>
                                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                                  {fb.userRole}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400">{fb.organization}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                  fb.category === 'complaint'
                                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                    : fb.category === 'concern'
                                    ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                                    : fb.category === 'praise'
                                    ? 'bg-pink-500/20 text-pink-300 border-pink-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                }`}
                              >
                                {fb.category === 'complaint'
                                  ? '🐞 Complaint'
                                  : fb.category === 'concern'
                                  ? '⚠️ Concern'
                                  : fb.category === 'praise'
                                  ? '💖 Praise'
                                  : '💡 Suggestion'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="text-white font-medium block">{fb.featureArea.split(' ')[0]}</span>
                              <span className="text-amber-400 font-mono text-[10px]">
                                {'★'.repeat(fb.rating)} ({fb.rating}/5)
                              </span>
                            </td>
                            <td className="py-3.5 px-4 max-w-xs">
                              <span className="font-bold text-white line-clamp-1">{fb.title}</span>
                              <p className="text-slate-400 line-clamp-2 text-[11px] leading-relaxed italic">
                                "{fb.feedbackText}"
                              </p>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                              {fb.submittedAt}
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={fb.status}
                                onChange={(e) =>
                                  handleUpdateFeedbackStatus(fb.id, e.target.value as FeedbackSubmission['status'])
                                }
                                className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none cursor-pointer"
                              >
                                <option value="New">🟡 New</option>
                                <option value="Under Review">🔵 Under Review</option>
                                <option value="Planned">🟣 Planned</option>
                                <option value="Resolved">🟢 Resolved</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <button
                                onClick={() => {
                                  sounds.playPop();
                                  setSelectedFeedback(fb);
                                  setFeedbackAdminNoteText(fb.adminNotes || '');
                                }}
                                className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 font-bold text-[11px] transition-all cursor-pointer mr-1.5"
                              >
                                Review & Notes →
                              </button>
                              <button
                                onClick={() => handleDeleteFeedback(fb.id)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                                title="Delete feedback entry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Individual Student Chronological Timeline Drawer/Modal */}
      {selectedStudentForTimeline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{selectedStudentForTimeline.avatarEmoji || '🌸'}</div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedStudentForTimeline.name}</h3>
                  <p className="text-xs text-slate-400">{selectedStudentForTimeline.organization}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudentForTimeline(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-4 gap-2 my-4 text-center">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[9px] uppercase text-slate-400 block font-bold">Sessions</span>
                <span className="text-base font-bold text-indigo-400">{selectedStudentForTimeline.sessionCount}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[9px] uppercase text-slate-400 block font-bold">Active Time</span>
                <span className="text-base font-bold text-amber-400">
                  {Math.round(selectedStudentForTimeline.totalActiveSeconds / 60)}m
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[9px] uppercase text-slate-400 block font-bold">Stories</span>
                <span className="text-base font-bold text-sky-400">{selectedStudentForTimeline.storiesCount}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[9px] uppercase text-slate-400 block font-bold">Evaluations</span>
                <span className="text-base font-bold text-purple-400">{selectedStudentForTimeline.evaluationsCount}</span>
              </div>
            </div>

            {/* Chronological Timeline */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Chronological Activity Timeline ⏱️
              </h4>

              <div className="relative pl-6 border-l-2 border-slate-800 space-y-4 text-xs">
                {events
                  .filter((e) => e.studentId === selectedStudentForTimeline.id || e.studentName === selectedStudentForTimeline.name)
                  .map((ev, idx) => (
                    <div key={ev.id || idx} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-slate-900 shadow-xs" />

                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{ev.eventName.replace(/_/g, ' ').toUpperCase()}</span>
                          <span className="font-mono text-[10px] text-slate-400">{ev.formattedTime || 'Recent'}</span>
                        </div>
                        {ev.feature && <p className="text-[11px] text-indigo-300">Feature: {ev.feature}</p>}
                        {ev.metadata && (
                          <div className="text-[10px] font-mono text-slate-400 bg-slate-900/60 p-1.5 rounded-md">
                            {JSON.stringify(ev.metadata)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Talk to Aashna Submission Detail Modal */}
      {selectedTalkSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl max-h-[85vh] bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col space-y-4 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">
                  {selectedTalkSubmission.type === 'story_share' ? 'Story Shared by' : 'Session Request from'}{' '}
                  {selectedTalkSubmission.studentName}
                </h3>
                <p className="text-xs text-slate-400">{selectedTalkSubmission.organization} • {selectedTalkSubmission.submittedAt}</p>
              </div>
              <button
                onClick={() => setSelectedTalkSubmission(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 text-xs">
              {selectedTalkSubmission.storyTitle && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Story Title:</span>
                  <p className="text-sm font-bold text-white">{selectedTalkSubmission.storyTitle}</p>
                </div>
              )}

              {selectedTalkSubmission.storyContent && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Story Content:</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-serif whitespace-pre-wrap">
                    {selectedTalkSubmission.storyContent}
                  </p>
                </div>
              )}

              {selectedTalkSubmission.message && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Student Note:</span>
                  <p className="text-xs text-indigo-300 italic">{selectedTalkSubmission.message}</p>
                </div>
              )}

              {selectedTalkSubmission.preferredAvailability && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Availability:</span>
                  <p className="text-xs text-amber-300 font-mono">{selectedTalkSubmission.preferredAvailability}</p>
                </div>
              )}

              {/* Admin Notes Editor */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-[10px] font-bold uppercase text-slate-400">
                  Admin Internal Notes / Feedback Record:
                </label>
                <textarea
                  rows={3}
                  value={adminNoteText}
                  onChange={(e) => setAdminNoteText(e.target.value)}
                  placeholder="Record your notes, session scheduling, or reply details..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => handleSaveAdminNote(selectedTalkSubmission.id)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Save Internal Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Feedback Detail Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl max-h-[85vh] bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col space-y-4 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div
                  className={`p-2 rounded-xl text-lg ${
                    selectedFeedback.category === 'complaint'
                      ? 'bg-rose-500/20 text-rose-300'
                      : selectedFeedback.category === 'concern'
                      ? 'bg-orange-500/20 text-orange-300'
                      : selectedFeedback.category === 'praise'
                      ? 'bg-pink-500/20 text-pink-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {selectedFeedback.category === 'complaint'
                    ? '🐞'
                    : selectedFeedback.category === 'concern'
                    ? '⚠️'
                    : selectedFeedback.category === 'praise'
                    ? '💖'
                    : '💡'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Feedback from {selectedFeedback.studentName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedFeedback.userRole.toUpperCase()} • {selectedFeedback.organization} • {selectedFeedback.submittedAt}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3.5 text-xs">
              {/* Category, Area, Rating Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Feature Area</span>
                  <span className="font-bold text-indigo-300">{selectedFeedback.featureArea}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Rating</span>
                  <span className="font-bold text-amber-400">
                    {'★'.repeat(selectedFeedback.rating)} ({selectedFeedback.rating}/5)
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Status</span>
                  <select
                    value={selectedFeedback.status}
                    onChange={(e) =>
                      handleUpdateFeedbackStatus(selectedFeedback.id, e.target.value as FeedbackSubmission['status'])
                    }
                    className="mt-0.5 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="New">🟡 New</option>
                    <option value="Under Review">🔵 Under Review</option>
                    <option value="Planned">🟣 Planned</option>
                    <option value="Resolved">🟢 Resolved</option>
                  </select>
                </div>
              </div>

              {/* Title & Message */}
              {selectedFeedback.title && (
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Subject / Topic:</span>
                  <p className="text-sm font-bold text-white">{selectedFeedback.title}</p>
                </div>
              )}

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Full User Feedback Message:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                  {selectedFeedback.feedbackText}
                </p>
              </div>

              {selectedFeedback.contactEmail && (
                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Contact Email:</span>
                    <span className="text-indigo-400 font-mono">{selectedFeedback.contactEmail}</span>
                  </div>
                  <a
                    href={`mailto:${selectedFeedback.contactEmail}?subject=${encodeURIComponent(
                      `[The Write Magic] Regarding your feedback: ${selectedFeedback.title}`
                    )}`}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Reply via Email</span>
                  </a>
                </div>
              )}

              {/* Admin Internal Resolution / Action Notes */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-[10px] font-bold uppercase text-slate-400">
                  Admin Resolution / Development Notes:
                </label>
                <textarea
                  rows={3}
                  value={feedbackAdminNoteText}
                  onChange={(e) => setFeedbackAdminNoteText(e.target.value)}
                  placeholder="Record development action items, planned fixes, or notes..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => handleSaveFeedbackNote(selectedFeedback.id)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer shadow-xs"
                  >
                    Save Notes & Status
                  </button>
                  <button
                    onClick={() => handleDeleteFeedback(selectedFeedback.id)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-rose-400 text-xs font-semibold cursor-pointer"
                  >
                    Delete Entry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Add New Story Spark */}
      {isAddingSpark && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Add New Story Spark</h3>
              </div>
              <button
                onClick={() => setIsAddingSpark(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Spark Title */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Spark Title *
              </label>
              <input
                type="text"
                value={newSparkForm.title}
                onChange={(e) => setNewSparkForm({ ...newSparkForm, title: e.target.value })}
                placeholder="e.g. The Treehouse Observatory"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Category & Emoji */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  value={newSparkForm.category}
                  onChange={(e) => {
                    const catObj = IMAGE_CATEGORIES.find((c) => c.id === e.target.value);
                    setNewSparkForm({
                      ...newSparkForm,
                      category: e.target.value,
                      tag: catObj?.name || 'Story',
                      emoji: catObj?.emoji || '✨',
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  {IMAGE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.emoji} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Tag / Label
                </label>
                <input
                  type="text"
                  value={newSparkForm.tag}
                  onChange={(e) => setNewSparkForm({ ...newSparkForm, tag: e.target.value })}
                  placeholder="e.g. Treehouse Magic"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Image URL *
              </label>
              <input
                type="text"
                value={newSparkForm.imageUrl}
                onChange={(e) => setNewSparkForm({ ...newSparkForm, imageUrl: e.target.value })}
                placeholder="Image path or URL..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
              {newSparkForm.imageUrl && (
                <div className="mt-2 h-32 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                  <img
                    src={newSparkForm.imageUrl}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="absolute bottom-1 right-2 text-[10px] bg-black/60 px-2 py-0.5 rounded text-slate-300">
                    Image Live Preview
                  </span>
                </div>
              )}
            </div>

            {/* Narrative Situation Prompt */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Story Prompt / Situation Narrative *
              </label>
              <textarea
                rows={2}
                value={newSparkForm.prompt}
                onChange={(e) => setNewSparkForm({ ...newSparkForm, prompt: e.target.value })}
                placeholder="Describe what is happening in the picture and ask a provocative question..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Optional Story Starter */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Optional Story Starter Sentence
              </label>
              <input
                type="text"
                value={newSparkForm.starterSentence}
                onChange={(e) => setNewSparkForm({ ...newSparkForm, starterSentence: e.target.value })}
                placeholder="e.g. As the clock struck midnight, the little lantern began to flicker..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Word Sparks (comma-separated) */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Suggested Word Sparks (comma separated)
              </label>
              <input
                type="text"
                value={newSparkForm.suggestedWords}
                onChange={(e) => setNewSparkForm({ ...newSparkForm, suggestedWords: e.target.value })}
                placeholder="e.g. telescope, constellation, whispering, starry, brass"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsAddingSpark(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewSpark}
                disabled={!newSparkForm.title.trim() || !newSparkForm.prompt.trim()}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Save Story Spark
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Story Spark */}
      {editingSpark && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Edit Story Spark: {editingSpark.title}</h3>
              </div>
              <button
                onClick={() => setEditingSpark(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Spark Title */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Spark Title
              </label>
              <input
                type="text"
                value={editingSpark.title}
                onChange={(e) => setEditingSpark({ ...editingSpark, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Image URL
              </label>
              <input
                type="text"
                value={editingSpark.imageUrl}
                onChange={(e) => setEditingSpark({ ...editingSpark, imageUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Prompt Narrative */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Prompt Situation
              </label>
              <textarea
                rows={2}
                value={editingSpark.prompt}
                onChange={(e) => setEditingSpark({ ...editingSpark, prompt: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Starter Sentence */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Story Starter Sentence
              </label>
              <input
                type="text"
                value={editingSpark.starterSentence || ''}
                onChange={(e) => setEditingSpark({ ...editingSpark, starterSentence: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingSpark(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditedSpark}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Delete Confirmation */}
      {sparkDeleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-2xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Delete Story Spark?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to remove this Story Spark from the student repository? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setSparkDeleteConfirmId(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSpark(sparkDeleteConfirmId)}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Yes, Delete Spark
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
