import Menu from "../components/Menu";
import Bg1 from "../components/Bg1";
import Component3 from "../components/Component3";
import GroupComponent11 from "../components/GroupComponent11";
import styles from "./Component13.module.css";

const Component13 = () => {
  return (
    <div className={styles.div}>
      <Menu
        frameDivBorder="unset"
        frameDivBackgroundColor="unset"
        chartIconHeight="20px"
        chartIconWidth="20px"
        chartIconBorder="unset"
        chartIconPadding="unset"
        chartIconBackgroundColor="unset"
        chartIconOverflow="unset"
        chartIconMaxHeight="unset"
        activityIconBorder="unset"
        activityIconPadding="unset"
        activityIconBackgroundColor="unset"
        notificationIconBorder="unset"
        notificationIconPadding="unset"
        notificationIconBackgroundColor="unset"
        ellipseDivBorder="unset"
        ellipseDivPadding="unset"
        image9IconBorder="unset"
        image9IconPadding="unset"
        image9IconBackgroundColor="unset"
        groupDivPadding="3.2px 7px 2.8px 8px"
        prop="뉴스버킷"
        image11IconBorder="unset"
        image11IconPadding="unset"
        image11IconBackgroundColor="unset"
      />
      <div className={styles.bgParent}>
        <Bg1 />
        <div className={styles.wrapper}>
          <Component3 />
        </div>
        <GroupComponent11 />
      </div>
      <img className={styles.customerManagementIcon} alt="" src="/.svg" />
      <img className={styles.customerManagementIcon2} alt="" src="/.svg" />
    </div>
  );
};

export default Component13;
