import Menu1 from "../components/Menu1";
import FrameComponent11 from "../components/FrameComponent11";
import Component11 from "../components/Component11";
import styles from "./Component4.module.css";

const Component4 = () => {
  return (
    <div className={styles.div}>
      <Menu1
        frameButtonBorder="unset"
        frameButtonBackgroundColor="unset"
        frameButtonBorder1="unset"
        frameButtonBackgroundColor1="unset"
        frameButtonBorder2="unset"
        frameButtonBackgroundColor2="unset"
        frameButtonBorder3="unset"
        frameButtonPadding="unset"
        frameButtonBackgroundColor3="unset"
        ellipseButtonBorder="unset"
        ellipseButtonPadding="unset"
        image9IconBorder="unset"
        image9IconPadding="unset"
        image9IconBackgroundColor="unset"
      />
      <main className={styles.wrapper}>
        <section className={styles.section}>
          <div className={styles.div2} />
          <div className={styles.frameParent}>
            <div className={styles.parent}>
              <h1 className={styles.h1}>버킷</h1>
              <div className={styles.container}>
                <b className={styles.b}>오늘의 메시지 뉴스 저장소</b>
              </div>
            </div>
            <div className={styles.boardParent}>
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
          <FrameComponent11 />
          <Component11 />
        </section>
      </main>
    </div>
  );
};

export default Component4;
