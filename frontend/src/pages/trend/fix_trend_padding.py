import os

css_file = "Trend.css"
with open(css_file, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("  padding: 32px;", "  padding: 16px 32px;")

with open(css_file, "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
