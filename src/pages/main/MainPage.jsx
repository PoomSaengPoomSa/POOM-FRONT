import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, RotateCcw, Sparkles, X, Calendar, MoreHorizontal, ChevronDown
} from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import { api } from "../../api";
import { useCalendar } from "../calendar/CalendarContext";
import { generateMiniCalendar, getWeekDays } from "../calendar/calendarUtils";
import ScheduleRegistrationModal from "../calendar/ScheduleRegistrationModal";
import "./MainPage.css";

// ─── 상수 정의 ────────────────────────────────────────────────
const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];
const DEFAULT_LEFT_WIDTH = 50;
const MAX_NEWS_COUNT = 2;
const MAX_NOTIFICATIONS = 5;
const CHURN_RISK_GRADES = ["위험", "주의"];

const SCHEDULE_COLOR_MAP = {
  pink: "indicator-red",
  yellow: "indicator-orange",
  green: "indicator-green",
  purple: "indicator-purple",
  gray: "indicator-gray",
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

// 모달 및 서브 카드에서 공통으로 사용되는 인라인 스타일 추출
const splitHeaderStyle = (isExpanded) => ({
  marginBottom: isExpanded ? "0" : "12px",
  borderBottom: isExpanded ? "none" : "1px solid var(--main-border)",
  paddingBottom: isExpanded ? "0" : "8px",
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
});

const btnDangerStyle = { padding: '8px 16px', fontSize: '12px', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' };
const btnNeutralStyle = { padding: '8px 16px', fontSize: '12px', backgroundColor: '#d0e1f1', color: '#475569', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' };
const btnCancelStyle = { padding: '8px 16px', fontSize: '12px', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' };

// ─── 유틸 함수 ────────────────────────────────────────────────
const getIndicatorClass = (color) =>
  SCHEDULE_COLOR_MAP[color] ?? SCHEDULE_COLOR_MAP.default;

const getNotificationCategoryLabel = (category) =>
  NOTIFICATION_CATEGORY_LABELS[category] ?? NOTIFICATION_CATEGORY_LABELS.default;

const getAiTodoDurationMs = (category) =>
  AI_TODO_DURATION_MS[category] ?? AI_TODO_DURATION_MS.default;

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

const getCurrentUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (storageError) {
    if (storageError instanceof DOMException) {
      console.warn("localStorage에 접근할 수 없습니다:", storageError.message);
      return null;
    }
    console.error("currentUser 데이터 파싱 실패. 저장된 값이 손상되었을 수 있습니다:", storageError);
    return null;
  }
};

const getCoreKeywords = (title) => {
  if (!title) return "";
  let cleanTitle = title.replace(/\[.*?\]|\(.*?\)/g, "").trim();
  cleanTitle = cleanTitle.replace(/[,.·'"`“”聞‘’]/g, " ").trim();
  const words = cleanTitle.split(/\s+/);
  const filtered = words
    .map(word => word.replace(/(은|는|이|가|을|를|에|의|과|와|으로|로|에서|만)$/, ""))
    .filter(word => word.length >= 2);
  const resultWords = filtered.length > 0 ? filtered : words;
  return resultWords.slice(0, 4).join(" ");
};

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

// ─── 공통 텍스트 하이라이팅 처리 ─────────────────────────────
const highlightText = (text, tendencies = [], keywords = []) => {
  if (!text) return "";
  
  // 소수점 스페이스 교정 (예: "30. 3%" -> "30.3%")
  let normalized = text.replace(/(\d+)\s*\.\s*(\d+)\s*%/g, "$1.$2%");

  const tGroup = tendencies.length > 0 ? tendencies.join("|") : "DUMMY_TEND";
  const kGroup = keywords.length > 0 ? keywords.join("|") : "DUMMY_KEY";

  // 정규식 캡처 그룹: 1) 퍼센트, 2) 금액/건수, 3) 투자성향, 4) 일반 키워드
  const pattern = new RegExp(
    `(\\d+(?:\\.\\d+)?%)|([\\d,]+(?:\\.\\d+)?\\s*(?:천만|억|백만|억원|억원대|원|건))|(${tGroup})|(${kGroup})`,
    "g"
  );

  const parts = normalized.split(pattern);
  const elements = [];
  let keyIdx = 0;

  for (let i = 0; i < parts.length; i += 5) {
    if (parts[i]) elements.push(parts[i]);
    
    if (i + 1 < parts.length) {
      const pct = parts[i + 1];
      const val = parts[i + 2];
      const tend = parts[i + 3];
      const kw = parts[i + 4];

      if (pct) elements.push(<strong key={`pct-${keyIdx++}`} className="insight-highlight percentage" style={{ fontSize: 'inherit' }}>{pct}</strong>);
      else if (val) elements.push(<strong key={`val-${keyIdx++}`} className="insight-highlight percentage" style={{ fontSize: 'inherit', color: '#ea580c' }}>{val}</strong>);
      else if (tend) elements.push(<strong key={`tend-${keyIdx++}`} className="insight-highlight tendency">{tend}</strong>);
      else if (kw) elements.push(<span key={`kw-${keyIdx++}`} className="insight-highlight keyword" style={{ fontSize: 'inherit' }}>{kw}</span>);
    }
  }
  return elements;
};

const formatLlmInsight = (text) => highlightText(
  text || "등록된 AI 인사이트가 없습니다.",
  ["안정형", "안정추구형", "위험중립형", "적극투자형", "공격투자형"],
  ["예적금", "예금 비중", "예적금 비중", "투자 비중", "투자형 자산", "글로벌 ETF", "배당주", "채권형 펀드", "채권형 상품", "대출 상환", "안전자산", "안전 자산", "리밸런싱", "포트폴리오", "재배분"]
);

const formatProductExplanation = (text) => highlightText(
  text || "설명이 없습니다.",
  [],
  ["우대금리", "우대 금리", "비과세", "수수료 면제", "수수료 우대", "특별 우대", "중도상환 수수료 면제", "만기", "이자", "납입", "적립", "이율", "혜택", "최대", "최고", "기본", "최저", "금리"]
);

const formatBriefingText = (text) => highlightText(
  text,
  ["공격투자형", "안정추구형", "안정형", "위험중립형", "적극투자형", "투자 성향", "투자성향"],
  ["이탈 위험", "이탈", "불만", "거액 출금", "자산 분석", "리밸런싱", "재배분", "예적금", "예금 비중", "글로벌 ETF", "채권형 상품", "방문", "상담", "피드백", "이탈위험", "만기", "해지", "가입", "자산", "순자산"]
);

const parseBriefing = (expandedContent) => {
  if (!expandedContent || expandedContent.length === 0) return null;
  
  const result = {
    summary: [],
    preference: [],
    assets: [],
    notes: [],
    history: []
  };
  
  let currentSection = null;
  let hasDynamicData = false;
  
  for (const line of expandedContent) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    if (trimmed === "[Quick Summary]" || trimmed.startsWith("[Quick Summary") || trimmed === "[요약]") {
      currentSection = "summary";
      hasDynamicData = true;
    } else if (trimmed === "[고객 정보 & Preference]" || trimmed.startsWith("[고객 정보") || trimmed === "[선호도]") {
      currentSection = "preference";
      hasDynamicData = true;
    } else if (trimmed === "[자산 현황 & 최근 거래 내역]" || trimmed.startsWith("[자산 현황") || trimmed === "[자산]") {
      currentSection = "assets";
      hasDynamicData = true;
    } else if (trimmed === "[핵심 특이사항]" || trimmed.startsWith("[핵심 특이사항") || trimmed === "[특이사항]") {
      currentSection = "notes";
      hasDynamicData = true;
    } else if (currentSection) {
      if (currentSection === "notes" && (trimmed.includes("상담 내용:") || trimmed.includes("상담 히스토리"))) {
        let match = trimmed.match(/^-\s*\[(\d{4}-\d{2}-\d{2})\]\s*상담 내용:\s*(.*?)\s*\|\s*AI 요약:\s*(.*?)(?:\s*\|\s*ID:\s*(\d+))?$/);
        if (!match) {
          match = trimmed.match(/^\[(\d{4}-\d{2}-\d{2})\]\s*상담 내용:\s*(.*?)\s*\|\s*AI 요약:\s*(.*?)(?:\s*\|\s*ID:\s*(\d+))?$/);
        }
        if (match) {
          result.history.push({
            date: match[1],
            content: match[2],
            summary: match[3],
            cm_id: match[4] ? parseInt(match[4], 10) : null
          });
          continue;
        }
      }
      
      if (trimmed.includes("이전 상담 히스토리 요약")) {
        continue;
      }
      result[currentSection].push(trimmed);
    }
  }
  
  if (!hasDynamicData) return null;
  return result;
};

// ─── 공통 컴포넌트 ──────────────────────────────

function TimelineCard({ item, isCompleted, onToggle, onDelete, onShowDetail, onIgnoreAi, onSelectAi }) {
  const isAi = item.type === "ai";
  const data = item.data;
  
  // AI 추천이었다가 확정된 일정 (type은 my지만 at_id 존재)
  const isConvertedAi = item.type === "my" && data.at_id && data.at_id !== "None" && data.at_id !== "null" && data.at_id !== 0;
  
  const cardClass = isAi || isConvertedAi 
    ? "ai-todo-card diagonal-stripes" + (isConvertedAi ? " from-ai" : "")
    : `my-todo-card color-${data.color ?? "blue"} category-${data.category ?? "기타"}`;
    
  const handleAction = (actionFn, param, ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    actionFn(param);
  };

  return (
    <div className="new-timeline-row">
      <div className="new-timeline-time">{item.timeLabel.split(" ")[0]}</div>
      <div 
        className={`new-schedule-item ${cardClass} ${isCompleted ? 'is-completed' : ''}`}
        onClick={() => onShowDetail(data, item.type)}
        style={{ cursor: "pointer" }}
      >
        <div 
          className={`round-checkbox ${isCompleted ? 'checked' : ''}`}
          onClick={(ev) => handleAction(isAi ? onSelectAi : onToggle, isAi ? data : data.id, ev)}
          title={isAi ? "일정 등록" : (isCompleted ? "완료 취소" : "할 일 완료")}
        >
          {isCompleted && <div className="check-mark" />}
        </div>
        
        <div className="schedule-info-group">
          <div className="schedule-title-wrap">
            {/* 제목 렌더링 유지 */}
            <span className="schedule-title">{isAi ? data.content : data.title}</span>
            
            {/* 💡 변경된 부분: isConvertedAi (확정된 AI 추천)일 때도 "AI 추천" 텍스트 유지 */}
            <span className={`schedule-source-tag ${isAi || isConvertedAi ? 'ai' : ''}`}>
              {isAi || isConvertedAi ? "AI 추천" : "My To Do"}
            </span>
          </div>
          <span className="schedule-memo text-muted">
            {isAi ? data.subText : data.memo}
          </span>
        </div>
        
        <div className="todo-action-buttons">
          <button
            className="todo-delete-btn"
            onClick={(ev) => handleAction(isAi ? onIgnoreAi : onDelete, data, ev)}
            title={isAi ? "AI 추천 숨기기" : "일정 삭제"}
          >
            <X size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

function HistoryItem({ hist, c_id }) {
  const [isOpen, setIsOpen] = useState(false);
  const [fullMemo, setFullMemo] = useState("");
  const [loadingFull, setLoadingFull] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const fetchFullMemo = async (e) => {
    e.stopPropagation();
    if (!c_id || !hist.cm_id) return;
    setLoadingFull(true);
    try {
      const data = await api.customer.getMemoDetail(c_id, hist.cm_id);
      if (data && data.memo) {
        setFullMemo(data.memo);
        setShowFull(true);
      }
    } catch (err) {
      console.error("Failed to fetch full memo:", err);
    } finally {
      setLoadingFull(false);
    }
  };

  return (
    <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', userSelect: 'none', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
      <div onClick={() => setIsOpen(!isOpen)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>
          📅 {hist.date} - AI 요약: <span style={{ color: '#0284c7' }}>{hist.summary}</span>
        </span>
        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>
          {isOpen ? "▲ 접기" : "▼ 상세 상담내용 보기"}
        </span>
      </div>
      {isOpen && (
        <div style={{ marginTop: '6px', padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '12.5px', color: '#475569', lineHeight: '1.6', borderLeft: '4px solid #0284c7' }}>
          <div>
            {showFull ? (
              <div style={{ whiteSpace: 'pre-wrap' }}>{fullMemo}</div>
            ) : (
              <div>
                <span>{hist.content}</span>
                {hist.cm_id && c_id && (
                  <span onClick={fetchFullMemo} style={{ marginLeft: '8px', color: '#0284c7', cursor: 'pointer', textDecoration: 'underline', fontWeight: '600' }}>
                    {loadingFull ? "[불러오는 중...]" : "[원본 전체보기]"}
                  </span>
                )}
              </div>
            )}
          </div>
          {showFull && (
            <div onClick={(e) => { e.stopPropagation(); setShowFull(false); }} style={{ marginTop: '8px', color: '#64748b', cursor: 'pointer', fontSize: '11.5px', textDecoration: 'underline', textAlign: 'right' }}>
              간략히 보기
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────
export default function MainPage() {
  const navigate = useNavigate();

  const {
    events, selectedDate, setSelectedDate, allAiTodos, toast, showToast,
    personalKpi, branchKpi, seasonalProducts, deleteEvent, updateEvent,
    fetchKpiData, fetchCalendarData, ignoredAiTodoIds, handleIgnoreAiTodo,
  } = useCalendar();

  const [activeKpiTab, setActiveKpiTab] = useState("personal");
  const [todoViewMode, setTodoViewMode] = useState("daily");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editEventData, setEditEventData] = useState(null);
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

  const [rollingIndex, setRollingIndex] = useState(0);
  const [isRollingPaused, setIsRollingPaused] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [loadingProductDetail, setLoadingProductDetail] = useState(false);
  const [trendIndicators, setTrendIndicators] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: null });
  const [selectedScheduleDetail, setSelectedScheduleDetail] = useState(null);
  const [isScheduleDetailModalOpen, setIsScheduleDetailModalOpen] = useState(false);

  const showConfirm = (title, message, onConfirm) => {
    setConfirmModal({
      isOpen: true, title, message,
      onConfirm: () => { onConfirm(); closeConfirm(); },
    });
  };

  const closeConfirm = () => setConfirmModal((prev) => ({ ...prev, isOpen: false }));

  const handleShowScheduleDetail = useCallback((item, source) => {
    setSelectedScheduleDetail({
      data: source === "combined" ? item.raw : item,
      type: source === "combined" ? item.type : source
    });
    setIsScheduleDetailModalOpen(true);
  }, []);

  const currentUser = useMemo(() => getCurrentUserFromStorage(), []);
  const [completedMyTodos, setCompletedMyTodos] = useState(new Set());

  useEffect(() => {
    if (events && events.length > 0) {
      setCompletedMyTodos((prev) => {
        const next = new Set(prev);
        events.forEach((e) => {
          if (e.at_id && e.at_id !== "None" && e.at_id !== "null" && e.at_id !== 0) {
            next.add(e.id);
          }
        });
        return next;
      });
    }
  }, [events]);

  const [activeNotifId, setActiveNotifId] = useState(null);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [selectedBriefing, setSelectedBriefing] = useState(null);
  const [modalSize, setModalSize] = useState({ width: 850, height: 650 });

  const handleResizeStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX, startY = e.clientY;
    const startWidth = modalSize.width, startHeight = modalSize.height;
    let hasDragged = false;

    const handleMouseMove = (moveEvent) => {
      hasDragged = true;
      setModalSize({
        width: Math.max(500, Math.min(1300, startWidth + (moveEvent.clientX - startX))),
        height: Math.max(400, Math.min(window.innerHeight * 0.9, startHeight + (moveEvent.clientY - startY)))
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      if (hasDragged) {
        const swallowClick = (clickEvent) => {
          clickEvent.stopPropagation();
          clickEvent.preventDefault();
          window.removeEventListener("click", swallowClick, true);
        };
        window.addEventListener("click", swallowClick, true);
        setTimeout(() => window.removeEventListener("click", swallowClick, true), 50);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleVisitorClick = async (customerId) => {
    try {
      const briefingData = await api.notification.getBriefing(customerId);
      if (briefingData) {
        setSelectedBriefing(briefingData);
        setIsBriefingOpen(true);
      } else handleCustomerCardClick(customerId);
    } catch (err) {
      console.error("Failed to fetch visitor briefing:", err);
      handleCustomerCardClick(customerId);
    }
  };

  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        const response = await api.trend.getDashboard();
        if (response?.realtimeTrends?.length > 0) setTrendIndicators(response.realtimeTrends);
      } catch (error) { console.error("실시간 경제 지표 조회 실패:", error); }
    };
    fetchIndicators();
  }, []);

  useEffect(() => {
    if (isRollingPaused) return;
    const timer = setInterval(() => setRollingIndex((prev) => (prev + 1) % 3), 3000);
    return () => clearInterval(timer);
  }, [isRollingPaused]);

  const handleProductClick = async (productId) => {
    setLoadingProductDetail(true);
    setIsProductModalOpen(true);
    setSelectedProductDetail(null);
    try {
      const detail = await api.kpi.getSeasonalProductDetail(productId);
      setSelectedProductDetail(detail);
    } catch (error) { console.error("주력 상품 상세 조회 실패:", error); } 
    finally { setLoadingProductDetail(false); }
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
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // ─── 데이터 패칭 ──────────────────────────────────────────
  useEffect(() => { fetchKpiData?.(); }, [fetchKpiData]);

  useEffect(() => {
    setCurrentMonth({ year: selectedDate.getFullYear(), month: selectedDate.getMonth() });
  }, [selectedDate]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.trend.getNewsList({ size: MAX_NEWS_COUNT });
        if (response?.items?.length > 0) {
          setNewsList(response.items.map((item) => ({
            source: item.media || item.source || "뉴스", title: item.title,
          })));
        }
      } catch (e) { console.error("Failed to fetch news:", e); }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const fetchCustomersAndRisks = async () => {
      try {
        setLoadingCustomers(true);
        const todayResponse = await api.customer.getList("today");
        setTodayVisitors(todayResponse.map((c) => ({
          id: c.c_id, name: c.name, email: c.email, phone: c.phone,
          initial: c.name?.[0] ?? "고", avatarType: "visit", grade: c.grade ?? "일반",
        })));

        const allResponse = await api.customer.getList("all");
        const risksResults = await Promise.all(
          allResponse.map(async (c) => {
            try { return { customer: c, risk: await api.customer.getChurnRisk(c.c_id) }; } 
            catch { return { customer: c, risk: null }; }
          })
        );

        setChurnRiskCustomers(risksResults
          .filter((item) => item.risk && CHURN_RISK_GRADES.includes(item.risk.grade))
          .map((item) => ({
            id: item.customer.c_id, name: item.customer.name, grade: item.risk.grade,
            reason: item.risk.reason, initial: item.customer.name?.[0] ?? "고", avatarType: "risk",
          }))
        );
      } catch (e) { console.error("Failed to load customer list or risks:", e); } 
      finally { setLoadingCustomers(false); }
    };
    fetchCustomersAndRisks();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoadingNotifications(true);
        const data = await api.notification.getList("today");
        setNotifications(data.slice(0, MAX_NOTIFICATIONS));
      } catch (err) { console.error("Failed to fetch notifications:", err); } 
      finally { setLoadingNotifications(false); }
    };
    fetchNotifications();
  }, []);

  const handlePrevMonth = () => setCurrentMonth(({ year, month }) => month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 });
  const handleNextMonth = () => setCurrentMonth(({ year, month }) => month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 });

  // ─── [수정 완료] AI To Do 선택 (오류 패치) ────────────────────────
  const handleSelectAiTodo = useCallback(async (todo) => {
    try {
      const u_id = currentUser?.id;
      if (!u_id) {
        showToast ? showToast("사용자 정보를 불러올 수 없습니다. 다시 로그인해주세요.") : alert("로그인이 필요합니다.");
        return;
      }
      const targetDateStr = toDateStr(selectedDate);
      let timePart = "10:00:00";
      
      if (todo.executionDate?.includes("T")) timePart = todo.executionDate.split("T")[1].substring(0, 8);
      else if (todo.executionDate?.includes(" ")) timePart = todo.executionDate.split(" ")[1].substring(0, 8);
      else if (todo.executionDate) {
        const parsed = new Date(todo.executionDate);
        if (!isNaN(parsed.getTime())) {
          timePart = String(parsed.getHours()).padStart(2, "0") + ":" + String(parsed.getMinutes()).padStart(2, "0") + ":00";
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
        showToast ? showToast(`추천 일정 '${todo.content}'의 시간대에 이미 다른 일정이 존재합니다.`) : alert(`추천 일정 '${todo.content}'의 시간대에 이미 다른 일정이 존재합니다.`);
        return;
      }

      await api.aiTodo.confirm(u_id, [todo.id], targetDateStr);
      await fetchKpiData?.();
      const latestEvents = await fetchCalendarData?.();

      if (latestEvents && Array.isArray(latestEvents)) {
        const newlyCreated = latestEvents.find((e) => e.at_id === todo.id);
        if (newlyCreated) {
          setCompletedMyTodos((prev) => {
            const next = new Set(prev);
            next.add(newlyCreated.id);
            return next;
          });
        }
      }
    } catch (error) {
      console.error("AI 추천 일정 등록 중 오류 발생:", error);
      if (showToast) showToast("일정 등록 중 오류가 발생했습니다.");
    }
  }, [currentUser, selectedDate, events, showToast, fetchKpiData, fetchCalendarData]);

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

      let hashtags = [];
      if (detail && detail.features) {
        hashtags = detail.features.split(",").map(s => s.trim()).filter(Boolean);
      } else {
        try {
          const memoRes = await api.customer.getMemos(customerId, "", 3);
          if (memoRes && memoRes.timelines) {
            hashtags = memoRes.timelines.slice(0, 3).map(m => {
              let text = m.memo ? m.memo.replace(/[\r\n\t]+/g, " ").trim() : "";
              if (text.length > 20) text = text.substring(0, 20) + "...";
              return text;
            }).filter(Boolean);
          }
        } catch (memoErr) { console.error("Failed to fetch fallback memos:", memoErr); }
      }

      setExpandedCustomerDetails({ detail, risk, features: features?.features ?? [], displayHashtags: hashtags, productMatch: productMatch?.items ?? [], stats });
    } catch (error) { console.error("Failed to load customer AI insights:", error); } 
    finally { setLoadingDetails(false); }
  }, [expandedCustomerId]);

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

    let filteredEvents = [];
    let filteredAiTodos = [];

    if (todoViewMode === "daily") {
      filteredEvents = events.filter((e) => e.startTime.startsWith(dailyStr));
      filteredAiTodos = allAiTodos.filter((t) => t.executionDate?.startsWith(dailyStr));
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
      list.push({ id: `my-${e.id}`, type: "my", sortKey: e.startTime, timeLabel: todoViewMode === "daily" ? timeOnly : buildLabel(e.startTime, timeOnly), data: e });
    });

    filteredAiTodos.forEach((todo) => {
      if (ignoredAiTodoIds.has(todo.id)) return;
      const sortKey = todo.executionDate ?? `${dailyStr}T10:00:00`;
      const startHour = todo.time?.split(" - ")[0] ?? "10:00";
      list.push({ id: `ai-${todo.id}`, type: "ai", sortKey, timeLabel: todoViewMode === "daily" ? todo.time : buildLabel(sortKey, startHour), data: todo });
    });

    return list.sort((a, b) => a.sortKey.replace(" ", "T").localeCompare(b.sortKey.replace(" ", "T")));
  }, [events, allAiTodos, selectedDate, todoViewMode, ignoredAiTodoIds]);

  const mergedCustomerList = useMemo(() => {
    const seen = new Set();
    const result = [];
    for (const c of [...todayVisitors, ...churnRiskCustomers]) {
      if (c.avatarType === "risk" && c.grade === "주의") continue;
      if (!seen.has(c.id)) { seen.add(c.id); result.push(c); }
    }
    return result;
  }, [todayVisitors, churnRiskCustomers]);

  const renderDailyTimeline = () => (
    <div className="daily-timeline-list">
      {mergedTimeline.length === 0 ? (
        <div className="todo-empty-state">진행 예정인 일정이 비어 있습니다.</div>
      ) : (
        mergedTimeline.map((item) => {
          let isCompleted = false;
          if (item.type === "my") {
            isCompleted = completedMyTodos.has(item.data.id);
          }
          return (
            <TimelineCard
              key={item.id}
              item={item}
              isCompleted={isCompleted}
              onToggle={(id) => setCompletedMyTodos(prev => {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
              })}
              onDelete={(data) => showConfirm("일정 삭제", `'${data.title}' 일정을 정말로 삭제하시겠습니까?`, () => deleteEvent(data.id))}
              onShowDetail={handleShowScheduleDetail}
              onIgnoreAi={(data) => showConfirm("추천 일정 숨기기", `'${data.content}' 추천 일정을 숨기시겠습니까?`, () => handleIgnoreAiTodo(data.id))}
              onSelectAi={handleSelectAiTodo}
            />
          );
        })
      )}
    </div>
  );

  return (
    <div className="main-layout">
      <Sidebar type="cal" />
      <div className="main-content">
        <div className="main-dashboard-top-band-stacked">
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

          <div className="top-band-row rolling-row" onMouseEnter={() => setIsRollingPaused(true)} onMouseLeave={() => setIsRollingPaused(false)}>
            {rollingIndex === 0 && (
              <>
                <div className="news-title-badge news-badge" onClick={() => setRollingIndex(1)}>
                  <span className="dot news-dot" /> 주요 뉴스
                </div>
                <div className="news-carousel-wrap">
                  {newsList.length === 0 ? <div className="rolling-empty-text">로딩 중이거나 최신 뉴스가 없습니다.</div> : (
                    newsList.map((news, idx) => (
                      <div key={idx} className="news-item-link" onClick={() => navigate("/news-archive")}>
                        <span className="news-title-text">{news.title}</span>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {rollingIndex === 1 && (
              <>
                <div className="news-title-badge trend-badge" onClick={() => setRollingIndex(2)}>
                  <span className="dot trend-dot" /> 경제 지표
                </div>
                <div className="indicators-rolling-wrap">
                  {trendIndicators.length === 0 ? <div className="rolling-empty-text">실시간 지표를 준비 중입니다...</div> : (
                    trendIndicators.map((item, idx, arr) => (
                      <React.Fragment key={idx}>
                        <div className="indicator-rolling-item">
                          <span className="indicator-name">{item.name}</span>
                          <span className="indicator-value">
                            {item.value} {item.unit && <span className="indicator-unit">{item.unit}</span>}
                          </span>
                          <span className={`indicator-change ${item.direction}`}>
                            {item.direction === 'up' ? '↑ ' : item.direction === 'down' ? '↓ ' : '▬ '} {item.rate}
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
                  <span className="dot product-dot" /> 주력 상품
                </div>
                <div className="products-rolling-wrap">
                  {(!seasonalProducts || !seasonalProducts.products || seasonalProducts.products.length === 0) ? <div className="rolling-empty-text">추천 주력 상품을 준비 중입니다.</div> : (
                    seasonalProducts.products.map((prod) => (
                      <div key={prod.pd_id} className="product-rolling-item-link" onClick={() => handleProductClick(prod.pd_id)}>
                        {prod.name}
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
            
            <div className="rolling-nav-dots">
              <span className={`nav-dot ${rollingIndex === 0 ? 'active' : ''}`} onClick={() => setRollingIndex(0)} />
              <span className={`nav-dot ${rollingIndex === 1 ? 'active' : ''}`} onClick={() => setRollingIndex(1)} />
              <span className={`nav-dot ${rollingIndex === 2 ? 'active' : ''}`} onClick={() => setRollingIndex(2)} />
            </div>
          </div>
        </div>

        <div className="main-dashboard-body-layout">
          <div className="dashboard-body-column left-column" style={{ width: `${leftWidth}%` }}>
            <div className="bottom-card schedule-card-container">
              <div className="bottom-card-header">
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <h2 className="bottom-card-title" style={{ margin: 0 }}>AI 일정 관리</h2>
                  <button className="header-today-indicator" onClick={() => {
                    const today = new Date();
                    setSelectedDate(today);
                    setCurrentMonth({ year: today.getFullYear(), month: today.getMonth() });
                  }}>TODAY</button>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div className="header-date-indicator">{formatSelectedDateHeader(selectedDate)}</div>
                  <button className="btn-add-schedule" onClick={() => setIsScheduleModalOpen(true)}>+ 일정 등록</button>
                </div>
              </div>

              <div className="schedule-tabs-container">
                <div className="schedule-tabs">
                  {[{ key: "daily", label: "To Do" }, { key: "monthly", label: "Monthly" }].map(({ key, label }) => (
                    <button key={key} className={`schedule-tab-btn${todoViewMode === key ? " active" : ""}`} onClick={() => setTodoViewMode(key)}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="schedule-tab-content">
                {todoViewMode === "daily" && renderDailyTimeline()}
                {todoViewMode === "monthly" && (
                  <MonthlyCalendar
                    selectedDate={selectedDate} setSelectedDate={setSelectedDate}
                    currentMonth={currentMonth} events={events} allAiTodos={allAiTodos}
                    onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth}
                    onShowDetail={handleShowScheduleDetail}
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

          <div className={`dashboard-resizer${isResizing ? " active" : ""}`} onMouseDown={startResizing}>
            <div className="resizer-knob" />
          </div>

          <div className="dashboard-body-column right-column" style={{ width: `${100 - leftWidth}%` }}>
            <div className={`bottom-card key-customers-card-new ${expandedCustomerId ? "has-expanded" : ""}`}>
              <div className="bottom-card-header">
                <h2 className="bottom-card-title">AI 주요 고객 관리</h2>
                <Link to="/customer-management-registration-1" className="btn-all-customers">전체 보기</Link>
              </div>
              <div className="customers-pill-list-wrap">
                {loadingCustomers ? <div className="customers-loading">고객 분석을 로드하는 중입니다...</div> : (
                  <div className="customers-pill-scroll">
                    {mergedCustomerList.map((c) => {
                      const churnItem = churnRiskCustomers.find((cr) => cr.id === c.id);
                      const isChurnRisk = churnItem && churnItem.grade === "위험";
                      return (
                        <div key={c.id} className={`customer-pill-card${expandedCustomerId === c.id ? " active" : ""}`} onClick={() => handleCustomerCardClick(c.id)}>
                          <div className={`avatar-circle ${isChurnRisk ? "risk" : "visit"}`}>{c.initial}</div>
                          <div className="pill-info">
                            <span className="pill-name">{c.name}</span>
                            <span className={`pill-badge ${isChurnRisk ? "risk-high" : "visit-badge"}`}>
                              {isChurnRisk ? `이탈 ${churnItem.grade}` : "오늘 방문"}
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
                  <div className="panel-header">
                    <div className="header-left">
                      <div className={`avatar-circle-large ${churnRiskCustomers.some((cr) => cr.id === expandedCustomerId) ? "risk" : "visit"}`}>
                        {expandedCustomerDetails.detail?.name?.[0] ?? "고"}
                      </div>
                      <div className="customer-meta">
                        <span className="customer-name-large">{expandedCustomerDetails.detail?.name} 고객님</span>
                        <div className="customer-tags">
                          <span className="tag-badge grade">{expandedCustomerDetails.detail?.grade ?? "일반"}</span>
                          <span className="tag-badge tendency">{expandedCustomerDetails.detail?.tendency ?? "안정추구형"}</span>
                          <span className="tag-badge job">{expandedCustomerDetails.detail?.job ?? "초등교사"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="header-right">
                      <button className="btn-go-profile" onClick={() => navigate(`/customer-management-registration-1?c_id=${expandedCustomerId}`)}>
                        상세 프로필 <ChevronRight size={14} style={{ marginLeft: "2px" }} />
                      </button>
                      <button className="btn-close-panel" onClick={() => { setExpandedCustomerId(null); setExpandedCustomerDetails(null); }}>
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="panel-grid-2x2">
                    <div className="insight-card risk-card">
                      <div className="card-header">
                        <div className="card-title-group"><span className="card-title">AI 이탈 위험 예측</span></div>
                        <span className={`risk-status-badge ${expandedCustomerDetails.risk?.grade === "위험" || expandedCustomerDetails.risk?.grade === "위험예측" ? "danger" : expandedCustomerDetails.risk?.grade === "주의" ? "warning" : "good"}`}>
                          {expandedCustomerDetails.risk?.grade ?? "양호"}
                        </span>
                      </div>
                      <p className="card-body-text">{summarizeInsight(expandedCustomerDetails.risk?.reason ?? "고객의 이탈을 시사하는 불만 사항이나 거액 출금이 관찰되지 않았습니다.")}</p>
                    </div>

                    <div className="insight-card product-card">
                      <div className="card-header"><div className="card-title-group"><span className="card-title">AI 추천 상품</span></div></div>
                      <div className="product-match-list">
                        {expandedCustomerDetails.productMatch && expandedCustomerDetails.productMatch.length > 0 ? (
                          expandedCustomerDetails.productMatch.slice(0, 3).map((prod, idx) => {
                            let statusText = "적합", statusClass = "recommend";
                            if (prod.is_owned) { statusText = "보유중"; statusClass = "owned"; }
                            else if (prod.is_suitable === false) { statusText = "부적합"; statusClass = "unsuitable"; }
                            return (
                              <div className="product-match-item" key={idx}>
                                <div className="product-item-header">
                                  <span className="product-name">{prod.product_name}</span>
                                  <span className={`product-status-badge ${statusClass}`}>{statusText}</span>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <>
                            <div className="product-match-item"><div className="product-item-header"><span className="product-name">WON플러스예금</span><span className="product-status-badge owned">보유중</span></div></div>
                            <div className="product-match-item"><div className="product-item-header"><span className="product-name">우리WON통장</span><span className="product-status-badge recommend">적합</span></div></div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="insight-card features-card">
                      <div className="card-header"><div className="card-title-group"><span className="card-title">AI 메모 요약 핵심 특징</span></div></div>
                      <div className="features-tags-container">
                        {expandedCustomerDetails.displayHashtags && expandedCustomerDetails.displayHashtags.length > 0 ? (
                          expandedCustomerDetails.displayHashtags.slice(0, 4).map((tag, idx) => <span className="feature-tag-pill" key={idx}># {tag}</span>)
                        ) : (
                          ["일반", "안정추구형", "초등교사"].map((text, idx) => <span className="feature-tag-pill" key={idx}># {text}</span>)
                        )}
                      </div>
                    </div>

                    <div className="insight-card portfolio-card">
                      <div className="card-header"><div className="card-title-group"><span className="card-title">자산 포트폴리오 AI 진단</span></div></div>
                      <div className="portfolio-body">
                        <div className="asset-total-label">
                          총 순자산: <span className="asset-total-value">{expandedCustomerDetails.detail?.total_assets ? (typeof expandedCustomerDetails.detail.total_assets === "number" ? `${(expandedCustomerDetails.detail.total_assets / 100000000).toFixed(1)}억원` : expandedCustomerDetails.detail.total_assets) : "8.0억원"}</span>
                        </div>
                        <p className="card-body-text" style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
                          {formatLlmInsight(expandedCustomerDetails.detail?.llm_insight ?? "자산 분석 결과 예금 비중이 62.5%로 다소 높은 편입니다. 안정성을 고려하더라도 일부 자산을 채권형 상품이나 배당주로 전환하여 투자 성향에 맞춘 리밸런싱을 권장합니다.")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={`bottom-sub-split ${expandedCustomerId ? "collapsed" : ""}`}>
              <div className="bottom-card sub-split-card visit-briefing-card" onClick={expandedCustomerId ? () => { setExpandedCustomerId(null); setExpandedCustomerDetails(null); } : undefined} style={expandedCustomerId ? { cursor: "pointer" } : undefined}>
                <div className="bottom-card-header" style={splitHeaderStyle(!expandedCustomerId)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 className="bottom-card-title">AI 방문 브리핑</h2>
                    <span className="header-count-indicator" style={expandedCustomerId ? { fontSize: '9px', padding: '1px 6px' } : {}}>오늘 {todayVisitors.length}건</span>
                  </div>
                  {expandedCustomerId && <ChevronDown size={14} style={{ color: 'var(--main-text-muted)', marginLeft: 'auto' }} />}
                </div>
                {!expandedCustomerId && (
                  <div className="briefing-list-container">
                    {loadingCustomers ? <div className="briefing-loading">브리핑 데이터를 분석 중입니다...</div> : todayVisitors.length === 0 ? <div className="briefing-empty">오늘 예정된 방문 브리핑이 없습니다.</div> : (
                      todayVisitors.map((v) => {
                        const churnItem = churnRiskCustomers.find((cr) => cr.id === v.id);
                        return (
                          <div key={v.id} className="briefing-card" onClick={(e) => { e.stopPropagation(); handleVisitorClick(v.id); }} style={{ cursor: "pointer" }}>
                            <div className="briefing-card-top">
                              <span className="briefing-name">
                                {v.name} <span className="vip-tag">{v.grade}</span>
                                {churnItem && <span className={`risk-tag-new ${churnItem.grade === "주의" ? "warning" : "danger"}`}>{churnItem.grade}</span>}
                              </span>
                            </div>
                            <div className="briefing-card-body">
                              {churnItem && <div className="briefing-risk-wrap"><span className="risk-text">{formatBriefingText(churnItem.reason)}</span></div>}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              <div className="bottom-card sub-split-card notifications-card-new" onClick={expandedCustomerId ? () => { setExpandedCustomerId(null); setExpandedCustomerDetails(null); } : undefined} style={expandedCustomerId ? { cursor: "pointer" } : undefined}>
                <div className="bottom-card-header" style={splitHeaderStyle(!expandedCustomerId)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 className="bottom-card-title">알림</h2>
                    {notifications.length > 0 && <span className="notif-badge-circle" style={expandedCustomerId ? { width: '14px', height: '14px', fontSize: '8px' } : {}}>{notifications.length}</span>}
                  </div>
                  {expandedCustomerId ? <ChevronDown size={14} style={{ color: 'var(--main-text-muted)', marginLeft: 'auto' }} /> : <Link to="/notifications" className="btn-all-customers">더보기</Link>}
                </div>
                {!expandedCustomerId && (
                  <div className="notifications-simple-list">
                    {loadingNotifications ? <div className="notif-loading">알림 피드를 불러오는 중입니다...</div> : notifications.length === 0 ? <div className="notif-empty">수신된 알림이 없습니다.</div> : (
                      notifications.map((notif) => {
                        const isExpanded = activeNotifId === notif.id;
                        return (
                          <div key={notif.id} className={`simple-notif-item ${isExpanded ? "expanded" : ""}`} onClick={(e) => { e.stopPropagation(); setActiveNotifId(prev => prev === notif.id ? null : notif.id); }} style={{ cursor: "pointer" }}>
                            <div className="notif-item-header"><span className="notif-date">{notif.date}</span></div>
                            <h4 className="notif-item-title">{notif.type}</h4>
                            <p className="notif-item-content">{notif.content}</p>
                            {isExpanded && notif.expandedContent && (
                              <div className="notif-item-details">
                                {notif.expandedContent.map((line, idx) => <div key={idx} className="notif-detail-line">{line}</div>)}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScheduleRegistrationModal
        isOpen={isScheduleModalOpen}
        onClose={() => { setIsScheduleModalOpen(false); setEditEventData(null); }}
        editEvent={editEventData}
      />

      {isScheduleDetailModalOpen && selectedScheduleDetail && (
        <div className="product-detail-modal-overlay" onClick={() => setIsScheduleDetailModalOpen(false)}>
          <div className="product-detail-modal-card schedule-detail-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className={`modal-product-type-badge ${selectedScheduleDetail.type === 'ai' ? 'badge-ai' : `badge-color-${selectedScheduleDetail.data.color || 'blue'}`}`}>
                  {selectedScheduleDetail.type === 'ai' ? 'AI 추천 일정' : `일반 일정 - ${selectedScheduleDetail.data.category || '기타'}`}
                </span>
                <h3 className="modal-product-name">{selectedScheduleDetail.type === 'ai' ? selectedScheduleDetail.data.content : selectedScheduleDetail.data.title}</h3>
              </div>
              <button className="btn-close-modal" onClick={() => setIsScheduleDetailModalOpen(false)}><X size={20} /></button>
            </div>
            
            <div className="modal-body">
              <div className="modal-detail-content">
                <div className="modal-info-row">
                  <div className="info-item">
                    <span className="info-label">일정 구분</span>
                    <span className="info-value">{selectedScheduleDetail.type === 'ai' ? selectedScheduleDetail.data.group : (selectedScheduleDetail.data.category || '기타')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">시간 정보</span>
                    <span className="info-value highlight">
                      {selectedScheduleDetail.type === 'ai' ? selectedScheduleDetail.data.time : `${selectedScheduleDetail.data.startTime} ~ ${selectedScheduleDetail.data.endTime}`}
                    </span>
                  </div>
                </div>
                {selectedScheduleDetail.type === 'my' && selectedScheduleDetail.data.customer && (
                  <div className="modal-info-row">
                    <div className="info-item" style={{ width: '100%' }}>
                      <span className="info-label">관련 고객</span>
                      <span className="info-value text-primary">{selectedScheduleDetail.data.customer}</span>
                    </div>
                  </div>
                )}
                <div className="modal-section" style={{ marginTop: '16px' }}>
                  <span className="info-label">{selectedScheduleDetail.type === 'ai' ? '추천 사유' : '상세 메모'}</span>
                  <p className="modal-section-desc" style={{ marginTop: '6px', fontSize: '13px', color: '#475569', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '60px', whiteSpace: 'pre-wrap' }}>
                    {selectedScheduleDetail.type === 'ai' ? selectedScheduleDetail.data.subText : (selectedScheduleDetail.data.memo || '상세 메모가 입력되지 않았습니다.')}
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '16px 20px', borderTop: '1px solid #e2e8f0' }}>
              <button 
                className="btn-confirm-cancel" 
                style={btnDangerStyle}
                onClick={() => {
                  setIsScheduleDetailModalOpen(false);
                  showConfirm(
                    selectedScheduleDetail.type === 'ai' ? "추천 일정 삭제" : "일정 삭제",
                    selectedScheduleDetail.type === 'ai' ? `'${selectedScheduleDetail.data.content}' 추천 일정을 삭제하시겠습니까?` : `'${selectedScheduleDetail.data.title}' 일정을 정말로 삭제하시겠습니까?`,
                    () => selectedScheduleDetail.type === 'ai' ? handleIgnoreAiTodo(selectedScheduleDetail.data.id) : deleteEvent(selectedScheduleDetail.data.id)
                  );
                }}
              >
                일정 삭제
              </button>
              <button 
                className="btn-edit-schedule" 
                style={btnNeutralStyle}
                onClick={() => {
                  const data = selectedScheduleDetail.data, type = selectedScheduleDetail.type;
                  setEditEventData({
                    id: data.id, type: type, title: type === 'ai' ? data.content : data.title,
                    category: type === 'ai' ? data.group : (data.category || '상담'),
                    startTime: type === 'ai' ? (data.executionDate || '') : (data.startTime || ''),
                    endTime: type === 'ai' ? '' : (data.endTime || ''),
                    customer: type === 'ai' ? '' : (data.customer || ''),
                    memo: type === 'ai' ? (data.subText || '') : (data.memo || ''),
                    color: type === 'ai' ? 'purple' : (data.color || 'blue')
                  });
                  setIsScheduleDetailModalOpen(false);
                  setIsScheduleModalOpen(true);
                }}
              >
                수정
              </button>
              <button className="btn-close-modal-footer" style={btnCancelStyle} onClick={() => setIsScheduleDetailModalOpen(false)}>취소</button>
            </div>
          </div>
        </div>
      )}

      {confirmModal.isOpen && (
        <div className="custom-confirm-overlay" onClick={closeConfirm}>
          <div className="custom-confirm-card" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-header"><h3 className="confirm-title">{confirmModal.title}</h3></div>
            <div className="confirm-body"><p className="confirm-message">{confirmModal.message}</p></div>
            <div className="confirm-footer">
              <button className="btn-confirm-cancel" onClick={closeConfirm}>취소</button>
              <button className="btn-confirm-action" onClick={confirmModal.onConfirm}>확인</button>
            </div>
          </div>
        </div>
      )}

      {isProductModalOpen && (
        <div className="product-detail-modal-overlay" onClick={() => setIsProductModalOpen(false)}>
          <div className="product-detail-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="modal-product-type-badge">{selectedProductDetail?.type ?? "금융상품"}</span>
                <h3 className="modal-product-name">{selectedProductDetail?.name ?? "상품 상세 정보"}</h3>
              </div>
              <button className="btn-close-modal" onClick={() => setIsProductModalOpen(false)}><X size={20} /></button>
            </div>
            
            <div className="modal-body">
              {loadingProductDetail ? (
                <div className="modal-loading-container"><div className="modal-spinner" /><span>상품 상세 정보를 로딩 중입니다...</span></div>
              ) : selectedProductDetail ? (
                <div className="modal-detail-content">
                  <div className="modal-info-row">
                    <div className="info-item"><span className="info-label">제공사</span><span className="info-value">{selectedProductDetail.issuer ?? "-"}</span></div>
                    <div className="info-item">
                      <span className="info-label">예상 수익률 / 이율</span>
                      <span className="info-value highlight">
                        {selectedProductDetail.expected_return ? `${selectedProductDetail.expected_return}%` : "-"} <span className="info-value-sub"> ({selectedProductDetail.return_type ?? "세전"})</span>
                      </span>
                    </div>
                  </div>
                  <div className="modal-section">
                    <h4 className="section-title">상품 설명</h4>
                    <p className="section-content description-text">{formatProductExplanation(selectedProductDetail.explanation)}</p>
                  </div>
                  <div className="modal-section">
                    <h4 className="section-title">주요 특징</h4>
                    <div className="features-tags">
                      {selectedProductDetail.features ? selectedProductDetail.features.split(',').map((feat, idx) => <span key={idx} className="feature-tag"># {feat.trim()}</span>) : <span className="no-features">제공된 특징이 없습니다.</span>}
                    </div>
                  </div>
                  <div className="modal-section">
                    <h4 className="section-title">추천 대상</h4>
                    <p className="section-content target-text">{formatProductExplanation(selectedProductDetail.target_customer)}</p>
                  </div>
                  {selectedProductDetail.suitable_customers && selectedProductDetail.suitable_customers.length > 0 && (
                    <div className="modal-section">
                      <h4 className="section-title">추천 적합 고객</h4>
                      <div className="suitable-customers-list">
                        {selectedProductDetail.suitable_customers.map((cust) => (
                          <div key={cust.c_id} className="suitable-customer-pill" onClick={() => { setIsProductModalOpen(false); navigate(`/customer-management-registration-1?c_id=${cust.c_id}`); }}>
                            <span className="cust-name">{cust.name}</span><span className="cust-grade">{cust.grade}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : <div className="modal-error-container"><span>상품 정보를 불러오지 못했습니다.</span></div>}
            </div>
          </div>
        </div>
      )}

      {isBriefingOpen && (
        <div className="briefing-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) { setIsBriefingOpen(false); setSelectedBriefing(null); } }}>
          <div className="briefing-modal-card" onClick={(e) => e.stopPropagation()} style={{ width: `${modalSize.width}px`, height: `${modalSize.height}px`, maxWidth: 'none', maxHeight: 'none' }}>
            <div className="briefing-modal-header">
              <div className="briefing-modal-header-left" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="news-alert-badge badge-green" style={{ display: 'inline-flex', padding: '6px 14px', fontSize: '13px', fontWeight: '700', borderRadius: '4px', backgroundColor: '#e2fbf0', color: '#10b981' }}>방문 예정 브리핑</span>
                <h2 className="briefing-modal-title" style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0' }}>{selectedBriefing ? selectedBriefing.content : "방문 예정 브리핑"}</h2>
                {selectedBriefing?.c_id && (
                  <button 
                    onClick={() => { setIsBriefingOpen(false); setSelectedBriefing(null); navigate(`/customer-management-registration-1?c_id=${selectedBriefing.c_id}`); }}
                    style={{ marginLeft: '12px', padding: '4px 10px', fontSize: '11px', fontWeight: '600', color: 'white', backgroundColor: '#0284c7', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.2s' }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#0369a1'} onMouseOut={(e) => e.target.style.backgroundColor = '#0284c7'}
                  >
                    고객 프로필 보기
                  </button>
                )}
              </div>
              <div className="briefing-modal-header-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span className="briefing-modal-date" style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>{selectedBriefing ? selectedBriefing.date : ""}</span>
                <button className="briefing-modal-close-btn" onClick={() => { setIsBriefingOpen(false); setSelectedBriefing(null); }}><span style={{ fontSize: '18px', color: '#64748b', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</span></button>
              </div>
            </div>

            <div className="briefing-modal-body">
              {(() => {
                const briefingData = selectedBriefing ? parseBriefing(selectedBriefing.expandedContent) : null;
                if (briefingData) {
                  return (
                    <>
                      <div className="briefing-section">
                        <h3 className="briefing-section-title">Quick Summary</h3>
                        <div className="briefing-section-card">
                          {briefingData.summary.map((line, idx) => <p key={idx} className="briefing-text font-semibold">{formatBriefingText(line)}</p>)}
                        </div>
                      </div>
                      <div className="briefing-section">
                        <h3 className="briefing-section-title">고객 기본 정보 & Preference</h3>
                        <div className="briefing-section-card">
                          <ul className="briefing-list">
                            {briefingData.preference.map((line, idx) => <li key={idx} className={line.startsWith("-") ? "" : "indent"}>{formatBriefingText(line.startsWith("-") ? line.substring(1).trim() : line)}</li>)}
                          </ul>
                        </div>
                      </div>
                      <div className="briefing-section">
                        <h3 className="briefing-section-title">자산 현황 & 최근 거래 내역</h3>
                        <div className="briefing-section-card">
                          <ul className="briefing-list">
                            {briefingData.assets.map((line, idx) => <li key={idx} className={line.startsWith("-") ? "" : "indent"}>{formatBriefingText(line.startsWith("-") ? line.substring(1).trim() : line)}</li>)}
                          </ul>
                        </div>
                      </div>
                      <div className="briefing-section">
                        <h3 className="briefing-section-title">핵심 특이사항 & 상담 전 필수 체크</h3>
                        <div className="briefing-section-card">
                          <ul className="briefing-list">
                            {briefingData.notes.map((line, idx) => <li key={idx} className={line.startsWith("-") ? "" : "indent"}>{formatBriefingText(line.startsWith("-") ? line.substring(1).trim() : line)}</li>)}
                          </ul>
                        </div>
                      </div>
                      <div className="briefing-section">
                        <h3 className="briefing-section-title">이전 상담 히스토리 요약 (클릭 시 상세 접고 펴기)</h3>
                        <div className="briefing-section-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {briefingData.history && briefingData.history.length > 0 ? (
                            briefingData.history.map((hist, idx) => <HistoryItem key={idx} hist={hist} c_id={selectedBriefing?.c_id} />)
                          ) : (
                            <div style={{ padding: '8px 0', textAlign: 'center', color: '#94a3b8', fontSize: '13px', fontWeight: '500' }}>이전 상담 이력이 존재하지 않습니다.</div>
                          )}
                        </div>
                      </div>
                    </>
                  );
                }
                return (
                  <div className="briefing-section">
                    <h3 className="briefing-section-title">브리핑 내용</h3>
                    <div className="briefing-section-card" style={{ padding: '20px', lineHeight: '1.8', color: '#334155' }}>
                      {selectedBriefing?.expandedContent && selectedBriefing.expandedContent.length > 0 ? (
                        selectedBriefing.expandedContent.map((line, idx) => <p key={idx} className="briefing-text" style={{ marginBottom: '8px' }}>{line}</p>)
                      ) : <p className="briefing-text">{selectedBriefing?.content || "브리핑 내용이 없습니다."}</p>}
                    </div>
                  </div>
                );
              })()}
            </div>
            <div className="briefing-modal-resizer" onMouseDown={handleResizeStart} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 서브 컴포넌트: 주간/월간 캘린더 및 메트릭 ──────────────────────────────

function WeeklyCalendar({ selectedDate, setSelectedDate, events, allAiTodos }) {
  const weekDays = getWeekDays(selectedDate);
  return (
    <div className="new-weekly-calendar">
      <div className="weekly-header-row">
        {weekDays.map((day, idx) => {
          const isSelected = day.getFullYear() === selectedDate.getFullYear() && day.getMonth() === selectedDate.getMonth() && day.getDate() === selectedDate.getDate();
          return (
            <div key={idx} className="weekly-header-cell" onClick={() => setSelectedDate(day)}>
              <span className="weekly-day-name">{DAY_NAMES[idx]}</span>
              <span className={`weekly-date-number${isSelected ? " active" : ""}`}>{day.getDate()}</span>
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
                const isBirthday = ev.title.includes("생일축하") || ev.title.includes("생일 축하") || ev.title.includes("🎂");
                const displayTitle = ev.customer ? `${ev.customer}${isBirthday ? "🎂" : ""}` : ev.title;
                return <div key={ev.id} className={`weekly-event-badge color-${ev.color ?? "blue"}`} title={ev.title}>{displayTitle}</div>;
              })}
              {cellAiTodos.slice(0, 1).map((todo) => (
                <div key={todo.id} className="weekly-event-badge color-purple" title={`[AI 제안] ${todo.content}`}>✨ {todo.content.substring(0, 5)}</div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MonthlyCalendar({ selectedDate, setSelectedDate, currentMonth, events, allAiTodos, onPrevMonth, onNextMonth, onShowDetail }) {
  const dateStr = toDateStr(selectedDate);
  const dayEvents = events.filter((e) => e.startTime.startsWith(dateStr));
  const dayAiTodos = allAiTodos.filter((t) => t.executionDate?.startsWith(dateStr));

  const combined = [
    ...dayEvents.map((e) => ({ id: `event-${e.id}`, time: e.startTime.split(" ")[1] ?? "09:00", title: e.title, color: e.color, type: "my", raw: e })),
    ...dayAiTodos.map((todo) => ({ id: `ai-${todo.id}`, time: todo.time?.split(" - ")[0] ?? "10:00", title: `[AI 추천] ${todo.content}`, color: "purple", type: "ai", raw: todo })),
  ].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="main-mini-monthly-calendar-container" style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1, minHeight: 0 }}>
      <div className="main-mini-monthly-calendar" style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, minHeight: 0 }}>
        <div className="monthly-nav">
          <button className="monthly-nav-btn" onClick={(e) => { e.stopPropagation(); onPrevMonth(); }} style={{ border: "none", background: "transparent", cursor: "pointer" }}><ChevronLeft size={14} /></button>
          <span className="monthly-nav-title">{formatMonthTitle(currentMonth.year, currentMonth.month)}</span>
          <button className="monthly-nav-btn" onClick={(e) => { e.stopPropagation(); onNextMonth(); }} style={{ border: "none", background: "transparent", cursor: "pointer" }}><ChevronRight size={14} /></button>
        </div>
        <div className="monthly-grid-header">
          {DAY_NAMES.map((day, idx) => (
            <span key={idx} style={idx === 0 ? { color: "#ef4444" } : idx === 6 ? { color: "#0284c7" } : {}}>{day}</span>
          ))}
        </div>
        <div className="monthly-grid-body">
          {generateMiniCalendar(currentMonth.year, currentMonth.month, selectedDate, "month").map((d, idx) => {
            const cellDate = d.date;
            const cellDateStr = toDateStr(cellDate);
            const hasEvents = events.some((e) => e.startTime.startsWith(cellDateStr)) || allAiTodos.some((t) => t.executionDate?.startsWith(cellDateStr));
            const isSelected = cellDate.getFullYear() === selectedDate.getFullYear() && cellDate.getMonth() === selectedDate.getMonth() && cellDate.getDate() === selectedDate.getDate();
            const systemToday = new Date();
            const isToday = cellDate.getFullYear() === systemToday.getFullYear() && cellDate.getMonth() === systemToday.getMonth() && cellDate.getDate() === systemToday.getDate();

            return (
              <div key={idx} onClick={() => setSelectedDate(cellDate)} className={`monthly-cell${d.muted ? " muted" : ""}`}>
                <span className={`monthly-date${isSelected ? " active" : ""}${isToday ? " is-today" : ""}`}>{cellDate.getDate()}</span>
                {hasEvents && !isSelected && <span className="monthly-dot" />}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ borderBottom: "1px solid var(--main-border)", margin: "4px 0" }} />
      {combined.length === 0 ? (
        <div className="monthly-schedule-empty">진행 예정인 일정이 없습니다.</div>
      ) : (
        <div className="monthly-schedule-list">
          {combined.map((item) => (
            <div key={item.id} className="monthly-schedule-item" onClick={() => onShowDetail?.(item, "combined")} style={{ cursor: "pointer" }}>
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

function KpiMetric({ label, value, unit, goal, format }) {
  const displayValue = value == null ? "-" : format === "number" ? value.toLocaleString() : value;
  const displayGoal = goal == null ? "-" : format === "number" ? goal.toLocaleString() : goal;
  return (
    <div className="top-metric-item">
      <span className="metric-label">{label}</span>
      <span className="metric-value">{displayValue}<span className="metric-unit">{unit}</span></span>
      {goal != null && <span className="metric-goal-text">/ {displayGoal}<span className="metric-goal-unit">{unit}</span></span>}
    </div>
  );
}