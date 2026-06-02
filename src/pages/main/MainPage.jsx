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
import { generateMiniCalendar, getWeekDays, formatMonthYear } from "../calendar/calendarUtils";
import ScheduleRegistrationModal from "../calendar/ScheduleRegistrationModal";
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
    allAiTodos,
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

  const [activeKpiTab, setActiveKpiTab] = useState("personal");
  const [todoViewMode, setTodoViewMode] = useState("daily");

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState({ year: selectedDate.getFullYear(), month: selectedDate.getMonth() });

  useEffect(() => {
    setCurrentMonth({ year: selectedDate.getFullYear(), month: selectedDate.getMonth() });
  }, [selectedDate]);

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      let year = prev.year;
      let month = prev.month - 1;
      if (month < 0) {
        month = 11;
        year -= 1;
      }
      return { year, month };
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      let year = prev.year;
      let month = prev.month + 1;
      if (month > 11) {
        month = 0;
        year += 1;
      }
      return { year, month };
    });
  };

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

  // Merge AI & My To Do lists and sort chronologically based on daily/weekly/monthly view mode
  const getMergedTimeline = () => {
    const list = [];
    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dd = String(selectedDate.getDate()).padStart(2, '0');
    const dailyStr = `${yyyy}-${mm}-${dd}`;
    const monthlyPrefix = `${yyyy}-${mm}`;

    // Get weekly boundaries
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setHours(0,0,0,0);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day; // Sunday is index 0
    const startSunday = new Date(startOfWeek.setDate(diff));
    
    const endSaturday = new Date(startSunday);
    endSaturday.setDate(startSunday.getDate() + 6);
    endSaturday.setHours(23,59,59,999);

    let filteredEvents = [];
    let filteredAiTodos = [];

    if (todoViewMode === "daily") {
      filteredEvents = events.filter(e => e.startTime.startsWith(dailyStr));
      filteredAiTodos = allAiTodos.filter(todo => todo.executionDate && todo.executionDate.startsWith(dailyStr));
    } else if (todoViewMode === "weekly") {
      filteredEvents = events.filter(e => {
        const eDate = new Date(e.startTime.replace(" ", "T"));
        return eDate >= startSunday && eDate <= endSaturday;
      });
      filteredAiTodos = allAiTodos.filter(todo => {
        if (!todo.executionDate) return false;
        const todoDate = new Date(todo.executionDate.replace(" ", "T"));
        return todoDate >= startSunday && todoDate <= endSaturday;
      });
    } else if (todoViewMode === "monthly") {
      filteredEvents = events.filter(e => e.startTime.startsWith(monthlyPrefix));
      filteredAiTodos = allAiTodos.filter(todo => todo.executionDate && todo.executionDate.startsWith(monthlyPrefix));
    }

    // Process Events
    filteredEvents.forEach(e => {
      let sortKey = e.startTime;
      let label = sortKey;
      if (todoViewMode === "daily") {
        label = e.startTime.split(' ')[1] || '09:00';
      } else if (todoViewMode === "weekly") {
        const dateObj = new Date(e.startTime.replace(" ", "T"));
        const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
        const dayName = dayNames[dateObj.getDay()];
        const cleanDate = e.startTime.substring(5); // MM-DD HH:MM
        label = `${cleanDate} (${dayName})`;
      } else {
        label = e.startTime.substring(5); // MM-DD HH:MM
      }

      list.push({
        id: `my-${e.id}`,
        type: 'my',
        sortKey: sortKey,
        timeLabel: label,
        data: e
      });
    });

    // Process AI To Dos
    filteredAiTodos.forEach(todo => {
      let sortKey = todo.executionDate || `${dailyStr}T10:00:00`;
      let label = todo.time; // default "10:00 - 11:00"
      if (todoViewMode === "daily") {
        label = todo.time;
      } else {
        const dateObj = new Date(sortKey.replace(" ", "T"));
        const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
        const dayName = dayNames[dateObj.getDay()];
        const mm_dd = String(dateObj.getMonth() + 1).padStart(2, '0') + '-' + String(dateObj.getDate()).padStart(2, '0');
        const startHour = todo.time.split(' - ')[0] || '10:00';
        if (todoViewMode === "weekly") {
          label = `${mm_dd} (${dayName}) ${startHour}`;
        } else {
          label = `${mm_dd} ${startHour}`;
        }
      }

      list.push({
        id: `ai-${todo.id}`,
        type: 'ai',
        sortKey: sortKey,
        timeLabel: label,
        data: todo
      });
    });

    // Sort chronologically by sortKey
    return list.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
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
        
        {/* Unified 50:50 Split Layout Grid */}
        <div className="main-dashboard-split-layout">
          
          {/* Left Column (50%) */}
          <div className="dashboard-column left-column">
            
            {/* 1. KPI Combined Container */}
            <div className="bottom-card kpi-combined-card">
              <div className="bottom-card-header">
                <div className="header-icon-title">
                  <TrendingUp size={20} className="header-icon primary-color" />
                  <h2 className="bottom-card-title">KPI 대시보드</h2>
                </div>
                <div className="kpi-tab-buttons">
                  <button 
                    className={`kpi-tab-btn ${activeKpiTab === 'personal' ? 'active' : ''}`}
                    onClick={() => setActiveKpiTab('personal')}
                  >
                    개인 KPI
                  </button>
                  <button 
                    className={`kpi-tab-btn ${activeKpiTab === 'branch' ? 'active' : ''}`}
                    onClick={() => setActiveKpiTab('branch')}
                  >
                    지점 KPI
                  </button>
                </div>
              </div>

              <div className="kpi-tab-content">
                {activeKpiTab === 'personal' ? (
                  <div className="kpi-inner-panel personal-kpi-inner">
                    <div className="kpi-inner-header">
                      <div className="kpi-subtitle-korean-inner">{personalKpi?.name || currentUser?.name || "김재욱"} PB</div>
                    </div>
                    <div className="kpi-stats-grid-inner">
                      {/* Customer Count */}
                      <div className="kpi-stat-item-inner">
                        <div className="kpi-stat-label-wrap-inner">
                          <User size={12} className="kpi-icon-inner" />
                          <span className="kpi-label-text-inner">관리 고객 수</span>
                        </div>
                        <div className="kpi-stat-value-inner">
                          {personalKpi?.customer_count || 0}<span className="kpi-unit-inner">명</span>
                        </div>
                        <div className="kpi-progress-bar-container-inner">
                          <div className="kpi-progress-bar-fill-inner bg-primary" style={{ width: `${Math.min(100, Math.max(0, personalKpi?.customer_rate || 0))}%` }}></div>
                        </div>
                        <div className="kpi-progress-labels-inner">
                          <span className="kpi-progress-pct-inner">{personalKpi?.customer_rate || 0}%</span>
                          <span className="kpi-progress-target-inner">목표 {personalKpi?.customer_goal || 0}명</span>
                        </div>
                        <div className={`kpi-trend-inner ${personalKpi?.customer_delta >= 0 ? "green" : "red"}`}>
                          <span>{personalKpi?.customer_delta >= 0 ? "▲" : "▼"}</span> 전월비 {personalKpi?.customer_delta >= 0 ? "+" : ""}{personalKpi?.customer_delta || 0}%
                        </div>
                      </div>

                      {/* AUM */}
                      <div className="kpi-stat-item-inner">
                        <div className="kpi-stat-label-wrap-inner">
                          <Landmark size={12} className="kpi-icon-inner" />
                          <span className="kpi-label-text-inner">자산 (AUM)</span>
                        </div>
                        <div className="kpi-stat-value-inner">
                          {personalKpi?.aum || 0}<span className="kpi-unit-inner">억원</span>
                        </div>
                        <div className="kpi-progress-bar-container-inner">
                          <div className="kpi-progress-bar-fill-inner bg-primary" style={{ width: `${Math.min(100, Math.max(0, personalKpi?.aum_rate || 0))}%` }}></div>
                        </div>
                        <div className="kpi-progress-labels-inner">
                          <span className="kpi-progress-pct-inner">{personalKpi?.aum_rate || 0}%</span>
                          <span className="kpi-progress-target-inner">목표 {personalKpi?.aum_goal || 0}억</span>
                        </div>
                        <div className={`kpi-trend-inner ${personalKpi?.aum_delta >= 0 ? "green" : "red"}`}>
                          <span>{personalKpi?.aum_delta >= 0 ? "▲" : "▼"}</span> 전월비 {personalKpi?.aum_delta >= 0 ? "+" : ""}{personalKpi?.aum_delta || 0}%
                        </div>
                      </div>

                      {/* Non-interest profits */}
                      <div className="kpi-stat-item-inner">
                        <div className="kpi-stat-label-wrap-inner">
                          <Coins size={12} className="kpi-icon-inner" />
                          <span className="kpi-label-text-inner">비이자 이익</span>
                        </div>
                        <div className="kpi-stat-value-inner">
                          {(personalKpi?.non_interest || 0).toLocaleString()}<span className="kpi-unit-inner">만원</span>
                        </div>
                        <div className="kpi-progress-bar-container-inner">
                          <div className="kpi-progress-bar-fill-inner bg-primary" style={{ width: `${Math.min(100, Math.max(0, personalKpi?.non_interest_rate || 0))}%` }}></div>
                        </div>
                        <div className="kpi-progress-labels-inner">
                          <span className="kpi-progress-pct-inner">{personalKpi?.non_interest_rate || 0}%</span>
                          <span className="kpi-progress-target-inner">목표 {(personalKpi?.non_interest_goal || 0).toLocaleString()}만</span>
                        </div>
                        <div className={`kpi-trend-inner ${personalKpi?.non_interest_delta >= 0 ? "green" : "red"}`}>
                          <span>{personalKpi?.non_interest_delta >= 0 ? "▲" : "▼"}</span> 전월비 {personalKpi?.non_interest_delta >= 0 ? "+" : ""}{personalKpi?.non_interest_delta || 0}%
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="kpi-inner-panel branch-kpi-inner">
                    <div className="kpi-inner-header">
                      <div className="kpi-subtitle-korean-inner">{branchKpi?.branch_name || "여의도지점"}</div>
                    </div>
                    <div className="kpi-stats-grid-inner">
                      {/* Customer Count */}
                      <div className="kpi-stat-item-inner">
                        <div className="kpi-stat-label-wrap-inner">
                          <User size={12} className="kpi-icon-inner" />
                          <span className="kpi-label-text-inner">지점 고객 수</span>
                        </div>
                        <div className="kpi-stat-value-inner">
                          {(branchKpi?.customer_count || 0).toLocaleString()}<span className="kpi-unit-inner">명</span>
                        </div>
                        <div className="kpi-progress-bar-container-inner">
                          <div className="kpi-progress-bar-fill-inner bg-green" style={{ width: `${Math.min(100, Math.max(0, branchKpi?.customer_rate || 0))}%` }}></div>
                        </div>
                        <div className="kpi-progress-labels-inner">
                          <span className="kpi-progress-pct-inner">{branchKpi?.customer_rate || 0}%</span>
                          <span className="kpi-progress-target-inner">목표 {(branchKpi?.customer_goal || 0).toLocaleString()}명</span>
                        </div>
                        <div className={`kpi-trend-inner ${branchKpi?.customer_delta >= 0 ? "green" : "red"}`}>
                          <span>{branchKpi?.customer_delta >= 0 ? "▲" : "▼"}</span> 전월비 {branchKpi?.customer_delta >= 0 ? "+" : ""}{branchKpi?.customer_delta || 0}%
                        </div>
                      </div>

                      {/* AUM */}
                      <div className="kpi-stat-item-inner">
                        <div className="kpi-stat-label-wrap-inner">
                          <Landmark size={12} className="kpi-icon-inner" />
                          <span className="kpi-label-text-inner">지점 자산 (AUM)</span>
                        </div>
                        <div className="kpi-stat-value-inner">
                          {(branchKpi?.aum || 0).toLocaleString()}<span className="kpi-unit-inner">억원</span>
                        </div>
                        <div className="kpi-progress-bar-container-inner">
                          <div className="kpi-progress-bar-fill-inner bg-green" style={{ width: `${Math.min(100, Math.max(0, branchKpi?.aum_rate || 0))}%` }}></div>
                        </div>
                        <div className="kpi-progress-labels-inner">
                          <span className="kpi-progress-pct-inner">{branchKpi?.aum_rate || 0}%</span>
                          <span className="kpi-progress-target-inner">목표 {(branchKpi?.aum_goal || 0).toLocaleString()}억</span>
                        </div>
                        <div className={`kpi-trend-inner ${branchKpi?.aum_delta >= 0 ? "green" : "red"}`}>
                          <span>{branchKpi?.aum_delta >= 0 ? "▲" : "▼"}</span> 전월비 {branchKpi?.aum_delta >= 0 ? "+" : ""}{branchKpi?.aum_delta || 0}%
                        </div>
                      </div>

                      {/* Non-interest profits */}
                      <div className="kpi-stat-item-inner">
                        <div className="kpi-stat-label-wrap-inner">
                          <Coins size={12} className="kpi-icon-inner" />
                          <span className="kpi-label-text-inner">지점 비이자 이익</span>
                        </div>
                        <div className="kpi-stat-value-inner">
                          {(branchKpi?.non_interest || 0).toLocaleString()}<span className="kpi-unit-inner">만원</span>
                        </div>
                        <div className="kpi-progress-bar-container-inner">
                          <div className="kpi-progress-bar-fill-inner bg-green" style={{ width: `${Math.min(100, Math.max(0, branchKpi?.non_interest_rate || 0))}%` }}></div>
                        </div>
                        <div className="kpi-progress-labels-inner">
                          <span className="kpi-progress-pct-inner">{branchKpi?.non_interest_rate || 0}%</span>
                          <span className="kpi-progress-target-inner">목표 {(branchKpi?.non_interest_goal || 0).toLocaleString()}만</span>
                        </div>
                        <div className={`kpi-trend-inner ${branchKpi?.non_interest_delta >= 0 ? "green" : "red"}`}>
                          <span>{branchKpi?.non_interest_delta >= 0 ? "▲" : "▼"}</span> 전월비 {branchKpi?.non_interest_delta >= 0 ? "+" : ""}{branchKpi?.non_interest_delta || 0}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. AI To Do Combined Card */}
            <div className="bottom-card todo-combined-card" style={{ flex: 1 }}>
              <div className="bottom-card-header">
                <div className="header-icon-title">
                  <CheckCircle2 size={20} className="header-icon primary-color" />
                  <h2 className="bottom-card-title">
                    {todoViewMode === "daily" ? "오늘의 To-Do & AI 추천 액션" : 
                     todoViewMode === "weekly" ? "주간 To-Do & AI 추천 액션" : "월간 To-Do & AI 추천 액션"}
                  </h2>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button 
                    className="kpi-register-btn" 
                    onClick={() => setIsScheduleModalOpen(true)}
                    style={{ 
                      padding: '4px 10px', 
                      borderRadius: '8px', 
                      fontSize: '10.5px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '3px',
                      backgroundColor: 'var(--primary-color)',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '700'
                    }}
                  >
                    <Plus size={11} /> 일정 등록
                  </button>

                  {/* View switcher menu buttons */}
                  <div className="todo-view-mode-tabs">
                    <button 
                      className={`todo-mode-btn ${todoViewMode === 'daily' ? 'active' : ''}`}
                      onClick={() => setTodoViewMode('daily')}
                    >
                      일별
                    </button>
                    <button 
                      className={`todo-mode-btn ${todoViewMode === 'weekly' ? 'active' : ''}`}
                      onClick={() => setTodoViewMode('weekly')}
                    >
                      주별
                    </button>
                    <button 
                      className={`todo-mode-btn ${todoViewMode === 'monthly' ? 'active' : ''}`}
                      onClick={() => setTodoViewMode('monthly')}
                    >
                      월별
                    </button>
                  </div>
                </div>
              </div>

              <div className="todo-unified-list daily-timeline-view" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflowY: 'auto' }}>
                {todoViewMode === "daily" && (
                  <>
                    {mergedTimeline.length === 0 && (
                      <div className="todo-empty-state">진행 예정인 To-Do가 비어 있습니다.</div>
                    )}

                    {mergedTimeline.map((item, index) => {
                      const isLast = index === mergedTimeline.length - 1;
                      
                      if (item.type === 'my') {
                        const e = item.data;
                        const isAiRecommended = !!e.at_id;
                        return (
                          <div className="timeline-row" key={item.id}>
                            <div className="timeline-left">
                              <span className="timeline-time-badge">{item.timeLabel}</span>
                              <div className="timeline-node my-node"></div>
                              {!isLast && <div className="timeline-line"></div>}
                            </div>
                            <div className="timeline-right">
                              <div className="unified-todo-item my-todo-style">
                                <div className="todo-badge-wrap">
                                  {e.color === 'pink' && <span className="todo-tag tag-red">이탈위험</span>}
                                  {e.color === 'yellow' && <span className="todo-tag tag-yellow">기념일</span>}
                                  {e.color === 'blue' && <span className="todo-tag tag-blue">예금만기</span>}
                                  {e.color === 'green' && <span className="todo-tag tag-green">공지</span>}
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
                              <span className="timeline-time-badge">{item.timeLabel}</span>
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
                  </>
                )}

                {todoViewMode === "weekly" && (
                  <div className="main-mini-weekly-calendar" style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minHeight: 0 }}>
                    <div className="weekly-header" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontWeight: 'bold', fontSize: '10px', color: 'var(--main-text-muted)', borderBottom: '1px solid var(--main-border)', paddingBottom: '4px' }}>
                      {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
                        <span key={idx} style={idx === 0 ? { color: '#ef4444' } : idx === 6 ? { color: '#3b82f6' } : {}}>{day}</span>
                      ))}
                    </div>
                    <div className="weekly-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', flex: 1, minHeight: 0 }}>
                      {getWeekDays(selectedDate).map((day, idx) => {
                        const yyyy = day.getFullYear();
                        const mm = String(day.getMonth() + 1).padStart(2, '0');
                        const dd = String(day.getDate()).padStart(2, '0');
                        const cellDateStr = `${yyyy}-${mm}-${dd}`;
                        
                        const cellEvents = events.filter(e => e.startTime.startsWith(cellDateStr));
                        const cellAiTodos = allAiTodos.filter(todo => todo.executionDate && todo.executionDate.startsWith(cellDateStr));
                        const hasEvents = cellEvents.length > 0;
                        const hasAiTodos = cellAiTodos.length > 0;

                        const isSelected = day.getFullYear() === selectedDate.getFullYear() && 
                                           day.getMonth() === selectedDate.getMonth() && 
                                           day.getDate() === selectedDate.getDate();

                        const today = new Date();
                        const isToday = day.getDate() === today.getDate() &&
                                        day.getMonth() === today.getMonth() &&
                                        day.getFullYear() === today.getFullYear();

                        return (
                          <div 
                            key={idx} 
                            onClick={() => {
                              setSelectedDate(day);
                              setTodoViewMode("daily");
                            }}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '6px 3px',
                              border: isSelected ? '1.5px solid var(--primary-color)' : '1px solid var(--main-border)',
                              borderRadius: '8px',
                              backgroundColor: isSelected ? 'var(--primary-bg-light)' : isToday ? '#f0fdf4' : 'white',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              minHeight: '85px',
                              boxShadow: isSelected ? '0 2px 6px rgba(2, 132, 199, 0.15)' : 'none',
                              boxSizing: 'border-box'
                            }}
                            className="mini-weekly-cell"
                          >
                            <span style={{ fontSize: '10px', fontWeight: '800', color: isSelected ? 'var(--primary-color)' : isToday ? '#16a34a' : 'var(--main-text-title)' }}>
                              {day.getDate()}
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%', marginTop: '4px', overflow: 'hidden' }}>
                              {cellEvents.slice(0, 2).map((ev) => (
                                <div 
                                  key={ev.id} 
                                  style={{
                                    fontSize: '7.5px',
                                    padding: '1px 3px',
                                    borderRadius: '4px',
                                    backgroundColor: ev.color === 'pink' ? '#fee2e2' : ev.color === 'yellow' ? '#fef3c7' : ev.color === 'green' ? '#d1fae5' : '#e0f2fe',
                                    color: ev.color === 'pink' ? '#ef4444' : ev.color === 'yellow' ? '#d97706' : ev.color === 'green' ? '#059669' : '#0284c7',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    textAlign: 'left',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    lineHeight: 1.1,
                                    fontWeight: '700'
                                  }}
                                  title={ev.title}
                                >
                                  {ev.title}
                                </div>
                              ))}
                              {cellAiTodos.slice(0, 1).map((todo) => (
                                <div 
                                  key={todo.id} 
                                  style={{
                                    fontSize: '7.5px',
                                    padding: '1px 3px',
                                    borderRadius: '4px',
                                    backgroundColor: '#f3e8ff',
                                    color: '#7e22ce',
                                    border: '0.5px dashed #c084fc',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    textAlign: 'left',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    lineHeight: 1.1,
                                    fontWeight: '700'
                                  }}
                                  title={`[AI 제안] ${todo.content}`}
                                >
                                  ✨ {todo.content}
                                </div>
                              ))}
                            </div>
                            {(hasEvents || hasAiTodos) ? (
                              <span style={{ fontSize: '7.5px', fontWeight: '800', color: 'var(--main-text-muted)', marginTop: '2px' }}>
                                {cellEvents.length + cellAiTodos.length}개
                              </span>
                            ) : (
                              <span style={{ fontSize: '7.5px', color: '#e2e8f0', marginTop: '2px' }}>-</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {todoViewMode === "monthly" && (
                  <div className="main-mini-monthly-calendar" style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minHeight: 0 }}>
                    <div className="monthly-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', padding: '0 4px' }}>
                      <button onClick={(e) => { e.stopPropagation(); handlePrevMonth(); }} style={{ padding: '2px', cursor: 'pointer', color: 'var(--main-text-muted)' }}><ChevronLeft size={16} /></button>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--main-text-title)' }}>{formatMonthYear(currentMonth.year, currentMonth.month)}</span>
                      <button onClick={(e) => { e.stopPropagation(); handleNextMonth(); }} style={{ padding: '2px', cursor: 'pointer', color: 'var(--main-text-muted)' }}><ChevronRight size={16} /></button>
                    </div>
                    
                    <div className="monthly-header" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center', fontWeight: 'bold', fontSize: '9px', color: 'var(--main-text-muted)', borderBottom: '1px solid var(--main-border)', paddingBottom: '2px' }}>
                      {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
                        <span key={idx} style={idx === 0 ? { color: '#ef4444' } : idx === 6 ? { color: '#3b82f6' } : {}}>{day}</span>
                      ))}
                    </div>
                    <div className="monthly-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', flex: 1, minHeight: 0 }}>
                      {generateMiniCalendar(currentMonth.year, currentMonth.month, selectedDate, 'month').map((d, idx) => {
                        const cellDate = d.date;
                        const yyyy = cellDate.getFullYear();
                        const mm = String(cellDate.getMonth() + 1).padStart(2, '0');
                        const dd = String(cellDate.getDate()).padStart(2, '0');
                        const cellDateStr = `${yyyy}-${mm}-${dd}`;
                        
                        const cellEvents = events.filter(e => e.startTime.startsWith(cellDateStr));
                        const cellAiTodos = allAiTodos.filter(todo => todo.executionDate && todo.executionDate.startsWith(cellDateStr));
                        const hasEvents = cellEvents.length > 0;
                        const hasAiTodos = cellAiTodos.length > 0;

                        const isSelected = cellDate.getFullYear() === selectedDate.getFullYear() && 
                                           cellDate.getMonth() === selectedDate.getMonth() && 
                                           cellDate.getDate() === selectedDate.getDate();

                        const today = new Date();
                        const isToday = cellDate.getDate() === today.getDate() &&
                                        cellDate.getMonth() === today.getMonth() &&
                                        cellDate.getFullYear() === today.getFullYear();

                        return (
                          <div 
                            key={idx} 
                            onClick={() => {
                              setSelectedDate(cellDate);
                              setTodoViewMode("daily");
                            }}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              padding: '4px 2px',
                              border: isSelected ? '1px solid var(--primary-color)' : '1px solid #f1f5f9',
                              borderRadius: '6px',
                              backgroundColor: isSelected ? 'var(--primary-bg-light)' : isToday ? '#f0fdf4' : 'transparent',
                              opacity: d.muted ? 0.35 : 1,
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                              minHeight: '38px',
                              boxSizing: 'border-box'
                            }}
                            className="mini-monthly-cell"
                          >
                            <span style={{ 
                              fontSize: '9px', 
                              fontWeight: isToday || isSelected ? '800' : '500', 
                              color: isSelected ? 'var(--primary-color)' : isToday ? '#16a34a' : 'var(--main-text-title)' 
                            }}>
                              {cellDate.getDate()}
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%', marginTop: '2px', alignItems: 'center' }}>
                              {cellEvents.slice(0, 1).map((ev) => (
                                <div 
                                  key={ev.id} 
                                  style={{
                                    fontSize: '6.5px',
                                    padding: '0.5px 2px',
                                    borderRadius: '3px',
                                    backgroundColor: ev.color === 'pink' ? '#fee2e2' : ev.color === 'yellow' ? '#fef3c7' : ev.color === 'green' ? '#d1fae5' : '#e0f2fe',
                                    color: ev.color === 'pink' ? '#ef4444' : ev.color === 'yellow' ? '#d97706' : ev.color === 'green' ? '#059669' : '#0284c7',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    width: '95%',
                                    textAlign: 'center',
                                    lineHeight: 1,
                                    fontWeight: '800'
                                  }}
                                >
                                  {ev.title.substring(0, 3)}
                                </div>
                              ))}
                              {cellAiTodos.slice(0, 1).map((todo) => (
                                <div 
                                  key={todo.id} 
                                  style={{
                                    fontSize: '6.5px',
                                    padding: '0.5px 2px',
                                    borderRadius: '3px',
                                    backgroundColor: '#f3e8ff',
                                    color: '#7e22ce',
                                    border: '0.5px dashed #c084fc',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    width: '95%',
                                    textAlign: 'center',
                                    lineHeight: 1,
                                    fontWeight: '800'
                                  }}
                                >
                                  ✨{todo.content.substring(0, 2)}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {toast && toast.show && (
                <div className="dashboard-toast">
                  <Sparkles size={16} className="toast-spark" />
                  <span>{toast.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (50%) */}
          <div className="dashboard-column right-column">
            
            {/* 3. Trend Archive Predictions Card */}
            <div className="bottom-card trend-prediction-card">
              <div className="bottom-card-header">
                <div className="header-icon-title">
                  <Sparkles size={20} className="header-icon trend-color" style={{ color: 'var(--kpi-green)' }} />
                  <h2 className="bottom-card-title">트렌드 아카이브 지표 예측</h2>
                </div>
                <Link to="/economic-indicator-archive" className="arrow-link" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2, fontSize: 10, color: 'var(--primary-color)', fontWeight: 700 }}>
                  상세 지표 <ArrowRight size={10} />
                </Link>
              </div>

              <div className="trend-prediction-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {loadingTrend ? (
                  <div className="trend-loading-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '20px 0', color: 'var(--main-text-muted)', fontSize: 11 }}>
                    <span className="animate-pulse">🔮 AI 분석 모델을 통해 실시간 예측 지표를 연동 중입니다...</span>
                  </div>
                ) : (
                  <div className="trend-prediction-grid">
                    {/* 1. Gold Price */}
                    <div className="trend-mini-card">
                      <div className="mini-card-title-wrap">
                        <span className="mini-card-label">금값 (Gold)</span>
                        <span className="mini-card-sublabel">내일 예측</span>
                      </div>
                      <div className="mini-card-content">
                        <div className="prob-bar-group">
                          <div className="prob-bar-row">
                            <span className="prob-name text-danger">상승</span>
                            <div className="prob-progress-bar">
                              <div className="prob-fill bg-danger" style={{ width: `${trendData?.indicators?.gold?.probRise ?? 50}%` }}></div>
                            </div>
                            <span className="prob-value text-danger">{trendData?.indicators?.gold?.probRise ?? 50}%</span>
                          </div>
                          <div className="prob-bar-row">
                            <span className="prob-name text-blue">하락</span>
                            <div className="prob-progress-bar">
                              <div className="prob-fill bg-blue" style={{ width: `${trendData?.indicators?.gold?.probFall ?? 50}%` }}></div>
                            </div>
                            <span className="prob-value text-blue">{trendData?.indicators?.gold?.probFall ?? 50}%</span>
                          </div>
                        </div>
                        <div className="trend-pred-text">
                          예측: <span className={trendData?.indicators?.gold?.predictionText?.includes('상승') ? 'text-danger' : 'text-blue'} style={{ fontWeight: 700 }}>
                            {trendData?.indicators?.gold?.predictionText || "상승 우세"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 2. Real Estate Index */}
                    <div className="trend-mini-card">
                      <div className="mini-card-title-wrap">
                        <span className="mini-card-label">부동산 지수</span>
                        <span className="mini-card-sublabel">다음달 예측</span>
                      </div>
                      <div className="mini-card-content real-estate-content" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div className="re-value-wrap" style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                          <span className="re-number" style={{ fontSize: 24, fontWeight: 800, color: 'var(--main-text-title)' }}>
                            {trendData?.indicators?.realEstate?.tomorrow ?? "101.5"}
                          </span>
                          <span className={`re-badge ${trendData?.indicators?.realEstate?.changeDirection === 'down' ? 'down' : 'up'}`} style={{
                            padding: '1px 5px', borderRadius: 4, fontSize: 9, fontWeight: 700,
                            background: trendData?.indicators?.realEstate?.changeDirection === 'down' ? '#fee2e2' : '#dcfce7',
                            color: trendData?.indicators?.realEstate?.changeDirection === 'down' ? '#ef4444' : '#16a34a',
                          }}>
                            {trendData?.indicators?.realEstate?.changeDirection === 'down' ? '▼' : '▲'} {trendData?.indicators?.realEstate?.changeRate ? `${Math.abs(trendData.indicators.realEstate.changeRate)}%` : "+0.3%"}
                          </span>
                        </div>
                        <div className="re-sparkline" style={{ height: 24 }}>
                          <svg viewBox="0 0 100 24" style={{ width: '100%', height: '100%', fill: 'none', stroke: '#10b981', strokeWidth: 1.5 }}>
                            <path d="M 0 18 Q 25 12 50 20 T 100 6" />
                            <circle cx="100" cy="6" r="2.5" fill="#10b981" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* 3. Base Rate */}
                    <div className="trend-mini-card">
                      <div className="mini-card-title-wrap">
                        <span className="mini-card-label">기준 금리</span>
                        <span className="mini-card-sublabel">다음달 예측</span>
                      </div>
                      <div className="mini-card-content">
                        <div className="prob-bar-group">
                          <div className="prob-bar-row">
                            <span className="prob-name text-blue" style={{ width: 18 }}>인하</span>
                            <div className="prob-progress-bar">
                              <div className="prob-fill bg-blue" style={{ width: `${trendData?.indicators?.interestRate?.probCut ?? 10}%` }}></div>
                            </div>
                            <span className="prob-value text-blue">{trendData?.indicators?.interestRate?.probCut ?? 10}%</span>
                          </div>
                          <div className="prob-bar-row">
                            <span className="prob-name text-muted" style={{ width: 18 }}>동결</span>
                            <div className="prob-progress-bar">
                              <div className="prob-fill bg-muted" style={{ width: `${trendData?.indicators?.interestRate?.probFreeze ?? 80}%` }}></div>
                            </div>
                            <span className="prob-value text-muted">{trendData?.indicators?.interestRate?.probFreeze ?? 80}%</span>
                          </div>
                          <div className="prob-bar-row">
                            <span className="prob-name text-danger" style={{ width: 18 }}>인상</span>
                            <div className="prob-progress-bar">
                              <div className="prob-fill bg-danger" style={{ width: `${trendData?.indicators?.interestRate?.probHike ?? 10}%` }}></div>
                            </div>
                            <span className="prob-value text-danger">{trendData?.indicators?.interestRate?.probHike ?? 10}%</span>
                          </div>
                        </div>
                        <div className="trend-pred-text">
                          예측: <span className="text-muted" style={{ fontWeight: 700 }}>
                            {trendData?.indicators?.interestRate?.predictionText || "동결 우세 (3.50%)"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Key Customer Management & Notification Feed Stack */}
            <div className="bottom-dashboard-right-stack" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
              
              {/* 주요 고객 관리 Card */}
              <div className="bottom-card key-customers-section" style={{ padding: '14px 18px', flex: 'none' }}>
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

              {/* 실시간 알림 피드 Card */}
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
      <ScheduleRegistrationModal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} />
    </div>
  );
}
