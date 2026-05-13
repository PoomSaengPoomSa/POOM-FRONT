import os
import re

filename = "CustomerRegistration1.jsx"
with open(filename, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add UserCircle to imports
content = re.sub(r'(import \{.*?)( \}) (from "lucide-react";)', r'\1, UserCircle\2 \3', content)

# 2. Add state
old_state = "const [isModalOpen, setIsModalOpen] = useState(false);"
new_state = """const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeListTab, setActiveListTab] = useState('전체 고객');
  const [selectedCustomer, setSelectedCustomer] = useState(null);"""
content = content.replace(old_state, new_state)

# 3. Update tabs
old_tabs = """          <div className="cust-list-tabs">
            <div className="cust-list-tab">전체 고객</div>
            <div className="cust-list-tab active">오늘 방문</div>
          </div>"""
new_tabs = """          <div className="cust-list-tabs">
            <div className={`cust-list-tab ${activeListTab === '전체 고객' ? 'active' : ''}`} onClick={() => setActiveListTab('전체 고객')} style={{ cursor: 'pointer' }}>전체 고객</div>
            <div className={`cust-list-tab ${activeListTab === '오늘 방문' ? 'active' : ''}`} onClick={() => setActiveListTab('오늘 방문')} style={{ cursor: 'pointer' }}>오늘 방문</div>
          </div>"""
content = content.replace(old_tabs, new_tabs)

# 4. Update list items to set selectedCustomer
content = content.replace(
    '<div className="cust-list-item" key={c.id}>',
    '<div className="cust-list-item" key={c.id} onClick={() => setSelectedCustomer(c)} style={{ cursor: \'pointer\' }}>'
)

# 5. Wrap right panel
old_right_start = """        {/* Right Detail Panel */}
        <div className={`cust-detail-panel ${isModalOpen ? 'cust-blurred-content' : ''}`}>
          <div className="cust-detail-header">"""
new_right_start = """        {/* Right Detail Panel */}
        <div className={`cust-detail-panel ${isModalOpen ? 'cust-blurred-content' : ''}`}>
          {selectedCustomer ? (
            <>
          <div className="cust-detail-header">"""
content = content.replace(old_right_start, new_right_start)

# End of right panel is before <CustomerRegistrationModal
old_right_end = """          </div>
        </div>
      <CustomerRegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />"""
new_right_end = """          </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', textAlign: 'center', flex: 1, backgroundColor: '#f8fafc', borderRadius: 12 }}>
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                {activeListTab === '전체 고객' ? <UserCircle size={48} color="#0284c7" strokeWidth={2.5} /> : <Calendar size={48} color="#0284c7" strokeWidth={2.5} />}
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>{activeListTab === '전체 고객' ? '전체 고객 목록' : '오늘 방문 고객'}</h2>
              <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 40, whiteSpace: 'pre-wrap', color: '#94a3b8' }}>
                {activeListTab === '전체 고객' ? '왼쪽 목록에서 고객을 선택하면\\n상세 정보를 확인할 수 있어요.' : '왼쪽에서 오늘 방문 고객을 선택하면\\n상세 정보를 확인할 수 있어요.'}
              </p>
              {activeListTab === '전체 고객' && <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>고객 이름을 클릭해 프로필, 대시보드, 브리핑을 확인하세요</p>}
            </div>
          )}
        </div>
      <CustomerRegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />"""
content = content.replace(old_right_end, new_right_end)

with open(filename, "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
