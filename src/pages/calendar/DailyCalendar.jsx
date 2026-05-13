import { useState } from 'react';
import { Link } from "react-router-dom";
import { Calendar as CalendarIcon, TrendingUp, Users, Bell, Plus, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import "./CalendarNew.css";
import ScheduleRegistrationModal from "./ScheduleRegistrationModal";
import ScheduleDetailModal from "./ScheduleDetailModal";
import ScheduleEditModal from "./ScheduleEditModal";
import { generateMiniCalendar, formatMonthYear, formatFullHeaderDate, DEMO_EVENTS } from './calendarUtils';

export default function DailyCalendar() {
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
                
                {generateMiniCalendar(miniCalMonth.year, miniCalMonth.month, selectedDate, 'day').map((d, i) => (
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
          <div className="cal-grid-container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="cal-grid-header">
              <span style={{ fontSize: 18, fontWeight: 600 }}>{formatFullHeaderDate(selectedDate)}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <div className="cal-view-tabs">
                  <Link to="/daily-calendar" className="cal-view-tab active">Day</Link>
                  <Link to="/weekly-calendar" className="cal-view-tab">Week</Link>
                  <Link to="/monthly-calendar" className="cal-view-tab">Month</Link>
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
                  {Array.from({ length: 24 }).map((_, i) => {
                    const hour = i;
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
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} style={{ height: 80, borderBottom: '1px solid #e5e7eb', boxSizing: 'border-box' }}></div>
                  ))}

                  {selectedDate.getFullYear() === 2026 && selectedDate.getMonth() === 4 && selectedDate.getDate() === 9 && (
                    <>
                      {/* Absolute positioned events */}
                      <div 
                        onClick={() => openDetailModal(DEMO_EVENTS[0])}
                        style={{ cursor: 'pointer', position: 'absolute', top: 650, left: 24, right: 24, height: 60, background: '#dcfce7', borderRadius: 8, display: 'flex', border: '1px solid #bbf7d0' }}
                      >
                        <div style={{ width: '30%', padding: 12, borderRight: '1px solid #bbf7d0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#166534' }}>이OO 고객님 미팅</span>
                          <span style={{ fontSize: 11, color: '#15803d' }}>08:00 ~ 09:00</span>
                        </div>
                        <div style={{ flex: 1, padding: 12, display: 'flex', alignItems: 'center', fontSize: 13, color: '#166534', whiteSpace: 'pre-line' }}>{DEMO_EVENTS[0].memo}</div>
                      </div>

                      <div 
                        onClick={() => openDetailModal(DEMO_EVENTS[1])}
                        style={{ cursor: 'pointer', position: 'absolute', top: 970, left: 24, right: 24, height: 60, background: '#e0f2fe', borderRadius: 8, display: 'flex', border: '1px solid #bae6fd' }}
                      >
                        <div style={{ width: '30%', padding: 12, borderRight: '1px solid #bae6fd', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#0369a1' }}>점심 약속</span>
                          <span style={{ fontSize: 11, color: '#075985' }}>12:00 ~ 13:00</span>
                        </div>
                        <div style={{ flex: 1, padding: 12, display: 'flex', alignItems: 'center', fontSize: 13, color: '#0369a1', whiteSpace: 'pre-line' }}>{DEMO_EVENTS[1].memo}</div>
                      </div>

                      <div 
                        onClick={() => openDetailModal(DEMO_EVENTS[2])}
                        style={{ cursor: 'pointer', position: 'absolute', top: 1090, left: 24, right: 24, height: 120, background: '#ffedd5', borderRadius: 8, display: 'flex', border: '1px solid #fed7aa' }}
                      >
                        <div style={{ width: '30%', padding: 12, borderRight: '1px solid #fed7aa', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#9a3412' }}>내부 회의</span>
                          <span style={{ fontSize: 11, color: '#c2410c' }}>13:30 ~ 15:30</span>
                        </div>
                        <div style={{ flex: 1, padding: 12, display: 'flex', alignItems: 'center', fontSize: 13, color: '#9a3412', whiteSpace: 'pre-line' }}>{DEMO_EVENTS[2].memo}</div>
                      </div>
                    </>
                  )}

                </div>
              </div>
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
