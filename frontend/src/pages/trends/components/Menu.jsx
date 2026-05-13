import PropTypes from "prop-types";
import styles from "./Menu.module.css";

const Menu = ({ className = "" }) => {
  return (
    <section className={[styles.menu, className].join(" ")}>
      <div className={styles.bg} />
      <div className={styles.frameParent}>
        <div className={styles.frameWrapper}>
          <div className={styles.frameGroup}>
            <div className={styles.calendarWrapper}>
              <img
                className={styles.calendarIcon}
                alt=""
                src="/Calendar2@2x.png"
              />
            </div>
            <div className={styles.div}>캘린더</div>
          </div>
        </div>
        <div className={styles.frameContainer}>
          <div className={styles.frameDiv}>
            <div className={styles.chartParent}>
              <img className={styles.chartIcon} alt="" src="/Chart@2x.png" />
              <div className={styles.div2}>트렌드 아카이브</div>
            </div>
          </div>
          <div className={styles.frameParent2}>
            <div className={styles.frameParent3}>
              <div className={styles.frameParent4}>
                <div className={styles.activityParent}>
                  <img
                    className={styles.activityIcon}
                    alt=""
                    src="/Activity@2x.png"
                  />
                  <div className={styles.frameChild} />
                </div>
                <div className={styles.wrapper}>
                  <div className={styles.div}>고객관리</div>
                </div>
              </div>
              <div className={styles.frameWrapper2}>
                <div className={styles.rectangleParent}>
                  <div className={styles.frameItem} />
                  <div className={styles.div4}>23</div>
                </div>
              </div>
            </div>
            <div className={styles.frameWrapper3}>
              <div className={styles.iconlyboldnotificationParent}>
                <img
                  className={styles.iconlyboldnotification}
                  alt=""
                  src="/Iconly-Bold-Notification@2x.png"
                />
                <div className={styles.calendarWrapper}>
                  <div className={styles.div}>뉴스 버킷</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <img className={styles.image11Icon} alt="" src="/image-11@2x.png" />
      <div className={styles.profileContainer}>
        <div className={styles.userDetails}>
          <div className={styles.profilePicture}>
            <div className={styles.profilePictureChild} />
            <img className={styles.image9Icon} alt="" src="/image-9@2x.png" />
          </div>
          <div className={styles.userNameInfo}>
            <div className={styles.userInfo}>
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
      </div>
    </section>
  );
};

Menu.propTypes = {
  className: PropTypes.string,
};

export default Menu;
