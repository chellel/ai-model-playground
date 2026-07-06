export type WidgetType = 
  | 'textarea' 
  | 'text' 
  | 'input'
  | 'file' 
  | 'multi-file' 
  | 'imageselect'
  | 'fileselect'
  | 'slider' 
  | 'select' 
  | 'radiogroup'
  | 'boolean' 
  | 'switch'
  | 'number';

export interface SchemaProperty {
  type: 'string' | 'integer' | 'number' | 'boolean' | 'file' | 'array';
  title?: string;
  title_en?: string;
  titleEn?: string;
  description?: string;
  description_en?: string;
  descriptionEn?: string;
  widget?: WidgetType;
  default?: any;
  target_path?: string;
  targetPath?: string;
  help?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  showToggle?: boolean;
  defaultEnabled?: boolean;
  inputMode?: 'numeric' | 'decimal' | 'text';
  mediaType?: 'image' | 'video' | 'audio';
  maxCount?: number;
  maxSizeMb?: number;
  acceptExtensions?: string[] | string;
  base64?: boolean;
  maxDurationSeconds?: number;
  maxTotalDurationSeconds?: number;
  options?: any[];
  enum?: (string | number)[];
  enumNames?: string[];
  placeholder?: string;
  format?: string;
  items?: { type?: string; format?: string };
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  'x-order'?: number;
  extra?: Record<string, any>;
  [key: string]: any;
}

export interface ModelSchema {
  id: string;
  name: string;
  publisher: string;
  description: string;
  category: 'Video Generation' | 'Image Generation' | 'Language Model' | 'Audio / Speech';
  status: 'Warm' | 'Cold' | 'Hot';
  runsCount: string;
  avgTime: string;
  pricePerRun: string;
  api_client?: string;
  api_mode?: string;
  coverImage?: string;
  sampleVideoUrl?: string;
  sampleImageUrl?: string;
  properties: Record<string, SchemaProperty>;
}

export interface RunLogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'step' | 'success' | 'warn';
}

export interface RunResult {
  id: string;
  modelId: string;
  inputs: Record<string, any>;
  status: 'queued' | 'running' | 'succeeded' | 'failed';
  outputUrl: string;
  outputType: 'video' | 'image' | 'text' | 'audio';
  durationSeconds: number;
  logs: RunLogEntry[];
  createdAt: string;
  seed: number;
}
