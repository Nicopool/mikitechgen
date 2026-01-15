
import React, { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

export const LiveSupport: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Idle');
  const [transcription, setTranscription] = useState('');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null);

  /* Manual base64 decoding implementation following guidelines */
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  /* Manual base64 encoding implementation following guidelines */
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  /* Manual PCM audio decoding logic as per guidelines (do not use native decodeAudioData for streams) */
  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const stopSession = () => {
    setIsActive(false);
    setStatus('Disconnected');
    if (sessionRef.current) sessionRef.current.close();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
  };

  const startSession = async () => {
    try {
      setStatus('Connecting to AI Expert...');
      
      /* Ensure user has selected a billing-enabled API key */
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
      }

      /* Initialize client right before connection to use latest key */
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      let nextStartTime = 0;
      const sources = new Set<AudioBufferSourceNode>();

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setStatus('AI Expert Online');
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              /* Use sessionPromise.then to prevent stale closure issues with sendRealtimeInput */
              sessionPromise.then(s => s.sendRealtimeInput({
                media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' }
              }));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.outputTranscription) {
              setTranscription(prev => (prev + ' ' + msg.serverContent?.outputTranscription?.text).slice(-200));
            }
            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              /* Schedule next chunk to start exactly after previous one using trackable cursor */
              nextStartTime = Math.max(nextStartTime, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.start(nextStartTime);
              nextStartTime += buffer.duration;
              sources.add(source);
              source.onended = () => sources.delete(source);
            }
            if (msg.serverContent?.interrupted) {
              /* Handle interruption by stopping all currently playing sources */
              sources.forEach(s => s.stop());
              sources.clear();
              nextStartTime = 0;
            }
          },
          onclose: stopSession,
          onerror: (e) => {
            console.error('Live session error:', e);
            stopSession();
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: 'You are a world-class robotics engineer. Speak concisely and help with technical assembly.',
          outputAudioTranscription: {}
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      /* Re-prompt for key if project billing error occurs */
      if (err.message?.includes("Requested entity was not found")) {
        window.aistudio.openSelectKey();
      }
      console.error(err);
      setStatus('Connection Failed');
      stopSession();
    }
  };

  return (
    <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center space-y-6 shadow-xl relative overflow-hidden group">
      <div className={`absolute top-0 left-0 w-full h-1 transition-all duration-500 ${isActive ? 'bg-primary animate-pulse shadow-[0_0_15px_rgba(23,84,207,0.5)]' : 'bg-transparent'}`}></div>
      
      <div className={`size-20 rounded-full mx-auto flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-primary text-white scale-110 shadow-2xl' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
        <span className={`material-symbols-outlined text-4xl ${isActive ? 'animate-bounce' : ''}`}>
          {isActive ? 'graphic_eq' : 'mic'}
        </span>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold dark:text-white">Live Engineering Support</h2>
        <p className="text-sm text-slate-500 max-w-xs mx-auto">
          {isActive ? 'Ask anything about robotics, circuits, or coding. Our AI expert is listening.' : 'Start a real-time voice session with our AI expert for hands-free troubleshooting.'}
        </p>
      </div>

      <div className="pt-2">
        <button
          onClick={isActive ? stopSession : startSession}
          className={`px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 mx-auto ${
            isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-primary text-white hover:bg-blue-700 shadow-lg shadow-primary/30'
          }`}
        >
          <span className="material-symbols-outlined text-xl">{isActive ? 'call_end' : 'call'}</span>
          {isActive ? 'End Live Session' : 'Connect with Expert'}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center justify-center gap-2">
          <span className={`size-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-slate-300'}`}></span>
          {status}
        </div>
        {isActive && transcription && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-xs text-slate-600 dark:text-slate-300 italic min-h-[40px] animate-in fade-in">
                "{transcription}..."
            </div>
        )}
      </div>
    </div>
  );
};
