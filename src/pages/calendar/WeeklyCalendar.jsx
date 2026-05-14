import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Calendar as CalendarIcon, TrendingUp, Users, Bell, Plus, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import "./CalendarNew.css";
import ScheduleRegistrationModal from "./ScheduleRegistrationModal";
import ScheduleDetailModal from "./ScheduleDetailModal";
import ScheduleEditModal from "./ScheduleEditModal";
import { generateMiniCalendar, formatMonthYear, formatHeaderDate, getWeekDays } from './calendarUtils';
import { useCalendar } from './CalendarContext';

export default function WeeklyCalendar() {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { events, selectedDate, setSelectedDate } = useCalendar();
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
    return events.filter(e => e.startTime.startsWith(targetDateStr));
  };

  const todayEvents = getTodayEvents();

  return (
    <div className="cal-layout">
      {/* Sidebar */}
      <div className="cal-sidebar">
        <div className="cal-logo">
          <div className="cal-logo-circle"></div>
        </div>
        
        <div className="cal-menu">
          <Link to="/daily-calendar" className="cal-menu-item active">
            <CalendarIcon size={20} />
            캘린더
          </Link>
          <Link to="/trend-archive" className="cal-menu-item">
            <TrendingUp size={20} />
            트렌드 아카이브
          </Link>
          <Link to="/customer-management-registration-1" className="cal-menu-item">
            <Users size={20} />
            고객관리
          </Link>
          <Link to="/news-bucket-bucket" className="cal-menu-item">
            <Bell size={20} />
            뉴스 버킷
          </Link>
        </div>

        <div className="cal-profile">
          <img src="https://i.pravatar.cc/150?img=11" alt="Profile" />
          <div className="cal-profile-info">
            <span className="cal-profile-name">김재욱</span>
            <span className="cal-profile-role">Private Banker</span>
          </div>
          <LogOut onClick={() => window.location.href='/login-pb'} size={16} color="#94a3b8" style={{ marginLeft: 'auto', cursor: 'pointer' }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="cal-main" style={{ paddingTop: 32 }}>
        <div className="cal-content-row">
          {/* Left Panel */}
          <div className="cal-left-panel">
            <button className="cal-add-btn" onClick={() => setIsScheduleModalOpen(true)}>
              <Plus size={18} /> 일정 등록
            </button>

            <div className="cal-mini-calendar mode-week">
              <div className="cal-mini-header">
                <span>{formatMonthYear(miniCalMonth.year, miniCalMonth.month)}</span>
                <div style={{ display: 'flex', gap: 8, color: '#94a3b8' }}>
                  <ChevronLeft size={16} cursor="pointer" onClick={handlePrevMonth} />
                  <ChevronRight size={16} cursor="pointer" onClick={handleNextMonth} />
                </div>
              </div>
              <div className="cal-mini-day-names" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center', fontSize: 12, marginBottom: 8 }}>
                <span className="cal-mini-day-name">S</span>
                <span className="cal-mini-day-name">M</span>
                <span className="cal-mini-day-name">T</span>
                <span className="cal-mini-day-name">W</span>
                <span className="cal-mini-day-name">T</span>
                <span className="cal-mini-day-name">F</span>
                <span className="cal-mini-day-name">S</span>
              </div>
              <div className="cal-mini-grid">
                
                {generateMiniCalendar(miniCalMonth.year, miniCalMonth.month, selectedDate, 'week').map((d, i) => {
                  const isTarget = d.date.getFullYear() === selectedDate.getFullYear() && 
                                   d.date.getMonth() === selectedDate.getMonth() && 
                                   d.date.getDate() === selectedDate.getDate();
                  return (
                    <div key={i} 
                         className={`cal-mini-day ${d.muted ? 'muted' : ''} ${d.selected ? 'selected' : ''} ${isTarget ? 'target-date' : ''}`}
                         onClick={() => handleDateClick(d.date)}>
                      {d.day}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="cal-schedule-title">오늘의 일정</h3>
              <div className="cal-today-schedule">
                {todayEvents.length === 0 ? (
                  <div style={{ fontSize: 13, color: '#94a3b8', padding: '12px 0' }}>등록된 일정이 없습니다.</div>
                ) : (
                  todayEvents.map(e => {
                    const timeStr = `${e.startTime.split(' ')[1]} ~ ${e.endTime.split(' ')[1]}`;
                    return (
                      <div className="cal-schedule-item" key={e.id}>
                        <span className="cal-schedule-time">{timeStr}</span>
                        <span className="cal-schedule-desc">{e.title}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <button className="cal-my-schedule-btn">My Schedule</button>
          </div>

          {/* Grid Container */}
          <div className="cal-grid-container">
            <div className="cal-grid-header">
              <span style={{ fontSize: 18, fontWeight: 600 }}>{formatHeaderDate(weekDays[0], weekDays[6])}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <div className="cal-view-tabs">
                  <Link to="/daily-calendar" className="cal-view-tab">Day</Link>
                  <Link to="/weekly-calendar" className="cal-view-tab active">Week</Link>
                  <Link to="/monthly-calendar" className="cal-view-tab">Month</Link>
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

              {/* Time Slots (00:00 to 24:00) */}
              {Array.from({ length: 24 }).map((_, i) => {
                const hour = i;
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
      <ScheduleRegistrationModal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} />
      <ScheduleDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} onEdit={openEditModal} event={selectedEvent} />
      <ScheduleEditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} event={selectedEvent} />
    </div>
  );
}
