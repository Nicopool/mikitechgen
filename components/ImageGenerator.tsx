
import React, { useState } from 'react';
import { generateImage } from '../geminiService';
import { AISize } from '../types';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<AISize>(AISize.S1K);
  const [loading, setLoading] = useState(false);
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;

    setLoading(true);
    setError(null);
    try {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
      }
      
      const img = await generateImage(prompt, size);
      setGeneratedImg(img);
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found")) {
        await window.aistudio.openSelectKey();
      }
      setError(err.message || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="size-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
          <span className="material-symbols-outlined">image</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Component Designer</h3>
          <p className="text-xs text-slate-500">Generate concepts for custom parts or robotics setups.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A futuristic mechanical joint for a robotic arm, high precision, matte black finish..."
            className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg text-sm p-3 h-24 focus:ring-primary"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Resolution</label>
            <div className="flex gap-2">
              {[AISize.S1K, AISize.S2K, AISize.S4K].map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    size === s ? 'bg-primary border-primary text-white' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-slate-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="self-end px-6 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {loading ? <span className="material-symbols-outlined animate-spin text-sm">cycle</span> : <span className="material-symbols-outlined text-sm">auto_awesome</span>}
            Generate
          </button>
        </div>

        {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs">{error}</div>}

        {generatedImg && (
          <div className="mt-6 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl group relative">
            <img src={generatedImg} alt="Generated Part" className="w-full h-auto" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <a href={generatedImg} download="mikitech-gen.png" className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined">download</span> Download
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
