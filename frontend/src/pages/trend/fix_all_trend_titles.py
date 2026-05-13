import os
import glob
import re

files = glob.glob("*.jsx")

for filename in files:
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()
    
    new_content = re.sub(r'\s*<h1 className="trend-page-title">.*?</h1>', '', content, flags=re.DOTALL)
    
    if new_content != content:
        with open(filename, "w", encoding="utf-8") as f:
            f.write(new_content)

print("Done")
