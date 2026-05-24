import { Tool } from "../types";

export const toolsConfig: Tool[] = [
  // Writing
  { id: "resume-builder", name: "Resume Builder", description: "Create professional resumes instantly.", category: "Writing", iconName: "FileText", isPlaceholder: false, keywords: ["cv", "job", "career", "hiring", "apply"] },
  { id: "caption-gen", name: "Caption Gen", description: "Generate catchy captions for social media.", category: "Writing", iconName: "Type", isPlaceholder: false, keywords: ["instagram", "facebook", "post", "social", "text"] },
  { id: "word-counter", name: "Word Counter", description: "Count words, characters, and reading time.", category: "Writing", iconName: "Hash", isPlaceholder: false, keywords: ["length", "count", "essay", "article", "chars", "stats", "limit"] },
  { id: "case-converter", name: "Case Converter", description: "Convert text to UPPER, lower, Title Case, etc.", category: "Writing", iconName: "Pilcrow", isPlaceholder: false, keywords: ["lowercase", "uppercase", "format", "text", "camelcase", "slug", "sentence"] },
  { id: "privacy-policy-gen", name: "Privacy Policy Gen", description: "Create standard privacy policies for apps.", category: "Writing", iconName: "Shield", isPlaceholder: false, keywords: ["legal", "gdpr", "compliance", "terms", "agreement", "website", "tos"] },
  { id: "bio-generator", name: "Bio Generator", description: "Craft the perfect bio for your profiles.", category: "Writing", iconName: "UserCircle", isPlaceholder: false, keywords: ["profile", "social", "about me", "twitter", "linkedin", "branding", "intro"] },
  
  // Tech/Dev
  { id: "qr-generator", name: "QR Generator", description: "Generate QR codes for URLs and text.", category: "Tech/Dev", iconName: "QrCode", isPlaceholder: false, keywords: ["code", "scan", "barcode", "link", "mobile", "share", "tag"] },
  { id: "json-formatter", name: "JSON Formatter", description: "Format and validate JSON payloads.", category: "Tech/Dev", iconName: "Braces", isPlaceholder: false, keywords: ["beautiful", "code", "dev", "api", "syntax", "prettier", "lint", "parse"] },
  { id: "password-gen", name: "Password Gen", description: "Generate strong, secure passwords.", category: "Tech/Dev", iconName: "Key", isPlaceholder: false, keywords: ["safety", "security", "vault", "encrypt", "protect", "secret", "random"] },
  { id: "html-preview", name: "HTML Preview", description: "Live preview your HTML code.", category: "Tech/Dev", iconName: "Code", isPlaceholder: false, keywords: ["coding", "browser", "render", "css", "js", "frontend", "sketch"] },
  { id: "base64-encoder", name: "Base64 Encoder", description: "Encode and decode Base64 strings.", category: "Tech/Dev", iconName: "Binary", isPlaceholder: false, keywords: ["binary", "data", "convert", "strings", "encode", "decode", "ascii"] },

  // Math/Finance
  { id: "gst-calc", name: "GST Calc", description: "Calculate Goods and Services Tax quickly.", category: "Math/Finance", iconName: "Calculator", isPlaceholder: false, keywords: ["tax", "money", "billing", "invoice", "finance", "vat", "indirect"] },
  { id: "age-calc", name: "Age Calc", description: "Determine exact age based on birthdate.", category: "Math/Finance", iconName: "CalendarDays", isPlaceholder: false, keywords: ["birthday", "date", "how old", "years", "calculator", "lifespan", "time"] },
  { id: "currency-converter", name: "Currency Converter", description: "Convert between world currencies.", category: "Math/Finance", iconName: "Banknote", isPlaceholder: false, keywords: ["forex", "money", "exchange", "usd", "inr", "trade", "bitcoin", "crypto"] },
  { id: "unit-converter", name: "Unit Converter", description: "Convert length, mass, volume, and more.", category: "Math/Finance", iconName: "Ruler", isPlaceholder: false, keywords: ["measurement", "metrics", "length", "weight", "cooking", "temp", "area"] },
  { id: "loan-emi-calc", name: "Loan EMI Calc", description: "Calculate monthly EMI for loans.", category: "Math/Finance", iconName: "PieChart", isPlaceholder: false, keywords: ["bank", "monthly", "payment", "mortgage", "credit", "interest", "home"] },
  { id: "percentage-calc", name: "Percentage Calc", description: "Calculate percentages and differences.", category: "Math/Finance", iconName: "Percent", isPlaceholder: false, keywords: ["math", "ratio", "score", "discount", "increase", "decrease"] },
  { id: "planet-distance", name: "Cosmic Distance", description: "Calculate distances between planets.", category: "Math/Finance", iconName: "Telescope", isPlaceholder: false, keywords: ["space", "astronomy", "planets", "solar system", "science", "astrology", "au"] },
  { id: "country-distance", name: "Range Finder", description: "Distance between any two countries.", category: "Math/Finance", iconName: "Navigation", isPlaceholder: false, keywords: ["travel", "map", "distance", "flight", "location", "world", "haversine"] },
  { id: "physics-lab", name: "Kinematics Lab", description: "Physics simulation for motion and forces.", category: "Math/Finance", iconName: "Activity", isPlaceholder: false, keywords: ["science", "physics", "motion", "gravity", "speed", "acceleration", "lab"] },
  { id: "biology-lab", name: "Bio-Sphere", description: "Interactive explore of cellular structures.", category: "Math/Finance", iconName: "Microscope", isPlaceholder: false, keywords: ["biology", "science", "cells", "dna", "life", "lab"] },
  { id: "periodic-table", name: "Element Explorer", description: "Interactive periodic table of elements.", category: "Math/Finance", iconName: "Atom", isPlaceholder: false, keywords: ["chemistry", "science", "elements", "periodic table", "molar mass", "atoms"] },

  // Images
  { id: "bg-remover", name: "BG Remover (UI)", description: "Remove backgrounds from images instantly.", category: "Images", iconName: "ImageMinus", isPlaceholder: false, keywords: ["cutout", "transparency", "png", "photo", "ai", "editing", "mask"] },
  { id: "image-resizer", name: "Image Resizer", description: "Resize and compress images for web.", category: "Images", iconName: "Image", isPlaceholder: false, keywords: ["compress", "small", "quality", "width", "height", "crop", "aspect"] },
  { id: "color-picker", name: "Color Picker", description: "Extract colors from images or choose manually.", category: "Images", iconName: "Palette", isPlaceholder: false, keywords: ["design", "hex", "rgb", "palette", "styling", "css", "color wheel"] },
  { id: "language-translator", name: "Linguist AI", description: "AI-powered language translation.", category: "Misc", iconName: "Languages", isPlaceholder: false, keywords: ["translate", "language", "voice", "speech", "text", "global", "communication"] },

  // Misc
  { id: "pomodoro-timer", name: "Pomodoro Timer", description: "Stay focused with the Pomodoro technique.", category: "Misc", iconName: "Clock", isPlaceholder: false, keywords: ["study", "work", "focus", "interval", "time", "productivity", "management"] },
  { id: "stop-watch", name: "Stop Watch", description: "Simple and accurate stopwatch.", category: "Misc", iconName: "Timer", isPlaceholder: false, keywords: ["laps", "track", "sports", "running", "timer", "clock", "seconds"] },
  { id: "metronome", name: "Metronome", description: "Keep the beat with a digital metronome.", category: "Misc", iconName: "Music", isPlaceholder: false, keywords: ["guitar", "piano", "tempo", "bpm", "music", "training", "rehearsal"] },
  { id: "typing-test", name: "Typing Test", description: "Test and improve your typing speed.", category: "Misc", iconName: "Keyboard", isPlaceholder: false, keywords: ["wpm", "speed", "accuracy", "games", "keyboard", "practice", "skills"] },
  { id: "random-name-picker", name: "Random Name Picker", description: "Pick a random winner from a list.", category: "Misc", iconName: "Dices", isPlaceholder: false, keywords: ["raffle", "giveaway", "shuffle", "winner", "contest", "lottery"] },
  { id: "random-number", name: "Number Picker", description: "Pick a random number in a custom range.", category: "Misc", iconName: "Hash", isPlaceholder: false, keywords: ["pick", "random", "generator", "range", "lottery", "math", "dices", "fair"] },
  { id: "scholar-ai", name: "Luminix AI", description: "The official intelligence of the Luminix study platform. Expert academic assistance.", category: "Misc", iconName: "GraduationCap", isPlaceholder: false, keywords: ["study", "homework", "tutor", "education", "learning", "exam", "ai", "luminix"] },
];
