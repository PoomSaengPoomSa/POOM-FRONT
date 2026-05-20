import { X, Calendar as CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";

export default function CustomerRegistrationModal({ isOpen, onClose, initialData, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    job: "",
    grade: "VIP",
    phone: "",
    email: "",
    startDate: "",
    nextVisit: ""
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        dob: "",
        job: initialData.job || "",
        grade: initialData.vipStatus || "VIP",
        phone: initialData.phone || "",
        email: initialData.email || "",
        startDate: initialData.gridData?.startDate || "",
        nextVisit: initialData.gridData?.nextVisit || ""
      });
    } else {
      setFormData({
        name: "",
        dob: "",
        job: "",
        grade: "VIP",
        phone: "",
        email: "",
        startDate: "",
        nextVisit: ""
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.job) {
      alert("필수 입력 항목(*)을 입력해 주세요.");
      return;
    }
    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <div className="cust-modal-overlay">
      <div className="cust-modal" style={{ width: 520, maxContent: 'fit-content' }}>
        <button className="cust-modal-close" onClick={onClose} style={{ border: 'none', background: '#e0f2fe', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <X size={16} color="#0284c7" />
        </button>
        <h2 className="cust-modal-title" style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>
          {initialData ? '고객 정보 수정' : '신규 고객 등록'}
        </h2>

        <div className="cust-modal-content" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* 기본 정보 Section */}
          <div>
            <div className="cust-form-section-title" style={{ fontSize: 14, fontWeight: 700, color: '#0284c7', marginBottom: 16 }}>기본 정보</div>
            <div className="cust-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="cust-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label className="cust-form-label" style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>이름 <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  type="text" 
                  className="cust-form-input" 
                  placeholder="예: 김OO" 
                  value={formData.name} 
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
              <div className="cust-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label className="cust-form-label" style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>생년월일 <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    className="cust-form-input" 
                    placeholder="dd/mm/yyyy" 
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    value={formData.dob}
                    onChange={(e) => handleChange("dob", e.target.value)}
                  />
                  <CalendarIcon size={16} color="#0284c7" style={{ position: 'absolute', right: 12, top: 12 }} />
                </div>
              </div>
              <div className="cust-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label className="cust-form-label" style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>직업 / 직책 <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  type="text" 
                  className="cust-form-input" 
                  placeholder="예: 중견기업 CEO" 
                  value={formData.job}
                  onChange={(e) => handleChange("job", e.target.value)}
                />
              </div>
              <div className="cust-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label className="cust-form-label" style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>등급</label>
                <select 
                  className="cust-form-input" 
                  style={{ width: '100%', appearance: 'auto', paddingRight: 24 }}
                  value={formData.grade}
                  onChange={(e) => handleChange("grade", e.target.value)}
                >
                  <option value="VIP">VIP</option>
                  <option value="일반">일반</option>
                  <option value="골드">골드</option>
                </select>
              </div>
              <div className="cust-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label className="cust-form-label" style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>연락처</label>
                <input 
                  type="text" 
                  className="cust-form-input" 
                  placeholder="010-0000-0000" 
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
              <div className="cust-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label className="cust-form-label" style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>이메일</label>
                <input 
                  type="text" 
                  className="cust-form-input" 
                  placeholder="example@email.com" 
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 방문 일정 Section */}
          <div>
            <div className="cust-form-section-title" style={{ fontSize: 14, fontWeight: 700, color: '#0284c7', marginBottom: 16 }}>방문 일정</div>
            <div className="cust-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 0 }}>
              <div className="cust-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label className="cust-form-label" style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>거래 시작일</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    className="cust-form-input" 
                    placeholder="dd/mm/yyyy" 
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    value={formData.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                  />
                  <CalendarIcon size={16} color="#0284c7" style={{ position: 'absolute', right: 12, top: 12 }} />
                </div>
              </div>
              <div className="cust-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label className="cust-form-label" style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>다음 방문 예정</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    className="cust-form-input" 
                    placeholder="dd/mm/yyyy" 
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    value={formData.nextVisit}
                    onChange={(e) => handleChange("nextVisit", e.target.value)}
                  />
                  <CalendarIcon size={16} color="#0284c7" style={{ position: 'absolute', right: 12, top: 12 }} />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="cust-modal-actions" style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 32 }}>
          <button 
            className="cust-btn cust-btn-outline" 
            style={{ 
              padding: '12px 32px', 
              borderRadius: 8, 
              border: '1px solid #cbd5e1', 
              background: 'white', 
              color: '#0284c7', 
              fontSize: 14, 
              fontWeight: 600, 
              cursor: 'pointer',
              transition: 'all 0.2s',
              minWidth: 100
            }} 
            onClick={onClose}
          >
            취소
          </button>
          <button 
            className="cust-btn cust-btn-primary" 
            style={{ 
              padding: '12px 32px', 
              borderRadius: 8, 
              border: 'none', 
              background: '#0284c7', 
              color: 'white', 
              fontSize: 14, 
              fontWeight: 600, 
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(2, 132, 199, 0.2)',
              transition: 'all 0.2s',
              minWidth: 100
            }} 
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
