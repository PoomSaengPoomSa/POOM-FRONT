import Menu1 from "../components/Menu1";
import FrameComponent from "../components/FrameComponent";
import Component31 from "../components/Component31";
import styles from "./Component3.module.css";

const Component3 = () => {
  return (
    <div className={styles.div}>
      <Menu1 />
      <main className={styles.wrapper}>
        <section className={styles.section}>
          <div className={styles.div2} />
          <div className={styles.parent}>
            <h1 className={styles.h1}>버킷</h1>
            <div className={styles.container}>
              <b className={styles.b}>오늘의 메시지 뉴스 저장소</b>
            </div>
          </div>
          <div className={styles.boardBucketWrapper}>
            <div className={styles.boardBucket}>
              <button className={styles.board}>
                <div className={styles.boardChild} />
                <b className={styles.b2}>버킷</b>
              </button>
              <button className={styles.board2}>
                <div className={styles.boardItem} />
                <b className={styles.b3}>문자 초안</b>
              </button>
            </div>
          </div>
          <FrameComponent />
          <Component31 />
        </section>
      </main>
    </div>
  );
};

export default Component3;
