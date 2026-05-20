import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, TrendingUp, Users, Bell, LogOut, MoreHorizontal, ChevronDown, Activity, Home, DollarSign, ChevronRight, X, Settings } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import "./Trend.css";

// ---------------------------------------------------------
// [DB 연동 대비] 임시 데이터 및 모의 API 함수
// ---------------------------------------------------------
const mockTrendData = {
  economy: [
    { title: "코스피 2,700 돌파 — 사상 최고치 3일 연속 경신. 'Sell in May' 격언 유효 여부 주목", type: "경제", color: "green", body: "코스피 상승장 본문 내용입니다. 추후 DB 연동 시 실제 기사 본문이 표시됩니다.", references: ["코스피 관련 참고 1"] },
    { title: "삼성전자 어닝 서프라이즈 — 1분기 영업이익 57.2조 원(+756%), 주가 장중 23만 원 돌파·신고가", type: "경제", color: "green", body: "삼성전자 실적 본문 내용입니다. 추후 DB 연동 시 실제 기사 본문이 표시됩니다.", references: ["삼성전자 실적 참고 1"] },
    { title: "반도체 ETF 수익률 폭등 — AI반도체 관련 ETF 4월 한 달간 40-45% 수익률 기록", type: "경제", color: "green", body: "반도체 ETF 본문 내용입니다. 추후 DB 연동 시 실제 기사 본문이 표시됩니다.", references: ["ETF 관련 참고 1"] }
  ],
  politics: [
    { title: "부산 북구갑 3자 구도 확정 — 하정우(민주당) vs 한동훈(무소속) vs 국민의힘 후보", type: "정치", color: "pink", body: "정치 선거 구도 본문 내용입니다. 추후 DB 연동 시 실제 기사 본문이 표시됩니다.", references: ["선거 관련 참고 1"] },
    { title: "한동훈 \"나와 이재명의 대리전\" — 반이재명 구도 프레임 강조, 지역 공약 부재 지적도", type: "정치", color: "pink", body: "정치 발언 본문 내용입니다. 추후 DB 연동 시 실제 기사 본문이 표시됩니다.", references: ["정치 관련 참고 1"] },
    { title: "미니 총선 14곳 확정 — 지방선거와 동시 실시, 민주당 우세 지역 12곳", type: "정치", color: "pink", body: "선거 확정 본문 내용입니다. 추후 DB 연동 시 실제 기사 본문이 표시됩니다.", references: ["선거 관련 참고 2"] }
  ],
  it: [
    { title: "스탠퍼드 AI 인덱스 2026 — 생성형 AI가 단순 기술이 아닌 \"지배 인프라\"로 산업·국가 시스템 재편", type: "IT/과학", color: "blue", body: "AI 기술 동향 본문 내용입니다. 추후 DB 연동 시 실제 기사 본문이 표시됩니다.", references: ["AI 관련 참고 1"] },
    { title: "오픈AI, MS 독점 파트너십 종료 — 아마존 AWS와도 협업 개시, 앤디 재시 CEO 공식 발표", type: "IT/과학", color: "blue", body: "오픈AI 협업 본문 내용입니다. 추후 DB 연동 시 실제 기사 본문이 표시됩니다.", references: ["빅테크 관련 참고 1"] },
    { title: "LG CNS 1분기 실적 — 매출 1조 3,150억·영업익 942억, AI·클라우드 성장 견인", type: "IT/과학", color: "blue", body: "IT 기업 실적 본문 내용입니다. 추후 DB 연동 시 실제 기사 본문이 표시됩니다.", references: ["IT 실적 참고 1"] }
  ]
};

const fetchTrendAPI = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTrendData);
    }, 300);
  });
};

export default function TrendArchive() {
  const location = useLocation();
  const path = location.pathname;
  
  const [newsItems, setNewsItems] = useState({ economy: [], politics: [], it: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetchTrendAPI().then(data => {
      setNewsItems(data);
      setIsLoading(false);
    });
  }, []);

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
                  {newsItems.economy.map((item, i) => (
                    <div key={i} className="trend-news-item" onClick={() => setSelectedNewsItem(item)} style={{ cursor: 'pointer' }}>{item.title}</div>
                  ))}
                </div>
                <div className="trend-news-col">
                  <div className="trend-news-col-title">정치 <ChevronDown size={16} color="#cbd5e1" /></div>
                  {newsItems.politics.map((item, i) => (
                    <div key={i} className="trend-news-item" onClick={() => setSelectedNewsItem(item)} style={{ cursor: 'pointer' }}>{item.title}</div>
                  ))}
                </div>
                <div className="trend-news-col">
                  <div className="trend-news-col-title">IT/과학 <ChevronDown size={16} color="#cbd5e1" /></div>
                  {newsItems.it.map((item, i) => (
                    <div key={i} className="trend-news-item" onClick={() => setSelectedNewsItem(item)} style={{ cursor: 'pointer' }}>{item.title}</div>
                  ))}
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

      {/* Modal Overlay */}
      {selectedNewsItem && (
        <div style={{ position: 'fixed', top: 0, left: 240, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(8px)', zIndex: 1000 }}>
          <div className="news-arch-modal">
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

              <div className="news-mod-sidebar" style={{ width: 280, background: '#f8fafc', borderLeft: '1px solid var(--trend-border)', padding: '16px 32px', overflowY: 'auto' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: 16, color: '#0f172a' }}>참고자료</h3>
                {selectedNewsItem.references.map((ref, idx) => (
                  <div key={idx} className="ref-box">{ref}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
