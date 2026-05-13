import PropTypes from "prop-types";
import styles from "./FrameComponent1.module.css";

const FrameComponent1 = ({ className = "", pieChart }) => {
  return (
    <section className={[styles.inner, className].join(" ")}>
      <div className={styles.rectangleParent}>
        <div className={styles.frameChild} />
        <div className={styles.dataOverviewWrapper}>
          <div className={styles.dataOverview}>
            <div className={styles.frameParent}>
              <div className={styles.parent}>
                <div className={styles.div}>트렌드 아카이브</div>
                <div className={styles.categoryInner}>
                  <div className={styles.categoryContainers}>
                    <div className={styles.div}>2,341회</div>
                    <div className={styles.categoryItemPlaceholdersWrapper}>
                      <div className={styles.div}>28%</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.categorySeparators}>
                <div className={styles.categorySeparatorsChild} />
                <div className={styles.categorySeparatorsItem} />
              </div>
            </div>
            <div className={styles.frameParent}>
              <div className={styles.parent}>
                <div className={styles.div}>고객관리</div>
                <div className={styles.categoryInner}>
                  <div className={styles.categoryContainers}>
                    <div className={styles.div}>1,887회</div>
                    <div className={styles.categoryItemPlaceholdersWrapper}>
                      <div className={styles.div}>28%</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.categorySeparators}>
                <div className={styles.categorySeparatorsChild} />
                <div className={styles.frameInner} />
              </div>
            </div>
            <div className={styles.frameParent}>
              <div className={styles.parent}>
                <div className={styles.div}>캘린더</div>
                <div className={styles.categoryInner}>
                  <div className={styles.categoryContainers}>
                    <div className={styles.div}>1,254회</div>
                    <div className={styles.categoryItemPlaceholdersWrapper}>
                      <div className={styles.div}>28%</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.categorySeparators}>
                <div className={styles.categorySeparatorsChild} />
                <div className={styles.frameChild2} />
              </div>
            </div>
            <div className={styles.frameParent2}>
              <div className={styles.parent}>
                <div className={styles.div}>뉴스 버킷</div>
                <div className={styles.categoryInner}>
                  <div className={styles.categoryContainers}>
                    <div className={styles.div}>987회</div>
                    <div className={styles.categoryItemPlaceholdersWrapper}>
                      <div className={styles.div}>28%</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.rectangleParent2}>
                <div className={styles.frameChild3} />
                <div className={styles.frameChild4} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.frameParent3}>
          <div className={styles.chartIconWrapper}>
            <div className={styles.chartIcon} />
          </div>
          <div className={styles.frameParent4}>
            <div className={styles.frameParent5}>
              <div className={styles.pieChartWrapper}>
                <img
                  className={styles.pieChartIcon}
                  loading="lazy"
                  alt=""
                  src={pieChart}
                />
              </div>
              <div className={styles.chartFilter}>
                <div className={styles.div}>트렌드 아카이브</div>
                <div className={styles.categoryContainers}>
                  <div className={styles.selectorsContainer}>
                    <div className={styles.selectorIcons} />
                  </div>
                  <div className={styles.div}>고객 관리</div>
                </div>
                <div className={styles.categoryContainers}>
                  <div className={styles.selectorsContainer}>
                    <div className={styles.ellipseDiv} />
                  </div>
                  <div className={styles.div}>캘린더</div>
                </div>
              </div>
            </div>
            <div className={styles.frameParent6}>
              <button className={styles.frameButton}>
                <div className={styles.frameChild5} />
                <div className={styles.div15}>전체</div>
              </button>
              <button className={styles.rectangleParent3}>
                <div className={styles.frameChild6} />
                <div className={styles.div16}>이번 주</div>
              </button>
            </div>
            <div className={styles.rectangleParent4}>
              <div className={styles.frameChild7} />
              <div className={styles.div17}>이번 달</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

FrameComponent1.propTypes = {
  className: PropTypes.string,
  pieChart: PropTypes.string,
};

export default FrameComponent1;
