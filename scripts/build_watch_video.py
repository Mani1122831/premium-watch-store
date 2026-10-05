import os
import cv2
import numpy as np
import imageio_ffmpeg
import subprocess

def create_watchmaking_video(frame_paths, stages_text, output_mp4, duration_sec=9.0, fps=30):
    os.makedirs(os.path.dirname(output_mp4), exist_ok=True)
    width, height = 1080, 1080
    total_frames = int(duration_sec * fps)
    
    # Load and prepare images
    loaded_imgs = []
    for p in frame_paths:
        if not os.path.exists(p):
            raise FileNotFoundError(f"Missing frame image: {p}")
        img = cv2.imread(p)
        if img is None:
            raise ValueError(f"Failed to read image: {p}")
        # Resize/crop to 1080x1080
        h, w = img.shape[:2]
        crop_size = min(h, w)
        start_y = (h - crop_size) // 2
        start_x = (w - crop_size) // 2
        cropped = img[start_y:start_y+crop_size, start_x:start_x+crop_size]
        resized = cv2.resize(cropped, (width, height), interpolation=cv2.INTER_LANCZOS4)
        loaded_imgs.append(resized)
    
    num_scenes = len(loaded_imgs)
    frames_per_scene = total_frames // num_scenes
    transition_frames = 15 # 0.5s crossfade
    
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    
    # Write frames directly to ffmpeg pipe
    cmd = [
        ffmpeg_exe,
        '-y',
        '-f', 'rawvideo',
        '-vcodec', 'rawvideo',
        '-s', f'{width}x{height}',
        '-pix_fmt', 'bgr24',
        '-r', str(fps),
        '-i', '-',
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '20',
        '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart',
        output_mp4
    ]
    
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.PIPE)
    
    rendered_frames = 0
    for scene_idx in range(num_scenes):
        img_current = loaded_imgs[scene_idx]
        img_next = loaded_imgs[(scene_idx + 1) % num_scenes] if scene_idx < num_scenes - 1 else None
        stage_title = stages_text[scene_idx] if scene_idx < len(stages_text) else ""
        
        # Determine number of frames for this scene
        if scene_idx == num_scenes - 1:
            scene_len = total_frames - rendered_frames
        else:
            scene_len = frames_per_scene
            
        for f in range(scene_len):
            progress = f / float(scene_len)
            
            # Subtle Ken Burns zoom
            zoom = 1.0 + 0.06 * progress
            M = cv2.getRotationMatrix2D((width / 2, height / 2), 0, zoom)
            frame = cv2.warpAffine(img_current, M, (width, height), borderMode=cv2.BORDER_REFLECT)
            
            # Cross-dissolve into next scene near the end
            if img_next is not None and f >= (scene_len - transition_frames):
                fade_progress = (f - (scene_len - transition_frames)) / float(transition_frames)
                zoom_next = 1.0 + 0.06 * (fade_progress * 0.1)
                M_next = cv2.getRotationMatrix2D((width / 2, height / 2), 0, zoom_next)
                next_frame = cv2.warpAffine(img_next, M_next, (width, height), borderMode=cv2.BORDER_REFLECT)
                frame = cv2.addWeighted(frame, 1.0 - fade_progress, next_frame, fade_progress, 0)
            
            # Add premium Atelier badge banner at bottom
            overlay = frame.copy()
            cv2.rectangle(overlay, (0, height - 90), (width, height), (10, 12, 16), -1)
            cv2.addWeighted(overlay, 0.75, frame, 0.25, 0, frame)
            
            # Gold accent line
            cv2.line(frame, (0, height - 90), (width, height - 90), (23, 160, 212), 2) # Gold in BGR
            
            # Text
            cv2.putText(frame, stage_title, (40, height - 42), cv2.FONT_HERSHEY_DUPLEX, 0.75, (230, 230, 230), 1, cv2.LINE_AA)
            cv2.putText(frame, "TITANOVA ATELIER", (width - 240, height - 42), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (23, 160, 212), 1, cv2.LINE_AA)
            
            proc.stdin.write(frame.tobytes())
            rendered_frames += 1
            
    proc.stdin.close()
    stderr = proc.stderr.read()
    proc.wait()
    
    if proc.returncode != 0:
        raise RuntimeError(f"FFmpeg error: {stderr.decode('utf-8', errors='ignore')}")
    
    print(f"Successfully generated: {output_mp4} ({os.path.getsize(output_mp4)} bytes, {rendered_frames} frames)")

if __name__ == '__main__':
    frames = [
        r"C:\Users\91991\.gemini\antigravity\brain\b4c571f4-1f4b-455d-8bd8-3f468b979b6d\meridian_components_1790954360987.jpg",
        r"C:\Users\91991\.gemini\antigravity\brain\b4c571f4-1f4b-455d-8bd8-3f468b979b6d\meridian_assembly_hands_1790954390991.jpg",
        r"D:\premium-watch-store\public\images\watches\meridian-classic-gold\side.jpg",
        r"D:\premium-watch-store\public\images\watches\meridian-classic-gold\back.jpg",
        r"D:\premium-watch-store\public\images\watches\meridian-classic-gold\top.jpg"
    ]
    stages = [
        "01 / 05  COMPONENTS DEPLOYMENT & CALIBRATION",
        "02 / 05  HANDS & DIAL PRECISION MOUNTING",
        "03 / 05  SAPPHIRE DOME & CROWN ASSEMBLY",
        "04 / 05  SWISS ROTOR & CASEBACK CERTIFICATION",
        "05 / 05  MERIDIAN CLASSIC GOLD MASTERPIECE"
    ]
    out = r"D:\premium-watch-store\public\videos\watches\meridian-classic-gold\making.mp4"
    create_watchmaking_video(frames, stages, out, duration_sec=9.0, fps=30)
