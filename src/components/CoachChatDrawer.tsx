import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, MessageSquare, Bot, User, Loader2, Lightbulb, CornerDownLeft, RefreshCw } from 'lucide-react';
import { CoachChatMessage, JournalEntry } from '../types';

interface CoachChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentEntry?: JournalEntry;
}

export const CoachChatDrawer: React.FC<CoachChatDrawerProps> = ({
  isOpen,
  onClose,
  currentEntry
}) => {
  const [messages, setMessages] = useState<CoachChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello. I am **Gemini MindLog**, your personal growth journal assistant and behavioral coach.\n\nI'm here to provide a safe, non-judgmental space to explore your thoughts, unpack cognitive distortions, or practice cognitive reframing together. What is on your mind right now?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        "Help me unpack the emotional tension from today",
        "How do I prevent catastrophizing next time?",
        "Can we practice a 2-minute breathing grounding exercise?"
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // When opening on a specific entry, inject an initial contextual greeting if appropriate
  useEffect(() => {
    if (currentEntry?.analysis && messages.length === 1) {
      setMessages([
        {
          id: 'welcome-context',
          sender: 'assistant',
          text: `Welcome. I have reviewed your entry **"${currentEntry.title || 'Untitled'}"**.\n\nI noticed a core emotional state of **${currentEntry.analysis.dominantEmotion.name}** and identified a reframe around *${currentEntry.analysis.cognitiveReframing.detectedDistortion}*.\n\nHow does this reflection sit with you right now?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedActions: [
            "Let's explore the underlying psychological need",
            "Help me apply the behavioral micro-step",
            "Why do I default to this cognitive pattern?"
          ]
        }
      ]);
    }
  }, [currentEntry?.id]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: CoachChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ sender: m.sender, text: m.text })),
          entryContext: currentEntry ? {
            title: currentEntry.title,
            content: currentEntry.content,
            analysis: currentEntry.analysis
          } : undefined
        })
      });

      const data = await response.json();

      const assistantMsg: CoachChatMessage = {
        id: 'assistant-' + Date.now(),
        sender: 'assistant',
        text: data.reply || 'I am listening with you. Let’s take a breath and explore what truly matters most in this moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: data.suggestedActions || [
          "How can I practice self-compassion here?",
          "What is the next constructive step?"
        ]
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Error communicating with coach:', err);
      setMessages(prev => [
        ...prev,
        {
          id: 'error-' + Date.now(),
          sender: 'assistant',
          text: 'I am here with you. While my server connection refreshed, remember to anchor yourself in self-compassion: what would you say to a cherished friend experiencing this?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'reset-' + Date.now(),
        sender: 'assistant',
        text: 'Session reset. What area of personal growth or behavioral clarity would you like to explore today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          "I want to explore an emotional reaction",
          "Help me examine a recurring thought loop",
          "Give me an intentional evening reflection"
        ]
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[480px] bg-stone-900 text-stone-100 shadow-2xl border-l border-stone-800 flex flex-col animate-slideInRight">
      
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-900/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-800 text-teal-200 flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4 text-teal-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-white text-base">Gemini MindLog Coach</h3>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-teal-900/80 text-teal-300 border border-teal-700/50">
                Socratic AI
              </span>
            </div>
            <p className="text-xs text-stone-400">Non-judgmental behavioral & CBT guidance</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleClearChat}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
            title="Reset Dialogue"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
            title="Close Coach"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Active Entry Context Pill */}
      {currentEntry && (
        <div className="px-4 py-2 bg-stone-800/80 border-b border-stone-700/50 flex items-center justify-between text-xs text-stone-300">
          <span className="truncate max-w-[300px]">
            Anchored to: <strong className="text-teal-300 font-normal">"{currentEntry.title || 'Current Entry'}"</strong>
          </span>
          <span className="text-[10px] font-mono text-stone-400">
            {currentEntry.analysis?.dominantEmotion?.name || 'In Progress'}
          </span>
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
          >
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-mono">
              {msg.sender === 'assistant' ? (
                <>
                  <Bot className="w-3 h-3 text-teal-400" />
                  <span>Gemini MindLog</span>
                </>
              ) : (
                <>
                  <span>You</span>
                  <User className="w-3 h-3 text-stone-400" />
                </>
              )}
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[90%] ${
                msg.sender === 'user'
                  ? 'bg-teal-700 text-white rounded-tr-xs'
                  : 'bg-stone-800 text-stone-100 border border-stone-700/70 rounded-tl-xs'
              }`}
            >
              <div className="whitespace-pre-wrap space-y-2">
                {msg.text}
              </div>
            </div>

            {/* Socratic Suggested Actions */}
            {msg.suggestedActions && msg.suggestedActions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1.5 max-w-[95%]">
                {msg.suggestedActions.map((action, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendMessage(action)}
                    className="text-left text-[11px] px-2.5 py-1 rounded-full bg-stone-800/90 hover:bg-stone-700 text-teal-200 border border-stone-700/80 transition-colors"
                  >
                    ✨ {action}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-stone-400 p-3 bg-stone-800/50 rounded-xl border border-stone-700/50 w-fit">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
            <span>Gemini MindLog is reflecting deeply...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-stone-800 bg-stone-900/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-stone-800 rounded-xl p-1.5 border border-stone-700 focus-within:border-teal-500"
        >
          <input
            id="coach-chat-input"
            type="text"
            placeholder="Ask a question, share a reflection, or request CBT reframing..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 border-none outline-hidden focus:ring-0"
          />
          <button
            id="btn-send-coach-msg"
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="p-2 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-stone-950 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
