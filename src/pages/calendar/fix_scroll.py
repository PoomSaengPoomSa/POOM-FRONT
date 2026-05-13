import os

css_file = "CalendarNew.css"
with open(css_file, "r", encoding="utf-8") as f:
    content = f.read()

old_modal = """.cal-modal {
  width: 480px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
  padding: 32px;
  position: relative;
  display: flex;
  flex-direction: column;
}"""

new_modal = """.cal-modal {
  width: 480px;
  max-height: 90vh;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
  padding: 32px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.cal-modal-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
}

.cal-modal-content::-webkit-scrollbar {
  width: 6px;
}
.cal-modal-content::-webkit-scrollbar-track {
  background: transparent;
}
.cal-modal-content::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}"""

content = content.replace(old_modal, new_modal)

old_actions = """.cal-modal-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
}"""

new_actions = """.cal-modal-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  flex-shrink: 0;
}"""

content = content.replace(old_actions, new_actions)

with open(css_file, "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
