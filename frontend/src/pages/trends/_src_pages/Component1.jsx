import Menu from "../components/Menu";
import Bg1 from "../components/Bg1";
import Bg from "../components/Bg";
import styles from "./Component1.module.css";

const Component1 = () => {
  return (
    <div className={styles.div}>
      <Menu />
      <img className={styles.child} alt="" src="/Rectangle-298.svg" />
      <section className={styles.bgWrapper}>
        <Bg1 />
      </section>
      <main className={styles.briefingArea}>
        <Bg />
      </main>
    </div>
  );
};

export default Component1;
