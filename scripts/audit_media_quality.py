import os
import sys
import json
import hashlib
import subprocess

def get_ffprobe_info(filepath):
    cmd = [
        'ffprobe', '-v', 'quiet', '-print_format', 'json',
        '-show_streams', '-show_format', filepath
    ]
    try:
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=15)
        if res.returncode != 0:
            return None, res.stderr
        return json.loads(res.stdout), None
    except Exception as e:
        return None, str(e)

def inspect_all():
    base_dir = r'd:/premium-watch-store'
    img_root = os.path.join(base_dir, 'public', 'images', 'watches')
    vid_root = os.path.join(base_dir, 'public', 'videos', 'watches')
    
    # 22 official product slugs in order
    slugs = [
        'meridian-classic-gold', 'titanova-chronograph-black', 'titanova-heritage-steel',
        'titanova-royal-automatic', 'titanova-elegance-gold', 'titanova-pearl-silver',
        'titanova-rose-classic', 'titanova-luxe-black', 'titanova-smart-x1',
        'titanova-smart-pro', 'titanova-connect', 'titanova-elite-smart',
        'vanguard-diver-200', 'grid-urban-steel', 'terra-forest-automatic',
        'noir-chronograph-gold', 'helix-sport-automatic', 'aurelia-pearl-quartz',
        'marquise-gold-bangle', 'epoch-gmt-dual-time', 'atlas-titanium-chrono',
        'purity-minimal-pure'
    ]

    print("=========================================================================================")
    print("DETAILED TITANOVA MEDIA AUDIT (22 PRODUCTS)")
    print("=========================================================================================\n")

    video_hashes = {}
    video_reports = []
    image_reports = []

    for idx, slug in enumerate(slugs, 1):
        pid = f"p{idx:03d}"
        img_dir = os.path.join(img_root, slug)
        vid_path = os.path.join(vid_root, slug, 'making.mp4')

        # Check images
        views = ['front.jpg', 'back.jpg', 'side.jpg', 'top.jpg']
        img_status = {}
        for v in views:
            vp = os.path.join(img_dir, v)
            if os.path.exists(vp):
                size = os.path.getsize(vp)
                img_status[v] = {'exists': True, 'size_kb': round(size/1024, 1)}
            else:
                img_status[v] = {'exists': False, 'size_kb': 0}

        # Check video
        vid_info = {'pid': pid, 'slug': slug, 'exists': False}
        if os.path.exists(vid_path):
            vid_info['exists'] = True
            vid_size = os.path.getsize(vid_path)
            vid_info['size_kb'] = round(vid_size/1024, 1)

            # md5
            hasher = hashlib.md5()
            with open(vid_path, 'rb') as f:
                while chunk := f.read(65536):
                    hasher.update(chunk)
            md5_val = hasher.hexdigest()
            vid_info['md5'] = md5_val
            video_hashes.setdefault(md5_val, []).append(slug)

            # ffprobe
            meta, err = get_ffprobe_info(vid_path)
            if meta:
                vstream = next((s for s in meta.get('streams', []) if s.get('codec_type') == 'video'), {})
                astream = next((s for s in meta.get('streams', []) if s.get('codec_type') == 'audio'), None)
                fmt = meta.get('format', {})
                vid_info['codec'] = vstream.get('codec_name', 'unknown')
                vid_info['pix_fmt'] = vstream.get('pix_fmt', 'unknown')
                vid_info['width'] = vstream.get('width', 0)
                vid_info['height'] = vstream.get('height', 0)
                vid_info['fps'] = vstream.get('r_frame_rate', 'unknown')
                vid_info['duration'] = round(float(fmt.get('duration', 0)), 2)
                vid_info['has_audio'] = (astream is not None)
                vid_info['audio_codec'] = astream.get('codec_name') if astream else None
            else:
                vid_info['error'] = err
        else:
            vid_info['exists'] = False

        video_reports.append(vid_info)
        image_reports.append({'pid': pid, 'slug': slug, 'views': img_status})

    # Print Video Summary
    print("--- VIDEO PLAYBACK & CODEC AUDIT ---")
    print(f"{'PID':4} | {'SLUG':30} | {'EXISTS':6} | {'SIZE(KB)':8} | {'DUR(s)':6} | {'CODEC':7} | {'PIX_FMT':8} | {'RES':9} | {'FPS':6} | {'AUDIO':6} | {'MD5 (short)':10}")
    print("-" * 125)
    for v in video_reports:
        if not v['exists']:
            print(f"{v['pid']:4} | {v['slug']:30} | NO     | -        | -      | -       | -        | -         | -      | -      | -")
        elif 'error' in v:
            print(f"{v['pid']:4} | {v['slug']:30} | YES    | {v['size_kb']:8.1f} | ERR    | {v['error'][:25]}")
        else:
            print(f"{v['pid']:4} | {v['slug']:30} | YES    | {v['size_kb']:8.1f} | {v.get('duration',0):6.2f} | {v.get('codec','?'):7} | {v.get('pix_fmt','?'):8} | {v.get('width',0)}x{v.get('height',0):<4} | {v.get('fps','?'):6} | {str(v.get('has_audio',False)):6} | {v.get('md5','')[:8]}")

    print("\n--- DUPLICATE VIDEO CHECK (BY MD5) ---")
    dupes = {h: sls for h, sls in video_hashes.items() if len(sls) > 1}
    if dupes:
        print(f"WARNING: Found {len(dupes)} duplicate hash group(s):")
        for h, sls in dupes.items():
            print(f"  Hash {h[:10]}: {', '.join(sls)}")
    else:
        print("PASS: All 22 videos have distinct MD5 hashes.")

    # Image check
    print("\n--- 4-IMAGE VIEW STATUS ---")
    print(f"{'PID':4} | {'SLUG':30} | {'FRONT':10} | {'BACK':10} | {'SIDE':10} | {'TOP':10} | {'TOTAL_VIEWS':11}")
    print("-" * 95)
    for img in image_reports:
        views = img['views']
        f_s = f"{views['front.jpg']['size_kb']}k" if views['front.jpg']['exists'] else "MISSING"
        b_s = f"{views['back.jpg']['size_kb']}k" if views['back.jpg']['exists'] else "MISSING"
        s_s = f"{views['side.jpg']['size_kb']}k" if views['side.jpg']['exists'] else "MISSING"
        t_s = f"{views['top.jpg']['size_kb']}k" if views['top.jpg']['exists'] else "MISSING"
        tot = sum(1 for v in views.values() if v['exists'])
        print(f"{img['pid']:4} | {img['slug']:30} | {f_s:10} | {b_s:10} | {s_s:10} | {t_s:10} | {tot}/4 views")

    return video_reports, image_reports

if __name__ == '__main__':
    inspect_all()
