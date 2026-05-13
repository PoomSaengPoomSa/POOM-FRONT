import PropTypes from "prop-types";
import styles from "./Menu1.module.css";

const Menu1 = ({ className = "" }) => {
  return (
    <section className={[styles.menu, className].join(" ")}>
      <div className={styles.bg} />
      <div className={styles.rectangleParent}>
        <div className={styles.frameChild} />
        <div className={styles.label}>23</div>
      </div>
      <div className={styles.menuChild} />
      <img
        className={styles.iconlyboldnotification}
        loading="lazy"
        alt=""
        src="/Iconly-Bold-Notification@2x.png"
      />
      <img
        className={styles.chartIcon}
        loading="lazy"
        alt=""
        src="/Chart@2x.png"
      />
      <img
        className={styles.activityIcon}
        loading="lazy"
        alt=""
        src="/Activity@2x.png"
      />
      <div className={styles.menuItem} />
      <img
        className={styles.calendarIcon}
        loading="lazy"
        alt=""
        src="/Calendar@2x.png"
      />
      <img className={styles.image11Icon} alt="" src="/image-11@2x.png" />
      <img
        className={styles.logoutIcon}
        loading="lazy"
        alt=""
        src="/Logout@2x.png"
      />
      <div className={styles.profileCard}>
        <div className={styles.ellipseParent}>
          <div className={styles.frameItem} />
          <img
            className={styles.image9Icon}
            loading="lazy"
            alt=""
            src="/image-9@2x.png"
          />
        </div>
        <div className={styles.profileInfo}>
          <div className={styles.div}>김재욱</div>
          <div className={styles.privateBanker}>Private Banker</div>
        </div>
      </div>
    </section>
  );
};

Menu1.propTypes = {
  className: PropTypes.string,
};

export default Menu1;
