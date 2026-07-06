import React, { useState, useEffect } from 'react';
import { ModelSchema, SchemaProperty } from '../types';
import { Code, Copy, Check, Terminal, Key, ArrowRight, BookOpen, Layers, ExternalLink } from 'lucide-react';

interface ApiDocsPanelProps {
  currentModel: ModelSchema;
  formData: Record<string, any>;
  onBackToPlayground: () => void;
}

export const ApiDocsPanel: React.FC<ApiDocsPanelProps> = ({
  currentModel,
  formData,
  onBackToPlayground,
}) => {
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'cURL' | 'Python' | 'Node.js' | 'JSON'>('cURL');

  const isGpt54 = currentModel.id.toLowerCase().includes('gpt-5.4') || currentModel.name.toLowerCase().includes('gpt-5.4');
  const isGpt4o = currentModel.id.toLowerCase().includes('gpt-4o') || currentModel.name.toLowerCase().includes('gpt-4o');
  const isQwen = currentModel.id.toLowerCase().includes('qwen') || currentModel.name.toLowerCase().includes('qwen');
  const isClaude = currentModel.id.toLowerCase().includes('claude') || currentModel.name.toLowerCase().includes('claude');
  const isGeminiLLM = (currentModel.id.toLowerCase().includes('gemini') || currentModel.name.toLowerCase().includes('gemini')) && currentModel.category === 'Language Model';
  const isChatModel = currentModel.category === 'Language Model' || isGpt54 || isGpt4o || isQwen || isClaude || isGeminiLLM;

  const isResponsesApi = currentModel.api_client === 'openai-responses';

  let endpointUrl = 'https://api.replicate.com/v1/predictions';
  if (isResponsesApi) {
    endpointUrl = '/v1/responses';
  } else if (isClaude) {
    endpointUrl = 'https://api.anthropic.com/v1/messages';
  } else if (isGpt54) {
    endpointUrl = '/v1/chat/completions';
  } else if (isGpt4o) {
    endpointUrl = 'https://api.openai.com/v1/chat/completions';
  } else if (isQwen) {
    endpointUrl = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
  } else if (isGeminiLLM) {
    endpointUrl = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel.name || 'gemini-2.5-pro'}:generateContent`;
  } else if (isChatModel) {
    endpointUrl = '/v1/chat/completions';
  }

  useEffect(() => {
    if (isGpt54 && (selectedLang === 'Python' || selectedLang === 'Node.js')) {
      setSelectedLang('cURL');
    }
  }, [isGpt54, selectedLang]);

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText(endpointUrl);
    setCopiedEndpoint(true);
    setTimeout(() => setCopiedEndpoint(false), 2000);
  };

  const cleanInputs = { ...formData };
  Object.keys(cleanInputs).forEach((k) => {
    if (cleanInputs[k] === '' || cleanInputs[k] === undefined) {
      delete cleanInputs[k];
    }
  });

  const getChatPayload = () => {
    if (isResponsesApi) {
      const instructions = cleanInputs.system_prompt || 'You are a helpful assistant.';
      let inputMsg: any[] = [];
      if (cleanInputs.messages && Array.isArray(cleanInputs.messages) && cleanInputs.messages.length > 0) {
        inputMsg = cleanInputs.messages;
      } else if (typeof cleanInputs.messages === 'string' && cleanInputs.messages.trim().startsWith('[')) {
        try {
          const parsed = JSON.parse(cleanInputs.messages);
          if (Array.isArray(parsed)) inputMsg = parsed;
        } catch {
          inputMsg = [{ role: 'user', content: cleanInputs.messages }];
        }
      } else if (cleanInputs.prompt) {
        inputMsg = [{ role: 'user', content: cleanInputs.prompt }];
      } else {
        inputMsg = [{ role: 'user', content: 'Explain quantum computing...' }];
      }

      const payload: Record<string, any> = {
        model: currentModel.name || 'gpt-5.4',
        instructions,
        input: inputMsg,
        stream: true,
      };

      Object.entries(currentModel.properties || {}).forEach(([key, prop]: [string, any]) => {
        const val = cleanInputs[key];
        if (val !== undefined && val !== null && val !== '') {
          if (key === 'reasoning_effort' && val === 'none') return;
          const targetPath = prop.target_path || prop.targetPath;
          if (!targetPath || targetPath === 'instructions' || targetPath === 'input') return;
          const parts = targetPath.split('.');
          let curr = payload;
          for (let i = 0; i < parts.length - 1; i++) {
            curr[parts[i]] = curr[parts[i]] || {};
            curr = curr[parts[i]];
          }
          const lastPart = parts[parts.length - 1];
          curr[lastPart] = !isNaN(Number(val)) && (prop.type === 'integer' || prop.type === 'number') ? Number(val) : val;
        }
      });
      return payload;
    }

    const messages: any[] = [];
    if (cleanInputs.system_prompt) {
      messages.push({ role: 'system', content: cleanInputs.system_prompt });
    }
    if (cleanInputs.messages && Array.isArray(cleanInputs.messages) && cleanInputs.messages.length > 0) {
      messages.push(...cleanInputs.messages);
    } else if (typeof cleanInputs.messages === 'string' && cleanInputs.messages.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(cleanInputs.messages);
        if (Array.isArray(parsed)) messages.push(...parsed);
      } catch {
        messages.push({ role: 'user', content: cleanInputs.messages });
      }
    } else if (cleanInputs.prompt) {
      messages.push({ role: 'user', content: cleanInputs.prompt });
    } else if (messages.length === 0) {
      messages.push({ role: 'user', content: isQwen ? '推演量子计算与现代密码学的演进关系...' : 'Explain the mathematical logic of game theory...' });
    }

    const payload: Record<string, any> = {
      model: currentModel.name || 'gpt-5.4',
      messages,
    };
    if (cleanInputs.reasoning_effort && cleanInputs.reasoning_effort !== 'none') {
      payload.reasoning_effort = cleanInputs.reasoning_effort;
    }
    if (cleanInputs.verbosity) {
      payload.verbosity = cleanInputs.verbosity;
    }
    if (cleanInputs.max_completion_tokens) {
      payload.max_completion_tokens = Number(cleanInputs.max_completion_tokens) || 16384;
    }
    if (cleanInputs.max_tokens) {
      payload.max_tokens = Number(cleanInputs.max_tokens);
    }
    if (cleanInputs.temperature !== undefined) {
      payload.temperature = Number(cleanInputs.temperature);
    }
    if (cleanInputs.top_p !== undefined) {
      payload.top_p = Number(cleanInputs.top_p);
    }
    if (cleanInputs.response_format) {
      payload.response_format = cleanInputs.response_format === 'json_object' ? { type: 'json_object' } : { type: 'text' };
    }
    if (cleanInputs.enable_thinking !== undefined) {
      payload.enable_thinking = cleanInputs.enable_thinking;
    }
    if (cleanInputs.enable_search !== undefined) {
      payload.enable_search = cleanInputs.enable_search;
    }
    return payload;
  };

  const getSampleCode = () => {
    if (isChatModel) {
      if (isGeminiLLM) {
        const geminiModelName = currentModel.name || 'gemini-2.5-pro';
        const promptText = cleanInputs.prompt || 'Explain the mathematical logic of game theory...';
        const geminiPayload = {
          contents: cleanInputs.messages?.length ? cleanInputs.messages : [{ role: 'user', parts: [{ text: promptText }] }],
          ...(cleanInputs.system_prompt ? { systemInstruction: { parts: [{ text: cleanInputs.system_prompt }] } } : {}),
          generationConfig: {
            temperature: cleanInputs.temperature !== undefined ? Number(cleanInputs.temperature) : 1.0,
            topP: cleanInputs.top_p !== undefined ? Number(cleanInputs.top_p) : 0.95,
            ...(cleanInputs.top_k !== undefined ? { topK: Number(cleanInputs.top_k) } : {}),
            ...(cleanInputs.max_output_tokens ? { maxOutputTokens: Number(cleanInputs.max_output_tokens) } : {}),
          }
        };

        switch (selectedLang) {
          case 'cURL':
            return `curl -s -X POST \\
  -H "Content-Type: application/json" \\
  "https://generativelanguage.googleapis.com/v1beta/models/${geminiModelName}:generateContent?key=$GEMINI_API_KEY" \\
  -d '${JSON.stringify(geminiPayload, null, 2).replace(/\n/g, '\n  ')}'`;
          case 'Python':
            return `import os
from google import genai
from google.genai import types

# 按照 Google 官方 @google/genai SDK 规范初始化客户端
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

response = client.models.generate_content(
    model="${geminiModelName}",
    contents="${promptText.replace(/"/g, '\\"')}",
    config=types.GenerateContentConfig(
        ${cleanInputs.system_prompt ? `system_instruction="${cleanInputs.system_prompt.replace(/"/g, '\\"')}",\n        ` : ''}temperature=${cleanInputs.temperature !== undefined ? cleanInputs.temperature : 1.0},
        top_p=${cleanInputs.top_p !== undefined ? cleanInputs.top_p : 0.95}${cleanInputs.max_output_tokens ? `,\n        max_output_tokens=${cleanInputs.max_output_tokens}` : ''}
    )
)

