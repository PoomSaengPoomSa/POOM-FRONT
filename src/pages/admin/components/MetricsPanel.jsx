import GroupComponent from "./GroupComponent";
import PropTypes from "prop-types";
import styles from "./MetricsPanel.module.css";

const MetricsPanel = ({ className = "" }) => {
  return (
    <section className={[styles.metricsPanel, className].join(" ")}>
      <div className={styles.tokenMetrics}>
        <div className={styles.rectangleParent}>
          <div className={styles.frameChild} />
          <div className={styles.aiParent}>
            <h3 className={styles.ai}>오늘 AI 토큰</h3>
            <div className={styles.mWrapper}>
              <h1 className={styles.m}>1.24 M</h1>
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.div}>전일 + 12%</div>
          </div>
        </div>
        <div className={styles.apiMetrics}>
          <GroupComponent aPI="API 호출 수" apiUnits="3,847" prop="전일 + 5%" />
          <GroupComponent
            groupDivFlex="1"
            groupDivPadding="13px 14px 9px"
            aPI="평균 응답 시간"
            apiUnits="1.3s"
            apiGoalsPadding="0px 26px"
            prop="+ 0.2s 증가"
          />
          <div className={styles.rectangleGroup}>
            <div className={styles.frameChild} />
            <div className={styles.frameWrapper}>
              <div className={styles.parent}>
                <h3 className={styles.h3}>오류율</h3>
                <div className={styles.apiValues}>
                  <h2 className={styles.m}>0.8%</h2>
                </div>
              </div>
            </div>
            <div className={styles.div2}>목표 2% 이하</div>
          </div>
        </div>
      </div>
    </section>
  );
};

MetricsPanel.propTypes = {
  className: PropTypes.string,
};

export default MetricsPanel;
