import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, TrendingUp, Users, Bell, LogOut, X, Settings } from "lucide-react";
import "./News.css";

const initialCategories = [
  {
    title: "경제",
    items: [
      { text: "나스닥 +1.63% 역대 최고치 경신", date: "05.07" },
      { text: "코스닥 1,203 — 25년 만에 1,200 돌파", date: "05.07" }
    ]
  },
  {
    title: "정치",
    items: [
      { text: "KF-21 전투용 적합 판정...대한민국 '독자 전투기' 시대 개막", date: "05.07" },
      { text: "한병도 \"후반기 원구성 빈틈없이 준비...공백상황 용인 안해\"", date: "05.07" }
    ]
  },
  {
    title: "IT/과학",
    items: []
  }
];

export default function NewsBucket() {
  const location = useLocation();
  const path = location.pathname;

  const [categoriesData, setCategoriesData] = useState(initialCategories);

  const handleRemoveItem = (categoryIndex, itemIndex) => {
    const updatedCategories = [...categoriesData];
    updatedCategories[categoryIndex].items = updatedCategories[categoryIndex].items.filter((_, idx) => idx !== itemIndex);
    setCategoriesData(updatedCategories);
  };

  return (
    <div className="news-container">
      {/* Sidebar */}
      <div className="news-sidebar">
        <div className="news-logo">
          <div className="news-logo-circle"></div>
        </div>
        
        <div className="news-menu">
          <Link to="/daily-calendar" className={`news-menu-item ${path.includes('/calendar') ? 'active' : ''}`}>
            <Calendar size={20} />
            캘린더
          </Link>
          <Link to="/trend-archive" className={`news-menu-item ${path.includes('/trend') ? 'active' : ''}`}>
            <TrendingUp size={20} />
            트렌드 아카이브
          </Link>
          <Link to="/customer-management-memo-assistant" className={`news-menu-item ${path.includes('/customer-management') ? 'active' : ''}`}>
            <Users size={20} />
            고객관리
          </Link>
          <Link to="/news-bucket-bucket" className={`news-menu-item ${path.includes('/news-bucket') ? 'active' : ''}`}>
            <Bell size={20} />
            뉴스 버킷
          </Link>
          <Link to="/settings" className={`news-menu-item ${path.includes('/settings') ? 'active' : ''}`}>
            <Settings size={20} />
            설정
          </Link>
        </div>

        <div className="news-profile">
          <img src="https://i.pravatar.cc/150?img=11" alt="Profile" />
          <div className="news-profile-info">
            <span className="news-profile-name">김재욱</span>
            <span className="news-profile-role">Private Banker</span>
          </div>
          <LogOut onClick={() => window.location.href='/login-pb'} size={16} color="#94a3b8" style={{ marginLeft: 'auto', cursor: 'pointer' }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="news-main">
        
        <div className="news-content-card">
          <div className="news-page-title" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              버킷 <span className="news-page-subtitle">오늘의 메시지 뉴스 저장소</span>
            </div>
            <Link to="/news-archive" style={{ textDecoration: 'none' }}>
              <button style={{ padding: '8px 16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', color: '#64748b', cursor: 'pointer', fontWeight: '500' }}>
                뉴스 아카이브로 가기
              </button>
            </Link>
          </div>

          <div className="news-tabs">
            <button className="news-tab active">버킷</button>
            <Link to="/news-bucket-message-draft" style={{ textDecoration: 'none' }}>
              <button className="news-tab">문자 초안</button>
            </Link>
          </div>

          <div className="news-stats-row">
            <div className="news-stat-box">
              <span className="news-stat-label">버킷 저장 수</span>
              <span className="news-stat-value">4</span>
              <span className="news-stat-sub">오늘의 메시지 용</span>
            </div>
            <div className="news-stat-box">
              <span className="news-stat-label">카테고리 수</span>
              <span className="news-stat-value">2</span>
              <span className="news-stat-sub">분류됨</span>
            </div>
            <div className="news-stat-box">
              <span className="news-stat-label">미저장 뉴스</span>
              <span className="news-stat-value">00</span>
              <span className="news-stat-sub">오늘 전체</span>
            </div>
            <div className="news-stat-box">
              <span className="news-stat-label">초안 상태</span>
              <span className="news-stat-value" style={{ color: '#000' }}>준비</span>
              <span className="news-stat-sub">LLM 자동생성</span>
            </div>
          </div>

          <div className="news-editor-container" style={{ padding: 24 }}>
            <div className="news-editor-label" style={{ marginBottom: 16 }}>버킷 - 카테고리별</div>
            
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {categoriesData.map((cat, idx) => (
                <div key={idx} style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>{cat.title}</div>
                  {cat.items.map((item, i) => (
                    <div key={i} style={{ 
                      backgroundColor: 'white', 
                      borderRadius: 8, 
                      padding: '16px 20px', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: 8,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}>
                      <span style={{ fontSize: 14, color: '#0f172a', fontWeight: 600 }}>{item.text}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span style={{ fontSize: 13, color: '#64748b' }}>{item.date}</span>
                        <X size={16} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => handleRemoveItem(idx, i)} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="news-actions">
            <Link to="/news-bucket-message-draft" style={{ textDecoration: 'none' }}>
              <button className="news-btn news-btn-primary">LLM 문자 초안 생성</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
