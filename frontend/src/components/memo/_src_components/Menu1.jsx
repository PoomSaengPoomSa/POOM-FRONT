import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./Menu1.module.css";

const Menu1 = ({
  className = "",
  frameButtonBorder,
  frameButtonBackgroundColor,
  frameButtonBorder1,
  frameButtonBackgroundColor1,
  frameButtonBorder2,
  frameButtonBackgroundColor2,
  frameButtonBorder3,
  frameButtonPadding,
  frameButtonBackgroundColor3,
  ellipseButtonBorder,
  ellipseButtonPadding,
  image9IconBorder,
  image9IconPadding,
  image9IconBackgroundColor,
}) => {
  const frameButtonStyle = useMemo(() => {
    return {
      border: frameButtonBorder,
      backgroundColor: frameButtonBackgroundColor,
    };
  }, [frameButtonBorder, frameButtonBackgroundColor]);

  const frameButton1Style = useMemo(() => {
    return {
      border: frameButtonBorder1,
      backgroundColor: frameButtonBackgroundColor1,
    };
  }, [frameButtonBorder1, frameButtonBackgroundColor1]);

  const frameButton2Style = useMemo(() => {
    return {
      border: frameButtonBorder2,
      backgroundColor: frameButtonBackgroundColor2,
    };
  }, [frameButtonBorder2, frameButtonBackgroundColor2]);

  const frameButton3Style = useMemo(() => {
    return {
      border: frameButtonBorder3,
      padding: frameButtonPadding,
      backgroundColor: frameButtonBackgroundColor3,
    };
  }, [frameButtonBorder3, frameButtonPadding, frameButtonBackgroundColor3]);

  const ellipseButtonStyle = useMemo(() => {
    return {
      border: ellipseButtonBorder,
      padding: ellipseButtonPadding,
    };
  }, [ellipseButtonBorder, ellipseButtonPadding]);

  const image9IconStyle = useMemo(() => {
    return {
      border: image9IconBorder,
      padding: image9IconPadding,
      backgroundColor: image9IconBackgroundColor,
    };
  }, [image9IconBorder, image9IconPadding, image9IconBackgroundColor]);

  return (
    <section className={[styles.menu, className].join(" ")}>
      <div className={styles.bg} />
      <div className={styles.menuInner}>
        <div className={styles.frameParent}>
          <button className={styles.calendarWrapper} style={frameButtonStyle}>
            <img
              className={styles.calendarIcon}
              loading="lazy"
              alt=""
              src="/Calendar@2x.png"
            />
          </button>
          <div className={styles.div}>캘린더</div>
        </div>
      </div>
      <div className={styles.frameGroup}>
        <button className={styles.frameWrapper} style={frameButton1Style}>
          <div className={styles.chartParent}>
            <img
              className={styles.chartIcon}
              loading="lazy"
              alt=""
              src="/Chart@2x.png"
            />
            <div className={styles.div2}>트렌드 아카이브</div>
          </div>
        </button>
        <div className={styles.frameContainer}>
          <button className={styles.frameButton} style={frameButton2Style}>
            <div className={styles.chartParent}>
              <img
                className={styles.chartIcon}
                loading="lazy"
                alt=""
                src="/Activity@2x.png"
              />
              <div className={styles.wrapper}>
                <div className={styles.div2}>고객관리</div>
              </div>
            </div>
          </button>
          <button className={styles.frameParent2} style={frameButton3Style}>
            <div className={styles.iconlyboldnotificationParent}>
              <img
                className={styles.iconlyboldnotification}
                loading="lazy"
                alt=""
                src="/Iconly-Bold-Notification@2x.png"
              />
              <img
                className={styles.backgroundRectIcon}
                alt=""
                src="/Background-Rect.svg"
              />
            </div>
            <div className={styles.container}>
              <div className={styles.div4}>뉴스 버킷</div>
            </div>
          </button>
        </div>
      </div>
      <img className={styles.image11Icon} alt="" src="/image-11@2x.png" />
      <div className={styles.menuChild}>
        <div className={styles.frameDiv}>
          <div className={styles.ellipseParent}>
            <button className={styles.frameChild} style={ellipseButtonStyle} />
            <img
              className={styles.image9Icon}
              alt=""
              src="/image-9@2x.png"
              style={image9IconStyle}
            />
          </div>
          <div className={styles.frameWrapper2}>
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

Menu1.propTypes = {
  className: PropTypes.string,

  /** Style props */
  frameButtonBorder: PropTypes.string,
  frameButtonBackgroundColor: PropTypes.string,
  frameButtonBorder1: PropTypes.string,
  frameButtonBackgroundColor1: PropTypes.string,
  frameButtonBorder2: PropTypes.string,
  frameButtonBackgroundColor2: PropTypes.string,
  frameButtonBorder3: PropTypes.string,
  frameButtonPadding: PropTypes.string,
  frameButtonBackgroundColor3: PropTypes.string,
  ellipseButtonBorder: PropTypes.string,
  ellipseButtonPadding: PropTypes.string,
  image9IconBorder: PropTypes.string,
  image9IconPadding: PropTypes.string,
  image9IconBackgroundColor: PropTypes.string,
};

export default Menu1;
