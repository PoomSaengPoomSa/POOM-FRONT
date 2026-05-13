import PropTypes from "prop-types";
import styles from "./Bg.module.css";

const Bg = ({ className = "" }) => {
  return (
    <div className={[styles.bg, className].join(" ")}>
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
              <div className={styles.searchInput}>
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
          <div className={styles.visitSummaryWrapper}>
            <div className={styles.visitSummary}>
              <div className={styles.oo}>전체 고객</div>
              <div className={styles.div3}>오늘 방문</div>
            </div>
          </div>
          <div className={styles.lineParent}>
            <div className={styles.frameChild} />
            <div className={styles.contactList}>
              <div className={styles.horizontalDividers}>
                <div className={styles.listSeparator} />
                <div className={styles.entrySeparator} />
              </div>
              <img
                className={styles.icon2}
                loading="lazy"
                alt=""
                src="/Background-Rect.svg"
              />
              <div className={styles.profileEntry}>
                <div className={styles.contactInfo}>
                  <div className={styles.avatarPlaceholderParent}>
                    <div className={styles.avatarPlaceholder}>
                      <div className={styles.initialsCircle} />
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
        <div className={styles.contactEntryTwo}>
          <div className={styles.infoContainer}>
            <div className={styles.avatarPlaceholder}>
              <div className={styles.frameItem} />
            </div>
            <div className={styles.personDetails}>
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
      <div className={styles.contactEntryThree}>
        <div className={styles.identityInfoWrapper}>
          <div className={styles.infoContainer}>
            <div className={styles.avatarPlaceholder}>
              <div className={styles.avatarCircle} />
            </div>
            <div className={styles.personDetails}>
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
        <div className={styles.finalSeparator} />
      </div>
    </div>
  );
};

Bg.propTypes = {
  className: PropTypes.string,
};

export default Bg;
