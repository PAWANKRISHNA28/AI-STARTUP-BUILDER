import os
import re

FRONTEND_DIR = r"c:\Users\mpawa\OneDrive\Desktop\AI STARTUP BUILDER\frontend\src"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    
    # 1. Replace imports
    # `import { motion } from` -> `import { m } from`
    # `import { motion, AnimatePresence }` -> `import { m, AnimatePresence }`
    # We can just replace `{ motion }` with `{ m }`
    # and `{ motion,` with `{ m,`
    # and `, motion }` with `, m }`
    
    new_content = re.sub(r'\{\s*motion\s*\}', '{ m }', new_content)
    new_content = re.sub(r'\{\s*motion\s*,', '{ m,', new_content)
    new_content = re.sub(r',\s*motion\s*\}', ', m }', new_content)
    
    # 2. Replace tags
    new_content = new_content.replace('<motion.', '<m.')
    new_content = new_content.replace('</motion.', '</m.')
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated LazyMotion: {filepath}")

for root, dirs, files in os.walk(FRONTEND_DIR):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            process_file(os.path.join(root, file))

print("LazyMotion tag replacement complete.")
