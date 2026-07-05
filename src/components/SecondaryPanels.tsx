import React from 'react';
import { ModelSchema } from '../types';
import { Check, DollarSign, HelpCircle, Clock, ExternalLink, Sparkles, Layers } from 'lucide-react';

interface PanelProps {
  currentModel: ModelSchema;
  models: ModelSchema[];
  onSelectModel: (model: ModelSchema) => void;
  onBackToPlayground: () => void;
}

export const PricingPanel: React.FC<PanelProps> = ({ currentModel, onBackToPlayground }) => {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8 animate-in fade-in duration-200">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Transparent API Pricing for {currentModel.name}</h2>
        <p className="text-sm text-gray-500">Pay only for exact compute token usage or per-second GPU generation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-xs space-y-4">
          <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Pay As You Go</div>
          <div className="text-3xl font-black text-gray-900">{currentModel.pricePerRun}</div>
          <p className="text-xs text-gray-500 leading-relaxed">Billed strictly per API invocation with guaranteed sub-second scheduling.</p>
          <ul className="space-y-2 text-xs text-gray-700 pt-2 border-t border-gray-100">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Standard GPU cluster access</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Full JSON Schema validation</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Real-time SSE logs streaming</li>
          </ul>
          <button onClick={onBackToPlayground} className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-black transition">
            Test in Playground
          </button>
        </div>

        <div className="border-2 border-purple-600 rounded-2xl p-6 bg-purple-50/20 shadow-md space-y-4 relative">
          <span className="absolute -top-3 right-6 bg-purple-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
            Popular Enterprise
          </span>
          <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Reserved H100 Node</div>
          <div className="text-3xl font-black text-gray-900">$1.80 <span className="text-sm font-normal text-gray-500">/ GPU hour</span></div>
          <p className="text-xs text-gray-500 leading-relaxed">Dedicated cluster instances with zero cold start for high-concurrency production workflows.</p>
          <ul className="space-y-2 text-xs text-gray-700 pt-2 border-t border-gray-100">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Zero queue latency</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 99.99% SLA uptime guarantee</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Private VPC endpoint support</li>
          </ul>
          <button onClick={() => alert("Contacting enterprise sales team...")} className="w-full py-2.5 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition shadow-sm">
            Deploy Dedicated Node
          </button>
        </div>

        <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-xs space-y-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Batch Processing</div>
          <div className="text-3xl font-black text-gray-900">50% Off</div>
          <p className="text-xs text-gray-500 leading-relaxed">Submit offline background video or image rendering jobs with 24-hour turnaround.</p>
          <ul className="space-y-2 text-xs text-gray-700 pt-2 border-t border-gray-100">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Automatic webhook delivery</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Up to 10,000 tasks per batch</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Priority error retry</li>
          </ul>
          <button onClick={onBackToPlayground} className="w-full py-2.5 rounded-xl border border-gray-300 text-gray-800 text-xs font-semibold hover:bg-gray-50 transition">
            View Batch API Docs
          </button>
        </div>
      </div>
    </div>
  );
};

export const HistoryPanel: React.FC<PanelProps> = ({ currentModel, onBackToPlayground }) => {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Recent Generation History</h2>
          <p className="text-xs text-gray-500">Locally cached test runs for {currentModel.name}</p>
        </div>
        <button onClick={onBackToPlayground} className="px-4 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:bg-gray-800 transition">
          + New Generation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs flex flex-col">
            <div className="aspect-video bg-gray-900 relative">
              {currentModel.sampleVideoUrl ? (
                <video src={currentModel.sampleVideoUrl} controls className="w-full h-full object-cover" />
              ) : (
                <img src={currentModel.sampleImageUrl} alt="History sample" className="w-full h-full object-cover" />
              )}
              <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                Run #{902 + i}
              </span>
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-gray-900 flex items-center justify-between">
                  <span>{currentModel.name}</span>
                  <span className="text-emerald-600 font-normal">Success (44.2s)</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1 italic">
                  "{currentModel.properties.prompt?.default || 'Sample prompt execution...'}"
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-[11px] text-gray-400">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 2 hours ago</span>
                <button onClick={onBackToPlayground} className="text-purple-600 font-semibold hover:underline">Re-run settings</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const FAQsPanel: React.FC = () => {
  const faqs = [
    { q: "How do I authenticate API requests?", a: "Pass your API key as a Bearer token in the HTTP Authorization header: Authorization: Bearer YOUR_API_TOKEN." },
    { q: "What is the maximum prompt length?", a: "For video generation models like seedance-2.0 and veo-2, prompts support up to 4000 alphanumeric characters." },
    { q: "Does the model support native Foley sound?", a: "Yes! ByteDance seedance-2.0 native audio model synthesizes realistic environmental sound effects matching visual action automatically." },
    { q: "How does SSE streaming work?", a: "Our endpoint emitsServer-Sent Events (SSE) with stage progress (loading weights, denoising steps 1-50, encoding MP4) so your UI can display real-time status." }
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6 animate-in fade-in duration-200">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border border-gray-200 rounded-xl p-5 bg-white shadow-2xs space-y-2">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-purple-600 shrink-0" />
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed pl-6">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SimilarModelsPanel: React.FC<PanelProps> = ({ currentModel, models, onSelectModel, onBackToPlayground }) => {
  const similar = models.filter(m => m.id !== currentModel.id);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-6 animate-in fade-in duration-200">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-900">Explore Similar Multimodal Models</h2>
        <p className="text-xs text-gray-500">Switch models seamlessly with unified API payloads</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {similar.map(m => (
          <div key={m.id} className="border border-gray-200 rounded-xl p-5 bg-white shadow-xs hover:border-purple-400 transition flex flex-col justify-between space-y-4">
            <div>
              <div className="text-[11px] font-semibold text-purple-600 uppercase">{m.publisher}</div>
              <h3 className="font-bold text-base text-gray-900 mt-0.5">{m.name}</h3>
              <p className="text-xs text-gray-500 line-clamp-3 mt-2 leading-relaxed">{m.description}</p>
            </div>
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-mono text-gray-700 font-semibold">{m.pricePerRun}</span>
              <button
                onClick={() => {
                  onSelectModel(m);
                  onBackToPlayground();
                }}
                className="px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-semibold transition flex items-center gap-1"
              >
                <span>Switch</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
