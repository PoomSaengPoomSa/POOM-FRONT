import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_EVENTS } from './calendarUtils';

const CalendarContext = createContext();

export function useCalendar() {
  return useContext(CalendarContext);
}

export function CalendarProvider({ children }) {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('poom_calendar_events');
    if (saved) {
      return JSON.parse(saved);
    }
    return DEMO_EVENTS;
  });

  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('poom_calendar_events', JSON.stringify(events));
  }, [events]);

  const addEvent = (newEvent) => {
    setEvents(prev => [...prev, { ...newEvent, id: Date.now() }]);
  };

  const updateEvent = (updatedEvent) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  return (
    <CalendarContext.Provider value={{ events, addEvent, updateEvent, deleteEvent, selectedDate, setSelectedDate }}>
      {children}
    </CalendarContext.Provider>
  );
}
