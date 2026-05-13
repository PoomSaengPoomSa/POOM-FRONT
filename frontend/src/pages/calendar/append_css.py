import os

css_file = "CalendarNew.css"
with open(css_file, "a", encoding="utf-8") as f:
    f.write("""

/* Schedule Registration Modal */
.cal-modal-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cal-modal {
  width: 480px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
  padding: 32px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.cal-modal-close {
  position: absolute;
  top: 24px;
  right: 24px;
  color: var(--cal-primary);
  background: #e0f2fe;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
}

.cal-modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 24px 0;
}

.cal-form-section-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--cal-primary);
  margin-bottom: 16px;
}

.cal-form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.cal-form-label {
  font-size: 12px;
  font-weight: 600;
  color: #334155;
}

.cal-form-label span.req {
  color: #ef4444;
}

.cal-category-tabs {
  display: flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 12px;
  gap: 4px;
}

.cal-category-tab {
  flex: 1;
  padding: 10px 0;
  border-radius: 8px;
  border: none;
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
}

.cal-category-tab.active {
  background: white;
  color: #0f172a;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  font-weight: 600;
}

.cal-form-input {
  padding: 12px 16px;
  background: #f8fafc;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 13px;
  color: #0f172a;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

.cal-form-input:focus {
  border-color: var(--cal-primary);
  background: white;
}

.cal-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.cal-input-icon-wrap {
  position: relative;
}

.cal-input-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--cal-primary);
}

.cal-input-icon.search {
  color: #94a3b8;
}

.cal-color-picker {
  display: flex;
  gap: 12px;
  align-items: center;
}

.cal-color-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
}

.cal-color-circle.active {
  border-color: #cbd5e1;
  transform: scale(1.1);
}

.bg-yellow { background-color: #fef08a; }
.bg-blue { background-color: #bfdbfe; }
.bg-pink { background-color: #fbcfe8; }
.bg-purple { background-color: #e9d5ff; }
.bg-lightblue { background-color: #bae6fd; }
.bg-orange { background-color: #fed7aa; }

.cal-form-textarea {
  padding: 12px 16px;
  background: #f8fafc;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 13px;
  color: #0f172a;
  outline: none;
  width: 100%;
  height: 80px;
  resize: none;
  box-sizing: border-box;
}

.cal-modal-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
}

.cal-btn {
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cal-btn-outline {
  background: white;
  border: 1px solid var(--cal-border);
  color: var(--cal-primary);
  border: none;
}

.cal-btn-primary {
  background: var(--cal-primary);
  border: 1px solid var(--cal-primary);
  color: white;
}
""")
print("Done")
