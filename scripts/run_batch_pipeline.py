import os
import sys
import cv2
import numpy as np
import subprocess
import imageio_ffmpeg
import json
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
PUBLIC_DIR = os.path.join(PROJECT_ROOT, 'public')
STATUS_FILE = os.path.join(PROJECT_ROOT, 'server', 'data', 'batchGenerationStatus.json')

PRODUCTS = [
    {'id': 'p001', 'slug': 'meridian-classic-gold', 'name': 'Meridian Classic Gold', 'material': '316L Stainless Steel with 18K Gold PVD coating', 'category': 'Analog'},
    {'id': 'p002', 'slug': 'titanova-chronograph-black', 'name': 'Titanova Chronograph Black', 'material': 'Black PVD Brushed Stainless Steel', 'category': 'Chronograph'},
    {'id': 'p003', 'slug': 'titanova-heritage-steel', 'name': 'Titanova Heritage Steel', 'material': 'Brushed 316L Surgical Stainless Steel', 'category': 'Minimal'},
    {'id': 'p004', 'slug': 'titanova-royal-automatic', 'name': 'Titanova Royal Automatic', 'material': '18K Gold Plated 316L Stainless Steel', 'category': 'Automatic'},
    {'id': 'p005', 'slug': 'titanova-elegance-gold', 'name': 'Titanova Elegance Gold', 'material': '18K Yellow Gold PVD Stainless Steel', 'category': 'Analog'},
    {'id': 'p006', 'slug': 'titanova-pearl-silver', 'name': 'Titanova Pearl Silver', 'material': 'Polished 316L Surgical Stainless Steel', 'category': 'Analog'},
    {'id': 'p007', 'slug': 'titanova-rose-classic', 'name': 'Titanova Rose Classic', 'material': 'Rose Gold PVD Coated Stainless Steel', 'category': 'Automatic'},
    {'id': 'p008', 'slug': 'titanova-luxe-black', 'name': 'Titanova Luxe Black', 'material': 'Surgical Stainless Steel with Obsidian PVD', 'category': 'Analog'},
    {'id': 'p009', 'slug': 'titanova-smart-x1', 'name': 'Titanova Smart X1', 'material': 'Aerospace-Grade 7000 Series Aluminium', 'category': 'Smart Watches'},
    {'id': 'p010', 'slug': 'titanova-smart-pro', 'name': 'Titanova Smart Pro', 'material': 'Titanium Bezel + DLC Coated Case', 'category': 'Smart Watches'},
    {'id': 'p011', 'slug': 'titanova-connect', 'name': 'Titanova Connect', 'material': 'Polished Aluminium Alloy Body', 'category': 'Smart Watches'},
    {'id': 'p012', 'slug': 'titanova-elite-smart', 'name': 'Titanova Elite Smart', 'material': 'Rose Gold PVD Aluminium & Ceramic Base', 'category': 'Smart Watches'},
    {'id': 'p013', 'slug': 'vanguard-diver-200', 'name': 'Vanguard Diver 200', 'material': 'Brushed 316L Stainless Steel', 'category': 'Analog'},
    {'id': 'p014', 'slug': 'grid-urban-steel', 'name': 'Grid Urban Steel', 'material': 'Brushed Stainless Steel', 'category': 'Minimal'},
    {'id': 'p015', 'slug': 'terra-forest-automatic', 'name': 'Terra Forest Automatic', 'material': '316L Satin Stainless Steel', 'category': 'Automatic'},
    {'id': 'p016', 'slug': 'noir-chronograph-gold', 'name': 'Noir Chronograph Gold', 'material': 'PVD Coated Stainless Steel', 'category': 'Chronograph'},
    {'id': 'p017', 'slug': 'helix-sport-automatic', 'name': 'Helix Sport Automatic', 'material': 'Stainless Steel & Ceramic Bezel', 'category': 'Automatic'},
    {'id': 'p018', 'slug': 'aurelia-pearl-quartz', 'name': 'Aurelia Pearl Quartz', 'material': 'Gold-plated Stainless Steel', 'category': 'Analog'},
    {'id': 'p019', 'slug': 'marquise-gold-bangle', 'name': 'Marquise Gold Bangle', 'material': '18K Gold Plated Brass & Steel', 'category': 'Analog'},
    {'id': 'p020', 'slug': 'epoch-gmt-dual-time', 'name': 'Epoch GMT Dual Time', 'material': '316L Stainless Steel', 'category': 'Analog'},
    {'id': 'p021', 'slug': 'atlas-titanium-chrono', 'name': 'Atlas Titanium Chrono', 'material': 'Grade-5 Titanium & Ceramic Bezel', 'category': 'Chronograph'},
    {'id': 'p022', 'slug': 'purity-minimal-pure', 'name': 'Purity Minimal Pure', 'material': 'Brushed 316L Stainless Steel', 'category': 'Minimal'},
]

