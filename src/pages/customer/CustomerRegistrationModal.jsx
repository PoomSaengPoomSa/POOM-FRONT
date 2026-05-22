import { X, Calendar as CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";

const formatDateForInput = (dateStr) => {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  
  if (dateStr.includes(".")) {
    const parts = dateStr.split(".").map(p => p.trim());
    if (parts.length >= 3) {
      const yyyy = parts[0];
      const mm = parts[1].padStart(2, "0");
      const dd = parts[2].padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
  }
  
  if (dateStr.includes("/")) {
    const parts = dateStr.split("/").map(p => p.trim());
    if (parts.length >= 3) {
      const dd = parts[0].padStart(2, "0");
      const mm = parts[1].padStart(2, "0");
      const yyyy = parts[2];
      return `${yyyy}-${mm}-${dd}`;
    }
  }
  
  return dateStr;
};

const formatDateForSave = (dateStr) => {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [yyyy, mm, dd] = dateStr.split("-");
    return `${yyyy}.${mm}.${dd}`;
  }
  return dateStr;
};

const formatDob = (value) => {
  const nums = value.replace(/[^0-9]/g, "");
  if (nums.length <= 4) {
    return nums;
  }
  if (nums.length <= 6) {
    return `${nums.slice(0, 4)}-${nums.slice(4)}`;
  }
  return `${nums.slice(0, 4)}-${nums.slice(4, 6)}-${nums.slice(6, 8)}`;
};

const formatPhone = (value) => {
  const nums = value.replace(/[^0-9]/g, "");
  if (nums.length <= 3) {
    return nums;
  }
  if (nums.length <= 7) {
    return `${nums.slice(0, 3)}-${nums.slice(3)}`;
  }
  return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7, 11)}`;
};

export default function CustomerRegistrationModal({ isOpen, onClose, initialData, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    phone: "",
    email: "",
    gender: "M",
    job: "",
    grade: "일반",
    address: "",
    investment_type: "위험중립형"
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        dob: formatDateForInput(initialData.birthday || initialData.dob || ""),
        phone: initialData.phone || initialData.number || "",
        email: initialData.email || "",
        gender: initialData.gender || "M",
        job: initialData.job || "",
        grade: initialData.grade || initialData.vipStatus || "일반",
        address: initialData.address || "",
        investment_type: initialData.tendency || initialData.investment_type || "위험중립형"
      });
    } else {
      setFormData({
        name: "",
        dob: "",
        phone: "",
        email: "",
        gender: "M",
        job: "",
        grade: "일반",
        address: "",
        investment_type: "위험중립형"
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
    if (!formData.name || !formData.dob) {
      alert("필수 입력 항목(*)을 입력해 주세요.");
      return;
    }
    if (onSave) {
      onSave({
        ...formData,
        dob: formatDateForSave(formData.dob)
      });
    }
  };

  return (
    <div className="cust-modal-overlay">
      <style>{`
        .cust-form-input-date {
          position: relative;
        }
        .cust-form-input-date::-webkit-calendar-picker-indicator {
          background: transparent;
          bottom: 0;
          color: transparent;
          cursor: pointer;
          height: auto;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          width: auto;
        }
      `}</style>
      <div className="cust-modal" style={{ width: 520, maxContent: 'fit-content' }}>
        <button className="cust-modal-close" onClick={onClose} style={{ border: 'none', background: '#e0f2fe', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <X size={16} color="#0284c7" />
        </button>
        <h2 className="cust-modal-title" style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>
          {initialData ? '고객 정보 수정' : '신규 고객 등록'}
        </h2>

        <div className="cust-modal-content" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* 기본 인적 정보 Section */}
          <div>
            <div className="cust-form-section-title" style={{ fontSize: 14, fontWeight: 700, color: '#0284c7', marginBottom: 16 }}>기본 인적 정보</div>
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
                <label className="cust-form-label" style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>성별 <span style={{ color: '#ef4444' }}>*</span></label>
                <select 
                  className="cust-form-input" 
                  style={{ width: '100%', appearance: 'auto', paddingRight: 24 }}
                  value={formData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                >
                  <option value="M">남성</option>
                  <option value="F">여성</option>
                </select>
              </div>
              <div className="cust-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label className="cust-form-label" style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>생년월일 <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    className="cust-form-input" 
                    style={{ width: '100%', boxSizing: 'border-box', paddingRight: '40px' }}
                    placeholder="예: 1980-01-01" 
                    maxLength={10}
                    value={formData.dob}
                    onChange={(e) => {
                      const formatted = formatDob(e.target.value);
                      handleChange("dob", formatted);
                    }}
                  />
                  <div style={{ position: 'absolute', right: 12, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <CalendarIcon size={16} color="#0284c7" style={{ pointerEvents: 'none' }} />
                    <input 
                      type="date" 
                      style={{
                        position: 'absolute',
                        top: -8,
                        left: -8,
                        right: -8,
                        bottom: -8,
                        opacity: 0,
                        cursor: 'pointer',
                        width: 32,
                        height: 32,
                      }}
                      value={/^\d{4}-\d{2}-\d{2}$/.test(formData.dob) ? formData.dob : ""}
                      onChange={(e) => {
                        if (e.target.value) {
                          handleChange("dob", e.target.value);
                        }
                      }}
                      onClick={(e) => e.target.showPicker && e.target.showPicker()}
                    />
                  </div>
                </div>
              </div>
              <div className="cust-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label className="cust-form-label" style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>전화번호</label>
                <input 
                  type="text" 
                  className="cust-form-input" 
                  placeholder="010-0000-0000" 
                  maxLength={13}
                  value={formData.phone}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);
                    handleChange("phone", formatted);
                  }}
                />
              </div>
              <div className="cust-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: 'span 2' }}>
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

          {/* 투자 및 주소 정보 Section */}
          <div>
            <div className="cust-form-section-title" style={{ fontSize: 14, fontWeight: 700, color: '#0284c7', marginBottom: 16 }}>투자 및 주소 정보</div>
            <div className="cust-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 0 }}>
              <div className="cust-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label className="cust-form-label" style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>직업</label>
                <input 
                  type="text" 
                  className="cust-form-input" 
                  placeholder="예: 회사원, 자영업자" 
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
                  <option value="일반">일반</option>
                  <option value="VIP">VIP</option>
                  <option value="VVIP">VVIP</option>
                </select>
              </div>
              <div className="cust-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label className="cust-form-label" style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>주소</label>
                <input 
                  type="text" 
                  className="cust-form-input" 
                  placeholder="예: 서울시 강남구" 
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              </div>
              <div className="cust-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label className="cust-form-label" style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>투자 성향</label>
                <select 
                  className="cust-form-input" 
                  style={{ width: '100%', appearance: 'auto', paddingRight: 24 }}
                  value={formData.investment_type}
                  onChange={(e) => handleChange("investment_type", e.target.value)}
                >
                  <option value="공격투자형">공격투자형</option>
                  <option value="적극투자형">적극투자형</option>
                  <option value="위험중립형">위험중립형</option>
                  <option value="안정추구형">안정추구형</option>
                  <option value="안정형">안정형</option>
                </select>
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
