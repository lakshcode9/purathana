"""
Purathana - Automated Shopify Catalog Sync
Uses Shopify Client Credentials Grant to authenticate and sync:
- All 5 cold-pressed oils
- Pack variants: 500ml, 1L Bottle, 5L Can, Loose Oil Refill
- Real prices from Purathana pricing sheet
- High-res product bottle photos
"""

import os
import sys
import base64
import json
import urllib.request
import urllib.parse
import urllib.error

SHOP_SUBDOMAIN = "purathana9"
CLIENT_ID = os.environ.get("SHOPIFY_CLIENT_ID", "YOUR_SHOPIFY_CLIENT_ID")
CLIENT_SECRET = os.environ.get("SHOPIFY_CLIENT_SECRET", "YOUR_SHOPIFY_CLIENT_SECRET")
API_VERSION = "2024-01"

WORKSPACE_DIR = r"c:\Users\laksh\Desktop\EVERYTHINGG\Dev\Work 2.0\Purathana"

PRODUCTS_DATA = [
  {
    "title": "Cold Pressed Groundnut Oil",
    "body_html": """
      <p><strong>Rooted in Tradition, Rich in Life</strong></p>
      <p>100% pure, unrefined cold-pressed groundnut oil extracted in traditional Vaagai wood ghanis from prime Saurashtra peanuts without artificial heat (&lt; 38°C). Produced in small batches with zero old stock.</p>
      <ul>
        <li>High Smoke Point (230°C) - Perfect for everyday curries &amp; deep frying</li>
        <li>Rich in heart-healthy MUFA &amp; natural Vitamin E</li>
        <li>Zero chemical bleaching, zero hexane solvents</li>
        <li>Naturally cholesterol-free</li>
      </ul>
    """,
    "product_type": "Cold Pressed Oil",
    "vendor": "Purathana",
    "tags": "Cold Pressed, Groundnut, Wood Pressed, Fresh Batch, Daily Cooking, Bestseller",
    "image_filename": "purathana-half-groundnut.jpg",
    "variants": [
      {"size": "Half Litre Bottle (500ml)", "price": "195.00", "sku": "PUR-GND-500ML"},
      {"size": "1 Litre Bottle", "price": "380.00", "sku": "PUR-GND-1L"},
      {"size": "Loose Oil Refill (1L)", "price": "340.00", "sku": "PUR-GND-LOOSE"},
      {"size": "5 Litre Value Can", "price": "1750.00", "sku": "PUR-GND-5L"}
    ]
  },
  {
    "title": "Cold Pressed Mustard Oil",
    "body_html": """
      <p><strong>Strong, Pure, Perfect for Authentic Flavour</strong></p>
      <p>Authentic Kachi Ghani cold-pressed mustard oil with a robust natural pungency (Jhaanjh). Slowly pressed from high-grade whole black mustard seeds in fresh small batches.</p>
      <ul>
        <li>Very High Smoke Point (250°C) - The gold standard for authentic pickling</li>
        <li>Rich in Omega-3 (Alpha-Linolenic Acid) &amp; natural antioxidants</li>
        <li>Natural antibacterial &amp; digestive fire (Agni) properties</li>
        <li>Traditional Vaagai wood pressed</li>
      </ul>
    """,
    "product_type": "Cold Pressed Oil",
    "vendor": "Purathana",
    "tags": "Cold Pressed, Mustard, Kachi Ghani, Pickles, Pungent",
    "image_filename": "purathana-half-mustard.png",
    "variants": [
      {"size": "Half Litre Bottle (500ml)", "price": "198.00", "sku": "PUR-MST-500ML"},
      {"size": "1 Litre Bottle", "price": "386.00", "sku": "PUR-MST-1L"},
      {"size": "Loose Oil Refill (1L)", "price": "330.00", "sku": "PUR-MST-LOOSE"},
      {"size": "5 Litre Value Can", "price": "1790.00", "sku": "PUR-MST-5L"}
    ]
  },
  {
    "title": "Cold Pressed Coconut Oil",
    "body_html": """
      <p><strong>Pure & Natural for Skin, Hair & Health</strong></p>
      <p>Crafted from fresh, sulfur-free, sun-ripened coastal copra. Unrefined, unbleached, and chemical-free with a delicate tropical aroma.</p>
      <ul>
        <li>Abundant in Lauric Acid (Medium Chain Triglycerides)</li>
        <li>Edible &amp; cosmetic dual-grade - ideal for cooking, baby massage &amp; hair care</li>
        <li>Excellent for morning Ayurvedic oil pulling (Gandusha)</li>
        <li>100% Raw &amp; Cold Processed</li>
      </ul>
    """,
    "product_type": "Cold Pressed Oil",
    "vendor": "Purathana",
    "tags": "Cold Pressed, Coconut, Hair Care, Skin Care, Wellness, Superfood",
    "image_filename": "purathana-half-coconut.png",
    "variants": [
      {"size": "Half Litre Bottle (500ml)", "price": "380.00", "sku": "PUR-COC-500ML"},
      {"size": "1 Litre Bottle", "price": "760.00", "sku": "PUR-COC-1L"},
      {"size": "Loose Oil Refill (1L)", "price": "720.00", "sku": "PUR-COC-LOOSE"},
      {"size": "5 Litre Value Can", "price": "3900.00", "sku": "PUR-COC-5L"}
    ]
  },
  {
    "title": "Cold Pressed Sesame Oil (Gingelly)",
    "body_html": """
      <p><strong>The Ancient Superfood for Modern Living</strong></p>
      <p>Revered in Charaka Samhita as the queen of oils. Cold-pressed from select black sesame seeds in stone and vaagai wood mills with palm jaggery.</p>
      <ul>
        <li>Smoke Point 210°C - Divine for South Indian tadka, dosas &amp; podis</li>
        <li>Natural Sesamol &amp; Sesamolin antioxidants</li>
        <li>Traditional Abhyanga Ayurvedic self-massage oil</li>
        <li>Deeply grounding &amp; restorative</li>
      </ul>
    """,
    "product_type": "Cold Pressed Oil",
    "vendor": "Purathana",
    "tags": "Cold Pressed, Sesame, Gingelly, Ayurvedic, Superfood",
    "image_filename": "purathana-half-sesame.png",
    "variants": [
      {"size": "Half Litre Bottle (500ml)", "price": "245.00", "sku": "PUR-SES-500ML"},
      {"size": "1 Litre Bottle", "price": "480.00", "sku": "PUR-SES-1L"},
      {"size": "Loose Oil Refill (1L)", "price": "430.00", "sku": "PUR-SES-LOOSE"},
      {"size": "5 Litre Value Can", "price": "2260.00", "sku": "PUR-SES-5L"}
    ]
  },
  {
    "title": "Cold Pressed Sunflower Oil",
    "body_html": """
      <p><strong>Light, Healthy & Heart Friendly</strong></p>
      <p>A delightfully light, golden oil extracted gently at ambient room temperature (&lt; 38°C). Zero chemical deodorization and zero synthetic wax removal.</p>
      <ul>
        <li>Smoke Point 225°C - Clean, non-sticky cooking oil</li>
        <li>High natural Vitamin E &amp; polyunsaturated fatty acids (PUFA)</li>
        <li>Zero chemical solvents or artificial preservatives</li>
        <li>Heart-conscious family cooking</li>
      </ul>
    """,
    "product_type": "Cold Pressed Oil",
    "vendor": "Purathana",
    "tags": "Cold Pressed, Sunflower, Heart Healthy, Light, Daily Cooking",
    "image_filename": "purathana-half-sunflower.png",
    "variants": [
      {"size": "Half Litre Bottle (500ml)", "price": "195.00", "sku": "PUR-SNF-500ML"},
      {"size": "1 Litre Bottle", "price": "380.00", "sku": "PUR-SNF-1L"},
      {"size": "Loose Oil Refill (1L)", "price": "340.00", "sku": "PUR-SNF-LOOSE"},
      {"size": "5 Litre Value Can", "price": "1750.00", "sku": "PUR-SNF-5L"}
    ]
  }
]

