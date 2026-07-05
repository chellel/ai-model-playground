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

  const generateCode = () => {
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
