import React from 'react';
import { BookOpen, Sparkles, TrendingUp, MessageSquare, Cloud, Plus, Flame } from 'lucide-react';

interface NavbarProps {
  activeTab: 'editor' | 'timeline' | 'analytics' | 'coach';
  setActiveTab: (tab: 'editor' | 'timeline' | 'analytics' | 'coach') => void;
  onNewEntry: () => void;
  onOpenSync: () => void;
  streakCount: number;
  totalEntriesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onNewEntry,
  onOpenSync,
  streakCount,
  totalEntriesCount
}) => {
  return (
    <header className="sticky top-0 z-30 bg-stone-50/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('editor')}>
            <div className="w-10 h-10 rounded-xl bg-teal-800 text-stone-100 flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold tracking-tight text-stone-900">Gemini MindLog</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                  AI Behavioral Coach
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">Personal Growth & Cognitive Reframing Journal</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-200/70 p-1 rounded-xl">
            <button
              id="nav-tab-editor"
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'editor'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-teal-700" />
              <span>Studio</span>
            </button>
            <button
              id="nav-tab-timeline"
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'timeline'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
              </span>
              <span>Timeline</span>
              <span className="text-xs bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded-md font-mono">{totalEntriesCount}</span>
            </button>
            <button
              id="nav-tab-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>Longitudinal Analytics</span>
            </button>
            <button
              id="nav-tab-coach"
              onClick={() => setActiveTab('coach')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'coach'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-indigo-700" />
              <span>Socratic Dialogue</span>
            </button>
          </nav>

          {/* Right Action Group */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold" title={`${streakCount} day journaling reflection streak`}>
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>{streakCount}d streak</span>
            </div>

            {/* Cloud sync modal trigger */}
            <button
              id="btn-open-cloud-sync"
              onClick={onOpenSync}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 border border-stone-200 transition-colors"
              title="Cloud & Local Backup Sync"
            >
              <Cloud className="w-4 h-4" />
            </button>

            {/* Write new entry button */}
            <button
              id="btn-new-entry-header"
              onClick={onNewEntry}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-900 text-stone-50 text-sm font-medium transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Entry</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-stone-200/60">
          <button
            onClick={() => setActiveTab('editor')}
            className={`text-xs font-medium px-2 py-1 rounded-md ${activeTab === 'editor' ? 'bg-teal-800 text-white' : 'text-stone-600'}`}
          >
            Studio
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`text-xs font-medium px-2 py-1 rounded-md ${activeTab === 'timeline' ? 'bg-teal-800 text-white' : 'text-stone-600'}`}
          >
            Timeline ({totalEntriesCount})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`text-xs font-medium px-2 py-1 rounded-md ${activeTab === 'analytics' ? 'bg-teal-800 text-white' : 'text-stone-600'}`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('coach')}
            className={`text-xs font-medium px-2 py-1 rounded-md ${activeTab === 'coach' ? 'bg-teal-800 text-white' : 'text-stone-600'}`}
          >
            Coach
          </button>
        </div>
      </div>
    </header>
  );
};
