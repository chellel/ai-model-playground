import React, { useState } from 'react';
import { ModelSchema } from '../types';
import { X, Check, AlertCircle, Code2, RefreshCw } from 'lucide-react';

interface SchemaEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: ModelSchema;
  onApplySchema: (updatedModel: ModelSchema) => void;
}

export const SchemaEditorModal: React.FC<SchemaEditorModalProps> = ({
  isOpen,
  onClose,
  currentModel,
  onApplySchema,
}) => {
  const [jsonText, setJsonText] = useState(() => JSON.stringify(currentModel, null, 2));
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.id || !parsed.properties) {
        throw new Error("Schema must contain root 'id' and 'properties' objects.");
      }
      onApplySchema(parsed);
      setError(null);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid JSON syntax');
    }
  };

  const handleReset = () => {
    setJsonText(JSON.stringify(currentModel, null, 2));
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Model JSON Schema Editor</h3>
              <p className="text-xs text-gray-500">Edit or paste Replicate/OpenAPI schema to generate dynamic UI forms</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="relative">
            <textarea
              value={jsonText}
              onChange={(e) => {
                setJsonText(e.target.value);
                setError(null);
              }}
              rows={18}
              className="w-full p-4 font-mono text-xs bg-gray-900 text-gray-100 rounded-xl border border-gray-800 focus:outline-none focus:ring-2 focus:ring-black leading-relaxed selection:bg-gray-700"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-xs font-semibold text-gray-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Schema</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-xs font-semibold text-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800 text-xs font-semibold transition shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply & Rebuild Form</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
