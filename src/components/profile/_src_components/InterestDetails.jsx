import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./InterestDetails.module.css";

const InterestDetails = ({
  className = "",
  interestDetailsAlignSelf,
  groupDivAlignSelf,
  groupDivFlex,
  groupDivWidth,
  divAlignSelf,
  divWidth,
  divDisplay,
  divMargin,
  divMargin1,
  divWidth1,
  divDisplay1,
  sAWidth,
  groupDivFlex1,
  groupDivWidth1,
  divWidth2,
  divDisplay2,
  growthRadarHeight,
  radarComponentsFlex,
  divFlex,
  radarAnalysisPadding,
  radarAnalysisHeight,
  safetyIndicatorsFlex,
  assessmentPointsFlex,
  divFlex1,
}) => {
  const interestDetailsStyle = useMemo(() => {
    return {
      alignSelf: interestDetailsAlignSelf,
    };
  }, [interestDetailsAlignSelf]);

  const groupDiv1Style = useMemo(() => {
    return {
      alignSelf: groupDivAlignSelf,
      flex: groupDivFlex,
      width: groupDivWidth,
    };
  }, [groupDivAlignSelf, groupDivFlex, groupDivWidth]);

  const div3Style = useMemo(() => {
    return {
      alignSelf: divAlignSelf,
      width: divWidth,
      display: divDisplay,
    };
  }, [divAlignSelf, divWidth, divDisplay]);

  const div4Style = useMemo(() => {
    return {
      margin: divMargin,
    };
  }, [divMargin]);

  const div5Style = useMemo(() => {
    return {
      margin: divMargin1,
    };
  }, [divMargin1]);

  const div6Style = useMemo(() => {
    return {
      width: divWidth1,
      display: divDisplay1,
    };
  }, [divWidth1, divDisplay1]);

  const sAStyle = useMemo(() => {
    return {
      width: sAWidth,
    };
  }, [sAWidth]);

  const groupDiv2Style = useMemo(() => {
    return {
      flex: groupDivFlex1,
      width: groupDivWidth1,
    };
  }, [groupDivFlex1, groupDivWidth1]);

  const div7Style = useMemo(() => {
    return {
      width: divWidth2,
      display: divDisplay2,
    };
  }, [divWidth2, divDisplay2]);

  const growthRadarStyle = useMemo(() => {
    return {
      height: growthRadarHeight,
    };
  }, [growthRadarHeight]);

  const radarComponentsStyle = useMemo(() => {
    return {
      flex: radarComponentsFlex,
    };
  }, [radarComponentsFlex]);

  const div8Style = useMemo(() => {
    return {
      flex: divFlex,
    };
  }, [divFlex]);

  const radarAnalysisStyle = useMemo(() => {
    return {
      padding: radarAnalysisPadding,
      height: radarAnalysisHeight,
    };
  }, [radarAnalysisPadding, radarAnalysisHeight]);

  const safetyIndicatorsStyle = useMemo(() => {
    return {
      flex: safetyIndicatorsFlex,
    };
  }, [safetyIndicatorsFlex]);

  const assessmentPointsStyle = useMemo(() => {
    return {
      flex: assessmentPointsFlex,
    };
  }, [assessmentPointsFlex]);

  const div9Style = useMemo(() => {
    return {
      flex: divFlex1,
    };
  }, [divFlex1]);

  return (
    <div
      className={[styles.interestDetails, className].join(" ")}
      style={interestDetailsStyle}
    >
      <div className={styles.frameParent} style={groupDiv1Style}>
        <img className={styles.frameChild} alt="" src="/.svg" />
        <div className={styles.diversificationScore}>
          <div className={styles.div} style={div3Style}>
            관심사 태그
            <br />
          </div>
          <div className={styles.div2}>
            누적 빈도 기반
            <br />
          </div>
        </div>
        <div className={styles.interestBoxes}>
          <div className={styles.firstTag}>
            <div className={styles.secondTag}>
              <div className={styles.thirdTag}>
                <div className={styles.fourthTag}>
                  <div className={styles.fifthTag}>
                    <div className={styles.div3} style={div4Style}>
                      절세
                      <br />
                    </div>
                  </div>
                  <div className={styles.div4} style={div5Style}>
                    부동산
                  </div>
                </div>
              </div>
              <div className={styles.sixthTag}>
                <div className={styles.seventhTag}>
                  <div className={styles.div5} style={div6Style}>
                    배당주
                  </div>
                </div>
                <div className={styles.sa} style={sAStyle}>
                  SA
                  <br />
                </div>
              </div>
            </div>
            <div className={styles.eighthTag}>
              <div className={styles.div5}>채권</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.parent} style={groupDiv2Style}>
        <div className={styles.div7}>
          세금효율
          <br />
          <br />
        </div>
        <div className={styles.div8}>
          분산도
          <br />
          <br />
        </div>
        <img className={styles.frameItem} alt="" src="/.svg" />
        <div className={styles.riskRadar}>
          <div className={styles.axisAnalysis}>
            <div className={styles.div} style={div7Style}>
              리스크 레이더
              <br />
            </div>
            <div className={styles.div10}>
              6축 분석
              <br />
              <br />
            </div>
          </div>
          <div className={styles.profitabilityRadar}>
            <div className={styles.div11}>
              수익성
              <br />
              <br />
            </div>
          </div>
        </div>
        <img className={styles.image3Icon} alt="" src="/image-3@2x.png" />
        <div className={styles.growthDetails}>
          <div className={styles.growthRadar} style={growthRadarStyle}>
            <div
              className={styles.radarComponents}
              style={radarComponentsStyle}
            >
              <div className={styles.div12} style={div8Style}>
                성장성
                <br />
                <br />
              </div>
              <div className={styles.div13}>
                분산도
                <br />
                <br />
              </div>
            </div>
          </div>
          <div className={styles.stabilityRadar}>
            <div className={styles.radarAnalysis} style={radarAnalysisStyle}>
              <div
                className={styles.safetyIndicators}
                style={safetyIndicatorsStyle}
              >
                <div
                  className={styles.assessmentPoints}
                  style={assessmentPointsStyle}
                >
                  <div className={styles.div11}>
                    안정성
                    <br />
                    <br />
                  </div>
                </div>
                <div className={styles.div15} style={div9Style}>
                  유동성
                  <br />
                  <br />
                </div>
              </div>
            </div>
            <img className={styles.image4Icon} alt="" src="/image-4@2x.png" />
          </div>
        </div>
      </div>
    </div>
  );
};

InterestDetails.propTypes = {
  className: PropTypes.string,

  /** Style props */
  interestDetailsAlignSelf: PropTypes.string,
  groupDivAlignSelf: PropTypes.string,
  groupDivFlex: PropTypes.string,
  groupDivWidth: PropTypes.string,
  divAlignSelf: PropTypes.string,
  divWidth: PropTypes.string,
  divDisplay: PropTypes.string,
  divMargin: PropTypes.string,
  divMargin1: PropTypes.string,
  divWidth1: PropTypes.string,
  divDisplay1: PropTypes.string,
  sAWidth: PropTypes.string,
  groupDivFlex1: PropTypes.string,
  groupDivWidth1: PropTypes.string,
  divWidth2: PropTypes.string,
  divDisplay2: PropTypes.string,
  growthRadarHeight: PropTypes.string,
  radarComponentsFlex: PropTypes.string,
  divFlex: PropTypes.string,
  radarAnalysisPadding: PropTypes.string,
  radarAnalysisHeight: PropTypes.string,
  safetyIndicatorsFlex: PropTypes.string,
  assessmentPointsFlex: PropTypes.string,
  divFlex1: PropTypes.string,
};

export default InterestDetails;
