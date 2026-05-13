import PropTypes from "prop-types";
import styles from "./TopBar.module.css";

const TopBar = ({ className = "" }) => {
  return (
    <div className={[styles.topBar, className].join(" ")}>
      <div className={styles.menu}>
        <div className={styles.bg} />
      </div>
      <img
        className={styles.iconlyboldnotification}
        alt=""
        src="/Iconly-Bold-Notification@2x.png"
      />
      <img
        className={styles.iconlyboldchart}
        alt=""
        src="/Iconly-Bold-Chart@2x.png"
      />
      <img
        className={styles.iconlyboldactivity}
        alt=""
        src="/Iconly-Bold-Activity@2x.png"
      />
      <div className={styles.topBarChild} />
      <img className={styles.calendarIcon} alt="" src="/Calendar2@2x.png" />
      <img
        className={styles.logoutIcon}
        loading="lazy"
        alt=""
        src="/Logout@2x.png"
      />
      <button className={styles.topBarItem} />
      <img className={styles.image9Icon} alt="" src="/image-9@2x.png" />
      <img className={styles.image11Icon} alt="" src="/image-11@2x.png" />
    </div>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
};

export default TopBar;
