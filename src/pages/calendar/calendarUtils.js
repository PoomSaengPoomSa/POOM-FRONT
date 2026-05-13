export const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
export const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

export const generateMiniCalendar = (year, month, selectedDate, viewMode = 'day') => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);
  
  const days = [];
  
  // previous month
  for (let i = 0; i < firstDay; i++) {
    const d = daysInPrevMonth - firstDay + i + 1;
    const date = new Date(year, month - 1, d);
    days.push({ 
      day: d, 
      muted: true, 
      monthOffset: -1,
      date,
      selected: isSelected(date, selectedDate, viewMode)
    });
  }
  
  // current month
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    days.push({ 
      day: i, 
      muted: false, 
      monthOffset: 0,
      date,
      selected: isSelected(date, selectedDate, viewMode)
    });
  }
  
  // next month
  const remaining = 42 - days.length; // 6 rows
  for (let i = 1; i <= remaining; i++) {
    const date = new Date(year, month + 1, i);
    days.push({ 
      day: i, 
      muted: true, 
      monthOffset: 1,
      date,
      selected: isSelected(date, selectedDate, viewMode)
    });
  }
  
  return days;
};

const isSameDay = (d1, d2) => {
  if (!d1 || !d2) return false;
  return d1.getFullYear() === d2.getFullYear() && 
         d1.getMonth() === d2.getMonth() && 
         d1.getDate() === d2.getDate();
};

const isSameWeek = (d1, d2) => {
  if (!d1 || !d2) return false;
  const start = new Date(d2);
  start.setDate(d2.getDate() - d2.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return d1 >= start && d1 <= end;
};

const isSelected = (date, selectedDate, viewMode) => {
  if (!selectedDate) return false;
  if (viewMode === 'day' || viewMode === 'month') {
    return isSameDay(date, selectedDate);
  } else if (viewMode === 'week') {
    return isSameWeek(date, selectedDate);
  }
  return false;
};

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const SHORT_MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const formatMonthYear = (year, month) => {
  return `${MONTH_NAMES[month]} ${year}`;
};

export const formatHeaderDate = (date) => {
  if (!date) return '';
  return `${SHORT_MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export const formatFullHeaderDate = (date) => {
  if (!date) return '';
  return `${SHORT_MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} (${DAY_NAMES[date.getDay()]})`;
};

export const DEMO_EVENTS = [
  {
    id: 1,
    title: "이OO 고객님 미팅",
    startTime: "09/05/2026 08:00",
    endTime: "09/05/2026 09:00",
    category: "상담",
    customer: "이OO",
    color: "green",
    memo: "달러 자산 비중 축소 논의.\n국내 리츠 상품 3종 비교안 지참."
  },
  {
    id: 2,
    title: "점심 약속",
    startTime: "09/05/2026 12:00",
    endTime: "09/05/2026 13:00",
    category: "개인",
    customer: "",
    color: "blue",
    memo: "팀원들과 식사"
  },
  {
    id: 3,
    title: "내부 회의",
    startTime: "09/05/2026 13:30",
    endTime: "09/05/2026 15:30",
    category: "공지",
    customer: "",
    color: "orange",
    memo: "주간 업무 보고 및 이슈 사항 점검."
  }
];

export const getWeekDays = (date) => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
};
