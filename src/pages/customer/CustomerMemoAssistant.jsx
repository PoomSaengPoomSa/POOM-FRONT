import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CustomerRegistrationModal from "./CustomerRegistrationModal";
import { Calendar, TrendingUp, Users, Bell, Plus, Search, LogOut, MoreVertical, PenLine, Check, Settings, ArrowUp } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import { api } from "../../api";
import "./Customer.css";


const allCustomers = [
  { id: 101, name: "강OO", email: "dohyun@naver.com", phone: "010-7134-2353", color: "yellow", initial: "강" },
  { id: 102, name: "강OO", email: "lsjshid@gmail.com", phone: "010-4563-2364", color: "green", initial: "강" },
  { id: 103, name: "고OO", email: "shiho@gmail.com", phone: "010-9291-1342", color: "red", initial: "고" },
  { id: 104, name: "김OO", email: "abcdefg@naver.com", phone: "010-0000-0000", color: "pink", initial: "김" },
  { id: 105, name: "김OO", email: "kim1004@gmail.com", phone: "010-4333-1245", color: "blue", initial: "김" },
  { id: 106, name: "김OO", email: "kimvils@naver.com", phone: "010-2214-3621", color: "gray", initial: "김" },
  { id: 107, name: "김OO", email: "ppjisd@naver.com", phone: "010-6335-2365", color: "purple", initial: "김" },
];

const customers = [
  { id: 1, name: "김OO", email: "abcdefg@naver.com", phone: "010-0000-0000", color: "pink", initial: "김", time: "10:00 AM" },
  { id: 2, name: "박OO", email: "erlkgjldfjgkld@gmail.com", phone: "010-1234-5678", color: "purple", initial: "박", time: "13:30 PM" },
  { id: 3, name: "이OO", email: "lgkesdl@gmail.com", phone: "010-9876-5432", color: "red", initial: "이", time: "15:00 PM" },
];

const timelineData = [
  {
    id: 1,
    type: '리츠',
    date: '2026.04.27',
    text: '달러 약세로 해외자산 비중 조정 논의. 국내 리츠 관심 표명.',
    originalMemo: '달러 자산 줄이고 싶다고.\n국내 리츠 관심.\n다음달 초 재방문.\n총 자산 32억 1,234만',
    aiSummary: {
      '주요 니즈': '달러 비중 축소/리츠 편입',
      '후속 조치': '리츠 비교안 준비',
      '차기 상담': '2026.05 초순'
    }
  },
  {
    id: 2,
    type: '채권',
    date: '2026.03.15',
    text: '1분기 수익률 점검. 채권 비중 확대 제안 수락.',
    originalMemo: '1분기 수익률 양호. 채권 편입 비중 10% 확대 제안.\n고객 수락함.',
    aiSummary: {
      '주요 니즈': '안정적 수익 추구/채권 편입',
      '후속 조치': '채권 상품 제안서 발송',
      '차기 상담': '2026.04 중순'
    }
  },
  {
    id: 3,
    type: '리밸',
    date: '2026.01.08',
    text: '연초 포트폴리오 리밸런싱. 국내주식 5% 추가 편입.',
    originalMemo: '연초 포트폴리오 조정 논의.\n국내주식 저평가 구간 판단, 5% 추가 편입 결정.',
    aiSummary: {
      '주요 니즈': '국내주식 비중 확대',
      '후속 조치': '주식 매수 실행',
      '차기 상담': '2026.02 중순'
    }
  },
  {
    id: 4,
    type: '절세',
    date: '2025.11.20',
    text: '절세 계획 상담. ISA 계좌 추가 납입 결정.',
    originalMemo: '연말 절세 방안 상담.\n중개형 ISA 한도 2천만원 추가 납입 결정.',
    aiSummary: {
      '주요 니즈': '연말 절세/ISA 활용',
      '후속 조치': 'ISA 입금 안내',
      '차기 상담': '2026.01 초순'
    }
  }
];

