import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { LogOut, Activity, Database, Cpu, Brain, CheckCircle, AlertTriangle, ShieldAlert } from "lucide-react";
import { api } from "../../api";
import "./Admin.css"; 

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
        to="/admin-system-dashboard"
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

// Avatar 색상 유틸리티 (DB의 10개 지점 1:1 고유 색상 매핑)
const getAvatarStyleByBranch = (branchName) => {
  if (!branchName) return { backgroundColor: '#f1f5f9', color: '#475569' };

  if (branchName.includes('강남역금융센터') || branchName === '강남') {
    return { backgroundColor: '#e0e7ff', color: '#4f46e5' }; // 1. 강남 - Indigo
  } else if (branchName.includes('종로금융센터') || branchName === '종로') {
    return { backgroundColor: '#eff6ff', color: '#2563eb' }; // 2. 종로 - Blue
  } else if (branchName.includes('여의도중앙지점') || branchName === '여의도') {
    return { backgroundColor: '#ecfdf5', color: '#059669' }; // 3. 여의도 - Emerald
  } else if (branchName.includes('분당금융센터') || branchName === '분당') {
    return { backgroundColor: '#f0fdfa', color: '#0d9488' }; // 4. 분당 - Teal
  } else if (branchName.includes('송도스마트밸리지점') || branchName === '송도') {
    return { backgroundColor: '#fce7f3', color: '#db2777' }; // 5. 송도 - Pink
  } else if (branchName.includes('부산중앙지점') || branchName === '부산') {
    return { backgroundColor: '#faf5ff', color: '#7c3aed' }; // 6. 부산 - Purple
  } else if (branchName.includes('대구지점') || branchName === '대구') {
    return { backgroundColor: '#fff7ed', color: '#ea580c' }; // 7. 대구 - Orange
  } else if (branchName.includes('대전지점') || branchName === '대전') {
    return { backgroundColor: '#fffbeb', color: '#d97706' }; // 8. 대전 - Amber
  } else if (branchName.includes('광주지점') || branchName === '광주') {
    return { backgroundColor: '#f0fdf4', color: '#166534' }; // 9. 광주 - Green
  } else if (branchName.includes('제주지점') || branchName === '제주') {
    return { backgroundColor: '#fdf2f8', color: '#be185d' }; // 10. 제주 - Rose
  } else {
    // 부분 매핑 폴백
    if (branchName.includes('강남')) return { backgroundColor: '#e0e7ff', color: '#4f46e5' };
    if (branchName.includes('종로')) return { backgroundColor: '#eff6ff', color: '#2563eb' };
    if (branchName.includes('여의도')) return { backgroundColor: '#ecfdf5', color: '#059669' };
    if (branchName.includes('분당')) return { backgroundColor: '#f0fdfa', color: '#0d9488' };
    if (branchName.includes('송도')) return { backgroundColor: '#fce7f3', color: '#db2777' };
    if (branchName.includes('부산')) return { backgroundColor: '#faf5ff', color: '#7c3aed' };
    if (branchName.includes('대구')) return { backgroundColor: '#fff7ed', color: '#ea580c' };
    if (branchName.includes('대전')) return { backgroundColor: '#fffbeb', color: '#d97706' };
    if (branchName.includes('광주')) return { backgroundColor: '#f0fdf4', color: '#166534' };
    if (branchName.includes('제주')) return { backgroundColor: '#fdf2f8', color: '#be185d' };
    
    return { backgroundColor: '#f1f5f9', color: '#475569' }; // Slate
  }
};

