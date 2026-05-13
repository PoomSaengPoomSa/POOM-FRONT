import { useState } from 'react';
import { Link } from "react-router-dom";
import { Calendar as CalendarIcon, TrendingUp, Users, Bell, Plus, ChevronLeft, ChevronRight, LogOut, User, FileText, ClipboardList } from "lucide-react";
import "./CalendarNew.css";
import ScheduleRegistrationModal from "./ScheduleRegistrationModal";
import ScheduleDetailModal from "./ScheduleDetailModal";
import ScheduleEditModal from "./ScheduleEditModal";
import { generateMiniCalendar, formatMonthYear, DEMO_EVENTS } from './calendarUtils';

export default function MonthlyCalendar() {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentMonth, setCurrentMonth] = useState({ year: 2026, month: 4 }); // May 2026

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

  const calendarDays = generateMiniCalendar(currentMonth.year, currentMonth.month, null, 'month');

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
                <span>{formatMonthYear(currentMonth.year, currentMonth.month)}</span>
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
                
                {calendarDays.map((d, i) => (
                  <div key={i} className={`cal-mini-day ${d.muted ? 'muted' : ''} ${d.selected ? 'selected' : ''}`}>
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
                const isDemoDate9 = currentMonth.year === 2026 && currentMonth.month === 4 && d.day === 9 && !d.muted;

                return (
                  <div key={i} className={`monthly-day-cell`} style={i >= 35 ? { borderBottom: 'none' } : {}}>
                    <div className={`monthly-day-number ${d.muted ? 'muted' : ''}`}>
                      {String(d.day).padStart(2, '0')}
                    </div>
                    {/* Demo Events injected for specific dates in May 2026 to match original UI */}
                    {isDemoDate9 && (
                      <>
                        <div className="monthly-event" style={{ backgroundColor: '#22c55e', cursor: 'pointer' }} onClick={() => openDetailModal(DEMO_EVENTS[0])}>08:00 이OO 고객님 미팅</div>
                        <div className="monthly-event" style={{ backgroundColor: '#3b82f6', cursor: 'pointer' }} onClick={() => openDetailModal(DEMO_EVENTS[1])}>12:00 점심 약속</div>
                        <div className="monthly-event" style={{ backgroundColor: '#fb923c', cursor: 'pointer' }} onClick={() => openDetailModal(DEMO_EVENTS[2])}>13:30 내부 회의</div>
                      </>
                    )}
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
