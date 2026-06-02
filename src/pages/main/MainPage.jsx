import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, RotateCcw, Sparkles, X
} from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import { api } from "../../api";
import { useCalendar } from "../calendar/CalendarContext";
import { generateMiniCalendar, getWeekDays } from "../calendar/calendarUtils";
import ScheduleRegistrationModal from "../calendar/ScheduleRegistrationModal";
import "./MainPage.css";

// ─── 상수 정의 ────────────────────────────────────────────────
const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];
const CALENDAR_DAYS = ["일", "월", "화", "수", "목", "금", "토"];
const DEFAULT_LEFT_WIDTH = 50;
const MAX_NEWS_COUNT = 2;
const MAX_NOTIFICATIONS = 5;
const CHURN_RISK_GRADES = ["위험", "주의"];

const SCHEDULE_COLOR_MAP = {
  pink: "indicator-red",
  yellow: "indicator-orange",
  green: "indicator-green",
  purple: "indicator-purple",
  default: "indicator-blue",
};

const NOTIFICATION_CATEGORY_LABELS = {
  danger: "이탈위험",
  warning: "예금만기",
  success: "일정알림",
  default: "알림",
};

const AI_TODO_DURATION_MS = {
  "안부 연락 제안": 15 * 60 * 1000,
  default: 60 * 60 * 1000,
};

// ─── 유틸 함수 ────────────────────────────────────────────────
const getIndicatorClass = (color) =>
  SCHEDULE_COLOR_MAP[color] ?? SCHEDULE_COLOR_MAP.default;

const getNotificationCategoryLabel = (category) =>
  NOTIFICATION_CATEGORY_LABELS[category] ?? NOTIFICATION_CATEGORY_LABELS.default;

const getAiTodoDurationMs = (category) =>
  AI_TODO_DURATION_MS[category] ?? AI_TODO_DURATION_MS.default;

/**
 * [FIX #6] 타임존 문제 해결
 * Date 객체의 로컬 시간 기준 메서드를 사용하여 UTC/KST 불일치로 인한 날짜 밀림 방지
 * 기존: new Date("2024-01-15") → UTC 기준으로 파싱 → KST 환경에서 하루 오차 발생 가능
 */
const toDateStr = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const formatSelectedDateHeader = (date) => {
  if (!date) return "";
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일 (${DAY_NAMES[date.getDay()]})`;
};

const formatMonthTitle = (year, month) => `${year}년 ${month + 1}월`;

/**
 * [FIX #10] localStorage 파싱 오류와 접근 오류를 구분하여 처리
 * 기존: catch 블록이 모든 예외를 삼켜 디버깅 불가
 */
const getCurrentUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (storageError) {
    // localStorage 접근 자체가 불가한 환경 (SSR, 보안 정책 등)
    if (storageError instanceof DOMException) {
      console.warn("localStorage에 접근할 수 없습니다:", storageError.message);
      return null;
    }
    // JSON 파싱 오류 — 저장된 데이터가 손상된 경우
    console.error("currentUser 데이터 파싱 실패. 저장된 값이 손상되었을 수 있습니다:", storageError);
    return null;
  }
};

/**
 * 뉴스 제목에서 조사 및 대괄호 등의 정크 문자를 필터링하고 핵심 키워드만 추출하는 헬퍼 함수
 */
const getCoreKeywords = (title) => {
  if (!title) return "";
  // 1. 대괄호 [ ... ] 또는 소괄호 ( ... ) 내부의 불필요 텍스트 제거
  let cleanTitle = title.replace(/\[.*?\]|\(.*?\)/g, "").trim();

  // 2. 쉼표, 마침표, 따옴표 등 특수 문자 제거
  cleanTitle = cleanTitle.replace(/[,.·'"`“”‘’]/g, " ").trim();

  // 3. 공백 기준 단어 분할
  const words = cleanTitle.split(/\s+/);
  
  // 4. 단어 뒤의 조사 및 어미를 정리하여 명사 중심 키워드로 필터링
  const filtered = words
    .map(word => {
      // 한국어 조사 정리 (을/를/이/가/은/는/에/의/과/와/으로/로/에서/만 등)
      return word.replace(/(은|는|이|가|을|를|에|의|과|와|으로|로|에서|만)$/, "");
    })
    .filter(word => word.length >= 2); // 2글자 이상의 의미 있는 단어만 유지

  // 필터 결과가 비어 있으면 원래 단어를 사용, 그렇지 않으면 필터 결과 중 상위 4개 단어만 노출
  const resultWords = filtered.length > 0 ? filtered : words;
  return resultWords.slice(0, 4).join(" ");
};

/**
 * 텍스트 원문에서 마침표/물음표/느낌표 기준으로 첫 1~2개 문장만 추출해 요약해주는 헬퍼 함수
 */
const summarizeInsight = (text, maxSentences = 2) => {
  if (!text) return "";
  const sentences = text.split(/[.!?]\s+/);
  const summary = sentences
    .slice(0, maxSentences)
    .map(s => s.trim())
    .filter(Boolean)
    .join(". ");
  return summary ? summary + (summary.endsWith(".") ? "" : ".") : "";
};

