import { useState } from 'react';
import { Link } from "react-router-dom";
import { Calendar as CalendarIcon, TrendingUp, Users, Bell, Plus, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import "./CalendarNew.css";
import ScheduleRegistrationModal from "./ScheduleRegistrationModal";

const miniCalDays = [
  { day: 29, muted: true }, { day: 30, muted: true }, { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 }, { day: 5 },
  { day: 6, selected: true }, { day: 7, selected: true }, { day: 8, selected: true }, { day: 9, selected: true }, { day: 10, selected: true }, { day: 11, selected: true }, { day: 12, selected: true },
  { day: 13 }, { day: 14 }, { day: 15 }, { day: 16 }, { day: 17 }, { day: 18 }, { day: 19 },
  { day: 20 }, { day: 21 }, { day: 22 }, { day: 23 }, { day: 24 }, { day: 25 }, { day: 26 },
  { day: 27 }, { day: 28 }, { day: 29 }, { day: 30 }, { day: 31 }, { day: 1, muted: true }, { day: 2, muted: true },
];

export default function WeeklyCalendar() {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

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
      <div className="cal-main">
        <div className="cal-header">
          <h1 className="cal-title">Calendar</h1>
          <div className="cal-view-tabs">
            <Link to="/daily-calendar" className="cal-view-tab">Day</Link>
            <Link to="/weekly-calendar" className="cal-view-tab active">Week</Link>
            <Link to="/monthly-calendar" className="cal-view-tab">Month</Link>
          </div>
        </div>

        <div className="cal-content-row">
          {/* Left Panel */}
          <div className="cal-left-panel">
            <button className="cal-add-btn" onClick={() => setIsScheduleModalOpen(true)}>
              <Plus size={18} /> 일정 등록
            </button>

            <div className="cal-mini-calendar">
              <div className="cal-mini-header">
                <span>May 2, 2026</span>
                <div style={{ display: 'flex', gap: 8, color: '#94a3b8' }}>
                  <ChevronLeft size={16} cursor="pointer" />
                  <ChevronRight size={16} cursor="pointer" />
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
                
                {miniCalDays.map((d, i) => (
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
              <span style={{ fontSize: 14, fontWeight: 500 }}>May 9, 2026</span>
              <div className="cal-grid-nav">
                <ChevronLeft size={20} />
                <ChevronRight size={20} />
              </div>
            </div>

            <div className="weekly-grid">
              {/* Header Row */}
              <div className="weekly-header-cell" style={{ borderRight: 'none' }}></div>
              <div className="weekly-header-cell today" style={{ color: '#ef4444' }}><span>Sun</span><strong>06</strong></div>
              <div className="weekly-header-cell"><span>Mon</span><strong>07</strong></div>
              <div className="weekly-header-cell"><span>Tue</span><strong>08</strong></div>
              <div className="weekly-header-cell" style={{ borderTop: '2px solid #f97316' }}><span>Wed</span><strong style={{ color: '#f97316' }}>09</strong></div>
              <div className="weekly-header-cell"><span>Thu</span><strong>10</strong></div>
              <div className="weekly-header-cell"><span>Fri</span><strong>11</strong></div>
              <div className="weekly-header-cell"><span>Sat</span><strong>12</strong></div>

              {/* Time Slots (08:00 to 18:00) */}
              {Array.from({ length: 11 }).map((_, i) => {
                const hour = 8 + i;
                const timeStr = `${hour < 10 ? `0${hour}` : hour}:00`;
                
                return (
                  <>
                    <div className="weekly-time-col">
                      <div className="weekly-time-cell">{timeStr}</div>
                    </div>
                    {/* 7 Days Columns per row */}
                    {Array.from({ length: 7 }).map((_, dayIdx) => (
                      <div className="weekly-day-col" key={dayIdx}>
                        <div className="weekly-grid-cell">
                          {/* Events */}
                          {hour === 8 && dayIdx === 3 && (
                             <div className="event-block event-green" style={{ top: 30, height: 50 }}>이OO 고객님 미팅</div>
                          )}
                          {hour === 12 && dayIdx === 3 && (
                             <div className="event-block event-blue" style={{ top: 0, height: 50 }}>점심 약속</div>
                          )}
                          {hour === 13 && dayIdx === 3 && (
                             <div className="event-block event-orange" style={{ top: 30, height: 100 }}>내부 회의</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <ScheduleRegistrationModal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} />
    </div>
  );
}
