import os
import re

files = ['CustomerDashboard.jsx', 'CustomerProfile.jsx', 'CustomerVisitBriefing.jsx', 'CustomerMemoAssistant.jsx', 'CustomerRegistration1.jsx']

for fname in files:
    if not os.path.exists(fname): continue
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove Link wrapped tab
    content = re.sub(r'<Link to="/customer-management-visit-briefing" style={{ textDecoration: \'none\' }}>\s*<button className="cust-detail-tab">방문 브리핑</button>\s*</Link>', '', content)
    
    # Remove active tab in CustomerVisitBriefing
    content = content.replace('<button className="cust-detail-tab active">방문 브리핑</button>', '')
    
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)

print('Tab removed')
