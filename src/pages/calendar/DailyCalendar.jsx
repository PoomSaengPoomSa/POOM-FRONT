import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Calendar as CalendarIcon, TrendingUp, Users, Bell, Plus, ChevronLeft, ChevronRight, LogOut, Settings } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import "./CalendarNew.css";
import ScheduleRegistrationModal from "./ScheduleRegistrationModal";
import ScheduleDetailModal from "./ScheduleDetailModal";
import ScheduleEditModal from "./ScheduleEditModal";
import { generateMiniCalendar, formatMonthYear, formatFullHeaderDate } from './calendarUtils';
import { useCalendar } from './CalendarContext';

export default function DailyCalendar() {
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
    return events.filter(e => e.startTime.startsWith(targetDateStr));
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
                
                {generateMiniCalendar(miniCalMonth.year, miniCalMonth.month, selectedDate, 'day').map((d, i) => (
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

                  {todayEvents.map(event => {
                    const timePartStart = event.startTime.split(' ')[1] || '09:00';
                    const timePartEnd = event.endTime.split(' ')[1] || '10:00';
                    
                    const [startHour, startMin] = timePartStart.split(':').map(Number);
                    const [endHour, endMin] = timePartEnd.split(':').map(Number);
                    
                    const startTotalMins = startHour * 60 + startMin;
                    const endTotalMins = endHour * 60 + endMin;
                    const durationMins = endTotalMins - startTotalMins;
                    
                    // 1 hour = 80px
                    const topPos = (startTotalMins / 60) * 80;
                    const heightPx = (durationMins / 60) * 80;
                    
                    const styleColors = colorMap[event.color] || colorMap.blue;
                    
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
                          border: `1px solid ${styleColors.border}` 
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
