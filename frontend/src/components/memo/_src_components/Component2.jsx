import PropTypes from "prop-types";
import styles from "./Component2.module.css";

const Component2 = ({ className = "" }) => {
  return (
    <main className={[styles.main, className].join(" ")}>
      <img className={styles.child} alt="" src="/Group-674.svg" />
      <div className={styles.bg}>
        <div className={styles.bgChild} />
        <div className={styles.background}>
          <div className={styles.profileInfoParent}>
            <div className={styles.profileInfo}>
              <div className={styles.avatar} />
            </div>
            <div className={styles.detailsContainer}>
              <div className={styles.oo}>김OO</div>
            </div>
            <img className={styles.frameChild} alt="" src="/Group-143.svg" />
          </div>
          <div className={styles.menuOptions}>
            <nav className={styles.listParent}>
              <button className={styles.list}>
                <div className={styles.listChild} />
                <div className={styles.div}>프로필</div>
              </button>
              <button className={styles.board}>
                <div className={styles.boardChild} />
                <div className={styles.div2}>고객 대시보드</div>
              </button>
              <button className={styles.board2}>
                <div className={styles.boardItem} />
                <div className={styles.div3}>방문 브리핑</div>
              </button>
              <button className={styles.board3}>
                <div className={styles.boardInner} />
                <div className={styles.div4}>메모 어시스턴트</div>
              </button>
            </nav>
          </div>
        </div>
        <section className={styles.inputAreaWrapper}>
          <div className={styles.inputArea}>
            <div className={styles.inputContainer}>
              <img
                className={styles.backgroundBoxIcon}
                loading="lazy"
                alt=""
                src="/Background-Rect.svg"
              />
              <div className={styles.inputButtons}>
                <div className={styles.memoInput}>
                  <div className={styles.div5}>메모 입력</div>
                </div>
                <div className={styles.uploadTools}>
                  <div className={styles.uploadContainer}>
                    <div className={styles.ocrButton} />
                    <div className={styles.ocr}>OCR 업로드</div>
                  </div>
                  <button className={styles.sampleTool}>
                    <div className={styles.sampleToolChild} />
                    <div className={styles.div6}>샘플 불러오기</div>
                  </button>
                  <button className={styles.reportTool}>
                    <div className={styles.sampleToolChild} />
                    <div className={styles.ai}>{`AI 보고서 생성 `}</div>
                  </button>
                </div>
              </div>
              <div className={styles.inputBg}>
                <div className={styles.inputBgChild} />
                <div className={styles.div7}>
                  달러 자산 줄이고 싶다고. 국내 리츠 관심. 다음달 초 재방문.
                </div>
              </div>
              <div className={styles.inputBg2}>
                <div className={styles.inputBgItem} />
                <div
                  className={styles.ai2}
                >{`💡 자유롭게 메모하세요. AI가 구조화된 상담 보고서 로 변환합니다. OCR 버튼으로 손글씨·사진도 업로드 가능합니다. `}</div>
              </div>
            </div>
            <div className={styles.reportArea}>
              <img
                className={styles.reportBoxIcon}
                loading="lazy"
                alt=""
                src="/Background-Rect.svg"
              />
              <div className={styles.reportTitle}>
                <div className={styles.ai3}>AI 상담 보고서</div>
              </div>
              <div className={styles.wjwkd}>wjwkd저장</div>
              <div className={styles.reportContent}>
                <img
                  className={styles.reportContentChild}
                  alt=""
                  src="/Background-Rect.svg"
                />
                <div className={styles.reportDetails}>
                  <div className={styles.reportData}>
                    <div className={styles.dataItems}>
                      <div className={styles.dataSeparator} />
                      <div className={styles.itemDetail}>
                        <div className={styles.itemInfo}>
                          <div className={styles.iconFiller}>2026.04.30</div>
                          <div className={styles.div8}>달러 자산 비중 축소</div>
                        </div>
                        <div className={styles.trackingStats}>
                          <div className={styles.counterIndicator}>
                            <div className={styles.trackerIcon}>
                              <div className={styles.trackerIconChild} />
                            </div>
                            <div className={styles.div9}>누적 1건</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.customerDetails}>
                      <div className={styles.customerTitle}>
                        <b className={styles.b}>고객명</b>
                        <div className={styles.ooVip}>김OO (VIP)</div>
                      </div>
                    </div>
                    <div className={styles.clientSeparator}>
                      <div className={styles.assetOverview} />
                    </div>
                    <div className={styles.customerDetails}>
                      <div className={styles.customerTitle}>
                        <b className={styles.b}>총자산</b>
                        <div className={styles.profileInfo}>
                          <div className={styles.div10}>32억 1234만</div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.needsAnalysis}>
                      <div className={styles.primaryNeeds}>
                        <div className={styles.needsInformation}>
                          <div className={styles.assetOverview} />
                        </div>
                        <div className={styles.needDetails}>
                          <b className={styles.b3}>주요 니즈</b>
                          <div className={styles.profileInfo}>
                            <div className={styles.div11}>
                              달러 자산 비중 축소/국내 리츠 편입 검토
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.clientSeparator}>
                      <div className={styles.assetOverview} />
                    </div>
                    <div className={styles.nextActions}>
                      <div className={styles.actionTitle}>
                        <b className={styles.b3}>후속 조치</b>
                        <div className={styles.followupDetails}>
                          <div className={styles.div12}>
                            리츠 상품 비교안 준비
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.clientSeparator}>
                      <div className={styles.assetOverview} />
                    </div>
                    <div className={styles.customerDetails}>
                      <div className={styles.customerTitle}>
                        <b className={styles.b}>차기 상담</b>
                        <div className={styles.appointmentPeriod}>
                          <div className={styles.div9}>2026.05 초순</div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.clientSeparator}>
                      <div className={styles.assetOverview} />
                    </div>
                  </div>
                </div>
                <div className={styles.interactionPanel}>
                  <button className={styles.saveAction}>
                    <img
                      className={styles.saveActionChild}
                      alt=""
                      src="/Background-Rect.svg"
                    />
                    <div className={styles.div14}>저장</div>
                  </button>
                  <button className={styles.shareAction}>
                    <img
                      className={styles.saveActionChild}
                      alt=""
                      src="/Background-Rect.svg"
                    />
                    <div className={styles.div15}>슬랙</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.historyRecordsWrapper}>
          <div className={styles.historyRecords}>
            <img
              className={styles.backgroundBoxIcon}
              alt=""
              src="/Rectangle-136.svg"
            />
            <div className={styles.previousChats}>
              <div className={styles.chatMessage}>
                <div className={styles.div16}>이전 상담 타임라인</div>
                <div className={styles.chatMessageInner}>
                  <div className={styles.frameParent}>
                    <div className={styles.wrapper}>
                      <div className={styles.detailsIcon}>2026.04.27</div>
                    </div>
                    <div className={styles.parent}>
                      <div className={styles.div18}>리츠</div>
                      <div className={styles.container}>
                        <div className={styles.div19}>
                          달러 약세로 해외자산 비중 조정 논의, 국내 리츠 관심
                          표명.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.frameGroup}>
              <div className={styles.group}>
                <div className={styles.div20}>채권</div>
                <img
                  className={styles.pieChartIcon}
                  alt=""
                  src="/pie-chart1.svg"
                />
              </div>
              <div className={styles.chartDetails}>
                <div className={styles.detailsIcon}>2026.03.15</div>
                <div className={styles.isa}>
                  1분기 수익률 점검. 채권 비중 확대 제안 수락.
                </div>
              </div>
            </div>
            <div className={styles.rebalanceDetailsParent}>
              <div className={styles.group}>
                <div className={styles.div20}>리밸</div>
                <img
                  className={styles.pieChartIcon}
                  alt=""
                  src="/pie-chart1.svg"
                />
              </div>
              <div className={styles.chartContent}>
                <div className={styles.contentIcon}>
                  <div className={styles.detailsIcon}>2026.01.08</div>
                  <div className={styles.div23}>
                    연초 포트폴리오 리밸런싱. 국내주식 5% 추가 편입.
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.taxInfoParent}>
              <div className={styles.taxInfo}>
                <div className={styles.taxInfoChild} />
                <div className={styles.div20}>절세</div>
                <img
                  className={styles.pieChartIcon}
                  alt=""
                  src="/pie-chart1.svg"
                />
              </div>
              <div className={styles.taxDetails}>
                <div className={styles.detailsIcon}>2026.11.20</div>
                <div className={styles.isa}>
                  절세 계획 상담. ISA 계좌 추가 납입 결정.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className={styles.item} />
    </main>
  );
};

Component2.propTypes = {
  className: PropTypes.string,
};

export default Component2;
