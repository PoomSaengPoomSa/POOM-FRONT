import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { LogOut, Users, Activity, CheckSquare, Calendar, ChevronUp, ShieldAlert } from "lucide-react";
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
        인수인계 설정
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

// 값이 없을 때 대시를 표시하는 헬퍼
const val = (v, suffix = "") => (v != null ? `${v}${suffix}` : "-");

export default function AdminEmployeeDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [deptData, setDeptData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [esStatus, setEsStatus] = useState("정상");

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
    async function loadDashboardData(silent = false) {
      if (!silent) setLoading(true);
      try {
        const [dashData, branchData, weeklyData, usageData] = await Promise.all([
          api.admin.getEmployeeDashboard(),
          api.admin.getBranchStats(),
          api.admin.getWeeklyTrend(),
          api.admin.getEmployeeUsage(),
        ]);

        if (dashData) {
          setMetrics(dashData);
          if (dashData.es_status) {
            setEsStatus(dashData.es_status);
          }
          setError(null);
        }
        if (branchData && branchData.stats) {
          setDeptData(branchData.stats.map(s => ({
            name: s.branch_name,
            value: s.access_rate
          })));
        }
        if (weeklyData && weeklyData.trends) {
          setTrendData(weeklyData.trends);
        }
        if (usageData) {
          if (usageData.usage) {
            setEmployees(usageData.usage);
          }
          if (usageData.recent_activities) {
            setActivities(usageData.recent_activities);
          }
          if (usageData.es_status === "오류") {
            setEsStatus("오류");
          }
        }
      } catch (err) {
        console.error("Failed to load employee dashboard data:", err);
        setError("데이터 연동 실패");
      } finally {
        if (!silent) setLoading(false);
      }
    }
    
    loadDashboardData();

    // 5초 간격 실시간 모니터링 폴링 동작 설정
    const intervalId = setInterval(() => {
      loadDashboardData(true);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  if (error && employees.length === 0) {
    return (
      <div className="admin-container">
        <AdminHeader title="관리자 - 직원 대시보드" />
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
              로그인 세션 만료 여부 및 슈퍼 어드민 계정의 권한 점검이 필요합니다.
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

  if (loading && employees.length === 0) {
    return (
      <div className="admin-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <Activity className="animate-spin" size={48} style={{ margin: '0 auto 16px', color: '#0284c7' }} />
          <h3>직원 대시보드를 로딩 중입니다...</h3>
          <p style={{ fontSize: '13px', marginTop: '8px' }}>데이터베이스 및 최근 활동 내역 집계 중</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <AdminHeader title="관리자 - 직원 대시보드" />
      
      <div className="admin-content" style={{ gap: '28px' }}>
        
        {/* ========================================================
            1. TOP CARDS (Mockup Design Aligned)
           ======================================================== */}
        <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          
          {/* Card 1: 전체 직원 수 */}
          <div className="admin-stat-card" style={{ padding: '24px 20px', borderLeft: '4px solid #1f2937' }}>
            <div className="admin-stat-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <Users size={16} style={{ color: '#4b5563' }} />
              전체 직원 수
            </div>
            <div className="admin-stat-value" style={{ fontSize: '36px', fontWeight: '800', marginTop: '12px', color: '#1f2937' }}>
              {val(metrics?.total_employees, "명")}
            </div>
            <div className="admin-stat-sub" style={{ marginTop: '8px', fontSize: '13px', color: '#3b82f6', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '2px' }}>
              {metrics?.total_employees_change
                ? <><ChevronUp size={14} />{metrics.total_employees_change}</>
                : <span style={{ color: '#9ca3af' }}>변동 정보 없음</span>
              }
            </div>
          </div>

          {/* Card 2: 현재 접속 직원 */}
          <div className="admin-stat-card" style={{ padding: '24px 20px', borderLeft: `4px solid ${esStatus === "오류" ? '#f59e0b' : '#10b981'}` }}>
            <div className="admin-stat-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <Activity size={16} style={{ color: esStatus === "오류" ? '#f59e0b' : '#10b981' }} />
              현재 접속 직원
            </div>
            <div className="admin-stat-value" style={{ 
              fontSize: esStatus === "오류" ? '26px' : '36px', 
              fontWeight: '800', 
              marginTop: esStatus === "오류" ? '20px' : '12px', 
              color: esStatus === "오류" ? '#ef4444' : '#1f2937' 
            }}>
              {esStatus === "오류" ? "연결 끊김" : val(metrics?.active_employees, "명")}
            </div>
            <div className="admin-stat-sub" style={{ marginTop: '8px', fontSize: '13px', color: esStatus === "오류" ? '#ef4444' : '#10b981', fontWeight: '600' }}>
              {esStatus === "오류"
                ? "실시간 집계 불가 (ES 확인)"
                : (metrics?.active_employees_sub ?? <span style={{ color: '#9ca3af' }}>-</span>)
              }
            </div>
          </div>

          {/* Card 3: 이번 달 AI TODO 승인 건수 */}
          <div className="admin-stat-card" style={{ padding: '24px 20px', borderLeft: `4px solid ${esStatus === "오류" ? '#9ca3af' : '#4f46e5'}` }}>
            <div className="admin-stat-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <CheckSquare size={16} style={{ color: esStatus === "오류" ? '#9ca3af' : '#4f46e5' }} />
              이번 달 AI TODO 승인 건수
            </div>
            <div className="admin-stat-value" style={{ 
              fontSize: esStatus === "오류" ? '26px' : '36px', 
              fontWeight: '800', 
              marginTop: esStatus === "오류" ? '20px' : '12px', 
              color: esStatus === "오류" ? '#ef4444' : '#1f2937' 
            }}>
              {esStatus === "오류" ? "연결 끊김" : val(metrics?.todo_approved_month, "건")}
            </div>
            <div className="admin-stat-sub" style={{ marginTop: '8px', fontSize: '13px', color: esStatus === "오류" ? '#ef4444' : '#6b7280' }}>
              {esStatus === "오류"
                ? "실시간 집계 불가 (ES 확인)"
                : (metrics?.todo_approved_month_total != null
                    ? `전체 ${metrics.todo_approved_month_total}건 중`
                    : <span style={{ color: '#9ca3af' }}>전체 정보 없음</span>)
              }
            </div>
          </div>

          {/* Card 4: 오늘 AI TODO 승인 건수 */}
          <div className="admin-stat-card" style={{ padding: '24px 20px', borderLeft: `4px solid ${esStatus === "오류" ? '#9ca3af' : '#f59e0b'}` }}>
            <div className="admin-stat-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <Calendar size={16} style={{ color: esStatus === "오류" ? '#9ca3af' : '#f59e0b' }} />
              오늘 AI TODO 승인 건수
            </div>
            <div className="admin-stat-value" style={{ 
              fontSize: esStatus === "오류" ? '26px' : '36px', 
              fontWeight: '800', 
              marginTop: esStatus === "오류" ? '20px' : '12px', 
              color: esStatus === "오류" ? '#ef4444' : '#1f2937' 
            }}>
              {esStatus === "오류" ? "연결 끊김" : val(metrics?.todo_approved_today, "건")}
            </div>
            <div className="admin-stat-sub" style={{ marginTop: '8px', fontSize: '13px', color: esStatus === "오류" ? '#ef4444' : '#6b7280' }}>
              {esStatus === "오류"
                ? "실시간 집계 불가 (ES 확인)"
                : (metrics?.todo_approved_today_total != null
                    ? `전체 ${metrics.todo_approved_today_total}건`
                    : <span style={{ color: '#9ca3af' }}>전체 정보 없음</span>)
              }
            </div>
          </div>

        </div>

        {/* ========================================================
            2. CHARTS SECTION (Bar and Line Chart)
           ======================================================== */}
        <div className="admin-charts-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
          {/* 지점별 접속률 */}
          <div className="admin-chart-card" style={{ padding: '24px', position: 'relative' }}>
            <h3 className="admin-chart-title" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>지점별 접속률</h3>
            {esStatus === "오류" ? (
              <div style={{ height: "240px", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px dashed #e5e7eb', textAlign: 'center', padding: '10px' }}>
                <ShieldAlert size={32} style={{ color: '#ef4444', marginBottom: '10px' }} />
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>Elasticsearch 연결 오프라인</span>
                <span style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>실시간 지점별 접속률 집계 불가</span>
              </div>
            ) : deptData.length === 0 ? (
              <div style={{ height: "240px", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px dashed #e5e7eb', textAlign: 'center', padding: '10px' }}>
                <span style={{ fontSize: '13px', color: '#9ca3af' }}>데이터가 없습니다</span>
              </div>
            ) : (
              <div style={{ height: "240px", width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptData} barSize={48}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis axisLine={false} tickLine={false} domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} tickFormatter={(val) => `${val}%`} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip 
                      cursor={{fill: 'rgba(243, 244, 246, 0.3)'}}
                      contentStyle={{ background: '#333', border: 'none', borderRadius: '6px', color: '#fff', fontSize: 12 }}
                    />
                    <Bar dataKey="value" fill="#d0e1fd" radius={[6, 6, 0, 0]}>
                      {deptData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? "#0284c7" : "#a8cafd"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* 주간 접속률 추이 */}
          <div className="admin-chart-card" style={{ padding: '24px', position: 'relative' }}>
            <h3 className="admin-chart-title" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>주간 접속률 추이</h3>
            {esStatus === "오류" ? (
              <div style={{ height: "240px", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px dashed #e5e7eb', textAlign: 'center', padding: '10px' }}>
                <ShieldAlert size={32} style={{ color: '#ef4444', marginBottom: '10px' }} />
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>Elasticsearch 연결 오프라인</span>
                <span style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>주간 접속률 추이 조회 불가</span>
              </div>
            ) : trendData.length === 0 ? (
              <div style={{ height: "240px", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px dashed #e5e7eb', textAlign: 'center', padding: '10px' }}>
                <span style={{ fontSize: '13px', color: '#9ca3af' }}>데이터가 없습니다</span>
              </div>
            ) : (
              <div style={{ height: "240px", width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis axisLine={false} tickLine={false} domain={[50, 90]} ticks={[50, 55, 60, 65, 70, 75, 80, 85, 90]} tickFormatter={(val) => `${val}%`} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: 12 }} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={3} 
                      dot={{ r: 5, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

        </div>

        {/* ========================================================
            3. TABLES SECTION (Employee Status & Activity Logs)
           ======================================================== */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'stretch' }}>
          
          {/* Left Table: 직원 현황 */}
          <div className="admin-chart-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px' }}>
            <h3 className="admin-chart-title" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>직원 현황</h3>
            {employees.length === 0 ? (
              <div style={{ flex: 1, minHeight: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#9ca3af' }}>직원 데이터가 없습니다</span>
              </div>
            ) : (
              <div className="admin-scrollable-container" style={{ flex: 1 }}>
                <table className="admin-list-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#4b5563', borderBottom: '1px solid #e5e7eb' }}>사번</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#4b5563', borderBottom: '1px solid #e5e7eb' }}>이름</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#4b5563', borderBottom: '1px solid #e5e7eb' }}>지점</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#4b5563', borderBottom: '1px solid #e5e7eb' }}>이메일</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#4b5563', borderBottom: '1px solid #e5e7eb' }}>접속 상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background-color 0.2s' }}>
                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#6b7280' }}>{emp.id ?? "-"}</td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '500', color: '#1f2937' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {emp.name ? (
                              <>
                                <div style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  ...getAvatarStyleByBranch(emp.branch)
                                }}>
                                  {emp.name.charAt(0)}
                                </div>
                                <span style={{ fontWeight: '600', whiteSpace: 'nowrap' }}>{emp.name}</span>
                              </>
                            ) : (
                              <span style={{ color: '#9ca3af' }}>-</span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#4b5563' }}>{emp.branch ?? "-"}</td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#6b7280' }}>{emp.email ?? "-"}</td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', textAlign: 'center', fontWeight: '700' }}>
                          {emp.status ? (
                            <span style={{ color: emp.statusClass === 'status-online' ? '#10b981' : '#f43f5e', whiteSpace: 'nowrap' }}>
                              {emp.status}
                            </span>
                          ) : (
                            <span style={{ color: '#9ca3af' }}>-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right Table: 최근 활동 로그 */}
          <div className="admin-chart-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px', position: 'relative' }}>
            <h3 className="admin-chart-title" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>최근 활동 로그</h3>
            {esStatus === "오류" ? (
              <div style={{ flex: 1, minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px dashed #e5e7eb', textAlign: 'center', padding: '10px' }}>
                <ShieldAlert size={36} style={{ color: '#ef4444', marginBottom: '12px' }} />
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>Elasticsearch 연결 오프라인</span>
                <span style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>최근 활동 로그 조회 불가</span>
              </div>
            ) : activities.length === 0 ? (
              <div style={{ flex: 1, minHeight: '260px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#9ca3af' }}>활동 로그가 없습니다</span>
              </div>
            ) : (
              <div className="admin-scrollable-container" style={{ flex: 1 }}>
                <table className="admin-list-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#4b5563', borderBottom: '1px solid #e5e7eb' }}>시간</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#4b5563', borderBottom: '1px solid #e5e7eb' }}>이름</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#4b5563', borderBottom: '1px solid #e5e7eb' }}>지점</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#4b5563', borderBottom: '1px solid #e5e7eb' }}>기능</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((act, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background-color 0.2s' }}>
                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#6b7280' }}>{act.time ?? "-"}</td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '500', color: '#1f2937' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {act.name ? (
                              <>
                                <div style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  ...getAvatarStyleByBranch(act.branch)
                                }}>
                                  {act.name.charAt(0)}
                                </div>
                                <span style={{ fontWeight: '600' }}>{act.name}</span>
                              </>
                            ) : (
                              <span style={{ color: '#9ca3af' }}>-</span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#4b5563' }}>{act.branch ?? "-"}</td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '500', color: '#1f2937' }}>
                          {act.feature ? (
                            <span style={{
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '600',
                              backgroundColor: act.feature === '뉴스 아카이브' ? '#ecfdf5' : (act.feature === 'AI TODO' ? '#eff6ff' : (act.feature === '고객 관리' ? '#fdf2f8' : '#fff7ed')),
                              color: act.feature === '뉴스 아카이브' ? '#059669' : (act.feature === 'AI TODO' ? '#2563eb' : (act.feature === '고객 관리' ? '#db2777' : '#d97706'))
                            }}>
                              {act.feature}
                            </span>
                          ) : (
                            <span style={{ color: '#9ca3af' }}>-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
