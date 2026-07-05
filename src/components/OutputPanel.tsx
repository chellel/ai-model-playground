import React, { useState } from 'react';
import { ModelSchema, RunLogEntry } from '../types';
import { Download, Sparkles } from 'lucide-react';

interface OutputPanelProps {
  model: ModelSchema;
  isGenerating: boolean;
  logs: RunLogEntry[];
  elapsedSeconds: number;
  outputUrl?: string;
  outputType?: 'video' | 'image' | 'audio' | 'text';
  onTweak?: () => void;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  model,
  isGenerating,
  elapsedSeconds,
  outputUrl,
  outputType = 'video',
}) => {
  const [activeTab, setActiveTab] = useState<'Preview' | 'JSON'>('Preview');

  const displayUrl = outputUrl || (model.category === 'Video Generation' ? model.sampleVideoUrl : model.sampleImageUrl);
  const isVideo = outputType === 'video' || (model.category === 'Video Generation' && !outputUrl);

  const handleDownload = () => {
    if (!displayUrl) return;
    const link = document.createElement('a');
    link.href = displayUrl;
    link.download = `${model.name}-output-${Date.now()}.${isVideo ? 'mp4' : 'jpg'}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-2">
        <div className="flex gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('Preview')}
            className={`pb-2 -mb-2.5 transition ${
              activeTab === 'Preview'
                ? 'border-b-2 border-black text-black font-semibold'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('JSON')}
            className={`pb-2 -mb-2.5 transition ${
              activeTab === 'JSON'
                ? 'border-b-2 border-black text-black font-semibold'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            JSON Response
          </button>
        </div>

        {isGenerating && (
          <div className="flex items-center gap-2 text-xs text-amber-600 font-mono font-medium animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Computing: {elapsedSeconds}s</span>
          </div>
        )}
      </div>

      {activeTab === 'Preview' ? (
        <div className="space-y-6">
          {/* Media Viewport */}
          <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-950 aspect-video flex items-center justify-center group">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-gray-800 border-t-amber-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base mb-1">
                    Generating on A100 GPU Cluster
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Running diffusion sampler for <span className="text-white font-mono">{model.name}</span>.
                    Typically completes in {model.avgTime}.
                  </p>
                </div>
              </div>
            ) : model.category === 'Language Model' || outputType === 'text' ? (
              <div className="w-full h-full bg-gray-950 p-6 flex flex-col justify-between overflow-y-auto text-gray-100 font-sans text-left">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        ✦
                      </div>
                      <span className="font-bold text-sm text-gray-200">{model.name} Response</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[11px] border border-emerald-500/30 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      256K Context • Reasoning Active
                    </span>
                  </div>
                  <div className="text-xs text-gray-300 leading-relaxed font-mono bg-gray-900/90 p-4 rounded-xl border border-gray-800/80 space-y-3 shadow-inner">
                    <div className="text-emerald-400 font-semibold border-b border-gray-800 pb-2 flex items-center justify-between">
                      <span>// [CoT Reasoning Chain: Completed in 1.4s]</span>
                      <span className="text-gray-500 text-[10px]">Web Search Grounded</span>
                    </div>
                    <p className="font-sans text-gray-200 leading-normal">
                      黑暗森林法则的自洽性根植于两个不可调和的公理（生存第一性与资源有限性）与两大宇宙学特征（猜疑链与技术爆炸）。
                    </p>
                    <p className="font-sans text-gray-200 leading-normal">
                      在博弈论框架下，任何高阶文明面对未知坐标时，选择“静默观察”存在遭遇对方爆发性打击的极端尾部风险。由此，先发制人（Preemptive Strike）成为唯一存在纳什均衡的博弈解：
                    </p>
                    <pre className="bg-black/80 p-3.5 rounded-lg border border-gray-800 text-emerald-300 overflow-x-auto text-[11px] font-mono leading-relaxed">
{`interface DarkForestGame {
  selfLevel: number;
  targetLevel: number;
  suspicionChainFactor: number; // 猜疑链指数 [0, 1]
}

function computeDominantStrategy(game: DarkForestGame): 'STRIKE' | 'OBSERVE' {
  // 因通信延迟与异星文化壁垒，猜疑链指数不可避免趋近于 1
  if (game.suspicionChainFactor >= 0.99) {
    // 扣除探测成本后，打击的期望收益恒定大于暴露坐标的风险预期
    return 'STRIKE';
  }
  return 'OBSERVE';
}`}
                    </pre>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-gray-900/80 flex items-center justify-between text-[11px] text-gray-400 font-mono">
                  <span>Tokens Output: 612 (Speed: 164 tok/s)</span>
                  <span className="text-emerald-400 font-semibold">● Structured Schema Verified</span>
                </div>
              </div>
            ) : isVideo && displayUrl ? (
              <video
                src={displayUrl}
                controls
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain bg-black"
              />
            ) : displayUrl ? (
              <img
                src={displayUrl}
                alt="Model output"
                className="w-full h-full object-contain bg-gray-900"
              />
            ) : (
              <div className="text-gray-500 text-xs">No preview generated yet.</div>
            )}
          </div>

          {/* Execution Actions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                {isGenerating && (
                  <span className="text-amber-600 font-mono text-xs font-semibold">
                    Status: Processing step {(elapsedSeconds % 30) + 1} / 30...
                  </span>
                )}
              </div>

              <button
                onClick={handleDownload}
                disabled={isGenerating || !displayUrl}
                className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 hover:border-black hover:bg-gray-50 transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* JSON Response View */
        <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto max-h-[580px] border border-gray-800">
          <pre className="text-xs font-mono text-emerald-400 leading-relaxed">
            {JSON.stringify(
              {
                id: `prediction_${Math.random().toString(36).substring(2, 10)}`,
                version: model.id,
                status: isGenerating ? 'processing' : 'succeeded',
                created_at: new Date().toISOString(),
                started_at: new Date(Date.now() - elapsedSeconds * 1000).toISOString(),
                completed_at: isGenerating ? null : new Date().toISOString(),
                metrics: {
                  predict_time: elapsedSeconds || 111.7,
                },
                output: isGenerating ? null : displayUrl,
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
};
