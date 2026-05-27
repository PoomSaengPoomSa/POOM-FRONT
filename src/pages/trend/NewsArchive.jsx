import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, TrendingUp, Users, Bell, LogOut, Search, Calendar as CalendarIcon, Star, ChevronLeft, ChevronRight, X, Settings } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import { api } from "../../api";
import "./Trend.css";

export default function NewsArchive() {
  const location = useLocation();
  const path = location.pathname;
  
  // ---------------------------------------------------------
  // State 관리
  // ---------------------------------------------------------
  const [newsItems, setNewsItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, size: 10, totalCount: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingNewsDetail, setIsLoadingNewsDetail] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  // API 호출 연동 (카테고리, 검색어, 페이지 변경 시 트리거)
  useEffect(() => {
    setIsLoading(true);
    
    const params = {
      category: selectedCategory === "전체" ? undefined : selectedCategory,
      q: searchQuery || undefined,
      page: currentPage,
      size: 10,
      sort: "latest"
    };

    api.trend.getNewsList(params)
      .then(response => {
        setNewsItems(response.items || []);
        setPagination(response.pagination || { page: 1, size: 10, totalCount: 0, totalPages: 1 });
        setIsLoading(false);
      })
      .catch(err => {
        console.error("뉴스 목록 조회 실패:", err);
        setIsLoading(false);
      });
  }, [selectedCategory, searchQuery, currentPage]);

  // 뉴스 클릭 시 상세 조회 호출
  const handleNewsClick = (item) => {
    setIsLoadingNewsDetail(true);

    api.trend.getNewsDetail(item.id)
      .then(detail => {
        const colorMap = { "경제": "green", "정치": "pink", "사회": "blue", economy: "green", politics: "pink", it: "blue", "IT/과학": "blue" };
        setSelectedNewsItem({
          title: detail.title,
          type: item.category || "경제",
          color: colorMap[item.category] || "green",
          body: detail.body || "기사 본문이 존재하지 않습니다.",
          references: detail.tags ? detail.tags : []
        });
        setIsLoadingNewsDetail(false);
      })
      .catch(err => {
        console.error("뉴스 상세 로드 실패:", err);
        setIsLoadingNewsDetail(false);
      });
  };

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
              {["전체", "경제", "정치", "사회"].map(category => (
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
            ) : newsItems.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>검색 결과가 없습니다.</div>
            ) : (
              newsItems.map(item => (
                <div key={item.id} onClick={() => handleNewsClick(item)} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                  <div className="news-arch-item">
                    <span className={`news-arch-badge ${item.category === "경제" ? "green" : item.category === "정치" ? "pink" : "blue"}`}>{item.category}</span>
                    <span className="news-arch-title">{item.title}</span>
                    <div className="news-arch-meta">
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CalendarIcon size={14} color="#38bdf8" /> {item.publishedAt}</span>
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
            <span style={{ fontSize: 14, fontWeight: 600 }}>{currentPage} / {pagination.totalPages}</span>
            <ChevronRight 
              size={16} 
              color={currentPage >= pagination.totalPages ? "#cbd5e1" : "#94a3b8"} 
              style={{ cursor: currentPage >= pagination.totalPages ? 'default' : 'pointer' }}
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
            />
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {selectedNewsItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="news-arch-modal" style={{ position: 'relative', top: 'auto', left: 'auto', right: 'auto', bottom: 'auto', width: '900px', height: '80vh', maxWidth: '90%', maxHeight: '90%', margin: 0 }}>
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
      
      {/* Loading Detail Modal */}
      {isLoadingNewsDetail && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(3px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '20px 40px', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', color: '#0ea5e9', fontWeight: 600 }}>
            기사 내용을 불러오는 중입니다...
          </div>
        </div>
      )}
    </div>
  );
}
