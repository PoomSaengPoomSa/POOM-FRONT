import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CustomerRegistrationModal from "./CustomerRegistrationModal";
import { Calendar, TrendingUp, Users, Bell, Plus, Search, LogOut, MoreVertical } from "lucide-react";
import "./Customer.css";

const customers = [
  { id: 1, name: "김OO", email: "abcdefg@naver.com", phone: "010-0000-0000", color: "pink", initial: "김", time: "10:00 AM" },
  { id: 2, name: "박OO", email: "erlkgjldfjgkld@gmail.com", phone: "010-1234-5678", color: "purple", initial: "박", time: "13:30 PM" },
  { id: 3, name: "이OO", email: "lgkesdl@gmail.com", phone: "010-9876-5432", color: "red", initial: "이", time: "15:00 PM" },
];

export default function CustomerProfile() {
  const location = useLocation();
  const path = location.pathname;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(1);
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  return (
    <div className="cust-container">
      {/* Sidebar */}
      <div className="cust-sidebar">
        <div className="cust-logo">
          <div className="cust-logo-circle"></div>
        </div>
        
        <div className="cust-menu">
          <Link to="/daily-calendar" className={`cust-menu-item ${path.includes('/calendar') ? 'active' : ''}`}>
            <Calendar size={20} />
            캘린더
          </Link>
          <Link to="/trend-archive" className={`cust-menu-item ${path.includes('/trend') ? 'active' : ''}`}>
            <TrendingUp size={20} />
            트렌드 아카이브
          </Link>
          <Link to="/customer-management-registration-1" className={`cust-menu-item ${path.includes('/customer-management') ? 'active' : ''}`}>
            <Users size={20} />
            고객관리
            <span className="cust-badge">23</span>
          </Link>
          <Link to="/news-bucket-bucket" className={`cust-menu-item ${path.includes('/news-bucket') ? 'active' : ''}`}>
            <Bell size={20} />
            뉴스 버킷
          </Link>
        </div>

        <div className="cust-profile">
          <img src="https://i.pravatar.cc/150?img=11" alt="Profile" />
          <div className="cust-profile-info">
            <span className="cust-profile-name">김재욱</span>
            <span className="cust-profile-role">Private Banker</span>
          </div>
          <LogOut onClick={() => window.location.href='/login-pb'} size={16} color="#94a3b8" style={{ marginLeft: 'auto', cursor: 'pointer' }} />
        </div>
      </div>

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
            <input type="text" className="cust-search-input" placeholder="Search" />
          </div>

          <div className="cust-list-tabs">
            <div className="cust-list-tab">전체 고객</div>
            <div className="cust-list-tab active">오늘 방문</div>
          </div>

          <div className="cust-list-items">
            {customers.map(c => (
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
          <div className="cust-detail-header">
            <div className="cust-detail-tabs" style={{ margin: 0 }}>
              <button className="cust-detail-tab active">프로필</button>
            <Link to="/customer-management-dashboard-2" style={{ textDecoration: 'none' }}>
              <button className="cust-detail-tab">고객 대시보드</button>
            </Link>
            <Link to="/customer-management-visit-briefing" style={{ textDecoration: 'none' }}>
              <button className="cust-detail-tab">방문 브리핑</button>
            </Link>
            <Link to="/customer-management-memo-assistant" style={{ textDecoration: 'none' }}>
              <button className="cust-detail-tab">메모 어시스턴트</button>
            </Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="cust-detail-profile">
                <div className={`cust-avatar ${selectedCustomer.color}`}>{selectedCustomer.initial}</div>
                <h2>{selectedCustomer.name}</h2>
              </div>
              <MoreVertical className="cust-more-btn" size={20} />
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
            </div>

            {/* Profile Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 32 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>총 자산</label>
                <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: 8, fontSize: 14, color: '#0f172a' }}>16억</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>연령</label>
                <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: 8, fontSize: 14, color: '#0f172a' }}>만 54</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>거래 시작일</label>
                <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: 8, fontSize: 14, color: '#0f172a' }}>2018.03.05</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>최근 상담</label>
                <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: 8, fontSize: 14, color: '#0f172a' }}>2026.01.11</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>다음 방문</label>
                <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: 8, fontSize: 14, color: '#0f172a' }}>2026.05.02</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>연락처</label>
                <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: 8, fontSize: 14, color: '#0f172a' }}>{selectedCustomer.phone}</div>
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
      <CustomerRegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
}
