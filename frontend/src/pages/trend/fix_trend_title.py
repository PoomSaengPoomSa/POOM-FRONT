import os

filename = "TrendArchive.jsx"
with open(filename, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('        <h1 className="trend-page-title">트렌드 아카이브</h1>\n', '')

with open(filename, "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
