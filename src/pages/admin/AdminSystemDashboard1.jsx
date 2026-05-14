import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { LogOut } from "lucide-react";
import "./Admin.css"; 

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

const statsData = {
  '전체': {
    bars: [
      { name: '트렌드 아카이브', count: '12,341회', pct: '32%', width: '75%', color: '#6366f1' },
      { name: '고객관리', count: '10,887회', pct: '28%', width: '60%', color: '#22c55e' },
      { name: '캘린더', count: '8,254회', pct: '21%', width: '40%', color: '#f97316' },
      { name: '뉴스 버킷', count: '6,987회', pct: '19%', width: '30%', color: '#a855f7' }
    ],
    pie: [
      { name: "트렌드 아카이브", value: 32, color: "#6366f1" },
      { name: "고객 관리", value: 28, color: "#fbbf24" },
      { name: "캘린더", value: 21, color: "#f97316" },
      { name: "뉴스 버킷", value: 19, color: "#a855f7" }
    ]
  },
  '이번 주': {
    bars: [
      { name: '트렌드 아카이브', count: '2,341회', pct: '28%', width: '70%', color: '#6366f1' },
      { name: '고객관리', count: '1,887회', pct: '23%', width: '55%', color: '#22c55e' },
      { name: '캘린더', count: '1,254회', pct: '20%', width: '35%', color: '#f97316' },
      { name: '뉴스 버킷', count: '987회', pct: '28%', width: '25%', color: '#a855f7' }
    ],
    pie: [
      { name: "트렌드 아카이브", value: 28, color: "#6366f1" },
      { name: "고객 관리", value: 23, color: "#fbbf24" },
      { name: "캘린더", value: 20, color: "#f97316" },
      { name: "뉴스 버킷", value: 28, color: "#a855f7" }
    ]
  },
  '이번 달': {
    bars: [
      { name: '트렌드 아카이브', count: '5,341회', pct: '35%', width: '85%', color: '#6366f1' },
      { name: '고객관리', count: '4,887회', pct: '30%', width: '70%', color: '#22c55e' },
      { name: '캘린더', count: '3,254회', pct: '20%', width: '50%', color: '#f97316' },
      { name: '뉴스 버킷', count: '2,987회', pct: '15%', width: '40%', color: '#a855f7' }
    ],
    pie: [
      { name: "트렌드 아카이브", value: 35, color: "#6366f1" },
      { name: "고객 관리", value: 30, color: "#fbbf24" },
      { name: "캘린더", value: 20, color: "#f97316" },
      { name: "뉴스 버킷", value: 15, color: "#a855f7" }
    ]
  }
};

const transactionLogsData = [
  { time: "09:14:22", api: "/api/ai/chat/completions", ms: "1,243 ms", status: "200" },
  { time: "09:14:22", api: "/api/archive/economic-indicators", ms: "88 ms", status: "200" },
  { time: "09:14:22", api: "/api/archive/news?date=2026-06-07", ms: "124 ms", status: "200" },
  { time: "09:14:22", api: "/api/ai/chat/completions", ms: "5,003 ms", status: "500" },
  { time: "09:14:22", api: "/api/report/generate", ms: "2,310 ms", status: "200" },
  { time: "09:14:22", api: "/api/report/generate", ms: "132 ms", status: "200" },
  { time: "09:14:22", api: "/api/market/rates?type=exchange", ms: "54 ms", status: "200" },
  { time: "09:14:22", api: "/api/ai/chat/completions", ms: "988 ms", status: "200" }
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
          <LogOut onClick={() => window.location.href = '/login-pb'} size={20} className="admin-logout" />
        </div>
      </div>
    </div>
  );
};

export default function AdminSystemDashboard1() {
  const [filter, setFilter] = useState('이번 주');
  const [logFilter, setLogFilter] = useState('전체');

  const currentData = statsData[filter];
  const filteredLogs = logFilter === '오류만' 
    ? transactionLogsData.filter(log => log.status !== '200')
    : transactionLogsData;

  return (
    <div className="admin-container">
      <AdminHeader title="관리자 - 시스템 대시보드" />

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
            {currentData.bars.map((bar, i) => (
              <div className="admin-bar-item" key={i}>
                <div className="bar-label">
                  <span>{bar.name}</span>
                  <span>{bar.count} <small>{bar.pct}</small></span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: bar.width, backgroundColor: bar.color }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="admin-pie-section">
            <div className="pie-filters">
              {['전체', '이번 주', '이번 달'].map(f => (
                <button 
                  key={f} 
                  className={filter === f ? 'active' : ''} 
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="pie-container" style={{ height: "200px", width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentData.pie}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {currentData.pie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="pie-legend">
              {currentData.pie.map((item, i) => (
                <span className="legend-item" key={i}>
                  <span className="dot" style={{ backgroundColor: item.color }}></span> 
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction Log Section */}
        <div className="transaction-log-card">
          <div className="log-header">
            <h3 className="admin-chart-title" style={{ margin: 0 }}>트랜잭션 로그 (DB 적재)</h3>
            <div className="log-filters">
              <button 
                className={logFilter === '전체' ? 'active all' : ''}
                onClick={() => setLogFilter('전체')}
              >전체</button>
              <button 
                className={logFilter === '오류만' ? 'active error' : ''}
                onClick={() => setLogFilter('오류만')}
              >오류만</button>
            </div>
          </div>
          
          <table className="log-table">
            <tbody>
              {filteredLogs.map((log, i) => (
                <tr key={i}>
                  <td className="log-time">{log.time}</td>
                  <td className="log-api">{log.api}</td>
                  <td className="log-ms">{log.ms}</td>
                  <td className={`log-status ${log.status === '200' ? 'success' : 'error'}`}>{log.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
