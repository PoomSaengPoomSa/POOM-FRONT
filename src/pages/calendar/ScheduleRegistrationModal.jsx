import { useState } from "react";
import { X, Calendar as CalendarIcon, Search } from "lucide-react";
import "./CalendarNew.css";

export default function ScheduleRegistrationModal({ isOpen, onClose }) {
  const [category, setCategory] = useState("상담");
  const [color, setColor] = useState("blue");

  if (!isOpen) return null;

  return (
    <div className="cal-modal-overlay">
      <div className="cal-modal">
        <button className="cal-modal-close" onClick={onClose}><X size={16} /></button>
        <h2 className="cal-modal-title">일정 등록</h2>

        <div className="cal-modal-content">
          <div className="cal-form-section-title">일정 정보</div>
          
          <div className="cal-form-group">
            <label className="cal-form-label">카테고리 <span className="req">*</span></label>
            <div className="cal-category-tabs">
              <button 
                className={`cal-category-tab ${category === "상담" ? "active" : ""}`}
                onClick={() => setCategory("상담")}
              >상담</button>
              <button 
                className={`cal-category-tab ${category === "개인" ? "active" : ""}`}
                onClick={() => setCategory("개인")}
              >개인</button>
              <button 
                className={`cal-category-tab ${category === "공지" ? "active" : ""}`}
                onClick={() => setCategory("공지")}
              >공지</button>
            </div>
          </div>

          <div className="cal-form-group">
            <label className="cal-form-label">내용 <span className="req">*</span></label>
            <input type="text" className="cal-form-input" placeholder="일정 내용을 입력하세요" />
          </div>

          <div className="cal-form-grid">
            <div className="cal-form-group">
              <label className="cal-form-label">시작 일시 <span className="req">*</span></label>
              <div className="cal-input-icon-wrap">
                <input type="text" className="cal-form-input" placeholder="12/05/2026 09:00" />
                <CalendarIcon size={16} className="cal-input-icon" />
              </div>
            </div>
            <div className="cal-form-group">
              <label className="cal-form-label">종료 일시 <span className="req">*</span></label>
              <div className="cal-input-icon-wrap">
                <input type="text" className="cal-form-input" placeholder="12/05/2026 10:00" />
                <CalendarIcon size={16} className="cal-input-icon" />
              </div>
            </div>
          </div>

          <div className="cal-form-section-title" style={{ marginTop: 24 }}>고객 정보</div>

          <div className="cal-form-group">
            <label className="cal-form-label">고객 선택</label>
            <div className="cal-input-icon-wrap">
              <input type="text" className="cal-form-input" placeholder="고객명 또는 연락처 검색" />
              <Search size={16} className="cal-input-icon search" />
            </div>
          </div>

          <div className="cal-form-group">
            <label className="cal-form-label">색상</label>
            <div className="cal-color-picker">
              {['yellow', 'blue', 'pink', 'purple', 'lightblue', 'orange'].map(c => (
                <div 
                  key={c}
                  className={`cal-color-circle bg-${c} ${color === c ? 'active' : ''}`}
                  onClick={() => setColor(c)}
                ></div>
              ))}
            </div>
          </div>

          <div className="cal-form-group" style={{ marginBottom: 0 }}>
            <label className="cal-form-label">메모</label>
            <textarea className="cal-form-textarea" placeholder="추가 메모를 입력하세요"></textarea>
          </div>
        </div>

        <div className="cal-modal-actions">
          <button className="cal-btn cal-btn-outline" onClick={onClose}>취소</button>
          <button className="cal-btn cal-btn-primary">저장</button>
        </div>
      </div>
    </div>
  );
}
