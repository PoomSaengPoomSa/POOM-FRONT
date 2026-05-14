import os
import re

files = ['CustomerDashboard.jsx', 'CustomerProfile.jsx', 'CustomerMemoAssistant.jsx', 'CustomerRegistration1.jsx']

for fname in files:
    if not os.path.exists(fname): continue
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = r'(<div className="cust-detail-header">)\s*(<div className="cust-detail-tabs" style={{ margin: 0 }}>.*?</div>)\s*(<div style={{ display: \'flex\', alignItems: \'center\', gap: \'16px\' }}>\s*<div className="cust-detail-profile">\s*<div className={`cust-avatar \${selectedCustomer\.color}`}>{selectedCustomer\.initial}</div>\s*<h2>{selectedCustomer\.name}</h2>\s*</div>\s*</div>)\s*(</div>)'
    
    def replacer(match):
        tabs_html = match.group(2)
        
        new_html = """<div className="cust-detail-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '24px' }}>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="cust-detail-profile">
                <div className={`cust-avatar ${selectedCustomer.color}`}>{selectedCustomer.initial}</div>
                <h2>{selectedCustomer.name}</h2>
              </div>
            </div>
""" + f"            {tabs_html}\n          </div>"
        return new_html
        
    content = re.sub(pattern, replacer, content, flags=re.DOTALL)
    
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)

print('Header swapped')
