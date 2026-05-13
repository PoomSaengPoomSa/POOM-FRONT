import MetricsPanel from "../components/MetricsPanel";
import UsageTrends from "../components/UsageTrends";
import FrameComponent1 from "../components/FrameComponent1";
import styles from "./Component12.module.css";

const Component12 = () => {
  return (
    <div className={styles.div}>
      <header className={styles.dashboard}>
        <div className={styles.authorizationPanel}>
          <div className={styles.rectangleParent}>
            <div className={styles.frameChild} />
            <div className={styles.div2}>권한 설정</div>
          </div>
          <div className={styles.rectangleGroup}>
            <div className={styles.frameItem} />
            <div className={styles.div2}>시스템 대시보드</div>
          </div>
          <div className={styles.rectangleContainer}>
            <div className={styles.frameInner} />
            <div className={styles.div2}>직원 대시보드</div>
          </div>
        </div>
        <div className={styles.userPanel}>
          <div className={styles.frameParent}>
            <div className={styles.avatarAreaParent}>
              <div className={styles.avatarArea}>
                <div className={styles.profileInfo}>
                  <div className={styles.div5}>김재욱</div>
                  <div className={styles.superAdmin}>Super Admin</div>
                </div>
              </div>
              <div className={styles.ellipseParent}>
                <div className={styles.ellipseDiv} />
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
      <MetricsPanel />
      <UsageTrends />
      <FrameComponent1 pieChart="/pie-chart.svg" />
    </div>
  );
};

export default Component12;
