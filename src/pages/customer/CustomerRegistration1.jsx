import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import CustomerRegistrationModal from "./CustomerRegistrationModal";
import { Calendar, TrendingUp, Users, Bell, Plus, Search, LogOut, UserCircle, Settings, Trash2 } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
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

const todayCustomers = [
  { id: 1, name: "김OO", email: "abcdefg@naver.com", phone: "010-0000-0000", color: "pink", initial: "김", time: "10:00 AM" },
  { id: 2, name: "박OO", email: "erlkgjldfjgkld@gmail.com", phone: "010-1234-5678", color: "purple", initial: "박", time: "13:30 PM" },
  { id: 3, name: "이OO", email: "lgkesdl@gmail.com", phone: "010-9876-5432", color: "red", initial: "이", time: "15:00 PM" },
];


const assetData = [
  { name: '예적금', value: 45, color: '#2dd4bf' },
  { name: '투자상품', value: 35, color: '#a855f7' },
  { name: '연금보험', value: 20, color: '#cbd5e1' },
];

const emotionHistory = [
  { date: '2026.04.27', emoji: '😊', type: '긍정', typeColor: '#2dd4bf', text: '리츠 관심, 방문 의지 높음' },
  { date: '2026.03.15', emoji: '😊', type: '긍정', typeColor: '#2dd4bf', text: '채권 제안 수락, 신뢰 표현' },
  { date: '2026.01.08', emoji: '😐', type: '중립', typeColor: '#94a3b8', text: '조용하게 진행, 큰 반응 없음' },
];

