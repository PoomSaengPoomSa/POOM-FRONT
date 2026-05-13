import Component21 from "./Component21";
import PropTypes from "prop-types";
import styles from "./Component31.module.css";

const Component31 = ({ className = "" }) => {
  return (
    <div className={[styles.div, className].join(" ")}>
      <img className={styles.icon} alt="" src="/Background-Rect.svg" />
      <section className={styles.inner}>
        <div className={styles.frameParent}>
          <div className={styles.frameWrapper}>
            <div className={styles.frameGroup}>
              <div className={styles.wrapper}>
                <b className={styles.b}>버킷 - 카테고리별</b>
              </div>
              <div className={styles.parent}>
                <b className={styles.b2}>경제</b>
                <div className={styles.div2}>
                  <div className={styles.div3} />
                  <div className={styles.container}>
                    <b className={styles.b3}>나스닥 +1.63% 역대 최고치 경신</b>
                  </div>
                  <b className={styles.b4}>
                    <span className={styles.span}>{`05.07    `}</span>
                    <span className={styles.span2}>✕</span>
                  </b>
                </div>
              </div>
              <div className={styles.div4}>
                <div className={styles.div3} />
                <div className={styles.frame}>
                  <b className={styles.b3}>
                    코스닥 1,203 — 25년 만에 1,200 돌파
                  </b>
                </div>
                <b className={styles.b4}>
                  <span className={styles.span}>{`05.07    `}</span>
                  <span className={styles.span2}>✕</span>
                </b>
              </div>
            </div>
          </div>
          <div className={styles.frameContainer}>
            <div className={styles.frameDiv}>
              <b className={styles.b}>정치</b>
            </div>
            <div className={styles.wrapper2}>
              <div className={styles.div6}>
                <div className={styles.div3} />
                <div className={styles.kf21Wrapper}>
                  <b className={styles.kf21}>
                    KF-21 전투용 적합 판정…대한민국 '독자 전투기' 시대 개막
                  </b>
                </div>
                <b className={styles.b4}>
                  <span className={styles.span}>{`05.07    `}</span>
                  <span className={styles.span2}>✕</span>
                </b>
              </div>
            </div>
            <div className={styles.wrapper3}>
              <div className={styles.div8}>
                <div className={styles.div3} />
                <div className={styles.wrapper4}>
                  <b className={styles.b9}>
                    한병도 "후반기 원구성 빈틈없이 준비…공백상황 용인 안해"
                  </b>
                </div>
                <b className={styles.b4}>
                  <span className={styles.span}>{`05.07    `}</span>
                  <span className={styles.span2}>✕</span>
                </b>
              </div>
            </div>
          </div>
          <div className={styles.frameDiv}>
            <b className={styles.b}>IT/과학</b>
          </div>
        </div>
      </section>
      <Component21 lLM="LLM 문자 초안 생성" />
    </div>
  );
};

Component31.propTypes = {
  className: PropTypes.string,
};

export default Component31;
