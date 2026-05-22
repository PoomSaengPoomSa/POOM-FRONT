import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '../../api';
import './SeasonProductModal.css';

export default function SeasonProductModal({ isOpen, onClose }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seasonInfo, setSeasonInfo] = useState("2026 상반기");
  const [updateDate, setUpdateDate] = useState("2026. 05. 22");

  useEffect(() => {
    if (!isOpen) return;

    const loadProducts = async () => {
      setLoading(true);
      try {
        // 1. 주력 상품 목록 조회
        const listData = await api.kpi.getSeasonalProducts();
        
        // 2. 각 상품의 상세 정보 병렬 조회
        const detailPromises = listData.products.map(p => 
          api.kpi.getSeasonalProductDetail(p.pd_id)
        );
        const details = await Promise.all(detailPromises);
        
        setProducts(details);
        
        if (details.length > 0) {
          // 첫 번째 상품에서 시즌 정보 및 업데이트 날짜 정보 연동
          setSeasonInfo(details[0].season);
          const rawDate = details[0].update_date;
          if (rawDate) {
            const formatted = rawDate.replace(/-/g, '. ');
            setUpdateDate(formatted);
          }
        }
      } catch (error) {
        console.error("주력 상품 연동 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal-content" onClick={e => e.stopPropagation()}>
        <button className="product-modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="product-modal-header">
          <h2>시즌 주력 상품</h2>
          <div className="product-modal-subtitle-row">
            <span className="product-modal-subtitle">{seasonInfo}</span>
            <span className="product-modal-date">업데이트 {updateDate}</span>
          </div>
        </div>

        <div className="product-modal-body" style={{ minHeight: '200px', display: 'flex', flexDirection: 'column' }}>
          {loading ? (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '40px 0' }}>
              <Loader2 size={36} className="animate-spin" style={{ color: '#0ea5e9' }} />
              <p style={{ fontSize: '14px', color: '#64748b' }}>실시간 주력 상품 정보를 불러오는 중입니다...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', padding: '40px 0', color: '#64748b' }}>
              등록된 주력 상품이 없습니다.
            </div>
          ) : (
            <div className="product-cards-container">
              {products.map((p) => {
                // 주요 특징 텍스트 파싱 (세미콜론, 줄바꿈, 쉼표 기준 분할)
                const featuresArray = p.features 
                  ? p.features.split(/[;\n,]+/).map(f => f.trim()).filter(Boolean)
                  : [];

                return (
                  <div className="product-card" key={p.pd_id}>
                    <div className="product-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                      <div>
                        <h3 className="product-card-title">{p.name}</h3>
                        <span className="product-card-company">{p.issuer}</span>
                      </div>
                      {p.matched_customer_count !== null && (
                        <span className="product-card-badge" style={{
                          fontSize: '11px',
                          backgroundColor: '#e0f2fe',
                          color: '#0369a1',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontWeight: '600'
                        }}>
                          적합 고객: {p.matched_customer_count}명
                        </span>
                      )}
                    </div>
                    
                    <div className="product-card-icon-placeholder">
                      <div className="product-card-circle"></div>
                      <p className="product-card-desc">{p.explanation}</p>
                    </div>

                    <div className="product-card-section">
                      <h4>주요 특징</h4>
                      <ul className="product-card-list">
                        {featuresArray.length > 0 ? (
                          featuresArray.map((f, i) => (
                            <li key={i}><CheckCircle2 size={12} color="#0ea5e9" className="list-icon" /> {f}</li>
                          ))
                        ) : (
                          <li><CheckCircle2 size={12} color="#0ea5e9" className="list-icon" /> 정보 없음</li>
                        )}
                      </ul>
                    </div>

                    <div className="product-card-section" style={{ flex: 1 }}>
                      <h4>추천 고객</h4>
                      <p className="product-card-target">{p.target_customer || "모든 고객 추천"}</p>
                    </div>

                    <div className="product-card-footer">
                      <span className="footer-label">{p.return_type || "기대 수익률"}</span>
                      <span className="footer-rate">+{p.expected_return}% <span style={{color: '#166534', fontSize: '12px', verticalAlign: 'middle'}}>▲</span></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
