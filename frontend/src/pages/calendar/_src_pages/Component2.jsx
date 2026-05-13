import FrameComponent1 from "../components/FrameComponent1";
import styles from "./Component2.module.css";

const Component2 = () => {
  return (
    <div className={styles.div}>
      <section className={styles.menuParent}>
        <div className={styles.menu}>
          <div className={styles.bg} />
          <div className={styles.div2}>뉴스 버킷</div>
          <img
            className={styles.iconlyboldnotification}
            loading="lazy"
            alt=""
            src="/Iconly-Bold-Notification@2x.png"
          />
          <div className={styles.div3}>트렌드 아카이브</div>
          <div className={styles.div4}>고객관리</div>
          <img
            className={styles.iconlyboldchart}
            loading="lazy"
            alt=""
            src="/Iconly-Bold-Chart@2x.png"
          />
          <img
            className={styles.iconlyboldactivity}
            loading="lazy"
            alt=""
            src="/Iconly-Bold-Activity@2x.png"
          />
          <div className={styles.div5}>캘린더</div>
          <div className={styles.div6}>김재욱</div>
          <div className={styles.privateBanker}>Private Banker</div>
          <img
            className={styles.logoutIcon}
            loading="lazy"
            alt=""
            src="/Logout@2x.png"
          />
          <div className={styles.menuChild} />
          <img
            className={styles.image9Icon}
            loading="lazy"
            alt=""
            src="/image-9@2x.png"
          />
          <img className={styles.image11Icon} alt="" src="/image-11@2x.png" />
        </div>
        <div className={styles.rectangleParent}>
          <div className={styles.frameChild} />
          <img
            className={styles.calendarIcon}
            loading="lazy"
            alt=""
            src="/Calendar@2x.png"
          />
        </div>
      </section>
      <section className={styles.scheduleHeaderWrapper}>
        <div className={styles.scheduleHeader}>
          <div className={styles.calendarWrapper}>
            <h3 className={styles.calendar}>Calendar</h3>
          </div>
          <div className={styles.createSheduleCard}>
            <img className={styles.bgIcon} alt="" src="/bg.svg" />
            <div className={styles.frameParent}>
              <div className={styles.frameGroup}>
                <div className={styles.frameWrapper}>
                  <div className={styles.creatreScheduleBtnParent}>
                    <button className={styles.creatreScheduleBtn}>
                      <div className={styles.creatreScheduleBtnChild} />
                      <div className={styles.buttonArea}>
                        <img
                          className={styles.buttonAreaChild}
                          alt=""
                          src="/Group-168.svg"
                        />
                      </div>
                      <div className={styles.div7}>일정 등록</div>
                    </button>
                    <div className={styles.calenderBg}>
                      <div className={styles.calenderBgChild} />
                      <div className={styles.monthArea}>
                        <div className={styles.monthControl}>
                          <div className={styles.may22026}>May 2, 2026</div>
                          <div className={styles.arrowWrapper}>
                            <img
                              className={styles.arrowIcon}
                              loading="lazy"
                              alt=""
                              src="/arrow.svg"
                            />
                          </div>
                        </div>
                      </div>
                      <div className={styles.weekdayArea}>
                        <div className={styles.weekdayHeader}>
                          <div className={styles.weekdayLabels}>
                            <div className={styles.weekdayContainer}>
                              <div className={styles.dayLabelsParent}>
                                <div className={styles.dayLabels}>
                                  <div className={styles.s}>S</div>
                                </div>
                                <div className={styles.div8}>29</div>
                              </div>
                              <div className={styles.dayLabelsParent}>
                                <div className={styles.dayLabels}>
                                  <div className={styles.s}>S</div>
                                </div>
                                <div className={styles.div8}>30</div>
                              </div>
                              <div className={styles.mParent}>
                                <div className={styles.s}>M</div>
                                <div className={styles.semicolonWrapper}>
                                  <div className={styles.semicolon}>1</div>
                                </div>
                              </div>
                              <div className={styles.tParent}>
                                <div className={styles.s}>T</div>
                                <div className={styles.div10}>2</div>
                              </div>
                              <div className={styles.tParent}>
                                <div className={styles.s}>W</div>
                                <div className={styles.wrapper}>
                                  <div className={styles.semicolon}>3</div>
                                </div>
                              </div>
                              <div className={styles.tGroup}>
                                <div className={styles.s}>T</div>
                                <div className={styles.div10}>4</div>
                              </div>
                              <div className={styles.fParent}>
                                <div className={styles.s}>F</div>
                                <div className={styles.div10}>5</div>
                              </div>
                            </div>
                          </div>
                          <div className={styles.dayArea}>
                            <img
                              className={styles.dayAreaChild}
                              loading="lazy"
                              alt=""
                              src="/bg.svg"
                            />
                            <div className={styles.dayContainer}>
                              <div className={styles.dayContainerChild} />
                              <div className={styles.daySeparatorWrapper}>
                                <div className={styles.daySeparator}>6</div>
                              </div>
                              <div className={styles.daySeparatorWrapper}>
                                <div className={styles.daySeparator}>7</div>
                              </div>
                              <div className={styles.daySeparatorWrapper}>
                                <div className={styles.daySeparator}>8</div>
                              </div>
                              <div className={styles.frameDiv}>
                                <div className={styles.div16}>9</div>
                              </div>
                              <div className={styles.div17}>10</div>
                              <div className={styles.div17}>11</div>
                              <div className={styles.div17}>12</div>
                            </div>
                          </div>
                        </div>
                        <div className={styles.numberArea}>
                          <div className={styles.dayNumberContainer}>
                            <div className={styles.semicolon}>13</div>
                            <div className={styles.semicolon}>14</div>
                            <div className={styles.semicolon}>15</div>
                            <div className={styles.semicolon}>16</div>
                            <div className={styles.semicolon}>17</div>
                            <div className={styles.semicolon}>18</div>
                            <div className={styles.semicolon}>19</div>
                          </div>
                        </div>
                      </div>
                      <div className={styles.eventArea}>
                        <div className={styles.dayNumberContainer}>
                          <div className={styles.eventSeparatorsParent}>
                            <div className={styles.semicolon}>20</div>
                            <div className={styles.semicolon}>27</div>
                          </div>
                          <div className={styles.eventSeparatorsParent}>
                            <div className={styles.semicolon}>21</div>
                            <div className={styles.semicolon}>28</div>
                          </div>
                          <div className={styles.eventSeparatorsParent}>
                            <div className={styles.semicolon}>22</div>
                            <div className={styles.semicolon}>29</div>
                          </div>
                          <div className={styles.eventSeparatorsParent}>
                            <div className={styles.semicolon}>23</div>
                            <div className={styles.semicolon}>30</div>
                          </div>
                          <div className={styles.eventSeparatorsParent}>
                            <div className={styles.semicolon}>24</div>
                            <div className={styles.semicolon}>31</div>
                          </div>
                          <div className={styles.parent4}>
                            <div className={styles.semicolon}>25</div>
                            <div className={styles.eventSemicolonWrapper}>
                              <div className={styles.semicolon}>1</div>
                            </div>
                          </div>
                          <div className={styles.parent4}>
                            <div className={styles.semicolon}>26</div>
                            <div className={styles.eventSemicolonWrapper}>
                              <div className={styles.semicolon}>2</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.frameParent2}>
                  <div className={styles.wrapper3}>
                    <div className={styles.div39}>오늘의 일정</div>
                  </div>
                  <div className={styles.detailContainer}>
                    <div className={styles.eventSpaceParent}>
                      <div className={styles.eventSpace}>
                        <div className={styles.spaceFiller}>08:00 ~ 09:00</div>
                      </div>
                      <div className={styles.oo}>이OO 고객님 미팅</div>
                    </div>
                  </div>
                  <div className={styles.detailContainer2}>
                    <img
                      className={styles.sectionLineIcon}
                      loading="lazy"
                      alt=""
                      src="/section-line.svg"
                    />
                  </div>
                  <div className={styles.detailContainer3}>
                    <div className={styles.frameParent3}>
                      <div className={styles.eventSpace}>
                        <div className={styles.div40}>12:00 ~ 13:00</div>
                      </div>
                      <div className={styles.div41}>점심 약속</div>
                    </div>
                  </div>
                  <div className={styles.detailContainer4}>
                    <img
                      className={styles.sectionLineIcon}
                      loading="lazy"
                      alt=""
                      src="/section-line.svg"
                    />
                  </div>
                  <div className={styles.detailContainer3}>
                    <div className={styles.frameParent3}>
                      <div className={styles.eventSpace}>
                        <div className={styles.div40}>13:30 ~ 14:30</div>
                      </div>
                      <div className={styles.div41}>내부 회의</div>
                    </div>
                  </div>
                  <img
                    className={styles.frameItem}
                    loading="lazy"
                    alt=""
                    src="/section-line.svg"
                  />
                </div>
              </div>
              <img
                className={styles.frameItem}
                loading="lazy"
                alt=""
                src="/section-line.svg"
              />
            </div>
            <div className={styles.myScheduleBtnWrapper}>
              <button className={styles.myScheduleBtn}>
                <div className={styles.buttonBackground} />
                <div className={styles.mySchedule}>My Schedule</div>
              </button>
            </div>
          </div>
        </div>
      </section>
      <main className={styles.contentHeaderWrapper}>
        <div className={styles.contentHeader}>
          <div className={styles.viewOptions}>
            <nav className={styles.viewButtons}>
              <button className={styles.rectangleGroup}>
                <div className={styles.frameInner} />
                <div className={styles.day}>Day</div>
              </button>
              <button className={styles.rectangleContainer}>
                <div className={styles.rectangleDiv} />
                <div className={styles.week}>Week</div>
              </button>
              <button className={styles.groupButton}>
                <div className={styles.frameInner} />
                <div className={styles.day}>Month</div>
              </button>
            </nav>
            <div className={styles.monthHeader}>
              <div className={styles.monthLabel}>
                <div className={styles.monthLabelChild} />
                <div className={styles.sun}>May 9, 2026</div>
                <div className={styles.navigationButton}>
                  <img
                    className={styles.navigationButtonChild}
                    loading="lazy"
                    alt=""
                    src="/Group-413.svg"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.weekdayGrid}>
            <div className={styles.weekdayGridChild} />
            <div className={styles.weekdayTitles}>
              <div className={styles.sun}>Sun</div>
              <div className={styles.dayTitles}>
                <div className={styles.mon}>Mon</div>
              </div>
              <div className={styles.dayTitles}>
                <div className={styles.mon}>Tue</div>
              </div>
              <div className={styles.sun}>Wed</div>
              <div className={styles.daySeparatorWrapper}>
                <div className={styles.mon}>Thu</div>
              </div>
              <div className={styles.dayTitles4}>
                <div className={styles.mon}>Fri</div>
              </div>
              <div className={styles.sun}>Sat</div>
            </div>
            <div className={styles.scheduleArea}>
              <img
                className={styles.lineIcon}
                loading="lazy"
                alt=""
                src="/line1.svg"
              />
              <div className={styles.meetingArea}>
                <div className={styles.timeIndicatorWrapper}>
                  <div className={styles.timeIndicator} />
                </div>
                <div className={styles.parent6}>
                  <h3 className={styles.h3}>06</h3>
                  <h3 className={styles.h32}>07</h3>
                  <h3 className={styles.h32}>08</h3>
                  <h3 className={styles.h34}>09</h3>
                  <h3 className={styles.h32}>10</h3>
                  <h3 className={styles.h32}>11</h3>
                  <h3 className={styles.h32}>12</h3>
                </div>
              </div>
              <div className={styles.scheduleAreaChild} />
              <div className={styles.scheduleAreaItem} />
              <div className={styles.scheduleAreaInner} />
              <div className={styles.lineDiv} />
              <FrameComponent1
                prop="08:00"
                oO="이OO 고객님 미팅"
                prop1="09:00"
              />
              <div className={styles.lineParent}>
                <div className={styles.frameChild3} />
                <div className={styles.div44}>정기 보고회</div>
                <div className={styles.div45}>10:00</div>
              </div>
              <div className={styles.parent7}>
                <div className={styles.div46}>11:00</div>
                <div className={styles.emptyContentChild} />
              </div>
              <FrameComponent1
                frameDivTop="266px"
                prop="12:00"
                lineDivBorderTop="1px solid #d0d0d0"
                groupDivBackgroundColor="#605bff"
                rectangleDivBackgroundColor="#605bff"
                oO="점심 약속"
                prop1="13:00"
              />
              <div className={styles.parent8}>
                <div className={styles.div46}>17:00</div>
                <div className={styles.emptyContentChild} />
              </div>
              <div className={styles.lineGroup}>
                <div className={styles.frameChild6} />
                <div className={styles.parent9}>
                  <div className={styles.div46}>18:00</div>
                  <div className={styles.emptyContentChild} />
                </div>
              </div>
              <section className={styles.scheduleEventsParent}>
                <div className={styles.scheduleEvents}>
                  <div className={styles.meetingCard}>
                    <div className={styles.placeholderParent}>
                      <div className={styles.placeholder}>14:00</div>
                      <div className={styles.placeholder}>15:00</div>
                    </div>
                  </div>
                  <div className={styles.innerSchedule}>
                    <div className={styles.groupDiv}>
                      <div className={styles.frameChild8} />
                      <div className={styles.div49}>내부 회의</div>
                    </div>
                    <div className={styles.meetingDetails}>
                      <div className={styles.placeholder}>내부 회의</div>
                    </div>
                  </div>
                </div>
                <div className={styles.emptyContent}>
                  <div className={styles.div46}>16:00</div>
                  <div className={styles.emptyContentChild} />
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Component2;