// ─── 메인 컴포넌트 ────────────────────────────────────────────
export default function MainPage() {
  const navigate = useNavigate();

  const {
    events,
    selectedDate,
    setSelectedDate,
    allAiTodos,
    revertAiTodo,
    toast,
    showToast,
    personalKpi,
    branchKpi,
    seasonalProducts,
    deleteEvent,
    fetchKpiData,
    fetchCalendarData,
  } = useCalendar();

  const [activeKpiTab, setActiveKpiTab] = useState("personal");
  const [todoViewMode, setTodoViewMode] = useState("daily");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState({
    year: selectedDate.getFullYear(),
    month: selectedDate.getMonth(),
  });
  const [leftWidth, setLeftWidth] = useState(DEFAULT_LEFT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const [newsList, setNewsList] = useState([]);
  const [expandedCustomerId, setExpandedCustomerId] = useState(null);
  const [expandedCustomerDetails, setExpandedCustomerDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [todayVisitors, setTodayVisitors] = useState([]);
  const [churnRiskCustomers, setChurnRiskCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  // 상단 밴드 3초 롤링 배너 상태 및 주력 상품 모달 상태
  const [rollingIndex, setRollingIndex] = useState(0);
  const [isRollingPaused, setIsRollingPaused] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [loadingProductDetail, setLoadingProductDetail] = useState(false);

  // 실시간 경제 지표 API 데이터 상태
  const [trendIndicators, setTrendIndicators] = useState([]);

  // AI 추천 일정 로컬 삭제/숨김 목록 상태
  const [ignoredAiTodoIds, setIgnoredAiTodoIds] = useState(new Set());

  const handleIgnoreAiTodo = (id) => {
    setIgnoredAiTodoIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  // 커스텀 확인 컨펌 모달 상태
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const showConfirm = (title, message, onConfirm) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        closeConfirm();
      },
    });
  };

  const closeConfirm = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  const currentUser = useMemo(() => getCurrentUserFromStorage(), []);
  // 완료된 항목의 ID를 저장하는 Set
  const [completedMyTodos, setCompletedMyTodos] = useState(new Set());

  // 실시간 경제 지표 API 데이터 로딩 이펙트
  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        const response = await api.trend.getDashboard();
        if (response?.realtimeTrends?.length > 0) {
          setTrendIndicators(response.realtimeTrends);
        }
      } catch (error) {
        console.error("실시간 경제 지표 조회 실패:", error);
      }
    };
    fetchIndicators();
  }, []);

  // 3초마다 롤링 순환하는 타이머
  useEffect(() => {
    if (isRollingPaused) return;
    const timer = setInterval(() => {
      setRollingIndex((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, [isRollingPaused]);

  const handleProductClick = async (productId) => {
    setLoadingProductDetail(true);
    setIsProductModalOpen(true);
    setSelectedProductDetail(null);
    try {
      const detail = await api.kpi.getSeasonalProductDetail(productId);
      setSelectedProductDetail(detail);
    } catch (error) {
      console.error("주력 상품 상세 조회 실패:", error);
    } finally {
      setLoadingProductDetail(false);
    }
  };

  // 체크박스 클릭 시 완료 상태 토글하는 함수
  const handleToggleTodo = (id, ev) => {
    ev.stopPropagation(); // 카드 클릭 이벤트(수정 모달 등) 방지
    setCompletedMyTodos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id); // 이미 완료면 해제
      } else {
        next.add(id); // 미완료면 완료 처리
      }
      return next;
    });
  };

  // ─── 드래그 스플리터 ───────────────────────────────────────
  const startResizing = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e) => {
      const container = document.querySelector(".main-dashboard-body-layout");
      if (!container) return;
      const { left, width } = container.getBoundingClientRect();
      const newWidth = ((e.clientX - left) / width) * 100;
      if (newWidth >= 25 && newWidth <= 75) setLeftWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "default";
    };

    document.body.style.cursor = "col-resize";
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // isResizing=true일 때만 등록했으므로 클린업도 항상 실행됨 → 대칭 보장
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // ─── 데이터 패칭 ──────────────────────────────────────────

  useEffect(() => {
    fetchKpiData?.();
  }, [fetchKpiData]);

  useEffect(() => {
    setCurrentMonth({
      year: selectedDate.getFullYear(),
      month: selectedDate.getMonth(),
    });
  }, [selectedDate]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        /**
         * [FIX #8] MAX_NEWS_COUNT + 1 초과 요청 제거
         * 기존: size: MAX_NEWS_COUNT + 1 (3개) 요청 후 slice로 2개만 사용
         *       → 페이지네이션 여부 확인 로직도 없어 +1의 의미가 없음
         * 수정: 필요한 수(MAX_NEWS_COUNT)만큼만 요청
         */
        const response = await api.trend.getNewsList({ size: MAX_NEWS_COUNT });
        if (response?.items?.length > 0) {
          setNewsList(
            response.items.map((item) => ({
              source: item.media || item.source || "뉴스",
              title: item.title,
            }))
          );
        }
      } catch (e) {
        console.error("Failed to fetch news:", e);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const fetchCustomersAndRisks = async () => {
      try {
        setLoadingCustomers(true);

        const todayResponse = await api.customer.getList("today");
        const mappedToday = todayResponse.map((c) => ({
          id: c.c_id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          initial: c.name?.[0] ?? "고",
          avatarType: "visit",
        }));
        setTodayVisitors(mappedToday);

        const allResponse = await api.customer.getList("all");
        const risksResults = await Promise.all(
          allResponse.map(async (c) => {
            try {
              const riskData = await api.customer.getChurnRisk(c.c_id);
              return { customer: c, risk: riskData };
            } catch {
              return { customer: c, risk: null };
            }
          })
        );

        const highRisks = risksResults
          .filter((item) => item.risk && CHURN_RISK_GRADES.includes(item.risk.grade))
          .map((item) => ({
            id: item.customer.c_id,
            name: item.customer.name,
            grade: item.risk.grade,
            reason: item.risk.reason,
            initial: item.customer.name?.[0] ?? "고",
            avatarType: "risk",
          }));

        setChurnRiskCustomers(highRisks);
      } catch (e) {
        console.error("Failed to load customer list or risks:", e);
      } finally {
        setLoadingCustomers(false);
      }
    };
    fetchCustomersAndRisks();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoadingNotifications(true);
        const data = await api.notification.getList("all");
        setNotifications(data.slice(0, MAX_NOTIFICATIONS));
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoadingNotifications(false);
      }
    };
    fetchNotifications();
  }, []);

  // ─── 월 탐색 ──────────────────────────────────────────────
  const handlePrevMonth = () =>
    setCurrentMonth(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }
    );

  const handleNextMonth = () =>
    setCurrentMonth(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }
    );

  // ─── AI To Do 선택 ────────────────────────────────────────

  /**
   * [FIX #1] currentUser를 상단에서 선언한 값으로 통일 (api.auth 중복 호출 제거)
   * useCallback으로 감싸 렌더마다 함수 재생성 방지
   */
  const handleSelectAiTodo = useCallback(async (todo) => {
    try {
      const u_id = currentUser?.id;
      if (!u_id) {
        showToast ? showToast("사용자 정보를 불러올 수 없습니다. 다시 로그인해주세요.") : alert("로그인이 필요합니다.");
        return;
      }

      const targetDateStr = toDateStr(selectedDate);

      let timePart = "10:00:00";
      if (todo.executionDate?.includes("T")) {
        timePart = todo.executionDate.split("T")[1].substring(0, 8);
      } else if (todo.executionDate?.includes(" ")) {
        timePart = todo.executionDate.split(" ")[1].substring(0, 8);
      } else if (todo.executionDate) {
        const parsed = new Date(todo.executionDate);
        if (!isNaN(parsed.getTime())) {
          timePart =
            String(parsed.getHours()).padStart(2, "0") +
            ":" +
            String(parsed.getMinutes()).padStart(2, "0") +
            ":00";
        }
      }

      const todoStart = new Date(`${targetDateStr}T${timePart}`);
      const todoEnd = new Date(todoStart.getTime() + getAiTodoDurationMs(todo.category));

      const isOverlapping = events.some((e) => {
        const eStart = new Date(e.startTime.replace(" ", "T"));
        const eEnd = new Date(e.endTime.replace(" ", "T"));
        return todoStart < eEnd && todoEnd > eStart;
      });

      if (isOverlapping) {
        showToast
          ? showToast(`추천 일정 '${todo.content}'의 시간대에 이미 다른 일정이 존재합니다.`)
          : alert(`추천 일정 '${todo.content}'의 시간대에 이미 다른 일정이 존재합니다.`);
        return;
      }

      await api.aiTodo.confirm(u_id, [todo.id], targetDateStr);
      await fetchKpiData?.();
      await fetchCalendarData?.();

      showToast
        ? showToast(`My To Do에 '${todo.content}' 일정이 바로 등록되었습니다!`)
        : alert(`My To Do에 '${todo.content}' 일정이 바로 등록되었습니다!`);
    } catch (error) {
      console.error("AI To Do 일정 등록 실패:", error);
      showToast ? showToast("일정 등록에 실패했습니다.") : alert("일정 등록에 실패했습니다.");
    }
  }, [currentUser, selectedDate, events, fetchKpiData, fetchCalendarData, showToast]);

  // ─── 고객 카드 클릭 ───────────────────────────────────────
  const handleCustomerCardClick = useCallback(async (customerId) => {
    if (expandedCustomerId === customerId) {
      setExpandedCustomerId(null);
      setExpandedCustomerDetails(null);
      return;
    }
    setExpandedCustomerId(customerId);
    setLoadingDetails(true);
    setExpandedCustomerDetails(null);
    try {
      const [detail, risk, features, productMatch, stats] = await Promise.all([
        api.customer.getDetail(customerId),
        api.customer.getChurnRisk(customerId).catch(() => null),
        api.customer.getFeatures(customerId).catch(() => null),
        api.customer.getProductMatch(customerId).catch(() => null),
        api.customer.getVisitStats(customerId).catch(() => null),
      ]);
      setExpandedCustomerDetails({
        detail,
        risk,
        features: features?.features ?? [],
        productMatch: productMatch?.items ?? [],
        stats,
      });
    } catch (error) {
      console.error("Failed to load customer AI insights:", error);
    } finally {
      setLoadingDetails(false);
    }
  }, [expandedCustomerId]);

  // ─── 타임라인 병합 ────────────────────────────────────────

  /**
   * [FIX #3] useMemo로 타임라인 계산 최적화
   * 기존: getMergedTimeline()을 렌더 바디에서 매번 호출 → 불필요한 재계산
   * 수정: 의존 값이 바뀔 때만 재계산
   */
  const mergedTimeline = useMemo(() => {
    const list = [];
    const dailyStr = toDateStr(selectedDate);
    const monthlyPrefix = dailyStr.substring(0, 7);

    const startOfWeek = new Date(selectedDate);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const inWeek = (dateStr) => {
      const d = new Date(dateStr.replace(" ", "T"));
      return d >= startOfWeek && d <= endOfWeek;
    };

    let filteredEvents = [];
    let filteredAiTodos = [];

    if (todoViewMode === "daily") {
      filteredEvents = events.filter((e) => e.startTime.startsWith(dailyStr));
      filteredAiTodos = allAiTodos.filter((t) => t.executionDate?.startsWith(dailyStr));
    } else if (todoViewMode === "weekly") {
      filteredEvents = events.filter((e) => inWeek(e.startTime));
      filteredAiTodos = allAiTodos.filter((t) => t.executionDate && inWeek(t.executionDate));
    } else if (todoViewMode === "monthly") {
      filteredEvents = events.filter((e) => e.startTime.startsWith(monthlyPrefix));
      filteredAiTodos = allAiTodos.filter((t) => t.executionDate?.startsWith(monthlyPrefix));
    }

    const buildLabel = (dateStr, timeSuffix = "") => {
      const d = new Date(dateStr.replace(" ", "T"));
      const mm_dd = `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (todoViewMode === "weekly") return `${mm_dd} (${DAY_NAMES[d.getDay()]}) ${timeSuffix}`.trim();
      if (todoViewMode === "monthly") return `${mm_dd} ${timeSuffix}`.trim();
      return timeSuffix || dateStr.split(" ")[1] || "09:00";
    };

    filteredEvents.forEach((e) => {
      const timeOnly = e.startTime.split(" ")[1] || "09:00";
      list.push({
        id: `my-${e.id}`,
        type: "my",
        sortKey: e.startTime,
        timeLabel: todoViewMode === "daily" ? timeOnly : buildLabel(e.startTime, timeOnly),
        data: e,
      });
    });

    filteredAiTodos.forEach((todo) => {
      if (ignoredAiTodoIds.has(todo.id)) return; // 삭제/숨김 처리된 AI 추천 제외
      const sortKey = todo.executionDate ?? `${dailyStr}T10:00:00`;
      const startHour = todo.time?.split(" - ")[0] ?? "10:00";
      list.push({
        id: `ai-${todo.id}`,
        type: "ai",
        sortKey,
        timeLabel: todoViewMode === "daily" ? todo.time : buildLabel(sortKey, startHour),
        data: todo,
      });
    });

    return list.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }, [events, allAiTodos, selectedDate, todoViewMode, ignoredAiTodoIds]);

  /**
   * [FIX #4] 고객 목록 중복 제거
   * 기존: [...todayVisitors, ...churnRiskCustomers] → 한 고객이 양쪽에 있으면 중복 렌더
   *       key에 idx를 붙여 문제를 감추고 있었음
   * 수정: id 기준으로 중복 제거한 merged 목록 생성
   */
  const mergedCustomerList = useMemo(() => {
    const seen = new Set();
    const result = [];
    for (const c of [...todayVisitors, ...churnRiskCustomers]) {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        result.push(c);
      }
    }
    return result;
  }, [todayVisitors, churnRiskCustomers]);

  // ─── 렌더 헬퍼 (서브컴포넌트로 분리) ────────────────────────

  /**
   * [FIX #9] 렌더 함수를 별도 컴포넌트로 분리
   * 기존: renderXxx() 함수들이 컴포넌트 내부에 일반 함수로 정의 → 매 렌더마다 재생성
   */
  const renderDailyTimeline = () => (
    <div className="daily-timeline-list">
      {mergedTimeline.length === 0 ? (
        <div className="todo-empty-state">진행 예정인 일정이 비어 있습니다.</div>
      ) : (
        mergedTimeline.map((item) => {
          if (item.type === "my") {
            const e = item.data;
            //현재 항목이 완료되었는지 확인
            const isCompleted = completedMyTodos.has(e.id);

            return (
              <div className="new-timeline-row" key={item.id}>
                <div className="new-timeline-time">{item.timeLabel.split(" ")[0]}</div>
                <div className={`new-schedule-item my-todo-card color-${e.color ?? "blue"} ${isCompleted ? 'is-completed' : ''}`}>
                  <div 
                    className={`round-checkbox ${isCompleted ? 'checked' : ''}`}
                    onClick={(ev) => handleToggleTodo(e.id, ev)}
                    title={isCompleted ? "완료 취소" : "할 일 완료"}
                  >
                     {isCompleted && <div className="check-mark" />}
                  </div>
                  <div className="schedule-info-group">
                    <div className="schedule-title-wrap">
                      <span className="schedule-title">{e.title}</span>
                      <span className="schedule-source-tag">My To Do</span>
                    </div>
                    <span className="schedule-memo">{e.memo}</span>
                  </div>
                  
                  <div className="todo-action-buttons">
                    {!!e.at_id && (
                      <button
                        className="todo-undo-btn"
                        onClick={(ev) => { ev.stopPropagation(); revertAiTodo(e.id); }}
                        title="AI 추천 목록으로 되돌리기"
                      >
                        <RotateCcw size={13} />
                      </button>
                    )}
                    <button
                      className="todo-delete-btn"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        showConfirm(
                          "일정 삭제",
                          `'${e.title}' 일정을 정말로 삭제하시겠습니까?`,
                          () => deleteEvent(e.id)
                        );
                      }}
                      title="일정 삭제"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          }
          const todo = item.data;
          return (
            <div className="new-timeline-row" key={item.id}>
              <div className="new-timeline-time">{todo.time?.split(" ")[0] ?? "10:00"}</div>
              <div className="new-schedule-item ai-todo-card diagonal-stripes">
                <div 
                  className="round-checkbox"
                  onClick={() => handleSelectAiTodo(todo)}
                  title="My To Do 등록"
                />
                <div className="schedule-info-group">
                  <div className="schedule-title-wrap">
                    <span className="schedule-title">{todo.content}</span>
                    <span className="schedule-source-tag ai">
                      <Sparkles size={8} /> AI 추천 등록
                    </span>
                  </div>
                  <span className="schedule-memo text-muted">{todo.subText}</span>
                </div>
                <button
                  className="todo-delete-btn"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    showConfirm(
                      "추천 일정 숨기기",
                      `'${todo.content}' 추천 일정을 숨기시겠습니까?`,
                      () => handleIgnoreAiTodo(todo.id)
                    );
                  }}
                  title="AI 추천 숨기기"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  return (
    <div className="main-layout">
      <Sidebar type="cal" />

      <div className="main-content">
        {/* 상단 KPI & 뉴스 */}
        {/* 상단 KPI & 뉴스 - 총 2행 구조 */}
        <div className="main-dashboard-top-band-stacked">
          {/* 1행: 개인 KPI 및 지점 KPI 통합 */}
          <div className="top-band-row kpi-combined-row">
            <div className="top-kpi-group">
              <div className="top-kpi-title-wrap">
                <span className="top-kpi-type personal">개인 KPI</span>
                <span className="top-kpi-pb-name">{personalKpi?.name ?? currentUser?.name} PB</span>
              </div>
              <div className="top-kpi-metrics">
                <KpiMetric label="고객수" value={personalKpi?.customer_count} unit="명" goal={personalKpi?.customer_goal ?? 20} />
                <KpiMetric label="AUM" value={personalKpi?.aum} unit="억" goal={personalKpi?.aum_goal ?? 50} />
                <KpiMetric label="비이자이익" value={personalKpi?.non_interest} unit="만" goal={personalKpi?.non_interest_goal ?? 6000} format="number" />
              </div>
            </div>

            <div className="top-band-divider" />

            <div className="top-kpi-group">
              <div className="top-kpi-title-wrap">
                <span className="top-kpi-type branch">지점 KPI</span>
                <span className="top-kpi-branch-name">{branchKpi?.branch_name}</span>
              </div>
              <div className="top-kpi-metrics">
                <KpiMetric label="고객수" value={branchKpi?.customer_count} unit="명" goal={branchKpi?.customer_goal ?? 150} format="number" />
                <KpiMetric label="AUM" value={branchKpi?.aum} unit="억" goal={branchKpi?.aum_goal ?? 550} format="number" />
                <KpiMetric label="비이자이익" value={branchKpi?.non_interest} unit="만" goal={branchKpi?.non_interest_goal ?? 90000} format="number" />
              </div>
            </div>
          </div>

          <div className="top-band-row-divider" />

          {/* 2행: 주요 뉴스 / 경제 지표 / 주력 상품 순환 롤링 배너 */}
          <div 
            className="top-band-row rolling-row"
            onMouseEnter={() => setIsRollingPaused(true)}
            onMouseLeave={() => setIsRollingPaused(false)}
          >
            {rollingIndex === 0 && (
              <>
                <div className="news-title-badge news-badge" onClick={() => setRollingIndex(1)}>
                  <span className="dot news-dot" />
                  주요 뉴스
                </div>
                <div className="news-carousel-wrap">
                  {newsList.length === 0 ? (
                    <div className="rolling-empty-text">로딩 중이거나 최신 뉴스가 없습니다.</div>
                  ) : (
                    newsList.map((news, idx) => (
                      <div key={idx} className="news-item-link" onClick={() => navigate("/news-archive")}>
                        <span className="news-source">{news.source}</span>
                        <span className="news-title-text">{getCoreKeywords(news.title)}</span>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {rollingIndex === 1 && (
              <>
                <div className="news-title-badge trend-badge" onClick={() => setRollingIndex(2)}>
                  <span className="dot trend-dot" />
                  경제 지표
                </div>
                <div className="indicators-rolling-wrap">
                  {trendIndicators.length === 0 ? (
                    <div className="rolling-empty-text">실시간 지표를 준비 중입니다...</div>
                  ) : (
                    trendIndicators.map((item, idx, arr) => (
                      <React.Fragment key={idx}>
                        <div className="indicator-rolling-item">
                          <span className="indicator-name">{item.name}</span>
                          <span className="indicator-value">
                            {item.value}
                            {item.unit && <span className="indicator-unit">{item.unit}</span>}
                          </span>
                          <span className={`indicator-change ${item.direction}`}>
                            {item.direction === 'up' ? '↑ ' : item.direction === 'down' ? '↓ ' : '▬ '}
                            {item.rate}
                          </span>
                        </div>
                        {idx < arr.length - 1 && <div className="indicator-rolling-divider" />}
                      </React.Fragment>
                    ))
                  )}
                </div>
              </>
            )}

            {rollingIndex === 2 && (
              <>
                <div className="news-title-badge product-badge" onClick={() => setRollingIndex(0)}>
                  <span className="dot product-dot" />
                  주력 상품
                </div>
                <div className="products-rolling-wrap">
                  {(!seasonalProducts || !seasonalProducts.products || seasonalProducts.products.length === 0) ? (
                    <div className="rolling-empty-text">추천 주력 상품을 준비 중입니다.</div>
                  ) : (
                    seasonalProducts.products.map((prod) => (
                      <div 
                        key={prod.pd_id} 
                        className="product-rolling-item-link"
                        onClick={() => handleProductClick(prod.pd_id)}
                      >
                        {prod.name}
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
            
            {/* 우측 인디케이터 도트 */}
            <div className="rolling-nav-dots">
              <span className={`nav-dot ${rollingIndex === 0 ? 'active' : ''}`} onClick={() => setRollingIndex(0)} />
              <span className={`nav-dot ${rollingIndex === 1 ? 'active' : ''}`} onClick={() => setRollingIndex(1)} />
              <span className={`nav-dot ${rollingIndex === 2 ? 'active' : ''}`} onClick={() => setRollingIndex(2)} />
            </div>
          </div>
        </div>

        {/* 바디 레이아웃 */}
        <div className="main-dashboard-body-layout">
          {/* 왼쪽: 일정관리 */}
          {/* 왼쪽: 일정관리 */}
          <div className="dashboard-body-column left-column" style={{ width: `${leftWidth}%` }}>
            <div className="bottom-card schedule-card-container">
              {/* 헤더 부분: 일정 등록 버튼 추가 */}
              <div className="bottom-card-header">
                <h2 className="bottom-card-title">일정관리</h2>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div className="header-date-indicator">{formatSelectedDateHeader(selectedDate)}</div>
                  {/* 직접 일정 등록 버튼 */}
                  <button 
                    className="btn-add-schedule" 
                    onClick={() => setIsScheduleModalOpen(true)}
                  >
                    + 일정 등록
                  </button>
                </div>
              </div>

              <div className="schedule-tabs-container">
                <div className="schedule-tabs">
                  {/* To Do 탭 및 주간 탭 제거됨 */}
                  {[
                    { key: "monthly", label: "월" },
                    { key: "daily", label: "일" },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      className={`schedule-tab-btn${todoViewMode === key ? " active" : ""}`}
                      onClick={() => setTodoViewMode(key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="schedule-tab-content">
                {todoViewMode === "daily" && renderDailyTimeline()}
                {todoViewMode === "monthly" && (
                  <MonthlyCalendar
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    currentMonth={currentMonth}
                    events={events}
                    allAiTodos={allAiTodos}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth}
                  />
                )}
              </div>

              {toast?.show && (
                <div className="dashboard-toast">
                  <Sparkles size={16} className="toast-spark" />
                  <span>{toast.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* 스플리터 */}
          <div
            className={`dashboard-resizer${isResizing ? " active" : ""}`}
            onMouseDown={startResizing}
          >
            <div className="resizer-knob" />
          </div>

          {/* 오른쪽: 고객 관리 / 방문 브리핑 / 알림 */}
          <div className="dashboard-body-column right-column" style={{ width: `${100 - leftWidth}%` }}>
            {/* 주요 고객 관리 */}
            <div className="bottom-card key-customers-card-new">
              <div className="bottom-card-header">
                <h2 className="bottom-card-title">주요 고객 관리</h2>
                <Link to="/customer-management-dashboard-2" className="btn-all-customers">전체보기</Link>
              </div>
              <div className="customers-pill-list-wrap">
                {loadingCustomers ? (
                  <div className="customers-loading">고객 분석을 로드하는 중입니다...</div>
                ) : (
                  <div className="customers-pill-scroll">
                    {/* [FIX #4] 중복 제거된 mergedCustomerList 사용, key에서 idx 제거 */}
                    {mergedCustomerList.map((c) => {
                      const churnItem = churnRiskCustomers.find((cr) => cr.id === c.id);
                      const isChurnRisk = !!churnItem;
                      return (
                        <div
                          key={c.id}
                          className={`customer-pill-card${expandedCustomerId === c.id ? " active" : ""}`}
                          onClick={() => handleCustomerCardClick(c.id)}
                        >
                          <div className={`avatar-circle ${isChurnRisk ? "risk" : "visit"}`}>
                            {c.initial}
                          </div>
                          <div className="pill-info">
                            <span className="pill-name">{c.name}</span>
                            <span className={`pill-badge ${isChurnRisk ? (churnItem.grade === "위험" ? "risk-high" : "risk-warning") : "visit-badge"}`}>
                              {isChurnRisk ? `AI: ${churnItem.grade}` : "오늘 방문"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {expandedCustomerId && expandedCustomerDetails && !loadingDetails && (
                <div className="premium-customer-detail-panel">
                  {/* 헤더 영역 */}
                  <div className="panel-header">
                    <div className="header-left">
                      <div className="avatar-circle-large">
                        {expandedCustomerDetails.detail?.name?.[0] ?? "고"}
                      </div>
                      <div className="customer-meta">
                        <span className="customer-name-large">
                          {expandedCustomerDetails.detail?.name} 고객님
                        </span>
                        <div className="customer-tags">
                          <span className="tag-badge grade">{expandedCustomerDetails.detail?.grade ?? "일반"}</span>
                          <span className="tag-badge tendency">{expandedCustomerDetails.detail?.tendency ?? "안정추구형"}</span>
                          <span className="tag-badge job">{expandedCustomerDetails.detail?.job ?? "초등교사"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="header-right">
                      {/* 상세 프로필 이동 */}
                      <button 
                        className="btn-go-profile"
                        onClick={() => navigate(`/customer-management-registration-1?c_id=${expandedCustomerId}`)}
                      >
                        상세 프로필 <ChevronRight size={14} style={{ marginLeft: "2px" }} />
                      </button>
                      <button
                        className="btn-close-panel"
                        onClick={() => {
                          setExpandedCustomerId(null);
                          setExpandedCustomerDetails(null);
                        }}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {/* 2x2 카드 그리드 */}
                  <div className="panel-grid-2x2">
                    {/* 카드 1: AI 이탈 위험 예측 */}
                    <div className="insight-card risk-card">
                      <div className="card-header">
                        <div className="card-title-group">
                          <span className="spark-emoji">✨ 🔮</span>
                          <span className="card-title">AI 이탈 위험 예측</span>
                        </div>
                        <span className={`risk-status-badge ${expandedCustomerDetails.risk?.grade === "위험" || expandedCustomerDetails.risk?.grade === "위험예측" ? "danger" : expandedCustomerDetails.risk?.grade === "주의" ? "warning" : "good"}`}>
                          {expandedCustomerDetails.risk?.grade ?? "양호"}
                        </span>
                      </div>
                      <p className="card-body-text">
                        {summarizeInsight(expandedCustomerDetails.risk?.reason ?? "고객의 이탈을 시사하는 불만 사항이나 거액 출금이 관찰되지 않았습니다.")}
                      </p>
                    </div>

                    {/* 카드 2: AI 추천 상품 & 매칭 사유 */}
                    <div className="insight-card product-card">
                      <div className="card-header">
                        <div className="card-title-group">
                          <span className="spark-emoji">✨ ✨</span>
                          <span className="card-title">AI 추천 상품</span>
                        </div>
                      </div>
                      <div className="product-match-list">
                        {expandedCustomerDetails.productMatch && expandedCustomerDetails.productMatch.length > 0 ? (
                          expandedCustomerDetails.productMatch.slice(0, 3).map((prod, idx) => {
                            let statusText = "적합";
                            let statusClass = "recommend";
                            if (prod.is_owned) {
                              statusText = "보유중";
                              statusClass = "owned";
                            } else if (prod.is_suitable === false) {
                              statusText = "부적합";
                              statusClass = "unsuitable";
                            }
                            return (
                              <div className="product-match-item" key={idx}>
                                <div className="product-item-header">
                                  <span className="product-name">{prod.product_name}</span>
                                  <span className={`product-status-badge ${statusClass}`}>
                                    {statusText}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <>
                            <div className="product-match-item">
                              <div className="product-item-header">
                                <span className="product-name">WON플러스예금</span>
                                <span className="product-status-badge owned">보유중</span>
                              </div>
                            </div>
                            <div className="product-match-item">
                              <div className="product-item-header">
                                <span className="product-name">우리WON통장</span>
                                <span className="product-status-badge recommend">적합</span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* 카드 3: AI 메모 요약 핵심 특징 */}
                    <div className="insight-card features-card">
                      <div className="card-header">
                        <div className="card-title-group">
                          <span className="spark-emoji">✨ 🏷️</span>
                          <span className="card-title">AI 메모 요약 핵심 특징</span>
                        </div>
                      </div>
                      <div className="features-tags-container">
                        {expandedCustomerDetails.features && expandedCustomerDetails.features.length > 0 ? (
                          expandedCustomerDetails.features.slice(0, 4).map((feat, idx) => (
                            <span className="feature-tag-pill" key={idx} style={{ backgroundColor: feat.color ? `${feat.color}15` : "#f8fafc", color: feat.color ?? "#475569" }}>
                              # {feat.text}
                            </span>
                          ))
                        ) : (
                          ["일반", "안정추구형", "초등교사"].map((text, idx) => (
                            <span className="feature-tag-pill" key={idx}>
                              # {text}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    {/* 카드 4: 자산 포트폴리오 AI 진단 */}
                    <div className="insight-card portfolio-card">
                      <div className="card-header">
                        <div className="card-title-group">
                          <span className="spark-emoji">✨ 📊</span>
                          <span className="card-title">자산 포트폴리오 AI 진단</span>
                        </div>
                      </div>
                      <div className="portfolio-body">
                        <div className="asset-total-label">
                          총 순자산: <span className="asset-total-value">{expandedCustomerDetails.detail?.total_assets ? (typeof expandedCustomerDetails.detail.total_assets === "number" ? `${(expandedCustomerDetails.detail.total_assets / 100000000).toFixed(1)}억원` : expandedCustomerDetails.detail.total_assets) : "8.0억원"}</span>
                        </div>
                        <p className="card-body-text">
                          {summarizeInsight(expandedCustomerDetails.detail?.llm_insight ?? "자산 분석 결과 예금 비중이 62.5%로 다소 높은 편입니다. 안정성을 고려하더라도 일부 자산을 채권형 상품이나 배당주로 전환하여 투자 성향에 맞춘 리밸런싱을 권장합니다.")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 하단 2분할 */}
            <div className="bottom-sub-split">
              {/* 방문 브리핑 */}
              <div className="bottom-card sub-split-card visit-briefing-card">
                <div className="bottom-card-header">
                  <h2 className="bottom-card-title">방문 브리핑</h2>
                  <span className="header-count-indicator">오늘 {todayVisitors.length}건</span>
                </div>
                <div className="briefing-list-container">
                  {loadingCustomers ? (
                    <div className="briefing-loading">브리핑 데이터를 분석 중입니다...</div>
                  ) : todayVisitors.length === 0 ? (
                    <div className="briefing-empty">오늘 예정된 방문 브리핑이 없습니다.</div>
                  ) : (
                    todayVisitors.map((v) => {
                      const churnItem = churnRiskCustomers.find((cr) => cr.id === v.id);
                      return (
                        <div key={v.id} className="briefing-card" onClick={() => handleCustomerCardClick(v.id)}>
                          <div className="briefing-card-top">
                            <span className="briefing-name">{v.name} <span className="vip-tag">VIP</span></span>
                          </div>
                          <div className="briefing-card-body">
                            {churnItem && (
                              <div className="briefing-risk-wrap">
                                <span className="risk-badge red">이탈위험</span>
                                <span className="risk-text">{churnItem.reason}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* 알림 */}
              <div className="bottom-card sub-split-card notifications-card-new">
                <div className="bottom-card-header">
                  <h2 className="bottom-card-title">알림</h2>
                  {notifications.length > 0 && (
                    <span className="notif-badge-circle">{notifications.length}</span>
                  )}
                </div>
                <div className="notifications-simple-list">
                  {loadingNotifications ? (
                    <div className="notif-loading">알림 피드를 불러오는 중입니다...</div>
                  ) : notifications.length === 0 ? (
                    <div className="notif-empty">수신된 알림이 없습니다.</div>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id} className="simple-notif-item" onClick={() => navigate("/notifications")}>
                        <div className="notif-item-header">
                          <span className="notif-date">{notif.date}</span>
                          <span className="notif-category">{getNotificationCategoryLabel(notif.category)}</span>
                        </div>
                        <h4 className="notif-item-title">{notif.type}</h4>
                        <p className="notif-item-content">{notif.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScheduleRegistrationModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />

      {/* 커스텀 삭제/숨김 확인 컨펌 모달 */}
      {confirmModal.isOpen && (
        <div className="custom-confirm-overlay" onClick={closeConfirm}>
          <div className="custom-confirm-card" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-header">
              <h3 className="confirm-title">{confirmModal.title}</h3>
            </div>
            <div className="confirm-body">
              <p className="confirm-message">{confirmModal.message}</p>
            </div>
            <div className="confirm-footer">
              <button className="btn-confirm-cancel" onClick={closeConfirm}>
                취소
              </button>
              <button 
                className="btn-confirm-action" 
                onClick={confirmModal.onConfirm}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 주력 상품 상세 설명 모달 */}
      {isProductModalOpen && (
        <div className="product-detail-modal-overlay" onClick={() => setIsProductModalOpen(false)}>
          <div className="product-detail-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="modal-product-type-badge">{selectedProductDetail?.type ?? "금융상품"}</span>
                <h3 className="modal-product-name">{selectedProductDetail?.name ?? "상품 상세 정보"}</h3>
              </div>
              <button className="btn-close-modal" onClick={() => setIsProductModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              {loadingProductDetail ? (
                <div className="modal-loading-container">
                  <div className="modal-spinner" />
                  <span>상품 상세 정보를 로딩 중입니다...</span>
                </div>
              ) : selectedProductDetail ? (
                <div className="modal-detail-content">
                  <div className="modal-info-row">
                    <div className="info-item">
                      <span className="info-label">제공사</span>
                      <span className="info-value">{selectedProductDetail.issuer ?? "-"}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">예상 수익률 / 이율</span>
                      <span className="info-value highlight">
                        {selectedProductDetail.expected_return ? `${selectedProductDetail.expected_return}%` : "-"} 
                        <span className="info-value-sub"> ({selectedProductDetail.return_type ?? "세전"})</span>
                      </span>
                    </div>
                  </div>

                  <div className="modal-section">
                    <h4 className="section-title">상품 설명</h4>
                    <p className="section-content description-text">{selectedProductDetail.explanation ?? "설명이 없습니다."}</p>
                  </div>

                  <div className="modal-section">
                    <h4 className="section-title">주요 특징</h4>
                    <div className="features-tags">
                      {selectedProductDetail.features ? (
                        selectedProductDetail.features.split(',').map((feat, idx) => (
                          <span key={idx} className="feature-tag"># {feat.trim()}</span>
                        ))
                      ) : (
                        <span className="no-features">제공된 특징이 없습니다.</span>
                      )}
                    </div>
                  </div>

                  <div className="modal-section">
                    <h4 className="section-title">추천 대상</h4>
                    <p className="section-content target-text">{selectedProductDetail.target_customer ?? "추천 대상 정보가 없습니다."}</p>
                  </div>

                  {selectedProductDetail.suitable_customers && selectedProductDetail.suitable_customers.length > 0 && (
                    <div className="modal-section">
                      <h4 className="section-title">추천 적합 고객</h4>
                      <div className="suitable-customers-list">
                        {selectedProductDetail.suitable_customers.map((cust) => (
                          <div 
                            key={cust.c_id} 
                            className="suitable-customer-pill"
                            onClick={() => {
                              setIsProductModalOpen(false);
                              navigate(`/customer-management-registration-1?c_id=${cust.c_id}`);
                            }}
                          >
                            <span className="cust-name">{cust.name}</span>
                            <span className="cust-grade">{cust.grade}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="modal-error-container">
                  <span>상품 정보를 불러오지 못했습니다.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 서브 컴포넌트: 주간 캘린더 ──────────────────────────────

/**
 * [FIX #9] WeeklyCalendar를 독립 컴포넌트로 분리
 */
function WeeklyCalendar({ selectedDate, setSelectedDate, events, allAiTodos }) {
  const weekDays = getWeekDays(selectedDate);
  return (
    <div className="new-weekly-calendar">
      <div className="weekly-header-row">
        {weekDays.map((day, idx) => {
          const isSelected =
            day.getFullYear() === selectedDate.getFullYear() &&
            day.getMonth() === selectedDate.getMonth() &&
            day.getDate() === selectedDate.getDate();
          return (
            <div key={idx} className="weekly-header-cell" onClick={() => setSelectedDate(day)}>
              <span className="weekly-day-name">{DAY_NAMES[idx]}</span>
              <span className={`weekly-date-number${isSelected ? " active" : ""}`}>
                {day.getDate()}
              </span>
            </div>
          );
        })}
      </div>
      <div className="weekly-body-row">
        {weekDays.map((day, idx) => {
          const cellDateStr = toDateStr(day);
          const cellEvents = events.filter((e) => e.startTime.startsWith(cellDateStr));
          const cellAiTodos = allAiTodos.filter((t) => t.executionDate?.startsWith(cellDateStr));
          return (
            <div key={idx} className="weekly-column-cell" onClick={() => setSelectedDate(day)}>
              {cellEvents.map((ev) => {
                const isBirthday =
                  ev.title.includes("생일축하") ||
                  ev.title.includes("생일 축하") ||
                  ev.title.includes("🎂");
                const displayTitle = ev.customer
                  ? `${ev.customer}${isBirthday ? "🎂" : ""}`
                  : ev.title;
                return (
                  <div
                    key={ev.id}
                    className={`weekly-event-badge color-${ev.color ?? "blue"}`}
                    title={ev.title}
                  >
                    {displayTitle}
                  </div>
                );
              })}
              {cellAiTodos.slice(0, 1).map((todo) => (
                <div
                  key={todo.id}
                  className="weekly-event-badge color-purple"
                  title={`[AI 제안] ${todo.content}`}
                >
                  ✨ {todo.content.substring(0, 5)}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── 서브 컴포넌트: 월간 캘린더 ──────────────────────────────

/**
 * [FIX #9] MonthlyCalendar를 독립 컴포넌트로 분리
 */
function MonthlyCalendar({ selectedDate, setSelectedDate, currentMonth, events, allAiTodos, onPrevMonth, onNextMonth }) {
  const dateStr = toDateStr(selectedDate);

  const dayEvents = events.filter((e) => e.startTime.startsWith(dateStr));
  const dayAiTodos = allAiTodos.filter((t) => t.executionDate?.startsWith(dateStr));

  const combined = [
    ...dayEvents.map((e) => ({
      id: `event-${e.id}`,
      time: e.startTime.split(" ")[1] ?? "09:00",
      title: e.title,
      color: e.color,
    })),
    ...dayAiTodos.map((todo) => ({
      id: `ai-${todo.id}`,
      time: todo.time?.split(" - ")[0] ?? "10:00",
      title: `[AI 추천] ${todo.content}`,
      color: "purple",
    })),
  ].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div
      className="main-mini-monthly-calendar-container"
      style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1, minHeight: 0 }}
    >
      <div
        className="main-mini-monthly-calendar"
        style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, minHeight: 0 }}
      >
        <div className="monthly-nav">
          <button
            className="monthly-nav-btn"
            onClick={(e) => { e.stopPropagation(); onPrevMonth(); }}
            style={{ border: "none", background: "transparent", cursor: "pointer" }}
          >
            <ChevronLeft size={14} />
          </button>
          <span className="monthly-nav-title">
            {formatMonthTitle(currentMonth.year, currentMonth.month)}
          </span>
          <button
            className="monthly-nav-btn"
            onClick={(e) => { e.stopPropagation(); onNextMonth(); }}
            style={{ border: "none", background: "transparent", cursor: "pointer" }}
          >
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="monthly-grid-header">
          {CALENDAR_DAYS.map((day, idx) => (
            <span
              key={idx}
              style={idx === 0 ? { color: "#ef4444" } : idx === 6 ? { color: "#3b82f6" } : {}}
            >
              {day}
            </span>
          ))}
        </div>

        <div className="monthly-grid-body">
          {generateMiniCalendar(currentMonth.year, currentMonth.month, selectedDate, "month").map(
            (d, idx) => {
              const cellDate = d.date;
              const cellDateStr = toDateStr(cellDate);
              const hasEvents =
                events.some((e) => e.startTime.startsWith(cellDateStr)) ||
                allAiTodos.some((t) => t.executionDate?.startsWith(cellDateStr));
              const isSelected =
                cellDate.getFullYear() === selectedDate.getFullYear() &&
                cellDate.getMonth() === selectedDate.getMonth() &&
                cellDate.getDate() === selectedDate.getDate();

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDate(cellDate)}
                  className={`monthly-cell${d.muted ? " muted" : ""}`}
                >
                  <span className={`monthly-date${isSelected ? " active" : ""}`}>
                    {cellDate.getDate()}
                  </span>
                  {hasEvents && !isSelected && <span className="monthly-dot" />}
                </div>
              );
            }
          )}
        </div>
      </div>

      <div style={{ borderBottom: "1px solid var(--main-border)", margin: "4px 0" }} />

      {combined.length === 0 ? (
        <div className="monthly-schedule-empty">진행 예정인 일정이 없습니다.</div>
      ) : (
        <div className="monthly-schedule-list">
          {combined.map((item) => (
            <div key={item.id} className="monthly-schedule-item">
              <span className={`schedule-indicator-bar ${getIndicatorClass(item.color)}`} />
              <span className="schedule-item-time">{item.time}</span>
              <span className="schedule-item-title">{item.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── 서브 컴포넌트: KPI 메트릭 ────────────────────────────────
function KpiMetric({ label, value, unit, goal, format }) {
  const displayValue = value == null ? "-" : format === "number" ? value.toLocaleString() : value;
  const displayGoal = goal == null ? "-" : format === "number" ? goal.toLocaleString() : goal;
  return (
    <div className="top-metric-item">
      <span className="metric-label">{label}</span>
      <span className="metric-value">
        {displayValue}
        <span className="metric-unit">{unit}</span>
      </span>
      {goal != null && (
        <span className="metric-goal-text">
          / {displayGoal}
          <span className="metric-goal-unit">{unit}</span>
        </span>
      )}
    </div>
  );
}