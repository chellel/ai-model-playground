import React, { useState } from 'react';
import { Copy, Check, Terminal, FileCode, Code } from 'lucide-react';

interface CodeViewerProps {
  modelId: string;
  formData: Record<string, any>;
  activeTab: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  modelId,
  formData,
  activeTab,
}) => {
  const [copied, setCopied] = useState(false);

  const cleanInputs = { ...formData };
  // Remove empty fields
  Object.keys(cleanInputs).forEach((k) => {
    if (cleanInputs[k] === '' || cleanInputs[k] === undefined) {
      delete cleanInputs[k];
    }
  });

  const isGpt54 = modelId.toLowerCase().includes('gpt-5.4');
  const isGpt4o = modelId.toLowerCase().includes('gpt-4o');
  const isQwen = modelId.toLowerCase().includes('qwen');
  const isGeminiLLM = modelId.toLowerCase().includes('gemini') && (modelId.toLowerCase().includes('pro') || modelId.toLowerCase().includes('flash')) && !modelId.toLowerCase().includes('image');
  const isChatModel = isGpt54 || isGpt4o || isQwen || isGeminiLLM || modelId.toLowerCase().includes('openai');

  let endpointUrl = 'https://api.replicate.com/v1/predictions';
  if (isGpt54) {
    endpointUrl = '/v1/chat/completions';
  } else if (isGpt4o) {
    endpointUrl = 'https://api.openai.com/v1/chat/completions';
  } else if (isQwen) {
    endpointUrl = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
  } else if (isGeminiLLM) {
    endpointUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelId.split('/').pop() || 'gemini-3.1-pro-preview'}:generateContent`;
  } else if (isChatModel) {
    endpointUrl = '/v1/chat/completions';
  }

  const getChatPayload = () => {
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
      messages.push({ role: 'user', content: isQwen ? '推演量子计算与现代密码学的关系...' : 'Explain the mathematical logic of game theory...' });
    }

    const payload: Record<string, any> = {
      model: modelId.split('/').pop() || 'gpt-5.4',
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

  const generateCode = () => {
    if (isChatModel) {
      if (isGeminiLLM) {
        const geminiModelName = modelId.split('/').pop() || 'gemini-3.1-pro-preview';
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

        switch (activeTab) {
          case 'JSON':
            return JSON.stringify(geminiPayload, null, 2);

          case 'Python':
            return `import os
from google import genai
from google.genai import types

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

response = client.models.generate_content(
    model="${geminiModelName}",
    contents="${promptText.replace(/"/g, '\\"')}",
    config=types.GenerateContentConfig(
        ${cleanInputs.system_prompt ? `system_instruction="${cleanInputs.system_prompt.replace(/"/g, '\\"')}",\n        ` : ''}temperature=${cleanInputs.temperature !== undefined ? cleanInputs.temperature : 1.0},
        top_p=${cleanInputs.top_p !== undefined ? cleanInputs.top_p : 0.95}${cleanInputs.max_output_tokens ? `,\n        max_output_tokens=${cleanInputs.max_output_tokens}` : ''}
    )
)

print(response.text)`;

          case 'Node.js':
            return `import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function runGemini() {
  const response = await ai.models.generateContent({
    model: '${geminiModelName}',
    contents: ${JSON.stringify(geminiPayload.contents, null, 4)},
    config: ${JSON.stringify(geminiPayload.generationConfig, null, 4)}
  });
  console.log(response.text);
}

runGemini();`;

          case 'cURL':
            return `curl -s -X POST \\
  -H "Content-Type: application/json" \\
  "https://generativelanguage.googleapis.com/v1beta/models/${geminiModelName}:generateContent?key=$GEMINI_API_KEY" \\
  -d '${JSON.stringify(geminiPayload, null, 2).replace(/\n/g, '\n  ')}'`;
        }
      }

      const payload = getChatPayload();
      const authHeader = isQwen ? '$DASHSCOPE_API_KEY' : '$OPENAI_API_KEY';

      switch (activeTab) {
        case 'JSON':
          return JSON.stringify(payload, null, 2);

        case 'Python':
          if (isQwen) {
            return `import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("DASHSCOPE_API_KEY"),
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
)

response = client.chat.completions.create(
    model="${payload.model}",
    messages=${JSON.stringify(payload.messages, null, 4)}${payload.temperature !== undefined ? `,\n    temperature=${payload.temperature}` : ''}${payload.top_p !== undefined ? `,\n    top_p=${payload.top_p}` : ''}${payload.max_tokens !== undefined ? `,\n    max_tokens=${payload.max_tokens}` : ''}
)

print(response.choices[0].message.content)`;
          }
          return `from openai import OpenAI

client = OpenAI(api_key="your_api_key")

response = client.chat.completions.create(
    model="${payload.model}",
    messages=${JSON.stringify(payload.messages, null, 4)}${payload.reasoning_effort ? `,\n    reasoning_effort="${payload.reasoning_effort}"` : ''}${payload.verbosity ? `,\n    verbosity="${payload.verbosity}"` : ''}${payload.max_completion_tokens ? `,\n    max_completion_tokens=${payload.max_completion_tokens}` : ''}${payload.temperature !== undefined ? `,\n    temperature=${payload.temperature}` : ''}${payload.top_p !== undefined ? `,\n    top_p=${payload.top_p}` : ''}${payload.max_tokens !== undefined ? `,\n    max_tokens=${payload.max_tokens}` : ''}
)

print(response.choices[0].message.content)`;

        case 'Node.js':
          if (isQwen) {
            return `import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

async function runModel() {
  const completion = await openai.chat.completions.create(${JSON.stringify(payload, null, 4)});
  console.log(completion.choices[0].message.content);
}

runModel();`;
          }
          return `import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function runModel() {
  const completion = await openai.chat.completions.create(${JSON.stringify(payload, null, 4)});
  console.log(completion.choices[0].message.content);
}

runModel();`;

        case 'cURL':
          return `curl -s -X POST \\
  -H "Authorization: Bearer ${authHeader}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(payload, null, 2).replace(/\n/g, '\n  ')}' \\
  ${endpointUrl}`;

        default:
          return '// Select a language tab to inspect API request snippets';
      }
    }

    switch (activeTab) {
      case 'JSON':
        return JSON.stringify(cleanInputs, null, 2);

      case 'Python':
        return `import replicate

# Run ${modelId}
output = replicate.run(
    "${modelId}",
    input=${JSON.stringify(cleanInputs, null, 4)}
)

print(output)`;

      case 'Node.js':
        return `import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function runModel() {
  const output = await replicate.run(
    "${modelId}",
    {
      input: ${JSON.stringify(cleanInputs, null, 6)}
    }
  );
  console.log(output);
}

runModel();`;

      case 'cURL':
        return `curl -s -X POST \\
  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "version": "${modelId}",
    "input": ${JSON.stringify(cleanInputs)}
  }' \\
  https://api.replicate.com/v1/predictions`;

      default:
        return '// Select a language tab to inspect API request snippets';
    }
  };

  const codeString = generateCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-md">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-950 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-semibold text-gray-300">
            {activeTab} Request Payload
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs transition border border-gray-700"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy snippet</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 overflow-x-auto max-h-[520px]">
        <pre className="text-xs font-mono text-gray-200 leading-relaxed selection:bg-gray-700">
          <code>{codeString}</code>
        </pre>
      </div>
    </div>
  );
};
