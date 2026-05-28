import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CustomerRegistrationModal from "./CustomerRegistrationModal";
import { Calendar, TrendingUp, Users, Bell, Plus, Search, LogOut, MoreVertical, PenLine, Check, Settings, ArrowUp, UserCircle } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import { api } from "../../api";
import "./Customer.css";


export default function CustomerMemoAssistant() {
  const location = useLocation();
  const path = location.pathname;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeListTab, setActiveListTab] = useState("전체 고객");
  const [allCustomersList, setAllCustomersList] = useState([]);
  const [todayCustomersList, setTodayCustomersList] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const pendingSelectedCustomerIdRef = useRef(null);
  const [fullCustomerDetail, setFullCustomerDetail] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTimelineId, setExpandedTimelineId] = useState(null);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [timelineList, setTimelineList] = useState([]);
  const [timelineDetails, setTimelineDetails] = useState({});
  const [generatedReport, setGeneratedReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [memoText, setMemoText] = useState("");

  const formatAssets = (assetVal) => {
    if (assetVal === undefined || assetVal === null) return "32억 1,234만";
    const bill = assetVal / 100000000;
    if (bill >= 1) {
      const rest = assetVal % 100000000;
      const restTenThousand = Math.round(rest / 10000);
      if (restTenThousand > 0) {
        return `${Math.floor(bill)}억 ${restTenThousand.toLocaleString()}만`;
      }
      return `${bill.toFixed(1)}억`;
    }
    return `${Math.round(assetVal / 10000).toLocaleString()}만`;
  };

  const fetchCustomers = async () => {
    try {
      const tabParam = activeListTab === '전체 고객' ? 'all' : 'today';
      const response = await api.customer.getList(tabParam);
      
      const mapped = response.map((c) => {
        const char = c.name ? c.name[0] : "고";
        const avatarColor = c.gender === "F" ? "pink" : "blue";
        return {
          id: c.c_id,
          name: c.name,
          email: c.email || `${c.c_id}@poom.com`,
          phone: c.phone || "010-0000-0000",
          color: avatarColor,
          gender: c.gender,
          initial: char,
          time: c.c_id % 2 === 0 ? "10:00 AM" : "14:30 PM",
        };
      });

      if (activeListTab === '전체 고객') {
        setAllCustomersList(mapped);
      } else {
        setTodayCustomersList(mapped);
      }
      
      if (pendingSelectedCustomerIdRef.current) {
        setSelectedCustomerId(pendingSelectedCustomerIdRef.current);
        pendingSelectedCustomerIdRef.current = null;
      } else {
        setSelectedCustomerId(null);
      }
    } catch (error) {
      console.error("고객 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [activeListTab]);

  useEffect(() => {
    if (!selectedCustomerId) {
      setFullCustomerDetail(null);
      return;
    }
    
    const fetchDetail = async () => {
      try {
        const detail = await api.customer.getDetail(selectedCustomerId);
        setFullCustomerDetail(detail);
      } catch (error) {
        console.error("고객 상세 정보 조회 실패:", error);
      }
    };
    
    fetchDetail();
  }, [selectedCustomerId]);

  const [simulatorSaved, setSimulatorSaved] = useState(true);

  useEffect(() => {
    if (!selectedCustomerId) {
      setSimulatorSaved(true);
      return;
    }
    
    const fetchSimInfo = async () => {
      try {
        const res = await api.customer.getSimulatorInfo(selectedCustomerId);
        if (res) {
          setSimulatorSaved(res.exists);
          setAdditionalNotes(prev => ({
            ...prev,
            [selectedCustomerId]: res.additional_notes || ""
          }));
        }
      } catch (error) {
        console.error("시뮬레이터 정보 조회 실패:", error);
      }
    };
    
    fetchSimInfo();
  }, [selectedCustomerId]);

  const fetchTimeline = async (cId) => {
    const targetId = cId || selectedCustomerId;
    if (!targetId) return;
    try {
      const res = await api.customer.getMemos(targetId);
      setTimelineList(res.timelines || []);
      setTimelineDetails({});
      setExpandedTimelineId(null);
    } catch (error) {
      console.error("타임라인 조회 실패:", error);
      setTimelineList([]);
    }
  };

  useEffect(() => {
    if (!selectedCustomerId) {
      setTimelineList([]);
      setTimelineDetails({});
      setExpandedTimelineId(null);
      return;
    }
    
    fetchTimeline(selectedCustomerId);
  }, [selectedCustomerId]);

  const handleTimelineClick = async (timelineId) => {
    const isExpanded = expandedTimelineId === timelineId;
    if (isExpanded) {
      setExpandedTimelineId(null);
    } else {
      setExpandedTimelineId(timelineId);
      if (!timelineDetails[timelineId]) {
        try {
          const detail = await api.customer.getMemoDetail(selectedCustomerId, timelineId);
          setTimelineDetails(prev => ({
            ...prev,
            [timelineId]: detail
          }));
        } catch (error) {
          console.error("타임라인 상세 조회 실패:", error);
        }
      }
    }
  };

  useEffect(() => {
    setGeneratedReport(null);
    setMemoText("");
  }, [selectedCustomerId]);

  const handleGenerateReport = async () => {
    if (!selectedCustomerId || !memoText.trim()) return;
    
    setIsGenerating(true);
    try {
      const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
      const res = await api.customer.generateReport(selectedCustomerId, {
        memo: memoText,
        consult_date: nowStr
      });
      
      if (res && res.data) {
        setGeneratedReport({
          ...res.data,
          date: nowStr.split(' ')[0].replace(/-/g, '.')
        });
      }
    } catch (error) {
      console.error("AI 보고서 생성 실패:", error);
      alert("AI 보고서 생성 중 오류가 발생했습니다: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveReport = async () => {
    if (!selectedCustomerId || !memoText.trim() || !generatedReport?.cm_id) {
      alert("AI 보고서를 먼저 생성한 후에 저장할 수 있습니다.");
      return;
    }
    
    const reportContent = {
      main_content: generatedReport.main_content,
      special_remarks: generatedReport.special_remarks,
      follow_up: generatedReport.follow_up,
      summary: generatedReport.summary || ""
    };

    try {
      await api.customer.saveReport(selectedCustomerId, {
        cm_id: generatedReport.cm_id,
        content: reportContent
      });

      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 2000);
      
      await fetchTimeline(selectedCustomerId);
    } catch (error) {
      console.error("보고서 저장 실패:", error);
      alert("보고서 저장 중 오류가 발생했습니다: " + error.message);
    }
  };
  
  const currentList = activeListTab === '전체 고객' ? allCustomersList : todayCustomersList;
  const selectedCustomer = (allCustomersList.concat(todayCustomersList).find(c => c.id === selectedCustomerId) || currentList[0]) || { name: "로딩중...", color: "gray", initial: "고" };

  const [activeTab, setActiveTab] = useState("memo"); // "memo" or "simulator"
  const [listWidth, setListWidth] = useState(320);
  const [isDragging, setIsDragging] = useState(false);
  const isNarrow = listWidth < 220;

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const startX = e.clientX;
    const startWidth = listWidth;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.max(240, Math.min(550, startWidth + deltaX));
      setListWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const [additionalNotes, setAdditionalNotes] = useState({});
  const [showNotesSaveToast, setShowNotesSaveToast] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState({});
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    if (activeTab === "simulator") {
      scrollToBottom();
    }
  }, [chatMessages, isTyping, activeTab]);

  const selectedSimDetails = {
    name: selectedCustomer ? `${selectedCustomer.name} (${fullCustomerDetail?.grade || "VIP"})` : "로딩중...",
    birthday: fullCustomerDetail?.birthday ? fullCustomerDetail.birthday.replace(/-/g, '.') : "-",
    job: fullCustomerDetail?.job || "-",
    risk: fullCustomerDetail?.tendency || "위험 중립형",
    assets: formatAssets(fullCustomerDetail?.total_assets),
    assetsRaw: fullCustomerDetail?.total_assets !== undefined ? (fullCustomerDetail.total_assets / 100000000) : 0, // in 100M units
    needs: fullCustomerDetail?.llm_insight ? 
      (fullCustomerDetail.llm_insight.length > 30 ? fullCustomerDetail.llm_insight.slice(0, 30) + "..." : fullCustomerDetail.llm_insight) 
      : "등록된 주요 니즈가 없습니다.",
    insight: fullCustomerDetail?.llm_insight || "등록된 AI 인사이트가 없습니다.",
    products: fullCustomerDetail ? [
      fullCustomerDetail.deposit > 0 ? "예적금" : null,
      fullCustomerDetail.investment > 0 ? "투자상품" : null,
      fullCustomerDetail.pension > 0 ? "연금보험" : null,
    ].filter(Boolean).join(" + ") || "보유 상품 없음" : "보유 상품 없음",
    lastCounsel: timelineList.length > 0 ? timelineList[0].date : "상담 이력 없음",
    nextCounsel: (timelineList.length > 0 && timelineDetails[timelineList[0].timelineId]?.content?.next_consult) 
      ? timelineDetails[timelineList[0].timelineId].content.next_consult 
      : "미정"
  };

  const handleNotesChange = (id, val) => {
    setAdditionalNotes(prev => ({
      ...prev,
      [id]: val
    }));
    setSimulatorSaved(false);
  };

  const handleSaveNotes = async () => {
    if (!selectedCustomerId) return;
    const notes = additionalNotes[selectedCustomerId] || "";
    try {
      await api.customer.saveSimulatorInfo(selectedCustomerId, {
        additional_notes: notes
      });
      setSimulatorSaved(true);
      setShowNotesSaveToast(true);
      setTimeout(() => setShowNotesSaveToast(false), 2000);
    } catch (error) {
      console.error("시뮬레이터 정보 저장 실패:", error);
      alert("시뮬레이터 정보 저장 중 오류가 발생했습니다: " + error.message);
    }
  };

  const handleSendQuestion = async () => {
    if (!selectedCustomerId || !currentQuestion.trim()) return;
    
    const question = currentQuestion;
    const notes = additionalNotes[selectedCustomerId] || "";
    
    const userMsg = { sender: 'user', text: question };
    setChatMessages(prev => ({
      ...prev,
      [selectedCustomerId]: [...(prev[selectedCustomerId] || []), userMsg]
    }));
    
    setCurrentQuestion("");
    setIsTyping(true);
    
    try {
      const res = await api.customer.simulatorChat(selectedCustomerId, {
        question: question,
        additional_notes: notes
      });
      
      if (res && res.data && res.data.answer) {
        const aiMsg = { sender: 'ai', text: res.data.answer };
        setChatMessages(prev => ({
          ...prev,
          [selectedCustomerId]: [...(prev[selectedCustomerId] || []), aiMsg]
        }));
      }
    } catch (error) {
      console.error("시뮬레이션 질의 실패:", error);
      const errorMsg = { sender: 'ai', text: "시뮬레이션 답변을 받아오는 도중 오류가 발생했습니다: " + error.message };
      setChatMessages(prev => ({
        ...prev,
        [selectedCustomerId]: [...(prev[selectedCustomerId] || []), errorMsg]
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const filteredCustomers = currentList.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div className="cust-container">
      {/* Sidebar */}
      <Sidebar type="cust" />

      {/* Main Content */}
      <div className={`cust-main ${isDragging ? 'dragging' : ''}`}>

        {/* Left Panel */}
        <div className={`cust-list-panel ${isModalOpen ? 'cust-blurred-content' : ''} ${isNarrow ? 'narrow' : ''}`} style={{ width: listWidth, flexShrink: 0, padding: isNarrow ? '20px 10px' : '24px' }}>
          <div className="cust-list-header" style={{ marginBottom: isNarrow ? '16px' : '24px' }}>
            <h2 className="cust-list-title" style={{ fontSize: isNarrow ? '15px' : '18px' }}>나의 고객</h2>
            <button className="cust-add-btn" onClick={() => setIsModalOpen(true)}><Plus size={16} /></button>
          </div>
          
          <div className="cust-search" style={{ marginBottom: isNarrow ? '16px' : '24px' }}>
            <Search size={16} className="cust-search-icon" style={{ left: isNarrow ? '10px' : '12px' }} />
            <input 
              type="text" 
              className="cust-search-input" 
              placeholder={isNarrow ? "" : "Search"} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: isNarrow ? '32px' : '40px', paddingRight: isNarrow ? '8px' : '16px' }}
            />
          </div>

          <div className="cust-list-tabs" style={{ marginBottom: isNarrow ? '12px' : '16px' }}>
            <div className={`cust-list-tab ${activeListTab === '전체 고객' ? 'active' : ''}`} onClick={() => { setActiveListTab('전체 고객'); }} style={{ cursor: 'pointer', padding: isNarrow ? '8px 0' : '12px 0', fontSize: isNarrow ? '12px' : '14px' }}>
              {isNarrow ? '전체' : '전체 고객'}
            </div>
            <div className={`cust-list-tab ${activeListTab === '오늘 방문' ? 'active' : ''}`} onClick={() => { setActiveListTab('오늘 방문'); }} style={{ cursor: 'pointer', padding: isNarrow ? '8px 0' : '12px 0', fontSize: isNarrow ? '12px' : '14px' }}>
              {isNarrow ? '오늘' : '오늘 방문'}
            </div>
          </div>

          <div className="cust-list-items">
            {filteredCustomers.map(c => (
              <div 
                className={`cust-list-item ${selectedCustomerId === c.id ? 'active' : ''}`} 
                key={c.id} 
                onClick={() => setSelectedCustomerId(c.id)} 
                style={{ 
                  cursor: 'pointer',
                  padding: isNarrow ? '10px 8px' : '12px 16px',
                  gap: isNarrow ? '10px' : '16px'
                }}
              >
                <div className={`cust-avatar ${c.color}`}>{c.initial}</div>
                {!isNarrow ? (
                  <div className="cust-item-info">
                    <span className="cust-item-name">{c.name}</span>
                    <span className="cust-item-sub">{c.email}</span>
                    <span className="cust-item-sub">{c.phone}</span>
                  </div>
                ) : (
                  <div className="cust-item-info" style={{ justifyContent: 'center' }}>
                    <span className="cust-item-name" style={{ fontSize: '14px' }}>{c.name}</span>
                  </div>
                )}
                {c.time && !isNarrow && <div className="cust-item-time">{c.time}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Resizer Divider */}
        <div className={`cust-resizer ${isDragging ? 'dragging' : ''}`} onMouseDown={handleMouseDown} />

        {/* Right Detail Panel */}
        <div key={selectedCustomerId || 'empty'} className={`cust-detail-panel ${isModalOpen ? 'cust-blurred-content' : ''}`}>
          {selectedCustomerId ? (
            <>
              <div className="cust-detail-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '24px' }}>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="cust-detail-profile">
                    <div className={`cust-avatar ${selectedCustomer.color}`}>{selectedCustomer.initial}</div>
                    <h2>{selectedCustomer.name}</h2>
                  </div>
                </div>
            <div className="cust-detail-tabs" style={{ margin: 0 }}>
              <button 
                className={`cust-detail-tab ${activeTab === 'memo' ? 'active' : ''}`}
                onClick={() => setActiveTab('memo')}
              >
                메모 어시스턴트
              </button>
              <button 
                className={`cust-detail-tab ${activeTab === 'simulator' ? 'active' : ''}`}
                onClick={() => setActiveTab('simulator')}
              >
                시뮬레이터
              </button>
            </div>
          </div>

          {activeTab === 'memo' && (
            <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 24px 24px 24px' }}>
            <div className="memo-layout-grid">
            {/* Memo Input */}
            <div className="memo-box" style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <div className="memo-box-title">메모 입력</div>
              <textarea 
                className="memo-textarea" 
                placeholder="상담 내용을 이곳에 메모하세요."
                value={memoText}
                onChange={(e) => setMemoText(e.target.value)}
                style={{ minHeight: '200px', flex: 1, marginBottom: '16px', resize: 'none' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                <div className="memo-tip" style={{ margin: 0, width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  💡 자유롭게 메모하세요. AI가 구조화된 상담 보고서로 변환합니다.
                </div>
                <button 
                  className="memo-small-btn" 
                  disabled={isGenerating}
                  onClick={handleGenerateReport}
                  style={{ 
                    border: '1px solid #0284c7', 
                    color: 'white', 
                    background: '#0284c7',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    opacity: isGenerating ? 0.6 : 1
                  }}
                >
                  {isGenerating ? "생성 중..." : "AI 보고서 생성"}
                </button>
              </div>
            </div>

            {/* AI Report */}
            <div className="memo-box">
              <div className="memo-box-title">
                AI 상담 보고서
              </div>
              
              <table className="report-table">
                <tbody>
                  <tr>
                    <th>고객명</th>
                    <td>
                      {generatedReport ? (
                        generatedReport.customer_name
                      ) : (
                        selectedCustomer.name || "-"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>주요 내용</th>
                    <td>
                      {generatedReport ? (
                        generatedReport.main_content
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>특이사항</th>
                    <td>
                      {generatedReport ? (
                        generatedReport.special_remarks
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>후속 조치</th>
                    <td>
                      {generatedReport ? (
                        generatedReport.follow_up
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>요약</th>
                    <td>
                      {generatedReport ? (
                        generatedReport.summary
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <div className="memo-tip" style={{ margin: 0, width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  ⚠️ AI를 통해 생성한 결과물에는 실수가 포함될 수 있습니다.
                </div>
                <div className="report-actions" style={{ justifyContent: 'flex-end', position: 'relative', width: '100%', margin: 0 }}>
                  {showSaveToast && (
                    <div style={{
                      position: 'absolute', right: '80px', top: '50%', transform: 'translateY(-50%)',
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: '#334155', color: 'white',
                      padding: '8px 16px', borderRadius: 20,
                      fontSize: 14, fontWeight: 500,
                      whiteSpace: 'nowrap'
                    }}>
                      <div style={{ width: 18, height: 18, background: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={12} color="white" strokeWidth={3} />
                      </div>
                      저장완료
                    </div>
                  )}
                  <button 
                    className="report-btn report-btn-primary"
                    onClick={handleSaveReport}
                  >
                    저장
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="timeline-box">
            <div className="memo-box-title" style={{ marginBottom: 24 }}>이전 상담 타임라인</div>
            
            {timelineList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8', fontSize: '13px', fontWeight: '500' }}>
                이전 상담 타임라인 이력이 없습니다.
              </div>
            ) : (
              timelineList.map((item, index) => {
                const isExpanded = expandedTimelineId === item.timelineId;
                const isLast = index === timelineList.length - 1;
                return (
                  <div 
                    key={item.timelineId} 
                    className="timeline-item"
                    onClick={() => handleTimelineClick(item.timelineId)}
                    style={{ 
                      cursor: 'pointer', 
                      background: isExpanded ? '#f0f4f8' : 'transparent',
                      padding: isExpanded ? '16px' : '0',
                      borderRadius: isExpanded ? '12px' : '0',
                      margin: isExpanded ? '0 -16px 24px -16px' : '0 0 24px 0',
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    <div className="timeline-dot" style={{ 
                      borderColor: isExpanded ? '#f97316 #3b82f6 #3b82f6 #f97316' : '#0284c7',
                      borderWidth: '2px',
                      color: isExpanded ? '#0f172a' : '#0284c7',
                    }}>
                    </div>
                    {!isLast && (
                      <div className="timeline-line" style={{
                        left: isExpanded ? '32px' : '16px',
                        top: isExpanded ? '48px' : '32px',
                        borderLeft: '1px dotted #94a3b8',
                        background: 'none',
                        width: '0',
                        bottom: '-24px'
                      }}></div>
                    )}
                    <div className="timeline-content" style={{ paddingLeft: isExpanded ? '8px' : '0' }}>
                      <span className="timeline-date">{item.date}</span>
                      <span className="timeline-text" style={{ color: isExpanded ? '#0f172a' : '#475569', fontWeight: isExpanded ? '600' : 'normal' }}>
                        {item.content?.summary || item.memo}
                      </span>
                      
                      {isExpanded && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                          {/* Box 1: 원본메모 */}
                          <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>
                              <PenLine size={14} /> 원본메모
                            </div>
                            <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                              {timelineDetails[item.timelineId]?.memo || "로딩중..."}
                            </div>
                          </div>
  
                          {/* Box 2: AI 요약 */}
                          <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8b5cf6', fontSize: '13px', fontWeight: '700', marginBottom: '12px' }}>
                              AI 요약
                            </div>
                            {timelineDetails[item.timelineId] ? (
                              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                                <tbody>
                                  <tr>
                                    <td style={{ color: '#64748b', fontWeight: '600', paddingBottom: '8px', width: '80px', verticalAlign: 'top' }}>주요 내용</td>
                                    <td style={{ color: '#334155', paddingBottom: '8px', verticalAlign: 'top', fontWeight: '600', whiteSpace: 'pre-wrap' }}>
                                      {timelineDetails[item.timelineId].content.main_content || "-"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={{ color: '#64748b', fontWeight: '600', paddingBottom: '8px', width: '80px', verticalAlign: 'top' }}>특이사항</td>
                                    <td style={{ color: '#334155', paddingBottom: '8px', verticalAlign: 'top', fontWeight: '600', whiteSpace: 'pre-wrap' }}>
                                      {timelineDetails[item.timelineId].content.special_remarks || "-"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={{ color: '#64748b', fontWeight: '600', paddingBottom: '8px', width: '80px', verticalAlign: 'top' }}>후속 조치</td>
                                    <td style={{ color: '#334155', paddingBottom: '8px', verticalAlign: 'top', fontWeight: '600', whiteSpace: 'pre-wrap' }}>
                                      {timelineDetails[item.timelineId].content.follow_up || "-"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={{ color: '#64748b', fontWeight: '600', paddingBottom: '8px', width: '80px', verticalAlign: 'top' }}>요약</td>
                                    <td style={{ color: '#334155', paddingBottom: '8px', verticalAlign: 'top', fontWeight: '600', whiteSpace: 'pre-wrap' }}>
                                      {timelineDetails[item.timelineId].content.summary || "-"}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            ) : (
                              <div style={{ fontSize: '13px', color: '#94a3b8' }}>로딩중...</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          </div>
          )}

          {activeTab === 'simulator' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', height: 'calc(100% - 100px)', padding: '8px 24px 24px 24px', boxSizing: 'border-box', overflow: 'hidden' }}>
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: 0 }}>
                
                {/* Customer Info Box */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px', flex: 1, minHeight: 0, overflowY: 'auto' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '12px', marginTop: 0 }}>고객 정보</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                      <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>고객명(등급)</span>
                      <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: 600 }}>{selectedSimDetails.name}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                      <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>생년월일</span>
                      <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: 600 }}>{selectedSimDetails.birthday}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                      <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>직업</span>
                      <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: 600 }}>{selectedSimDetails.job}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                      <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>성향</span>
                      <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: 600 }}>{selectedSimDetails.risk}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                      <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>총자산</span>
                      <span style={{ color: '#0284c7', fontSize: '13px', fontWeight: 700 }}>{selectedSimDetails.assets}</span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '4px' }}>
                      <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>AI 인사이트</span>
                      <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: 600, lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                        {selectedSimDetails.insight}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Additional Inputs Box */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '12px', marginTop: 0 }}>추가 입력 사항</h3>
                  
                  <textarea
                    style={{ 
                      flex: 1, 
                      width: '100%', 
                      border: '1px solid #cbd5e1', 
                      borderRadius: '8px', 
                      padding: '12px 16px', 
                      fontSize: '13px', 
                      color: '#334155', 
                      resize: 'none',
                      outline: 'none',
                      boxSizing: 'border-box',
                      marginBottom: '12px',
                      fontFamily: 'inherit'
                    }}
                    placeholder={`추가 내용을 자유롭게 입력하세요.\n예) 내년 초 부동산 매도 예정, 자녀 유학 자금 필요\n...`}
                    value={additionalNotes[selectedCustomerId] || ""}
                    onChange={(e) => handleNotesChange(selectedCustomerId, e.target.value)}
                  />
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', position: 'relative' }}>
                    {showNotesSaveToast && (
                      <div style={{
                        position: 'absolute', right: '80px', top: '50%', transform: 'translateY(-50%)',
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: '#334155', color: 'white',
                        padding: '6px 12px', borderRadius: 20,
                        fontSize: 12, fontWeight: 500,
                        whiteSpace: 'nowrap',
                        zIndex: 10
                      }}>
                        <div style={{ width: 14, height: 14, background: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={10} color="white" strokeWidth={3} />
                        </div>
                        저장완료
                      </div>
                    )}
                    {simulatorSaved ? (
                      <span style={{ marginRight: '12px', fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                        저장됨
                      </span>
                    ) : (
                      <span style={{ marginRight: '12px', fontSize: '12px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }}></span>
                        저장 필요
                      </span>
                    )}
                    <button
                      onClick={() => handleSaveNotes()}
                      style={{ 
                        background: '#0284c7', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '6px', 
                        padding: '8px 20px', 
                        fontSize: '12px', 
                        fontWeight: 600, 
                        cursor: 'pointer' 
                      }}
                    >
                      저장
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Right Column (Chat simulator) */}
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', minHeight: 0 }}>
                
                {/* Messages Panel */}
                <div 
                  ref={messagesContainerRef}
                  style={{ 
                    flex: 1, 
                    overflowY: 'auto', 
                    paddingRight: '8px', 
                    paddingBottom: '80px', // Space for bottom input
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    minHeight: 0
                  }}
                >
                  {(!chatMessages[selectedCustomerId] || chatMessages[selectedCustomerId].length === 0) ? (
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      height: '100%', 
                      textAlign: 'center',
                      color: '#64748b',
                      padding: '24px',
                      boxSizing: 'border-box'
                    }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#475569', lineHeight: '1.6', marginBottom: '12px' }}>
                        PB님, 왼쪽에서 고객 정보와 추가 입력 사항을 저장한 후,<br />
                        상담 지원용 시뮬레이션 질문을 입력해보세요.
                      </p>
                      <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.8' }}>
                        예) "이 고객의 자산 포트폴리오를 기반으로 한 절세 전략 제안해줘"<br />
                        "추가 유학 자금 2억 마련을 위해 추천하는 상담 화법은?"
                      </p>
                    </div>
                  ) : (
                    chatMessages[selectedCustomerId].map((msg, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          display: 'flex', 
                          justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                          width: '100%'
                        }}
                      >
                        <div style={{ 
                          maxWidth: '85%', 
                          background: msg.sender === 'user' ? '#0284c7' : '#f1f5f9', 
                          color: msg.sender === 'user' ? 'white' : '#0f172a',
                          padding: '10px 14px', 
                          borderRadius: msg.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                          fontSize: '12px',
                          lineHeight: '1.5',
                          whiteSpace: 'pre-wrap',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                        }}>
                          {msg.text}
                        </div>
                      </div>
                    ))
                  )}
                  {isTyping && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                      <div style={{ 
                        background: '#f1f5f9', 
                        color: '#64748b',
                        padding: '10px 14px', 
                        borderRadius: '12px 12px 12px 2px',
                        fontSize: '11px',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span className="dot-typing">AI가 시뮬레이션 분석 중입니다...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Bottom Chat Input */}
                <div style={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  right: 0, 
                  background: 'white', 
                  paddingTop: '8px',
                  paddingBottom: '8px'
                }}>
                  <div style={{ 
                    border: '1px solid #cbd5e1', 
                    borderRadius: '24px', 
                    padding: '4px 4px 4px 12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    background: 'white',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                  }}>
                    <input 
                      type="text" 
                      style={{ 
                        flex: 1, 
                        border: 'none', 
                        outline: 'none', 
                        fontSize: '13px',
                        background: 'transparent'
                      }}
                      placeholder="상담 지원용 시뮬레이션 질문을 입력하세요."
                      value={currentQuestion}
                      onChange={(e) => setCurrentQuestion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendQuestion();
                        }
                      }}
                    />
                    <button 
                      onClick={() => handleSendQuestion()}
                      style={{ 
                        background: '#0f172a', 
                        color: 'white', 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        border: 'none', 
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                    >
                      <ArrowUp size={16} />
                    </button>
                  </div>
                </div>
                
              </div>
            </div>
          )}
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', textAlign: 'center', flex: 1 }}>
              {activeListTab === '전체 고객' ? (
                <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <UserCircle size={48} color="#0284c7" strokeWidth={1.5} />
                </div>
              ) : (
                <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <Calendar size={48} color="#ffffff" strokeWidth={1.5} />
                </div>
              )}
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>{activeListTab === '전체 고객' ? '전체 고객 목록' : '오늘 방문 고객'}</h2>
              <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 40, whiteSpace: 'pre-wrap', color: '#94a3b8' }}>
                {activeListTab === '전체 고객' ? '왼쪽 목록에서 고객을 선택하면\n상세 정보를 확인할 수 있어요.' : '왼쪽에서 오늘 방문 고객을 선택하면\n상세 정보를 확인할 수 있어요.'}
              </p>
              {activeListTab === '전체 고객' && <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>고객 이름을 클릭해 메모 어시스턴트와 시뮬레이터를 확인하세요</p>}
            </div>
          )}
        </div>
      <CustomerRegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={async (newData) => {
          try {
            const created = await api.customer.create({
              name: newData.name || "신규 고객",
              email: newData.email || "new@email.com",
              phone: newData.phone || "010-0000-0000",
              address: newData.address || "서울시 강남구",
              job: newData.job || "회사원",
              grade: newData.grade || "일반",
              investment_type: newData.investment_type || "위험중립형",
              birth: newData.dob ? newData.dob.replace(/\./g, "-") : null,
              gender: newData.gender || "M",
            });

            pendingSelectedCustomerIdRef.current = created.c_id;
            setActiveListTab("전체 고객");

            // Fetch refreshed list to update the client state
            const response = await api.customer.getList("all");
            const mapped = response.map((c) => {
              const char = c.name ? c.name[0] : "고";
              const avatarColor = c.gender === "F" ? "pink" : "blue";
              return {
                id: c.c_id,
                name: c.name,
                email: c.email || `${c.c_id}@poom.com`,
                phone: c.phone || "010-0000-0000",
                color: avatarColor,
                gender: c.gender,
                initial: char,
                time: c.c_id % 2 === 0 ? "10:00 AM" : "14:30 PM",
              };
            });

            setAllCustomersList(mapped);
            setSelectedCustomerId(created.c_id);
            setIsModalOpen(false);
          } catch (error) {
            alert("고객 등록 중 오류가 발생했습니다: " + error.message);
          }
        }}
      />
      </div>
    </div>
  );
}