export default function CustomerMemoAssistant() {
  const location = useLocation();
  const path = location.pathname;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeListTab, setActiveListTab] = useState("오늘 방문");
  const [allCustomersList, setAllCustomersList] = useState([]);
  const [todayCustomersList, setTodayCustomersList] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [fullCustomerDetail, setFullCustomerDetail] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTimelineId, setExpandedTimelineId] = useState(null);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [timelineList, setTimelineList] = useState([]);
  const [timelineDetails, setTimelineDetails] = useState({});
  const [generatedReport, setGeneratedReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [memoText, setMemoText] = useState("달러 자산 줄이고 싶다고. 국내 리츠 관심. 다음달 초 재방문.");

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
      
      const colors = ["pink", "purple", "red", "green", "blue", "yellow", "gray"];
      const mapped = response.map((c) => {
        const char = c.name ? c.name[0] : "고";
        return {
          id: c.c_id,
          name: c.name,
          email: c.email || `${c.c_id}@poom.com`,
          phone: c.phone || "010-0000-0000",
          color: colors[c.c_id % colors.length],
          initial: char,
          time: c.c_id % 2 === 0 ? "10:00 AM" : "14:30 PM",
        };
      });

      if (activeListTab === '전체 고객') {
        setAllCustomersList(mapped);
      } else {
        setTodayCustomersList(mapped);
      }
      
      const exists = mapped.some(c => c.id === selectedCustomerId);
      if (exists) {
        // Keep the current selection
      } else if (mapped.length > 0) {
        setSelectedCustomerId(mapped[0].id);
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
    setMemoText("달러 자산 줄이고 싶다고. 국내 리츠 관심. 다음달 초 재방문.");
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
    if (!selectedCustomerId || !memoText.trim()) return;
    
    const reportContent = {
      key_needs: generatedReport ? generatedReport.key_needs : (fullCustomerDetail?.llm_insight || "달러 자산 비중 축소/국내 리츠 편입 검토"),
      follow_up: generatedReport ? generatedReport.follow_up : "리츠 상품 비교안 준비",
      next_consult: generatedReport ? generatedReport.next_consult : "2026.05 초순"
    };

    try {
      const date = new Date();
      const pad = (n) => n.toString().padStart(2, '0');
      const formattedDate = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

      await api.customer.saveReport(selectedCustomerId, {
        memo: memoText,
        consult_date: formattedDate,
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
  const [additionalNotes, setAdditionalNotes] = useState({
    1: "내년 초 부동산 매도 예정, 포트폴리오 다각화 니즈 강함",
    2: "",
    3: ""
  });
  const [showNotesSaveToast, setShowNotesSaveToast] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState({
    1: [],
    2: [],
    3: []
  });
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
    assets: formatAssets(fullCustomerDetail?.total_assets),
    assetsRaw: fullCustomerDetail?.total_assets !== undefined ? (fullCustomerDetail.total_assets / 100000000) : 32.1234, // in 100M units
    needs: fullCustomerDetail?.llm_insight ? 
      (fullCustomerDetail.llm_insight.length > 30 ? fullCustomerDetail.llm_insight.slice(0, 30) + "..." : fullCustomerDetail.llm_insight) 
      : "포트폴리오 다각화 및 절세",
    risk: fullCustomerDetail?.tendency || "위험 중립형",
    products: fullCustomerDetail ? [
      fullCustomerDetail.deposit > 0 ? "예적금" : null,
      fullCustomerDetail.investment > 0 ? "투자상품" : null,
      fullCustomerDetail.pension > 0 ? "연금보험" : null,
    ].filter(Boolean).join(" + ") || "예적금 + 투자상품" : "예적금 + 투자상품",
    lastCounsel: "2026.05.12",
    nextCounsel: "2026.06 중순"
  };

  const handleNotesChange = (id, val) => {
    setAdditionalNotes(prev => ({
      ...prev,
      [id]: val
    }));
  };

  const handleSaveNotes = () => {
    setShowNotesSaveToast(true);
    setTimeout(() => setShowNotesSaveToast(false), 2000);
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
        <div className={`cust-list-panel ${isModalOpen ? 'cust-blurred-content' : ''}`} style={{ width: listWidth, flexShrink: 0 }}>
          <div className="cust-list-header">
            <h2 className="cust-list-title">나의 고객</h2>
            <button className="cust-add-btn" onClick={() => setIsModalOpen(true)}><Plus size={16} /></button>
          </div>
          
          <div className="cust-search">
            <Search size={16} className="cust-search-icon" />
            <input 
              type="text" 
              className="cust-search-input" 
              placeholder="Search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="cust-list-tabs">
            <div 
              className={`cust-list-tab ${activeListTab === '전체 고객' ? 'active' : ''}`} 
              onClick={() => { 
                setActiveListTab('전체 고객'); 
              }} 
              style={{ cursor: 'pointer', flex: 1 }}
            >
              전체 고객
            </div>
            <div 
              className={`cust-list-tab ${activeListTab === '오늘 방문' ? 'active' : ''}`} 
              onClick={() => { 
                setActiveListTab('오늘 방문'); 
              }} 
              style={{ cursor: 'pointer', flex: 1 }}
            >
              오늘 방문
            </div>
          </div>

          <div className="cust-list-items">
            {filteredCustomers.map(c => (
              <div className={`cust-list-item ${selectedCustomerId === c.id ? 'active' : ''}`} key={c.id} onClick={() => setSelectedCustomerId(c.id)} style={{ cursor: 'pointer' }}>
                <div className={`cust-avatar ${c.color}`}>{c.initial}</div>
                <div className="cust-item-info">
                  <span className="cust-item-name">{c.name}</span>
                  <span className="cust-item-sub">{c.email}</span>
                  <span className="cust-item-sub">{c.phone}</span>
                </div>
                <div className="cust-item-time">{c.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Resizer Divider */}
        <div className={`cust-resizer ${isDragging ? 'dragging' : ''}`} onMouseDown={handleMouseDown} />

        {/* Right Detail Panel */}
        <div key={selectedCustomerId} className={`cust-detail-panel ${isModalOpen ? 'cust-blurred-content' : ''}`}>
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
                placeholder="달러 자산 줄이고 싶다고. 국내 리츠 관심. 다음달 초 재방문."
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#22c55e', fontWeight: 500 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }}></span> 누적 1건
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
                {generatedReport ? (
                  <>
                    {generatedReport.date} <span style={{ fontWeight: 400, color: '#94a3b8', marginLeft: 8 }}>
                      {generatedReport.key_needs.length > 15 ? generatedReport.key_needs.slice(0, 15) + "..." : generatedReport.key_needs}
                    </span>
                  </>
                ) : (
                  <>
                    2026.04.30 <span style={{ fontWeight: 400, color: '#94a3b8', marginLeft: 8 }}>달러 자산 비중 축소</span>
                  </>
                )}
              </div>
              
              <table className="report-table">
                <tbody>
                  <tr>
                    <th>고객명</th>
                    <td>
                      {generatedReport ? (
                        `${generatedReport.customer_name} (${generatedReport.grade})`
                      ) : (
                        `${selectedCustomer.name} (${fullCustomerDetail?.grade || "VIP"})`
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>총자산</th>
                    <td>
                      {generatedReport ? (
                        generatedReport.total_assets
                      ) : (
                        formatAssets(fullCustomerDetail?.total_assets)
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>주요 니즈</th>
                    <td>
                      {generatedReport ? (
                        generatedReport.key_needs
                      ) : (
                        fullCustomerDetail?.llm_insight || "달러 자산 비중 축소/국내 리츠 편입 검토"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>후속 조치</th>
                    <td>
                      {generatedReport ? (
                        generatedReport.follow_up
                      ) : (
                        "리츠 상품 비교안 준비"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>차기 상담</th>
                    <td>
                      {generatedReport ? (
                        generatedReport.next_consult
                      ) : (
                        "2026.05 초순"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="report-actions" style={{ justifyContent: 'flex-end', position: 'relative' }}>
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
                      상담
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
                      <span className="timeline-text" style={{ color: isExpanded ? '#0f172a' : '#475569' }}>
                        {isExpanded ? (timelineDetails[item.timelineId]?.title || item.memo) : item.memo}
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
                                    <td style={{ color: '#64748b', fontWeight: '600', paddingBottom: '8px', width: '80px', verticalAlign: 'top' }}>주요 니즈</td>
                                    <td style={{ color: '#334155', paddingBottom: '8px', verticalAlign: 'top', fontWeight: '600' }}>
                                      {timelineDetails[item.timelineId].content.key_needs || "-"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={{ color: '#64748b', fontWeight: '600', paddingBottom: '8px', width: '80px', verticalAlign: 'top' }}>후속 조치</td>
                                    <td style={{ color: '#334155', paddingBottom: '8px', verticalAlign: 'top', fontWeight: '600' }}>
                                      {timelineDetails[item.timelineId].content.follow_up || "-"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={{ color: '#64748b', fontWeight: '600', paddingBottom: '8px', width: '80px', verticalAlign: 'top' }}>차기 상담</td>
                                    <td style={{ color: '#334155', paddingBottom: '8px', verticalAlign: 'top', fontWeight: '600' }}>
                                      {timelineDetails[item.timelineId].content.next_consult || "-"}
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
                      <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>고객명</span>
                      <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: 600 }}>{selectedSimDetails.name}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                      <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>총자산</span>
                      <span style={{ color: '#0284c7', fontSize: '13px', fontWeight: 700 }}>{selectedSimDetails.assets}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                      <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>주요 니즈</span>
                      <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: 600 }}>{selectedSimDetails.needs}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                      <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>위험 성향</span>
                      <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: 600 }}>{selectedSimDetails.risk}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                      <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>주요 보유 상품</span>
                      <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: 600 }}>{selectedSimDetails.products}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                      <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>최근 상담일</span>
                      <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: 600 }}>{selectedSimDetails.lastCounsel}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>다음 상담 예정</span>
                      <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: 600 }}>{selectedSimDetails.nextCounsel}</span>
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
                        왼쪽에서 고객 정보와 시뮬레이션 조건을 입력한 후,<br />
                        자연어로 질문해보세요.
                      </p>
                      <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.8' }}>
                        예) "현재 조건으로 절세 전략 추천해줘"<br />
                        "10년 후 예상 수익을 보여줘"
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
                        <span className="dot-typing">AI가 시뮬레이션 중입니다...</span>
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
                      placeholder="시뮬레이션 질문을 입력하세요."
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

            setActiveListTab("전체 고객");

            // Fetch refreshed list to update the client state
            const response = await api.customer.getList("all");
            const colors = ["pink", "purple", "red", "green", "blue", "yellow", "gray"];
            const mapped = response.map((c) => {
              const char = c.name ? c.name[0] : "고";
              return {
                id: c.c_id,
                name: c.name,
                email: c.email || `${c.c_id}@poom.com`,
                phone: c.phone || "010-0000-0000",
                color: colors[c.c_id % colors.length],
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
