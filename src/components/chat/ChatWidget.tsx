import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  X,
  Minus,
  RotateCcw,
  Send,
  User,
  AlertCircle,
  Mic,
  Volume2,
  Loader2,
} from 'lucide-react';
import { ConversationProvider, useConversation } from '@elevenlabs/react';
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

function UnifiedChatAssistant() {
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

  // ElevenLabs Voice Integration via official @elevenlabs/react hook
  const conversation = useConversation({
    onConnect: () => {
      setErrorBanner(null);
    },
    onDisconnect: () => {
      // voice session disconnected
    },
    onMessage: (payload) => {
      if (!payload?.message) return;
      const isUser = payload.role === 'user' || payload.source === 'user';
      const sender: 'user' | 'ai' = isUser ? 'user' : 'ai';
      const text = payload.message.trim();
      if (!text) return;

      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last && last.sender === sender && last.text === text) {
          return prev;
        }
        return [
          ...prev,
          {
            id: 'voice_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
            sender,
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];
      });
    },
    onError: (err) => {
      console.error('[ElevenLabs Voice Error]:', err);
      const msg = typeof err === 'string' ? err : (err as any)?.message || 'Voice connection issue';
      if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('notallowed')) {
        setErrorBanner('Microphone permission required. Please allow microphone access in your browser to speak.');
      } else {
        setErrorBanner(msg);
      }
    },
  });

  const isVoiceConnected = conversation.status === 'connected';
  const isVoiceConnecting = conversation.status === 'connecting';
  const isVoiceActive = isVoiceConnected || isVoiceConnecting;

  const getVoiceStateLabel = () => {
    if (isVoiceConnecting) return 'Connecting voice...';
    if (conversation.isSpeaking) return 'Speaking...';
    if (conversation.isListening) return 'Listening...';
    return 'Thinking...';
  };

  const handleToggleVoice = useCallback(async () => {
    if (isVoiceConnecting) return;

    if (isVoiceConnected) {
      try {
        conversation.endSession();
      } catch (err) {
        console.error('Failed to end voice session:', err);
      }
      return;
    }

    setErrorBanner(null);

    // Request microphone permission beforehand
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(t => t.stop());
      }
    } catch (err: any) {
      console.warn('Microphone permission check failed:', err);
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setErrorBanner('Microphone permission was denied. Please allow microphone access in your browser settings.');
        return;
      }
    }

    try {
      await conversation.startSession({
        agentId: 'agent_9701m43chk31fhk8wzh9xd018jnw',
      });
    } catch (err: any) {
      console.error('Failed to start ElevenLabs session:', err);
      setErrorBanner(err?.message || 'Failed to start voice assistant.');
    }
  }, [conversation, isVoiceConnecting, isVoiceConnected]);

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
  }, [messages, isOpen, isMinimized, isLoading, isVoiceActive]);

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
    if (isVoiceConnected) {
      try {
        conversation.endSession();
      } catch {
        /* ignore */
      }
    }
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
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-charcoal-950 ${isVoiceConnected ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
              </div>
              <div>
                <h3 className="font-serif text-sm tracking-[0.15em] font-medium text-white flex items-center gap-1.5">
                  <span>TITANOVA AI</span>
                  {isVoiceConnected && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-400 border border-gold-500/30 uppercase tracking-widest font-sans font-semibold">
                      Voice
                    </span>
                  )}
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
                onClick={() => {
                  if (isVoiceConnected) {
                    try {
                      conversation.endSession();
                    } catch {
                      /* ignore */
                    }
                  }
                  setIsOpen(false);
                }}
                className="p-1.5 text-charcoal-400 hover:text-white hover:bg-charcoal-900 rounded transition-colors cursor-pointer"
                title="Close"
                aria-label="Close chat"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Body */}
          {!isMinimized && (
            <>
              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-charcoal-800">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`flex gap-2 max-w-[85%] ${
                        msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      {msg.sender === 'ai' && (
                        <div className="w-6 h-6 rounded-full bg-charcoal-900 border border-gold-500/30 flex items-center justify-center shrink-0 mt-1 text-[10px] text-gold-400 font-serif">
                          T
                        </div>
                      )}

                      <div className="space-y-2">
                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-gold-500 text-charcoal-950 font-medium rounded-br-sm shadow-sm'
                              : 'bg-[#15161b] text-charcoal-200 border border-charcoal-800/80 rounded-bl-sm'
                          }`}
                        >
                          <p className="whitespace-pre-line">{msg.text}</p>
                        </div>

                        {/* Product Cards Grid if returned */}
                        {msg.products && msg.products.length > 0 && (
                          <div className="pt-2">
                            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x">
                              {msg.products.map(prod => (
                                <div key={prod.id} className="snap-start shrink-0">
                                  <ChatProductCard
                                    product={prod}
                                    onToast={(msg) => setToastMessage(msg)}
                                    onNavigate={() => setIsOpen(false)}
                                  />
                                </div>
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

                {/* Suggested Questions */}
                {messages.length === 1 && !isLoading && !isVoiceActive && (
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

              {/* Voice Status Strip */}
              {isVoiceActive && (
                <div className="flex items-center justify-between px-3.5 py-2 bg-charcoal-900 border-t border-charcoal-800 text-xs shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500" />
                    </span>
                    <span className="text-gold-300 font-medium text-[11px] tracking-wider uppercase">
                      {getVoiceStateLabel()}
                    </span>
                    {conversation.isSpeaking && (
                      <Volume2 className="w-3.5 h-3.5 text-gold-400 animate-pulse ml-1" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        conversation.endSession();
                      } catch {
                        /* ignore */
                      }
                    }}
                    className="text-[10px] text-charcoal-400 hover:text-red-400 uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                  >
                    Stop Voice
                  </button>
                </div>
              )}

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

                  {/* Microphone Voice Button */}
                  <button
                    type="button"
                    onClick={handleToggleVoice}
                    disabled={isVoiceConnecting}
                    title={
                      isVoiceConnected
                        ? 'Stop voice conversation'
                        : isVoiceConnecting
                        ? 'Connecting voice...'
                        : 'Start ElevenLabs voice assistant'
                    }
                    className={`w-8 h-8 rounded-lg transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-sm ${
                      isVoiceConnected
                        ? 'bg-gold-500 text-charcoal-950 ring-2 ring-gold-400/60 shadow-gold-500/30'
                        : isVoiceConnecting
                        ? 'bg-charcoal-800 text-gold-400 animate-pulse'
                        : 'bg-[#1a1b22] hover:bg-gold-500 text-gold-400 hover:text-charcoal-950 border border-gold-500/30'
                    }`}
                    aria-label={isVoiceConnected ? 'Stop voice conversation' : 'Start ElevenLabs voice assistant'}
                  >
                    {isVoiceConnecting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Mic className={`w-3.5 h-3.5 ${isVoiceConnected ? 'animate-pulse' : ''}`} />
                    )}
                  </button>

                  {/* Send Button */}
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

export default function ChatWidget() {
  return (
    <ConversationProvider>
      <UnifiedChatAssistant />
    </ConversationProvider>
  );
}
