import { Link, useLocation } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { LogOut } from "lucide-react";
import "./Admin.css"; // Create a shared CSS for Admin pages

const tokenData = [
  { time: "00시", value: 50 },
  { time: "03시", value: 30 },
  { time: "06시", value: 60 },
  { time: "09시", value: 35 },
  { time: "12시", value: 55 },
  { time: "15시", value: 20 },
  { time: "18시", value: 40 },
  { time: "21시", value: 70 },
];

const pieData = [
  { name: "트렌드 아카이브", value: 45, color: "#6366f1" },
  { name: "고객 관리", value: 35, color: "#fbbf24" },
  { name: "캘린더", value: 20, color: "#fb923c" },
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

export default function AdminSystemDashboard1() {
  return (
    <div className="admin-container">
      <AdminHeader title="관리자 - 시스템 대시보드-1" />
      
      <div className="admin-content">
        {/* Stat Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-title">오늘 AI 토큰</div>
            <div className="admin-stat-value">1.24 M</div>
            <div className="admin-stat-sub">전일 + 12%</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-title">API 호출 수</div>
            <div className="admin-stat-value">3,847</div>
            <div className="admin-stat-sub">전일 + 5%</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-title">평균 응답 시간</div>
            <div className="admin-stat-value">1.3s</div>
            <div className="admin-stat-sub positive">+ 0.2s 증가</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-title">오류율</div>
            <div className="admin-stat-value">0.8%</div>
            <div className="admin-stat-sub">목표 2% 이하</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="admin-charts-row">
          <div className="admin-chart-card">
            <h3 className="admin-chart-title">시간대별 토큰 사용</h3>
            <div className="admin-chart-body" style={{ height: "250px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tokenData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="admin-chart-card">
            <h3 className="admin-chart-title">접속 히트맵</h3>
            <div className="admin-heatmap">
              {/* Mock Heatmap */}
              <div className="heatmap-grid">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className={`heatmap-cell ${i >= 9 && i <= 18 ? 'high' : 'low'}`} />
                ))}
              </div>
              <div className="heatmap-labels">
                <span>00시</span>
                <span>06시</span>
                <span>12시</span>
                <span>18시</span>
                <span>23시</span>
              </div>
              <div className="heatmap-legend">
                <span>낮음</span>
                <div className="legend-cells">
                  <div className="heatmap-cell low"></div>
                  <div className="heatmap-cell med"></div>
                  <div className="heatmap-cell high"></div>
                  <div className="heatmap-cell highest"></div>
                </div>
                <span>높음</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
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
      </div>
    </div>
  );
}
