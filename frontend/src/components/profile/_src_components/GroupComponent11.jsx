import ProfileSetup from "./ProfileSetup";
import Equity from "./Equity";
import PropTypes from "prop-types";
import styles from "./GroupComponent11.module.css";

const GroupComponent11 = ({ className = "" }) => {
  return (
    <div className={[styles.amParent, className].join(" ")}>
      <div className={styles.am}>10:00 AM</div>
      <div className={styles.div}>오늘 방문</div>
      <div className={styles.pm}>15:00 PM</div>
      <div className={styles.pm}>13:30 PM</div>
      <div className={styles.frameChild} />
      <div className={styles.newRegistration}>
        <div className={styles.registerHeader}>
          <div className={styles.customerSetup}>
            <div className={styles.customerCreation}>
              <div className={styles.div2}>신규 고객 등록</div>
            </div>
            <img
              className={styles.customerSetupChild}
              alt=""
              src="/Group-109.svg"
            />
          </div>
        </div>
        <div className={styles.frameParent}>
          <div className={styles.frameWrapper}>
            <div className={styles.rectangleParent}>
              <div className={styles.frameItem} />
              <div className={styles.selectionPanel}>
                <div className={styles.div3}>기본 정보</div>
              </div>
              <div className={styles.assetTrade}>
                <div className={styles.assetTradeChild} />
                <div className={styles.div4}>자산·거래</div>
              </div>
            </div>
          </div>
          <ProfileSetup />
          <div className={styles.asset}>
            <div className={styles.wealth}>
              <div className={styles.div5}>자산 정보</div>
              <div className={styles.metrics}>
                <div className={styles.holding}>
                  <div className={styles.property}>
                    <div className={styles.div6}>
                      <span>{`총자산 `}</span>
                      <span className={styles.span}>*</span>
                    </div>
                    <div className={styles.div7}>
                      <span>{`투자 성향 `}</span>
                      <span className={styles.span}>*</span>
                    </div>
                  </div>
                  <div className={styles.investment}>
                    <div className={styles.rectangleGroup}>
                      <div className={styles.frameInner} />
                      <div className={styles.div8}>예: 32억</div>
                    </div>
                    <div className={styles.rectangleContainer}>
                      <div className={styles.rectangleDiv} />
                      <img
                        className={styles.arrowDown6}
                        alt=""
                        src="/Arrow-Down-6.svg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.distribution}>
            <div className={styles.div9}>포트폴리오 비중 (%)</div>
            <div className={styles.breakdown}>
              <Equity prop="국내주식" prop1="해외주식" />
            </div>
          </div>
          <Equity
            equityFlex="unset"
            equityWidth="410px"
            prop="채권"
            prop1="현금 · 기타"
          />
        </div>
      </div>
      <div className={styles.navigator}>
        <div className={styles.control}>
          <div className={styles.groupDiv}>
            <div className={styles.saveButton} />
            <div className={styles.div10}>이전</div>
          </div>
        </div>
        <div className={styles.confirmAction}>
          <div className={styles.saveButtonParent}>
            <div className={styles.saveButton} />
            <div className={styles.div10}>취소</div>
          </div>
          <div className={styles.rectangleParent2}>
            <div className={styles.frameChild3} />
            <div className={styles.div10}>저장</div>
          </div>
        </div>
      </div>
    </div>
  );
};

GroupComponent11.propTypes = {
  className: PropTypes.string,
};

export default GroupComponent11;
