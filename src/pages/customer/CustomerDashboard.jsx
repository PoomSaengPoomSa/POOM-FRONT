import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CustomerRegistrationModal from "./CustomerRegistrationModal";
import { Calendar, TrendingUp, Users, Bell, Search, Plus, LogOut, ChevronDown, MessageSquare, Download, Share2, Printer, Settings } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
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


const assetData = [
  { name: '국내주식', value: 35, color: '#a855f7' },
  { name: '해외주식', value: 28, color: '#c084fc' },
  { name: '채권', value: 20, color: '#2dd4bf' },
  { name: '현금', value: 17, color: '#cbd5e1' },
];

const emotionHistory = [
  { date: '2026.04.27', emoji: '😊', type: '긍정', typeColor: '#2dd4bf', text: '리츠 관심, 방문 의지 높음' },
  { date: '2026.03.15', emoji: '😊', type: '긍정', typeColor: '#2dd4bf', text: '채권 제안 수락, 신뢰 표현' },
  { date: '2026.01.08', emoji: '😐', type: '중립', typeColor: '#94a3b8', text: '조용하게 진행, 큰 반응 없음' },
];

const radarData = [
  { subject: '수익성', A: 72, fullMark: 100 },
  { subject: '안정성', A: 65, fullMark: 100 },
  { 상징성: '상징성', A: 55, fullMark: 100 }, // I'll fix this later
  { subject: '유동성', A: 58, fullMark: 100 },
  { subject: '세금효율', A: 80, fullMark: 100 },
  { subject: '분산도', A: 70, fullMark: 100 },
  { subject: '성장성', A: 55, fullMark: 100 },
];

