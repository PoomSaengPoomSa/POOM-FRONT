import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, TrendingUp, Users, Bell, Settings, LogOut } from "lucide-react";
import "../customer/Customer.css";

export default function SettingsPage() {
  const location = useLocation();
  const path = location.pathname;
  
  const [briefingTime, setBriefingTime] = useState("1시간 전");

  const handleTimeChange = (e) => {
    setBriefingTime(e.target.value);
  };

  return (
    <div className="cust-container">
      {/* Sidebar */}
      <div className="cust-sidebar">
        <div className="cust-logo">
          <div className="cust-logo-circle"></div>
        </div>
        
        <div className="cust-menu">
          <Link to="/daily-calendar" className={`cust-menu-item ${path.includes('/calendar') ? 'active' : ''}`}>
            <Calendar size={20} />
            캘린더
          </Link>
          <Link to="/trend-archive" className={`cust-menu-item ${path.includes('/trend') ? 'active' : ''}`}>
            <TrendingUp size={20} />
            트렌드 아카이브
          </Link>
          <Link to="/customer-management-registration-1" className={`cust-menu-item ${path.includes('/customer-management') ? 'active' : ''}`}>
            <Users size={20} />
            고객관리
            <span className="cust-badge">7</span>
          </Link>
          <Link to="/news-bucket-bucket" className={`cust-menu-item ${path.includes('/news-bucket') ? 'active' : ''}`}>
            <Bell size={20} />
            뉴스 버킷
          </Link>
          <Link to="/settings" className={`cust-menu-item ${path.includes('/settings') ? 'active' : ''}`}>
            <Settings size={20} />
            설정
          </Link>
        </div>

        <div className="cust-profile">
          <img src="https://i.pravatar.cc/150?img=11" alt="Profile" />
          <div className="cust-profile-info">
            <span className="cust-profile-name">김재욱</span>
            <span className="cust-profile-role">Private Banker</span>
          </div>
          <LogOut onClick={() => window.location.href='/login-pb'} size={16} color="#94a3b8" style={{ marginLeft: 'auto', cursor: 'pointer' }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="cust-main" style={{ flexDirection: 'column', gap: '24px', backgroundColor: '#e5e5e5' }}>
        
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', flex: 1, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ width: '150px', textAlign: 'left', padding: '24px 0', fontSize: '14px', fontWeight: '700', color: '#334155' }}>방문 브리핑</th>
                <td style={{ padding: '24px 0' }}>
                  <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                    {['30분 전', '1시간 전', '2시간 전', '사용 안 함'].map((option) => (
                      <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: briefingTime === option ? '#0284c7' : '#64748b', fontWeight: briefingTime === option ? '600' : '500' }}>
                        <input 
                          type="radio" 
                          name="briefingTime" 
                          value={option}
                          checked={briefingTime === option}
                          onChange={handleTimeChange}
                          style={{ margin: 0, accentColor: '#0284c7' }}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
