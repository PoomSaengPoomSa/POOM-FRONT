import { useState } from 'react';
import { Link } from "react-router-dom";
import { Calendar as CalendarIcon, TrendingUp, Users, Bell, Plus, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import "./CalendarNew.css";
import ScheduleRegistrationModal from "./ScheduleRegistrationModal";
import ScheduleDetailModal from "./ScheduleDetailModal";
import ScheduleEditModal from "./ScheduleEditModal";
import { generateMiniCalendar, formatMonthYear, formatHeaderDate, getWeekDays, DEMO_EVENTS } from './calendarUtils';

export default function WeeklyCalendar() {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 4, 9)); // May 9, 2026
  const [miniCalMonth, setMiniCalMonth] = useState({ year: 2026, month: 4 }); // May 2026

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

            <div className="cal-mini-calendar">
              <div className="cal-mini-header">
                <span>{formatMonthYear(miniCalMonth.year, miniCalMonth.month)}</span>
                <div style={{ display: 'flex', gap: 8, color: '#94a3b8' }}>
                  <ChevronLeft size={16} cursor="pointer" onClick={handlePrevMonth} />
                  <ChevronRight size={16} cursor="pointer" onClick={handleNextMonth} />
                </div>
              </div>
              <div className="cal-mini-grid">
                <span className="cal-mini-day-name">S</span>
                <span className="cal-mini-day-name">S</span>
                <span className="cal-mini-day-name">M</span>
                <span className="cal-mini-day-name">T</span>
                <span className="cal-mini-day-name">W</span>
                <span className="cal-mini-day-name">T</span>
                <span className="cal-mini-day-name">F</span>
                
                {generateMiniCalendar(miniCalMonth.year, miniCalMonth.month, selectedDate, 'week').map((d, i) => (
                  <div key={i} 
                       className={`cal-mini-day ${d.muted ? 'muted' : ''} ${d.selected ? 'selected' : ''}`}
                       onClick={() => handleDateClick(d.date)}>
                    {d.day}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="cal-schedule-title">오늘의 일정</h3>
              <div className="cal-today-schedule">
                <div className="cal-schedule-item">
                  <span className="cal-schedule-time">08:00 ~ 09:00</span>
                  <span className="cal-schedule-desc">이OO 고객님 미팅</span>
                </div>
                <div className="cal-schedule-item">
                  <span className="cal-schedule-time">12:00 ~ 13:00</span>
                  <span className="cal-schedule-desc">점심 약속</span>
                </div>
                <div className="cal-schedule-item">
                  <span className="cal-schedule-time">13:30 ~ 14:30</span>
                  <span className="cal-schedule-desc">내부 회의</span>
                </div>
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
                    {Array.from({ length: 7 }).map((_, dayIdx) => (
                      <div className="weekly-day-col" key={dayIdx}>
                        <div className="weekly-grid-cell">
                          {/* Demo Events - only show on May 9, 2026 */}
                          {hour === 8 && weekDays[dayIdx].getFullYear() === 2026 && weekDays[dayIdx].getMonth() === 4 && weekDays[dayIdx].getDate() === 9 && (
                             <div className="event-block event-green" style={{ top: 0, height: 60, cursor: 'pointer' }} onClick={() => openDetailModal(DEMO_EVENTS[0])}>이OO 고객님 미팅</div>
                          )}
                          {hour === 12 && weekDays[dayIdx].getFullYear() === 2026 && weekDays[dayIdx].getMonth() === 4 && weekDays[dayIdx].getDate() === 9 && (
                             <div className="event-block event-blue" style={{ top: 0, height: 60, cursor: 'pointer' }} onClick={() => openDetailModal(DEMO_EVENTS[1])}>점심 약속</div>
                          )}
                          {hour === 13 && weekDays[dayIdx].getFullYear() === 2026 && weekDays[dayIdx].getMonth() === 4 && weekDays[dayIdx].getDate() === 9 && (
                             <div className="event-block event-orange" style={{ top: 30, height: 120, cursor: 'pointer' }} onClick={() => openDetailModal(DEMO_EVENTS[2])}>내부 회의</div>
                          )}
                        </div>
                      </div>
                    ))}
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
