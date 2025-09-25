'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Tooltip from '@/components/chatbnn';

const FloatingChatbot = () => {
  // Static bot: no external API calls. All answers are generated locally.
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your Jharkhand travel assistant. How can I help you plan your journey?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // Manage dimensions for custom top-left resize handle
  const [chatDimensions, setChatDimensions] = useState({ width: 384, height: 512 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatRef = useRef(null);
  // No resize ref needed with native CSS resize

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle clicking outside to close chat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && chatRef.current && !chatRef.current.contains(event.target) && 
          !event.target.closest('.chat-toggle-btn')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Top-left resize handle logic
  const handleResizeStart = (e) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: chatDimensions.width,
      height: chatDimensions.height,
    });
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleResizeMove = (e) => {
      // Dragging from top-left: increase size when moving up/left
      const deltaX = resizeStart.x - e.clientX;
      const deltaY = resizeStart.y - e.clientY;

      const margin = 24; // viewport margin
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

      const maxWidth = Math.max(360, vw - margin * 2);
      const maxHeight = Math.max(420, vh - margin * 4);

      const nextWidth = resizeStart.width + deltaX;
      const nextHeight = resizeStart.height + deltaY;

      const clampedWidth = Math.max(320, Math.min(maxWidth, nextWidth));
      const clampedHeight = Math.max(400, Math.min(maxHeight, nextHeight));

      setChatDimensions({ width: clampedWidth, height: clampedHeight });
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
    document.body.style.cursor = 'nwse-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, resizeStart]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Static bot: simulate 2s typing delay and reply from local knowledge
    const replyText = getBotResponse(userMessage.text);
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: replyText,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase();

    // Waterfalls
    const waterfallKeywords = ['waterfall', 'waterfalls', 'falls', 'hundru', 'jonha', 'dassam', 'hirni'];
    // Temples
    const templeKeywords = ['temple', 'mandir', 'baidyanath', 'deoghar', 'baba', 'jyotirlinga'];
    // Food
    const foodKeywords = ['food', 'eat', 'restaurant', 'cuisine', 'dinner', 'lunch', 'breakfast'];
    // Handicrafts
    const craftKeywords = ['handicraft', 'craft', 'dokra', 'dokhra', 'sohrai', 'bamboo', 'jewelry', 'jewellery', 'market', 'shopping'];
    // Nearby / locations
    const nearbyKeywords = ['near', 'around', 'close', 'nearby', 'locations'];

    const containsAny = (words) => words.some(w => input.includes(w));

    if (containsAny(waterfallKeywords)) {
      const base = [
        'Top Waterfalls in Jharkhand:',
        '- Hundru Falls (Ranchi): 98m drop on Subarnarekha River; best in monsoon and post-monsoon.',
        '- Jonha Falls (Ranchi): Also called Gautamdhara; scenic valley views with steps down to the base.',
        '- Dassam Falls (Near Taimara): Powerful cascade on Kanchi River; strong currents—view from designated points.',
        '- Hirni Falls (West Singhbhum): Lush forest surroundings and a viewpoint for wide vistas.'
      ].join('\n');

      if (containsAny(foodKeywords) || input.includes('best food')) {
        return [
          base,
          '',
          'Best local foods around waterfalls:',
          '- Dhuska with Aloo Ghugni (popular around Ranchi).',
          '- Rugra mushroom curry (seasonal monsoon delicacy).',
          '- Bamboo shoot pickles and curries (tribal cuisine).',
          '- Pitha and Thekua at local stalls during festivals.'
        ].join('\n');
      }

      if (containsAny(nearbyKeywords) || input.includes('best locations')) {
        return [
          base,
          '',
          'Best locations/nearby points:',
          '- Hundru: Getalsud Dam, Ranchi city viewpoints (Tagore Hill, Pahari Mandir).',
          '- Jonha: Sita Falls (short drive), Angrabadi temple complex.',
          '- Dassam: Land of waterfalls drive loop (Jonha–Hundru–Dassam).',
          '- Hirni: Saranda forest drives (with local guidance).'
        ].join('\n');
      }

      return base;
    }

    if (containsAny(templeKeywords)) {
      const base = [
        'Major Temples in Jharkhand:',
        '- Baidyanath Temple (Deoghar): One of the 12 Jyotirlingas; peak pilgrimage in Sawan (July–Aug).',
        '- Pahari Mandir (Ranchi): Panoramic city views; best at sunrise/sunset.',
        '- Maluti Temple Cluster (near Dumka): Terracotta temples with intricate carvings.'
      ].join('\n');

      if (containsAny(foodKeywords)) {
        return [
          base,
          '',
          'Best foods around temple towns:',
          '- Near Baidyanath (Deoghar): Khichdi prasad, Pedas, Dhuska, local thalis.',
          '- Ranchi: Dhuska-Ghugni, Rugra (seasonal), Handia-based dishes (ask locals), litti-type street snacks.'
        ].join('\n');
      }

      if (containsAny(nearbyKeywords) || input.includes('best locations')) {
        return [
          base,
          '',
          'Nearby locations to add:',
          '- Deoghar: Naulakha Mandir, Trikut Hills, Tapovan Caves.',
          '- Ranchi: Rock Garden, Kanke Dam, Tagore Hill; short trips to waterfalls (Hundru/Jonha/Dassam).'
        ].join('\n');
      }

      return base;
    }

    if (containsAny(craftKeywords)) {
      return [
        'Jharkhand Handicrafts:',
        '- Dokra (Dhokra) metal casting: brass figurines and decor.',
        '- Sohrai and Khovar paintings: traditional wall and mural art with natural pigments.',
        '- Bamboo and cane crafts: baskets, mats, decor.',
        '- Tribal jewelry: brass/silver pieces with cultural motifs.',
        '',
        'Tip: Look for government emporiums, artisan haats, and local fairs for authentic items.'
      ].join('\n');
    }

    if (containsAny(foodKeywords)) {
      return [
        'Signature foods of Jharkhand:',
        '- Dhuska & Aloo Ghugni',
        '- Rugra (wild mushroom) delicacies',
        '- Bamboo shoot curries/pickles',
        '- Pitha (sweet/savory)',
        '- Chilka Roti, Thekua',
        '',
        'Tell me the spot (e.g., Hundru, Deoghar) and I will suggest nearby options.'
      ].join('\n');
    }

    if (input.includes('place') || input.includes('visit') || input.includes('destination') || input.includes('locations')) {
      return [
        'Popular places to visit in Jharkhand:',
        '- Nature: Betla National Park, Netarhat, Patratu Valley.',
        '- Waterfalls: Hundru, Jonha, Dassam, Hirni.',
        '- Spiritual: Baidyanath Temple (Deoghar), Pahari Mandir, Parasnath Hills (Jain pilgrimage).',
        '',
        'Ask for any category and I will tailor the list.'
      ].join('\n');
    }

    if (input.includes('weather') || input.includes('time') || input.includes('season') || input.includes('best time')) {
      return 'Best time: Oct–Mar for pleasant weather; Jun–Sep (monsoon) is spectacular for waterfalls.';
    }

    if (input.includes('hotel') || input.includes('stay')) {
      return 'Share your target city/area and budget, and I will suggest stay pockets near attractions (e.g., Ranchi for waterfalls loop; Deoghar for Baidyanath).';
    }

    return "I'm your Jharkhand guide. Ask me about waterfalls, temples, nearby foods, best locations, or handicrafts!";
  };

  const handleMyTour = () => {
    router.push('/my-tours');
  };

  const quickSuggestions = [
    "Show me waterfalls",
    "Best food in Jharkhand", 
    "Wildlife sanctuaries",
    "Handicraft shops",
    "Temple destinations"
  ];

  return (
    <>
      {/* Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300"
          style={{ animation: isOpen ? 'fadeIn 0.3s ease-out' : '' }}
        />
      )}

      {/* Chat Toggle Button (using Tooltip from chatbnn.jsx) */}
      <div className="fixed bottom-6 right-10 z-50">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="chat-toggle-btn cursor-pointer select-none"
          title={isOpen ? 'Close chat' : 'Open chat'}
        >
          <Tooltip />
        </div>
        {!isOpen && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            1
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div 
          ref={chatRef}
          className="fixed bottom-24 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden transition-all duration-300"
          style={{
            width: `${chatDimensions.width}px`,
            height: `${chatDimensions.height}px`,
            animation: 'slideInUp 0.3s ease-out',
            resize: 'both',
            overflow: 'hidden',
            minWidth: '320px',
            minHeight: '400px',
            maxWidth: 'calc(100vw - 48px)',
            maxHeight: 'calc(100vh - 96px)'
          }}
        >
          {/* Custom top-left resize handle */}
          <div
            onMouseDown={handleResizeStart}
            className="absolute -top-3 -left-3 w-5 h-5 bg-green-500 rounded-full cursor-nwse-resize hover:bg-green-600 transition-colors duration-200 shadow-lg opacity-80 hover:opacity-100"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  🌿
                </div>
                <div>
                  <h3 className="font-bold text-lg">Jharkhand Guide</h3>
                  <p className="text-sm opacity-90">Always here to help</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* My Tours Button */}
                <button
                  onClick={handleMyTour}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  My Tours
                </button>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} transition-all duration-300`}
                style={{
                  animation: `messageSlideIn 0.4s ease-out ${index * 0.1}s both`
                }}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl transition-all duration-200 hover:scale-105 ${
                    message.isBot
                      ? 'bg-white text-gray-800 border border-gray-200 shadow-sm hover:shadow-md'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 ${message.isBot ? 'text-gray-400' : 'text-white/70'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
              <p className="text-xs text-gray-500 mb-2">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.slice(0, 3).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(suggestion)}
                    className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition-all duration-200 hover:scale-105"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="Ask about Jharkhand tourism..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 bg-gray-50 hover:bg-white transition-all duration-200"
                style={{ color: '#1f2937' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full flex items-center justify-center hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <svg className="w-5 h-5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes messageSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default FloatingChatbot;