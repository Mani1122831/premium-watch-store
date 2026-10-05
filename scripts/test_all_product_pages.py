import urllib.request

base_url = 'http://localhost:5174/product'
failures = []

for i in range(1, 23):
    pid = f"p{i:03d}"
    url = f"{base_url}/{pid}"
    try:
        r = urllib.request.urlopen(url, timeout=3)
        if r.status != 200:
            failures.append((pid, f"HTTP {r.status}"))
    except Exception as e:
        failures.append((pid, str(e)))

if failures:
    print(f"FAILED ({len(failures)} product pages failed): {failures}")
else:
    print("SUCCESS: All 22 product pages (/product/p001 - /product/p022) returned HTTP 200 successfully!")
