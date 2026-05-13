import PropTypes from "prop-types";
import styles from "./Component21.module.css";

const Component21 = ({ className = "", lLM }) => {
  return (
    <button className={[styles.component1, className].join(" ")}>
      <img className={styles.underlayIcon} alt="" src="/Background-Rect.svg" />
      <b className={styles.llm}>{lLM}</b>
    </button>
  );
};

Component21.propTypes = {
  className: PropTypes.string,
  lLM: PropTypes.string,
};

export default Component21;
