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

const getCustomerDetails = (customer, fullDetail) => {
  if (!customer) return null;
  
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
    assetList: [
      { name: '예적금', value: fullDetail ? Math.round((fullDetail.deposit / (fullDetail.total_assets || 1)) * 100) : 45, color: '#2dd4bf' },
      { name: '투자상품', value: fullDetail ? Math.round((fullDetail.investment / (fullDetail.total_assets || 1)) * 100) : 35, color: '#a855f7' },
      { name: '연금보험', value: fullDetail ? Math.round((fullDetail.pension / (fullDetail.total_assets || 1)) * 100) : 20, color: '#cbd5e1' },
    ],
    assetLLMInsight: fullDetail?.llm_insight || "순자산 중 예적금 및 투자상품 비율이 적절한 균형을 유지하고 있습니다.",
    riskLevel: "낮음",
    riskLabel: "양호",
    riskDesc: "이탈 위험이 낮습니다",
    riskLLMInsight: "최근 3번의 상담 메모 분석 결과, PB의 고객관리 및 상품 추천에서 큰 만족감을 보이고 있습니다. 서비스 만족도가 높은 편입니다.",
    visitData: {
      totalVisits: 4,
      averageInterval: 53,
      lastVisitDiff: 9,
      monthlyVisits: [
        { month: "09월", visited: false },
        { month: "10월", visited: false },
        { month: "11월", visited: true, height: 140 },
        { month: "12월", visited: false },
        { month: "01월", visited: true, height: 140 },
        { month: "02월", visited: false },
        { month: "03월", visited: true, height: 140 },
        { month: "04월", visited: true, height: 140 },
      ]
    },
    features: [
      { category: "기호", text: "비타500 싫어함, 아메리카노 더블샷 선호", date: "2026.04.12", color: "#f97316" },
      { category: "관계", text: "배우자가 최근 퇴직 후 자산 재배치 관심 증가", date: "2026.04.02", color: "#db2777" },
      { category: "상품", text: "달러 자산 비중 너무 높다며 불안감 표현, 국내 상품 선호", date: "2026.03.12", color: "#0284c7" },
      { category: "성향", text: "빠른 의사결정 선호, 서류 설명 길면 집중력 저하", date: "2026.04.12", color: "#8b5cf6" },
      { category: "건강", text: "무릎 수술 후 장기 요양 중 - 방문 일정 오전 선호", date: "2026.04.12", color: "#10b981" },
    ],
    productMatchingList: [
      {
        productName: "우리 테마형 국내 리츠 펀드",
        productDesc: "본 펀드는 국내 우량 리츠 및 상장 부동산 자산에 집중 투자하여 안정적인 배당 수익과 중장기적인 자산 가치 상승을 동시에 추구합니다.",
        status: "부적합",
        statusColor: "#ef4444",
        matchingDesc: "현재 달러 자산의 비중을 낮추고 변동성이 적은 안정적인 인컴 수익을 확보하고자 하는 고객님의 자산 리밸런싱 방향성과 정확히 부합합니다."
      },
      {
        productName: "하나 고배당 상장지수증권 (ETN)",
        productDesc: "국내 고배당주 포트폴리오를 추종하며, 매월 분배금을 지급하여 현금 흐름을 극대화하고자 하는 은퇴자 및 자산가 고객에게 최적화된 상품입니다.",
        status: "적합",
        statusColor: "#10b981",
        matchingDesc: "은퇴 자산의 안정적인 현금 흐름 창출을 최우선으로 선호하시는 고객님의 니즈와 완벽히 일치하여 고배당 매력도가 매우 높습니다."
      },
      {
        productName: "글로벌 인공지능 테크 랩어카운트",
        productDesc: "미국 및 글로벌 빅테크 기업과 차세대 AI 하드웨어/소프트웨어 혁신 선도 기업들을 중심으로 집중 포트폴리오를 구성해 초과 성장을 목표로 합니다.",
        status: "적합",
        statusColor: "#10b981",
        matchingDesc: "중장기 자산 성장을 원하시고, 성장주 투자를 통해 적극적인 수익 실현을 지향하시는 고객님의 성향과 강력히 연계됩니다."
      },
      {
        productName: "삼성 단기 국공채 전문투자형 사모펀드",
        productDesc: "삼성 자산운용의 우량 국공채 집중 투자형 사모펀드로 금리 변동 리스크를 최소화하고 단기 이자 수익을 고정 확보하는 상품입니다.",
        status: "부적합",
        statusColor: "#ef4444",
        matchingDesc: "현재 금리 인하 국면에서 단기 채권의 메리트가 낮고, 적극적인 리밸런싱을 통한 중장기 고수익을 원하시는 현 시점 전략과는 맞지 않습니다."
      }
    ]
  };

  // 자산이 0원인 경우 PieChart 퍼센트 비중을 0으로 강제 조정
  if (fullDetail && fullDetail.total_assets === 0) {
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
    productMatchingList: customer.productMatchingList || defaults.productMatchingList
  };
};

export default function CustomerRegistration1() {
  const location = useLocation();
  const path = location.pathname;
  const [allCustomersList, setAllCustomersList] = useState([]);
  const [todayCustomersList, setTodayCustomersList] = useState([]);
  const [fullCustomerDetail, setFullCustomerDetail] = useState(null);
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

  // 선택된 고객이 바뀔 때 상세 정보 로드
  useEffect(() => {
    if (!selectedCustomer) {
      setFullCustomerDetail(null);
      return;
    }
    
    const fetchDetail = async () => {
      try {
        const detail = await api.customer.getDetail(selectedCustomer.id);
        setFullCustomerDetail(detail);
      } catch (error) {
        console.error("고객 상세 정보 조회 실패:", error);
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

  const details = getCustomerDetails(selectedCustomer, fullCustomerDetail);

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
                          <span style={{ fontSize: 16, fontWeight: 700, color: '#d97706' }}>{details.assetTotal}</span>
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
                      <span style={{ fontSize: 14, color: '#14b8a6', fontWeight: 700 }}>{details.riskLevel}</span>
                    </div>
                    <div style={{ background: '#14b8a6', borderRadius: 12, padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(20, 184, 166, 0.3)', marginBottom: 20 }}>
                      <div style={{ fontSize: 32, marginBottom: 4 }}>😊</div>
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
                        <span style={{ fontSize: 32, fontWeight: 700, color: '#14b8a6', lineHeight: 1 }}>+{details.visitData.lastVisitDiff}</span>
                        <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginLeft: 2 }}>일</span>
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
