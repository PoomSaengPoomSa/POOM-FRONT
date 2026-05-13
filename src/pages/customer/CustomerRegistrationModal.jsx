import { Camera, X, Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function CustomerRegistrationModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('기본 정보');
  if (!isOpen) return null;

  return (
    <div className="cust-modal-overlay">
      <div className="cust-modal">
        <button className="cust-modal-close" onClick={onClose}><X size={16} /></button>
        <h2 className="cust-modal-title">신규 고객 등록</h2>

        <div className="cust-modal-tabs">
          <button className={`cust-modal-tab ${activeTab === '기본 정보' ? 'active' : ''}`} onClick={() => setActiveTab('기본 정보')}>기본 정보</button>
          <button className={`cust-modal-tab ${activeTab === '자산·거래' ? 'active' : ''}`} onClick={() => setActiveTab('자산·거래')}>자산·거래</button>
        </div>

        <div className="cust-modal-content">
          {activeTab === '기본 정보' && (
            <>
              <div className="cust-modal-profile-upload">
                <div className="icon-box"><Camera size={20} /></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>프로필 사진 업로드</span>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>업로드 없으면 이니셜로 자동 표시됩니다</span>
                </div>
              </div>

              <div className="cust-form-section-title">기본 정보</div>
              <div className="cust-form-grid">
                <div className="cust-form-group">
                  <label className="cust-form-label">이름 <span className="req">*</span></label>
                  <input type="text" className="cust-form-input" placeholder="예: 김OO" />
                </div>
                <div className="cust-form-group">
                  <label className="cust-form-label">생년월일 <span className="req">*</span></label>
                  <div style={{ position: 'relative' }}>
                    <input type="text" className="cust-form-input" placeholder="dd/mm/yyyy" style={{ width: '100%', boxSizing: 'border-box' }} />
                    <CalendarIcon size={16} color="#0284c7" style={{ position: 'absolute', right: 12, top: 12 }} />
                  </div>
                </div>
                <div className="cust-form-group">
                  <label className="cust-form-label">직업 / 직책 <span className="req">*</span></label>
                  <input type="text" className="cust-form-input" placeholder="예: 중견기업 CEO" />
                </div>
                <div className="cust-form-group">
                  <label className="cust-form-label">등급</label>
                  <select className="cust-form-input" style={{ width: '100%', appearance: 'auto' }}>
                    <option></option>
                  </select>
                </div>
                <div className="cust-form-group">
                  <label className="cust-form-label">연락처</label>
                  <input type="text" className="cust-form-input" placeholder="010-0000-0000" />
                </div>
                <div className="cust-form-group">
                  <label className="cust-form-label">이메일</label>
                  <input type="text" className="cust-form-input" placeholder="example@email.com" />
                </div>
              </div>

              <div className="cust-form-section-title">방문 일정</div>
              <div className="cust-form-grid" style={{ marginBottom: 0 }}>
                <div className="cust-form-group">
                  <label className="cust-form-label">거래 시작일</label>
                  <div style={{ position: 'relative' }}>
                    <input type="text" className="cust-form-input" placeholder="dd/mm/yyyy" style={{ width: '100%', boxSizing: 'border-box' }} />
                    <CalendarIcon size={16} color="#0284c7" style={{ position: 'absolute', right: 12, top: 12 }} />
                  </div>
                </div>
                <div className="cust-form-group">
                  <label className="cust-form-label">다음 방문 예정</label>
                  <div style={{ position: 'relative' }}>
                    <input type="text" className="cust-form-input" placeholder="dd/mm/yyyy" style={{ width: '100%', boxSizing: 'border-box' }} />
                    <CalendarIcon size={16} color="#0284c7" style={{ position: 'absolute', right: 12, top: 12 }} />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === '자산·거래' && (
            <>
              <div className="cust-form-section-title">자산 정보</div>
              <div className="cust-form-grid">
                <div className="cust-form-group">
                  <label className="cust-form-label">총자산 <span className="req">*</span></label>
                  <input type="text" className="cust-form-input" placeholder="예: 32억" />
                </div>
                <div className="cust-form-group">
                  <label className="cust-form-label">투자 성향 <span className="req">*</span></label>
                  <select className="cust-form-input" style={{ width: '100%', appearance: 'auto' }}>
                    <option></option>
                  </select>
                </div>
              </div>

              <div className="cust-form-section-title">포트폴리오 비중 (%)</div>
              <div className="cust-form-grid">
                <div className="cust-form-group">
                  <label className="cust-form-label">국내주식</label>
                  <input type="text" className="cust-form-input" placeholder="0" />
                </div>
                <div className="cust-form-group">
                  <label className="cust-form-label">해외주식</label>
                  <input type="text" className="cust-form-input" placeholder="0" />
                </div>
                <div className="cust-form-group" style={{ marginBottom: 0 }}>
                  <label className="cust-form-label">채권</label>
                  <input type="text" className="cust-form-input" placeholder="0" />
                </div>
                <div className="cust-form-group" style={{ marginBottom: 0 }}>
                  <label className="cust-form-label">현금·기타</label>
                  <input type="text" className="cust-form-input" placeholder="0" />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="cust-modal-actions" style={{ justifyContent: 'center', gap: 16 }}>
          <button className="cust-btn cust-btn-outline" style={{ border: 'none', color: '#0284c7' }} onClick={onClose}>취소</button>
          <button className="cust-btn cust-btn-primary" onClick={() => {
            if (activeTab === '기본 정보') setActiveTab('자산·거래');
            else onClose();
          }}>
            {activeTab === '기본 정보' ? '다음' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
