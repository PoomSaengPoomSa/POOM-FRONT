import PropTypes from "prop-types";
import styles from "./Menu.module.css";

const Menu = ({ className = "" }) => {
  return (
    <section className={[styles.menu, className].join(" ")}>
      <div className={styles.bg} />
      <div className={styles.menuInner}>
        <div className={styles.frameParent}>
          <div className={styles.frameWrapper}>
            <div className={styles.calendarPanelParent}>
              <button className={styles.calendarPanel}>
                <img
                  className={styles.calendarIcon}
                  loading="lazy"
                  alt=""
                  src="/Calendar@2x.png"
                />
              </button>
              <div className={styles.div}>캘린더</div>
            </div>
          </div>
          <div className={styles.trendPanel}>
            <button className={styles.chartContainer}>
              <div className={styles.chartArea}>
                <img
                  className={styles.iconlyboldchart}
                  loading="lazy"
                  alt=""
                  src="/Iconly-Bold-Chart@2x.png"
                />
                <div className={styles.chartBackground} />
              </div>
              <div className={styles.trendArchive}>
                <div className={styles.div2}>트렌드 아카이브</div>
              </div>
            </button>
            <div className={styles.iconArea}>
              <div className={styles.activityPanelParent}>
                <button className={styles.activityPanel}>
                  <img
                    className={styles.iconlyboldactivity}
                    loading="lazy"
                    alt=""
                    src="/Iconly-Bold-Activity@2x.png"
                  />
                  <div className={styles.clientManagement}>
                    <div className={styles.div3}>고객관리</div>
                  </div>
                </button>
                <button className={styles.notificationPanel}>
                  <div className={styles.newsIcon}>
                    <img
                      className={styles.iconlyboldactivity}
                      loading="lazy"
                      alt=""
                      src="/Iconly-Bold-Notification@2x.png"
                    />
                    <div className={styles.newsBucket}>
                      <div className={styles.div3}>뉴스 버킷</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.avatarAreaParent}>
        <div className={styles.avatarArea}>
          <button className={styles.avatarAreaChild} />
          <img className={styles.image9Icon} alt="" src="/image-9@2x.png" />
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userDetails}>
            <div className={styles.div}>김재욱</div>
            <div className={styles.privateBanker}>Private Banker</div>
          </div>
        </div>
        <div className={styles.logoutButton}>
          <img
            className={styles.logoutIcon}
            loading="lazy"
            alt=""
            src="/Logout@2x.png"
          />
        </div>
      </div>
      <img className={styles.image11Icon} alt="" src="/image-11@2x.png" />
    </section>
  );
};

Menu.propTypes = {
  className: PropTypes.string,
};

export default Menu;
