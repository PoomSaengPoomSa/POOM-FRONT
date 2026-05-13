import { Link, useLocation } from "react-router-dom";
import { Calendar, TrendingUp, Users, Bell, LogOut, Search, MoreHorizontal, Calendar as CalendarIcon, Star, ChevronLeft, ChevronRight } from "lucide-react";
import "./Trend.css";

const archiveNews = [
  { id: 1, type: "경제", title: "셀트리온, 美 소화기학회서 자가면역질환 치료제 '램시마SC' 임상 데이터 공개", date: "12 Dec, 2020", color: "green" },
  { id: 2, type: "정치", title: "[속보] 국힘 \"후대통령 '비읍시옷' 발언 경악\"", date: "12 Dec, 2020", color: "pink" },
  { id: 3, type: "경제", title: "카카오, 1분기 영업익 2114억원...전년비 66%↑", date: "12 Dec, 2020", color: "green" },
  { id: 4, type: "경제", title: "HMM 나무호 예인선 도착...오늘 오전 중 작업 시작", date: "12 Dec, 2020", color: "green" },
  { id: 5, type: "정치", title: "국산 전투기 시대 열렸다...KF-21, 전투용 적합 판정", date: "12 Dec, 2020", color: "pink" },
  { id: 6, type: "IT/과학", title: "카카오, 에이전틱 AI 속도...\"카톡 내 탐색부터 결제까지\"", date: "12 Dec, 2020", color: "blue" },
  { id: 7, type: "경제", title: "삼성바이오 노사 갈등 격화...\"불법행위 엄정 대응\" vs \"억지 고소\"", date: "12 Dec, 2020", color: "green" },
];

export default function NewsArchive() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="trend-container">
      {/* Sidebar */}
      <div className="trend-sidebar">
        <div className="trend-logo">
          <div className="trend-logo-circle"></div>
        </div>
        
        <div className="trend-menu">
          <Link to="/daily-calendar" className={`trend-menu-item ${path.includes('/calendar') ? 'active' : ''}`}>
            <Calendar size={20} />
            캘린더
          </Link>
          <Link to="/trend-archive" className={`trend-menu-item ${path.includes('/trend') || path.includes('/economic') || path.includes('/news-archive') ? 'active' : ''}`}>
            <TrendingUp size={20} />
            트렌드 아카이브
          </Link>
          <Link to="/customer-management-registration-1" className="trend-menu-item">
            <Users size={20} />
            고객관리
          </Link>
          <Link to="/news-bucket-bucket" className="trend-menu-item">
            <Bell size={20} />
            뉴스 버킷
          </Link>
        </div>

        <div className="trend-profile">
          <img src="https://i.pravatar.cc/150?img=11" alt="Profile" />
          <div className="trend-profile-info">
            <span className="trend-profile-name">김재욱</span>
            <span className="trend-profile-role">Private Banker</span>
          </div>
          <LogOut onClick={() => window.location.href='/login-pb'} size={16} color="#94a3b8" style={{ marginLeft: 'auto', cursor: 'pointer' }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="trend-main">

        <div className="trend-section-box" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <div className="trend-tabs" style={{ marginBottom: 0 }}>
              <button className="trend-tab active">전체</button>
              <button className="trend-tab" style={{ background: 'white', color: '#64748b' }}>경제</button>
              <button className="trend-tab" style={{ background: 'white', color: '#64748b' }}>정치</button>
              <button className="trend-tab" style={{ background: 'white', color: '#64748b' }}>IT/과학</button>
            </div>
            
            <div className="news-arch-search">
              <input type="text" placeholder="Search" />
              <Search size={14} color="#94a3b8" style={{ position: 'absolute', right: 12, top: 9 }} />
            </div>
          </div>

          <div className="news-arch-list">
            {archiveNews.map(item => (
              <Link to="/news-archive-details" key={item.id} style={{ textDecoration: 'none' }}>
                <div className="news-arch-item">
                  <span className={`news-arch-badge ${item.color}`}>{item.type}</span>
                  <span className="news-arch-title">{item.title}</span>
                  <div className="news-arch-meta">
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CalendarIcon size={14} color="#38bdf8" /> {item.date}</span>
                    <Star size={16} className="news-arch-star" fill="#fbbf24" />
                    <MoreHorizontal size={16} color="#94a3b8" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 'auto', paddingTop: 24 }}>
            <ChevronLeft size={16} color="#94a3b8" cursor="pointer" />
            <span style={{ fontSize: 14, fontWeight: 600 }}>1</span>
            <ChevronRight size={16} color="#94a3b8" cursor="pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}
