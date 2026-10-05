import cv2
import numpy as np
import os

test_path = "public/videos/test_write.mp4"
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(test_path, fourcc, 30.0, (640, 640))

for i in range(30):
    frame = np.zeros((640, 640, 3), dtype=np.uint8)
    cv2.putText(frame, f"Frame {i}", (50, 300), cv2.FONT_HERSHEY_SIMPLEX, 1, (212, 160, 23), 2)
    out.write(frame)

out.release()
print("Test video exists:", os.path.exists(test_path), "Size:", os.path.getsize(test_path))
os.remove(test_path)
