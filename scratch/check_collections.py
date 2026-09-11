import urllib.request
import re

for path in ['/collections/cold-pressed-oils', '/collections/all']:
    url = 'https://purathana9.myshopify.com' + path
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8')
        print(f"=== {path} ===")
        # Look for images with oil or product titles
        matches = re.findall(r'<img[^>]+src="([^"]+)"[^>]*alt="([^"]*Oil[^"]*)"', html)
        for src, alt in matches[:8]:
            print(f"  Alt: {alt} -> Src: {src.split('/')[-1]}")
    except Exception as e:
        print(f"=== {path} Error: {e} ===")
