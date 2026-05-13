import PropTypes from "prop-types";
import styles from "./FrameComponent11.module.css";

const FrameComponent11 = ({ className = "" }) => {
  return (
    <nav className={[styles.parent, className].join(" ")}>
      <div className={styles.div}>
        <img
          className={styles.icon}
          loading="lazy"
          alt=""
          src="/Background-Rect.svg"
        />
        <b className={styles.b}>버킷 저장 수</b>
        <div className={styles.wrapper}>
          <h2 className={styles.h2}>4</h2>
        </div>
        <b className={styles.b2}>오늘의 메시지 용</b>
      </div>
      <div className={styles.container}>
        <div className={styles.div2}>
          <img
            className={styles.icon}
            loading="lazy"
            alt=""
            src="/Background-Rect.svg"
          />
          <b className={styles.b}>
            카테고리 수<br />
          </b>
          <div className={styles.frame}>
            <h2 className={styles.h22}>2</h2>
          </div>
          <b className={styles.b4}>분류됨</b>
        </div>
      </div>
      <div className={styles.frameParent}>
        <div className={styles.frameDiv}>
          <div className={styles.div3}>
            <img
              className={styles.icon}
              loading="lazy"
              alt=""
              src="/Background-Rect.svg"
            />
            <b className={styles.b}>미저장 뉴스</b>
            <div className={styles.wrapper2}>
              <h2 className={styles.h2}>00</h2>
            </div>
            <b className={styles.b2}>오늘 전체</b>
          </div>
        </div>
        <div className={styles.div4}>
          <img
            className={styles.icon}
            loading="lazy"
            alt=""
            src="/Background-Rect.svg"
          />
          <b className={styles.b}>초안 상태</b>
          <div className={styles.frameGroup}>
            <div className={styles.wrapper3}>
              <h2 className={styles.h24}>완료</h2>
            </div>
            <b className={styles.llm}>LLM 자동생성</b>
          </div>
        </div>
      </div>
    </nav>
  );
};

FrameComponent11.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent11;
