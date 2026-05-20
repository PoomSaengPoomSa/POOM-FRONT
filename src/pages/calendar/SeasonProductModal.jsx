import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import './SeasonProductModal.css';

export default function SeasonProductModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const products = [
    {
      title: "WON체크카드",
      company: "우리은행",
      desc: "편의점 등에서 사용 가능한 실적 기반 캐시백으로 일상 소비 영역에서 제시해 혜택을 제공합니다.",
      features: [
        "전월 실적 30만원 이상 시",
        "주요 가맹점 0.2% 캐시백"
      ],
      target: "20~30대 직장인, 생활비 지출이 많고 혜택을 원하는 고객",
      expectedLabel: "예상 캐시백 혜택",
      expectedRate: "12"
    },
    {
      title: "ELS 녹인 65%형",
      company: "우리은행",
      desc: "지수 하락 방어 구조로 안정성을 확보한 중위험 중수익 구조의 ELS 상품입니다.",
      features: [
        "녹인 65%로 중위험 고객에게 적합",
        "조기상환 조건 충족 시 수익률 개선"
      ],
      target: "안정적인 수익을 추구하면서, 손실 위험을 줄이고자 하는 고객",
      expectedLabel: "만기(거치형) 기대 예상",
      expectedRate: "18"
    },
    {
      title: "달러 RP",
      company: "우리은행",
      desc: "단기 유동성을 유지하면서 달러 자산에 편하게 투자할 수 있는 외화 환매조건부채권입니다.",
      features: [
        "높은 이자로 유동성 확보",
        "외화 환매조건 부채권으로 안정성 높음"
      ],
      target: "달러 자산 보유 고객,\n단기 운용으로 수익을 원하는 고객",
      expectedLabel: "만기(거치형) 기대 예상",
      expectedRate: "9"
    },
    {
      title: "부동산 리츠펀드",
      company: "우리자산운용",
      desc: "실물 우량자산 투자로 안정적인 수익을 추구하는 펀드입니다.",
      features: [
        "우량 부동산에 투자해 안정적인 배당 수익 추구",
        "분산 투자로 리스크 경감"
      ],
      target: "중장기 자산 증식을 목표 고객,\n안정적 배당 수익을 원하는 고객",
      expectedLabel: "만기(거치형) 기대 예상",
      expectedRate: "15"
    }
  ];

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal-content" onClick={e => e.stopPropagation()}>
        <button className="product-modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="product-modal-header">
          <h2>시즌 주력 상품</h2>
          <div className="product-modal-subtitle-row">
            <span className="product-modal-subtitle">2026 상반기</span>
            <span className="product-modal-date">업데이트 2026. 05. 18</span>
          </div>
        </div>

        <div className="product-modal-body">
          <div className="product-cards-container">
            {products.map((p, idx) => (
              <div className="product-card" key={idx}>
                <div className="product-card-header">
                  <h3 className="product-card-title">{p.title}</h3>
                  <span className="product-card-company">{p.company}</span>
                </div>
                
                <div className="product-card-icon-placeholder">
                  <div className="product-card-circle"></div>
                  <p className="product-card-desc">{p.desc}</p>
                </div>

                <div className="product-card-section">
                  <h4>주요 특징</h4>
                  <ul className="product-card-list">
                    {p.features.map((f, i) => (
                      <li key={i}><CheckCircle2 size={12} color="#0ea5e9" className="list-icon" /> {f}</li>
                    ))}
                  </ul>
                </div>

                <div className="product-card-section" style={{ flex: 1 }}>
                  <h4>추천 고객</h4>
                  <p className="product-card-target">{p.target}</p>
                </div>

                <div className="product-card-footer">
                  <span className="footer-label">{p.expectedLabel}</span>
                  <span className="footer-rate">+{p.expectedRate}% <span style={{color: '#166534', fontSize: '12px', verticalAlign: 'middle'}}>▲</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