const getCustomerDetails = (customer, fullDetail, visitStats, churnRisk, customerFeatures, productMatches) => {
  if (!customer) return null;
  
  let lastVisitDiffVal = "9";
  if (visitStats && visitStats.last_visit_date) {
    const lastDate = new Date(visitStats.last_visit_date);
    const today = new Date();
    lastDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    const diffTime = today.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      lastVisitDiffVal = "오늘";
    } else {
      lastVisitDiffVal = diffDays.toString();
    }
  } else if (visitStats && !visitStats.last_visit_date) {
    lastVisitDiffVal = "-";
  }

  const monthlyVisits = visitStats && visitStats.monthly_visits
    ? visitStats.monthly_visits.map(mv => ({
        month: mv.month,
        visited: mv.count > 0,
        height: mv.count > 0 ? 140 : 0
      }))
    : [
        { month: "09월", visited: false },
        { month: "10월", visited: false },
        { month: "11월", visited: true, height: 140 },
        { month: "12월", visited: false },
        { month: "01월", visited: true, height: 140 },
        { month: "02월", visited: false },
        { month: "03월", visited: true, height: 140 },
        { month: "04월", visited: true, height: 140 },
      ];

  let riskLevel = "미측정";
  let riskLabel = "데이터 부족";
  let riskDesc = "이탈 위험 수준 분석을 위한 상담 데이터가 필요합니다";
  let riskLLMInsight = "충분한 상담 기록이 확보되지 않아 이탈 위험 수준 분석이 어렵습니다. 새로운 상담 일정을 등록하거나 최근 상담에 대한 상세 메모를 작성하여 이탈 위험 분석에 필요한 데이터를 제공해 주세요.";
  let riskColor = "#94a3b8";
  let riskEmoji = "🤔";

  if (churnRisk && churnRisk.grade) {
    riskLabel = churnRisk.grade;
    riskLLMInsight = churnRisk.reason || "이탈 위험 수준에 대한 분석이 완료되었습니다. 제공된 사유를 참고해 주세요.";
    if (churnRisk.grade === "주의") {
      riskLevel = "보통";
      riskDesc = "이탈 위험이 보통입니다";
      riskColor = "#f59e0b";
      riskEmoji = "😐";
    } else if (churnRisk.grade === "위험") {
      riskLevel = "높음";
      riskDesc = "이탈 위험이 높습니다";
      riskColor = "#ef4444";
      riskEmoji = "😟";
    } else if (churnRisk.grade === "양호") {
      riskLevel = "낮음";
      riskDesc = "이탈 위험이 낮습니다";
      riskColor = "#14b8a6";
      riskEmoji = "😊";
    }
  }

  const defaults = {
    job: fullDetail?.job || "중견기업 CEO",
    vipStatus: fullDetail?.grade || "VIP",
    typeStatus: fullDetail?.tendency || "위험중립형",
    email: fullDetail?.email || customer?.email || "example@email.com",
    address: fullDetail?.address || "서울시 강남구",
    gridData: {
      totalAsset: fullDetail?.total_assets !== undefined ? `${(fullDetail.total_assets / 100000000).toFixed(1)}억` : "16억",
      age: fullDetail?.birthday ? `만 ${new Date().getFullYear() - new Date(fullDetail.birthday).getFullYear()}세` : "만 54세",
      birthdayStr: fullDetail?.birthday ? fullDetail.birthday.replace(/-/g, ".") : "1972.08.14",
      startDate: fullDetail?.start_date ? fullDetail.start_date.replace(/-/g, ".") : "2018.03.05",
      lastConsult: "2026.01.11",
      nextVisit: "2026.05.02",
    },
    assetTotal: fullDetail?.total_assets !== undefined ? `${(fullDetail.total_assets / 100000000).toFixed(1)}억` : "32억",
    netWorthTotal: fullDetail?.net_worth !== undefined ? `${(fullDetail.net_worth / 100000000).toFixed(1)}억` : "32억",
    assetList: [
      { name: '예적금', value: fullDetail ? Math.round((fullDetail.deposit / (fullDetail.net_worth || 1)) * 100) : 45, color: '#2dd4bf' },
      { name: '투자상품', value: fullDetail ? Math.round((fullDetail.investment / (fullDetail.net_worth || 1)) * 100) : 35, color: '#a855f7' },
      { name: '연금보험', value: fullDetail ? Math.round((fullDetail.pension / (fullDetail.net_worth || 1)) * 100) : 20, color: '#cbd5e1' },
    ],
    assetLLMInsight: fullDetail?.llm_insight || "순자산 중 예적금 및 투자상품 비율이 적절한 균형을 유지하고 있습니다.",
    riskLevel: riskLevel,
    riskLabel: riskLabel,
    riskDesc: riskDesc,
    riskLLMInsight: riskLLMInsight,
    riskColor: riskColor,
    riskEmoji: riskEmoji,
    visitData: {
      totalVisits: visitStats ? (visitStats.total_visits ?? 0) : 4,
      averageInterval: visitStats ? (visitStats.avg_visit_cycle_days ?? "-") : 53,
      lastVisitDiff: visitStats ? lastVisitDiffVal : "9",
      monthlyVisits: monthlyVisits
    },
    features: (customerFeatures && customerFeatures.features) ? customerFeatures.features : [],
    productMatchingList: (productMatches && productMatches.items && productMatches.items.length > 0)
      ? productMatches.items.map(item => ({
          productName: item.product_name,
          productDesc: item.product_explanation,
          status: item.is_suitable ? "적합" : "부적합",
          statusColor: item.is_suitable ? "#10b981" : "#ef4444",
          matchingDesc: item.reason
        }))
      : []
  };
 
  // 자산이 0원인 경우 PieChart 퍼센트 비중을 0으로 강제 조정
  if (fullDetail && fullDetail.net_worth === 0) {
    defaults.assetList = [
      { name: '예적금', value: 0, color: '#2dd4bf' },
      { name: '투자상품', value: 0, color: '#a855f7' },
      { name: '연금보험', value: 0, color: '#cbd5e1' },
    ];
  }

  return {
    ...defaults,
    ...customer,
    gridData: {
      ...defaults.gridData,
      ...(customer.gridData || {})
    },
    visitData: {
      ...defaults.visitData,
      ...(customer.visitData || {})
    },
    features: customer.features || defaults.features,
    productMatchingList: defaults.productMatchingList
  };
};

