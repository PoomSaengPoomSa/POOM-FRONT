import FrameComponent from "../components/FrameComponent";
import Component21 from "../components/Component21";
import Bg from "../components/Bg";
import styles from "./Component1.module.css";

const Component1 = () => {
  return (
    <div className={styles.div}>
      <FrameComponent />
      <main className={styles.employeeSearchAreaWrapper}>
        <section className={styles.employeeSearchArea}>
          <div className={styles.searchContainer}>
            <div className={styles.searchParent}>
              <div className={styles.search}>
                <div className={styles.searchChild} />
                <div className={styles.searchWrapper}>
                  <img className={styles.searchIcon} alt="" src="/Search.svg" />
                </div>
                <input
                  className={styles.input}
                  placeholder="사번 또는 이름 검색"
                  type="text"
                />
              </div>
              <div className={styles.search2}>
                <div className={styles.searchItem} />
                <div className={styles.div2}>전체지점</div>
                <div className={styles.arrowDown2Wrapper}>
                  <img
                    className={styles.arrowDown2}
                    alt=""
                    src="/Arrow-Down-2.svg"
                  />
                </div>
              </div>
            </div>
            <div className={styles.div3}>
              <img className={styles.bgIcon} alt="" src="/bg.svg" />
              <div className={styles.employeeListHeader}>
                <div className={styles.listHeaderContainer}>
                  <h3 className={styles.h3}>직원 계정 목록</h3>
                </div>
                <div className={styles.div4}>총 직원수 5명</div>
              </div>
              <div className={styles.tableHeaderRow}>
                <div className={styles.identifierColumn}>
                  <div className={styles.employeeIdColumnParent}>
                    <div className={styles.employeeIdColumn}>
                      <div className={styles.div5}>사번</div>
                      <div className={styles.idSort}>
                        <img
                          className={styles.arrowDown22}
                          loading="lazy"
                          alt=""
                          src="/Arrow-Down-2.svg"
                        />
                      </div>
                    </div>
                    <div className={styles.employeeInfoColumn}>
                      <div className={styles.div6}>이름 / 지점</div>
                      <div className={styles.infoSort}>
                        <img
                          className={styles.arrowDown3}
                          alt=""
                          src="/Arrow-Down-2.svg"
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.managementActions}>
                    <div className={styles.div2}>담당 고객 수</div>
                    <div className={styles.div2}>발령 처리</div>
                  </div>
                </div>
              </div>
              <section className={styles.employeeRows}>
                <div className={styles.bgParent}>
                  <div className={styles.bg}>
                    <div className={styles.bgChild} />
                    <div className={styles.frameParent}>
                      <div className={styles.dividerWrapper}>
                        <div className={styles.divider}>100021</div>
                      </div>
                      <div className={styles.imageParent}>
                        <div className={styles.image}>
                          <div className={styles.imageBackground} />
                          <div className={styles.div9}>이</div>
                        </div>
                        <div className={styles.parent}>
                          <div className={styles.div10}>이수현</div>
                          <div className={styles.div11}>강남지점</div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.wrapper}>
                      <div className={styles.div12}>18명</div>
                    </div>
                    <div className={styles.component1Wrapper}>
                      <button className={styles.component1}>
                        <img
                          className={styles.component1Child}
                          alt=""
                          src="/Rectangle-364.svg"
                        />
                        <div className={styles.div13}>발령처리</div>
                      </button>
                    </div>
                  </div>
                  <div className={styles.bg2}>
                    <div className={styles.bgItem} />
                    <div className={styles.frameGroup}>
                      <div className={styles.container}>
                        <div className={styles.div14}>100089</div>
                      </div>
                      <div className={styles.imageParent}>
                        <div className={styles.image2}>
                          <div className={styles.imageChild} />
                          <div className={styles.div15}>이</div>
                        </div>
                        <div className={styles.group}>
                          <div className={styles.div16}>이종혁</div>
                          <div className={styles.div17}>강남지점</div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.frame}>
                      <div className={styles.div18}>41명</div>
                    </div>
                    <div className={styles.component1Container}>
                      <Component21 />
                    </div>
                  </div>
                </div>
                <div className={styles.waitingEmployeeRow}>
                  <div className={styles.bg3}>
                    <div className={styles.bgInner} />
                    <div className={styles.div19}>0명</div>
                    <div className={styles.div20}>이주리</div>
                    <div className={styles.separator}>100102</div>
                    <div className={styles.div21}>발령 대기 압구정→강남</div>
                    <button className={styles.component12}>
                      <img
                        className={styles.component1Item}
                        alt=""
                        src="/Rectangle-364.svg"
                      />
                      <div className={styles.llm}>발령처리</div>
                    </button>
                    <div className={styles.image3}>
                      <div className={styles.imageItem} />
                      <div className={styles.div22}>이</div>
                    </div>
                  </div>
                  <div className={styles.bg4}>
                    <div className={styles.rectangleDiv} />
                    <div className={styles.div23}>19명</div>
                    <div className={styles.div24}>김수빈</div>
                    <div className={styles.div25}>
                      100088
                      <br />
                    </div>
                    <div className={styles.div26}>여의도지점</div>
                    <Component21
                      component1Display="unset"
                      component1AlignItems="unset"
                      component1Padding="unset"
                      component1Position="absolute"
                      component1Isolation="unset"
                      component1Top="19.2px"
                      component1Left="726.7px"
                      rectangleIconMargin="unset"
                      rectangleIconTop="0%"
                      rectangleIconRight="0%"
                      rectangleIconBottom="0%"
                      rectangleIconLeft="0%"
                      lLMHeight="unset"
                      lLMWidth="unset"
                      lLMPosition="absolute"
                      lLMDisplay="unset"
                      lLMTop="25.77%"
                      lLMLeft="0.71%"
                    />
                    <div className={styles.image4}>
                      <div className={styles.imageInner} />
                      <div className={styles.div27}>김</div>
                    </div>
                  </div>
                </div>
                <div className={styles.bg5}>
                  <div className={styles.bgChild2} />
                  <div className={styles.attendanceSummaryParent}>
                    <div className={styles.attendanceSummary}>
                      <div className={styles.leaveLabel}>100118</div>
                    </div>
                    <div className={styles.imageParent}>
                      <div className={styles.image5}>
                        <div className={styles.leaveIndicator} />
                        <div className={styles.div28}>유</div>
                      </div>
                      <div className={styles.employeeLeaveDetails}>
                        <div className={styles.nameLocationData}>
                          <div className={styles.div29}>유채린</div>
                          <div className={styles.div30}>여의도지점</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.frame}>
                    <div className={styles.div18}>32명</div>
                  </div>
                  <div className={styles.buttonComponent}>
                    <Component21
                      component1Display="flex"
                      component1AlignItems="flex-start"
                      component1Padding="6.7px 0.6px 1.3px"
                      component1Position="relative"
                      component1Isolation="isolate"
                      component1Top="unset"
                      component1Left="unset"
                      rectangleIconMargin="0 !important"
                      rectangleIconTop="0px"
                      rectangleIconRight="0px"
                      rectangleIconBottom="0px"
                      rectangleIconLeft="0px"
                      lLMHeight="18px"
                      lLMWidth="67.9px"
                      lLMPosition="relative"
                      lLMDisplay="inline-block"
                      lLMTop="unset"
                      lLMLeft="unset"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>
          <Bg />
        </section>
      </main>
    </div>
  );
};

export default Component1;
