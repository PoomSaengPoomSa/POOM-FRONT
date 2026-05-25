import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import { api } from "../../api";
import "./Trend.css";

const tabToType = {
  "금값": "gold",
  "부동산": "real_estate",
  "금리": "base_rate"
};

export default function EconomicIndicatorArchive() {
  const [selectedTab, setSelectedTab] = useState("금값");
  const [latestData, setLatestData] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [contributionData, setContributionData] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const type = tabToType[selectedTab];
    setIsLoading(true);

    const today = new Date();
    const to = today.toISOString().split('T')[0];
    const fromObj = new Date();
    fromObj.setDate(today.getDate() - 30);
    const from = fromObj.toISOString().split('T')[0];

    Promise.all([
      api.trend.getIndicatorLatest(type),
      api.trend.getIndicatorHistory(type, { from, to, granularity: "daily" }),
      api.trend.getIndicatorContribution(type),
      api.trend.getLatestReport(type)
    ])
      .then(([latest, history, contribution, report]) => {
        setLatestData(latest);
        setHistoryData(history);
        setContributionData(contribution);
        setReportData(report);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch indicator data from backend:", err);
        setIsLoading(false);
      });
  }, [selectedTab]);

  // Dynamic conic gradient string builder for SHAP contributions
  const getConicGradient = (contribs) => {
    if (!contribs || contribs.length === 0) {
      return "conic-gradient(#cbd5e1 0% 100%)";
    }
    const colors = ["#a855f7", "#c084fc", "#22c55e", "#cbd5e1"];
    let currentPercent = 0;
    const slices = contribs.map((c, i) => {
      const color = colors[i % colors.length];
      const weightPct = c.ratio;
      const start = currentPercent;
      currentPercent += weightPct;
      return `${color} ${start.toFixed(1)}% ${currentPercent.toFixed(1)}%`;
    });
    return `conic-gradient(${slices.join(", ")})`;
  };

  // Dynamic SVG path scaling math
  const getSvgPaths = () => {
    if (!historyData || !historyData.series || historyData.series.length === 0) return null;

    const series = historyData.series;
    const minVal = historyData.stats.min;
    const maxVal = historyData.stats.max;
    const range = maxVal - minVal || 1.0;

    // 1. Plot historical points
    const points = series.map((p, idx) => {
      const x = (idx / (series.length - 1)) * 300;
      const y = 150 - ((p.value - minVal) / range) * 110;
      return { x, y };
    });

    // Build M ... L ... path
    let historyPath = "";
    if (points.length > 0) {
      historyPath = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)} ` +
        points.slice(1).map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
    }

    // 2. Plot prediction point
    let predictionPath = "";
    let todayPoint = points[points.length - 1];
    let tomorrowPoint = null;

    if (latestData && latestData.tomorrow && latestData.tomorrow.value !== null && todayPoint) {
      const tomValue = latestData.tomorrow.value;
      const tomX = 380;
      const tomY = 150 - ((tomValue - minVal) / range) * 110;
      tomorrowPoint = { x: tomX, y: tomY };
      predictionPath = `M ${todayPoint.x.toFixed(1)} ${todayPoint.y.toFixed(1)} L ${tomX.toFixed(1)} ${tomY.toFixed(1)}`;
    }

    return { points, historyPath, predictionPath, todayPoint, tomorrowPoint };
  };

  const svgPaths = getSvgPaths();
  const colors = ["#a855f7", "#c084fc", "#22c55e", "#cbd5e1"];

  const formatChange = (val, dir, type) => {
    if (!dir || dir === "flat") return "▬ 0.0%";
    const prefix = dir === "up" ? "▲ +" : "▼ -";
    const suffix = type === "base_rate" ? "" : "%";
    return `${prefix}${Math.abs(val)}${suffix}`;
  };

  return (
    <div className="trend-container">
      {/* Sidebar */}
      <Sidebar type="trend" />

      {/* Main Content */}
      <div className="trend-main">
        <div className="trend-section-box" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 24, marginTop: 0 }}>경제지표 아카이브</h1>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <div className="trend-tabs" style={{ marginBottom: 0 }}>
              {["금값", "부동산", "금리"].map(tab => (
                <button
                  key={tab}
                  className={`trend-tab ${selectedTab === tab ? 'active' : ''}`}
                  style={selectedTab === tab ? {} : { background: 'white', color: '#64748b' }}
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="eco-grid">
            {/* Chart 1 */}
            <div className="eco-box">
              <div className="eco-box-title">{selectedTab} 추이·예측</div>
              <div style={{ height: 160, position: 'relative', marginTop: 16 }}>
                <div style={{ position: 'absolute', top: -16, right: 0, fontSize: 10, color: '#94a3b8' }}>
                  {historyData?.source || "ECOS - FRED"}
                </div>
                {isLoading || !svgPaths ? (
                  <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13 }}>
                    차트 데이터를 불러오는 중...
                  </div>
                ) : (
                  <svg viewBox="0 20 400 150" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    {/* Grid Lines */}
                    <line x1="0" y1="40" x2="400" y2="40" stroke="#f8fafc" strokeWidth="1" />
                    <line x1="0" y1="95" x2="400" y2="95" stroke="#f8fafc" strokeWidth="1" />
                    <line x1="0" y1="150" x2="400" y2="150" stroke="#f1f5f9" strokeWidth="1.5" />

                    {/* History Curve */}
                    <path d={svgPaths.historyPath} fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Prediction dashed line */}
                    {svgPaths.predictionPath && (
                      <path d={svgPaths.predictionPath} fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5 5" />
                    )}

                    {/* Points */}
                    {svgPaths.todayPoint && (
                      <>
                        <circle cx={svgPaths.todayPoint.x} cy={svgPaths.todayPoint.y} r="5" fill="#0f172a" />
                        <text x={svgPaths.todayPoint.x} y={svgPaths.todayPoint.y - 12} fontSize="11" fontWeight="700" fill="#0f172a" textAnchor="middle">
                          {latestData.type === "gold" ? "오늘" : "이번달"}
                        </text>
                      </>
                    )}

                    {svgPaths.tomorrowPoint && (
                      <>
                        <circle cx={svgPaths.tomorrowPoint.x} cy={svgPaths.tomorrowPoint.y} r="5" fill="#3b82f6" />
                        <text x={svgPaths.tomorrowPoint.x} y={svgPaths.tomorrowPoint.y - 12} fontSize="11" fontWeight="700" fill="#3b82f6" textAnchor="middle">
                          {latestData.type === "gold" ? "내일(예측)" : "다음달(예측)"}
                        </text>
                      </>
                    )}
                  </svg>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="eco-box">
              <div className="eco-box-title">{selectedTab} 주요 가격 지표</div>
              <div className="indicator-stats" style={{ marginTop: 'auto' }}>
                {isLoading || !latestData ? (
                  <div style={{ padding: 20, textAlign: 'center', color: '#64748b', width: '100%' }}>로딩 중...</div>
                ) : (
                  <>
                    <div className="indicator-stat-col">
                      <span className="indicator-stat-label">{latestData.type === "gold" ? "어제" : "지난달"}</span>
                      <span className="indicator-stat-value">{latestData.yesterday.value}</span>
                    </div>
                    <div className="indicator-stat-col">
                      <span className="indicator-stat-label">{latestData.type === "gold" ? "오늘" : "이번달"}</span>
                      <span className="indicator-stat-value large" style={{ fontSize: 48 }}>{latestData.today.value}</span>
                      <span
                        className={`indicator-stat-change ${latestData.today.direction}`}
                        style={{
                          background: latestData.today.direction === 'up' ? '#dcfce7' : latestData.today.direction === 'down' ? '#fee2e2' : '#f1f5f9',
                          color: latestData.today.direction === 'up' ? '#16a34a' : latestData.today.direction === 'down' ? '#ef4444' : '#64748b',
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 700
                        }}
                      >
                        {formatChange(latestData.today.changeRate, latestData.today.direction, latestData.type)}
                      </span>
                    </div>
                    <div className="indicator-stat-col">
                      <span className="indicator-stat-label">{latestData.type === "gold" ? "내일(예측)" : "다음달(예측)"}</span>
                      <span className="indicator-stat-value">{latestData.tomorrow.value ?? "-"}</span>
                      {latestData.tomorrow.value !== null && (
                        <span
                          className={`indicator-stat-change ${latestData.tomorrow.direction}`}
                          style={{
                            background: latestData.tomorrow.direction === 'up' ? '#dcfce7' : latestData.tomorrow.direction === 'down' ? '#fee2e2' : '#f1f5f9',
                            color: latestData.tomorrow.direction === 'up' ? '#16a34a' : latestData.tomorrow.direction === 'down' ? '#ef4444' : '#64748b',
                            padding: '2px 8px',
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 700
                          }}
                        >
                          {formatChange(latestData.tomorrow.changeRate, latestData.tomorrow.direction, latestData.type)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Pie Chart */}
            <div className="eco-box">
              <div className="eco-box-title">예측 기여도 (SHAP)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                <div style={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: getConicGradient(contributionData?.contributions),
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
                }}>
                  <div style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    top: '20px',
                    left: '20px'
                  }}>
                    <span style={{ fontSize: 10, color: '#64748b' }}>{selectedTab} 예측</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#0ea5e9' }}>핵심 변수</span>
                  </div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {isLoading || !contributionData?.contributions ? (
                    <div style={{ color: '#64748b', fontSize: 11 }}>가중치 데이터를 가져오는 중...</div>
                  ) : (
                    contributionData.contributions.map((item, idx) => (
                      <div key={item.feature} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#334155' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ width: 12, height: 12, borderRadius: 2, background: colors[idx % colors.length] }}></span>
                          {item.label}
                        </span>
                        <span style={{ fontWeight: 600 }}>{item.ratio}%</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* LLM Report */}
            <div className="eco-box">
              <div className="eco-box-title">LLM 분석 요약 보고서</div>
              <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.8, marginBottom: 24, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>
                {isLoading || !reportData ? "분석 보고서를 불러오는 중입니다..." : reportData.summary}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <Link to="/economic-indicator-archive-llm-report" style={{ textDecoration: 'none' }}>
                  <span style={{ color: '#0284c7', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>상세 리포트 보기 →</span>
                </Link>
                <div style={{ fontSize: 9, color: '#94a3b8', textAlign: 'right' }}>
                  {reportData ? `생성 모델: ${reportData.modelName} | 출처: ${reportData.dataSources.join(", ")}` : ""}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
