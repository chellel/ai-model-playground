import React, { useState } from 'react';
import { SchemaProperty } from '../types';
import { PROMPT_PRESETS, SAMPLE_IMAGES } from '../data/models';
import { Sparkles, UploadCloud, Sliders, CheckSquare, Square, RefreshCw, Image as ImageIcon, HelpCircle } from 'lucide-react';

interface DynamicFormProps {
  modelId: string;
  properties: Record<string, SchemaProperty>;
  formData: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onRun: () => void;
  isGenerating: boolean;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  modelId,
  properties,
  formData,
  onChange,
  onRun,
  isGenerating,
}) => {
  const [showPresets, setShowPresets] = useState(false);
  const presets = PROMPT_PRESETS[modelId] || [];

  const renderWidget = (key: string, field: SchemaProperty) => {
    const value = formData[key] ?? field.default ?? '';

    switch (field.widget) {
      case 'textarea':
        return (
          <div className="space-y-2">
            {presets.length > 0 && (
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowPresets(!showPresets)}
                  className="text-xs text-amber-600 font-medium flex items-center gap-1 hover:text-amber-700 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{showPresets ? 'Hide Prompt Presets' : 'Try Example Prompts'}</span>
                </button>
              </div>
            )}

            {showPresets && presets.length > 0 && (
              <div className="grid grid-cols-1 gap-1.5 p-2.5 bg-amber-50/60 rounded-lg border border-amber-200/60 mb-2">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onChange(key, preset);
                      setShowPresets(false);
                    }}
                    className="text-left text-xs p-2 rounded bg-white hover:bg-amber-100/50 text-gray-700 border border-amber-100 transition line-clamp-2 font-sans"
                  >
                    "{preset}"
                  </button>
                ))}
              </div>
            )}

            <textarea
              className="w-full p-3 border border-gray-300 focus:border-black rounded-lg text-sm bg-white focus:outline-none transition font-sans shadow-2xs leading-relaxed"
              rows={4}
              value={value}
              onChange={(e) => onChange(key, e.target.value)}
              placeholder={field.placeholder || `Enter ${key}...`}
            />
          </div>
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => onChange(key, e.target.value)}
            className="w-full p-2.5 border border-gray-300 focus:border-black rounded-lg text-sm bg-white focus:outline-none transition cursor-pointer shadow-2xs"
          >
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case 'slider':
        return (
          <div className="space-y-2 p-3 bg-gray-50/80 rounded-lg border border-gray-200/60">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" />
                <span>Range: {field.min} to {field.max} (step {field.step || 1})</span>
              </span>
              <span className="text-sm font-mono font-bold bg-white px-2 py-0.5 rounded border border-gray-200 text-black">
                {value}
              </span>
            </div>
            <input
              type="range"
              className="w-full accent-black cursor-pointer h-1.5 bg-gray-200 rounded-lg"
              min={field.min ?? 0}
              max={field.max ?? 100}
              step={field.step ?? 1}
              value={value}
              onChange={(e) => onChange(key, Number(e.target.value))}
            />
          </div>
        );

      case 'boolean':
        return (
          <button
            type="button"
            onClick={() => onChange(key, !value)}
            className="flex items-center gap-2.5 p-2.5 rounded-lg border border-gray-200 hover:border-gray-400 bg-white transition w-full text-left"
          >
            {value ? (
              <CheckSquare className="w-5 h-5 text-black shrink-0" />
            ) : (
              <Square className="w-5 h-5 text-gray-300 shrink-0" />
            )}
            <span className="text-sm font-medium text-gray-800">
              {value ? 'Enabled' : 'Disabled'}
            </span>
          </button>
        );

      case 'number':
        return (
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="flex-1 p-2.5 border border-gray-300 focus:border-black rounded-lg text-sm font-mono bg-white focus:outline-none transition shadow-2xs"
              value={value}
              onChange={(e) => onChange(key, Number(e.target.value))}
            />
            {key === 'seed' && (
              <button
                type="button"
                onClick={() => onChange(key, Math.floor(Math.random() * 9999999))}
                className="p-2.5 border border-gray-300 hover:border-black rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 transition flex items-center gap-1 text-xs font-medium"
                title="Randomize seed"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Randomize</span>
              </button>
            )}
          </div>
        );

      case 'file':
      case 'multi-file':
        return (
          <div className="space-y-3">
            <div
              onClick={() => {
                // Simulate picking file or setting URL
                const randomImg = SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)];
                onChange(key, field.widget === 'multi-file' ? [randomImg.url] : randomImg.url);
              }}
              className="w-full p-5 border-2 border-dashed border-gray-300 hover:border-black rounded-xl bg-gray-50/70 hover:bg-gray-100/50 flex flex-col items-center justify-center cursor-pointer transition group"
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center mb-2 text-gray-500 group-hover:text-black transition">
                <UploadCloud className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-gray-700 group-hover:text-black">
                Click to attach file, paste URL, or pick sample asset
              </span>
              <span className="text-[11px] text-gray-400 mt-1">
                {field.widget === 'multi-file' ? 'Supports up to 9 PNG/JPEG images' : 'Supports PNG, JPEG, WEBP or MP4'}
              </span>
            </div>

            {/* Quick Sample Picker */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[11px] text-gray-400 font-medium shrink-0 flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> Quick pick:
              </span>
              {SAMPLE_IMAGES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange(key, field.widget === 'multi-file' ? [sample.url] : sample.url)}
                  className={`relative rounded-md overflow-hidden border border-gray-200 shrink-0 group transition ${
                    formData[key] === sample.url ? 'ring-2 ring-black' : 'hover:opacity-80'
                  }`}
                  title={sample.name}
                >
                  <img src={sample.thumb} alt={sample.name} className="w-10 h-10 object-cover" />
                </button>
              ))}
            </div>

            {/* Display Selected Value */}
            {formData[key] && (
              <div className="p-2.5 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-between text-xs font-mono">
                <span className="truncate max-w-[280px] text-gray-700">
                  {Array.isArray(formData[key]) ? `${formData[key].length} files selected` : formData[key]}
                </span>
                <button
                  type="button"
                  onClick={() => onChange(key, field.widget === 'multi-file' ? [] : '')}
                  className="text-red-500 font-sans font-semibold hover:underline ml-2"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        );

      default:
        return (
          <input
            type="text"
            className="w-full p-2.5 border border-gray-300 focus:border-black rounded-lg text-sm bg-white focus:outline-none transition shadow-2xs"
            value={value}
            onChange={(e) => onChange(key, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {Object.keys(properties).map((key) => {
        const field = properties[key] as SchemaProperty;
        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <span>{field.title || key}</span>
                {field.required && <span className="text-red-500">*</span>}
                <span className="text-[11px] font-mono font-normal text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                  {field.type}
                </span>
              </label>
            </div>

            {renderWidget(key, field)}

            {field.help && (
              <p className="text-xs text-gray-500 leading-relaxed flex items-start gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                <span>{field.help}</span>
              </p>
            )}
          </div>
        );
      })}

      <div className="pt-2">
        <button
          type="button"
          disabled={isGenerating}
          onClick={onRun}
          className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 shadow-sm ${
            isGenerating
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-black text-white hover:bg-gray-800 active:scale-[0.99]'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              <span>Running model inference...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Run Model</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
