import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Mic, MicOff, Maximize2, Minimize2, Lightbulb, Clock, Check, Loader2, Tag, Calendar, Heart } from 'lucide-react';
import { JournalEntry } from '../types';
import { GUIDED_PROMPTS } from '../data/initialEntries';

interface JournalEditorProps {
  currentEntry: Partial<JournalEntry>;
  onUpdateEntry: (fields: Partial<JournalEntry>) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onSaveDraft: () => void;
}

const MOOD_OPTIONS = [
  { label: 'Calm & Centered', category: 'Calm', emoji: '🌿', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { label: 'Anxious & Overwhelmed', category: 'Anxiety', emoji: '🌪️', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  { label: 'Grateful & Joyful', category: 'Joy', emoji: '✨', color: 'bg-teal-50 text-teal-800 border-teal-200' },
  { label: 'Depleted & Fatigued', category: 'Fatigue', emoji: '🔋', color: 'bg-stone-100 text-stone-700 border-stone-300' },
  { label: 'Frustrated / Blocked', category: 'Anger', emoji: '⚡', color: 'bg-rose-50 text-rose-800 border-rose-200' },
  { label: 'Grounded Resolve', category: 'Resolve', emoji: '🏔️', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
];

export const JournalEditor: React.FC<JournalEditorProps> = ({
  currentEntry,
  onUpdateEntry,
  onAnalyze,
  isAnalyzing,
  onSaveDraft
}) => {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [showPrompts, setShowPrompts] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Analysis loading progress message simulator
  useEffect(() => {
    let timer: any;
    if (isAnalyzing) {
      setAnalysisStep(1);
      timer = setInterval(() => {
        setAnalysisStep(prev => (prev < 5 ? prev + 1 : prev));
      }, 1200);
    } else {
      setAnalysisStep(0);
    }
    return () => clearInterval(timer);
  }, [isAnalyzing]);

  // Voice speech-to-text dictation setup
  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser environment. You can type directly.');
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript + ' ';
          }
        }
        if (transcript) {
          const updatedContent = (currentEntry.content || '') + ' ' + transcript.trim();
          onUpdateEntry({
            content: updatedContent,
            wordCount: updatedContent.trim().split(/\s+/).filter(Boolean).length
          });
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const currentTags = currentEntry.tags || [];
      if (!currentTags.includes(tagInput.trim())) {
        onUpdateEntry({ tags: [...currentTags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = currentEntry.tags || [];
    onUpdateEntry({ tags: currentTags.filter(t => t !== tagToRemove) });
  };

  const contentText = currentEntry.content || '';
  const wordCount = contentText.trim().split(/\s+/).filter(Boolean).length;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  const ANALYSIS_STEPS = [
    'Initializing Gemini MindLog cognitive framework...',
    '1/5 Detecting core dominant emotional state & underlying need...',
    '2/5 Formulating two-sentence executive synthesis...',
    '3/5 Mapping 3-5 recurring life themes & tensions...',
    '4/5 Identifying cognitive distortions & drafting CBT reframe...',
    '5/5 Generating tomorrow’s intentional reflection prompt...'
  ];

  return (
    <div className={`transition-all duration-300 ${isFocusMode ? 'fixed inset-0 z-50 bg-stone-50 p-6 md:p-12 overflow-y-auto' : 'w-full'}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Editor Controls Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-stone-500 text-xs font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {currentEntry.date
                  ? new Date(currentEntry.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : 'Today'}
              </span>
            </div>
            <span className="text-stone-300">|</span>
            <div className="flex items-center gap-1 text-stone-500 text-xs font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>{wordCount} words • ~{readTimeMin} min read</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Guided Prompt Helper Trigger */}
            <button
              type="button"
              onClick={() => setShowPrompts(!showPrompts)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors border border-stone-200"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>{showPrompts ? 'Hide Prompts' : 'Guided Prompts'}</span>
            </button>

            {/* Voice Dictation */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse shadow-sm'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
              }`}
              title="Voice Speech to Text"
            >
              {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              <span>{isRecording ? 'Listening...' : 'Dictate'}</span>
            </button>

            {/* Focus Mode Toggle */}
            <button
              type="button"
              onClick={() => setIsFocusMode(!isFocusMode)}
              className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-200/70 border border-stone-200 transition-colors"
              title={isFocusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
            >
              {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Guided Prompts Drawer / Accordion */}
        {showPrompts && (
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Socratic Reflection Starters</span>
              </h4>
              <span className="text-[11px] text-amber-700">Click to insert into your entry</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {GUIDED_PROMPTS.map((gp, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    const addition = `\n\n**${gp.prompt}**\n`;
                    onUpdateEntry({
                      content: (currentEntry.content || '') + addition,
                      wordCount: ((currentEntry.content || '') + addition).trim().split(/\s+/).filter(Boolean).length
                    });
                  }}
                  className="text-left p-2.5 rounded-lg bg-white/80 hover:bg-white border border-amber-200/80 text-xs text-stone-800 transition-all hover:border-amber-400 group"
                >
                  <span className="font-semibold text-amber-900 block mb-0.5">{gp.category}</span>
                  <span className="text-stone-600 group-hover:text-stone-900">{gp.prompt}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Writing Card */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 md:p-8 space-y-6">
          
          {/* Title Input */}
          <div>
            <input
              id="entry-title-input"
              type="text"
              placeholder="Title your reflection or day's event..."
              value={currentEntry.title || ''}
              onChange={(e) => onUpdateEntry({ title: e.target.value })}
              className="w-full text-2xl md:text-3xl font-serif font-semibold text-stone-900 placeholder:text-stone-300 border-none outline-hidden focus:ring-0 px-0 bg-transparent"
            />
          </div>

          {/* Emotional Weather / Pre-Reflection Check-in */}
          <div className="pt-2 pb-2 border-y border-stone-100 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-stone-400" />
                <span>Immediate Felt Emotion</span>
              </span>
              {/* Energy Level 1-5 */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500">Energy (1-5):</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => onUpdateEntry({ energyLevel: lvl })}
                      className={`w-6 h-6 rounded-md text-xs font-semibold transition-all ${
                        (currentEntry.energyLevel || 3) === lvl
                          ? 'bg-teal-800 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {MOOD_OPTIONS.map((mood) => {
                const isSelected = currentEntry.rawMood === mood.label;
                return (
                  <button
                    key={mood.label}
                    type="button"
                    onClick={() => onUpdateEntry({ rawMood: isSelected ? undefined : mood.label })}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      isSelected
                        ? `${mood.color} ring-2 ring-teal-700/30 font-semibold shadow-xs`
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>{mood.emoji}</span>
                    <span>{mood.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Textarea Writing Canvas */}
          <div>
            <textarea
              id="entry-content-textarea"
              ref={textareaRef}
              rows={isFocusMode ? 18 : 12}
              placeholder="Unload your thoughts openly. What happened today? What thoughts or feelings arose? Write freely without judgment; Gemini MindLog will help break down emotional frameworks, cognitive distortions, and life themes..."
              value={currentEntry.content || ''}
              onChange={(e) => {
                const val = e.target.value;
                onUpdateEntry({
                  content: val,
                  wordCount: val.trim().split(/\s+/).filter(Boolean).length
                });
              }}
              className="w-full text-stone-800 text-base md:text-lg leading-relaxed placeholder:text-stone-300 border-none outline-hidden focus:ring-0 px-0 resize-y bg-transparent"
            />
          </div>

          {/* Tags & Categorical Anchors */}
          <div className="pt-4 border-t border-stone-100 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-xs font-semibold text-stone-500">Tags:</span>
              {(currentEntry.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-stone-400 hover:text-stone-700 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Add tag (Press Enter)..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="text-xs bg-stone-50 border border-stone-200 rounded-full px-3 py-1 outline-hidden focus:border-teal-600 focus:bg-white text-stone-800"
              />
            </div>
          </div>
        </div>

        {/* Action Panel: Gemini MindLog AI Evaluation */}
        <div className="bg-gradient-to-br from-teal-950 via-teal-900 to-stone-900 rounded-2xl p-6 text-stone-100 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-300" />
                <h3 className="font-serif text-lg font-semibold text-stone-50">Gemini MindLog Diagnostic Engine</h3>
              </div>
              <p className="text-xs text-teal-200/80 leading-relaxed max-w-xl">
                Evaluates emotional frameworks, detects cognitive distortions (CBT), extracts recurring life themes, and drafts tomorrow's reflection prompt.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="btn-save-draft"
                type="button"
                onClick={onSaveDraft}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-800/60 hover:bg-teal-800 text-teal-100 border border-teal-700 transition-colors"
              >
                Save Entry
              </button>

              <button
                id="btn-evaluate-gemini"
                type="button"
                disabled={isAnalyzing || !contentText.trim()}
                onClick={onAnalyze}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md ${
                  isAnalyzing || !contentText.trim()
                    ? 'bg-teal-700/50 text-teal-300/50 cursor-not-allowed'
                    : 'bg-teal-400 hover:bg-teal-300 text-teal-950 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-teal-950" />
                    <span>Evaluating Frameworks...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-teal-950" />
                    <span>{currentEntry.analysis ? 'Re-Evaluate with AI Coach' : 'Evaluate with Gemini MindLog'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Step-by-step progress banner during analysis */}
          {isAnalyzing && (
            <div className="pt-3 border-t border-teal-800/80 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-teal-300 animate-ping" />
              <span className="text-xs font-mono text-teal-200">
                {ANALYSIS_STEPS[analysisStep] || 'Evaluating cognitive structures...'}
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
