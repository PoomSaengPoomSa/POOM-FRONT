import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import styles from "./DashboardHeader.module.css";

const DashboardHeader = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <section className={[styles.dashboardHeader, className].join(" ")}>
      <div className={styles.bg} />
      <img className={styles.image11Icon} alt="" src="/image-11@2x.png" />
      <div className={styles.dashboardMenu}>
        <div className={styles.menuArea}>
          <div className={styles.menuContainer}>
            <button
              type="button"
              className={styles.calendarButtonParent}
              onClick={() => navigate("/calendar")}
            >
              <div className={styles.calendarButton}>
                <img
                  className={styles.calendarIcon}
                  alt=""
                  src="/Calendar@2x.png"
                />
              </div>
              <div className={styles.div}>캘린더</div>
            </button>
          </div>
          <div className={styles.trendsContainerParent}>
            <div className={styles.trendsContainer}>
              <button
                type="button"
                className={styles.trendsButton}
                onClick={() => navigate("/trends")}
              >
                <img className={styles.chartIcon} alt="" src="/Chart@2x.png" />
                <div className={styles.div2}>트렌드 아카이브</div>
              </button>
            </div>
            <div className={styles.activityContainerParent}>
              <button
                type="button"
                className={styles.activityContainer}
                onClick={() => navigate("/pb/dashboard")}
              >
                <div className={styles.activityButton}>
                  <img
                    className={styles.activityIcon}
                    alt=""
                    src="/Activity@2x.png"
                  />
                  <div className={styles.activityButtonChild} />
                </div>
                <div className={styles.wrapper}>
                  <div className={styles.div}>고객관리</div>
                </div>
              </button>
              <button
                type="button"
                className={styles.notifications}
                onClick={() => navigate("/memo")}
              >
                <div className={styles.div}>메모 버킷</div>
                <img
                  className={styles.iconlyboldnotification}
                  alt=""
                  src="/Iconly-Bold-Notification@2x.png"
                />
              </button>
            </div>
          </div>
        </div>
        <div className={styles.profileContainerWrapper}>
          <button
            type="button"
            className={styles.profileContainer}
            onClick={() => navigate("/profile")}
          >
            <div className={styles.profileImage}>
              <div className={styles.profileImageChild} />
              <img className={styles.image9Icon} alt="" src="/image-9@2x.png" />
            </div>
            <div className={styles.profileInfo}>
              <div className={styles.parent}>
                <div className={styles.div}>프로필</div>
                <div className={styles.privateBanker}>Private Banker</div>
              </div>
            </div>
          </button>
        </div>
      </div>
      <div className={styles.logoutContainerWrapper}>
        <button
          type="button"
          className={styles.logoutContainer}
          onClick={() => navigate("/auth")}
        >
          <div className={styles.logoutButton}>
            <div className={styles.logoutButtonChild} />
            <div className={styles.logoutBlank}>23</div>
          </div>
          <img className={styles.logoutIcon} alt="" src="/Logout@2x.png" />
        </button>
      </div>
    </section>
  );
};

DashboardHeader.propTypes = {
  className: PropTypes.string,
};

export default DashboardHeader;
