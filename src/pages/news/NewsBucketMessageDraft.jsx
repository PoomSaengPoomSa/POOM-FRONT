import { Link, useLocation } from "react-router-dom";
import { Calendar, TrendingUp, Users, Bell, Copy, LogOut } from "lucide-react";
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
          <Link to="/news-bucket-message-draft" className={`news-menu-item ${path.includes('/news-bucket') ? 'active' : ''}`}>
            <Bell size={20} />
            뉴스 버킷
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
        <h1 className="news-header-title">뉴스 버킷 - 문자 초안</h1>
        
        <div className="news-content-card">
          <div className="news-page-title">
            버킷 <span className="news-page-subtitle">오늘의 메시지 뉴스 저장소</span>
          </div>

          <div className="news-tabs">
            <button className="news-tab">버킷</button>
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
            <div className="news-editor-content">
              {draftText}
            </div>
            <Copy size={24} className="news-editor-copy" />
          </div>

          <div className="news-actions">
            <button className="news-btn news-btn-primary">다시 생성하기</button>
            <button className="news-btn news-btn-primary">직접 수정하기</button>
          </div>
        </div>
      </div>
    </div>
  );
}
