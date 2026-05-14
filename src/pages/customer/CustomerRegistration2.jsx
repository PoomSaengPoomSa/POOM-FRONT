import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, TrendingUp, Users, Bell, Plus, Search, LogOut, Camera, X, Settings } from "lucide-react";
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
  { id: 1, name: "김OO", email: "abcdefg@naver.com", phone: "010-0000-0000", color: "pink", initial: "김" },
  { id: 2, name: "박OO", email: "erlkgjldfjgkld@gmail.com", phone: "010-1234-5678", color: "purple", initial: "박" },
  { id: 3, name: "이OO", email: "lgkesdl@gmail.com", phone: "010-9876-5432", color: "red", initial: "이" },
];

export default function CustomerRegistration2() {
  const location = useLocation();
  const path = location.pathname;
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
            <span className="cust-badge">{allCustomers.length}</span>
          </Link>
          <Link to="/news-bucket-bucket" className={`cust-menu-item ${path.includes('/news-bucket') ? 'active' : ''}`}>
            <Bell size={20} />
            뉴스 버킷
          </Link>
          <Link to="/settings" className={`cust-menu-item ${path.includes('/settings') ? 'active' : ''}`}>
            <Settings size={20} />
            설정
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
        <div className="cust-page-title-wrap">
          <h1 className="cust-page-title">고객 관리 - 고객등록2</h1>
        </div>

        {/* Blurred Dashboard Content */}
        <div className="cust-list-panel cust-blurred-content">
          <div className="cust-list-header">
            <h2 className="cust-list-title">나의 고객</h2>
            <button className="cust-add-btn"><Plus size={16} /></button>
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
            <Link to="/customer-management-registration-1" style={{ textDecoration: "none", color: "inherit", flex: 1 }}><div className="cust-list-tab active">전체 고객</div></Link>
            <div className="cust-list-tab">오늘 방문</div>
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
              </div>
            ))}
          </div>
        </div>

        <div key={selectedCustomerId} className="cust-detail-panel cust-blurred-content">
          <div className="cust-detail-header">
            <div className="cust-detail-profile">
              <div className={`cust-avatar ${selectedCustomer.color}`}>{selectedCustomer.initial}</div>
              <h2>{selectedCustomer.name}</h2>
            </div>
          </div>
        </div>

        {/* Modal Overlay */}
        <div className="cust-modal-overlay">
          <div className="cust-modal">
            <button className="cust-modal-close"><X size={16} /></button>
            <h2 className="cust-modal-title">신규 고객 등록</h2>

            <div className="cust-modal-tabs">
              <button className="cust-modal-tab">기본 정보</button>
              <button className="cust-modal-tab active">자산·거래</button>
            </div>

            <div className="cust-modal-content">
              <div className="cust-modal-profile-upload">
                <div className="icon-box"><Camera size={20} /></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>프로필 사진 업로드</span>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>업로드 없으면 이니셜로 자동 표시됩니다</span>
                </div>
              </div>

              <div className="cust-form-section-title">자산 정보</div>
              <div className="cust-form-grid">
                <div className="cust-form-group">
                  <label className="cust-form-label">총자산 <span className="req">*</span></label>
                  <input type="text" className="cust-form-input" placeholder="예: 32억" />
                </div>
                <div className="cust-form-group">
                  <label className="cust-form-label">투자 성향 <span className="req">*</span></label>
                  <select className="cust-form-input" style={{ width: '100%', appearance: 'auto' }}>
                    <option></option>
                  </select>
                </div>
              </div>

              <div className="cust-form-section-title">포트폴리오 비중 (%)</div>
              <div className="cust-form-grid" style={{ marginBottom: 0 }}>
                <div className="cust-form-group">
                  <label className="cust-form-label" style={{ color: '#0284c7' }}>국내주식</label>
                  <input type="text" className="cust-form-input" placeholder="0" />
                </div>
                <div className="cust-form-group">
                  <label className="cust-form-label" style={{ color: '#0284c7' }}>해외주식</label>
                  <input type="text" className="cust-form-input" placeholder="0" />
                </div>
                <div className="cust-form-group">
                  <label className="cust-form-label" style={{ color: '#0284c7' }}>채권</label>
                  <input type="text" className="cust-form-input" placeholder="0" />
                </div>
                <div className="cust-form-group">
                  <label className="cust-form-label" style={{ color: '#0284c7' }}>현금 · 기타</label>
                  <input type="text" className="cust-form-input" placeholder="0" />
                </div>
              </div>
            </div>

            <div className="cust-modal-actions" style={{ justifyContent: 'center', gap: 16 }}>
              <Link to="/customer-management-registration-1" style={{ textDecoration: 'none' }}>
                <button className="cust-btn cust-btn-outline" style={{ border: '1px solid #e2e8f0' }}>이전</button>
              </Link>
              <Link to="/customer-management-memo-assistant" style={{ textDecoration: 'none' }}>
                <button className="cust-btn cust-btn-primary">저장</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
