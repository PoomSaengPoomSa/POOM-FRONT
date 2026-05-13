import FrameComponent1 from "../components/FrameComponent1";
import ApiContainer from "../components/ApiContainer";
import styles from "./Component11.module.css";

const Component11 = () => {
  return (
    <div className={styles.div}>
      <header className={styles.frameParent}>
        <nav className={styles.frameGroup}>
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
        </nav>
        <div className={styles.frameWrapper}>
          <div className={styles.frameContainer}>
            <div className={styles.frameDiv}>
              <div className={styles.frameWrapper2}>
                <div className={styles.parent}>
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
      <FrameComponent1 pieChart="/pie-chart.svg" />
      <main className={styles.apiContainerWrapper}>
        <ApiContainer />
      </main>
    </div>
  );
};

export default Component11;
