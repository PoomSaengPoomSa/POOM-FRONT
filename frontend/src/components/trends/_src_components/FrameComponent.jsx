import BG2 from "./BG";
import PropTypes from "prop-types";
import styles from "./FrameComponent.module.css";

const FrameComponent = ({ className = "" }) => {
  return (
    <section className={[styles.bgParent, className].join(" ")}>
      <BG2 />
      <div className={styles.frameWrapper}>
        <div className={styles.frameParent}>
          <div className={styles.vectorWrapper}>
            <img className={styles.vectorIcon} alt="" src="/Vector.svg" />
          </div>
          <h3 className={styles.h3}>경제지표 아카이브</h3>
        </div>
      </div>
      <div className={styles.frameGroup}>
        <div className={styles.rectangleParent}>
          <div className={styles.frameChild} />
          <div className={styles.priceElements}>
            <h3 className={styles.h32}>금값</h3>
            <div className={styles.goldPriceWrapper}>
              <div className={styles.goldPrice}>Gold Price</div>
            </div>
            <div className={styles.priceElementsInner}>
              <div className={styles.rectangleGroup}>
                <div className={styles.frameItem} />
                <img
                  className={styles.streamlineSharpgoldSolidIcon}
                  loading="lazy"
                  alt=""
                  src="/streamline-sharp-gold-solid.svg"
                />
              </div>
            </div>
            <img
              className={styles.priceElementsChild}
              alt=""
              src="/Group-689.svg"
            />
            <div className={styles.rectangleContainer}>
              <div className={styles.frameInner} />
              <img
                className={styles.polygonIcon}
                loading="lazy"
                alt=""
                src="/Polygon-3.svg"
              />
              <img
                className={styles.frameChild2}
                loading="lazy"
                alt=""
                src="/Polygon-3.svg"
              />
            </div>
            <div className={styles.frameContainer}>
              <div className={styles.frameDiv}>
                <div className={styles.wrapper}>
                  <div className={styles.div}>어제</div>
                </div>
                <h2 className={styles.dateBlank}>83</h2>
              </div>
              <div className={styles.frameParent2}>
                <div className={styles.container}>
                  <div className={styles.div}>오늘</div>
                </div>
                <h1 className={styles.datePlaceholder}>95</h1>
              </div>
              <div className={styles.frameDiv}>
                <div className={styles.wrapper}>
                  <div className={styles.div}>내일</div>
                </div>
                <h2 className={styles.dateBlank}>85</h2>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.rectangleParent2}>
          <div className={styles.frameChild} />
          <div className={styles.wrapper2}>
            <h3 className={styles.h33}>부동산 가격지수</h3>
          </div>
          <div className={styles.frameParent4}>
            <div className={styles.realEstatePriceParent}>
              <div className={styles.realEstatePrice}>Real Estate Price</div>
              <div className={styles.groupDiv}>
                <div className={styles.rectangleGroup}>
                  <div className={styles.frameChild3} />
                  <img
                    className={styles.gridiconshouse}
                    loading="lazy"
                    alt=""
                    src="/gridicons-house.svg"
                  />
                </div>
              </div>
              <img
                className={styles.priceElementsChild}
                alt=""
                src="/Group-693.svg"
              />
            </div>
            <div className={styles.rectangleParent4}>
              <div className={styles.frameChild4} />
              <div className={styles.frameWrapper2}>
                <div className={styles.frameParent5}>
                  <div className={styles.wrapper3}>
                    <div className={styles.div4}>어제</div>
                  </div>
                  <h3 className={styles.unusedOne}>100.4</h3>
                </div>
              </div>
              <div className={styles.vectorContainer}>
                <img
                  className={styles.frameChild5}
                  loading="lazy"
                  alt=""
                  src="/Polygon-3.svg"
                />
              </div>
              <div className={styles.frameParent6}>
                <div className={styles.wrapper4}>
                  <div className={styles.div4}>오늘</div>
                </div>
                <h2 className={styles.separator}>100.3</h2>
              </div>
              <div className={styles.vectorContainer}>
                <img
                  className={styles.frameChild5}
                  loading="lazy"
                  alt=""
                  src="/Polygon-3.svg"
                />
              </div>
              <div className={styles.frameWrapper2}>
                <div className={styles.frameParent5}>
                  <div className={styles.wrapper3}>
                    <div className={styles.div4}>내일</div>
                  </div>
                  <h3 className={styles.unusedOne}>100.2</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.rectangleParent5}>
          <div className={styles.frameChild} />
          <div className={styles.wrapper6}>
            <h3 className={styles.h34}>기준 금리</h3>
          </div>
          <div className={styles.frameParent8}>
            <div className={styles.baseRateParent}>
              <div className={styles.baseRate}>Base Rate</div>
              <div className={styles.frameWrapper4}>
                <div className={styles.rectangleGroup}>
                  <div className={styles.frameChild8} />
                  <img
                    className={styles.rivetIconsmoney}
                    loading="lazy"
                    alt=""
                    src="/rivet-icons-money.svg"
                  />
                </div>
              </div>
              <img
                className={styles.priceElementsChild}
                alt=""
                src="/Group-693.svg"
              />
            </div>
            <div className={styles.rectangleParent7}>
              <div className={styles.frameChild4} />
              <div className={styles.frameParent9}>
                <div className={styles.wrapper7}>
                  <div className={styles.div4}>지난 달</div>
                </div>
                <h2 className={styles.unusedTwo}>2.0</h2>
              </div>
              <div className={styles.vectorWrapper2}>
                <img
                  className={styles.frameChild5}
                  loading="lazy"
                  alt=""
                  src="/Polygon-3.svg"
                />
              </div>
              <div className={styles.frameParent10}>
                <div className={styles.wrapper8}>
                  <div className={styles.div4}>이번 달</div>
                </div>
                <h2 className={styles.h2}>2.5</h2>
              </div>
              <div className={styles.vectorWrapper2}>
                <img
                  className={styles.frameChild5}
                  loading="lazy"
                  alt=""
                  src="/Polygon-3.svg"
                />
              </div>
              <div className={styles.frameParent9}>
                <div className={styles.wrapper9}>
                  <div className={styles.div4}>다음 달</div>
                </div>
                <h2 className={styles.unusedTwo}>2.0</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

FrameComponent.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent;
