import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon, MoreHorizontal } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import { api } from "../../api";
import "./News.css";

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

const formatToYyyyMmDd = (dateStr) => {
  try {
    const parts = dateStr.replace(",", "").split(" ");
    if (parts.length === 3) {
      const day = parts[0].padStart(2, "0");
      const monthStr = parts[1];
      const year = parts[2];
      
      const months = {
        Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
        Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
      };
      const month = months[monthStr] || "01";
      return `${year}.${month}.${day}`;
    }
  } catch (e) {}
  return dateStr;
};

function DateSeparator({ label }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      margin: '28px 0 16px 0',
      userSelect: 'none'
    }}>
      <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
      <span style={{
        padding: '0 16px',
        color: '#64748b',
        fontSize: '12.5px',
        fontWeight: '700',
        letterSpacing: '0.5px',
        backgroundColor: '#ffffff'
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
    </div>
  );
}

export default function CustomerNotifications() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("today");
  const [activeDetailId, setActiveDetailId] = useState(null);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [selectedBriefing, setSelectedBriefing] = useState(null);
  const [modalSize, setModalSize] = useState({ width: 850, height: 650 });
  const [notificationsList, setNotificationsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showOlder, setShowOlder] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setActiveDetailId(null);
  }, [location]);

  useEffect(() => {
    const fetchNotifications = async (showLoading = true) => {
      if (showLoading) setLoading(true);
      try {
        const data = await api.notification.getList(activeTab);
        setNotificationsList(data);
        if (showLoading) {
          window.dispatchEvent(new Event("notifications-updated"));
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        if (showLoading) setLoading(false);
      }
    };

    fetchNotifications();

    const handleUpdate = () => {
      fetchNotifications(false);
    };

    window.addEventListener("notifications-updated", handleUpdate);
    return () => {
      window.removeEventListener("notifications-updated", handleUpdate);
    };
  }, [activeTab]);



  const handleResizeStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = modalSize.width;
    const startHeight = modalSize.height;
    let hasDragged = false;

    const handleMouseMove = (moveEvent) => {
      hasDragged = true;
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

      if (hasDragged) {
        const swallowClick = (clickEvent) => {
          clickEvent.stopPropagation();
          clickEvent.preventDefault();
          window.removeEventListener("click", swallowClick, true);
        };
        window.addEventListener("click", swallowClick, true);
        
        setTimeout(() => {
          window.removeEventListener("click", swallowClick, true);
        }, 50);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };



  const getCustomerName = (title) => {
    if (!title) return "김민준";
    const parts = title.split("고객");
    return parts[0].trim();
  };

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
      
      // 섹션 마커 매칭 지원 (대괄호 마커 기준으로 엄격하게 매칭하여 일반 본문의 단어 오매칭 방지)
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
        // 이전 상담 내역 전용 파싱
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
        
        // 헤더 문구는 Notes 본문에서 제외
        if (trimmed.includes("이전 상담 히스토리 요약")) {
          continue;
        }
        
        result[currentSection].push(trimmed);
      }
    }
    
    if (!hasDynamicData) return null;
    return result;
  };


  const filteredNotifications = notificationsList.filter(notif => {
    if (activeTab === "today") {
      return notif.today;
    } else {
      if (showOlder) {
        return notif.days_diff <= 10;
      }
      return notif.days_diff <= 2;
    }
  });

  const hasOlder = notificationsList.some(notif => notif.days_diff > 2 && notif.days_diff <= 10);

  const handleCardClick = (notif) => {
    if (notif.isBriefing) {
      setSelectedBriefing(notif);
      setIsBriefingOpen(true);
      setActiveDetailId(null);
    } else {
      setActiveDetailId(prev => prev === notif.id ? null : notif.id);
    }
  };

  return (
    <div className="news-container">
      {/* Sidebar */}
      <Sidebar type="news" />

      {/* Main Content */}
      <div className="news-main">
        <div className="news-content-card">
          {/* Tab Selection Row */}
          <div className="news-alert-tabs-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="news-alert-tabs">
              <button 
                className={`news-alert-tab ${activeTab === 'today' ? 'active' : ''}`}
                onClick={() => { setActiveTab('today'); setActiveDetailId(null); setShowOlder(false); }}
              >
                오늘
              </button>
              <button 
                className={`news-alert-tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => { setActiveTab('all'); setActiveDetailId(null); setShowOlder(false); }}
              >
                전체
              </button>
            </div>
          </div>

          {/* Notifications Card List */}
          <div className="news-alert-list">
            {(() => {
              let prevGroupLabel = null;
              return filteredNotifications.map((notif) => {
                const isExpanded = activeDetailId === notif.id;
                
                let currentGroupLabel = "";
                if (notif.days_diff === 0) {
                  currentGroupLabel = "오늘";
                } else if (notif.days_diff === 1) {
                  currentGroupLabel = "어제";
                } else {
                  currentGroupLabel = formatToYyyyMmDd(notif.date);
                }
                
                const showSeparator = activeTab === "all" && prevGroupLabel !== currentGroupLabel;
                if (showSeparator) {
                  prevGroupLabel = currentGroupLabel;
                }

                return (
                  <div key={notif.id}>
                    {showSeparator && <DateSeparator label={currentGroupLabel} />}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                  <div 
                    className="news-alert-card"
                    onClick={() => handleCardClick(notif)}
                  >
                    {/* Left Side: Badge & Content */}
                    <div className="news-alert-left">
                      <span className={`news-alert-badge badge-${notif.category}`}>
                        {notif.type}
                      </span>
                      <span className="news-alert-content">
                        {notif.content}
                      </span>
                    </div>

                    {/* Right Side: Date & Menu */}
                    <div className="news-alert-right">
                      <div className="news-alert-date-wrap">
                        <CalendarIcon size={16} color="#3b82f6" />
                        <span className="news-alert-date">{notif.date}</span>
                      </div>
                      <button className="news-alert-more-btn" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal size={20} color="#94a3b8" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content rendering */}
                  {isExpanded && notif.expandedContent && (
                    <div className="news-alert-expanded-content">
                      {notif.expandedContent.map((line, idx) => (
                        <div key={idx} className="news-alert-expanded-line">
                          {line}
                        </div>
                      ))}
                      {notif.c_id && (
                        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/customer-management-registration-1?c_id=${notif.c_id}`);
                            }}
                            style={{
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#3b82f6',
                              backgroundColor: 'white',
                              border: '1px solid #3b82f6',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = '#3b82f6';
                              e.target.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = 'white';
                              e.target.style.color = '#3b82f6';
                            }}
                          >
                            고객 프로필 보기
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                    </div>
                  </div>
                );
              });
            })()}
            {activeTab === "all" && !showOlder && hasOlder && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', marginBottom: '8px' }}>
                <button 
                  onClick={() => setShowOlder(true)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '12.5px',
                    fontWeight: '600',
                    color: '#64748b',
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}
                  onMouseOver={(e) => { e.target.style.backgroundColor = '#e2e8f0'; e.target.style.color = '#334155'; }}
                  onMouseOut={(e) => { e.target.style.backgroundColor = '#f1f5f9'; e.target.style.color = '#64748b'; }}
                >
                  ▼ 이전 알림 보기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Briefing Modal Popup */}
      {isBriefingOpen && (
        <div className="briefing-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) { setIsBriefingOpen(false); setSelectedBriefing(null); } }}>
          <div 
            className="briefing-modal-card" 
            onClick={(e) => e.stopPropagation()}
            style={{ width: `${modalSize.width}px`, height: `${modalSize.height}px`, maxWidth: 'none', maxHeight: 'none' }}
          >
            {/* Header */}
            <div className="briefing-modal-header">
              <div className="briefing-modal-header-left" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="news-alert-badge badge-green">방문 예정 브리핑</span>
                <h2 className="briefing-modal-title">{selectedBriefing ? selectedBriefing.content : "방문 예정 브리핑"}</h2>
                {selectedBriefing?.c_id && (
                  <button 
                    onClick={() => {
                      setIsBriefingOpen(false);
                      setSelectedBriefing(null);
                      navigate(`/customer-management-registration-1?c_id=${selectedBriefing.c_id}`);
                    }}
                    style={{
                      marginLeft: '12px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: 'white',
                      backgroundColor: '#3b82f6',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                  >
                    고객 프로필 보기
                  </button>
                )}
              </div>
              <div className="briefing-modal-header-right">
                <span className="briefing-modal-date">{selectedBriefing ? selectedBriefing.date : ""}</span>
                <button className="briefing-modal-close-btn" onClick={() => { setIsBriefingOpen(false); setSelectedBriefing(null); }}>
                  <span style={{ fontSize: '18px', color: '#64748b', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</span>
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="briefing-modal-body">
              {(() => {
                const briefingData = selectedBriefing ? parseBriefing(selectedBriefing.expandedContent) : null;
                
                if (briefingData) {
                  return (
                    <>
                      {/* Quick Summary Section */}
                      <div className="briefing-section">
                        <h3 className="briefing-section-title">Quick Summary</h3>
                        <div className="briefing-section-card">
                          {briefingData.summary.map((line, idx) => (
                            <p key={idx} className="briefing-text font-semibold">{line}</p>
                          ))}
                        </div>
                      </div>

                      {/* 고객 기본 정보 & Preference Section */}
                      <div className="briefing-section">
                        <h3 className="briefing-section-title">고객 기본 정보 & Preference</h3>
                        <div className="briefing-section-card">
                          <ul className="briefing-list">
                            {briefingData.preference.map((line, idx) => (
                              <li key={idx} className={line.startsWith("-") ? "" : "indent"}>{line.startsWith("-") ? line.substring(1).trim() : line}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* 자산 현황 & 최근 거래 내역 Section */}
                      <div className="briefing-section">
                        <h3 className="briefing-section-title">자산 현황 & 최근 거래 내역</h3>
                        <div className="briefing-section-card">
                          <ul className="briefing-list">
                            {briefingData.assets.map((line, idx) => (
                              <li key={idx} className={line.startsWith("-") ? "" : "indent"}>{line.startsWith("-") ? line.substring(1).trim() : line}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* 핵심 특이사항 & 상담 전 필수 체크 Section */}
                      <div className="briefing-section">
                        <h3 className="briefing-section-title">핵심 특이사항 & 상담 전 필수 체크</h3>
                        <div className="briefing-section-card">
                          <ul className="briefing-list">
                            {briefingData.notes.map((line, idx) => (
                              <li key={idx} className={line.startsWith("-") ? "" : "indent"}>{line.startsWith("-") ? line.substring(1).trim() : line}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* 이전 상담 히스토리 요약 Section (토글식 리스트) */}
                      <div className="briefing-section">
                        <h3 className="briefing-section-title">이전 상담 히스토리 요약 (클릭 시 상세 접고 펴기)</h3>
                        <div className="briefing-section-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {briefingData.history && briefingData.history.length > 0 ? (
                            briefingData.history.map((hist, idx) => (
                              <HistoryItem key={idx} hist={hist} c_id={selectedBriefing?.c_id} />
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

                // FALLBACK: 비정형 데이터 렌더링 (하드코딩 데이터 대신 실제 알림 본문 노출)
                return (
                  <div className="briefing-section">
                    <h3 className="briefing-section-title">브리핑 내용</h3>
                    <div className="briefing-section-card" style={{ padding: '20px', lineHeight: '1.8', color: '#334155' }}>
                      {selectedBriefing?.expandedContent && selectedBriefing.expandedContent.length > 0 ? (
                        selectedBriefing.expandedContent.map((line, idx) => (
                          <p key={idx} className="briefing-text" style={{ marginBottom: '8px' }}>
                            {line}
                          </p>
                        ))
                      ) : (
                        <p className="briefing-text">{selectedBriefing?.content || "브리핑 내용이 없습니다."}</p>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Resizer handle */}
            <div className="briefing-modal-resizer" onMouseDown={handleResizeStart} />
          </div>
        </div>
      )}
    </div>
  );
}
