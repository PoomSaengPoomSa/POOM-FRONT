import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, Search, X } from "lucide-react";
import "./Admin.css";

const employees = [
  { id: "100021", name: "이수현", branch: "강남지점", clients: "18명", pending: false },
  { id: "100089", name: "이종혁", branch: "강남지점", clients: "41명", pending: false },
  { id: "100088", name: "김수빈", branch: "여의도지점", clients: "19명", pending: false },
  { id: "100102", name: "이주리", branch: "강남지점", branchNote: "발령 대기 강남 → 압구정", clients: "5명", pending: true },
  { id: "100118", name: "유채린", branch: "여의도지점", clients: "32명", pending: false },
];

const historyLogs = [
  { id: "1", name: "김동환", title: "김동환 압구정 → 강남지점", desc: "고객 23명 → 조성은 2025.03.10" },
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
          <LogOut onClick={() => window.location.href = '/login'} size={20} className="admin-logout" />
        </div>
      </div>
    </div>
  );
};

export default function AdminPermissionSettings() {
  const [employeeData, setEmployeeData] = useState(employees);
  const [historyData, setHistoryData] = useState(historyLogs);
  const [sortConfig, setSortConfig] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(2);
  const [selectedReplacement, setSelectedReplacement] = useState('100021');
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('전체지점');
  const [showToast, setShowToast] = useState(false);
  const [currentCustomerList, setCurrentCustomerList] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState(new Set());
  const [transferEmp, setTransferEmp] = useState(null);
  const [targetBranch, setTargetBranch] = useState('압구정 지점');

  const isSameBranch = (e, targetBranchStr) => {
    if (!e || !targetBranchStr) return false;
    const nb1 = (e.branch || '').replace('지점', '');
    const nb2 = targetBranchStr.replace('지점', '');

    if (nb1.includes(nb2) || nb2.includes(nb1)) return true;

    // 발령 대기 중인 직원이 이동할 목적지 지점이 타겟 지점과 같다면 인수가능 직원에 포함
    if (e.branchNote && e.branchNote.includes(nb2)) {
      return true;
    }
    return false;
  };

  const handleTransferClick = (emp) => {
    setTransferEmp(emp);

    // Set target branch if pending
    let initialTarget = '강남 지점';
    if (emp.branchNote && emp.branchNote.includes('→')) {
      const parts = emp.branchNote.split('→');
      initialTarget = parts[1].trim() + ' 지점';
    }
    setTargetBranch(initialTarget);

    // Set available replacements
    const avail = employeeData.filter(e => e.id !== emp.id && isSameBranch(e, emp.branch));
    setSelectedReplacement(avail.length > 0 ? avail[0].id : '');

    // Generate mock customer list based on count
    const count = parseInt(emp.clients.replace('명', '')) || 0;
    const newCustomers = Array.from({ length: count }, (_, i) => ({
      id: `c${i + 1}`,
      name: `고객${i + 1}`,
      assets: ['VVIP · 자산 50억', 'VIP · 자산 12억', '일반 · 자산 5억', '일반 · 자산 1억'][i % 4]
    }));

    setCurrentCustomerList(newCustomers);
    setSelectedCustomers(new Set(newCustomers.map(c => c.id)));

    setModalStep(2);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNextStep = () => {
    setModalStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setModalStep(prev => prev - 1);
  };

  const toggleCustomer = (id) => {
    const newSet = new Set(selectedCustomers);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedCustomers(newSet);
  };

  const toggleAllCustomers = () => {
    if (selectedCustomers.size === currentCustomerList.length) {
      setSelectedCustomers(new Set());
    } else {
      setSelectedCustomers(new Set(currentCustomerList.map(c => c.id)));
    }
  };

  const handleComplete = () => {
    if (!transferEmp) return;

    const replacementEmpData = employeeData.find(e => e.id === selectedReplacement);
    const replacementName = replacementEmpData ? replacementEmpData.name : '';

    // Update employee list and history
    setEmployeeData(prev => prev.map(emp => {
      if (emp.id === transferEmp.id) {
        const oldClients = parseInt(emp.clients.replace('명', ''));
        const newClients = Math.max(0, oldClients - selectedCustomers.size);

        // 발령 완료(고객 수 0명) 시점에만 지점 변경 적용
        let newBranch = emp.branch;
        let isPending = emp.pending;
        if (newClients === 0) {
          newBranch = targetBranch.replace(' ', '');
          isPending = false;
        }

        return { ...emp, branch: newBranch, pending: isPending, clients: `${newClients}명` };
      }
      if (emp.id === selectedReplacement) {
        const oldClients = parseInt(emp.clients.replace('명', ''));
        const newClients = oldClients + selectedCustomers.size;
        return { ...emp, clients: `${newClients}명` };
      }
      return emp;
    }));

    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '.');
    const newHistory = {
      id: Date.now().toString(),
      name: transferEmp.name,
      title: `${transferEmp.name} ${transferEmp.branch.replace('지점', '')} → ${targetBranch.replace(' ', '')}`,
      desc: `고객 ${selectedCustomers.size}명 재배정 → ${replacementName} ${dateStr}`
    };
    setHistoryData(prev => [newHistory, ...prev]);

    setIsModalOpen(false);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const replacementEmp = employeeData.find(e => e.id === selectedReplacement);
  const replacementName = replacementEmp ? replacementEmp.name : '';

  const sortedEmployees = React.useMemo(() => {
    let sortableItems = [...employeeData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aVal, bVal;
        if (sortConfig.key === 'id') {
          aVal = parseInt(a.id);
          bVal = parseInt(b.id);
          if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        } else if (sortConfig.key === 'nameBranch') {
          aVal = a.name;
          bVal = b.name;
          return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        return 0;
      });
    }
    return sortableItems;
  }, [employeeData, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredEmployees = sortedEmployees.filter(emp => {
    const matchSearch = emp.name.includes(searchTerm) || emp.id.includes(searchTerm);
    const matchBranch = branchFilter === '전체지점' || emp.branch.includes(branchFilter.replace('지점', ''));
    return matchSearch && matchBranch;
  });

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: 48, width: '100%', boxSizing: 'border-box' }}
              />
            </div>
            <select
              className="search-select"
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
            >
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
                  <th style={{ textAlign: 'left', cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('id')}>
                    사번 {sortConfig?.key === 'id' && sortConfig.direction === 'desc' ? '▼' : '▲'}
                  </th>
                  <th style={{ textAlign: 'left', cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('nameBranch')}>
                    이름 / 지점 {sortConfig?.key === 'nameBranch' && sortConfig.direction === 'desc' ? '▼' : '▲'}
                  </th>
                  <th>담당 고객 수</th>
                  <th>발령 처리</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#f8fafc' : 'transparent', borderBottom: i % 2 === 0 ? 'none' : '1px solid var(--admin-border)' }}>
                    <td style={{ textAlign: 'left', color: '#6b7280', borderBottom: 'none' }}>{emp.id}</td>
                    <td style={{ textAlign: 'left', borderBottom: 'none' }}>
                      <div className="employee-name-cell" style={{ justifyContent: 'flex-start' }}>
                        <div className="employee-avatar" style={{
                          background: i === 0 ? '#fef3c7' :
                            i === 1 ? '#ede9fe' :
                              i === 2 ? '#fce7f3' :
                                i === 3 ? '#e2e8f0' : '#dbeafe',
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
                    <td style={{ borderBottom: 'none' }}>{emp.clients}</td>
                    <td style={{ borderBottom: 'none' }}>
                      <button className="btn-action" onClick={() => handleTransferClick(emp)}>발령처리</button>
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
            {historyData.map((log, i) => (
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

      {isModalOpen && transferEmp && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>발령 인수인계 __ {transferEmp.name} ({transferEmp.id})</h2>
              <button className="modal-close" onClick={closeModal}><X size={16} strokeWidth={3} /></button>
            </div>

            <div className="modal-progress">
              <div className={`progress-step ${modalStep >= 1 ? 'active' : ''}`}><span className="step-num">1</span> 발령 확인</div>
              <div className={`progress-line ${modalStep >= 2 ? 'active' : ''}`}></div>
              <div className={`progress-step ${modalStep >= 2 ? 'active' : ''}`}><span className="step-num">2</span> 인수자 지정</div>
              <div className={`progress-line ${modalStep >= 3 ? 'active' : ''}`}></div>
              <div className={`progress-step ${modalStep >= 3 ? 'active' : ''}`}><span className="step-num">3</span> 고객 재배정</div>
              <div className={`progress-line ${modalStep >= 4 ? 'active' : ''}`}></div>
              <div className={`progress-step ${modalStep >= 4 ? 'active' : ''}`}><span className="step-num">4</span> 지점 변경</div>
            </div>

            {modalStep === 2 && (
              <>
                <div className="modal-info-box">
                  <p>{transferEmp.name} PB는 {transferEmp.branch.replace('지점', '')}지점 → {targetBranch.replace(' ', '')} 발령 예정입니다.</p>
                  <p>담당 고객 {transferEmp.clients}을 인수받을 직원을 선택해주세요.</p>
                </div>

                <div className="modal-subtitle">인수 가능 직원 (같은 지점)</div>

                <div className="replacement-list">
                  {employeeData.filter(e => e.id !== transferEmp.id && isSameBranch(e, transferEmp.branch)).map(emp => (
                    <div
                      key={emp.id}
                      className={`replacement-item ${selectedReplacement === emp.id ? 'selected' : ''}`}
                      onClick={() => setSelectedReplacement(emp.id)}
                    >
                      <div className="employee-avatar" style={{ background: '#fef3c7', color: '#475569' }}>
                        {emp.name.charAt(0)}
                      </div>
                      <div className="replacement-info">
                        <span className="replacement-name">{emp.name}</span>
                        <span className="replacement-clients">현재 {emp.clients} 담당</span>
                      </div>
                    </div>
                  ))}
                  {employeeData.filter(e => e.id !== transferEmp.id && isSameBranch(e, transferEmp.branch)).length === 0 && (
                    <div style={{ color: '#9ca3af', fontSize: 14, textAlign: 'center', padding: '16px' }}>동일 지점에 인수가능한 직원이 없습니다.</div>
                  )}
                </div>
              </>
            )}

            {modalStep === 3 && (
              <>
                <div className="modal-info-box" style={{ background: '#f0fdf4', color: '#166534', border: 'none' }}>
                  <p style={{ color: '#166534', fontWeight: 500 }}>담당 고객 {selectedCustomers.size}명을 {replacementName}에게 재배정합니다. 개별 조정도 가능합니다.</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div className="modal-subtitle" style={{ marginBottom: 0 }}>담당 고객 목록</div>
                  <label style={{ fontSize: 12, color: '#0284c7', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={currentCustomerList.length > 0 && selectedCustomers.size === currentCustomerList.length}
                      onChange={toggleAllCustomers}
                      ref={el => {
                        if (el) el.indeterminate = selectedCustomers.size > 0 && selectedCustomers.size < currentCustomerList.length;
                      }}
                    /> 전체선택
                  </label>
                </div>

                <div className="customer-reassign-list">
                  {currentCustomerList.map(customer => (
                    <div
                      key={customer.id}
                      className={`customer-reassign-item ${selectedCustomers.has(customer.id) ? 'selected' : ''}`}
                      onClick={() => toggleCustomer(customer.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCustomers.has(customer.id)}
                        readOnly
                      />
                      <div className="customer-info">
                        <span className="customer-name">{customer.name}</span>
                        <span className="customer-assets">{customer.assets}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {modalStep === 4 && (
              <>
                <div className="modal-info-box" style={{ background: '#f0fdf4', color: '#166534', border: 'none' }}>
                  <p style={{ color: '#166534', fontWeight: 500 }}>고객 재배정 완료 — {replacementName}에게 {selectedCustomers.size}명 이전됨</p>
                </div>

                <div className="modal-subtitle" style={{ color: '#9ca3af' }}>발령 지점을 선택해주세요</div>

                <div className="branch-change-box">
                  <div className="branch-current">
                    <span className="branch-label">현재 지점</span>
                    <span className="branch-value">{transferEmp.branch.replace('지점', '')}지점</span>
                  </div>
                  <div className="branch-arrow">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="branch-new">
                    <select value={targetBranch} onChange={(e) => setTargetBranch(e.target.value)}>
                      <option>압구정 지점</option>
                      <option>여의도 지점</option>
                      <option>서초 지점</option>
                      <option>강남 지점</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="modal-footer" style={{ justifyContent: modalStep > 2 ? 'space-between' : 'flex-end' }}>
              {modalStep > 2 && (
                <button className="btn-prev" onClick={handlePrevStep}>이전</button>
              )}

              {modalStep < 4 ? (
                <button className="btn-next" onClick={handleNextStep}>다음</button>
              ) : (
                <button className="btn-next" onClick={handleComplete}>완료</button>
              )}
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="toast-notification">
          <div className="toast-icon">✓</div>
          <span>인수인계가 완료되었습니다</span>
        </div>
      )}
    </div>
  );
}
