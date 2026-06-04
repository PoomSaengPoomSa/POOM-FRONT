import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AppRouter from "./router/AppRouter.jsx";
import { api } from "./api";

function HistoryItem({ hist, c_id }) {
  const [isOpen, setIsOpen] = useState(false);
  const [fullMemo, setFullMemo] = useState("");
  const [loadingFull, setLoadingFull] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const fetchFullMemo = async (e) => {
    e.stopPropagation();
    if (!c_id || !hist.cm_id) return;
    setLoadingFull(true);
    try {
      const data = await api.customer.getMemoDetail(c_id, hist.cm_id);
      if (data && data.memo) {
        setFullMemo(data.memo);
        setShowFull(true);
      }
    } catch (err) {
      console.error("Failed to fetch full memo:", err);
    } finally {
      setLoadingFull(false);
    }
  };

  return (
    <div 
      style={{ 
        borderBottom: '1px solid #e2e8f0', 
        paddingBottom: '12px', 
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        marginTop: '6px'
      }}
    >
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
      >
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>
          📅 {hist.date} - AI 요약: <span style={{ color: '#0284c7' }}>{hist.summary}</span>
        </span>
        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>
          {isOpen ? "▲ 접기" : "▼ 상세 상담내용 보기"}
        </span>
      </div>
      {isOpen && (
        <div style={{ 
          marginTop: '6px', 
          padding: '10px 14px', 
          backgroundColor: '#f8fafc', 
          borderRadius: '8px', 
          fontSize: '12.5px', 
          color: '#475569',
          lineHeight: '1.6',
          borderLeft: '4px solid #3b82f6',
        }}>
          <div>
            {showFull ? (
              <div style={{ whiteSpace: 'pre-wrap' }}>{fullMemo}</div>
            ) : (
              <div>
                <span>{hist.content}</span>
                {hist.cm_id && c_id && (
                  <span 
                    onClick={fetchFullMemo}
                    style={{ 
                      marginLeft: '8px', 
                      color: '#2563eb', 
                      cursor: 'pointer', 
                      textDecoration: 'underline',
                      fontWeight: '600' 
                    }}
                  >
                    {loadingFull ? "[불러오는 중...]" : "[원본 전체보기]"}
                  </span>
                )}
              </div>
            )}
          </div>
          {showFull && (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setShowFull(false);
              }}
              style={{ 
                marginTop: '8px', 
                color: '#64748b', 
                cursor: 'pointer', 
                fontSize: '11.5px',
                textDecoration: 'underline',
                textAlign: 'right'
              }}
            >
              간략히 보기
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const parseBriefing = (expandedContent) => {
  if (!expandedContent || expandedContent.length === 0) return null;
  
  const result = {
    summary: [],
    preference: [],
    assets: [],
    notes: [],
    history: []
  };
  
  let currentSection = null;
  let hasDynamicData = false;
  
  for (const line of expandedContent) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    if (trimmed === "[Quick Summary]" || trimmed.startsWith("[Quick Summary") || trimmed === "[요약]") {
      currentSection = "summary";
      hasDynamicData = true;
    } else if (trimmed === "[고객 정보 & Preference]" || trimmed.startsWith("[고객 정보") || trimmed === "[선호도]") {
      currentSection = "preference";
      hasDynamicData = true;
    } else if (trimmed === "[자산 현황 & 최근 거래 내역]" || trimmed.startsWith("[자산 현황") || trimmed === "[자산]") {
      currentSection = "assets";
      hasDynamicData = true;
    } else if (trimmed === "[핵심 특이사항]" || trimmed.startsWith("[핵심 특이사항") || trimmed === "[특이사항]") {
      currentSection = "notes";
      hasDynamicData = true;
    } else if (currentSection) {
      if (currentSection === "notes" && (trimmed.includes("상담 내용:") || trimmed.includes("상담 히스토리"))) {
        let line = trimmed.replace(/^-\s*/, '');
        let dateMatch = line.match(/^\[(\d{4}-\d{2}-\d{2})\]/);
        if (dateMatch) {
          const date = dateMatch[1];
          let rest = line.substring(dateMatch[0].length).trim();
          const parts = rest.split(" | ");
          let content = "";
          let summary = "";
          let cm_id = null;
          
          for (const part of parts) {
            const trimmedPart = part.trim();
            if (trimmedPart.startsWith("상담 내용:")) {
              content = trimmedPart.substring("상담 내용:".length).trim();
            } else if (trimmedPart.startsWith("AI 요약:")) {
              summary = trimmedPart.substring("AI 요약:".length).trim();
            } else if (trimmedPart.startsWith("ID:")) {
              cm_id = parseInt(trimmedPart.substring("ID:".length).trim(), 10) || null;
            }
          }
          
          result.history.push({
            date,
            content: content || rest,
            summary: summary || "요약 정보 없음",
            cm_id
          });
          continue;
        }
      }
      
      if (trimmed.includes("이전 상담 히스토리 요약")) {
        continue;
      }
      
      result[currentSection].push(trimmed);
    }
  }
  
  if (!hasDynamicData) return null;
  return result;
};

export default function App() {
  const navigate = useNavigate();
  const [activeAlert, setActiveAlert] = useState(null);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [selectedBriefing, setSelectedBriefing] = useState(null);
  const [modalSize, setModalSize] = useState({ width: 850, height: 650 });
  const prevCountRef = useRef(null);
  const pollIntervalRef = useRef(null);

  const handleResizeStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = modalSize.width;
    const startHeight = modalSize.height;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const newWidth = Math.max(500, Math.min(1300, startWidth + deltaX));
      const newHeight = Math.max(400, Math.min(window.innerHeight * 0.9, startHeight + deltaY));

      setModalSize({
        width: newWidth,
        height: newHeight
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    // 15초마다 알림 개수 조회하여 감시
    const checkNotifications = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        prevCountRef.current = null;
        return;
      }
      try {
        const countData = await api.notification.getTodayCount();
        if (countData && typeof countData.today_count === "number") {
          const currentCount = countData.today_count;
          
          if (prevCountRef.current !== null && currentCount > prevCountRef.current) {
            const list = await api.notification.getList("today");
            if (list && list.length > 0) {
              const latestBriefing = list.find(n => n.isBriefing);
              if (latestBriefing) {
                setActiveAlert(latestBriefing);
                
                const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav");
                audio.play().catch(e => console.log("실시간 알림 효과음 재생 실패:", e));
              }
            }
          }
          prevCountRef.current = currentCount;
        }
      } catch (err) {
        console.error("실시간 알림 폴링 실패:", err);
      }
    };

    const initCount = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const countData = await api.notification.getTodayCount();
          if (countData) {
            prevCountRef.current = countData.today_count;
          }
        } catch (e) {}
      }
    };
    initCount();

    pollIntervalRef.current = setInterval(checkNotifications, 15000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  return (
    <>
      <AppRouter />
      
      {/* 실시간 팝업 알림 (Toast UI) - Premium Modern Glassmorphism 테마 */}
      {activeAlert && (
        <div 
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "410px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(24px)",
            color: "#1e293b",
            boxShadow: "0 20px 25px -5px rgba(15, 23, 42, 0.06), 0 10px 10px -5px rgba(15, 23, 42, 0.04), 0 0 1px rgba(15, 23, 42, 0.12)",
            borderRadius: "20px",
            border: "1px solid rgba(15, 23, 42, 0.07)",
            padding: "22px",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            animation: "slideInAppToast 0.35s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", fontSize: "12px", fontWeight: "700", color: "#64748b", letterSpacing: "0.5px" }}>
              <span style={{ 
                width: "8px", 
                height: "8px", 
                borderRadius: "50%", 
                backgroundColor: "#10b981", 
                marginRight: "8px", 
                boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.2)" 
              }} />
              실시간 방문 브리핑
            </span>
            <button 
              onClick={() => setActiveAlert(null)}
              style={{
                background: "none",
                border: "none",
                fontSize: "18px",
                color: "#94a3b8",
                cursor: "pointer",
                padding: "0 4px",
                lineHeight: 1,
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.color = "#1e293b"}
              onMouseLeave={(e) => e.target.style.color = "#94a3b8"}
            >
              ×
            </button>
          </div>
          <div style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", lineHeight: "1.4" }}>
            {activeAlert.content}
          </div>
          <div style={{ fontSize: "12.5px", color: "#64748b", lineHeight: "1.5" }}>
            방문 30분 전 일정 브리핑 리포트가 완성되었습니다. 알림 페이지로 이동하지 않고 여기서 바로 상세 리포트를 확인해 보세요!
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
            <button 
              onClick={() => {
                setSelectedBriefing(activeAlert);
                setIsBriefingOpen(true);
                setActiveAlert(null);
              }}
              style={{
                backgroundColor: "#0ea5e9",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                padding: "8px 18px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 12px rgba(14, 165, 233, 0.15)"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#0284c7";
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 6px 16px rgba(14, 165, 233, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#0ea5e9";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(14, 165, 233, 0.15)";
              }}
            >
              브리핑 보기
            </button>
          </div>
        </div>
      )}

      {/* 실시간 팝업 브리핑 모달 - 글로벌 페이지 대응 (인라인 스타일링 구현) */}
      {isBriefingOpen && selectedBriefing && (
        <div 
          onClick={(e) => { 
            if (e.target === e.currentTarget) { 
              setIsBriefingOpen(false); 
              setSelectedBriefing(null); 
            } 
          }}
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            padding: "40px"
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(20px)",
              borderRadius: "24px",
              border: "1px solid rgba(15, 23, 42, 0.08)",
              width: `${modalSize.width}px`,
              height: `${modalSize.height}px`,
              maxWidth: "100%",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 24px 50px -12px rgba(15, 23, 42, 0.15)",
              overflow: "hidden",
              position: "relative"
            }}
          >
            {/* Header */}
            <div style={{
              padding: "24px 32px",
              borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "transparent"
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  padding: "6px 14px",
                  fontSize: "13px",
                  fontWeight: "700",
                  borderRadius: "4px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#e2fbf0",
                  color: "#10b981"
                }}>
                  방문 예정 브리핑
                </span>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                  {selectedBriefing.content}
                </h2>
                {selectedBriefing.c_id && (
                  <button 
                    onClick={() => {
                      setIsBriefingOpen(false);
                      setSelectedBriefing(null);
                      navigate(`/customer-info?c_id=${selectedBriefing.c_id}`);
                    }}
                    style={{
                      marginLeft: '12px',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: 'white',
                      backgroundColor: '#3b82f6',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                  >
                    고객 프로필 보기
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>
                  {selectedBriefing.date}
                </span>
                <button 
                  onClick={() => { 
                    setIsBriefingOpen(false); 
                    setSelectedBriefing(null); 
                  }}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#f1f5f9',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#64748b',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#e2e8f0'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div style={{
              padding: "32px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              backgroundColor: "transparent"
            }}>
              {(() => {
                const briefingData = parseBriefing(selectedBriefing.expandedContent);
                
                if (briefingData) {
                  return (
                    <>
                      {/* Quick Summary Section */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Quick Summary</h3>
                        <div style={{
                          backgroundColor: "rgba(248, 250, 252, 0.6)",
                          border: "1px solid rgba(15, 23, 42, 0.06)",
                          borderRadius: "16px",
                          padding: "20px 24px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.02)"
                        }}>
                          {briefingData.summary.map((line, idx) => (
                            <p key={idx} style={{ fontSize: "13px", lineHeight: "1.6", color: "#1e293b", fontWeight: "600", margin: 0 }}>
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* 고객 기본 정보 & Preference Section */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>고객 기본 정보 & Preference</h3>
                        <div style={{
                          backgroundColor: "rgba(248, 250, 252, 0.6)",
                          border: "1px solid rgba(15, 23, 42, 0.06)",
                          borderRadius: "16px",
                          padding: "20px 24px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.02)"
                        }}>
                          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", lineHeight: "1.6", color: "#334155" }}>
                            {briefingData.preference.map((line, idx) => (
                              <li key={idx} style={{
                                position: "relative",
                                paddingLeft: line.startsWith("-") ? "0" : "16px",
                                fontWeight: line.startsWith("-") ? "500" : "600",
                                color: line.startsWith("-") ? "#475569" : "#1e293b"
                              }}>
                                {!line.startsWith("-") && <span style={{ position: "absolute", left: 0, color: "#64748b" }}>•</span>}
                                {line.startsWith("-") ? line.substring(1).trim() : line}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* 자산 현황 & 최근 거래 내역 Section */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>자산 현황 & 최근 거래 내역</h3>
                        <div style={{
                          backgroundColor: "rgba(248, 250, 252, 0.6)",
                          border: "1px solid rgba(15, 23, 42, 0.06)",
                          borderRadius: "16px",
                          padding: "20px 24px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.02)"
                        }}>
                          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", lineHeight: "1.6", color: "#334155" }}>
                            {briefingData.assets.map((line, idx) => (
                              <li key={idx} style={{
                                position: "relative",
                                paddingLeft: line.startsWith("-") ? "0" : "16px",
                                fontWeight: line.startsWith("-") ? "500" : "600",
                                color: line.startsWith("-") ? "#475569" : "#1e293b"
                              }}>
                                {!line.startsWith("-") && <span style={{ position: "absolute", left: 0, color: "#64748b" }}>•</span>}
                                {line.startsWith("-") ? line.substring(1).trim() : line}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* 핵심 특이사항 & 상담 전 필수 체크 Section */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>핵심 특이사항 & 상담 전 필수 체크</h3>
                        <div style={{
                          backgroundColor: "rgba(248, 250, 252, 0.6)",
                          border: "1px solid rgba(15, 23, 42, 0.06)",
                          borderRadius: "16px",
                          padding: "20px 24px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.02)"
                        }}>
                          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", lineHeight: "1.6", color: "#334155" }}>
                            {briefingData.notes.map((line, idx) => (
                              <li key={idx} style={{
                                position: "relative",
                                paddingLeft: line.startsWith("-") ? "0" : "16px",
                                fontWeight: line.startsWith("-") ? "500" : "600",
                                color: line.startsWith("-") ? "#475569" : "#1e293b"
                              }}>
                                {!line.startsWith("-") && <span style={{ position: "absolute", left: 0, color: "#64748b" }}>•</span>}
                                {line.startsWith("-") ? line.substring(1).trim() : line}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* 이전 상담 히스토리 요약 Section */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>이전 상담 히스토리 요약</h3>
                        <div style={{
                          backgroundColor: "rgba(248, 250, 252, 0.6)",
                          border: "1px solid rgba(15, 23, 42, 0.06)",
                          borderRadius: "16px",
                          padding: "20px 24px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.02)"
                        }}>
                          {briefingData.history && briefingData.history.length > 0 ? (
                            briefingData.history.map((hist, idx) => (
                              <HistoryItem key={idx} hist={hist} c_id={selectedBriefing.c_id} />
                            ))
                          ) : (
                            <div style={{ padding: '8px 0', textAlign: 'center', color: '#94a3b8', fontSize: '13px', fontWeight: '500' }}>
                              이전 상담 이력이 존재하지 않습니다.
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  );
                }

                // FALLBACK: 비정형 데이터
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>브리핑 내용</h3>
                    <div style={{
                      backgroundColor: "rgba(248, 250, 252, 0.6)",
                      border: "1px solid rgba(15, 23, 42, 0.06)",
                      borderRadius: "16px",
                      padding: "20px 24px",
                      lineHeight: "1.8",
                      color: "#334155",
                      fontSize: "13px"
                    }}>
                      {selectedBriefing.expandedContent && selectedBriefing.expandedContent.length > 0 ? (
                        selectedBriefing.expandedContent.map((line, idx) => (
                          <p key={idx} style={{ margin: "0 0 8px 0" }}>{line}</p>
                        ))
                      ) : (
                        <p style={{ margin: 0 }}>{selectedBriefing.content || "브리핑 내용이 없습니다."}</p>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Resizer handle */}
            <div 
              onMouseDown={handleResizeStart}
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: '18px',
                height: '18px',
                cursor: 'se-resize',
                backgroundImage: 'linear-gradient(135deg, transparent 50%, #94a3b8 50%)',
                borderBottomRightRadius: '16px',
                zIndex: 10010
              }}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInAppToast {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
