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

  const goldProbRise = latestData?.tomorrow?.probRise ?? 0;
  const goldProbFall = latestData?.tomorrow?.probFall ?? 0;
  const goldPredText = latestData?.tomorrow?.predictionText ?? "예측 데이터 없음";

  const brProbCut = latestData?.tomorrow?.probCut ?? 0;
  const brProbFreeze = latestData?.tomorrow?.probFreeze ?? 0;
  const brProbHike = latestData?.tomorrow?.probHike ?? 0;
  const brPredText = latestData?.tomorrow?.predictionText ?? "예측 데이터 없음";

  useEffect(() => {
    const type = tabToType[selectedTab];
    setIsLoading(true);

    const today = new Date();
    const to = today.toISOString().split('T')[0];
    const fromObj = new Date();
    fromObj.setDate(today.getDate() - 30);
    const from = fromObj.toISOString().split('T')[0];

    const fetchLatest = api.trend.getIndicatorLatest(type).catch(err => {
      console.error("Failed to fetch latest indicator from backend:", err);
      return null;
    });
    const fetchHistory = api.trend.getIndicatorHistory(type, { from, to, granularity: "daily" }).catch(err => {
      console.error("Failed to fetch history from backend:", err);
      return null;
    });
    const fetchContribution = api.trend.getIndicatorContribution(type).catch(err => {
      console.error("Failed to fetch contribution from backend:", err);
      return null;
    });
    const fetchReport = api.trend.getLatestReport(type).catch(err => {
      console.error("Failed to fetch latest report from backend:", err);
      return null;
    });

    Promise.all([fetchLatest, fetchHistory, fetchContribution, fetchReport])
      .then(([latest, history, contribution, report]) => {
        setLatestData(latest);
        setHistoryData(history);
        setContributionData(contribution);
        setReportData(report);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Critical error inside trend API aggregation:", err);
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

          {/* 조건부 레이아웃 렌더링 */}
          {selectedTab === "금값" ? (
            /* 금값: 이중 분류 */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* 내일 예측 가로형 풀 카드 */}
              <div className="eco-box" style={{ background: 'rgba(255, 255, 255, 0.85)' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--trend-text-main)', marginBottom: 20 }}>내일 예측</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <span style={{ fontSize: 13, color: 'var(--trend-text-muted)', fontWeight: 600 }}>예측 결과</span>
                    <span style={{ fontSize: 44, fontWeight: 800, color: goldPredText.includes('동률') ? '#64748b' : goldPredText.includes('상승') ? '#ef4444' : goldPredText.includes('하락') ? '#3b82f6' : '#64748b', display: 'flex', alignItems: 'center', gap: 12 }}>
                      {goldPredText.includes('동률') ? '동률' : goldPredText.includes('상승') ? '상승' : goldPredText.includes('하락') ? '하락' : '동률'}{' '}
                      <span style={{ fontSize: 32, display: 'inline-block', transform: 'translateY(-2px)' }}>
                        {goldPredText.includes('동률') ? '▬' : goldPredText.includes('상승') ? '▲' : goldPredText.includes('하락') ? '▼' : '▬'}
                      </span>
                    </span>
                  </div>
                  <div style={{ flex: 1, marginLeft: 96, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* 상승 Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span style={{ width: 40, fontSize: 13, color: '#ef4444', fontWeight: 700 }}>상승</span>
                      <div style={{ flex: 1, height: 16, background: '#f1f5f9', borderRadius: 8, overflow: 'hidden' }}>
                        <div style={{ width: `${goldProbRise}%`, height: '100%', background: '#ef4444', borderRadius: 8 }}></div>
                      </div>
                      <span style={{ width: 40, fontSize: 13, color: '#ef4444', fontWeight: 700, textAlign: 'right' }}>{goldProbRise}%</span>
                    </div>
                    {/* 하락 Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span style={{ width: 40, fontSize: 13, color: '#3b82f6', fontWeight: 700 }}>하락</span>
                      <div style={{ flex: 1, height: 16, background: '#f1f5f9', borderRadius: 8, overflow: 'hidden' }}>
                        <div style={{ width: `${goldProbFall}%`, height: '100%', background: '#3b82f6', borderRadius: 8 }}></div>
                      </div>
                      <span style={{ width: 40, fontSize: 13, color: '#3b82f6', fontWeight: 700, textAlign: 'right' }}>{goldProbFall}%</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--trend-text-main)', borderTop: '1px solid var(--trend-border)', paddingTop: 12, marginTop: 12 }}>
                  예측: <span style={{ color: goldPredText.includes('동률') ? '#64748b' : goldPredText.includes('상승') ? '#ef4444' : goldPredText.includes('하락') ? '#3b82f6' : '#64748b' }}>{goldPredText}</span>
                </div>
              </div>

              {/* 하단 2열 배치 (SHAP + LLM 보고서) */}
              <div style={{ display: 'flex', gap: 24 }}>
                {/* 예측 기여도 */}
                <div className="eco-box" style={{ flex: 1, background: 'rgba(255, 255, 255, 0.85)' }}>
                  <div className="eco-box-title" style={{ marginBottom: 20 }}>예측 기여도 (SHAP)</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {isLoading ? (
                      <div style={{ color: 'var(--trend-text-muted)', fontSize: 13 }}>가중치 데이터를 가져오는 중...</div>
                    ) : !contributionData?.contributions || contributionData.contributions.length === 0 ? (
                      <div style={{ color: 'var(--trend-text-muted)', fontSize: 13 }}>기여도 데이터가 존재하지 않습니다.</div>
                    ) : (
                      contributionData.contributions.map((item, idx) => (
                        <div key={item.feature} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--trend-text-main)', fontWeight: 600, width: 140 }}>
                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: colors[idx % colors.length] }}></span>
                            {item.label}
                          </span>
                          <div style={{ flex: 1, margin: '0 16px', height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ width: `${item.ratio}%`, height: '100%', background: colors[idx % colors.length], borderRadius: 4 }}></div>
                          </div>
                          <span style={{ fontWeight: 700, color: 'var(--trend-text-main)', width: 36, textAlign: 'right' }}>{item.ratio}%</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* LLM 요약 보고서 */}
                <div className="eco-box" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(255, 255, 255, 0.85)' }}>
                  <div className="eco-box-title" style={{ marginBottom: 16 }}>LLM 분석 요약 보고서</div>
                  <div style={{ fontSize: 13, color: 'var(--trend-text-main)', lineHeight: 1.8, marginBottom: 24, marginTop: 4, flex: 1 }}>
                    {isLoading ? "분석 보고서를 불러오는 중입니다..." : reportData?.summary || "분석 보고서가 존재하지 않습니다."}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid var(--trend-border)', paddingTop: 12 }}>
                    <Link to="/economic-indicator-archive-llm-report" style={{ textDecoration: 'none' }}>
                      <span style={{ color: 'var(--trend-primary-dark)', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>상세 리포트 보기 →</span>
                    </Link>
                    <div style={{ fontSize: 11, color: 'var(--trend-text-muted)' }}>
                      {reportData?.dataSources ? `출처: ${reportData.dataSources.join(", ")}` : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : selectedTab === "금리" ? (
            /* 기준금리: 다중 분류 */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* 다음달 예측 가로형 풀 카드 */}
              <div className="eco-box" style={{ background: 'rgba(255, 255, 255, 0.85)' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--trend-text-main)', marginBottom: 20 }}>다음달 예측</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <span style={{ fontSize: 13, color: 'var(--trend-text-muted)', fontWeight: 600 }}>예측 결과</span>
                    <span style={{ fontSize: 44, fontWeight: 800, color: brPredText.includes('인상') ? '#ef4444' : brPredText.includes('인하') ? '#3b82f6' : '#64748b', display: 'flex', alignItems: 'center', gap: 12 }}>
                      {brPredText.includes('인상') ? '인상' : brPredText.includes('인하') ? '인하' : '동결'}{' '}
                      <span style={{ fontSize: 32, display: 'inline-block', transform: 'translateY(-2px)' }}>
                        {brPredText.includes('인상') ? '▲' : brPredText.includes('인하') ? '▼' : '▬'}
                      </span>
                    </span>
                  </div>
                  <div style={{ flex: 1, marginLeft: 96, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {/* 인하 Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span style={{ width: 40, fontSize: 13, color: '#3b82f6', fontWeight: 700 }}>인하</span>
                      <div style={{ flex: 1, height: 12, background: '#f1f5f9', borderRadius: 6, overflow: 'hidden' }}>
                        <div style={{ width: `${brProbCut}%`, height: '100%', background: '#3b82f6', borderRadius: 6 }}></div>
                      </div>
                      <span style={{ width: 40, fontSize: 13, color: '#3b82f6', fontWeight: 700, textAlign: 'right' }}>{brProbCut}%</span>
                    </div>
                    {/* 동결 Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span style={{ width: 40, fontSize: 13, color: '#64748b', fontWeight: 700 }}>동결</span>
                      <div style={{ flex: 1, height: 12, background: '#f1f5f9', borderRadius: 6, overflow: 'hidden' }}>
                        <div style={{ width: `${brProbFreeze}%`, height: '100%', background: '#94a3b8', borderRadius: 6 }}></div>
                      </div>
                      <span style={{ width: 40, fontSize: 13, color: '#64748b', fontWeight: 700, textAlign: 'right' }}>{brProbFreeze}%</span>
                    </div>
                    {/* 인상 Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span style={{ width: 40, fontSize: 13, color: '#ef4444', fontWeight: 700 }}>인상</span>
                      <div style={{ flex: 1, height: 12, background: '#f1f5f9', borderRadius: 6, overflow: 'hidden' }}>
                        <div style={{ width: `${brProbHike}%`, height: '100%', background: '#ef4444', borderRadius: 6 }}></div>
                      </div>
                      <span style={{ width: 40, fontSize: 13, color: '#ef4444', fontWeight: 700, textAlign: 'right' }}>{brProbHike}%</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--trend-text-main)', borderTop: '1px solid var(--trend-border)', paddingTop: 12, marginTop: 12 }}>
                  예측: <span style={{ color: brPredText.includes('인상') ? '#ef4444' : brPredText.includes('인하') ? '#3b82f6' : '#64748b' }}>{brPredText}</span>
                </div>
              </div>

              {/* 하단 2열 배치 (SHAP + LLM 보고서) */}
              <div style={{ display: 'flex', gap: 24 }}>
                {/* 예측 기여도 */}
                <div className="eco-box" style={{ flex: 1, background: 'rgba(255, 255, 255, 0.85)' }}>
                  <div className="eco-box-title" style={{ marginBottom: 20 }}>예측 기여도 (SHAP)</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {isLoading ? (
                      <div style={{ color: 'var(--trend-text-muted)', fontSize: 13 }}>가중치 데이터를 가져오는 중...</div>
                    ) : !contributionData?.contributions || contributionData.contributions.length === 0 ? (
                      <div style={{ color: 'var(--trend-text-muted)', fontSize: 13 }}>기여도 데이터가 존재하지 않습니다.</div>
                    ) : (
                      contributionData.contributions.map((item, idx) => (
                        <div key={item.feature} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--trend-text-main)', fontWeight: 600, width: 140 }}>
                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: colors[idx % colors.length] }}></span>
                            {item.label}
                          </span>
                          <div style={{ flex: 1, margin: '0 16px', height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ width: `${item.ratio}%`, height: '100%', background: colors[idx % colors.length], borderRadius: 4 }}></div>
                          </div>
                          <span style={{ fontWeight: 700, color: 'var(--trend-text-main)', width: 36, textAlign: 'right' }}>{item.ratio}%</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* LLM 요약 보고서 */}
                <div className="eco-box" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(255, 255, 255, 0.85)' }}>
                  <div className="eco-box-title" style={{ marginBottom: 16 }}>LLM 분석 요약 보고서</div>
                  <div style={{ fontSize: 13, color: 'var(--trend-text-main)', lineHeight: 1.8, marginBottom: 24, marginTop: 4, flex: 1 }}>
                    {isLoading ? "분석 보고서를 불러오는 중입니다..." : reportData?.summary || "분석 보고서가 존재하지 않습니다."}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid var(--trend-border)', paddingTop: 12 }}>
                    <Link to="/economic-indicator-archive-llm-report" style={{ textDecoration: 'none' }}>
                      <span style={{ color: 'var(--trend-primary-dark)', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>상세 리포트 보기 →</span>
                    </Link>
                    <div style={{ fontSize: 11, color: 'var(--trend-text-muted)' }}>
                      {reportData?.dataSources ? `출처: ${reportData.dataSources.join(", ")}` : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* 부동산: 회귀 예측 (기존 차트 + 수치형 뷰) */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="eco-grid">
                {/* Chart 1 */}
                <div className="eco-box">
                  <div className="eco-box-title">부동산 추이·예측</div>
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
                              이번달
                            </text>
                          </>
                        )}

                        {svgPaths.tomorrowPoint && (
                          <>
                            <circle cx={svgPaths.tomorrowPoint.x} cy={svgPaths.tomorrowPoint.y} r="5" fill="#3b82f6" />
                            <text x={svgPaths.tomorrowPoint.x} y={svgPaths.tomorrowPoint.y - 12} fontSize="11" fontWeight="700" fill="#3b82f6" textAnchor="middle">
                              다음달(예측)
                            </text>
                          </>
                        )}
                      </svg>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="eco-box" style={{ background: 'rgba(255, 255, 255, 0.85)' }}>
                  <div className="eco-box-title">다음달 예측</div>
                  <div className="indicator-stats" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginTop: 'auto', marginBottom: 8 }}>
                    {isLoading || !latestData ? (
                      <div style={{ padding: 20, textAlign: 'center', color: '#64748b', width: '100%' }}>로딩 중...</div>
                    ) : (
                      <>
                        <div className="indicator-stat-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                          <span className="indicator-stat-label" style={{ fontSize: 12, color: 'var(--trend-text-muted)', fontWeight: 600 }}>지난달</span>
                          <span className="indicator-stat-value" style={{ fontSize: 18, color: 'var(--trend-text-muted)', fontWeight: 500 }}>{latestData.yesterday.value}</span>
                        </div>
                        <div className="indicator-stat-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                          <span className="indicator-stat-label" style={{ fontSize: 12, color: 'var(--trend-text-muted)', fontWeight: 600 }}>이번달</span>
                          <span className="indicator-stat-value" style={{ fontSize: 18, color: 'var(--trend-text-muted)', fontWeight: 500 }}>{latestData.today.value}</span>
                          <span
                            className={`indicator-stat-change ${latestData.today.direction}`}
                            style={{
                              background: latestData.today.direction === 'up' ? '#dcfce7' : latestData.today.direction === 'down' ? '#fee2e2' : '#f1f5f9',
                              color: latestData.today.direction === 'up' ? '#16a34a' : latestData.today.direction === 'down' ? '#ef4444' : '#64748b',
                              padding: '2px 8px',
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 700,
                              marginTop: 4
                            }}
                          >
                            {formatChange(latestData.today.changeRate, latestData.today.direction, latestData.type)}
                          </span>
                        </div>
                        <div className="indicator-stat-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1.3, position: 'relative' }}>
                          <span className="indicator-stat-label" style={{ fontSize: 13, color: '#3b82f6', fontWeight: 800 }}>다음달(예측)</span>
                          <span className="indicator-stat-value large" style={{ fontSize: 48, fontWeight: 800, color: '#3b82f6', lineHeight: 1.1 }}>{latestData.tomorrow.value ?? "-"}</span>
                          {latestData.tomorrow.value !== null && (
                            <span
                              className={`indicator-stat-change ${latestData.tomorrow.direction}`}
                              style={{
                                background: latestData.tomorrow.direction === 'up' ? '#dcfce7' : latestData.tomorrow.direction === 'down' ? '#fee2e2' : '#f1f5f9',
                                color: latestData.tomorrow.direction === 'up' ? '#16a34a' : latestData.tomorrow.direction === 'down' ? '#ef4444' : '#64748b',
                                padding: '2px 8px',
                                borderRadius: 4,
                                fontSize: 11,
                                fontWeight: 700,
                                marginTop: 4
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
                      justifyContent: 'center',
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
                        <span style={{ fontSize: 10, color: '#64748b' }}>부동산 예측</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#0ea5e9' }}>핵심 변수</span>
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {isLoading ? (
                        <div style={{ color: '#64748b', fontSize: 11 }}>가중치 데이터를 가져오는 중...</div>
                      ) : !contributionData?.contributions || contributionData.contributions.length === 0 ? (
                        <div style={{ color: '#64748b', fontSize: 11 }}>기여도 데이터가 존재하지 않습니다.</div>
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
                    {isLoading ? "분석 보고서를 불러오는 중입니다..." : reportData?.summary || "분석 보고서가 존재하지 않습니다."}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <Link to="/economic-indicator-archive-llm-report" style={{ textDecoration: 'none' }}>
                      <span style={{ color: '#0284c7', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>상세 리포트 보기 →</span>
                    </Link>
                    <div style={{ fontSize: 9, color: '#94a3b8', textAlign: 'right' }}>
                      {reportData?.modelName ? `생성 모델: ${reportData.modelName} | ` : ""}
                      {reportData?.dataSources ? `출처: ${reportData.dataSources.join(", ")}` : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
