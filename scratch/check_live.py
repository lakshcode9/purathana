import urllib.request
import json
import re

print("--- 1. PREDICTIVE SEARCH TEST ---")
url = 'https://purathana9.myshopify.com/search/suggest.json?q=oil&resources[type]=product'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        prods = data['resources']['results']['products']
        print(f"Total search products returned: {len(prods)}")
        for p in prods:
            print("Title:", p["title"])
            print("  Search Image URL:", p.get("featured_image", {}).get("url"))
            print("  Price:", p.get("price"))
except Exception as e:
    print("Search error:", e)

print("\n--- 2. HOMEPAGE CATALOG CHECK ---")
url2 = 'https://purathana9.myshopify.com'
req2 = urllib.request.Request(url2, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req2) as resp:
        html = resp.read().decode('utf-8')
    matches = re.findall(r'<img[^>]+id="img-front-[^>]+>', html)
    for m in matches:
        print(m.strip())
except Exception as e:
    print("Catalog error:", e)
