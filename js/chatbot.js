/**
 * Purathana - AI Oil Sommelier & FAQ Assistant Widget
 * Answers customer questions about cold pressed benefits, smoke points, shipping & orders
 */

const BOT_KNOWLEDGE = [
  {
    triggers: ["smoke point", "deep frying", "fry", "high heat", "temp"],
    reply: "For high-heat cooking and deep frying, our **Cold Pressed Groundnut Oil** (Smoke point: 230°C) and **Mustard Oil** (250°C) are the best choices. They remain stable at high temperatures without breaking down into harmful trans-fats."
  },
  {
    triggers: ["wood pressed", "cold pressed", "process", "difference", "batch", "batches", "fresh", "stock"],
    reply: "Purathana oils are crushed in authentic Vaagai wood mortars at slow speeds (< 14 RPM) staying strictly below 38°C. We produce our oils strictly in small, fresh batches and keep zero old warehouse stock! Unlike factory refined oils, we use zero chemical solvents (hexane), no caustic soda, and no bleaching clay."
  },
  {
    triggers: ["shipping", "delivery", "free shipping", "charge", "cost"],
    reply: "We offer **Free Express Shipping** across India on all orders above ₹999! For orders under ₹999, a flat shipping fee of ₹80 applies."
  },
  {
    triggers: ["discount", "offer", "coupon", "code", "save"],
    reply: "We have two great offers active right now: \n1. Use code **FLAT10** for 10% off.\n2. Get an automatic **Flat 20% OFF** when your cart exceeds ₹2,999!"
  },
  {
    triggers: ["hair", "skin", "coconut", "face", "oil pulling"],
    reply: "Our **Cold Pressed Coconut Oil** is 100% edible and cosmetic dual-grade. It is extracted from sun-dried sulfur-free copra, rich in Lauric Acid (MCTs), making it wonderful for hair nourishment, glowing skin, and morning oil pulling."
  },
  {
    triggers: ["shelf life", "expiry", "store", "storage"],
    reply: "Purathana oils have a natural shelf life of **9 to 12 months**. Store them in a cool, dry place away from direct sunlight. Because our oils are 100% unrefined, minor natural seed sedimentation at the bottom is a sign of authentic purity!"
  },
  {
    triggers: ["reward", "points", "loyalty"],
    reply: "Every 1 Reward Point = ₹1! You can earn 50 bonus points simply by following our Instagram and Facebook pages, which can be applied directly at checkout."
  }
];

class PurathanaAssistant {
  constructor() {
    this.modal = document.getElementById('assistantModal');
    this.messagesContainer = document.getElementById('assistantMessages');
    this.input = document.getElementById('assistantInput');
    this.isOpen = false;
  }

  toggle() {
    this.isOpen = !this.isOpen;
    if (this.modal) {
      this.modal.classList.toggle('active', this.isOpen);
      if (this.isOpen && this.input) {
        setTimeout(() => this.input.focus(), 300);
      }
    }
  }

  close() {
    this.isOpen = false;
    if (this.modal) this.modal.classList.remove('active');
  }

  sendPrompt(text) {
    if (this.input) this.input.value = text;
    this.handleSend();
  }

  handleSend() {
    if (!this.input) return;
    const userText = this.input.value.trim();
    if (!userText) return;

    this.addMessage(userText, 'user');
    this.input.value = '';

    // Simulate AI thinking delay
    setTimeout(() => {
      const response = this.findAnswer(userText);
      this.addMessage(response, 'bot');
    }, 600);
  }

  findAnswer(query) {
    const q = query.toLowerCase();
    for (const item of BOT_KNOWLEDGE) {
      if (item.triggers.some(t => q.includes(t))) {
        return item.reply;
      }
    }
    return "Thank you for asking! Purathana oils are pure, unrefined, and traditionally wood-pressed without chemicals. Feel free to explore our product catalog or take our **'Find Your Oil'** quiz above to get tailored recommendations!";
  }

  addMessage(text, sender) {
    if (!this.messagesContainer) return;
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    // simple markdown bold replacer
    bubble.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    this.messagesContainer.appendChild(bubble);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PurathanaAssistant;
}
