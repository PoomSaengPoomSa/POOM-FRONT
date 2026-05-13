import Menu from "../components/Menu";
import Bg from "../components/Bg";
import Component2 from "../components/Component2";
import styles from "./Component1.module.css";

const Component1 = () => {
  return (
    <div className={styles.div}>
      <Menu />
      <section className={styles.bgWrapper}>
        <Bg />
      </section>
      <Component2 />
    </div>
  );
};

export default Component1;
