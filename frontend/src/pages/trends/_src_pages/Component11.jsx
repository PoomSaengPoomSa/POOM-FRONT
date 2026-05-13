import FrameComponent from "../components/FrameComponent";
import styles from "./Component11.module.css";

const Component2 = () => {
  return (
    <div className={styles.div}>
      <section className={styles.menu}>
        <div className={styles.bg} />
        <div className={styles.menuInner}>
          <div className={styles.frameParent}>
            <div className={styles.frameWrapper}>
              <div className={styles.frameGroup}>
                <button className={styles.calendarWrapper}>
                  <img
                    className={styles.calendarIcon}
                    loading="lazy"
                    alt=""
                    src="/Calendar2@2x.png"
                  />
                </button>
                <div className={styles.div2}>캘린더</div>
              </div>
            </div>
            <div className={styles.frameContainer}>
              <div className={styles.frameDiv}>
                <div className={styles.iconlyboldchartParent}>
                  <img
                    className={styles.iconlyboldchart}
                    alt=""
                    src="/Iconly-Bold-Chart@2x.png"
                  />
                  <div className={styles.frameChild} />
                </div>
                <div className={styles.wrapper}>
                  <div className={styles.div3}>트렌드 아카이브</div>
                </div>
              </div>
              <div className={styles.frameWrapper2}>
                <div className={styles.frameParent2}>
                  <div className={styles.iconlyboldactivityParent}>
                    <img
                      className={styles.iconlyboldactivity}
                      alt=""
                      src="/Iconly-Bold-Activity@2x.png"
                    />
                    <div className={styles.container}>
                      <div className={styles.div4}>고객관리</div>
                    </div>
                  </div>
                  <div className={styles.frameWrapper3}>
                    <div className={styles.iconlyboldactivityParent}>
                      <img
                        className={styles.iconlyboldnotification}
                        alt=""
                        src="/Iconly-Bold-Notification@2x.png"
                      />
                      <div className={styles.frame}>
                        <div className={styles.div2}>뉴스 버킷</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.frameParent3}>
          <div className={styles.ellipseParent}>
            <button className={styles.frameItem} />
            <img className={styles.image9Icon} alt="" src="/image-9@2x.png" />
          </div>
          <div className={styles.frameWrapper4}>
            <div className={styles.parent}>
              <div className={styles.div2}>김재욱</div>
              <div className={styles.privateBanker}>Private Banker</div>
            </div>
          </div>
          <div className={styles.logoutWrapper}>
            <img
              className={styles.logoutIcon}
              loading="lazy"
              alt=""
              src="/Logout@2x.png"
            />
          </div>
        </div>
        <img className={styles.image11Icon} alt="" src="/image-11@2x.png" />
      </section>
      <main className={styles.inner}>
        <section className={styles.frameSection}>
          <section className={styles.group}>
            <h2 className={styles.h2}>트렌드 아카이브</h2>
            <div className={styles.rectangleParent}>
              <div className={styles.frameInner} />
              <div className={styles.frameWrapper5}>
                <div className={styles.parent2}>
                  <h3 className={styles.h3}>뉴스 아카이브</h3>
                  <div className={styles.menuWrapper}>
                    <img
                      className={styles.menuIcon}
                      loading="lazy"
                      alt=""
                      src="/Menu@2x.png"
                    />
                  </div>
                </div>
              </div>
              <div className={styles.headingWrapper}>
                <div className={styles.heading}>
                  <b className={styles.b}>경제</b>
                  <img
                    className={styles.arrowDown2}
                    loading="lazy"
                    alt=""
                    src="/Arrow-Down-2.svg"
                  />
                  <b className={styles.b2}>정치</b>
                  <img
                    className={styles.arrowDown2}
                    loading="lazy"
                    alt=""
                    src="/Arrow-Down-2.svg"
                  />
                  <b className={styles.it}>{`IT/과학 `}</b>
                  <img
                    className={styles.arrowDown2}
                    loading="lazy"
                    alt=""
                    src="/Arrow-Down-2.svg"
                  />
                </div>
              </div>
              <div className={styles.frameParent4}>
                <div className={styles.lineParent}>
                  <div className={styles.lineDiv} />
                  <div className={styles.financeStatsWrapper}>
                    <nav className={styles.nav}>
                      <div className={styles.sellInMay}>
                        코스피 6,700 돌파 — 사상 최고치 3일 연속 경신, 'Sell in
                        May' 격언 유효 여부 주목
                      </div>
                      <div className={styles.vsVs}>
                        부산 북구갑 3자 구도 확정 — 하정우(민주당) vs
                        한동훈(무소속) vs 국민의힘 후보
                      </div>
                      <div className={styles.ai2026}>
                        스탠퍼드 AI 인덱스 2026 — 생성형 AI가 단순 기술이 아닌{" "}
                        <br />
                        "지배 인프라"로 산업·국가 시스템 재편
                      </div>
                    </nav>
                  </div>
                </div>
                <div className={styles.div7}>
                  <div className={styles.div8}>
                    삼성전자 어닝 서프라이즈 — 1분기 영업이익 57.2조 원(+756%),
                    주가 장중 23만 원 돌파·신고가
                  </div>
                  <div className={styles.div9}>
                    한동훈 "나와 이재명의 대리전" — 반이재명 구도 프레임 강조,
                    지역 공약 부재 지적도
                  </div>
                  <div className={styles.aiMs}>
                    오픈AI, MS 독점 파트너십 종료 — 아마존 AWS와도 협업 개시,{" "}
                    <br />
                    앤디 제시 CEO 공식 발표
                  </div>
                  <div className={styles.child} />
                  <img className={styles.item} alt="" src="/Line-91.svg" />
                </div>
                <div className={styles.financeStatsWrapper}>
                  <div className={styles.financeStats}>
                    <div className={styles.etf}>
                      반도체 ETF 수익률 폭등 — AI반도체 관련 ETF 4월 한 달간
                      40~45% 수익률 기록
                    </div>
                    <div className={styles.div10}>
                      미니 총선 14곳 확정 — 지방선거와 동시 실시, 민주당 우세
                      지역 12곳
                    </div>
                    <div className={styles.lgCns1}>
                      LG CNS 1분기 실적 — 매출 1조 3,150억·영업익 942억,
                      <br /> AI·클라우드 성장 견인
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <FrameComponent />
        </section>
      </main>
    </div>
  );
};

export default Component2;
