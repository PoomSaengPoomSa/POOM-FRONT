import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./Bg.module.css";

const Bg = ({ className = "", bgWidth, bgAlignSelf }) => {
  const bgStyle = useMemo(() => {
    return {
      width: bgWidth,
      alignSelf: bgAlignSelf,
    };
  }, [bgWidth, bgAlignSelf]);

  return (
    <section className={[styles.bg, className].join(" ")} style={bgStyle}>
      <div className={styles.bgChild} />
      <div className={styles.frameParent}>
        <div className={styles.frameWrapper}>
          <div className={styles.frameGroup}>
            <div className={styles.parent}>
              <div className={styles.div}>나의 고객</div>
              <img
                className={styles.addBatonIcon}
                alt=""
                src="/Add-baton.svg"
              />
            </div>
            <div className={styles.bg2}>
              <div className={styles.bgItem} />
              <div className={styles.iconWrapper}>
                <img className={styles.icon} alt="" src="/icon@2x.png" />
              </div>
              <div className={styles.searchField}>
                <div className={styles.search}>Search</div>
                <input
                  className={styles.search2}
                  placeholder="Search"
                  type="text"
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.frameContainer}>
          <div className={styles.visitStatusWrapper}>
            <div className={styles.visitStatus}>
              <div className={styles.oo}>전체 고객</div>
              <div className={styles.div3}>오늘 방문</div>
            </div>
          </div>
          <div className={styles.lineParent}>
            <div className={styles.frameChild} />
            <div className={styles.frameDiv}>
              <div className={styles.lineGroup}>
                <div className={styles.frameItem} />
                <div className={styles.frameInner} />
              </div>
              <img className={styles.icon2} loading="lazy" alt="" src="/.svg" />
              <div className={styles.frameWrapper2}>
                <div className={styles.frameParent2}>
                  <div className={styles.frameParent3}>
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
                  <div className={styles.amWrapper}>
                    <div className={styles.oo}>10:00 AM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.frameWrapper3}>
          <div className={styles.frameParent4}>
            <div className={styles.ellipseWrapper}>
              <div className={styles.frameChild2} />
            </div>
            <div className={styles.ooGroup}>
              <div className={styles.oo}>박OO</div>
              <div className={styles.abcdefgnavercom0100000000Wrapper}>
                <div className={styles.abcdefgnavercom0100000000}>
                  erlkgjldfjgkld@gmail.com
                  <br />
                  010-1234-5678
                </div>
              </div>
            </div>
            <div className={styles.amWrapper}>
              <div className={styles.oo}>13:30 PM</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.frameParent5}>
        <div className={styles.frameWrapper4}>
          <div className={styles.frameParent4}>
            <div className={styles.ellipseWrapper}>
              <div className={styles.frameChild3} />
            </div>
            <div className={styles.ooGroup}>
              <div className={styles.oo}>이OO</div>
              <div className={styles.abcdefgnavercom0100000000Wrapper}>
                <div className={styles.abcdefgnavercom0100000000}>
                  lgkesd@gmail.com
                  <br />
                  010-9876-5432
                </div>
              </div>
            </div>
            <div className={styles.amWrapper}>
              <div className={styles.oo}>15:00 PM</div>
            </div>
          </div>
        </div>
        <div className={styles.lineDiv} />
      </div>
    </section>
  );
};

Bg.propTypes = {
  className: PropTypes.string,

  /** Style props */
  bgWidth: PropTypes.string,
  bgAlignSelf: PropTypes.string,
};

export default Bg;
