import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import { api } from "../../api";
import "./Trend.css";

const tabToType = {
  "금값": "gold",
  "부동산": "real_estate",
  "금리": "base_rate"
};

export default function EconomicIndicatorLlmReport() {
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
      const weightPct = c.weight * 100;
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
    return text.split("\n").map((line, index) => {
      if (line.startsWith("###")) {
        return <h3 key={index} style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '24px 0 12px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>{line.replace("###", "").trim()}</h3>;
      }
      if (line.startsWith("##")) {
        return <h4 key={index} style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: '20px 0 10px 0' }}>{line.replace("##", "").trim()}</h4>;
      }
      if (line.startsWith("**") && line.endsWith("**")) {
        return <p key={index} style={{ fontWeight: 700, color: '#0f172a', margin: '14px 0 6px 0' }}>{line.replace(/\*\*/g, "")}</p>;
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return <li key={index} style={{ fontSize: 14, color: '#334155', lineHeight: 1.8, marginLeft: '20px', marginBottom: '6px' }}>{line.substring(2)}</li>;
      }
      if (line.trim() === "") {
        return <div key={index} style={{ height: 8 }} />;
      }

      // Check inline bold e.g. **bold**
      let parts = line.split("**");
      if (parts.length > 1) {
        return (
          <p key={index} style={{ fontSize: 14, color: '#334155', lineHeight: 1.8, margin: '6px 0' }}>
            {parts.map((part, i) => i % 2 === 1 ? <strong key={i} style={{ color: '#0f172a', fontWeight: 700 }}>{part}</strong> : part)}
          </p>
        );
      }

      return <p key={index} style={{ fontSize: 14, color: '#334155', lineHeight: 1.8, margin: '6px 0' }}>{line}</p>;
    });
  };

  return (
    <div className="trend-container" style={{ position: 'relative' }}>
      {/* Sidebar */}
      <Sidebar type="trend" />

      {/* Main Content (Blurred) */}
      <div className="trend-main cust-blurred-content" style={{ filter: 'blur(6px)', pointerEvents: 'none' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 32, marginTop: 0 }}>경제지표 아카이브</h1>

        <div className="trend-section-box" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <div className="trend-tabs" style={{ marginBottom: 0 }}>
              {["금값", "부동산", "금리"].map(tab => (
                <button
                  key={tab}
                  className={`trend-tab ${selectedTab === tab ? 'active' : ''}`}
                  style={selectedTab === tab ? {} : { background: 'white', color: '#64748b' }}
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
                {svgPaths && (
                  <svg viewBox="0 20 400 150" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    <path d={svgPaths.historyPath} fill="none" stroke="#0f172a" strokeWidth="2.5" />
                  </svg>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="eco-box">
              <div className="eco-box-title">{selectedTab} 주요 가격 지표</div>
            </div>

            {/* Pie Chart */}
            <div className="eco-box">
              <div className="eco-box-title">예측 기여도 (SHAP)</div>
            </div>

            {/* LLM Report */}
            <div className="eco-box">
              <div className="eco-box-title">LLM 분석 요약 보고서</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="news-arch-modal" style={{ position: 'relative', top: 'auto', left: 'auto', right: 'auto', bottom: 'auto', width: '900px', height: '80vh', maxWidth: '90%', maxHeight: '90%', padding: '40px', overflowY: 'auto', margin: 0, borderRadius: '24px', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)' }}>
          <Link to="/economic-indicator-archive" style={{ position: 'absolute', top: 24, right: 24 }}>
            <button className="news-mod-close" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '50%', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', transition: 'all 0.2s' }}>
              <X size={20} color="#64748b" />
            </button>
          </Link>

          {/* Modal Header Tabs */}
          <div className="trend-tabs" style={{ marginBottom: 32 }}>
            {["금값", "부동산", "금리"].map(tab => (
              <button
                key={tab}
                className={`trend-tab ${selectedTab === tab ? 'active' : ''}`}
                style={selectedTab === tab ? { borderRadius: '8px' } : { background: 'transparent', color: '#64748b', borderRadius: '8px' }}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
            {selectedTab} AI 예측 모델 SHAP 분석 보고서
          </h2>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 32 }}>
            {reportData ? `분석 완료: ${new Date(reportData.generatedAt).toLocaleString('ko-KR')} | 분석 모델: ${reportData.modelName} | 기반 데이터: ${reportData.dataSources.join(", ")}` : ""}
          </div>

          <div style={{ background: '#f8fafc', padding: '32px', borderRadius: 16, borderLeft: '4px solid #3b82f6' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {selectedTab} 추이 예측에 대한 인공지능 분석 결과
            </h3>

            <div style={{ fontSize: 14, color: '#334155', lineHeight: 1.8 }}>
              {isLoading || !reportData ? (
                <div style={{ padding: '20px 0', textAlign: 'center', color: '#64748b' }}>보고서 데이터를 분석하는 중...</div>
              ) : (
                renderMarkdown(reportData.content)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
