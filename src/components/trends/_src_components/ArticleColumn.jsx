import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./ArticleColumn.module.css";

const ArticleColumn = ({
  className = "",
  groupDivPadding,
  groupDivBackgroundColor,
  groupDivPadding1,
  rectangleDivBackgroundColor,
  prop,
  frameDivPadding,
  prop1,
  metadataRowPadding,
  groupDivBackgroundColor1,
  groupDivPadding2,
  groupDivBorder,
  rectangleDivBackgroundColor1,
  prop2,
  hMM,
}) => {
  const groupDivStyle = useMemo(() => {
    return {
      padding: groupDivPadding,
    };
  }, [groupDivPadding]);

  const groupDiv1Style = useMemo(() => {
    return {
      backgroundColor: groupDivBackgroundColor,
      padding: groupDivPadding1,
    };
  }, [groupDivBackgroundColor, groupDivPadding1]);

  const rectangleDivStyle = useMemo(() => {
    return {
      backgroundColor: rectangleDivBackgroundColor,
    };
  }, [rectangleDivBackgroundColor]);

  const frameDivStyle = useMemo(() => {
    return {
      padding: frameDivPadding,
    };
  }, [frameDivPadding]);

  const metadataRowStyle = useMemo(() => {
    return {
      padding: metadataRowPadding,
    };
  }, [metadataRowPadding]);

  const groupDiv2Style = useMemo(() => {
    return {
      backgroundColor: groupDivBackgroundColor1,
      padding: groupDivPadding2,
      border: groupDivBorder,
    };
  }, [groupDivBackgroundColor1, groupDivPadding2, groupDivBorder]);

  const rectangleDiv1Style = useMemo(() => {
    return {
      backgroundColor: rectangleDivBackgroundColor1,
    };
  }, [rectangleDivBackgroundColor1]);

  return (
    <section className={[styles.articleColumn, className].join(" ")}>
      <div className={styles.frameParent}>
        <div className={styles.rectangleParent} style={groupDivStyle}>
          <div className={styles.frameChild} />
          <div className={styles.categoryColumn}>
            <div className={styles.rectangleGroup} style={groupDiv1Style}>
              <div className={styles.frameItem} style={rectangleDivStyle} />
              <div className={styles.div}>{prop}</div>
            </div>
            <div className={styles.wrapper} style={frameDivStyle}>
              <div className={styles.hmm}>{prop1}</div>
            </div>
          </div>
          <div className={styles.metadataRow} style={metadataRowStyle}>
            <div className={styles.metadataColumn}>
              <div className={styles.calendarRow}>
                <div className={styles.calendarWrapper}>
                  <img
                    className={styles.calendarIcon}
                    loading="lazy"
                    alt=""
                    src="/Calendar1@2x.png"
                  />
                </div>
                <div className={styles.dec2020}>12 Dec, 2020</div>
              </div>
              <div className={styles.starRow}>
                <img
                  className={styles.starIcon}
                  loading="lazy"
                  alt=""
                  src="/Star.svg"
                />
              </div>
              <div className={styles.bookmarkColumn}>
                <img
                  className={styles.bookmarkColumnChild}
                  alt=""
                  src="/Group-464.svg"
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.rectangleParent}>
          <div className={styles.frameChild} />
          <div className={styles.categoryColumn}>
            <div className={styles.rectangleGroup} style={groupDiv2Style}>
              <div className={styles.frameItem} style={rectangleDiv1Style} />
              <div className={styles.div}>{prop2}</div>
            </div>
            <div className={styles.wrapper}>
              <div className={styles.hmm}>{hMM}</div>
            </div>
          </div>
          <div className={styles.metadataRow}>
            <div className={styles.metadataColumn}>
              <div className={styles.calendarRow}>
                <div className={styles.calendarWrapper}>
                  <img
                    className={styles.calendarIcon}
                    loading="lazy"
                    alt=""
                    src="/Calendar1@2x.png"
                  />
                </div>
                <div className={styles.dec2020}>12 Dec, 2020</div>
              </div>
              <div className={styles.starRow}>
                <img className={styles.starIcon2} alt="" src="/Star.svg" />
              </div>
              <div className={styles.bookmarkColumn}>
                <img
                  className={styles.bookmarkColumnChild}
                  loading="lazy"
                  alt=""
                  src="/Group-464.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

ArticleColumn.propTypes = {
  className: PropTypes.string,
  prop: PropTypes.string,
  prop1: PropTypes.string,
  prop2: PropTypes.string,
  hMM: PropTypes.string,

  /** Style props */
  groupDivPadding: PropTypes.string,
  groupDivBackgroundColor: PropTypes.string,
  groupDivPadding1: PropTypes.string,
  rectangleDivBackgroundColor: PropTypes.string,
  frameDivPadding: PropTypes.string,
  metadataRowPadding: PropTypes.string,
  groupDivBackgroundColor1: PropTypes.string,
  groupDivPadding2: PropTypes.string,
  groupDivBorder: PropTypes.string,
  rectangleDivBackgroundColor1: PropTypes.string,
};

export default ArticleColumn;
