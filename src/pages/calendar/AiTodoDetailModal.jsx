import React from 'react';
import { useCalendar } from './CalendarContext';
import { LogOut, Clock, Gift, Flag, Heart, Sparkles, TrendingUp } from 'lucide-react';
import './CalendarNew.css';

export default function AiTodoDetailModal({ isOpen, onClose }) {
  const { aiTodos, toggleAiTodo, transferCheckedAiTodos, selectedDate, showToast } = useCalendar();

  if (!isOpen) return null;

  // 그룹 목록 정의 (순서 보장)
  const groupOrder = ['상담 일정 제안', '안부 연락 제안', '신규 상품 분석', 'KPI 목표 달성'];

  // 그룹별 데이터 분류
  const groupedTodos = groupOrder.reduce((acc, group) => {
    acc[group] = aiTodos.filter(todo => todo.group === group);
    return acc;
  }, {});

  // 아이콘 렌더링 헬퍼
  const renderTodoIcon = (todo) => {
    const iconSize = 18;
    switch (todo.id) {
      case 1: // 김민지
        return (
          <div className="detail-icon-wrapper" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
            <Clock size={iconSize} />
          </div>
        );
      case 2: // 이광수
        return (
          <div className="detail-icon-wrapper" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
            <Clock size={iconSize} />
          </div>
        );
      case 3: // 강동원
        return (
          <div className="detail-icon-wrapper" style={{ backgroundColor: '#f3e8ff', color: '#6b21a8' }}>
            <Gift size={iconSize} />
          </div>
        );
      case 4: // 김종현
        return (
          <div className="detail-icon-wrapper" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
            <Flag size={iconSize} />
          </div>
        );
      case 5: // 김재원
        return (
          <div className="detail-icon-wrapper" style={{ backgroundColor: '#f1f5f9', color: '#334155' }}>
            <Heart size={iconSize} />
          </div>
        );
      case 6: // 우리 사장님 성장 적금
        return (
          <div className="detail-icon-wrapper" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <Sparkles size={iconSize} />
          </div>
        );
      case 7: // 안건호
        return (
          <div className="detail-icon-wrapper" style={{ backgroundColor: '#fce7f3', color: '#9d174d' }}>
            <TrendingUp size={iconSize} />
          </div>
        );
      default:
        return (
          <div className="detail-icon-wrapper" style={{ backgroundColor: '#e0f2fe', color: '#0ea5e9' }}>
            <Clock size={iconSize} />
          </div>
        );
    }
  };

  // 텍스트 타이틀 매핑 헬퍼 (이미지와 100% 동일하게 매칭)
  const getDisplayTitle = (todo) => {
    switch (todo.id) {
      case 1: return '김민지 고객 — 이탈 위험';
      case 2: return '이광수 고객 — 상담 제안';
      case 3: return '강동원 고객 — 배우자 생일';
      case 4: return '김종현 고객 — 예금만기 D-7';
      case 5: return '김재원 고객 — 결혼 기념일';
      case 6: return '신규 상품 — 우리 사장님 성장 적금';
      case 7: return '안건호 고객 - 고수수료 투자상품 라인업 제안';
      default: return todo.content;
    }
  };

  // 태그 스타일 헬퍼
  const getTagStyle = (tag) => {
    const redTags = ['이탈 위험 높음', '오늘', '연 2.0%'];
    const orangeTags = ['타행 신규 대출 확인', 'D-7', 'D-3'];
    const yellowTags = ['3개월 미상담'];
    const blueTags = ['가족 기념일', '본인 기념일', '12개월'];

    if (redTags.includes(tag)) {
      return { backgroundColor: '#fee2e2', color: '#ef4444' };
    } else if (orangeTags.includes(tag)) {
      return { backgroundColor: '#ffedd5', color: '#ea580c' };
    } else if (yellowTags.includes(tag)) {
      return { backgroundColor: '#fef3c7', color: '#d97706' };
    } else if (blueTags.includes(tag)) {
      return { backgroundColor: '#e0f2fe', color: '#0284c7' };
    }
    return { backgroundColor: '#f1f5f9', color: '#64748b' };
  };

  const handleTransfer = () => {
    const checkedCount = aiTodos.filter(t => t.checked).length;
    if (checkedCount === 0) {
      showToast('일정으로 추가할 할 일을 선택해주세요.');
      return;
    }
    transferCheckedAiTodos(selectedDate);
    onClose();
  };

  const activeTodoCount = aiTodos.length;

  return (
    <div className="ai-modal-overlay">
      <div className="ai-modal-container">
        
        {/* Header */}
        <div className="ai-modal-header">
          <div className="header-title-section">
            <span className="sparkle-emoji">✨</span>
            <h2 className="ai-modal-title">AI 맞춤형 To Do 제안</h2>
            {activeTodoCount > 0 && <span className="ai-todo-badge">{activeTodoCount}</span>}
          </div>
          <button className="ai-modal-close-btn" onClick={onClose} title="원래 화면으로 돌아가기">
            <span className="close-text">돌아가기</span>
            <LogOut size={18} className="logout-icon" />
          </button>
        </div>

        {/* Content */}
        <div className="ai-modal-body">
          {activeTodoCount === 0 ? (
            <div className="empty-ai-todo">
              <p>추천된 모든 AI To Do 일정을 My To Do로 이관하였습니다. 🎉</p>
            </div>
          ) : (
            groupOrder.map(group => {
              const items = groupedTodos[group];
              if (!items || items.length === 0) return null;

              return (
                <div className="ai-detail-group" key={group}>
                  <h3 className="ai-detail-group-title">{group}</h3>
                  <div className="ai-detail-card-list">
                    {items.map(todo => (
                      <div 
                        className={`ai-detail-card ${todo.checked ? 'selected' : ''}`} 
                        key={todo.id}
                        onClick={() => toggleAiTodo(todo.id)}
                      >
                        {/* Checkbox */}
                        <div className={`ai-detail-checkbox ${todo.checked ? 'checked' : ''}`}>
                          {todo.checked && <span className="checkmark">✓</span>}
                        </div>

                        {/* Icon */}
                        {renderTodoIcon(todo)}

                        {/* Text Content */}
                        <div className="ai-detail-info">
                          <div className="ai-detail-title">{getDisplayTitle(todo)}</div>
                          <div className="ai-detail-subtext">{todo.subText}</div>
                          
                          {/* Tags */}
                          {todo.tags && todo.tags.length > 0 && (
                            <div className="ai-detail-tags">
                              {todo.tags.map(tag => (
                                <span 
                                  className="ai-detail-tag" 
                                  key={tag} 
                                  style={getTagStyle(tag)}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        {activeTodoCount > 0 && (
          <div className="ai-modal-footer">
            <button className="ai-transfer-btn" onClick={handleTransfer}>
              선택한 {aiTodos.filter(t => t.checked).length}개 항목 My To Do 및 일정에 반영하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
