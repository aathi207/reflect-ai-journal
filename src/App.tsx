import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { JournalEditor } from './components/JournalEditor';
import { AnalysisView } from './components/AnalysisView';
import { CoachChatDrawer } from './components/CoachChatDrawer';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { EntryHistory } from './components/EntryHistory';
import { CloudSyncModal } from './components/CloudSyncModal';
import { JournalEntry } from './types';
import { INITIAL_JOURNAL_ENTRIES } from './data/initialEntries';
import { Sparkles, BookOpen, AlertCircle, ArrowLeft } from 'lucide-react';

const STORAGE_KEY = 'gemini_mindlog_entries_v1';

export default function App() {
  // Load entries from localStorage or pre-populated sample entries
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load from localStorage, initializing samples:', e);
    }
    return INITIAL_JOURNAL_ENTRIES;
  });

  const [activeTab, setActiveTab] = useState<'editor' | 'timeline' | 'analytics' | 'coach'>('editor');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(entries[0]?.id || null);
  
  // Current draft in the editor
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>(() => {
    return entries[0] ? { ...entries[0] } : {
      id: 'draft-' + Date.now(),
      date: new Date().toISOString(),
      title: '',
      content: '',
      tags: [],
      wordCount: 0
    };
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCoachChatOpen, setIsCoachChatOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync to localStorage whenever entries change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (err) {
      console.warn('Failed to save to localStorage:', err);
    }
  }, [entries]);

  // Calculate journal streak
  const calculateStreak = (): number => {
    if (entries.length === 0) return 0;
    const dates = entries
      .map(e => new Date(e.date).toDateString())
      .filter((val, idx, arr) => arr.indexOf(val) === idx);
    
    // Sort descending
    dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    return Math.max(1, dates.length);
  };

  const handleUpdateCurrentEntry = (fields: Partial<JournalEntry>) => {
    setCurrentEntry(prev => ({
      ...prev,
      ...fields
    }));
  };

  const handleSaveDraft = () => {
    const entryId = currentEntry.id || 'entry-' + Date.now();
    const finalizedEntry: JournalEntry = {
      id: entryId,
      date: currentEntry.date || new Date().toISOString(),
      title: currentEntry.title || 'Untitled Journal Entry',
      content: currentEntry.content || '',
      rawMood: currentEntry.rawMood,
      energyLevel: currentEntry.energyLevel,
      tags: currentEntry.tags || [],
      wordCount: (currentEntry.content || '').trim().split(/\s+/).filter(Boolean).length,
      analysis: currentEntry.analysis,
      isFavorite: currentEntry.isFavorite
    };

    setEntries(prev => {
      const existsIndex = prev.findIndex(e => e.id === entryId);
      if (existsIndex >= 0) {
        const next = [...prev];
        next[existsIndex] = finalizedEntry;
        return next;
      }
      return [finalizedEntry, ...prev];
    });

    setSelectedEntryId(entryId);
  };

  const handleNewEntry = () => {
    const newDraft: Partial<JournalEntry> = {
      id: 'entry-' + Date.now(),
      date: new Date().toISOString(),
      title: '',
      content: '',
      tags: [],
      wordCount: 0,
      energyLevel: 3
    };
    setCurrentEntry(newDraft);
    setSelectedEntryId(newDraft.id!);
    setActiveTab('editor');
  };

  const handleSelectEntry = (entry: JournalEntry) => {
    setSelectedEntryId(entry.id);
    setCurrentEntry({ ...entry });
    setActiveTab('editor');
  };

  const handleDeleteEntry = (id: string) => {
    const next = entries.filter(e => e.id !== id);
    setEntries(next);
    if (selectedEntryId === id) {
      if (next.length > 0) {
        setSelectedEntryId(next[0].id);
        setCurrentEntry({ ...next[0] });
      } else {
        handleNewEntry();
      }
    }
  };

  const handleToggleFavorite = (id: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, isFavorite: !e.isFavorite } : e));
    if (currentEntry.id === id) {
      setCurrentEntry(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
    }
  };

  const handleAnalyze = async () => {
    if (!currentEntry.content || currentEntry.content.trim().length === 0) {
      setErrorMessage('Please write some thoughts before running the AI evaluation.');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/gemini/analyze-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentEntry.title,
          content: currentEntry.content,
          rawMood: currentEntry.rawMood,
          energyLevel: currentEntry.energyLevel,
          date: currentEntry.date
        })
      });

      const data = await response.json();

      if (data.analysis) {
        const updatedEntry: JournalEntry = {
          id: currentEntry.id || 'entry-' + Date.now(),
          date: currentEntry.date || new Date().toISOString(),
          title: currentEntry.title || 'Untitled Journal Entry',
          content: currentEntry.content || '',
          rawMood: currentEntry.rawMood,
          energyLevel: currentEntry.energyLevel,
          tags: currentEntry.tags || [],
          wordCount: (currentEntry.content || '').trim().split(/\s+/).filter(Boolean).length,
          analysis: data.analysis,
          isFavorite: currentEntry.isFavorite
        };

        setCurrentEntry(updatedEntry);

        setEntries(prev => {
          const idx = prev.findIndex(e => e.id === updatedEntry.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = updatedEntry;
            return next;
          }
          return [updatedEntry, ...prev];
        });
      } else {
        throw new Error(data.error || 'Failed to complete behavioral analysis.');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'An error occurred while evaluating your entry with Gemini.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUsePromptForTomorrow = (prompt: string) => {
    const newDraft: Partial<JournalEntry> = {
      id: 'entry-' + Date.now(),
      date: new Date(Date.now() + 86400000).toISOString(),
      title: `Reflection: ${prompt.slice(0, 45)}...`,
      content: `**Intentional Prompt from Yesterday's Coach Evaluation:**\n"${prompt}"\n\n`,
      tags: ['Intentional Reflection'],
      wordCount: 0,
      energyLevel: 3
    };
    setCurrentEntry(newDraft);
    setSelectedEntryId(newDraft.id!);
    setActiveTab('editor');
  };

  const handleResetToSample = () => {
    setEntries(INITIAL_JOURNAL_ENTRIES);
    setSelectedEntryId(INITIAL_JOURNAL_ENTRIES[0].id);
    setCurrentEntry({ ...INITIAL_JOURNAL_ENTRIES[0] });
  };

  const handleImportEntries = (imported: JournalEntry[]) => {
    setEntries(imported);
    if (imported.length > 0) {
      setSelectedEntryId(imported[0].id);
      setCurrentEntry({ ...imported[0] });
    }
  };

  const selectedFullEntry = entries.find(e => e.id === currentEntry.id) || (currentEntry as JournalEntry);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'coach') {
            setIsCoachChatOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onNewEntry={handleNewEntry}
        onOpenSync={() => setIsSyncModalOpen(true)}
        streakCount={calculateStreak()}
        totalEntriesCount={entries.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        
        {/* Error alert toast if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm font-medium flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-rose-600 hover:text-rose-900 font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab 1: Studio & AI Diagnostic View */}
        {activeTab === 'editor' && (
          <div className="space-y-12">
            <JournalEditor
              currentEntry={currentEntry}
              onUpdateEntry={handleUpdateCurrentEntry}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              onSaveDraft={handleSaveDraft}
            />

            {/* Render Diagnosis View if current entry has been evaluated */}
            {currentEntry.analysis && (
              <div className="pt-6 border-t border-stone-200">
                <AnalysisView
                  analysis={currentEntry.analysis}
                  entry={selectedFullEntry}
                  onOpenCoachChat={() => setIsCoachChatOpen(true)}
                  onUsePromptForTomorrow={handleUsePromptForTomorrow}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Chronological Timeline Archive */}
        {activeTab === 'timeline' && (
          <EntryHistory
            entries={entries}
            selectedEntryId={selectedEntryId}
            onSelectEntry={handleSelectEntry}
            onDeleteEntry={handleDeleteEntry}
            onToggleFavorite={handleToggleFavorite}
            onNewEntry={handleNewEntry}
          />
        )}

        {/* Tab 3: Longitudinal Growth Analytics */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            entries={entries}
            streakCount={calculateStreak()}
          />
        )}
      </main>

      {/* Floating Socratic Coach Dialogue Drawer */}
      <CoachChatDrawer
        isOpen={isCoachChatOpen}
        onClose={() => setIsCoachChatOpen(false)}
        currentEntry={selectedFullEntry}
      />

      {/* Cloud Sync & Export Modal */}
      <CloudSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        entries={entries}
        onImportEntries={handleImportEntries}
        onResetToSample={handleResetToSample}
      />

      {/* Footer */}
      <footer className="border-t border-stone-200/80 bg-stone-100/50 py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium text-stone-700">
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            <span>Gemini MindLog • Empathetic AI Behavioral Growth Journal</span>
          </div>
          <p className="text-[11px] text-stone-400">
            CBT Cognitive Reframing • Emotional Frameworks • Longitudinal Personal Analytics
          </p>
        </div>
      </footer>

    </div>
  );
}
