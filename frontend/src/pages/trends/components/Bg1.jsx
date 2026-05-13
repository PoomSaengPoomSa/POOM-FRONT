import PropTypes from "prop-types";
import styles from "./Bg1.module.css";

const Bg1 = ({ className = "" }) => {
  return (
    <div className={[styles.bg, className].join(" ")}>
      <div className={styles.bgChild} />
      <div className={styles.headerArea}>
        <div className={styles.interactionHeader}>
          <div className={styles.headerContent}>
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
              <div className={styles.searchIconArea}>
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
        <div className={styles.clientFilter}>
          <div className={styles.clientSelection}>
            <div className={styles.visitStatus}>
              <div className={styles.oo}>전체 고객</div>
              <div className={styles.div3}>오늘 방문</div>
            </div>
          </div>
          <div className={styles.clientSeparator}>
            <div className={styles.clientSeparatorChild} />
            <div className={styles.clientList}>
              <div className={styles.clientDivider}>
                <div className={styles.clientDividerChild} />
                <div className={styles.clientDividerItem} />
              </div>
              <img
                className={styles.icon2}
                loading="lazy"
                alt=""
                src="/Rectangle-298.svg"
              />
              <div className={styles.clientInfoAreaOne}>
                <div className={styles.clientAreaOneParent}>
                  <div className={styles.clientAreaOne}>
                    <div className={styles.avatarCircleOneWrapper}>
                      <div className={styles.avatarCircleOne} />
                    </div>
                    <div className={styles.clientDetailsOne}>
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
        <div className={styles.clientInfoAreaTwo}>
          <div className={styles.clientAreaTwoParent}>
            <div className={styles.avatarCircleOneWrapper}>
              <div className={styles.clientAreaTwoChild} />
            </div>
            <div className={styles.clientDetailsOne}>
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
      <div className={styles.clientInfoAreaThree}>
        <div className={styles.clientAreaThreeWrapper}>
          <div className={styles.clientAreaTwoParent}>
            <div className={styles.avatarCircleOneWrapper}>
              <div className={styles.clientAreaThreeInnerChild} />
            </div>
            <div className={styles.clientDetailsOne}>
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
        <div className={styles.clientInfoAreaThreeChild} />
      </div>
    </div>
  );
};

Bg1.propTypes = {
  className: PropTypes.string,
};

export default Bg1;
