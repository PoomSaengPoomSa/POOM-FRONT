import { Link, useLocation } from "react-router-dom";
import { Calendar, TrendingUp, Users, Bell, LogOut, MoreHorizontal } from "lucide-react";
import "./Trend.css";

export default function EconomicIndicatorArchive() {
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

        <div className="trend-tabs">
          <button className="trend-tab active">금값</button>
          <button className="trend-tab" style={{ background: 'white', color: '#64748b' }}>부동산</button>
          <button className="trend-tab" style={{ background: 'white', color: '#64748b' }}>금리</button>
        </div>

        <div style={{ position: 'absolute', right: 32, top: 96, cursor: 'pointer' }}>
          <MoreHorizontal size={24} color="#94a3b8" />
        </div>

        <div className="eco-grid">
          {/* Chart 1 */}
          <div className="eco-box" style={{ gridRow: 'span 2' }}>
            <div className="eco-box-title">금값 추이·예측</div>
            <div style={{ flex: 1, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, fontSize: 10, color: '#94a3b8' }}>ECOS - FRED</div>
              <svg viewBox="0 0 400 300" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <path d="M 0 200 C 50 150, 100 200, 150 100 S 250 150, 250 150" fill="none" stroke="#0f172a" strokeWidth="2" />
                <path d="M 250 150 C 300 150, 350 100, 400 50" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="250" cy="150" r="4" fill="#0f172a" />
                <text x="250" y="130" fontSize="12" fill="#0f172a" textAnchor="middle">오늘</text>
              </svg>
            </div>
          </div>

          {/* Stats */}
          <div className="eco-box">
            <div className="eco-box-title">금값 추이·예측</div>
            <div className="indicator-stats" style={{ marginTop: 'auto' }}>
              <div className="indicator-stat-col">
                <span className="indicator-stat-label">어제</span>
                <span className="indicator-stat-value">83</span>
                <span className="indicator-stat-change up" style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: 4 }}>▲ +14.5%</span>
              </div>
              <div className="indicator-stat-col">
                <span className="indicator-stat-label">오늘</span>
                <span className="indicator-stat-value large" style={{ fontSize: 48 }}>95</span>
                <span className="indicator-stat-label">현재가</span>
              </div>
              <div className="indicator-stat-col">
                <span className="indicator-stat-label">내일</span>
                <span className="indicator-stat-value">85</span>
                <span className="indicator-stat-change down" style={{ background: '#fee2e2', color: '#ef4444', padding: '2px 8px', borderRadius: 4 }}>▼ -10.5%</span>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="eco-box">
            <div className="eco-box-title">예측 기여도</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'conic-gradient(#a855f7 0% 32%, #c084fc 32% 57%, #22c55e 57% 80%, #e2e8f0 80% 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 10, color: '#64748b' }}>금값 예측</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#0ea5e9' }}>핵심 변수</span>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#334155' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 12, height: 12, borderRadius: 2, background: '#a855f7' }}></span>달러 인덱스</span>
                  <span>32%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#334155' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 12, height: 12, borderRadius: 2, background: '#c084fc' }}></span>인플레이션</span>
                  <span>25%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#334155' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 12, height: 12, borderRadius: 2, background: '#22c55e' }}></span>금리</span>
                  <span>23%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#334155' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 12, height: 12, borderRadius: 2, background: '#e2e8f0' }}></span>지정학적리스크</span>
                  <span>20%</span>
                </div>
              </div>
            </div>
          </div>

          {/* LLM Report */}
          <div className="eco-box" style={{ background: 'white' }}>
            <div className="eco-box-title">LLM 보고서</div>
            <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.8, marginBottom: 24 }}>
              향후 12개월간 금값은 3,890달러 수준으로 완만한 상승이 예상됩니다. 미 연준의 금리 인하 기조와 지정학적 불안이 주요 상승 요인입니다. 한국 기준금리는 2.50%까지 단계적 인하가 전망되며, 서울 아파트 시장의 회복세를 지지할 것으로 보입니다. PB 포트폴리오 관점에 . . . 
              <Link to="/economic-indicator-archive-llm-report" style={{ textDecoration: 'none' }}>
                <span style={{ color: '#0284c7', cursor: 'pointer' }}>더보기</span>
              </Link>
            </div>
            <div style={{ fontSize: 9, color: '#94a3b8', textAlign: 'right', marginTop: 'auto' }}>
              생성: 2026-04-27 08:00 | XGBoost+Claude Sonnet 기반 LSTM | ECOS, FRED
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
