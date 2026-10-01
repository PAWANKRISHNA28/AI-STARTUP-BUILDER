import os
import re

# We will replace `animate={{` with `whileInView={{` and add `viewport={{ once: true, margin: "-20px" }}`
# but only for simple entrance animations like `opacity` and `y`.

PAGES_TO_UPDATE = [
    r"c:\Users\mpawa\OneDrive\Desktop\AI STARTUP BUILDER\frontend\src\pages\DashboardPage.tsx",
    r"c:\Users\mpawa\OneDrive\Desktop\AI STARTUP BUILDER\frontend\src\pages\WorkspacePage.tsx",
    r"c:\Users\mpawa\OneDrive\Desktop\AI STARTUP BUILDER\frontend\src\pages\ProjectViewPage.tsx",
    r"c:\Users\mpawa\OneDrive\Desktop\AI STARTUP BUILDER\frontend\src\pages\ReportsPage.tsx",
]

def process_file(filepath):
    if not os.path.exists(filepath):
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find: animate={{ opacity: 1, y: 0 }} (with variations)
    # and replace with: whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px" }}
    
    # We want to match: animate={{ opacity: 1, y: 0 }} or animate={{ y: 0, opacity: 1 }} etc
    pattern = re.compile(r'animate=\{\{\s*(?:opacity|y|x|scale)[^}]*\}\}')
    
    def replacer(match):
        anim_str = match.group(0)
        # Avoid breaking if it's not a standard entry anim
        if 'opacity' in anim_str or 'y:' in anim_str or 'x:' in anim_str:
            new_str = anim_str.replace('animate=', 'whileInView=')
            return f'{new_str} viewport={{{{ once: true, margin: "0px" }}}}'
        return anim_str
        
    new_content = pattern.sub(replacer, content)
    
    # Also for Step 5, reduce durations > 0.8s to 0.5s in transitions
    new_content = re.sub(r'duration:\s*[1-4](?:\.\d+)?', 'duration: 0.5', new_content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Optimized whileInView & duration in: {filepath}")

for fp in PAGES_TO_UPDATE:
    process_file(fp)

# Let's also do a global duration reduction script for ALL pages to hit Step 5
FRONTEND_DIR = r"c:\Users\mpawa\OneDrive\Desktop\AI STARTUP BUILDER\frontend\src"
for root, dirs, files in os.walk(FRONTEND_DIR):
    for file in files:
        if file.endswith(('.tsx', '.ts')) and os.path.join(root, file) not in PAGES_TO_UPDATE:
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            # Find large durations and reduce them to 0.5s, EXCEPT in AIThinking/SplashScreen/LocationMapPage
            if "AIThinking" not in file and "SplashScreen" not in file and "LocationMap" not in file:
                new_content = re.sub(r'duration:\s*(?:[1-9]|1\d)(?:\.\d+)?', 'duration: 0.5', content)
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Reduced durations in: {filepath}")

print("whileInView and duration optimization complete.")
