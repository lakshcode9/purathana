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
    front_img_id = None
    for img in p['images']:
        if img['position'] == 2:
            front_img_id = img['id']
    for v in p['variants']:
        t = v['title'].lower()
        if ('1 litre' in t or '1l' in t) and 'loose' not in t and 'refill' not in t:
            print(f"Setting {p['title']} 1L variant to image {front_img_id}")
            payload = {'variant': {'id': v['id'], 'image_id': front_img_id}}
            u_req = urllib.request.Request(
                f"https://purathana9.myshopify.com/admin/api/2024-01/variants/{v['id']}.json",
                data=json.dumps(payload).encode('utf-8'),
                headers={'X-Shopify-Access-Token': token, 'Content-Type': 'application/json'},
                method='PUT'
            )
            with urllib.request.urlopen(u_req) as u_resp:
                pass
        elif 'loose' in t or 'refill' in t:
            payload = {'variant': {'id': v['id'], 'image_id': None}}
            u_req = urllib.request.Request(
                f"https://purathana9.myshopify.com/admin/api/2024-01/variants/{v['id']}.json",
                data=json.dumps(payload).encode('utf-8'),
                headers={'X-Shopify-Access-Token': token, 'Content-Type': 'application/json'},
                method='PUT'
            )
            try:
                with urllib.request.urlopen(u_req) as u_resp:
                    pass
            except:
                pass
