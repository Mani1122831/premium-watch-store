import socket
import json

def send_blender_cmd(cmd_dict):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(15.0)
    s.connect(('localhost', 9876))
    s.sendall(json.dumps(cmd_dict).encode('utf-8'))
    
    chunks = []
    while True:
        try:
            chunk = s.recv(8192)
            if not chunk:
                break
            chunks.append(chunk)
            full = b''.join(chunks).decode('utf-8')
            try:
                res = json.loads(full)
                s.close()
                return res
            except json.JSONDecodeError:
                continue
        except socket.timeout:
            break
    s.close()
    if chunks:
        return json.loads(b''.join(chunks).decode('utf-8'))
    return None

script = """
import bpy
import json

objs_data = []
for obj in bpy.data.objects:
    item = {
        "name": obj.name,
        "type": obj.type,
        "location": [round(c, 2) for c in obj.location],
        "materials": [m.name for m in obj.data.materials] if hasattr(obj.data, 'materials') and obj.data.materials else [],
        "has_anim": bool(obj.animation_data and obj.animation_data.action),
        "action": obj.animation_data.action.name if (obj.animation_data and obj.animation_data.action) else None,
        "verts": len(obj.data.vertices) if hasattr(obj.data, 'vertices') else 0,
        "polys": len(obj.data.polygons) if hasattr(obj.data, 'polygons') else 0
    }
    objs_data.append(item)

info = {
    "current_blend": bpy.data.filepath,
    "frame_start": bpy.context.scene.frame_start,
    "frame_end": bpy.context.scene.frame_end,
    "fps": bpy.context.scene.render.fps,
    "total_objects": len(bpy.data.objects),
    "objects": objs_data
}
print("INSPECT_OUTPUT:" + json.dumps(info))
"""

res = send_blender_cmd({"type": "execute_code", "params": {"code": script}})
print("Blender Response:")
print(json.dumps(res, indent=2))
