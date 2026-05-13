import PropTypes from "prop-types";
import styles from "./UsageTrends.module.css";

const UsageTrends = ({ className = "" }) => {
  return (
    <section className={[styles.usageTrends, className].join(" ")}>
      <div className={styles.tokenUsage}>
        <div className={styles.rectangleParent}>
          <div className={styles.frameChild} />
          <div className={styles.reports}>
            <div className={styles.bg} />
            <h3 className={styles.h3}>시간대별 토큰 사용</h3>
            <div className={styles.frameParent}>
              <div className={styles.numberParent}>
                <div className={styles.number}>
                  <div className={styles.columnValue}>100</div>
                  <div className={styles.columnValue2}>80</div>
                  <div className={styles.columnValue2}>60</div>
                  <div className={styles.columnValue2}>40</div>
                  <div className={styles.columnValue2}>20</div>
                  <div className={styles.columnValue6}>0</div>
                </div>
                <div className={styles.frameWrapper}>
                  <div className={styles.lineParent}>
                    <div className={styles.frameItem} />
                    <div className={styles.lineGroup}>
                      <div className={styles.frameItem} />
                      <div className={styles.lineContainer}>
                        <div className={styles.lineDiv} />
                        <img
                          className={styles.vectorIcon}
                          alt=""
                          src="/Vector.svg"
                        />
                        <div className={styles.frameDiv}>
                          <div className={styles.frameChild2} />
                          <div className={styles.frameChild3} />
                          <div className={styles.frameChild4} />
                          <img
                            className={styles.vectorIcon2}
                            alt=""
                            src="/Vector1.svg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.parent}>
                <div className={styles.div}>00시</div>
                <div className={styles.div}>03시</div>
                <div className={styles.div3}>06시</div>
                <div className={styles.wrapper}>
                  <div className={styles.div4}>09시</div>
                </div>
                <div className={styles.group}>
                  <div className={styles.div5}>12시</div>
                  <div className={styles.div5}>15시</div>
                </div>
                <div className={styles.container}>
                  <div className={styles.div4}>18시</div>
                </div>
                <div className={styles.div8}>21시</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.rectangleGroup}>
          <div className={styles.frameChild} />
          <div className={styles.frame}>
            <h3 className={styles.h32}>접속 히트맵</h3>
          </div>
          <div className={styles.heatmapRowsParent}>
            <div className={styles.heatmapRows}>
              <div className={styles.heatmapCell} />
              <div className={styles.heatmapCell} />
              <div className={styles.heatmapCell} />
              <div className={styles.heatmapCell4} />
              <div className={styles.heatmapCell} />
              <div className={styles.heatmapCell} />
              <div className={styles.heatmapCell} />
              <div className={styles.heatmapCell4} />
              <div className={styles.heatmapCell9} />
              <div className={styles.heatmapCell10} />
              <div className={styles.heatmapCell11} />
              <div className={styles.heatmapCell12} />
              <div className={styles.heatmapCell13} />
              <div className={styles.heatmapCell14} />
              <div className={styles.heatmapCell14} />
              <div className={styles.heatmapCell12} />
              <div className={styles.heatmapCell17} />
              <div className={styles.heatmapCell10} />
              <div className={styles.heatmapCell10} />
              <div className={styles.heatmapCell20} />
              <div className={styles.heatmapCell21} />
              <div className={styles.heatmapCell} />
              <div className={styles.heatmapCell} />
              <div className={styles.heatmapCell} />
            </div>
            <div className={styles.heatmapLabels}>
              <div className={styles.timeMiddle}>
                <div className={styles.div9}>00시</div>
              </div>
              <div className={styles.timeMiddle}>
                <div className={styles.div9}>06시</div>
              </div>
              <div className={styles.timeFurther}>
                <div className={styles.div9}>12시</div>
              </div>
              <div className={styles.div9}>18시</div>
              <div className={styles.div9}>23시</div>
            </div>
          </div>
          <div className={styles.usageIntensity}>
            <div className={styles.thresholdBlocks}>
              <div className={styles.lowThreshold}>
                <div className={styles.div9}>낮음</div>
              </div>
              <div className={styles.lowRect} />
              <div className={styles.medRect} />
              <div className={styles.highRect} />
              <div className={styles.maxRect} />
              <div className={styles.extraRect}>
                <img
                  className={styles.highThresholdRect}
                  alt=""
                  src="/Rectangle-364.svg"
                />
              </div>
              <div className={styles.highThreshold}>
                <div className={styles.div9}>높음</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

UsageTrends.propTypes = {
  className: PropTypes.string,
};

export default UsageTrends;
