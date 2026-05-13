import { Link, useLocation } from "react-router-dom";
import { Calendar, TrendingUp, Users, Bell, LogOut, MoreHorizontal, ChevronDown, Activity, Home, DollarSign, ChevronRight } from "lucide-react";
import "./Trend.css";

const newsItems = {
  economy: [
    "코스피 2,700 돌파 — 사상 최고치 3일 연속 경신. 'Sell in May' 격언 유효 여부 주목",
    "삼성전자 어닝 서프라이즈 — 1분기 영업이익 57.2조 원(+756%), 주가 장중 23만 원 돌파·신고가",
    "반도체 ETF 수익률 폭등 — AI반도체 관련 ETF 4월 한 달간 40-45% 수익률 기록"
  ],
  politics: [
    "부산 북구갑 3자 구도 확정 — 하정우(민주당) vs 한동훈(무소속) vs 국민의힘 후보",
    "한동훈 \"나와 이재명의 대리전\" — 반이재명 구도 프레임 강조, 지역 공약 부재 지적도",
    "미니 총선 14곳 확정 — 지방선거와 동시 실시, 민주당 우세 지역 12곳"
  ],
  it: [
    "스탠퍼드 AI 인덱스 2026 — 생성형 AI가 단순 기술이 아닌 \"지배 인프라\"로 산업·국가 시스템 재편",
    "오픈AI, MS 독점 파트너십 종료 — 아마존 AWS와도 협업 개시, 앤디 재시 CEO 공식 발표",
    "LG CNS 1분기 실적 — 매출 1조 3,150억·영업익 942억, AI·클라우드 성장 견인"
  ]
};

export default function TrendArchive() {
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

        {/* News Archive Section */}
        <div className="trend-section-box">
          <Link to="/news-archive" style={{ textDecoration: 'none' }}>
            <h2 className="trend-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>뉴스 아카이브</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#0ea5e9', fontWeight: 600, background: '#f0f9ff', padding: '6px 12px', borderRadius: 20 }}>
                자세히 보기 <ChevronRight size={16} />
              </div>
            </h2>
          </Link>

          <div className="trend-news-grid">
            <div className="trend-news-col">
              <div className="trend-news-col-title">경제 <ChevronDown size={16} color="#cbd5e1" /></div>
              {newsItems.economy.map((item, i) => (
                <div key={i} className="trend-news-item">{item}</div>
              ))}
            </div>
            <div className="trend-news-col">
              <div className="trend-news-col-title">정치 <ChevronDown size={16} color="#cbd5e1" /></div>
              {newsItems.politics.map((item, i) => (
                <div key={i} className="trend-news-item">{item}</div>
              ))}
            </div>
            <div className="trend-news-col">
              <div className="trend-news-col-title">IT/과학 <ChevronDown size={16} color="#cbd5e1" /></div>
              {newsItems.it.map((item, i) => (
                <div key={i} className="trend-news-item">{item}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Economic Indicator Archive Section */}
        <div className="trend-section-box">
          <Link to="/economic-indicator-archive" style={{ textDecoration: 'none' }}>
            <h2 className="trend-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>경제지표 아카이브</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#0ea5e9', fontWeight: 600, background: '#f0f9ff', padding: '6px 12px', borderRadius: 20 }}>
                자세히 보기 <ChevronRight size={16} />
              </div>
            </h2>
          </Link>

          <div className="trend-indicator-grid">
            {/* Gold */}
            <div className="indicator-card">
              <div className="indicator-title">
                <div className="indicator-icon"><Activity size={20} color="#0f172a" /></div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>금값</span>
                  <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>Gold Price</span>
                </div>
              </div>
              <div className="indicator-stats">
                <div className="indicator-stat-col">
                  <span className="indicator-stat-label">어제</span>
                  <span className="indicator-stat-value">83</span>
                </div>
                <div className="indicator-stat-col">
                  <span className="indicator-stat-label">오늘</span>
                  <span className="indicator-stat-value large">95</span>
                  <span className="indicator-stat-change up">▲ 14.5%</span>
                </div>
                <div className="indicator-stat-col">
                  <span className="indicator-stat-label">내일</span>
                  <span className="indicator-stat-value">85</span>
                  <span className="indicator-stat-change down">▼ -10.5%</span>
                </div>
              </div>
              <svg viewBox="0 0 100 30" style={{ width: '100%', height: 40, fill: 'none', stroke: '#3b82f6', strokeWidth: 2 }}>
                <path d="M 0 20 Q 25 30 50 20 T 100 10" />
                <circle cx="50" cy="20" r="3" fill="#3b82f6" />
              </svg>
            </div>

            {/* Real Estate */}
            <div className="indicator-card">
              <div className="indicator-title">
                <div className="indicator-icon"><Home size={20} color="#0f172a" /></div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>부동산 가격지수</span>
                  <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>Real Estate Price</span>
                </div>
              </div>
              <div className="indicator-stats">
                <div className="indicator-stat-col">
                  <span className="indicator-stat-label">어제</span>
                  <span className="indicator-stat-value">100.4</span>
                </div>
                <div className="indicator-stat-col">
                  <span className="indicator-stat-label">오늘</span>
                  <span className="indicator-stat-value large">100.3</span>
                  <span className="indicator-stat-change down">▼</span>
                </div>
                <div className="indicator-stat-col">
                  <span className="indicator-stat-label">내일</span>
                  <span className="indicator-stat-value">100.2</span>
                  <span className="indicator-stat-change down">▼</span>
                </div>
              </div>
              <svg viewBox="0 0 100 30" style={{ width: '100%', height: 40, fill: 'none', stroke: '#3b82f6', strokeWidth: 2 }}>
                <path d="M 0 15 Q 25 15 50 25 T 100 20" />
                <circle cx="50" cy="25" r="3" fill="#3b82f6" />
              </svg>
            </div>

            {/* Base Rate */}
            <div className="indicator-card">
              <div className="indicator-title">
                <div className="indicator-icon"><DollarSign size={20} color="#0f172a" /></div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>기준 금리</span>
                  <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>Base Rate</span>
                </div>
              </div>
              <div className="indicator-stats">
                <div className="indicator-stat-col">
                  <span className="indicator-stat-label">지난 달</span>
                  <span className="indicator-stat-value">2.0</span>
                </div>
                <div className="indicator-stat-col">
                  <span className="indicator-stat-label">이번 달</span>
                  <span className="indicator-stat-value large">2.5</span>
                  <span className="indicator-stat-change up">▲</span>
                </div>
                <div className="indicator-stat-col">
                  <span className="indicator-stat-label">다음 달</span>
                  <span className="indicator-stat-value">2.0</span>
                  <span className="indicator-stat-change down">▼</span>
                </div>
              </div>
              <svg viewBox="0 0 100 30" style={{ width: '100%', height: 40, fill: 'none', stroke: '#3b82f6', strokeWidth: 2 }}>
                <path d="M 0 25 L 45 25 L 50 15 L 100 15" />
                <circle cx="50" cy="15" r="3" fill="#3b82f6" />
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
