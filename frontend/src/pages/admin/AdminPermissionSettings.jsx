import { Link, useLocation } from "react-router-dom";
import { LogOut, Search } from "lucide-react";
import "./Admin.css";

const employees = [
  { id: "100021", name: "이수현", branch: "강남지점", clients: "18명", pending: false },
  { id: "100089", name: "이홍혁", branch: "강남지점", clients: "41명", pending: false },
  { id: "100088", name: "김수빈", branch: "여의도지점", clients: "19명", pending: false },
  { id: "100102", name: "이주리", branch: "압구정-강남", branchNote: "발령 대기 압구정 → 강남", clients: "0명", pending: true },
  { id: "100118", name: "유채린", branch: "여의도지점", clients: "32명", pending: false },
];

const historyLogs = [
  { id: "1", name: "이주리", title: "이주리 압구정 → 강남지점", desc: "고객 23명 → 조성은 2025.03.10" },
  { id: "2", name: "서지혜", title: "서지혜 여의도 → 서초지점", desc: "고객 19명 → 김수빈 2024.09.02" },
  { id: "3", name: "이종혁", title: "이종혁 서초 → 강남지점", desc: "고객 18명 재배정 → 김수빈 2022.03.15" },
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
          <LogOut onClick={() => window.location.href='/login-pb'} size={20} className="admin-logout" />
        </div>
      </div>
    </div>
  );
};

export default function AdminPermissionSettings() {
  return (
    <div className="admin-container">
      <AdminHeader title="관리자 - 권한 설정" />
      
      <div className="permission-layout">
        <div className="permission-main">
          {/* Search Bar */}
          <div className="search-bar">
            <div style={{ position: 'relative', flex: 1 }}>
              <Search style={{ position: 'absolute', left: 16, top: 12, color: '#9ca3af' }} size={20} />
              <input 
                type="text" 
                className="search-input" 
                placeholder="사번 또는 이름 검색" 
                style={{ paddingLeft: 48, width: '100%', boxSizing: 'border-box' }}
              />
            </div>
            <select className="search-select">
              <option>전체지점</option>
              <option>강남지점</option>
              <option>여의도지점</option>
              <option>압구정지점</option>
            </select>
          </div>

          {/* Table */}
          <div className="permission-table-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 className="admin-chart-title" style={{ margin: 0 }}>직원 계정 목록</h3>
              <span style={{ fontSize: '13px', color: '#0284c7', fontWeight: 500 }}>총 직원수 5명</span>
            </div>
            
            <table className="permission-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>사번 ▼</th>
                  <th style={{ textAlign: 'left' }}>이름 / 지점 ▼</th>
                  <th>담당 고객 수</th>
                  <th>발령 처리</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, i) => (
                  <tr key={i}>
                    <td style={{ textAlign: 'left', color: '#6b7280' }}>{emp.id}</td>
                    <td style={{ textAlign: 'left' }}>
                      <div className="employee-name-cell" style={{ justifyContent: 'flex-start' }}>
                        <div className="employee-avatar" style={{
                          background: i % 2 === 0 ? '#e0e7ff' : '#f1f5f9',
                          color: '#475569'
                        }}>
                          {emp.name.charAt(0)}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600 }}>{emp.name}</span>
                          {emp.pending ? (
                            <span style={{ fontSize: '12px', color: '#ef4444' }}>{emp.branchNote}</span>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>{emp.branch}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{emp.clients}</td>
                    <td>
                      <button className="btn-action">발령처리</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="permission-sidebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937' }}>🕒 인수인계 이력</span>
          </div>

          <div className="history-list">
            {historyLogs.map((log, i) => (
              <div className="history-item" key={i}>
                <div className="history-icon" style={{
                  background: i === 1 ? '#ecfccb' : i === 2 ? '#e0e7ff' : '#f1f5f9'
                }}>
                  {log.name.charAt(0)}
                </div>
                <div className="history-content">
                  <span className="history-title">{log.title}</span>
                  <span className="history-desc">{log.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
