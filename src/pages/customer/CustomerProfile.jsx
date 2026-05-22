import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CustomerRegistrationModal from "./CustomerRegistrationModal";
import { Calendar, TrendingUp, Users, Bell, Plus, Search, LogOut, MoreVertical, Trash2, Settings } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import "./Customer.css";


const allCustomers = [
  { id: 101, name: "강OO", email: "dohyun@naver.com", phone: "010-7134-2353", color: "yellow", initial: "강" },
  { id: 102, name: "강OO", email: "lsjshid@gmail.com", phone: "010-4563-2364", color: "green", initial: "강" },
  { id: 103, name: "고OO", email: "shiho@gmail.com", phone: "010-9291-1342", color: "red", initial: "고" },
  { id: 104, name: "김OO", email: "abcdefg@naver.com", phone: "010-0000-0000", color: "pink", initial: "김" },
  { id: 105, name: "김OO", email: "kim1004@gmail.com", phone: "010-4333-1245", color: "blue", initial: "김" },
  { id: 106, name: "김OO", email: "kimvils@naver.com", phone: "010-2214-3621", color: "gray", initial: "김" },
  { id: 107, name: "김OO", email: "ppjisd@naver.com", phone: "010-6335-2365", color: "purple", initial: "김" },
];

const customers = [
  { id: 1, name: "김OO", email: "abcdefg@naver.com", phone: "010-0000-0000", color: "pink", initial: "김", time: "10:00 AM" },
  { id: 2, name: "박OO", email: "erlkgjldfjgkld@gmail.com", phone: "010-1234-5678", color: "purple", initial: "박", time: "13:30 PM" },
  { id: 3, name: "이OO", email: "lgkesdl@gmail.com", phone: "010-9876-5432", color: "red", initial: "이", time: "15:00 PM" },
];

export default function CustomerProfile() {
  const location = useLocation();
  const path = location.pathname;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="cust-container">
      {/* Sidebar */}
      <Sidebar type="cust" />

      {/* Main Content */}
      <div className="cust-main">

        {/* Left Panel */}
        <div className={`cust-list-panel ${isModalOpen ? 'cust-blurred-content' : ''}`}>
          <div className="cust-list-header">
            <h2 className="cust-list-title">나의 고객</h2>
            <button className="cust-add-btn" onClick={() => setIsModalOpen(true)}><Plus size={16} /></button>
          </div>
          
          <div className="cust-search">
            <Search size={16} className="cust-search-icon" />
            <input 
              type="text" 
              className="cust-search-input" 
              placeholder="Search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="cust-list-tabs">
            <Link to="/customer-management-registration-1" style={{ textDecoration: "none", color: "inherit", flex: 1 }}><div className="cust-list-tab">전체 고객</div></Link>
            <div className="cust-list-tab active">오늘 방문</div>
          </div>

          <div className="cust-list-items">
            {filteredCustomers.map(c => (
              <div className={`cust-list-item ${selectedCustomerId === c.id ? 'active' : ''}`} key={c.id} onClick={() => setSelectedCustomerId(c.id)} style={{ cursor: 'pointer' }}>
                <div className={`cust-avatar ${c.color}`}>{c.initial}</div>
                <div className="cust-item-info">
                  <span className="cust-item-name">{c.name}</span>
                  <span className="cust-item-sub">{c.email}</span>
                  <span className="cust-item-sub">{c.phone}</span>
                </div>
                <div className="cust-item-time">{c.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Detail Panel */}
        <div key={selectedCustomerId} className={`cust-detail-panel ${isModalOpen ? 'cust-blurred-content' : ''}`}>
          <div className="cust-detail-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '24px' }}>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="cust-detail-profile">
                <div className={`cust-avatar ${selectedCustomer.color}`}>{selectedCustomer.initial}</div>
                <h2>{selectedCustomer.name}</h2>
              </div>
            </div>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="cust-detail-tabs" style={{ margin: 0 }}>
                <button className="cust-detail-tab active">프로필</button>
                <Link to="/customer-management-dashboard-2" style={{ textDecoration: 'none' }}>
                  <button className="cust-detail-tab">고객 대시보드</button>
                </Link>
                <Link to="/customer-management-memo-assistant" style={{ textDecoration: 'none' }}>
                  <button className="cust-detail-tab">메모 어시스턴트</button>
                </Link>
              </div>
              <button 
                onClick={() => setIsDeleteModalOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 6, border: '1px solid #e2e8f0', background: 'white', color: '#ef4444', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
              >
                <Trash2 size={14} />
                삭제하기
              </button>
            </div>
          </div>

          <div style={{ padding: '8px 24px 24px 24px' }}>
            {/* Header section with Contact btn */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 64, height: 64, background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#e2e8f0', border: '2px dashed #cbd5e1' }}>
                  {selectedCustomer.initial}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>{selectedCustomer.name}</span>
                    <span style={{ background: '#fef3c7', color: '#b45309', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 12 }}>VIP</span>
                    <span style={{ background: '#e2e8f0', color: '#64748b', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 12 }}>중립형</span>
                  </div>
                  <div style={{ fontSize: 14, color: '#64748b', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>📷</span> 중견기업 CEO
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setEditModalData(selectedCustomer)}
                style={{ background: '#0284c7', color: 'white', border: 'none', borderRadius: 6, padding: '8px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >
                수정하기
              </button>
            </div>

            {/* Profile Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 32 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>총 자산</label>
                <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: 8, fontSize: 14, color: '#0f172a' }}>16억</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>생년월일</label>
                <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: 8, fontSize: 14, color: '#0f172a' }}>1972.08.14</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>연락처</label>
                <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: 8, fontSize: 14, color: '#0f172a' }}>{selectedCustomer.phone}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>이메일</label>
                <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: 8, fontSize: 14, color: '#0f172a' }}>{selectedCustomer.email || "example@email.com"}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>주소</label>
                <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: 8, fontSize: 14, color: '#0f172a' }}>서울시 강남구</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>거래 시작일</label>
                <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: 8, fontSize: 14, color: '#0f172a' }}>2018.03.05</div>
              </div>
            </div>

            {/* Needs & Follow-up */}
            <div style={{ background: '#f0f9ff', border: '1px solid #e0f2fe', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>주요 니즈</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#0369a1' }}>달러 자산 비중 축소 / 국내 리츠 편입 검토</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>후속 조치</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#0284c7' }}>→ 리츠 상품 비교안 준비</span>
              </div>
            </div>
            
          </div>
        </div>
        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="cust-modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="cust-modal" style={{ width: 400, padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Trash2 size={24} color="#ef4444" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>고객 삭제 확인</h2>
              <p style={{ fontSize: 15, color: '#64748b', marginBottom: 32 }}>
                <strong style={{ color: '#0f172a' }}>{selectedCustomer.name}</strong> 고객을 삭제하겠습니까?
              </p>
              <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
                >
                  취소
                </button>
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: 8, border: 'none', background: '#ef4444', color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
        
      <CustomerRegistrationModal 
        isOpen={isModalOpen || !!editModalData} 
        onClose={() => { setIsModalOpen(false); setEditModalData(null); }} 
        initialData={editModalData}
      />
      </div>
    </div>
  );
}
