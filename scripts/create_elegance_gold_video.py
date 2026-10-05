import os
import sys
import subprocess
from PIL import Image, ImageDraw, ImageFont
import numpy as np

# Locate ffmpeg
import imageio_ffmpeg
FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()
print(f"Using FFmpeg: {FFMPEG_EXE}")

# Source images
IMG_COMPONENTS = r"C:\Users\91991\.gemini\antigravity\brain\b4c571f4-1f4b-455d-8bd8-3f468b979b6d\elegance_gold_components_1790948760360.jpg"
IMG_HANDS = r"C:\Users\91991\.gemini\antigravity\brain\b4c571f4-1f4b-455d-8bd8-3f468b979b6d\elegance_gold_assembly_hands_1790948806190.jpg"
IMG_CASING = r"C:\Users\91991\.gemini\antigravity\brain\b4c571f4-1f4b-455d-8bd8-3f468b979b6d\elegance_gold_casing_1790948840134.jpg"
IMG_BRACELET = r"C:\Users\91991\.gemini\antigravity\brain\b4c571f4-1f4b-455d-8bd8-3f468b979b6d\elegance_gold_bracelet_fitting_1790948872430.jpg"
IMG_BACK = r"d:\premium-watch-store\public\images\watches\titanova-elegance-gold\back.jpg"
IMG_SIDE = r"d:\premium-watch-store\public\images\watches\titanova-elegance-gold\side.jpg"
IMG_TOP = r"d:\premium-watch-store\public\images\watches\titanova-elegance-gold\top.jpg"
IMG_FRONT = r"d:\premium-watch-store\public\images\watches\titanova-elegance-gold\front.jpg"

OUTPUT_DIR = r"d:\premium-watch-store\public\videos\watches\titanova-elegance-gold"
os.makedirs(OUTPUT_DIR, exist_ok=True)
OUTPUT_MP4 = os.path.join(OUTPUT_DIR, "making.mp4")

WIDTH = 1080
HEIGHT = 1080
FPS = 30

