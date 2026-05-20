import { Link, useLocation } from "react-router-dom";
import { Calendar, TrendingUp, Contact, BarChart2, Bell, LogOut } from "lucide-react";
import { notifications } from "../../pages/news/notificationsData";

export default function Sidebar({ type = "cal" }) {
  const location = useLocation();
  const path = location.pathname;

  const prefix = type; // e.g., "cal", "cust", "news", "trend"
  const todayCount = notifications.filter(n => n.today).length;

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
    <div className={`${prefix}-sidebar`}>
      <div className={`${prefix}-logo`}>
        <div className={`${prefix}-logo-circle`}></div>
      </div>
      
      <div className={`${prefix}-menu`}>
        <Link to="/daily-calendar" className={`${prefix}-menu-item ${isCalendarActive ? 'active' : ''}`}>
          <Calendar size={20} />
          캘린더
        </Link>
        <Link to="/customer-management-registration-1" className={`${prefix}-menu-item ${isCustomerActive ? 'active' : ''}`}>
          <TrendingUp size={20} />
          고객관리
        </Link>
        <Link to="/customer-management-memo-assistant" className={`${prefix}-menu-item ${isAssistantActive ? 'active' : ''}`}>
          <Contact size={20} />
          상담 보조
        </Link>
        <Link to="/trend-archive" className={`${prefix}-menu-item ${isTrendActive ? 'active' : ''}`}>
          <BarChart2 size={20} />
          트렌드 아카이브
        </Link>
        <Link to="/notifications" className={`${prefix}-menu-item ${isNotificationActive ? 'active' : ''}`}>
          <Bell size={20} />
          알림
          {todayCount > 0 && (
            <span className={`${prefix}-badge`} style={{ backgroundColor: '#fee2e2', color: '#ef4444', marginLeft: 'auto' }}>
              {todayCount}
            </span>
          )}
        </Link>
      </div>

      <div className={`${prefix}-profile`}>
        <img src="https://i.pravatar.cc/150?img=11" alt="Profile" />
        <div className={`${prefix}-profile-info`}>
          <span className={`${prefix}-profile-name`}>김재욱</span>
          <span className={`${prefix}-profile-role`}>Private Banker</span>
        </div>
        <LogOut onClick={() => window.location.href='/login'} size={16} color="#94a3b8" style={{ marginLeft: 'auto', cursor: 'pointer' }} />
      </div>
    </div>
  );
}
