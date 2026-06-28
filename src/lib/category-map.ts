/**
 * Category consolidation system.
 * Maps ~400+ micro-categories into ~50 major parent categories.
 * Uses pattern matching for maintainability.
 */

export interface MajorCategory {
  name: string;
  emoji: string;
  description: string;
}

/** Ordered list of ~50 major categories shown in the UI. */
export const MAJOR_CATEGORIES: MajorCategory[] = [
  { name: "AI Chatbot", emoji: "🤖", description: "AI chatbots, assistants, characters, and conversational AI tools" },
  { name: "AI Image Generator", emoji: "🎨", description: "Text-to-image, art generation, and creative image AI" },
  { name: "AI Photo Editor", emoji: "📸", description: "Photo enhancement, editing, background removal, and retouching" },
  { name: "AI Video Generator", emoji: "🎬", description: "Text-to-video, video creation, and AI-powered video production" },
  { name: "AI Video Editor", emoji: "🎥", description: "Video editing, enhancement, summarization, and effects" },
  { name: "AI Code Assistant", emoji: "💻", description: "Code generation, review, testing, and developer tools" },
  { name: "AI Writing", emoji: "✍️", description: "Copywriting, essays, blogs, and all text generation tools" },
  { name: "AI Music Generator", emoji: "🎵", description: "Music creation, vocal removal, beat generation, and audio tools" },
  { name: "AI Voice Generator", emoji: "🎙️", description: "Text-to-speech, voice cloning, transcription, and dubbing" },
  { name: "AI Design", emoji: "🎨", description: "Graphic design, logos, UI/UX, infographics, and visual design" },
  { name: "AI 3D Model", emoji: "🧊", description: "3D model generation, text-to-3D, and image-to-3D tools" },
  { name: "AI Search Engine", emoji: "🔍", description: "AI-powered search, research, and information discovery" },
  { name: "AI Marketing", emoji: "📣", description: "SEO, ad creation, email marketing, and digital marketing AI" },
  { name: "AI Social Media", emoji: "📱", description: "Social media management, content creation, and automation" },
  { name: "AI Education", emoji: "🎓", description: "Tutoring, course creation, homework help, and learning tools" },
  { name: "AI Healthcare", emoji: "🏥", description: "Medical diagnosis, therapy, mental health, and wellness AI" },
  { name: "AI Finance", emoji: "💰", description: "Investing, accounting, crypto, and financial analysis" },
  { name: "AI Productivity", emoji: "⚡", description: "Automation, scheduling, task management, and workflow tools" },
  { name: "AI Business", emoji: "🏢", description: "CRM, project management, HR, recruiting, and enterprise AI" },
  { name: "AI Translation", emoji: "🌐", description: "Language translation, localization, and language learning" },
  { name: "AI Legal", emoji: "⚖️", description: "Legal assistance, contract review, and compliance tools" },
  { name: "AI Real Estate", emoji: "🏠", description: "Property search, interior design, and real estate AI" },
  { name: "AI Data & Analytics", emoji: "📊", description: "Data analysis, visualization, predictions, and data science" },
  { name: "AI Gaming", emoji: "🎮", description: "AI games, game generation, NPCs, and interactive entertainment" },
  { name: "AI Fashion", emoji: "👗", description: "Fashion design, outfit generation, and style recommendation" },
  { name: "AI Presentation", emoji: "📊", description: "Presentation, slide, pitch deck, and report generation" },
  { name: "AI Resume & Career", emoji: "📄", description: "Resume building, cover letters, job descriptions, and interview prep" },
  { name: "AI E-commerce", emoji: "🛒", description: "Product descriptions, Shopify tools, and online retail AI" },
  { name: "AI Email", emoji: "📧", description: "Email writing, management, and communication tools" },
  { name: "AI PDF & Documents", emoji: "📑", description: "PDF editing, summarization, OCR, and document processing" },
  { name: "AI Image Recognition", emoji: "👁️", description: "Face recognition, image detection, OCR, and computer vision" },
  { name: "AI Audio Editing", emoji: "🎧", description: "Audio editing, noise cancellation, stem splitting, and enhancement" },
  { name: "AI Content Detection", emoji: "🔍", description: "AI detection, plagiarism checking, and humanizer tools" },
  { name: "AI Research", emoji: "🔬", description: "Research papers, knowledge graphs, and academic AI tools" },
  { name: "AI Shopping", emoji: "🛍️", description: "Shopping assistants, gift ideas, and product recommendations" },
  { name: "AI Travel", emoji: "✈️", description: "Trip planning, booking, and travel recommendation AI" },
  { name: "AI Food & Cooking", emoji: "🍳", description: "Recipe generation, nutrition, and cooking assistants" },
  { name: "AI Sports & Fitness", emoji: "💪", description: "Workout planning, health coaching, and sports analysis" },
  { name: "AI Entertainment", emoji: "🎭", description: "Story generation, jokes, memes, and fun AI tools" },
  { name: "AI Models & LLMs", emoji: "🧠", description: "Large language models, open-source models, and AI platforms" },
  { name: "AI Security", emoji: "🔒", description: "Cybersecurity, privacy, and data protection AI" },
  { name: "AI Agriculture", emoji: "🌾", description: "Farming, crop analysis, and agricultural AI" },
  { name: "AI Architecture", emoji: "🏗️", description: "Architecture design, floor plans, and building AI" },
  { name: "AI Customer Support", emoji: "💬", description: "Chatbot support, helpdesk, and customer service AI" },
  { name: "AI Religion & Spirituality", emoji: "🙏", description: "Religious texts, dream interpretation, and spiritual AI" },
  { name: "AI Parenting & Lifestyle", emoji: "👨‍👩‍👧", description: "Parenting, baby generators, and daily life AI" },
  { name: "AI Web3 & Blockchain", emoji: "🔗", description: "Crypto, NFT, blockchain, and decentralized AI" },
  { name: "AI Robotics", emoji: "🤖", description: "Robots, drones, and physical AI systems" },
  { name: "AI Pets & Animals", emoji: "🐱", description: "Pet-related AI tools and animal generation" },
  { name: "Other", emoji: "📦", description: "AI tools that don't fit other categories" },
];

