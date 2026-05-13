import { useState } from 'react';
import { Link } from "react-router-dom";
import { Calendar as CalendarIcon, TrendingUp, Users, Bell, Plus, ChevronLeft, ChevronRight, LogOut, User, FileText, ClipboardList } from "lucide-react";
import "./CalendarNew.css";
import ScheduleRegistrationModal from "./ScheduleRegistrationModal";

const miniCalDays = [
  { day: 29, muted: true }, { day: 30, muted: true }, { day: 1 }, { day: 2 }, { day: 3, selected: true }, { day: 4 }, { day: 5 },
  { day: 6 }, { day: 7 }, { day: 8 }, { day: 9 }, { day: 10 }, { day: 11 }, { day: 12 },
  { day: 13 }, { day: 14 }, { day: 15 }, { day: 16 }, { day: 17 }, { day: 18 }, { day: 19 },
  { day: 20 }, { day: 21 }, { day: 22 }, { day: 23 }, { day: 24 }, { day: 25 }, { day: 26 },
  { day: 27 }, { day: 28 }, { day: 29 }, { day: 30 }, { day: 31 }, { day: 1, muted: true }, { day: 2, muted: true },
];

export default function MonthlyCalendar() {
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
            <Link to="/weekly-calendar" className="cal-view-tab">Week</Link>
            <Link to="/monthly-calendar" className="cal-view-tab active">Month</Link>
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
                <div className="cal-schedule-item" style={{ alignItems: 'center' }}>
                  <span className="cal-schedule-time" style={{ fontSize: 11 }}>10:00 AM</span>
                  <span className="cal-schedule-desc" style={{ fontSize: 14 }}>김OO 고객님 미팅</span>
                </div>
                <div className="cal-schedule-item" style={{ alignItems: 'center' }}>
                  <span className="cal-schedule-time" style={{ fontSize: 11 }}>11:00 AM</span>
                  <span className="cal-schedule-desc" style={{ fontSize: 14 }}>세미나 참석</span>
                </div>
                <div className="cal-schedule-item" style={{ alignItems: 'center' }}>
                  <span className="cal-schedule-time" style={{ fontSize: 11 }}>13:30 AM</span>
                  <span className="cal-schedule-desc" style={{ fontSize: 14 }}>박OO 고객님 미팅</span>
                </div>
                <div className="cal-schedule-item" style={{ borderBottom: 'none', alignItems: 'center' }}>
                  <span className="cal-schedule-time" style={{ fontSize: 11 }}>15:00 AM</span>
                  <span className="cal-schedule-desc" style={{ fontSize: 14 }}>이OO 고객님 미팅</span>
                </div>
              </div>
            </div>

            <button className="cal-my-schedule-btn">My Schedule</button>
          </div>

          {/* Grid Container */}
          <div className="cal-grid-container" style={{ position: 'relative', overflow: 'visible' }}>
            
            {/* Popover */}
            <div className="monthly-popover" style={{ top: 120 }}>
              <div className="popover-header">
                <div className="popover-avatar"></div>
                <div className="popover-info">
                  <h4>김OO</h4>
                  <p>abcdefg@naver.com<br/>010-0000-0000</p>
                </div>
                <ChevronLeft size={20} color="#94a3b8" style={{ position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)', background: 'white', borderRadius: '50%', border: '1px solid #e5e7eb', cursor: 'pointer' }} />
              </div>

              <div className="popover-menu-label">MAIN</div>
              <div className="popover-menu-item">
                <User size={18} color="#64748b" /> 프로필 <ChevronRight size={16} color="#cbd5e1" style={{ marginLeft: 'auto' }} />
              </div>
              <div className="popover-menu-item">
                <FileText size={18} color="#64748b" /> 방문 브리핑
              </div>
              <div className="popover-menu-item">
                <ClipboardList size={18} color="#64748b" /> 메모 어시스턴트
              </div>
            </div>

            <div className="cal-grid-header">
              <span style={{ fontSize: 14, fontWeight: 500 }}>May 2, 2026</span>
              <div className="cal-grid-nav">
                <ChevronLeft size={20} />
                <ChevronRight size={20} />
              </div>
            </div>

            <div className="monthly-grid">
              {/* Header Row */}
              <div className="monthly-header-cell">Sun</div>
              <div className="monthly-header-cell">Mon</div>
              <div className="monthly-header-cell">Tue</div>
              <div className="monthly-header-cell" style={{ borderTop: '2px solid #f97316' }}>Wed</div>
              <div className="monthly-header-cell">Thu</div>
              <div className="monthly-header-cell">Fri</div>
              <div className="monthly-header-cell">Sat</div>

              {/* Row 1 */}
              <div className="monthly-day-cell"><div className="monthly-day-number muted">29</div></div>
              <div className="monthly-day-cell"><div className="monthly-day-number muted">30</div></div>
              <div className="monthly-day-cell"><div className="monthly-day-number">01</div></div>
              <div className="monthly-day-cell selected">
                <div className="monthly-day-number">02</div>
                <div className="monthly-event" style={{ backgroundColor: '#f472b6' }}>김OO 고객님 미팅</div>
                <div className="monthly-event" style={{ backgroundColor: '#3b82f6' }}>세미나 참석</div>
              </div>
              <div className="monthly-day-cell">
                <div className="monthly-day-number">03</div>
                <div className="monthly-event" style={{ backgroundColor: '#22c55e' }}>이OO 고객님 미팅</div>
                <div className="monthly-event" style={{ backgroundColor: '#fb923c' }}>내부 회의</div>
              </div>
              <div className="monthly-day-cell"><div className="monthly-day-number">04</div></div>
              <div className="monthly-day-cell"><div className="monthly-day-number">05</div></div>

              {/* Row 2 */}
              <div className="monthly-day-cell"><div className="monthly-day-number">08</div></div>
              <div className="monthly-day-cell"><div className="monthly-day-number">09</div></div>
              <div className="monthly-day-cell"><div className="monthly-day-number">10</div></div>
              <div className="monthly-day-cell"><div className="monthly-day-number">11</div></div>
              <div className="monthly-day-cell"><div className="monthly-day-number">12</div></div>
              <div className="monthly-day-cell"><div className="monthly-day-number">13</div></div>
              <div className="monthly-day-cell"><div className="monthly-day-number">14</div></div>

              {/* Row 3 */}
              <div className="monthly-day-cell"><div className="monthly-day-number">15</div></div>
              <div className="monthly-day-cell">
                <div className="monthly-day-number">16</div>
                <div className="monthly-event" style={{ backgroundColor: '#fb923c' }}>Victory day</div>
              </div>
              <div className="monthly-day-cell"><div className="monthly-day-number">17</div></div>
              <div className="monthly-day-cell"><div className="monthly-day-number">18</div></div>
              <div className="monthly-day-cell"><div className="monthly-day-number">19</div></div>
              <div className="monthly-day-cell"><div className="monthly-day-number">20</div></div>
              <div className="monthly-day-cell"><div className="monthly-day-number">21</div></div>

              {/* Row 4 */}
              <div className="monthly-day-cell"><div className="monthly-day-number">22</div></div>
              <div className="monthly-day-cell"><div className="monthly-day-number">23</div></div>
              <div className="monthly-day-cell"><div className="monthly-day-number">24</div></div>
              <div className="monthly-day-cell">
                <div className="monthly-day-number" style={{ color: '#ef4444' }}>25</div>
                <div className="monthly-event" style={{ backgroundColor: '#06b6d4' }}>Christmas Day</div>
              </div>
              <div className="monthly-day-cell"><div className="monthly-day-number">26</div></div>
              <div className="monthly-day-cell"><div className="monthly-day-number">27</div></div>
              <div className="monthly-day-cell"><div className="monthly-day-number">28</div></div>

              {/* Row 5 */}
              <div className="monthly-day-cell" style={{ borderBottom: 'none' }}><div className="monthly-day-number">29</div></div>
              <div className="monthly-day-cell" style={{ borderBottom: 'none' }}><div className="monthly-day-number">30</div></div>
              <div className="monthly-day-cell" style={{ borderBottom: 'none' }}><div className="monthly-day-number">31</div></div>
              <div className="monthly-day-cell" style={{ borderBottom: 'none' }}><div className="monthly-day-number muted">01</div></div>
              <div className="monthly-day-cell" style={{ borderBottom: 'none' }}><div className="monthly-day-number muted">02</div></div>
              <div className="monthly-day-cell" style={{ borderBottom: 'none' }}><div className="monthly-day-number muted">03</div></div>
              <div className="monthly-day-cell" style={{ borderBottom: 'none', borderRight: 'none' }}><div className="monthly-day-number muted">04</div></div>
            </div>
          </div>
        </div>
      </div>
      <ScheduleRegistrationModal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} />
    </div>
  );
}
