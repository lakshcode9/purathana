import urllib.request
import urllib.parse
import json
import time

SHOP_SUBDOMAIN = "purathana9"
CLIENT_ID = "99ed8983a247c066ee429636438d0d50"
CLIENT_SECRET = "YOUR_SHOPIFY_CLIENT_SECRET"
API_VERSION = "2024-01"

def get_access_token():
    url = f"https://{SHOP_SUBDOMAIN}.myshopify.com/admin/oauth/access_token"
    data = urllib.parse.urlencode({
        "grant_type": "client_credentials",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET
    }).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/x-www-form-urlencoded"})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))["access_token"]

def api_request(token, endpoint, method="GET", payload=None):
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

def reorder_variants():
    token = get_access_token()
    prods = api_request(token, "products.json?limit=50")["products"]
    
    for p in prods:
        if "Oil" not in p["title"]:
            continue
        pid = p["id"]
        title = p["title"]
        print(f"Reordering variants for {title}...")
        
        # Sort variants: Half Litre (500ml) -> 1 Litre Bottle -> 5 Litre Value Can -> Loose Oil Refill
        def sort_key(v):
            t = v["title"].lower()
            if "500" in t or "half" in t:
                return 1
            if "1 litre" in t or "1l" in t:
                return 2
            if "5 litre" in t or "5l" in t:
                return 3
            if "loose" in t or "refill" in t:
                return 4
            return 5

        sorted_variants = sorted(p["variants"], key=sort_key)
        
        # In Shopify, updating a product with variants array re-orders them!
        variant_payloads = []
        for idx, v in enumerate(sorted_variants, 1):
            variant_payloads.append({
                "id": v["id"],
                "position": idx
            })
            
        try:
            api_request(token, f"products/{pid}.json", method="PUT", payload={
                "product": {
                    "id": pid,
                    "variants": variant_payloads
                }
            })
            print(f"  Successfully reordered {title} variants!")
            time.sleep(0.5)
        except Exception as e:
            print(f"  Error on {title}: {e}")

    # Check
    print("\n--- Current Variant Orders ---")
    prods_after = api_request(token, "products.json?limit=50")["products"]
    for p in prods_after:
        if "Oil" not in p["title"]: continue
        print(f"\n{p['title']}:")
        for v in p["variants"]:
            print(f"  pos {v['position']}: {v['title']} (₹{v['price']}) - img: {v.get('image_id')}")

if __name__ == "__main__":
    reorder_variants()
