import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { generateMiniCalendar, formatMonthYear } from './calendarUtils';

export default function MiniCalendarPicker({ onSelect, onClose, alignRight = false }) {
  const [currentMonth, setCurrentMonth] = useState({ 
    year: 2026, 
    month: 4 // Default to May 2026 for demo consistency
  });

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth(prev => {
      let y = prev.year;
      let m = prev.month - 1;
      if (m < 0) { m = 11; y -= 1; }
      return { year: y, month: m };
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth(prev => {
      let y = prev.year;
      let m = prev.month + 1;
      if (m > 11) { m = 0; y += 1; }
      return { year: y, month: m };
    });
  };

  const days = generateMiniCalendar(currentMonth.year, currentMonth.month, new Date(2026, 4, 9), 'day');

  return (
    <>
      {/* Background overlay to catch clicks outside */}
      <div 
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }} 
        onClick={onClose}
      />
      <div className="cal-mini-calendar" style={{ 
        position: 'absolute', 
        top: '100%', 
        left: alignRight ? 'auto' : 0, 
        right: alignRight ? 0 : 'auto',
        zIndex: 100, 
        background: 'white', 
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        marginTop: '4px',
        padding: '12px',
        width: '260px'
      }}>
        <div className="cal-mini-header">
          <span>{formatMonthYear(currentMonth.year, currentMonth.month)}</span>
          <div style={{ display: 'flex', gap: 8, color: '#94a3b8' }}>
            <ChevronLeft size={16} cursor="pointer" onClick={handlePrev} />
            <ChevronRight size={16} cursor="pointer" onClick={handleNext} />
          </div>
        </div>
        <div className="cal-mini-grid">
          {['S','M','T','W','T','F','S'].map((d, i) => <span key={i} className="cal-mini-day-name">{d}</span>)}
          {days.map((d, i) => (
            <div 
              key={i} 
              className={`cal-mini-day ${d.muted ? 'muted' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelect(d.date);
              }}
            >
              {d.day}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
