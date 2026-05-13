import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./FrameComponent1.module.css";

const FrameComponent1 = ({
  className = "",
  frameDivTop,
  prop,
  lineDivBorderTop,
  groupDivBackgroundColor,
  rectangleDivBackgroundColor,
  oO,
  prop1,
}) => {
  const frameDiv1Style = useMemo(() => {
    return {
      top: frameDivTop,
    };
  }, [frameDivTop]);

  const lineDivStyle = useMemo(() => {
    return {
      borderTop: lineDivBorderTop,
    };
  }, [lineDivBorderTop]);

  const groupDiv1Style = useMemo(() => {
    return {
      backgroundColor: groupDivBackgroundColor,
    };
  }, [groupDivBackgroundColor]);

  const rectangleDiv1Style = useMemo(() => {
    return {
      backgroundColor: rectangleDivBackgroundColor,
    };
  }, [rectangleDivBackgroundColor]);

  return (
    <div
      className={[styles.parent, className].join(" ")}
      style={frameDiv1Style}
    >
      <div className={styles.div}>{prop}</div>
      <div className={styles.lineParent}>
        <div className={styles.frameChild} style={lineDivStyle} />
        <div className={styles.rectangleParent} style={groupDiv1Style}>
          <div className={styles.frameItem} style={rectangleDiv1Style} />
          <div className={styles.oo}>{oO}</div>
        </div>
        <div className={styles.div2}>{prop1}</div>
      </div>
    </div>
  );
};

FrameComponent1.propTypes = {
  className: PropTypes.string,
  prop: PropTypes.string,
  oO: PropTypes.string,
  prop1: PropTypes.string,

  /** Style props */
  frameDivTop: PropTypes.string,
  lineDivBorderTop: PropTypes.string,
  groupDivBackgroundColor: PropTypes.string,
  rectangleDivBackgroundColor: PropTypes.string,
};

export default FrameComponent1;
