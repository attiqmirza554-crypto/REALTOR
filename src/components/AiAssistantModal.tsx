import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, Building, Phone, Calendar, RefreshCw, User } from 'lucide-react';
import { SiteSettings } from '../types';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

interface AiAssistantModalProps {
  settings: SiteSettings;
  isOpen: boolean;
  onClose: () => void;
  onOpenBookVisit?: () => void;
}

export default function AiAssistantModal({
  settings,
  isOpen,
  onClose,
  onOpenBookVisit
}: AiAssistantModalProps) {
  const agencyName = settings.companyName || 'Aura Haven Real Estate';
  const city = settings.targetCity || 'Waterloo';
  const state = settings.targetState || 'ON';
  const phone = settings.contactPhone || '+1 (519) 555-0199';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `Hello! I am Aura AI, your personal luxury real estate advisor for ${agencyName} in ${city}, ${state}.\n\nHow can I help you today? You can ask about our featured properties, book a private tour, or inquire about property values!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      let botReply = '';
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
            clientSettings: settings
          })
        });
        if (res.ok) {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await res.json();
            if (data.reply) botReply = data.reply;
          }
        }
      } catch (apiErr) {
        // API not available on static host
      }

      if (!botReply) {
        const qLower = query.toLowerCase();
        if (qLower.includes('price') || qLower.includes('cost') || qLower.includes('budget')) {
          botReply = `Our luxury estates range from $12,500,000 to over $45,000,000. For custom pricing or private off-market listings, please call us directly at ${phone}.`;
        } else if (qLower.includes('visit') || qLower.includes('tour') || qLower.includes('book') || qLower.includes('schedule')) {
          botReply = `We would be delighted to arrange a private tour or helicopter transfer. Click the 'Book Visit' button at the top or leave your contact details here!`;
        } else if (qLower.includes('location') || qLower.includes('where') || qLower.includes('office')) {
          botReply = `${agencyName} operates flagship offices in Beverly Hills, Manhattan, and Paso Robles. Contact our advisory team at ${phone} or ${settings.contactEmail}.`;
        } else {
          botReply = `Thank you for contacting ${agencyName}. I am your 24/7 AI Luxury Concierge. How may I assist with your estate search or private consultation today? You can also reach our lead advisor directly at ${phone}.`;
        }
      }

      const botMsg: Message = {
        id: `msg-bot-${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: `msg-bot-err-${Date.now()}`,
        sender: 'bot',
        text: `I apologize for the brief delay. Please feel free to call our direct agency line at ${phone} or click "Book Visit" above!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[92%] sm:w-[420px] h-[580px] max-h-[85vh] bg-slate-950/95 border border-[#D4AF37]/40 rounded-2xl shadow-2xl backdrop-blur-2xl text-white flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
      {/* Header Bar */}
      <div className="px-4 py-3 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full"></span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Aura AI Assistant</span>
              <span className="px-2 py-0.2 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-mono">
                24/7 Concierge
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {agencyName} • {city}, {state}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Close AI Chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 custom-scrollbar bg-slate-950/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400 font-mono">
              <span>{msg.sender === 'user' ? 'You' : 'Aura AI'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex flex-col items-start">
            <div className="bg-slate-900 border border-slate-800 text-slate-400 rounded-2xl rounded-tl-none px-3.5 py-2.5 text-xs flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>Aura AI is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Pills */}
      <div className="px-3 py-2 bg-slate-900/60 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => handleSendMessage(`Show featured luxury homes in ${city}`)}
          className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[11px] text-amber-300 font-medium transition-colors flex items-center gap-1"
        >
          <Building className="w-3 h-3" />
          <span>Featured Homes</span>
        </button>
        {onOpenBookVisit && (
          <button
            onClick={() => {
              onOpenBookVisit();
              onClose();
            }}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-[11px] text-amber-300 font-medium transition-colors flex items-center gap-1"
          >
            <Calendar className="w-3 h-3 text-amber-400" />
            <span>Book Tour</span>
          </button>
        )}
        <button
          onClick={() => handleSendMessage(`What are the agency phone number and address?`)}
          className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[11px] text-slate-300 font-medium transition-colors flex items-center gap-1"
        >
          <Phone className="w-3 h-3" />
          <span>Contact Info</span>
        </button>
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Ask Aura AI about homes in ${city}...`}
          className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-800 focus:border-[#D4AF37] rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || loading}
          className="p-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-bold rounded-xl transition-all shadow-md shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
