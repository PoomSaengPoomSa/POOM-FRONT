import PropTypes from "prop-types";
import styles from "./FrameComponent.module.css";

const FrameComponent = ({ className = "" }) => {
  return (
    <section className={[styles.menuParent, className].join(" ")}>
      <div className={styles.menu}>
        <div className={styles.bg} />
        <div className={styles.div}>고객관리</div>
        <img
          className={styles.iconlyboldchart}
          alt=""
          src="/Iconly-Bold-Chart@2x.png"
        />
        <div className={styles.bg}>
          <div className={styles.bg} />
        </div>
        <div className={styles.div2}>뉴스버킷</div>
        <div className={styles.div3}>트렌드 아카이브</div>
        <div className={styles.div4}>캘린더</div>
        <div className={styles.div5}>김재욱</div>
        <div className={styles.privateBanker}>Private Banker</div>
      </div>
      <img
        className={styles.iconlyboldsetting}
        alt=""
        src="/Iconly-Bold-Setting@2x.png"
      />
      <img
        className={styles.iconlyboldnotification}
        alt=""
        src="/Iconly-Bold-Notification@2x.png"
      />
      <img
        className={styles.iconlyboldactivity}
        alt=""
        src="/Iconly-Bold-Activity@2x.png"
      />
      <div className={styles.icons} />
      <img className={styles.calendarIcon} alt="" src="/Calendar@2x.png" />
      <img className={styles.logoutIcon} alt="" src="/Logout@2x.png" />
      <img className={styles.image9Icon} alt="" src="/image-9@2x.png" />
      <img className={styles.image11Icon} alt="" src="/image-11@2x.png" />
      <img
        className={styles.iconlyboldnotification2}
        loading="lazy"
        alt=""
        src="/Iconly-Bold-Notification@2x.png"
      />
      <img
        className={styles.iconlyboldchart2}
        loading="lazy"
        alt=""
        src="/Iconly-Bold-Chart@2x.png"
      />
      <img
        className={styles.iconlyboldactivity2}
        loading="lazy"
        alt=""
        src="/Iconly-Bold-Activity@2x.png"
      />
      <div className={styles.icons2} />
      <img
        className={styles.calendarIcon2}
        loading="lazy"
        alt=""
        src="/Calendar@2x.png"
      />
      <img
        className={styles.logoutIcon2}
        loading="lazy"
        alt=""
        src="/Logout@2x.png"
      />
      <div className={styles.userAvatar} />
      <img
        className={styles.image9Icon2}
        loading="lazy"
        alt=""
        src="/image-9@2x.png"
      />
      <img
        className={styles.image11Icon2}
        loading="lazy"
        alt=""
        src="/image-11@2x.png"
      />
    </section>
  );
};

FrameComponent.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent;
