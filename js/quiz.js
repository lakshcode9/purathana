/**
 * Purathana - "Find Your Oil" Sommelier Quiz Logic
 * Recommends optimal cold-pressed oil based on culinary style, health goals & flavor profile
 */

const QUIZ_QUESTIONS = [
  {
    id: "usage",
    question: "What is your primary culinary or wellness purpose?",
    sub: "Every oil has unique smoke points and fatty acid compositions.",
    options: [
      { id: "daily", label: "Everyday Sautéing, Dal & Curries", category: "Daily Cook", oil: "groundnut" },
      { id: "frying", label: "Deep Frying & High Heat (230°C+)", category: "High Heat", oil: "groundnut" },
      { id: "traditional", label: "South Indian Tadka, Dosa & Podi", category: "Heritage", oil: "sesame" },
      { id: "pungent", label: "Authentic Pickles & Mustard Curries", category: "Pungency", oil: "mustard" },
      { id: "wellness", label: "Hair Care, Raw Drizzle & Oil Pulling", category: "Wellness", oil: "coconut" },
      { id: "light", label: "Light, Heart-Conscious Family Diet", category: "Heart Light", oil: "sunflower" }
    ]
  },
  {
    id: "health",
    question: "What is your top health & wellness focus?",
    sub: "Cold-pressed extraction preserves key phytosterols and vitamins.",
    options: [
      { id: "heart", label: "Cardiovascular Health & Healthy Lipid Profile", category: "Heart", oil: "sunflower" },
      { id: "energy", label: "Cellular Energy, Immunity & Gut MCTs", category: "Metabolism", oil: "coconut" },
      { id: "joints", label: "Joint Strength, Bone Density & Ayurvedic Agni", category: "Ayurveda", oil: "sesame" },
      { id: "digestion", label: "Digestive Fire & Respiratory Vitality", category: "Immunity", oil: "mustard" }
    ]
  },
  {
    id: "flavor",
    question: "Which flavor profile does your family love most?",
    sub: "Because we never chemically deodorize, our oils retain their pure natural aroma.",
    options: [
      { id: "nutty", label: "Warm, Nutty & Earthy Aroma", category: "Nutty", oil: "groundnut" },
      { id: "pungent", label: "Authentic Sharp Pungency (Kachi Ghani)", category: "Jhaanjh", oil: "mustard" },
      { id: "tropical", label: "Delicate Sun-Dried Fresh Coconut Scent", category: "Aromatic", oil: "coconut" },
      { id: "neutral", label: "Clean, Ultra-Light & Non-Intrusive", category: "Light", oil: "sunflower" }
    ]
  }
];

class PurathanaQuiz {
  constructor() {
    this.currentStep = 0;
    this.answers = {};
    this.container = document.getElementById('quizContainer');
    this.init();
  }

  init() {
    this.renderStep();
  }

  selectOption(questionId, selectedOil, optionId) {
    this.answers[questionId] = selectedOil;
    
    if (this.currentStep < QUIZ_QUESTIONS.length - 1) {
      this.currentStep++;
      this.renderStep();
    } else {
      this.renderResult();
    }
  }

  goToStep(step) {
    if (step < this.currentStep) {
      this.currentStep = step;
      this.renderStep();
    }
  }

  calculateResult() {
    // Tally selected oils
    const tally = {};
    Object.values(this.answers).forEach(oil => {
      tally[oil] = (tally[oil] || 0) + 1;
    });

    let topOil = 'groundnut';
    let maxVotes = -1;
    for (const [oil, count] of Object.entries(tally)) {
      if (count > maxVotes) {
        maxVotes = count;
        topOil = oil;
      }
    }
    return topOil;
  }

  renderStep() {
    if (!this.container) return;
    const q = QUIZ_QUESTIONS[this.currentStep];

    const stepsDotsHtml = QUIZ_QUESTIONS.map((_, idx) => `
      <div class="step-dot ${idx === this.currentStep ? 'active' : ''} ${idx < this.currentStep ? 'completed' : ''}" 
           onclick="window.PurathanaApp.quiz.goToStep(${idx})">
        ${idx < this.currentStep ? '✓' : idx + 1}
      </div>
    `).join('');

    const optionsHtml = q.options.map(opt => `
      <div class="quiz-option-card" onclick="window.PurathanaApp.quiz.selectOption('${q.id}', '${opt.oil}', '${opt.id}')">
        <span class="quiz-option-category" style="font-size:0.6875rem; text-transform:uppercase; letter-spacing:0.14em; color:var(--color-amber-dark); font-weight:700; display:block; margin-bottom:0.25rem;">${opt.category}</span>
        <div>
          <div style="font-weight:700; font-size:0.95rem; color:var(--color-forest);">${opt.label}</div>
        </div>
      </div>
    `).join('');

    this.container.innerHTML = `
      <div class="quiz-steps-indicator">
        ${stepsDotsHtml}
      </div>
      <h3 class="quiz-question-title">${q.question}</h3>
      <p class="quiz-question-sub">${q.sub}</p>
      <div class="quiz-options-grid">
        ${optionsHtml}
      </div>
    `;
  }

  renderResult() {
    if (!this.container) return;
    const recommendedId = this.calculateResult();
    const product = PURATHANA_PRODUCTS.find(p => p.id === recommendedId) || PURATHANA_PRODUCTS[0];

    this.container.innerHTML = `
      <div class="quiz-result-box" style="display:block;">
        <div style="font-family:var(--font-seal); font-size:0.75rem; color:var(--color-amber-dark); letter-spacing:0.16em; text-transform:uppercase; font-weight:700; margin-bottom:0.5rem;">
          Recommended Reserve Selection
        </div>
        <h3 style="font-family:var(--font-heading); font-size:2rem; color:var(--color-forest); margin-bottom:0.5rem;">
          ${product.name}
        </h3>
        <p style="font-size:0.95rem; color:var(--text-secondary); max-width:550px; margin-inline:auto; margin-bottom:1.75rem;">
          Based on your culinary habits, ${product.name} is ideally suited. ${product.tagline} with high bioavailability and unadulterated flavor.
        </p>

        <div style="display:flex; justify-content:center; align-items:center; gap:2rem; max-width:480px; margin-inline:auto; background:var(--bg-surface-warm); padding:1.25rem 2rem; border-radius:var(--radius-lg); margin-bottom:2rem; text-align:left;">
          <img src="${product.image}" alt="${product.name}" style="width:75px; height:90px; object-fit:contain;" />
          <div>
            <div style="font-size:0.75rem; font-weight:700; color:var(--color-terracotta); text-transform:uppercase; letter-spacing:0.08em;">${product.badge}</div>
            <div style="font-weight:800; font-size:1.2rem; color:var(--color-forest);">${product.name} (1L)</div>
            <div style="font-family:var(--font-seal); font-weight:800; font-size:1.15rem; color:var(--color-forest);">₹${product.variants[0].price}</div>
          </div>
        </div>

        <div style="display:flex; justify-content:center; gap:1rem; flex-wrap:wrap;">
          <button class="btn-primary" onclick="window.PurathanaApp.cart.addItem(PURATHANA_PRODUCTS.find(p=>p.id==='${product.id}'), '${product.variants[0].id}', 1); window.PurathanaApp.openCart();">
            <span>Add to Bag · ₹${product.variants[0].price}</span>
          </button>
          <button class="btn-secondary" onclick="window.PurathanaApp.quiz.restart();">
            <span>Retake Consultation</span>
          </button>
        </div>
      </div>
    `;
  }

  restart() {
    this.currentStep = 0;
    this.answers = {};
    this.renderStep();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PurathanaQuiz;
}
