import os
import re

filename = "CustomerRegistration1.jsx"
with open(filename, "r", encoding="utf-8") as f:
    content = f.read()

old_customers = """const customers = [
  { id: 1, name: "김OO", email: "abcdefg@naver.com", phone: "010-0000-0000", color: "pink", initial: "김", time: "10:00 AM" },
  { id: 2, name: "박OO", email: "erlkgjldfjgkld@gmail.com", phone: "010-1234-5678", color: "purple", initial: "박", time: "13:30 PM" },
  { id: 3, name: "이OO", email: "lgkesdl@gmail.com", phone: "010-9876-5432", color: "red", initial: "이", time: "15:00 PM" },
];"""

new_customers = """const allCustomers = [
  { id: 101, name: "강OO", email: "dohyun@naver.com", phone: "010-7134-2353", color: "yellow", initial: "강" },
  { id: 102, name: "강OO", email: "lsjshid@gmail.com", phone: "010-4563-2364", color: "green", initial: "강" },
  { id: 103, name: "고OO", email: "shiho@gmail.com", phone: "010-9291-1342", color: "red", initial: "고" },
  { id: 104, name: "김OO", email: "abcdefg@naver.com", phone: "010-0000-0000", color: "pink", initial: "김" },
  { id: 105, name: "김OO", email: "kim1004@gmail.com", phone: "010-4333-1245", color: "blue", initial: "김" },
  { id: 106, name: "김OO", email: "kimvils@naver.com", phone: "010-2214-3621", color: "gray", initial: "김" },
  { id: 107, name: "김OO", email: "ppjisd@naver.com", phone: "010-6335-2365", color: "purple", initial: "김" },
];

const todayCustomers = [
  { id: 1, name: "김OO", email: "abcdefg@naver.com", phone: "010-0000-0000", color: "pink", initial: "김", time: "10:00 AM" },
  { id: 2, name: "박OO", email: "erlkgjldfjgkld@gmail.com", phone: "010-1234-5678", color: "purple", initial: "박", time: "13:30 PM" },
  { id: 3, name: "이OO", email: "lgkesdl@gmail.com", phone: "010-9876-5432", color: "red", initial: "이", time: "15:00 PM" },
];"""

content = content.replace(old_customers, new_customers)

old_list_render = """          <div className="cust-list-items">
            {customers.map(c => (
              <div className="cust-list-item" key={c.id} onClick={() => setSelectedCustomer(c)} style={{ cursor: 'pointer' }}>
                <div className={`cust-avatar ${c.color}`}>{c.initial}</div>
                <div className="cust-item-info">
                  <span className="cust-item-name">{c.name}</span>
                  <span className="cust-item-sub">{c.email}</span>
                  <span className="cust-item-sub">{c.phone}</span>
                </div>
                <div className="cust-item-time">{c.time}</div>
              </div>
            ))}
          </div>"""

new_list_render = """          <div className="cust-list-items">
            {(activeListTab === '전체 고객' ? allCustomers : todayCustomers).map(c => (
              <div className="cust-list-item" key={c.id} onClick={() => { if (activeListTab === '오늘 방문') setSelectedCustomer(c); }} style={{ cursor: activeListTab === '오늘 방문' ? 'pointer' : 'default' }}>
                <div className={`cust-avatar ${c.color}`}>{c.initial}</div>
                <div className="cust-item-info">
                  <span className="cust-item-name">{c.name}</span>
                  <span className="cust-item-sub">{c.email}</span>
                  <span className="cust-item-sub">{c.phone}</span>
                </div>
                {c.time && <div className="cust-item-time">{c.time}</div>}
              </div>
            ))}
          </div>"""

content = content.replace(old_list_render, new_list_render)

old_tabs = """            <div className={`cust-list-tab ${activeListTab === '전체 고객' ? 'active' : ''}`} onClick={() => setActiveListTab('전체 고객')} style={{ cursor: 'pointer' }}>전체 고객</div>
            <div className={`cust-list-tab ${activeListTab === '오늘 방문' ? 'active' : ''}`} onClick={() => setActiveListTab('오늘 방문')} style={{ cursor: 'pointer' }}>오늘 방문</div>"""

new_tabs = """            <div className={`cust-list-tab ${activeListTab === '전체 고객' ? 'active' : ''}`} onClick={() => { setActiveListTab('전체 고객'); setSelectedCustomer(null); }} style={{ cursor: 'pointer' }}>전체 고객</div>
            <div className={`cust-list-tab ${activeListTab === '오늘 방문' ? 'active' : ''}`} onClick={() => { setActiveListTab('오늘 방문'); setSelectedCustomer(null); }} style={{ cursor: 'pointer' }}>오늘 방문</div>"""

content = content.replace(old_tabs, new_tabs)

with open(filename, "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
