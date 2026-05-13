import FrameComponent from "../components/FrameComponent";
import ScrollbarVertical from "../components/ScrollbarVertical";
import styles from "./LLM.module.css";

const LLM = () => {
  return (
    <div className={styles.llm}>
      <div className={styles.llmChild} />
      <div className={styles.report}>
        <div className={styles.empty}>
          <h1 className={styles.h1}>트렌드 아카이브</h1>
          <div className={styles.emptyInner}>
            <div className={styles.vectorParent}>
              <img className={styles.vectorIcon} alt="" src="/Vector.svg" />
              <img className={styles.vectorIcon2} alt="" src="/Vector.svg" />
            </div>
          </div>
        </div>
      </div>
      <FrameComponent />
      <div className={styles.llmItem} />
      <div className={styles.llmInner} />
      <img className={styles.backgroundIcon} alt="" src="/Background.svg" />
      <main className={styles.frameParent}>
        <section className={styles.frameGroup}>
          <div className={styles.frameWrapper}>
            <div className={styles.frameContainer}>
              <div className={styles.wrapper}>
                <div className={styles.div}>캘린더</div>
              </div>
              <div className={styles.parent}>
                <div className={styles.div2}>트렌드 아카이브</div>
                <div className={styles.group}>
                  <div className={styles.div3}>고객관리</div>
                  <div className={styles.notificationWrapper}>
                    <div className={styles.notification}>Notification</div>
                  </div>
                  <div className={styles.settingsWrapper}>
                    <div className={styles.notification}>Settings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.rectangleParent}>
            <div className={styles.frameChild} />
            <div className={styles.innerReportWrapper}>
              <div className={styles.innerReport}>
                <div className={styles.shapWrapper}>
                  <h2 className={styles.shap}>
                    금리 예측 모델 SHAP 분석 보고서
                  </h2>
                </div>
                <img
                  className={styles.innerReportChild}
                  alt=""
                  src="/Group-109.svg"
                />
              </div>
            </div>
            <section className={styles.rectangleGroup}>
              <div className={styles.frameItem} />
              <div className={styles.top311Wrapper}>
                <div className={styles.top311Container}>
                  <p className={styles.p}>
                    <span className={styles.span}>
                      <span>기준 금리 추이 예측에 대한 근거</span>
                    </span>
                  </p>
                  <p className={styles.blankLine}>
                    <span className={styles.span}>
                      <span>&nbsp;</span>
                    </span>
                  </p>
                  <p className={styles.top3}>
                    <span className={styles.span}>
                      <span>
                        1. 글로벌 핵심 피처 요약 및 편향성 진단 (Top 3)
                      </span>
                    </span>
                  </p>
                  <p className={styles.blankLine}>
                    <span>
                      <span className={styles.span}>
                        1.1. 모델이 판단한 가장 중요한 예측 변수 3가지
                      </span>
                    </span>
                  </p>
                  <ul className={styles.yoyUsCpiYoyShap0}>
                    <li>
                      <span>
                        <span>
                          미국 소비자물가지수 YoY (us_cpi_yoy): 평균 SHAP 값
                          0.1247로 가장 중요한 변수 중 하나로, 특히 '동결'과
                          '인상' 클래스에서 높은 중요도를 보입니다. 이는 미국
                          경제의 인플레이션 상황이 한국의 금리 결정에 큰 영향을
                          미친다는 점에서 경제학적 상식에 부합합니다.
                        </span>
                      </span>
                    </li>
                    <li>
                      <span>
                        <span>
                          WTI 유가 YoY (wti_oil_yoy): 평균 SHAP 값 0.1220으로 두
                          번째로 중요한 변수입니다. '인상' 클래스에서 특히 높은
                          중요도를 보이며, 이는 유가 상승이 인플레이션 압력을
                          가중시켜 금리 인상 요인으로 작용할 수 있음을
                          시사합니다.
                        </span>
                      </span>
                    </li>
                    <li>
                      <span>
                        <span>
                          한국 소비자물가지수 YoY (kr_cpi_yoy): 평균 SHAP 값
                          0.1210으로 세 번째로 중요한 변수입니다. '인하'
                          클래스에서 가장 높은 중요도를 보이며, 이는 국내
                          인플레이션이 금리 인하의 주요 요인임을 나타냅니다.
                        </span>
                      </span>
                    </li>
                  </ul>
                  <p className={styles.blankLine}>
                    <span>
                      <span className={styles.span}>&nbsp;</span>
                    </span>
                  </p>
                  <p className={styles.blankLine}>
                    <span>
                      <span className={styles.span}>
                        1.2. 모델의 편향성 진단
                      </span>
                    </span>
                  </p>
                  <p className={styles.blankLine}>
                    <span>
                      <span>
                        모델이 상식적인 경제 지표에 기반하여 금리 변동을
                        예측하고 있으나, 일부 지표에 대한 과도한 의존이
                        우려됩니다. 예를 들어, WTI 유가 YoY는 '인상' 클래스에서
                        매우 높은 중요도를 보이지만, 이는 단순한 상관관계일 수
                        있습니다. 유가 변동은 다양한 외부 요인에 의해 영향을
                        받을 수 있으며, 금리 결정에 있어서는 보다 복합적인 경제
                        상황을 고려해야 합니다.
                      </span>
                    </span>
                  </p>
                  <p className={styles.blankLine}>
                    <span>
                      <span className={styles.span}>&nbsp;</span>
                    </span>
                  </p>
                  <p className={styles.blankLine}>
                    <span>
                      <span className={styles.span}>
                        2. 클래스별(인하/동결/인상) 특징적 인사이트 정리
                      </span>
                    </span>
                  </p>
                </div>
              </div>
              <ScrollbarVertical pageHeight="x 2" position="Top" />
            </section>
          </div>
        </section>
        <div className={styles.userDetailsWrapper}>
          <div className={styles.userDetails}>
            <div className={styles.notification}>김재욱</div>
            <div className={styles.privateBanker}>Private Banker</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LLM;