export default function CustomerDashboard() {
  const location = useLocation();
  const path = location.pathname;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
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
            <button className="cust-detail-tab active">고객 대시보드</button>
            
            <Link to="/customer-management-memo-assistant" style={{ textDecoration: 'none' }}>
              <button className="cust-detail-tab">메모 어시스턴트</button>
            </Link>
            </div>
          </div>

          <div style={{ padding: '8px 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            
            {/* Row 1: 자산 보유 현황 / 이탈 위험 수준 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              
              {/* 1. 자산 보유 현황 */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>자산 보유 현황</h3>
                  <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>포트폴리오 비중</span>
                </div>
                <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: 140, height: 140 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={assetData} innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                          {assetData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>총자산</span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#f59e0b' }}>32억</span>
                    </div>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, marginLeft: 24 }}>
                    {assetData.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }}></div>
                          <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>{item.name}</span>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. 이탈 위험 수준 */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>이탈 위험 수준</h3>
                  <span style={{ fontSize: 14, color: '#2dd4bf', fontWeight: 700 }}>낮음</span>
                </div>
                <div style={{ background: '#14b8a6', borderRadius: 12, padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24, boxShadow: '0 4px 6px -1px rgba(20, 184, 166, 0.3)' }}>
                  <div style={{ fontSize: 32, marginBottom: 4 }}>😊</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 4 }}>양호</div>
                  <div style={{ fontSize: 12, color: 'white', fontWeight: 500 }}>이탈 위험이 낮습니다</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: 11, color: '#94a3b8', width: 50, textAlign: 'right' }}>방문 간격</span>
                    <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: '40%', height: '100%', background: '#14b8a6', borderRadius: 3 }}></div>
                    </div>
                    <span style={{ fontSize: 12, color: '#14b8a6', fontWeight: 600, width: 20 }}>38</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: 11, color: '#94a3b8', width: 50, textAlign: 'right' }}>메모 감정</span>
                    <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: '20%', height: '100%', background: '#14b8a6', borderRadius: 3 }}></div>
                    </div>
                    <span style={{ fontSize: 12, color: '#14b8a6', fontWeight: 600, width: 20 }}>20</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: 11, color: '#94a3b8', width: 50, textAlign: 'right' }}>자산 변화</span>
                    <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: '15%', height: '100%', background: '#14b8a6', borderRadius: 3 }}></div>
                    </div>
                    <span style={{ fontSize: 12, color: '#14b8a6', fontWeight: 600, width: 20 }}>10</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: 11, color: '#94a3b8', width: 50, textAlign: 'right' }}>응답 속도</span>
                    <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: '60%', height: '100%', background: '#14b8a6', borderRadius: 3 }}></div>
                    </div>
                    <span style={{ fontSize: 12, color: '#14b8a6', fontWeight: 600, width: 20 }}>53</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Row 2: 관심사 태그 / 상담 감정 분석 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              
              {/* 3. 관심사 태그 */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>관심사 태그</h3>
                  <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>누적 빈도 기반</span>
                </div>
                <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <span style={{ position: 'absolute', top: '15%', left: '20%', fontSize: 18, color: '#6366f1', fontWeight: 600 }}>절세</span>
                  <span style={{ position: 'absolute', top: '15%', right: '20%', fontSize: 16, color: '#475569', fontWeight: 600 }}>부동산</span>
                  <span style={{ position: 'absolute', top: '40%', left: '35%', fontSize: 24, color: '#1e293b', fontWeight: 700 }}>국내 리츠</span>
                  <span style={{ position: 'absolute', top: '45%', right: '25%', fontSize: 12, color: '#64748b' }}>ISA</span>
                  <span style={{ position: 'absolute', top: '55%', left: '15%', fontSize: 12, color: '#6366f1' }}>배당주</span>
                  <span style={{ position: 'absolute', bottom: '25%', left: '25%', fontSize: 18, color: '#3b82f6', fontWeight: 600 }}>포트폴리오 재조정</span>
                  <span style={{ position: 'absolute', bottom: '15%', left: '20%', fontSize: 12, color: '#475569' }}>채권</span>
                </div>
              </div>

              {/* 4. 상담 감정 분석 */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>상담 감정 분석</h3>
                  <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>메모 기반 AI 분석</span>
                </div>
                
                {/* Bar chart area */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 100, borderBottom: '1px solid #e2e8f0', paddingBottom: 16, marginBottom: 24, padding: '0 16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>😊</span>
                    <div style={{ width: 40, height: 70, background: '#2dd4bf', borderRadius: 8 }}></div>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>04.27</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>😊</span>
                    <div style={{ width: 40, height: 70, background: '#2dd4bf', borderRadius: 8 }}></div>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>03.15</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>😐</span>
                    <div style={{ width: 40, height: 35, background: '#cbd5e1', borderRadius: 8 }}></div>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>01.08</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>😊</span>
                    <div style={{ width: 40, height: 70, background: '#2dd4bf', borderRadius: 8 }}></div>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>11.20</span>
                  </div>
                </div>

                {/* History list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {emotionHistory.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '12px 16px', borderRadius: 8, gap: 12, boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                      <span style={{ fontSize: 16 }}>{item.emoji}</span>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>{item.date}</span>
                      <span style={{ background: item.typeColor, color: 'white', fontSize: 11, padding: '2px 8px', borderRadius: 12, fontWeight: 600 }}>{item.type}</span>
                      <span style={{ fontSize: 12, color: '#475569', fontWeight: 500, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Visit Frequency Graph Box */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>방문 주기 그래프</h3>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>월별 상담 현황</span>
              </div>
              
              <div style={{ display: 'flex', gap: 16, marginBottom: 64 }}>
                <div style={{ flex: 1, background: '#e2e8f0', borderRadius: 16, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, color: '#64748b', fontWeight: 600 }}>총 방문</span>
                  <div><span style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>4</span> <span style={{ fontSize: 12, color: '#64748b' }}>회</span></div>
                </div>
                <div style={{ flex: 1, background: '#dbeafe', borderRadius: 16, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, color: '#64748b', fontWeight: 600 }}>평균 주기</span>
                  <div><span style={{ fontSize: 24, fontWeight: 700, color: '#3b82f6' }}>53</span> <span style={{ fontSize: 12, color: '#64748b' }}>일</span></div>
                </div>
                <div style={{ flex: 1, background: '#e0f2fe', borderRadius: 16, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, color: '#64748b', fontWeight: 600 }}>마지막 방문</span>
                  <div><span style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>+9</span> <span style={{ fontSize: 12, color: '#64748b' }}>일</span></div>
                </div>
              </div>

              {/* Mock Bar Chart */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 32, height: 120, borderBottom: '2px solid #e2e8f0', paddingBottom: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 16, height: 0, background: '#6366f1', borderRadius: 4 }}></div>
                  <span style={{ fontSize: 12, color: '#64748b' }}>09월</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 16, height: 0, background: '#6366f1', borderRadius: 4 }}></div>
                  <span style={{ fontSize: 12, color: '#64748b' }}>10월</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 16, height: 100, background: '#6366f1', borderRadius: 4 }}></div>
                  <span style={{ fontSize: 12, color: '#64748b' }}>11월</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 16, height: 0, background: '#6366f1', borderRadius: 4 }}></div>
                  <span style={{ fontSize: 12, color: '#64748b' }}>12월</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 16, height: 100, background: '#6366f1', borderRadius: 4 }}></div>
                  <span style={{ fontSize: 12, color: '#64748b' }}>01월</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 16, height: 0, background: '#6366f1', borderRadius: 4 }}></div>
                  <span style={{ fontSize: 12, color: '#64748b' }}>02월</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 16, height: 100, background: '#6366f1', borderRadius: 4 }}></div>
                  <span style={{ fontSize: 12, color: '#64748b' }}>03월</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 16, height: 100, background: '#6366f1', borderRadius: 4 }}></div>
                  <span style={{ fontSize: 12, color: '#64748b' }}>04월</span>
                </div>
              </div>
            </div>

            {/* Risk Radar Box */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>리스크 레이더</h3>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>6축 분석</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 300, height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Radar name="고객" dataKey="A" stroke="#6366f1" fill="#818cf8" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginLeft: 48 }}>
                  {radarData.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, fontWeight: 600, color: '#64748b', width: 120 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1' }}></div>
                      <span style={{ width: 60 }}>{item.subject || item.상징성}</span>
                      <span style={{ color: '#0f172a' }}>{item.A}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      <CustomerRegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
}
