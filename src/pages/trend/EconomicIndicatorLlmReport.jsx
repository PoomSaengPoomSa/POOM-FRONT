import { Link, useLocation } from "react-router-dom";
import { Calendar, TrendingUp, Users, Bell, LogOut, MoreHorizontal, Activity, Home, DollarSign, X } from "lucide-react";
import "./Trend.css";

export default function EconomicIndicatorLlmReport() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="trend-container" style={{ position: 'relative' }}>
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

      {/* Main Content (Blurred) */}
      <div className="trend-main cust-blurred-content">

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
          <div className="eco-box">
            <div className="eco-box-title">금값 추이·예측</div>
            <div style={{ height: 160, position: 'relative', marginTop: 16 }}>
              <div style={{ position: 'absolute', top: -16, right: 0, fontSize: 10, color: '#94a3b8' }}>ECOS - FRED</div>
              <svg viewBox="0 40 400 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
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
                {/* Legend items */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#334155' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 12, height: 12, borderRadius: 2, background: '#a855f7' }}></span>달러 인덱스</span>
                  <span>32%</span>
                </div>
                {/* ... other legend items */}
              </div>
            </div>
          </div>

          {/* LLM Report Placeholder */}
          <div className="eco-box">
            <div className="eco-box-title">LLM 보고서</div>
            <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.8, marginBottom: 24 }}>
              향후 12개월간 금값은 3,890달러 수준으로 완만한 상승이 예상됩니다...
            </div>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      <div className="cust-modal-overlay" style={{ left: 240, background: 'rgba(15, 23, 42, 0.4)' }}>
        <div className="news-arch-modal" style={{ top: 80, bottom: 80, left: '10%', right: '10%', padding: '40px', overflowY: 'auto' }}>
          <Link to="/economic-indicator-archive" style={{ position: 'absolute', top: 24, right: 24 }}>
            <button className="news-mod-close"><X size={20} color="#64748b" /></button>
          </Link>

          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 32 }}>금리 예측 모델 SHAP 분석 보고서</h2>

          <div style={{ background: '#f8fafc', padding: '24px 32px', borderRadius: 12, borderLeft: '4px solid #cbd5e1' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 16px 0' }}>기준 금리 추이 예측에 대한 근거</h3>
            
            <div style={{ fontSize: 14, color: '#0f172a', lineHeight: 1.8 }}>
              <p style={{ fontWeight: 700 }}>1. 글로벌 핵심 피처 요약 및 편향성 진단 (Top 3)</p>
              <p style={{ fontWeight: 700 }}>1.1. 모델이 판단한 가장 중요한 예측 변수 3가지</p>
              <ul style={{ paddingLeft: 24, margin: '8px 0 16px 0', color: '#334155' }}>
                <li style={{ marginBottom: 8 }}>
                  <span style={{ fontWeight: 600 }}>미국 소비자물가지수 YoY (us_cpi_yoy)</span>: 평균 SHAP 값 0.1247로 가장 중요한 변수 중 하나로, 특히 '동결'과 '인상' 클래스에서 높은 중요도를 보입니다. 이는 미국 경제의 인플레이션 상황이 한국의 금리 결정에 큰 영향을 미친다는 점에서 경제학적 상식에 부합합니다.
                </li>
                <li style={{ marginBottom: 8 }}>
                  <span style={{ fontWeight: 600 }}>WTI 유가 YoY (wti_oil_yoy)</span>: 평균 SHAP 값 0.1220으로 두 번째로 중요한 변수입니다. '인상' 클래스에서 특히 높은 중요도를 보이며, 이는 유가 상승이 인플레이션 압력을 가중시켜 금리 인상 요인으로 작용할 수 있음을 시사합니다.
                </li>
                <li>
                  <span style={{ fontWeight: 600 }}>한국 소비자물가지수 YoY (kr_cpi_yoy)</span>: 평균 SHAP 값 0.1210으로 세 번째로 중요한 변수입니다. '인하' 클래스에서 가장 높은 중요도를 보이며, 이는 국내 인플레이션이 금리 인하의 주요 요인임을 나타냅니다.
                </li>
              </ul>

              <p style={{ fontWeight: 700 }}>1.2. 모델의 편향성 진단</p>
              <p style={{ color: '#334155', marginBottom: 16 }}>
                모델이 상식적인 경제 지표에 기반하여 금리 변동을 예측하고 있으나, 일부 지표에 대한 과도한 의존이 우려됩니다. 예를 들어, WTI 유가 YoY는 '인상' 클래스에서 매우 높은 중요도를 보이지만, 이는 단순한 상관관계일 수 있습니다. 유가 변동은 다양한 외부 요인에 의해 영향을 받을 수 있으며, 금리 결정에 있어서는 보다 복합적인 경제 상황을 고려해야 합니다.
              </p>

              <p style={{ fontWeight: 700 }}>2. 클래스별(인하/동결/인상) 특징적 인사이트 정리</p>
              {/* Add more content if needed to match the scroll, but this is enough to show the UI */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
