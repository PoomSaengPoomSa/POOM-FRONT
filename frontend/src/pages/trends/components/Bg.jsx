import PropTypes from "prop-types";
import styles from "./Bg.module.css";

const Bg = ({ className = "" }) => {
  return (
    <div className={[styles.bg, className].join(" ")}>
      <div className={styles.bgChild} />
      <div className={styles.profileBackground}>
        <div className={styles.profileHeader}>
          <div className={styles.profileHeaderChild} />
        </div>
        <div className={styles.ooWrapper}>
          <div className={styles.oo}>김OO</div>
        </div>
        <img
          className={styles.profileBackgroundChild}
          alt=""
          src="/Group-143.svg"
        />
      </div>
      <div className={styles.profileDetail}>
        <nav className={styles.listParent}>
          <button className={styles.list}>
            <div className={styles.listChild} />
            <div className={styles.div}>프로필</div>
          </button>
          <button className={styles.board}>
            <div className={styles.boardChild} />
            <div className={styles.div2}>고객 대시보드</div>
          </button>
          <button className={styles.board2}>
            <div className={styles.boardItem} />
            <b className={styles.b}>방문 브리핑</b>
          </button>
          <button className={styles.board3}>
            <div className={styles.boardInner} />
            <div className={styles.div2}>메모 어시스턴트</div>
          </button>
        </nav>
        <div className={styles.visitBriefingTitle}>
          <b className={styles.b2}>방문 예정 브리핑</b>
        </div>
      </div>
      <section className={styles.briefingDetails}>
        <div className={styles.briefingInfo}>
          <div className={styles.parent}>
            <b className={styles.b3}>방문일정</b>
            <div className={styles.timeDivider}>2026.05.06</div>
          </div>
          <div className={styles.group}>
            <b className={styles.b4}>브리핑 요약</b>
            <div className={styles.fed}>
              오전 10시 방문 예정, 최근 달러 약세 영향으로 해외 자산 비중 조정
              니즈 있음. 국내 리츠 상품 3종 비교안 준비 필요. 코스닥 1,200 돌파.
              Fed 동결 뉴스 관련 설명 준비 권장.
            </div>
          </div>
          <div className={styles.container}>
            <b className={styles.b5}>주요 니즈</b>
            <div className={styles.fed}>
              달러 자산 비중 축소/국내 리츠 편입 검토.
            </div>
          </div>
          <div className={styles.frameDiv}>
            <b className={styles.b5}>준비 사항</b>
            <div className={styles.timeDivider}>리츠 상품 비교안 준비</div>
          </div>
          <img
            className={styles.icon}
            loading="lazy"
            alt=""
            src="/Rectangle-298.svg"
          />
        </div>
      </section>
      <div className={styles.briefingActions}>
        <div className={styles.actionButtons}>
          <div className={styles.dispatchCalendarButtonsParent}>
            <div className={styles.dispatchCalendarButtons}>
              <button className={styles.rectangleParent}>
                <img
                  className={styles.frameChild}
                  alt=""
                  src="/Rectangle-298.svg"
                />
                <div className={styles.div6}>슬랙으로 발송</div>
              </button>
              <div className={styles.rectangleGroup}>
                <img
                  className={styles.frameChild}
                  alt=""
                  src="/Rectangle-298.svg"
                />
                <div className={styles.parent2}>
                  <div className={styles.div7}>캘린더 추가</div>
                  <div className={styles.parent3}>
                    <div className={styles.div8}>캘린더 추가</div>
                    <div className={styles.div9}>캘린더 추가</div>
                  </div>
                </div>
              </div>
              <div className={styles.finalCalendarOption}>
                <div className={styles.div10}>캘린더 추가</div>
                <img
                  className={styles.bgIcon}
                  alt=""
                  src="/Rectangle-298.svg"
                />
                <div className={styles.div11}>
                  <span>재생성</span>
                  <span className={styles.span}>{`     `}</span>
                </div>
              </div>
            </div>
            <div className={styles.briefingDetailsClick}>
              <div className={styles.div12}>
                4건 · 클릭하면 메모와 요약 열림
              </div>
            </div>
          </div>
          <div className={styles.dataChartView}>
            <img className={styles.pieChartIcon} alt="" src="/pie-chart.svg" />
          </div>
        </div>
      </div>
    </div>
  );
};

Bg.propTypes = {
  className: PropTypes.string,
};

export default Bg;
