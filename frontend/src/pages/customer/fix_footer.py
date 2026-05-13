import os

filename = "CustomerRegistrationModal.jsx"
with open(filename, "r", encoding="utf-8") as f:
    content = f.read()

old_footer = """        <div className="cust-modal-actions" style={{ display: 'flex', justifyContent: activeTab === '자산·거래' ? 'space-between' : 'center', gap: 16, width: '100%' }}>
          {activeTab === '자산·거래' && (
            <button className="cust-btn cust-btn-outline" style={{ border: '1px solid #e2e8f0', color: '#0284c7', background: 'white' }} onClick={() => setActiveTab('기본 정보')}>이전</button>
          )}
          <div style={{ display: 'flex', gap: 16, marginLeft: activeTab === '자산·거래' ? 'auto' : 0 }}>
            <button className="cust-btn cust-btn-outline" style={{ border: '1px solid #e2e8f0', color: '#0284c7', background: 'white' }} onClick={onClose}>취소</button>
            <button className="cust-btn cust-btn-primary" onClick={() => {
              if (activeTab === '기본 정보') setActiveTab('자산·거래');
              else onClose();
            }}>
              {activeTab === '기본 정보' ? '다음' : '저장'}
            </button>
          </div>
        </div>"""

new_footer = """        <div className="cust-modal-actions" style={{ justifyContent: 'center', gap: 16 }}>
          <button className="cust-btn cust-btn-outline" style={{ border: 'none', color: '#0284c7' }} onClick={onClose}>취소</button>
          <button className="cust-btn cust-btn-primary" onClick={() => {
            if (activeTab === '기본 정보') setActiveTab('자산·거래');
            else onClose();
          }}>
            {activeTab === '기본 정보' ? '다음' : '저장'}
          </button>
        </div>"""

content = content.replace(old_footer, new_footer)

with open(filename, "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
