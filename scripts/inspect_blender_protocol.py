with open(r'C:\Users\91991\AppData\Roaming\Blender Foundation\Blender\5.2\scripts\addons\blender_mcp.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if l.startswith('    def '):
        print(f'{i+1}: {l.strip()}')