print("Output Result:", response.text)`;
          case 'Node.js':
            return `import { GoogleGenAI } from '@google/genai';

// 按照 Google 官方 @google/genai SDK 规范初始化服务端客户端
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function runGemini() {
  console.log("Submitting Gemini task...");
  const response = await ai.models.generateContent({
    model: '${geminiModelName}',
    contents: ${JSON.stringify(geminiPayload.contents, null, 4)},
    config: ${JSON.stringify(geminiPayload.generationConfig, null, 4)}
  });
  console.log("Result:", response.text);
}

runGemini();`;
          case 'JSON':
            return JSON.stringify(geminiPayload, null, 2);
        }
      }

      if (isClaude) {
        const claudeModelName = currentModel.name || 'claude-4.5-sonnet';
        const userContent: any[] = [];
        if (cleanInputs.image) {
          userContent.push({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: '<base64_data>' } });
        }
        userContent.push({ type: 'text', text: cleanInputs.prompt || 'Explain quantum computing...' });

        const claudePayload: Record<string, any> = {
          model: claudeModelName,
          max_tokens: cleanInputs.max_tokens ? Number(cleanInputs.max_tokens) : 8192,
          messages: cleanInputs.messages?.length ? cleanInputs.messages : [{ role: 'user', content: userContent.length === 1 ? userContent[0].text : userContent }]
        };
        if (cleanInputs.system_prompt) {
          claudePayload.system = cleanInputs.system_prompt;
        }
        if (cleanInputs.max_image_resolution !== undefined) {
          claudePayload.max_image_resolution = Number(cleanInputs.max_image_resolution);
        }

        switch (selectedLang) {
          case 'cURL':
            return `curl -s -X POST \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "content-type: application/json" \\
  "https://api.anthropic.com/v1/messages" \\
  -d '${JSON.stringify(claudePayload, null, 2).replace(/\n/g, '\n  ')}'`;
          case 'Python':
            return `import os
