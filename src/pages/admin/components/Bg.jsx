import PropTypes from "prop-types";
import styles from "./Bg.module.css";

const Bg = ({ className = "" }) => {
  return (
    <section className={[styles.bg, className].join(" ")}>
      <img className={styles.bgChild} alt="" src="/Rectangle-364.svg" />
      <div className={styles.historyDetails}>
        <div className={styles.timeCircleWrapper}>
          <img
            className={styles.timeCircleIcon}
            loading="lazy"
            alt=""
            src="/Time-Circle@2x.png"
          />
        </div>
        <h3 className={styles.h3}>인수인계 이력</h3>
      </div>
      <div className={styles.frameParent}>
        <div className={styles.frameGroup}>
          <div className={styles.imageWrapper}>
            <div className={styles.image}>
              <div className={styles.iconBackground} />
              <div className={styles.div}>이</div>
            </div>
          </div>
          <div className={styles.parent}>
            <div className={styles.div2}>
              <b>이주리</b>
              <span className={styles.span}> 압구정→강남지점</span>
            </div>
            <div className={styles.div3}>고객 23명→조성은 2025.03.10</div>
          </div>
        </div>
        <div className={styles.sectionLineParent}>
          <img
            className={styles.sectionLineIcon}
            loading="lazy"
            alt=""
            src="/section-line.svg"
          />
          <div className={styles.frameContainer}>
            <div className={styles.imageContainer}>
              <div className={styles.image2}>
                <div className={styles.subIconBackground} />
                <div className={styles.div}>서</div>
              </div>
            </div>
            <div className={styles.subTransferInfo}>
              <div className={styles.div5}>
                <b>서지혜</b>
                <span className={styles.span}> 여의도→서초지점</span>
              </div>
              <div className={styles.div6}>고객 19명→김수빈 2024.09.02</div>
            </div>
          </div>
        </div>
        <div className={styles.sectionLineGroup}>
          <img
            className={styles.sectionLineIcon}
            loading="lazy"
            alt=""
            src="/section-line.svg"
          />
          <div className={styles.imageParent}>
            <div className={styles.image}>
              <div className={styles.thirdIconBackground} />
              <div className={styles.div}>이</div>
            </div>
            <div className={styles.thirdTransferInfo}>
              <div className={styles.div8}>
                <b>이종혁</b>
                <span className={styles.span}> 서초→강남지점</span>
              </div>
              <div className={styles.div6}>
                고객 18명 재배정 →김수빈 2022.03.15
              </div>
            </div>
          </div>
        </div>
        <img
          className={styles.sectionLineIcon}
          loading="lazy"
          alt=""
          src="/section-line.svg"
        />
      </div>
    </section>
  );
};

Bg.propTypes = {
  className: PropTypes.string,
};

export default Bg;
