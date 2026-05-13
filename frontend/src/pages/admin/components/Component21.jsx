import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./Component21.module.css";

const Component21 = ({
  className = "",
  component1Display,
  component1AlignItems,
  component1Padding,
  component1Position,
  component1Isolation,
  component1Top,
  component1Left,
  rectangleIconMargin,
  rectangleIconTop,
  rectangleIconRight,
  rectangleIconBottom,
  rectangleIconLeft,
  lLMHeight,
  lLMWidth,
  lLMPosition,
  lLMDisplay,
  lLMTop,
  lLMLeft,
}) => {
  const component1Style = useMemo(() => {
    return {
      display: component1Display,
      alignItems: component1AlignItems,
      padding: component1Padding,
      position: component1Position,
      isolation: component1Isolation,
      top: component1Top,
      left: component1Left,
    };
  }, [
    component1Display,
    component1AlignItems,
    component1Padding,
    component1Position,
    component1Isolation,
    component1Top,
    component1Left,
  ]);

  const rectangleIconStyle = useMemo(() => {
    return {
      margin: rectangleIconMargin,
      top: rectangleIconTop,
      right: rectangleIconRight,
      bottom: rectangleIconBottom,
      left: rectangleIconLeft,
    };
  }, [
    rectangleIconMargin,
    rectangleIconTop,
    rectangleIconRight,
    rectangleIconBottom,
    rectangleIconLeft,
  ]);

  const lLMStyle = useMemo(() => {
    return {
      height: lLMHeight,
      width: lLMWidth,
      position: lLMPosition,
      display: lLMDisplay,
      top: lLMTop,
      left: lLMLeft,
    };
  }, [lLMHeight, lLMWidth, lLMPosition, lLMDisplay, lLMTop, lLMLeft]);

  return (
    <div
      className={[styles.component1, className].join(" ")}
      style={component1Style}
    >
      <img
        className={styles.component1Child}
        alt=""
        src="/Rectangle-364.svg"
        style={rectangleIconStyle}
      />
      <div className={styles.llm} style={lLMStyle}>
        발령처리
      </div>
    </div>
  );
};

Component21.propTypes = {
  className: PropTypes.string,

  /** Style props */
  component1Display: PropTypes.string,
  component1AlignItems: PropTypes.string,
  component1Padding: PropTypes.string,
  component1Position: PropTypes.string,
  component1Isolation: PropTypes.string,
  component1Top: PropTypes.string,
  component1Left: PropTypes.string,
  rectangleIconMargin: PropTypes.string,
  rectangleIconTop: PropTypes.string,
  rectangleIconRight: PropTypes.string,
  rectangleIconBottom: PropTypes.string,
  rectangleIconLeft: PropTypes.string,
  lLMHeight: PropTypes.string,
  lLMWidth: PropTypes.string,
  lLMPosition: PropTypes.string,
  lLMDisplay: PropTypes.string,
  lLMTop: PropTypes.string,
  lLMLeft: PropTypes.string,
};

export default Component21;
