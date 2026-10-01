import os
import re

FRONTEND_DIR = r"c:\Users\mpawa\OneDrive\Desktop\AI STARTUP BUILDER\frontend\src"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern to match: const { a, b, c } = useStore();
    # It might span multiple lines.
    pattern = re.compile(r'const\s+\{([^}]+)\}\s*=\s*useStore\(\);', re.MULTILINE)
    
    def replacer(match):
        vars_str = match.group(1)
        # Split by comma, remove whitespace and empty strings
        vars_list = [v.strip() for v in vars_str.split(',')]
        vars_list = [v for v in vars_list if v]
        
        replacement = ""
        for i, v in enumerate(vars_list):
            prefix = "  " if i > 0 else ""
            if ":" in v: # Handle renaming like `token: authToken`
                orig, new_name = v.split(":")
                orig = orig.strip()
                new_name = new_name.strip()
                replacement += f"{prefix}const {new_name} = useStore(state => state.{orig});\n"
            else:
                replacement += f"{prefix}const {v} = useStore(state => state.{v});\n"
        return replacement.strip()
    
    new_content = pattern.sub(replacer, content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {filepath}")

for root, dirs, files in os.walk(FRONTEND_DIR):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            process_file(os.path.join(root, file))

print("Zustand refactoring complete.")
