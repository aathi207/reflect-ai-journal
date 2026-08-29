import React, { useState } from 'react';
import { 
  Sparkles, 
  Brain, 
  Layers, 
  Compass, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check, 
  Share2, 
  Flame, 
  ShieldAlert, 
  Lightbulb, 
  Heart,
  ChevronRight,
  TrendingUp,
  BookmarkPlus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CoachAnalysis, JournalEntry } from '../types';

interface AnalysisViewProps {
  analysis: CoachAnalysis;
  entry: JournalEntry;
  onOpenCoachChat: () => void;
  onUsePromptForTomorrow: (prompt: string) => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  analysis,
  entry,
  onOpenCoachChat,
  onUsePromptForTomorrow,
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [completedMicroStep, setCompletedMicroStep] = useState(false);
  const [activeThemeIndex, setActiveThemeIndex] = useState<number | null>(null);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(analysis.tomorrowReflectionPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleToggleMicroStep = () => {
    const next = !completedMicroStep;
    setCompletedMicroStep(next);
    if (next) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">Constructive</span>;
      case 'tension':
        return <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">Emotional Friction</span>;
      default:
        return <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">Neutral Observation</span>;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Top Header Banner: Diagnosis Overview & Growth Score */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 shadow-lg border border-stone-800 relative overflow-hidden">
        {/* Subtle decorative background tint */}
        <div 
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: analysis.dominantEmotion?.color || '#0d9488' }}
        />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-mono text-teal-400 font-semibold">Gemini MindLog Diagnostic Report</span>
                <span className="text-stone-500">•</span>
                <span className="text-xs text-stone-400">{new Date(analysis.analyzedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Behavioral & Emotional Synthesis
              </h2>
            </div>

            {/* Growth & Mindfulness Metric */}
            <div className="flex items-center gap-3 bg-stone-800/80 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-stone-700/80 w-fit">
              <div className="w-10 h-10 rounded-xl bg-teal-900/60 border border-teal-500/30 flex items-center justify-center text-teal-300 font-bold font-mono">
                {analysis.growthScore || 85}
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-stone-400 block font-semibold">Growth Index</span>
                <span className="text-xs text-teal-300 font-medium">Reflective Depth</span>
              </div>
            </div>
          </div>

          {/* Supportive Empathy Anchor Note */}
          {analysis.empathyNote && (
            <div className="p-4 rounded-2xl bg-stone-800/60 border border-stone-700/60 flex items-start gap-3">
              <Heart className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-sm text-stone-200 leading-relaxed italic">
                "{analysis.empathyNote}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 1. Core Dominant Emotional State */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 md:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold font-mono">1</span>
            <h3 className="font-serif text-lg font-bold text-stone-900">Core Dominant Emotional State</h3>
          </div>
          <span className="text-xs font-medium text-stone-500">Beyond Surface Expressions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
          {/* Emotion Badge Card */}
          <div className="md:col-span-5 p-5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">Detected Framework</span>
              <span className="text-xl font-serif font-bold text-stone-900 block">
                {analysis.dominantEmotion?.name || 'Reflective Inquiry'}
              </span>
              <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                Category: {analysis.dominantEmotion?.category || 'Introspection'}
              </span>
            </div>

            {/* Intensity Scale 1-10 */}
            <div className="space-y-1.5 pt-2 border-t border-stone-200/60">
              <div className="flex justify-between text-xs text-stone-600 font-medium">
                <span>Psychological Intensity</span>
                <span className="font-mono font-bold text-stone-800">{analysis.dominantEmotion?.intensity || 7}/10</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 bg-teal-700"
                  style={{ width: `${((analysis.dominantEmotion?.intensity || 7) / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Underlying Need Callout */}
          <div className="md:col-span-7 p-5 rounded-xl bg-teal-50/60 border border-teal-200/80 flex flex-col justify-center space-y-2">
            <span className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-teal-700" />
              <span>Signaled Underlying Psychological Need</span>
            </span>
            <p className="text-sm md:text-base text-stone-800 leading-relaxed font-medium">
              {analysis.dominantEmotion?.underlyingNeed || 'Safe space for deliberate decompression and mental validation.'}
            </p>
            <p className="text-xs text-teal-800/80 leading-normal">
              Recognizing this need allows you to respond with targeted self-compassion instead of automatic stress behaviors.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Executive Synthesis (Two-Sentence Rule) */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 md:p-7 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold font-mono">2</span>
            <h3 className="font-serif text-lg font-bold text-stone-900">Executive Synthesis of the Day</h3>
          </div>
          <span className="text-xs font-mono text-stone-400">Strict Two-Sentence Diagnosis</span>
        </div>

        <div className="p-5 rounded-xl bg-stone-50 border-l-4 border-l-teal-700 border-y border-r border-stone-200">
          <blockquote className="font-serif text-base sm:text-lg text-stone-800 leading-relaxed italic">
            "{analysis.executiveSynthesis}"
          </blockquote>
        </div>
      </div>

      {/* 3. Recurring Life Themes or Categorical Topics */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 md:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs font-bold font-mono">3</span>
            <h3 className="font-serif text-lg font-bold text-stone-900">Recurring Life Themes & Topics</h3>
          </div>
          <span className="text-xs text-stone-500">{analysis.recurringThemes?.length || 3} Categorical Patterns Detected</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(analysis.recurringThemes || []).map((themeItem, idx) => {
            const isExpanded = activeThemeIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveThemeIndex(isExpanded ? null : idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isExpanded
                    ? 'bg-stone-50 border-stone-400 shadow-xs'
                    : 'bg-white hover:bg-stone-50/70 border-stone-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-semibold text-stone-500 uppercase">{themeItem.category}</span>
                    <h4 className="font-serif font-bold text-stone-900 text-base">{themeItem.theme}</h4>
                  </div>
                  {getImpactBadge(themeItem.impact)}
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {themeItem.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. CBT Cognitive Reframing Insight */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 md:p-7 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center text-xs font-bold font-mono">4</span>
            <h3 className="font-serif text-lg font-bold text-stone-900">CBT Cognitive Reframing Insight</h3>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Distortion: {analysis.cognitiveReframing?.detectedDistortion || 'Cognitive Filter'}</span>
          </span>
        </div>

        {/* Before vs After Perspective Shift */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Automatic Unhelpful Thought */}
          <div className="p-4 sm:p-5 rounded-xl bg-rose-50/50 border border-rose-200/80 space-y-2">
            <span className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Original Automatic Thought</span>
            </span>
            <p className="text-sm text-stone-800 leading-relaxed italic bg-white/70 p-3 rounded-lg border border-rose-100">
              "{analysis.cognitiveReframing?.originalThoughtPattern || 'I should have done everything flawlessly.'}"
            </p>
          </div>

          {/* Compassionate CBT Reframe */}
          <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-emerald-700" />
              <span>Constructive Reframed Perspective</span>
            </span>
            <p className="text-sm text-stone-800 leading-relaxed font-medium bg-white/80 p-3 rounded-lg border border-emerald-100">
              {analysis.cognitiveReframing?.reframedPerspective || 'Growth is an iterative practice; honoring your limits is a sign of wisdom.'}
            </p>
          </div>
        </div>

        {/* Behavioral Micro-Step Card */}
        {analysis.cognitiveReframing?.behavioralMicroStep && (
          <div className="p-4 sm:p-5 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Immediate 2-Minute Behavioral Micro-Step</span>
              </span>
              <p className="text-sm text-stone-800 leading-relaxed">
                {analysis.cognitiveReframing.behavioralMicroStep}
              </p>
            </div>

            <button
              id="btn-complete-microstep"
              type="button"
              onClick={handleToggleMicroStep}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                completedMicroStep
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white hover:bg-stone-100 text-amber-950 border border-amber-300'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${completedMicroStep ? 'text-emerald-200' : 'text-stone-400'}`} />
              <span>{completedMicroStep ? 'Practiced & Anchored!' : 'Mark as Practiced'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 5. Single Deeply Intentional Reflection Prompt for Tomorrow */}
      <div className="bg-gradient-to-br from-teal-900 to-stone-900 text-stone-100 rounded-2xl p-6 md:p-8 shadow-md space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-400 text-teal-950 flex items-center justify-center text-xs font-bold font-mono">5</span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-white">Tomorrow's Intentional Reflection Prompt</h3>
          </div>
          <span className="text-xs text-teal-300 uppercase tracking-wider font-semibold">Personal Growth Anchor</span>
        </div>

        <div className="p-5 rounded-xl bg-stone-800/90 border border-teal-600/30 space-y-3">
          <p className="font-serif text-lg sm:text-xl text-teal-100 leading-relaxed font-medium">
            "{analysis.tomorrowReflectionPrompt}"
          </p>
        </div>

        {/* Action triggers */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              id="btn-copy-reflection-prompt"
              type="button"
              onClick={handleCopyPrompt}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-200 border border-stone-700 transition-colors"
            >
              {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPrompt ? 'Copied to Clipboard' : 'Copy Prompt'}</span>
            </button>

            <button
              id="btn-use-tomorrow-prompt"
              type="button"
              onClick={() => onUsePromptForTomorrow(analysis.tomorrowReflectionPrompt)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-700 text-xs font-medium text-teal-100 border border-teal-600 transition-colors"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-teal-300" />
              <span>Set as Tomorrow's Journal Starter</span>
            </button>
          </div>

          <button
            id="btn-discuss-with-coach"
            type="button"
            onClick={onOpenCoachChat}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-teal-950 text-xs font-bold tracking-wide transition-all shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Discuss in Socratic Dialogue</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
