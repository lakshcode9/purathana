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

def fix_products():
    token = get_access_token()
    prods = api_request(token, "products.json?limit=50")["products"]
    
    for p in prods:
        if "Oil" not in p["title"]:
            continue
        pid = p["id"]
        title = p["title"]
        print(f"\n==========================================")
        print(f"Processing '{title}' (ID: {pid})...")
        
        # 1. Identify Images
        half_img = None
        front_img = None
        back_img = None
        
        for img in p["images"]:
            src = img["src"].lower()
            alt = (img.get("alt") or "").lower()
            if "half" in src or "half" in alt:
                half_img = img
            elif "back" in src or "back" in alt or "nutrition" in alt:
                back_img = img
            else:
                front_img = img
                
        print(f"  Images detected:")
        print(f"    - Half bottle image:  ID {half_img['id'] if half_img else 'MISSING'}")
        print(f"    - 1L front image:     ID {front_img['id'] if front_img else 'MISSING'}")
        print(f"    - Back label image:   ID {back_img['id'] if back_img else 'MISSING'}")

        # Set Half Bottle to Position 1
        if half_img:
            print(f"  Setting Half bottle image (ID: {half_img['id']}) to Position 1...")
            try:
                api_request(token, f"products/{pid}/images/{half_img['id']}.json", method="PUT", payload={
                    "image": {
                        "id": half_img["id"],
                        "position": 1
                    }
                })
                time.sleep(0.5)
            except Exception as e:
                print(f"    Error updating half_img pos: {e}")
                
        # Set 1L Front Bottle to Position 2
        if front_img:
            print(f"  Setting 1L front image (ID: {front_img['id']}) to Position 2...")
            try:
                api_request(token, f"products/{pid}/images/{front_img['id']}.json", method="PUT", payload={
                    "image": {
                        "id": front_img["id"],
                        "position": 2
                    }
                })
                time.sleep(0.5)
            except Exception as e:
                print(f"    Error updating front_img pos: {e}")

        # Set Back Label to Position 3
        if back_img:
            print(f"  Setting Back label image (ID: {back_img['id']}) to Position 3...")
            try:
                api_request(token, f"products/{pid}/images/{back_img['id']}.json", method="PUT", payload={
                    "image": {
                        "id": back_img["id"],
                        "position": 3
                    }
                })
                time.sleep(0.5)
            except Exception as e:
                print(f"    Error updating back_img pos: {e}")

        # 2. Reorder variants:
        # Desired order:
        # 1. Half Litre Bottle (500ml) -> linked to half_img
        # 2. 1 Litre Bottle -> linked to front_img
        # 3. 5 Litre Value Can
        # 4. Loose Oil Refill (1L)
        variants = p["variants"]
        var_half = None
        var_1l = None
        var_5l = None
        var_loose = None
        
        for v in variants:
            v_title = v["title"].lower()
            if "half" in v_title or "500" in v_title:
                var_half = v
            elif "1 litre" in v_title or "1l" in v_title:
                var_1l = v
            elif "5 litre" in v_title or "5l" in v_title:
                var_5l = v
            elif "loose" in v_title or "refill" in v_title:
                var_loose = v

        ordered_vars = [
            (var_half, 1, half_img["id"] if half_img else None),
            (var_1l, 2, front_img["id"] if front_img else None),
            (var_5l, 3, None),
            (var_loose, 4, None)
        ]
        
        for v_obj, target_pos, target_img_id in ordered_vars:
            if not v_obj:
                continue
            print(f"  Updating variant '{v_obj['title']}' to pos {target_pos} with image_id {target_img_id}...")
            payload = {
                "variant": {
                    "id": v_obj["id"],
                    "position": target_pos
                }
            }
            if target_img_id:
                payload["variant"]["image_id"] = target_img_id
            try:
                api_request(token, f"variants/{v_obj['id']}.json", method="PUT", payload=payload)
                time.sleep(0.5)
            except Exception as e:
                print(f"    Error updating variant {v_obj['id']}: {e}")

    print("\n[+] Verification pass:")
    prods_after = api_request(token, "products.json?limit=50")["products"]
    for p in prods_after:
        if "Oil" not in p["title"]: continue
        print(f"\nProduct: {p['title']}")
        print(f"  Featured Image: {p.get('image', {}).get('src')}")
        print("  Images:")
        for img in p["images"]:
            print(f"    - pos {img['position']}: ID {img['id']}, alt: {img.get('alt')}, src: {img['src']}")
        print("  Variants:")
        for v in p["variants"]:
            print(f"    - pos {v['position']}: {v['title']}, price: {v['price']}, image_id: {v.get('image_id')}")

if __name__ == "__main__":
    fix_products()
