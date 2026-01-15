
import React, { useState, useRef, useEffect } from 'react';
import { chatWithGemini } from '../geminiService';
import { ChatMessage } from '../types';

export const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [useSearch, setUseSearch] = useState(false);
  const [useThinkingMode, setUseThinkingMode] = useState(false);
  const [mediaData, setMediaData] = useState<{type: 'image' | 'video', data: string} | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setMediaData({
        type: file.type.startsWith('video') ? 'video' : 'image',
        data: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    if (!input.trim() && !mediaData) return;

    const userMsg: ChatMessage = { 
      role: 'user', 
      text: input,
      image: mediaData?.type === 'image' ? mediaData.data : undefined,
      video: mediaData?.type === 'video' ? mediaData.data : undefined
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setMediaData(null);
    setIsThinking(true);

    try {
      const result = await chatWithGemini(input, messages, {
        useSearch,
        useThinking: useThinkingMode,
        image: userMsg.image,
        video: userMsg.video
      });

      const modelMsg: ChatMessage = {
        role: 'model',
        text: result.text,
        groundingLinks: result.groundingLinks
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Error: " + (error as any).message }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center group"
        >
          <span className="material-symbols-outlined text-2xl group-hover:rotate-12">smart_toy</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white dark:bg-surface-dark w-[380px] h-[600px] rounded-2xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-primary p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">smart_toy</span>
              <span className="font-bold">mikitech AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="text-center mt-10 space-y-4">
                <div className="size-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-gray-400 text-3xl">chat_bubble</span>
                </div>
                <p className="text-slate-500 text-sm">Ask about robotics, assembly, or troubleshoot your code.</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                {m.image && <img src={m.image} className="max-w-[200px] rounded-lg mb-1 border" />}
                {m.video && <div className="p-2 bg-slate-100 rounded text-xs mb-1">Video Attachment Attached</div>}
                <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${
                  m.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                }`}>
                  {m.text}
                  {m.groundingLinks && m.groundingLinks.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-700 space-y-1">
                      <p className="text-[10px] uppercase font-bold text-gray-500">Sources:</p>
                      {m.groundingLinks.map((link, li) => (
                        <a key={li} href={link.uri} target="_blank" rel="noreferrer" className="block text-primary hover:underline text-xs truncate">
                          • {link.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex gap-2 items-center text-slate-400 text-xs italic">
                <span className="material-symbols-outlined animate-spin text-sm">cycle</span>
                {useThinkingMode ? 'AI is deeply analyzing...' : 'AI is thinking...'}
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="flex gap-4 mb-2">
              <button 
                onClick={() => setUseThinkingMode(!useThinkingMode)}
                className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border transition-colors ${useThinkingMode ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-white border-gray-300 text-gray-500'}`}
              >
                <span className="material-symbols-outlined text-xs">psychology</span> Deep Think
              </button>
              <button 
                onClick={() => setUseSearch(!useSearch)}
                className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border transition-colors ${useSearch ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white border-gray-300 text-gray-500'}`}
              >
                <span className="material-symbols-outlined text-xs">search</span> Search Grounding
              </button>
            </div>

            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                {mediaData && (
                  <div className="absolute -top-12 left-0 right-0 p-2 bg-white dark:bg-gray-800 shadow rounded border flex items-center justify-between">
                    <span className="text-xs truncate">{mediaData.type === 'image' ? 'Image selected' : 'Video selected'}</span>
                    <button onClick={() => setMediaData(null)}><span className="material-symbols-outlined text-xs">close</span></button>
                  </div>
                )}
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                  placeholder="Ask a question..."
                  className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg text-sm p-2 pr-10 focus:ring-primary min-h-[44px] max-h-[120px] resize-none"
                />
                <div className="absolute right-2 bottom-2 flex gap-1">
                  <label className="cursor-pointer text-gray-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">attach_file</span>
                    <input type="file" className="hidden" accept="image/*,video/*" onChange={handleMediaUpload} />
                  </label>
                </div>
              </div>
              <button 
                onClick={handleSend}
                disabled={isThinking}
                className="bg-primary text-white p-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
