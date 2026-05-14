import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, TrendingUp, Users, Bell, Copy, LogOut, Settings } from "lucide-react";
import "./News.css";

const draftText = `안녕하세요 고객님.
오늘 증시는 긍정적인 뉴스 흐름이 이어졌습니다.

• 나스닥 역대 최고치 경신(+1.63%)
• 코스닥 25년 만의 1,200선 돌파
• KF-21 전투용 적합 판정으로 방산 산업 기대 확대

AI·반도체·방산 중심으로 투자심리가 개선되는 모습이며, 정책 안정 기대감도 시장에 우호적으로 작용하고 있습니다.

다만 단기 급등 구간에서는 추격 매수보다 포트폴리오 균형 점검이 중요한 시점입니다.
시장 대응 및 리밸런싱 관련 상담 필요하시면 편하게 연락 주세요.`;

export default function NewsBucketMessageDraft() {
  const location = useLocation();
  const path = location.pathname;

  const [text, setText] = useState(draftText);
  const [isEditing, setIsEditing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    });
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setText(draftText + "\n\n(AI 모델을 통해 새롭게 생성된 초안입니다.)");
      setIsRegenerating(false);
    }, 1500);
  };

  return (
    <div className="news-container">
      {/* Sidebar */}
      <div className="news-sidebar">
        <div className="news-logo">
          <div className="news-logo-circle"></div>
        </div>
        
        <div className="news-menu">
          <Link to="/calendar" className={`news-menu-item ${path === '/calendar' ? 'active' : ''}`}>
            <Calendar size={20} />
            캘린더
          </Link>
          <Link to="/trend-archive" className={`news-menu-item ${path.includes('/trend') ? 'active' : ''}`}>
            <TrendingUp size={20} />
            트렌드 아카이브
          </Link>
          <Link to="/pb/dashboard" className={`news-menu-item ${path === '/pb/dashboard' ? 'active' : ''}`}>
            <Users size={20} />
            고객관리
          </Link>
          <Link to="/news-bucket-bucket" className={`news-menu-item ${path.includes('/news-bucket') ? 'active' : ''}`}>
            <Bell size={20} />
            뉴스 버킷
          </Link>
          <Link to="/settings" className={`news-menu-item ${path.includes('/settings') ? 'active' : ''}`}>
            <Settings size={20} />
            설정
          </Link>
        </div>

        <div className="news-profile">
          <img src="https://i.pravatar.cc/150?img=11" alt="Profile" />
          <div className="news-profile-info">
            <span className="news-profile-name">김재욱</span>
            <span className="news-profile-role">Private Banker</span>
          </div>
          <LogOut onClick={() => window.location.href='/login-pb'} size={16} color="#94a3b8" style={{ marginLeft: 'auto', cursor: 'pointer' }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="news-main">
        
        <div className="news-content-card">
          <div className="news-page-title" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              버킷 <span className="news-page-subtitle">오늘의 메시지 뉴스 저장소</span>
            </div>
            <Link to="/news-archive" style={{ textDecoration: 'none' }}>
              <button style={{ padding: '8px 16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', color: '#64748b', cursor: 'pointer', fontWeight: '500' }}>
                뉴스 아카이브로 가기
              </button>
            </Link>
          </div>

          <div className="news-tabs">
            <Link to="/news-bucket-bucket" style={{ textDecoration: 'none' }}>
              <button className="news-tab">버킷</button>
            </Link>
            <button className="news-tab active">문자 초안</button>
          </div>

          <div className="news-stats-row">
            <div className="news-stat-box">
              <span className="news-stat-label">버킷 저장 수</span>
              <span className="news-stat-value">4</span>
              <span className="news-stat-sub">오늘의 메시지 용</span>
            </div>
            <div className="news-stat-box">
              <span className="news-stat-label">카테고리 수</span>
              <span className="news-stat-value">2</span>
              <span className="news-stat-sub">분류됨</span>
            </div>
            <div className="news-stat-box">
              <span className="news-stat-label">미저장 뉴스</span>
              <span className="news-stat-value">00</span>
              <span className="news-stat-sub">오늘 전체</span>
            </div>
            <div className="news-stat-box">
              <span className="news-stat-label">초안 상태</span>
              <span className="news-stat-value">완료</span>
              <span className="news-stat-sub">LLM 자동생성</span>
            </div>
          </div>

          <div className="news-editor-container">
            <div className="news-editor-label">AI 문자 초안</div>
            {isEditing ? (
              <textarea
                className="news-editor-content"
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '200px',
                  resize: 'vertical',
                  border: '1px solid #e2e8f0',
                  padding: '16px',
                  borderRadius: '8px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  backgroundColor: '#fff'
                }}
              />
            ) : (
              <div className="news-editor-content">
                {isRegenerating ? "초안 재생성 중..." : text}
              </div>
            )}
            {!isEditing && (
              <>
                {showToast && (
                  <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    right: '68px',
                    backgroundColor: '#3f3f46',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '24px',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}>
                    <div style={{ width: '16px', height: '16px', backgroundColor: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', fontWeight: 'bold' }}>✓</div>
                    클립보드에 복사되었습니다
                  </div>
                )}
                <Copy size={24} className="news-editor-copy" onClick={handleCopy} />
              </>
            )}
          </div>

          <div className="news-actions">
            <button 
              className="news-btn news-btn-primary" 
              onClick={handleRegenerate} 
              disabled={isRegenerating || isEditing}
            >
              {isRegenerating ? "생성 중..." : "다시 생성하기"}
            </button>
            <button 
              className="news-btn news-btn-primary" 
              onClick={() => setIsEditing(!isEditing)} 
              disabled={isRegenerating}
            >
              {isEditing ? "수정 완료" : "직접 수정하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
