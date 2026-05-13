import PropTypes from "prop-types";
import styles from "./GroupComponent2.module.css";

const GroupComponent2 = ({ className = "" }) => {
  return (
    <section className={[styles.rectangleParent, className].join(" ")}>
      <img className={styles.frameChild} alt="" src="/.svg" />
      <div className={styles.clientDetails}>
        <div className={styles.clientSegment}>
          <div className={styles.frameParent}>
            <div className={styles.rectangleGroup}>
              <img className={styles.frameItem} alt="" src="/.svg" />
              <div className={styles.photoImage}>
                <div className={styles.div}>김</div>
                <img
                  className={styles.photoDevice1Icon}
                  alt=""
                  src="/photo-device-1@2x.png"
                />
              </div>
            </div>
            <div className={styles.clientInfo}>
              <div className={styles.ooWrapper}>
                <h1 className={styles.oo}>김OO</h1>
              </div>
              <div className={styles.ceo}>중견기업 CEO</div>
            </div>
            <div className={styles.rectangleContainer}>
              <div className={styles.frameInner} />
              <div className={styles.vip}>VIP</div>
            </div>
            <div className={styles.frameDiv}>
              <div className={styles.rectangleDiv} />
              <div className={styles.div2}>중립형</div>
            </div>
          </div>
        </div>
        <button className={styles.inputBg}>
          <div className={styles.inputBgChild} />
          <div className={styles.div3}>연락하기</div>
        </button>
      </div>
      <div className={styles.infoContainerWrapper}>
        <div className={styles.infoContainer}>
          <div className={styles.frameGroup}>
            <div className={styles.frameWrapper}>
              <div className={styles.frameContainer}>
                <div className={styles.parent}>
                  <div className={styles.div4}>총 자산</div>
                  <input
                    className={styles.inputBg2}
                    placeholder="16억"
                    type="text"
                  />
                </div>
                <div className={styles.parent}>
                  <div className={styles.div5}>최근 상담</div>
                  <input
                    className={styles.inputBg3}
                    placeholder="2026.01.11"
                    type="text"
                  />
                </div>
              </div>
            </div>
            <div className={styles.frameWrapper}>
              <div className={styles.frameContainer}>
                <div className={styles.parent}>
                  <div className={styles.div6}>연령</div>
                  <input
                    className={styles.inputBg4}
                    placeholder="만 54"
                    type="text"
                  />
                </div>
                <div className={styles.parent}>
                  <div className={styles.div5}>다음 방문</div>
                  <input
                    className={styles.inputBg3}
                    placeholder="2026.05.02"
                    type="text"
                  />
                </div>
              </div>
            </div>
            <div className={styles.otherDetails}>
              <div className={styles.parent3}>
                <div className={styles.div8}>거래 시작일</div>
                <input
                  className={styles.inputBg3}
                  placeholder="2018.03.05"
                  type="text"
                />
              </div>
              <div className={styles.div6}>연락처</div>
              <input
                className={styles.inputBg3}
                placeholder="010-0000-0000"
                type="text"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

GroupComponent2.propTypes = {
  className: PropTypes.string,
};

export default GroupComponent2;
