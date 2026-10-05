import os
import sys
import cv2
import numpy as np
import subprocess
import imageio_ffmpeg

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

def render_exploded_video(slug, image_list, output_path, duration=9.0, fps=30):
    """
    Renders an exploded assembly video using genuine high-resolution photographic views
    and exploded component renders of the EXACT watch model.
    """
    W, H = 1080, 1080
    total_frames = int(duration * fps)

    def prepare_sq(img_path):
        if not os.path.exists(img_path):
            raise FileNotFoundError(f"Image not found: {img_path}")
        img = cv2.imread(img_path)
        ih, iw = img.shape[:2]
        c = min(ih, iw)
        sy, sx = (ih - c)//2, (iw - c)//2
        return cv2.resize(img[sy:sy+c, sx:sx+c], (W, H), interpolation=cv2.INTER_LANCZOS4)

    loaded_scenes = []
    for path, label in image_list:
        loaded_scenes.append((prepare_sq(path), label))

    frames_per_scene = total_frames // len(loaded_scenes)
    fade_len = 12

    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    cmd = [
        ffmpeg_exe, '-y',
        '-f', 'rawvideo', '-vcodec', 'rawvideo',
        '-s', f'{W}x{H}', '-pix_fmt', 'bgr24',
        '-r', str(fps), '-i', '-',
        '-c:v', 'libx264', '-preset', 'fast', '-crf', '19',
        '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
        output_path
    ]

    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)

    rendered = 0
    for idx, (sc_img, label) in enumerate(loaded_scenes):
        next_img = loaded_scenes[idx + 1][0] if idx < len(loaded_scenes) - 1 else None
        s_len = (total_frames - rendered) if idx == len(loaded_scenes) - 1 else frames_per_scene
        
        for f in range(s_len):
            prog = f / float(s_len)
            zoom = 1.0 + 0.035 * prog
            M = cv2.getRotationMatrix2D((W/2, H/2), 0, zoom)
            frame = cv2.warpAffine(sc_img, M, (W, H), borderMode=cv2.BORDER_REFLECT)
            
            # Smooth crossfade
            if next_img is not None and f >= (s_len - fade_len):
                alpha = (f - (s_len - fade_len)) / float(fade_len)
                frame = cv2.addWeighted(frame, 1.0 - alpha, next_img, alpha, 0)
                
            # Luxury Atelier HUD
            hud = frame.copy()
            cv2.rectangle(hud, (0, H - 75), (W, H), (8, 9, 12), -1)
            frame = cv2.addWeighted(hud, 0.85, frame, 0.15, 0)
            cv2.line(frame, (0, H - 75), (W, H - 75), (212, 160, 23), 1, cv2.LINE_AA)
            cv2.putText(frame, label, (30, H - 32), cv2.FONT_HERSHEY_DUPLEX, 0.50, (240, 240, 245), 1, cv2.LINE_AA)
            cv2.putText(frame, 'TITANOVA ATELIER', (W - 220, H - 32), cv2.FONT_HERSHEY_DUPLEX, 0.46, (212, 160, 23), 1, cv2.LINE_AA)
            
            proc.stdin.write(frame.tobytes())
            rendered += 1

    proc.stdin.close()
    proc.wait()

    # Validate output
    cap = cv2.VideoCapture(output_path)
    ok = cap.isOpened()
    cnt = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) if ok else 0
    cap.release()
    print(f"Rendered {output_path} | frames={cnt} | size={os.path.getsize(output_path)//1024}KB | ok={ok}")
    return ok and cnt > 50

if __name__ == '__main__':
    art_dir = r'C:/Users/91991/.gemini/antigravity/brain/b4c571f4-1f4b-455d-8bd8-3f468b979b6d'
    img_dir = r'd:/premium-watch-store/public/images/watches/titanova-chronograph-black'
    vid_path = r'd:/premium-watch-store/public/videos/watches/titanova-chronograph-black/making.mp4'

    scenes = [
        (os.path.join(img_dir, 'front.jpg'), '01/05 • COMPLETE TIMEPIECE FOUNDATION'),
        (os.path.join(art_dir, 'chrono_black_exploded_1791023004004.jpg'), '02/05 • AXIAL EXPLODED MECHANICAL ASSEMBLY'),
        (os.path.join(img_dir, 'side.jpg'), '03/05 • HERMETIC CASING & PUSHERS CALIBRATION'),
        (os.path.join(img_dir, 'back.jpg'), '04/05 • SWISS CALIBRE ROTOR & CASEBACK'),
        (os.path.join(img_dir, 'top.jpg'), '05/05 • TITANOVA PRECISION ASSEMBLED'),
    ]
    render_exploded_video('titanova-chronograph-black', scenes, vid_path)
