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
import { formatHeaderDate, getWeekDays } from './calendarUtils';
import { useCalendar } from './CalendarContext';
import { api } from '../../api';

export default function WeeklyCalendar() {
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

  const openDetailModal = (event) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };
  const openEditModal = () => {
    setIsDetailModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
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
                           cursor: 'pointer',
                           ...(isSunday ? { color: '#ef4444' } : {}),
                           ...(isSelected ? { borderTop: '2px solid #f97316' } : {}) 
                         }}
                         onClick={() => {
                           setSelectedDate(day);
                           navigate('/daily-calendar');
                         }}
                    >
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

                        const cellAiTodos = allAiTodos.filter(todo => {
                          if (!todo.executionDate || !todo.executionDate.startsWith(cellDateStr)) return false;
                          const execDate = new Date(todo.executionDate);
                          return !isNaN(execDate.getTime()) && execDate.getHours() === hour;
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
                                const isShort = heightPx < 25;
                                
                                return (
                                  <div 
                                    key={event.id}
                                    className="event-block" 
                                    style={{ 
                                      top: topPos, 
                                      height: heightPx, 
                                      cursor: 'pointer',
                                      background: styleColors.bg,
                                      border: `1px solid ${styleColors.border}`,
                                      color: styleColors.text,
                                      fontSize: isShort ? '10px' : '11px',
                                      padding: isShort ? '0 2px' : '2px 4px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      overflow: 'hidden',
                                      whiteSpace: 'nowrap',
                                      textOverflow: 'ellipsis',
                                      boxSizing: 'border-box',
                                      lineHeight: 1,
                                      zIndex: 5
                                    }} 
                                    onClick={() => openDetailModal(event)}
                                  >
                                    {event.title}
                                  </div>
                                );
                              })}

                              {cellAiTodos.map(todo => {
                                const execDate = new Date(todo.executionDate);
                                const sMin = execDate.getMinutes();
                                const isShort = todo.tag === '기념일';
                                const durationMins = isShort ? 15 : 60;
                                
                                // 1 hour cell = 60px height
                                const topPos = (sMin / 60) * 60;
                                const heightPx = (durationMins / 60) * 60;
                                
                                const colorClass = todo.tagColor === 'tag-pink' ? 'ai-stripe-pink' :
                                                   todo.tagColor === 'tag-yellow' ? 'ai-stripe-yellow' :
                                                   todo.tagColor === 'tag-green' ? 'ai-stripe-green' :
                                                   todo.tagColor === 'tag-lightblue' ? 'ai-stripe-lightblue' :
                                                   'ai-stripe-blue';
                                
                                return (
                                  <div 
                                    key={`ai-todo-${todo.id}`}
                                    className={`ai-recommended-event-stripe ${colorClass}`}
                                    style={{ 
                                      position: 'absolute',
                                      top: topPos, 
                                      height: heightPx, 
                                      left: 2,
                                      right: 2,
                                      cursor: 'pointer',
                                      borderRadius: 4,
                                      fontSize: '10px',
                                      padding: '2px 4px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      overflow: 'hidden',
                                      whiteSpace: 'nowrap',
                                      textOverflow: 'ellipsis',
                                      boxSizing: 'border-box',
                                      lineHeight: 1,
                                      zIndex: 4
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
                                    {todo.content}
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
