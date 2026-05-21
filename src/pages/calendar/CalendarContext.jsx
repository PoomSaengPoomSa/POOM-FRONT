import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_EVENTS } from './calendarUtils';
import { api } from '../../api';

const CalendarContext = createContext();

export function useCalendar() {
  return useContext(CalendarContext);
}

export function CalendarProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [aiTodos, setAiTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [toast, setToast] = useState({ show: false, message: '' });

  const [leftPanelWidth, setLeftPanelWidth] = useState(() => {
    const saved = localStorage.getItem('poom_left_panel_width');
    return saved ? parseInt(saved, 10) : 320;
  });

  const [isResizing, setIsResizing] = useState(false);

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

  // 실시간 캘린더 및 AI To-Do 데이터 페치
  const fetchCalendarData = async () => {
    try {
      const currentUser = api.auth.getCurrentUser();
      const u_id = currentUser ? currentUser.id : null;

      // 1. 고객 c_id -> name 매핑 사전 구축
      const customersList = await api.customer.getList("all");
      const customersMap = {};
      customersList.forEach(c => {
        customersMap[c.c_id] = c.name;
      });

      // 2. AI 투두 페치 및 포맷팅
      const aiTodoResponse = await api.aiTodo.getList(u_id);
      const dbAiTodos = aiTodoResponse.todos || [];
      const mappedAiTodos = dbAiTodos.map(todo => {
        let tag = 'AI추천';
        let tagColor = 'tag-blue';
        let group = '상담 일정 제안';
        let tags = [];

        if (todo.category === 'KPI 기반') {
          tag = 'KPI추천';
          tagColor = 'tag-pink';
          group = 'KPI 목표 달성';
          tags = ['KPI추천'];
        } else if (todo.category === '상담 일정 제안') {
          tag = '상담제안';
          tagColor = 'tag-green';
          group = '상담 일정 제안';
          tags = ['상담제안'];
        } else if (todo.category === '안부 연락 제안') {
          tag = '기념일';
          tagColor = 'tag-yellow';
          group = '안부 연락 제안';
          tags = ['기념일'];
        } else if (todo.category === '신규 상품 분석') {
          tag = '상품분석';
          tagColor = 'tag-lightblue';
          group = '신규 상품 분석';
          tags = ['상품분석'];
        }

        const execDate = new Date(todo.execution_date);
        const startHour = String(execDate.getHours()).padStart(2, '0');
        const startMin = String(execDate.getMinutes()).padStart(2, '0');
        const endHour = String((execDate.getHours() + 1) % 24).padStart(2, '0');
        const timeStr = `${startHour}:${startMin} - ${endHour}:${startMin}`;

        return {
          id: todo.at_id,
          time: timeStr,
          tag,
          tagColor,
          content: todo.title,
          checked: todo.is_checked || false,
          group,
          subText: todo.memo || 'AI 권장 조치사항',
          tags,
          c_id: todo.c_id
        };
      });

      setAiTodos(mappedAiTodos.filter(t => !t.checked));

      // 3. 일정 페치 및 포맷팅
      const dbSchedules = await api.schedule.getList();
      const mappedEvents = dbSchedules.map(sch => {
        const execDate = new Date(sch.execution_date);
        const yyyy = execDate.getFullYear();
        const mm = String(execDate.getMonth() + 1).padStart(2, '0');
        const dd = String(execDate.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;

        const startHour = String(execDate.getHours()).padStart(2, '0');
        const startMin = String(execDate.getMinutes()).padStart(2, '0');
        const startTimeStr = `${dateStr} ${startHour}:${startMin}`;

        // 종료 시간은 간단히 1시간 후로 계산
        const endHourVal = (execDate.getHours() + 1) % 24;
        const endHour = String(endHourVal).padStart(2, '0');
        const endTimeStr = `${dateStr} ${endHour}:${startMin}`;

        let eventColor = 'blue';
        if (sch.category === '상담') {
          eventColor = 'pink';
        } else if (sch.category === '개인') {
          eventColor = 'yellow';
        } else if (sch.category === '공지') {
          eventColor = 'green';
        }

        const customerName = sch.c_id ? (customersMap[sch.c_id] || `고객(${sch.c_id})`) : '';

        return {
          id: sch.s_id,
          title: sch.title,
          startTime: startTimeStr,
          endTime: endTimeStr,
          category: sch.category || '상담',
          customer: customerName,
          c_id: sch.c_id,
          color: eventColor,
          memo: sch.memo || '',
          at_id: sch.at_id
        };
      });

      setEvents(mappedEvents);
    } catch (error) {
      console.error("캘린더 실시간 데이터 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const addEvent = async (newEvent) => {
    try {
      let customerId = null;
      if (newEvent.customer) {
        const customersList = await api.customer.getList("all");
        const matched = customersList.find(c => c.name === newEvent.customer);
        if (matched) {
          customerId = matched.c_id;
        }
      }

      const startIso = new Date(newEvent.startTime.replace(' ', 'T')).toISOString();
      const endIso = new Date(newEvent.endTime.replace(' ', 'T')).toISOString();

      await api.schedule.create({
        category: newEvent.category || '상담',
        content: newEvent.title,
        startDatetime: startIso,
        endDatetime: endIso,
        color: newEvent.color || 'blue',
        customer_id: customerId,
        memo: newEvent.memo || ''
      });

      await fetchCalendarData();
      showToast("일정이 정상적으로 등록되었습니다.");
    } catch (error) {
      console.error("일정 등록 실패:", error);
      showToast("일정 등록에 실패했습니다.");
    }
  };

  const updateEvent = async (updatedEvent) => {
    try {
      const currentUser = api.auth.getCurrentUser();
      const u_id = currentUser ? currentUser.id : null;
      if (!u_id) return;

      const startIso = new Date(updatedEvent.startTime.replace(' ', 'T')).toISOString();
      const endIso = new Date(updatedEvent.endTime.replace(' ', 'T')).toISOString();

      await api.schedule.update(u_id, updatedEvent.id, {
        category: updatedEvent.category,
        content: updatedEvent.title,
        start_datetime: startIso,
        end_datetime: endIso,
        color: updatedEvent.color,
        memo: updatedEvent.memo
      });

      await fetchCalendarData();
      showToast("일정이 정상적으로 수정되었습니다.");
    } catch (error) {
      console.error("일정 수정 실패:", error);
      showToast("일정 수정에 실패했습니다.");
    }
  };

  const deleteEvent = async (id) => {
    try {
      await api.schedule.delete(id);
      await fetchCalendarData();
      showToast("일정이 삭제되었습니다.");
    } catch (error) {
      console.error("일정 삭제 실패:", error);
      showToast("일정 삭제에 실패했습니다.");
    }
  };

  const toggleAiTodo = (id) => {
    setAiTodos(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

  const transferCheckedAiTodos = async (date) => {
    const checkedTodos = aiTodos.filter(t => t.checked);
    if (checkedTodos.length === 0) {
      showToast("선택된 AI To Do 항목이 없습니다.");
      return;
    }

    try {
      const currentUser = api.auth.getCurrentUser();
      const u_id = currentUser ? currentUser.id : null;
      if (!u_id) return;

      const at_ids = checkedTodos.map(t => t.id);
      await api.aiTodo.confirm(u_id, at_ids);

      await fetchCalendarData();
      showToast(`My To Do에 ${checkedTodos.length}개의 일정이 등록되었습니다!`);
    } catch (error) {
      console.error("AI To Do 일정 등록 실패:", error);
      showToast("일정 승인 등록에 실패했습니다.");
    }
  };

  const revertAiTodo = async (eventId) => {
    const eventToRevert = events.find(e => e.id === eventId);
    if (!eventToRevert) return;

    if (!eventToRevert.at_id) {
      showToast("AI To Do에서 자동 추천되어 생성된 일정이 아닙니다.");
      return;
    }

    try {
      await api.aiTodo.unconfirm(eventToRevert.at_id);
      await fetchCalendarData();
      showToast("일정이 취소되고 AI To Do 목록으로 복원되었습니다.");
    } catch (error) {
      console.error("AI To Do 일정 복원 실패:", error);
      showToast("AI To Do 일정 복원에 실패했습니다.");
    }
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
