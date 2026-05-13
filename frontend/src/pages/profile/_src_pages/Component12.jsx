import Menu1 from "../components/Menu1";
import ContactContainer from "../components/ContactContainer";
import InterestDetails from "../components/InterestDetails";
import NeedsActions from "../components/NeedsActions";
import ProfileSetup from "../components/ProfileSetup";
import styles from "./Component12.module.css";

const Component12 = () => {
  return (
    <div className={styles.div}>
      <div className={styles.bg}>
        <div className={styles.bgChild} />
      </div>
      <Menu1 />
      <img className={styles.child} alt="" src="/.svg" />
      <main className={styles.searchArea}>
        <div className={styles.bg2}>
          <div className={styles.bgItem} />
        </div>
        <div className={styles.search}>Search</div>
        <div className={styles.searchAreaChild} />
        <img className={styles.icon} loading="lazy" alt="" src="/.svg" />
        <div className={styles.searchAreaItem} />
        <div className={styles.searchAreaInner} />
        <div className={styles.lineDiv} />
        <img className={styles.searchBoxIcon} alt="" src="/.svg" />
      </main>
      <main className={styles.customerList}>
        <div className={styles.customerScroll}>
          <div className={styles.customerRows}>
            <div className={styles.customerDetails}>
              <div className={styles.customerCard}>
                <div className={styles.customerInfo}>
                  <div className={styles.customerInfoChild} />
                  <div className={styles.nameContainer}>
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
                <div className={styles.profileAction}>
                  <div className={styles.profileAvatar}>
                    <div className={styles.profileAvatarChild} />
                    <div className={styles.oo2}>박OO</div>
                  </div>
                </div>
              </div>
              <div className={styles.customerActions}>
                <div className={styles.div2}>나의 고객</div>
                <img
                  className={styles.addBatonIcon}
                  alt=""
                  src="/Add-baton.svg"
                />
                <div className={styles.div3}>
                  <div className={styles.item} />
                  <div className={styles.detailCard}>
                    <div className={styles.avatarHeader}>
                      <button className={styles.avatarArea}>
                        <div className={styles.avatarAreaChild} />
                      </button>
                      <div className={styles.detailName}>
                        <div className={styles.oo}>김OO</div>
                      </div>
                      <img
                        className={styles.avatarHeaderChild}
                        alt=""
                        src="/Group-143.svg"
                      />
                    </div>
                  </div>
                  <div className={styles.detailTabsWrapper}>
                    <nav className={styles.detailTabs}>
                      <button className={styles.list}>
                        <div className={styles.listChild} />
                        <div className={styles.div4}>프로필</div>
                      </button>
                      <button className={styles.board}>
                        <div className={styles.boardChild} />
                        <div className={styles.div5}>방문 브리핑</div>
                      </button>
                      <button className={styles.board2}>
                        <div className={styles.boardItem} />
                        <div className={styles.div6}>메모 어시스턴트</div>
                      </button>
                    </nav>
                  </div>
                  <section className={styles.rectangleParent}>
                    <img className={styles.frameChild} alt="" src="/.svg" />
                    <div className={styles.contactDetails}>
                      <h1 className={styles.oo4}>김OO</h1>
                      <div className={styles.ceo}>중견기업 CEO</div>
                    </div>
                    <div className={styles.financialDetails}>
                      <div className={styles.assetInformation}>
                        <div className={styles.div7}>총 자산</div>
                        <div className={styles.inputBg}>
                          <div className={styles.inputBgChild} />
                          <div className={styles.div8}>16억</div>
                        </div>
                      </div>
                      <div className={styles.assetInformation}>
                        <div className={styles.div9}>연령</div>
                        <div className={styles.inputBg2}>
                          <div className={styles.inputBgChild} />
                          <div className={styles.div10}>
                            <span>{`만 `}</span>
                            <span className={styles.span}>54</span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.dateField}>
                        <div className={styles.dateContainer}>
                          <div className={styles.div11}>거래 시작일</div>
                          <div className={styles.inputBg2}>
                            <div className={styles.inputBgChild} />
                            <div className={styles.dateValue}>2018.03.05</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ContactContainer
                      frameDivHeight="unset"
                      divHeight="15px"
                      divHeight1="15px"
                      inputBgHeight="unset"
                      inputBgHeight1="unset"
                      inputBgHeight2="unset"
                    />
                  </section>
                  <InterestDetails
                    interestDetailsAlignSelf="unset"
                    groupDivAlignSelf="unset"
                    groupDivFlex="unset"
                    groupDivWidth="345px"
                    divAlignSelf="stretch"
                    divWidth="78px"
                    divDisplay="inline-block"
                    divMargin="0"
                    divMargin1="0"
                    divWidth1="42px"
                    divDisplay1="inline-block"
                    sAWidth="25px"
                    groupDivFlex1="unset"
                    groupDivWidth1="345px"
                    divWidth2="107px"
                    divDisplay2="inline-block"
                    growthRadarHeight="125px"
                    radarComponentsFlex="1"
                    divFlex="1"
                    radarAnalysisPadding="0px 0px 8px"
                    radarAnalysisHeight="132px"
                    safetyIndicatorsFlex="1"
                    assessmentPointsFlex="1"
                    divFlex1="1"
                  />
                  <NeedsActions
                    needsActionsAlignSelf="unset"
                    needsActionsWidth="706px"
                    frameDivFlex="1"
                    divWidth="135px"
                    divDisplay="inline-block"
                  />
                  <section className={styles.searchArea2}>
                    <div className={styles.searchContainer}>
                      <img
                        className={styles.icon2}
                        loading="lazy"
                        alt=""
                        src="/icon@2x.png"
                      />
                      <div className={styles.search2}>Search</div>
                    </div>
                    <div className={styles.customerOptions}>
                      <div className={styles.parent}>
                        <div className={styles.div12}>전체 고객</div>
                        <div className={styles.addCustomerPanel}>
                          <div className={styles.amParent}>
                            <div className={styles.am}>10:00 AM</div>
                            <div className={styles.div13}>오늘 방문</div>
                            <div className={styles.pm}>15:00 PM</div>
                            <div className={styles.pm}>13:30 PM</div>
                            <div className={styles.frameItem} />
                            <div className={styles.registrationAction}>
                              <div className={styles.newRegistrationParent}>
                                <div className={styles.newRegistration}>
                                  <h3 className={styles.h3}>신규 고객 등록</h3>
                                </div>
                                <img
                                  className={styles.frameInner}
                                  alt=""
                                  src="/Group-109.svg"
                                />
                              </div>
                            </div>
                            <div className={styles.informationLayout}>
                              <div className={styles.informationLayoutInner}>
                                <div className={styles.informationAreaParent}>
                                  <div className={styles.informationArea} />
                                  <button className={styles.profileHeader}>
                                    <div
                                      className={styles.profileHeaderChild}
                                    />
                                    <div className={styles.div14}>
                                      기본 정보
                                    </div>
                                  </button>
                                  <div className={styles.assetTrade}>
                                    <div className={styles.div15}>
                                      자산·거래
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <ProfileSetup
                                profileSetupJustifyContent="unset"
                                profileSetupPadding="0px 16px 4px 9px"
                                divHeight="20px"
                                divDisplay="inline-block"
                              />
                              <div className={styles.profileInformation}>
                                <div className={styles.div16}>기본 정보</div>
                                <div className={styles.detailLayout}>
                                  <div className={styles.detailFieldsParent}>
                                    <div className={styles.detailFields}>
                                      <div className={styles.parent}>
                                        <div className={styles.nameDateFields}>
                                          <div className={styles.div17}>
                                            <span>{`이름 `}</span>
                                            <span className={styles.span2}>
                                              *
                                            </span>
                                          </div>
                                          <div className={styles.div18}>
                                            <span>{`생년월일 `}</span>
                                            <span className={styles.span2}>
                                              *
                                            </span>
                                          </div>
                                        </div>
                                        <div className={styles.nameInputs}>
                                          <input
                                            className={styles.nameInputsChild}
                                            placeholder="예: 김OO"
                                            type="text"
                                          />
                                          <div
                                            className={styles.birthdatePanel}
                                          >
                                            <div
                                              className={styles.rectangleGroup}
                                            >
                                              <div
                                                className={styles.rectangleDiv}
                                              />
                                              <div className={styles.ddmmyyyy}>
                                                dd/mm/yyyy
                                              </div>
                                              <img
                                                className={styles.calendarIcon}
                                                alt=""
                                                src="/Calendar-icon2@2x.png"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className={styles.professionPanel}>
                                      <div className={styles.professionFields}>
                                        <div className={styles.professionData}>
                                          <div className={styles.div17}>
                                            <span>{`직업 / 직책 `}</span>
                                            <span className={styles.span2}>
                                              *
                                            </span>
                                          </div>
                                          <div className={styles.div20}>
                                            등급
                                          </div>
                                        </div>
                                      </div>
                                      <div className={styles.professionInputs}>
                                        <input
                                          className={
                                            styles.professionInputsChild
                                          }
                                          placeholder="예: 중견기업 CEO"
                                          type="text"
                                        />
                                        <div
                                          className={styles.rectangleContainer}
                                        >
                                          <div
                                            className={styles.rectangleDiv}
                                          />
                                          <img
                                            className={styles.arrowDown6}
                                            alt=""
                                            src="/Arrow-Down-6.svg"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className={styles.contactPanel}>
                                      <div className={styles.parent}>
                                        <div className={styles.contactInfo}>
                                          <div className={styles.div20}>
                                            연락처
                                          </div>
                                          <div className={styles.div20}>
                                            이메일
                                          </div>
                                        </div>
                                        <div
                                          className={styles.professionInputs}
                                        >
                                          <input
                                            className={styles.contactInputArea}
                                            placeholder="010-0000-0000"
                                            type="text"
                                          />
                                          <input
                                            className={
                                              styles.contactInputsChild
                                            }
                                            placeholder="example@email.com"
                                            type="text"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className={styles.contactPanel}>
                                <div className={styles.visitLayout}>
                                  <div className={styles.div16}>방문 일정</div>
                                  <div className={styles.scheduleInputs}>
                                    <div className={styles.dateTimePanel}>
                                      <div className={styles.dateTimeSelection}>
                                        <div
                                          className={
                                            styles.newRegistrationParent
                                          }
                                        >
                                          <div className={styles.div20}>
                                            거래 시작일
                                          </div>
                                          <div className={styles.div25}>
                                            다음 방문 예정
                                          </div>
                                        </div>
                                      </div>
                                      <div className={styles.dateSelection}>
                                        <div className={styles.groupDiv}>
                                          <div className={styles.frameChild3} />
                                          <div className={styles.ddmmyyyy2}>
                                            dd/mm/yyyy
                                          </div>
                                          <div className={styles.icons}>
                                            <img
                                              className={styles.calendarIcon2}
                                              alt=""
                                              src="/Calendar-icon1@2x.png"
                                            />
                                          </div>
                                        </div>
                                        <div
                                          className={styles.rectangleParent2}
                                        >
                                          <div className={styles.frameChild3} />
                                          <div className={styles.ddmmyyyy}>
                                            dd/mm/yyyy
                                          </div>
                                          <div className={styles.icons}>
                                            <img
                                              className={styles.calendarIcon2}
                                              alt=""
                                              src="/Calendar-icon1@2x.png"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={styles.formActions}>
                              <div className={styles.buttonContainer}>
                                <button className={styles.nextButtonParent}>
                                  <div className={styles.nextButton} />
                                  <div className={styles.div26}>취소</div>
                                </button>
                                <button className={styles.groupButton}>
                                  <div className={styles.frameChild5} />
                                  <div className={styles.div27}>다음</div>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.group}>
            <div className={styles.div28}>캘린더</div>
            <div className={styles.emailDisplay}>
              <div className={styles.erlkgjldfjgkldgmailcom0101}>
                erlkgjldfjgkld@gmail.com
                <br />
                010-1234-5678
              </div>
            </div>
          </div>
          <div className={styles.div29}>트렌드 아카이브</div>
          <div className={styles.userAvatar}>
            <div className={styles.userAvatarChild} />
            <div className={styles.oo2}>이OO</div>
          </div>
          <div className={styles.managementDetails}>
            <div className={styles.div30}>고객관리</div>
            <div className={styles.lgkesdgmailcom01098765432Wrapper}>
              <div className={styles.lgkesdgmailcom01098765432}>
                lgkesd@gmail.com
                <br />
                010-9876-5432
              </div>
            </div>
          </div>
        </div>
        <div className={styles.div31}>뉴스버킷</div>
      </main>
    </div>
  );
};

export default Component12;