/** Pattern-based mapping rules: [keyword patterns, major category name] */
const MAPPING_RULES: [string[], string][] = [
  // AI Chatbot & Conversation
  [["chatbot", "chat bot", "assistant", "character", "girlfriend", "boyfriend", "roleplay", "dating", "joke", "dirty talking", "rizz", "pickup", "pick-up", "dialogue", "chat generator"], "AI Chatbot"],

  // AI Image Generation (art, creative)
  [["image generator", "art generator", "image generation", "text to image", "text-to-image", "realistic image", "ai image", "ai art", "ai painting", "ai drawing", "ai sketch", "ai pixel", "anime art", "album cover", "book cover", "movie poster", "disney poster", "poster generator", "banner generator", "brochure", "thumbnail maker", "sticker generator", "pattern generator", "texture generator", "vector graphics", "storyboard", "manga generator", "comic generator", "anime generator", "illustration", "coloring book", "tattoo generator", "emoji generator", "icon generator", "face swap generator", "person generator", "selfie generator", "portrait generator", "headshot generator", "avatar generator", "cat generator", "pokemon generator", "waifu generator", "cosplay generator", "yearbook", "bikini", "disney"], "AI Image Generator"],

  // AI Photo Editor
  [["photo editor", "photo enhancer", "background remover", "image upscaler", "image enhancer", "watermark remover", "object remover", "image eraser", "expand image", "unblur", "image sharpening", "face swap", "gender swap", "age progression", "photo filter", "style transfer", "colorize", "photo restoration", "crop image", "image combiner", "inpainting", "outpainting", "qr code", "profile picture", "product photography", "image scanner", "passport photo", "image to image", "handwriting", "clothing removal", "hair color"], "AI Photo Editor"],

  // AI Video Generation
  [["video generator", "video creation", "text to video", "text-to-video", "animated video", "music video", "short video", "ugc video", "movie generator", "commercial generator", "stock video", "cartoon video", "reel generator", "avatar video", "vtuber", "youtube video", "script to video", "lip sync", "face swap video"], "AI Video Generator"],

  // AI Video Editor
  [["video editor", "video enhancer", "video search", "video summarizer", "long video", "video to video", "video upscaler", "video recording", "video translation"], "AI Video Editor"],

  // AI Code
  [["code generator", "code assistant", "developer tools", "code review", "app builder", "website builder", "api", "web scraping", "testing", "browsers", "landing page", "sql query", "github", "log management", "no-code", "low-code", "nocode"], "AI Code Assistant"],

  // AI Writing
  [["writing", "writer", "copywriting", "paraphras", "grammar", "spell check", "story generator", "text generator", "caption generator", "subtitle generator", "message generator", "blog generator", "essay writer", "rewriter", "proofreading", "script writing", "book writing", "novel", "ebook generator", "creative writing", "poem generator", "love letter", "fanfic", "inspirational quotes", "plot generator", "headline", "slogan", "sentence generator", "paragraph generator", "movie script", "report writing", "letter writer", "outline generator", "short story", "text classifier", "quotes generator", "description generator", "review generator", "job description", "cover letter", "title generator", "name generator", "newsletter generator", "prompt generator", "prompt engineering", "chat generator", "repurpose", "response generator", "reply", "cold calling", "flyer generator", "ad copy", "bio link", "bio generator", "username generator", "social link"], "AI Writing"],

  // AI Music
  [["music generator", "music production", "vocal remover", "audio editing", "stems splitter", "song generator", "mastering", "sound effect", "chord", "lyrics generator", "song cover", "audio enhancer", "audio splitter", "noise cancellation", "singing generator", "midi generator", "melody generator", "beat generator", "splitter", "rap generator", "instrumental generator", "rap lyrics", "text-to-music", "song remixer", "podcast", "recording"], "AI Music Generator"],

  // AI Voice
  [["voice generator", "text-to-speech", "voice changer", "transcription", "speech-to-text", "voice cloning", "dubbing", "voice assistants", "celebrity voice", "audio to text", "voice enhancer", "speech recognition", "speech synthesis", "voice translator", "voice over"], "AI Voice Generator"],

  // AI Design
  [["graphic design", "design generator", "design assistant", "logo generator", "infographic generator", "ux design", "fashion design", "designer", "font generator", "color palette", "mockup generator", "t shirt", "clothing generator", "hairstyle", "beauty", "website designer", "cover generator"], "AI Design"],

  // AI 3D
  [["3d model", "text to 3d", "image to 3d", "3d"], "AI 3D Model"],

  // AI Search
  [["search engine", "search tool"], "AI Search Engine"],

  // AI Marketing
  [["marketing", "seo", "ad generator", "ad creative", "advertising", "affiliate marketing", "digital marketing", "google ads", "pitch deck"], "AI Marketing"],

  // AI Social Media
  [["social media", "influencer", "youtube", "instagram", "tweet", "twitter", "tiktok", "facebook", "meme generator", "hashtag", "only fans", "onlyfans", "linkedin photo", "linkedin headshot", "model instagram", "youtube thumbnail", "youtube summary", "youtube tags"], "AI Social Media"],

  // AI Education
  [["education", "course", "homework", "flashcard", "math", "knowledge base", "language learning", "teachers", "answer", "mind mapping", "coaching", "quiz", "knowledge management", "reader", "lesson plan", "tutorial", "question generator", "knowledge graph"], "AI Education"],

  // AI Healthcare
  [["healthcare", "medical", "therapist", "mental health", "dermatology", "symptom checker", "health"], "AI Healthcare"],

  // AI Finance
  [["finance", "investing", "trading", "accounting", "crypto", "stock", "tax"], "AI Finance"],

  // AI Productivity
  [["productivity", "automation", "workflow", "scheduling", "schedule", "calendar", "task management", "monitor", "agent", "copilot", "life", "sop"], "AI Productivity"],

  // AI Business
  [["crm", "project management", "recruiting", "customer service", "interview", "call center", "product manager", "roadmap", "erp", "consulting", "business name", "business ideas", "domain name", "company name"], "AI Business"],

  // AI Translation
  [["translate", "translation", "image translator", "video translator", "voice translator"], "AI Translation"],

  // AI Legal
  [["legal", "contract review", "contract management", "contract generator"], "AI Legal"],

  // AI Real Estate & Interior
  [["real estate", "interior design", "landscape generator", "room planner", "backyard", "kitchen design", "floor plan", "outfit generator"], "AI Real Estate"],

  // AI Data
  [["data analytics", "data mining", "predictions", "research papers", "papers", "charting", "spreadsheet", "excel", "graph", "report generator", "diagram generator"], "AI Data & Analytics"],

  // AI Gaming
  [["game", "minecraft", "poker", "sports"], "AI Gaming"],

  // AI Fashion
  [["fashion"], "AI Fashion"],

  // AI Presentation
  [["presentation", "ppt", "notes generator", "note taker", "chart", "whiteboard"], "AI Presentation"],

  // AI Resume & Career
  [["resume", "jobs", "job description"], "AI Resume & Career"],

  // AI E-commerce
  [["shopify", "product description", "shopping", "gift ideas"], "AI E-commerce"],

  // AI Email
  [["email assistant", "email writer", "email generator", "email marketing"], "AI Email"],

  // AI PDF & Documents
  [["pdf", "document", "forms", "word", "scanner", "ocr", "document extraction"], "AI PDF & Documents"],

  // AI Image Recognition
  [["image recognition", "image segmentation", "face recognition", "face analyzer", "describe image", "image scanning", "image detector", "art detector", "image to prompt", "image description"], "AI Image Recognition"],

  // AI Audio (non-music, non-voice)
  [["audio editing", "audio enhancer", "audio splitter"], "AI Audio Editing"],

  // AI Content Detection
  [["content detector", "detector", "humanizer", "bypasser", "checker", "plagiarism", "undetectable", "bypass ai"], "AI Content Detection"],

  // AI Research
  [["research tool", "research"], "AI Research"],

  // AI Travel
  [["trip planner", "travel"], "AI Travel"],

  // AI Food
  [["recipe", "cooking", "nutrition", "food"], "AI Food & Cooking"],

  // AI Fitness
  [["fitness", "workout"], "AI Sports & Fitness"],

  // AI Entertainment
  [["entertainment", "news", "baby generator", "dream interpreter", "god", "parenting", "pet", "cat"], "AI Entertainment"],

  // AI Models & LLMs
  [["large language model", "llm", "open source model", "ai model"], "AI Models & LLMs"],

  // AI Security
  [["security", "privacy", "compliance"], "AI Security"],

  // AI Agriculture
  [["agriculture", "farming", "crop"], "AI Agriculture"],

  // AI Architecture
  [["architecture"], "AI Architecture"],

  // AI Customer Support
  [["customer"], "AI Customer Support"],

  // AI Religion
  [["religion", "bible", "quran"], "AI Religion & Spirituality"],

  // AI Web3
  [["web3", "nft", "blockchain"], "AI Web3 & Blockchain"],

  // AI Robotics
  [["robot"], "AI Robotics"],

  // AI News
  [["news"], "AI News"],
];

