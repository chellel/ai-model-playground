import React, { useState, useRef, useEffect } from 'react';
import { 
  Trash2, 
  Plus, 
  Send, 
  User, 
  Sparkles, 
  Copy, 
  Check, 
  MessageSquare
} from 'lucide-react';
import { ModelSchema } from '../types';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
  reasoningTime?: string;
  tokens?: number;
}

interface ChatPlaygroundProps {
  currentModel: ModelSchema;
  formData: Record<string, any>;
  onReset: () => void;
}

export const ChatPlayground: React.FC<ChatPlaygroundProps> = ({
  currentModel,
  formData
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: 'Hello! What can I help you with?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-1',
        role: 'assistant',
        content: 'Hello! What can I help you with?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = () => {
    if (!inputPrompt.trim() || isStreaming) return;

    const userText = inputPrompt;
    setInputPrompt('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);

    // Simulate GPT-5.4 CoT & response streaming
    setTimeout(() => {
      let replyContent = '';
      let reasoningTime = '1.2s';
      let tokens = 428;

      if (userText.includes('三体') || userText.includes('黑暗森林') || userText.includes('博弈')) {
        replyContent = `黑暗森林法则的自洽性根植于两大宇宙学特征：猜疑链与技术爆炸。\n\n在博弈论框架下，任何高阶文明面对未知坐标时，选择“静默观察”存在遭遇对方爆发性打击的极端尾部风险。由此，先发制人（Preemptive Strike）成为唯一存在纳什均衡的博弈解：\n\n\`\`\`typescript\ninterface DarkForestGame {\n  selfLevel: number;\n  targetLevel: number;\n  suspicionChainFactor: number; // 猜疑链指数 [0, 1]\n}\n\nfunction computeDominantStrategy(game: DarkForestGame): 'STRIKE' | 'OBSERVE' {\n  if (game.suspicionChainFactor >= 0.99) {\n    return 'STRIKE'; // 扣除成本后打击为严格优势策略\n  }\n  return 'OBSERVE';\n}\n\`\`\``;
        reasoningTime = formData.reasoning_effort === 'high' || formData.reasoning_effort === 'xhigh' ? '3.8s' : '1.4s';
        tokens = 612;
      } else {
        if (currentModel.id.includes('qwen')) {
          replyContent = `我是阿里云通义千问旗下的 ${currentModel.name} 旗舰模型。我已开启深度思考与多轮对话就绪，能够根据您左侧配置的参数（Temperature: ${formData.temperature ?? 0.85}，Top P: ${formData.top_p ?? 0.8}）为您实时输出准确且富有逻辑的推演与解答！\n\n您可以随时向我提出任何逻辑推演、编程开发或多语言文本分析需求！`;
        } else if (currentModel.id.includes('gemini')) {
          replyContent = `我是 Google DeepMind 旗下的 ${currentModel.name} 原生多模态推理旗舰模型。我已开启长逻辑思维推导（Thinking Level: ${formData.thinking_level ?? 'HIGH'}）与 2M 超长上下文处理就绪！\n\n您可以随时向我提出任何代码系统架构设计、复杂 STEM 数学推导、长文理解或视听多模态分析需求！`;
        } else {
          replyContent = `我是基于 ${currentModel.publisher} 架构的 ${currentModel.name} 模型。我已就绪，能够根据您左侧配置的 System Prompt 及参数为您实时输出解答。\n\n您可以随时向我提出任何编程、逻辑推演或多模态文本处理需求！`;
        }
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reasoningTime,
        tokens
      };

      setMessages(prev => [...prev, botMsg]);
      setIsStreaming(false);
    }, 1200);
  };

  return (
    <div className="relative bg-white border border-gray-200/80 rounded-2xl shadow-xs flex flex-col h-[760px] overflow-hidden">
      {/* Top Header matching prototype */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-base">AI 多轮对话窗口</h3>
              <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-600 font-mono text-xs font-semibold">
                {currentModel.name}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              {formData.reasoning_effort && formData.reasoning_effort !== 'none' ? `深度推理: ${formData.reasoning_effort}` : '极速对话模式'} • 已实时应用左侧所有参数配置
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition"
            title="清空对话记录"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>清空</span>
          </button>
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 font-semibold transition"
            title="开启新对话"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新对话</span>
          </button>
        </div>
      </div>

      {/* Main Chat Log Area */}
      <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-6 bg-slate-50/40">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[88%] ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                msg.role === 'user'
                  ? 'bg-gray-900 text-white'
                  : 'bg-purple-600 text-white shadow-xs'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>

            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2 px-1">
                <span className="text-[11px] font-semibold text-gray-500">
                  {msg.role === 'user' ? 'You' : currentModel.name}
                </span>
                <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                {msg.reasoningTime && (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-mono flex items-center gap-1">
                    <span>✦ 深度思考: {msg.reasoningTime}</span>
                  </span>
                )}
              </div>

              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed relative group ${
                  msg.role === 'user'
                    ? 'bg-gray-900 text-white rounded-tr-xs shadow-xs'
                    : 'bg-white text-gray-800 rounded-tl-xs border border-gray-200/80 shadow-2xs font-sans whitespace-pre-wrap'
                }`}
              >
                {msg.content}

                {msg.role === 'assistant' && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 p-1.5 bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 transition shadow-2xs"
                    title="复制内容"
                  >
                    {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {msg.tokens && (
                <div className="px-1 text-[10px] text-gray-400 font-mono">
                  Output tokens: {msg.tokens}
                </div>
              )}
            </div>
          </div>
        ))}

        {isStreaming && (
          <div className="flex gap-3 max-w-[80%] mr-auto items-center animate-pulse">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl border border-gray-200/80 text-xs text-gray-600 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
              <span>{formData.thinking_level ? `正在进行 Gemini 思维链深度逻辑推导 (Thinking: ${formData.thinking_level})...` : formData.reasoning_effort && formData.reasoning_effort !== 'none' ? `正在进行 CoT 深入推理推导 (Effort: ${formData.reasoning_effort})...` : `${currentModel.name} 正在快速推演生成响应...`}</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input bar matching screenshot */}
      <div className="p-4 border-t border-gray-100 bg-white shrink-0">
        <div className="border border-gray-200/90 rounded-2xl p-2 pl-4 flex items-center gap-3 bg-white focus-within:border-gray-400 focus-within:shadow-sm transition">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="输入想提问的内容，或测试系统角色与推理配置..."
            className="flex-1 text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!inputPrompt.trim() || isStreaming}
            className={`p-2.5 rounded-xl transition flex items-center justify-center ${
              inputPrompt.trim() && !isStreaming
                ? 'bg-gray-900 hover:bg-gray-800 text-white shadow-xs'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
