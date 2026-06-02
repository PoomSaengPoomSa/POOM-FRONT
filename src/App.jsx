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
      
      {/* 실시간 팝업 알림 (Toast UI) - Premium Slate Dark 테마 */}
      {activeAlert && (
        <div 
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "420px", // 크기 360px -> 420px로 확장
            backgroundColor: "#0f172a", // 뒤 화면과 겹쳐도 묻히지 않도록 Slate-900 다크 백그라운드 적용
            color: "#f8fafc",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.3)",
            borderRadius: "16px",
            border: "1px solid #1e293b",
            borderLeft: "6px solid #34d399", // 에메랄드(초록) 포인트 두께 강화
            padding: "20px", // 여백 확장
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            animation: "slideInAppToast 0.3s ease-out"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", fontWeight: "800", color: "#34d399", display: "flex", alignItems: "center", gap: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              🔔 실시간 방문 예정 브리핑
            </span>
            <button 
              onClick={() => setActiveAlert(null)}
              style={{
                background: "none",
                border: "none",
                fontSize: "20px",
                color: "#94a3b8",
                cursor: "pointer",
                padding: "0 4px",
                lineHeight: 1,
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.color = "#f8fafc"}
              onMouseLeave={(e) => e.target.style.color = "#94a3b8"}
            >
              ×
            </button>
          </div>
          <div style={{ fontSize: "16px", fontWeight: "800", color: "#f1f5f9", lineHeight: "1.4" }}>
            {activeAlert.content}
          </div>
          <div style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.5" }}>
            방문 30분 전 일정 브리핑 리포트가 완성되었습니다. 알림 페이지에서 상세 리포트를 확인해 보세요!
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "6px" }}>
            <button 
              onClick={() => {
                setActiveAlert(null);
                window.location.href = "/notifications";
              }}
              style={{
                backgroundColor: "#34d399",
                color: "#0f172a",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#059669"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#34d399"}
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
