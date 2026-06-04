import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CustomerRegistrationModal from "./CustomerRegistrationModal";
import { Calendar, TrendingUp, Users, Bell, Plus, Search, LogOut, UserCircle, Settings, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Sidebar from "../../components/common/Sidebar";
import { api } from "../../api";
import "./Customer.css";

const getCustomerDetails = (customer, fullDetail, visitStats, churnRisk, customerFeatures, productMatches) => {
  if (!customer) return null;

  let lastVisitDiffVal = "9";
  if (visitStats && visitStats.last_visit_date) {
    const lastDate = new Date(visitStats.last_visit_date);
    const today = new Date();
    lastDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
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
      height: mv.count > 0 ? 80 : 0
    }))
    : [
      { month: "09월", visited: false },
      { month: "10월", visited: false },
      { month: "11월", visited: true, height: 80 },
      { month: "12월", visited: false },
      { month: "01월", visited: true, height: 80 },
      { month: "02월", visited: false },
      { month: "03월", visited: true, height: 80 },
      { month: "04월", visited: true, height: 80 },
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
        status: (item.is_owned || Number(item.is_suitable) === 2) ? "보유 중" : (Number(item.is_suitable) === 1 ? "적합" : "부적합"),
        statusColor: (item.is_owned || Number(item.is_suitable) === 2) ? "#3b82f6" : (Number(item.is_suitable) === 1 ? "#10b981" : "#ef4444"),
        matchingDesc: item.reason
      }))
      : []
  };

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

