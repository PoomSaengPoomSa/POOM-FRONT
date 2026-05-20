export const notifications = [
  {
    id: 1,
    type: "방문 예정 브리핑",
    content: "김민준 고객 — 오전 10:00 방문 예정 (30분 전)",
    date: "18 May, 2026",
    category: "green",
    today: true,
    isBriefing: true
  },
  {
    id: 2,
    type: "거액 거래 감지",
    content: "이수연 고객 — 5,000만 원 타행 이체 발생",
    date: "18 May, 2026",
    category: "pink",
    today: true,
    expandedContent: [
      "감지 내용: 2026.05.20 09:15 타행(하나은행)으로 5,000만 원 송금 완료.",
      "자금 용도 확인 및 당행 예금 재유치 설득이 필요합니다. 연계 주택담보대출 상환 또는 부동산 거래용 자금 여부 확인 필요."
    ]
  },
  {
    id: 3,
    type: "만기 알림 D-14",
    content: "박지훈 고객 — 정기예금 만기 도래",
    date: "18 May, 2026",
    category: "blue",
    today: true,
    expandedContent: [
      "만기 정보: 정기예금 1.5억 원 만기 예정 (2026.06.03).",
      "고금리 회전예금 특판 상품 안내 또는 채권 상품 포트폴리오 리밸런싱 상담을 권장합니다."
    ]
  },
  {
    id: 4,
    type: "이탈 위험",
    content: "현아 고객 — 선제 상담 필요",
    date: "18 May, 2026",
    category: "red",
    today: true,
    expandedContent: [
      "위험 요인: 최근 3개월간 당행 거래 거래량 45% 감소, 타행 이체 증가.",
      "고객 케어 콜을 통해 애로사항을 청취하고, 특별 우대금리 쿠폰 발송 및 대면 상담 일정을 조율해 보세요."
    ]
  },
  {
    id: 5,
    type: "안부 연락 알림",
    content: "정성호 고객 — 자녀 초등학교 입학 시즌",
    date: "18 May, 2026",
    category: "indigo",
    today: true,
    expandedContent: [
      "자녀 정보: 2남 1녀 중 막내 (2019년생) — 초등학교 입학 해당",
      "입학 축하 안부 연락을 통해 고객 관계를 강화해 보세요. 교육 관련 금융 상품(교육적금, 어린이 펀드) 안내도 고려해 보세요."
    ]
  },
  {
    id: 6,
    type: "안부 연락 알림",
    content: "오늘은 한지원 고객의 생일입니다",
    date: "17 May, 2026",
    category: "indigo",
    today: false,
    expandedContent: [
      "축하 메시지 가이드: '한지원 고객님, 생신을 진심으로 축하드립니다! 풍요롭고 행복한 하루 보내시길 당행이 기원합니다.'",
      "생일 기념 기프티콘 발송 및 안부 전화를 권장합니다."
    ]
  },
  {
    id: 7,
    type: "안부 연락 알림",
    content: "내일은 강태우 고객의 결혼 기념일입니다",
    date: "17 May, 2026",
    category: "indigo",
    today: false,
    expandedContent: [
      "기념일 정보: 결혼 10주년 (주요 기념일).",
      "축하 꽃바구니 발송 또는 기념일 특별 맞춤 포트폴리오 제안 안부 연락을 권장합니다."
    ]
  },
  {
    id: 8,
    type: "안부 연락 알림",
    content: "내일은 추석 연휴 시작일입니다 — 주요 고객 안부 연락을 권장합니다",
    date: "17 May, 2026",
    category: "indigo",
    today: false,
    expandedContent: [
      "연휴 기간: 2026.05.21 ~ 2026.05.24",
      "명절 전 VIP 고객 대상 모바일 상품권 발송 및 안부 문자 대량 발송(메시지 초안 활용)을 권장합니다."
    ]
  }
];

export const addNotification = (notif) => {
  notifications.unshift(notif);
  window.dispatchEvent(new CustomEvent("notifications-updated"));
};
