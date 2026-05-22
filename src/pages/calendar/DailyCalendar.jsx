import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Calendar as CalendarIcon, TrendingUp, Users, Bell, Plus, ChevronLeft, ChevronRight, LogOut, CheckCircle2, ChevronDown, ChevronUp, RotateCcw, User, Landmark, PieChart, Coins } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import "./CalendarNew.css";
import ScheduleRegistrationModal from "./ScheduleRegistrationModal";
import ScheduleDetailModal from "./ScheduleDetailModal";
import ScheduleEditModal from "./ScheduleEditModal";
import AiTodoDetailModal from "./AiTodoDetailModal";
import SeasonProductModal from "./SeasonProductModal";
import { generateMiniCalendar, formatMonthYear, formatFullHeaderDate } from './calendarUtils';
import { useCalendar } from './CalendarContext';

export default function DailyCalendar() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAiTodoDetailOpen, setIsAiTodoDetailOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const { events, selectedDate, setSelectedDate, aiTodos, toggleAiTodo, transferCheckedAiTodos, revertAiTodo, leftPanelWidth, isResizing, startResize, toast, personalKpi, branchKpi, seasonalProducts } = useCalendar();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [miniCalMonth, setMiniCalMonth] = useState({ year: selectedDate.getFullYear(), month: selectedDate.getMonth() });

  const currentUser = (() => {
    try {
      const userStr = localStorage.getItem("currentUser");
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  })();

  useEffect(() => {
    setMiniCalMonth({ year: selectedDate.getFullYear(), month: selectedDate.getMonth() });
  }, [selectedDate]);

  const openDetailModal = (event) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };
  const openEditModal = () => {
    setIsDetailModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handlePrevMonth = () => {
    setMiniCalMonth(prev => {
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
    setMiniCalMonth(prev => {
      let year = prev.year;
      let month = prev.month + 1;
      if (month > 11) {
        month = 0;
        year += 1;
      }
      return { year, month };
    });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setMiniCalMonth({ year: date.getFullYear(), month: date.getMonth() });
  };

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    handleDateClick(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    handleDateClick(newDate);
  };

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

  const colorMap = {
    yellow: { bg: '#fef9c3', border: '#fef08a', text: '#854d0e', timeText: '#a16207' },
    blue: { bg: '#e0f2fe', border: '#bae6fd', text: '#0369a1', timeText: '#075985' },
    pink: { bg: '#fce7f3', border: '#fbcfe8', text: '#9d174d', timeText: '#be185d' },
    purple: { bg: '#f3e8ff', border: '#e9d5ff', text: '#6b21a8', timeText: '#7e22ce' },
    lightblue: { bg: '#ecfeff', border: '#cffafe', text: '#164e63', timeText: '#155e75' },
    orange: { bg: '#ffedd5', border: '#fed7aa', text: '#9a3412', timeText: '#c2410c' },
    green: { bg: '#dcfce7', border: '#bbf7d0', text: '#166534', timeText: '#15803d' }
  };

  return (
    <div className="cal-layout">
      {/* Sidebar */}
      <Sidebar type="cal" />

      {/* Main Content */}
      <div className="cal-main" style={{ paddingTop: 32 }}>
        <div className="cal-content-row">
          {/* Left Panel */}
          <div 
            className={`cal-left-panel ${isResizing ? 'resizing' : ''}`}
            style={{ width: leftPanelWidth }}
          >
            {/* Resizer Handle */}
            <div className={`cal-resizer ${isResizing ? 'resizing' : ''}`} onMouseDown={startResize} />
            {/* AI To Do */}
             <div className="todo-section">
              <div className="todo-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div onClick={() => setIsAiTodoDetailOpen(true)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} title="AI To Do 상세 보기">
                  <CheckCircle2 size={20} className="todo-header-icon" /> AI To Do
                </div>
                <button 
                  onClick={() => setIsAiTodoDetailOpen(true)} 
                  style={{ 
                    fontSize: '11px', 
                    color: '#0ea5e9', 
                    background: '#e0f2fe', 
                    border: 'none', 
                    borderRadius: '12px', 
                    padding: '2px 8px', 
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  자세히 확인
                </button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {aiTodos.map(todo => (
                  <div className="ai-todo-item" key={todo.id}>
                    <div className="todo-time-tag">
                      <span className="todo-time">{todo.time}</span>
                      <span className={`todo-tag ${todo.tagColor}`}>{todo.tag}</span>
                    </div>
                    <div className="todo-content">{todo.content}</div>
                    <div 
                      className={`todo-checkbox ${todo.checked ? 'checked' : ''}`}
                      onClick={() => toggleAiTodo(todo.id)}
                    >
                      {todo.checked && <span style={{ fontSize: 12 }}>✓</span>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="ai-todo-actions">
                <button 
                  className="todo-action-btn primary" 
                  onClick={() => transferCheckedAiTodos(selectedDate)}
                  title="선택 항목 My To Do로 등록"
                  style={{ width: '100%', borderRadius: '20px', gap: '6px', display: 'flex', alignItems: 'center', height: '36px', justifyContent: 'center' }}
                >
                  <ChevronDown size={16}/>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>My To Do 등록</span>
                </button>
              </div>
              {toast && toast.show && (
                <div className="cal-toast-notification">
                  <CheckCircle2 size={18} style={{ color: '#0ea5e9', flexShrink: 0 }} />
                  <span>{toast.message}</span>
                </div>
              )}
            </div>

            {/* My To Do */}
            <div className="todo-section" style={{ marginBottom: 0 }}>
              <div className="todo-header">
                <CheckCircle2 size={20} className="todo-header-icon" /> My To Do
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {todayEvents.length === 0 ? (
                  <div style={{ fontSize: 13, color: '#94a3b8', padding: '12px 0' }}>등록된 일정이 없습니다.</div>
                ) : (
                  todayEvents.map(e => {
                    const timeStr = `${e.startTime.split(' ')[1]} ~`;
                    const isAiRecommended = !!e.at_id;
                    return (
                      <div className="my-todo-item" key={e.id}>
                        <div className="todo-time-tag">
                          <span className="todo-time">{timeStr}</span>
                          {e.color === 'pink' && <span className="todo-tag tag-red">이탈위험</span>}
                          {e.color === 'yellow' && <span className="todo-tag tag-yellow">기념일</span>}
                          {e.color === 'blue' && <span className="todo-tag tag-blue">예금만기</span>}
                        </div>
                        <div className="todo-content" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                          <span>{e.title}</span>
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>
                            {isAiRecommended ? "AI 추천으로 등록된 일정" : (e.memo || '상담 요망')}
                          </span>
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
                            <RotateCcw size={12} />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            
            <button className="cal-add-btn" onClick={() => setIsScheduleModalOpen(true)} style={{ marginTop: 16 }}>
              <Plus size={18} /> 일정 등록
            </button>
          </div>

          {/* Right Panel */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {/* KPI Cards */}
            <div className="kpi-container">
              {/* 개인 KPI */}
              <div className="kpi-card">
                <div className="kpi-card-header">
                  <div className="kpi-title-korean">개인 KPI</div>
                  <div className="kpi-subtitle-korean">{personalKpi?.name || currentUser?.name || "김재욱"} PB</div>
                </div>
                <div className="kpi-stats-grid">
                  <div className="kpi-stat-item">
                    <div className="kpi-stat-label-wrap">
                      <div className="kpi-icon-container">
                        <User size={12} className="kpi-icon" />
                      </div>
                      <span className="kpi-label-text">고객 수</span>
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
                      <span className="kpi-trend-arrow">{personalKpi?.customer_delta >= 0 ? "▲" : "▼"}</span> 전월 대비 {personalKpi?.customer_delta >= 0 ? "+" : ""}{personalKpi?.customer_delta || 0}%
                    </div>
                  </div>
                  <div className="kpi-stat-item">
                    <div className="kpi-stat-label-wrap">
                      <div className="kpi-icon-container">
                        <Landmark size={12} className="kpi-icon" />
                      </div>
                      <span className="kpi-label-text">자산 (AUM)</span>
                    </div>
                    <div className="kpi-stat-value">
                      {personalKpi?.aum || 0}<span className="kpi-unit">억</span>
                    </div>
                    <div className="kpi-progress-bar-container">
                      <div className="kpi-progress-bar-fill" style={{ width: `${Math.min(100, Math.max(0, personalKpi?.aum_rate || 0))}%` }}></div>
                    </div>
                    <div className="kpi-progress-labels">
                      <span className="kpi-progress-pct">{personalKpi?.aum_rate || 0}%</span>
                      <span className="kpi-progress-target">목표 {personalKpi?.aum_goal || 0}억</span>
                    </div>
                    <div className={`kpi-trend ${personalKpi?.aum_delta >= 0 ? "green" : "red"}`}>
                      <span className="kpi-trend-arrow">{personalKpi?.aum_delta >= 0 ? "▲" : "▼"}</span> 전월 대비 {personalKpi?.aum_delta >= 0 ? "+" : ""}{personalKpi?.aum_delta || 0}%
                    </div>
                  </div>
                  <div className="kpi-stat-item">
                    <div className="kpi-stat-label-wrap">
                      <div className="kpi-icon-container">
                        <Coins size={12} className="kpi-icon" />
                      </div>
                      <span className="kpi-label-text">비이자 이익</span>
                    </div>
                    <div className="kpi-stat-value">
                      {(personalKpi?.non_interest || 0).toLocaleString()}<span className="kpi-unit">만</span>
                    </div>
                    <div className="kpi-progress-bar-container">
                      <div className="kpi-progress-bar-fill" style={{ width: `${Math.min(100, Math.max(0, personalKpi?.non_interest_rate || 0))}%` }}></div>
                    </div>
                    <div className="kpi-progress-labels">
                      <span className="kpi-progress-pct">{personalKpi?.non_interest_rate || 0}%</span>
                      <span className="kpi-progress-target">목표 {(personalKpi?.non_interest_goal || 0).toLocaleString()}만</span>
                    </div>
                    <div className={`kpi-trend ${personalKpi?.non_interest_delta >= 0 ? "green" : "red"}`}>
                      <span className="kpi-trend-arrow">{personalKpi?.non_interest_delta >= 0 ? "▲" : "▼"}</span> 전월 대비 {personalKpi?.non_interest_delta >= 0 ? "+" : ""}{personalKpi?.non_interest_delta || 0}%
                    </div>
                  </div>
                </div>
              </div>

              {/* 지점 KPI */}
              <div className="kpi-card">
                <div className="kpi-card-header">
                  <div className="kpi-title-korean">지점 KPI</div>
                  <div className="kpi-subtitle-korean">{branchKpi?.branch_name || "지점"}</div>
                </div>
                <div className="kpi-stats-grid">
                  <div className="kpi-stat-item">
                    <div className="kpi-stat-label-wrap">
                      <div className="kpi-icon-container">
                        <User size={12} className="kpi-icon" />
                      </div>
                      <span className="kpi-label-text">고객 수</span>
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
                      <span className="kpi-trend-arrow">{branchKpi?.customer_delta >= 0 ? "▲" : "▼"}</span> 전월 대비 {branchKpi?.customer_delta >= 0 ? "+" : ""}{branchKpi?.customer_delta || 0}%
                    </div>
                  </div>
                  <div className="kpi-stat-item">
                    <div className="kpi-stat-label-wrap">
                      <div className="kpi-icon-container">
                        <Landmark size={12} className="kpi-icon" />
                      </div>
                      <span className="kpi-label-text">자산 (AUM)</span>
                    </div>
                    <div className="kpi-stat-value">
                      {(branchKpi?.aum || 0).toLocaleString()}<span className="kpi-unit">억</span>
                    </div>
                    <div className="kpi-progress-bar-container">
                      <div className="kpi-progress-bar-fill" style={{ width: `${Math.min(100, Math.max(0, branchKpi?.aum_rate || 0))}%` }}></div>
                    </div>
                    <div className="kpi-progress-labels">
                      <span className="kpi-progress-pct">{branchKpi?.aum_rate || 0}%</span>
                      <span className="kpi-progress-target">목표 {(branchKpi?.aum_goal || 0).toLocaleString()}억</span>
                    </div>
                    <div className={`kpi-trend ${branchKpi?.aum_delta >= 0 ? "green" : "red"}`}>
                      <span className="kpi-trend-arrow">{branchKpi?.aum_delta >= 0 ? "▲" : "▼"}</span> 전월 대비 {branchKpi?.aum_delta >= 0 ? "+" : ""}{branchKpi?.aum_delta || 0}%
                    </div>
                  </div>
                  <div className="kpi-stat-item">
                    <div className="kpi-stat-label-wrap">
                      <div className="kpi-icon-container">
                        <Coins size={12} className="kpi-icon" />
                      </div>
                      <span className="kpi-label-text">비이자 이익</span>
                    </div>
                    <div className="kpi-stat-value">
                      {(branchKpi?.non_interest || 0).toLocaleString()}<span className="kpi-unit">만</span>
                    </div>
                    <div className="kpi-progress-bar-container">
                      <div className="kpi-progress-bar-fill" style={{ width: `${Math.min(100, Math.max(0, branchKpi?.non_interest_rate || 0))}%` }}></div>
                    </div>
                    <div className="kpi-progress-labels">
                      <span className="kpi-progress-pct">{branchKpi?.non_interest_rate || 0}%</span>
                      <span className="kpi-progress-target">목표 {(branchKpi?.non_interest_goal || 0).toLocaleString()}만</span>
                    </div>
                    <div className={`kpi-trend ${branchKpi?.non_interest_delta >= 0 ? "green" : "red"}`}>
                      <span className="kpi-trend-arrow">{branchKpi?.non_interest_delta >= 0 ? "▲" : "▼"}</span> 전월 대비 {branchKpi?.non_interest_delta >= 0 ? "+" : ""}{branchKpi?.non_interest_delta || 0}%
                    </div>
                  </div>
                </div>
              </div>

              {/* 시즌 주력 상품 */}
              <div className="kpi-card">
                <div className="kpi-title" style={{ color: '#0ea5e9' }}>시즌 주력 상품</div>
                <div className="kpi-subtitle" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {seasonalProducts?.products?.[0]?.season || "2026 상반기"}
                  <span onClick={() => setIsProductModalOpen(true)} style={{ fontSize: 11, color: '#0ea5e9', fontWeight: 500, cursor: 'pointer' }}>전체 상품 보기</span>
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
                  {seasonalProducts?.total_count || 0}<span style={{ fontSize: 14, fontWeight: 500 }}>종</span>
                </div>
                <div className="product-tags">
                  {seasonalProducts?.products?.slice(0, 4).map(p => (
                    <span className="product-tag" key={p.pd_id}>{p.name}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid Container */}
            <div className="cal-grid-container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="cal-grid-header">
                <span style={{ fontSize: 18, fontWeight: 600 }}>
                  {formatFullHeaderDate(selectedDate)}
                  <button className="today-btn" onClick={() => { setSelectedDate(new Date()); navigate('/daily-calendar'); }}>Today</button>
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  <div className="cal-view-tabs">
                    <Link to="/monthly-calendar" className="cal-view-tab">Month</Link>
                    <Link to="/weekly-calendar" className="cal-view-tab">Week</Link>
                    <Link to="/daily-calendar" className="cal-view-tab active">Day</Link>
                  </div>
                <div className="cal-grid-nav">
                  <ChevronLeft size={20} cursor="pointer" onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(newDate.getDate() - 1);
                    setSelectedDate(newDate);
                  }} />
                  <ChevronRight size={20} cursor="pointer" onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(newDate.getDate() + 1);
                    setSelectedDate(newDate);
                  }} />
                </div>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              {/* Timeline layout for Daily view */}
              <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', flex: 1 }}>
                
                {/* Hours column */}
                <div style={{ borderRight: '1px solid #e5e7eb' }}>
                  {Array.from({ length: 15 }).map((_, idx) => {
                    const hour = idx + 9;
                    const timeStr = `${hour < 10 ? `0${hour}` : hour}:00`;
                    return (
                      <div key={hour} style={{ height: 80, borderBottom: '1px solid #e5e7eb', padding: '8px', textAlign: 'right', fontSize: 11, color: '#94a3b8', boxSizing: 'border-box' }}>
                        {timeStr}
                      </div>
                    );
                  })}
                </div>

                {/* Events column */}
                <div style={{ position: 'relative' }}>
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} style={{ height: 80, borderBottom: '1px solid #e5e7eb', boxSizing: 'border-box' }}></div>
                  ))}

                  {todayEvents.map(event => {
                    const timePartStart = event.startTime.split(' ')[1] || '09:00';
                    const timePartEnd = event.endTime.split(' ')[1] || '10:00';
                    
                    const [startHour, startMin] = timePartStart.split(':').map(Number);
                    const [endHour, endMin] = timePartEnd.split(':').map(Number);
                    
                    const startTotalMins = startHour * 60 + startMin;
                    const endTotalMins = endHour * 60 + endMin;
                    const durationMins = endTotalMins - startTotalMins;
                    
                    // 9시(540분) 오프셋 기준 위치 계산
                    const startMinsFromOffset = startTotalMins - 540;
                    const topPos = (startMinsFromOffset / 60) * 80;
                    const heightPx = (durationMins / 60) * 80;
                    
                    const styleColors = colorMap[event.color] || colorMap.blue;
                    
                    return (
                      <div 
                        key={event.id}
                        onClick={() => openDetailModal(event)}
                        style={{ 
                          cursor: 'pointer', 
                          position: 'absolute', 
                          top: topPos, 
                          left: 24, 
                          right: 24, 
                          height: heightPx, 
                          background: styleColors.bg, 
                          borderRadius: 8, 
                          display: 'flex', 
                          border: `1px solid ${styleColors.border}` 
                        }}
                      >
                        <div style={{ width: '30%', padding: 12, borderRight: `1px solid ${styleColors.border}`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: styleColors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.title}</span>
                          <span style={{ fontSize: 11, color: styleColors.timeText }}>{timePartStart} ~ {timePartEnd}</span>
                        </div>
                        <div style={{ flex: 1, padding: 12, display: 'flex', alignItems: 'center', fontSize: 13, color: styleColors.text, whiteSpace: 'pre-line', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {event.memo || (event.customer ? `고객: ${event.customer}` : "메모 없음")}
                        </div>
                      </div>
                    );
                  })}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      <ScheduleRegistrationModal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} />
      <ScheduleDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} onEdit={openEditModal} event={selectedEvent} />
      <ScheduleEditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} event={selectedEvent} />
      <AiTodoDetailModal isOpen={isAiTodoDetailOpen} onClose={() => setIsAiTodoDetailOpen(false)} />
      <SeasonProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} />
    </div>
  );
}
