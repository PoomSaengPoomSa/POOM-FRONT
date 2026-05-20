import { Link, useLocation } from "react-router-dom";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { LogOut } from "lucide-react";
import "./Admin.css";

const deptData = [
  { name: "WM영업1팀", value: 80 },
  { name: "WM영업2팀", value: 71 },
  { name: "리테일PB팀", value: 68 },
];

const trendData = [
  { name: "4주전", value: 61 },
  { name: "3주전", value: 67 },
  { name: "2주전", value: 70 },
  { name: "지난주", value: 75 },
];

const employees = [
  { id: "100089", name: "이홍혁", branch: "강남지점", stat1: "34회", stat2: "28회", stat3: "47회", stat4: "12회", stat5: "9회", total: "130회", status: "접속 중", statusClass: "status-online" },
  { id: "100021", name: "이수현", branch: "강남지점", stat1: "41회", stat2: "19회", stat3: "31회", stat4: "18회", stat5: "6회", total: "115회", status: "접속 중", statusClass: "status-online" },
  { id: "100088", name: "김수빈", branch: "여의도지점", stat1: "22회", stat2: "38회", stat3: "14회", stat4: "5회", stat5: "11회", total: "90회", status: "1시간 전", statusClass: "status-away" },
  { id: "100102", name: "이주리", branch: "압구정지점", stat1: "—", stat2: "—", stat3: "—", stat4: "—", stat5: "—", total: "—", status: "14일 미접속", statusClass: "status-offline" },
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

export default function AdminEmployeeDashboard() {
  return (
    <div className="admin-container">
      <AdminHeader title="관리자 - 직원 대시보드" />
      
      <div className="admin-content">
        {/* Stat Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-title">오늘 접속 직원</div>
            <div className="admin-stat-value">42명</div>
            <div className="admin-stat-sub">전체 52명 중</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-title">접속률</div>
            <div className="admin-stat-value">75%</div>
            <div className="admin-stat-sub">전주 +8%</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-title">오늘 접속 직원</div>
            <div className="admin-stat-value">00명</div>
            <div className="admin-stat-sub">전체 52명 중</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-title">평균 세션 시간</div>
            <div className="admin-stat-value">24분</div>
            <div className="admin-stat-sub">전일 21분</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="admin-charts-row">
          <div className="admin-chart-card">
            <h3 className="admin-chart-title">부서별 접속률</h3>
            <div style={{ height: "250px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} barSize={60}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} ticks={[0, 20, 40, 60, 80, 100]} tickFormatter={(val) => `${val}%`} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="admin-chart-card">
            <h3 className="admin-chart-title">주간 접속률 추이</h3>
            <div style={{ height: "250px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={[50, 90]} ticks={[50, 55, 60, 65, 70, 75, 80, 85, 90]} tickFormatter={(val) => `${val}%`} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{r: 5, fill: '#3b82f6'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="employee-table-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 className="admin-chart-title" style={{ margin: 0 }}>직원별 기능 사용 현황</h3>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>오늘 기준</span>
          </div>
          
          <table className="employee-table">
            <thead>
              <tr>
                <th>사번</th>
                <th>이름</th>
                <th>지점</th>
                <th>경제지표</th>
                <th>뉴스 아카이브</th>
                <th>AI 메모</th>
                <th>리포트</th>
                <th>포트폴리오</th>
                <th>총 사용</th>
                <th>접속 상태</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => (
                <tr key={i}>
                  <td style={{ color: '#6b7280' }}>{emp.id}</td>
                  <td>
                    <div className="employee-name-cell">
                      <div className="employee-avatar" style={{
                        background: i % 2 === 0 ? '#e0e7ff' : '#fee2e2',
                        color: i % 2 === 0 ? '#4f46e5' : '#ef4444'
                      }}>
                        {emp.name.charAt(0)}
                      </div>
                      {emp.name}
                    </div>
                  </td>
                  <td style={{ color: '#6b7280' }}>{emp.branch}</td>
                  <td>{emp.stat1}</td>
                  <td>{emp.stat2}</td>
                  <td>{emp.stat3}</td>
                  <td>{emp.stat4}</td>
                  <td>{emp.stat5}</td>
                  <td style={{ fontWeight: 500 }}>{emp.total}</td>
                  <td className={emp.statusClass} style={{ fontWeight: 500 }}>{emp.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
