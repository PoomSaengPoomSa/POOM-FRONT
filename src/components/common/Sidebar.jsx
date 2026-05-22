import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, TrendingUp, Contact, BarChart2, Bell, LogOut } from "lucide-react";
import { api } from "../../api";

export default function Sidebar({ type = "cal" }) {
  const location = useLocation();
  const path = location.pathname;

  const prefix = type; // e.g., "cal", "cust", "news", "trend"
  const [todayCount, setTodayCount] = useState(0);
  const [isTrendHovered, setIsTrendHovered] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const userStr = localStorage.getItem("currentUser");
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const fetchMe = async () => {
      try {
        if (localStorage.getItem("accessToken")) {
          const user = await api.auth.getMe();
          if (user) {
            const updatedUser = {
              id: user.u_id,
              role: user.role,
              name: user.name,
            };
            setCurrentUser(updatedUser);
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
          }
        }
      } catch (err) {
        console.error("Failed to fetch current user profile:", err);
      }
    };

    fetchMe();
  }, []);

  useEffect(() => {
    const fetchTodayCount = async () => {
      try {
        if (localStorage.getItem("accessToken")) {
          const res = await api.notification.getTodayCount();
          setTodayCount(res.today_count);
        }
      } catch (err) {
        console.error("Failed to fetch today's notification count:", err);
      }
    };

    fetchTodayCount();

    const handleNotificationsUpdated = () => {
      fetchTodayCount();
    };

    window.addEventListener("notifications-updated", handleNotificationsUpdated);
    return () => {
      window.removeEventListener("notifications-updated", handleNotificationsUpdated);
    };
  }, [path]);

  // Retrieve or initialize sidebar width
  const [width, setWidth] = useState(() => {
    const saved = localStorage.getItem("sidebarWidth");
    return saved ? parseInt(saved, 10) : 240;
  });

  const isResizing = useRef(false);
  const [resizingActive, setResizingActive] = useState(false);

  const startResizing = (e) => {
    e.preventDefault();
    isResizing.current = true;
    setResizingActive(true);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return;
    // Set boundary limits: Min 70px, Max 400px
    const newWidth = Math.max(70, Math.min(400, e.clientX));
    setWidth(newWidth);
    localStorage.setItem("sidebarWidth", newWidth.toString());
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    setResizingActive(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const isCollapsed = width < 160;

  const isCalendarActive =
    path.includes('/calendar') ||
    path.includes('/daily-calendar') ||
    path.includes('/weekly-calendar') ||
    path.includes('/monthly-calendar');

  const isCustomerActive =
    path.includes('/customer-management') &&
    !path.includes('/customer-management-memo-assistant');

  const isAssistantActive =
    path.includes('/customer-management-memo-assistant');

  const isTrendActive =
    path.includes('/trend') ||
    path.includes('/economic') ||
    path.includes('/news-archive');

  const isNotificationActive =
    path.includes('/notifications') ||
    path.includes('/notification-message-draft');

  return (
    <div
      className={`${prefix}-sidebar sidebar-container ${isCollapsed ? 'collapsed' : ''}`}
      style={{
        width: isCollapsed ? '70px' : `${width}px`,
        position: 'relative',
        transition: resizingActive ? 'none' : 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Resizing Handle */}
      <div
        className="sidebar-resize-handle"
        onMouseDown={startResizing}
        style={{
          position: 'absolute',
          top: 0,
          right: '-3px',
          width: '6px',
          height: '100%',
          cursor: 'col-resize',
          zIndex: 1000,
          backgroundColor: resizingActive ? 'rgba(2, 132, 199, 0.3)' : 'transparent',
        }}
      />

      <style>{`
        /* Resizing handle behavior */
        .sidebar-resize-handle {
          transition: background-color 0.2s ease;
        }
        .sidebar-resize-handle:hover {
          background-color: rgba(2, 132, 199, 0.2);
        }

        /* Collapsed overrides */
        .sidebar-container.collapsed {
          min-width: 70px !important;
          max-width: 70px !important;
        }

        .sidebar-container.collapsed .menu-text {
          display: none !important;
        }

        .sidebar-container.collapsed .sidebar-profile-info {
          display: none !important;
        }

        /* Menu item centering when collapsed */
        .sidebar-container.collapsed .sidebar-menu-item {
          justify-content: center !important;
          padding: 12px !important;
          position: relative !important;
          display: flex !important;
          align-items: center !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }

        .sidebar-container.collapsed .sidebar-menu-item svg {
          margin: 0 !important;
          flex-shrink: 0 !important;
        }

        /* Floating Tooltip design */
        .sidebar-tooltip {
          position: absolute;
          left: 80px;
          background-color: #0f172ad9; /* Premium dark glassmorphism */
          backdrop-filter: blur(8px);
          color: #ffffff;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          visibility: hidden;
          transform: translateX(-10px);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          z-index: 9999;
        }

        /* Tooltip indicator arrow */
        .sidebar-tooltip::before {
          content: "";
          position: absolute;
          left: -4px;
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
          width: 8px;
          height: 8px;
          background-color: #0f172ad9;
        }

        .sidebar-menu-item:hover .sidebar-tooltip,
        .logout-wrapper:hover .sidebar-tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateX(0);
        }

        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Centered badge layout for collapsed view */
        .sidebar-container.collapsed .sidebar-badge {
          position: absolute !important;
          top: 4px !important;
          right: 12px !important;
          margin-left: 0 !important;
          font-size: 9px !important;
          padding: 0 !important;
          border-radius: 50% !important;
          width: 15px !important;
          height: 15px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3) !important;
          font-weight: bold !important;
        }

        /* Profile stacking when collapsed */
        .sidebar-container.collapsed .sidebar-profile {
          flex-direction: column !important;
          gap: 16px !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 20px 8px !important;
        }

        .sidebar-container.collapsed .sidebar-profile img,
        .sidebar-container.collapsed .sidebar-profile .sidebar-profile-avatar {
          margin: 0 !important;
        }

        .sidebar-container.collapsed .logout-wrapper {
          margin-left: 0 !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          width: 100% !important;
          position: relative !important;
          cursor: pointer !important;
        }
      `}</style>

      {/* Sidebar Logo */}
      <Link
        to="/daily-calendar"
        className={`${prefix}-logo`}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60px",
          padding: isCollapsed ? "16px 8px" : "32px 24px",
          boxSizing: 'border-box',
          textDecoration: 'none'
        }}
      >
        {isCollapsed ? (
          /* Premium POOM Smile Logo SVG */
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }}>
            <circle cx="14" cy="15" r="3.5" fill="#0284c7" />
            <circle cx="26" cy="15" r="3.5" fill="#0284c7" />
            <path d="M 11 24 A 9 9 0 0 0 29 24" stroke="#0284c7" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </svg>
        ) : (
          <img
            src="/poom-logo.png"
            alt="POOM Logo"
            style={{
              height: "40px",
              maxWidth: "100%",
              objectFit: "contain",
              cursor: 'pointer'
            }}
          />
        )}
      </Link>

      {/* Sidebar Navigation Menu */}
      <div className={`${prefix}-menu`} style={{ marginTop: isCollapsed ? '16px' : '32px' }}>
        <Link to="/daily-calendar" className={`${prefix}-menu-item sidebar-menu-item ${isCalendarActive ? 'active' : ''}`}>
          <Calendar size={20} />
          {!isCollapsed && <span className="menu-text">캘린더</span>}
          {isCollapsed && <span className="sidebar-tooltip">캘린더</span>}
        </Link>
        <Link to="/customer-management-registration-1" className={`${prefix}-menu-item sidebar-menu-item ${isCustomerActive ? 'active' : ''}`}>
          <TrendingUp size={20} />
          {!isCollapsed && <span className="menu-text">고객관리</span>}
          {isCollapsed && <span className="sidebar-tooltip">고객관리</span>}
        </Link>
        <Link to="/customer-management-memo-assistant" className={`${prefix}-menu-item sidebar-menu-item ${isAssistantActive ? 'active' : ''}`}>
          <Contact size={20} />
          {!isCollapsed && <span className="menu-text">상담 보조</span>}
          {isCollapsed && <span className="sidebar-tooltip">상담 보조</span>}
        </Link>
        <div
          className="trend-menu-wrapper"
          onMouseEnter={() => setIsTrendHovered(true)}
          onMouseLeave={() => setIsTrendHovered(false)}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <Link to="/trend-archive" className={`${prefix}-menu-item sidebar-menu-item ${isTrendActive ? 'active' : ''}`}>
            <BarChart2 size={20} />
            {!isCollapsed && <span className="menu-text">트렌드 아카이브</span>}
            {isCollapsed && <span className="sidebar-tooltip">트렌드 아카이브</span>}
          </Link>

          {/* 서브메뉴 (아래 탭) */}
          {!isCollapsed && (isTrendHovered || isTrendActive) && (
            <div
              className="trend-submenu"
              style={{
                display: 'flex',
                flexDirection: 'column',
                paddingLeft: '36px',
                gap: '8px',
                marginTop: '4px',
                marginBottom: '8px',
                animation: 'fadeInSlide 0.2s ease-out forwards',
              }}
            >
              <Link
                to="/news-archive"
                style={{
                  textDecoration: 'none',
                  color: path.includes('/news-archive') ? '#0284c7' : '#64748b',
                  fontSize: '13px',
                  fontWeight: path.includes('/news-archive') ? '600' : '500',
                  padding: '4px 0',
                  transition: 'color 0.2s',
                }}
              >
                뉴스 아카이브
              </Link>
              <Link
                to="/economic-indicator-archive"
                style={{
                  textDecoration: 'none',
                  color: path.includes('/economic-indicator-archive') ? '#0284c7' : '#64748b',
                  fontSize: '13px',
                  fontWeight: path.includes('/economic-indicator-archive') ? '600' : '500',
                  padding: '4px 0',
                  transition: 'color 0.2s',
                }}
              >
                경제지표 아카이브
              </Link>
            </div>
          )}
        </div>
        <Link to="/notifications" className={`${prefix}-menu-item sidebar-menu-item ${isNotificationActive ? 'active' : ''}`}>
          <Bell size={20} />
          {!isCollapsed && <span className="menu-text">알림</span>}
          {todayCount > 0 && (
            <span className={`${prefix}-badge sidebar-badge`} style={{ backgroundColor: '#fee2e2', color: '#ef4444', marginLeft: 'auto' }}>
              {todayCount}
            </span>
          )}
          {isCollapsed && <span className="sidebar-tooltip">알림</span>}
        </Link>
      </div>

      {/* Sidebar Profile Info */}
      <div className={`${prefix}-profile sidebar-profile ${isCollapsed ? 'collapsed' : ''}`}>
        {currentUser?.profile_url ? (
          <img src={currentUser.profile_url} alt="Profile" />
        ) : (
          <div
            className="sidebar-profile-avatar"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#e0f2fe", // 하늘색
              color: "#0284c7", // 성 한글자 색상
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: "700",
              flexShrink: 0,
              userSelect: "none"
            }}
          >
            {(currentUser?.name || "김재욱").charAt(0)}
          </div>
        )}
        {!isCollapsed && (
          <div className={`${prefix}-profile-info sidebar-profile-info`}>
            <span className={`${prefix}-profile-name`}>{currentUser?.name || "김재욱"}</span>
            <span className={`${prefix}-profile-role`}>
              {currentUser?.role === "admin" ? "Super Admin" : "Private Banker"}
            </span>
          </div>
        )}
        <div className="logout-wrapper" style={{ marginLeft: isCollapsed ? '0' : 'auto' }}>
          <LogOut
            onClick={() => {
              api.auth.logout();
              window.location.href = '/login';
            }}
            size={16}
            color="#94a3b8"
            style={{ cursor: 'pointer' }}
          />
          {isCollapsed && <span className="sidebar-tooltip">로그아웃</span>}
        </div>
      </div>
    </div>
  );
}
