import { ModelSchema } from '../types';

export const SAMPLE_IMAGES = [
  {
    name: 'Cyberpunk Girl Portrait',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: 'Futuristic Sci-Fi City',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: 'Cozy Snowy Cabin',
    url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: 'Golden Retriever Pup',
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=150&auto=format&fit=crop&q=80'
  }
];

export const MODEL_SCHEMAS: ModelSchema[] = [
  {
    id: 'openai/gpt-5.4',
    name: 'gpt-5.4',
    publisher: 'OpenAI',
    description: 'OpenAI 官方全新一代旗舰多模态大语言模型，具备顶级的复杂逻辑推理（Reasoning）、超长上下文窗口（256k tokens）、原生视觉图文多模态推演与联网检索能力。',
    category: 'Language Model',
    status: 'Hot',
    runsCount: '16.8M runs',
    avgTime: '~1.8s',
    pricePerRun: '$0.005 / 1K tokens',
    properties: {
      prompt: {
        type: 'string',
        title: 'prompt (用户输入指令)',
        widget: 'textarea',
        placeholder: '输入想对 GPT-5.4 提问的内容或处理的任务指令...',
        default: '请帮我推演《三体》中黑暗森林法则的博弈论数学逻辑，并用 TypeScript 编写一个基于猜疑链的策略模拟代码片段。',
        help: '用户的主提示词（Messages user prompt），最多支持 256,000 上下文 Token。',
        required: true,
        'x-order': 1
      },
      system_prompt: {
        type: 'string',
        title: 'system_prompt (系统设定角色)',
        widget: 'textarea',
        placeholder: 'You are a helpful AI assistant...',
        default: '你是一个严谨的 AI 科学家与首席软件架构师，思考深入、逻辑严密，输出代码规范。',
        help: '为模型设定角色身份、回复语气和特定行为边界（System instructions）。',
        'x-order': 2
      },
      reference_images: {
        type: 'array',
        title: 'reference_images (视觉多模态附件)',
        widget: 'multi-file',
        help: '上传图表、架构设计图或屏幕截图，供 GPT-5.4 原生视觉引擎（Vision）进行多模态交互推演。',
        'x-order': 3
      },
      reasoning_effort: {
        type: 'string',
        title: 'reasoning_effort (思考链深度)',
        widget: 'radiogroup',
        options: ['low (极速响应)', 'medium (平衡思考)', 'high (深度严密推导)'],
        enum: ['low', 'medium', 'high'],
        enumNames: ['low (极速响应)', 'medium (平衡思考)', 'high (深度严密推导)'],
        default: 'medium',
        help: '对标 OpenAI 官方 reasoning_effort 参数，控制模型在复杂推导任务上的内部 CoT 思考链深度。',
        'x-order': 4
      },
      temperature: {
        type: 'number',
        title: 'temperature (采样温度)',
        widget: 'slider',
        min: 0.0,
        max: 2.0,
        step: 0.1,
        default: 0.7,
        help: '对标官方范围 [0, 2.0]。0 代表绝对确定性输出（适合代码及信息抽取），值越大越具发散创造力。',
        'x-order': 5
      },
      top_p: {
        type: 'number',
        title: 'top_p (核采样比例)',
        widget: 'slider',
        min: 0.0,
        max: 1.0,
        step: 0.05,
        default: 1.0,
        help: '官方推荐与 temperature 二选一使用，只从累计概率占 top_p 的候选词汇中进行核采样。',
        'x-order': 6
      },
      max_completion_tokens: {
        type: 'integer',
        title: 'max_completion_tokens (最大生成长度)',
        widget: 'input',
        default: 16384,
        placeholder: '16384',
        help: '控制模型单次会话生成的最大 Token 数量（官方最新 API 替代原 max_tokens 字段）。',
        'x-order': 7
      },
      response_format: {
        type: 'string',
        title: 'response_format (输出结构格式)',
        widget: 'select',
        options: ['text (纯文本输出)', 'json_object (标准 JSON 对象)', 'json_schema (严格遵守 Schema)'],
        enum: ['text', 'json_object', 'json_schema'],
        enumNames: ['text (纯文本输出)', 'json_object (标准 JSON 对象)', 'json_schema (严格遵守 Schema)'],
        default: 'text',
        help: '指定模型返回内容的结构化约定（Structured Outputs 支持 100% 格式对齐）。',
        'x-order': 8
      },
      enable_web_search: {
        type: 'boolean',
        title: 'enable_web_search (联网实时检索)',
        widget: 'switch',
        default: true,
        help: '开启 GPT-5.4 官方原生联网实时搜索工具（Web Search Tool），融合最新实时动态信息。',
        'x-order': 9
      },
      frequency_penalty: {
        type: 'number',
        title: 'frequency_penalty (频率惩罚)',
        widget: 'slider',
        min: -2.0,
        max: 2.0,
        step: 0.1,
        default: 0.0,
        help: '官方范围 [-2.0, 2.0]，根据词汇在已生成文本中的出现次数进行惩罚，降低车轱辘话重复概率。',
        'x-order': 10
      },
      presence_penalty: {
        type: 'number',
        title: 'presence_penalty (存在惩罚)',
        widget: 'slider',
        min: -2.0,
        max: 2.0,
        step: 0.1,
        default: 0.0,
        help: '官方范围 [-2.0, 2.0]，根据词汇是否已经在文本中出现进行惩罚，鼓励模型探索新话题。',
        'x-order': 11
      },
      seed: {
        type: 'integer',
        title: 'seed (随机种子)',
        widget: 'input',
        default: 42,
        placeholder: '例如: 42',
        help: '尽最大努力实现每次相同输入和 Seed 时的决定性一致输出，便于研发调试与评估。',
        'x-order': 12
      }
    }
  },
  {
    id: 'bytedance/seedance-2.0',
    name: 'seedance-2.0',
    publisher: 'ByteDance',
    description: "ByteDance's multimodal video generation model with native audio synthesis, multi-image character consistency, and high dynamic motion control.",
    category: 'Video Generation',
    status: 'Warm',
    runsCount: '956.8K runs',
    avgTime: '~45s',
    pricePerRun: '$0.05 / run',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    sampleImageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop&q=80',
    properties: {
      prompt: {
        type: 'string',
        title: 'prompt',
        widget: 'textarea',
        placeholder: 'Describe the video you want, e.g. an orange cat running through a rainy street, cinematic, shallow depth of field. Wrap dialogue in double quotes to improve audio.',
        default: '',
        help: 'Text prompt for video generation and native sound generation. Maximum 4000 characters.',
        required: true
      },
      aspect_ratio: {
        type: 'string',
        title: 'aspect_ratio',
        widget: 'select',
        options: ['16:9', '4:3', '1:1', '3:4', '9:16', '21:9', '9:21', 'adaptive'],
        enum: ['16:9', '4:3', '1:1', '3:4', '9:16', '21:9', '9:21', 'adaptive'],
        default: '16:9',
        help: 'Aspect ratio of the output video canvas.'
      },
      image: {
        type: 'file',
        title: 'image (First Frame)',
        widget: 'file',
        help: 'Optional input image for image-to-video generation (defines the opening frame).'
      },
      last_frame_image: {
        type: 'file',
        title: 'last_frame_image (End Frame)',
        widget: 'file',
        help: 'Optional target ending frame image for keyframe interpolation.'
      },
      reference_images: {
        type: 'array',
        title: 'reference_images',
        widget: 'multi-file',
        help: 'Reference images (up to 9) to maintain character face and style consistency across scene shifts.'
      },
      num_inference_steps: {
        type: 'integer',
        title: 'num_inference_steps',
        widget: 'slider',
        min: 10,
        max: 50,
        step: 1,
        default: 30,
        help: 'Number of denoising iterations. Higher steps produce crisper details at the cost of latency.'
      },
      guidance_scale: {
        type: 'number',
        title: 'guidance_scale',
        widget: 'slider',
        min: 1.0,
        max: 15.0,
        step: 0.5,
        default: 6.0,
        help: 'How strictly the diffusion model adheres to your prompt vs creative freedom.'
      },
      generate_audio: {
        type: 'boolean',
        title: 'Generate Audio',
        widget: 'boolean',
        default: true,
        help: 'Generate voices, sound effects, and background music synced to the video'
      },
      seed: {
        type: 'integer',
        title: 'seed',
        widget: 'number',
        default: 492810,
        help: 'Random seed for reproducible generations. Set to -1 or randomize for unique variations.'
      }
    }
  },
  {
    id: 'black-forest-labs/flux-1.1-pro',
    name: 'flux-1.1-pro-ultra',
    publisher: 'Black Forest Labs',
    description: 'State-of-the-art 4K photorealistic image generation model with unmatched prompt adherence, typography rendering, and optical lens precision.',
    category: 'Image Generation',
    status: 'Hot',
    runsCount: '4.2M runs',
    avgTime: '~3.2s',
    pricePerRun: '$0.02 / run',
    sampleImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80',
    properties: {
      prompt: {
        type: 'string',
        title: 'prompt',
        widget: 'textarea',
        default: 'An editorial fashion portrait of a young woman wearing a futuristic translucent raincoat in rainy London at twilight, neon street signs reflected in puddles, shot on 35mm film with shallow depth of field',
        help: 'Detailed description of the desired image scene, lighting, camera lens, and color grading.',
        required: true
      },
      aspect_ratio: {
        type: 'string',
        title: 'aspect_ratio',
        widget: 'select',
        options: ['1:1', '16:9', '9:16', '3:2', '2:3', '4:3', '3:4'],
        default: '16:9',
        help: 'Output frame geometry.'
      },
      raw_mode: {
        type: 'boolean',
        title: 'raw_mode',
        widget: 'boolean',
        default: true,
        help: 'Produce natural, unvarnished film aesthetics with authentic texture without artificial over-sharpening.'
      },
      output_quality: {
        type: 'integer',
        title: 'output_quality',
        widget: 'slider',
        min: 60,
        max: 100,
        step: 5,
        default: 95,
        help: 'JPEG/WebP encoding quality factor.'
      },
      seed: {
        type: 'integer',
        title: 'seed',
        widget: 'number',
        default: 8829103,
        help: 'Deterministic seed value.'
      }
    }
  },
  {
    id: 'google/veo-2',
    name: 'veo-2-cinematic',
    publisher: 'Google DeepMind',
    description: 'Google DeepMind 1080p cinematic video model producing continuous 60fps physics-compliant motion with camera control capabilities.',
    category: 'Video Generation',
    status: 'Warm',
    runsCount: '642.1K runs',
    avgTime: '~38s',
    pricePerRun: '$0.08 / run',
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    properties: {
      prompt: {
        type: 'string',
        title: 'prompt',
        widget: 'textarea',
        default: 'Time-lapse of a glowing cherry blossom tree blooming rapidly in a mystical mossy ancient temple courtyard, glowing fireflies swirling upwards into the twilight canopy',
        help: 'Scene description including subject motion and lighting progression.',
        required: true
      },
      camera_motion: {
        type: 'string',
        title: 'camera_motion',
        widget: 'select',
        options: ['Slow Push In', 'Orbit Right', 'Crane Up', 'Static Tripod', 'FPV Drone Flying'],
        default: 'Slow Push In',
        help: 'Direct virtual camera trajectory through 3D space.'
      },
      duration_seconds: {
        type: 'integer',
        title: 'duration_seconds',
        widget: 'slider',
        min: 4,
        max: 16,
        step: 2,
        default: 8,
        help: 'Total clip length in seconds.'
      },
      fps: {
        type: 'string',
        title: 'fps',
        widget: 'select',
        options: ['24 fps (Cinematic)', '30 fps (Standard)', '60 fps (Ultra Smooth)'],
        default: '24 fps (Cinematic)',
        help: 'Frame rate per second.'
      }
    }
  },
  {
    id: 'openai/whisper-large-v3-turbo',
    name: 'whisper-large-v3-turbo',
    publisher: 'OpenAI',
    description: 'Blazing fast multilingual speech-to-text recognition model optimized for 8x speedup with word-level timestamps and speaker detection.',
    category: 'Audio / Speech',
    status: 'Hot',
    runsCount: '8.9M runs',
    avgTime: '~1.4s',
    pricePerRun: '$0.005 / min',
    properties: {
      audio_file: {
        type: 'file',
        title: 'audio_file',
        widget: 'file',
        help: 'Upload MP3, WAV, or M4A audio file for transcription.',
        required: true
      },
      task: {
        type: 'string',
        title: 'task',
        widget: 'select',
        options: ['transcribe (Keep Original Language)', 'translate (Translate to English)'],
        default: 'transcribe (Keep Original Language)',
        help: 'Whether to transcribe in native tongue or translate directly to English.'
      },
      temperature: {
        type: 'number',
        title: 'temperature',
        widget: 'slider',
        min: 0.0,
        max: 1.0,
        step: 0.1,
        default: 0.0,
        help: 'Sampling temperature. 0.0 uses deterministic greedy decoding.'
      }
    }
  }
];
