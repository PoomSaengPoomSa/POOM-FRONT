import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CustomerRegistrationModal from "../customer/CustomerRegistrationModal";
import { Calendar, TrendingUp, Users, Bell, Plus, Search, LogOut, MoreVertical, PenLine, Check, Settings, ArrowUp, UserCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import { api } from "../../api";
import "../customer/Customer.css";


export default function CounselingAssistant() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListCollapsed, setIsListCollapsed] = useState(false);
  const [showTodayOnly, setShowTodayOnly] = useState(true);
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
  const [consultDate, setConsultDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });

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
      const tabParam = showTodayOnly ? 'today' : 'all';
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
        };
      });

      mapped.sort((a, b) => a.name.localeCompare(b.name, 'ko'));

      if (showTodayOnly) {
        setTodayCustomersList(mapped);
      } else {
        setAllCustomersList(mapped);
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
  }, [showTodayOnly]);

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
          if (res.history && res.history.length > 0) {
            const mappedHistory = res.history.map(item => ({
              sender: item.role === 'user' ? 'user' : 'ai',
              text: item.content
            }));
            setChatMessages(prev => ({
              ...prev,
              [selectedCustomerId]: mappedHistory
            }));
          } else {
            setChatMessages(prev => ({
              ...prev,
              [selectedCustomerId]: []
            }));
          }
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
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setConsultDate(`${yyyy}-${mm}-${dd}`);
  }, [selectedCustomerId]);

  const handleGenerateReport = async () => {
    if (!selectedCustomerId || !memoText.trim()) return;
    
    setIsGenerating(true);
    try {
      const res = await api.customer.generateReport(selectedCustomerId, {
        memo: memoText,
        consult_date: consultDate
      });
      
      if (res && res.data) {
        setGeneratedReport({
          ...res.data,
          date: consultDate.replace(/-/g, '.')
        });
      }
    } catch (error) {
      console.error("AI 보고서 생성 실패:", error);
      alert("AI 보고서 생성 중 오류가 발생했습니다: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReportFieldChange = (field, val) => {
    setGeneratedReport(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const handleSaveReport = async () => {
    if (!selectedCustomerId || !memoText.trim()) {
      alert("상담 메모를 입력해주세요.");
      return;
    }
    
    const reportContent = {
      main_content: generatedReport?.main_content || "",
      special_remarks: generatedReport?.special_remarks || "",
      follow_up: generatedReport?.follow_up || "",
      summary: generatedReport?.summary || ""
    };

    try {
      await api.customer.saveReport(selectedCustomerId, {
        cm_id: generatedReport?.cm_id || null,
        memo: memoText,
        consult_date: consultDate,
        content: reportContent
      });

      setShowSaveToast(true);
      setTimeout(() => {
        setShowSaveToast(false);
        setGeneratedReport(null);
        setMemoText("");
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        setConsultDate(`${yyyy}-${mm}-${dd}`);
      }, 2000);
      
      await fetchTimeline(selectedCustomerId);
    } catch (error) {
      console.error("보고서 저장 실패:", error);
      alert("보고서 저장 중 오류가 발생했습니다: " + error.message);
    }
  };
  
  const currentList = showTodayOnly ? todayCustomersList : allCustomersList;
  const selectedCustomer = (allCustomersList.concat(todayCustomersList).find(c => c.id === selectedCustomerId) || currentList[0]) || { name: "로딩중...", color: "gray", initial: "고" };

  const [activeTab, setActiveTab] = useState("simulator"); // "memo" or "simulator"

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    navigate(`/counseling-assistant?tab=${tabName}`, { replace: true });
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get("tab");
    if (tab === "simulator" || tab === "memo") {
      setActiveTab(tab);
    }
  }, [location.search]);

  const [listWidth, setListWidth] = useState(240);
  const [isDragging, setIsDragging] = useState(false);
  const isNarrow = listWidth < 200;

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
      : "AI의 분석이 진행되지 않았습니다.",
    insight: fullCustomerDetail?.llm_insight || "AI의 분석이 진행되지 않았습니다.",
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
      setChatMessages(prev => ({
        ...prev,
        [selectedCustomerId]: []
      }));
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
        <div 
          className={`cust-list-panel ${isModalOpen ? 'cust-blurred-content' : ''} ${isNarrow ? 'narrow' : ''}`} 
          style={{ 
            width: isListCollapsed ? 0 : listWidth, 
            flexShrink: 0, 
            padding: isListCollapsed ? 0 : (isNarrow ? '20px 10px' : '24px'),
            overflow: 'hidden',
            border: isListCollapsed ? 'none' : '1px solid var(--cust-glass-border)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div className="cust-list-header" style={{ marginBottom: isNarrow ? '16px' : '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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

          <div className="cust-filter-area" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: isNarrow ? '12px' : '16px' }}>
            <label className="cust-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: isNarrow ? '11px' : '13px', fontWeight: 600, color: '#334155', userSelect: 'none' }}>
              <input 
                type="checkbox" 
                className="cust-checkbox-input" 
                checked={showTodayOnly}
                onChange={(e) => setShowTodayOnly(e.target.checked)}
                style={{ 
                  width: '14px', 
                  height: '14px', 
                  accentColor: '#0284c7', 
                  cursor: 'pointer',
                  borderRadius: '4px'
                }} 
              />
              <span>{isNarrow ? '오늘 방문' : '오늘 방문 고객만 보기'}</span>
            </label>
          </div>

          <div className="cust-list-items">
            {filteredCustomers.map(c => (
              <div 
                className={`cust-list-item ${selectedCustomerId === c.id ? 'active' : ''}`} 
                key={c.id} 
                onClick={() => { setSelectedCustomerId(c.id); setIsListCollapsed(true); }} 
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
              </div>
            ))}
          </div>
        </div>

        {/* Resizer Divider */}
        <div 
          className={`cust-resizer ${isDragging ? 'dragging' : ''}`} 
          onMouseDown={isListCollapsed ? null : handleMouseDown} 
          style={{ 
            width: isListCollapsed ? '16px' : '24px', 
            cursor: isListCollapsed ? 'default' : 'col-resize',
            position: 'relative'
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsListCollapsed(!isListCollapsed);
            }}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 100,
              color: '#0284c7',
              transition: 'transform 0.2s, background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
          >
            {isListCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Right Detail Panel */}
        <div key={selectedCustomerId || 'empty'} className={`cust-detail-panel ${isModalOpen ? 'cust-blurred-content' : ''}`}>
          {selectedCustomerId ? (
            <>
              <div className="cust-detail-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="cust-detail-profile">
                    <div className={`cust-avatar ${selectedCustomer.color}`}>{selectedCustomer.initial}</div>
                    <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 700, color: '#0f172a' }}>{selectedCustomer.name}</h2>
                  </div>
                </div>

                {/* AI Workspace Tabs */}
                <div style={{ display: 'flex', gap: '0px', borderBottom: 'none', margin: '0 0 -1px 0' }}>
                  <button
                    onClick={() => handleTabChange("simulator")}
                    style={{
                      width: '180px',
                      justifyContent: 'center',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: activeTab === 'simulator' ? '#8b5cf6' : '#64748b',
                      border: 'none',
                      background: activeTab === 'simulator' ? '#f5f3ff' : 'transparent',
                      borderBottom: activeTab === 'simulator' ? '2px solid #8b5cf6' : '2px solid transparent',
                      borderRadius: '6px 0 0 0',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease-in-out',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <TrendingUp size={13} />
                    AI 시뮬레이터
                  </button>
                  <button
                    onClick={() => handleTabChange("memo")}
                    style={{
                      width: '180px',
                      justifyContent: 'center',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: activeTab === 'memo' ? '#8b5cf6' : '#64748b',
                      border: 'none',
                      background: activeTab === 'memo' ? '#f5f3ff' : 'transparent',
                      borderBottom: activeTab === 'memo' ? '2px solid #8b5cf6' : '2px solid transparent',
                      borderRadius: '0 6px 0 0',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease-in-out',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <PenLine size={13} />
                    AI 메모 어시스턴트
                  </button>
                </div>
              </div>

              {/* Unified Single Scroll Layout */}
              <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 24px 32px 24px', gap: '24px' }}>
                
                {/* Section 1: Memo Assistant (Top Workspace) */}
                {activeTab === "memo" && (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '4px', height: '17px', background: '#8b5cf6', borderRadius: '2px', display: 'inline-block' }}></span>
                    상담 메모 및 보고서 어시스턴트
                  </div>
                  
                  <div className="memo-layout-grid" style={{ marginBottom: 0 }}>
                    {/* Left Container (Dynamic): Memo Input OR AI Report */}
                    {generatedReport ? (
                      /* AI Report (with editable textareas) */
                      <div className="memo-box" style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <div className="memo-box-title" style={{ margin: 0, fontSize: '13px', fontWeight: 700 }}>AI 상담 보고서</div>
                          <button 
                            onClick={() => setGeneratedReport(null)} 
                            style={{
                              fontSize: '11px',
                              color: '#0284c7',
                              background: '#e0f2fe',
                              border: 'none',
                              borderRadius: '12px',
                              padding: '4px 10px',
                              cursor: 'pointer',
                              fontWeight: '600',
                              transition: 'background 0.2s'
                            }}
                          >
                            메모 다시 작성
                          </button>
                        </div>
                        
                        <table className="report-table">
                          <tbody>
                            <tr>
                              <th>고객명</th>
                              <td>
                                <input 
                                  type="text" 
                                  value={generatedReport.customer_name || ""} 
                                  onChange={(e) => handleReportFieldChange("customer_name", e.target.value)}
                                  style={{ 
                                    width: '100%', 
                                    padding: '8px', 
                                    border: '1px solid #cbd5e1', 
                                    borderRadius: '6px', 
                                    boxSizing: 'border-box',
                                    fontSize: '13px',
                                    outline: 'none',
                                    color: '#334155'
                                  }}
                                />
                              </td>
                            </tr>
                            <tr>
                              <th>주요 내용</th>
                              <td>
                                <textarea 
                                  value={generatedReport.main_content || ""} 
                                  onChange={(e) => handleReportFieldChange("main_content", e.target.value)}
                                  style={{ 
                                    width: '100%', 
                                    padding: '8px', 
                                    border: '1px solid #cbd5e1', 
                                    borderRadius: '6px', 
                                    boxSizing: 'border-box', 
                                    minHeight: '85px', 
                                    fontFamily: 'inherit', 
                                    resize: 'vertical',
                                    fontSize: '13px',
                                    outline: 'none',
                                    color: '#334155'
                                  }}
                                />
                              </td>
                            </tr>
                            <tr>
                              <th>특이사항</th>
                              <td>
                                <textarea 
                                  value={generatedReport.special_remarks || ""} 
                                  onChange={(e) => handleReportFieldChange("special_remarks", e.target.value)}
                                  style={{ 
                                    width: '100%', 
                                    padding: '8px', 
                                    border: '1px solid #cbd5e1', 
                                    borderRadius: '6px', 
                                    boxSizing: 'border-box', 
                                    minHeight: '65px', 
                                    fontFamily: 'inherit', 
                                    resize: 'vertical',
                                    fontSize: '13px',
                                    outline: 'none',
                                    color: '#334155'
                                  }}
                                />
                              </td>
                            </tr>
                            <tr>
                              <th>후속 조치</th>
                              <td>
                                <textarea 
                                  value={generatedReport.follow_up || ""} 
                                  onChange={(e) => handleReportFieldChange("follow_up", e.target.value)}
                                  style={{ 
                                    width: '100%', 
                                    padding: '8px', 
                                    border: '1px solid #cbd5e1', 
                                    borderRadius: '6px', 
                                    boxSizing: 'border-box', 
                                    minHeight: '65px', 
                                    fontFamily: 'inherit', 
                                    resize: 'vertical',
                                    fontSize: '13px',
                                    outline: 'none',
                                    color: '#334155'
                                  }}
                                />
                              </td>
                            </tr>
                            <tr>
                              <th>요약</th>
                              <td>
                                <textarea 
                                  value={generatedReport.summary || ""} 
                                  onChange={(e) => handleReportFieldChange("summary", e.target.value)}
                                  style={{ 
                                    width: '100%', 
                                    padding: '8px', 
                                    border: '1px solid #cbd5e1', 
                                    borderRadius: '6px', 
                                    boxSizing: 'border-box', 
                                    minHeight: '65px', 
                                    fontFamily: 'inherit', 
                                    resize: 'vertical',
                                    fontSize: '13px',
                                    outline: 'none',
                                    color: '#334155'
                                  }}
                                />
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
                                padding: '6px 12px', borderRadius: 20,
                                fontSize: 12, fontWeight: 500,
                                whiteSpace: 'nowrap'
                              }}>
                                <div style={{ width: 16, height: 16, background: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Check size={10} color="white" strokeWidth={3} />
                                </div>
                                저장완료
                              </div>
                            )}
                            <button 
                              className="report-btn report-btn-primary"
                              onClick={handleSaveReport}
                              style={{ fontSize: '12px' }}
                            >
                              저장
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Memo Input */
                      <div className="memo-box" style={{ background: '#fafafa', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                          <div className="memo-box-title" style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>AI 기반 상담 메모 구조화</div>
                          <div className="consult-date-container">
                            <span className="consult-date-label">상담 일자</span>
                            <input 
                              type="date" 
                              className="consult-date-input"
                              value={consultDate} 
                              onChange={(e) => setConsultDate(e.target.value)}
                            />
                          </div>
                        </div>
                        <textarea 
                          className="memo-textarea" 
                          placeholder="상담 내용을 이곳에 메모하세요."
                          value={memoText}
                          onChange={(e) => setMemoText(e.target.value)}
                          style={{ minHeight: '200px', flex: 1, marginBottom: '16px', resize: 'none', fontSize: '13px' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                          <div className="memo-tip" style={{ margin: 0, width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '12px' }}>
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
                    )}

                    {/* Right Container (Always Timeline): Timeline History */}
                    <div className="memo-box" style={{ display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: '420px' }}>
                      <div className="memo-box-title" style={{ marginBottom: '20px', fontSize: '15px', fontWeight: 700 }}>이전 상담 타임라인</div>
                      
                      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                        {timelineList.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8', fontSize: '14px', fontWeight: '500' }}>
                            이전 상담 타임라인 이력이 없습니다.
                          </div>
                        ) : (
                          timelineList.map((item, index) => {
                          const isExpanded = expandedTimelineId === item.timelineId;
                          const isLast = index === timelineList.length - 1;
                          return (
                            <div key={item.timelineId} style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                              {/* 왼쪽 dot + line */}
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '32px' }}>
                                <div style={{
                                  width: '32px', height: '32px', borderRadius: '50%',
                                  background: isExpanded ? '#EEEDFE' : 'var(--cust-bg, #f8fafc)',
                                  border: isExpanded ? '2px solid #7F77DD' : '1.5px solid #e2e8f0',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  flexShrink: 0, zIndex: 1, transition: 'all 0.2s'
                                }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isExpanded ? '#534AB7' : '#94a3b8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/>
                                  </svg>
                                </div>
                                {!isLast && (
                                  <div style={{ width: '1px', flex: 1, background: '#e2e8f0', margin: '4px 0', minHeight: '16px' }} />
                                )}
                              </div>

                              {/* 오른쪽 카드 */}
                              <div style={{ flex: 1, marginBottom: '8px' }}>
                                <div
                                  onClick={() => handleTimelineClick(item.timelineId)}
                                  style={{
                                    background: isExpanded ? '#f8f8fc' : 'white',
                                    border: isExpanded ? '1px solid #a581fb' : '1px solid #e2e8f0',
                                    borderRadius: '12px',
                                    padding: '12px 14px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                  }}
                                >
                                  {/* 날짜 */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                                    </svg>
                                    {item.date}
                                  </div>

                                  {/* 요약 텍스트 */}
                                  <div style={{ fontSize: '13px', color: '#080f1a', lineHeight: 1.5, fontWeight: 500 }}>
                                    {item.content?.summary || item.memo}
                                  </div>

                                  {/* 펼쳐진 상세 */}
                                  {isExpanded && (
                                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #AFA9EC', display: 'flex', flexDirection: 'column', gap: '8px', background: 'white', borderRadius: '8px', padding: '12px 14px', margin: '12px -2px -2px -2px' }}>

                                      {timelineDetails[item.timelineId] ? (
                                        [
                                          { label: '주요 내용', key: 'main_content' },
                                          { label: '특이사항', key: 'special_remarks' },
                                          { label: '후속 조치', key: 'follow_up' },
                                          { label: '요약', key: 'summary' },
                                        ].map(({ label, key }) => (
                                          timelineDetails[item.timelineId].content[key] ? (
                                            <div key={key} style={{ display: 'flex', gap: '12px'}}>
                                              <span style={{ fontSize: '12px', color: '#534AB7', fontWeight: 600, minWidth: '56px', paddingTop: '1px' }}>{label}</span>
                                              <span style={{ fontSize: '13px', color: '#2b1f45', lineHeight: 1.5, flex: 1, whiteSpace: 'pre-wrap' }}>
                                                {timelineDetails[item.timelineId].content[key]}
                                              </span>
                                            </div>
                                          ) : null
                                        ))
                                      ) : (
                                        <div style={{ fontSize: '13px', color: '#94a3b8' }}>로딩중...</div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

                {/* Section 2: Simulator (Bottom Workspace) */}
                {activeTab === "simulator" && (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '4px', height: '17px', background: '#8b5cf6', borderRadius: '2px', display: 'inline-block' }}></span>
                    자산 시뮬레이터 및 AI 질의응답
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', height: '540px', boxSizing: 'border-box' }}>
                    {/* Left Column (Combined Customer Info & Additional Notes) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: 0 }}>
                      
                      {/* Single Integrated Container */}
                      <div style={{ background: '#fafafa', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflowY: 'auto' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '12px', marginTop: 0 }}>고객 정보 & AI 인사이트</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                            <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 500 }}>고객명(등급)</span>
                            <span style={{ color: '#0f172a', fontSize: '12px', fontWeight: 600 }}>{selectedSimDetails.name}</span>
                          </div>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                            <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 500 }}>생년월일</span>
                            <span style={{ color: '#0f172a', fontSize: '12px', fontWeight: 600 }}>{selectedSimDetails.birthday}</span>
                          </div>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                            <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 500 }}>직업</span>
                            <span style={{ color: '#0f172a', fontSize: '12px', fontWeight: 600 }}>{selectedSimDetails.job}</span>
                          </div>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                            <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 500 }}>성향</span>
                            <span style={{ color: '#0f172a', fontSize: '12px', fontWeight: 600 }}>{selectedSimDetails.risk}</span>
                          </div>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                            <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 500 }}>총자산</span>
                            <span style={{ color: '#0284c7', fontSize: '12px', fontWeight: 700 }}>{selectedSimDetails.assets}</span>
                          </div>
                          
                          </div>
                          
                          {/* Premium AI Insight Glow Card */}
                          <div className="ai-insight-glow-card" style={{ marginTop: '16px' }}>
                            <div className="ai-insight-header">
                              <span className="ai-badge-gradient" style={{
                              background: 'linear-gradient(135deg, #8b5cf6 0%, #2e24ea 100%)',
                              color: 'white',
                              fontSize: 12,
                              fontWeight: 800,
                              padding: '1px 6px',
                              borderRadius: 8,
                              letterSpacing: '0.3px',
                            }}>AI INSIGHT</span>
                              <span style={{ fontSize: '13px', color: '#8b5cf6', fontWeight: 800 }}>금융 라이프스타일 분석</span>
                            </div>
                            <div className="ai-insight-body" style={{ fontSize: '12px' }}>
                              {selectedSimDetails.insight}
                            </div>
                          </div>

                        {/* Additional Notes Integrated at the bottom */}
                        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '16px', gap: '8px' }}>
                          <span style={{ color: '#475569', fontSize: '15px', fontWeight: 700 }}>추가 입력 사항</span>
                          <textarea
                            style={{ 
                              width: '100%', 
                              border: '1px solid #cbd5e1', 
                              borderRadius: '8px', 
                              padding: '10px 12px', 
                              fontSize: '13px', 
                              color: '#334155', 
                              resize: 'none',
                              outline: 'none',
                              boxSizing: 'border-box',
                              minHeight: '80px',
                              fontFamily: 'inherit'
                            }}
                            placeholder={`추가 내용을 자유롭게 입력하세요.\n예) 내년 초 부동산 매도 예정, 자녀 유학 자금 필요...`}
                            value={additionalNotes[selectedCustomerId] || ""}
                            onChange={(e) => handleNotesChange(selectedCustomerId, e.target.value)}
                          />
                          
                          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', position: 'relative', marginTop: '4px' }}>
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
                                padding: '6px 16px', 
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
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#475569', lineHeight: '1.6', marginBottom: '12px' }}>
                              PB님, 위쪽에서 추가 입력 사항을 저장한 후,<br />
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
                              style={{ 
                                display: 'flex', 
                                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                width: '100%'
                              }}
                              key={idx}
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
                              fontSize: '13px',
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
                              background: '#0284c7', 
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
                </div>
              )}
                
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', textAlign: 'center', flex: 1 }}>
              {!showTodayOnly ? (
                <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <UserCircle size={48} color="#0284c7" strokeWidth={1.5} />
                </div>
              ) : (
                <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <Calendar size={48} color="#ffffff" strokeWidth={1.5} />
                </div>
              )}
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>{!showTodayOnly ? '전체 고객 목록' : '오늘 방문 고객'}</h2>
              <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 40, whiteSpace: 'pre-wrap', color: '#94a3b8' }}>
                {!showTodayOnly ? '왼쪽 목록에서 고객을 선택하면\n상세 정보를 확인할 수 있어요.' : '왼쪽에서 오늘 방문 고객을 선택하면\n상세 정보를 확인할 수 있어요.'}
              </p>
              {!showTodayOnly && <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>고객 이름을 클릭해 메모 어시스턴트와 시뮬레이터를 확인하세요</p>}
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
            setShowTodayOnly(false);

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
