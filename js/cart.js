/**
 * Purathana - Cart & CRO Business Engine
 * Implements SOW rules:
 * 1. Free Shipping threshold @ ₹999 (Flat ₹80 if below)
 * 2. Auto 20% discount if order > ₹2999
 * 3. Single Promo code (e.g. FLAT10)
 * 4. Loyalty points (1 point = ₹1)
 * 5. Gift wrapping (+₹50)
 * 6. LocalStorage persistence
 */

const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING_FEE = 80;
const BULK_DISCOUNT_THRESHOLD = 2999;
const BULK_DISCOUNT_PERCENT = 0.20; // 20%
const GIFT_WRAP_FEE = 50;

class PurathanaCart {
  constructor() {
    this.items = this.loadCart();
    this.wishlist = this.loadWishlist();
    this.rewardPoints = parseInt(localStorage.getItem('purathana_points') || '50', 10); // default 50 welcome points
    this.pointsApplied = false;
    this.appliedCoupon = null;
    this.giftWrap = false;
    
    this.init();
  }

  loadCart() {
    try {
      return JSON.parse(localStorage.getItem('purathana_cart')) || [];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    localStorage.setItem('purathana_cart', JSON.stringify(this.items));
    localStorage.setItem('purathana_points', this.rewardPoints.toString());
  }

  loadWishlist() {
    try {
      return JSON.parse(localStorage.getItem('purathana_wishlist')) || [];
    } catch (e) {
      return [];
    }
  }

  saveWishlist() {
    localStorage.setItem('purathana_wishlist', JSON.stringify(this.wishlist));
  }

  addItem(product, variantId, qty = 1) {
    const variant = product.variants.find(v => v.id === variantId) || product.variants[0];
    const existingIndex = this.items.findIndex(
      item => item.productId === product.id && item.variantId === variant.id
    );

    if (existingIndex > -1) {
      this.items[existingIndex].qty += qty;
    } else {
      this.items.push({
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        size: variant.size,
        price: variant.price,
        image: product.image,
        qty: qty
      });
    }

    this.saveCart();
    this.render();
    this.triggerBadgePulse();
  }

  updateQty(index, delta) {
    if (!this.items[index]) return;
    this.items[index].qty += delta;
    if (this.items[index].qty <= 0) {
      this.items.splice(index, 1);
    }
    this.saveCart();
    this.render();
  }

  removeItem(index) {
    if (!this.items[index]) return;
    this.items.splice(index, 1);
    this.saveCart();
    this.render();
  }

  toggleWishlist(productId) {
    const idx = this.wishlist.indexOf(productId);
    if (idx > -1) {
      this.wishlist.splice(idx, 1);
    } else {
      this.wishlist.push(productId);
    }
    this.saveWishlist();
    this.renderWishlistUI();
  }

  applyCoupon(code) {
    const cleaned = (code || '').trim().toUpperCase();
    if (cleaned === 'FLAT10') {
      this.appliedCoupon = { code: 'FLAT10', rate: 0.10, desc: '10% Off' };
      this.render();
      return { success: true, message: 'Coupon FLAT10 applied! (10% Off)' };
    } else if (cleaned === 'PURATHANA100') {
      this.appliedCoupon = { code: 'PURATHANA100', flat: 100, desc: '₹100 Off' };
      this.render();
      return { success: true, message: 'Coupon PURATHANA100 applied! (₹100 Off)' };
    } else {
      return { success: false, message: 'Invalid coupon code. Try FLAT10' };
    }
  }

  removeCoupon() {
    this.appliedCoupon = null;
    this.render();
  }

  toggleRewardPoints(checked) {
    this.pointsApplied = checked;
    this.render();
  }

  toggleGiftWrap(checked) {
    this.giftWrap = checked;
    this.render();
  }

  addSocialRewardPoints() {
    this.rewardPoints += 50;
    this.saveCart();
    this.render();
    return this.rewardPoints;
  }

  calculateTotals() {
    const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const totalCount = this.items.reduce((sum, item) => sum + item.qty, 0);

    // Free shipping check (SOW Rule)
    const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
    const shippingFee = (subtotal === 0 || isFreeShipping) ? 0 : STANDARD_SHIPPING_FEE;
    const amountForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

    // Auto 20% Discount for orders > ₹2,999 (SOW Rule)
    let autoDiscount = 0;
    const isBulkDiscountApplied = subtotal >= BULK_DISCOUNT_THRESHOLD;
    if (isBulkDiscountApplied) {
      autoDiscount = Math.round(subtotal * BULK_DISCOUNT_PERCENT);
    }

    // Coupon discount (single coupon rule)
    let couponDiscount = 0;
    if (this.appliedCoupon) {
      if (this.appliedCoupon.rate) {
        couponDiscount = Math.round(subtotal * this.appliedCoupon.rate);
      } else if (this.appliedCoupon.flat) {
        couponDiscount = Math.min(subtotal, this.appliedCoupon.flat);
      }
    }

    // Loyalty points (1 pt = ₹1)
    let pointsDiscount = 0;
    if (this.pointsApplied && this.rewardPoints > 0) {
      const remainingAfterDiscounts = Math.max(0, subtotal - autoDiscount - couponDiscount);
      pointsDiscount = Math.min(this.rewardPoints, remainingAfterDiscounts);
    }

    // Gift wrap
    const giftWrapFee = this.giftWrap ? GIFT_WRAP_FEE : 0;

    // Final total
    const totalDiscounts = autoDiscount + couponDiscount + pointsDiscount;
    const grandTotal = Math.max(0, subtotal - totalDiscounts + shippingFee + giftWrapFee);

    return {
      subtotal,
      totalCount,
      isFreeShipping,
      shippingFee,
      amountForFreeShipping,
      shippingProgress,
      isBulkDiscountApplied,
      autoDiscount,
      couponDiscount,
      pointsDiscount,
      giftWrapFee,
      grandTotal
    };
  }

  triggerBadgePulse() {
    const badges = document.querySelectorAll('.action-badge.cart-badge');
    badges.forEach(b => {
      b.classList.remove('pulse');
      void b.offsetWidth; // trigger reflow
      b.classList.add('pulse');
    });
  }

  render() {
    const totals = this.calculateTotals();

    // 1. Update Cart Badges in Header
    const badgeEls = document.querySelectorAll('.cart-badge');
    badgeEls.forEach(el => el.textContent = totals.totalCount);

    const cartHeaderCount = document.getElementById('cartDrawerCount');
    if (cartHeaderCount) cartHeaderCount.textContent = `${totals.totalCount} items`;

    const navTotalEl = document.getElementById('navCartTotal');
    if (navTotalEl) navTotalEl.textContent = `₹${totals.grandTotal.toLocaleString('en-IN')}`;

    // 2. Free Shipping Bar Update
    const freeShipText = document.getElementById('freeShipRemainingText');
    const freeShipBar = document.getElementById('freeShipProgressFill');
    const freeShipUnlocked = document.getElementById('freeShipUnlockedMsg');

    if (freeShipBar) {
      freeShipBar.style.width = `${totals.shippingProgress}%`;
    }

    if (totals.isFreeShipping && totals.subtotal > 0) {
      if (freeShipText) freeShipText.style.display = 'none';
      if (freeShipUnlocked) {
        freeShipUnlocked.style.display = 'flex';
        freeShipUnlocked.innerHTML = '<span class="status-pill-unlocked">Complimentary Express Dispatch Unlocked</span>';
      }
    } else {
      if (freeShipText) {
        freeShipText.style.display = 'flex';
        freeShipText.innerHTML = `Add <span class="amount-left">₹${totals.amountForFreeShipping.toLocaleString('en-IN')}</span> for complimentary express dispatch`;
      }
      if (freeShipUnlocked) freeShipUnlocked.style.display = 'none';
    }

    // 3. Auto 20% Discount Banner (> ₹2999)
    const bulkBanner = document.getElementById('cartBulkBanner');
    if (bulkBanner) {
      if (totals.isBulkDiscountApplied) {
        bulkBanner.classList.add('active');
        bulkBanner.innerHTML = `<span><strong>Volume Privilege Applied:</strong> Flat 20% savings deducted at checkout (Saved ₹${totals.autoDiscount.toLocaleString('en-IN')}).</span>`;
      } else {
        bulkBanner.classList.remove('active');
        const moreForBulk = BULK_DISCOUNT_THRESHOLD - totals.subtotal;
        bulkBanner.innerHTML = `<span>Add ₹${moreForBulk.toLocaleString('en-IN')} to qualify for <strong>20% Volume Privilege</strong>.</span>`;
      }
    }

    // 4. Render Cart Items
    const container = document.getElementById('cartItemsContainer');
    const emptyState = document.getElementById('cartEmptyState');
    const cartFooter = document.getElementById('cartFooter');

    if (!container) return;

    if (this.items.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      if (cartFooter) cartFooter.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (cartFooter) cartFooter.style.display = 'flex';

    container.innerHTML = this.items.map((item, idx) => `
      <div class="cart-item-row" data-index="${idx}">
        <div class="cart-item-thumb">
          <img src="${item.image}" alt="${item.name}" />
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.name}</h4>
          <span class="cart-item-variant">${item.size}</span>
          <div class="cart-item-bottom">
            <div class="qty-control">
              <button class="qty-btn" onclick="window.PurathanaApp.cart.updateQty(${idx}, -1)" aria-label="Decrease quantity">−</button>
              <span class="qty-display">${item.qty}</span>
              <button class="qty-btn" onclick="window.PurathanaApp.cart.updateQty(${idx}, 1)" aria-label="Increase quantity">+</button>
            </div>
            <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
          </div>
        </div>
        <button class="cart-item-remove" onclick="window.PurathanaApp.cart.removeItem(${idx})" title="Remove item">✕</button>
      </div>
    `).join('');

    // 5. Update Breakdown Rows
    const subtotalEl = document.getElementById('billSubtotal');
    if (subtotalEl) subtotalEl.textContent = `₹${totals.subtotal.toLocaleString('en-IN')}`;

    const autoDiscountRow = document.getElementById('billAutoDiscountRow');
    const autoDiscountVal = document.getElementById('billAutoDiscount');
    if (autoDiscountRow && autoDiscountVal) {
      if (totals.autoDiscount > 0) {
        autoDiscountRow.style.display = 'flex';
        autoDiscountVal.textContent = `-₹${totals.autoDiscount.toLocaleString('en-IN')}`;
      } else {
        autoDiscountRow.style.display = 'none';
      }
    }

    const couponRow = document.getElementById('billCouponRow');
    const couponVal = document.getElementById('billCouponDiscount');
    if (couponRow && couponVal) {
      if (totals.couponDiscount > 0) {
        couponRow.style.display = 'flex';
        couponVal.textContent = `-₹${totals.couponDiscount.toLocaleString('en-IN')}`;
      } else {
        couponRow.style.display = 'none';
      }
    }

    const pointsRow = document.getElementById('billPointsRow');
    const pointsVal = document.getElementById('billPointsDiscount');
    if (pointsRow && pointsVal) {
      if (totals.pointsDiscount > 0) {
        pointsRow.style.display = 'flex';
        pointsVal.textContent = `-₹${totals.pointsDiscount.toLocaleString('en-IN')}`;
      } else {
        pointsRow.style.display = 'none';
      }
    }

    const shippingVal = document.getElementById('billShipping');
    if (shippingVal) {
      shippingVal.textContent = totals.shippingFee === 0 ? 'FREE' : `₹${totals.shippingFee}`;
      shippingVal.style.color = totals.shippingFee === 0 ? '#1F733C' : 'inherit';
    }

    const giftRow = document.getElementById('billGiftWrapRow');
    const giftVal = document.getElementById('billGiftWrap');
    if (giftRow && giftVal) {
      if (totals.giftWrapFee > 0) {
        giftRow.style.display = 'flex';
        giftVal.textContent = `+₹${totals.giftWrapFee}`;
      } else {
        giftRow.style.display = 'none';
      }
    }

    const grandTotalEl = document.getElementById('billGrandTotal');
    if (grandTotalEl) grandTotalEl.textContent = `₹${totals.grandTotal.toLocaleString('en-IN')}`;

    // Available Points Checkbox label
    const pointsLabelEl = document.getElementById('rewardPointsAvailable');
    if (pointsLabelEl) pointsLabelEl.textContent = `${this.rewardPoints} points (₹${this.rewardPoints})`;

    // Applied Coupon Tag UI
    const appliedCouponContainer = document.getElementById('appliedCouponWrap');
    if (appliedCouponContainer) {
      if (this.appliedCoupon) {
        appliedCouponContainer.innerHTML = `
          <span class="applied-coupon-tag">
            <span>🏷️ ${this.appliedCoupon.code} (${this.appliedCoupon.desc})</span>
            <button onclick="window.PurathanaApp.cart.removeCoupon()" style="margin-left:4px; font-weight:bold;">✕</button>
          </span>
        `;
      } else {
        appliedCouponContainer.innerHTML = '';
      }
    }
  }

  renderWishlistUI() {
    const badge = document.querySelector('.wishlist-badge');
    if (badge) badge.textContent = this.wishlist.length;

    document.querySelectorAll('.card-wishlist-btn').forEach(btn => {
      const pid = btn.getAttribute('data-product-id');
      if (this.wishlist.includes(pid)) {
        btn.classList.add('active');
        btn.innerHTML = '♥';
      } else {
        btn.classList.remove('active');
        btn.innerHTML = '♡';
      }
    });
  }

  init() {
    this.render();
    this.renderWishlistUI();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PurathanaCart;
}
