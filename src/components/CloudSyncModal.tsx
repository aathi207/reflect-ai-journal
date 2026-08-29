import React, { useState } from 'react';
import { 
  X, 
  Cloud, 
  Download, 
  Upload, 
  RefreshCw, 
  Database, 
  Check, 
  AlertCircle, 
  FileJson, 
  FileText,
  ShieldCheck
} from 'lucide-react';
import { JournalEntry } from '../types';
import { INITIAL_JOURNAL_ENTRIES } from '../data/initialEntries';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: JournalEntry[];
  onImportEntries: (entries: JournalEntry[]) => void;
  onResetToSample: () => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  entries,
  onImportEntries,
  onResetToSample
}) => {
  const [copiedMsg, setCopiedMsg] = useState('');
  const [importError, setImportError] = useState('');

  if (!isOpen) return null;

  const totalWords = entries.reduce((acc, e) => acc + (e.wordCount || 0), 0);
  const totalAnalyses = entries.filter(e => !!e.analysis).length;

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `gemini_mindlog_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setCopiedMsg('JSON backup successfully exported!');
    setTimeout(() => setCopiedMsg(''), 3000);
  };

  const handleExportMarkdown = () => {
    let md = `# Gemini MindLog - Personal Growth Journal Archive\nGenerated on: ${new Date().toLocaleString()}\n\n`;
    entries.forEach((entry, i) => {
      md += `## ${entry.title || 'Untitled Entry'}\n`;
      md += `*Date:* ${new Date(entry.date).toLocaleDateString()} | *Mood:* ${entry.analysis?.dominantEmotion?.name || entry.rawMood || 'N/A'}\n`;
      md += `*Tags:* ${(entry.tags || []).join(', ')}\n\n`;
      md += `### Journal Entry\n${entry.content}\n\n`;
      if (entry.analysis) {
        md += `### Gemini MindLog AI Analysis\n`;
        md += `- **Dominant Emotional State:** ${entry.analysis.dominantEmotion.name} (${entry.analysis.dominantEmotion.intensity}/10)\n`;
        md += `- **Underlying Need:** ${entry.analysis.dominantEmotion.underlyingNeed}\n`;
        md += `- **Executive Synthesis:** ${entry.analysis.executiveSynthesis}\n`;
        md += `- **CBT Cognitive Reframe:** ${entry.analysis.cognitiveReframing.reframedPerspective}\n`;
        md += `- **Behavioral Micro-Step:** ${entry.analysis.cognitiveReframing.behavioralMicroStep}\n`;
        md += `- **Tomorrow's Reflection Prompt:** ${entry.analysis.tomorrowReflectionPrompt}\n`;
      }
      md += `\n---\n\n`;
    });

    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(md);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `gemini_mindlog_journal_${new Date().toISOString().slice(0, 10)}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setCopiedMsg('Markdown archive successfully exported!');
    setTimeout(() => setCopiedMsg(''), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError('');
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportEntries(parsed);
          setCopiedMsg(`Successfully imported ${parsed.length} entries!`);
          setTimeout(() => {
            setCopiedMsg('');
            onClose();
          }, 1500);
        } else {
          setImportError('Invalid format: File does not contain an array of entries.');
        }
      } catch (err) {
        setImportError('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center border border-teal-200">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-stone-900">Cloud Sync & Data Vault</h3>
              <p className="text-xs text-stone-500">Secure client persistence, data export & imports</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Local & Cloud Storage Status */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-teal-700" />
              <span>Storage Telemetry</span>
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Synced Locally & Server Ready</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-2.5 rounded-xl bg-white border border-stone-200/80">
              <span className="block font-serif font-bold text-lg text-stone-900">{entries.length}</span>
              <span className="text-[11px] text-stone-500">Total Entries</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-stone-200/80">
              <span className="block font-serif font-bold text-lg text-teal-800">{totalAnalyses}</span>
              <span className="text-[11px] text-stone-500">AI Diagnoses</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-stone-200/80">
              <span className="block font-serif font-bold text-lg text-stone-900">{totalWords.toLocaleString()}</span>
              <span className="text-[11px] text-stone-500">Words Written</span>
            </div>
          </div>
        </div>

        {/* Export & Backup Actions */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
            Export & Backup Options
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleExportJSON}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-stone-200 hover:border-teal-700 hover:bg-teal-50/40 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                <FileJson className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-xs text-stone-900 block group-hover:text-teal-900">Download JSON Vault</span>
                <span className="text-[11px] text-stone-500">Full backup with all AI diagnoses</span>
              </div>
            </button>

            <button
              type="button"
              onClick={handleExportMarkdown}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-stone-200 hover:border-teal-700 hover:bg-teal-50/40 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-xs text-stone-900 block group-hover:text-teal-900">Export Markdown</span>
                <span className="text-[11px] text-stone-500">Readable journal archive</span>
              </div>
            </button>
          </div>
        </div>

        {/* Import Backup */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
            Restore / Import Data
          </span>
          <label className="flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-stone-300 hover:border-teal-600 hover:bg-stone-50 transition-colors cursor-pointer text-xs text-stone-600 font-medium">
            <Upload className="w-4 h-4 text-stone-400" />
            <span>Select JSON backup file to import</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Feedback notices */}
        {copiedMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-2 border border-emerald-200">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{copiedMsg}</span>
          </div>
        )}

        {importError && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs font-medium flex items-center gap-2 border border-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{importError}</span>
          </div>
        )}

        {/* Reset / Preload Sample Data */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs text-stone-400">Want to explore with sample reflections?</span>
          <button
            type="button"
            onClick={() => {
              if (confirm('Load pre-evaluated sample journal entries? Current unbacked entries will be merged.')) {
                onResetToSample();
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-teal-800 hover:text-teal-950 font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Preload Sample Entries</span>
          </button>
        </div>

      </div>
    </div>
  );
};
