import os

css_file = "Customer.css"
with open(css_file, "r", encoding="utf-8") as f:
    content = f.read()

if ".cust-modal-actions {" not in content:
    content += """
.cust-modal-actions {
  display: flex;
  margin-top: 32px;
  flex-shrink: 0;
}
"""
    with open(css_file, "w", encoding="utf-8") as f:
        f.write(content)

print("Done")
