import PropTypes from "prop-types";
import styles from "./ScrollbarVertical.module.css";

const ScrollbarVertical = ({
  className = "",
  pageHeight = "x 2",
  position = "Top",
}) => {
  return (
    <div
      className={[styles.scrollbarVertical, className].join(" ")}
      data-pageHeight={pageHeight}
      data-position={position}
    >
      <div className={styles.frame}>
        <div className={styles.thumb} />
      </div>
    </div>
  );
};

ScrollbarVertical.propTypes = {
  className: PropTypes.string,

  /** Variant props */
  pageHeight: PropTypes.string,
  position: PropTypes.string,
};

export default ScrollbarVertical;
