/**
 * Purathana Cold Pressed Oils - Catalog Data
 * Authentic prices and pack sizes from Purathana pricing sheet
 * Half-Litre bottle images, 1L bottles, 5L cans, and eco-refills
 */

const PURATHANA_PRODUCTS = [
  {
    id: "groundnut",
    name: "Cold Pressed Groundnut Oil",
    nativeName: "मूंगफली का तेल / ಶೇಂಗಾ ಎಣ್ಣೆ",
    tagline: "Rich in taste, full of goodness.",
    badge: "Bestseller",
    category: "daily-cooking",
    color: "#E5A93C",
    accentColor: "#FFF3D6",
    smokePoint: "230°C (High Smoke Point)",
    bestFor: "Deep Frying, Sautéing, Daily Indian Curries",
    image: "./purathana-half-groundnut.jpg",
    halfImage: "./purathana-half-groundnut.jpg",
    literImage: "./purathana-groundnut-front.jpg",
    backImage: "./purathana-groundnut-back.jpg",
    rating: 4.9,
    reviewsCount: 184,
    stockLeft: 12,
    description: "Extracted in a traditional Vaagai wooden ghani from prime Saurashtra peanuts without artificial heat. Produced in fresh small batches with zero aged warehouse stock. Retains natural phytosterols, heart-healthy monounsaturated fats, and a rich, nutty aroma that elevates home cooking.",
    highlights: [
      "Rich in MUFA & Vitamin E",
      "Wood Pressed at < 38°C",
      "Zero Chemical Bleaching or Hexane",
      "Naturally Cholesterol Free"
    ],
    variants: [
      { id: "500ml", size: "Half Litre Bottle (500ml)", price: 195, perLiter: 390 },
      { id: "1L", size: "1 Litre Bottle", price: 380, perLiter: 380, popular: true },
      { id: "5L", size: "5 Litre Value Can", price: 1750, perLiter: 350, savings: "Save ₹150 (₹350/L)" },
      { id: "loose", size: "Loose Oil Refill (1L)", price: 340, perLiter: 340, badge: "Eco Refill" }
    ]
  },
  {
    id: "mustard",
    name: "Cold Pressed Mustard Oil",
    nativeName: "कच्ची घानी सरसों का तेल",
    tagline: "Bold flavour, stronger health.",
    badge: "Pungent & Potent",
    category: "traditional",
    color: "#8C4B18",
    accentColor: "#FDEED9",
    smokePoint: "250°C (Very High Smoke Point)",
    bestFor: "Pickles, North/East Indian Delicacies, Body Massage",
    image: "./purathana-half-mustard.png",
    halfImage: "./purathana-half-mustard.png",
    literImage: "./purathana-mustard-front.jpg",
    backImage: "./purathana-mustard-back.jpg",
    rating: 4.8,
    reviewsCount: 142,
    stockLeft: 9,
    description: "Authentic Kachi Ghani cold-pressed mustard oil with a robust pungency (Jhaanjh). Slowly pressed from high-grade whole mustard seeds, retaining essential allyl isothiocyanate, Omega-3 fatty acids, and natural antibacterial properties.",
    highlights: [
      "Natural Pungent Aroma (True Jhaanjh)",
      "High in Omega-3 (Alpha-Linolenic Acid)",
      "Vedic Wooden Ghani Pressed",
      "Traditional Pickling Super-Medium"
    ],
    variants: [
      { id: "500ml", size: "Half Litre Bottle (500ml)", price: 198, perLiter: 396 },
      { id: "1L", size: "1 Litre Bottle", price: 386, perLiter: 386, popular: true },
      { id: "5L", size: "5 Litre Value Can", price: 1790, perLiter: 358, savings: "Save ₹140 (₹358/L)" },
      { id: "loose", size: "Loose Oil Refill (1L)", price: 330, perLiter: 330, badge: "Eco Refill" }
    ]
  },
  {
    id: "coconut",
    name: "Cold Pressed Coconut Oil",
    nativeName: "शुद्ध नारियल तेल / ತೆಂಗಿನ ಎಣ್ಣೆ",
    tagline: "Pure by nature, perfect for you.",
    badge: "Multi-Purpose Miracle",
    category: "wellness",
    color: "#4A6B53",
    accentColor: "#EBF3EE",
    smokePoint: "177°C (Medium Smoke Point)",
    bestFor: "Raw Drizzle, South Indian Delicacies, Hair & Skin Care, Oil Pulling",
    image: "./purathana-half-coconut.png",
    halfImage: "./purathana-half-coconut.png",
    literImage: "./purathana-coconut-front.jpg",
    backImage: "./purathana-coconut-back.jpg",
    rating: 5.0,
    reviewsCount: 220,
    stockLeft: 7,
    description: "Crafted from fresh, sulfur-free, sun-ripened coastal copra. Unrefined, unbleached, and chemical-free with a delicate tropical aroma. Naturally rich in Lauric Acid (medium-chain triglycerides) for cellular immunity and radiant hair.",
    highlights: [
      "Cold Processed from Sun-Dried Copra",
      "Abundant in Lauric Acid (MCTs)",
      "Edible & Cosmetic Dual-Grade",
      "Sulfur-Free & 100% Unrefined"
    ],
    variants: [
      { id: "500ml", size: "Half Litre Bottle (500ml)", price: 380, perLiter: 760 },
      { id: "1L", size: "1 Litre Bottle", price: 760, perLiter: 760, popular: true },
      { id: "5L", size: "5 Litre Value Can", price: 3900, perLiter: 740, savings: "Save ₹100 (₹740/L)" },
      { id: "loose", size: "Loose Oil Refill (1L)", price: 720, perLiter: 720, badge: "Eco Refill" }
    ]
  },
  {
    id: "sesame",
    name: "Cold Pressed Sesame Oil (Gingelly)",
    nativeName: "तिल का तेल / ಎಳ್ಳೆಣ್ಣೆ",
    tagline: "Small seeds, big benefits.",
    badge: "Ayurvedic Elixir",
    category: "ayurvedic",
    color: "#6D2B3F",
    accentColor: "#FCEFF3",
    smokePoint: "210°C (Medium-High Smoke Point)",
    bestFor: "Tadka, Dosa Roasting, Idli Podi, Ayurvedic Abhyanga Massage",
    image: "./purathana-half-sesame.png",
    halfImage: "./purathana-half-sesame.png",
    literImage: "./purathana-sesame-front.jpg",
    backImage: "./purathana-sesame-back.jpg",
    rating: 4.9,
    reviewsCount: 168,
    stockLeft: 14,
    description: "Revered in Charaka Samhita as the premier oil for holistic health. Cold-pressed from select black sesame seeds in stone and vaagai wood mills. Natural palm jaggery is used during traditional crushing to balance bitterness naturally.",
    highlights: [
      "Natural Sesamol & Sesamolin Antioxidants",
      "Traditional Stone & Wood Crushed",
      "Zero Solvent Residuals",
      "Deeply Warming & Rejuvenating"
    ],
    variants: [
      { id: "500ml", size: "Half Litre Bottle (500ml)", price: 245, perLiter: 490 },
      { id: "1L", size: "1 Litre Bottle", price: 480, perLiter: 480, popular: true },
      { id: "5L", size: "5 Litre Value Can", price: 2260, perLiter: 452, savings: "Save ₹140 (₹452/L)" },
      { id: "loose", size: "Loose Oil Refill (1L)", price: 430, perLiter: 430, badge: "Eco Refill" }
    ]
  },
  {
    id: "sunflower",
    name: "Cold Pressed Sunflower Oil",
    nativeName: "सूरजमुखी का तेल / ಸೂರ್ಯಕಾಂತಿ ಎಣ್ಣೆ",
    tagline: "Light, healthy, heart friendly.",
    badge: "Light & Clean",
    category: "daily-cooking",
    color: "#C28518",
    accentColor: "#FFF8E7",
    smokePoint: "225°C (High Smoke Point)",
    bestFor: "Everyday Light Cooking, Baking, Salads, Stir-Frying",
    image: "./purathana-half-sunflower.png",
    halfImage: "./purathana-half-sunflower.png",
    literImage: "./purathana-sunflower-front.jpg",
    backImage: "./purathana-sunflower-back.jpg",
    rating: 4.8,
    reviewsCount: 115,
    stockLeft: 11,
    description: "A delightfully light, golden oil extracted gently at room temperature. Unlike industrial sunflower oils that undergo chemical deodorization and synthetic wax removal, Purathana preserves the natural linoleic acid and full Vitamin E spectrum.",
    highlights: [
      "Zero Chemical Deodorization",
      "High Natural Vitamin E & PUFA",
      "Neutral, Non-Sticky Texture",
      "Heart-Conscious Daily Cooking"
    ],
    variants: [
      { id: "500ml", size: "Half Litre Bottle (500ml)", price: 195, perLiter: 390 },
      { id: "1L", size: "1 Litre Bottle", price: 380, perLiter: 380, popular: true },
      { id: "5L", size: "5 Litre Value Can", price: 1750, perLiter: 350, savings: "Save ₹150 (₹350/L)" },
      { id: "loose", size: "Loose Oil Refill (1L)", price: 340, perLiter: 340, badge: "Eco Refill" }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PURATHANA_PRODUCTS;
}
