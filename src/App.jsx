import { useState, useEffect, useRef } from "react";
import AppRouter from "./router/AppRouter.jsx";
import { api } from "./api";

export default function App() {
  const [activeAlert, setActiveAlert] = useState(null);
  const prevCountRef = useRef(null);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    // 15초마다 알림 개수 조회하여 감시
    const checkNotifications = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        prevCountRef.current = null;
        return;
      }
      try {
        const countData = await api.notification.getTodayCount();
        if (countData && typeof countData.today_count === "number") {
          const currentCount = countData.today_count;
          
          if (prevCountRef.current !== null && currentCount > prevCountRef.current) {
            const list = await api.notification.getList("today");
            if (list && list.length > 0) {
              const latestBriefing = list.find(n => n.isBriefing);
              if (latestBriefing) {
                setActiveAlert(latestBriefing);
                
                const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav");
                audio.play().catch(e => console.log("실시간 알림 효과음 재생 실패:", e));
              }
            }
          }
          prevCountRef.current = currentCount;
        }
      } catch (err) {
        console.error("실시간 알림 폴링 실패:", err);
      }
    };

    const initCount = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const countData = await api.notification.getTodayCount();
          if (countData) {
            prevCountRef.current = countData.today_count;
          }
        } catch (e) {}
      }
    };
    initCount();

    pollIntervalRef.current = setInterval(checkNotifications, 15000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  return (
    <>
      <AppRouter />
      
      {/* 실시간 팝업 알림 (Toast UI) - Premium Modern Glassmorphism 테마 */}
      {activeAlert && (
        <div 
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "410px",
            backgroundColor: "rgba(255, 255, 255, 0.95)", // 투명도를 미세하게 조절하여 깔끔함 향상
            backdropFilter: "blur(24px)",
            color: "#1e293b",
            boxShadow: "0 20px 25px -5px rgba(15, 23, 42, 0.06), 0 10px 10px -5px rgba(15, 23, 42, 0.04), 0 0 1px rgba(15, 23, 42, 0.12)", // 부드러운 Vercel 스타일 레이어드 섀도우
            borderRadius: "20px",                         // 좀 더 둥근 프리미엄 라운딩
            border: "1px solid rgba(15, 23, 42, 0.07)",   // 얇고 깔끔한 외곽 테두리 (좌측 강조선 삭제)
            padding: "22px",                              // 여백 확장으로 가독성 확보
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            animation: "slideInAppToast 0.35s cubic-bezier(0.16, 1, 0.3, 1)" // 부드러운 물리 애니메이션 곡선
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", fontSize: "12px", fontWeight: "700", color: "#64748b", letterSpacing: "0.5px" }}>
              {/* 템플릿 느낌을 주는 왼쪽 띠선 대신, 고급스러운 초록색 상태 표시 펄스 Dot으로 대체 */}
              <span style={{ 
                width: "8px", 
                height: "8px", 
                borderRadius: "50%", 
                backgroundColor: "#10b981", 
                marginRight: "8px", 
                boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.2)" 
              }} />
              실시간 방문 브리핑
            </span>
            <button 
              onClick={() => setActiveAlert(null)}
              style={{
                background: "none",
                border: "none",
                fontSize: "18px",
                color: "#94a3b8",
                cursor: "pointer",
                padding: "0 4px",
                lineHeight: 1,
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.color = "#1e293b"}
              onMouseLeave={(e) => e.target.style.color = "#94a3b8"}
            >
              ×
            </button>
          </div>
          <div style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", lineHeight: "1.4" }}>
            {activeAlert.content}
          </div>
          <div style={{ fontSize: "12.5px", color: "#64748b", lineHeight: "1.5" }}>
            방문 30분 전 일정 브리핑 리포트가 완성되었습니다. 알림 페이지에서 상세 리포트를 확인해 보세요!
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
            <button 
              onClick={() => {
                setActiveAlert(null);
                window.location.href = "/notifications";
              }}
              style={{
                backgroundColor: "#0ea5e9",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                padding: "8px 18px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 12px rgba(14, 165, 233, 0.15)"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#0284c7";
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 6px 16px rgba(14, 165, 233, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#0ea5e9";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(14, 165, 233, 0.15)";
              }}
            >
              브리핑 보기
            </button>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes slideInAppToast {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