def create_title_frame(title, subtitle, stage_num=None, stage_desc=None):
    img = Image.new("RGB", (WIDTH, HEIGHT), color=(12, 13, 16))
    draw = ImageDraw.Draw(img)
    
    # Outer luxury gold border
    draw.rectangle([(30, 30), (WIDTH - 30, HEIGHT - 30)], outline=(60, 50, 30), width=1)
    draw.rectangle([(40, 40), (WIDTH - 40, HEIGHT - 40)], outline=(212, 160, 23), width=2)
    draw.rectangle([(50, 50), (WIDTH - 50, HEIGHT - 50)], outline=(60, 50, 30), width=1)
    
    # Corner ornaments
    draw.line([(30, 80), (80, 80)], fill=(212, 160, 23), width=2)
    draw.line([(80, 30), (80, 80)], fill=(212, 160, 23), width=2)
    draw.line([(WIDTH - 30, 80), (WIDTH - 80, 80)], fill=(212, 160, 23), width=2)
    draw.line([(WIDTH - 80, 30), (WIDTH - 80, 80)], fill=(212, 160, 23), width=2)
    
    # Centered texts
    # Logo
    draw.text((WIDTH//2, 380), "TITANOVA", fill=(255, 255, 255), anchor="mm")
    draw.text((WIDTH//2, 440), "HAUTE HORLOGERIE ATELIER", fill=(212, 160, 23), anchor="mm")
    
    draw.line([(WIDTH//2 - 120, 480), (WIDTH//2 + 120, 480)], fill=(180, 140, 30), width=2)
    
    draw.text((WIDTH//2, 540), title, fill=(245, 245, 245), anchor="mm")
    draw.text((WIDTH//2, 600), subtitle, fill=(180, 180, 180), anchor="mm")
    
    if stage_num and stage_desc:
        draw.text((WIDTH//2, 700), f"STAGE {stage_num}: {stage_desc}", fill=(212, 160, 23), anchor="mm")

    return img

def render_scene(pil_img, title, subtitle, duration_secs, zoom_dir=1.05):
    # Resize pil_img to square
    w, h = pil_img.size
    min_dim = min(w, h)
    left = (w - min_dim) // 2
    top = (h - min_dim) // 2
    cropped = pil_img.crop((left, top, left + min_dim, top + min_dim))
    base_img = cropped.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
    
    num_frames = int(duration_secs * FPS)
    frames = []
    
    for i in range(num_frames):
        progress = i / max(1, num_frames - 1)
        scale = 1.0 + (zoom_dir - 1.0) * progress
        
        # Scale and crop center
        new_w = int(WIDTH * scale)
        new_h = int(HEIGHT * scale)
        scaled = base_img.resize((new_w, new_h), Image.Resampling.BILINEAR)
        crop_x = (new_w - WIDTH) // 2
        crop_y = (new_h - HEIGHT) // 2
        frame = scaled.crop((crop_x, crop_y, crop_x + WIDTH, crop_y + HEIGHT))
        
        draw = ImageDraw.Draw(frame)
        
        # Top badge
        badge_y = 60
        draw.rectangle([(60, badge_y), (WIDTH - 60, badge_y + 80)], fill=(12, 13, 16, 220), outline=(212, 160, 23), width=2)
        draw.text((WIDTH//2, badge_y + 26), title, fill=(212, 160, 23), anchor="mm")
        draw.text((WIDTH//2, badge_y + 54), subtitle, fill=(255, 255, 255), anchor="mm")
        
        # Bottom Atelier Signature
        bottom_y = HEIGHT - 80
        draw.rectangle([(60, bottom_y), (WIDTH - 60, bottom_y + 40)], fill=(12, 13, 16, 200), outline=(60, 50, 30), width=1)
        draw.text((WIDTH//2, bottom_y + 20), "TITANOVA ELEGANCE GOLD • BESPOKE HOROLOGICAL CRAFTSMANSHIP", fill=(200, 180, 120), anchor="mm")
        
        frames.append(frame)
        
    return frames

scenes_config = [
    (IMG_COMPONENTS, "STAGE 1: INDIVIDUAL WATCH COMPONENTS", "18K Gold Case, Swiss Calibre, Sunburst Dial, Crystal & Solid Bracelet", 2.5, 1.06),
    (IMG_HANDS, "STAGE 2: ATELIER HAND-SETTING", "Master Watchmaker Delicately Fitting Gold Dauphine Hands", 2.5, 1.06),
    (IMG_CASING, "STAGE 3: 18K GOLD CASING & SAPPHIRE PRESS", "Precision Calibre Seating & Anti-Reflective Crystal Hermetic Press", 2.5, 1.06),
    (IMG_BRACELET, "STAGE 4: SOLID 3-LINK BRACELET INTEGRATION", "Articulation of Polished 18K Gold Bracelet & Springbar Lugs", 2.5, 1.06),
    (IMG_BACK, "STAGE 5: HERMETIC CASEBACK & LASER CREST", "Screw-Down 18K Gold Caseback • 50M Water Resistance Certified", 2.5, 1.05),
    (IMG_SIDE, "STAGE 6: ERGONOMIC SLIMLINE PROFILE", "Curved Sapphire Crystal Dome & Fluted Crown With Titanova Crest", 2.5, 1.05),
    (IMG_TOP, "STAGE 7: ISOMETRIC ATELIER MASTER REVIEW", "Champagne Sunburst Dial Reflection & Flawless Mirror Finishing", 2.5, 1.05),
    (IMG_FRONT, "STAGE 8: THE COMPLETED MASTERPIECE", "TITANOVA ELEGANCE GOLD • Certified Swiss Calibre Timepiece", 3.5, 1.04),
]

# Temporary directory for frames
temp_frames_dir = r"d:\premium-watch-store\scripts\temp_video_frames"
os.makedirs(temp_frames_dir, exist_ok=True)

# Clean any existing frames
for f in os.listdir(temp_frames_dir):
    try: os.remove(os.path.join(temp_frames_dir, f))
    except: pass

frame_idx = 0

# Intro title sequence (1.5 seconds)
intro_img = create_title_frame("TITANOVA ELEGANCE GOLD", "BESPOKE ATELIER ASSEMBLY & CRAFTSMANSHIP")
for _ in range(int(1.5 * FPS)):
    intro_img.save(os.path.join(temp_frames_dir, f"frame_{frame_idx:05d}.jpg"), quality=92)
    frame_idx += 1

# Render all stages
for img_path, title, sub, dur, zoom in scenes_config:
    print(f"Rendering: {title}")
    raw_img = Image.open(img_path)
    stage_frames = render_scene(raw_img, title, sub, dur, zoom)
    for f in stage_frames:
        f.save(os.path.join(temp_frames_dir, f"frame_{frame_idx:05d}.jpg"), quality=92)
        frame_idx += 1

print(f"Total frames generated: {frame_idx}")

# Run FFmpeg to encode to H.264 MP4 with optimal web flags
ffmpeg_cmd = [
    FFMPEG_EXE,
    "-y",
    "-framerate", str(FPS),
    "-i", os.path.join(temp_frames_dir, "frame_%05d.jpg"),
    "-c:v", "libx264",
    "-profile:v", "high",
    "-level", "4.0",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    "-crf", "20",
    OUTPUT_MP4
]

print("Running FFmpeg encoding...")
res = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)
if res.returncode == 0:
    print("SUCCESS! Encoded video at:", OUTPUT_MP4)
    print("File size:", os.path.getsize(OUTPUT_MP4), "bytes")
else:
    print("FFmpeg error:", res.stderr)
    sys.exit(1)

# Cleanup temp frames
for f in os.listdir(temp_frames_dir):
    try: os.remove(os.path.join(temp_frames_dir, f))
    except: pass
try: os.rmdir(temp_frames_dir)
except: pass

print("Done.")
