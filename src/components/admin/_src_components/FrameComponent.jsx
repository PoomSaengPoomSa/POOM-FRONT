import PropTypes from "prop-types";
import styles from "./FrameComponent.module.css";

const FrameComponent = ({ className = "" }) => {
  return (
    <header className={[styles.frameParent, className].join(" ")}>
      <div className={styles.listParent}>
        <button className={styles.list}>
          <div className={styles.listChild} />
          <div className={styles.div}>권한 설정</div>
        </button>
        <button className={styles.board}>
          <div className={styles.boardChild} />
          <div className={styles.div2}>
            <span className={styles.span}>시스템</span>
            <span className={styles.span2}>{` `}</span>
            <span className={styles.span}>대시보드</span>
          </div>
        </button>
        <div className={styles.board2}>
          <div className={styles.boardItem} />
          <div className={styles.div3}>직원 대시보드</div>
        </div>
      </div>
      <div className={styles.profileDetailsWrapper}>
        <div className={styles.profileDetails}>
          <div className={styles.frameGroup}>
            <div className={styles.frameWrapper}>
              <div className={styles.parent}>
                <div className={styles.div4}>김재욱</div>
                <div className={styles.superAdmin}>Super Admin</div>
              </div>
            </div>
            <div className={styles.ellipseParent}>
              <div className={styles.frameChild} />
              <img
                className={styles.image9Icon}
                loading="lazy"
                alt=""
                src="/image-9@2x.png"
              />
            </div>
          </div>
          <div className={styles.logoutWrapper}>
            <img
              className={styles.logoutIcon}
              loading="lazy"
              alt=""
              src="/Logout@2x.png"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

FrameComponent.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent;
