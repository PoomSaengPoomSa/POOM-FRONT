import PropTypes from "prop-types";
import styles from "./ProfileButton.module.css";

const ProfileButton = ({ className = "" }) => {
  return (
    <div className={[styles.profileButton, className].join(" ")}>
      <div className={styles.profileButtonChild} />
      <div className={styles.dashboardNavigator}>
        <button className={styles.profileButtonContent}>
          <div className={styles.profileButtonContentChild} />
        </button>
        <div className={styles.userNameContainer}>
          <div className={styles.oo}>김OO</div>
        </div>
        <img
          className={styles.dashboardNavigatorChild}
          alt=""
          src="/Group-143.svg"
        />
      </div>
      <section className={styles.navigation}>
        <div className={styles.dashboardTabs}>
          <button className={styles.tabRouting}>
            <div className={styles.tabRoutingChild} />
            <div className={styles.div}>프로필</div>
          </button>
          <button className={styles.tabRouting2}>
            <div className={styles.tabRoutingItem} />
            <div className={styles.div2}>고객 대시보드</div>
          </button>
          <button className={styles.tabRouting3}>
            <div className={styles.tabRoutingInner} />
            <div className={styles.div3}>방문 브리핑</div>
          </button>
          <button className={styles.tabRouting4}>
            <div className={styles.rectangleDiv} />
            <div className={styles.div4}>메모 어시스턴트</div>
          </button>
        </div>
        <div className={styles.cycleInsights}>
          <div className={styles.cycleInsightsChild} />
          <div className={styles.visitSummary}>
            <div className={styles.cycleTrends}>
              <div className={styles.div5}>방문 주기 그래프</div>
            </div>
            <div className={styles.div6}>
              월별 상담 현황
              <br />
            </div>
          </div>
          <div className={styles.cycleMetrics}>
            <div className={styles.visitDuration}>
              <div className={styles.visitCount}>
                <div className={styles.countBackground} />
                <div className={styles.div7}>총 방문</div>
              </div>
              <div className={styles.div8}>평균 주기</div>
              <div className={styles.div9}>마지막 방문</div>
              <div className={styles.visitCountValue}>
                <h2 className={styles.countPlaceholder}>4</h2>
                <div className={styles.wrapper}>
                  <div className={styles.div10}>회</div>
                </div>
              </div>
              <div className={styles.averageDuration}>
                <div className={styles.durationLabels}>
                  <div className={styles.durationLabelsChild} />
                  <h1 className={styles.durationSeparators}>53</h1>
                </div>
                <div className={styles.container}>
                  <div className={styles.div11}>일</div>
                </div>
              </div>
              <div className={styles.averageDuration2}>
                <div className={styles.durationLabels}>
                  <div className={styles.frameChild} />
                  <h2 className={styles.durationSeparators}>+9</h2>
                </div>
                <div className={styles.frame}>
                  <div className={styles.div11}>일</div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.monthlyTrends}>
            <div className={styles.trendVisuals}>
              <div className={styles.trendBars}>
                <div className={styles.barSegments} />
                <div className={styles.barSegments} />
                <div className={styles.barSegments3}>
                  <div className={styles.barSegmentsChild} />
                </div>
                <div className={styles.barSegments} />
                <div className={styles.barSegments3}>
                  <div className={styles.barSegmentsChild} />
                </div>
                <div className={styles.barSegments} />
                <div className={styles.barSegments3}>
                  <div className={styles.barSegmentsChild} />
                </div>
                <div className={styles.barSegments3}>
                  <div className={styles.barSegmentsChild} />
                </div>
              </div>
              <div className={styles.div13}>
                09월 10월 11월 12월 01월 02월 03월 04월
              </div>
            </div>
          </div>
          <img
            className={styles.cycleInsightsItem}
            loading="lazy"
            alt=""
            src="/.svg"
          />
        </div>
      </section>
      <section className={styles.riskIndicators}>
        <div className={styles.riskOverview}>
          <div className={styles.div14}>리스크 레이더</div>
        </div>
        <img className={styles.riskIndicatorsChild} alt="" src="/.svg" />
        <div className={styles.riskFactors}>
          <div className={styles.profitabilityScatter}>
            <div className={styles.div15}>
              수익성
              <br />
              <br />
            </div>
            <div className={styles.scatterLabels}>
              <div className={styles.div16}>
                수익성
                <br />
                <br />
              </div>
              <div className={styles.scatterSeparator}>72</div>
            </div>
            <div className={styles.growthStability}>
              <div className={styles.stabilityLabels}>
                <div className={styles.div17}>
                  성장성
                  <br />
                  <br />
                </div>
              </div>
              <div className={styles.stabilityLabels2}>
                <div className={styles.div18}>
                  안정성
                  <br />
                  <br />
                </div>
              </div>
              <div className={styles.stabilityInsights}>
                <div className={styles.div16}>
                  안정성
                  <br />
                  <br />
                </div>
                <div className={styles.stabilityPlaceholder}>
                  <div className={styles.stabilityEmpty}>65</div>
                </div>
              </div>
            </div>
            <div className={styles.liquidity}>
              <div className={styles.div16}>유동성</div>
              <div className={styles.scatterSeparator}>58</div>
            </div>
            <div className={styles.dispersionLiquidity}>
              <div className={styles.liquidityData}>
                <div className={styles.div17}>
                  분산도
                  <br />
                  <br />
                </div>
              </div>
              <div className={styles.liquidityData2}>
                <div className={styles.div18}>
                  유동성
                  <br />
                  <br />
                </div>
              </div>
              <div className={styles.taxEfficiencyLabelParent}>
                <div className={styles.taxEfficiencyLabel}>
                  <div className={styles.div23}>세금효율</div>
                </div>
                <div className={styles.scatterSeparator}>80</div>
              </div>
            </div>
            <div className={styles.scatterLabels2}>
              <div className={styles.div16}>
                분산도
                <br />
                <br />
              </div>
              <div className={styles.scatterSeparator}>
                70
                <br />
                <br />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.additionalInsights}>
          <div className={styles.symbolismTaxEfficiency}>
            <div className={styles.taxEfficiencyDisplay}>
              <div className={styles.taxEfficiencyVisual}>
                <img
                  className={styles.image15Icon}
                  loading="lazy"
                  alt=""
                  src="/image-15@2x.png"
                />
                <div className={styles.div26}>
                  세금효율
                  <br />
                  <br />
                </div>
              </div>
            </div>
            <div className={styles.stabilityInsights}>
              <div className={styles.div16}>
                상징성
                <br />
                <br />
              </div>
              <div className={styles.scatterSeparator}>
                55
                <br />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

ProfileButton.propTypes = {
  className: PropTypes.string,
};

export default ProfileButton;
