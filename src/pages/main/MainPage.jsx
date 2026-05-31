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
  Info,
  X
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
    showToast,
    personalKpi, 
    branchKpi,
    fetchKpiData,
    fetchCalendarData
  } = useCalendar();

  const handleSelectAiTodo = async (todo) => {
    try {
      const currentUser = api.auth.getCurrentUser();
      const u_id = currentUser ? currentUser.id : null;
      if (!u_id) return;

      const yyyy = selectedDate.getFullYear();
      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const dd = String(selectedDate.getDate()).padStart(2, '0');
      const targetDateStr = `${yyyy}-${mm}-${dd}`;

      // Check for overlap first
      let todoStart = new Date(todo.executionDate);
      if (targetDateStr) {
        let timePart = "10:00:00";
        if (todo.executionDate && todo.executionDate.includes('T')) {
          timePart = todo.executionDate.split('T')[1].substring(0, 8);
        } else if (todo.executionDate && todo.executionDate.includes(' ')) {
          timePart = todo.executionDate.split(' ')[1].substring(0, 8);
        } else {
          const parsed = new Date(todo.executionDate);
          if (!isNaN(parsed.getTime())) {
            timePart = String(parsed.getHours()).padStart(2, '0') + ':' + String(parsed.getMinutes()).padStart(2, '0') + ':00';
          }
        }
        todoStart = new Date(`${targetDateStr}T${timePart}`);
      }

      const durationMs = todo.category === '안부 연락 제안' ? 15 * 60 * 1000 : 60 * 60 * 1000;
      const todoEnd = new Date(todoStart.getTime() + durationMs);

      const isOverlapping = events.some(e => {
        const eStart = new Date(e.startTime.replace(' ', 'T'));
        const eEnd = new Date(e.endTime.replace(' ', 'T'));
        return todoStart < eEnd && todoEnd > eStart;
      });

      if (isOverlapping) {
        if (showToast) {
          showToast(`추천 일정 '${todo.content}'의 시간대에 이미 다른 일정이 존재합니다.`);
        } else {
          alert(`추천 일정 '${todo.content}'의 시간대에 이미 다른 일정이 존재합니다. 중복 등록할 수 없습니다.`);
        }
        return;
      }

      await api.aiTodo.confirm(u_id, [todo.id], targetDateStr);
      await fetchKpiData();
      if (fetchCalendarData) {
        await fetchCalendarData();
      }
      if (showToast) {
        showToast(`My To Do에 '${todo.content}' 일정이 바로 등록되었습니다!`);
      } else {
        alert(`My To Do에 '${todo.content}' 일정이 바로 등록되었습니다!`);
      }
    } catch (error) {
      console.error("AI To Do 일정 등록 실패:", error);
      if (showToast) {
        showToast("일정 등록에 실패했습니다.");
      } else {
        alert("일정 등록에 실패했습니다.");
      }
    }
  };

  // State for expanded customer AI insights
  const [expandedCustomerId, setExpandedCustomerId] = useState(null);
  const [expandedCustomerDetails, setExpandedCustomerDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleCustomerCardClick = async (customerId) => {
    if (expandedCustomerId === customerId) {
      setExpandedCustomerId(null);
      setExpandedCustomerDetails(null);
      return;
    }
    
    setExpandedCustomerId(customerId);
    setLoadingDetails(true);
    setExpandedCustomerDetails(null);
    
    try {
      const [detail, risk, features, productMatch, stats] = await Promise.all([
        api.customer.getDetail(customerId),
        api.customer.getChurnRisk(customerId).catch(() => null),
        api.customer.getFeatures(customerId).catch(() => null),
        api.customer.getProductMatch(customerId).catch(() => null),
        api.customer.getVisitStats(customerId).catch(() => null),
      ]);
      
      setExpandedCustomerDetails({
        detail,
        risk,
        features: features?.features || [],
        productMatch: productMatch?.items || [],
        stats
      });
    } catch (error) {
      console.error("Failed to load customer AI insights:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

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



        {/* 3. Combined Bottom Layout Grid (To-Do & Trend & Notifications) */}
        <div className="bottom-dashboard-grid">
          
          {/* Column A: Combined AI & My To Do List */}
          <div className="bottom-card todo-combined-card">
            <div className="bottom-card-header">
              <div className="header-icon-title">
                <CheckCircle2 size={20} className="header-icon primary-color" />
                <h2 className="bottom-card-title">오늘의 To-Do & AI 추천 액션</h2>
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
                            className="todo-checkbox-pill"
                            onClick={() => handleSelectAiTodo(todo)}
                            title="My To Do 등록"
                          >
                            선택
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

          {/* Right Column Stack: Key Customers on Top, Notifications below */}
          <div className="bottom-dashboard-right-stack" style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
            {/* 주요 고객 관리 Card */}
            <div className="bottom-card key-customers-section" style={{ padding: '14px 18px' }}>
              <div className="bottom-card-header" style={{ marginBottom: 10, borderBottom: '1px solid var(--main-border)', paddingBottom: 6 }}>
                <div className="header-icon-title">
                  <Users size={16} className="header-icon primary-color" style={{ color: '#0ea5e9' }} />
                  <h2 className="bottom-card-title">주요 고객 관리</h2>
                </div>
              </div>
              <div className="key-customers-bar" style={{ width: '100%' }}>
                {loadingCustomers ? (
                  <div className="customers-loading" style={{ fontSize: 11 }}>고객 분석을 로드하는 중입니다...</div>
                ) : (todayVisitors.length === 0 && churnRiskCustomers.length === 0) ? (
                  <div className="customers-empty" style={{ fontSize: 11 }}>분석된 주요 고객이 현재 존재하지 않습니다.</div>
                ) : (
                  <div className="customers-scroll-container" style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
                    {/* 1. Today Visitors */}
                    {todayVisitors.map(c => (
                      <div 
                        key={`visitor-${c.id}`} 
                        className={`customer-profile-card today-visitor ${expandedCustomerId === c.id ? 'active-glow' : ''}`}
                        onClick={() => handleCustomerCardClick(c.id)}
                        title="고객 AI 인사이트 보기"
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

                    {/* 2. Churn Risk Predictions */}
                    {churnRiskCustomers.map(c => (
                      <div 
                        key={`churn-${c.id}`} 
                        className={`customer-profile-card churn-risk ${expandedCustomerId === c.id ? 'active-glow' : ''}`}
                        onClick={() => handleCustomerCardClick(c.id)}
                        title="고객 AI 인사이트 보기"
                      >
                        <div className="profile-avatar-wrap red-bg">
                          <span className="avatar-initial">{c.initial}</span>
                          <span className="risk-level-badge">✨ {c.grade}</span>
                        </div>
                        <div className="profile-details">
                          <span className="profile-name">{c.name}</span>
                          <span className="profile-subtext text-danger" style={{ fontWeight: 700 }}>🔮 AI 예측: {c.grade}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Expanded Customer AI Insights Section */}
              {expandedCustomerId && (
                <div className="ai-customer-insights-panel">
                  {loadingDetails ? (
                    <div className="ai-insights-loading">
                      <Sparkles className="loading-icon-spark animate-pulse" size={20} style={{ color: '#8b5cf6' }} />
                      <span>AI 분석 엔진에서 실시간 고객 인사이트를 도출하고 있습니다...</span>
                    </div>
                  ) : expandedCustomerDetails ? (
                    <>
                      <div className="ai-insights-header">
                        <div className="ai-insights-user-info">
                          <div className="avatar-small blue-bg">
                            {expandedCustomerDetails.detail?.name?.charAt(0) || "고"}
                          </div>
                          <div className="user-text">
                            <span className="user-name">{expandedCustomerDetails.detail?.name} 고객님</span>
                            <span className="user-badges">
                              <span className="badge-item vip">{expandedCustomerDetails.detail?.grade || "VIP"}</span>
                              <span className="badge-item tendency">{expandedCustomerDetails.detail?.tendency || "위험중립형"}</span>
                              <span className="badge-item job">{expandedCustomerDetails.detail?.job || "CEO"}</span>
                            </span>
                          </div>
                        </div>
                        <div className="ai-insights-actions">
                          <button 
                            className="btn-profile-go" 
                            onClick={() => handleCustomerClick(expandedCustomerId)}
                          >
                            상세 프로필 <ArrowRight size={12} />
                          </button>
                          <button 
                            className="btn-close-insights"
                            onClick={() => {
                              setExpandedCustomerId(null);
                              setExpandedCustomerDetails(null);
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="ai-insights-grid">
                        {/* Churn Risk Section */}
                        <div className="ai-insight-box churn-box">
                          <div className="box-title-wrap">
                            <Sparkles size={12} className="sparkle-purple" />
                            <h4>🔮 AI 이탈 위험 예측</h4>
                            <span className={`risk-grade-badge grade-${expandedCustomerDetails.risk?.grade || '양호'}`}>
                              {expandedCustomerDetails.risk?.grade || '양호'}
                            </span>
                          </div>
                          <p className="box-desc">
                            {expandedCustomerDetails.risk?.reason || '최근 이탈 관련 이상 징후가 발견되지 않은 양호한 상태입니다.'}
                          </p>
                        </div>

                        {/* Product Matching Section */}
                        <div className="ai-insight-box product-box">
                          <div className="box-title-wrap">
                            <Sparkles size={12} className="sparkle-purple" />
                            <h4>✨ AI 추천 상품 & 매칭 사유</h4>
                          </div>
                          <div className="product-match-list">
                            {expandedCustomerDetails.productMatch && expandedCustomerDetails.productMatch.length > 0 ? (
                              expandedCustomerDetails.productMatch.slice(0, 2).map((item, idx) => (
                                <div key={idx} className="product-match-item">
                                  <div className="product-item-header">
                                    <span className="product-name">{item.product_name}</span>
                                    <span className={`product-status status-${item.is_owned ? 'owned' : 'suitable'}`}>
                                      {item.is_owned ? '보유중' : '추천'}
                                    </span>
                                  </div>
                                  <p className="product-reason">{item.reason}</p>
                                </div>
                              ))
                            ) : (
                              <div className="empty-insights">추천된 AI 맞춤 상품 데이터가 없습니다.</div>
                            )}
                          </div>
                        </div>

                        {/* AI Semantic tags */}
                        <div className="ai-insight-box features-box">
                          <div className="box-title-wrap">
                            <Sparkles size={12} className="sparkle-purple" />
                            <h4>🏷️ AI 메모 요약 핵심 특징</h4>
                          </div>
                          <div className="features-tags-list">
                            {expandedCustomerDetails.features && expandedCustomerDetails.features.length > 0 ? (
                              expandedCustomerDetails.features.slice(0, 6).map((feat, idx) => (
                                <span key={idx} className={`feature-tag-item category-${feat.category}`}>
                                  #{feat.name}
                                </span>
                              ))
                            ) : (
                              <div className="empty-insights">추출된 AI 고객 특징 키워드가 없습니다.</div>
                            )}
                          </div>
                        </div>

                        {/* Asset allocation diagnostics */}
                        <div className="ai-insight-box assets-box">
                          <div className="box-title-wrap">
                            <Sparkles size={12} className="sparkle-purple" />
                            <h4>📊 자산 포트폴리오 AI 진단</h4>
                          </div>
                          <div className="assets-summary">
                            <div className="assets-total-val">
                              <span>총 순자산:</span>
                              <strong className="text-primary-color">
                                {expandedCustomerDetails.detail?.net_worth ? `${(expandedCustomerDetails.detail.net_worth / 100000000).toFixed(1)}억원` : '자료 없음'}
                              </strong>
                            </div>
                            <p className="assets-insight-text">
                              {expandedCustomerDetails.detail?.llm_insight || '안정적인 포트폴리오를 구성하고 있습니다.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="ai-insights-error">데이터를 불러오는 중 오류가 발생했습니다.</div>
                  )}
                </div>
              )}
            </div>

            {/* iPhone-Style Notification Feed Card */}
            <div className="bottom-card ios-notifications-card" style={{ flex: 1, minHeight: 0 }}>
              <div className="bottom-card-header">
                <div className="header-icon-title">
                  <Bell size={20} className="header-icon notification-color" />
                  <h2 className="bottom-card-title">실시간 알림 피드</h2>
                </div>
              </div>

              <div className="ios-notifications-list" style={{ overflowY: 'auto', flex: 1 }}>
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
    </div>
  );
}
