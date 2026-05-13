import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./NeedsActions.module.css";

const NeedsActions = ({
  className = "",
  needsActionsAlignSelf,
  needsActionsWidth,
  frameDivFlex,
  divWidth,
  divDisplay,
}) => {
  const needsActionsStyle = useMemo(() => {
    return {
      alignSelf: needsActionsAlignSelf,
      width: needsActionsWidth,
    };
  }, [needsActionsAlignSelf, needsActionsWidth]);

  const frameDiv1Style = useMemo(() => {
    return {
      flex: frameDivFlex,
    };
  }, [frameDivFlex]);

  const divStyle = useMemo(() => {
    return {
      width: divWidth,
      display: divDisplay,
    };
  }, [divWidth, divDisplay]);

  return (
    <div
      className={[styles.needsActions, className].join(" ")}
      style={needsActionsStyle}
    >
      <img className={styles.needsActionsChild} alt="" src="/Group-687.svg" />
      <div className={styles.parent} style={frameDiv1Style}>
        <div className={styles.div}>주요 니즈</div>
        <div className={styles.needsContent}>
          <div className={styles.div2}>
            달러 자산 비중 축소 / 국내 리츠 편입 검토
            <br />
          </div>
        </div>
      </div>
      <div className={styles.group}>
        <div className={styles.div}>후속 조치</div>
        <div className={styles.actionContent}>
          <div className={styles.div4} style={divStyle}>
            → 리츠 상품 비교안 준비
          </div>
        </div>
      </div>
    </div>
  );
};

NeedsActions.propTypes = {
  className: PropTypes.string,

  /** Style props */
  needsActionsAlignSelf: PropTypes.string,
  needsActionsWidth: PropTypes.string,
  frameDivFlex: PropTypes.string,
  divWidth: PropTypes.string,
  divDisplay: PropTypes.string,
};

export default NeedsActions;
