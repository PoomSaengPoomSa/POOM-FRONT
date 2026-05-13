import Menu1 from "../components/Menu1";
import ArticleColumn from "../components/ArticleColumn";
import styles from "./Component2.module.css";

const Component3 = () => {
  return (
    <div className={styles.div}>
      <Menu1 />
      <div className={styles.child} />
      <div className={styles.div2}>정치</div>
      <main className={styles.dashboardHeaderWrapper}>
        <section className={styles.dashboardHeader}>
          <div className={styles.wrapper}>
            <h1 className={styles.h1}>뉴스 아카이브</h1>
          </div>
          <div className={styles.rectangleParent}>
            <div className={styles.frameChild} />
            <div className={styles.articleContainer}>
              <div className={styles.articleDisplay}>
                <div className={styles.vectorParent}>
                  <img
                    className={styles.vectorIcon}
                    loading="lazy"
                    alt=""
                    src="/Vector1.svg"
                  />
                  <img
                    className={styles.vectorIcon2}
                    loading="lazy"
                    alt=""
                    src="/Vector1.svg"
                  />
                  <img
                    className={styles.vectorIcon3}
                    loading="lazy"
                    alt=""
                    src="/Vector1.svg"
                  />
                </div>
              </div>
              <div className={styles.articleContent}>
                <div className={styles.filterContainerWrapper}>
                  <div className={styles.filterContainer}>
                    <div className={styles.rectangleGroup}>
                      <div className={styles.frameItem} />
                      <img
                        className={styles.searchIcon}
                        alt=""
                        src="/Search.svg"
                      />
                      <input
                        className={styles.search}
                        placeholder="Search"
                        type="text"
                      />
                    </div>
                    <div className={styles.bg}>
                      <div className={styles.bgChild} />
                      <div className={styles.div3}>정치</div>
                    </div>
                    <div className={styles.bg2}>
                      <div className={styles.bgChild} />
                      <div className={styles.it}>IT/과학</div>
                    </div>
                    <div className={styles.bg3}>
                      <div className={styles.bgChild} />
                      <div className={styles.div4}>경제</div>
                    </div>
                    <div className={styles.bg4}>
                      <div className={styles.rectangleDiv} />
                      <div className={styles.div5}>전체</div>
                    </div>
                  </div>
                </div>
                <section className={styles.articleShowcase}>
                  <div className={styles.rectangleContainer}>
                    <div className={styles.frameInner} />
                    <div className={styles.descriptionRow}>
                      <div className={styles.groupDiv}>
                        <div className={styles.frameChild2} />
                        <div className={styles.div6}>경제</div>
                      </div>
                      <div className={styles.scWrapper}>
                        <div className={styles.sc}>
                          셀트리온, 美 소화기학회서 자가면역질환 치료제
                          '램시마SC' 임상 데이터 공개
                        </div>
                      </div>
                    </div>
                    <div className={styles.mediaInformation}>
                      <div className={styles.publicationMetadata}>
                        <div className={styles.datetimeData}>
                          <div className={styles.eventComponent}>
                            <img
                              className={styles.calendarIcon}
                              loading="lazy"
                              alt=""
                              src="/Calendar1@2x.png"
                            />
                          </div>
                          <div className={styles.dec2020}>12 Dec, 2020</div>
                        </div>
                        <div className={styles.starWrapper}>
                          <img
                            className={styles.starIcon}
                            loading="lazy"
                            alt=""
                            src="/Star.svg"
                          />
                        </div>
                        <div className={styles.socialActions}>
                          <img
                            className={styles.socialActionsChild}
                            loading="lazy"
                            alt=""
                            src="/Group-4641.svg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.rectangleContainer}>
                    <div className={styles.frameInner} />
                    <div className={styles.descriptionRow}>
                      <div className={styles.frameDiv}>
                        <div className={styles.frameChild3} />
                        <div className={styles.div7}>정치</div>
                      </div>
                      <div className={styles.scWrapper}>
                        <div className={styles.vs}>
                          [속보] 국힘 “李대통령 ‘비읍시옷’ 발언 경악"
                        </div>
                      </div>
                    </div>
                    <div className={styles.mediaInformation}>
                      <div className={styles.publicationMetadata}>
                        <div className={styles.datetimeData}>
                          <div className={styles.eventComponent}>
                            <img
                              className={styles.calendarIcon2}
                              loading="lazy"
                              alt=""
                              src="/Calendar3.svg"
                            />
                          </div>
                          <div className={styles.dec2020}>12 Dec, 2020</div>
                        </div>
                        <div className={styles.starWrapper}>
                          <div className={styles.starParent}>
                            <img
                              className={styles.starIcon2}
                              alt=""
                              src="/Star.svg"
                            />
                            <img
                              className={styles.starIcon3}
                              loading="lazy"
                              alt=""
                              src="/Star.svg"
                            />
                          </div>
                        </div>
                        <div className={styles.socialActions}>
                          <div className={styles.likeIconParent}>
                            <img
                              className={styles.likeIcon}
                              alt=""
                              src="/Vector1.svg"
                            />
                            <div className={styles.commentIconParent}>
                              <img
                                className={styles.commentIcon}
                                alt=""
                                src="/Vector1.svg"
                              />
                              <img
                                className={styles.shareIcon}
                                alt=""
                                src="/Vector1.svg"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <ArticleColumn
                  prop="경제"
                  prop1="카카오, 1분기 영업익 2114억원...전년비 66%↑"
                  prop2="경제"
                  hMM="HMM 나무호 예인선 도착…오늘 오전 중 작업 시작"
                />
                <ArticleColumn
                  groupDivPadding="10px 27px 10px 18px"
                  groupDivBackgroundColor="#ff8bde"
                  groupDivPadding1="14px 25px 13px"
                  rectangleDivBackgroundColor="#ff8bde"
                  prop="정치"
                  frameDivPadding="13px 0px 0px"
                  prop1="국산 전투기 시대 열렸다…KF-21, 전투용 적합 판정"
                  metadataRowPadding="12px 0px 0px"
                  groupDivBackgroundColor1="#0ba9ff"
                  groupDivPadding2="14px 17px 13px 18px"
                  groupDivBorder="none"
                  rectangleDivBackgroundColor1="#0ba9ff"
                  prop2="IT/과학"
                  hMM={`카카오, 에이전틱 AI 속도…"카톡 내 탐색부터 결제까지"`}
                />
                <div className={styles.economyArticle}>
                  <div className={styles.rectangleParent2}>
                    <div className={styles.frameInner} />
                    <div className={styles.descriptionRow}>
                      <div className={styles.rectangleParent3}>
                        <div className={styles.frameChild5} />
                        <div className={styles.div9}>경제</div>
                      </div>
                      <div className={styles.scWrapper}>
                        <div className={styles.vs}>
                          삼성바이오 노사 갈등 격화…“불법행위 엄정 대응” vs
                          “억지 고소”
                        </div>
                      </div>
                    </div>
                    <div className={styles.mediaInformation}>
                      <div className={styles.publicationMetadata}>
                        <div className={styles.datetimeData}>
                          <div className={styles.eventComponent}>
                            <img
                              className={styles.calendarIcon}
                              loading="lazy"
                              alt=""
                              src="/Calendar1@2x.png"
                            />
                          </div>
                          <div className={styles.dec2020}>12 Dec, 2020</div>
                        </div>
                        <div className={styles.starWrapper}>
                          <img
                            className={styles.starIcon}
                            loading="lazy"
                            alt=""
                            src="/Star.svg"
                          />
                        </div>
                        <div className={styles.socialActions}>
                          <img
                            className={styles.socialActionsChild}
                            loading="lazy"
                            alt=""
                            src="/Group-464.svg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button className={styles.moreOptions}>
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownIcons}>
                  <img
                    className={styles.arrowDown2}
                    loading="lazy"
                    alt=""
                    src="/Arrow-Down-2.svg"
                  />
                </div>
                <div className={styles.emptyState}>1</div>
                <div className={styles.dropdownIcons}>
                  <img
                    className={styles.arrowDown2}
                    loading="lazy"
                    alt=""
                    src="/Arrow-Down-2.svg"
                  />
                </div>
              </div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Component3;