import anthropic

# 初始化 Anthropic 官方 SDK 客户端
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

response = client.messages.create(
    model="${claudeModelName}",
    max_tokens=${claudePayload.max_tokens},${claudePayload.system ? `\n    system="${claudePayload.system.replace(/"/g, '\\"')}",` : ''}
    messages=${JSON.stringify(claudePayload.messages, null, 4)}${claudePayload.max_image_resolution !== undefined ? `,\n    max_image_resolution=${claudePayload.max_image_resolution}` : ''}
)

print("Output Result:", response.content[0].text)`;
          case 'Node.js':
            return `import Anthropic from '@anthropic-ai/sdk';

// 初始化 @anthropic-ai/sdk 官方客户端
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function runClaude() {
  console.log("Submitting Claude Sonnet task...");
  const msg = await anthropic.messages.create(${JSON.stringify(claudePayload, null, 4)});
  console.log("Result:", msg.content[0].text);
}

runClaude();`;
          case 'JSON':
            return JSON.stringify(claudePayload, null, 2);
        }
      }

      const payload = getChatPayload();
      const authHeader = isQwen ? '$DASHSCOPE_API_KEY' : '$OPENAI_API_KEY';

      switch (selectedLang) {
        case 'cURL':
          return `curl -s -X POST \\
  -H "Authorization: Bearer ${authHeader}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(payload, null, 2).replace(/\n/g, '\n  ')}' \\
  ${endpointUrl}`;
        case 'Python':
          if (isQwen) {
            return `import os
