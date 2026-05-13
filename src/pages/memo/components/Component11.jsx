import Component21 from "./Component21";
import PropTypes from "prop-types";
import styles from "./Component11.module.css";

const Component11 = ({ className = "" }) => {
  return (
    <div className={[styles.div, className].join(" ")}>
      <img className={styles.icon} alt="" src="/Background-Rect.svg" />
      <b className={styles.ai}>AI 문자 초안</b>
      <div className={styles.parent}>
        <div className={styles.div2}>
          <div className={styles.div3} />
          <div className={styles.kf21Container}>
            <p className={styles.p}>
              안녕하세요 고객님.
              <br />
              오늘 증시는 긍정적인 뉴스 흐름이 이어졌습니다.
            </p>
            <p className={styles.p}>&nbsp;</p>
            <ul className={styles.kf21}>
              <li>나스닥 역대 최고치 경신(+1.63%)</li>
              <li>코스닥 25년 만의 1,200선 돌파</li>
              <li>KF-21 전투용 적합 판정으로 방산 산업 기대 확대</li>
            </ul>
            <p className={styles.p}>&nbsp;</p>
            <p className={styles.p}>
              AI·반도체·방산 중심으로 투자심리가 개선되는 모습이며, 정책 안정
              기대감도 시장에 우호적으로 작용하고 있습니다.
            </p>
            <p className={styles.p}>&nbsp;</p>
            <p className={styles.p}>
              다만 단기 급등 구간에서는 추격 매수보다 포트폴리오 균형 점검이
              중요한 시점입니다.
            </p>
            <p className={styles.p}>
              시장 대응 및 리밸런싱 관련 상담 필요하시면 편하게 연락 주세요.
            </p>
          </div>
        </div>
        <footer className={styles.component1Parent}>
          <Component21 lLM="다시 생성하기" />
          <Component21 lLM="직접 수정하기" />
        </footer>
      </div>
    </div>
  );
};

Component11.propTypes = {
  className: PropTypes.string,
};

export default Component11;
