import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, TrendingUp, Users, Bell, LogOut, Search, MoreHorizontal, Calendar as CalendarIcon, Star, ChevronLeft, ChevronRight, X, Settings } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import "./Trend.css";

// ---------------------------------------------------------
// [DB 연동 대비] 임시 데이터 및 모의 API 함수
// 추후 실제 API 엔드포인트(fetch / axios)로 교체하기 쉽게 구성
// ---------------------------------------------------------
const mockNewsData = [
  { 
    id: 1, type: "경제", title: "셀트리온, 美 소화기학회서 자가면역질환 치료제 '램시마SC' 임상 데이터 공개", date: "12 Dec, 2020", color: "green",
    body: "셀트리온이 지난 2일부터 5일까지 나흘간 미국 일리노이주 시카고에서 열린 '2026 미국소화기학회(DDW)'에 참가했다고 7일 밝혔다. 자가면역질환 치료제 'CT-P13 SC(램시마SC·미국 제품명 짐펜트라)'의 경쟁력을 알렸다.\n\n셀트리온은 학회 첫날 크론병 환자를 대상으로 일본에서 진행한 CT-P13 SC의 임상 3상 44주 결과가 최초로 공개됐다.",
    references: ["셀트리온, 미국소화기학회서 짐펜트라 임상 공개", "\"비수기에도\"...셀트리온, 1분기 매출 1.1조 '역대최고'"]
  },
  { 
    id: 2, type: "정치", title: "[속보] 국힘 \"후대통령 '비읍시옷' 발언 경악\"", date: "12 Dec, 2020", color: "pink",
    body: "정치권 소식 본문입니다. 현재는 DB 연동 전 임시 데이터입니다.",
    references: ["정치 관련 참고자료 1", "정치 관련 참고자료 2"]
  },
  { 
    id: 3, type: "경제", title: "카카오, 1분기 영업익 2114억원...전년비 66%↑", date: "12 Dec, 2020", color: "green",
    body: "카카오 실적 발표 본문입니다. 현재는 DB 연동 전 임시 데이터입니다.",
    references: ["카카오 실적 발표 상세", "IT 기업 1분기 동향"]
  },
  { 
    id: 4, type: "경제", title: "HMM 나무호 예인선 도착...오늘 오전 중 작업 시작", date: "12 Dec, 2020", color: "green",
    body: "HMM 해운 관련 본문입니다. 현재는 DB 연동 전 임시 데이터입니다.",
    references: ["HMM 물류 동향", "해운업계 뉴스"]
  },
  { 
    id: 5, type: "정치", title: "국산 전투기 시대 열렸다...KF-21, 전투용 적합 판정", date: "12 Dec, 2020", color: "pink",
    body: "방산 및 KF-21 관련 본문입니다. 현재는 DB 연동 전 임시 데이터입니다.",
    references: ["국방부 보도자료", "방산업계 실적 분석"]
  },
  { 
    id: 6, type: "IT/과학", title: "카카오, 에이전틱 AI 속도...\"카톡 내 탐색부터 결제까지\"", date: "12 Dec, 2020", color: "blue",
    body: "IT/과학 AI 발전 동향 본문입니다. 현재는 DB 연동 전 임시 데이터입니다.",
    references: ["AI 기술 트렌드 2026", "빅테크 기업들의 AI 경쟁"]
  },
  { 
    id: 7, type: "경제", title: "삼성바이오 노사 갈등 격화...\"불법행위 엄정 대응\" vs \"억지 고소\"", date: "12 Dec, 2020", color: "green",
    body: "삼성바이오 관련 본문입니다. 현재는 DB 연동 전 임시 데이터입니다.",
    references: ["제약바이오 업계 노사 동향", "삼성바이오 1분기 실적"]
  },
];

const fetchNewsAPI = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockNewsData);
    }, 300); // 네트워크 지연 시뮬레이션
  });
};