const AdminHeader = ({ title }) => {
  const [user, setUser] = useState({ name: "관리자", role: "Super Admin", branch: "" });

  useEffect(() => {
    async function fetchMe() {
      try {
        const me = await api.auth.getMe();
        if (me) {
          setUser({
            name: me.name,
            role: me.role === 'admin' ? 'Super Admin' : 'PB User',
            branch: me.branch || ''
          });
        }
      } catch (err) {
        console.error("Failed to fetch me:", err);
        const localUser = api.auth.getCurrentUser();
        if (localUser) {
          setUser({
            name: localUser.name || localUser.id,
            role: localUser.role === 'admin' ? 'Super Admin' : 'PB User',
            branch: ""
          });
        }
      }
    }
    fetchMe();
  }, []);

  return (
    <div className="admin-header">
      <h1 className="admin-page-title">{title}</h1>
      <div className="admin-header-right">
        <AdminTabs />
        <div className="admin-profile">
          <div className="admin-profile-info">
            <span className="admin-name">{user.name}</span>
            <span className="admin-role">{user.role}</span>
          </div>
          <LogOut onClick={() => { api.auth.logout(); window.location.href = '/login'; }} size={20} className="admin-logout" />
        </div>
      </div>
    </div>
  );
};

export default function AdminSystemDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.documentElement.style.backgroundColor = "#f3f4f6";
    document.body.style.backgroundColor = "#f3f4f6";
    const rootEl = document.getElementById("root");
    if (rootEl) {
      rootEl.style.backgroundColor = "#f3f4f6";
    }
    return () => {
      document.documentElement.style.backgroundColor = "";
      document.body.style.backgroundColor = "";
      if (rootEl) {
        rootEl.style.backgroundColor = "";
      }
    };
  }, []);

  useEffect(() => {
    async function fetchDashboardData(silent = false) {
      if (!silent) setLoading(true);
      try {
        const result = await api.admin.getSystemDashboard();
        if (result) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to fetch system dashboard:", err);
        setError("데이터 연동 실패");
      } finally {
        if (!silent) setLoading(false);
      }
    }

    fetchDashboardData();

    const intervalId = setInterval(() => {
      fetchDashboardData(true);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // 1. API 호출 자체가 거절당했거나 오프라인일 때 전용 커넥션 오프라인 에러 뷰 렌더링
  if (error && !data) {
    return (
      <div className="admin-container">
        <AdminHeader title="관리자 - 시스템 대시보드" />
        <div className="admin-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '48px 40px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            textAlign: 'center',
            maxWidth: '520px',
            border: '1px solid #fee2e2'
          }}>
            <ShieldAlert size={64} style={{ color: '#ef4444', margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', marginBottom: '12px' }}>대시보드 데이터 연동 실패</h2>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6', marginBottom: '28px' }}>
              백엔드 서버 또는 대시보드 API와의 연결에 실패했습니다. <br />
              로그인 세션 만료 여부 및 슈퍼 어드민(<code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', color: '#dc2626', fontWeight: '600' }}>admin1</code>) 계정의 권한 점검이 필요합니다.
            </p>
            <button 
              onClick={() => { setError(null); setLoading(true); window.location.reload(); }}
              style={{
                background: '#0284c7',
                color: '#fff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s',
                boxShadow: '0 2px 4px rgba(2, 132, 199, 0.2)'
              }}
              onMouseEnter={(e) => e.target.style.background = '#0369a1'}
              onMouseLeave={(e) => e.target.style.background = '#0284c7'}
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="admin-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <Activity className="animate-spin" size={48} style={{ margin: '0 auto 16px', color: '#0284c7' }} />
          <h3>시스템 대시보드를 로딩 중입니다...</h3>
          <p style={{ fontSize: '13px', marginTop: '8px' }}>엘라스틱서치 인덱스 자동 적재 및 실시간 로그 수집 점검 중</p>
        </div>
      </div>
    );
  }

  const dashboard = data;
  const isESOffline = dashboard.es_status === "오류";

  return (
    <div className="admin-container">
      <AdminHeader title="관리자 - 시스템 대시보드" />

      <div className="admin-content" style={{ gap: '28px' }}>
        
        {/* ========================================================
            1. TOP STATS CARDS
           ======================================================== */}
        <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          
          {/* Card 1: 서버 상태 */}
          <div className="admin-stat-card" style={{ position: 'relative', overflow: 'hidden', padding: '24px 20px', borderLeft: `4px solid ${isESOffline ? '#f59e0b' : '#10b981'}` }}>
            <div className="admin-stat-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <Activity size={16} style={{ color: isESOffline ? '#f59e0b' : '#10b981' }} />
              서버 상태
            </div>
            <div className="admin-stat-value" style={{ 
              color: isESOffline ? "#f59e0b" : "#10b981",
              fontSize: '36px',
              fontWeight: '800',
              marginTop: '12px',
              textShadow: isESOffline ? '0 0 10px rgba(245, 158, 11, 0.1)' : '0 0 10px rgba(16, 185, 129, 0.1)'
            }}>
              {isESOffline ? "주의" : "정상"}
            </div>
            <div className="admin-stat-sub" style={{ marginTop: '8px', fontSize: '13px', color: '#6b7280' }}>
              {isESOffline ? "Elasticsearch 서버 연결 해제" : "모든 서버 정상 운영 중"}
            </div>
          </div>

          {/* Card 2: API 응답 속도 */}
          <div className="admin-stat-card" style={{ padding: '24px 20px', borderLeft: `4px solid ${isESOffline ? '#9ca3af' : '#3b82f6'}` }}>
            <div className="admin-stat-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <Cpu size={16} style={{ color: isESOffline ? '#9ca3af' : '#3b82f6' }} />
              API 응답 속도
            </div>
            <div className="admin-stat-value" style={{ fontSize: isESOffline ? '28px' : '36px', fontWeight: '800', marginTop: isESOffline ? '20px' : '12px', color: isESOffline ? '#ef4444' : '#1f2937' }}>
              {isESOffline ? "연결 끊김" : `${dashboard.api_response_speed} ms`}
            </div>
            <div className="admin-stat-sub" style={{ marginTop: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {isESOffline ? (
                <span style={{ color: '#ef4444' }}>실시간 집계 불가</span>
              ) : (
                <>
                  <span style={{ 
                    color: dashboard.api_response_speed_change < 0 ? '#10b981' : (dashboard.api_response_speed_change > 0 ? '#ef4444' : '#6b7280'), 
                    fontWeight: '600' 
                  }}>
                    {dashboard.api_response_speed_change > 0 ? `+${dashboard.api_response_speed_change}` : dashboard.api_response_speed_change}%
                  </span> 
                  <span style={{ color: '#6b7280' }}>(1시간 전)</span>
                </>
              )}
            </div>
          </div>

          {/* Card 3: 에러율 */}
          <div className="admin-stat-card" style={{ padding: '24px 20px', borderLeft: `4px solid ${isESOffline ? '#9ca3af' : '#f43f5e'}` }}>
            <div className="admin-stat-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <ShieldAlert size={16} style={{ color: isESOffline ? '#9ca3af' : '#f43f5e' }} />
              에러율
            </div>
            <div className="admin-stat-value" style={{ fontSize: isESOffline ? '28px' : '36px', fontWeight: '800', marginTop: isESOffline ? '20px' : '12px', color: isESOffline ? '#ef4444' : '#1f2937' }}>
              {isESOffline ? "연결 끊김" : `${dashboard.error_rate}%`}
            </div>
            <div className="admin-stat-sub" style={{ marginTop: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {isESOffline ? (
                <span style={{ color: '#ef4444' }}>실시간 집계 불가</span>
              ) : (
                <>
                  <span style={{ 
                    color: dashboard.error_rate_change < 0 ? '#10b981' : (dashboard.error_rate_change > 0 ? '#f43f5e' : '#6b7280'), 
                    fontWeight: '600' 
                  }}>
                    {dashboard.error_rate_change > 0 ? `+${dashboard.error_rate_change}` : dashboard.error_rate_change}%
                  </span>
                  <span style={{ color: '#6b7280' }}>(1시간 전)</span>
                </>
              )}
            </div>
          </div>

          {/* Card 4: DB / Elasticsearch / AI 서비스 통합 상태 */}
          <div className="admin-stat-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              {/* DB 상태 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Database size={14} style={{ color: '#6b7280' }} />
                  DB 상태
                </span>
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: '700', 
                  color: dashboard.db_status === "정상" ? "#10b981" : "#ef4444",
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {dashboard.db_status === "정상" ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                  {dashboard.db_status}
                </span>
              </div>

              {/* Elasticsearch 상태 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Activity size={14} style={{ color: '#6b7280' }} />
                  Elasticsearch 상태
                </span>
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: '700', 
                  color: isESOffline ? "#ef4444" : "#10b981",
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {isESOffline ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
                  {isESOffline ? "오류" : "정상"}
                </span>
              </div>

              {/* AI 서비스 상태 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Brain size={14} style={{ color: '#6b7280' }} />
                  AI 서비스 상태
                </span>
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: '700', 
                  color: dashboard.ai_status === "정상" ? "#10b981" : "#ef4444",
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {dashboard.ai_status === "정상" ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                  {dashboard.ai_status}
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* ========================================================
            2. CHARTS SECTION (3 Columns Grid)
           ======================================================== */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          
          {/* Chart 1: 요청 수 */}
          <div className="admin-chart-card" style={{ padding: '20px', position: 'relative' }}>
            <h3 className="admin-chart-title" style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>요청 수</h3>
            {isESOffline ? (
              <div style={{ height: "180px", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px dashed #e5e7eb', textAlign: 'center', padding: '10px' }}>
                <ShieldAlert size={28} style={{ color: '#f59e0b', marginBottom: '8px' }} />
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#4b5563' }}>Elasticsearch 연결 오프라인</span>
                <span style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>실시간 통계 집계 불가</span>
              </div>
            ) : (
              <div style={{ height: "180px", width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboard.requests_chart}>
                    <defs>
                      <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: 12 }} />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRequests)" dot={{ r: 3, strokeWidth: 1 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Chart 2: 응답시간(ms) */}
          <div className="admin-chart-card" style={{ padding: '20px', position: 'relative' }}>
            <h3 className="admin-chart-title" style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>응답시간(ms)</h3>
            {isESOffline ? (
              <div style={{ height: "180px", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px dashed #e5e7eb', textAlign: 'center', padding: '10px' }}>
                <ShieldAlert size={28} style={{ color: '#f59e0b', marginBottom: '8px' }} />
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#4b5563' }}>Elasticsearch 연결 오프라인</span>
                <span style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>실시간 지연 속도 연산 불가</span>
              </div>
            ) : (
              <div style={{ height: "180px", width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboard.latency_chart}>
                    <defs>
                      <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: 12 }} />
                    <Area type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorLatency)" dot={{ r: 3, strokeWidth: 1 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Chart 3: 에러율 (%) */}
          <div className="admin-chart-card" style={{ padding: '20px', position: 'relative' }}>
            <h3 className="admin-chart-title" style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>에러율 (%)</h3>
            {isESOffline ? (
              <div style={{ height: "180px", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px dashed #e5e7eb', textAlign: 'center', padding: '10px' }}>
                <ShieldAlert size={28} style={{ color: '#f59e0b', marginBottom: '8px' }} />
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#4b5563' }}>Elasticsearch 연결 오프라인</span>
                <span style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>실시간 에러율 집계 불가</span>
              </div>
            ) : (
              <div style={{ height: "180px", width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboard.error_chart}>
                    <defs>
                      <linearGradient id="colorError" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: 12 }} />
                    <Area type="monotone" dataKey="value" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorError)" dot={{ r: 3, strokeWidth: 1 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

        </div>

        {/* ========================================================
            3. BOTTOM TABLES SECTION (Recent Errors & ML Metrics)
           ======================================================== */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'stretch' }}>
          
          {/* Left Table: 최근 에러 로그 */}
          <div className="admin-chart-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px', position: 'relative' }}>
            <h3 className="admin-chart-title" style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>최근 에러 로그</h3>
            {isESOffline ? (
              <div style={{ flex: 1, minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px dashed #e5e7eb', textAlign: 'center', padding: '10px' }}>
                <ShieldAlert size={36} style={{ color: '#f59e0b', marginBottom: '12px' }} />
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>Elasticsearch 연결 오프라인</span>
                <span style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>실시간 트랜잭션 에러 로그 조회 불가</span>
              </div>
            ) : (
              <div className="admin-scrollable-container" style={{ flex: 1 }}>
                <table className="admin-list-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb' }}>
                      <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#4b5563', borderBottom: '1px solid #e5e7eb' }}>시간</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#4b5563', borderBottom: '1px solid #e5e7eb' }}>서비스</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#4b5563', borderBottom: '1px solid #e5e7eb' }}>에러 내용</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.recent_errors.map((log, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background-color 0.2s' }}>
                        <td style={{ padding: '12px 14px', fontSize: '13px', color: '#6b7280' }}>{log.time}</td>
                        <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '500', color: '#1f2937' }}>
                          <span style={{ 
                            padding: '3px 8px', 
                            borderRadius: '4px', 
                            fontSize: '11px', 
                            fontWeight: '600',
                            backgroundColor: log.service === 'AI Service' ? '#f5f3ff' : (log.service === 'API Gateway' ? '#eff6ff' : (log.service === 'Elasticsearch' ? '#ecfdf5' : '#fff7ed')),
                            color: log.service === 'AI Service' ? '#7c3aed' : (log.service === 'API Gateway' ? '#2563eb' : (log.service === 'Elasticsearch' ? '#059669' : '#d97706'))
                          }}>
                            {log.service}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '13px', color: '#dc2626', fontWeight: '500', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.error_detail}>
                          {log.error_detail}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right Table: ML 모델 성능지표 (항상 정상 로드) */}
          <div className="admin-chart-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px' }}>
            <h3 className="admin-chart-title" style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>ML 모델 성능지표</h3>
            <div style={{ flex: 1, overflowX: 'auto' }}>
              <table className="admin-list-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#4b5563', borderBottom: '1px solid #e5e7eb' }}>서비스</th>
                    <th colSpan={4} style={{ padding: '10px 14px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#4b5563', borderBottom: '1px solid #e5e7eb' }}>성능 지표</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.ml_metrics.map((model, index) => {
                    return (
                      <React.Fragment key={index}>
                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td rowSpan={2} style={{ 
                            padding: '20px 14px', 
                            fontSize: '14px', 
                            fontWeight: '700', 
                            color: '#1f2937', 
                            verticalAlign: 'middle',
                            borderBottom: '2px solid #e5e7eb',
                            backgroundColor: '#fff'
                          }}>
                            {model.name}
                          </td>
                          <td style={{ padding: '6px 8px', fontSize: '11px', fontWeight: '600', color: '#6b7280', textAlign: 'center', backgroundColor: '#f9fafb' }}>{model.metric1_name}</td>
                          <td style={{ padding: '6px 8px', fontSize: '11px', fontWeight: '600', color: '#6b7280', textAlign: 'center', backgroundColor: '#f9fafb' }}>{model.metric2_name}</td>
                          <td style={{ padding: '6px 8px', fontSize: '11px', fontWeight: '600', color: '#6b7280', textAlign: 'center', backgroundColor: '#f9fafb' }}>{model.metric3_name}</td>
                          <td style={{ padding: '6px 8px', fontSize: '11px', fontWeight: '600', color: '#6b7280', textAlign: 'center', backgroundColor: '#f9fafb' }}>{model.metric4_name}</td>
                        </tr>
                        <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                          <td style={{ padding: '12px 8px', fontSize: '13px', fontWeight: '700', color: '#059669', textAlign: 'center' }}>{model.metric1_val}</td>
                          <td style={{ padding: '12px 8px', fontSize: '13px', fontWeight: '700', color: '#4f46e5', textAlign: 'center' }}>{model.metric2_val}</td>
                          <td style={{ padding: '12px 8px', fontSize: '13px', fontWeight: '700', color: '#3b82f6', textAlign: 'center' }}>{model.metric3_val}</td>
                          <td style={{ padding: '12px 8px', fontSize: '13px', fontWeight: '700', color: '#10b981', textAlign: 'center' }}>{model.metric4_val}</td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
