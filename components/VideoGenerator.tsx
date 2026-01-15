
import React, { useState } from 'react';
import { generateVideo } from '../geminiService';

export const VideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  const handleGenerate = async () => {
    if (!prompt) return;

    setLoading(true);
    setStatus('Initializing Veo Engine...');
    try {
      /* Mandatory API key selection check for Veo models */
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
      }

      setStatus('Synthesizing frames (this may take 1-2 minutes)...');
      const url = await generateVideo(prompt);
      setVideoUrl(url);
      setStatus('');
    } catch (err: any) {
      /* If request fails with 'Requested entity was not found', re-prompt for key selection */
      if (err.message?.includes("Requested entity was not found")) {
        await window.aistudio.openSelectKey();
      }
      console.error(err);
      setStatus('Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
          <span className="material-symbols-outlined">movie</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Assembly Animator</h3>
          <p className="text-xs text-slate-500">Generate 3D assembly animations for your custom designs.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Animation Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A slow motion cinematic shot of a robotic hand picking up a microchip and placing it on a circuit board..."
            className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg text-sm p-3 h-24 focus:ring-primary"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-lg font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-sm">cycle</span>
              <span>Generating Video...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">videocam</span>
              <span>Generate Animation</span>
            </>
          )}
        </button>

        {status && <p className="text-[10px] text-center text-slate-400 animate-pulse">{status}</p>}

        {videoUrl && (
          <div className="mt-6 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl bg-black aspect-video">
            <video src={videoUrl} controls className="w-full h-full" autoPlay loop />
          </div>
        )}
      </div>
    </div>
  );
};
