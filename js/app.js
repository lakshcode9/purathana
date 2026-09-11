/**
 * Purathana - Main Application Controller
 * Handles product rendering, variant selection, search, filters, modals & interactions
 */

window.PurathanaApp = {
  cart: null,
  quiz: null,
  assistant: null,
  selectedVariants: {}, // productId -> variantId
  activeCategory: 'all',
  activeSort: 'bestselling',
  searchQuery: '',

  init() {
    this.cart = new PurathanaCart();
    this.quiz = new PurathanaQuiz();
    this.assistant = new PurathanaAssistant();

    // Set default variant for each product
    PURATHANA_PRODUCTS.forEach(p => {
      this.selectedVariants[p.id] = p.variants[0].id;
    });

    this.renderProducts();
    this.setupEventListeners();
    this.setupStickyHeader();
  },

  // -------------------------------------------------------------------
  // PRODUCT RENDERING & INTERACTION
  // -------------------------------------------------------------------
  renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    let filtered = PURATHANA_PRODUCTS.filter(p => {
      if (this.activeCategory !== 'all' && p.category !== this.activeCategory) return false;
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || 
               p.tagline.toLowerCase().includes(q) || 
               p.nativeName.toLowerCase().includes(q) ||
               p.bestFor.toLowerCase().includes(q);
      }
      return true;
    });

    // Sorting
    if (this.activeSort === 'price-low') {
      filtered.sort((a, b) => a.variants[0].price - b.variants[0].price);
    } else if (this.activeSort === 'price-high') {
      filtered.sort((a, b) => b.variants[0].price - a.variants[0].price);
    } else if (this.activeSort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    grid.innerHTML = filtered.map((product, idx) => {
      const selectedVariantId = this.selectedVariants[product.id] || product.variants[0].id;
      const currentVariant = product.variants.find(v => v.id === selectedVariantId) || product.variants[0];
      const isRight = idx % 2 === 1;
      const currentBottleImg = (selectedVariantId === '500ml' && product.halfImage) ? product.halfImage : product.image;

      return `
        <article class="p-monument-stage ${isRight ? 'p-layout-right' : 'p-layout-left'} theme-${product.id}" 
                 id="productStage_${product.id}" 
                 data-id="${product.id}">
          
          <div class="p-monument-inner">
            <!-- 50% Screen Width: The Monumental Cutout Bottle Stage -->
            <div class="p-monument-bottle-col">
              <div class="p-monument-pedestal" id="pedestal_${product.id}">
                <!-- Radial Ambient Halo Glow -->
                <div class="p-monument-glow glow-${product.id}"></div>
                
                <!-- Dynamic Specular Glare Layer -->
                <div class="p-monument-specular-glare"></div>

                <!-- The Product Bottle Front & Back Toggle (Real Photography) -->
                <div class="p-monument-bottle-wrap" id="bottle-wrap_${product.id}" onclick="window.PurathanaApp.toggleBottleLabel('${product.id}')" style="cursor:pointer;" title="Click to view nutritional facts & back label">
                  <img src="${currentBottleImg}" 
                       alt="${product.name}" 
                       class="p-monument-bottle-img p-img-front" 
                       id="img-front_${product.id}"
                       loading="lazy" />
                  <img src="${product.backImage || product.image}" 
                       alt="${product.name} Nutritional Facts & Label" 
                       class="p-monument-bottle-img p-img-back" 
                       id="img-back_${product.id}"
                       style="display:none;" 
                       loading="lazy" />
                </div>

                <!-- Contact Shadow Beneath Bottle Base -->
                <div class="p-monument-ground-shadow"></div>

                <!-- Floating Botanical Extraction Stamp -->
                <div class="p-monument-floating-stamp">
                  <span class="p-stamp-dot"></span>
                  <span>14 RPM VAAGAI MORTAR</span>
                </div>

                <!-- Quick Label Flip Button -->
                <button type="button" 
                        class="p-monument-flip-trigger" 
                        onclick="window.PurathanaApp.toggleBottleLabel('${product.id}')"
                        title="View Nutritional Label & Facts">
                  <span id="flip-btn-text_${product.id}">View Nutritional Facts</span>
                </button>
              </div>
            </div>

            <!-- 50% Screen Width: Scroll-Revealed Premium Details -->
            <div class="p-monument-details-col">
              <div class="p-monument-details-box">
                
                <!-- Eyebrow & Reserve Badge -->
                <div class="p-monument-eyebrow-row">
                  <span class="p-monument-badge">RESERVE SELECTION · STEP 0${idx + 1}</span>
                  <span class="p-monument-smoke-tag">${product.smokePoint ? product.smokePoint.split(' ')[0] : '230°C'}</span>
                </div>

                <!-- Product Headline -->
                <h3 class="p-monument-title" onclick="window.PurathanaApp.openProductModal('${product.id}')">
                  ${product.name}
                </h3>

                <!-- Sensory Tasting Notes Banner -->
                <div class="p-monument-tasting-banner">
                  <span class="p-tasting-pill">${product.tagline}</span>
                </div>

                <!-- Origin & Purity Narrative -->
                <p class="p-monument-story">
                  ${product.description}
                </p>

                <!-- Visual Purity Badges (Zero Dense Essays) -->
                <div class="p-monument-chips-grid">
                  <div class="p-monument-chip">
                    <span class="p-chip-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    </span>
                    <div class="p-chip-text">
                      <strong>Vaagai Wood</strong>
                      <span>Friction absorbed</span>
                    </div>
                  </div>
                  <div class="p-monument-chip">
                    <span class="p-chip-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>
                    </span>
                    <div class="p-chip-text">
                      <strong>&lt; 38°C Cold</strong>
                      <span>Enzymes intact</span>
                    </div>
                  </div>
                  <div class="p-monument-chip">
                    <span class="p-chip-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </span>
                    <div class="p-chip-text">
                      <strong>0.00 PPM Hexane</strong>
                      <span>Pure mechanical press</span>
                    </div>
                  </div>
                  <div class="p-monument-chip">
                    <span class="p-chip-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 3"></path></svg>
                    </span>
                    <div class="p-chip-text">
                      <strong>Fresh Weekly</strong>
                      <span>Zero aged storage</span>
                    </div>
                  </div>
                </div>

                <!-- Hardware Spec Variant Selector (Volume & Packaging) -->
                <div class="p-monument-variant-wrap">
                  <div class="p-variant-label-row">
                    <span class="p-variant-label">SELECT VOLUME &amp; PACKAGING:</span>
                    <span class="p-variant-subtext">${currentVariant.size}</span>
                  </div>
                  <div class="p-monument-pills-row">
                    ${product.variants.map(v => {
                      const isCanister = v.id === '5L';
                      return `
                        <button type="button" 
                                class="p-monument-pill ${v.id === selectedVariantId ? 'active' : ''}" 
                                onclick="window.PurathanaApp.selectVariant('${product.id}', '${v.id}')">
                          <span class="p-pill-vname">${v.id === 'loose' ? 'Refill 1L' : (v.size.split(' ')[0] + ' ' + (v.size.split(' ')[1] || ''))}</span>
                          <span class="p-pill-vprice">· ₹${v.price}</span>
                          ${isCanister ? `<span class="p-canister-badge">BEST VALUE</span>` : ''}
                        </button>
                      `;
                    }).join('')}
                  </div>
                </div>

                <!-- Action Footer: Live Unit Economics & Add to Bag -->
                <div class="p-monument-action-bar">
                  <div class="p-monument-price-box">
                    <div class="p-monument-price">₹${currentVariant.price.toLocaleString('en-IN')}</div>
                    <span class="p-monument-tax-sub">Tax incl. · Free express courier on ₹999+</span>
                  </div>
                  <button type="button" 
                          class="p-monument-add-btn" 
                          onclick="window.PurathanaApp.addProductToCart('${product.id}')">
                    <span>Add to Bag · ₹${currentVariant.price.toLocaleString('en-IN')}</span>
                    <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                    </svg>
                  </button>
                </div>

              </div>
            </div>

            <!-- Slide-In 3D Lab Specs Drawer -->
            <div class="p-monument-lab-drawer" id="labDrawer_${product.id}">
              <div class="p-lab-drawer-top">
                <span class="p-lab-badge">NABL Certified Lab Analysis</span>
                <button type="button" class="p-lab-close" onclick="window.PurathanaApp.toggle3DFlip('${product.id}')">✕</button>
              </div>
              <div>
                <h4 style="font-family:'Marcellus',serif; font-size:1.6rem; color:#F4E8D2; margin:0 0 0.5rem;">${product.name}</h4>
                <p style="font-size:0.85rem; color:#C88732; margin:0 0 1.5rem;">Single Morning Crush · Mechanical Cold Press Purity Test</p>
                <div class="p-lab-grid">
                  <div class="p-lab-cell">
                    <span class="p-lab-val">&lt; 38°C</span>
                    <span class="p-lab-lbl">Extraction Heat</span>
                  </div>
                  <div class="p-lab-cell">
                    <span class="p-lab-val">0.00 PPM</span>
                    <span class="p-lab-lbl">Hexane Residue</span>
                  </div>
                  <div class="p-lab-cell">
                    <span class="p-lab-val">0.05%</span>
                    <span class="p-lab-lbl">Free Fatty Acids</span>
                  </div>
                  <div class="p-lab-cell">
                    <span class="p-lab-val">100%</span>
                    <span class="p-lab-lbl">Living Oil Enzymes</span>
                  </div>
                </div>
              </div>
              <div class="p-lab-cert-footer">
                <span>Batch QR Verified · Zero Bleaching</span>
                <button type="button" class="btn-primary" style="padding:0.6rem 1.25rem; font-size:0.8rem;" onclick="window.PurathanaApp.addProductToCart('${product.id}')">
                  Add ₹${currentVariant.price} to Bag
                </button>
              </div>
            </div>

          </div>
        </article>
      `;
    }).join('');

    this.initMonumentInteractions();
  },

  initMonumentInteractions() {
    // 1. Scroll-driven reveal for Monument stages
    const stages = document.querySelectorAll('.p-monument-stage');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        }
      });
    }, { threshold: 0.12 });

    stages.forEach(stage => observer.observe(stage));

    // 2. 3D Spring tilt physics for pedestals
    stages.forEach(stage => {
      const pedestal = stage.querySelector('.p-monument-pedestal');
      const bottleWrap = stage.querySelector('.p-monument-bottle-wrap');
      if (!pedestal || !bottleWrap || pedestal.dataset.tiltReady) return;
      pedestal.dataset.tiltReady = 'true';

      pedestal.addEventListener('mousemove', (e) => {
        const rect = pedestal.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        pedestal.style.setProperty('--mouse-x', `${x}px`);
        pedestal.style.setProperty('--mouse-y', `${y}px`);

        bottleWrap.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
      });

      pedestal.addEventListener('mouseleave', () => {
        bottleWrap.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      });
    });
  },

  toggleBottleLabel(productId) {
    const front = document.getElementById(`img-front_${productId}`);
    const back = document.getElementById(`img-back_${productId}`);
    const btnText = document.getElementById(`flip-btn-text_${productId}`);
    if (!front || !back) return;
    if (front.style.display === 'none') {
      front.style.display = 'block';
      back.style.display = 'none';
      if (btnText) btnText.textContent = 'View Nutritional Facts';
    } else {
      front.style.display = 'none';
      back.style.display = 'block';
      if (btnText) btnText.textContent = 'View Front Bottle';
    }
  },

  toggle3DFlip(productId) {
    const drawer = document.getElementById(`labDrawer_${productId}`);
    if (drawer) {
      drawer.classList.toggle('active');
    }
  },

  selectVariant(productId, variantId) {
    this.selectedVariants[productId] = variantId;
    this.renderProducts();
  },

  addProductToCart(productId) {
    const product = PURATHANA_PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    const variantId = this.selectedVariants[productId] || product.variants[0].id;
    this.cart.addItem(product, variantId, 1);
    this.openCart();
  },

  // -------------------------------------------------------------------
  // MODALS & DRAWERS
  // -------------------------------------------------------------------
  toggleMobileMenu() {
    const drawer = document.getElementById('mobileNavDrawer');
    if (!drawer) return;
    if (drawer.classList.contains('active')) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  },

  openMobileMenu() {
    const drawer = document.getElementById('mobileNavDrawer');
    const overlay = document.getElementById('mobileNavOverlay');
    const toggleBtn = document.getElementById('mobileMenuBtn');
    if (drawer && overlay) {
      drawer.classList.add('active');
      overlay.classList.add('active');
      if (toggleBtn) toggleBtn.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeMobileMenu() {
    const drawer = document.getElementById('mobileNavDrawer');
    const overlay = document.getElementById('mobileNavOverlay');
    const toggleBtn = document.getElementById('mobileMenuBtn');
    if (drawer && overlay) {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
      if (toggleBtn) toggleBtn.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  openAccountModal(tab = 'signin') {
    const modal = document.getElementById('patronAccountModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      this.switchAccountTab(tab);
    }
  },

  closeAccountModal() {
    const modal = document.getElementById('patronAccountModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  switchAccountTab(tab) {
    const tabs = ['signin', 'track', 'loyalty'];
    tabs.forEach(t => {
      const btn = document.getElementById(`tabBtn${t.charAt(0).toUpperCase() + t.slice(1)}`);
      const pane = document.getElementById(`patronTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
      if (btn) btn.classList.toggle('active', t === tab);
      if (pane) pane.style.display = t === tab ? 'block' : 'none';
    });
  },

  handlePatronLogin(e) {
    e.preventDefault();
    const email = document.getElementById('patronEmail')?.value || 'Patron';
    alert(`Welcome to Purathana Reserve Vault, ${email}!\nYour session is authenticated. You have full access to reserve allocations and order history.`);
    this.closeAccountModal();
  },

  handleTrackOrder(e) {
    e.preventDefault();
    const q = document.getElementById('orderTrackQuery')?.value.trim();
    const resultBox = document.getElementById('orderStatusResult');
    if (resultBox) {
      resultBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <span style="font-size:0.75rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase;">Order ${q.toUpperCase()}</span>
          <span style="background:#111613; color:#FBF9F5; font-size:0.7rem; padding:0.25rem 0.6rem; border-radius:100px; font-weight:600;">ACTIVE TRANSIT</span>
        </div>
        <div style="font-size:0.85rem; line-height:1.6; color:#111613;">
          <div><strong>Items:</strong> Wood Pressed Groundnut 1L, Black Sesame 500ml</div>
          <div><strong>Carrier:</strong> BlueDart Express Cold Chain (AWB: 8849201934)</div>
          <div><strong>Status:</strong> Dispatched fresh from Vaagai wood press facility · Delivery Expected by Tomorrow 4:00 PM</div>
        </div>
      `;
    }
  },

  openCart() {
    const overlay = document.getElementById('cartDrawerOverlay');
    const drawer = document.getElementById('cartDrawer');
    if (overlay && drawer) {
      overlay.classList.add('active');
      drawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeCart() {
    const overlay = document.getElementById('cartDrawerOverlay');
    const drawer = document.getElementById('cartDrawer');
    if (overlay && drawer) {
      overlay.classList.remove('active');
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  openProductModal(productId) {
    const product = PURATHANA_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('productDetailModal');
    const content = document.getElementById('productModalContent');
    if (!modal || !content) return;

    const selectedVariantId = this.selectedVariants[product.id] || product.variants[0].id;
    const currentVariant = product.variants.find(v => v.id === selectedVariantId) || product.variants[0];

    content.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1.2fr; gap:2.5rem; align-items:start;">
        <div style="background:#FFF; padding:1.5rem; border-radius:var(--radius-lg); border:1px solid var(--border-medium); text-align:center;">
          <img src="${product.image}" alt="${product.name}" style="max-height:380px; margin-inline:auto; object-fit:contain;" />
        </div>
        <div>
          <span class="badge-pill" style="background:var(--color-forest); color:#fff; padding:0.25rem 0.65rem; border-radius:var(--radius-full); font-size:0.75rem; font-weight:800; text-transform:uppercase;">
            ${product.badge}
          </span>
          <h2 style="font-family:var(--font-heading); font-size:2rem; color:var(--color-forest); margin-top:0.5rem; line-height:1.2;">
            ${product.name}
          </h2>
          <div style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1rem;">${product.nativeName}</div>

          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem;">
            <span class="stars-black">★★★★★</span>
            <span style="font-weight:700;">${product.rating} / 5.0</span>
            <span style="color:var(--text-muted); font-size:0.85rem;">(${product.reviewsCount} verified reviews)</span>
          </div>

          <p style="font-size:0.95rem; color:var(--text-secondary); line-height:1.6; margin-bottom:1.25rem;">
            ${product.description}
          </p>

          <div style="background:var(--bg-surface-warm); padding:1rem; border-radius:var(--radius-md); margin-bottom:1.5rem;">
            <div style="font-weight:700; font-size:0.85rem; color:var(--color-forest); margin-bottom:0.4rem;">Highlights:</div>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:0.35rem; font-size:0.85rem; color:var(--text-secondary);">
              ${product.highlights.map(h => `<li>✓ ${h}</li>`).join('')}
            </ul>
          </div>

          <div style="font-family:var(--font-seal); font-size:1.85rem; font-weight:800; color:var(--color-forest); margin-bottom:1.25rem;">
            ₹${currentVariant.price} <span style="font-size:0.85rem; color:var(--text-muted); font-weight:normal;">(${currentVariant.size})</span>
          </div>

          <button class="btn-primary" style="width:100%; justify-content:center;" onclick="window.PurathanaApp.addProductToCart('${product.id}'); window.PurathanaApp.closeProductModal();">
            Add to Cart (₹${currentVariant.price})
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closeProductModal() {
    const modal = document.getElementById('productDetailModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  // -------------------------------------------------------------------
  // CHECKOUT MODAL FLOW
  // -------------------------------------------------------------------
  openCheckout() {
    this.closeCart();
    const modal = document.getElementById('checkoutModalOverlay');
    if (!modal) return;

    const totals = this.cart.calculateTotals();
    const checkoutSummaryEl = document.getElementById('checkoutOrderSummary');
    if (checkoutSummaryEl) {
      checkoutSummaryEl.innerHTML = `
        <div style="background:var(--bg-surface-warm); padding:1rem; border-radius:var(--radius-md); font-size:0.85rem; display:flex; flex-direction:column; gap:0.4rem;">
          <div style="display:flex; justify-content:space-between;">
            <span>Items (${totals.totalCount}):</span>
            <strong>₹${totals.subtotal.toLocaleString('en-IN')}</strong>
          </div>
          ${totals.autoDiscount > 0 ? `
            <div style="display:flex; justify-content:space-between; color:#1F733C;">
              <span>Auto 20% Discount:</span>
              <strong>-₹${totals.autoDiscount.toLocaleString('en-IN')}</strong>
            </div>
          ` : ''}
          ${totals.couponDiscount > 0 ? `
            <div style="display:flex; justify-content:space-between; color:#1F733C;">
              <span>Coupon (${this.cart.appliedCoupon.code}):</span>
              <strong>-₹${totals.couponDiscount.toLocaleString('en-IN')}</strong>
            </div>
          ` : ''}
          ${totals.pointsDiscount > 0 ? `
            <div style="display:flex; justify-content:space-between; color:#1F733C;">
              <span>Reward Points:</span>
              <strong>-₹${totals.pointsDiscount.toLocaleString('en-IN')}</strong>
            </div>
          ` : ''}
          <div style="display:flex; justify-content:space-between;">
            <span>Shipping:</span>
            <strong>${totals.shippingFee === 0 ? 'FREE' : '₹' + totals.shippingFee}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; font-weight:800; font-size:1.1rem; border-top:1px solid var(--border-medium); padding-top:0.5rem; color:var(--color-forest);">
            <span>Payable Amount:</span>
            <span>₹${totals.grandTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      `;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closeCheckout() {
    const modal = document.getElementById('checkoutModalOverlay');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  confirmOrder(e) {
    if (e) e.preventDefault();
    const body = document.getElementById('checkoutBody');
    if (!body) return;

    const orderId = 'PUR-' + Math.floor(100000 + Math.random() * 900000);
    const totals = this.cart.calculateTotals();

    body.innerHTML = `
      <div style="text-align:center; padding:2rem 1rem; display:flex; flex-direction:column; align-items:center; gap:1.25rem;">
        <div style="width:72px; height:72px; border-radius:50%; background:#EAF7EE; color:#166534; font-size:2.2rem; display:flex; align-items:center; justify-content:center;">
          ✓
        </div>
        <h3 style="font-family:var(--font-heading); font-size:1.85rem; color:var(--color-forest);">
          Order Confirmed!
        </h3>
        <p style="font-size:0.95rem; color:var(--text-secondary); max-width:440px;">
          Thank you for choosing pure traditional living. Your fresh small-batch wood-pressed oil order has been registered under:
        </p>
        <div style="background:var(--bg-surface-warm); padding:0.8rem 1.5rem; border-radius:var(--radius-md); font-family:var(--font-seal); font-size:1.1rem; font-weight:800; letter-spacing:0.08em; color:var(--color-forest);">
          ${orderId}
        </div>
        <p style="font-size:0.8rem; color:var(--text-muted);">
          Integrated with Shipway &amp; Unicommerce for real-time WhatsApp &amp; SMS tracking.
        </p>
        <button class="btn-primary" onclick="window.PurathanaApp.resetOrderAndClose()">
          Continue Shopping
        </button>
      </div>
    `;

    // Clear cart
    this.cart.items = [];
    this.cart.saveCart();
    this.cart.render();
  },

  resetOrderAndClose() {
    this.closeCheckout();
    window.location.reload();
  },

  // -------------------------------------------------------------------
  // POLICY & LEGAL MODALS
  // -------------------------------------------------------------------
  openPolicy(type) {
    const modal = document.getElementById('policyModal');
    const titleEl = document.getElementById('policyTitle');
    const textEl = document.getElementById('policyBody');
    if (!modal || !titleEl || !textEl) return;

    const policies = {
      shipping: {
        title: "Shipping & Delivery Policy",
        content: `
          <p><strong>Free Express Delivery:</strong> Automatically applied on all orders above ₹999 across all serviceable pin codes in India.</p>
          <p><strong>Standard Shipping:</strong> A flat rate of ₹80 applies for orders under ₹999.</p>
          <p><strong>Fulfillment Time:</strong> All orders are packed in eco-conscious shock-resistant packaging to ensure bottle integrity and dispatched within 24 hours of fresh pressing.</p>
          <p><strong>Tracking:</strong> Real-time tracking links will be sent via SMS and WhatsApp integrated with Shipway and Delhivery.</p>
        `
      },
      returns: {
        title: "Return & Refund Policy",
        content: `
          <p><strong>7-Day Purity Guarantee:</strong> Because our products are edible pure cold-pressed oils, we accept returns or replacements in the event of bottle breakage during transit or packaging defects.</p>
          <p><strong>Hassle-Free Process:</strong> Simply click on our WhatsApp support or contact us within 48 hours of delivery with a photo of the shipment. A free replacement or 100% refund will be processed immediately via Shipway.</p>
        `
      },
      fssai: {
        title: "FSSAI Certification & Lab Purity",
        content: `
          <p><strong>100% Food Safety Certified:</strong> Purathana is fully licensed under the Food Safety and Standards Authority of India (FSSAI Lic. No: 11223344556677).</p>
          <p><strong>Zero Adulteration:</strong> Every batch is cold-pressed at ambient temperatures below 38°C without mineral oil, palm oil, or argemone oil blending.</p>
        `
      }
    };

    const sel = policies[type] || policies.shipping;
    titleEl.textContent = sel.title;
    textEl.innerHTML = sel.content;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closePolicy() {
    const modal = document.getElementById('policyModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  // -------------------------------------------------------------------
  // SOCIAL BONUS CLAIM
  // -------------------------------------------------------------------
  claimSocialBonus() {
    const newPoints = this.cart.addSocialRewardPoints();
    const btn = document.getElementById('socialBonusBtn');
    if (btn) {
      btn.innerHTML = '✓ ₹50 Points Credited!';
      btn.style.background = '#1F733C';
      btn.style.color = '#fff';
    }
    alert(`Congratulations! 50 Reward Points (worth ₹50) have been credited to your Purathana wallet! Total balance: ${newPoints} points.`);
    this.openCart();
  },

  // -------------------------------------------------------------------
  // EVENT LISTENERS & SEARCH
  // -------------------------------------------------------------------
  setupEventListeners() {
    // Filter Pills
    document.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        this.activeCategory = e.target.getAttribute('data-category');
        this.renderProducts();
      });
    });

    // Sort Dropdown
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.activeSort = e.target.value;
        this.renderProducts();
      });
    }

    // Search Trigger & Overlay
    const searchOpenBtn = document.getElementById('searchOpenBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchCloseBtn = document.getElementById('searchCloseBtn');
    const searchInput = document.getElementById('mainSearchInput');

    if (searchOpenBtn && searchOverlay) {
      searchOpenBtn.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        if (searchInput) searchInput.focus();
      });
    }

    if (searchCloseBtn && searchOverlay) {
      searchCloseBtn.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderProducts();
      });
    }

    // Coupon Apply Button in Cart Drawer
    const couponBtn = document.getElementById('applyCouponBtn');
    const couponInput = document.getElementById('couponCodeInput');
    if (couponBtn && couponInput) {
      couponBtn.addEventListener('click', () => {
        const res = this.cart.applyCoupon(couponInput.value);
        alert(res.message);
        couponInput.value = '';
      });
    }

    // Reward Points Toggle
    const pointsCheckbox = document.getElementById('applyRewardPointsCheckbox');
    if (pointsCheckbox) {
      pointsCheckbox.addEventListener('change', (e) => {
        this.cart.toggleRewardPoints(e.target.checked);
      });
    }

    // Gift Wrap Toggle
    const giftWrapCheckbox = document.getElementById('giftWrapCheckbox');
    if (giftWrapCheckbox) {
      giftWrapCheckbox.addEventListener('change', (e) => {
        this.cart.toggleGiftWrap(e.target.checked);
      });
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => {
        this.toggleMobileMenu();
      });
    }

    // Global Escape Key to close all drawers and modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
        this.closeAccountModal();
        this.closeCart();
        this.closeCheckout();
      }
    });
  },

  setupStickyHeader() {
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.site-header');
      if (header) {
        if (window.scrollY > 20) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.PurathanaApp.init();
});
