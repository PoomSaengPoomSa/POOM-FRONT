import Menu from "../components/Menu";
import Bg from "../components/Bg";
import ProfileButton from "../components/ProfileButton";
import styles from "./Component11.module.css";

const Component11 = () => {
  return (
    <div className={styles.div}>
      <Menu
        frameDivBorder="none"
        frameDivBackgroundColor="transparent"
        chartIconHeight="unset"
        chartIconWidth="unset"
        chartIconBorder="none"
        chartIconPadding="0"
        chartIconBackgroundColor="transparent"
        chartIconOverflow="hidden"
        chartIconMaxHeight="100%"
        activityIconBorder="none"
        activityIconPadding="0"
        activityIconBackgroundColor="transparent"
        notificationIconBorder="none"
        notificationIconPadding="0"
        notificationIconBackgroundColor="transparent"
        ellipseDivBorder="none"
        ellipseDivPadding="0"
        image9IconBorder="none"
        image9IconPadding="0"
        image9IconBackgroundColor="transparent"
        groupDivPadding="3.2px 8px 1px"
        prop="뉴스 버킷"
        image11IconBorder="none"
        image11IconPadding="0"
        image11IconBackgroundColor="transparent"
      />
      <section className={styles.dashboardArea}>
        <Bg bgWidth="unset" bgAlignSelf="stretch" />
      </section>
      <main className={styles.parent}>
        <div className={styles.div2}>
          6축 분석
          <br />
        </div>
        <ProfileButton />
      </main>
    </div>
  );
};

export default Component11;
