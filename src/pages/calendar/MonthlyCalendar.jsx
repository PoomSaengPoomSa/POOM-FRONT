import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, LogOut, CheckCircle2 } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import "./CalendarNew.css";
import ScheduleRegistrationModal from "./ScheduleRegistrationModal";
import ScheduleDetailModal from "./ScheduleDetailModal";
import ScheduleEditModal from "./ScheduleEditModal";
import AiTodoDetailModal from "./AiTodoDetailModal";
import SeasonProductModal from "./SeasonProductModal";
import { generateMiniCalendar, formatMonthYear } from './calendarUtils';
import { useCalendar } from './CalendarContext';
import { api } from '../../api';

export default function MonthlyCalendar() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAiTodoDetailOpen, setIsAiTodoDetailOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const { events, selectedDate, setSelectedDate, aiTodos, allAiTodos, toggleAiTodo, transferCheckedAiTodos, revertAiTodo, leftPanelWidth, isResizing, startResize, toast, personalKpi, branchKpi, seasonalProducts, fetchCalendarData } = useCalendar();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentMonth, setCurrentMonth] = useState({ year: selectedDate.getFullYear(), month: selectedDate.getMonth() });

  const currentUser = (() => {
    try {
      const userStr = localStorage.getItem("currentUser");
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  })();

  useEffect(() => {
    setCurrentMonth({ year: selectedDate.getFullYear(), month: selectedDate.getMonth() });
  }, [selectedDate]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setCurrentMonth({ year: date.getFullYear(), month: date.getMonth() });
  };

  const openDetailModal = (event) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };
  const openEditModal = () => {
    setIsDetailModalOpen(false);
    setIsEditModalOpen(true);
  };

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

  const calendarDays = generateMiniCalendar(currentMonth.year, currentMonth.month, selectedDate, 'month');

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
                  {formatMonthYear(currentMonth.year, currentMonth.month)}
                  <button className="today-btn" onClick={() => { setSelectedDate(new Date()); navigate('/daily-calendar'); }}>Today</button>
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  <div className="cal-view-tabs">
                    <Link to="/monthly-calendar" className="cal-view-tab active">Month</Link>
                    <Link to="/weekly-calendar" className="cal-view-tab">Week</Link>
                    <Link to="/daily-calendar" className="cal-view-tab">Day</Link>
                  </div>
                  <div className="cal-grid-nav">
                    <ChevronLeft size={20} cursor="pointer" onClick={handlePrevMonth} />
                    <ChevronRight size={20} cursor="pointer" onClick={handleNextMonth} />
                  </div>
                </div>
              </div>

              <div className="monthly-grid">
                {/* Header Row */}
                <div className="monthly-header-cell">Sun</div>
                <div className="monthly-header-cell">Mon</div>
                <div className="monthly-header-cell">Tue</div>
                <div className="monthly-header-cell">Wed</div>
                <div className="monthly-header-cell">Thu</div>
                <div className="monthly-header-cell">Fri</div>
                <div className="monthly-header-cell">Sat</div>

                {/* Grid Cells */}
                {calendarDays.map((d, i) => {
                  const cellDate = d.date;
                  const yyyy = cellDate.getFullYear();
                  const mm = String(cellDate.getMonth() + 1).padStart(2, '0');
                  const dd = String(cellDate.getDate()).padStart(2, '0');
                  const cellDateStr = `${yyyy}-${mm}-${dd}`;
                  
                  const cellEvents = events.filter(e => e.startTime.startsWith(cellDateStr));

                  const cellAiTodos = allAiTodos.filter(todo => {
                    if (!todo.executionDate || !todo.executionDate.startsWith(cellDateStr)) return false;
                    return true;
                  });

                  const today = new Date();
                  const isToday = cellDate.getDate() === today.getDate() &&
                                  cellDate.getMonth() === today.getMonth() &&
                                  cellDate.getFullYear() === today.getFullYear();

                  return (
                    <div key={i} className={`monthly-day-cell ${isToday ? 'today' : ''}`} style={i >= 35 ? { borderBottom: 'none' } : {}}>
                      <div 
                        className={`monthly-day-number ${d.muted ? 'muted' : ''} ${isToday ? 'today' : ''}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedDate(cellDate);
                          navigate('/daily-calendar');
                        }}
                      >
                        {String(d.day).padStart(2, '0')}
                      </div>
                      {cellEvents.map(event => {
                        const timeStr = event.startTime.split(' ')[1] || '';
                        const styleColors = colorMap[event.color] || colorMap.blue;
                        return (
                          <div 
                            key={event.id} 
                            className="monthly-event" 
                            style={{ 
                              backgroundColor: styleColors.bg, 
                              color: styleColors.text, 
                              border: `1px solid ${styleColors.border}`,
                              cursor: 'pointer' 
                            }} 
                            onClick={() => openDetailModal(event)}
                          >
                            <span style={{ fontWeight: 600, marginRight: '4px', flexShrink: 0 }}>{timeStr}</span>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.title}</span>
                          </div>
                        );
                      })}

                      {cellAiTodos.map(todo => {
                        const colorClass = todo.tagColor === 'tag-pink' ? 'ai-stripe-pink' :
                                           todo.tagColor === 'tag-yellow' ? 'ai-stripe-yellow' :
                                           todo.tagColor === 'tag-green' ? 'ai-stripe-green' :
                                           todo.tagColor === 'tag-lightblue' ? 'ai-stripe-lightblue' :
                                           'ai-stripe-blue';
                        return (
                          <div 
                            key={`ai-todo-${todo.id}`} 
                            className={`monthly-event ai-recommended-event-stripe ${colorClass}`} 
                            style={{ 
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis'
                            }} 
                            onClick={async (ev) => {
                              ev.stopPropagation();
                              if (confirm(`'${todo.content}' 추천 일정을 My To Do에 바로 추가 등록하시겠습니까?`)) {
                                toggleAiTodo(todo.id);
                                try {
                                  const currentUser = api.auth.getCurrentUser();
                                  const u_id = currentUser ? currentUser.id : null;
                                  if (u_id) {
                                    await api.aiTodo.confirm(u_id, [todo.id], cellDateStr);
                                    await fetchCalendarData();
                                  }
                                } catch (e) {
                                  console.error(e);
                                }
                              }
                            }}
                          >
                            <span style={{ fontWeight: 600, marginRight: '4px', flexShrink: 0 }}>[{todo.tag}]</span>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{todo.content}</span>
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
