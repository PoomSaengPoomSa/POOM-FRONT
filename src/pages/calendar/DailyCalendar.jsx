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
import { api } from '../../api';

export default function DailyCalendar() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAiTodoDetailOpen, setIsAiTodoDetailOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const { events, selectedDate, setSelectedDate, aiTodos, toggleAiTodo, transferCheckedAiTodos, revertAiTodo, leftPanelWidth, isResizing, startResize, toast, personalKpi, branchKpi, seasonalProducts, fetchCalendarData } = useCalendar();
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
          {/* Main Grid Container (Occupies full width) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            
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

                  {/* Events & AI To Dos column */}
                  <div style={{ position: 'relative' }}>
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i} style={{ height: 80, borderBottom: '1px solid #e5e7eb', boxSizing: 'border-box' }}></div>
                    ))}

                    {/* Render My To Dos / Schedules */}
                    {todayEvents.map(event => {
                      const timePartStart = event.startTime.split(' ')[1] || '09:00';
                      const timePartEnd = event.endTime.split(' ')[1] || '10:00';
                      
                      const [startHour, startMin] = timePartStart.split(':').map(Number);
                      const [endHour, endMin] = timePartEnd.split(':').map(Number);
                      
                      const startTotalMins = startHour * 60 + startMin;
                      const endTotalMins = endHour * 60 + endMin;
                      const durationMins = endTotalMins - startTotalMins;
                      
                      const startMinsFromOffset = startTotalMins - 540;
                      const topPos = (startMinsFromOffset / 60) * 80;
                      const heightPx = (durationMins / 60) * 80;
                      
                      const styleColors = colorMap[event.color] || colorMap.blue;
                      const isShortEvent = heightPx < 40;
                      
                      if (isShortEvent) {
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
                              borderRadius: 6, 
                              display: 'flex', 
                              alignItems: 'center',
                              padding: '0 12px',
                              border: `1px solid ${styleColors.border}`,
                              boxSizing: 'border-box',
                              overflow: 'hidden',
                              zIndex: 5
                            }}
                          >
                            <span style={{ fontSize: 11, fontWeight: 700, color: styleColors.text, marginRight: 8, whiteSpace: 'nowrap' }}>
                              [{timePartStart}]
                            </span>
                            <span style={{ fontSize: 11, fontWeight: 600, color: styleColors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 12 }}>
                              {event.title}
                            </span>
                            <span style={{ fontSize: 11, color: styleColors.timeText, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: 0.8 }}>
                              {event.memo}
                            </span>
                          </div>
                        );
                      }
                      
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
                            border: `1px solid ${styleColors.border}`,
                            zIndex: 5
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

                    {/* Render Integrated AI To Dos (Stripe items) */}
                    {aiTodos.map(todo => {
                      const execDate = new Date(todo.executionDate);
                      if (isNaN(execDate.getTime())) return null;
                      
                      const startHour = execDate.getHours();
                      const startMin = execDate.getMinutes();
                      
                      const isShort = todo.tag === '기념일';
                      const duration = isShort ? 15 : 60;
                      
                      const startTotalMins = startHour * 60 + startMin;
                      const startMinsFromOffset = startTotalMins - 540;
                      const topPos = (startMinsFromOffset / 60) * 80;
                      const heightPx = (duration / 60) * 80;
                      
                      const colorClass = todo.tagColor === 'tag-pink' ? 'ai-stripe-pink' :
                                         todo.tagColor === 'tag-yellow' ? 'ai-stripe-yellow' :
                                         todo.tagColor === 'tag-green' ? 'ai-stripe-green' :
                                         todo.tagColor === 'tag-lightblue' ? 'ai-stripe-lightblue' :
                                         'ai-stripe-blue';
                                         
                      const timePartStart = `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`;
                      const endTotalMins = startTotalMins + duration;
                      const timePartEnd = `${String(Math.floor(endTotalMins / 60)).padStart(2, '0')}:${String(endTotalMins % 60).padStart(2, '0')}`;
                      
                      return (
                        <div 
                          key={`ai-todo-${todo.id}`}
                          onClick={async () => {
                            if (confirm(`'${todo.content}' 추천 일정을 My To Do에 바로 추가 등록하시겠습니까?`)) {
                              // AI To Do 체크하고 My To Do 등록 처리
                              toggleAiTodo(todo.id);
                              
                              // targetDate에 알맞게 transfer 처리
                              try {
                                const currentUser = api.auth.getCurrentUser();
                                const u_id = currentUser ? currentUser.id : null;
                                if (u_id) {
                                  const yyyy = selectedDate.getFullYear();
                                  const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
                                  const dd = String(selectedDate.getDate()).padStart(2, '0');
                                  const targetDateStr = `${yyyy}-${mm}-${dd}`;
                                  await api.aiTodo.confirm(u_id, [todo.id], targetDateStr);
                                  await fetchCalendarData(); // 일정 갱신을 위해 Context 데이터 새로 불러오기
                                }
                              } catch (e) {
                                console.error(e);
                              }
                            }
                          }}
                          className={`ai-recommended-event-stripe ${colorClass}`}
                          style={{ 
                            cursor: 'pointer', 
                            position: 'absolute', 
                            top: topPos, 
                            left: 24, 
                            right: 24, 
                            height: heightPx, 
                            borderRadius: 8, 
                            display: 'flex', 
                            alignItems: 'center',
                            padding: '0 12px',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                            zIndex: 4
                          }}
                        >
                          <span style={{ fontSize: 11, fontWeight: 700, marginRight: 8, whiteSpace: 'nowrap' }}>
                            [{timePartStart}]
                          </span>
                          <span style={{ fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 12 }}>
                            {todo.content}
                          </span>
                          <span style={{ fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: 0.8 }}>
                            {todo.subText}
                          </span>
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
