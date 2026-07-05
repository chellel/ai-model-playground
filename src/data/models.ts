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
        default: 'Describe the video you want, e.g. an orange cat running through a rainy street, cinematic, shallow depth of field. Wrap dialogue in double quotes to improve audio.',
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
