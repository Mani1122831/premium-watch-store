import { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Minus,
  RotateCcw,
  Send,
  User,
  AlertCircle,
  Mic,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ChatProductCard from './ChatProductCard';
import Toast from '../common/Toast';
import { queryClientConcierge } from '../../services/clientConcierge';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  products?: Array<{
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    category?: string;
    gender?: string;
    collection?: string;
    description?: string;
    image: string;
    movement?: string;
    material?: string;
    features?: string[];
    rating?: number;
  }>;
  timestamp: string;
}

const SUGGESTED_QUESTIONS = [
  'Show me gold watches',
  'What watches are under ₹30,000?',
  'Which watch is good for office?',
  'Tell me about Meridian Classic Gold',
  'Compare automatic and quartz watches',
  'What is your warranty policy?',
];

export default function ChatWidget() {
  const { isAuthenticated, user, token } = useAuth();
  const [isOpen, setIsOpen] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const chatParam = new URLSearchParams(window.location.search).get('chat');
        if (chatParam === 'open' || chatParam === 'products') return true;
      }
    } catch {
      /* ignore */
    }
    return false;
  });
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string>(() => {
    return 'conv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
  });

  const getGreeting = () => {
    if (isAuthenticated && user?.name) {
      const firstName = user.name.split(' ')[0];
      return `Welcome back, ${firstName}! How can I help you find your perfect TITANOVA watch?`;
    }
    return 'Welcome to TITANOVA. I am your personal horological concierge. How may I assist your search for the perfect timepiece today?';
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('chat') === 'products') {
        return [
          {
            id: 'msg_welcome',
            sender: 'ai',
            text: 'Welcome to TITANOVA. I am your personal horological concierge. How may I assist your search for the perfect timepiece today?',
            timestamp: '01:15 pm',
          },
          {
            id: 'msg_user_gold',
            sender: 'user',
            text: 'Show me gold watches under ₹30,000',
            timestamp: '01:16 pm',
          },
          {
            id: 'msg_ai_gold',
            sender: 'ai',
            text: 'Our gold timepieces celebrate warmth, heritage, and prestigious horology. Crafted with 18K Gold PVD coatings, sapphire crystal glass, and precision calibres, here are our premier gold selections:',
            products: [
              {
                id: 'p001',
                name: 'Meridian Classic Gold',
                price: 24999,
                category: 'Analog',
                collection: 'Classic',
                image: '/images/watches/men-1.jpg',
                movement: 'Swiss Calibre Quartz',
                material: '316L Stainless Steel with 18K Gold PVD coating',
                features: ['Swiss quartz movement', 'Anti-reflective sapphire crystal glass', '18K Gold PVD'],
                rating: 4.8,
              },
              {
                id: 'p006',
                name: 'Lumiere Blanc Dress',
                price: 18999,
                category: 'Analog',
                collection: 'Classic',
                image: '/images/watches/women-1.jpg',
                movement: 'Japanese Precision Quartz',
                material: 'Gold-plated surgical stainless steel',
                features: ['Japanese quartz movement', 'White lacquered dial', 'Gold-plated case'],
                rating: 4.7,
              },
            ],
            timestamp: '01:16 pm',
          },
        ];
      }
      const saved = localStorage.getItem('titanova_chat_cache');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      /* ignore */
    }
    return [
      {
        id: 'msg_welcome',
        sender: 'ai',
        text: getGreeting(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync greeting when auth state changes on fresh session
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'msg_welcome') {
        return [
          {
            id: 'msg_welcome',
            sender: 'ai',
            text: getGreeting(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];
      }
      return prev;
    });
  }, [isAuthenticated, user?.name]);

  // Persist cache locally
  useEffect(() => {
    try {
      localStorage.setItem('titanova_chat_cache', JSON.stringify(messages));
    } catch {
      /* ignore */
    }
  }, [messages]);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  // Listen for open-chat event from Header
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsMinimized(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    };
    window.addEventListener('titanova:open-chat', handleOpen);
    return () => window.removeEventListener('titanova:open-chat', handleOpen);
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    setErrorBanner(null);
    setInputValue('');

    const userMessage: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      let res: Response | null = null;
      const chatPayload = JSON.stringify({
        message: text,
        conversationId,
        history: messages.slice(-6).map(m => ({ sender: m.sender, text: m.text })),
      });

      // Quick check against backend with 3.5s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      try {
        res = await fetch('/api/chat', {
          method: 'POST',
          headers,
          body: chatPayload,
          signal: controller.signal,
        });
      } catch {
        try {
          res = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers,
            body: chatPayload,
            signal: controller.signal,
          });
        } catch {
          res = null;
        }
      } finally {
        clearTimeout(timeoutId);
      }

      if (res && res.ok) {
        const data = await res.json();

        if (data.conversationId) {
          setConversationId(data.conversationId);
        }

        const aiMessage: ChatMessage = {
          id: 'ai_' + Date.now(),
          sender: 'ai',
          text: data.message || 'I have curated these options from our atelier:',
          products: data.products || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prev => [...prev, aiMessage]);
        return;
      }

      // If backend responded with non-ok or empty, use client concierge
      const clientResult = queryClientConcierge(text);
      const aiFallbackMessage: ChatMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: clientResult.message,
        products: clientResult.products,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiFallbackMessage]);
    } catch {
      // Remote unavailable, fall through to client concierge
      const clientResult = queryClientConcierge(text);
      const aiFallbackMessage: ChatMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: clientResult.message,
        products: clientResult.products,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiFallbackMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleClearConversation = () => {
    const freshWelcome: ChatMessage = {
      id: 'msg_welcome_' + Date.now(),
      sender: 'ai',
      text: getGreeting(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([freshWelcome]);
    setConversationId('conv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6));
    localStorage.removeItem('titanova_chat_cache');
    setErrorBanner(null);
  };

  const toggleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={toggleOpen}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 p-3 sm:px-4 sm:py-3 bg-charcoal-950 text-white rounded-full shadow-2xl border border-gold-500/40 hover:border-gold-400 hover:bg-black transition-all duration-300 hover:scale-105 cursor-pointer"
          aria-label="Open TITANOVA AI Shopping Assistant"
        >
          <div className="relative">
            <span className="absolute -inset-1 rounded-full bg-gold-500/30 animate-ping opacity-75" />
            <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-gold-600 to-gold-400 flex items-center justify-center text-charcoal-950">
              <Sparkles className="w-4 h-4 fill-charcoal-950" />
            </div>
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="font-serif text-xs tracking-[0.2em] font-bold text-white group-hover:text-gold-300 transition-colors">
              TITANOVA AI
            </span>
            <span className="text-[10px] text-charcoal-400 tracking-wider">Watch Concierge</span>
          </div>
        </button>
      )}

      {/* Floating Chat Window (Small Compact Modal Interface) */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isMinimized
              ? 'bottom-6 right-6 w-72 bg-charcoal-950 border border-gold-500/40 rounded-xl shadow-2xl p-3 flex items-center justify-between text-white'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[400px] h-[560px] max-h-[85vh] bg-[#0c0d10] border border-charcoal-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white animate-slide-up'
          }`}
          role="dialog"
          aria-label="TITANOVA AI Shopping Assistant"
        >
          {/* Header */}
          <div className="bg-charcoal-950 px-4 py-3.5 border-b border-charcoal-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gold-600 via-gold-500 to-gold-400 flex items-center justify-center text-charcoal-950 font-serif font-bold text-xs shadow-md">
                  T
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-charcoal-950" />
              </div>
              <div>
                <h3 className="font-serif text-sm tracking-[0.15em] font-medium text-white flex items-center gap-1.5">
                  <span>TITANOVA AI</span>
                </h3>
                <p className="text-[10px] text-charcoal-400 tracking-wider">Your personal watch assistant</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
              {!isMinimized && (
                <button
                  onClick={handleClearConversation}
                  className="p-1.5 text-charcoal-400 hover:text-white hover:bg-charcoal-900 rounded transition-colors cursor-pointer"
                  title="Clear conversation"
                  aria-label="Clear conversation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-charcoal-400 hover:text-white hover:bg-charcoal-900 rounded transition-colors cursor-pointer"
                title={isMinimized ? 'Expand' : 'Minimize'}
                aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-charcoal-400 hover:text-white hover:bg-charcoal-900 rounded transition-colors cursor-pointer"
                title="Close chat"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body when not minimized */}
          {!isMinimized && (
            <>
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-charcoal-800">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[88%]">
                      {msg.sender === 'ai' && (
                        <div className="w-6 h-6 rounded-full bg-charcoal-900 border border-gold-500/30 flex items-center justify-center shrink-0 mb-1 text-[10px] text-gold-400 font-serif">
                          T
                        </div>
                      )}

                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-br from-gold-600 to-gold-700 text-charcoal-950 font-medium rounded-br-sm shadow-md'
                            : 'bg-[#15161b] text-charcoal-200 border border-charcoal-800/80 rounded-bl-sm shadow-sm'
                        }`}
                      >
                        {/* Text Content */}
                        <div className="whitespace-pre-line">{msg.text}</div>

                        {/* Product Recommendation Cards (if any) */}
                        {msg.products && msg.products.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-charcoal-800/80 space-y-2">
                            <span className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold block">
                              Recommended Timepieces:
                            </span>
                            <div className="space-y-2">
                              {msg.products.map(prod => (
                                <ChatProductCard
                                  key={prod.id}
                                  product={prod}
                                  onToast={msg => setToastMessage(msg)}
                                  onNavigate={() => {
                                    // Keep chat active or minimize smoothly
                                    setIsMinimized(true);
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {msg.sender === 'user' && (
                        <div className="w-6 h-6 rounded-full bg-charcoal-800 flex items-center justify-center shrink-0 mb-1 text-charcoal-300">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-charcoal-500 mt-1 px-8 font-light">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {/* Loading / Typing Indicator */}
                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-charcoal-400">
                    <div className="w-6 h-6 rounded-full bg-charcoal-900 border border-gold-500/30 flex items-center justify-center shrink-0 text-[10px] text-gold-400 font-serif">
                      T
                    </div>
                    <div className="p-3 bg-[#15161b] border border-charcoal-800/80 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse delay-150" />
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse delay-300" />
                      <span className="text-[11px] text-charcoal-400 ml-1.5">Concierge is inspecting atelier archives...</span>
                    </div>
                  </div>
                )}

                {/* Suggested Questions (shown if conversation has only welcome message) */}
                {messages.length === 1 && !isLoading && (
                  <div className="pt-2 space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gold-400/90 font-bold block">
                      Suggested Inquiries:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTED_QUESTIONS.map(q => (
                        <button
                          key={q}
                          onClick={() => handleSendMessage(q)}
                          className="text-[11px] bg-[#16171d] hover:bg-charcoal-900 text-charcoal-300 hover:text-gold-300 border border-charcoal-800 hover:border-gold-500/40 px-2.5 py-1.5 rounded-lg text-left transition-all cursor-pointer"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {errorBanner && (
                  <div className="p-2.5 bg-red-950/40 border border-red-800/50 rounded-lg text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                    <span className="text-[11px]">{errorBanner}</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Footer */}
              <div className="p-3 bg-charcoal-950 border-t border-charcoal-800 shrink-0">
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2 bg-[#121317] border border-charcoal-800 focus-within:border-gold-500/60 rounded-xl px-3 py-1.5 transition-colors"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder="Ask about watches, collections, prices..."
                    className="flex-1 bg-transparent text-xs text-white placeholder-charcoal-500 focus:outline-none py-1.5"
                    disabled={isLoading}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      const el = document.querySelector('elevenlabs-convai') as any;
                      if (el && typeof el.startConversation === 'function') {
                        el.startConversation();
                      } else {
                        const btn = el?.shadowRoot?.querySelector('button') || el;
                        btn?.click?.();
                      }
                    }}
                    title="Speak with Titan Nova Voice Concierge"
                    className="w-8 h-8 rounded-lg bg-[#1a1b22] hover:bg-gold-500 text-gold-400 hover:text-charcoal-950 border border-gold-500/30 transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
                    aria-label="Speak with Voice Concierge"
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="w-8 h-8 rounded-lg bg-gold-500 text-charcoal-950 hover:bg-gold-400 disabled:opacity-40 disabled:hover:bg-gold-500 transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
                    aria-label="Send message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
                <div className="flex items-center justify-between text-[9px] text-charcoal-500 mt-2 px-1">
                  <span>TITANOVA Concierge &amp; Voice Assistant</span>
                  <span>Free Insured Delivery &gt; ₹10k</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </>
  );
}
