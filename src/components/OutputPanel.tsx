import React, { useState } from 'react';
import { ModelSchema, RunLogEntry } from '../types';
import { Download, Share2, Sparkles, Terminal, ChevronDown, ChevronUp, Check, Play, Maximize2, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OutputPanelProps {
  model: ModelSchema;
  isGenerating: boolean;
  logs: RunLogEntry[];
  elapsedSeconds: number;
  outputUrl?: string;
  outputType?: 'video' | 'image' | 'audio' | 'text';
  onTweak: () => void;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  model,
  isGenerating,
  logs,
  elapsedSeconds,
  outputUrl,
  outputType = 'video',
  onTweak,
}) => {
  const [activeTab, setActiveTab] = useState<'Preview' | 'JSON'>('Preview');
  const [showLogs, setShowLogs] = useState(true);
  const [copiedShare, setCopiedShare] = useState(false);

  const displayUrl = outputUrl || (model.category === 'Video Generation' ? model.sampleVideoUrl : model.sampleImageUrl);
  const isVideo = outputType === 'video' || (model.category === 'Video Generation' && !outputUrl);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
    });
    setTimeout(() => setCopiedShare(false), 2500);
  };

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

          {/* Execution Metadata & Actions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span className="flex items-center gap-1.5 font-mono text-xs">
                {isGenerating ? (
                  <span className="text-amber-600 font-semibold">Status: Processing step {(elapsedSeconds % 30) + 1} / 30...</span>
                ) : (
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Generated in {elapsedSeconds > 0 ? `${elapsedSeconds} seconds` : '1 minute 55 seconds'}
                  </span>
                )}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={onTweak}
                disabled={isGenerating}
                className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 hover:border-black hover:bg-gray-50 transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Tweak it</span>
              </button>

              <button
                onClick={handleDownload}
                disabled={isGenerating || !displayUrl}
                className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 hover:border-black hover:bg-gray-50 transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>

              <button
                onClick={handleShare}
                className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 hover:border-black hover:bg-gray-50 transition flex items-center gap-1.5 ml-auto"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">Copied Share Link</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Output</span>
                  </>
                )}
              </button>
            </div>

            {/* Collapsible Logs */}
            <div className="border-t border-gray-100 pt-4 mt-6">
              <div
                onClick={() => setShowLogs(!showLogs)}
                className="flex justify-between items-center cursor-pointer select-none group py-1"
              >
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-gray-500 group-hover:text-black transition" />
                  <span className="text-xs font-bold text-gray-800 group-hover:text-black transition">
                    Execution Logs
                  </span>
                </div>
                <button type="button" className="text-xs text-gray-400 flex items-center gap-1 hover:text-black">
                  <span>{showLogs ? 'Hide logs' : 'Show logs'}</span>
                  {showLogs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {showLogs && (
                <div className="mt-2.5 bg-gray-900 border border-gray-800 p-3.5 rounded-lg text-[11px] font-mono text-gray-300 leading-5 overflow-y-auto max-h-48 space-y-1">
                  {logs.length === 0 ? (
                    <div className="text-gray-500 italic">No logs generated yet. Click 'Run' to begin streaming.</div>
                  ) : (
                    logs.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-gray-500 shrink-0 select-none">[{log.timestamp}]</span>
                        <span className={
                          log.type === 'success' ? 'text-emerald-400 font-semibold' :
                          log.type === 'warn' ? 'text-amber-400' :
                          log.type === 'step' ? 'text-cyan-400' : 'text-gray-300'
                        }>
                          {log.message}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
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
