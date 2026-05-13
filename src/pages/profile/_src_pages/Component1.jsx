import Menu from "../components/Menu";
import Bg from "../components/Bg";
import GroupComponent2 from "../components/GroupComponent2";
import NeedsActions from "../components/NeedsActions";
import styles from "./Component1.module.css";

const Component1 = () => {
  return (
    <div className={styles.div}>
      <Menu prop="뉴스 버킷" />
      <Bg />
      <main className={styles.profileView}>
        <div className={styles.div2}>
          <div className={styles.child} />
          <div className={styles.inner}>
            <div className={styles.frameParent}>
              <div className={styles.frameGroup}>
                <div className={styles.ellipseWrapper}>
                  <div className={styles.frameChild} />
                </div>
                <div className={styles.ooWrapper}>
                  <div className={styles.oo}>김OO</div>
                </div>
                <img className={styles.frameItem} alt="" src="/Group-143.svg" />
              </div>
              <div className={styles.frameWrapper}>
                <nav className={styles.listParent}>
                  <button className={styles.list}>
                    <div className={styles.listChild} />
                    <div className={styles.div3}>프로필</div>
                  </button>
                  <button className={styles.board}>
                    <div className={styles.boardChild} />
                    <div className={styles.div4}>고객 대시보드</div>
                  </button>
                  <button className={styles.board2}>
                    <div className={styles.boardItem} />
                    <div className={styles.div5}>방문 브리핑</div>
                  </button>
                  <button className={styles.board3}>
                    <div className={styles.boardInner} />
                    <div className={styles.div4}>메모 어시스턴트</div>
                  </button>
                </nav>
              </div>
            </div>
          </div>
          <GroupComponent2 />
          <NeedsActions />
        </div>
      </main>
    </div>
  );
};

export default Component1;
