import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, TrendingUp, Users, Bell, LogOut, MoreHorizontal, ChevronDown, Activity, Home, DollarSign, ChevronRight, X, Settings } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import { api } from "../../api";
import "./Trend.css";

export default function TrendArchive() {
  const location = useLocation();
  const path = location.pathname;
  
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);
  const [isLoadingNewsDetail, setIsLoadingNewsDetail] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    api.trend.getDashboard()
      .then(data => {
        setDashboardData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("트렌드 대시보드 조회 실패:", err);
        setIsLoading(false);
      });
  }, []);

  const handleNewsClick = (item) => {
    setIsLoadingNewsDetail(true);

    api.trend.getNewsDetail(item.id)
      .then(detail => {
        const categoryMap = { "경제": "경제", "정치": "정치", "IT/과학": "IT/과학", economy: "경제", politics: "정치", it: "IT/과학", itScience: "IT/과학" };
        const colorMap = { "경제": "green", "정치": "pink", "IT/과학": "blue", economy: "green", politics: "pink", it: "blue", itScience: "blue" };

        setSelectedNewsItem({
          title: detail.title,
          type: categoryMap[detail.category] || "경제",
          color: colorMap[detail.category] || "green",
          body: detail.body || "기사 본문이 존재하지 않습니다.",
          references: detail.tags ? detail.tags : []
        });
        setIsLoadingNewsDetail(false);
      })
      .catch(err => {
        console.error("뉴스 상세 로드 실패:", err);
        setIsLoadingNewsDetail(false);
      });
  };

  const newsItems = dashboardData?.news || { economy: [], politics: [], itScience: [], it: [] };
  const indicators = dashboardData?.indicators || null;

  return (
    <div className="trend-container">
      {/* Sidebar */}
      <Sidebar type="trend" />

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
            {isLoading ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#64748b', gridColumn: 'span 3' }}>데이터를 불러오는 중입니다...</div>
            ) : (
              <>
                <div className="trend-news-col">
                  <div className="trend-news-col-title">경제 <ChevronDown size={16} color="#cbd5e1" /></div>
                  {newsItems.economy.length === 0 ? (
                    <div style={{ fontSize: 12, color: '#94a3b8', padding: '8px 0' }}>최신 뉴스가 없습니다.</div>
                  ) : (
                    newsItems.economy.map((item, i) => (
                      <div key={i} className="trend-news-item" onClick={() => handleNewsClick(item)} style={{ cursor: 'pointer' }}>{item.title}</div>
                    ))
                  )}
                </div>
                <div className="trend-news-col">
                  <div className="trend-news-col-title">정치 <ChevronDown size={16} color="#cbd5e1" /></div>
                  {newsItems.politics.length === 0 ? (
                    <div style={{ fontSize: 12, color: '#94a3b8', padding: '8px 0' }}>최신 뉴스가 없습니다.</div>
                  ) : (
                    newsItems.politics.map((item, i) => (
                      <div key={i} className="trend-news-item" onClick={() => handleNewsClick(item)} style={{ cursor: 'pointer' }}>{item.title}</div>
                    ))
                  )}
                </div>
                <div className="trend-news-col">
                  <div className="trend-news-col-title">IT/과학 <ChevronDown size={16} color="#cbd5e1" /></div>
                  {(newsItems.itScience || newsItems.it).length === 0 ? (
                    <div style={{ fontSize: 12, color: '#94a3b8', padding: '8px 0' }}>최신 뉴스가 없습니다.</div>
                  ) : (
                    (newsItems.itScience || newsItems.it).map((item, i) => (
                      <div key={i} className="trend-news-item" onClick={() => handleNewsClick(item)} style={{ cursor: 'pointer' }}>{item.title}</div>
                    ))
                  )}
                </div>
              </>
            )}
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
            {/* Gold (이중 분류 - 상승/하락) */}
            <div className="indicator-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="indicator-title">
                <div className="indicator-icon"><Activity size={20} color="#0f172a" /></div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>금값</span>
                  <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>Gold Price</span>
                </div>
              </div>
              <div style={{ margin: '8px 0 8px 0', fontSize: 12, color: 'var(--trend-text-muted)', fontWeight: 600 }}>내일 예측</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
                {/* 상승 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                  <span style={{ color: 'var(--trend-text-main)', fontWeight: 600, width: 24 }}>상승</span>
                  <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 3, margin: '0 8px', overflow: 'hidden' }}>
                    <div style={{ width: '73%', height: '100%', background: '#ef4444', borderRadius: 3 }}></div>
                  </div>
                  <span style={{ fontWeight: 700, color: '#ef4444', width: 28, textAlign: 'right' }}>73%</span>
                </div>
                {/* 하락 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                  <span style={{ color: 'var(--trend-text-main)', fontWeight: 600, width: 24 }}>하락</span>
                  <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 3, margin: '0 8px', overflow: 'hidden' }}>
                    <div style={{ width: '27%', height: '100%', background: '#3b82f6', borderRadius: 3 }}></div>
                  </div>
                  <span style={{ fontWeight: 700, color: '#3b82f6', width: 28, textAlign: 'right' }}>27%</span>
                </div>
              </div>
              
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--trend-text-main)', borderTop: '1px solid var(--trend-border)', paddingTop: 8, marginTop: 'auto' }}>
                예측: <span style={{ color: '#ef4444' }}>상승 가능성 높음</span>
              </div>
            </div>

            {/* Real Estate (회귀 - 시계열) */}
            <div className="indicator-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="indicator-title">
                <div className="indicator-icon"><Home size={20} color="#0f172a" /></div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>부동산 가격지수</span>
                  <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>Real Estate Price</span>
                </div>
              </div>
              <div style={{ margin: '8px 0 8px 0', fontSize: 12, color: 'var(--trend-text-muted)', fontWeight: 600 }}>다음달 예측</div>
              
              <div className="indicator-stats" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div className="indicator-stat-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span className="indicator-stat-label">지난 달</span>
                  <span className="indicator-stat-value" style={{ fontSize: 13, color: 'var(--trend-text-muted)', fontWeight: 500 }}>{isLoading ? "..." : (indicators?.realEstate?.yesterday ?? "-")}</span>
                </div>
                <div className="indicator-stat-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span className="indicator-stat-label">이번 달</span>
                  <span className="indicator-stat-value" style={{ fontSize: 13, color: 'var(--trend-text-muted)', fontWeight: 500 }}>{isLoading ? "..." : (indicators?.realEstate?.today ?? "-")}</span>
                </div>
                <div className="indicator-stat-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                  <span className="indicator-stat-label" style={{ color: '#3b82f6', fontWeight: 700 }}>다음 달</span>
                  <span className="indicator-stat-value large" style={{ fontSize: 36, fontWeight: 700, lineHeight: 1, color: '#3b82f6' }}>{isLoading ? "..." : (indicators?.realEstate?.tomorrow ?? "-")}</span>
                  {!isLoading && indicators?.realEstate && indicators.realEstate.changeRate !== undefined && indicators.realEstate.changeDirection && (
                    <span className={`indicator-stat-change ${indicators.realEstate.changeDirection}`} style={{
                      position: 'absolute', bottom: -18, 
                      background: indicators.realEstate.changeDirection === 'up' ? '#dcfce7' : indicators.realEstate.changeDirection === 'down' ? '#fee2e2' : '#f1f5f9',
                      color: indicators.realEstate.changeDirection === 'up' ? '#16a34a' : indicators.realEstate.changeDirection === 'down' ? '#ef4444' : '#64748b',
                      padding: '1px 6px', borderRadius: 4, fontSize: 9, fontWeight: 700
                    }}>
                      {indicators.realEstate.changeDirection === 'up' ? '▲ +' : indicators.realEstate.changeDirection === 'down' ? '▼ -' : '▬ '}
                      {Math.abs(indicators.realEstate.changeRate)}%
                    </span>
                  )}
                </div>
              </div>
              <div style={{ height: 40, marginTop: 'auto' }}>
                <svg viewBox="0 0 100 30" style={{ width: '100%', height: '100%', fill: 'none', stroke: '#3b82f6', strokeWidth: 2 }}>
                  <path d="M 0 15 Q 25 15 50 25 T 100 20" />
                  <circle cx="50" cy="25" r="3" fill="#3b82f6" />
                </svg>
              </div>
            </div>

            {/* Base Rate (다중 분류 - 인하/동결/인상) */}
            <div className="indicator-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="indicator-title">
                <div className="indicator-icon"><DollarSign size={20} color="#0f172a" /></div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>기준 금리</span>
                  <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>Base Rate</span>
                </div>
              </div>
              <div style={{ margin: '8px 0 8px 0', fontSize: 12, color: 'var(--trend-text-muted)', fontWeight: 600 }}>다음달 예측</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
                {/* 인하 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                  <span style={{ color: 'var(--trend-text-main)', fontWeight: 600, width: 24 }}>인하</span>
                  <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 3, margin: '0 8px', overflow: 'hidden' }}>
                    <div style={{ width: '45%', height: '100%', background: '#3b82f6', borderRadius: 3 }}></div>
                  </div>
                  <span style={{ fontWeight: 700, color: '#3b82f6', width: 28, textAlign: 'right' }}>45%</span>
                </div>
                {/* 동결 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                  <span style={{ color: 'var(--trend-text-main)', fontWeight: 600, width: 24 }}>동결</span>
                  <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 3, margin: '0 8px', overflow: 'hidden' }}>
                    <div style={{ width: '38%', height: '100%', background: '#94a3b8', borderRadius: 3 }}></div>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--trend-text-muted)', width: 28, textAlign: 'right' }}>38%</span>
                </div>
                {/* 인상 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                  <span style={{ color: 'var(--trend-text-main)', fontWeight: 600, width: 24 }}>인상</span>
                  <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 3, margin: '0 8px', overflow: 'hidden' }}>
                    <div style={{ width: '17%', height: '100%', background: '#ef4444', borderRadius: 3 }}></div>
                  </div>
                  <span style={{ fontWeight: 700, color: '#ef4444', width: 28, textAlign: 'right' }}>17%</span>
                </div>
              </div>
              
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--trend-text-main)', borderTop: '1px solid var(--trend-border)', paddingTop: 8, marginTop: 'auto' }}>
                예측: <span style={{ color: '#3b82f6' }}>인하 가능성 높음</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Modal Overlay */}
      {selectedNewsItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="news-arch-modal" style={{ position: 'relative', top: 'auto', left: 'auto', right: 'auto', bottom: 'auto', width: '900px', height: '80vh', maxWidth: '90%', maxHeight: '90%', margin: 0 }}>
            <div className="news-mod-header">
              <span className={`news-arch-badge ${selectedNewsItem.color}`} style={{ fontSize: 16, padding: '12px 24px' }}>{selectedNewsItem.type}</span>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }}>
                {selectedNewsItem.title}
              </h2>
              <button onClick={() => setSelectedNewsItem(null)} className="news-mod-close">
                <X size={20} color="#64748b" />
              </button>
            </div>

            <div className="news-mod-content-wrap" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              <div className="news-mod-main" style={{ flex: 1, padding: '16px 32px', overflowY: 'auto', fontSize: 13, color: '#334155', lineHeight: 1.8 }}>
                {selectedNewsItem.body.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading Detail Modal */}
      {isLoadingNewsDetail && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(3px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '20px 40px', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', color: '#0ea5e9', fontWeight: 600 }}>
            기사 내용을 불러오는 중입니다...
          </div>
        </div>
      )}
    </div>
  );
}
