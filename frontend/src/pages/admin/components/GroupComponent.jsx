import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./GroupComponent.module.css";

const GroupComponent = ({
  className = "",
  groupDivFlex,
  groupDivPadding,
  aPI,
  apiUnits,
  apiGoalsPadding,
  prop,
}) => {
  const groupDivStyle = useMemo(() => {
    return {
      flex: groupDivFlex,
      padding: groupDivPadding,
    };
  }, [groupDivFlex, groupDivPadding]);

  const apiGoalsStyle = useMemo(() => {
    return {
      padding: apiGoalsPadding,
    };
  }, [apiGoalsPadding]);

  return (
    <div
      className={[styles.rectangleParent, className].join(" ")}
      style={groupDivStyle}
    >
      <div className={styles.frameChild} />
      <div className={styles.apiDetailsParent}>
        <div className={styles.apiDetails}>
          <h3 className={styles.api}>{aPI}</h3>
        </div>
        <h2 className={styles.apiUnits}>{apiUnits}</h2>
      </div>
      <div className={styles.apiGoals} style={apiGoalsStyle}>
        <div className={styles.div}>{prop}</div>
      </div>
    </div>
  );
};

GroupComponent.propTypes = {
  className: PropTypes.string,
  aPI: PropTypes.string,
  apiUnits: PropTypes.string,
  prop: PropTypes.string,

  /** Style props */
  groupDivFlex: PropTypes.string,
  groupDivPadding: PropTypes.string,
  apiGoalsPadding: PropTypes.string,
};

export default GroupComponent;
