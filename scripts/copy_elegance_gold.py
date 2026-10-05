import shutil
import os

src_back = r"C:\Users\91991\.gemini\antigravity\brain\b4c571f4-1f4b-455d-8bd8-3f468b979b6d\elegance_gold_back_1790948184125.jpg"
src_side = r"C:\Users\91991\.gemini\antigravity\brain\b4c571f4-1f4b-455d-8bd8-3f468b979b6d\elegance_gold_side_1790948395803.jpg"
src_top = r"C:\Users\91991\.gemini\antigravity\brain\b4c571f4-1f4b-455d-8bd8-3f468b979b6d\elegance_gold_top_1790948424688.jpg"

dest_dir = r"d:\premium-watch-store\public\images\watches\titanova-elegance-gold"
os.makedirs(dest_dir, exist_ok=True)

shutil.copyfile(src_back, os.path.join(dest_dir, "back.jpg"))
shutil.copyfile(src_side, os.path.join(dest_dir, "side.jpg"))
shutil.copyfile(src_top, os.path.join(dest_dir, "top.jpg"))

print("Files in destination:", os.listdir(dest_dir))
