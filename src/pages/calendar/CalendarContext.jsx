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
      const parsed = JSON.parse(saved);
      const hasOldDemo = parsed.some(e => e.startTime && e.startTime.startsWith('2026-05-09'));
      if (hasOldDemo) {
        return DEMO_EVENTS;
      }
      return parsed;
    }
    return DEMO_EVENTS;
  });

  const [selectedDate, setSelectedDate] = useState(new Date());

  const DEFAULT_AI_TODOS = [
    { 
      id: 1, 
      time: '09:00 - 10:00', 
      tag: '이탈위험', 
      tagColor: 'tag-red', 
      content: '김민지 고객님 연락 (이탈 위험)', 
      checked: false,
      group: '상담 일정 제안',
      subText: '48일 이상 상담 없음 · 메모 기반 예측',
      tags: ['이탈 위험 높음', '타행 신규 대출 확인']
    },
    { 
      id: 2, 
      time: '10:00 - 11:00', 
      tag: '상담제안', 
      tagColor: 'tag-green', 
      content: '이광수 고객님 연락 (상담 제안)', 
      checked: false,
      group: '상담 일정 제안',
      subText: '89일 상담 이력없음 · 계좌 활동 감소',
      tags: ['3개월 미상담']
    },
    { 
      id: 3, 
      time: '13:00 - 14:00', 
      tag: '기념일', 
      tagColor: 'tag-yellow', 
      content: '강동원 고객님 문자 (배우자 생일)', 
      checked: false,
      group: '안부 연락 제안',
      subText: '오늘 · 안부 메시지 추천',
      tags: ['오늘', '가족 기념일']
    },
    { 
      id: 4, 
      time: '11:00 - 12:00', 
      tag: '예금만기', 
      tagColor: 'tag-blue', 
      content: '김종현 고객님 연락 (예금만기 D-7)', 
      checked: false,
      group: '안부 연락 제안',
      subText: '정기예금 3억 · 만기일 5월 25일',
      tags: ['D-7']
    },
    { 
      id: 5, 
      time: '14:00 - 15:00', 
      tag: '기념일', 
      tagColor: 'tag-yellow', 
      content: '김재원 고객님 문자 (결혼 기념일)', 
      checked: false,
      group: '안부 연락 제안',
      subText: '오늘 · 안부 메시지 추천',
      tags: ['D-3', '본인 기념일']
    },
    { 
      id: 6, 
      time: '15:00 - 16:00', 
      tag: '상품분석', 
      tagColor: 'tag-lightblue', 
      content: '우리 사장님 성장 적금 분석', 
      checked: false,
      group: '신규 상품 분석',
      subText: '목돈모으기상품',
      tags: ['연 2.0%', '12개월']
    },
    { 
      id: 7, 
      time: '16:00 - 17:00', 
      tag: 'KPI추천', 
      tagColor: 'tag-pink', 
      content: '안건호 고객님 연락 (고수수료 상품 제안)', 
      checked: false,
      group: 'KPI 목표 달성',
      subText: 'KPI 비이자이익 달성을 위한 추천',
      tags: ['연 2.0%', '12개월']
    }
  ];

  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (message) => {
    setToast({ show: true, message });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const [aiTodos, setAiTodos] = useState(() => {
    const saved = localStorage.getItem('poom_ai_todos');
    return saved ? JSON.parse(saved) : DEFAULT_AI_TODOS;
  });

  const [leftPanelWidth, setLeftPanelWidth] = useState(() => {
    const saved = localStorage.getItem('poom_left_panel_width');
    return saved ? parseInt(saved, 10) : 320;
  });

  const [isResizing, setIsResizing] = useState(false);

  const startResize = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftPanelWidth;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.max(320, Math.min(600, startWidth + deltaX));
      setLeftPanelWidth(newWidth);
      localStorage.setItem('poom_left_panel_width', String(newWidth));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    setIsResizing(true);
  };

  useEffect(() => {
    localStorage.setItem('poom_calendar_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('poom_ai_todos', JSON.stringify(aiTodos));
  }, [aiTodos]);

  const addEvent = (newEvent) => {
    setEvents(prev => [...prev, { ...newEvent, id: Date.now() }]);
  };

  const updateEvent = (updatedEvent) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const toggleAiTodo = (id) => {
    setAiTodos(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

  const transferCheckedAiTodos = (date) => {
    const checkedTodos = aiTodos.filter(t => t.checked);
    if (checkedTodos.length === 0) {
      showToast("선택된 AI To Do 항목이 없습니다.");
      return;
    }

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const newEvents = checkedTodos.map(todo => {
      const timeParts = todo.time.split('-').map(t => t.trim());
      const startTimePart = timeParts[0] || '09:00';
      const endTimePart = timeParts[1] || '10:00';

      let eventColor = 'blue';
      let category = '상담';
      let customer = '';

      if (todo.tagColor === 'tag-red') {
        eventColor = 'pink';
        category = '상담';
      } else if (todo.tagColor === 'tag-yellow') {
        eventColor = 'yellow';
        category = '개인';
      }

      if (todo.content.includes('고객님')) {
        customer = todo.content.split('고객님')[0].trim();
      }

      return {
        id: Date.now() + Math.random(),
        title: todo.content,
        startTime: `${dateStr} ${startTimePart}`,
        endTime: `${dateStr} ${endTimePart}`,
        category,
        customer,
        color: eventColor,
        memo: `AI To Do 추천에서 My To Do 및 일정으로 등록된 업무입니다.`,
        aiTodoSource: todo
      };
    });

    setEvents(prev => {
      // 중복 체크: 이미 동일한 title과 startTime을 갖는 일정이 존재하면 제외
      const filteredNewEvents = newEvents.filter(newEvent => {
        const isDuplicate = prev.some(existingEvent => 
          existingEvent.title === newEvent.title && 
          existingEvent.startTime === newEvent.startTime
        );
        return !isDuplicate;
      });
      return [...prev, ...filteredNewEvents];
    });

    setAiTodos(prev => prev.filter(t => !t.checked));
    showToast(`My To Do에 ${checkedTodos.length}개의 일정이 등록되었습니다!`);
  };

  const revertAiTodo = (eventId) => {
    const eventToRevert = events.find(e => e.id === eventId);
    if (!eventToRevert) return;

    // 1. Remove the event from events list
    setEvents(prev => prev.filter(e => e.id !== eventId));

    // 2. Put the AI Todo back to aiTodos list
    let originalTodo = eventToRevert.aiTodoSource;

    if (!originalTodo) {
      // Reconstruct it from DEFAULT_AI_TODOS using content match
      const matchedDefault = DEFAULT_AI_TODOS.find(t => t.content === eventToRevert.title);
      if (matchedDefault) {
        originalTodo = { ...matchedDefault, checked: false };
      } else {
        // Fallback for custom or unmatched events
        originalTodo = {
          id: Date.now() + Math.random(),
          time: '09:00 - 10:00',
          tag: 'AI추천',
          tagColor: 'tag-blue',
          content: eventToRevert.title,
          checked: false,
          group: '상담 일정 제안',
          subText: 'AI 추천에서 복원된 항목입니다.',
          tags: ['복원됨']
        };
      }
    } else {
      originalTodo = { ...originalTodo, checked: false };
    }

    // 3. Put it back to aiTodos list, keeping original id sort order
    setAiTodos(prev => {
      if (prev.some(t => t.content === originalTodo.content)) {
        return prev;
      }
      const newTodos = [...prev, originalTodo];
      return newTodos.sort((a, b) => a.id - b.id);
    });

    showToast("일정이 취소되고 AI To Do 목록으로 되돌아갔습니다.");
  };

  return (
    <CalendarContext.Provider value={{ 
      events, 
      addEvent, 
      updateEvent, 
      deleteEvent, 
      selectedDate, 
      setSelectedDate,
      aiTodos,
      toggleAiTodo,
      transferCheckedAiTodos,
      revertAiTodo,
      leftPanelWidth,
      isResizing,
      startResize,
      toast,
      showToast
    }}>
      {children}
    </CalendarContext.Provider>
  );
}
