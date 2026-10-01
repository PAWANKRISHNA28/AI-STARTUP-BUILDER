import re

filepath = r"c:\Users\mpawa\OneDrive\Desktop\AI STARTUP BUILDER\frontend\src\services\api.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace: const res = await fetch(
# With: const res = await fetchWithCache(
new_content = content.replace('await fetch(', 'await fetchWithCache(')

# Replace: return handleResponse(res);
# With: return res;
new_content = new_content.replace('return handleResponse(res);', 'return res;')

# Ensure fetchWithCache is correctly updated if it matched itself
# Because we have: async function fetchWithCache(url: string, options: RequestInit = {}) { ... const res = await fetch(url, options); ... }
# Wait, fetchWithCache definition will also be changed!
# Let's fix that back.
new_content = new_content.replace('const res = await fetchWithCache(url, options);', 'const res = await fetch(url, options);')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("api.ts updated.")
