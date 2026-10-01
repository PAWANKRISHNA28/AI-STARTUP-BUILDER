import os
import re

CARDS_DIR = r"c:\Users\mpawa\OneDrive\Desktop\AI STARTUP BUILDER\frontend\src\components\chat\cards"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # E.g. export const LocationCard = () => { ... }
    # or export const LocationCard: React.FC = () => { ... }
    # Replace with: export const LocationCard = React.memo(() => { ... })
    
    # regex: export const (\w+)(?:\s*:\s*React\.FC)?\s*=\s*\((.*?)\)\s*=>\s*\{
    pattern = re.compile(r'export\s+const\s+(\w+)(?:\s*:\s*React\.FC)?\s*=\s*\((.*?)\)\s*=>\s*\{')
    
    def replacer(match):
        component_name = match.group(1)
        args = match.group(2)
        return f"export const {component_name}: React.FC = React.memo(({args}) => {{"

    new_content = pattern.sub(replacer, content)
    
    # Also need to append `});` at the end instead of `};` if it matched
    if new_content != content:
        # Find the last `};` and replace with `});`
        # Simple rfind
        last_brace = new_content.rfind('};')
        if last_brace != -1:
            new_content = new_content[:last_brace] + '});' + new_content[last_brace+2:]
            
        # Ensure React is imported
        if "import React" not in new_content:
            new_content = "import React from 'react';\n" + new_content

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Memoized: {filepath}")

for root, dirs, files in os.walk(CARDS_DIR):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            process_file(os.path.join(root, file))

print("Cards memoization complete.")
