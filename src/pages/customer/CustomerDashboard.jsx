import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import CustomerRegistrationModal from "./CustomerRegistrationModal";
import { Calendar, TrendingUp, Users, Bell, Search, Plus, LogOut, ChevronDown, MessageSquare, Download, Share2, Printer, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Sidebar from "../../components/common/Sidebar";
import { api } from "../../api";
import "./Customer.css";

const emotionHistory = [
  { date: '2026.04.27', emoji: '😊', type: '긍정', typeColor: '#2dd4bf', text: '리츠 관심, 방문 의지 높음' },
  { date: '2026.03.15', emoji: '😊', type: '긍정', typeColor: '#2dd4bf', text: '채권 제안 수락, 신뢰 표현' },
  { date: '2026.01.08', emoji: '😐', type: '중립', typeColor: '#94a3b8', text: '조용하게 진행, 큰 반응 없음' },
];

const radarData = [
  { subject: '수익성', A: 72, fullMark: 100 },
  { subject: '안정성', A: 65, fullMark: 100 },
  { subject: '상징성', A: 55, fullMark: 100 },
  { subject: '유동성', A: 58, fullMark: 100 },
  { subject: '세금효율', A: 80, fullMark: 100 },
  { subject: '분산도', A: 70, fullMark: 100 },
  { subject: '성장성', A: 55, fullMark: 100 },
];

export default function CustomerDashboard() {
  const location = useLocation();
  const path = location.pathname;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListCollapsed, setIsListCollapsed] = useState(false);
  const [customersList, setCustomersList] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [fullCustomerDetail, setFullCustomerDetail] = useState(null);
  const [visitStats, setVisitStats] = useState(null);
  const [churnRisk, setChurnRisk] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCustomers = async () => {
    try {
      const response = await api.customer.getList("today");
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
      mapped.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
      setCustomersList(mapped);
      if (mapped.length > 0) {
        setSelectedCustomerId(mapped[0].id);
        setSelectedCustomer(mapped[0]);
      }
    } catch (error) {
      console.error("고객 목록 로드 실패:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (!selectedCustomerId) return;
    const found = customersList.find(c => c.id === selectedCustomerId);
    if (found) {
      setSelectedCustomer(found);
    }
    
    const fetchDetail = () => {
      // 1. Fetch main detail independently
      api.customer.getDetail(selectedCustomerId)
        .then(detail => {
          setFullCustomerDetail(detail);
        })
        .catch(error => {
          console.error("상세 정보 조회 실패:", error);
        });

      // 2. Fetch visit stats independently
      api.customer.getVisitStats(selectedCustomerId)
        .then(stats => {
          setVisitStats(stats);
        })
        .catch(err => {
          console.error("방문 주기 조회 실패:", err);
          setVisitStats(null);
        });

      // 3. Fetch churn risk independently
      api.customer.getChurnRisk(selectedCustomerId)
        .then(risk => {
          setChurnRisk(risk);
        })
        .catch(err => {
          console.error("이탈 위험 조회 실패:", err);
          setChurnRisk(null);
        });
    };
    fetchDetail();
  }, [selectedCustomerId, customersList]);

  const filteredCustomers = customersList.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const assetTotal = fullCustomerDetail?.total_assets !== undefined ? `${(fullCustomerDetail.total_assets / 100000000).toFixed(1)}억` : "32억";
  const netWorthTotal = fullCustomerDetail?.net_worth !== undefined ? `${(fullCustomerDetail.net_worth / 100000000).toFixed(1)}억` : "32억";
  const dynamicAssetData = [
    { name: '예적금', value: fullCustomerDetail ? Math.round((fullCustomerDetail.deposit / (fullCustomerDetail.net_worth || 1)) * 100) : 45, color: '#2dd4bf' },
    { name: '투자상품', value: fullCustomerDetail ? Math.round((fullCustomerDetail.investment / (fullCustomerDetail.net_worth || 1)) * 100) : 35, color: '#a855f7' },
    { name: '연금보험', value: fullCustomerDetail ? Math.round((fullCustomerDetail.pension / (fullCustomerDetail.net_worth || 1)) * 100) : 20, color: '#cbd5e1' },
  ];

  const getChurnUI = (grade) => {
    switch (grade) {
      case "위험":
        return {
          label: "높음",
          headerColor: "#ef4444",
          bg: "#ef4444",
          emoji: "🚨",
          subtitle: "즉각적인 조치가 필요합니다",
          boxShadow: "0 4px 6px -1px rgba(239, 68, 68, 0.3)"
        };
      case "주의":
        return {
          label: "보통",
          headerColor: "#f59e0b",
          bg: "#f59e0b",
          emoji: "😐",
          subtitle: "이탈 가능성이 존재합니다",
          boxShadow: "0 4px 6px -1px rgba(245, 158, 11, 0.3)"
        };
      case "양호":
      default:
        return {
          label: "낮음",
          headerColor: "#2dd4bf",
          bg: "#14b8a6",
          emoji: "😊",
          subtitle: "이탈 위험이 낮습니다",
          boxShadow: "0 4px 6px -1px rgba(20, 184, 166, 0.3)"
        };
    }
  };

  const getSubMetrics = (grade) => {
    switch (grade) {
      case "위험":
        return { visit: 85, emotion: 90, asset: 75, response: 95 };
      case "주의":
        return { visit: 60, emotion: 55, asset: 40, response: 70 };
      case "양호":
      default:
        return { visit: 38, emotion: 20, asset: 15, response: 53 };
    }
  };

  const churnUI = getChurnUI(churnRisk?.grade);
  const subMetrics = getSubMetrics(churnRisk?.grade);

  let daysSinceLastVisitText = "-";
  if (visitStats && visitStats.last_visit_date) {
    const lastDate = new Date(visitStats.last_visit_date);
    const today = new Date();
    lastDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    const diffTime = today.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      daysSinceLastVisitText = "오늘";
    } else if (diffDays > 0) {
      daysSinceLastVisitText = `${diffDays}일 전`;
    } else {
      daysSinceLastVisitText = `${Math.abs(diffDays)}일 후`;
    }
  }

  return (
    <div className="cust-container">
      {/* Sidebar */}
      <Sidebar type="cust" />

      {/* Main Content */}
      <div className="cust-main">

        {/* Left Panel */}
        <div 
          className={`cust-list-panel ${isModalOpen ? 'cust-blurred-content' : ''}`}
          style={{ 
            width: isListCollapsed ? 0 : '240px', 
            flexShrink: 0, 
            padding: isListCollapsed ? 0 : '24px',
            overflow: 'hidden',
            border: isListCollapsed ? 'none' : '1px solid var(--cust-glass-border)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div className="cust-list-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 className="cust-list-title">나의 고객</h2>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <button className="cust-add-btn" onClick={() => setIsModalOpen(true)}><Plus size={16} /></button>
              <button 
                onClick={() => setIsListCollapsed(true)}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
              >
                <ChevronLeft size={14} />
              </button>
            </div>
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
            <Link to="/customer-info" style={{ textDecoration: "none", color: "inherit", flex: 1 }}><div className="cust-list-tab">전체 고객</div></Link>
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

        {/* Collapse Toggle Trigger Area */}
        <div 
          className="cust-resizer" 
          style={{ 
            width: isListCollapsed ? '16px' : '8px', 
            cursor: 'default',
            position: 'relative',
            background: 'transparent',
            flexShrink: 0
          }}
        >
          {isListCollapsed && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsListCollapsed(false);
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
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
            >
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {/* Right Detail Panel */}
        <div key={selectedCustomerId || 'empty'} className={`cust-detail-panel ${isModalOpen ? 'cust-blurred-content' : ''}`}>
          {selectedCustomer ? (
            <>
              <div className="cust-detail-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="cust-detail-profile">
                    <div className={`cust-avatar ${selectedCustomer.color}`}>{selectedCustomer.initial}</div>
                    <h2>{selectedCustomer.name}</h2>
                  </div>
                </div>
              </div>

              <div style={{ padding: '8px 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
                
                {/* 🌟 AI 종합 진단 및 핵심 인사이트 Board */}
                <div className="ai-insight-glow-card" style={{ 
                  margin: 0, 
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f5f3ff 100%)', 
                  border: '1.5px solid rgba(139, 92, 246, 0.3)', 
                  boxShadow: '0 12px 30px -10px rgba(139, 92, 246, 0.15)',
                  padding: '20px 24px',
                  borderRadius: 16
                }}>
                  {/* Title Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: '0 4px 10px rgba(139, 92, 246, 0.4)'
                    }}>
                      <span style={{ fontSize: 12, color: 'white' }}>⚡</span>
                    </div>
                    <span className="ai-badge-gradient" style={{ fontSize: 9 }}>AI COMPREHENSIVE DIAGNOSIS</span>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: '#4c1d95', margin: 0 }}>AI 종합 진단 및 핵심 인사이트</h3>
                  </div>

                  {/* Two Columns Grid for AI Portfolio Asset Diagnosis & AI Churn Diagnosis */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    {/* Left Column: Asset Diagnosis */}
                    <div style={{ background: 'white', padding: '16px 20px', borderRadius: 12, border: '1px solid rgba(139, 92, 246, 0.1)', boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.02)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <span style={{ fontSize: 14 }}>📊</span>
                        <span style={{ fontSize: 12, color: '#7c3aed', fontWeight: 800 }}>AI 포트폴리오 자산 진단</span>
                      </div>
                      <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
                        {fullCustomerDetail?.llm_insight || "고객님의 현재 포트폴리오는 현금 및 예적금 비율이 높은 편이며, 글로벌 변동성에 대비한 리츠 및 대체자산 비중을 확대하는 방안을 고려해볼 수 있습니다."}
                      </p>
                    </div>

                    {/* Right Column: Churn Risk Diagnosis */}
                    <div style={{ background: 'white', padding: '16px 20px', borderRadius: 12, border: '1px solid rgba(139, 92, 246, 0.1)', boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.02)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <span style={{ fontSize: 14 }}>🎯</span>
                        <span style={{ fontSize: 12, color: '#7c3aed', fontWeight: 800 }}>AI 이탈 위험 상세 진단</span>
                      </div>
                      <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
                        {churnRisk?.reason || "자산 변화 추이와 내방 일정, 대화 피드백 감정이 매우 긍정적이며 안정적으로 유지되고 있는 상태입니다."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Row 1: 자산 보유 현황 / 이탈 위험 수준 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  
                  {/* 1. 자산 보유 현황 */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>자산 보유 현황</h3>
                      <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>포트폴리오 비중</span>
                    </div>
                    <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                      <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={dynamicAssetData} innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                              {dynamicAssetData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>순자산</span>
                          <span style={{ fontSize: 16, fontWeight: 700, color: '#f59e0b' }}>{netWorthTotal}</span>
                        </div>
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, marginLeft: 24 }}>
                        {dynamicAssetData.map((item, idx) => (
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
                  <div style={{ 
                    background: '#ffffff', 
                    border: '1px solid rgba(226, 232, 240, 0.8)', 
                    borderRadius: 16, 
                    padding: 24, 
                    display: 'flex', 
                    flexDirection: 'column',
                    boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.03)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 18 }}>🎯</span>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>이탈 위험 수준</h3>
                      </div>
                      <span style={{ 
                        fontSize: 11, 
                        background: churnUI.headerColor + '15', 
                        color: churnUI.headerColor, 
                        fontWeight: 800, 
                        padding: '4px 10px', 
                        borderRadius: 20,
                        border: `1.5px solid ${churnUI.headerColor}30`
                      }}>
                        위험도 {churnUI.label}
                      </span>
                    </div>

                    {/* 위험도 종합 뱃지 (그라디언트 글래스) */}
                    <div style={{ 
                      background: `linear-gradient(135deg, ${churnUI.bg}f0 0%, ${churnUI.bg}d0 100%)`, 
                      borderRadius: 12, 
                      padding: '18px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 16,
                      marginBottom: 20, 
                      boxShadow: churnUI.boxShadow,
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{ fontSize: 32 }}>{churnUI.emoji}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.5px' }}>{churnRisk?.grade || "양호"} 상태</span>
                        <span style={{ fontSize: 11, opacity: 0.9, fontWeight: 500 }}>{churnUI.subtitle}</span>
                      </div>
                    </div>

                    {/* 4대 세부 위험 요소 매트릭스 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20, background: '#f8fafc', padding: '16px', borderRadius: 12, border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 12, width: 60, fontWeight: 700, color: '#475569' }}>방문 간격</span>
                        <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${subMetrics.visit}%`, height: '100%', background: churnUI.bg, borderRadius: 3, transition: 'width 0.3s ease' }}></div>
                        </div>
                        <span style={{ fontSize: 12, color: '#1e293b', fontWeight: 700, width: 24, textAlign: 'right' }}>{subMetrics.visit}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 12, width: 60, fontWeight: 700, color: '#475569' }}>메모 감정</span>
                        <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${subMetrics.emotion}%`, height: '100%', background: churnUI.bg, borderRadius: 3, transition: 'width 0.3s ease' }}></div>
                        </div>
                        <span style={{ fontSize: 12, color: '#1e293b', fontWeight: 700, width: 24, textAlign: 'right' }}>{subMetrics.emotion}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 12, width: 60, fontWeight: 700, color: '#475569' }}>자산 변화</span>
                        <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${subMetrics.asset}%`, height: '100%', background: churnUI.bg, borderRadius: 3, transition: 'width 0.3s ease' }}></div>
                        </div>
                        <span style={{ fontSize: 12, color: '#1e293b', fontWeight: 700, width: 24, textAlign: 'right' }}>{subMetrics.asset}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 12, width: 60, fontWeight: 700, color: '#475569' }}>응답 속도</span>
                        <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${subMetrics.response}%`, height: '100%', background: churnUI.bg, borderRadius: 3, transition: 'width 0.3s ease' }}></div>
                        </div>
                        <span style={{ fontSize: 12, color: '#1e293b', fontWeight: 700, width: 24, textAlign: 'right' }}>{subMetrics.response}</span>
                      </div>
                    </div>

                    {/* 💡 AI 이탈 방지 행동 가이드 */}
                    <div style={{ 
                      background: churnRisk?.grade === "위험" ? '#fef2f2' : churnRisk?.grade === "주의" ? '#fffbeb' : '#f0fdf4', 
                      border: `1px dashed ${churnRisk?.grade === "위험" ? '#fca5a5' : churnRisk?.grade === "주의" ? '#fcd34d' : '#bbf7d0'}`, 
                      borderRadius: 12, 
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 13 }}>💡</span>
                        <span style={{ 
                          fontSize: 12, 
                          fontWeight: 800, 
                          color: churnRisk?.grade === "위험" ? '#b91c1c' : churnRisk?.grade === "주의" ? '#b45309' : '#166534' 
                        }}>
                          AI 이탈 방지 행동 가이드
                        </span>
                      </div>
                      <p style={{ 
                        fontSize: 11, 
                        color: churnRisk?.grade === "위험" ? '#7f1d1d' : churnRisk?.grade === "주의" ? '#78350f' : '#14532d', 
                        lineHeight: 1.6, 
                        fontWeight: 600, 
                        margin: 0 
                      }}>
                        {churnRisk?.grade === "위험" ? (
                          "최근 자산 이탈 징후가 포착되었습니다. 즉시 유선 연락을 조율하고, 대체 포트폴리오 리밸런싱 제안서(세제 혜택 위주)를 준비하여 방문 대면 상담을 진행하십시오."
                        ) : churnRisk?.grade === "주의" ? (
                          "내방 주기 경과 및 대화 지표 중립화 징후가 보입니다. 1주일 내로 안부 전화를 취하고, 고객 관심사 기반의 시장 동향 자료를 가볍게 전달하는 것을 권장합니다."
                        ) : (
                          "현재 모든 관계 지표가 안정적입니다. 정기 금융 트렌드 메세지를 주기적으로 발송하여 최상의 신뢰 관계를 유지하십시오."
                        )}
                      </p>
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
                      <div><span style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>{visitStats?.total_visits ?? 0}</span> <span style={{ fontSize: 12, color: '#64748b' }}>회</span></div>
                    </div>
                    <div style={{ flex: 1, background: '#dbeafe', borderRadius: 16, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 14, color: '#64748b', fontWeight: 600 }}>평균 주기</span>
                      <div><span style={{ fontSize: 24, fontWeight: 700, color: '#3b82f6' }}>{visitStats?.avg_visit_cycle_days ?? "-"}</span> <span style={{ fontSize: 12, color: '#64748b' }}>일</span></div>
                    </div>
                    <div style={{ flex: 1, background: '#e0f2fe', borderRadius: 16, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 14, color: '#64748b', fontWeight: 600 }}>마지막 방문</span>
                      <div><span style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>{daysSinceLastVisitText}</span> <span style={{ fontSize: 12, color: '#64748b' }}></span></div>
                    </div>
                  </div>

                  {/* Monthly Visit Bar Chart */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 32, height: 120, borderBottom: '2px solid #e2e8f0', paddingBottom: 16 }}>
                    {visitStats && visitStats.monthly_visits ? (
                      visitStats.monthly_visits.map((item, idx) => {
                        const maxCount = Math.max(...visitStats.monthly_visits.map(m => m.count), 1);
                        const percentHeight = Math.min((item.count / maxCount) * 100, 100);
                        return (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              {item.count > 0 && (
                                <span style={{ fontSize: 10, color: '#6366f1', fontWeight: 700, position: 'absolute', top: -18 }}>
                                  {item.count}회
                                </span>
                              )}
                              <div style={{ width: 16, height: `${percentHeight}px`, minHeight: item.count > 0 ? 10 : 2, background: item.count > 0 ? '#6366f1' : '#cbd5e1', borderRadius: 4, transition: 'height 0.3s ease' }}></div>
                            </div>
                            <span style={{ fontSize: 12, color: '#64748b' }}>{item.month}</span>
                          </div>
                        );
                      })
                    ) : (
                      ["10월", "11월", "12월", "01월", "02월", "03월", "04월", "05월"].map((m, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                          <div style={{ width: 16, height: 2, background: '#cbd5e1', borderRadius: 4 }}></div>
                          <span style={{ fontSize: 12, color: '#64748b' }}>{m}</span>
                        </div>
                      ))
                    )}
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
                          <span style={{ width: 60 }}>{item.subject}</span>
                          <span style={{ color: '#0f172a' }}>{item.A}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', textAlign: 'center', flex: 1, backgroundColor: '#f8fafc', borderRadius: 12 }}>
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <Calendar size={48} color="#0284c7" strokeWidth={2.5} />
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>오늘 방문 고객</h2>
              <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 40, color: '#94a3b8' }}>
                왼쪽에서 오늘 방문 고객을 선택하면<br />상세 정보를 확인할 수 있어요.
              </p>
            </div>
          )}
        </div>
        <CustomerRegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
}