from openai import OpenAI

# 按照阿里云通义千问官方兼容规范初始化客户端
client = OpenAI(
    api_key=os.getenv("DASHSCOPE_API_KEY"),
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
)

response = client.chat.completions.create(
    model="${payload.model}",
    messages=${JSON.stringify(payload.messages, null, 4)}${payload.temperature !== undefined ? `,\n    temperature=${payload.temperature}` : ''}${payload.top_p !== undefined ? `,\n    top_p=${payload.top_p}` : ''}${payload.max_tokens !== undefined ? `,\n    max_tokens=${payload.max_tokens}` : ''}
)

print("Output Result:", response.choices[0].message.content)`;
          }
          return `from openai import OpenAI

# 初始化 OpenAI 官方客户端
client = OpenAI(api_key="your_api_key")

# 调用 ${currentModel.name} 的 chat completions 接口
response = client.chat.completions.create(
    model="${payload.model}",
    messages=${JSON.stringify(payload.messages, null, 4)}${payload.reasoning_effort ? `,\n    reasoning_effort="${payload.reasoning_effort}"` : ''}${payload.verbosity ? `,\n    verbosity="${payload.verbosity}"` : ''}${payload.max_completion_tokens ? `,\n    max_completion_tokens=${payload.max_completion_tokens}` : ''}${payload.temperature !== undefined ? `,\n    temperature=${payload.temperature}` : ''}${payload.top_p !== undefined ? `,\n    top_p=${payload.top_p}` : ''}${payload.max_tokens !== undefined ? `,\n    max_tokens=${payload.max_tokens}` : ''}
)

print("Output Result:", response.choices[0].message.content)`;
        case 'Node.js':
          if (isQwen) {
            return `import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

async function runPrediction() {
  console.log("Submitting Qwen chat completion task...");
  const completion = await openai.chat.completions.create(${JSON.stringify(payload, null, 4)});
  console.log("Result:", completion.choices[0].message.content);
}

runPrediction();`;
          }
          return `import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function runPrediction() {
  console.log("Submitting chat completion task...");
  const completion = await openai.chat.completions.create(${JSON.stringify(payload, null, 4)});
  console.log("Result:", completion.choices[0].message.content);
}

runPrediction();`;
        case 'JSON':
          return JSON.stringify(payload, null, 2);
      }
    }

    switch (selectedLang) {
      case 'cURL':
        return `curl -s -X POST \\
  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "version": "${currentModel.id}",
    "input": ${JSON.stringify(cleanInputs, null, 6)}
  }' \\
  ${endpointUrl}`;
      case 'Python':
        return `import replicate

# 运行模型 ${currentModel.name}
output = replicate.run(
    "${currentModel.id}",
    input=${JSON.stringify(cleanInputs, null, 4)}
)

print("Output Result:", output)`;
      case 'Node.js':
        return `import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function runPrediction() {
  console.log("Submitting prediction task...");
  const output = await replicate.run(
    "${currentModel.id}",
    {
      input: ${JSON.stringify(cleanInputs, null, 6)}
    }
  );
  console.log("Result:", output);
}

