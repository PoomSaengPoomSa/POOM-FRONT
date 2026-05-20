import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CustomerRegistrationModal from "./CustomerRegistrationModal";
import { Calendar, TrendingUp, Users, Bell, Plus, Search, LogOut, MoreVertical, PenLine, Check, Settings } from "lucide-react";
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
      <div className="cust-main">

        {/* Left Panel */}
        <div className={`cust-list-panel ${isModalOpen ? 'cust-blurred-content' : ''}`}>
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
              <Link to="/customer-management-profile" style={{ textDecoration: 'none' }}>
              <button className="cust-detail-tab">프로필</button>
            </Link>
            <Link to="/customer-management-dashboard-2" style={{ textDecoration: 'none' }}>
              <button className="cust-detail-tab">고객 대시보드</button>
            </Link>
            
            <button className="cust-detail-tab active">메모 어시스턴트</button>
            </div>
          </div>

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
        </div>
      <CustomerRegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
}
