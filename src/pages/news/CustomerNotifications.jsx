import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Calendar as CalendarIcon, MoreHorizontal } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import { api } from "../../api";
import "./News.css";

export default function CustomerNotifications() {
  const [activeTab, setActiveTab] = useState("today");
  const [activeDetailId, setActiveDetailId] = useState(null);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [selectedBriefing, setSelectedBriefing] = useState(null);
  const [modalSize, setModalSize] = useState({ width: 850, height: 650 });
  const [notificationsList, setNotificationsList] = useState([]);
  const [loading, setLoading] = useState(false);

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
      notes: []
    };
    
    let currentSection = null;
    let hasDynamicData = false;
    
    for (const line of expandedContent) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      // 섹션 마커 매칭 지원
      if (trimmed.includes("Quick Summary") || trimmed.includes("요약")) {
        currentSection = "summary";
        hasDynamicData = true;
      } else if (trimmed.includes("Preference") || trimmed.includes("고객 정보") || trimmed.includes("선호도")) {
        currentSection = "preference";
        hasDynamicData = true;
      } else if (trimmed.includes("자산 현황") || trimmed.includes("거래 내역") || trimmed.includes("자산")) {
        currentSection = "assets";
        hasDynamicData = true;
      } else if (trimmed.includes("특이사항") || trimmed.includes("체크 사항") || trimmed.includes("주의") || trimmed.includes("특이 사항")) {
        currentSection = "notes";
        hasDynamicData = true;
      } else if (currentSection) {
        result[currentSection].push(trimmed);
      }
    }
    
    if (!hasDynamicData) return null;
    return result;
  };


  const filteredNotifications = notificationsList;

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
                onClick={() => { setActiveTab('today'); setActiveDetailId(null); }}
              >
                오늘
              </button>
              <button 
                className={`news-alert-tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => { setActiveTab('all'); setActiveDetailId(null); }}
              >
                전체
              </button>
            </div>
          </div>

          {/* Notifications Card List */}
          <div className="news-alert-list">
            {filteredNotifications.map((notif) => {
              const isExpanded = activeDetailId === notif.id;
              return (
                <div key={notif.id} style={{ display: "flex", flexDirection: "column" }}>
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
                    </div>
                  )}
                </div>
              );
            })}
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
              <div className="briefing-modal-header-left">
                <span className="news-alert-badge badge-green">방문 예정 브리핑</span>
                <h2 className="briefing-modal-title">{selectedBriefing ? selectedBriefing.content : "방문 예정 브리핑"}</h2>
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
                            <li>고객명/등급: {getCustomerName(selectedBriefing.content)} 고객 (VIP)</li>
                            <li>담당 PB: 김재욱 팀장</li>
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
                    </>
                  );
                }

                // FALLBACK: 하드코딩 Mockup 레이아웃 (기존 디자인 유지 보장)
                return (
                  <>
                    {/* Quick Summary Section */}
                    <div className="briefing-section">
                      <h3 className="briefing-section-title">Quick Summary</h3>
                      <div className="briefing-section-card">
                        <p className="briefing-text font-semibold">금리 민감도가 매우 높은 2억 원 만기 재가입 대상 VIP 고객입니다.</p>
                        <p className="briefing-text font-semibold">타행 이탈 징후가 있으니 당행 특판 및 연계 상품(뉴플러스/채권형)을 통한 방어가 최우선 과제입니다.</p>
                      </div>
                    </div>

                    {/* 고객 기본 정보 & Preference Section */}
                    <div className="briefing-section">
                      <h3 className="briefing-section-title">고객 기본 정보 & Preference</h3>
                      <div className="briefing-section-card">
                        <ul className="briefing-list">
                          <li>고객명/등급: {selectedBriefing ? getCustomerName(selectedBriefing.content) : "김민준"} 고객 (VIP)</li>
                          <li>담당 PB: 김재욱 팀장</li>
                          <li>음료/편의 선호도 (★필독):</li>
                          <li className="indent">☕ 아이스 아메리카노(연하게) 선호.</li>
                          <li className="indent">❌ 비타500 절대 금지 (과거 제공 시 특유의 약품 냄새와 단맛을 싫어한다고 명확히 기재됨. 웰컴 드링크 준비 시 주의).</li>
                          <li className="indent">📰 대기 시간 발생 시 경제지(A일보) 제공 선호.</li>
                        </ul>
                      </div>
                    </div>

                    {/* 자산 현황 & 최근 거래 내역 Section */}
                    <div className="briefing-section">
                      <h3 className="briefing-section-title">자산 현황 & 최근 거래 내역</h3>
                      <div className="briefing-section-card">
                        <ul className="briefing-list">
                          <li>총 자산: 3억 2,000만 원 (전월 대비 ▼8%, 약 3,000만 원 감소)</li>
                          <li>보유 상품 상세:</li>
                          <li className="indent-2">정기예금: 2억 원 (금일 만기 도래)</li>
                          <li className="indent-2">공모 펀드: 5,000만 원 (글로벌 기술주 중심)</li>
                          <li className="indent-2">ISA: 3,000만 원</li>
                          <li>최근 자금 흐름:</li>
                          <li className="indent">2025.04.28 타행(신한은행)으로 3,000만 원 송금 확인 (이탈 자금 분석 필요).</li>
                        </ul>
                      </div>
                    </div>

                    {/* 핵심 특이사항 & 상담 전 필수 체크 Section */}
                    <div className="briefing-section">
                      <h3 className="briefing-section-title">핵심 특이사항 & 상담 전 필수 체크</h3>
                      <div className="briefing-section-card">
                        <ul className="briefing-list">
                          <li className="bullet-title">극도의 금리 민감 성향:</li>
                          <li className="indent">지난주 경쟁사(국민·신한)의 우대금리 이벤트를 직접 언급하며 비교 문의한 이력 있음. 0.1%p 차이에도 민감하게 반응하는 스타일.</li>
                          <li className="bullet-title">투자 성향 변화 조짐:</li>
                          <li className="indent">2025.04.15 유선 상담 당시, 기존 보유 중인 해외 펀드의 변동성에 피로감을 토로하며 일부 환매 후 안정적인 채권형 자산이나 고금리 예금으로 갈아탈 의향을 비춤.</li>
                          <li className="bullet-title">커뮤니케이션 스타일:</li>
                          <li className="indent">결론부터 듣는 것을 좋아하는 두괄식 성향. 복잡한 상품 구조 설명보다는 ‘세후 실질 수익률’과 ‘리스크 방어력’을 숫자로 정확히 제시할 때 만족도가 높음.</li>
                        </ul>
                      </div>
                    </div>
                  </>
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
