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
  const [mediaData, setMediaData] = useState<{ type: 'image' | 'video', data: string } | null>(null);
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
      let errorMsg = "Lo siento, ha ocurrido un error en el terminal de IA.";
      if ((error as any).message?.includes('API key')) errorMsg = "La clave de IA no es válida. Contacta al soporte de Mikitech.";
      setMessages(prev => [...prev, { role: 'model', text: errorMsg }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[200]">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black text-white w-20 h-20 rounded-[32px] shadow-2xl hover:scale-110 transition-all flex items-center justify-center group border-2 border-white/10"
        >
          <span className="material-symbols-outlined text-4xl group-hover:rotate-12 transition-transform">smart_toy</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-[420px] h-[650px] rounded-[48px] shadow-2xl flex flex-col border-2 border-black overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="bg-black p-8 flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-green-500 animate-pulse">terminal</span>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">IA: Mikitech Assistant</h3>
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Protocolo de Asistencia Gamer</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-10 h-10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                <div className="w-24 h-24 bg-gray-50 rounded-[40px] flex items-center justify-center">
                  <span className="material-symbols-outlined text-gray-400 text-5xl">memory</span>
                </div>
                <div>
                  <p className="text-xs font-black uppercase mb-2">Terminal Operacional</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Consulta sobre builds de PC, optimización de portátiles o configuración de streaming.</p>
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                {m.image && <img src={m.image} className="max-w-[250px] rounded-[32px] mb-4 border-2 border-gray-100 shadow-xl" alt="upload" />}
                {m.video && <div className="p-4 bg-gray-50 rounded-[24px] text-[10px] font-black uppercase mb-4 tracking-widest border border-gray-100">Video Data Transferred 100%</div>}
                <div className={`max-w-[90%] px-6 py-4 rounded-[28px] text-[11px] font-medium leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-black text-white rounded-tr-none' : 'bg-gray-100 text-gray-900 rounded-tl-none border-2 border-gray-50'
                  }`}>
                  {m.text}
                  {m.groundingLinks && m.groundingLinks.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-black/10 space-y-3">
                      <p className="text-[8px] uppercase font-black text-gray-400 tracking-widest">Fuentes de Referencia:</p>
                      {m.groundingLinks.map((link, li) => (
                        <a key={li} href={link.uri} target="_blank" rel="noreferrer" className="block text-inherit hover:underline text-[9px] truncate opacity-50 font-bold tracking-tight">
                          • {link.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex gap-3 items-center text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" />
                </div>
                {useThinkingMode ? 'Analizando Protocolos...' : 'Procesando Consulta...'}
              </div>
            )}
          </div>

          <div className="p-8 bg-gray-50/50 border-t-2 border-gray-100">
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setUseThinkingMode(!useThinkingMode)}
                className={`flex items-center gap-2 text-[9px] font-black uppercase px-4 py-2 rounded-full border-2 transition-all tracking-widest ${useThinkingMode ? 'bg-black border-black text-white' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-300'}`}
              >
                <span className="material-symbols-outlined text-sm">psychology</span> Análisis Profundo
              </button>
              <button
                onClick={() => setUseSearch(!useSearch)}
                className={`flex items-center gap-2 text-[9px] font-black uppercase px-4 py-2 rounded-full border-2 transition-all tracking-widest ${useSearch ? 'bg-black border-black text-white' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-300'}`}
              >
                <span className="material-symbols-outlined text-sm">search</span> Referencias Web
              </button>
            </div>

            <div className="flex items-end gap-4">
              <div className="flex-1 relative">
                {mediaData && (
                  <div className="absolute -top-16 left-0 right-0 p-4 bg-white border-2 border-black rounded-[32px] flex items-center justify-between shadow-2xl shadow-black/10 animate-in slide-in-from-bottom-2">
                    <span className="text-[10px] font-black uppercase tracking-widest">{mediaData.type === 'image' ? 'Imagen Lista' : 'Video Listo'}</span>
                    <button onClick={() => setMediaData(null)}><span className="material-symbols-outlined text-sm">close</span></button>
                  </div>
                )}
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                  placeholder="Ingresar comando..."
                  className="w-full bg-white border-2 border-gray-100 rounded-[32px] text-xs p-5 pr-12 focus:border-black outline-none transition-all min-h-[60px] max-h-[180px] resize-none font-bold"
                />
                <div className="absolute right-4 bottom-5 flex gap-2">
                  <label className="cursor-pointer text-gray-300 hover:text-black transition-all">
                    <span className="material-symbols-outlined text-xl">add_circle</span>
                    <input type="file" className="hidden" accept="image/*,video/*" onChange={handleMediaUpload} />
                  </label>
                </div>
              </div>
              <button
                onClick={handleSend}
                disabled={isThinking}
                className="bg-black text-white h-14 w-14 rounded-[28px] hover:scale-105 disabled:opacity-50 transition-all flex items-center justify-center shrink-0 shadow-2xl shadow-black/20"
              >
                <span className="material-symbols-outlined text-xl">send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
