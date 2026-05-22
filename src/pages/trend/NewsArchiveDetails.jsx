import { Link, useLocation } from "react-router-dom";
import { Calendar, TrendingUp, Users, Bell, LogOut, Search, MoreHorizontal, Calendar as CalendarIcon, Star, ChevronLeft, ChevronRight, X, Settings } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import "./Trend.css";

const archiveNews = [
  { id: 1, type: "경제", title: "셀트리온, 美 소화기학회서 자가면역질환 치료제 '램시마SC' 임상 데이터 공개", date: "12 Dec, 2020", color: "green" },
  { id: 2, type: "정치", title: "[속보] 국힘 \"후대통령 '비읍시옷' 발언 경악\"", date: "12 Dec, 2020", color: "pink" },
  { id: 3, type: "경제", title: "카카오, 1분기 영업익 2114억원...전년비 66%↑", date: "12 Dec, 2020", color: "green" },
  { id: 4, type: "경제", title: "HMM 나무호 예인선 도착...오늘 오전 중 작업 시작", date: "12 Dec, 2020", color: "green" },
  { id: 5, type: "정치", title: "국산 전투기 시대 열렸다...KF-21, 전투용 적합 판정", date: "12 Dec, 2020", color: "pink" },
  { id: 6, type: "IT/과학", title: "카카오, 에이전틱 AI 속도...\"카톡 내 탐색부터 결제까지\"", date: "12 Dec, 2020", color: "blue" },
  { id: 7, type: "경제", title: "삼성바이오 노사 갈등 격화...\"불법행위 엄정 대응\" vs \"억지 고소\"", date: "12 Dec, 2020", color: "green" },
];

export default function NewsArchiveDetails() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="trend-container" style={{ position: 'relative' }}>
      {/* Sidebar */}
      <Sidebar type="trend" />

      {/* Main Content (Blurred background) */}
      <div className="trend-main cust-blurred-content">

        <div className="trend-section-box" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <div className="trend-tabs" style={{ marginBottom: 0 }}>
              <button className="trend-tab active">전체</button>
              <button className="trend-tab" style={{ background: 'white', color: '#64748b' }}>경제</button>
              <button className="trend-tab" style={{ background: 'white', color: '#64748b' }}>정치</button>
              <button className="trend-tab" style={{ background: 'white', color: '#64748b' }}>IT/과학</button>
            </div>
            
            <div className="news-arch-search">
              <input type="text" placeholder="Search" />
              <Search size={14} color="#94a3b8" style={{ position: 'absolute', right: 12, top: 9 }} />
            </div>
          </div>

          <div className="news-arch-list">
            {archiveNews.map(item => (
              <div className="news-arch-item" key={item.id}>
                <span className={`news-arch-badge ${item.color}`}>{item.type}</span>
                <span className="news-arch-title">{item.title}</span>
                <div className="news-arch-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CalendarIcon size={14} color="#38bdf8" /> {item.date}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 'auto', paddingTop: 24 }}>
            <ChevronLeft size={16} color="#94a3b8" cursor="pointer" />
            <span style={{ fontSize: 14, fontWeight: 600 }}>1</span>
            <ChevronRight size={16} color="#94a3b8" cursor="pointer" />
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      <div className="cust-modal-overlay" style={{ left: 0 }}>
        <div className="news-arch-modal" style={{ left: '272px' }}>
          <div className="news-mod-header">
            <span className="news-arch-badge green" style={{ fontSize: 16, padding: '12px 24px' }}>경제</span>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }}>
              셀트리온, 美 소화기학회서 자가면역질환 치료제 '램시마SC' 임상 데이터 공개
            </h2>
            <Link to="/news-archive" style={{ marginLeft: 'auto' }}>
              <button className="news-mod-close"><X size={20} color="#64748b" /></button>
            </Link>
          </div>

          <div className="news-mod-content-wrap">
            <div className="news-mod-main">
              <p>
                셀트리온이 지난 2일부터 5일까지(이상 현지시간) 나흘간 미국 일리노이주 시카고에서 열린 '2026 미국소화기학회(DDW)'에 참가했다고 7일 밝혔다. 
                자가면역질환 치료제 'CT-P13 SC(램시마SC·미국 제품명 짐펜트라)'의 경쟁력을 알렸다.
              </p>
              <p>
                DDW는 소화기학, 간장학, 내시경 등 소화기 질환 분야 전문가 1만3000여명이 모여 최신 임상 연구와 치료제 개발 동향 등 학술 정보를 공유하는 자리다. 
                이번 행사에서 셀트리온은 단독 부스를 운영해 브랜드 경쟁력을 적극 알리고, 2건의 포스터 발표와 심포지엄, 제품 설명회 세션 등을 가졌다.
              </p>
              <p>
                셀트리온은 학회 첫날 크론병(CD) 환자를 대상으로 일본에서 진행한 CT-P13 SC의 임상 3상 44주 결과가 최초로 공개됐다. 
                연구 결과, 기존 정맥주사(IV) 제형으로 임상적 관해에 도달한 환자들이 피하주사(SC) 제형으로 전환 투여한 이후에도 우수한 내약성과 안전성을 유지했다. 
                CT-P13 SC의 투약 편의성과 유효성, 안전성을 다시 한번 입증했다.
              </p>
              <p>
                크론병·궤양성 대장염(UC) 환자를 대상으로 진행한 CT-P13 SC 글로벌 임상 3상의 102주 사후 분석 결과도 포스터로 발표했다. 
                해당 연구에서 IV 치료 중단 후 최소 16주 이상 위약을 투여받은 환자군에 CT-P13 SC 240mg을 투여한 결과, 신속한 임상 반응 회복과 102주 시점까지의 우수한 유지 효과를 확인했다. 
                단순 제형 전환을 넘어, 불가피한 치료 공백이 발생한 환자에게 고농도 CT-P13 SC 투여가 효과적인 치료 전략이 될 수 있음을 시사한다고 셀트리온은 설명했다.
              </p>
              <p>
                행사 이튿날에는 '염증성 장질환(IBD)에서의 피하주사 치료: 근거, 환자 선정 및 결과 최적화를 위한 실질적 접근'을 주제로 한 심포지엄을 진행했다. 
                셀트리온이 후원한 평생 의학 교육(CME) 세션으로, 글로벌 IBD 전문가들이 최신 가이드라인과 실제 임상 데이터를 바탕으로 SC 제형 치료제의 최적화 활용 방안을 논의했다.
              </p>
              <p>
                학회 마지막 날에는 '짐펜트라의 이해: 궤양성 대장염 및 크론병 유지 요법에서 차별화된 치료를 제공하는 유일한 FDA 승인 피하주사형 인플릭시맙'을 주제로 제품 설명회를 개최했다. 
                짐펜트라만이 가진 차별화된 치료적 접근법을 집중 조명했다.
              </p>
              <p>
                셀트리온은 이번에 발표한 임상 결과가 CT-P13 SC의 처방 신뢰도를 높일 것으로 기대했다. CT-P13 SC는 지난해 글로벌 시장에서 8394억원의 매출을 달성했다. 
                2024년에 비해 약 40% 증가한 수치다. 셀트리온은 성장세를 고려할 때 올해 매출 1조원을 무난하게 돌파할 것으로 전망했다.
              </p>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
