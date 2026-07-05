import React from 'react';
import { SchemaProperty } from '../types';
import { UploadCloud, Sliders, CheckSquare, Square, RefreshCw, HelpCircle, Sparkles, Upload, ImagePlus, X, File, RotateCcw } from 'lucide-react';

interface FileUploadWidgetProps {
  field: SchemaProperty;
  fieldKey: string;
  value: any;
  onChange: (value: any) => void;
  isMulti: boolean;
}

const FileUploadWidget: React.FC<FileUploadWidgetProps> = ({
  field,
  fieldKey,
  value,
  onChange,
  isMulti,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const isVideo = fieldKey.toLowerCase().includes('video') || field.help?.toLowerCase().includes('video');
  const isAudio = fieldKey.toLowerCase().includes('audio') || field.help?.toLowerCase().includes('audio');
  const labelText = isVideo ? 'video' : isAudio ? 'audio' : 'image';

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const fileArray = Array.from(fileList);
    if (isMulti) {
      const existing = Array.isArray(value) ? value : (value ? [value] : []);
      const newUrls = fileArray.map(f => URL.createObjectURL(f));
      onChange([...existing, ...newUrls].slice(0, 9));
    } else {
      onChange(URL.createObjectURL(fileArray[0]));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const selectedArray = Array.isArray(value) ? value : (value ? [value] : []);

  const handleRemove = (index: number) => {
    if (isMulti) {
      const updated = selectedArray.filter((_, idx) => idx !== index);
      onChange(updated);
    } else {
      onChange('');
    }
  };

  return (
    <div className="space-y-3">
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition select-none ${
          isDragging
            ? 'border-black bg-gray-50'
            : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}
      >
        <input
          type="file"
          className="hidden"
          multiple={isMulti}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Upload className="w-5 h-5 text-gray-600 mb-2.5 stroke-[1.5]" />
        <h4 className="text-base font-semibold text-gray-900 mb-1.5">
          Drop {labelText} here
        </h4>
        <p className="text-xs text-gray-500 leading-relaxed max-w-xs mb-4">
          Supports drag-and-drop and click-to-select. Each file must be under 30MB{isMulti ? ', up to 9 items' : ''}. Formats: {isVideo ? 'mp4, mov, webm' : isAudio ? 'mp3, wav, aac' : 'jpg, jpeg, png, webp'}
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-800 shadow-2xs transition">
          <ImagePlus className="w-4 h-4 text-gray-700" />
          <span>Select {labelText}</span>
        </div>
      </label>

      {selectedArray.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium px-1">
            <span>Selected ({selectedArray.length}{isMulti ? '/9' : ''})</span>
            <button
              type="button"
              onClick={() => onChange(isMulti ? [] : '')}
              className="text-red-500 hover:underline"
            >
              Clear all
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {selectedArray.map((item, idx) => {
              const strItem = String(item);
              const isImgUrl = strItem.startsWith('blob:') || strItem.startsWith('data:image') || /\.(jpg|jpeg|png|webp|gif)($|\?)/i.test(strItem);
              const isVidUrl = /\.(mp4|mov|webm)($|\?)/i.test(strItem);
              return (
                <div
                  key={idx}
                  className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-video flex items-center justify-center"
                >
                  {isImgUrl ? (
                    <img src={strItem} alt="upload preview" className="w-full h-full object-cover" />
                  ) : isVidUrl ? (
                    <video src={strItem} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-2 text-center">
                      <File className="w-5 h-5 text-gray-400 mb-1" />
                      <span className="text-[10px] font-mono text-gray-600 truncate max-w-[80px]">
                        File {idx + 1}
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(idx);
                    }}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center opacity-80 group-hover:opacity-100 transition shadow-sm"
                    title="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

interface DynamicFormProps {
  modelId: string;
  properties: Record<string, SchemaProperty>;
  formData: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onRun: () => void;
  onReset?: () => void;
  isGenerating: boolean;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  modelId,
  properties,
  formData,
  onChange,
  onRun,
  onReset,
  isGenerating,
}) => {
  const renderWidget = (key: string, field: SchemaProperty) => {
    const value = formData[key] ?? field.default ?? '';

    const options = field.enum || field.options;
    if (options && Array.isArray(options) && options.length > 0 && field.widget !== 'textarea' && field.widget !== 'slider') {
      const enumNames = field.enumNames;
      return (
        <select
          value={value}
          onChange={(e) => onChange(key, e.target.value)}
          className="w-full p-2.5 border border-gray-300 focus:border-black rounded-lg text-sm bg-white focus:outline-none transition cursor-pointer shadow-2xs font-medium text-gray-800"
        >
          {options.map((opt, idx) => {
            const optVal = typeof opt === 'object' && opt !== null && (opt as any).value !== undefined ? String((opt as any).value) : String(opt);
            const optLabel = typeof opt === 'object' && opt !== null && (opt as any).label !== undefined
              ? String((opt as any).label)
              : (Array.isArray(enumNames) && enumNames[idx] ? String(enumNames[idx]) : optVal);
            return (
              <option key={`${optVal}-${idx}`} value={optVal}>
                {optLabel || optVal}
              </option>
            );
          })}
        </select>
      );
    }

    const effectiveWidget = field.widget || (
      (field.options && field.options.length > 0) || (field.enum && field.enum.length > 0) ? 'select' :
      field.type === 'file' || field.format === 'uri' ? 'file' :
      field.type === 'array' && (field.items?.format === 'uri' || field.format === 'uri' || key.includes('image') || key.includes('video') || key.includes('file')) ? 'multi-file' :
      undefined
    );

    switch (effectiveWidget) {
      case 'textarea':
        return (
          <textarea
            className="w-full p-3 border border-gray-300 focus:border-black rounded-lg text-sm bg-white focus:outline-none transition font-sans shadow-2xs leading-relaxed"
            rows={4}
            value={value}
            onChange={(e) => onChange(key, e.target.value)}
            placeholder={field.placeholder || `Enter ${key}...`}
          />
        );

      case 'select': {
        const optionsList = field.options || field.enum || [];
        return (
          <select
            value={value}
            onChange={(e) => onChange(key, e.target.value)}
            className="w-full p-2.5 border border-gray-300 focus:border-black rounded-lg text-sm bg-white focus:outline-none transition cursor-pointer shadow-2xs"
          >
            {optionsList.map((opt) => (
              <option key={String(opt)} value={String(opt)}>
                {String(opt)}
              </option>
            ))}
          </select>
        );
      }

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
              {value ? 'true (开启)' : 'false (关闭)'}
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
          </div>
        );

      case 'file':
      case 'multi-file':
        return (
          <FileUploadWidget
            field={field}
            fieldKey={key}
            value={formData[key]}
            onChange={(val) => onChange(key, val)}
            isMulti={effectiveWidget === 'multi-file'}
          />
        );

      default:
        if (field.type === 'file' || field.format === 'uri' || (field.type === 'array' && (field.items?.format === 'uri' || key.includes('image') || key.includes('video') || key.includes('file')))) {
          return (
            <FileUploadWidget
              field={field}
              fieldKey={key}
              value={formData[key]}
              onChange={(val) => onChange(key, val)}
              isMulti={field.type === 'array' || field.widget === 'multi-file'}
            />
          );
        }
        if (field.type === 'boolean') {
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
                {value ? 'true (开启)' : 'false (关闭)'}
              </span>
            </button>
          );
        }
        if (field.type === 'integer' || field.type === 'number') {
          return (
            <input
              type="number"
              className="w-full p-2.5 border border-gray-300 focus:border-black rounded-lg text-sm font-mono bg-white focus:outline-none transition shadow-2xs"
              value={value}
              onChange={(e) => onChange(key, Number(e.target.value))}
            />
          );
        }
        return (
          <input
            type="text"
            className="w-full p-2.5 border border-gray-300 focus:border-black rounded-lg text-sm bg-white focus:outline-none transition shadow-2xs"
            value={value}
            placeholder={field.placeholder || `Enter ${key}...`}
            onChange={(e) => onChange(key, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {Object.keys(properties).map((key) => {
        const field = properties[key] as SchemaProperty;
        if (field.type === 'boolean' || field.widget === 'boolean') {
          const val = !!formData[key];
          return (
            <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="pr-4 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <label
                    onClick={() => onChange(key, !val)}
                    className="text-sm font-bold text-gray-900 cursor-pointer select-none"
                  >
                    {field.title || key}
                  </label>
                  {field.required && <span className="text-red-500">*</span>}
                </div>
                {field.help && (
                  <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
                    {field.help}
                  </p>
                )}
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={val}
                onClick={() => onChange(key, !val)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  val ? 'bg-gray-900' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    val ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          );
        }
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

      <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
        {onReset && (
          <button
            type="button"
            disabled={isGenerating}
            onClick={onReset}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm transition flex items-center justify-center gap-2 shadow-2xs disabled:opacity-50 shrink-0"
          >
            <RotateCcw className="w-4 h-4 text-gray-500" />
            <span>Reset to default inputs</span>
          </button>
        )}
        <button
          type="button"
          disabled={isGenerating}
          onClick={onRun}
          className={`w-full sm:flex-1 py-3.5 px-6 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 shadow-sm ${
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
              <span>Run</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
