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
    api_client: 'openai-responses',
    api_mode: 'streaming',
    properties: {
      prompt: {
        type: 'string',
        title: 'Prompt',
        widget: 'textarea',
        description: 'The prompt to send to the model. Do not use if using messages.',
        default: '',
        'x-order': 0
      },
      system_prompt: {
        type: 'string',
        title: 'System Prompt',
        widget: 'textarea',
        description: "System prompt to set the assistant's behavior",
        default: '',
        target_path: 'instructions',
        'x-order': 1
      },
      messages: {
        type: 'array',
        items: { type: 'object' },
        title: 'Messages',
        widget: 'textarea',
        description: 'A JSON string representing a list of messages. For example: [{"role": "user", "content": "Hello, how are you?"}]. If provided, prompt and system_prompt are ignored.',
        default: [],
        target_path: 'input',
        'x-order': 2
      },
      image_input: {
        type: 'array',
        items: { type: 'string', format: 'uri' },
        title: 'Image Input',
        widget: 'multi-file',
        description: 'List of images to send to the model',
        default: [],
        'x-order': 3
      },
      reasoning_effort: {
        type: 'string',
        title: 'reasoning_effort',
        widget: 'select',
        enum: ['none', 'low', 'medium', 'high', 'xhigh'],
        enumNames: [
          'none',
          'low',
          'medium',
          'high',
          'xhigh'
        ],
        description: 'Constrains effort on reasoning for GPT-5.4. Supported values are none, low, medium, high, and xhigh. The default none provides fast, low-latency responses similar to GPT-4.1 in speed. Higher reasoning efforts produce more thorough answers but use more tokens and take longer. For higher reasoning efforts you may need to increase your max_completion_tokens to avoid empty responses (where all the tokens are used on reasoning).',
        default: 'none',
        target_path: 'reasoning.effort',
        'x-order': 4
      },
      verbosity: {
        type: 'string',
        title: 'verbosity',
        widget: 'select',
        enum: ['low', 'medium', 'high'],
        enumNames: [
          'low',
          'medium',
          'high'
        ],
        description: "Constrains the verbosity of the model's response. Lower values will result in more concise responses, while higher values will result in more verbose responses. Currently supported values are low, medium, and high. GPT-5 supports this parameter to help control whether answers are short and to the point or long and comprehensive.",
        default: 'medium',
        target_path: 'text.verbosity',
        'x-order': 5
      },
      max_completion_tokens: {
        type: 'integer',
        title: 'Max Completion Tokens',
        widget: 'input',
        description: 'Maximum number of completion tokens to generate. For higher reasoning efforts you may need to increase your max_completion_tokens to avoid empty responses (where all the tokens are used on reasoning).',
        default: 16384,
        placeholder: '16384',
        target_path: 'max_output_tokens',
        'x-order': 6
      }
    }
  },
  {
    id: 'openai/gpt-4o',
    name: 'gpt-4o',
    publisher: 'OpenAI',
    description: 'OpenAI 官方全能多模态旗舰模型，具备强大的跨模态理解与文本/代码推理能力，支持高达 128K 极长上下文输入与极致的实时交互响应。',
    category: 'Language Model',
    status: 'Hot',
    runsCount: '28.4M runs',
    avgTime: '~0.8s',
    pricePerRun: '$0.0025 / 1K tokens',
    properties: {
      prompt: {
        type: 'string',
        title: 'Prompt',
        widget: 'textarea',
        description: 'The prompt to send to the model. Do not use if using messages.',
        default: '',
        'x-order': 0
      },
      system_prompt: {
        type: 'string',
        title: 'System Prompt',
        widget: 'textarea',
        description: "System prompt to set the assistant's behavior",
        default: '',
        'x-order': 1
      },
      messages: {
        type: 'array',
        items: { type: 'object' },
        title: 'Messages',
        widget: 'textarea',
        description: 'A JSON string representing a list of messages. For example: [{"role": "user", "content": "Hello, how are you?"}]. If provided, prompt and system_prompt are ignored.',
        default: [],
        'x-order': 2
      },
      image_input: {
        type: 'array',
        items: { type: 'string', format: 'uri' },
        title: 'Image Input',
        widget: 'multi-file',
        description: 'List of images or visual documents to send to the multimodal model',
        default: [],
        'x-order': 3
      },
      temperature: {
        type: 'number',
        title: 'temperature',
        widget: 'slider',
        min: 0.0,
        max: 2.0,
        step: 0.1,
        default: 1.0,
        description: 'What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.',
        'x-order': 4
      },
      top_p: {
        type: 'number',
        title: 'top_p',
        widget: 'slider',
        min: 0.0,
        max: 1.0,
        step: 0.05,
        default: 1.0,
        description: 'An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass.',
        'x-order': 5
      },
      max_tokens: {
        type: 'integer',
        title: 'Max Tokens',
        widget: 'input',
        description: 'The maximum number of tokens that can be generated in the chat completion.',
        default: 4096,
        placeholder: '4096',
        'x-order': 6
      },
      response_format: {
        type: 'string',
        title: 'response_format',
        widget: 'select',
        enum: ['text', 'json_object'],
        enumNames: [
          'text',
          'json_object'
        ],
        description: 'An object specifying the format that the model must output. Setting to json_object enables JSON mode.',
        default: 'text',
        'x-order': 7
      }
    }
  },
  {
    id: 'qwen/qwen3.7-max',
    name: 'qwen3.7-max',
    publisher: 'Alibaba Cloud',
    description: '阿里云通义千问最新旗舰模型 Qwen3.7-Max，具备顶尖的深度思考、逻辑推演与长文档理解能力，支持复杂编程，API 官方兼容 OpenAI 标准接口规范。',
    category: 'Language Model',
    status: 'Hot',
    runsCount: '14.6M runs',
    avgTime: '~1.1s',
    pricePerRun: '￥0.004 / 1K tokens',
    properties: {
      prompt: {
        type: 'string',
        title: 'Prompt',
        widget: 'textarea',
        description: '单轮对话用户提示词指令。如果传入了 messages 数组参数，此字段将被忽略。',
        default: '',
        'x-order': 0
      },
      system_prompt: {
        type: 'string',
        title: 'System Prompt',
        widget: 'textarea',
        description: '系统提示词（System Role），用于设定通义千问助手的角色背景与行为规范。',
        default: '',
        'x-order': 1
      },
      messages: {
        type: 'array',
        items: { type: 'object' },
        title: 'Messages',
        widget: 'textarea',
        description: '上下文多轮对话消息列表，完全兼容 OpenAI 接口规范，格式如：[{"role": "user", "content": "你好"}]。',
        default: [],
        'x-order': 2
      },
      enable_thinking: {
        type: 'boolean',
        title: 'Enable Thinking',
        widget: 'boolean',
        description: '是否开启深度思考模式（Qwen 混合思考与推理）。开启后将在最终答案前输出完整的思维推导过程。',
        default: true,
        'x-order': 3
      },
      temperature: {
        type: 'number',
        title: 'temperature',
        widget: 'slider',
        min: 0.0,
        max: 2.0,
        step: 0.05,
        default: 0.85,
        description: '控制文本生成的随机性和多样性。取值范围 [0, 2.0)。通义千问官方建议文本生成默认取值 0.85。',
        'x-order': 4
      },
      top_p: {
        type: 'number',
        title: 'top_p',
        widget: 'slider',
        min: 0.0,
        max: 1.0,
        step: 0.05,
        default: 0.8,
        description: '核采样阈值。取值范围 (0, 1.0]。设为 0.8 时代表仅从累积概率总和达 80% 的候选词中进行采样。',
        'x-order': 5
      },
      max_tokens: {
        type: 'integer',
        title: 'Max Tokens',
        widget: 'input',
        description: '限制模型生成最终回复的最大 Token 个数。Qwen3.7-Max 单次输出支持高达 8192 或更大数量 Token。',
        default: 8192,
        placeholder: '8192',
        'x-order': 6
      },
      enable_search: {
        type: 'boolean',
        title: 'Enable Search',
        widget: 'boolean',
        description: '是否开启联网实时搜索辅助生成。开启后模型将结合实时搜索引擎检索最新网络信息以提供准确解答。',
        default: true,
        'x-order': 7
      }
    }
  },
  {
    id: 'anthropic/claude-4.5-sonnet',
    name: 'claude-4.5-sonnet',
    publisher: 'Anthropic',
    description: 'Anthropic 发布的 4.5 代智能旗舰模型（Claude 4.5 Sonnet），具备顶尖的多模态逻辑推理、精细化编程与深度分析能力，支持超长上下文与多模态解析。',
    category: 'Language Model',
    status: 'Hot',
    runsCount: '21.5M runs',
    avgTime: '~0.9s',
    pricePerRun: '$0.003 / 1K tokens',
    properties: {
      prompt: {
        type: 'string',
        title: 'Prompt',
        widget: 'textarea',
        default: '',
        description: 'Input prompt',
        'x-order': 0,
        required: true
      },
      image: {
        type: 'string',
        title: 'Image',
        format: 'uri',
        widget: 'imageselect',
        description: 'Optional input image. Images are priced as (width px * height px)/750 input tokens',
        'x-order': 1
      },
      system_prompt: {
        type: 'string',
        title: 'System Prompt',
        widget: 'textarea',
        default: '',
        description: 'System prompt',
        'x-order': 2
      },
      max_tokens: {
        type: 'integer',
        title: 'Max Tokens',
        widget: 'number',
        default: 8192,
        maximum: 64000,
        minimum: 1024,
        description: 'Maximum number of output tokens',
        'x-order': 3
      },
      max_image_resolution: {
        type: 'number',
        title: 'Max Image Resolution',
        widget: 'number',
        default: 0.5,
        maximum: 2,
        minimum: 0.001,
        description: 'Maximum image resolution in megapixels. Scales down image before sending it to Claude, to save time and money.',
        'x-order': 4
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
