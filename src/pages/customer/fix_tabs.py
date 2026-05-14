import os

files = ['CustomerDashboard.jsx', 'CustomerProfile.jsx', 'CustomerVisitBriefing.jsx', 'CustomerMemoAssistant.jsx', 'CustomerRegistration2.jsx']

all_cust_str = """
const allCustomers = [
  { id: 101, name: "강OO", email: "dohyun@naver.com", phone: "010-7134-2353", color: "yellow", initial: "강" },
  { id: 102, name: "강OO", email: "lsjshid@gmail.com", phone: "010-4563-2364", color: "green", initial: "강" },
  { id: 103, name: "고OO", email: "shiho@gmail.com", phone: "010-9291-1342", color: "red", initial: "고" },
  { id: 104, name: "김OO", email: "abcdefg@naver.com", phone: "010-0000-0000", color: "pink", initial: "김" },
  { id: 105, name: "김OO", email: "kim1004@gmail.com", phone: "010-4333-1245", color: "blue", initial: "김" },
  { id: 106, name: "김OO", email: "kimvils@naver.com", phone: "010-2214-3621", color: "gray", initial: "김" },
  { id: 107, name: "김OO", email: "ppjisd@naver.com", phone: "010-6335-2365", color: "purple", initial: "김" },
];

const customers = ["""

for fname in files:
    if not os.path.exists(fname): continue
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'const allCustomers =' not in content:
        content = content.replace('const customers = [', all_cust_str)
    
    content = content.replace('{customers.length}', '{allCustomers.length}')
    
    old_tab1 = '<div className="cust-list-tab">전체 고객</div>'
    new_tab1 = '<Link to="/customer-management-registration-1" style={{ textDecoration: "none", color: "inherit" }}><div className="cust-list-tab">전체 고객</div></Link>'
    content = content.replace(old_tab1, new_tab1)

    old_tab2 = '<div className="cust-list-tab active">전체 고객</div>'
    new_tab2 = '<Link to="/customer-management-registration-1" style={{ textDecoration: "none", color: "inherit" }}><div className="cust-list-tab active">전체 고객</div></Link>'
    content = content.replace(old_tab2, new_tab2)

    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)
print('Done!')
