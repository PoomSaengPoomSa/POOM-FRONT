import Menu from "../components/Menu";
import styles from "./Component1.module.css";

const Component1 = () => {
  return (
    <div className={styles.div}>
      <Menu />
      <main className={styles.inner}>
        <section className={styles.titlePanelParent}>
          <header className={styles.titlePanel}>
            <h2 className={styles.h2}>경제지표 아카이브</h2>
          </header>
          <div className={styles.filterPanel}>
            <div className={styles.filterPanelChild} />
            <div className={styles.filterOptions}>
              <img
                className={styles.vectorIcon}
                loading="lazy"
                alt=""
                src="/Vector1.svg"
              />
              <img className={styles.vectorIcon2} alt="" src="/Vector1.svg" />
              <img className={styles.vectorIcon3} alt="" src="/Vector1.svg" />
              <button className={styles.bg}>
                <div className={styles.bgChild} />
                <div className={styles.div2}>금리</div>
              </button>
              <button className={styles.bg2}>
                <div className={styles.bgItem} />
                <div className={styles.div3}>부동산</div>
              </button>
              <button className={styles.bg3}>
                <div className={styles.bgInner} />
                <div className={styles.div4}>금값</div>
              </button>
            </div>
            <img
              className={styles.image17Icon}
              loading="lazy"
              alt=""
              src="/image-17@2x.png"
            />
            <div className={styles.chartContainerWrapper}>
              <div className={styles.chartContainer}>
                <section className={styles.trendLabelsWrapper}>
                  <div className={styles.trendLabels}>
                    <div className={styles.valueAnalysis}>
                      <div className={styles.valueAnalysisChild} />
                      <h3 className={styles.h3}>금값 추이·예측</h3>
                    </div>
                    <div className={styles.valueAnalysis2}>
                      <div className={styles.valueAnalysisChild} />
                      <h3 className={styles.h3}>금값 추이·예측</h3>
                      <div className={styles.timeRange}>
                        <div className={styles.timePanel}>
                          <div className={styles.periodSelectionsWrapper}>
                            <div className={styles.periodSelections}>
                              <div className={styles.div5}>어제</div>
                              <div className={styles.div6}>내일</div>
                            </div>
                          </div>
                          <div className={styles.currentDay}>
                            <div className={styles.div7}>오늘</div>
                          </div>
                          <div className={styles.priceDisplay}>
                            <div className={styles.priceContainer}>
                              <div className={styles.currentData}>
                                <div className={styles.priceIndicator}>
                                  <h2 className={styles.emptySpace}>83</h2>
                                </div>
                                <div className={styles.priceChange}>
                                  <div className={styles.priceChangeChild} />
                                  <div className={styles.div8}>
                                    ▲ <br />
                                    +14.5%
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={styles.priceDivider}>
                              <div className={styles.priceDividerChild} />
                            </div>
                            <div className={styles.priceDetail}>
                              <div className={styles.detailContainer}>
                                <h1 className={styles.detailSpacing}>95</h1>
                                <div className={styles.valueInfo}>
                                  <div className={styles.div9}>현재가</div>
                                </div>
                              </div>
                            </div>
                            <div className={styles.forecastDivider}>
                              <div className={styles.secondAxis} />
                            </div>
                            <div className={styles.lowHighRange}>
                              <div className={styles.currentData}>
                                <div className={styles.rangeSpacing}>
                                  <h2 className={styles.rangeData}>85</h2>
                                </div>
                                <div className={styles.rangeIndicator}>
                                  <div className={styles.rangeIndicatorChild} />
                                  <div className={styles.div10}>
                                    ▼ <br />
                                    −10.5%
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <section className={styles.reportContainerParent}>
                  <div className={styles.reportContainer}>
                    <div className={styles.reportContainerChild} />
                    <b className={styles.b}>예측 기여도</b>
                    <div className={styles.visualContainer}>
                      <img
                        className={styles.goldDonutChart11}
                        loading="lazy"
                        alt=""
                        src="/gold-donut-chart-1-1@2x.png"
                      />
                    </div>
                  </div>
                  <div className={styles.reportContainer2}>
                    <div className={styles.reportContainerItem} />
                    <div className={styles.llmParent}>
                      <b className={styles.b}>{`LLM 보고서 `}</b>
                      <div className={styles.pb}>
                        향후 12개월간 금값은 3,890달러 수준으로 완만한 상승이
                        예상됩니다. 미 연준의 금리 인하 기조와 지정학적 불안이
                        주요 상승 요인입니다. 한국 기준금리는 2.50%까지 단계적
                        인하가 전망되며, 서울 아파트 시장의 회복세를 지지할
                        것으로 보입니다. PB 포트폴리오 관점에
                        <br /> . . . 더보기
                      </div>
                    </div>
                    <div className={styles.xgboostclaudeSonnetLstmWrapper}>
                      <div className={styles.xgboostclaudeSonnetLstm}>
                        생성: 2026-04-27 08:00 | XGBoost+Claude Sonnet 기반LSTM
                        | ECOS, FRED
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Component1;
