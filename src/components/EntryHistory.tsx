import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Tag, 
  Star, 
  ChevronRight, 
  Sparkles, 
  Clock, 
  Brain, 
  Trash2, 
  FileText,
  Filter,
  Plus
} from 'lucide-react';
import { JournalEntry } from '../types';

interface EntryHistoryProps {
  entries: JournalEntry[];
  selectedEntryId: string | null;
  onSelectEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onNewEntry: () => void;
}

export const EntryHistory: React.FC<EntryHistoryProps> = ({
  entries,
  selectedEntryId,
  onSelectEntry,
  onDeleteEntry,
  onToggleFavorite,
  onNewEntry
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedMoodCategory, setSelectedMoodCategory] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = Array.from(new Set(entries.flatMap(e => e.tags || [])));
  const allMoods = Array.from(new Set(entries.map(e => e.analysis?.dominantEmotion?.category || e.rawMood).filter(Boolean)));

  const filteredEntries = entries.filter(e => {
    const matchesSearch = 
      (e.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.content || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.analysis?.executiveSynthesis || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = !selectedTag || (e.tags && e.tags.includes(selectedTag));
    const matchesMood = !selectedMoodCategory || 
      (e.analysis?.dominantEmotion?.category === selectedMoodCategory || e.rawMood === selectedMoodCategory);

    return matchesSearch && matchesTag && matchesMood;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-mono text-teal-800 font-bold">Chronological Archive</span>
          <h2 className="font-serif text-3xl font-bold text-stone-900">Journal Reflections Timeline</h2>
        </div>

        <button
          id="btn-timeline-new-entry"
          type="button"
          onClick={onNewEntry}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-stone-50 text-xs font-semibold shadow-xs transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Draft New Entry</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 bg-stone-50 rounded-xl px-3 py-2 border border-stone-200 focus-within:border-teal-600">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            id="timeline-search-input"
            type="text"
            placeholder="Search entries, keywords, CBT reframes, or syntheses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 outline-hidden border-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-stone-400 hover:text-stone-700 px-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-stone-400 font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Tags:</span>
          </span>
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
              !selectedTag ? 'bg-teal-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All ({entries.length})
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
                selectedTag === tag ? 'bg-teal-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 space-y-3">
            <FileText className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="font-serif text-lg text-stone-700 font-semibold">No journal entries found</p>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              Try adjusting your search query or start writing a fresh reflection in the Studio.
            </p>
            <button
              type="button"
              onClick={onNewEntry}
              className="px-4 py-2 rounded-xl bg-teal-800 text-stone-50 text-xs font-medium"
            >
              Write First Reflection
            </button>
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const isSelected = selectedEntryId === entry.id;
            return (
              <div
                key={entry.id}
                onClick={() => onSelectEntry(entry)}
                className={`group p-5 md:p-6 rounded-2xl border transition-all cursor-pointer bg-white relative ${
                  isSelected
                    ? 'border-teal-600 ring-2 ring-teal-700/20 shadow-sm'
                    : 'border-stone-200 hover:border-stone-400 hover:shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span>•</span>
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{entry.wordCount || 0} words</span>
                      {entry.analysis && (
                        <>
                          <span>•</span>
                          <span className="text-teal-700 font-semibold flex items-center gap-1 font-mono text-[11px]">
                            <Sparkles className="w-3 h-3 text-teal-600" />
                            <span>Growth: {entry.analysis.growthScore}/100</span>
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900 group-hover:text-teal-900 transition-colors">
                      {entry.title || 'Untitled Journal Entry'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Emotion pill */}
                    {entry.analysis?.dominantEmotion ? (
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-100 text-stone-800 border border-stone-200">
                        {entry.analysis.dominantEmotion.name}
                      </span>
                    ) : entry.rawMood ? (
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-100 text-stone-700">
                        {entry.rawMood}
                      </span>
                    ) : null}

                    {/* Favorite toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(entry.id);
                      }}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-amber-500 transition-colors"
                      title={entry.isFavorite ? 'Remove favorite' : 'Mark favorite'}
                    >
                      <Star className={`w-4 h-4 ${entry.isFavorite ? 'text-amber-500 fill-amber-500' : ''}`} />
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to delete this reflection?')) {
                          onDeleteEntry(entry.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-stone-300 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content snippet or 2-sentence executive synthesis */}
                <div className="space-y-2 mb-4">
                  {entry.analysis?.executiveSynthesis ? (
                    <p className="text-xs sm:text-sm text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200/70 italic leading-relaxed">
                      "{entry.analysis.executiveSynthesis}"
                    </p>
                  ) : (
                    <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                      {entry.content}
                    </p>
                  )}
                </div>

                {/* Tags & Action row */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(entry.tags || []).map(t => (
                      <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-teal-800 font-semibold group-hover:translate-x-0.5 transition-transform">
                    <span>{entry.analysis ? 'View AI Synthesis' : 'Open in Studio'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