def get_access_token():
    print(f"[*] Authenticating with Shopify via Client Credentials Grant...")
    url = f"https://{SHOP_SUBDOMAIN}.myshopify.com/admin/oauth/access_token"
    data = urllib.parse.urlencode({
        "grant_type": "client_credentials",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET
    }).encode("utf-8")

    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/x-www-form-urlencoded"})
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        token = res.get("access_token")
        print(f"[+] Access Token generated successfully (Scopes: {res.get('scope')})")
        return token

def make_shopify_request(token, endpoint, method="GET", payload=None):
    url = f"https://{SHOP_SUBDOMAIN}.myshopify.com/admin/api/{API_VERSION}/{endpoint}"
    headers = {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    data = json.dumps(payload).encode("utf-8") if payload else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

def get_base64_image(filename):
    filepath = os.path.join(WORKSPACE_DIR, filename)
    if os.path.exists(filepath):
        with open(filepath, "rb") as f:
            return base64.b64encode(f.read()).decode("utf-8")
    return None

def check_existing_products(token):
    res = make_shopify_request(token, "products.json?limit=50")
    return res.get("products", [])

def sync_catalog():
    token = get_access_token()
    
    print(f"\n[*] Checking existing products in purathana9.myshopify.com...")
    existing = check_existing_products(token)
    existing_titles = {p["title"].strip().lower(): p["id"] for p in existing}
    print(f"[i] Found {len(existing)} existing products.")

    for p in PRODUCTS_DATA:
        title_lower = p["title"].strip().lower()
        if title_lower in existing_titles:
            print(f"[~] Product '{p['title']}' already exists (ID: {existing_titles[title_lower]}). Skipping creation.")
            continue

        img_b64 = get_base64_image(p["image_filename"])
        variants_payload = []
        for v in p["variants"]:
            variants_payload.append({
                "option1": v["size"],
                "price": v["price"],
                "sku": v["sku"],
                "requires_shipping": True
            })

        product_payload = {
            "product": {
                "title": p["title"],
                "body_html": p["body_html"],
                "vendor": p["vendor"],
                "product_type": p["product_type"],
                "tags": p["tags"],
                "options": [{"name": "Pack Size"}],
                "variants": variants_payload
            }
        }

        if img_b64:
            product_payload["product"]["images"] = [
                {
                    "attachment": img_b64,
                    "filename": p["image_filename"]
                }
            ]

        print(f"\n[+] Uploading '{p['title']}'...")
        print(f"    - Variants: {', '.join([v['size'] + ' (INR ' + v['price'] + ')' for v in p['variants']])}")
        print(f"    - Attaching photo: {p['image_filename']}")
        
        try:
            created = make_shopify_request(token, "products.json", method="POST", payload=product_payload)
            prod = created.get("product", {})
            print(f"[SUCCESS] Created '{prod.get('title')}' -> Shopify Product ID: {prod.get('id')}")
        except urllib.error.HTTPError as e:
            print(f"[ERROR] Failed to upload {p['title']}: {e.code} - {e.read().decode('utf-8')}")

    print("\n=======================================================")
    print("[ALL DONE] Products, variants, pricing, and images synced!")
    print("=======================================================")

if __name__ == "__main__":
    sync_catalog()