/** Cache for resolved mappings */
const _mapCache = new Map<string, string>();

/**
 * Maps any category name to its parent major category.
 * Uses pattern matching for efficiency.
 */
export function getMajorCategory(category: string): string {
  const cached = _mapCache.get(category);
  if (cached) return cached;

  const lower = category.toLowerCase().replace(/^free\s+/i, "").trim();

  for (const [patterns, parent] of MAPPING_RULES) {
    for (const pattern of patterns) {
      if (lower.includes(pattern)) {
        _mapCache.set(category, parent);
        return parent;
      }
    }
  }

  // Default: "Other"
  _mapCache.set(category, "Other");
  return "Other";
}

/**
 * Returns all sub-categories that belong to a given major category.
 * This scans all known categories (from the category-emojis data).
 */
export function getSubCategories(
  parentCategory: string,
  allCategories: Record<string, number>
): string[] {
  return Object.keys(allCategories).filter(
    (cat) => getMajorCategory(cat) === parentCategory
  );
}

/**
 * Groups a flat category count map into major categories with aggregated counts.
 */
export function groupCategories(
  categories: Record<string, number>
): { name: string; emoji: string; count: number; subCategories: string[] }[] {
  const grouped = new Map<string, { count: number; subs: string[] }>();

  for (const [cat, count] of Object.entries(categories)) {
    const major = getMajorCategory(cat);
    const entry = grouped.get(major) || { count: 0, subs: [] };
    entry.count += count;
    entry.subs.push(cat);
    grouped.set(major, entry);
  }

  return MAJOR_CATEGORIES.map((mc) => {
    const data = grouped.get(mc.name);
    return {
      name: mc.name,
      emoji: mc.emoji,
      count: data?.count || 0,
      subCategories: data?.subs || [],
    };
  }).filter((g) => g.count > 0);
}

/**
 * Returns the emoji for a major category.
 */
export function getMajorCategoryEmoji(name: string): string {
  const found = MAJOR_CATEGORIES.find((mc) => mc.name === name);
  return found?.emoji || "📦";
}