export default function CustomerInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [isListCollapsed, setIsListCollapsed] = useState(false);
  const [showTodayOnly, setShowTodayOnly] = useState(true);
  const [allCustomersList, setAllCustomersList] = useState([]);
  const [todayCustomersList, setTodayCustomersList] = useState([]);
  const [fullCustomerDetail, setFullCustomerDetail] = useState(null);
  const [visitStats, setVisitStats] = useState(null);
  const [churnRisk, setChurnRisk] = useState(null);
  const [customerFeatures, setCustomerFeatures] = useState(null);
  const [productMatches, setProductMatches] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState(null);
  const [featureSubTab, setFeatureSubTab] = useState("전체");
  const [listWidth, setListWidth] = useState(240);
  const [isDragging, setIsDragging] = useState(false);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState(null);

  const getDynamicWordCloudData = () => {
    if (!fullCustomerDetail?.features) return [];
    const tags = fullCustomerDetail.features.split(",")
      .map(t => t.trim())
      .filter(Boolean);
      
    const colors = ["#ef4444", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#06b6d4", "#ec4899", "#0ea5e9", "#6366f1", "#14b8a6"];
    const bgs = ["#fee2e2", "#dbeafe", "#d1fae5", "#ede9fe", "#fef3c7", "#ecfeff", "#fce7f3", "#e0f2fe", "#e0e7ff", "#ccfbf1"];
    const sizes = [14, 13, 12, 12, 11, 11, 12, 13, 12, 11, 10];
    
    return tags.map((tag, idx) => {
      const color = colors[idx % colors.length];
      const bg = bgs[idx % bgs.length];
      const size = sizes[idx % sizes.length];
      return { text: tag, size, color, bg };
    });
  };

  const wordCloudData = getDynamicWordCloudData();

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
          tendency: c.tendency,
          total_assets: c.total_assets
        };
      });

      mapped.sort((a, b) => a.name.localeCompare(b.name, 'ko'));

      if (showTodayOnly) {
        setTodayCustomersList(mapped);
      } else {
        setAllCustomersList(mapped);
      }

      const savedCustomerId = localStorage.getItem("poom_selected_customer_id");
      if (savedCustomerId) {
        const parsedId = parseInt(savedCustomerId, 10);
        const found = mapped.find(c => c.id === parsedId);
        if (found) {
          setSelectedCustomer(found);
          localStorage.removeItem("poom_selected_customer_id");
          return;
        }
      }
      
      const queryParams = new URLSearchParams(location.search);
      const targetCId = queryParams.get("c_id") || location.state?.c_id;
      if (!targetCId) {
        setSelectedCustomer(null);
      }
    } catch (error) {
      console.error("고객 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    setSelectedCustomer(null);
    fetchCustomers();
  }, [showTodayOnly]);

  // URL Query Parameters (?c_id=) 자동 선택 처리
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const targetCId = queryParams.get("c_id") || location.state?.c_id;
    if (targetCId) {
      const parsedId = parseInt(targetCId, 10);
      if (selectedCustomer?.id === parsedId) return;

      const found = allCustomersList.find(c => c.id === parsedId) || todayCustomersList.find(c => c.id === parsedId);
      if (found) {
        setSelectedCustomer(found);
        navigate(location.pathname, { replace: true });
      } else {
        if (showTodayOnly) {
          setShowTodayOnly(false);
        }
      }
    }
  }, [location.search, location.state, allCustomersList, todayCustomersList]);

  useEffect(() => {
    if (!selectedCustomer) {
      setFullCustomerDetail(null);
      setVisitStats(null);
      setChurnRisk(null);
      setCustomerFeatures(null);
      setProductMatches(null);
      return;
    }

    const fetchDetail = () => {
      api.customer.getDetail(selectedCustomer.id)
        .then(detail => {
          setFullCustomerDetail(detail);
        })
        .catch(error => {
          console.error("고객 상세 정보 조회 실패:", error);
        });

      api.customer.getVisitStats(selectedCustomer.id)
        .then(stats => {
          setVisitStats(stats);
        })
        .catch(error => {
          console.error("방문 주기 조회 실패:", error);
          setVisitStats(null);
        });

      api.customer.getChurnRisk(selectedCustomer.id)
        .then(risk => {
          setChurnRisk(risk);
        })
        .catch(error => {
          console.error("이탈 위험 조회 실패:", error);
          setChurnRisk(null);
        });

      api.customer.getFeatures(selectedCustomer.id)
        .then(features => {
          setCustomerFeatures(features);
        })
        .catch(error => {
          console.error("고객 특징 조회 실패:", error);
          setCustomerFeatures(null);
        });

      api.customer.getProductMatch(selectedCustomer.id)
        .then(matches => {
          setProductMatches(matches);
        })
        .catch(error => {
          console.error("주력 상품 매칭 조회 실패:", error);
          setProductMatches(null);
        });
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
      const newWidth = Math.max(110, Math.min(550, startWidth + deltaX));
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

  const currentList = showTodayOnly ? todayCustomersList : allCustomersList;
  const filteredCustomers = currentList.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const details = getCustomerDetails(selectedCustomer, fullCustomerDetail, visitStats, churnRisk, customerFeatures, productMatches);
  const isNarrow = listWidth < 200;

  const handleSaveCustomer = async (formData) => {
    try {
      if (editModalData) {
        await api.customer.update(editModalData.id, {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          job: formData.job,
          address: formData.address,
          grade: formData.grade,
          investment_type: formData.investment_type,
          birth: formData.dob ? formData.dob.replace(/\./g, "-") : null,
          gender: formData.gender,
        });
        setEditModalData(null);
        // 갱신을 수행하기 전에, 목록 업데이트가 selectedCustomer를 지우지 않도록 fetchCustomers를 비동기 호출하되
        // 로컬 상태 selectedCustomer의 id 값을 안전하게 캡처해 둡니다.
        const currentId = editModalData.id;
        await fetchCustomers();

        if (selectedCustomer && selectedCustomer.id === editModalData.id) {
          const detail = await api.customer.getDetail(selectedCustomer.id);
          setFullCustomerDetail(detail);

          const updatedColor = formData.gender === "F" ? "pink" : "blue";

          setSelectedCustomer(prev => {
            // prev가 null이거나 id가 유실되었을 경우를 대비해 캡처된 currentId를 확실히 주입합니다.
            const base = prev || {};
            return {
              ...base,
              id: currentId,
              name: formData.name,
              phone: formData.phone,
              email: formData.email,
              gender: formData.gender,
              color: updatedColor
            };
          });
        }
      } else {
        const created = await api.customer.create({
          name: formData.name || "신규 고객",
          email: formData.email || "new@email.com",
          phone: formData.phone || "010-0000-0000",
          address: formData.address || "서울시 강남구",
          job: formData.job || "회사원",
          grade: formData.grade || "일반",
          investment_type: formData.investment_type || "위험중립형",
          birth: formData.dob ? formData.dob.replace(/\./g, "-") : null,
          gender: formData.gender || "M",
        });
        setIsModalOpen(false);
        await fetchCustomers();

        const createdColor = created.gender === "F" ? "pink" : "blue";

        setSelectedCustomer({
          id: created.c_id,
          name: created.name,
          email: created.email,
          phone: created.number || created.phone || "010-0000-0000",
          color: createdColor,
          gender: created.gender,
          initial: created.name ? created.name[0] : "신",
        });
      }
    } catch (error) {
      alert("고객 정보 저장 중 오류가 발생했습니다: " + error.message);
    }
  };

  return (
    <div className="cust-container">
      <Sidebar type="cust" />

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
                className={`cust-list-item ${selectedCustomer?.id === c.id ? 'active' : ''}`}
                key={c.id}
                onClick={() => { setSelectedCustomer(c); setFeatureSubTab("전체"); setIsListCollapsed(true); }}
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
        <div key={selectedCustomer?.id || 'empty'} className={`cust-detail-panel ${isModalOpen ? 'cust-blurred-content' : ''}`}>
          {selectedCustomer ? (
            <>
              <div className="cust-detail-header" style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: 14 }}>
                <div className="cust-detail-profile" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div className={`cust-avatar ${selectedCustomer.color}`} style={{ width: 40, height: 40, fontSize: 14, fontWeight: 700 }}>{selectedCustomer.initial}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <h2 style={{ fontSize: 18, margin: 0, fontWeight: 700, color: '#0f172a' }}>{selectedCustomer.name}</h2>
                      <span style={{ background: '#fef3c7', color: '#b45309', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10 }}>{details.vipStatus}</span>
                      <span style={{ background: '#e2e8f0', color: '#64748b', fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 10 }}>{details.typeStatus}</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px', fontSize: 11, color: '#64748b', fontWeight: 500, lineHeight: 1.4 }}>
                      <span><strong>직업:</strong> {details.job}</span>
                      <span style={{ color: '#cbd5e1' }}>|</span>
                      <span><strong>연락처:</strong> {selectedCustomer.phone}</span>
                      <span style={{ color: '#cbd5e1' }}>|</span>
                      <span><strong>이메일:</strong> {selectedCustomer.email || details.email}</span>
                      <span style={{ color: '#cbd5e1' }}>|</span>
                      <span><strong>생일:</strong> {details.gridData.birthdayStr}</span>
                      <span style={{ color: '#cbd5e1' }}>|</span>
                      <span><strong>주소:</strong> {details.address}</span>
                      <span style={{ color: '#cbd5e1' }}>|</span>
                      <span><strong>거래시작:</strong> {details.gridData.startDate}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
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
                        tendency: fullCustomerDetail?.tendency || "위험중립형",
                        gender: selectedCustomer.gender || fullCustomerDetail?.gender || "M"
                      });
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '6px 12px',
                      borderRadius: 6,
                      border: '1px solid #cbd5e1',
                      background: 'white',
                      color: '#0284c7',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      transition: 'all 0.2s'
                    }}
                  >
                    수정하기
                  </button>
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '6px 12px',
                      borderRadius: 6,
                      border: '1px solid #cbd5e1',
                      background: 'white',
                      color: '#ef4444',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                  >
                    <Trash2 size={13} color="#ef4444" />
                    삭제하기
                  </button>
                </div>
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* 이탈 위험 수준 (최상단 가로 Full-Width) */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>이탈 위험 수준</h3>
                    <span style={{
                      background: `${details.riskColor}15`,
                      color: details.riskColor,
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <span>{details.riskEmoji}</span>
                      <span>위험도 {details.riskLevel} ({details.riskLabel})</span>
                    </span>
                  </div>

                  <div style={{
                    padding: '10px 12px',
                    background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.4) 0%, rgba(241, 245, 249, 0.5) 100%)',
                    border: '1px dashed ' + (details.riskColor || '#cbd5e1'),
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                    marginTop: 4
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{
                        background: 'linear-gradient(135deg, ' + (details.riskColor || '#cbd5e1') + ' 0%, #64748b 100%)',
                        color: 'white',
                        fontSize: 9,
                        fontWeight: 800,
                        padding: '1px 5px',
                        borderRadius: 8,
                        letterSpacing: '0.3px',
                        textShadow: '0 1px 1px rgba(0,0,0,0.1)'
                      }}>AI 이탈 방지 인사이트</span>
                      <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>{details.riskDesc}</span>
                    </div>
                    <p style={{ fontSize: 11, color: '#4b5563', lineHeight: 1.4, margin: 0, fontWeight: 500 }}>
                      {details.riskLLMInsight}
                    </p>
                  </div>
                </div>

                {/* Row: 좌측(자산-상품) / 우측(메모-방문) 2컬럼 레이아웃 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  {/* Left Column: 자산 보유 현황 + 주력 상품 매칭 현황 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* 자산 보유 현황 (높이 240px 맞춤 & 가로 병렬화) */}
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6, height: 240, boxSizing: 'border-box' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>자산 보유 현황</h3>
                        <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>포트폴리오 비중</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'row', gap: 12, flex: 1, alignItems: 'center', minHeight: 0 }}>
                        {/* Left: 차트 & 범례 */}
                        <div style={{ flex: '1 1 50%', display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
                          <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={details.assetList} innerRadius={20} outerRadius={32} paddingAngle={2} dataKey="value" stroke="none">
                                  {details.assetList.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ fontSize: 8, color: '#64748b', fontWeight: 600 }}>순자산</span>
                              <span style={{ fontSize: 10, fontWeight: 700, color: '#d97706' }}>{details.netWorthTotal}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flexShrink: 0 }}>
                            {details.assetList.map((item, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 4, height: 4, borderRadius: '50%', background: item.color }}></div>
                                <span style={{ fontSize: 9, color: '#475569', fontWeight: 600 }}>{item.name}</span>
                                <span style={{ fontSize: 9, fontWeight: 700, color: '#0f172a' }}>{item.value}%</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Right: AI 포트폴리오 제언 */}
                        <div style={{
                          flex: '1 1 50%',
                          padding: '8px 10px',
                          background: 'linear-gradient(135deg, rgba(245, 243, 255, 0.4) 0%, rgba(238, 242, 255, 0.5) 100%)',
                          border: '1px dashed rgba(139, 92, 246, 0.25)',
                          borderRadius: 8,
                          boxShadow: '0 2px 8px rgba(139, 92, 246, 0.02)',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 4,
                          justifyContent: 'center',
                          overflowY: 'auto'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{
                              background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                              color: 'white',
                              fontSize: 8,
                              fontWeight: 800,
                              padding: '1px 4px',
                              borderRadius: 6,
                              letterSpacing: '0.2px'
                            }}>AI 제언</span>
                          </div>
                          <p style={{ fontSize: 10, color: '#4b5563', lineHeight: 1.35, margin: 0, fontWeight: 500 }}>
                            {details.assetLLMInsight}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 주력 상품 매칭 현황 (높이 220px 고정 및 콤팩트 리스트 모달 연계) */}
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8, height: 220, boxSizing: 'border-box' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>주력 상품 매칭 현황</h3>
                        <span style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>클릭 시 AI 제언 상세 팝업</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', paddingRight: 4, flex: 1 }}>
                        {details.productMatchingList.map((product, idx) => (
                          <div
                            key={idx}
                            onClick={() => setSelectedProductModal(product)}
                            style={{
                              background: 'white',
                              border: '1px solid #e2e8f0',
                              borderRadius: 8,
                              padding: '10px 12px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: 8,
                              boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.borderColor = '#8b5cf6';
                              e.currentTarget.style.boxShadow = '0 2px 4px rgba(139, 92, 246, 0.08)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.borderColor = '#e2e8f0';
                              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
                            }}
                          >
                            <h4 style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {product.productName}
                            </h4>
                            <div
                              style={{
                                width: 52,
                                height: 18,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: product.statusColor || '#ef4444',
                                color: 'white',
                                borderRadius: 4,
                                fontWeight: 700,
                                fontSize: 9,
                                flexShrink: 0
                              }}
                            >
                              {product.status}
                            </div>
                          </div>
                        ))}
                        {details.productMatchingList.length === 0 && (
                          <div style={{ padding: '24px 0', textAlign: 'center', color: '#94a3b8', fontSize: 12, fontWeight: 500, background: 'white', border: '1px solid #e2e8f0', borderRadius: 10 }}>
                            추천된 상품 매칭 분석 결과가 없습니다.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: 메모 기반 고객 특징 + 방문 주기 그래프 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* 메모 기반 고객 특징 (높이 240px 맞춤) */}
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8, height: 240, boxSizing: 'border-box' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>메모 기반 고객 특징</h3>
                        <button
                          onClick={() => setIsFeatureModalOpen(true)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 6,
                            fontSize: 10,
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: 'white',
                            color: '#0284c7',
                            border: '1px solid #cbd5e1',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            transition: 'all 0.2s'
                          }}
                        >
                          특징 목록 보기
                        </button>
                      </div>

                      {wordCloudData.length > 0 ? (
                        /* 워드 클라우드 뷰 */
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 8px', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '4px 2px', overflowY: 'auto' }}>
                          {wordCloudData.map((tag, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: tag.size,
                                color: tag.color,
                                background: tag.bg,
                                padding: '6px 12px',
                                borderRadius: 16,
                                fontWeight: 700,
                                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                cursor: 'default',
                                userSelect: 'none',
                                transition: 'transform 0.2s',
                                display: 'inline-block'
                              }}
                              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                              {tag.text}
                            </span>
                          ))}
                        </div>
                      ) : (
                        /* 예외 처리 (Graceful Fallback) */
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 1,
                          textAlign: 'center',
                          padding: '16px',
                          background: 'white',
                          borderRadius: 12,
                          border: '1px dashed #cbd5e1',
                          margin: '8px 0',
                          minHeight: 140
                        }}>
                          <div style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: '#f8fafc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 8
                          }}>
                            <span style={{ fontSize: 16, color: '#94a3b8' }}>❓</span>
                          </div>
                          <p style={{ fontSize: 12, fontWeight: 700, color: '#64748b', margin: '0 0 2px 0' }}>대표 관심사 키워드 미수립</p>
                          <p style={{ fontSize: 10, color: '#94a3b8', margin: 0, lineHeight: 1.3 }}>
                            최근 1개월 내 상담 내역이 없거나<br />
                            AI 분석 특징 정보가 존재하지 않습니다.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* 방문 주기 그래프 (높이 220px 맞춤 및 차트 축소) */}
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8, height: 220, boxSizing: 'border-box' }}>
                      <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>방문 주기 그래프</h3>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: 8 }}>
                        <div style={{ background: '#e0e7ff', borderRadius: 12, padding: '6px 8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 48 }}>
                          <span style={{ fontSize: 10, color: '#475569', fontWeight: 600 }}>총 방문</span>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline' }}>
                            <span style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{details.visitData.totalVisits}</span>
                            <span style={{ fontSize: 9, color: '#64748b', fontWeight: 600, marginLeft: 2 }}>회</span>
                          </div>
                        </div>
                        <div style={{ background: '#e0e7ff', borderRadius: 12, padding: '6px 8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 48 }}>
                          <span style={{ fontSize: 10, color: '#475569', fontWeight: 600 }}>평균 주기</span>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline' }}>
                            <span style={{ fontSize: 18, fontWeight: 700, color: '#5c5ced', lineHeight: 1 }}>{details.visitData.averageInterval}</span>
                            <span style={{ fontSize: 9, color: '#64748b', fontWeight: 600, marginLeft: 2 }}>일</span>
                          </div>
                        </div>
                        <div style={{ background: '#e0e7ff', borderRadius: 12, padding: '6px 8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 48 }}>
                          <span style={{ fontSize: 10, color: '#475569', fontWeight: 600 }}>마지막 방문</span>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline' }}>
                            <span style={{ fontSize: 18, fontWeight: 700, color: '#14b8a6', lineHeight: 1 }}>
                              {details.visitData.lastVisitDiff === "-" || details.visitData.lastVisitDiff === "오늘" ? "" : "+"}
                              {details.visitData.lastVisitDiff}
                            </span>
                            <span style={{ fontSize: 9, color: '#64748b', fontWeight: 600, marginLeft: 2 }}>
                              {details.visitData.lastVisitDiff === "-" || details.visitData.lastVisitDiff === "오늘" ? "" : "일"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '8px 0 4px 0', border: '1px solid #e2e8f0', borderRadius: 12, background: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 56, padding: '0 12px', position: 'relative' }}>
                          <div style={{ position: 'absolute', left: 10, right: 10, bottom: 0, height: 2, backgroundColor: '#cbd5e1' }} />

                          {details.visitData.monthlyVisits.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '10%', position: 'relative', height: '100%', justifyContent: 'flex-end' }}>
                              {item.visited ? (
                                <div
                                  style={{
                                    width: 12,
                                    height: (item.height ? item.height * 0.4 : 40),
                                    backgroundColor: '#5c5ced',
                                    borderRadius: 4,
                                    marginBottom: -1,
                                    zIndex: 2,
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: 10,
                                    height: 4,
                                    backgroundColor: '#cbd5e1',
                                    borderRadius: 2,
                                    marginBottom: 2,
                                    zIndex: 2
                                  }}
                                />
                              )}
                            </div>
                          ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px 0 12px' }}>
                          {details.visitData.monthlyVisits.map((item, idx) => (
                            <div key={idx} style={{ width: '10%', display: 'flex', justifyContent: 'center' }}>
                              <span style={{ fontSize: 9, color: '#64748b', fontWeight: 600 }}>{item.month.replace("월", "")}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', textAlign: 'center', flex: 1 }}>
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <UserCircle size={48} color="#0284c7" strokeWidth={1.5} />
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>고객 상세 정보</h2>
              <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 40, whiteSpace: 'pre-wrap', color: '#94a3b8' }}>
                왼쪽 목록에서 고객을 선택하면{"\n"}상세 정보를 확인할 수 있어요.
              </p>
              <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>고객 이름을 클릭해 프로필, 대시보드, 브리핑을 확인하세요</p>
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

        {/* AI 상품 추천 판단 근거 상세 팝업 모달 */}
        {selectedProductModal && (
          <div
            className="cust-modal-overlay"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(4px)'
            }}
            onClick={() => setSelectedProductModal(null)}
          >
            <div
              className="cust-modal"
              style={{
                width: 440,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                background: 'white',
                borderRadius: 16,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                border: '1px solid #e2e8f0'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                    color: 'white',
                    fontSize: 9,
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 6,
                    letterSpacing: '0.5px'
                  }}>AI 제언 상세</span>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {selectedProductModal.productName}
                  </h3>
                </div>
                <div
                  style={{
                    padding: '2px 8px',
                    background: selectedProductModal.statusColor || '#ef4444',
                    color: 'white',
                    borderRadius: 4,
                    fontWeight: 700,
                    fontSize: 10
                  }}
                >
                  {selectedProductModal.status}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>상품 설명</span>
                  <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.5, margin: 0 }}>
                    {selectedProductModal.productDesc}
                  </p>
                </div>

                <div style={{
                  padding: '12px 14px',
                  background: 'linear-gradient(135deg, rgba(245, 243, 255, 0.6) 0%, rgba(238, 242, 255, 0.4) 100%)',
                  borderLeft: '4px solid #8b5cf6',
                  borderRadius: '0 8px 8px 0',
                  marginTop: 8
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                    <span style={{ fontSize: 9, color: '#8b5cf6', fontWeight: 800, letterSpacing: '0.5px' }}>AI RECOMMENDATION REASON</span>
                  </div>
                  <p style={{ fontSize: 12, color: '#1e1b4b', lineHeight: 1.6, margin: 0, fontWeight: 600 }}>
                    {selectedProductModal.matchingDesc}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedProductModal(null)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#0f172a',
                  color: 'white',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.1)'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#1e293b'}
                onMouseOut={(e) => e.currentTarget.style.background = '#0f172a'}
              >
                닫기
              </button>
            </div>
          </div>
        )}

        <CustomerRegistrationModal
          isOpen={isModalOpen || !!editModalData}
          onClose={() => { setIsModalOpen(false); setEditModalData(null); }}
          initialData={editModalData}
          onSave={handleSaveCustomer}
        />

        {/* 메모 기반 고객 특징 목록 상세 팝업 모달 */}
        {isFeatureModalOpen && selectedCustomer && (
          <div
            className="cust-modal-overlay"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: 'blur(6px)'
            }}
            onClick={() => setIsFeatureModalOpen(false)}
          >
            <div
              className="cust-modal"
              style={{
                width: 520,
                maxHeight: '80vh',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                background: 'white',
                borderRadius: 16,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                border: '1px solid #e2e8f0'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    color: 'white',
                    fontSize: 9,
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 6,
                    letterSpacing: '0.5px'
                  }}>AI 분석</span>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {selectedCustomer.name} 고객 특징 상세 목록
                  </h3>
                </div>
                <button
                  onClick={() => setIsFeatureModalOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#0f172a'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}
                >
                  ✕
                </button>
              </div>

              {/* 카테고리 필터 탭 */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                {["전체", "관계", "성향", "상품", "기호", "건강", "기타"].map((tab) => {
                  const isActive = featureSubTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setFeatureSubTab(tab)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: isActive ? '#0284c7' : 'white',
                        color: isActive ? 'white' : '#4b5563',
                        border: isActive ? '1px solid #0284c7' : '1px solid #cbd5e1',
                        boxShadow: isActive ? '0 2px 4px rgba(2, 132, 199, 0.15)' : 'none',
                      }}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              {/* 특징 상세 메모 목록 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', paddingRight: 4, flex: 1, minHeight: 200 }}>
                {details?.features
                  ?.filter(item => featureSubTab === "전체" || item.category === featureSubTab)
                  ?.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: 10,
                        padding: '10px 14px',
                        gap: 12,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.01)'
                      }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 22,
                          borderRadius: 4,
                          background: item.color || '#64748b',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          fontWeight: 700
                        }}
                      >
                        {item.category}
                      </div>
                      <span style={{ fontSize: 12, color: '#0f172a', fontWeight: 600, flex: 1 }}>
                        {item.text}
                      </span>
                      <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>
                        {item.date}
                      </span>
                    </div>
                  ))}
                {(details?.features || []).filter(item => featureSubTab === "전체" || item.category === featureSubTab).length === 0 && (
                  <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8', fontSize: 12, fontWeight: 500 }}>
                    해당 카테고리의 특징 메모가 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
