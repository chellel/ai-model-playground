import React, { useState } from 'react';
import { ModelSchema } from '../types';
import { ChevronDown, Check, Sparkles, Key, DollarSign, Shield, Zap, Layers } from 'lucide-react';

interface ModelHeroProps {
  currentModel: ModelSchema;
  models: ModelSchema[];
  onSelectModel: (model: ModelSchema) => void;
  onNavigateSection: (section: string) => void;
}

export const ModelHero: React.FC<ModelHeroProps> = ({
  currentModel,
  models,
  onSelectModel,
  onNavigateSection,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Dynamic tags based on model category
  const getModelTags = () => {
    switch (currentModel.category) {
      case 'Video Generation':
        return ['1080p / 4K Video', 'Native Audio Synthesis', 'Multi-frame Consistency', 'Camera Motion Control', 'OpenAPI Compatible'];
      case 'Image Generation':
        return ['Photorealistic 4K', 'Typography Rendering', 'Raw Film Aesthetics', 'Lens Precision', 'Ultra Low Latency'];
      case 'Language Model':
        return ['Reasoning', 'Coding', 'Long Context', 'Structured Outputs', 'OpenAI Compatible'];
      default:
        return ['High Speed Inference', 'Word-level Timestamps', 'Multilingual Speech', 'Streaming Output'];
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-purple-50/60 via-indigo-50/30 to-white pt-12 pb-14 border-b border-gray-100">
      {/* Wave pattern decorative graphic in background */}
      <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden flex items-center justify-center">
        <svg className="w-full max-w-7xl h-[450px]" viewBox="0 0 1200 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100 80 C 200 20, 400 250, 700 180 C 950 120, 1100 280, 1300 220" stroke="url(#paint0_linear)" strokeWidth="1.5" strokeDasharray="6 6" />
          <path d="M-100 120 C 180 80, 450 300, 750 210 C 1000 140, 1150 320, 1350 260" stroke="url(#paint1_linear)" strokeWidth="1" />
          <path d="M-100 160 C 220 140, 480 340, 780 250 C 1020 180, 1180 350, 1380 290" stroke="url(#paint2_linear)" strokeWidth="1.5" />
          <path d="M-100 200 C 250 180, 520 370, 820 280 C 1060 210, 1200 370, 1400 310" stroke="url(#paint3_linear)" strokeWidth="0.8" />
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="0" x2="1200" y2="400" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9333EA" stopOpacity="0.4" />
              <stop offset="0.5" stopColor="#6366F1" stopOpacity="0.6" />
              <stop offset="1" stopColor="#3B82F6" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="paint1_linear" x1="0" y1="0" x2="1200" y2="400" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A855F7" stopOpacity="0.3" />
              <stop offset="1" stopColor="#EC4899" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="paint2_linear" x1="0" y1="0" x2="1200" y2="400" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366F1" stopOpacity="0.3" />
              <stop offset="1" stopColor="#8B5CF6" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="paint3_linear" x1="0" y1="0" x2="1200" y2="400" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6" stopOpacity="0.2" />
              <stop offset="1" stopColor="#9333EA" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 text-center relative z-10">
        {/* Model Dropdown Trigger */}
        <div className="inline-flex items-center justify-center mb-4 relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="group flex items-center gap-3 bg-white/90 hover:bg-white border border-gray-200/80 hover:border-purple-500 px-5 py-2.5 rounded-2xl shadow-md shadow-purple-500/5 transition duration-200"
          >
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
              {currentModel.publisher}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              {currentModel.name}
            </h1>
            <ChevronDown className={`w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Model Selection Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute top-full mt-3 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 py-2 divide-y divide-gray-100 text-left left-1/2 -translate-x-1/2">
              <div className="px-4 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex justify-between">
                <span>Switch Playground Model</span>
                <span className="text-purple-600">{models.length} available</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {models.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectModel(m);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-purple-50/60 transition flex items-start justify-between gap-3 ${currentModel.id === m.id ? 'bg-purple-50/40' : ''}`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-400">{m.publisher}/</span>
                        <span className="text-sm font-bold text-gray-900">{m.name}</span>
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {m.description}
                      </div>
                    </div>
                    {currentModel.id === m.id && (
                      <Check className="w-4 h-4 text-purple-600 shrink-0 mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Subtitle matching prototype */}
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          {currentModel.description || "SSE streaming debug, visual parameter configuration and request body testing."}
        </p>

        {/* Pricing & Performance summary row */}
        <div className="flex flex-wrap justify-center items-center gap-6 mt-4 text-xs font-mono font-medium text-gray-500">
          <div className="flex items-center gap-1.5 bg-white/80 border border-gray-200 px-3 py-1 rounded-full shadow-2xs">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pricing: <strong className="text-gray-800">{currentModel.pricePerRun}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/80 border border-gray-200 px-3 py-1 rounded-full shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Avg Latency: <strong className="text-gray-800">{currentModel.avgTime}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/80 border border-gray-200 px-3 py-1 rounded-full shadow-2xs">
            <Shield className="w-3.5 h-3.5 text-blue-500" />
            <span>Runs: <strong className="text-gray-800">{currentModel.runsCount}</strong></span>
          </div>
        </div>

        {/* Feature Pills matching prototype 2 ("Reasoning", "Coding", "Long Context", etc.) */}
        <div className="flex flex-wrap justify-center items-center gap-2.5 mt-6">
          {getModelTags().map((tag, idx) => (
            <span
              key={idx}
              className="px-3.5 py-1.5 rounded-lg border border-gray-200 bg-white/90 text-gray-700 text-xs font-medium shadow-2xs hover:border-purple-400 transition"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Two CTAs matching prototype 2 */}
        <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
          <button
            onClick={() => onNavigateSection('Pricing')}
            className="px-7 py-3 rounded-xl bg-black hover:bg-gray-800 text-white font-semibold text-sm transition shadow-lg shadow-black/10 flex items-center gap-2"
          >
            <span>View Pricing Details</span>
          </button>
          
          <button
            onClick={() => alert(`Your API Key for ${currentModel.id} is ready in the developer console. Check Settings menu to manage secrets.`)}
            className="px-7 py-3 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-gray-900 font-semibold text-sm transition shadow-xs flex items-center gap-2"
          >
            <Key className="w-4 h-4 text-purple-600" />
            <span>Get API Key</span>
          </button>
        </div>
      </div>
    </div>
  );
};
