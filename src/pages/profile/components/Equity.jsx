import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./Equity.module.css";

const Equity = ({ className = "", equityFlex, equityWidth, prop, prop1 }) => {
  const equityStyle = useMemo(() => {
    return {
      flex: equityFlex,
      width: equityWidth,
    };
  }, [equityFlex, equityWidth]);

  return (
    <div className={[styles.equity, className].join(" ")} style={equityStyle}>
      <div className={styles.allocation}>
        <div className={styles.stock}>
          <div className={styles.div}>{prop}</div>
          <div className={styles.div}>{prop1}</div>
        </div>
      </div>
      <div className={styles.frameParent}>
        <div className={styles.rectangleParent}>
          <div className={styles.frameChild} />
          <div className={styles.assetType}>0</div>
        </div>
        <div className={styles.rectangleParent}>
          <div className={styles.frameChild} />
          <div className={styles.assetType}>0</div>
        </div>
      </div>
    </div>
  );
};

Equity.propTypes = {
  className: PropTypes.string,
  prop: PropTypes.string,
  prop1: PropTypes.string,

  /** Style props */
  equityFlex: PropTypes.string,
  equityWidth: PropTypes.string,
};

export default Equity;
