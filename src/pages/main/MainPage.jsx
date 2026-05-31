import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Users, 
  Bell, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  User, 
  FileText, 
  ClipboardList, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  Landmark, 
  Coins,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Info
} from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import { api } from "../../api";
import { useCalendar } from "../calendar/CalendarContext";
import "./MainPage.css";

export default function MainPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Reuse KPI states, AI Todo actions, etc., from CalendarContext
  const { 
    events, 
    selectedDate, 
    setSelectedDate, 
    aiTodos, 
    toggleAiTodo, 
    transferCheckedAiTodos, 
    revertAiTodo, 
    toast, 
    personalKpi, 
    branchKpi,
    fetchKpiData
  } = useCalendar();

  const [todayVisitors, setTodayVisitors] = useState([]);
  const [churnRiskCustomers, setChurnRiskCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [trendData, setTrendData] = useState(null);
  const [loadingTrend, setLoadingTrend] = useState(true);

  const currentUser = (() => {
    try {
      const userStr = localStorage.getItem("currentUser");
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  })();

  // Fetch KPI and setup
  useEffect(() => {
    if (fetchKpiData) {
      fetchKpiData();
    }
  }, []);

  // Fetch Customers & Churn Risks
  useEffect(() => {
    const fetchCustomersAndRisks = async () => {
      try {
        setLoadingCustomers(true);
        // 1. Fetch today's visitors
        const todayResponse = await api.customer.getList("today");
        const colors = ["pink", "purple", "red", "green", "blue", "yellow", "gray"];
        const mappedToday = todayResponse.map(c => ({
          id: c.c_id,
          name: c.name,
          email: c.email || `${c.c_id}@poom.com`,
          phone: c.phone || "010-0000-0000",
          initial: c.name ? c.name[0] : "고",
          color: "blue-bg" // Blue background for today's visitors
        }));
        setTodayVisitors(mappedToday);

        // 2. Fetch all customers and get churn risks in parallel
        const allResponse = await api.customer.getList("all");
        const risksPromises = allResponse.map(async (c) => {
          try {
            const riskData = await api.customer.getChurnRisk(c.c_id);
            return { customer: c, risk: riskData };
          } catch (e) {
            return { customer: c, risk: null };
          }
        });
        const risksResults = await Promise.all(risksPromises);
        
        // Filter those with Churn risk: "위험" or "주의"
        const highRisks = risksResults
          .filter(item => item.risk && (item.risk.grade === "위험" || item.risk.grade === "주의"))
          .map(item => ({
            id: item.customer.c_id,
            name: item.customer.name,
            grade: item.risk.grade,
            reason: item.risk.reason,
            initial: item.customer.name ? item.customer.name[0] : "고",
            color: "red-bg" // Red background for churn risk predictions
          }));
        
        setChurnRiskCustomers(highRisks);
      } catch (e) {
        console.error("Failed to load customer list or risks:", e);
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchCustomersAndRisks();
  }, []);

  // Fetch Notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoadingNotifications(true);
        const data = await api.notification.getList("all");
        setNotifications(data.slice(0, 5)); // Show top 5 most recent
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoadingNotifications(false);
      }
    };
    fetchNotifications();
  }, []);

  // Fetch Trend Dashboard
  useEffect(() => {
    const fetchTrend = async () => {
      try {
        setLoadingTrend(true);
        const data = await api.trend.getDashboard();
        setTrendData(data);
      } catch (e) {
        console.error("Failed to fetch trend dashboard:", e);
      } finally {
        setLoadingTrend(false);
      }
    };
    fetchTrend();
  }, []);

  // Retrieve My To Dos (filtered by selectedDate)
  const getTodayEvents = () => {
    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dd = String(selectedDate.getDate()).padStart(2, '0');
    const targetDateStr = `${yyyy}-${mm}-${dd}`;
    return events
      .filter(e => e.startTime.startsWith(targetDateStr))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const todayEvents = getTodayEvents();

  // Merge AI & My To Do lists and sort chronologically for a "daily calendar" view
  const getMergedTimeline = () => {
    const list = [];
    
    // Add My To Dos
    todayEvents.forEach(e => {
      const timePart = e.startTime.split(' ')[1] || '09:00';
      list.push({
        id: `my-${e.id}`,
        type: 'my',
        time: timePart,
        timeLabel: timePart,
        data: e
      });
    });

    // Add AI To Dos
    aiTodos.forEach(todo => {
      const timePart = todo.time.split(' - ')[0] || '10:00';
      list.push({
        id: `ai-${todo.id}`,
        type: 'ai',
        time: timePart,
        timeLabel: todo.time,
        data: todo
      });
    });

    // Sort chronologically by start time
    return list.sort((a, b) => a.time.localeCompare(b.time));
  };

  const mergedTimeline = getMergedTimeline();

  // Navigate to customer details with auto-selection
  const handleCustomerClick = (customerId) => {
    localStorage.setItem("poom_selected_customer_id", customerId.toString());
    navigate("/customer-management-registration-1");
  };

  // Notification category badge translator
  const getNotificationCategoryLabel = (category) => {
    switch (category) {
      case "danger": return "이탈위험";
      case "warning": return "예금만기";
      case "success": return "일정알림";
      default: return "알림";
    }
  };

  return (
    <div className="main-layout">
      {/* Sidebar */}
      <Sidebar type="cal" />

      {/* Main Dashboard Content */}
      <div className="main-content">
        <header className="main-header">
          <div className="header-info">
            <h1 className="header-title">Main Dashboard</h1>
            <p className="header-subtitle">Welcome back, {currentUser?.name || "김재욱"} PB</p>
          </div>
          <div className="header-date">
            <span className="current-date-tag">
              {selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}
            </span>
          </div>
        </header>

        {/* 1. Full-Width KPI Dashboard Section */}
        <section className="kpi-dashboard-section">
          <div className="kpi-card personal-kpi">
            <div className="kpi-card-header">
              <div className="kpi-title-korean">개인 KPI</div>
              <div className="kpi-subtitle-korean">{personalKpi?.name || currentUser?.name || "김재욱"} PB</div>
            </div>
            <div className="kpi-stats-grid">
              {/* Customer Count */}
              <div className="kpi-stat-item">
                <div className="kpi-stat-label-wrap">
                  <div className="kpi-icon-container">
                    <User size={14} className="kpi-icon" />
                  </div>
                  <span className="kpi-label-text">관리 고객 수</span>
                </div>
                <div className="kpi-stat-value">
                  {personalKpi?.customer_count || 0}<span className="kpi-unit">명</span>
                </div>
                <div className="kpi-progress-bar-container">
                  <div className="kpi-progress-bar-fill" style={{ width: `${Math.min(100, Math.max(0, personalKpi?.customer_rate || 0))}%` }}></div>
                </div>
                <div className="kpi-progress-labels">
                  <span className="kpi-progress-pct">{personalKpi?.customer_rate || 0}%</span>
                  <span className="kpi-progress-target">목표 {personalKpi?.customer_goal || 0}명</span>
                </div>
                <div className={`kpi-trend ${personalKpi?.customer_delta >= 0 ? "green" : "red"}`}>
                  <span className="kpi-trend-arrow">{personalKpi?.customer_delta >= 0 ? "▲" : "▼"}</span> 
                  전월 대비 {personalKpi?.customer_delta >= 0 ? "+" : ""}{personalKpi?.customer_delta || 0}%
                </div>
              </div>

              {/* AUM */}
              <div className="kpi-stat-item">
                <div className="kpi-stat-label-wrap">
                  <div className="kpi-icon-container">
                    <Landmark size={14} className="kpi-icon" />
                  </div>
                  <span className="kpi-label-text">자산 (AUM)</span>
                </div>
                <div className="kpi-stat-value">
                  {personalKpi?.aum || 0}<span className="kpi-unit">억원</span>
                </div>
                <div className="kpi-progress-bar-container">
                  <div className="kpi-progress-bar-fill" style={{ width: `${Math.min(100, Math.max(0, personalKpi?.aum_rate || 0))}%` }}></div>
                </div>
                <div className="kpi-progress-labels">
                  <span className="kpi-progress-pct">{personalKpi?.aum_rate || 0}%</span>
                  <span className="kpi-progress-target">목표 {personalKpi?.aum_goal || 0}억</span>
                </div>
                <div className={`kpi-trend ${personalKpi?.aum_delta >= 0 ? "green" : "red"}`}>
                  <span className="kpi-trend-arrow">{personalKpi?.aum_delta >= 0 ? "▲" : "▼"}</span> 
                  전월 대비 {personalKpi?.aum_delta >= 0 ? "+" : ""}{personalKpi?.aum_delta || 0}%
                </div>
              </div>

              {/* Non-interest profits */}
              <div className="kpi-stat-item">
                <div className="kpi-stat-label-wrap">
                  <div className="kpi-icon-container">
                    <Coins size={14} className="kpi-icon" />
                  </div>
                  <span className="kpi-label-text">비이자 이익</span>
                </div>
                <div className="kpi-stat-value">
                  {(personalKpi?.non_interest || 0).toLocaleString()}<span className="kpi-unit">만원</span>
                </div>
                <div className="kpi-progress-bar-container">
                  <div className="kpi-progress-bar-fill" style={{ width: `${Math.min(100, Math.max(0, personalKpi?.non_interest_rate || 0))}%` }}></div>
                </div>
                <div className="kpi-progress-labels">
                  <span className="kpi-progress-pct">{personalKpi?.non_interest_rate || 0}%</span>
                  <span className="kpi-progress-target">목표 {(personalKpi?.non_interest_goal || 0).toLocaleString()}만</span>
                </div>
                <div className={`kpi-trend ${personalKpi?.non_interest_delta >= 0 ? "green" : "red"}`}>
                  <span className="kpi-trend-arrow">{personalKpi?.non_interest_delta >= 0 ? "▲" : "▼"}</span> 
                  전월 대비 {personalKpi?.non_interest_delta >= 0 ? "+" : ""}{personalKpi?.non_interest_delta || 0}%
                </div>
              </div>
            </div>
          </div>

          <div className="kpi-card branch-kpi">
            <div className="kpi-card-header">
              <div className="kpi-title-korean">지점 KPI</div>
              <div className="kpi-subtitle-korean">{branchKpi?.branch_name || "여의도지점"}</div>
            </div>
            <div className="kpi-stats-grid">
              {/* Customer Count */}
              <div className="kpi-stat-item">
                <div className="kpi-stat-label-wrap">
                  <div className="kpi-icon-container">
                    <User size={14} className="kpi-icon" />
                  </div>
                  <span className="kpi-label-text">지점 고객 수</span>
                </div>
                <div className="kpi-stat-value">
                  {(branchKpi?.customer_count || 0).toLocaleString()}<span className="kpi-unit">명</span>
                </div>
                <div className="kpi-progress-bar-container">
                  <div className="kpi-progress-bar-fill" style={{ width: `${Math.min(100, Math.max(0, branchKpi?.customer_rate || 0))}%` }}></div>
                </div>
                <div className="kpi-progress-labels">
                  <span className="kpi-progress-pct">{branchKpi?.customer_rate || 0}%</span>
                  <span className="kpi-progress-target">목표 {(branchKpi?.customer_goal || 0).toLocaleString()}명</span>
                </div>
                <div className={`kpi-trend ${branchKpi?.customer_delta >= 0 ? "green" : "red"}`}>
                  <span className="kpi-trend-arrow">{branchKpi?.customer_delta >= 0 ? "▲" : "▼"}</span> 
                  전월 대비 {branchKpi?.customer_delta >= 0 ? "+" : ""}{branchKpi?.customer_delta || 0}%
                </div>
              </div>

              {/* AUM */}
              <div className="kpi-stat-item">
                <div className="kpi-stat-label-wrap">
                  <div className="kpi-icon-container">
                    <Landmark size={14} className="kpi-icon" />
                  </div>
                  <span className="kpi-label-text">지점 자산 (AUM)</span>
                </div>
                <div className="kpi-stat-value">
                  {(branchKpi?.aum || 0).toLocaleString()}<span className="kpi-unit">억원</span>
                </div>
                <div className="kpi-progress-bar-container">
                  <div className="kpi-progress-bar-fill" style={{ width: `${Math.min(100, Math.max(0, branchKpi?.aum_rate || 0))}%` }}></div>
                </div>
                <div className="kpi-progress-labels">
                  <span className="kpi-progress-pct">{branchKpi?.aum_rate || 0}%</span>
                  <span className="kpi-progress-target">목표 {(branchKpi?.aum_goal || 0).toLocaleString()}억</span>
                </div>
                <div className={`kpi-trend ${branchKpi?.aum_delta >= 0 ? "green" : "red"}`}>
                  <span className="kpi-trend-arrow">{branchKpi?.aum_delta >= 0 ? "▲" : "▼"}</span> 
                  전월 대비 {branchKpi?.aum_delta >= 0 ? "+" : ""}{branchKpi?.aum_delta || 0}%
                </div>
              </div>

              {/* Non-interest profits */}
              <div className="kpi-stat-item">
                <div className="kpi-stat-label-wrap">
                  <div className="kpi-icon-container">
                    <Coins size={14} className="kpi-icon" />
                  </div>
                  <span className="kpi-label-text">지점 비이자 이익</span>
                </div>
                <div className="kpi-stat-value">
                  {(branchKpi?.non_interest || 0).toLocaleString()}<span className="kpi-unit">만원</span>
                </div>
                <div className="kpi-progress-bar-container">
                  <div className="kpi-progress-bar-fill" style={{ width: `${Math.min(100, Math.max(0, branchKpi?.non_interest_rate || 0))}%` }}></div>
                </div>
                <div className="kpi-progress-labels">
                  <span className="kpi-progress-pct">{branchKpi?.non_interest_rate || 0}%</span>
                  <span className="kpi-progress-target">목표 {(branchKpi?.non_interest_goal || 0).toLocaleString()}만</span>
                </div>
                <div className={`kpi-trend ${branchKpi?.non_interest_delta >= 0 ? "green" : "red"}`}>
                  <span className="kpi-trend-arrow">{branchKpi?.non_interest_delta >= 0 ? "▲" : "▼"}</span> 
                  전월 대비 {branchKpi?.non_interest_delta >= 0 ? "+" : ""}{branchKpi?.non_interest_delta || 0}%
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Full-Width Horizontal Key Customers Section */}
        <section className="key-customers-section">
          <div className="section-title-wrap">
            <h2 className="section-title">주요 고객 관리</h2>
            <span className="section-title-desc">오늘 방문 예정 고객과 위험 예측 대상 고객을 신속히 파악해 보세요.</span>
          </div>

          <div className="key-customers-bar">
            {loadingCustomers ? (
              <div className="customers-loading">고객 분석을 로드하는 중입니다...</div>
            ) : (todayVisitors.length === 0 && churnRiskCustomers.length === 0) ? (
              <div className="customers-empty">분석된 주요 고객이 현재 존재하지 않습니다.</div>
            ) : (
              <div className="customers-scroll-container">
                {/* 1. Today Visitors (Blue backgrounds) */}
                {todayVisitors.map(c => (
                  <div 
                    key={`visitor-${c.id}`} 
                    className="customer-profile-card today-visitor"
                    onClick={() => handleCustomerClick(c.id)}
                    title="고객 정보 바로가기"
                  >
                    <div className="profile-avatar-wrap blue-bg">
                      <span className="avatar-initial">{c.initial}</span>
                      <span className="visitor-badge">오늘 방문</span>
                    </div>
                    <div className="profile-details">
                      <span className="profile-name">{c.name}</span>
                      <span className="profile-subtext">오늘 방문 예정</span>
                    </div>
                  </div>
                ))}

                {/* 2. Churn Risk Predictions (Red backgrounds) */}
                {churnRiskCustomers.map(c => (
                  <div 
                    key={`churn-${c.id}`} 
                    className="customer-profile-card churn-risk"
                    onClick={() => handleCustomerClick(c.id)}
                    title="고객 정보 바로가기"
                  >
                    <div className="profile-avatar-wrap red-bg">
                      <span className="avatar-initial">{c.initial}</span>
                      <span className="risk-level-badge">{c.grade}</span>
                    </div>
                    <div className="profile-details">
                      <span className="profile-name">{c.name}</span>
                      <span className="profile-subtext text-danger">이탈 {c.grade}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 3. Combined Bottom Layout Grid (To-Do & Trend & Notifications) */}
        <div className="bottom-dashboard-grid">
          
          {/* Column A: Combined AI & My To Do List */}
          <div className="bottom-card todo-combined-card">
            <div className="bottom-card-header">
              <div className="header-icon-title">
                <CheckCircle2 size={20} className="header-icon primary-color" />
                <h2 className="bottom-card-title">오늘의 To-Do & AI 추천 액션</h2>
              </div>
              <div className="header-actions">
                <button 
                  className="kpi-register-btn"
                  onClick={() => transferCheckedAiTodos(selectedDate)}
                  title="선택된 AI 추천 항목들을 나의 일정(My To Do)으로 신속히 등록합니다"
                >
                  <Plus size={14} /> My To Do 등록
                </button>
              </div>
            </div>

            <div className="todo-unified-list daily-timeline-view">
              {/* If no items exist */}
              {mergedTimeline.length === 0 && (
                <div className="todo-empty-state">오늘 진행 예정인 To-Do가 비어 있습니다.</div>
              )}

              {mergedTimeline.map((item, index) => {
                const isLast = index === mergedTimeline.length - 1;
                
                if (item.type === 'my') {
                  const e = item.data;
                  const isAiRecommended = !!e.at_id;
                  return (
                    <div className="timeline-row" key={item.id}>
                      <div className="timeline-left">
                        <span className="timeline-time-badge">{item.time}</span>
                        <div className="timeline-node my-node"></div>
                        {!isLast && <div className="timeline-line"></div>}
                      </div>
                      <div className="timeline-right">
                        <div className="unified-todo-item my-todo-style">
                          <div className="todo-badge-wrap">
                            {e.color === 'pink' && <span className="todo-tag tag-red">이탈위험</span>}
                            {e.color === 'yellow' && <span className="todo-tag tag-yellow">기념일</span>}
                            {e.color === 'blue' && <span className="todo-tag tag-blue">예금만기</span>}
                          </div>
                          <div className="todo-info">
                            <span className="todo-title">{e.title}</span>
                            <span className="todo-memo">{e.memo || '상담 일정 수립 요망'}</span>
                          </div>
                          {isAiRecommended && (
                            <button 
                              className="todo-undo-btn" 
                              onClick={(ev) => { 
                                ev.stopPropagation(); 
                                revertAiTodo(e.id); 
                              }}
                              title="AI 추천 목록으로 되돌리기"
                            >
                              <RotateCcw size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  const todo = item.data;
                  return (
                    <div className="timeline-row" key={item.id}>
                      <div className="timeline-left">
                        <span className="timeline-time-badge">{item.time}</span>
                        <div className="timeline-node ai-node"><Sparkles size={10} /></div>
                        {!isLast && <div className="timeline-line"></div>}
                      </div>
                      <div className="timeline-right">
                        <div className="unified-todo-item ai-todo-style diagonal-stripes">
                          <div className="todo-badge-wrap">
                            <span className={`todo-tag ${todo.tagColor}`}>{todo.tag}</span>
                            <span className="ai-spark-tag"><Sparkles size={11} /> AI 제안</span>
                          </div>
                          <div className="todo-info">
                            <span className="todo-title">{todo.content}</span>
                            <span className="todo-memo text-muted">{todo.subText || 'AI 권장 조치사항'}</span>
                          </div>
                          <div 
                            className={`todo-checkbox-pill ${todo.checked ? 'checked' : ''}`}
                            onClick={() => toggleAiTodo(todo.id)}
                            title="선택하여 My To Do 등록 준비"
                          >
                            {todo.checked ? "✓" : "선택"}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>

            {toast && toast.show && (
              <div className="dashboard-toast">
                <Sparkles size={16} className="toast-spark" />
                <span>{toast.message}</span>
              </div>
            )}
          </div>

          {/* Trend Archive Container */}
          <div className="bottom-card trend-preview-card">
            <div className="bottom-card-header">
              <div className="header-icon-title">
                <TrendingUp size={20} className="header-icon trend-color" />
                <h2 className="bottom-card-title">트렌드 아카이브 요약</h2>
              </div>
              <Link to="/trend-archive" className="arrow-link">
                전체 보기 <ArrowRight size={14} />
              </Link>
            </div>

            <div className="trend-summary-content">
              <p className="summary-paragraph">
                금일 분석 결과, 미국 기준 금리 동결 우려와 함께 안전자산인 <strong>금값 상승 압력(72%)</strong>이 확대되고 있습니다. 
                국내 부동산 시장은 일부 지표 기준 소폭의 우상향 흐름을 이어가고 있어 고액 자산가 대상의 정밀 포트폴리오 상담 편입이 추천됩니다.
              </p>

              <div className="trend-preview-container">
                {loadingTrend ? (
                  <div className="trend-loading">지표 불러오는 중...</div>
                ) : (
                  <div className="trend-indicators-row">
                    <div className="indicator-preview-box">
                      <span className="indicator-label">금값 (Gold)</span>
                      <span className="indicator-value text-red">상승 (72%)</span>
                    </div>
                    <div className="indicator-preview-box">
                      <span className="indicator-label">기준 금리</span>
                      <span className="indicator-value text-muted">동결 (85%)</span>
                    </div>
                    <div className="indicator-preview-box">
                      <span className="indicator-label">부동산 지수</span>
                      <span className="indicator-value text-blue">상승 흐름</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* iPhone-Style Notification Container */}
          <div className="bottom-card ios-notifications-card">
            <div className="bottom-card-header">
              <div className="header-icon-title">
                <Bell size={20} className="header-icon notification-color" />
                <h2 className="bottom-card-title">실시간 알림 피드</h2>
              </div>
            </div>

            <div className="ios-notifications-list">
              {loadingNotifications ? (
                <div className="notifications-loading">알림을 불러오는 중입니다...</div>
              ) : notifications.length === 0 ? (
                <div className="notifications-empty">실시간 확인된 알림이 없습니다.</div>
              ) : (
                <div className="ios-stack">
                  {notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className={`ios-card category-${notif.category}`}
                      onClick={() => navigate("/notifications")}
                      title="알림 모아보기"
                    >
                      <div className="ios-card-header">
                        <div className="ios-card-app">
                          <span className="app-dot"></span>
                          <span className="app-name">{getNotificationCategoryLabel(notif.category)}</span>
                        </div>
                        <span className="ios-card-time">{notif.date || "지금"}</span>
                      </div>
                      <div className="ios-card-body">
                        <h4 className="ios-card-title">{notif.type}</h4>
                        <p className="ios-card-desc">{notif.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
