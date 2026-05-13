import PropTypes from "prop-types";
import styles from "./Bg1.module.css";

const Bg1 = ({ className = "" }) => {
  return (
    <div className={[styles.bg, className].join(" ")}>
      <div className={styles.bgChild} />
      <div className={styles.bgInner}>
        <div className={styles.frameParent}>
          <div className={styles.parent}>
            <div className={styles.div}>나의 고객</div>
            <img className={styles.addBatonIcon} alt="" src="/Add-baton.svg" />
          </div>
          <div className={styles.bg2}>
            <div className={styles.bgItem} />
            <div className={styles.iconWrapper}>
              <img className={styles.icon} alt="" src="/icon1@2x.png" />
            </div>
            <div className={styles.searchParent}>
              <div className={styles.search}>Search</div>
              <div className={styles.search2}>Search</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.frameGroup}>
        <div className={styles.wrapper}>
          <div className={styles.oo}>전체 고객</div>
        </div>
        <div className={styles.frameContainer}>
          <div className={styles.lineParent}>
            <div className={styles.frameChild} />
            <div className={styles.frameDiv}>
              <div className={styles.lineGroup}>
                <div className={styles.frameItem} />
                <div className={styles.frameInner} />
              </div>
              <img className={styles.icon2} alt="" src="/.svg" />
              <div className={styles.frameWrapper}>
                <div className={styles.frameParent2}>
                  <div className={styles.ellipseWrapper}>
                    <div className={styles.ellipseDiv} />
                  </div>
                  <div className={styles.ooParent}>
                    <div className={styles.oo}>김OO</div>
                    <div className={styles.abcdefgnavercom0100000000Wrapper}>
                      <div className={styles.abcdefgnavercom0100000000}>
                        abcdefg@naver.com
                        <br />
                        010-0000-0000
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.frameWrapper2}>
            <div className={styles.frameParent2}>
              <div className={styles.ellipseWrapper}>
                <div className={styles.frameChild2} />
              </div>
              <div className={styles.ooParent}>
                <div className={styles.oo}>박OO</div>
                <div className={styles.abcdefgnavercom0100000000Wrapper}>
                  <div className={styles.abcdefgnavercom0100000000}>
                    erlkgjldfjgkld@gmail.com
                    <br />
                    010-1234-5678
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.frameParent4}>
        <div className={styles.frameWrapper3}>
          <div className={styles.frameParent2}>
            <div className={styles.ellipseWrapper}>
              <div className={styles.frameChild3} />
            </div>
            <div className={styles.ooParent}>
              <div className={styles.oo}>이OO</div>
              <div className={styles.abcdefgnavercom0100000000Wrapper}>
                <div className={styles.abcdefgnavercom0100000000}>
                  lgkesd@gmail.com
                  <br />
                  010-9876-5432
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.itemDivider} />
      </div>
    </div>
  );
};

Bg1.propTypes = {
  className: PropTypes.string,
};

export default Bg1;
