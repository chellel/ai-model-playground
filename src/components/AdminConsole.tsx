import React, { useState } from 'react';
import { ModelSchema } from '../types';
import {
  Sparkles, Bell, Monitor, Search, Plus, RefreshCw, Layers, Edit, Trash2, Check, X, Save, ExternalLink,
  Sliders, Eye, Code, FileText, ChevronRight, ChevronDown, Shield, Key, BarChart2, Copy,
  Image as ImageIcon, Activity, CreditCard, Gift, Users, Settings, Server, Share2,
  Calendar, LayoutDashboard, MessageSquare, Play, ChevronLeft, AlertTriangle, ToggleLeft, ToggleRight
} from 'lucide-react';

interface AdminConsoleProps {
  models: ModelSchema[];
  onUpdateModel: (updated: ModelSchema) => void;
  onExitConsole: () => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  models,
  onUpdateModel,
  onExitConsole,
}) => {
  // Active menu state (fake menus as requested, default to 模型管理)
  const [activeMenu, setActiveMenu] = useState<string>('模型管理');
  const [supplierFilter, setSupplierFilter] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [supplierQuery, setSupplierQuery] = useState<string>('');
  
  // State for Schema Editor Modal
  const [editingModel, setEditingModel] = useState<ModelSchema | null>(null);
  const [schemaTab, setSchemaTab] = useState<'visual' | 'raw' | 'preview'>('visual');
  const [rawJsonText, setRawJsonText] = useState<string>('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Field editing state inside Visual Schema Editor
  const [editingFieldKey, setEditingFieldKey] = useState<string | null>(null);
  const [fieldForm, setFieldForm] = useState<{
    key: string;
    title: string;
    titleEn?: string;
    type: string;
    widget?: string;
    description: string;
    descriptionEn?: string;
    placeholder?: string;
    default: any;
    format?: string;
    enumList: { value: string; label: string; meta?: string }[];
    maxLength?: number;
    minimum?: number;
    maximum?: number;
    step?: number;
    showToggle?: boolean;
    defaultEnabled?: boolean;
    inputMode?: 'numeric' | 'decimal' | 'text';
    mediaType?: 'image' | 'video' | 'audio';
    maxCount?: number;
    maxSizeMb?: number;
    acceptExtensions?: string;
    base64?: boolean;
    maxDurationSeconds?: number;
    maxTotalDurationSeconds?: number;
    target_path?: string;
    xOrder: number;
    required: boolean;
    visible?: boolean;
    status?: 'enabled' | 'disabled';
  }>({
    key: '',
    title: '',
    titleEn: '',
    type: 'string',
    widget: 'input',
    description: '',
    descriptionEn: '',
    placeholder: '',
    default: '',
    target_path: '',
    format: '',
    enumList: [{ value: '', label: '', meta: '' }],
    showToggle: true,
    defaultEnabled: true,
    inputMode: 'numeric',
    mediaType: 'image',
    maxCount: 1,
    maxSizeMb: 5,
    acceptExtensions: '',
    base64: false,
    xOrder: 10,
    required: false,
    visible: true,
    status: 'enabled'
  });
  const [showAddFieldModal, setShowAddFieldModal] = useState<boolean>(false);
  const [showCopyModal, setShowCopyModal] = useState<boolean>(false);
  const [sourceModelId, setSourceModelId] = useState<string>('');
  const [draggedPropertyKey, setDraggedPropertyKey] = useState<string | null>(null);

  // Additional mock rows to match New API admin console screenshot exactly
  const mockTableData = [
    {
      id: 'openai/gpt-5.4',
      name: 'gpt-5.4',
      typeMatch: '精确',
      syncOfficial: '是',
      desc: 'OpenAI 官方全新一代旗舰多模态大语言模型',
      supplier: 'OpenAI',
      tag: 'llm',
      endpoint: 'openai',
      channel: 'OpenAI | 旗舰多模态(1)',
      status: 'enabled'
    },
    {
      id: 'openai/gpt-4o',
      name: 'gpt-4o',
      typeMatch: '精确',
      syncOfficial: '是',
      desc: 'OpenAI 官方全能多模态旗舰模型',
      supplier: 'OpenAI',
      tag: 'llm',
      endpoint: 'openai',
      channel: 'OpenAI | 旗舰多模态(1)',
      status: 'enabled'
    },
    {
      id: 'qwen/qwen3.7-max',
      name: 'qwen3.7-max',
      typeMatch: '精确',
      syncOfficial: '是',
      desc: '阿里云通义千问最新旗舰模型 Qwen3.7-Max',
      supplier: 'Alibaba Cloud',
      tag: 'llm',
      endpoint: 'openai / dashscope',
      channel: '阿里云 | 通义千问(1)',
      status: 'enabled'
    },
    {
      id: 'anthropic/claude-4.5-sonnet',
      name: 'claude-4.5-sonnet',
      typeMatch: '精确',
      syncOfficial: '是',
      desc: 'Anthropic 4.5 代智能旗舰多模态推理与编码模型',
      supplier: 'Anthropic',
      tag: 'llm',
      endpoint: 'anthropic / messages',
      channel: '官方 API / bedrock / vertex(18)',
      status: 'enabled'
    },
    {
      id: 'gemini-3.1-flash-lite-image',
      name: 'gemini-3.1-flash-lite-image',
      typeMatch: '精确',
      syncOfficial: '是',
      desc: '-',
      supplier: 'Google',
      tag: '-',
      endpoint: 'gemini / openai',
      channel: '主站 vertex/sp/gemini(24)',
      status: 'enabled'
    },
    {
      id: 'doubao-seedance-2-0-fast-260128',
      name: 'doubao-seedance-2-0-fast-260128',
      typeMatch: '精确',
      syncOfficial: '是',
      desc: '多模态音视频快速生成极速版',
      supplier: '火山引擎',
      tag: 'video',
      endpoint: 'openai',
      channel: '火山 | 视频(1)',
      status: 'enabled'
    },
    {
      id: 'happyhorse-1.1-r2v',
      name: 'happyhorse-1.1-r2v',
      typeMatch: '精确',
      syncOfficial: '是',
      desc: '-',
      supplier: '阿里巴巴',
      tag: 'video',
      endpoint: 'openai',
      channel: '主站 aliyun(1)',
      status: 'enabled'
    },
    {
      id: 'happyhorse-1.1-i2v',
      name: 'happyhorse-1.1-i2v',
      typeMatch: '精确',
      syncOfficial: '是',
      desc: '-',
      supplier: '阿里巴巴',
      tag: 'video',
      endpoint: 'openai',
      channel: '主站 aliyun(1)',
      status: 'enabled'
    },
    {
      id: 'happyhorse-1.1-t2v',
      name: 'happyhorse-1.1-t2v',
      typeMatch: '精确',
      syncOfficial: '是',
      desc: '-',
      supplier: '阿里巴巴',
      tag: 'video',
      endpoint: 'openai',
      channel: '主站 aliyun(1)',
      status: 'enabled'
    },
    {
      id: 'gemini-3-pro-image-preview',
      name: 'gemini-3-pro-image-preview',
      typeMatch: '精确',
      syncOfficial: '是',
      desc: '-',
      supplier: 'Google',
      tag: 'image',
      endpoint: 'gemini / openai',
      channel: '主站 vertex/sp/gemini(24)',
      status: 'enabled'
    }
  ];

  const handleOpenSchemaEditor = (model: ModelSchema) => {
    setEditingModel({ ...model });
    // Convert current properties to raw JSON Schema format
    const requiredKeys = Object.keys(model.properties).filter(
      k => model.properties[k].required
    );
    const schemaObj = {
      type: 'object',
      title: 'Input',
      required: requiredKeys.length > 0 ? requiredKeys : ['prompt'],
      properties: model.properties
    };
    setRawJsonText(JSON.stringify(schemaObj, null, 2));
    setSchemaTab('visual');
    setJsonError(null);
  };

  const handleOpenMockSchemaEditor = (mockId: string, mockName: string, publisher: string) => {
    // Find if it exists in models, otherwise create temporary model schema based on seedance 2.0 openapi
    const existing = models.find(m => m.id === mockId || m.name === mockName);
    if (existing) {
      handleOpenSchemaEditor(existing);
      return;
    }
    const seedanceModel = models.find(m => m.id.includes('seedance')) || models[0];
    const temporaryModel: ModelSchema = {
      ...seedanceModel,
      id: mockId,
      name: mockName,
      publisher: publisher
    };
    handleOpenSchemaEditor(temporaryModel);
  };

  const handleSaveSchema = () => {
    if (!editingModel) return;
    if (schemaTab === 'raw') {
      try {
        const parsed = JSON.parse(rawJsonText);
        if (!parsed.properties) {
          setJsonError('JSON 结构必须包含 properties 字段');
          return;
        }
        const reqList: string[] = Array.isArray(parsed.required) ? parsed.required : [];
        const updatedProps: Record<string, any> = {};
        Object.keys(parsed.properties).forEach(k => {
          updatedProps[k] = {
            ...parsed.properties[k],
            required: reqList.includes(k)
          };
        });
        const updatedModel = {
          ...editingModel,
          properties: updatedProps
        };
        onUpdateModel(updatedModel);
        setEditingModel(null);
      } catch (err: any) {
        setJsonError('JSON 解析语法错误：' + err.message);
      }
    } else {
      onUpdateModel(editingModel);
      setEditingModel(null);
    }
  };

  // Field editing actions inside Visual Schema Editor
  const openAddField = (fieldKey?: string) => {
    if (!editingModel) return;
    if (fieldKey && editingModel.properties[fieldKey]) {
      const prop: any = editingModel.properties[fieldKey];
      const extra = prop.extra || {};
      let initialEnumList: { value: string; label: string; meta?: string }[] = [];
      if (Array.isArray(prop.options)) {
        initialEnumList = prop.options.map((val: any) => {
          if (typeof val === 'object' && val !== null) {
            return {
              value: String(val.value ?? ''),
              label: String(val.label ?? val.value ?? ''),
              meta: val.meta ? String(val.meta) : undefined
            };
          }
          return { value: String(val), label: '', meta: '' };
        });
      } else if (Array.isArray(prop.enum)) {
        initialEnumList = prop.enum.map((val: any, idx: number) => {
          const valStr = typeof val === 'object' && val !== null ? String(val.value ?? '') : String(val);
          const rawLabel = typeof val === 'object' && val !== null && val.label !== undefined
            ? String(val.label)
            : (Array.isArray(prop.enumNames) && prop.enumNames[idx] !== undefined ? String(prop.enumNames[idx]) : '');
          const labelStr = rawLabel === valStr ? '' : rawLabel;
          const metaStr = typeof val === 'object' && val !== null && val.meta ? String(val.meta) : undefined;
          return { value: valStr, label: labelStr, meta: metaStr };
        });
      }
      if (initialEnumList.length === 0) {
        initialEnumList = [{ value: '', label: '', meta: '' }];
      }
      const derivedWidget = prop.widget || (
        prop.type === 'boolean' ? 'switch' :
        (prop.enum || prop.options) ? 'select' :
        (prop.type === 'file' || prop.format === 'uri' || (prop.type === 'array' && (prop.items?.format === 'uri' || fieldKey.includes('image') || fieldKey.includes('video')))) ? 'fileselect' :
        prop.format === 'textarea' ? 'textarea' :
        (prop.type === 'integer' || prop.type === 'number') ? 'number' :
        'input'
      );
      const normalizedWidget = 
        derivedWidget === 'boolean' ? 'switch' :
        derivedWidget === 'text' ? 'input' :
        derivedWidget === 'file' || derivedWidget === 'multi-file' || derivedWidget === 'imageselect' ? 'fileselect' :
        derivedWidget;

      setEditingFieldKey(fieldKey);
      setFieldForm({
        key: fieldKey,
        title: prop.title || fieldKey,
        titleEn: prop.title_en || prop.titleEn || '',
        type: prop.type || 'string',
        widget: normalizedWidget,
        description: prop.description || '',
        descriptionEn: prop.description_en || prop.descriptionEn || '',
        placeholder: prop.placeholder || extra.placeholder || '',
        default: prop.default ?? extra.defaultValue ?? '',
        target_path: prop.target_path || prop.targetPath || extra.target_path || '',
        format: prop.format || prop.items?.format || (prop.widget === 'file' || prop.widget === 'multi-file' ? 'uri' : ''),
        enumList: initialEnumList,
        maxLength: prop.maxLength,
        minimum: prop.minimum ?? prop.min ?? extra.min,
        maximum: prop.maximum ?? prop.max ?? extra.max,
        step: prop.step ?? extra.step ?? 1,
        showToggle: prop.showToggle ?? extra.showToggle ?? true,
        defaultEnabled: prop.defaultEnabled ?? extra.defaultEnabled ?? true,
        inputMode: prop.inputMode ?? extra.inputMode ?? 'numeric',
        mediaType: prop.mediaType ?? extra.mediaType ?? 'image',
        maxCount: prop.maxCount ?? extra.maxCount ?? 1,
        maxSizeMb: prop.maxSizeMb ?? extra.maxSizeMb ?? 5,
        acceptExtensions: Array.isArray(prop.acceptExtensions) ? prop.acceptExtensions.join(', ') : (prop.acceptExtensions ?? extra.acceptExtensions ?? ''),
        base64: prop.base64 ?? extra.base64 ?? false,
        maxDurationSeconds: prop.maxDurationSeconds ?? extra.maxDurationSeconds,
        maxTotalDurationSeconds: prop.maxTotalDurationSeconds ?? extra.maxTotalDurationSeconds,
        xOrder: prop['x-order'] ?? 10,
        required: !!prop.required,
        visible: prop.visible !== false && prop.status !== 'disabled',
        status: prop.status || (prop.visible !== false ? 'enabled' : 'disabled')
      });
    } else {
      setEditingFieldKey(null);
      setFieldForm({
        key: '',
        title: '',
        titleEn: '',
        type: 'string',
        widget: 'input',
        description: '',
        descriptionEn: '',
        placeholder: '',
        default: '',
        target_path: '',
        format: '',
        enumList: [{ value: '', label: '', meta: '' }],
        showToggle: true,
        defaultEnabled: true,
        inputMode: 'numeric',
        mediaType: 'image',
        maxCount: 1,
        maxSizeMb: 5,
        acceptExtensions: '',
        base64: false,
        xOrder: Object.keys(editingModel.properties).length + 1,
        required: false,
        visible: true,
        status: 'enabled'
      });
    }
    setShowAddFieldModal(true);
  };

  const handleSaveField = () => {
    if (!editingModel || !fieldForm.key.trim()) return;
    const key = fieldForm.key.trim();
    const widgetType = fieldForm.widget || 'input';
    const newProp: any = {
      type: widgetType === 'switch' ? 'boolean' :
            widgetType === 'slider' ? 'number' :
            (widgetType === 'select' || widgetType === 'radiogroup' || widgetType === 'textarea') ? 'string' :
            (widgetType === 'imageselect' || widgetType === 'fileselect') ? 'string' :
            (fieldForm.type || 'string'),
      title: fieldForm.title || key,
      description: fieldForm.description,
      widget: widgetType,
      'x-order': Number(fieldForm.xOrder) || 0,
      required: fieldForm.required,
      visible: fieldForm.visible !== false && fieldForm.status !== 'disabled',
      status: fieldForm.status || (fieldForm.visible !== false ? 'enabled' : 'disabled')
    };
    if (fieldForm.titleEn?.trim()) {
      newProp.title_en = fieldForm.titleEn.trim();
      newProp.titleEn = fieldForm.titleEn.trim();
    }
    if (fieldForm.descriptionEn?.trim()) {
      newProp.description_en = fieldForm.descriptionEn.trim();
      newProp.descriptionEn = fieldForm.descriptionEn.trim();
    }
    if (fieldForm.placeholder && widgetType !== 'switch') {
      newProp.placeholder = fieldForm.placeholder;
    }
    if (fieldForm.default !== '' && fieldForm.default !== undefined && fieldForm.default !== null) {
      if (newProp.type === 'integer' || newProp.type === 'number') {
        newProp.default = !isNaN(Number(fieldForm.default)) ? Number(fieldForm.default) : fieldForm.default;
      } else if (newProp.type === 'boolean') {
        newProp.default = fieldForm.default === 'true' || fieldForm.default === true;
      } else {
        newProp.default = fieldForm.default;
      }
    }
    if (widgetType === 'textarea') {
      newProp.format = 'textarea';
    } else if (widgetType === 'imageselect' || widgetType === 'fileselect') {
      newProp.format = 'uri';
    } else if (fieldForm.format) {
      newProp.format = fieldForm.format;
    }
    if (fieldForm.maxLength) newProp.maxLength = Number(fieldForm.maxLength);
    if (fieldForm.minimum !== undefined && !isNaN(fieldForm.minimum)) {
      newProp.minimum = Number(fieldForm.minimum);
      if (widgetType === 'slider') newProp.min = Number(fieldForm.minimum);
    }
    if (fieldForm.maximum !== undefined && !isNaN(fieldForm.maximum)) {
      newProp.maximum = Number(fieldForm.maximum);
      if (widgetType === 'slider') newProp.max = Number(fieldForm.maximum);
    }
    if (widgetType === 'slider' && fieldForm.step !== undefined && !isNaN(fieldForm.step)) {
      newProp.step = Number(fieldForm.step);
    }
    if (fieldForm.target_path?.trim()) {
      newProp.target_path = fieldForm.target_path.trim();
    }

    const extraObj: Record<string, any> = {};
    if (fieldForm.target_path?.trim()) {
      extraObj.target_path = fieldForm.target_path.trim();
    }

    if (widgetType === 'slider') {
      newProp.min = Number(fieldForm.minimum ?? 0);
      newProp.max = Number(fieldForm.maximum ?? 100);
      newProp.step = Number(fieldForm.step ?? 1);
      newProp.showToggle = fieldForm.showToggle;
      newProp.defaultEnabled = fieldForm.defaultEnabled;
      extraObj.min = newProp.min;
      extraObj.max = newProp.max;
      extraObj.step = newProp.step;
      extraObj.showToggle = newProp.showToggle;
      extraObj.defaultEnabled = newProp.defaultEnabled;
    } else if (widgetType === 'number') {
      newProp.defaultEnabled = fieldForm.defaultEnabled;
      extraObj.defaultEnabled = newProp.defaultEnabled;
    } else if (widgetType === 'input') {
      newProp.inputMode = fieldForm.inputMode || 'text';
      newProp.defaultEnabled = fieldForm.defaultEnabled;
      extraObj.inputMode = newProp.inputMode;
      extraObj.defaultEnabled = newProp.defaultEnabled;
    } else if (widgetType === 'imageselect' || widgetType === 'fileselect') {
      newProp.mediaType = fieldForm.mediaType || 'image';
      newProp.maxCount = Number(fieldForm.maxCount || 1);
      newProp.maxSizeMb = Number(fieldForm.maxSizeMb || 5);
      newProp.base64 = !!fieldForm.base64;
      if (fieldForm.acceptExtensions) {
        newProp.acceptExtensions = fieldForm.acceptExtensions.split(',').map(s => s.trim()).filter(Boolean);
      }
      if (fieldForm.maxDurationSeconds) newProp.maxDurationSeconds = Number(fieldForm.maxDurationSeconds);
      if (fieldForm.maxTotalDurationSeconds) newProp.maxTotalDurationSeconds = Number(fieldForm.maxTotalDurationSeconds);
      
      extraObj.mediaType = newProp.mediaType;
      extraObj.maxCount = newProp.maxCount;
      extraObj.maxSizeMb = newProp.maxSizeMb;
      extraObj.base64 = newProp.base64;
      if (newProp.acceptExtensions) extraObj.acceptExtensions = newProp.acceptExtensions;
      if (newProp.maxDurationSeconds) extraObj.maxDurationSeconds = newProp.maxDurationSeconds;
      if (newProp.maxTotalDurationSeconds) extraObj.maxTotalDurationSeconds = newProp.maxTotalDurationSeconds;
      
      if (newProp.maxCount > 1) {
        newProp.type = 'array';
        newProp.items = { type: 'string', format: 'uri' };
      }
    }

    const validEnumItems = (fieldForm.enumList || []).filter(item => item.value.trim() !== '');
    if ((widgetType === 'select' || widgetType === 'radiogroup') && validEnumItems.length > 0) {
      newProp.options = validEnumItems.map(item => ({
        value: item.value.trim(),
        label: item.label.trim() ? item.label.trim() : item.value.trim(),
        meta: item.meta?.trim() ? item.meta.trim() : undefined
      }));
      newProp.enum = validEnumItems.map(item => item.value.trim());
      newProp.enumNames = validEnumItems.map(item => item.label.trim() ? item.label.trim() : item.value.trim());
    }
    if (Object.keys(extraObj).length > 0) {
      newProp.extra = extraObj;
    }

    const updatedProps = { ...editingModel.properties };
    if (editingFieldKey && editingFieldKey !== key) {
      delete updatedProps[editingFieldKey];
    }
    updatedProps[key] = newProp;

    const updatedModel = {
      ...editingModel,
      properties: updatedProps
    };
    setEditingModel(updatedModel);
    setShowAddFieldModal(false);
  };

  const handleDeleteField = (key: string) => {
    if (!editingModel) return;
    const updatedProps = { ...editingModel.properties };
    delete updatedProps[key];
    setEditingModel({
      ...editingModel,
      properties: updatedProps
    });
  };

  const handleLoadOfficialSeedanceSchema = () => {
    if (!editingModel) return;
    const officialSeedanceProps: Record<string, any> = {
      prompt: {
        type: 'string',
        title: 'Prompt',
        'x-order': 0,
        maxLength: 4000,
        required: true,
        placeholder: 'Describe the video you want, e.g. an orange cat running through a rainy street, cinematic, shallow depth of field. Wrap dialogue in double quotes to improve audio.',
        description: 'Text prompt for video generation. Maximum 4000 characters. BytePlus recommends keeping prompts under 600 English words for best results.',
        default: ''
      },
      image: {
        type: 'string',
        title: 'Image (First Frame)',
        format: 'uri',
        'x-order': 1,
        nullable: true,
        description: 'Input image for image-to-video generation (first frame). Cannot be combined with reference images.'
      },
      last_frame_image: {
        type: 'string',
        title: 'Last Frame Image',
        format: 'uri',
        'x-order': 2,
        nullable: true,
        description: 'Input image for last frame generation. Only works if a first frame image is also provided.'
      },
      reference_images: {
        type: 'array',
        items: { type: 'string', format: 'uri' },
        title: 'Reference Images',
        default: [],
        'x-order': 3,
        description: 'Reference images (up to 9) for character consistency, style guidance, and scene composition. Reference as [Image1], [Image2].'
      },
      reference_videos: {
        type: 'array',
        items: { type: 'string', format: 'uri' },
        title: 'Reference Videos',
        default: [],
        'x-order': 4,
        description: 'Reference videos (up to 3, total duration max 15s) for motion transfer and style reference. Reference as [Video1], [Video2].'
      },
      reference_audios: {
        type: 'array',
        items: { type: 'string', format: 'uri' },
        title: 'Reference Audios',
        default: [],
        'x-order': 5,
        description: 'Reference audio files (up to 3, total duration max 15s) for audio-driven generation and lip-sync. Reference as [Audio1], [Audio2].'
      },
      duration: {
        type: 'integer',
        title: 'Duration',
        default: 5,
        maximum: 15,
        minimum: -1,
        'x-order': 6,
        description: 'Video duration in seconds. Set to -1 for intelligent duration (model picks best length).'
      },
      resolution: {
        type: 'string',
        title: 'Resolution',
        enum: ['480p', '720p', '1080p', '4k'],
        default: '720p',
        'x-order': 7,
        description: 'Video resolution. 4K outputs 10-bit H.265/HEVC at high bitrate.'
      },
      aspect_ratio: {
        type: 'string',
        title: 'aspect_ratio',
        widget: 'select',
        options: ['16:9', '4:3', '1:1', '3:4', '9:16', '21:9', '9:21', 'adaptive'],
        enum: ['16:9', '4:3', '1:1', '3:4', '9:16', '21:9', '9:21', 'adaptive'],
        default: '16:9',
        'x-order': 8,
        description: "Video aspect ratio. Set to 'adaptive' to let model choose best ratio based on inputs."
      },
      generate_audio: {
        type: 'boolean',
        title: 'generate_audio',
        default: true,
        'x-order': 9,
        description: 'Generate synchronized audio with the video, including dialogue, sound effects, and background music.'
      },
      seed: {
        type: 'integer',
        title: 'Seed',
        'x-order': 10,
        nullable: true,
        description: 'Random seed. Set for reproducible generation.'
      }
    };
    setEditingModel({
      ...editingModel,
      properties: officialSeedanceProps
    });
  };

  const handleCopyFromOtherModel = () => {
    if (!editingModel || !sourceModelId) return;
    const sourceModel = models.find(m => m.id === sourceModelId);
    if (!sourceModel) return;

    const copiedProps = JSON.parse(JSON.stringify(sourceModel.properties || {}));
    setEditingModel({
      ...editingModel,
      properties: copiedProps
    });

    const requiredKeys = Object.keys(copiedProps).filter(k => copiedProps[k].required);
    setRawJsonText(JSON.stringify({
      type: 'object',
      title: 'Input',
      required: requiredKeys.length > 0 ? requiredKeys : ['prompt'],
      properties: copiedProps
    }, null, 2));

    setShowCopyModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-gray-800">
      {/* 1. Top Admin Header exactly matching screenshot */}
      <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 z-30 sticky top-0">
        <div className="flex items-center gap-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={onExitConsole}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg text-gray-900 tracking-tight">New API</span>
          </div>

          {/* Header Nav Links */}
          <nav className="flex items-center gap-6 text-sm font-medium">
            <button
              onClick={onExitConsole}
              className="text-gray-600 hover:text-purple-600 transition"
            >
              首页
            </button>
            <button
              onClick={() => setActiveMenu('模型管理')}
              className="text-purple-600 font-bold border-b-2 border-purple-600 pb-3.5 mt-3.5"
            >
              控制台
            </button>
            <button
              onClick={onExitConsole}
              className="text-gray-600 hover:text-purple-600 transition"
            >
              模型广场
            </button>
            <button
              onClick={() => alert('API 官方开发文档加载中...')}
              className="text-gray-600 hover:text-purple-600 transition"
            >
              文档
            </button>
            <button
              onClick={() => alert('New API v0.3.8-alpha - 统一的多模态大模型路由网关系统')}
              className="text-gray-600 hover:text-purple-600 transition"
            >
              关于
            </button>
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4 text-gray-500">
          <button className="p-1.5 hover:bg-gray-100 rounded-full transition relative">
            <Bell className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-full transition">
            <Monitor className="w-4 h-4" />
          </button>
          <button className="px-2 py-1 border border-gray-200 rounded text-xs hover:bg-gray-50 font-medium">
            文/A
          </button>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 pl-1.5 pr-3 py-1 rounded-full cursor-pointer hover:border-purple-400 transition">
            <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
              A
            </div>
            <span className="text-xs font-semibold text-gray-700">admin123</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </div>
        </div>
      </header>

      {/* 2. Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Menu matching screenshot */}
        <aside className="w-52 bg-white border-r border-gray-200 flex flex-col justify-between py-4 select-none shrink-0">
          <div className="px-3 space-y-6 overflow-y-auto">
            {/* Group: 聊天 */}
            <div>
              <div className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">聊天</div>
              <div className="space-y-0.5">
                <button
                  onClick={onExitConsole}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition flex items-center gap-2.5"
                >
                  <Play className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>操练场</span>
                </button>
                <button
                  onClick={() => setActiveMenu('聊天')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>聊天</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Group: 控制台 */}
            <div>
              <div className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">控制台</div>
              <div className="space-y-0.5">
                {[
                  { name: '数据看板', icon: LayoutDashboard },
                  { name: '令牌管理', icon: Key },
                  { name: '使用日志', icon: BarChart2 },
                  { name: '绘图日志', icon: ImageIcon },
                  { name: '任务日志', icon: Activity },
                ].map(item => (
                  <button
                    key={item.name}
                    onClick={() => setActiveMenu(item.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2.5 ${
                      activeMenu === item.name ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 shrink-0 ${activeMenu === item.name ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Group: 个人中心 */}
            <div>
              <div className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">个人中心</div>
              <div className="space-y-0.5">
                {[
                  { name: '钱包管理', icon: CreditCard },
                  { name: 'Affiliate 推广', icon: Gift },
                  { name: '个人设置', icon: Settings },
                ].map(item => (
                  <button
                    key={item.name}
                    onClick={() => setActiveMenu(item.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2.5 ${
                      activeMenu === item.name ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Group: 管理员 */}
            <div>
              <div className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">管理员</div>
              <div className="space-y-0.5">
                {[
                  { name: '渠道管理', icon: Share2 },
                  { name: '订阅管理', icon: Calendar },
                  { name: '模型管理', icon: Layers },
                  { name: '模型部署', icon: Server },
                  { name: '模型检测', icon: Activity },
                  { name: '兑换码管理', icon: Gift },
                  { name: '用户管理', icon: Users },
                  { name: '系统设置', icon: Settings },
                ].map(item => (
                  <button
                    key={item.name}
                    onClick={() => setActiveMenu(item.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2.5 ${
                      activeMenu === item.name ? 'bg-blue-50 text-blue-600 font-bold border-r-2 border-blue-600' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 shrink-0 ${activeMenu === item.name ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="px-3 pt-4 border-t border-gray-100">
            <button
              onClick={onExitConsole}
              className="w-full py-2 px-3 text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>收起侧边栏 / 返回前台</span>
            </button>
          </div>
        </aside>

        {/* 3. Center Admin Content View */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50/70">
          {activeMenu !== '模型管理' ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-2xl mx-auto mt-12 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <Sliders className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">「{activeMenu}」模块管理菜单</h2>
              <p className="text-sm text-gray-500 mb-6">根据系统提示，当前仅重点开放【模型管理】中的模型参数可视化配置与 OpenAPI Schema 设置工具。</p>
              <button
                onClick={() => setActiveMenu('模型管理')}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-600/20 hover:bg-blue-700 transition"
              >
                前往 模型参数 Schema 配置页面
              </button>
            </div>
          ) : (
            <div className="space-y-5 max-w-7xl mx-auto">
              {/* Warning Banner matching screenshot */}
              <div className="bg-amber-50/90 border border-amber-200/80 text-amber-800 rounded-xl p-3.5 text-xs flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5 font-medium">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    提示：此处模型参数可视化 Schema 配置仅用于控制「模型广场」对用户的表单展示与交互校验效果，不会影响底层真实的鉴权路由。若需配置实际渠道密钥，请前往「渠道管理」。
                  </span>
                </div>
                <button className="text-amber-500 hover:text-amber-800 font-bold p-1">
                  ✕
                </button>
              </div>

              {/* Supplier Filter Bar matching screenshot */}
              <div className="flex items-center justify-between gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-2xs overflow-x-auto">
                <div className="flex items-center gap-2 shrink-0">
                  <button className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50">&lt;</button>
                  <button
                    onClick={() => setSupplierFilter('全部')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      supplierFilter === '全部' ? 'bg-blue-600 text-white shadow-2xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>全部</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] ${supplierFilter === '全部' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-600'}`}>162</span>
                  </button>
                  {[
                    { name: 'Google', count: 9 },
                    { name: '火山引擎', count: 12 },
                    { name: '阿里巴巴', count: 17 },
                    { name: 'Mistral', count: 6 },
                    { name: 'DeepSeek', count: 1 },
                    { name: 'OpenAI', count: 35 },
                  ].map(sup => (
                    <div key={sup.name} className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden shrink-0">
                      <button
                        onClick={() => setSupplierFilter(sup.name)}
                        className={`px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition ${
                          supplierFilter === sup.name ? 'bg-blue-50 text-blue-600 font-bold' : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>✨ {sup.name}</span>
                        <span className="bg-gray-100 px-1.5 py-0.2 rounded text-[10px] text-gray-500">{sup.count}</span>
                      </button>
                      <button className="px-2 py-1.5 text-[11px] text-gray-400 hover:text-gray-700 border-l border-gray-100 bg-gray-50/50">
                        操作
                      </button>
                    </div>
                  ))}
                  <button className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50">&gt;</button>
                </div>
                <button className="px-3.5 py-1.5 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-semibold shrink-0 transition">
                  + 新增供应商
                </button>
              </div>

              {/* Action Toolbar matching screenshot */}
              <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenSchemaEditor(models[0])}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>添加模型</span>
                  </button>
                  <button className="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-medium text-gray-700">
                    未配置模型
                  </button>
                  <button className="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-medium text-gray-700 flex items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
                    <span>同步</span>
                  </button>
                  <button className="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-medium text-gray-700">
                    预填组管理
                  </button>
                  <button className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-100 text-xs font-bold text-gray-800">
                    紧凑列表
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="搜索模型名称"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs w-44 focus:outline-none focus:border-blue-500"
                    />
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="搜索供应商"
                      value={supplierQuery}
                      onChange={e => setSupplierQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs w-36 focus:outline-none focus:border-blue-500"
                    />
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button className="px-4 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-black transition">
                    查询
                  </button>
                  <button
                    onClick={() => { setSearchQuery(''); setSupplierQuery(''); setSupplierFilter('全部'); }}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50"
                  >
                    重置
                  </button>
                </div>
              </div>

              {/* Model Table matching screenshot */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                      <th className="p-3 w-10 text-center"><input type="checkbox" className="rounded" /></th>
                      <th className="p-3">图标</th>
                      <th className="p-3">模型名称</th>
                      <th className="p-3">匹配类型</th>
                      <th className="p-3">参与官方同步</th>
                      <th className="p-3">供应商</th>
                      <th className="p-3">标签</th>
                      <th className="p-3">端点</th>
                      <th className="p-3">已绑定渠道</th>
                      <th className="p-3 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {/* First render our real interactive models from playground */}
                    {models.map((m) => (
                      <tr key={m.id} className="hover:bg-blue-50/30 transition group bg-purple-50/10">
                        <td className="p-3 text-center"><input type="checkbox" defaultChecked className="rounded text-blue-600" /></td>
                        <td className="p-3">
                          <div className="w-6 h-6 rounded bg-purple-600 text-white flex items-center justify-center font-bold text-[10px]">
                            {m.publisher[0]}
                          </div>
                        </td>
                        <td className="p-3 font-bold text-gray-900 flex items-center gap-1.5">
                          <span>{m.name}</span>
                          <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] px-1.5 py-0.2 rounded font-normal">广场在用</span>
                        </td>
                        <td className="p-3"><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[11px] font-semibold">精确</span></td>
                        <td className="p-3"><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[11px] font-semibold">是</span></td>
                        <td className="p-3 font-medium text-blue-600">▲ {m.publisher}</td>
                        <td className="p-3"><span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[11px]">{m.category.toLowerCase()}</span></td>
                        <td className="p-3 text-gray-500">openai / sse</td>
                        <td className="p-3"><span className="border border-gray-200 px-2 py-0.5 rounded bg-gray-50 text-gray-700">主站专用(1)</span></td>
                        <td className="p-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button className="px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 font-semibold">禁用</button>
                            <button className="px-2 py-1 rounded border border-gray-200 text-gray-700 hover:bg-gray-50">编辑</button>
                            <button
                              onClick={() => handleOpenSchemaEditor(m)}
                              className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs flex items-center gap-1"
                            >
                              <Sliders className="w-3 h-3" />
                              <span>配置参数</span>
                            </button>
                            <button className="px-2 py-1 text-red-500 hover:text-red-700">删除</button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* Then render mock table rows matching screenshot */}
                    {mockTableData
                      .filter(row => !models.some(m => m.name === row.name))
                      .map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50 transition">
                        <td className="p-3 text-center"><input type="checkbox" className="rounded" /></td>
                        <td className="p-3">
                          <div className="w-6 h-6 rounded bg-blue-500 text-white flex items-center justify-center font-bold text-[10px]">
                            ✦
                          </div>
                        </td>
                        <td className="p-3 font-semibold text-gray-800">{row.name}</td>
                        <td className="p-3"><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[11px]">精确</span></td>
                        <td className="p-3"><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[11px]">是</span></td>
                        <td className="p-3 font-medium text-blue-600">{row.supplier}</td>
                        <td className="p-3"><span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded text-[11px]">{row.tag}</span></td>
                        <td className="p-3 text-gray-500">{row.endpoint}</td>
                        <td className="p-3"><span className="border border-gray-200 px-2 py-0.5 rounded bg-gray-50 text-gray-700">{row.channel}</span></td>
                        <td className="p-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button className="px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50">禁用</button>
                            <button className="px-2 py-1 rounded border border-gray-200 text-gray-700 hover:bg-gray-50">编辑</button>
                            <button
                              onClick={() => handleOpenMockSchemaEditor(row.id, row.name, row.supplier)}
                              className="px-2.5 py-1 rounded border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold flex items-center gap-1"
                            >
                              <Sliders className="w-3 h-3" />
                              <span>配置参数</span>
                            </button>
                            <button className="px-2 py-1 text-red-500 hover:text-red-700">删除</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 4. Model Parameter & Info Configuration Drawer (Right Side Drawer matching screenshot) */}
      {editingModel && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-2xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setEditingModel(null)}
          />

          {/* Right Sliding Drawer Panel */}
          <div className="relative z-10 w-full max-w-3xl bg-white shadow-2xl border-l border-gray-200 flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Drawer Header matching screenshot */}
            <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <h3 className="font-extrabold text-lg text-gray-900 tracking-tight">
                  配置参数 - {editingModel.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingModel(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-white space-y-5">
              {/* Top Action Bar & Description */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const otherModels = models.filter(m => m.id !== editingModel?.id);
                      if (otherModels.length > 0) {
                        setSourceModelId(otherModels[0].id);
                      }
                      setShowCopyModal(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold hover:bg-blue-100 transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>复制其他模型参数配置</span>
                  </button>
                  <button
                    onClick={handleLoadOfficialSeedanceSchema}
                    className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold hover:bg-purple-100 transition flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>载入 Seedance 2.0 官方 11项完整 Schema（测试用）</span>
                  </button>
                </div>
              </div>

              {/* Sub-tabs inside Schema Drawer */}
              <div className="border-b border-gray-200 mb-5 flex items-center justify-between">
                <div className="flex gap-6 text-xs font-bold">
                  <button
                    onClick={() => setSchemaTab('visual')}
                    className={`py-2.5 border-b-2 flex items-center gap-2 transition ${
                      schemaTab === 'visual' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <Sliders className="w-4 h-4" />
                    <span>配置</span>
                  </button>
                    <button
                      onClick={() => {
                        const requiredKeys = Object.keys(editingModel.properties).filter(
                          k => editingModel.properties[k].required
                        );
                        setRawJsonText(JSON.stringify({
                          type: 'object',
                          title: 'Input',
                          required: requiredKeys.length > 0 ? requiredKeys : ['prompt'],
                          properties: editingModel.properties
                        }, null, 2));
                        setSchemaTab('raw');
                      }}
                      className={`py-2.5 border-b-2 flex items-center gap-2 transition ${
                        schemaTab === 'raw' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <Code className="w-4 h-4" />
                      <span>JSON Schema</span>
                    </button>
                  </div>

                  <div className="text-xs text-gray-500 font-medium">
                    已配置：<strong className="text-blue-600">{Object.keys(editingModel.properties).length}</strong> 个字段
                  </div>
                </div>

                {schemaTab === 'visual' ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-gray-50 p-3.5 rounded-xl border border-gray-200/80">
                      <div>
                        <h5 className="font-bold text-xs text-gray-900">参数面板配置</h5>
                      </div>
                      <button
                        onClick={() => openAddField()}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-2xs flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>新增字段</span>
                      </button>
                    </div>

                    {/* Visual Parameters Table */}
                    <div className="border border-gray-200 rounded-xl overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse min-w-[540px]">
                        <thead>
                          <tr className="bg-gray-100/80 text-gray-500 font-bold uppercase border-b border-gray-200 text-[11px]">
                            <th className="p-2.5 w-12 text-center">排序</th>
                            <th className="p-2.5">键名 (Key)</th>
                            <th className="p-2.5">标题 / 说明</th>
                            <th className="p-2.5">参数组件类型</th>
                            <th className="p-2.5 text-center">必填</th>
                            <th className="p-2.5 text-center">状态</th>
                            <th className="p-2.5 text-right">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(Object.entries(editingModel.properties) as [string, any][])
                            .sort(([, a], [, b]) => (a['x-order'] ?? 99) - (b['x-order'] ?? 99))
                            .map(([key, prop]) => {
                              const derivedWidget = prop.widget || (
                                prop.type === 'boolean' ? 'switch' :
                                (prop.enum || prop.options) ? 'select' :
                                (prop.type === 'file' || prop.format === 'uri' || (prop.type === 'array' && (prop.items?.format === 'uri' || key.includes('image') || key.includes('video')))) ? 'fileselect' :
                                prop.format === 'textarea' ? 'textarea' :
                                (prop.type === 'integer' || prop.type === 'number') ? 'number' :
                                'input'
                              );
                              const normalizedWidget = 
                                derivedWidget === 'boolean' ? 'switch' :
                                derivedWidget === 'text' ? 'input' :
                                derivedWidget === 'file' || derivedWidget === 'multi-file' || derivedWidget === 'imageselect' ? 'fileselect' :
                                derivedWidget;
                              const widgetLabelMap: Record<string, string> = {
                                slider: '滑块',
                                number: '数值输入框',
                                input: '文本输入框',
                                text: '文本输入框',
                                select: '下拉选择',
                                radiogroup: '单选按钮组',
                                switch: '开关',
                                textarea: '多行文本',
                                fileselect: '文件上传',
                                imageselect: '文件上传'
                              };
                              const isFieldEnabled = prop.visible !== false && prop.status !== 'disabled';
                              return (
                              <tr 
                                key={key} 
                                draggable={true}
                                onDragStart={() => setDraggedPropertyKey(key)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => {
                                  if (!draggedPropertyKey || draggedPropertyKey === key) return;
                                  const sortedEntries = (Object.entries(editingModel.properties) as [string, any][])
                                    .sort(([, a], [, b]) => (a['x-order'] ?? 99) - (b['x-order'] ?? 99));
                                  const fromIndex = sortedEntries.findIndex(([k]) => k === draggedPropertyKey);
                                  const toIndex = sortedEntries.findIndex(([k]) => k === key);
                                  if (fromIndex === -1 || toIndex === -1) return;
                                  const [movedEntry] = sortedEntries.splice(fromIndex, 1);
                                  sortedEntries.splice(toIndex, 0, movedEntry);
                                  
                                  const updatedProps: Record<string, any> = {};
                                  sortedEntries.forEach(([k, p], idx) => {
                                    updatedProps[k] = {
                                      ...p,
                                      'x-order': idx
                                    };
                                  });
                                  const updatedModel = { ...editingModel, properties: updatedProps };
                                  setEditingModel(updatedModel);
                                  onUpdateModel(updatedModel);
                                  setDraggedPropertyKey(null);
                                }}
                                className={`hover:bg-gray-50/80 transition cursor-move ${draggedPropertyKey === key ? 'opacity-40 bg-blue-50/60' : ''}`}
                                title="拖拽可调整排序"
                              >
                                <td className="p-2.5 text-center font-mono font-bold text-gray-400 select-none">
                                  <div className="flex items-center justify-center gap-1">
                                    <span className="text-gray-300 text-[10px]">⋮⋮</span>
                                    <span>#{prop['x-order'] ?? 10}</span>
                                  </div>
                                </td>
                                <td className="p-2.5 font-mono font-bold text-blue-600">
                                  {key}
                                </td>
                                <td className="p-2.5">
                                  <div className="font-bold text-gray-900 flex items-center gap-1.5 flex-wrap">
                                    <span>{prop.title || key}</span>
                                    {(prop.title_en || prop.titleEn) && (
                                      <span className="font-normal text-[11px] text-gray-400">({prop.title_en || prop.titleEn})</span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                                    <span>{prop.description || '暂无描述'}</span>
                                    {(prop.description_en || prop.descriptionEn) && (
                                      <span className="text-gray-400"> / {prop.description_en || prop.descriptionEn}</span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-2.5">
                                  <span className={`px-2 py-0.5 rounded font-medium text-[11px] whitespace-nowrap ${
                                    normalizedWidget === 'slider' ? 'bg-purple-100 text-purple-800' :
                                    normalizedWidget === 'number' ? 'bg-cyan-100 text-cyan-800' :
                                    normalizedWidget === 'select' || normalizedWidget === 'radiogroup' ? 'bg-indigo-100 text-indigo-800' :
                                    normalizedWidget === 'switch' ? 'bg-emerald-100 text-emerald-800' :
                                    normalizedWidget === 'fileselect' ? 'bg-amber-100 text-amber-800' :
                                    normalizedWidget === 'textarea' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {widgetLabelMap[normalizedWidget] || normalizedWidget}
                                  </span>
                                </td>
                                <td className="p-2.5 text-center">
                                  {prop.required ? (
                                    <span className="text-red-500 font-bold">必需</span>
                                  ) : (
                                    <span className="text-gray-400">可选</span>
                                  )}
                                </td>
                                <td className="p-2.5 text-center">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const nextEnabled = !isFieldEnabled;
                                      const updatedProps = { ...editingModel.properties };
                                      updatedProps[key] = {
                                        ...updatedProps[key],
                                        visible: nextEnabled,
                                        status: nextEnabled ? 'enabled' : 'disabled'
                                      };
                                      const updatedModel = { ...editingModel, properties: updatedProps };
                                      setEditingModel(updatedModel);
                                      onUpdateModel(updatedModel);
                                    }}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer shadow-2xs whitespace-nowrap ${
                                      isFieldEnabled
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                        : 'bg-gray-100 text-gray-500 border border-gray-300 hover:bg-gray-200'
                                    }`}
                                    title={isFieldEnabled ? '点击停用该字段参数' : '点击启用该字段参数'}
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isFieldEnabled ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                                    <span>{isFieldEnabled ? '启用' : '停用'}</span>
                                  </button>
                                </td>
                                <td className="p-2.5 text-right">
                                  <div className="inline-flex items-center gap-1.5">
                                    <button
                                      onClick={() => openAddField(key)}
                                      className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                                      title="编辑"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteField(key)}
                                      className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                                      title="删除"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {jsonError && <div className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded">{jsonError}</div>}
                    <textarea
                      rows={14}
                      value={rawJsonText}
                      onChange={e => { setRawJsonText(e.target.value); setJsonError(null); }}
                      className="w-full bg-gray-900 text-emerald-400 font-mono text-xs p-4 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500 leading-relaxed shadow-inner"
                    />
                  </div>
                )}
            </div>

            {/* Drawer Footer matching screenshot exactly */}
            <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-end gap-3 shrink-0 z-20 shadow-lg">
              <button
                onClick={() => setEditingModel(null)}
                className="px-5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>取消</span>
              </button>
              <button
                onClick={handleSaveSchema}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-600/25 transition flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>提交</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Single Parameter Sub-Modal */}
      {showAddFieldModal && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-3xl p-6 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
            <h4 className="font-extrabold text-base text-gray-900 flex items-center justify-between border-b border-gray-100 pb-3 shrink-0">
              <span>{editingFieldKey ? `编辑参数字段 - ${editingFieldKey}` : '新增模型参数字段'}</span>
              <button onClick={() => setShowAddFieldModal(false)} className="text-gray-400 hover:text-gray-700">✕</button>
            </h4>

            <div className="overflow-y-auto pr-1 space-y-4 py-3 flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-1.5">参数键名 *</label>
                  <input
                    type="text"
                    placeholder="例如: resolution, aspect_ratio"
                    value={fieldForm.key}
                    onChange={e => setFieldForm({ ...fieldForm, key: e.target.value })}
                    disabled={!!editingFieldKey}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono bg-white"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800 bg-gray-50/80 px-3 py-2.5 rounded-xl border border-gray-200 h-[38px]">
                    <input
                      type="checkbox"
                      checked={fieldForm.required}
                      onChange={e => setFieldForm({ ...fieldForm, required: e.target.checked })}
                      className="rounded w-4 h-4 text-blue-600"
                    />
                    <span>必填字段</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1.5">参数名称（中文）</label>
                  <input
                    type="text"
                    placeholder="例如: 视频分辨率"
                    value={fieldForm.title}
                    onChange={e => setFieldForm({ ...fieldForm, title: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  />
                </div>
                <div>
                 <label className="font-bold text-gray-700 block mb-1.5">描述说明（中文）</label>
                  <input
                    type="text"
                    placeholder="该参数在前端表单向用户展示的中文说明"
                    value={fieldForm.description}
                    onChange={e => setFieldForm({ ...fieldForm, description: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  />
                
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                   <label className="font-bold text-gray-700 block mb-1.5">参数名称（英文）</label>
                  <input
                    type="text"
                    placeholder="例如: Video Resolution"
                    value={fieldForm.titleEn || ''}
                    onChange={e => setFieldForm({ ...fieldForm, titleEn: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-sans bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1.5">描述说明（英文）</label>
                  <input
                    type="text"
                    placeholder="English tooltip or parameter description"
                    value={fieldForm.descriptionEn || ''}
                    onChange={e => setFieldForm({ ...fieldForm, descriptionEn: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-sans bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1.5">参数组件类型</label>
                <select
                  value={fieldForm.widget || 'input'}
                  onChange={e => {
                    const val = e.target.value;
                    setFieldForm({
                      ...fieldForm,
                      widget: val,
                      type: val === 'switch' ? 'boolean' : val === 'slider' || val === 'number' ? 'number' : (val === 'fileselect' || val === 'imageselect') ? 'string' : (val === 'select' || val === 'radiogroup' || val === 'textarea') ? 'string' : fieldForm.type
                    });
                  }}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-semibold text-gray-800 bg-white shadow-2xs"
                >
                  <option value="number">数值输入框 - number</option>
                  <option value="input">文本输入框 - input</option>
                  <option value="slider">滑块 - slider</option>
                  <option value="select">下拉选择 - select</option>
                  <option value="radiogroup">单选按钮组 - radiogroup</option>
                  <option value="switch">开关 - switch</option>
                  <option value="textarea">多行文本 - textarea</option>
                  <option value="fileselect">文件上传 - fileselect</option>
                </select>
              </div>

              {/* 专属配置面板一：slider 滑块 */}
              {fieldForm.widget === 'slider' && (
                <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-200/80 space-y-3 shadow-2xs">
                  <div className="text-xs font-bold text-purple-900 flex items-center justify-between border-b border-purple-200/60 pb-2">
                    <span>🎚️ 自定义配置</span>
                    <span className="text-[10px] font-normal text-purple-700">自动绑定 enable{'{Key}'} 开关机制</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">最小值 (min) *</label>
                      <input
                        type="number"
                        value={fieldForm.minimum ?? 0}
                        onChange={e => setFieldForm({ ...fieldForm, minimum: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 font-mono text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">最大值 (max) *</label>
                      <input
                        type="number"
                        value={fieldForm.maximum ?? 100}
                        onChange={e => setFieldForm({ ...fieldForm, maximum: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 font-mono text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">步长 (step) *</label>
                      <input
                        type="number"
                        value={fieldForm.step ?? 1}
                        onChange={e => setFieldForm({ ...fieldForm, step: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 font-mono text-xs bg-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800 bg-white p-2.5 rounded-lg border border-purple-100">
                      <input
                        type="checkbox"
                        checked={fieldForm.showToggle !== false}
                        onChange={e => setFieldForm({ ...fieldForm, showToggle: e.target.checked })}
                        className="rounded w-4 h-4 text-purple-600"
                      />
                      <span>显示右侧启用开关 (showToggle)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800 bg-white p-2.5 rounded-lg border border-purple-100">
                      <input
                        type="checkbox"
                        checked={fieldForm.defaultEnabled !== false}
                        onChange={e => setFieldForm({ ...fieldForm, defaultEnabled: e.target.checked })}
                        className="rounded w-4 h-4 text-purple-600"
                      />
                      <span>默认参与提交 (defaultEnabled)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* 专属配置面板二 A：number 数值输入框 */}
              {fieldForm.widget === 'number' && (
                <div className="p-4 bg-cyan-50/70 rounded-xl border border-cyan-200/80 space-y-3 shadow-2xs">
                  <div className="text-xs font-bold text-cyan-900 flex items-center justify-between border-b border-cyan-200/60 pb-2">
                    <span>🔢 自定义配置</span>
                    <span className="text-[10px] font-normal text-cyan-700">支持数值范围及提交控制配置</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">最小值 (min)</label>
                      <input
                        type="number"
                        value={fieldForm.minimum ?? ''}
                        onChange={e => setFieldForm({ ...fieldForm, minimum: e.target.value === '' ? undefined : Number(e.target.value) })}
                        placeholder="不限"
                        className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 font-mono text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">最大值 (max)</label>
                      <input
                        type="number"
                        value={fieldForm.maximum ?? ''}
                        onChange={e => setFieldForm({ ...fieldForm, maximum: e.target.value === '' ? undefined : Number(e.target.value) })}
                        placeholder="不限"
                        className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 font-mono text-xs bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex items-end pt-1">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800 bg-white px-3 py-1.5 rounded-lg border border-cyan-100 h-[34px]">
                      <input
                        type="checkbox"
                        checked={fieldForm.defaultEnabled !== false}
                        onChange={e => setFieldForm({ ...fieldForm, defaultEnabled: e.target.checked })}
                        className="rounded w-4 h-4 text-cyan-600"
                      />
                      <span>默认参与提交 (defaultEnabled)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* 专属配置面板二 B：input 文本输入框 */}
              {fieldForm.widget === 'input' && (
                <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200/80 space-y-3 shadow-2xs">
                  <div className="text-xs font-bold text-blue-900 flex items-center justify-between border-b border-blue-200/60 pb-2">
                    <span>⌨️ 自定义配置</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">输入模式 (inputMode)</label>
                      <select
                        value={fieldForm.inputMode || 'text'}
                        onChange={e => setFieldForm({ ...fieldForm, inputMode: e.target.value as any })}
                        className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-medium text-xs bg-white"
                      >
                        <option value="text">text (标准文本输入)</option>
                        <option value="url">url (网页网址连接)</option>
                        <option value="email">email (电子邮箱)</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800 bg-white px-3 py-1.5 rounded-lg border border-blue-100 w-full h-[34px]">
                        <input
                          type="checkbox"
                          checked={fieldForm.defaultEnabled !== false}
                          onChange={e => setFieldForm({ ...fieldForm, defaultEnabled: e.target.checked })}
                          className="rounded w-4 h-4 text-blue-600"
                        />
                        <span>默认参与提交 (defaultEnabled)</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* 专属配置面板三：textarea 多行文本 */}
              {fieldForm.widget === 'textarea' && (
                <div className="p-4 bg-pink-50/70 rounded-xl border border-pink-200/80 space-y-3 shadow-2xs">
                  <div className="text-xs font-bold text-pink-900 flex items-center justify-between border-b border-pink-200/60 pb-2">
                    <span>📝 自定义配置</span>
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">最大字数限制 (maxLength)</label>
                    <input
                      type="number"
                      placeholder="例如 4000"
                      value={fieldForm.maxLength ?? ''}
                      onChange={e => setFieldForm({ ...fieldForm, maxLength: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 font-mono text-xs bg-white"
                    />
                  </div>
                </div>
              )}

              {/* 专属配置面板四：fileselect 文件上传 */}
              {(fieldForm.widget === 'fileselect' || fieldForm.widget === 'imageselect') && (
                <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-3 shadow-2xs">
                  <div className="text-xs font-bold text-amber-900 flex items-center justify-between border-b border-amber-200/60 pb-2">
                    <span>🖼️ 自定义配置</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">媒体形态 (mediaType)</label>
                      <select
                        value={fieldForm.mediaType || 'image'}
                        onChange={e => setFieldForm({ ...fieldForm, mediaType: e.target.value as any })}
                        className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 font-medium text-xs bg-white"
                      >
                        <option value="image">image (图文直显)</option>
                        <option value="video">video (视频媒体)</option>
                        <option value="audio">audio (音频媒体)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">数量上限 (maxCount)</label>
                      <input
                        type="number"
                        placeholder="1为单选, >1多文件"
                        value={fieldForm.maxCount || 1}
                        onChange={e => setFieldForm({ ...fieldForm, maxCount: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 font-mono text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">单文件大小(MB) (maxSizeMb)</label>
                      <input
                        type="number"
                        value={fieldForm.maxSizeMb || 5}
                        onChange={e => setFieldForm({ ...fieldForm, maxSizeMb: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 font-mono text-xs bg-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="font-bold text-gray-700 block mb-1">允许的扩展名 (acceptExtensions)</label>
                      <input
                        type="text"
                        placeholder="例如: jpg, png, webp 或 mp4, mov"
                        value={fieldForm.acceptExtensions || ''}
                        onChange={e => setFieldForm({ ...fieldForm, acceptExtensions: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 font-mono text-xs bg-white"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800 bg-white px-2.5 py-1.5 rounded-lg border border-amber-100 w-full h-[34px]">
                        <input
                          type="checkbox"
                          checked={!!fieldForm.base64}
                          onChange={e => setFieldForm({ ...fieldForm, base64: e.target.checked })}
                          className="rounded w-4 h-4 text-amber-600"
                        />
                        <span>转 Data URL (base64)</span>
                      </label>
                    </div>
                  </div>
                  {fieldForm.mediaType !== 'image' && (
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">单音/视频最长时长(秒) (maxDurationSeconds)</label>
                        <input
                          type="number"
                          placeholder="例如: 15"
                          value={fieldForm.maxDurationSeconds ?? ''}
                          onChange={e => setFieldForm({ ...fieldForm, maxDurationSeconds: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 font-mono text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">总时长上限(秒) (maxTotalDurationSeconds)</label>
                        <input
                          type="number"
                          placeholder="例如: 15"
                          value={fieldForm.maxTotalDurationSeconds ?? ''}
                          onChange={e => setFieldForm({ ...fieldForm, maxTotalDurationSeconds: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 font-mono text-xs bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 专属配置面板五：select / radiogroup 选项子表配置 */}
              {(fieldForm.widget === 'select' || fieldForm.widget === 'radiogroup') && (
                <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-200/80 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-indigo-200/60 pb-2">
                    <label className="font-bold text-indigo-900 text-xs flex items-center gap-1.5">
                      <span>📋 自定义配置</span>
                    </label>
                    <span className="text-[11px] text-indigo-700 font-normal">支持绑定 value、label 及辅助信息 meta</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="grid grid-cols-12 gap-2 px-1 text-[11px] font-bold text-gray-700">
                      <div className="col-span-4">value (API提交值) *</div>
                      <div className="col-span-4">label (用户展示文案)</div>
                      <div className="col-span-3">meta (辅助提示,如16:9)</div>
                      <div className="col-span-1 text-center">操作</div>
                    </div>
                    
                    {(fieldForm.enumList || []).map((item, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-4">
                          <input
                            type="text"
                            placeholder="如: 16:9, 720P"
                            value={item.value}
                            onChange={e => {
                              const newList = [...fieldForm.enumList];
                              newList[idx].value = e.target.value;
                              setFieldForm({ ...fieldForm, enumList: newList });
                            }}
                            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 font-mono text-xs bg-white"
                          />
                        </div>
                        <div className="col-span-4">
                          <input
                            type="text"
                            placeholder="默认同 value"
                            value={item.label}
                            onChange={e => {
                              const newList = [...fieldForm.enumList];
                              newList[idx].label = e.target.value;
                              setFieldForm({ ...fieldForm, enumList: newList });
                            }}
                            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-xs bg-white"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="text"
                            placeholder="如: 横屏/2K"
                            value={item.meta || ''}
                            onChange={e => {
                              const newList = [...fieldForm.enumList];
                              newList[idx].meta = e.target.value;
                              setFieldForm({ ...fieldForm, enumList: newList });
                            }}
                            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-xs bg-white font-mono"
                          />
                        </div>
                        <div className="col-span-1 flex items-center justify-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              const newList = [...fieldForm.enumList];
                              newList.splice(idx + 1, 0, { value: '', label: '', meta: '' });
                              setFieldForm({ ...fieldForm, enumList: newList });
                            }}
                            className="w-6 h-6 flex items-center justify-center bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded font-bold text-sm transition"
                            title="在下方插入选项"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const newList = fieldForm.enumList.filter((_, i) => i !== idx);
                              setFieldForm({ ...fieldForm, enumList: newList.length > 0 ? newList : [{ value: '', label: '', meta: '' }] });
                            }}
                            className="w-6 h-6 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 rounded font-bold text-sm transition"
                            title="删除该选项"
                          >
                            -
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {fieldForm.widget !== 'switch' && (
                <div>
                  <label className="font-bold text-gray-700 block mb-1.5">输入提示语 (Placeholder)</label>
                  <input
                    type="text"
                    placeholder="例如: Describe what you want..."
                    value={fieldForm.placeholder || ''}
                    onChange={e => setFieldForm({ ...fieldForm, placeholder: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-gray-700 block mb-1.5 flex items-center justify-between">
                  <span>API 目标映射路径 (target_path)</span>
                </label>
                <input
                  type="text"
                  placeholder="例如: reasoning.effort 或 text.verbosity。选填，Responses API 等深层嵌套用点分割"
                  value={fieldForm.target_path || ''}
                  onChange={e => setFieldForm({ ...fieldForm, target_path: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1.5">默认值</label>
                {fieldForm.widget === 'switch' || fieldForm.type === 'boolean' ? (
                  <select
                    value={
                      fieldForm.default === true || fieldForm.default === 'true'
                        ? 'true'
                        : fieldForm.default === false || fieldForm.default === 'false'
                        ? 'false'
                        : 'null'
                    }
                    onChange={e => {
                      const val = e.target.value;
                      setFieldForm({
                        ...fieldForm,
                        default: val === 'true' ? true : val === 'false' ? false : null
                      });
                    }}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono font-medium bg-white"
                  >
                    <option value="null">null</option>
                    <option value="true">true</option>
                    <option value="false">false</option>
                  </select>
                ) : (fieldForm.widget === 'select' || fieldForm.widget === 'radiogroup') ? (
                  <select
                    value={String(fieldForm.default ?? '')}
                    onChange={e => setFieldForm({ ...fieldForm, default: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-medium bg-white text-xs"
                  >
                    <option value="">-- 无默认值 (请选择) --</option>
                    {(fieldForm.enumList || [])
                      .filter(item => item.value.trim() !== '')
                      .map((item, idx) => {
                        const val = item.value.trim();
                        const lbl = item.label?.trim() ? item.label.trim() : val;
                        return (
                          <option key={idx} value={val}>
                            {lbl !== val ? `${lbl} (${val})` : val}
                          </option>
                        );
                      })}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder=""
                    value={String(fieldForm.default ?? '')}
                    onChange={e => setFieldForm({ ...fieldForm, default: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                  />
                )}
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1.5">表单排序</label>
                <input
                  type="number"
                  value={fieldForm.xOrder}
                  onChange={e => setFieldForm({ ...fieldForm, xOrder: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {(fieldForm.widget === 'input' || fieldForm.widget === 'textarea') && (
                <div>
                  <label className="font-bold text-gray-700 block mb-1.5">最大字数</label>
                  <input
                    type="number"
                    placeholder="例如 4000"
                    value={fieldForm.maxLength ?? ''}
                    onChange={e => setFieldForm({ ...fieldForm, maxLength: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 shrink-0">
              <button
                onClick={() => setShowAddFieldModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition"
              >
                取消
              </button>
              <button
                onClick={handleSaveField}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
              >
                保存字段
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copy Parameters Sub-Modal */}
      {showCopyModal && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg p-6 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
            <h4 className="font-extrabold text-base text-gray-900 flex items-center justify-between border-b border-gray-100 pb-3 shrink-0">
              <span className="flex items-center gap-2">
                <Copy className="w-4 h-4 text-blue-600" />
                <span>复制其他模型参数配置</span>
              </span>
              <button onClick={() => setShowCopyModal(false)} className="text-gray-400 hover:text-gray-700">✕</button>
            </h4>

            <div className="overflow-y-auto pr-1 space-y-4 py-3 flex-1 text-xs">
              <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>参数覆盖提醒</span>
                </div>
                <p className="text-amber-700 leading-relaxed text-[11px]">
                  选择指定复制的模型后，系统将把该模型的<strong>全部表单参数配置与默认值</strong>一键导入并覆盖当前配置面板，确认无误后点击底部「提交」才会正式保存至系统。
                </p>
              </div>

              <div className="space-y-3">
                <label className="font-bold text-gray-700 block">选择源模型</label>
                <select
                  value={sourceModelId}
                  onChange={e => setSourceModelId(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white font-medium text-xs text-gray-800 shadow-2xs cursor-pointer transition"
                >
                  <option value="" disabled>-- 请选择待复制源模型 --</option>
                  {models.filter(m => m.id !== editingModel?.id).map(m => {
                    const propCount = Object.keys(m.properties || {}).length;
                    return (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.publisher})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 shrink-0">
              <button
                onClick={() => setShowCopyModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition"
              >
                取消
              </button>
              <button
                onClick={handleCopyFromOtherModel}
                disabled={!sourceModelId}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>一键导入并覆盖至当前编辑器</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
