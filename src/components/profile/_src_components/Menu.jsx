import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./Menu.module.css";

const Menu = ({
  className = "",
  frameDivBorder,
  frameDivBackgroundColor,
  chartIconHeight,
  chartIconWidth,
  chartIconBorder,
  chartIconPadding,
  chartIconBackgroundColor,
  chartIconOverflow,
  chartIconMaxHeight,
  activityIconBorder,
  activityIconPadding,
  activityIconBackgroundColor,
  notificationIconBorder,
  notificationIconPadding,
  notificationIconBackgroundColor,
  ellipseDivBorder,
  ellipseDivPadding,
  image9IconBorder,
  image9IconPadding,
  image9IconBackgroundColor,
  groupDivPadding,
  prop,
  image11IconBorder,
  image11IconPadding,
  image11IconBackgroundColor,
}) => {
  const frameDivStyle = useMemo(() => {
    return {
      border: frameDivBorder,
      backgroundColor: frameDivBackgroundColor,
    };
  }, [frameDivBorder, frameDivBackgroundColor]);

  const chartIconStyle = useMemo(() => {
    return {
      height: chartIconHeight,
      width: chartIconWidth,
      border: chartIconBorder,
      padding: chartIconPadding,
      backgroundColor: chartIconBackgroundColor,
      overflow: chartIconOverflow,
      maxHeight: chartIconMaxHeight,
    };
  }, [
    chartIconHeight,
    chartIconWidth,
    chartIconBorder,
    chartIconPadding,
    chartIconBackgroundColor,
    chartIconOverflow,
    chartIconMaxHeight,
  ]);

  const activityIconStyle = useMemo(() => {
    return {
      border: activityIconBorder,
      padding: activityIconPadding,
      backgroundColor: activityIconBackgroundColor,
    };
  }, [activityIconBorder, activityIconPadding, activityIconBackgroundColor]);

  const notificationIconStyle = useMemo(() => {
    return {
      border: notificationIconBorder,
      padding: notificationIconPadding,
      backgroundColor: notificationIconBackgroundColor,
    };
  }, [
    notificationIconBorder,
    notificationIconPadding,
    notificationIconBackgroundColor,
  ]);

  const ellipseDivStyle = useMemo(() => {
    return {
      border: ellipseDivBorder,
      padding: ellipseDivPadding,
    };
  }, [ellipseDivBorder, ellipseDivPadding]);

  const image9IconStyle = useMemo(() => {
    return {
      border: image9IconBorder,
      padding: image9IconPadding,
      backgroundColor: image9IconBackgroundColor,
    };
  }, [image9IconBorder, image9IconPadding, image9IconBackgroundColor]);

  const groupDivStyle = useMemo(() => {
    return {
      padding: groupDivPadding,
    };
  }, [groupDivPadding]);

  const image11IconStyle = useMemo(() => {
    return {
      border: image11IconBorder,
      padding: image11IconPadding,
      backgroundColor: image11IconBackgroundColor,
    };
  }, [image11IconBorder, image11IconPadding, image11IconBackgroundColor]);

  return (
    <section className={[styles.menu, className].join(" ")}>
      <div className={styles.bg} />
      <div className={styles.frameParent}>
        <div className={styles.frameWrapper}>
          <div className={styles.frameGroup}>
            <div className={styles.calendarWrapper} style={frameDivStyle}>
              <img
                className={styles.calendarIcon}
                alt=""
                src="/Calendar@2x.png"
              />
            </div>
            <div className={styles.div}>캘린더</div>
          </div>
        </div>
        <div className={styles.frameContainer}>
          <div className={styles.frameDiv}>
            <div className={styles.chartParent}>
              <img
                className={styles.chartIcon}
                alt=""
                src="/Chart@2x.png"
                style={chartIconStyle}
              />
              <div className={styles.div2}>트렌드 아카이브</div>
            </div>
          </div>
          <div className={styles.frameParent2}>
            <div className={styles.frameParent3}>
              <div className={styles.frameParent4}>
                <div className={styles.activityParent}>
                  <img
                    className={styles.activityIcon}
                    alt=""
                    src="/Activity@2x.png"
                    style={activityIconStyle}
                  />
                  <div className={styles.backgroundRect} />
                </div>
                <div className={styles.wrapper}>
                  <div className={styles.div}>고객관리</div>
                </div>
              </div>
              <div className={styles.frameWrapper2}>
                <div className={styles.rectangleParent} style={groupDivStyle}>
                  <div className={styles.frameChild} />
                  <div className={styles.div4}>23</div>
                </div>
              </div>
            </div>
            <div className={styles.frameWrapper3}>
              <div className={styles.iconlyboldnotificationParent}>
                <img
                  className={styles.iconlyboldnotification}
                  alt=""
                  src="/Iconly-Bold-Notification@2x.png"
                  style={notificationIconStyle}
                />
                <div className={styles.calendarWrapper}>
                  <div className={styles.div}>{prop}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <img
        className={styles.image11Icon}
        alt=""
        src="/image-11@2x.png"
        style={image11IconStyle}
      />
      <div className={styles.menuInner}>
        <div className={styles.frameParent5}>
          <div className={styles.ellipseParent}>
            <div className={styles.frameItem} style={ellipseDivStyle} />
            <img
              className={styles.image9Icon}
              alt=""
              src="/image-9@2x.png"
              style={image9IconStyle}
            />
          </div>
          <div className={styles.frameWrapper4}>
            <div className={styles.parent}>
              <div className={styles.div}>김재욱</div>
              <div className={styles.privateBanker}>Private Banker</div>
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
    </section>
  );
};

Menu.propTypes = {
  className: PropTypes.string,
  prop: PropTypes.string,

  /** Style props */
  frameDivBorder: PropTypes.string,
  frameDivBackgroundColor: PropTypes.string,
  chartIconHeight: PropTypes.string,
  chartIconWidth: PropTypes.string,
  chartIconBorder: PropTypes.string,
  chartIconPadding: PropTypes.string,
  chartIconBackgroundColor: PropTypes.string,
  chartIconOverflow: PropTypes.string,
  chartIconMaxHeight: PropTypes.string,
  activityIconBorder: PropTypes.string,
  activityIconPadding: PropTypes.string,
  activityIconBackgroundColor: PropTypes.string,
  notificationIconBorder: PropTypes.string,
  notificationIconPadding: PropTypes.string,
  notificationIconBackgroundColor: PropTypes.string,
  ellipseDivBorder: PropTypes.string,
  ellipseDivPadding: PropTypes.string,
  image9IconBorder: PropTypes.string,
  image9IconPadding: PropTypes.string,
  image9IconBackgroundColor: PropTypes.string,
  groupDivPadding: PropTypes.string,
  image11IconBorder: PropTypes.string,
  image11IconPadding: PropTypes.string,
  image11IconBackgroundColor: PropTypes.string,
};

export default Menu;
