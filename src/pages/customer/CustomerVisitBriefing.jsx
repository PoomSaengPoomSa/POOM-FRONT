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

export default function CustomerVisitBriefing() {
  const location = useLocation();
  const path = location.pathname;
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              <div className="cust-list-item" key={c.id}>
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
        <div className={`cust-detail-panel ${isModalOpen ? 'cust-blurred-content' : ''}`}>
          <div className="cust-detail-header">
            <div className="cust-detail-tabs" style={{ margin: 0 }}>
              <Link to="/customer-management-profile" style={{ textDecoration: 'none' }}>
              <button className="cust-detail-tab">프로필</button>
            </Link>
            <Link to="/customer-management-dashboard-2" style={{ textDecoration: 'none' }}>
              <button className="cust-detail-tab">고객 대시보드</button>
            </Link>
            <button className="cust-detail-tab active">방문 브리핑</button>
            <Link to="/customer-management-memo-assistant" style={{ textDecoration: 'none' }}>
              <button className="cust-detail-tab">메모 어시스턴트</button>
            </Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="cust-detail-profile">
                <div className="cust-avatar pink">김</div>
                <h2>김OO</h2>
              </div>
              <MoreVertical className="cust-more-btn" size={20} />
            </div>
          </div>

          <div className="briefing-box">
            <div className="briefing-title">방문 예정 브리핑</div>

            <div className="briefing-section">
              <div className="briefing-label">방문일정</div>
              <div className="briefing-text">2026.05.06</div>
            </div>

            <div className="briefing-section">
              <div className="briefing-label">브리핑 요약</div>
              <div className="briefing-text">
                오전 10시 방문 예정, 최근 달러 약세 영향으로 해외 자산 비중 조정 니즈 있음. 국내 리츠 상품 3종 비교안 준비 필요. 코스닥 1,200 돌파. Fed 동결 뉴스 관련 설명 준비 권장.
              </div>
            </div>

            <div className="briefing-section">
              <div className="briefing-label">주요 니즈</div>
              <div className="briefing-text">달러 자산 비중 축소 / 국내 리츠 편입 검토.</div>
            </div>

            <div className="briefing-section">
              <div className="briefing-label">준비 사항</div>
              <div className="briefing-text">리츠 상품 비교안 준비</div>
            </div>
          </div>

          <div className="briefing-actions">
            <button className="cust-btn cust-btn-primary" style={{ padding: '10px 20px' }}>슬랙으로 발송</button>
            <button className="cust-btn cust-btn-outline" style={{ padding: '10px 20px', border: 'none', background: '#f8fafc' }}>캘린더 추가</button>
            <button className="cust-btn cust-btn-outline" style={{ padding: '10px 20px', border: 'none', background: '#f8fafc' }}>재생성</button>
            
            <div style={{ marginLeft: 'auto', fontSize: 11, color: '#94a3b8' }}>
              4건 - 클릭하면 메모와 요약 열림
            </div>
          </div>

        </div>
      <CustomerRegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
}
