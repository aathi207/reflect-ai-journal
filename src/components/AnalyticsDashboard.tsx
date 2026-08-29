import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Brain, 
  Heart, 
  Award, 
  Calendar, 
  Flame, 
  ShieldCheck, 
  Compass, 
  Loader2,
  RefreshCw,
  Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';
import { JournalEntry, WeeklySynthesis } from '../types';

interface AnalyticsDashboardProps {
  entries: JournalEntry[];
  streakCount: number;
}

const EMOTION_COLORS: Record<string, string> = {
  Joy: '#10b981',
  Calm: '#0d9488',
  Anxiety: '#f59e0b',
  Sadness: '#6366f1',
  Anger: '#ef4444',
  Overwhelm: '#8b5cf6',
  Fatigue: '#78716c',
  Hope: '#06b6d4',
  Gratitude: '#14b8a6',
  Resolve: '#0f766e',
};

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  entries,
  streakCount
}) => {
  const [weeklyDigest, setWeeklyDigest] = useState<WeeklySynthesis | null>(null);
  const [isLoadingDigest, setIsLoadingDigest] = useState(false);

  // Compute stats
  const totalWords = entries.reduce((acc, e) => acc + (e.wordCount || 0), 0);
  const evaluatedCount = entries.filter(e => !!e.analysis).length;
  const avgGrowthScore = evaluatedCount > 0 
    ? Math.round(entries.filter(e => !!e.analysis).reduce((acc, e) => acc + (e.analysis?.growthScore || 80), 0) / evaluatedCount) 
    : 85;

  // Emotional category distribution
  const emotionMap: Record<string, number> = {};
  entries.forEach(e => {
    const category = e.analysis?.dominantEmotion?.category || 'Calm';
    emotionMap[category] = (emotionMap[category] || 0) + 1;
  });

  const emotionPieData = Object.keys(emotionMap).map(key => ({
    name: key,
    value: emotionMap[key]
  }));

  // Timeline progression
  const timelineData = [...entries].reverse().map(e => ({
    date: new Date(e.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    growthScore: e.analysis?.growthScore || 80,
    intensity: e.analysis?.dominantEmotion?.intensity || 5,
    title: e.title || 'Entry'
  }));

  // Cognitive distortions detected
  const distortionMap: Record<string, number> = {};
  entries.forEach(e => {
    if (e.analysis?.cognitiveReframing?.detectedDistortion) {
      const dist = e.analysis.cognitiveReframing.detectedDistortion;
      distortionMap[dist] = (distortionMap[dist] || 0) + 1;
    }
  });

  const distortionData = Object.keys(distortionMap).map(key => ({
    name: key.length > 22 ? key.slice(0, 20) + '...' : key,
    count: distortionMap[key]
  })).sort((a, b) => b.count - a.count);

  // Recurring themes aggregation
  const themeMap: Record<string, number> = {};
  entries.forEach(e => {
    (e.analysis?.recurringThemes || []).forEach(t => {
      themeMap[t.theme] = (themeMap[t.theme] || 0) + 1;
    });
  });

  const themeData = Object.keys(themeMap).map(key => ({
    name: key.length > 25 ? key.slice(0, 23) + '...' : key,
    count: themeMap[key]
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  const handleGenerateWeeklyDigest = async () => {
    setIsLoadingDigest(true);
    try {
      const res = await fetch('/api/gemini/weekly-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries })
      });
      const data = await res.json();
      setWeeklyDigest(data);
    } catch (err) {
      console.error('Error generating weekly digest:', err);
    } finally {
      setIsLoadingDigest(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-mono text-teal-800 font-bold">Longitudinal Psychological Trends</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-stone-900">Personal Growth & Cognitive Analytics</h2>
        </div>

        <button
          id="btn-generate-weekly-digest"
          type="button"
          onClick={handleGenerateWeeklyDigest}
          disabled={isLoadingDigest || entries.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-stone-50 text-xs font-semibold transition-all shadow-xs disabled:opacity-50"
        >
          {isLoadingDigest ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Synthesizing Longitudinal Digest...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Generate AI Longitudinal Digest</span>
            </>
          )}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Reflection Streak</span>
            <Flame className="w-4 h-4" />
          </div>
          <p className="text-2xl font-serif font-bold text-stone-900">{streakCount} Days</p>
          <p className="text-[11px] text-stone-500">Consistent self-awareness</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-teal-700">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Avg Growth Index</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-2xl font-serif font-bold text-stone-900">{avgGrowthScore}/100</p>
          <p className="text-[11px] text-teal-700 font-medium">Reflective clarity metric</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-indigo-600">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">AI Diagnoses</span>
            <Brain className="w-4 h-4" />
          </div>
          <p className="text-2xl font-serif font-bold text-stone-900">{evaluatedCount} / {entries.length}</p>
          <p className="text-[11px] text-stone-500">Cognitive evaluations logged</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Words</span>
            <Calendar className="w-4 h-4" />
          </div>
          <p className="text-2xl font-serif font-bold text-stone-900">{totalWords.toLocaleString()}</p>
          <p className="text-[11px] text-stone-500">Mindful journaling volume</p>
        </div>
      </div>

      {/* AI Longitudinal Weekly Growth Digest */}
      {weeklyDigest && (
        <div className="bg-gradient-to-br from-stone-900 to-teal-950 text-stone-100 rounded-3xl p-6 sm:p-8 shadow-md border border-stone-800 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-300" />
              <h3 className="font-serif text-xl font-bold text-white">Longitudinal Behavioral Growth Digest</h3>
            </div>
            <span className="text-xs font-mono text-teal-300 bg-teal-900/60 px-3 py-1 rounded-full border border-teal-700/50">
              {weeklyDigest.timeframe}
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-stone-800/80 border border-stone-700 space-y-1">
              <span className="text-[11px] font-mono text-teal-400 uppercase tracking-wider block font-semibold">Dominant Macro Trajectory</span>
              <p className="font-serif text-lg text-white font-semibold">{weeklyDigest.dominantTrend}</p>
              <p className="text-sm text-stone-300 leading-relaxed pt-1">{weeklyDigest.overallSynthesis}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-stone-800/60 border border-stone-700/70 space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>CBT Cognitive Reframing Evolution</span>
                </span>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {weeklyDigest.cbtGrowthInsight}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-800/60 border border-stone-700/70 space-y-2">
                <span className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-teal-300" />
                  <span>Recommended Focus Area</span>
                </span>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {weeklyDigest.recommendedFocusArea}
                </p>
              </div>
            </div>

            {weeklyDigest.celebrationNote && (
              <div className="p-3.5 rounded-xl bg-teal-900/40 border border-teal-700/40 text-xs text-teal-200 italic">
                ✨ "{weeklyDigest.celebrationNote}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Growth Index & Emotional Intensity Progression */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-stone-900 text-lg">Growth & Intensity Velocity</h3>
            <span className="text-xs text-stone-500">Timeline Progression</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <XAxis dataKey="date" stroke="#a8a29e" fontSize={11} tickLine={false} />
                <YAxis stroke="#a8a29e" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c1917', borderRadius: '12px', border: '1px solid #44403c', color: '#f5f5f4', fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="growthScore" 
                  name="Growth Score" 
                  stroke="#0d9488" 
                  strokeWidth={2.5}
                  dot={{ fill: '#0d9488', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dominant Emotional Frameworks Distribution */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-stone-900 text-lg">Emotional Frameworks</h3>
            <span className="text-xs text-stone-500">Categorical Distribution</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {emotionPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={emotionPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {emotionPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={EMOTION_COLORS[entry.name] || '#0d9488'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1c1917', borderRadius: '12px', border: '1px solid #44403c', color: '#f5f5f4', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-stone-400">Log entries to map emotional framework distribution.</p>
            )}
          </div>
        </div>

        {/* Recurring Life Themes Frequency */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-stone-900 text-lg">Top Recurring Life Themes</h3>
            <span className="text-xs text-stone-500">Frequent Focus Areas</span>
          </div>

          <div className="h-64 w-full">
            {themeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={themeData} layout="vertical">
                  <XAxis type="number" stroke="#a8a29e" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="#a8a29e" fontSize={10} width={140} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1c1917', borderRadius: '12px', border: '1px solid #44403c', color: '#f5f5f4', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" name="Frequency" fill="#0f766e" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-stone-400">
                Themes will emerge as Gemini MindLog evaluates your journal entries.
              </div>
            )}
          </div>
        </div>

        {/* Cognitive Distortions Reframed */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-stone-900 text-lg">CBT Distortions Reframed</h3>
            <span className="text-xs text-stone-500">Cognitive Flexibility</span>
          </div>

          <div className="h-64 w-full">
            {distortionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distortionData} layout="vertical">
                  <XAxis type="number" stroke="#a8a29e" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="#a8a29e" fontSize={10} width={140} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1c1917', borderRadius: '12px', border: '1px solid #44403c', color: '#f5f5f4', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" name="Reframed" fill="#f59e0b" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-stone-400">
                Cognitive distortion patterns will be logged upon AI evaluation.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
