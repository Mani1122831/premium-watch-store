import socket
import json

def send_blender_cmd(cmd_dict):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(10.0)
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

if __name__ == '__main__':
    code = """
import bpy
print("Testing execute_code from python script")
"""
    res = send_blender_cmd({"type": "execute_code", "params": {"code": code}})
    print("Result:", json.dumps(res, indent=2))