def process_single_watch(product):
    slug = product['slug']
    name = product['name']
    material = product['material']
    
    img_dir = os.path.join(PUBLIC_DIR, 'images', 'watches', slug)
    vid_dir = os.path.join(PUBLIC_DIR, 'videos', 'watches', slug)
    os.makedirs(img_dir, exist_ok=True)
    os.makedirs(vid_dir, exist_ok=True)
    
    front_path = os.path.join(img_dir, 'front.jpg')
    back_path = os.path.join(img_dir, 'back.jpg')
    side_path = os.path.join(img_dir, 'side.jpg')
    top_path = os.path.join(img_dir, 'top.jpg')
    video_path = os.path.join(vid_dir, 'making.mp4')
    
    if not os.path.exists(front_path):
        raise FileNotFoundError(f"Missing required front.jpg for {slug}")
        
    front_img = cv2.imread(front_path)
    fh, fw = front_img.shape[:2]
    crop_size = min(fh, fw)
    sy = (fh - crop_size) // 2
    sx = (fw - crop_size) // 2
    front_sq = cv2.resize(front_img[sy:sy+crop_size, sx:sx+crop_size], (1080, 1080), interpolation=cv2.INTER_LANCZOS4)
    
    is_gold = 'gold' in material.lower() or 'gold' in name.lower()
    is_black = 'black' in material.lower() or 'black' in name.lower() or 'pvd' in material.lower() or 'dlc' in material.lower()
    is_rose = 'rose' in material.lower() or 'rose' in name.lower()
    is_titanium = 'titanium' in material.lower()
    
    if is_gold:
        base_metal = (35, 175, 225)
        specular = (120, 220, 255)
    elif is_rose:
        base_metal = (130, 140, 215)
        specular = (180, 190, 245)
    elif is_black:
        base_metal = (28, 28, 30)
        specular = (70, 70, 75)
    elif is_titanium:
        base_metal = (130, 130, 135)
        specular = (195, 195, 200)
    else: # Steel
        base_metal = (185, 185, 190)
        specular = (235, 235, 240)
        
    # 1. BACK VIEW
    if not os.path.exists(back_path):
        back_canvas = np.zeros((1080, 1080, 3), dtype=np.uint8)
        for y in range(1080):
            val = int(10 + 10 * (y / 1080.0))
            back_canvas[y, :] = (val, val, val + 2)
            
        center = (540, 540)
        radius = 330
        strap_width = 180
        strap_color = (18, 18, 20) if is_black else ((25, 45, 70) if is_gold else (35, 35, 38))
        
        cv2.rectangle(back_canvas, (540 - strap_width//2, 80), (540 + strap_width//2, 280), strap_color, -1)
        cv2.rectangle(back_canvas, (540 - strap_width//2, 800), (540 + strap_width//2, 1000), strap_color, -1)
        
        for r in range(radius, radius - 45, -1):
            factor = (r - (radius - 45)) / 45.0
            c = [int(base_metal[i] * (0.7 + 0.3 * factor)) for i in range(3)]
            cv2.circle(back_canvas, center, r, c, 1)
            
        for i in range(6):
            ang = i * (2 * np.pi / 6)
            sx_pos = int(center[0] + (radius - 22) * np.cos(ang))
            sy_pos = int(center[1] + (radius - 22) * np.sin(ang))
            cv2.circle(back_canvas, (sx_pos, sy_pos), 7, (15, 15, 18), -1)
            cv2.circle(back_canvas, (sx_pos, sy_pos), 6, specular, 1)
            cv2.line(back_canvas, (sx_pos - 3, sy_pos), (sx_pos + 3, sy_pos), (10, 10, 10), 1)
            
        inner_r = radius - 55
        cv2.circle(back_canvas, center, inner_r, (12, 12, 15), -1)
        axes = (inner_r - 25, inner_r - 25)
        rotor_c = (25, 165, 215) if (is_gold or not is_black) else (70, 75, 80)
        cv2.ellipse(back_canvas, center, axes, 0, 0, 180, rotor_c, -1)
        cv2.circle(back_canvas, center, 26, (180, 180, 185), -1)
        cv2.circle(back_canvas, center, 12, (45, 30, 180), -1)
        cv2.ellipse(back_canvas, center, (inner_r - 5, inner_r - 5), 45, 0, 85, (255, 255, 255), 2)
        
        text_c = (15, 15, 20) if not is_black else (160, 160, 165)
        cv2.putText(back_canvas, "TITANOVA ATELIER", (540 - 130, 540 - 240), cv2.FONT_HERSHEY_DUPLEX, 0.65, text_c, 1, cv2.LINE_AA)
        cv2.putText(back_canvas, name.upper(), (540 - 140, 540 - 170), cv2.FONT_HERSHEY_SIMPLEX, 0.52, text_c, 1, cv2.LINE_AA)
        cv2.putText(back_canvas, "SWISS CALIBRE • 50M WATER RESISTANT", (540 - 170, 540 + 260), cv2.FONT_HERSHEY_SIMPLEX, 0.48, text_c, 1, cv2.LINE_AA)
        
        cv2.imwrite(back_path, back_canvas, [int(cv2.IMWRITE_JPEG_QUALITY), 95])
        
    # 2. SIDE VIEW
    if not os.path.exists(side_path):
        side_canvas = np.zeros((1080, 1080, 3), dtype=np.uint8)
        for y in range(1080):
            val = int(8 + 12 * (y / 1080.0))
            side_canvas[y, :] = (val, val, val + 2)
            
        cy = 540
        cv2.rectangle(side_canvas, (80, cy - 14), (320, cy + 14), (20, 20, 24), -1)
        cv2.rectangle(side_canvas, (760, cy - 14), (1000, cy + 14), (20, 20, 24), -1)
        
        pts = np.array([
            [300, cy + 28], [340, cy + 38], [740, cy + 38], [780, cy + 28],
            [770, cy - 25], [730, cy - 35], [350, cy - 35], [310, cy - 25],
        ], np.int32)
        cv2.fillPoly(side_canvas, [pts], base_metal)
        
        cv2.ellipse(side_canvas, (540, cy - 35), (200, 35), 0, 180, 360, (230, 245, 255), -1)
        cv2.ellipse(side_canvas, (540, cy - 35), (198, 33), 0, 180, 360, (15, 20, 28), -1)
        cv2.ellipse(side_canvas, (540, cy - 35), (196, 32), 0, 210, 270, (255, 255, 255), 2)
        
        crown_color = [int(c * 1.05) for c in base_metal]
        cv2.rectangle(side_canvas, (780, cy - 18), (820, cy + 18), crown_color, -1)
        for gy in range(cy - 16, cy + 18, 5):
            cv2.line(side_canvas, (782, gy), (818, gy), (15, 15, 18), 1)
        cv2.putText(side_canvas, "T", (802, cy + 6), cv2.FONT_HERSHEY_DUPLEX, 0.45, (10, 10, 12), 1, cv2.LINE_AA)
        
        reflection_h = 240
        refl_slice = cv2.flip(side_canvas[cy - 60:cy + 50, :], 0)
        refl_slice = cv2.resize(refl_slice, (1080, reflection_h))
        for ry in range(reflection_h):
            alpha = (1.0 - (ry / float(reflection_h))) * 0.25
            side_canvas[cy + 40 + ry, :] = cv2.addWeighted(refl_slice[ry, :], alpha, side_canvas[cy + 40 + ry, :], 1.0 - alpha, 0)
            
        cv2.imwrite(side_path, side_canvas, [int(cv2.IMWRITE_JPEG_QUALITY), 95])
        
    # 3. TOP / ANGLED VIEW
    if not os.path.exists(top_path):
        top_canvas = np.zeros((1080, 1080, 3), dtype=np.uint8)
        for y in range(1080):
            val = int(14 + 10 * (y / 1080.0))
            top_canvas[y, :] = (val, val, val + 2)
            
        src_pts = np.float32([[140, 140], [940, 140], [940, 940], [140, 940]])
        dst_pts = np.float32([[260, 200], [860, 130], [820, 880], [220, 810]])
        matrix = cv2.getPerspectiveTransform(src_pts, dst_pts)
        warped = cv2.warpPerspective(front_sq, matrix, (1080, 1080), borderMode=cv2.BORDER_CONSTANT, borderValue=(0,0,0))
        
        gray = cv2.cvtColor(warped, cv2.COLOR_BGR2GRAY)
        _, mask = cv2.threshold(gray, 5, 255, cv2.THRESH_BINARY)
        mask_inv = cv2.bitwise_not(mask)
        
        bg_part = cv2.bitwise_and(top_canvas, top_canvas, mask=mask_inv)
        fg_part = cv2.bitwise_and(warped, warped, mask=mask)
        top_canvas = cv2.add(bg_part, fg_part)
        cv2.line(top_canvas, (260, 200), (860, 130), specular, 2, cv2.LINE_AA)
        
        cv2.imwrite(top_path, top_canvas, [int(cv2.IMWRITE_JPEG_QUALITY), 95])

    # 4. EXPLODED ASSEMBLY VIDEO
    if not os.path.exists(video_path):
        width, height = 1080, 1080
        fps = 30
        duration_sec = 9.0
        total_frames = int(duration_sec * fps)
        
        exploded_img = np.zeros((1080, 1080, 3), dtype=np.uint8)
        for y in range(1080):
            val = int(8 + 8 * (y / 1080.0))
            exploded_img[y, :] = (val, val, val + 2)
            
        cv2.line(exploded_img, (540, 80), (540, 1000), (25, 140, 190), 1, cv2.LINE_AA)
        
        layers = [
            ("SAPPHIRE CRYSTAL", 160, (230, 245, 255), 180, 35),
            ("BEVELED BEZEL", 280, base_metal, 170, 32),
            ("DAUPHINE HANDS", 400, (240, 240, 245), 90, 20),
            ("GUILLOCHE DIAL", 510, (40, 45, 55), 160, 30),
            ("SWISS CALIBRE", 630, (25, 160, 210), 150, 28),
            ("MIDDLE CASE & CROWN", 750, base_metal, 175, 34),
            ("EXHIBITION CASEBACK", 870, base_metal, 165, 30),
        ]
        for label, ly, col, rx, ry in layers:
            cv2.ellipse(exploded_img, (540, ly), (rx, ry), 0, 0, 360, col, 2, cv2.LINE_AA)
            cv2.circle(exploded_img, (540, ly), 5, specular, -1)
            cv2.line(exploded_img, (540 + rx, ly), (540 + rx + 30, ly), (20, 140, 190), 1)
            cv2.putText(exploded_img, label, (540 + rx + 35, ly + 4), cv2.FONT_HERSHEY_DUPLEX, 0.42, (200, 200, 205), 1, cv2.LINE_AA)
            
        keyframes = [
            (front_sq, "01/05  PHASE 1 • COMPLETE TIMEPIECE FOUNDATION"),
            (exploded_img, "02/05  PHASE 2 • AXIAL EXPLODED VIEW CALIBRATION"),
            (cv2.imread(back_path), "03/05  PHASE 3 • COMPONENT ARCHITECTURE & ROTOR"),
            (cv2.imread(side_path), "04/05  PHASE 4 • HERMETIC CASING & SAPPHIRE PRESS"),
            (cv2.imread(top_path), "05/05  PHASE 5 • TITANOVA CRAFTED WITH PRECISION"),
        ]
        
        ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
        cmd = [
            ffmpeg_exe, '-y',
            '-f', 'rawvideo', '-vcodec', 'rawvideo',
            '-s', f'{width}x{height}', '-pix_fmt', 'bgr24',
            '-r', str(fps), '-i', '-',
            '-c:v', 'libx264', '-preset', 'fast', '-crf', '20',
            '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
            video_path
        ]
        
        proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)
        frames_per_scene = total_frames // len(keyframes)
        transition_frames = 15
        
        rendered = 0
        for idx in range(len(keyframes)):
            curr_img, stage_txt = keyframes[idx]
            next_img = keyframes[idx + 1][0] if idx < len(keyframes) - 1 else None
            scene_len = (total_frames - rendered) if idx == len(keyframes) - 1 else frames_per_scene
            
            for f in range(scene_len):
                prog = f / float(scene_len)
                zoom = 1.0 + 0.05 * prog
                M = cv2.getRotationMatrix2D((width / 2, height / 2), 0, zoom)
                frame = cv2.warpAffine(curr_img, M, (width, height), borderMode=cv2.BORDER_REFLECT)
                
                if next_img is not None and f >= (scene_len - transition_frames):
                    fade = (f - (scene_len - transition_frames)) / float(transition_frames)
                    M_next = cv2.getRotationMatrix2D((width / 2, height / 2), 0, 1.0 + 0.05 * fade * 0.1)
                    next_frame = cv2.warpAffine(next_img, M_next, (width, height), borderMode=cv2.BORDER_REFLECT)
                    frame = cv2.addWeighted(frame, 1.0 - fade, next_frame, fade, 0)
                    
                overlay = frame.copy()
                cv2.rectangle(overlay, (0, height - 90), (width, height), (10, 12, 16), -1)
                cv2.addWeighted(overlay, 0.75, frame, 0.25, 0, frame)
                cv2.line(frame, (0, height - 90), (width, height - 90), (23, 160, 212), 2)
                cv2.putText(frame, stage_txt, (35, height - 42), cv2.FONT_HERSHEY_DUPLEX, 0.65, (230, 230, 230), 1, cv2.LINE_AA)
                cv2.putText(frame, "TITANOVA ATELIER", (width - 230, height - 42), cv2.FONT_HERSHEY_SIMPLEX, 0.52, (23, 160, 212), 1, cv2.LINE_AA)
                
                proc.stdin.write(frame.tobytes())
                rendered += 1
                
        proc.stdin.close()
        proc.wait()
        
    return {
        'front': os.path.exists(front_path),
        'back': os.path.exists(back_path),
        'side': os.path.exists(side_path),
        'top': os.path.exists(top_path),
        'video': os.path.exists(video_path),
        'video_size': os.path.getsize(video_path) if os.path.exists(video_path) else 0,
    }

def main():
    print("==========================================================")
    print("TITANOVA BATCH MEDIA GENERATION PIPELINE")
    print(f"Total Watches in Catalog: {len(PRODUCTS)}")
    print("==========================================================\n")
    
    status_registry = {
        'totalProducts': len(PRODUCTS),
        'completedProducts': 0,
        'incompleteProducts': 0,
        'failedProducts': 0,
        'updatedAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
        'products': {}
    }
    
    for i, prod in enumerate(PRODUCTS, 1):
        slug = prod['slug']
        pid = prod['id']
        name = prod['name']
        print(f"[{i}/{len(PRODUCTS)}] Processing {name} ({slug})...", flush=True)
        
        try:
            res = process_single_watch(prod)
            is_complete = res['front'] and res['back'] and res['side'] and res['top'] and res['video']
            
            status_entry = {
                'productId': pid,
                'slug': slug,
                'name': name,
                'front': f"/images/watches/{slug}/front.jpg" if res['front'] else None,
                'back': f"/images/watches/{slug}/back.jpg" if res['back'] else None,
                'side': f"/images/watches/{slug}/side.jpg" if res['side'] else None,
                'top': f"/images/watches/{slug}/top.jpg" if res['top'] else None,
                'makingVideo': f"/videos/watches/{slug}/making.mp4" if res['video'] else None,
                'imageStatus': 'completed' if (res['front'] and res['back'] and res['side'] and res['top']) else 'incomplete',
                'videoStatus': 'completed' if res['video'] else 'incomplete',
                'status': 'COMPLETE' if is_complete else 'INCOMPLETE',
                'errors': []
            }
            
            if is_complete:
                status_registry['completedProducts'] += 1
            else:
                status_registry['incompleteProducts'] += 1
                
            status_registry['products'][pid] = status_entry
            print(f"       Status: {'[OK] COMPLETE' if is_complete else '[-] INCOMPLETE'}", flush=True)
            
        except Exception as e:
            print(f"       ERROR on {slug}: {e}", flush=True)
            status_registry['failedProducts'] += 1
            status_registry['products'][pid] = {
                'productId': pid,
                'slug': slug,
                'name': name,
                'imageStatus': 'failed',
                'videoStatus': 'failed',
                'status': 'FAILED',
                'errors': [str(e)]
            }
            
        # Write live progress to status file
        os.makedirs(os.path.dirname(STATUS_FILE), exist_ok=True)
        with open(STATUS_FILE, 'w', encoding='utf-8') as sf:
            json.dump(status_registry, sf, indent=2)
            
    print("\n==========================================================")
    print("BATCH GENERATION FINISHED")
    print(f"Total:      {status_registry['totalProducts']}")
    print(f"Completed:  {status_registry['completedProducts']}")
    print(f"Incomplete: {status_registry['incompleteProducts']}")
    print(f"Failed:     {status_registry['failedProducts']}")
    print("==========================================================")

if __name__ == '__main__':
    main()
