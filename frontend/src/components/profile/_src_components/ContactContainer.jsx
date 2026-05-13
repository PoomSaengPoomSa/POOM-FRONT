import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./ContactContainer.module.css";

const ContactContainer = ({
  className = "",
  frameDivHeight,
  divHeight,
  divHeight1,
  inputBgHeight,
  inputBgHeight1,
  inputBgHeight2,
}) => {
  const frameDiv2Style = useMemo(() => {
    return {
      height: frameDivHeight,
    };
  }, [frameDivHeight]);

  const div1Style = useMemo(() => {
    return {
      height: divHeight,
    };
  }, [divHeight]);

  const div2Style = useMemo(() => {
    return {
      height: divHeight1,
    };
  }, [divHeight1]);

  const inputBgStyle = useMemo(() => {
    return {
      height: inputBgHeight,
    };
  }, [inputBgHeight]);

  const inputBg1Style = useMemo(() => {
    return {
      height: inputBgHeight1,
    };
  }, [inputBgHeight1]);

  const inputBg2Style = useMemo(() => {
    return {
      height: inputBgHeight2,
    };
  }, [inputBgHeight2]);

  return (
    <div className={[styles.contactContainer, className].join(" ")}>
      <div className={styles.contactDetailsWrapper} style={frameDiv2Style}>
        <div className={styles.contactDetails}>
          <div className={styles.actionLabels}>
            <div className={styles.div} style={div1Style}>
              다음 방문
            </div>
          </div>
          <div className={styles.div2} style={div2Style}>
            연락처
          </div>
        </div>
      </div>
      <div className={styles.inputBgParent}>
        <div className={styles.inputBg} style={inputBgStyle}>
          <div className={styles.inputBgChild} />
          <div className={styles.separator}>2026.01.11</div>
        </div>
        <div className={styles.inputBg} style={inputBg1Style}>
          <div className={styles.inputBgChild} />
          <div className={styles.div3}>2026.05.02</div>
        </div>
        <div className={styles.phoneInputContainer}>
          <div className={styles.inputBg3} style={inputBg2Style}>
            <div className={styles.inputBgChild} />
            <div className={styles.emptyNumber}>010-0000-0000</div>
          </div>
        </div>
      </div>
    </div>
  );
};

ContactContainer.propTypes = {
  className: PropTypes.string,

  /** Style props */
  frameDivHeight: PropTypes.string,
  divHeight: PropTypes.string,
  divHeight1: PropTypes.string,
  inputBgHeight: PropTypes.string,
  inputBgHeight1: PropTypes.string,
  inputBgHeight2: PropTypes.string,
};

export default ContactContainer;
