import os
import re

files = [
    "DailyCalendar.jsx",
    "MonthlyCalendar.jsx",
    "WeeklyCalendar.jsx"
]

for filename in files:
    if not os.path.exists(filename):
        continue
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()

    if "import ScheduleRegistrationModal" not in content:
        content = content.replace('import "./CalendarNew.css";', 'import "./CalendarNew.css";\nimport ScheduleRegistrationModal from "./ScheduleRegistrationModal";')
        
        if "import { useState" not in content:
            content = "import { useState } from 'react';\n" + content

    if "const [isScheduleModalOpen" not in content:
        func_match = re.search(r'export default function \w+\(\) \{', content)
        if func_match:
            insert_pos = func_match.end()
            content = content[:insert_pos] + "\n  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);\n" + content[insert_pos:]

    if "<button className=\"cal-add-btn\"" in content and "onClick={() => setIsScheduleModalOpen(true)}" not in content:
        content = content.replace('<button className="cal-add-btn">', '<button className="cal-add-btn" onClick={() => setIsScheduleModalOpen(true)}>')

    if "<ScheduleRegistrationModal" not in content:
        content = content.replace("    </div>\n  );\n}", "      <ScheduleRegistrationModal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} />\n    </div>\n  );\n}")

    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)

print("Done")