export default function NewsArchive() {
  const location = useLocation();
  const path = location.pathname;
  
  // ---------------------------------------------------------
  // State 관리
  // ---------------------------------------------------------
  const [newsData, setNewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);
  const [bucketItems, setBucketItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const ITEMS_PER_PAGE = 10;

  // DB(API) 연동 시뮬레이션 (컴포넌트 마운트 시 데이터 로드)
  useEffect(() => {
    setIsLoading(true);
    fetchNewsAPI().then(data => {
      setNewsData(data);
      setIsLoading(false);
    });
  }, []);

  // 버킷 저장 토글
  const toggleBucket = (e, id) => {
    e.stopPropagation();
    setBucketItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // ---------------------------------------------------------
  // 파생 데이터 (필터링 및 페이지네이션)
  // ---------------------------------------------------------
  const filteredNews = newsData.filter(item => {
    const matchesCategory = selectedCategory === "전체" || item.type === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredNews.length / ITEMS_PER_PAGE));
  const paginatedNews = filteredNews.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="trend-container">
      {/* Sidebar */}
      <Sidebar type="trend" />

      {/* Main Content */}
      <div className="trend-main">
        <div className="trend-section-box" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 24, marginTop: 0 }}>뉴스 아카이브</h1>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <div className="trend-tabs" style={{ marginBottom: 0 }}>
              {["전체", "경제", "정치", "IT/과학"].map(category => (
                <button 
                  key={category}
                  className={`trend-tab ${selectedCategory === category ? 'active' : ''}`}
                  style={selectedCategory === category ? {} : { background: 'white', color: '#64748b' }}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <div className="news-arch-search">
              <input 
                type="text" 
                placeholder="검색어를 입력하세요..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <Search size={14} color="#94a3b8" style={{ position: 'absolute', right: 12, top: 9 }} />
            </div>
          </div>

          <div className="news-arch-list">
            {isLoading ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>데이터를 불러오는 중입니다...</div>
            ) : (
              paginatedNews.map(item => (
                <div key={item.id} onClick={() => setSelectedNewsItem(item)} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                  <div className="news-arch-item">
                    <span className={`news-arch-badge ${item.color}`}>{item.type}</span>
                    <span className="news-arch-title">{item.title}</span>
                    <div className="news-arch-meta">
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CalendarIcon size={14} color="#38bdf8" /> {item.date}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 'auto', paddingTop: 24 }}>
            <ChevronLeft 
              size={16} 
              color={currentPage === 1 ? "#cbd5e1" : "#94a3b8"} 
              style={{ cursor: currentPage === 1 ? 'default' : 'pointer' }}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            />
            <span style={{ fontSize: 14, fontWeight: 600 }}>{currentPage}</span>
            <ChevronRight 
              size={16} 
              color={currentPage >= totalPages ? "#cbd5e1" : "#94a3b8"} 
              style={{ cursor: currentPage >= totalPages ? 'default' : 'pointer' }}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            />
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {selectedNewsItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(8px)', zIndex: 1000 }}>
          <div className="news-arch-modal" style={{ top: 80, left: 280, right: 40, bottom: 40, position: 'absolute' }}>
            <div className="news-mod-header">
              <span className={`news-arch-badge ${selectedNewsItem.color}`} style={{ fontSize: 16, padding: '12px 24px' }}>{selectedNewsItem.type}</span>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }}>
                {selectedNewsItem.title}
              </h2>
              <button onClick={() => setSelectedNewsItem(null)} className="news-mod-close" style={{ marginLeft: 'auto', background: '#f1f5f9', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={20} color="#64748b" />
              </button>
            </div>

            <div className="news-mod-content-wrap" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              <div className="news-mod-main" style={{ flex: 1, padding: '16px 32px', overflowY: 'auto', fontSize: 13, color: '#334155', lineHeight: 1.8 }}>
                {selectedNewsItem.body.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>


            </div>
          </div>
        </div>
      )}
    </div>
  );
}
