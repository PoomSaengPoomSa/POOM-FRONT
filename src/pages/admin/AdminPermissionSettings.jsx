import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, Search, X } from "lucide-react";
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
  const [employeeData, setEmployeeData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [availableReplacements, setAvailableReplacements] = useState([]);
  const [sortConfig, setSortConfig] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(2);
  const [selectedReplacement, setSelectedReplacement] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState("전체지점");
  const [showToast, setShowToast] = useState(false);
  const [currentCustomerList, setCurrentCustomerList] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState(new Set());
  const [transferEmp, setTransferEmp] = useState(null);
  const [targetBranch, setTargetBranch] = useState("압구정 지점");
  const [loading, setLoading] = useState(true);

  // Load employees and handover logs from database
  const loadData = async () => {
    setLoading(true);
    try {
      const [permData, handData] = await Promise.all([
        api.admin.getPermissions(searchTerm, branchFilter === "전체지점" ? "" : branchFilter),
        api.admin.getHandovers()
      ]);
      if (permData && permData.employees) {
        setEmployeeData(permData.employees);
      }
      if (handData && handData.handovers) {
        setHistoryData(handData.handovers);
      }
    } catch (err) {
      console.error("Failed to load permissions and handovers:", err);
    } finally {
      setLoading(false);
    }
  };

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
    loadData();
  }, [searchTerm, branchFilter]);

  const handleTransferClick = async (emp) => {
    setTransferEmp(emp);

    // Set target branch if pending
    let initialTarget = "강남 지점";
    if (emp.branchNote && emp.branchNote.includes("→")) {
      const parts = emp.branchNote.split("→");
      initialTarget = parts[1].trim() + " 지점";
    } else {
      initialTarget = "압구정 지점"; // 기본값
    }
    setTargetBranch(initialTarget);

    setLoading(true);
    try {
      // 1. 인수 가능 직원 조회 (동일 지점)
      const receiversData = await api.admin.getAvailableReceivers(emp.id);
      let replacements = [];
      if (receiversData && receiversData.receivers) {
        replacements = receiversData.receivers;
      }
      setAvailableReplacements(replacements);
      setSelectedReplacement(replacements.length > 0 ? replacements[0].id : "");

      // 2. 담당 고객 목록 조회
      const customersData = await api.admin.getEmployeeCustomers(emp.id);
      let newCustomers = [];
      if (customersData && customersData.customers) {
        newCustomers = customersData.customers;
      }

      setCurrentCustomerList(newCustomers);
      setSelectedCustomers(new Set(newCustomers.map(c => c.id)));

      setModalStep(2);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to prepare transfer modal:", err);
      alert("인수인계 정보 로드에 실패했습니다.");
    } finally {
      setLoading(false);
    }
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

  // Perform actual DB-backed personnel transfer
  const handleComplete = async () => {
    if (!transferEmp) return;

    // 지점 명칭 -> DB b_id 매핑
    const branchMapping = {
      "강남 지점": 1,
      "강남지점": 1,
      "여의도 지점": 2,
      "여의도지점": 2,
      "압구정 지점": 3,
      "압구정지점": 3,
      "서초 지점": 4,
      "서초지점": 4
    };

    const targetBranchId = branchMapping[targetBranch] || 3;

    const payload = {
      receiver_u_id: selectedReplacement,
      customer_ids: Array.from(selectedCustomers).map(id => parseInt(id)),
      target_branch: targetBranchId
    };

    setLoading(true);
    try {
      const response = await api.admin.transferCustomers(transferEmp.id, payload);
      if (response && response.success) {
        setIsModalOpen(false);
        setShowToast(true);
        // Refresh logs and accounts list from database
        await loadData();
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      }
    } catch (err) {
      console.error("Failed to complete transfer:", err);
      alert(err.message || "이관 처리에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const replacementEmp = availableReplacements.find(e => e.id === selectedReplacement);
  const replacementName = replacementEmp ? replacementEmp.name : "";

  const sortedEmployees = React.useMemo(() => {
    let sortableItems = [...employeeData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aVal, bVal;
        if (sortConfig.key === 'id') {
          aVal = parseInt(a.id) || 0;
          bVal = parseInt(b.id) || 0;
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
              <span style={{ fontSize: '13px', color: '#0284c7', fontWeight: 500 }}>
                {loading ? "조회 중..." : `총 직원수 ${employeeData.length}명`}
              </span>
            </div>

            <div className="admin-scrollable-container">
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
                  {loading && employeeData.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>직원 목록을 로드하는 중입니다...</td>
                    </tr>
                  ) : employeeData.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>해당하는 직원이 없습니다.</td>
                    </tr>
                  ) : (
                    sortedEmployees.filter(emp => {
                      const matchSearch = emp.name.includes(searchTerm) || emp.id.includes(searchTerm);
                      const matchBranch = branchFilter === '전체지점' || emp.branch.includes(branchFilter.replace('지점', ''));
                      return matchSearch && matchBranch;
                    }).map((emp, i) => (
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="permission-sidebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937' }}>🕒 인수인계 이력</span>
          </div>

          <div className="history-list">
            {loading && historyData.length === 0 ? (
              <div style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: '20px' }}>이력을 불러오는 중...</div>
            ) : historyData.length === 0 ? (
              <div style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: '20px' }}>이력이 존재하지 않습니다.</div>
            ) : (
              historyData.map((log, i) => (
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
              ))
            )}
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
                  {availableReplacements.map(emp => (
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
                        <span className="replacement-clients">{emp.clients}</span>
                      </div>
                    </div>
                  ))}
                  {availableReplacements.length === 0 && (
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
                <button className="btn-next" disabled={modalStep === 2 && availableReplacements.length === 0} onClick={handleNextStep}>다음</button>
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
