import { useState } from "react";
import { X, Calendar as CalendarIcon, Search } from "lucide-react";
import "./CalendarNew.css";
import MiniCalendarPicker from "./MiniCalendarPicker";
import { useCalendar } from "./CalendarContext";

export default function ScheduleRegistrationModal({ isOpen, onClose }) {
  const { addEvent } = useCalendar();
  const [category, setCategory] = useState("상담");
  const [color, setColor] = useState("blue");
  
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [customer, setCustomer] = useState("");
  const [memo, setMemo] = useState("");
  const [errors, setErrors] = useState({ title: false, startDate: false, startTime: false, endDate: false, endTime: false });
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleDateSelect = (date, setter, isEnd = false) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const selectedStr = `${yyyy}/${mm}/${dd}`;
    
    if (isEnd && startDate) {
      if (new Date(selectedStr) < new Date(startDate)) {
        alert('종료일은 시작일보다 이전일 수 없습니다.');
        return;
      }
    } else if (!isEnd && endDate) {
      if (new Date(selectedStr) > new Date(endDate)) {
        alert('시작일은 종료일보다 이후일 수 없습니다.');
        return;
      }
    }
    
    setter(selectedStr);
  };

  if (!isOpen) {
    if (title || startDate || startTime || endDate || endTime || errors.title || errors.startDate || errors.startTime || errors.endDate || errors.endTime || showStartPicker || showEndPicker || customer || memo) {
      setTitle("");
      setStartDate("");
      setStartTime("");
      setEndDate("");
      setEndTime("");
      setCustomer("");
      setMemo("");
      setErrors({ title: false, startDate: false, startTime: false, endDate: false, endTime: false });
      setShowStartPicker(false);
      setShowEndPicker(false);
    }
    return null;
  }

  const handleSave = () => {
    const newErrors = {
      title: title.trim() === "",
      startDate: startDate.trim() === "",
      startTime: startTime.trim() === "",
      endDate: endDate.trim() === "",
      endTime: endTime.trim() === ""
    };
    
    setErrors(newErrors);
    
    if (!newErrors.title && !newErrors.startDate && !newErrors.startTime && !newErrors.endDate && !newErrors.endTime) {
      if (new Date(startDate) > new Date(endDate)) {
        alert('종료일은 시작일보다 이전일 수 없습니다.');
        return;
      }
      
      if (startDate === endDate && startTime >= endTime) {
        alert('종료 시간은 시작 시간보다 빠르거나 같을 수 없습니다.');
        return;
      }

      const startDateTime = new Date(`${startDate} ${startTime}`);
      const endDateTime = new Date(`${endDate} ${endTime}`);

      const isOverlap = events.some(e => {
        const eStart = new Date(e.startTime);
        const eEnd = new Date(e.endTime);
        return startDateTime < eEnd && endDateTime > eStart;
      });

      if (isOverlap) {
        alert('선택하신 시간에 이미 다른 일정이 존재합니다. 중복 등록할 수 없습니다.');
        return;
      }

      addEvent({
        title,
        startTime: `${startDate} ${startTime}`,
        endTime: `${endDate} ${endTime}`,
        category,
        color,
        customer,
        memo
      });
      onClose();
    }
  };

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
            <input 
              type="text" 
              className="cal-form-input" 
              placeholder="일정 내용을 입력하세요" 
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: false });
              }}
              style={errors.title ? { backgroundColor: '#fee2e2' } : {}}
            />
          </div>

          <div className="cal-form-grid" style={{ marginBottom: 16 }}>
            <div className="cal-form-group" style={{ marginBottom: 0 }}>
              <label className="cal-form-label">시작 일 <span className="req">*</span></label>
              <div className="cal-input-icon-wrap" style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="cal-form-input" 
                  placeholder="2026/05/12" 
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (errors.startDate) setErrors({ ...errors, startDate: false });
                  }}
                  style={errors.startDate ? { backgroundColor: '#fee2e2' } : {}}
                />
                <CalendarIcon size={16} className="cal-input-icon" style={{ cursor: 'pointer' }} onClick={() => setShowStartPicker(!showStartPicker)} />
                {showStartPicker && (
                  <MiniCalendarPicker 
                    onSelect={(d) => { handleDateSelect(d, setStartDate, false); setShowStartPicker(false); if (errors.startDate) setErrors({ ...errors, startDate: false }); }} 
                    onClose={() => setShowStartPicker(false)} 
                  />
                )}
              </div>
            </div>
            <div className="cal-form-group" style={{ marginBottom: 0 }}>
              <label className="cal-form-label">종료 일 <span className="req">*</span></label>
              <div className="cal-input-icon-wrap" style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="cal-form-input" 
                  placeholder="2026/05/12" 
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    if (errors.endDate) setErrors({ ...errors, endDate: false });
                  }}
                  style={errors.endDate ? { backgroundColor: '#fee2e2' } : {}}
                />
                <CalendarIcon size={16} className="cal-input-icon" style={{ cursor: 'pointer' }} onClick={() => setShowEndPicker(!showEndPicker)} />
                {showEndPicker && (
                  <MiniCalendarPicker 
                    alignRight={true}
                    onSelect={(d) => { handleDateSelect(d, setEndDate, true); setShowEndPicker(false); if (errors.endDate) setErrors({ ...errors, endDate: false }); }} 
                    onClose={() => setShowEndPicker(false)} 
                  />
                )}
              </div>
            </div>
          </div>

          <div className="cal-form-grid">
            <div className="cal-form-group">
              <label className="cal-form-label">시작 시간 <span className="req">*</span></label>
              <input 
                type="time" 
                className="cal-form-input" 
                value={startTime}
                onChange={(e) => {
                  const val = e.target.value;
                  setStartTime(val);
                  if (errors.startTime) setErrors({ ...errors, startTime: false });
                  if (val) {
                    const [h, m] = val.split(':');
                    const nextH = String((parseInt(h, 10) + 1) % 24).padStart(2, '0');
                    setEndTime(`${nextH}:${m}`);
                    if (errors.endTime) setErrors({ ...errors, endTime: false });
                  }
                }}
                style={errors.startTime ? { backgroundColor: '#fee2e2' } : {}}
              />
            </div>
            <div className="cal-form-group">
              <label className="cal-form-label">종료 시간 <span className="req">*</span></label>
              <input 
                type="time" 
                className="cal-form-input" 
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  if (errors.endTime) setErrors({ ...errors, endTime: false });
                }}
                style={errors.endTime ? { backgroundColor: '#fee2e2' } : {}}
              />
            </div>
          </div>

          <div className="cal-form-group" style={{ marginTop: 16 }}>
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

          <div className="cal-form-section-title" style={{ marginTop: 24 }}>고객 정보</div>

          <div className="cal-form-group">
            <label className="cal-form-label">고객 선택</label>
            <div className="cal-input-icon-wrap">
              <input type="text" className="cal-form-input" placeholder="고객명 또는 연락처 검색" value={customer} onChange={(e) => setCustomer(e.target.value)} />
              <Search size={16} className="cal-input-icon search" />
            </div>
          </div>

          <div className="cal-form-group" style={{ marginBottom: 0 }}>
            <label className="cal-form-label">메모</label>
            <textarea className="cal-form-textarea" placeholder="추가 메모를 입력하세요" value={memo} onChange={(e) => setMemo(e.target.value)}></textarea>
          </div>
        </div>

        <div className="cal-modal-actions">
          <button className="cal-btn cal-btn-outline" onClick={onClose}>취소</button>
          <button className="cal-btn cal-btn-primary" onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  );
}