runPrediction();`;
      case 'JSON':
        return JSON.stringify({
          version: currentModel.id,
          input: cleanInputs
        }, null, 2);
    }
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(getSampleCode());
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  // 整理有效显示的 schema properties
  const validProperties = (Object.entries(currentModel.properties) as [string, SchemaProperty][])
    .filter(([, prop]) => prop.visible !== false && prop.status !== 'disabled')
    .sort(([, a], [, b]) => (a['x-order'] ?? 99) - (b['x-order'] ?? 99));

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-10 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200/60 text-blue-700 font-bold text-xs">
            <Code className="w-3.5 h-3.5" />
            <span>API Reference & Documentation</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            {currentModel.name} <span className="text-gray-400 font-normal">HTTP API</span>
          </h2>
          <p className="text-sm text-gray-500">
            通过 HTTP 请求直接调用或集成该 AI 模型，支持异步预测与实时状态查询。
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onBackToPlayground}
            className="px-4 py-2 rounded-xl bg-gray-900 text-white font-semibold text-xs hover:bg-black transition shadow-xs flex items-center gap-1.5"
          >
            <span>返回 Playground 调试</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 左侧主要文档说明区 */}
        <div className="lg:col-span-7 space-y-8">
          {/* Endpoint 卡片 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-600" />
              <span>HTTP Endpoint 请求地址</span>
            </h3>
            <div className="flex items-center justify-between gap-3 bg-gray-900 text-gray-100 px-4 py-3 rounded-xl font-mono text-xs overflow-x-auto border border-gray-800">
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2 py-0.5 rounded bg-blue-600 font-bold text-[11px] text-white">POST</span>
                <span className="text-gray-300">{endpointUrl}</span>
              </div>
              <button
                onClick={handleCopyEndpoint}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 text-[11px] transition shrink-0 border border-gray-700 cursor-pointer"
              >
                {copiedEndpoint ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>复制地址</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Schema Request Parameters 参数参考 */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xs">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-gray-900">请求参数表 (Input Parameters Schema)</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">模型入参字段、数据类型及可选规则</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold font-mono">
                {validProperties.length} Parameters
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {validProperties.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-400">
                  当前模型未启用任何可调入参字段。
                </div>
              ) : (
                validProperties.map(([key, prop]) => {
                  const isReq = !!prop.required;
                  return (
                    <div key={key} className="p-5 hover:bg-gray-50/60 transition space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-blue-600">{key}</span>
                          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-mono text-[11px] font-medium">
                            {prop.type || 'string'}
                          </span>
                          {isReq ? (
                            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold uppercase">
                              必填 (Required)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-400 text-[10px]">
                              可选 (Optional)
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-700 leading-relaxed font-medium">
                        {prop.description || prop.titleEn || prop.title || '该字段参数用于控制模型处理行为。'}
                      </div>
                      {prop.titleEn && prop.description && prop.titleEn !== prop.description && (
                        <div className="text-[11px] text-gray-400 font-sans">
                          {prop.titleEn}
                        </div>
                      )}
                      {((prop.default !== undefined && prop.default !== '') || prop.min !== undefined || prop.max !== undefined || prop.minimum !== undefined || prop.maximum !== undefined) && (
                        <div className="flex flex-wrap items-center gap-2 pt-0.5">
                          {prop.default !== undefined && prop.default !== '' && (
                            <div className="text-[11px] font-mono text-gray-600 bg-gray-100 px-2.5 py-1 rounded border border-gray-200/60">
                              默认值: <span className="text-gray-900 font-bold">{String(prop.default)}</span>
                            </div>
                          )}
                          {(prop.min !== undefined || prop.max !== undefined || prop.minimum !== undefined || prop.maximum !== undefined) && (
                            <div className="text-[11px] font-mono text-cyan-700 bg-cyan-50/60 px-2.5 py-1 rounded border border-cyan-100">
                              范围限制: {[
                                (prop.min ?? prop.minimum) !== undefined ? `Min >= ${prop.min ?? prop.minimum}` : '',
                                (prop.max ?? prop.maximum) !== undefined ? `Max <= ${prop.max ?? prop.maximum}` : ''
                              ].filter(Boolean).join(' | ')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* 右侧交互代码及响应示例区 */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          {/* 代码片段生成器 */}
          <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-md">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-950 border-b border-gray-800">
              <div className="flex items-center gap-1.5">
                {(isGpt54 ? (['cURL', 'JSON'] as const) : (['cURL', 'Python', 'Node.js', 'JSON'] as const)).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLang(lang as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono transition cursor-pointer ${
                      selectedLang === lang
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/80'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCopySnippet}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs transition border border-gray-700 cursor-pointer"
              >
                {copiedSnippet ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>复制</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 overflow-x-auto max-h-[420px] overflow-y-auto">
              <pre className="text-xs font-mono text-gray-300 leading-relaxed">
                <code>{getSampleCode()}</code>
              </pre>
            </div>
          </div>

          {/* 响应返回结构 Response Schema */}
          <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-md">
            <div className="px-4 py-3 bg-gray-950 border-b border-gray-800 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-gray-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Response Object (Example Payload)</span>
              </span>
              <span className="text-[10px] text-gray-500 font-mono">{isChatModel ? "200 OK" : "201 Created"}</span>
            </div>
            <div className="p-4 overflow-x-auto">
              <pre className="text-xs font-mono text-emerald-400/90 leading-relaxed">
                <code>{JSON.stringify(
                  isGeminiLLM ? {
                    candidates: [
                      {
                        content: {
                          parts: [
                            {
                              text: "结合多模态原生长逻辑推理与复杂系统推导，Gemini 2.5 Pro 构建了深度思维决策模型..."
                            }
                          ],
                          role: "model"
                        },
                        finishReason: "STOP",
                        avgLogprobs: -0.0482
                      }
                    ],
                    usageMetadata: {
                      promptTokenCount: 68,
                      candidatesTokenCount: 356,
                      totalTokenCount: 424,
                      thoughtsTokenCount: 142
                    },
                    modelVersion: currentModel.name || "gemini-2.5-pro"
                  } : isClaude ? {
                    id: "msg_01X9D7G2P4Q8L5K1M3N6J0H8",
                    type: "message",
                    role: "assistant",
                    model: currentModel.name || "claude-4.5-sonnet",
                    content: [
                      {
                        type: "text",
                        text: "根据多模态逻辑推演与精细化编程分析，Claude 4.5 Sonnet 能够构建严密可靠的系统重构与决策模型..."
                      }
                    ],
                    stop_reason: "end_turn",
                    stop_sequence: null,
                    usage: {
                      input_tokens: 68,
                      output_tokens: 356
                    }
                  } : isChatModel ? {
                    id: isQwen ? "chatcmpl-42861a49-9c71-420a-8d18-91c6e1e80df7" : "chatcmpl-9A2X0B1C2D3E4F5G6H7I8J9K0L",
                    object: "chat.completion",
                    created: 1720216680,
                    model: currentModel.name || "gpt-5.4",
                    choices: [
                      {
                        index: 0,
                        message: {
                          role: "assistant",
                          content: isQwen
                            ? "根据量子场论与逻辑深度思考推演，通义千问能够全面解析并构建长逻辑推理链条..."
                            : "根据猜疑链与黑暗森林法则的博弈论推演，任何拥有生存本能的文明在无法自证善意的前提下都会产生猜疑链..."
                        },
                        finish_reason: "stop"
                      }
                    ],
                    usage: {
                      prompt_tokens: 64,
                      completion_tokens: 312,
                      total_tokens: 376,
                      ...(cleanInputs.reasoning_effort && cleanInputs.reasoning_effort !== 'none' ? {
                        completion_tokens_details: {
                          reasoning_tokens: 128
                        }
                      } : {})
                    }
                  } : {
                    id: "rn_902a83bc71d4",
                    version: currentModel.id,
                    status: "succeeded",
                    input: cleanInputs,
                    output: currentModel.sampleVideoUrl || currentModel.sampleImageUrl || "https://replicate.delivery/pbxt/sample_output.mp4",
                    metrics: {
                      predict_time: 4.825
                    },
                    created_at: "2026-07-05T20:58:00.000Z"
                  }, null, 2)}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
