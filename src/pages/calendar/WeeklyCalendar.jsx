import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Calendar as CalendarIcon, TrendingUp, Users, Bell, Plus, ChevronLeft, ChevronRight, LogOut, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import "./CalendarNew.css";
import ScheduleRegistrationModal from "./ScheduleRegistrationModal";
import ScheduleDetailModal from "./ScheduleDetailModal";
import ScheduleEditModal from "./ScheduleEditModal";
import AiTodoDetailModal from "./AiTodoDetailModal";
import SeasonProductModal from "./SeasonProductModal";
import { generateMiniCalendar, formatMonthYear, formatHeaderDate, getWeekDays } from './calendarUtils';
import { useCalendar } from './CalendarContext';

export default function WeeklyCalendar() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAiTodoDetailOpen, setIsAiTodoDetailOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const { events, selectedDate, setSelectedDate, aiTodos, toggleAiTodo, transferCheckedAiTodos } = useCalendar();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [miniCalMonth, setMiniCalMonth] = useState({ year: selectedDate.getFullYear(), month: selectedDate.getMonth() });

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

  const handlePrevWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    handleDateClick(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    handleDateClick(newDate);
  };

  const weekDays = getWeekDays(selectedDate);

  const colorMap = {
    yellow: { bg: '#fef9c3', border: '#fef08a', text: '#854d0e', timeText: '#a16207' },
    blue: { bg: '#e0f2fe', border: '#bae6fd', text: '#0369a1', timeText: '#075985' },
    pink: { bg: '#fce7f3', border: '#fbcfe8', text: '#9d174d', timeText: '#be185d' },
    purple: { bg: '#f3e8ff', border: '#e9d5ff', text: '#6b21a8', timeText: '#7e22ce' },
    lightblue: { bg: '#ecfeff', border: '#cffafe', text: '#164e63', timeText: '#155e75' },
    orange: { bg: '#ffedd5', border: '#fed7aa', text: '#9a3412', timeText: '#c2410c' },
    green: { bg: '#dcfce7', border: '#bbf7d0', text: '#166534', timeText: '#15803d' }
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

  return (
    <div className="cal-layout">
      {/* Sidebar */}
      <Sidebar type="cal" />

      {/* Main Content */}
      <div className="cal-main" style={{ paddingTop: 32 }}>
        <div className="cal-content-row">
          {/* Left Panel */}
          <div className="cal-left-panel">
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
                <button className="todo-action-btn primary" onClick={() => transferCheckedAiTodos(selectedDate)}><ChevronDown size={16}/></button>
                <button className="todo-action-btn"><ChevronUp size={16}/></button>
              </div>
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
                    return (
                      <div className="my-todo-item" key={e.id}>
                        <div className="todo-time-tag">
                          <span className="todo-time">{timeStr}</span>
                          {e.color === 'pink' && <span className="todo-tag tag-red">이탈위험</span>}
                          {e.color === 'yellow' && <span className="todo-tag tag-yellow">기념일</span>}
                        </div>
                        <div className="todo-content" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                          <span>{e.title}</span>
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>{e.memo || '상담 요망'}</span>
                        </div>
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
              <div className="kpi-card">
                <div className="kpi-title">개인 KPI</div>
                <div className="kpi-subtitle">김재욱 PB</div>
                <div className="kpi-stats">
                  <div className="kpi-stat-item">
                    <div className="kpi-stat-label"><Users size={12}/> 고객 수</div>
                    <div className="kpi-stat-value">148<span style={{ fontSize: 12, fontWeight: 500 }}>명</span></div>
                    <div className="kpi-stat-desc">92% 목표 200명</div>
                    <div className="kpi-trend">▲ 전월 대비 +5%</div>
                  </div>
                  <div className="kpi-stat-item">
                    <div className="kpi-stat-label"><TrendingUp size={12}/> AUM</div>
                    <div className="kpi-stat-value">91<span style={{ fontSize: 12, fontWeight: 500 }}>억</span></div>
                    <div className="kpi-stat-desc">95% 목표 100억</div>
                    <div className="kpi-trend">▲ 전월 대비 +3%</div>
                  </div>
                  <div className="kpi-stat-item">
                    <div className="kpi-stat-label"><TrendingUp size={12}/> 비이자 이익</div>
                    <div className="kpi-stat-value">6,240<span style={{ fontSize: 12, fontWeight: 500 }}>만</span></div>
                    <div className="kpi-stat-desc">84% 목표 8,000만</div>
                    <div className="kpi-trend">▲ 전월 대비 +3%</div>
                  </div>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-title">지점 KPI</div>
                <div className="kpi-subtitle">서울 강남지점</div>
                <div className="kpi-stats">
                  <div className="kpi-stat-item">
                    <div className="kpi-stat-label"><Users size={12}/> 고객 수</div>
                    <div className="kpi-stat-value">1,284<span style={{ fontSize: 12, fontWeight: 500 }}>명</span></div>
                    <div className="kpi-stat-desc">85% 목표 1,500명</div>
                    <div className="kpi-trend">▲ 전월 대비 +4%</div>
                  </div>
                  <div className="kpi-stat-item">
                    <div className="kpi-stat-label"><TrendingUp size={12}/> AUM</div>
                    <div className="kpi-stat-value">824<span style={{ fontSize: 12, fontWeight: 500 }}>억</span></div>
                    <div className="kpi-stat-desc">91% 목표 900억</div>
                    <div className="kpi-trend">▲ 전월 대비 +3%</div>
                  </div>
                  <div className="kpi-stat-item">
                    <div className="kpi-stat-label"><TrendingUp size={12}/> 비이자 이익</div>
                    <div className="kpi-stat-value">4.8<span style={{ fontSize: 12, fontWeight: 500 }}>억</span></div>
                    <div className="kpi-stat-desc">87% 목표 5.5 억</div>
                    <div className="kpi-trend">▲ 전월 대비 +4.2%</div>
                  </div>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-title" style={{ color: '#0ea5e9' }}>시즌 주력 상품</div>
                <div className="kpi-subtitle" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  2026 상반기
                  <span onClick={() => setIsProductModalOpen(true)} style={{ fontSize: 11, color: '#0ea5e9', fontWeight: 500, cursor: 'pointer' }}>전체 상품 보기</span>
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>4<span style={{ fontSize: 14, fontWeight: 500 }}>종</span></div>
                <div className="product-tags">
                  <span className="product-tag">우리카드</span>
                  <span className="product-tag">ELS 7.2%</span>
                  <span className="product-tag">달러RP 5.1%</span>
                  <span className="product-tag">리츠 6.3%</span>
                </div>
              </div>
            </div>

            {/* Grid Container */}
            <div className="cal-grid-container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="cal-grid-header">
                <span style={{ fontSize: 18, fontWeight: 600 }}>
                  {formatHeaderDate(weekDays[0], weekDays[6])}
                  <button className="today-btn" onClick={() => { setSelectedDate(new Date()); navigate('/daily-calendar'); }}>Today</button>
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  <div className="cal-view-tabs">
                    <Link to="/monthly-calendar" className="cal-view-tab">Month</Link>
                    <Link to="/weekly-calendar" className="cal-view-tab active">Week</Link>
                    <Link to="/daily-calendar" className="cal-view-tab">Day</Link>
                  </div>
                <div className="cal-grid-nav">
                  <ChevronLeft size={20} cursor="pointer" onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(newDate.getDate() - 7);
                    setSelectedDate(newDate);
                  }} />
                  <ChevronRight size={20} cursor="pointer" onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(newDate.getDate() + 7);
                    setSelectedDate(newDate);
                  }} />
                </div>
              </div>
            </div>

            <div className="weekly-grid">
              {/* Header Row */}
              <div className="weekly-header-cell" style={{ borderRight: 'none' }}></div>
              {weekDays.map((day, idx) => {
                const isSelected = day.getFullYear() === selectedDate.getFullYear() && 
                                   day.getMonth() === selectedDate.getMonth() && 
                                   day.getDate() === selectedDate.getDate();
                const isSunday = day.getDay() === 0;
                
                return (
                  <div key={idx} className={`weekly-header-cell ${isSelected ? 'today' : ''}`} 
                       style={{ 
                         ...(isSunday ? { color: '#ef4444' } : {}),
                         ...(isSelected ? { borderTop: '2px solid #f97316' } : {}) 
                       }}>
                    <span>{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][day.getDay()]}</span>
                    <strong style={isSelected ? { color: '#f97316' } : {}}>
                      {String(day.getDate()).padStart(2, '0')}
                    </strong>
                  </div>
                );
              })}

              {/* Time Slots (09:00 to 23:00) */}
              {Array.from({ length: 15 }).map((_, i) => {
                const hour = i + 9;
                const timeStr = `${hour < 10 ? `0${hour}` : hour}:00`;
                
                return (
                  <div key={hour} style={{ display: 'contents' }}>
                    <div className="weekly-time-col">
                      <div className="weekly-time-cell">{timeStr}</div>
                    </div>
                    {/* 7 Days Columns per row */}
                    {Array.from({ length: 7 }).map((_, dayIdx) => {
                      const cellDate = weekDays[dayIdx];
                      const yyyy = cellDate.getFullYear();
                      const mm = String(cellDate.getMonth() + 1).padStart(2, '0');
                      const dd = String(cellDate.getDate()).padStart(2, '0');
                      const cellDateStr = `${yyyy}-${mm}-${dd}`;
                      
                      const cellEvents = events.filter(e => {
                        if (!e.startTime.startsWith(cellDateStr)) return false;
                        const startHour = parseInt(e.startTime.split(' ')[1].split(':')[0], 10);
                        return startHour === hour;
                      });

                      return (
                        <div className="weekly-day-col" key={dayIdx}>
                          <div className="weekly-grid-cell">
                            {cellEvents.map(event => {
                              const timePartStart = event.startTime.split(' ')[1] || '09:00';
                              const timePartEnd = event.endTime.split(' ')[1] || '10:00';
                              
                              const [sHour, sMin] = timePartStart.split(':').map(Number);
                              const [eHour, eMin] = timePartEnd.split(':').map(Number);
                              
                              const startTotalMins = sHour * 60 + sMin;
                              const endTotalMins = eHour * 60 + eMin;
                              const durationMins = endTotalMins - startTotalMins;
                              
                              // 1 hour cell = 60px height
                              const topPos = (sMin / 60) * 60;
                              const heightPx = (durationMins / 60) * 60;
                              
                              const styleColors = colorMap[event.color] || colorMap.blue;
                              
                              return (
                                <div 
                                  key={event.id}
                                  className={`event-block`} 
                                  style={{ 
                                    top: topPos, 
                                    height: heightPx, 
                                    cursor: 'pointer',
                                    background: styleColors.bg,
                                    border: `1px solid ${styleColors.border}`,
                                    color: styleColors.text
                                  }} 
                                  onClick={() => openDetailModal(event)}
                                >
                                  {event.title}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
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
