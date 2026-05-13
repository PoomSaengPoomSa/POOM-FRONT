import PropTypes from "prop-types";
import styles from "./Menu1.module.css";

const Menu1 = ({ className = "" }) => {
  return (
    <section className={[styles.menu, className].join(" ")}>
      <div className={styles.bg} />
      <div className={styles.menuInner}>
        <div className={styles.frameParent}>
          <div className={styles.frameWrapper}>
            <div className={styles.frameGroup}>
              <button className={styles.calendarWrapper}>
                <img
                  className={styles.calendarIcon}
                  loading="lazy"
                  alt=""
                  src="/Calendar2@2x.png"
                />
              </button>
              <div className={styles.div}>캘린더</div>
            </div>
          </div>
          <div className={styles.trendContainerParent}>
            <div className={styles.trendContainer}>
              <div className={styles.iconlyboldchartParent}>
                <img
                  className={styles.iconlyboldchart}
                  alt=""
                  src="/Iconly-Bold-Chart@2x.png"
                />
                <div className={styles.chartBackground} />
              </div>
              <div className={styles.trendTitle}>
                <div className={styles.div2}>트렌드 아카이브</div>
              </div>
            </div>
            <div className={styles.frameContainer}>
              <div className={styles.frameDiv}>
                <div className={styles.iconlyboldactivityParent}>
                  <img
                    className={styles.iconlyboldactivity}
                    alt=""
                    src="/Iconly-Bold-Activity@2x.png"
                  />
                  <div className={styles.wrapper}>
                    <div className={styles.div3}>고객관리</div>
                  </div>
                </div>
                <div className={styles.frameWrapper2}>
                  <div className={styles.iconlyboldactivityParent}>
                    <img
                      className={styles.iconlyboldactivity}
                      alt=""
                      src="/Iconly-Bold-Notification@2x.png"
                    />
                    <div className={styles.container}>
                      <div className={styles.div}>뉴스 버킷</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.profileHeaderParent}>
        <div className={styles.profileHeader}>
          <button className={styles.profileHeaderChild} />
          <img className={styles.image9Icon} alt="" src="/image-9@2x.png" />
        </div>
        <div className={styles.profileDetails}>
          <div className={styles.parent}>
            <div className={styles.div}>김재욱</div>
            <div className={styles.privateBanker}>Private Banker</div>
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
      <img className={styles.image11Icon} alt="" src="/image-11@2x.png" />
    </section>
  );
};

Menu1.propTypes = {
  className: PropTypes.string,
};

export default Menu1;
