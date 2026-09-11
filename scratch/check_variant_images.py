import urllib.request
import urllib.parse
import json

token_url = 'https://purathana9.myshopify.com/admin/oauth/access_token'
data = urllib.parse.urlencode({
    'grant_type': 'client_credentials',
    'client_id': '99ed8983a247c066ee429636438d0d50',
    'client_secret': 'YOUR_SHOPIFY_CLIENT_SECRET'
}).encode('utf-8')
req = urllib.request.Request(token_url, data=data, headers={'Content-Type': 'application/x-www-form-urlencoded'})
with urllib.request.urlopen(req) as resp:
    token = json.loads(resp.read().decode('utf-8'))['access_token']

prod_url = 'https://purathana9.myshopify.com/admin/api/2024-01/products.json?limit=50'
req2 = urllib.request.Request(prod_url, headers={'X-Shopify-Access-Token': token})
with urllib.request.urlopen(req2) as resp:
    products = json.loads(resp.read().decode('utf-8'))['products']

for p in products:
    if 'Oil' not in p['title']: continue
    print(p['title'])
    img_map = {img['id']: (img['position'], img['src'].split('/')[-1].split('?')[0]) for img in p['images']}
    for v in p['variants']:
        img_info = img_map.get(v.get('image_id'))
        print(f"  var pos {v['position']}: {v['title']} -> image_id: {v.get('image_id')} ({img_info})")
