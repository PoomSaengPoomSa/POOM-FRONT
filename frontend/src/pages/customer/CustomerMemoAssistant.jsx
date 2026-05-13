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

export default function CustomerMemoAssistant() {
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
            <Link to="/customer-management-visit-briefing" style={{ textDecoration: 'none' }}>
              <button className="cust-detail-tab">방문 브리핑</button>
            </Link>
            <button className="cust-detail-tab active">메모 어시스턴트</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="cust-detail-profile">
                <div className="cust-avatar pink">김</div>
                <h2>김OO</h2>
              </div>
              <MoreVertical className="cust-more-btn" size={20} />
            </div>
          </div>

          <div className="memo-layout-grid">
            {/* Memo Input */}
            <div className="memo-box">
              <div className="memo-box-title">메모 입력</div>
              <div className="memo-btn-group">
                <button className="memo-small-btn">OCR 업로드</button>
                <button className="memo-small-btn">샘플 불러오기</button>
                <button className="memo-small-btn" style={{ border: '1px solid #0284c7', color: '#0284c7' }}>AI 보고서 생성</button>
              </div>
              <textarea 
                className="memo-textarea" 
                placeholder="달러 자산 줄이고 싶다고. 국내 리츠 관심. 다음달 초 재방문."
                defaultValue="달러 자산 줄이고 싶다고. 국내 리츠 관심. 다음달 초 재방문."
              />
              <div className="memo-tip">
                💡 자유롭게 메모하세요. AI가 구조화된 상담 보고서로 변환합니다. OCR 버튼으로 손글씨 사진도 업로드 가능합니다.
              </div>
            </div>

            {/* AI Report */}
            <div className="memo-box">
              <div className="memo-box-title">
                AI 상담 보고서
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#22c55e', fontWeight: 500 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }}></span> 누적 1건
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
                2026.04.30 <span style={{ fontWeight: 400, color: '#94a3b8', marginLeft: 8 }}>달러 자산 비중 축소</span>
              </div>
              
              <table className="report-table">
                <tbody>
                  <tr><th>고객명</th><td>김OO (VIP)</td></tr>
                  <tr><th>총자산</th><td>32억 1234만</td></tr>
                  <tr><th>주요 니즈</th><td>달러 자산 비중 축소/국내 리츠 편입 검토</td></tr>
                  <tr><th>후속 조치</th><td>리츠 상품 비교안 준비</td></tr>
                  <tr><th>차기 상담</th><td>2026.05 초순</td></tr>
                </tbody>
              </table>

              <div className="report-actions">
                <button className="report-btn report-btn-primary">저장</button>
                <button className="report-btn report-btn-secondary">출력</button>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="timeline-box">
            <div className="memo-box-title" style={{ marginBottom: 24 }}>이전 상담 타임라인</div>
            
            <div className="timeline-item">
              <div className="timeline-dot">리츠</div>
              <div className="timeline-line"></div>
              <div className="timeline-content">
                <span className="timeline-date">2026.04.27</span>
                <span className="timeline-text">달러 약세로 해외자산 비중 조정 논의. 국내 리츠 관심 표명.</span>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot">채권</div>
              <div className="timeline-line"></div>
              <div className="timeline-content">
                <span className="timeline-date">2026.03.15</span>
                <span className="timeline-text">1분기 수익률 점검. 채권 비중 확대 제안 수락.</span>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot">리밸</div>
              <div className="timeline-line"></div>
              <div className="timeline-content">
                <span className="timeline-date">2026.01.08</span>
                <span className="timeline-text">연초 포트폴리오 리밸런싱. 국내주식 5% 추가 편입.</span>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot">절세</div>
              <div className="timeline-line"></div>
              <div className="timeline-content">
                <span className="timeline-date">2025.11.20</span>
                <span className="timeline-text">절세 계획 상담. ISA 계좌 추가 납입 결정.</span>
              </div>
            </div>
          </div>
        </div>
      <CustomerRegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
}
