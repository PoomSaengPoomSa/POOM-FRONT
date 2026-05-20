import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import CustomerRegistrationModal from "./CustomerRegistrationModal";
import { Calendar, TrendingUp, Users, Bell, Plus, Search, LogOut, MoreVertical, PenLine, Check, Settings, ArrowUp } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
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
  const [selectedCustomerId, setSelectedCustomerId] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTimelineId, setExpandedTimelineId] = useState(null);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTab === "simulator") {
      scrollToBottom();
    }
  }, [chatMessages, isTyping, activeTab]);

  const simulatorCustomerDetails = {
    1: {
      name: "김OO (우량)",
      assets: "15억 2,100만",
      needs: "포트폴리오 다각화",
      risk: "적극 투자형",
      products: "국내주식 + 채권",
      lastCounsel: "2026.04.20",
      nextCounsel: "2026.05 하순"
    },
    2: {
      name: "박OO (일반)",
      assets: "5억 5,000만",
      needs: "노후 자금 마련",
      risk: "안정 추구형",
      products: "예적금 + 국채",
      lastCounsel: "2026.05.10",
      nextCounsel: "2026.06 초순"
    },
    3: {
      name: "이OO (우량)",
      assets: "21억 8,000만",
      needs: "상속 및 증여세 절감",
      risk: "위험 중립형",
      products: "해외주식 + ELF",
      lastCounsel: "2026.05.12",
      nextCounsel: "2026.06 중순"
    }
  };

  const selectedSimDetails = simulatorCustomerDetails[selectedCustomerId] || simulatorCustomerDetails[1];

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

  const handleSendQuestion = () => {
    if (!currentQuestion.trim()) return;
    
    const userMsg = { sender: 'user', text: currentQuestion };
    setChatMessages(prev => ({
      ...prev,
      [selectedCustomerId]: [...(prev[selectedCustomerId] || []), userMsg]
    }));
    
    const question = currentQuestion;
    setCurrentQuestion("");
    setIsTyping(true);
    
    setTimeout(() => {
      let aiResponseText = "";
      const customerName = selectedCustomer.name;
      const details = simulatorCustomerDetails[selectedCustomerId] || simulatorCustomerDetails[1];
      
      if (question.includes("절세")) {
        aiResponseText = `${customerName} 고객님의 자산 포트폴리오(${details.assets}, ${details.products} 비중 다수)를 기반으로 제안해 드리는 맞춤형 절세 전략입니다:\n\n1. 금융소득종합과세 대비 비과세/분리과세 상품 활용\n- 현재 총자산 규모 및 자산 구성상 금융소득종합과세 대상에 해당할 가능성이 높습니다.\n- 이자소득 배당소득 절세를 위해 분리과세 하이일드 펀드나 비과세 채권 활용을 확대하는 것을 권장합니다.\n\n2. ISA(개인종합자산관리계좌) 적극 활용\n- 중개형 ISA를 통해 국내주식 및 채권 거래 시 발생하는 이자·배당 소득에 대해 비과세 및 9.9% 분리과세 혜택을 적용받으실 수 있습니다.\n\n3. 채권 매매차익 비과세 혜택 극대화\n- 현재 보유하신 채권 포트폴리오 중 금리 하락기에 유리한 저쿠폰 표면금리가 낮은 국채 위주로 세팅하여 이자소득세 과세 대상 금액을 줄이고, 대신 매매차익을 극대화하는 세테크를 추천합니다.`;
      } else if (question.includes("10년") || question.includes("수익") || question.includes("시뮬레이션")) {
        aiResponseText = `${customerName} 고객님의 ${details.risk} 성향과 현재 포트폴리오 및 추가 입력 정보를 토대로 시뮬레이션한 10년 후 예상 자산 추이입니다:\n\n[시뮬레이션 조건]\n- 초기 자산: ${details.assets}\n- 기대 수익률: 연평균 6.5% (${details.risk} 기준)\n- 인플레이션율: 연 2.0% 반영\n\n[10년 후 예상 포트폴리오 가치]\n- 1년 후: 약 ${(parseFloat(details.assets) * 1.065).toFixed(1)}억 원 수준\n- 5년 후: 약 ${(parseFloat(details.assets) * 1.37).toFixed(1)}억 원 수준\n- 10년 후: 약 ${(parseFloat(details.assets) * 1.87).toFixed(1)}억 원 수준 (누적 수익률 약 +87%)\n\n[투자 다각화 제안]\n- 주요 니즈이신 '${details.needs}'를 달성하기 위해 현재 포트폴리오 구성에서 글로벌 자산 및 대체자산 비중을 20% 수준으로 조율할 경우, 포트폴리오 변동성(위험)을 15% 낮추면서 유사한 수익률을 방어할 수 있습니다.`;
      } else {
        aiResponseText = `문의하신 질문에 대해 ${customerName} 고객님의 프로필(자산 ${details.assets}, ${details.risk}) 및 시장 트렌드를 분석하여 시뮬레이션을 진행하고 있습니다. \n\n추가 입력 사항에 기재해주신 세부 니즈를 바탕으로 보다 세부적인 자산 배분 시뮬레이션 및 포트폴리오 제안을 원하실 경우, 구체적인 목표 수익률이나 투자 기간을 말씀해주시면 더욱 정확한 진단이 가능합니다.`;
      }
      
      const aiMsg = { sender: 'ai', text: aiResponseText };
      setChatMessages(prev => ({
        ...prev,
        [selectedCustomerId]: [...(prev[selectedCustomerId] || []), aiMsg]
      }));
      setIsTyping(false);
    }, 1000);
  };

  const filteredCustomers = customers.filter(c => 
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
            <Link to="/customer-management-registration-1" style={{ textDecoration: "none", color: "inherit", flex: 1 }}><div className="cust-list-tab">전체 고객</div></Link>
            <div className="cust-list-tab active">오늘 방문</div>
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
                defaultValue="달러 자산 줄이고 싶다고. 국내 리츠 관심. 다음달 초 재방문."
                style={{ minHeight: '200px', flex: 1, marginBottom: '16px', resize: 'none' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                <div className="memo-tip" style={{ margin: 0, width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  💡 자유롭게 메모하세요. AI가 구조화된 상담 보고서로 변환합니다.
                </div>
                <button className="memo-small-btn" style={{ border: '1px solid #0284c7', color: '#0284c7', whiteSpace: 'nowrap' }}>AI 보고서 생성</button>
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
                2026.04.30 <span style={{ fontWeight: 400, color: '#94a3b8', marginLeft: 8 }}>달러 자산 비중 축소</span>
              </div>
              
              <table className="report-table">
                <tbody>
                  <tr><th>고객명</th><td>{selectedCustomer.name} (VIP)</td></tr>
                  <tr><th>총자산</th><td>32억 1234만</td></tr>
                  <tr><th>주요 니즈</th><td>달러 자산 비중 축소/국내 리츠 편입 검토</td></tr>
                  <tr><th>후속 조치</th><td>리츠 상품 비교안 준비</td></tr>
                  <tr><th>차기 상담</th><td>2026.05 초순</td></tr>
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
                  onClick={() => {
                    setShowSaveToast(true);
                    setTimeout(() => setShowSaveToast(false), 2000);
                  }}
                >
                  저장
                </button>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="timeline-box">
            <div className="memo-box-title" style={{ marginBottom: 24 }}>이전 상담 타임라인</div>
            
            {timelineData.map((item, index) => {
              const isExpanded = expandedTimelineId === item.id;
              const isLast = index === timelineData.length - 1;
              return (
                <div 
                  key={item.id} 
                  className="timeline-item"
                  onClick={() => setExpandedTimelineId(isExpanded ? null : item.id)}
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
                    {item.type}
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
                    <span className="timeline-text" style={{ color: isExpanded ? '#0f172a' : '#475569' }}>{item.text}</span>
                    
                    {isExpanded && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                        {/* Box 1: 원본메모 */}
                        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>
                            <PenLine size={14} /> 원본메모
                          </div>
                          <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                            {item.originalMemo}
                          </div>
                        </div>

                        {/* Box 2: AI 요약 */}
                        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8b5cf6', fontSize: '13px', fontWeight: '700', marginBottom: '12px' }}>
                            AI 요약
                          </div>
                          <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                            <tbody>
                              {Object.entries(item.aiSummary).map(([key, value]) => (
                                <tr key={key}>
                                  <td style={{ color: '#64748b', fontWeight: '600', paddingBottom: '8px', width: '80px', verticalAlign: 'top' }}>{key}</td>
                                  <td style={{ color: '#334155', paddingBottom: '8px', verticalAlign: 'top', fontWeight: '600' }}>{value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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
                <div style={{ 
                  flex: 1, 
                  overflowY: 'auto', 
                  paddingRight: '8px', 
                  paddingBottom: '80px', // Space for bottom input
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  minHeight: 0
                }}>
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
      <CustomerRegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
}
