import os

files = ['CustomerDashboard.jsx', 'CustomerProfile.jsx', 'CustomerVisitBriefing.jsx', 'CustomerMemoAssistant.jsx', 'CustomerRegistration2.jsx']

for fname in files:
    if not os.path.exists(fname): continue
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to replace the style in the Link tag for the tabs
    old_style = 'style={{ textDecoration: "none", color: "inherit" }}><div className="cust-list-tab'
    new_style = 'style={{ textDecoration: "none", color: "inherit", flex: 1 }}><div className="cust-list-tab'
    
    content = content.replace(old_style, new_style)

    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)
print('Done width fix!')
