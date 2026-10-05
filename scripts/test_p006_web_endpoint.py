import urllib.request

urls = [
    'http://localhost:5174/product/p006',
    'http://localhost:5174/models/watches/p006_titanova_assembly.glb',
    'http://localhost:5174/images/watches/titanova-pearl-silver/front.jpg'
]

for url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, timeout=5)
        length = res.headers.get('Content-Length', 'unknown')
        mime = res.headers.get('Content-Type', 'unknown')
        print(f"[OK] {url} -> Status {res.status} | Length: {length} bytes | Type: {mime}")
    except Exception as e:
        print(f"[FAIL] {url} -> Error: {e}")
