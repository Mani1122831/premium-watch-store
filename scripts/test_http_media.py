import urllib.request
import json

base_url = 'http://localhost:5174'
backend_url = 'http://localhost:5000/api/products'

res = urllib.request.urlopen(backend_url)
data = json.loads(res.read().decode('utf-8'))
prods = data['products']

print(f"Testing HTTP media delivery for {len(prods)} products on {base_url}...")
missing_assets = []
total_checked = 0

for p in prods:
    m = p['media']
    # Check front
    total_checked += 1
    front_url = f"{base_url}{m['front']}"
    try:
        r = urllib.request.urlopen(front_url, timeout=3)
        if r.status != 200:
            missing_assets.append((p['id'], m['front'], f"Status {r.status}"))
    except Exception as e:
        missing_assets.append((p['id'], m['front'], str(e)))

    # Check back, side, top if active
    for k in ['back', 'side', 'top']:
        if m[k]:
            total_checked += 1
            url = f"{base_url}{m[k]}"
            try:
                r = urllib.request.urlopen(url, timeout=3)
                if r.status != 200:
                    missing_assets.append((p['id'], m[k], f"Status {r.status}"))
            except Exception as e:
                missing_assets.append((p['id'], m[k], str(e)))

    # Check making video if active
    if m['makingVideo']:
        total_checked += 1
        v_url = f"{base_url}{m['makingVideo']}"
        try:
            r = urllib.request.urlopen(v_url, timeout=3)
            if r.status != 200:
                missing_assets.append((p['id'], m['makingVideo'], f"Status {r.status}"))
        except Exception as e:
            missing_assets.append((p['id'], m['makingVideo'], str(e)))

print(f"Checked {total_checked} active media URLs across 22 products.")
if missing_assets:
    print(f"FAILED ({len(missing_assets)} issues):")
    for pid, path, err in missing_assets:
        print(f"  [{pid}] {path} -> {err}")
else:
    print("SUCCESS: 100% of active media assets returned HTTP 200 with zero 404 errors!")
