import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Calendar as CalendarIcon, TrendingUp, Users, Bell, Plus, ChevronLeft, ChevronRight, LogOut, User, FileText, ClipboardList, Settings } from "lucide-react";
import "./CalendarNew.css";
import ScheduleRegistrationModal from "./ScheduleRegistrationModal";
import ScheduleDetailModal from "./ScheduleDetailModal";
import ScheduleEditModal from "./ScheduleEditModal";
import { generateMiniCalendar, formatMonthYear } from './calendarUtils';
import { useCalendar } from './CalendarContext';

export default function MonthlyCalendar() {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { events, selectedDate, setSelectedDate } = useCalendar();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentMonth, setCurrentMonth] = useState({ year: selectedDate.getFullYear(), month: selectedDate.getMonth() });

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

  const getTodayEvents = () => {
    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dd = String(selectedDate.getDate()).padStart(2, '0');
    const targetDateStr = `${yyyy}-${mm}-${dd}`;
    return events.filter(e => e.startTime.startsWith(targetDateStr));
  };

  const todayEvents = getTodayEvents();

  const badgeColorMap = { yellow: '#eab308', blue: '#3b82f6', pink: '#ec4899', purple: '#a855f7', lightblue: '#06b6d4', orange: '#f97316', green: '#22c55e' };

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
          <Link to="/settings" className="cal-menu-item">
            <Settings size={20} />
            설정
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

            <div className="cal-mini-calendar mode-month">
              <div className="cal-mini-header">
                <span>{formatMonthYear(currentMonth.year, currentMonth.month)}</span>
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
                
                {generateMiniCalendar(currentMonth.year, currentMonth.month, selectedDate, 'month').map((d, i) => (
                  <div key={i} 
                       className={`cal-mini-day ${d.muted ? 'muted' : ''} ${d.selected ? 'selected' : ''}`}
                       onClick={() => handleDateClick(d.date)}>
                    {d.day}
                  </div>
                ))}
              </div>
            </div>

            <div className="cal-today-schedule-container">
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
              <span style={{ fontSize: 18, fontWeight: 600 }}>{formatMonthYear(currentMonth.year, currentMonth.month)}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <div className="cal-view-tabs">
                  <Link to="/daily-calendar" className="cal-view-tab">Day</Link>
                  <Link to="/weekly-calendar" className="cal-view-tab">Week</Link>
                  <Link to="/monthly-calendar" className="cal-view-tab active">Month</Link>
                </div>
                <div className="cal-grid-nav">
                  <ChevronLeft size={20} cursor="pointer" onClick={() => {
                    setCurrentMonth(prev => {
                      let year = prev.year;
                      let month = prev.month - 1;
                      if (month < 0) {
                        month = 11;
                        year -= 1;
                      }
                      return { year, month };
                    });
                  }} />
                  <ChevronRight size={20} cursor="pointer" onClick={() => {
                    setCurrentMonth(prev => {
                      let year = prev.year;
                      let month = prev.month + 1;
                      if (month > 11) {
                        month = 0;
                        year += 1;
                      }
                      return { year, month };
                    });
                  }} />
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

                return (
                  <div key={i} className={`monthly-day-cell`} style={i >= 35 ? { borderBottom: 'none' } : {}}>
                    <div className={`monthly-day-number ${d.muted ? 'muted' : ''}`}>
                      {String(d.day).padStart(2, '0')}
                    </div>
                    {cellEvents.map(event => {
                      const timeStr = event.startTime.split(' ')[1] || '';
                      const bgColor = badgeColorMap[event.color] || '#3b82f6';
                      return (
                        <div 
                          key={event.id} 
                          className="monthly-event" 
                          style={{ backgroundColor: bgColor, cursor: 'pointer' }} 
                          onClick={() => openDetailModal(event)}
                        >
                          {timeStr} {event.title}
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
