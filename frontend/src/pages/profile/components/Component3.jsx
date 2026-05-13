import ContactContainer from "./ContactContainer";
import InterestDetails from "./InterestDetails";
import NeedsActions from "./NeedsActions";
import PropTypes from "prop-types";
import styles from "./Component3.module.css";

const Component3 = ({ className = "" }) => {
  return (
    <div className={[styles.div, className].join(" ")}>
      <div className={styles.child} />
      <div className={styles.inner}>
        <div className={styles.frameParent}>
          <div className={styles.ellipseWrapper}>
            <div className={styles.frameChild} />
          </div>
          <div className={styles.ooWrapper}>
            <div className={styles.oo}>김OO</div>
          </div>
          <img className={styles.frameItem} alt="" src="/Group-143.svg" />
        </div>
      </div>
      <div className={styles.profileOptionsWrapper}>
        <div className={styles.profileOptions}>
          <div className={styles.list}>
            <div className={styles.listChild} />
            <div className={styles.div2}>프로필</div>
          </div>
          <div className={styles.board}>
            <div className={styles.boardChild} />
            <div className={styles.div3}>방문 브리핑</div>
          </div>
          <div className={styles.board2}>
            <div className={styles.boardItem} />
            <div className={styles.div4}>메모 어시스턴트</div>
          </div>
        </div>
      </div>
      <div className={styles.infoBackgroundParent}>
        <img className={styles.infoBackgroundIcon} alt="" src="/.svg" />
        <div className={styles.oo2}>김OO</div>
        <div className={styles.inputContainer}>
          <div className={styles.detailsContainer}>
            <div className={styles.detailLabels}>
              <div className={styles.div5}>총 자산</div>
              <div className={styles.inputBg}>
                <div className={styles.inputBgChild} />
                <div className={styles.div6}>16억</div>
              </div>
            </div>
            <div className={styles.detailLabels}>
              <div className={styles.div7}>연령</div>
              <div className={styles.inputBg2}>
                <div className={styles.inputBgChild} />
                <div className={styles.div8}>
                  <span>{`만 `}</span>
                  <span className={styles.span}>54</span>
                </div>
              </div>
            </div>
            <div className={styles.detailsContainerInner}>
              <div className={styles.parent}>
                <div className={styles.div9}>거래 시작일</div>
                <div className={styles.inputBg2}>
                  <div className={styles.inputBgChild} />
                  <div className={styles.emptyDate}>2018.03.05</div>
                </div>
              </div>
            </div>
          </div>
          <ContactContainer />
        </div>
      </div>
      <InterestDetails />
      <NeedsActions
        needsActionsAlignSelf="stretch"
        needsActionsWidth="unset"
        frameDivFlex="unset"
        divWidth="unset"
        divDisplay="unset"
      />
    </div>
  );
};

Component3.propTypes = {
  className: PropTypes.string,
};

export default Component3;
