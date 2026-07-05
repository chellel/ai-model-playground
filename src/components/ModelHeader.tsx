import React, { useState } from 'react';
import { ModelSchema } from '../types';
import { ChevronDown, Check, Zap, Clock, ShieldCheck, Flame } from 'lucide-react';

interface ModelHeaderProps {
  currentModel: ModelSchema;
  models: ModelSchema[];
  onSelectModel: (model: ModelSchema) => void;
}

export const ModelHeader: React.FC<ModelHeaderProps> = ({
  currentModel,
  models,
  onSelectModel,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="mb-8 border-b border-gray-100 pb-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-gray-200 hover:border-black bg-white transition shadow-xs text-left group"
            >
              <span className="text-sm text-gray-500">{currentModel.publisher} /</span>
              <span className="text-lg font-bold text-gray-900 group-hover:text-black">
                {currentModel.name}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-black ml-1 transition-transform" />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2 divide-y divide-gray-100">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Available Models
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {models.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        onSelectModel(m);
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-gray-50 transition flex items-start justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-gray-400">{m.publisher}/</span>
                          <span className="text-sm font-semibold text-gray-900">{m.name}</span>
                        </div>
                        <div className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                          {m.description}
                        </div>
                      </div>
                      {currentModel.id === m.id && (
                        <Check className="w-4 h-4 text-black shrink-0 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 font-mono">
            ID: {currentModel.id}
          </span>
        </div>
      </div>

      <p className="text-gray-600 text-sm max-w-4xl leading-relaxed">
        {currentModel.description}
      </p>

      <div className="flex flex-wrap items-center gap-5 mt-4 text-xs font-medium text-gray-600">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            ● {currentModel.status}
          </span>
        </div>

        <div className="flex items-center gap-1 text-gray-500">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
          <span>Official Model</span>
        </div>

        <div className="flex items-center gap-1 text-gray-500">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>{currentModel.runsCount}</span>
        </div>

        <div className="flex items-center gap-1 text-gray-500">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span>Avg latency: {currentModel.avgTime}</span>
        </div>

        <div className="flex items-center gap-1 text-gray-500 font-mono ml-auto">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>{currentModel.pricePerRun}</span>
        </div>
      </div>
    </div>
  );
};
