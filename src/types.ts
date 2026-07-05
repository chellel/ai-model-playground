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
  description?: string;
  widget?: WidgetType;
  default?: any;
  help?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  enum?: (string | number)[];
  enumNames?: string[];
  placeholder?: string;
  format?: string;
  items?: { type?: string; format?: string };
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  'x-order'?: number;
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
