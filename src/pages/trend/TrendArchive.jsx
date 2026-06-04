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
  const [activeBriefingTab, setActiveBriefingTab] = useState("economy");

  const renderSummaryList = (summaryText) => {
    if (!summaryText) return <li>실시간 AI 요약 브리핑을 준비 중입니다.</li>;
    
    const lines = summaryText
      .split("\n")
      .map(line => line.replace(/^-\s*/, "").trim())
      .filter(line => line.length > 0);
      
    if (lines.length === 0) {
      return <li>실시간 AI 요약 브리핑을 준비 중입니다.</li>;
    }
    
    return lines.map((line, idx) => (
      <li key={idx}>{line}</li>
    ));
  };

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
        const categoryMap = { "경제": "경제", "정치": "정치", "국제": "국제", "사회": "국제", economy: "경제", politics: "정치", international: "국제", it: "국제", itScience: "국제", "IT/과학": "국제" };
        const colorMap = { "경제": "green", "정치": "pink", "국제": "blue", "사회": "blue", economy: "green", politics: "pink", international: "blue", it: "blue", itScience: "blue", "IT/과학": "blue" };

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

  const newsItems = dashboardData?.news || { economy: [], politics: [], international: [], itScience: [], it: [] };
  const indicators = dashboardData?.indicators || null;

  const goldProbRise = indicators?.gold?.probRise ?? null;
  const goldProbFall = indicators?.gold?.probFall ?? null;
  const goldPredText = indicators?.gold?.predictionText ?? "예측 데이터 없음";

  const brProbCut = indicators?.interestRate?.probCut ?? null;
  const brProbFreeze = indicators?.interestRate?.probFreeze ?? null;
  const brProbHike = indicators?.interestRate?.probHike ?? null;
  const brPredText = indicators?.interestRate?.predictionText ?? "예측 데이터 없음";

  return (
    <div className="trend-container">
      {/* Sidebar */}
      <Sidebar type="trend" />

      {/* Main Content */}
      <div className="trend-main">
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

          {/* 실시간 트렌드 요약 바 */}
          <div className="realtime-trend-bar">
            <div className="realtime-trend-title-container">
              <span className="realtime-trend-bullet"></span>
              <span className="realtime-trend-title-text">실시간 트렌드</span>
            </div>
            
            <div className="realtime-trend-list">
              {(dashboardData?.realtimeTrends || []).map((item, idx, arr) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div className="realtime-trend-item">
                    <span className="realtime-trend-item-name">{item.name}</span>
                    <div className="realtime-trend-item-value-row">
                      <span className="realtime-trend-item-value">{item.value}</span>
                      {item.unit && <span className="realtime-trend-item-unit">{item.unit}</span>}
                      <span className={`realtime-trend-item-rate ${item.direction === 'up' ? 'trend-color-up' : item.direction === 'down' ? 'trend-color-down' : 'trend-color-flat'}`}>
                        {item.direction === 'up' ? '↑ ' : item.direction === 'down' ? '↓ ' : '▬ '}
                        {item.rate}
                      </span>
                    </div>
                  </div>
                  {idx < arr.length - 1 && <div className="realtime-trend-divider"></div>}
                </div>
              ))}
            </div>
          </div>

          <div className="trend-indicator-grid">
            {/* Gold (금값) */}
            <div className="indicator-card horizontal-card">
              <div className="indicator-card-left" style={{ justifyContent: 'space-between' }}>
                <div className="indicator-title-row">
                  <div className="indicator-icon"><Activity size={20} color="#0f172a" /></div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="indicator-name-main">금값</span>
                    <span className="indicator-name-sub">Gold Price</span>
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: goldProbRise > goldProbFall ? '#ef4444' : '#3b82f6', marginTop: 'auto', marginBottom: 2 }}>
                  예측: {goldPredText}
                </div>
              </div>

              <div className="indicator-card-right" style={{ justifyContent: 'flex-start', gap: 6 }}>
                <span className="indicator-predict-label" style={{ marginBottom: 4 }}>내일 예측</span>
                {/* 상승 */}
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 12, width: '100%' }}>
                  <span style={{ color: 'var(--trend-text-main)', fontWeight: 600, width: 28 }}>상승</span>
                  <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 3, margin: '0 8px', overflow: 'hidden' }}>
                    <div style={{ width: `${goldProbRise ?? 0}%`, height: '100%', background: '#ef4444', borderRadius: 3 }}></div>
                  </div>
                  <span style={{ fontWeight: 700, color: '#ef4444', width: 30, textAlign: 'right' }}>
                    {goldProbRise !== null && goldProbRise !== undefined ? `${goldProbRise}%` : "-"}
                  </span>
                </div>
                {/* 하락 */}
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 12, width: '100%' }}>
                  <span style={{ color: 'var(--trend-text-main)', fontWeight: 600, width: 28 }}>하락</span>
                  <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 3, margin: '0 8px', overflow: 'hidden' }}>
                    <div style={{ width: `${goldProbFall ?? 0}%`, height: '100%', background: '#3b82f6', borderRadius: 3 }}></div>
                  </div>
                  <span style={{ fontWeight: 700, color: '#3b82f6', width: 30, textAlign: 'right' }}>
                    {goldProbFall !== null && goldProbFall !== undefined ? `${goldProbFall}%` : "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Real Estate (부동산 가격지수) */}
            <div className="indicator-card horizontal-card" style={{ position: 'relative' }}>
              <div className="indicator-card-left" style={{ justifyContent: 'space-between', zIndex: 1 }}>
                <div className="indicator-title-row">
                  <div className="indicator-icon"><Home size={20} color="#0f172a" /></div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="indicator-name-main">부동산 가격지수</span>
                    <span className="indicator-name-sub">Real Estate Price</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: 12, marginBottom: 2 }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>지난 달</span>
                    <span style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>
                      {isLoading ? "..." : (indicators?.realEstate?.yesterday ?? "-")}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>이번 달</span>
                    <span style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>
                      {isLoading ? "..." : (indicators?.realEstate?.today ?? "-")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="indicator-card-right" style={{ justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 1 }}>
                <span className="indicator-predict-label">다음달 예측</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: 'auto', marginBottom: 2 }}>
                  <span style={{ fontSize: 24, fontWeight: 800, color: '#2563eb', fontFamily: "'Inter', sans-serif", lineHeight: 1.1 }}>
                    {isLoading ? "..." : (indicators?.realEstate?.tomorrow ?? "-")}
                  </span>
                  {!isLoading && indicators?.realEstate && indicators.realEstate.changeRate !== undefined && (
                    <span style={{ 
                      fontSize: 11, 
                      fontWeight: 700, 
                      color: indicators.realEstate.changeDirection === 'up' ? '#ef4444' : '#3b82f6',
                      marginTop: 2 
                    }}>
                      {indicators.realEstate.changeDirection === 'up' ? '▲ +' : '▼ -'}
                      {Math.abs(indicators.realEstate.changeRate)}%
                    </span>
                  )}
                </div>
              </div>
              
              {/* Background Micro Sparkline */}
              <div style={{ 
                position: 'absolute', 
                left: 0, 
                right: 0, 
                bottom: 0, 
                height: 32, 
                opacity: 0.35, 
                pointerEvents: 'none' 
              }}>
                <svg viewBox="0 0 100 35" style={{ width: '100%', height: '100%', fill: 'none', stroke: '#3b82f6', strokeWidth: 2 }}>
                  <path d="M 0 25 Q 20 28 40 20 T 70 24 T 100 15" />
                  <circle cx="100" cy="15" r="3" fill="#3b82f6" />
                </svg>
              </div>
            </div>

            {/* Base Rate (기준 금리) */}
            <div className="indicator-card horizontal-card">
              <div className="indicator-card-left" style={{ justifyContent: 'space-between' }}>
                <div className="indicator-title-row">
                  <div className="indicator-icon"><DollarSign size={20} color="#0f172a" /></div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="indicator-name-main">기준 금리</span>
                    <span className="indicator-name-sub">Base Rate</span>
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#475569', marginTop: 'auto', marginBottom: 2 }}>
                  예측: {brPredText.replace(" 가능성 높음", "")} 가능성 높음
                </div>
              </div>

              <div className="indicator-card-right" style={{ justifyContent: 'flex-start', gap: 4 }}>
                <span className="indicator-predict-label" style={{ marginBottom: 4 }}>다음달 예측</span>
                {/* 인하 */}
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 11, width: '100%' }}>
                  <span style={{ color: 'var(--trend-text-main)', fontWeight: 600, width: 28 }}>인하</span>
                  <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 3, margin: '0 8px', overflow: 'hidden' }}>
                    <div style={{ width: `${brProbCut ?? 0}%`, height: '100%', background: '#3b82f6', borderRadius: 3 }}></div>
                  </div>
                  <span style={{ fontWeight: 700, color: '#3b82f6', width: 28, textAlign: 'right' }}>
                    {brProbCut !== null && brProbCut !== undefined ? `${brProbCut}%` : "-"}
                  </span>
                </div>
                {/* 동결 */}
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 11, width: '100%' }}>
                  <span style={{ color: 'var(--trend-text-main)', fontWeight: 600, width: 28 }}>동결</span>
                  <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 3, margin: '0 8px', overflow: 'hidden' }}>
                    <div style={{ width: `${brProbFreeze ?? 0}%`, height: '100%', background: '#94a3b8', borderRadius: 3 }}></div>
                  </div>
                  <span style={{ fontWeight: 700, color: '#64748b', width: 28, textAlign: 'right' }}>
                    {brProbFreeze !== null && brProbFreeze !== undefined ? `${brProbFreeze}%` : "-"}
                  </span>
                </div>
                {/* 인상 */}
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 11, width: '100%' }}>
                  <span style={{ color: 'var(--trend-text-main)', fontWeight: 600, width: 28 }}>인상</span>
                  <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 3, margin: '0 8px', overflow: 'hidden' }}>
                    <div style={{ width: `${brProbHike ?? 0}%`, height: '100%', background: '#ef4444', borderRadius: 3 }}></div>
                  </div>
                  <span style={{ fontWeight: 700, color: '#ef4444', width: 28, textAlign: 'right' }}>
                    {brProbHike !== null && brProbHike !== undefined ? `${brProbHike}%` : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

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

          {/* AI 실시간 뉴스 브리핑 박스 */}
          {!isLoading && dashboardData?.aiSummaries && (
            <div className="ai-news-briefing-box">
              <div className="ai-news-briefing-header">
                <div className="ai-news-briefing-title-row">
                  <div className="ai-news-briefing-badge">
                    <span className="ai-news-briefing-badge-icon">🤖</span>
                    <span>AI 실시간 브리핑</span>
                  </div>
                  <span className="ai-news-briefing-title-text">오늘의 핵심 이슈 요약</span>
                  <span className="pulse-spark"></span>
                </div>
                
                {/* 세그먼트 컨트롤 탭 */}
                <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 2, borderRadius: 10 }}>
                  <button 
                    onClick={() => setActiveBriefingTab("economy")}
                    style={{ 
                      border: 'none', 
                      background: activeBriefingTab === 'economy' ? '#ffffff' : 'transparent',
                      color: activeBriefingTab === 'economy' ? '#0284c7' : '#64748b',
                      fontSize: 12, 
                      fontWeight: activeBriefingTab === 'economy' ? 700 : 600,
                      padding: '5px 12px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      boxShadow: activeBriefingTab === 'economy' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    경제
                  </button>
                  <button 
                    onClick={() => setActiveBriefingTab("politics")}
                    style={{ 
                      border: 'none', 
                      background: activeBriefingTab === 'politics' ? '#ffffff' : 'transparent',
                      color: activeBriefingTab === 'politics' ? '#0284c7' : '#64748b',
                      fontSize: 12, 
                      fontWeight: activeBriefingTab === 'politics' ? 700 : 600,
                      padding: '5px 12px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      boxShadow: activeBriefingTab === 'politics' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    정치
                  </button>
                  <button 
                    onClick={() => setActiveBriefingTab("international")}
                    style={{ 
                      border: 'none', 
                      background: activeBriefingTab === 'international' ? '#ffffff' : 'transparent',
                      color: activeBriefingTab === 'international' ? '#0284c7' : '#64748b',
                      fontSize: 12, 
                      fontWeight: activeBriefingTab === 'international' ? 700 : 600,
                      padding: '5px 12px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      boxShadow: activeBriefingTab === 'international' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    국제
                  </button>
                </div>
              </div>
              
              <div className="ai-news-briefing-content">
                <ul className="ai-news-briefing-list">
                  {renderSummaryList(dashboardData.aiSummaries[activeBriefingTab])}
                </ul>
              </div>
            </div>
          )}

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
                    newsItems.economy.slice(0, 3).map((item, i) => (
                      <div key={i} className="trend-news-item" onClick={() => handleNewsClick(item)} style={{ cursor: 'pointer' }}>{item.title}</div>
                    ))
                  )}
                </div>
                <div className="trend-news-col">
                  <div className="trend-news-col-title">정치 <ChevronDown size={16} color="#cbd5e1" /></div>
                  {newsItems.politics.length === 0 ? (
                    <div style={{ fontSize: 12, color: '#94a3b8', padding: '8px 0' }}>최신 뉴스가 없습니다.</div>
                  ) : (
                    newsItems.politics.slice(0, 3).map((item, i) => (
                      <div key={i} className="trend-news-item" onClick={() => handleNewsClick(item)} style={{ cursor: 'pointer' }}>{item.title}</div>
                    ))
                  )}
                </div>
                <div className="trend-news-col">
                  <div className="trend-news-col-title">국제 <ChevronDown size={16} color="#cbd5e1" /></div>
                  {(newsItems.international || newsItems.itScience || newsItems.it).length === 0 ? (
                    <div style={{ fontSize: 12, color: '#94a3b8', padding: '8px 0' }}>최신 뉴스가 없습니다.</div>
                  ) : (
                    (newsItems.international || newsItems.itScience || newsItems.it).slice(0, 3).map((item, i) => (
                      <div key={i} className="trend-news-item" onClick={() => handleNewsClick(item)} style={{ cursor: 'pointer' }}>{item.title}</div>
                    ))
                  )}
                </div>
              </>
            )}
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
