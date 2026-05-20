import { Link, useLocation } from "react-router-dom";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { LogOut } from "lucide-react";
import "./Admin.css";

const pieData = [
  { name: "트렌드 아카이브", value: 45, color: "#6366f1" },
  { name: "고객 관리", value: 35, color: "#fbbf24" },
  { name: "캘린더", value: 20, color: "#fb923c" },
];

const transactionLogs = [
  { time: "09:14:22", path: "/api/ai/chat/completions", ms: "1,243 ms", status: 200 },
  { time: "09:14:22", path: "/api/archive/economic-indicators", ms: "88 ms", status: 200 },
  { time: "09:14:22", path: "/api/archive/news?date=2026-05-07", ms: "124 ms", status: 200 },
  { time: "09:14:22", path: "/api/ai/chat/completions", ms: "5,003 ms", status: 500 },
  { time: "09:14:22", path: "/api/report/generate", ms: "2,310 ms", status: 200 },
  { time: "09:14:22", path: "/api/report/generate", ms: "132 ms", status: 200 },
  { time: "09:14:22", path: "/api/market/rates?type=exchange", ms: "54 ms", status: 200 },
  { time: "09:14:22", path: "/api/ai/chat/completions", ms: "988 ms", status: 200 },
];

const AdminTabs = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="admin-tabs">
      <Link 
        to="/admin-permission-settings" 
        className={`admin-tab ${path === '/admin-permission-settings' ? 'active' : ''}`}
      >
        권한 설정
      </Link>
      <Link 
        to="/admin-system-dashboard-1" 
        className={`admin-tab ${path.includes('/admin-system-dashboard') ? 'active' : ''}`}
      >
        시스템 대시보드
      </Link>
      <Link 
        to="/admin-employee-dashboard" 
        className={`admin-tab ${path === '/admin-employee-dashboard' ? 'active' : ''}`}
      >
        직원 대시보드
      </Link>
    </div>
  );
};

const AdminHeader = ({ title }) => {
  return (
    <div className="admin-header">
      <h1 className="admin-page-title">{title}</h1>
      <div className="admin-header-right">
        <AdminTabs />
        <div className="admin-profile">
          <div className="admin-profile-info">
            <span className="admin-name">김재욱</span>
            <span className="admin-role">Super Admin</span>
          </div>
          <div className="admin-avatar">
            <img src="https://i.pravatar.cc/150?img=11" alt="Profile" />
          </div>
          <LogOut onClick={() => window.location.href='/login'} size={20} className="admin-logout" />
        </div>
      </div>
    </div>
  );
};

export default function AdminSystemDashboard2() {
  return (
    <div className="admin-container">
      <AdminHeader title="관리자 - 시스템 대시보드-2" />
      
      <div className="admin-content">
        {/* Top Section (Bars and Pie) - Resembles bottom section of Dashboard 1 */}
        <div className="admin-bottom-card">
          <div className="admin-bars-section">
            <div className="admin-bar-item">
              <div className="bar-label">
                <span>트렌드 아카이브</span>
                <span>2,341회 <small>28%</small></span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: '75%', backgroundColor: '#6366f1' }}></div>
              </div>
            </div>
            <div className="admin-bar-item">
              <div className="bar-label">
                <span>고객관리</span>
                <span>1,887회 <small>28%</small></span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: '60%', backgroundColor: '#22c55e' }}></div>
              </div>
            </div>
            <div className="admin-bar-item">
              <div className="bar-label">
                <span>캘린더</span>
                <span>1,254회 <small>28%</small></span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: '40%', backgroundColor: '#f97316' }}></div>
              </div>
            </div>
            <div className="admin-bar-item">
              <div className="bar-label">
                <span>뉴스 버킷</span>
                <span>987회 <small>28%</small></span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: '30%', backgroundColor: '#a855f7' }}></div>
              </div>
            </div>
          </div>
          
          <div className="admin-pie-section">
            <div className="pie-filters">
              <button>전체</button>
              <button className="active">이번 주</button>
              <button>이번 달</button>
            </div>
            <div className="pie-container" style={{ height: "200px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="pie-legend">
              <span className="legend-item"><span className="dot" style={{backgroundColor: '#6366f1'}}></span> 트렌드 아카이브</span>
              <span className="legend-item"><span className="dot" style={{backgroundColor: '#fbbf24'}}></span> 고객 관리</span>
              <span className="legend-item"><span className="dot" style={{backgroundColor: '#f97316'}}></span> 캘린더</span>
            </div>
          </div>
        </div>

        {/* Transaction Log Table */}
        <div className="admin-chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="admin-chart-title" style={{ margin: 0 }}>트랜잭션 로그 (DB 적재)</h3>
            <div className="pie-filters">
              <button className="active">전체</button>
              <button style={{ color: '#ef4444', backgroundColor: '#fee2e2' }}>오류만</button>
            </div>
          </div>
          
          <table className="admin-list-table">
            <tbody>
              {transactionLogs.map((log, i) => (
                <tr key={i}>
                  <td style={{ color: '#6b7280' }}>{log.time}</td>
                  <td>{log.path}</td>
                  <td style={{ textAlign: 'right', color: '#6b7280' }}>{log.ms}</td>
                  <td style={{ textAlign: 'right', width: '80px' }}>
                    <span className={`status-badge ${log.status === 200 ? 'success' : 'error'}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
