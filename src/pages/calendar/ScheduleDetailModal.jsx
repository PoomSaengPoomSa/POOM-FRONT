import { X } from "lucide-react";
import "./CalendarNew.css";

export default function ScheduleDetailModal({ isOpen, onClose, onEdit, event }) {
  if (!isOpen || !event) return null;

  return (
    <div className="cal-modal-overlay">
      <div className="cal-modal">
        <button className="cal-modal-close" onClick={onClose}><X size={16} /></button>
        <h2 className="cal-modal-title">일정 상세</h2>

        <div className="cal-modal-content">
          <div className="cal-form-section-title">일정 정보</div>
          
          <div className="cal-detail-group">
            <span className="cal-badge-blue">{event.category || "상담"}</span>
          </div>

          <div className="cal-detail-group">
            <label className="cal-detail-label">내용</label>
            <div className="cal-detail-value">{event.title}</div>
          </div>

          <div className="cal-form-grid" style={{ marginBottom: 24 }}>
            <div className="cal-detail-group" style={{ marginBottom: 0 }}>
              <label className="cal-detail-label">시작 일시</label>
              <div className="cal-detail-value">{event.startTime}</div>
            </div>
            <div className="cal-detail-group" style={{ marginBottom: 0 }}>
              <label className="cal-detail-label">종료 일시</label>
              <div className="cal-detail-value">{event.endTime}</div>
            </div>
          </div>

          {event.customer && (
            <>
              <div className="cal-form-section-title" style={{ marginTop: 24 }}>고객 정보</div>

              <div className="cal-detail-group">
                <label className="cal-detail-label">연결 고객</label>
                <div style={{ marginTop: 8 }}>
                  <span className="cal-badge-blue">{event.customer}</span>
                </div>
              </div>
            </>
          )}

          <div className="cal-detail-group">
            <label className="cal-detail-label">색상</label>
            <div className="cal-color-picker" style={{ marginTop: 8 }}>
              <div className={`cal-color-circle bg-${event.color || 'blue'} active`}></div>
            </div>
          </div>

          <div className="cal-detail-group" style={{ marginBottom: 0 }}>
            <label className="cal-detail-label">메모</label>
            <div className="cal-detail-value" style={{ marginTop: 8, whiteSpace: 'pre-line' }}>
              {event.memo || ""}
            </div>
          </div>
        </div>

        <div className="cal-modal-actions">
          <button className="cal-btn cal-btn-outline" onClick={onClose}>삭제</button>
          <button className="cal-btn cal-btn-primary" onClick={onEdit}>수정</button>
        </div>
      </div>
    </div>
  );
}
