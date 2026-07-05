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
    type: string;
    description: string;
    placeholder?: string;
    default: any;
    format?: string;
    enumList: { value: string; label: string }[];
    maxLength?: number;
    minimum?: number;
    maximum?: number;
    xOrder: number;
    required: boolean;
  }>({
    key: '',
    title: '',
    type: 'string',
    description: '',
    placeholder: '',
    default: '',
    format: '',
    enumList: [{ value: '', label: '' }],
    xOrder: 10,
    required: false
  });
  const [showAddFieldModal, setShowAddFieldModal] = useState<boolean>(false);
  const [showCopyModal, setShowCopyModal] = useState<boolean>(false);
  const [sourceModelId, setSourceModelId] = useState<string>('');

  // Additional mock rows to match New API admin console screenshot exactly
  const mockTableData = [
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
      const prop = editingModel.properties[fieldKey];
      let initialEnumList: { value: string; label: string }[] = [];
      if (Array.isArray(prop.enum)) {
        initialEnumList = prop.enum.map((val: any, idx: number) => {
          const valStr = typeof val === 'object' && val !== null ? String(val.value ?? '') : String(val);
          const rawLabel = typeof val === 'object' && val !== null && val.label !== undefined
            ? String(val.label)
            : (Array.isArray(prop.enumNames) && prop.enumNames[idx] !== undefined ? String(prop.enumNames[idx]) : '');
          const labelStr = rawLabel === valStr ? '' : rawLabel;
          return { value: valStr, label: labelStr };
        });
      } else if (Array.isArray(prop.options)) {
        initialEnumList = prop.options.map((val: any) => ({
          value: String(val),
          label: ''
        }));
      }
      if (initialEnumList.length === 0) {
        initialEnumList = [{ value: '', label: '' }];
      }
      setEditingFieldKey(fieldKey);
      setFieldForm({
        key: fieldKey,
        title: prop.title || fieldKey,
        type: prop.type || 'string',
        description: prop.description || '',
        placeholder: prop.placeholder || '',
        default: prop.default ?? '',
        format: prop.format || prop.items?.format || (prop.widget === 'file' || prop.widget === 'multi-file' ? 'uri' : ''),
        enumList: initialEnumList,
        maxLength: prop.maxLength,
        minimum: prop.minimum,
        maximum: prop.maximum,
        xOrder: prop['x-order'] ?? 10,
        required: !!prop.required
      });
    } else {
      setEditingFieldKey(null);
      setFieldForm({
        key: '',
        title: '',
        type: 'string',
        description: '',
        placeholder: '',
        default: '',
        format: '',
        enumList: [{ value: '', label: '' }],
        xOrder: Object.keys(editingModel.properties).length + 1,
        required: false
      });
    }
    setShowAddFieldModal(true);
  };

  const handleSaveField = () => {
    if (!editingModel || !fieldForm.key.trim()) return;
    const key = fieldForm.key.trim();
    const newProp: any = {
      type: fieldForm.type,
      title: fieldForm.title || key,
      description: fieldForm.description,
      'x-order': Number(fieldForm.xOrder) || 0,
      required: fieldForm.required
    };
    if (fieldForm.placeholder) {
      newProp.placeholder = fieldForm.placeholder;
    }
    if (fieldForm.default !== '' && fieldForm.default !== undefined) {
      if (fieldForm.type === 'integer' || fieldForm.type === 'number') {
        newProp.default = Number(fieldForm.default);
      } else if (fieldForm.type === 'boolean') {
        newProp.default = fieldForm.default === 'true' || fieldForm.default === true;
      } else {
        newProp.default = fieldForm.default;
      }
    }
    if (fieldForm.format) {
      newProp.format = fieldForm.format;
      if (fieldForm.format === 'uri') {
        newProp.widget = fieldForm.type === 'array' ? 'multi-file' : 'file';
      }
    }
    if (fieldForm.maxLength) newProp.maxLength = Number(fieldForm.maxLength);
    if (fieldForm.minimum !== undefined && !isNaN(fieldForm.minimum)) newProp.minimum = Number(fieldForm.minimum);
    if (fieldForm.maximum !== undefined && !isNaN(fieldForm.maximum)) newProp.maximum = Number(fieldForm.maximum);
    const validEnumItems = (fieldForm.enumList || []).filter(item => item.value.trim() !== '');
    if (validEnumItems.length > 0) {
      newProp.enum = validEnumItems.map(item => item.value.trim());
      newProp.enumNames = validEnumItems.map(item => item.label.trim() ? item.label.trim() : item.value.trim());
    }
    if (fieldForm.type === 'array') {
      newProp.items = { type: 'string', format: fieldForm.format || 'uri' };
      if (!newProp.widget) newProp.widget = 'multi-file';
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
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold text-xs border border-blue-200/60">
                  Schema
                </span>
                <h3 className="font-extrabold text-lg text-gray-900 tracking-tight">
                  配置多模态参数 - 「{editingModel.name}」
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
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/70">
              {/* Card: 参数 Schema 与可视化字段构建 */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-gray-900">多模态参数与 OpenAPI Schema 配置</h4>
                      <p className="text-xs text-gray-500 mt-0.5">此处配置的控件将在多模态表单（图片、视频生成等）中实时渲染</p>
                    </div>
                  </div>
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

                {/* Sub-tabs inside Schema Card */}
                <div className="border-b border-gray-200 mb-5 flex items-center justify-between">
                  <div className="flex gap-6 text-xs font-bold">
                    <button
                      onClick={() => setSchemaTab('visual')}
                      className={`py-2.5 border-b-2 flex items-center gap-2 transition ${
                        schemaTab === 'visual' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <Sliders className="w-4 h-4" />
                      <span>可视化构建器 (Visual Builder)</span>
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
                      <span>JSON Schema 原文编辑</span>
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
                        <h5 className="font-bold text-xs text-gray-900">请求参数与 UI 绑定规则</h5>
                        <p className="text-[11px] text-gray-500 mt-0.5">支持为模型配置 URI参考图上传、下拉框、数值滑动条等</p>
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
                            <th className="p-2.5">数据类型</th>
                            <th className="p-2.5 text-center">必填</th>
                            <th className="p-2.5 text-right">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {(Object.entries(editingModel.properties) as [string, any][])
                            .sort(([, a], [, b]) => (a['x-order'] ?? 99) - (b['x-order'] ?? 99))
                            .map(([key, prop]) => (
                              <tr key={key} className="hover:bg-gray-50/80 transition">
                                <td className="p-2.5 text-center font-mono font-bold text-gray-400">
                                  #{prop['x-order'] ?? 10}
                                </td>
                                <td className="p-2.5 font-mono font-bold text-blue-600">
                                  {key}
                                </td>
                                <td className="p-2.5">
                                  <div className="font-bold text-gray-900">{prop.title || key}</div>
                                  <div className="text-[11px] text-gray-500 line-clamp-1">{prop.description || '暂无描述'}</div>
                                </td>
                                <td className="p-2.5">
                                  <span className={`px-2 py-0.5 rounded font-mono font-semibold text-[10px] ${
                                    prop.type === 'string' && prop.format === 'uri' ? 'bg-amber-100 text-amber-800' :
                                    prop.type === 'integer' || prop.type === 'number' ? 'bg-purple-100 text-purple-800' :
                                    prop.type === 'boolean' ? 'bg-emerald-100 text-emerald-800' :
                                    prop.type === 'array' ? 'bg-pink-100 text-pink-800' : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {prop.type === 'string' && prop.format === 'uri' ? 'uri/多媒体' : prop.type}
                                  </span>
                                </td>
                                <td className="p-2.5 text-center">
                                  {prop.required ? (
                                    <span className="text-red-500 font-bold">必需</span>
                                  ) : (
                                    <span className="text-gray-400">可选</span>
                                  )}
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
                            ))}
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
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg p-6 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
            <h4 className="font-extrabold text-base text-gray-900 flex items-center justify-between border-b border-gray-100 pb-3 shrink-0">
              <span>{editingFieldKey ? `编辑参数字段 - ${editingFieldKey}` : '新增模型参数字段'}</span>
              <button onClick={() => setShowAddFieldModal(false)} className="text-gray-400 hover:text-gray-700">✕</button>
            </h4>

            <div className="overflow-y-auto pr-1 space-y-4 py-2 flex-1 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1.5">参数键名 *</label>
                <input
                  type="text"
                  placeholder="例如: resolution, aspect_ratio"
                  value={fieldForm.key}
                  onChange={e => setFieldForm({ ...fieldForm, key: e.target.value })}
                  disabled={!!editingFieldKey}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1.5">显示名称</label>
                <input
                  type="text"
                  placeholder="例如: Video Resolution"
                  value={fieldForm.title}
                  onChange={e => setFieldForm({ ...fieldForm, title: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1.5">输入提示语 (Placeholder)</label>
                <input
                  type="text"
                  placeholder="例如: Describe the video you want..."
                  value={fieldForm.placeholder || ''}
                  onChange={e => setFieldForm({ ...fieldForm, placeholder: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1.5">数据类型</label>
                <select
                  value={fieldForm.type}
                  onChange={e => setFieldForm({ ...fieldForm, type: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-semibold"
                >
                  <option value="string">文本</option>
                  <option value="integer">整数</option>
                  <option value="number">浮点数</option>
                  <option value="boolean">布尔开关</option>
                  <option value="array">多媒体上传数组</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1.5">表单格式 / 格式约束</label>
                <select
                  value={fieldForm.format}
                  onChange={e => setFieldForm({ ...fieldForm, format: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">普通文本框</option>
                  <option value="uri">链接上传</option>
                  <option value="textarea">多行长文本区域</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1.5">说明描述</label>
                <input
                  type="text"
                  placeholder="该参数在前端模型广场向用户展示的提示信息"
                  value={fieldForm.description}
                  onChange={e => setFieldForm({ ...fieldForm, description: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1.5">默认值</label>
                {fieldForm.type === 'boolean' ? (
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
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono font-medium"
                  >
                    <option value="null">null</option>
                    <option value="true">true</option>
                    <option value="false">false</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="例如: 16:9 或 720p"
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

              <div>
                <label className="font-bold text-gray-700 block mb-1.5">最大字数</label>
                <input
                  type="number"
                  placeholder="例如 4000"
                  value={fieldForm.maxLength ?? fieldForm.maximum ?? ''}
                  onChange={e => setFieldForm({ ...fieldForm, maxLength: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer font-bold text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <input
                    type="checkbox"
                    checked={fieldForm.required}
                    onChange={e => setFieldForm({ ...fieldForm, required: e.target.checked })}
                    className="rounded w-4 h-4 text-blue-600"
                  />
                  <span>设置为必填字段</span>
                </label>
              </div>

              {fieldForm.type !== 'array' && (
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <label className="font-bold text-gray-700">枚举选项</label>
                    <span className="text-[11px] text-gray-400">label为空时默认显示value</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 px-1 text-xs font-bold text-gray-700">
                      <div>value</div>
                      <div>label</div>
                    </div>
                    
                    {(fieldForm.enumList || []).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="例如: 16:9"
                          value={item.value}
                          onChange={e => {
                            const newList = [...fieldForm.enumList];
                            newList[idx].value = e.target.value;
                            setFieldForm({ ...fieldForm, enumList: newList });
                          }}
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-xs"
                        />
                        <input
                          type="text"
                          placeholder="例如: 宽屏 16:9 (可选)"
                          value={item.label}
                          onChange={e => {
                            const newList = [...fieldForm.enumList];
                            newList[idx].label = e.target.value;
                            setFieldForm({ ...fieldForm, enumList: newList });
                          }}
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs"
                        />
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              const newList = [...fieldForm.enumList];
                              newList.splice(idx + 1, 0, { value: '', label: '' });
                              setFieldForm({ ...fieldForm, enumList: newList });
                            }}
                            className="w-6 h-6 flex items-center justify-center text-red-500 hover:bg-red-50 rounded font-bold text-base transition"
                            title="在下方添加一行"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const newList = fieldForm.enumList.filter((_, i) => i !== idx);
                              setFieldForm({ ...fieldForm, enumList: newList.length > 0 ? newList : [{ value: '', label: '' }] });
                            }}
                            className="w-6 h-6 flex items-center justify-center text-red-500 hover:bg-red-50 rounded font-bold text-base transition"
                            title="删除当前行"
                          >
                            -
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
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
                  <span>参数覆盖与暂存提醒</span>
                </div>
                <p className="text-amber-700 leading-relaxed text-[11px]">
                  选择待复制的源模型后，系统将把该模型的<strong>全部表单参数配置与默认值</strong>一键导入并覆盖当前「<strong>{editingModel?.name}</strong>」的编辑器面板。
                  <br />
                  <span className="underline decoration-amber-400 underline-offset-2">注：导入仅在当前抽屉暂存生效，覆盖后您可继续进行修改，确认无误后点击底部「提交」后才会正式保存至系统。</span>
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-gray-700 block">选择源模型 (复制其表单字段架构)</label>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {models.filter(m => m.id !== editingModel?.id).map(m => {
                    const propCount = Object.keys(m.properties || {}).length;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setSourceModelId(m.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                          sourceModelId === m.id
                            ? 'bg-blue-50/80 border-blue-600 text-blue-900 shadow-2xs font-semibold'
                            : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-xs flex items-center gap-2">
                            <span>{m.name}</span>
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded font-normal">
                              {m.publisher}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                            {m.description || '多模态智能模型'}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
                            propCount > 0 ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-gray-100 text-gray-500 border-gray-200'
                          }`}>
                            {propCount} 个字段
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