export default function CustomerRegistration1() {
  const location = useLocation();
  const path = location.pathname;
  const [allCustomersList, setAllCustomersList] = useState([]);
  const [todayCustomersList, setTodayCustomersList] = useState([]);
  const [fullCustomerDetail, setFullCustomerDetail] = useState(null);
  const [visitStats, setVisitStats] = useState(null);
  const [churnRisk, setChurnRisk] = useState(null);
  const [customerFeatures, setCustomerFeatures] = useState(null);
  const [productMatches, setProductMatches] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeListTab, setActiveListTab] = useState('전체 고객');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDetailTab, setActiveDetailTab] = useState("info");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState(null);
  const [featureSubTab, setFeatureSubTab] = useState("전체");
  const [listWidth, setListWidth] = useState(320);
  const [isDragging, setIsDragging] = useState(false);

  // API로부터 고객 목록 로드
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
          tendency: c.tendency,
          total_assets: c.total_assets
        };
      });

      if (activeListTab === '전체 고객') {
        setAllCustomersList(mapped);
      } else {
        setTodayCustomersList(mapped);
      }

      // 목록 최초 로딩 완료 및 탭 스위칭 시 첫 번째 고객 자동 선택
      if (mapped.length > 0) {
        setSelectedCustomer(mapped[0]);
      } else {
        setSelectedCustomer(null);
      }
    } catch (error) {
      console.error("고객 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [activeListTab]);

  // 선택된 고객이 바뀔 때 상세 정보, 방문 통계 및 이탈 위험도 로드
  useEffect(() => {
    if (!selectedCustomer) {
      setFullCustomerDetail(null);
      setVisitStats(null);
      setChurnRisk(null);
      setCustomerFeatures(null);
      setProductMatches(null);
      return;
    }
    
    const fetchDetail = async () => {
      try {
        const detail = await api.customer.getDetail(selectedCustomer.id);
        setFullCustomerDetail(detail);
      } catch (error) {
        console.error("고객 상세 정보 조회 실패:", error);
      }

      try {
        const stats = await api.customer.getVisitStats(selectedCustomer.id);
        setVisitStats(stats);
      } catch (error) {
        console.error("방문 주기 조회 실패:", error);
        setVisitStats(null);
      }

      try {
        const risk = await api.customer.getChurnRisk(selectedCustomer.id);
        setChurnRisk(risk);
      } catch (error) {
        console.error("이탈 위험 조회 실패:", error);
        setChurnRisk(null);
      }

      try {
        const features = await api.customer.getFeatures(selectedCustomer.id);
        setCustomerFeatures(features);
      } catch (error) {
        console.error("고객 특징 조회 실패:", error);
        setCustomerFeatures(null);
      }

      try {
        const matches = await api.customer.getProductMatch(selectedCustomer.id);
        setProductMatches(matches);
      } catch (error) {
        console.error("주력 상품 매칭 조회 실패:", error);
        setProductMatches(null);
      }
    };
    
    fetchDetail();
  }, [selectedCustomer]);

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

  const currentList = activeListTab === '전체 고객' ? allCustomersList : todayCustomersList;
  const filteredCustomers = currentList.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const details = getCustomerDetails(selectedCustomer, fullCustomerDetail, visitStats, churnRisk, customerFeatures, productMatches);

  const handleSaveCustomer = async (formData) => {
    try {
      if (editModalData) {
        // 수정 모드
        await api.customer.update(editModalData.id, {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          job: formData.job,
          address: formData.address,
          grade: formData.grade,
          investment_type: formData.investment_type,
          birth: formData.dob ? formData.dob.replace(/\./g, "-") : null,
        });
        setEditModalData(null);
        await fetchCustomers();
        
        // 상세 데이터가 현재 보고있는 고객이면 상세도 다시 로드하여 즉시 UI 반영
        if (selectedCustomer && selectedCustomer.id === editModalData.id) {
          const detail = await api.customer.getDetail(selectedCustomer.id);
          setFullCustomerDetail(detail);
          setSelectedCustomer(prev => ({
            ...prev,
            name: formData.name,
            phone: formData.phone,
            email: formData.email
          }));
        }
      } else {
        // 신규 등록 모드
        const created = await api.customer.create({
          name: formData.name || "신규 고객",
          email: formData.email || "new@email.com",
          phone: formData.phone || "010-0000-0000",
          address: formData.address || "서울시 강남구",
          job: formData.job || "회사원",
          grade: formData.grade || "일반",
          investment_type: formData.investment_type || "위험중립형",
          birth: formData.dob ? formData.dob.replace(/\./g, "-") : null,
        });
        setIsModalOpen(false);
        await fetchCustomers();

        const colors = ["pink", "purple", "red", "green", "blue", "yellow", "gray"];
        setSelectedCustomer({
          id: created.c_id,
          name: created.name,
          email: created.email,
          phone: created.number || created.phone || "010-0000-0000",
          color: colors[created.c_id % colors.length],
          initial: created.name ? created.name[0] : "신",
        });
      }
    } catch (error) {
      alert("고객 정보 저장 중 오류가 발생했습니다: " + error.message);
    }
  };

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
            <div className={`cust-list-tab ${activeListTab === '전체 고객' ? 'active' : ''}`} onClick={() => { setActiveListTab('전체 고객'); }} style={{ cursor: 'pointer' }}>전체 고객</div>
            <div className={`cust-list-tab ${activeListTab === '오늘 방문' ? 'active' : ''}`} onClick={() => { setActiveListTab('오늘 방문'); }} style={{ cursor: 'pointer' }}>오늘 방문</div>
          </div>

          <div className="cust-list-items">
            {filteredCustomers.map(c => (
              <div className={`cust-list-item ${selectedCustomer?.id === c.id ? 'active' : ''}`} key={c.id} onClick={() => { setSelectedCustomer(c); setFeatureSubTab("전체"); }} style={{ cursor: 'pointer' }}>
                <div className={`cust-avatar ${c.color}`}>{c.initial}</div>
                <div className="cust-item-info">
                  <span className="cust-item-name">{c.name}</span>
                  <span className="cust-item-sub">{c.email}</span>
                  <span className="cust-item-sub">{c.phone}</span>
                </div>
                {c.time && <div className="cust-item-time">{c.time}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Resizer Divider */}
        <div className={`cust-resizer ${isDragging ? 'dragging' : ''}`} onMouseDown={handleMouseDown} />

        {/* Right Detail Panel */}
        <div key={selectedCustomer?.id || 'empty'} className={`cust-detail-panel ${isModalOpen ? 'cust-blurred-content' : ''}`}>
          {selectedCustomer ? (
            <>
          <div className="cust-detail-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '16px', borderBottom: 'none', paddingBottom: 0 }}>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="cust-detail-profile" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className={`cust-avatar ${selectedCustomer.color}`} style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Clean solid color circle without text */}
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>{selectedCustomer.name}</h2>
              </div>
            </div>

            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', borderBottom: 'none', paddingBottom: 16, marginTop: 8 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  onClick={() => setActiveDetailTab("info")}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 8,
                    border: 'none',
                    background: activeDetailTab === 'info' ? '#0284c7' : '#f3f4f6',
                    color: activeDetailTab === 'info' ? 'white' : '#4b5563',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  고객 정보
                </button>
                <button 
                  onClick={() => setActiveDetailTab("features")}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 8,
                    border: 'none',
                    background: activeDetailTab === 'features' ? '#0284c7' : '#f3f4f6',
                    color: activeDetailTab === 'features' ? 'white' : '#4b5563',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  고객 특징
                </button>
              </div>
              {activeDetailTab === "info" && (
                <button 
                  onClick={() => setIsDeleteModalOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    background: 'white',
                    color: '#ef4444',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
                  <Trash2 size={14} color="#ef4444" />
                  삭제하기
                </button>
              )}
            </div>
          </div>

          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {activeDetailTab === "info" ? (
              <>
                {/* 1. Basic Profile Box */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 64, height: 64, background: 'white', borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#cbd5e1' }}>
                        {selectedCustomer.initial}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>{selectedCustomer.name}</span>
                          <span style={{ background: '#fef3c7', color: '#b45309', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 12 }}>{details.vipStatus}</span>
                          <span style={{ background: '#e2e8f0', color: '#64748b', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 12 }}>{details.typeStatus}</span>
                        </div>
                        <div style={{ fontSize: 14, color: '#64748b' }}>
                          {details.job}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setEditModalData({
                          id: selectedCustomer.id,
                          name: selectedCustomer.name,
                          birthday: fullCustomerDetail?.birthday || "",
                          phone: selectedCustomer.phone,
                          email: selectedCustomer.email || fullCustomerDetail?.email || "",
                          job: fullCustomerDetail?.job || "",
                          grade: fullCustomerDetail?.grade || "일반",
                          address: fullCustomerDetail?.address || "",
                          tendency: fullCustomerDetail?.tendency || "위험중립형"
                        });
                      }}
                      style={{ background: '#0284c7', color: 'white', border: 'none', borderRadius: 8, padding: '8px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      수정하기
                    </button>
                  </div>

                  {/* 6 Grid items */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
                    {/* 1. 총 자산 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label style={{ fontSize: 12, fontWeight: 500, color: '#64748b' }}>총 자산</label>
                      <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: 8, fontSize: 14, color: '#0f172a', fontWeight: 600 }}>{details.gridData.totalAsset}</div>
                    </div>

                    {/* 2. 생년월일 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label style={{ fontSize: 12, fontWeight: 500, color: '#64748b' }}>생년월일</label>
                      <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: 8, fontSize: 14, color: '#0f172a', fontWeight: 600 }}>{details.gridData.birthdayStr}</div>
                    </div>

                    {/* 3. 연락처 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label style={{ fontSize: 12, fontWeight: 500, color: '#64748b' }}>연락처</label>
                      <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: 8, fontSize: 14, color: '#0f172a', fontWeight: 600 }}>{selectedCustomer.phone}</div>
                    </div>

                    {/* 4. 이메일 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label style={{ fontSize: 12, fontWeight: 500, color: '#64748b' }}>이메일</label>
                      <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: 8, fontSize: 14, color: '#0f172a', fontWeight: 600 }}>{selectedCustomer.email || details.email}</div>
                    </div>

                    {/* 5. 주소 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label style={{ fontSize: 12, fontWeight: 500, color: '#64748b' }}>주소</label>
                      <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: 8, fontSize: 14, color: '#0f172a', fontWeight: 600 }}>{details.address}</div>
                    </div>

                    {/* 6. 거래 시작일 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label style={{ fontSize: 12, fontWeight: 500, color: '#64748b' }}>거래 시작일</label>
                      <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: 8, fontSize: 14, color: '#0f172a', fontWeight: 600 }}>{details.gridData.startDate}</div>
                    </div>
                  </div>
                </div>

                {/* Row: 자산 보유 현황 / 이탈 위험 수준 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                  {/* 자산 보유 현황 */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>자산 보유 현황</h3>
                      <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>포트폴리오 비중</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px 24px', justifyContent: 'center', flex: 1 }}>
                      <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                             <Pie data={details.assetList} innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                               {details.assetList.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                             </Pie>
                           </PieChart>
                        </ResponsiveContainer>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>순자산</span>
                          <span style={{ fontSize: 16, fontWeight: 700, color: '#d97706' }}>{details.netWorthTotal}</span>
                        </div>
                      </div>
                      <div style={{ flex: '1 1 140px', display: 'flex', flexDirection: 'column', gap: 10, minWidth: 140 }}>
                        {details.assetList.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }}></div>
                            <span style={{ fontSize: 12, color: '#475569', fontWeight: 600, width: 60 }}>{item.name}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, marginTop: 20, margin: '20px 0 0 0' }}>
                      {details.assetLLMInsight}
                    </p>
                  </div>

                  {/* 이탈 위험 수준 */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>이탈 위험 수준</h3>
                      <span style={{ fontSize: 14, color: details.riskColor, fontWeight: 700 }}>{details.riskLevel}</span>
                    </div>
                    <div style={{ background: details.riskColor, borderRadius: 12, padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 6px -1px ${details.riskColor}4d`, marginBottom: 20 }}>
                      <div style={{ fontSize: 32, marginBottom: 4 }}>{details.riskEmoji}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 2 }}>{details.riskLabel}</div>
                      <div style={{ fontSize: 12, color: 'white', fontWeight: 500 }}>{details.riskDesc}</div>
                    </div>
                    <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                      {details.riskLLMInsight}
                    </p>
                  </div>
                </div>

                {/* 방문 주기 그래프 */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>방문 주기 그래프</h3>
                  
                  {/* Cards Row: 총 방문, 평균 주기, 마지막 방문 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                    {/* Card 1: 총 방문 */}
                    <div style={{ background: '#e0e7ff', borderRadius: 16, padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 90 }}>
                      <span style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>총 방문</span>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline' }}>
                        <span style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{details.visitData.totalVisits}</span>
                        <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginLeft: 2 }}>회</span>
                      </div>
                    </div>
                    {/* Card 2: 평균 주기 */}
                    <div style={{ background: '#e0e7ff', borderRadius: 16, padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 90 }}>
                      <span style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>평균 주기</span>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline' }}>
                        <span style={{ fontSize: 32, fontWeight: 700, color: '#5c5ced', lineHeight: 1 }}>{details.visitData.averageInterval}</span>
                        <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginLeft: 2 }}>일</span>
                      </div>
                    </div>
                    {/* Card 3: 마지막 방문 */}
                    <div style={{ background: '#e0e7ff', borderRadius: 16, padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 90 }}>
                      <span style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>마지막 방문</span>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline' }}>
                        <span style={{ fontSize: 32, fontWeight: 700, color: '#14b8a6', lineHeight: 1 }}>
                          {details.visitData.lastVisitDiff === "-" || details.visitData.lastVisitDiff === "오늘" ? "" : "+"}
                          {details.visitData.lastVisitDiff}
                        </span>
                        <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginLeft: 2 }}>
                          {details.visitData.lastVisitDiff === "-" || details.visitData.lastVisitDiff === "오늘" ? "" : "일"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Custom Pure CSS Chart */}
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '24px 0 8px 0', border: '1px solid #e2e8f0', borderRadius: 12, background: 'white' }}>
                    {/* The Chart Columns Area */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 160, padding: '0 40px', position: 'relative' }}>
                      
                      {/* Baseline */}
                      <div style={{ position: 'absolute', left: 32, right: 32, bottom: 0, height: 2, backgroundColor: '#cbd5e1' }} />

                      {/* Map over months */}
                      {details.visitData.monthlyVisits.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '10%', position: 'relative', height: '100%', justifyContent: 'flex-end' }}>
                          {item.visited ? (
                            /* Tall vertical bar rising up from the baseline */
                            <div 
                              style={{ 
                                width: 28, 
                                height: item.height || 140, 
                                backgroundColor: '#5c5ced', 
                                borderRadius: 8, 
                                marginBottom: -1, /* Sit perfectly on the baseline */
                                zIndex: 2,
                              }} 
                            />
                          ) : (
                            /* Small flat grey indicator sitting right on the baseline */
                            <div 
                              style={{ 
                                width: 24, 
                                height: 8, 
                                backgroundColor: '#cbd5e1', 
                                borderRadius: 4, 
                                marginBottom: 6, 
                                zIndex: 2 
                              }} 
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* X-Axis Labels Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 40px 0 40px' }}>
                      {details.visitData.monthlyVisits.map((item, idx) => (
                        <div key={idx} style={{ width: '10%', display: 'flex', justifyContent: 'center' }}>
                          <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{item.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* 메모 기반 고객 특징 */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>메모 기반 고객 특징</h3>
                  
                  {/* Sub-tabs Row */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {["전체", "관계", "성향", "상품", "기호", "건강", "기타"].map((tab) => {
                      const isActive = featureSubTab === tab;
                      return (
                        <button
                          key={tab}
                          onClick={() => setFeatureSubTab(tab)}
                          style={{
                            padding: '6px 16px',
                            borderRadius: 6,
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: isActive ? '#0284c7' : 'white',
                            color: isActive ? 'white' : '#4b5563',
                            border: isActive ? '1px solid #0284c7' : '1px solid #cbd5e1',
                            boxShadow: isActive ? '0 1px 2px rgba(2, 132, 199, 0.2)' : 'none',
                          }}
                        >
                          {tab}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feature items list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 320, overflowY: 'auto', paddingRight: 4 }}>
                    {details.features
                      .filter(item => featureSubTab === "전체" || item.category === featureSubTab)
                      .map((item, idx) => (
                        <div 
                          key={idx} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            background: 'white', 
                            border: '1px solid #e2e8f0', 
                            borderRadius: 12, 
                            padding: '16px 20px', 
                            gap: 16, 
                            boxShadow: '0 1px 2px rgba(0,0,0,0.02)' 
                          }}
                        >
                          <div 
                            style={{ 
                              width: 64, 
                              height: 28, 
                              borderRadius: 4, 
                              background: item.color || '#64748b', 
                              color: 'white', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              fontSize: 13, 
                              fontWeight: 700 
                            }}
                          >
                            {item.category}
                          </div>
                          <span style={{ fontSize: 14, color: '#0f172a', fontWeight: 600, flex: 1 }}>
                            {item.text}
                          </span>
                          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
                            {item.date}
                          </span>
                        </div>
                      ))}
                    {details.features.filter(item => featureSubTab === "전체" || item.category === featureSubTab).length === 0 && (
                      <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8', fontSize: 14, fontWeight: 500 }}>
                        해당 카테고리의 특징 메모가 없습니다.
                      </div>
                    )}
                  </div>
                </div>

                {/* 주력 상품 매칭 현황 */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>주력 상품 매칭 현황</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 400, overflowY: 'auto', paddingRight: 4 }}>
                    {details.productMatchingList.map((product, idx) => (
                      <div key={idx} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                        {/* Left Column */}
                        <div style={{ flex: '1.2 1 300px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                          <h4 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                            {product.productName}
                          </h4>
                          <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                            {product.productDesc}
                          </p>
                        </div>

                        {/* Separator line */}
                        <div className="cust-matching-divider" style={{ width: 1, backgroundColor: '#e2e8f0', alignSelf: 'stretch' }} />

                        {/* Right Column */}
                        <div style={{ flex: '0.8 1 200px', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: 'center' }}>
                          <div 
                            style={{ 
                              width: 100, 
                              height: 36, 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              background: product.statusColor || '#ef4444', 
                              color: 'white', 
                              borderRadius: 4, 
                              fontWeight: 700, 
                              fontSize: 14 
                            }}
                          >
                            {product.status}
                          </div>
                          <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, margin: 0, textAlign: 'left' }}>
                            {product.matchingDesc}
                          </p>
                        </div>
                      </div>
                    ))}
                    {details.productMatchingList.length === 0 && (
                      <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8', fontSize: 14, fontWeight: 500, background: 'white', border: '1px solid #e2e8f0', borderRadius: 12 }}>
                        추천된 상품 매칭 분석 결과가 없습니다.
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

          </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', textAlign: 'center', flex: 1, backgroundColor: '#f8fafc', borderRadius: 12 }}>
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                {activeListTab === '전체 고객' ? <UserCircle size={48} color="#0284c7" strokeWidth={2.5} /> : <Calendar size={48} color="#0284c7" strokeWidth={2.5} />}
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>{activeListTab === '전체 고객' ? '전체 고객 목록' : '오늘 방문 고객'}</h2>
              <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 40, whiteSpace: 'pre-wrap', color: '#94a3b8' }}>
                {activeListTab === '전체 고객' ? '왼쪽 목록에서 고객을 선택하면\n상세 정보를 확인할 수 있어요.' : '왼쪽에서 오늘 방문 고객을 선택하면\n상세 정보를 확인할 수 있어요.'}
              </p>
              {activeListTab === '전체 고객' && <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>고객 이름을 클릭해 프로필, 대시보드, 브리핑을 확인하세요</p>}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && selectedCustomer && (
          <div className="cust-modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.4)' }}>
            <div className="cust-modal" style={{ width: 400, padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'white', borderRadius: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Trash2 size={24} color="#ef4444" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>고객 삭제 확인</h2>
              <p style={{ fontSize: 15, color: '#64748b', marginBottom: 32 }}>
                <strong style={{ color: '#0f172a' }}>{selectedCustomer.name}</strong> 고객을 삭제하겠습니까?
              </p>
              <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
                >
                  취소
                </button>
                <button 
                  onClick={async () => {
                    try {
                      setIsDeleteModalOpen(false);
                      await api.customer.delete(selectedCustomer.id);
                      setAllCustomersList(prev => prev.filter(c => c.id !== selectedCustomer.id));
                      setTodayCustomersList(prev => prev.filter(c => c.id !== selectedCustomer.id));
                      setSelectedCustomer(null);
                    } catch (error) {
                      alert("고객 삭제 실패: " + error.message);
                    }
                  }}
                  style={{ flex: 1, padding: '12px', borderRadius: 8, border: 'none', background: '#ef4444', color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}

      <CustomerRegistrationModal 
        isOpen={isModalOpen || !!editModalData} 
        onClose={() => { setIsModalOpen(false); setEditModalData(null); }} 
        initialData={editModalData}
        onSave={handleSaveCustomer}
      />
      </div>
    </div>
  );
}
