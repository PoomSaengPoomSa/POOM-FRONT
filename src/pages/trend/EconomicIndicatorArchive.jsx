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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    fromObj.setDate(today.getDate() - 180); // 6 months trend to show a rich and clear history curve
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

  // Simple and premium Markdown parser/renderer in React
  const renderMarkdown = (text) => {
    if (!text) return null;
    
    // LaTeX 수식 기호 정제 ($R^2$ ➔ R², $R^2$ ➔ R² 등)
    let cleanedText = text
      .replace(/\$R\^2\$/g, "R²")
      .replace(/\$R\^2\$/g, "R²")
      .replace(/\$R\^2\$/g, "R²")
      .replace(/\$R2\$/g, "R²");

    return cleanedText.split(/\r?\n/).map((line, index) => {
      // H1 (# ) 처리
      if (line.startsWith("# ") && !line.startsWith("##")) {
        return (
          <h2 key={index} style={{
            fontSize: 22,
            fontWeight: 800,
            color: '#0f172a',
            margin: '32px 0 16px 0',
            borderBottom: '2px solid #3b82f6',
            paddingBottom: '10px',
            lineHeight: 1.4
          }}>
            {line.replace(/^#\s*/, "").trim()}
          </h2>
        );
      }
      if (line.startsWith("###")) {
        return <h4 key={index} style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', margin: '20px 0 10px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', lineHeight: 1.4 }}>{line.replace("###", "").trim()}</h4>;
      }
      if (line.startsWith("##")) {
        return <h3 key={index} style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '26px 0 12px 0', lineHeight: 1.4 }}>{line.replace("##", "").trim()}</h3>;
      }
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("**") && trimmedLine.endsWith("**")) {
        return (
          <p key={index} style={{ 
            fontSize: '14px', 
            fontWeight: 800, 
            color: '#0f172a', 
            margin: '12px 0 6px 0'
          }}>
            <span style={{
              background: 'linear-gradient(to top, rgba(254, 240, 138, 0.45) 50%, transparent 50%)',
              padding: '0 4px',
              borderRadius: '2px'
            }}>
              {trimmedLine.replace(/\*\*/g, "")}
            </span>
          </p>
        );
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        const content = line.substring(2);
        let parts = content.split("**");
        return (
          <li key={index} style={{ 
            fontSize: '14px', 
            color: '#334155', 
            lineHeight: 1.8, 
            marginLeft: '24px', 
            marginBottom: '8px',
            listStyleType: 'disc'
          }}>
            {parts.map((part, i) => i % 2 === 1 ? (
              <strong key={i} style={{ 
                fontWeight: 800, 
                background: 'linear-gradient(to top, rgba(254, 240, 138, 0.5) 40%, transparent 40%)',
                padding: '0 2px', 
                color: '#0f172a' 
              }}>{part}</strong>
            ) : part)}
          </li>
        );
      }
      if (line.trim() === "") {
        return <div key={index} style={{ height: 10 }} />;
      }

      // Check inline bold e.g. **bold**
      let parts = line.split("**");
      if (parts.length > 1) {
        return (
          <p key={index} style={{ fontSize: '14px', color: '#334155', lineHeight: 1.8, margin: '10px 0' }}>
            {parts.map((part, i) => i % 2 === 1 ? (
              <strong key={i} style={{ 
                fontWeight: 800, 
                background: 'linear-gradient(to top, rgba(254, 240, 138, 0.5) 40%, transparent 40%)',
                padding: '0 2px', 
                color: '#0f172a' 
              }}>{part}</strong>
            ) : part)}
          </p>
        );
      }

      return <p key={index} style={{ fontSize: '14px', color: '#334155', lineHeight: 1.8, margin: '10px 0' }}>{line}</p>;
    });
  };

  const getFirstSentence = (text) => {
    if (!text) return "";
    const parts = text.split(/\.\s+/);
    if (parts.length > 0) {
      return parts[0].trim() + (parts[0].endsWith(".") ? "" : ".");
    }
    return text;
  };

  const renderPreviewMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split("\n");
    const previewLines = [];
    let paragraphCount = 0;
    let isLastLineBold = false;
    
    for (let line of lines) {
      const trimmed = line.trim();
      if (trimmed === "") {
        previewLines.push(line);
        continue;
      }
      
      if (trimmed.startsWith("###") || trimmed.startsWith("##")) {
        previewLines.push(line);
        isLastLineBold = false;
      } else if (trimmed.startsWith("**")) {
        previewLines.push(line);
        isLastLineBold = true;
      } else {
        paragraphCount++;
        if (paragraphCount === 1) {
          previewLines.push(line);
          isLastLineBold = false;
        } else if (isLastLineBold) {
          const firstSentence = getFirstSentence(line);
          previewLines.push(firstSentence);
          isLastLineBold = false;
        }
      }
    }
    
    return renderMarkdown(previewLines.join("\n"));
  };

  const highlightSummary = (text) => {
    if (!text) return null;
    
    // 1. 혹시 과거 데이터나 제목 클러터가 섞여 있다면 2차 정제
    let cleanText = text
      .replace(/대한민국 부동산 가격지수 예측 모델 분석 보고서/g, "")
      .replace(/1\.\s+머신러닝 회귀 모델 예측 성능 평가/g, "")
      .replace(/금값 예측 모델 SHAP 분석 보고서/g, "")
      .replace(/1\.\s+글로벌 핵심 피처 요약 및 편향성 진단/g, "")
      .replace(/\[부동산 가격지수 분석 리포트\]/g, "")
      .replace(/###/g, "")
      .trim();

    // 2. 하이라이트 키워드 패턴들
    const keywords = [
      "성능 개선", "예측 성능", "설명력", 
      "RMSE", "R²", "MAE", "MSE",
      "상승", "하락", "기여", "기여도", "유동성",
      "앙상블 모델", "회귀 모델", "최우선 전략",
      "WTI 유가", "연방기금금리", "소비자물가지수",
      "KOSPI200", "매수우위지수", "M2 통화량", "통화량"
    ];

    // 정규식으로 키워드, 소수점 숫자(부호포함), 백분율 등을 매치하여 스플릿
    const pattern = new RegExp(`(${keywords.join("|")}|\\-\\d+\\.\\d+%?|\\d+\\.\\d+%?|\\d+%|\\d+\\.\\d+)`, "g");
    const parts = cleanText.split(pattern);

    return (
      <p style={{ margin: 0, lineHeight: 1.8, fontSize: '13.5px', color: '#334155' }}>
        {parts.map((part, i) => {
          const isKeyword = keywords.includes(part);
          const isNumeric = /^-?\d+(\.\d+)?%?$/.test(part);
          
          if (isKeyword || isNumeric) {
            return (
              <span key={i} style={{ 
                fontWeight: 700, 
                color: '#0f172a',
                background: 'rgba(254, 240, 138, 0.65)',
                padding: '1px 3px', 
                borderRadius: '3px',
                margin: '0 1px'
              }}>
                {part}
              </span>
            );
          }
          return part;
        })}
      </p>
    );
  };

  return (
    <div className="trend-container">
      {/* Sidebar */}
      <Sidebar type="trend" />

      {/* Main Content */}
      <div className="trend-main" style={{ padding: '12px 24px' }}>
        <div className="trend-section-box" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 20px' }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 16, marginTop: 0 }}>경제지표 아카이브</h1>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* AI 심층 분석 보고서 (LLM) */}
              <div className="eco-box" style={{ padding: '16px 20px', background: 'rgba(255, 255, 255, 0.9)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.04)', border: '1px solid rgba(255, 255, 255, 0.18)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '2px solid #f1f5f9', paddingBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>🤖</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--trend-text-main)' }}>AI 심층 분석 보고서 (LLM)</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--trend-text-muted)', display: 'flex', gap: 12, alignItems: 'center' }}>
                    {reportData?.generatedAt && <span>분석 완료: {new Date(reportData.generatedAt).toLocaleString('ko-KR')}</span>}
                    {reportData?.content && (
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        style={{
                          background: '#0ea5e9',
                          color: 'white',
                          border: 'none',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 4px rgba(14, 165, 233, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#0284c7';
                          e.currentTarget.style.transform = 'translateY(-0.5px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#0ea5e9';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        상세보기 ➔
                      </button>
                    )}
                  </div>
                </div>
                
                <div style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.8, padding: '16px 20px', background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8, minHeight: '120px', justifyContent: 'center' }}>
                  {isLoading ? (
                    <div style={{ padding: '10px 0', textAlign: 'center', color: '#64748b' }}>보고서 데이터를 분석하는 중...</div>
                  ) : reportData?.summary ? (
                    <div style={{ margin: 0 }}>
                      {renderMarkdown(reportData.summary)}
                    </div>
                  ) : (
                    <div style={{ padding: '10px 0', textAlign: 'center', color: '#64748b' }}>분석 보고서가 존재하지 않습니다.</div>
                  )}
                </div>


              </div>

              {/* 하단 2열 배치 (컴팩트 예측 + SHAP 기여도) */}
              <div style={{ display: 'flex', gap: 16 }}>
                {/* 내일 예측 컴팩트 카드 */}
                <div className="eco-box" style={{ padding: '14px 18px', flex: 1, background: 'rgba(255, 255, 255, 0.85)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--trend-text-main)', marginBottom: 8 }}>인공지능 내일 예측</div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 10, color: 'var(--trend-text-muted)', fontWeight: 600 }}>예측 결과</span>
                      <span style={{ fontSize: 22, fontWeight: 800, color: goldPredText.includes('동률') ? '#64748b' : goldPredText.includes('상승') ? '#ef4444' : goldPredText.includes('하락') ? '#3b82f6' : '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                        {goldPredText.includes('동률') ? '동률' : goldPredText.includes('상승') ? '상승' : goldPredText.includes('하락') ? '하락' : '동률'}{' '}
                        <span style={{ fontSize: 16, display: 'inline-block' }}>
                          {goldPredText.includes('동률') ? '▬' : goldPredText.includes('상승') ? '▲' : goldPredText.includes('하락') ? '▼' : '▬'}
                        </span>
                      </span>
                    </div>
                    
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {/* 상승 Bar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 24, fontSize: 10, color: '#ef4444', fontWeight: 700 }}>상승</span>
                        <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${goldProbRise}%`, height: '100%', background: '#ef4444', borderRadius: 3 }}></div>
                        </div>
                        <span style={{ width: 24, fontSize: 10, color: '#ef4444', fontWeight: 700, textAlign: 'right' }}>{goldProbRise}%</span>
                      </div>
                      {/* 하락 Bar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 24, fontSize: 10, color: '#3b82f6', fontWeight: 700 }}>하락</span>
                        <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${goldProbFall}%`, height: '100%', background: '#3b82f6', borderRadius: 3 }}></div>
                        </div>
                        <span style={{ width: 24, fontSize: 10, color: '#3b82f6', fontWeight: 700, textAlign: 'right' }}>{goldProbFall}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--trend-text-main)', borderTop: '1px solid var(--trend-border)', paddingTop: 6, marginTop: 6 }}>
                    예측 요약: <span style={{ color: goldPredText.includes('동률') ? '#64748b' : goldPredText.includes('상승') ? '#ef4444' : goldPredText.includes('하락') ? '#3b82f6' : '#64748b' }}>{goldPredText}</span>
                  </div>
                </div>

                {/* 예측 기여도 */}
                <div className="eco-box" style={{ padding: '14px 18px', flex: 1, background: 'rgba(255, 255, 255, 0.85)' }}>
                  <div className="eco-box-title" style={{ fontSize: 13, marginBottom: 8 }}>예측 기여도 (SHAP)</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      background: getConicGradient(contributionData?.contributions),
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px -1px rgb(0 0 0 / 0.05)',
                      flexShrink: 0
                    }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: '#f8fafc',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        top: '12px',
                        left: '12px'
                      }}>
                        <span style={{ fontSize: 7, color: '#64748b' }}>예측</span>
                        <span style={{ fontSize: 8, fontWeight: 700, color: '#0ea5e9' }}>기여도</span>
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {isLoading ? (
                        <div style={{ color: 'var(--trend-text-muted)', fontSize: 9 }}>가중치 데이터를 가져오는 중...</div>
                      ) : !contributionData?.contributions || contributionData.contributions.length === 0 ? (
                        <div style={{ color: 'var(--trend-text-muted)', fontSize: 9 }}>기여도 데이터가 존재하지 않습니다.</div>
                      ) : (
                        contributionData.contributions.slice(0, 4).map((item, idx) => (
                          <div key={item.feature} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#334155' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 85 }} title={item.label}>
                              <span style={{ width: 6, height: 6, borderRadius: 1, background: colors[idx % colors.length], flexShrink: 0 }}></span>
                              {item.label}
                            </span>
                            <span style={{ fontWeight: 600 }}>{item.ratio}%</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : selectedTab === "금리" ? (
            /* 기준금리: 다중 분류 */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* AI 심층 분석 보고서 (LLM) */}
              <div className="eco-box" style={{ padding: '16px 20px', background: 'rgba(255, 255, 255, 0.9)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.04)', border: '1px solid rgba(255, 255, 255, 0.18)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '2px solid #f1f5f9', paddingBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>🤖</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--trend-text-main)' }}>AI 심층 분석 보고서 (LLM)</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--trend-text-muted)', display: 'flex', gap: 12, alignItems: 'center' }}>
                    {reportData?.generatedAt && <span>분석 완료: {new Date(reportData.generatedAt).toLocaleString('ko-KR')}</span>}
                    {reportData?.content && (
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        style={{
                          background: '#0ea5e9',
                          color: 'white',
                          border: 'none',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 4px rgba(14, 165, 233, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#0284c7';
                          e.currentTarget.style.transform = 'translateY(-0.5px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#0ea5e9';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        상세보기 ➔
                      </button>
                    )}
                  </div>
                </div>
                
                <div style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.8, padding: '16px 20px', background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8, minHeight: '120px', justifyContent: 'center' }}>
                  {isLoading ? (
                    <div style={{ padding: '10px 0', textAlign: 'center', color: '#64748b' }}>보고서 데이터를 분석하는 중...</div>
                  ) : reportData?.summary ? (
                    <div style={{ margin: 0 }}>
                      {renderMarkdown(reportData.summary)}
                    </div>
                  ) : (
                    <div style={{ padding: '10px 0', textAlign: 'center', color: '#64748b' }}>분석 보고서가 존재하지 않습니다.</div>
                  )}
                </div>


              </div>

              {/* 하단 2열 배치 (컴팩트 예측 + SHAP 기여도) */}
              <div style={{ display: 'flex', gap: 16 }}>
                {/* 다음달 예측 컴팩트 카드 */}
                <div className="eco-box" style={{ padding: '14px 18px', flex: 1, background: 'rgba(255, 255, 255, 0.85)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--trend-text-main)', marginBottom: 8 }}>인공지능 다음달 예측</div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 10, color: 'var(--trend-text-muted)', fontWeight: 600 }}>예측 결과</span>
                      <span style={{ fontSize: 22, fontWeight: 800, color: brPredText.includes('인상') ? '#ef4444' : brPredText.includes('인하') ? '#3b82f6' : '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {brPredText.includes('인상') ? '인상' : brPredText.includes('인하') ? '인하' : '동결'}{' '}
                        <span style={{ fontSize: 16, display: 'inline-block' }}>
                          {brPredText.includes('인상') ? '▲' : brPredText.includes('인하') ? '▼' : '▬'}
                        </span>
                      </span>
                    </div>
                    
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {/* 인하 Bar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 24, fontSize: 10, color: '#3b82f6', fontWeight: 700 }}>인하</span>
                        <div style={{ flex: 1, height: 4, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ width: `${brProbCut}%`, height: '100%', background: '#3b82f6', borderRadius: 2 }}></div>
                        </div>
                        <span style={{ width: 24, fontSize: 10, color: '#3b82f6', fontWeight: 700, textAnchor: 'end' }}>{brProbCut}%</span>
                      </div>
                      {/* 동결 Bar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 24, fontSize: 10, color: '#64748b', fontWeight: 700 }}>동결</span>
                        <div style={{ flex: 1, height: 4, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ width: `${brProbFreeze}%`, height: '100%', background: '#94a3b8', borderRadius: 2 }}></div>
                        </div>
                        <span style={{ width: 24, fontSize: 10, color: '#64748b', fontWeight: 700, textAnchor: 'end' }}>{brProbFreeze}%</span>
                      </div>
                      {/* 인상 Bar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 24, fontSize: 10, color: '#ef4444', fontWeight: 700 }}>인상</span>
                        <div style={{ flex: 1, height: 4, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ width: `${brProbHike}%`, height: '100%', background: '#ef4444', borderRadius: 2 }}></div>
                        </div>
                        <span style={{ width: 24, fontSize: 10, color: '#ef4444', fontWeight: 700, textAnchor: 'end' }}>{brProbHike}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--trend-text-main)', borderTop: '1px solid var(--trend-border)', paddingTop: 6, marginTop: 6 }}>
                    예측 요약: <span style={{ color: brPredText.includes('인상') ? '#ef4444' : brPredText.includes('인하') ? '#3b82f6' : '#64748b' }}>{brPredText}</span>
                  </div>
                </div>

                {/* 예측 기여도 */}
                <div className="eco-box" style={{ padding: '14px 18px', flex: 1, background: 'rgba(255, 255, 255, 0.85)' }}>
                  <div className="eco-box-title" style={{ fontSize: 13, marginBottom: 8 }}>예측 기여도 (SHAP)</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      background: getConicGradient(contributionData?.contributions),
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px -1px rgb(0 0 0 / 0.05)',
                      flexShrink: 0
                    }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: '#f8fafc',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        top: '12px',
                        left: '12px'
                      }}>
                        <span style={{ fontSize: 7, color: '#64748b' }}>예측</span>
                        <span style={{ fontSize: 8, fontWeight: 700, color: '#0ea5e9' }}>기여도</span>
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {isLoading ? (
                        <div style={{ color: 'var(--trend-text-muted)', fontSize: 9 }}>가중치 데이터를 가져오는 중...</div>
                      ) : !contributionData?.contributions || contributionData.contributions.length === 0 ? (
                        <div style={{ color: 'var(--trend-text-muted)', fontSize: 9 }}>기여도 데이터가 존재하지 않습니다.</div>
                      ) : (
                        contributionData.contributions.slice(0, 4).map((item, idx) => (
                          <div key={item.feature} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#334155' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 85 }} title={item.label}>
                              <span style={{ width: 6, height: 6, borderRadius: 1, background: colors[idx % colors.length], flexShrink: 0 }}></span>
                              {item.label}
                            </span>
                            <span style={{ fontWeight: 600 }}>{item.ratio}%</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* 부동산: 회귀 예측 (기존 차트 + 수치형 뷰) */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* AI 심층 분석 보고서 (LLM) */}
              <div className="eco-box" style={{ padding: '16px 20px', background: 'rgba(255, 255, 255, 0.9)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.04)', border: '1px solid rgba(255, 255, 255, 0.18)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '2px solid #f1f5f9', paddingBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>🤖</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--trend-text-main)' }}>AI 심층 분석 보고서 (LLM)</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--trend-text-muted)', display: 'flex', gap: 12, alignItems: 'center' }}>
                    {reportData?.generatedAt && <span>분석 완료: {new Date(reportData.generatedAt).toLocaleString('ko-KR')}</span>}
                    {reportData?.content && (
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        style={{
                          background: '#0ea5e9',
                          color: 'white',
                          border: 'none',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 4px rgba(14, 165, 233, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#0284c7';
                          e.currentTarget.style.transform = 'translateY(-0.5px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#0ea5e9';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        상세보기 ➔
                      </button>
                    )}
                  </div>
                </div>
                
                <div style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.8, padding: '16px 20px', background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9', marginBottom: 8, minHeight: '120px', display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
                  {isLoading ? (
                    <div style={{ padding: '10px 0', textAlign: 'center', color: '#64748b' }}>보고서 데이터를 분석하는 중...</div>
                  ) : reportData?.summary ? (
                    <div style={{ margin: 0 }}>
                      {renderMarkdown(reportData.summary)}
                    </div>
                  ) : (
                    <div style={{ padding: '10px 0', textAlign: 'center', color: '#64748b' }}>분석 보고서가 존재하지 않습니다.</div>
                  )}
                </div>


              </div>

              {/* 하단 3열 배치 (차트 + 컴팩트 수치 지표 + 도넛 차트 기여도) */}
              <div style={{ display: 'flex', gap: 16 }}>
                {/* 차트 */}
                <div className="eco-box" style={{ padding: '12px 16px', flex: 0.9, display: 'flex', flexDirection: 'column' }}>
                  <div className="eco-box-title" style={{ fontSize: 13, marginBottom: 8 }}>부동산 추이·예측</div>
                  <div style={{ height: 110, position: 'relative', marginTop: 4 }}>
                    <div style={{ position: 'absolute', top: -14, right: 0, fontSize: 8, color: '#94a3b8' }}>
                      {historyData?.source || "ECOS - FRED"}
                    </div>
                    {isLoading || !svgPaths ? (
                      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 11 }}>
                        차트 데이터를 불러오는 중...
                      </div>
                    ) : (
                      <svg viewBox="0 25 400 145" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
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
                            <circle cx={svgPaths.todayPoint.x} cy={svgPaths.todayPoint.y} r="4" fill="#0f172a" />
                            <text x={svgPaths.todayPoint.x} y={svgPaths.todayPoint.y - 10} fontSize="10" fontWeight="700" fill="#0f172a" textAnchor="middle">
                              이번달
                            </text>
                          </>
                        )}

                        {svgPaths.tomorrowPoint && (
                          <>
                            <circle cx={svgPaths.tomorrowPoint.x} cy={svgPaths.tomorrowPoint.y} r="4" fill="#3b82f6" />
                            <text x={svgPaths.tomorrowPoint.x} y={svgPaths.tomorrowPoint.y - 10} fontSize="10" fontWeight="700" fill="#3b82f6" textAnchor="middle">
                              다음달(예측)
                            </text>
                          </>
                        )}
                      </svg>
                    )}
                  </div>
                </div>

                {/* 컴팩트 주요 수치 지표 */}
                <div className="eco-box" style={{ padding: '12px 16px', flex: 1, background: 'rgba(255, 255, 255, 0.85)', display: 'flex', flexDirection: 'column' }}>
                  <div className="eco-box-title" style={{ fontSize: 13, marginBottom: 8 }}>인공지능 다음달 예측</div>
                  <div className="indicator-stats" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6, marginTop: 'auto', marginBottom: 2 }}>
                    {isLoading || !latestData ? (
                      <div style={{ padding: 10, textAlign: 'center', color: '#64748b', fontSize: 11, width: '100%' }}>로딩 중...</div>
                    ) : (
                      <>
                        <div className="indicator-stat-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                          <span className="indicator-stat-label" style={{ fontSize: 10, color: 'var(--trend-text-muted)', fontWeight: 600 }}>지난달</span>
                          <span className="indicator-stat-value" style={{ fontSize: 12, color: 'var(--trend-text-muted)', fontWeight: 500 }}>{latestData.yesterday.value}</span>
                        </div>
                        <div className="indicator-stat-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                          <span className="indicator-stat-label" style={{ fontSize: 10, color: 'var(--trend-text-muted)', fontWeight: 600 }}>이번달</span>
                          <span className="indicator-stat-value" style={{ fontSize: 12, color: 'var(--trend-text-muted)', fontWeight: 500 }}>{latestData.today.value}</span>
                          <span
                            className={`indicator-stat-change ${latestData.today.direction}`}
                            style={{
                              background: latestData.today.direction === 'up' ? '#dcfce7' : latestData.today.direction === 'down' ? '#fee2e2' : '#f1f5f9',
                              color: latestData.today.direction === 'up' ? '#16a34a' : latestData.today.direction === 'down' ? '#ef4444' : '#64748b',
                              padding: '1px 3px',
                              borderRadius: 3,
                              fontSize: 8,
                              fontWeight: 700,
                              marginTop: 1
                            }}
                          >
                            {formatChange(latestData.today.changeRate, latestData.today.direction, latestData.type)}
                          </span>
                        </div>
                        <div className="indicator-stat-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1.1 }}>
                          <span className="indicator-stat-label" style={{ fontSize: 10, color: '#3b82f6', fontWeight: 800 }}>다음달(예측)</span>
                          <span className="indicator-stat-value large" style={{ fontSize: 20, fontWeight: 800, color: '#3b82f6', lineHeight: 1.1 }}>{latestData.tomorrow.value ?? "-"}</span>
                          {latestData.tomorrow.value !== null && (
                            <span
                              className={`indicator-stat-change ${latestData.tomorrow.direction}`}
                              style={{
                                background: latestData.tomorrow.direction === 'up' ? '#dcfce7' : latestData.tomorrow.direction === 'down' ? '#fee2e2' : '#f1f5f9',
                                color: latestData.tomorrow.direction === 'up' ? '#16a34a' : latestData.tomorrow.direction === 'down' ? '#ef4444' : '#64748b',
                                padding: '1px 3px',
                                borderRadius: 3,
                                fontSize: 8,
                                fontWeight: 700,
                                marginTop: 1
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

                {/* 예측 기여도 (SHAP) */}
                <div className="eco-box" style={{ padding: '12px 16px', flex: 1.5 }}>
                  <div className="eco-box-title" style={{ fontSize: 13, marginBottom: 8 }}>예측 기여도 (SHAP)</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      background: getConicGradient(contributionData?.contributions),
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px -1px rgb(0 0 0 / 0.05)',
                      flexShrink: 0
                    }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: '#f8fafc',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        top: '12px',
                        left: '12px'
                      }}>
                        <span style={{ fontSize: 7, color: '#64748b' }}>예측</span>
                        <span style={{ fontSize: 8, fontWeight: 700, color: '#0ea5e9' }}>기여도</span>
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {isLoading ? (
                        <div style={{ color: '#64748b', fontSize: 9 }}>가중치 데이터를 가져오는 중...</div>
                      ) : !contributionData?.contributions || contributionData.contributions.length === 0 ? (
                        <div style={{ color: '#64748b', fontSize: 9 }}>기여도 데이터가 존재하지 않습니다.</div>
                      ) : (
                        contributionData.contributions.slice(0, 4).map((item, idx) => (
                          <div key={item.feature} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#334155' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 85 }} title={item.label}>
                              <span style={{ width: 6, height: 6, borderRadius: 1, background: colors[idx % colors.length], flexShrink: 0 }}></span>
                              {item.label}
                            </span>
                            <span style={{ fontWeight: 600 }}>{item.ratio}%</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Premium Full detailed Modal overlay */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'trendModalFadeIn 0.3s ease',
        }}>
          <div style={{
            width: '680px',
            maxWidth: '92%',
            maxHeight: '85vh',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 28px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#ffffff',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>🤖</span>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {selectedTab} AI 심층 분석 보고서
                  </h2>
                  <p style={{ fontSize: 11, color: '#64748b', margin: '2px 0 0 0' }}>
                    분석 기준일 {reportData?.generatedAt ? new Date(reportData.generatedAt).toLocaleString('ko-KR') : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#64748b',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e2e8f0';
                  e.currentTarget.style.color = '#0f172a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.color = '#64748b';
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div style={{
              padding: '24px 28px',
              overflowY: 'auto',
              flex: 1,
              background: '#f8fafc',
            }}>
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                border: '1px solid #e2e8f0',
              }}>
                {renderMarkdown(reportData?.content)}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 28px',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'white',
            }}>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'var(--trend-primary)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: '10px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(14, 165, 233, 0.2)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(14, 165, 233, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(14, 165, 233, 0.2)';
                }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
