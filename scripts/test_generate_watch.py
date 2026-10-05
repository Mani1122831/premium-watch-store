import os
import cv2
import numpy as np
import subprocess
import imageio_ffmpeg
import json

def generate_views_and_video_for_watch(product, public_dir):
    slug = product['slug']
    name = product['name']
    material = product['material']
    category = product['category']
    
    img_dir = os.path.join(public_dir, 'images', 'watches', slug)
    vid_dir = os.path.join(public_dir, 'videos', 'watches', slug)
    os.makedirs(img_dir, exist_ok=True)
    os.makedirs(vid_dir, exist_ok=True)
    
    front_path = os.path.join(img_dir, 'front.jpg')
    back_path = os.path.join(img_dir, 'back.jpg')
    side_path = os.path.join(img_dir, 'side.jpg')
    top_path = os.path.join(img_dir, 'top.jpg')
    video_path = os.path.join(vid_dir, 'making.mp4')
    
    if not os.path.exists(front_path):
        raise FileNotFoundError(f"Missing front image for {slug}: {front_path}")
        
    front_img = cv2.imread(front_path)
    if front_img is None:
        raise ValueError(f"Failed to read {front_path}")
        
    # Resize front to standard 1080x1080
    fh, fw = front_img.shape[:2]
    crop_size = min(fh, fw)
    sy = (fh - crop_size) // 2
    sx = (fw - crop_size) // 2
    front_sq = cv2.resize(front_img[sy:sy+crop_size, sx:sx+crop_size], (1080, 1080), interpolation=cv2.INTER_LANCZOS4)
    
    is_gold = 'gold' in material.lower() or 'gold' in name.lower()
    is_black = 'black' in material.lower() or 'black' in name.lower() or 'pvd' in material.lower()
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
        
    # -------------------------------------------------------------
    # 1. GENERATE BACK VIEW (if missing)
    # -------------------------------------------------------------
    if not os.path.exists(back_path):
        back_canvas = np.zeros((1080, 1080, 3), dtype=np.uint8)
        for y in range(1080):
            val = int(10 + 10 * (y / 1080.0))
            back_canvas[y, :] = (val, val, val + 2)
            
        center = (540, 540)
        radius = 330
        strap_width = 180
        strap_color = (18, 18, 20) if is_black else ((25, 45, 70) if is_gold else (35, 35, 38))
        
        # Strap top & bottom
        cv2.rectangle(back_canvas, (540 - strap_width//2, 80), (540 + strap_width//2, 280), strap_color, -1)
        cv2.rectangle(back_canvas, (540 - strap_width//2, 800), (540 + strap_width//2, 1000), strap_color, -1)
        
        # Outer bezel/caseback
        for r in range(radius, radius - 45, -1):
            factor = (r - (radius - 45)) / 45.0
            c = [int(base_metal[i] * (0.7 + 0.3 * factor)) for i in range(3)]
            cv2.circle(back_canvas, center, r, c, 1)
            
        # Screws
        for i in range(6):
            ang = i * (2 * np.pi / 6)
            sx = int(center[0] + (radius - 22) * np.cos(ang))
            sy = int(center[1] + (radius - 22) * np.sin(ang))
            cv2.circle(back_canvas, (sx, sy), 7, (15, 15, 18), -1)
            cv2.circle(back_canvas, (sx, sy), 6, specular, 1)
            cv2.line(back_canvas, (sx - 3, sy), (sx + 3, sy), (10, 10, 10), 1)
            
        # Exhibition window & Swiss calibre rotor
        inner_r = radius - 55
        cv2.circle(back_canvas, center, inner_r, (12, 12, 15), -1)
        axes = (inner_r - 25, inner_r - 25)
        rotor_c = (25, 165, 215) if (is_gold or not is_black) else (70, 75, 80)
        cv2.ellipse(back_canvas, center, axes, 0, 0, 180, rotor_c, -1)
        cv2.circle(back_canvas, center, 26, (180, 180, 185), -1)
        cv2.circle(back_canvas, center, 12, (45, 30, 180), -1) # Synthetic Ruby
        
        # Sapphire reflection arc
        cv2.ellipse(back_canvas, center, (inner_r - 5, inner_r - 5), 45, 0, 85, (255, 255, 255), 2)
        
        # Engravings
        text_c = (15, 15, 20) if not is_black else (160, 160, 165)
        cv2.putText(back_canvas, "TITANOVA ATELIER", (540 - 130, 540 - 240), cv2.FONT_HERSHEY_DUPLEX, 0.65, text_c, 1, cv2.LINE_AA)
        cv2.putText(back_canvas, name.upper(), (540 - 140, 540 - 170), cv2.FONT_HERSHEY_SIMPLEX, 0.52, text_c, 1, cv2.LINE_AA)
        cv2.putText(back_canvas, "SWISS CALIBRE • 50M WATER RESISTANT", (540 - 170, 540 + 260), cv2.FONT_HERSHEY_SIMPLEX, 0.48, text_c, 1, cv2.LINE_AA)
        
        cv2.imwrite(back_path, back_canvas, [int(cv2.IMWRITE_JPEG_QUALITY), 95])
        print(f"[{slug}] Generated back.jpg")

    # -------------------------------------------------------------
    # 2. GENERATE SIDE VIEW (if missing)
    # -------------------------------------------------------------
    if not os.path.exists(side_path):
        side_canvas = np.zeros((1080, 1080, 3), dtype=np.uint8)
        for y in range(1080):
            val = int(8 + 12 * (y / 1080.0))
            side_canvas[y, :] = (val, val, val + 2)
            
        # Draw side profile centered vertically (y: 490 to 590)
        cy = 540
        # Straps extending horizontally to left and right
        cv2.rectangle(side_canvas, (80, cy - 14), (320, cy + 14), (20, 20, 24), -1)
        cv2.rectangle(side_canvas, (760, cy - 14), (1000, cy + 14), (20, 20, 24), -1)
        
        # Case middle profile
        pts = np.array([
            [300, cy + 28],
            [340, cy + 38],
            [740, cy + 38],
            [780, cy + 28],
            [770, cy - 25],
            [730, cy - 35],
            [350, cy - 35],
            [310, cy - 25],
        ], np.int32)
        cv2.fillPoly(side_canvas, [pts], base_metal)
        
        # Domed Sapphire Crystal on top
        cv2.ellipse(side_canvas, (540, cy - 35), (200, 35), 0, 180, 360, (230, 245, 255), -1)
        cv2.ellipse(side_canvas, (540, cy - 35), (198, 33), 0, 180, 360, (15, 20, 28), -1)
        # Specular light gleam on crystal
        cv2.ellipse(side_canvas, (540, cy - 35), (196, 32), 0, 210, 270, (255, 255, 255), 2)
        
        # Fluted Crown on right
        crown_color = [int(c * 1.05) for c in base_metal]
        cv2.rectangle(side_canvas, (780, cy - 18), (820, cy + 18), crown_color, -1)
        for gy in range(cy - 16, cy + 18, 5):
            cv2.line(side_canvas, (782, gy), (818, gy), (15, 15, 18), 1)
        # 'T' Crest on crown tip
        cv2.putText(side_canvas, "T", (802, cy + 6), cv2.FONT_HERSHEY_DUPLEX, 0.45, (10, 10, 12), 1, cv2.LINE_AA)
        
        # Table reflection
        reflection_h = 240
        refl_slice = cv2.flip(side_canvas[cy - 60:cy + 50, :], 0)
        refl_slice = cv2.resize(refl_slice, (1080, reflection_h))
        for ry in range(reflection_h):
            alpha = (1.0 - (ry / float(reflection_h))) * 0.25
            side_canvas[cy + 40 + ry, :] = cv2.addWeighted(refl_slice[ry, :], alpha, side_canvas[cy + 40 + ry, :], 1.0 - alpha, 0)
            
        cv2.imwrite(side_path, side_canvas, [int(cv2.IMWRITE_JPEG_QUALITY), 95])
        print(f"[{slug}] Generated side.jpg")

    # -------------------------------------------------------------
    # 3. GENERATE TOP / ANGLED VIEW (if missing)
    # -------------------------------------------------------------
    if not os.path.exists(top_path):
        top_canvas = np.zeros((1080, 1080, 3), dtype=np.uint8)
        for y in range(1080):
            val = int(14 + 10 * (y / 1080.0))
            top_canvas[y, :] = (val, val, val + 2)
            
        # Perspective transform of front image to 3/4 isometric angle
        src_pts = np.float32([[140, 140], [940, 140], [940, 940], [140, 940]])
        dst_pts = np.float32([[260, 200], [860, 130], [820, 880], [220, 810]])
        matrix = cv2.getPerspectiveTransform(src_pts, dst_pts)
        warped = cv2.warpPerspective(front_sq, matrix, (1080, 1080), borderMode=cv2.BORDER_CONSTANT, borderValue=(0,0,0))
        
        # Mask and composite onto dark slate
        gray = cv2.cvtColor(warped, cv2.COLOR_BGR2GRAY)
        _, mask = cv2.threshold(gray, 5, 255, cv2.THRESH_BINARY)
        mask_inv = cv2.bitwise_not(mask)
        
        bg_part = cv2.bitwise_and(top_canvas, top_canvas, mask=mask_inv)
        fg_part = cv2.bitwise_and(warped, warped, mask=mask)
        top_canvas = cv2.add(bg_part, fg_part)
        
        # Add 3D bevel depth and gold specular sheen
        cv2.line(top_canvas, (260, 200), (860, 130), specular, 2, cv2.LINE_AA)
        
        cv2.imwrite(top_path, top_canvas, [int(cv2.IMWRITE_JPEG_QUALITY), 95])
        print(f"[{slug}] Generated top.jpg")

    # -------------------------------------------------------------
    # 4. GENERATE EXPLODED VIEW ASSEMBLY VIDEO (if missing)
    # -------------------------------------------------------------
    if not os.path.exists(video_path):
        print(f"[{slug}] Rendering 9.0s Exploded Assembly Video...")
        # Create 5 distinct assembly phase frames
        width, height = 1080, 1080
        fps = 30
        duration_sec = 9.0
        total_frames = int(duration_sec * fps)
        
        # Build 5 keyframes:
        # Phase 1: Complete Floating Watch (0-1.8s)
        # Phase 2: Vertical Axial Exploded View (1.8-3.6s)
        # Phase 3: Component Inspection (3.6-5.4s)
        # Phase 4: Convergence & Locking (5.4-7.2s)
        # Phase 5: Finished Masterpiece Reveal (7.2-9.0s)
        
        # Create Exploded Frame
        exploded_img = np.zeros((1080, 1080, 3), dtype=np.uint8)
        for y in range(1080):
            val = int(8 + 8 * (y / 1080.0))
            exploded_img[y, :] = (val, val, val + 2)
            
        # Draw central alignment axis line
        cv2.line(exploded_img, (540, 80), (540, 1000), (25, 140, 190), 1, cv2.LINE_AA)
        
        # Exploded Layers: Crystal, Bezel, Hands, Dial, Movement, Case, Caseback, Strap
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
        
        proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.PIPE)
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
                    
                # Luxury Bottom Banner
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
        print(f"[{slug}] Generated making.mp4 ({os.path.getsize(video_path)} bytes, {rendered} frames)")

if __name__ == '__main__':
    # Test on p002
    test_p = {
        'id': 'p002',
        'slug': 'titanova-chronograph-black',
        'name': 'Titanova Chronograph Black',
        'material': 'Black PVD Brushed Stainless Steel',
        'category': 'Chronograph'
    }
    generate_views_and_video_for_watch(test_p, r"D:\premium-watch-store\public")
