import PropTypes from "prop-types";
import styles from "./ApiContainer.module.css";

const ApiContainer = ({ className = "" }) => {
  return (
    <div className={[styles.apiContainer, className].join(" ")}>
      <div className={styles.apiContainerChild} />
      <div className={styles.apiContainerInner}>
        <div className={styles.dbParent}>
          <h3 className={styles.db}>트랜잭션 로그 (DB 적재)</h3>
          <div className={styles.logErrorFilterWrapper}>
            <div className={styles.logErrorFilter}>
              <div className={styles.rectangleParent}>
                <div className={styles.frameChild} />
                <div className={styles.div}>전체</div>
              </div>
              <div className={styles.rectangleGroup}>
                <div className={styles.frameItem} />
                <div className={styles.div}>오류만</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.apiRows}>
        <div className={styles.apiGrid}>
          <div className={styles.dbParent}>
            <div className={styles.apiEntry}>
              <div className={styles.apiEntryPlaceholders}>09:14:22</div>
              <div className={styles.apiaichatcompletions}>
                /api/ai/chat/completions
              </div>
            </div>
            <div className={styles.apiValueRow}>
              <div className={styles.apiEntryPlaceholders}>1,243 ms</div>
              <div className={styles.apiValuePlaceholders}>200</div>
            </div>
          </div>
        </div>
        <div className={styles.apiRowsChild} />
      </div>
      <div className={styles.apiRows}>
        <div className={styles.apiGrid}>
          <div className={styles.dbParent}>
            <div className={styles.apiEntry}>
              <div className={styles.apiEntryPlaceholders}>09:14:22</div>
              <div className={styles.apiaichatcompletions}>
                /api/archive/economic-indicators
              </div>
            </div>
            <div className={styles.apiValueRow}>
              <div className={styles.apiEntryPlaceholders}>88 ms</div>
              <div className={styles.apiValuePlaceholders}>200</div>
            </div>
          </div>
        </div>
        <div className={styles.apiRowsChild} />
      </div>
      <div className={styles.apiRows}>
        <div className={styles.apiGrid}>
          <div className={styles.dbParent}>
            <div className={styles.apiEntry}>
              <div className={styles.apiEntryPlaceholders}>09:14:22</div>
              <div className={styles.apiaichatcompletions}>
                /api/archive/news?date=2026-05-07
              </div>
            </div>
            <div className={styles.apiValueRow}>
              <div className={styles.apiEntryPlaceholders}>124 ms</div>
              <div className={styles.apiValuePlaceholders}>200</div>
            </div>
          </div>
        </div>
        <div className={styles.apiRowsChild} />
      </div>
      <div className={styles.apiRows}>
        <div className={styles.apiGrid}>
          <div className={styles.dbParent}>
            <div className={styles.apiEntry}>
              <div className={styles.apiEntryPlaceholders}>09:14:22</div>
              <div className={styles.apiaichatcompletions}>
                /api/ai/chat/completions
              </div>
            </div>
            <div className={styles.apiValueRow}>
              <div className={styles.apiEntryPlaceholders}>5,003 ms</div>
              <div className={styles.div8}>500</div>
            </div>
          </div>
        </div>
        <div className={styles.apiRowsChild} />
      </div>
      <div className={styles.apiRows}>
        <div className={styles.apiGrid}>
          <div className={styles.dbParent}>
            <div className={styles.apiEntry}>
              <div className={styles.apiEntryPlaceholders}>09:14:22</div>
              <div className={styles.apiaichatcompletions}>
                /api/report/generate
              </div>
            </div>
            <div className={styles.apiValueRow}>
              <div className={styles.apiEntryPlaceholders}>2,310 ms</div>
              <div className={styles.apiValuePlaceholders}>200</div>
            </div>
          </div>
        </div>
        <div className={styles.apiRowsChild} />
      </div>
      <div className={styles.apiRows}>
        <div className={styles.apiGrid}>
          <div className={styles.dbParent}>
            <div className={styles.apiEntry}>
              <div className={styles.apiEntryPlaceholders}>09:14:22</div>
              <div className={styles.apiaichatcompletions}>
                /api/report/generate
              </div>
            </div>
            <div className={styles.apiValueRow}>
              <div className={styles.apiEntryPlaceholders}>132ms</div>
              <div className={styles.apiValuePlaceholders}>200</div>
            </div>
          </div>
        </div>
        <div className={styles.apiRowsChild} />
      </div>
      <div className={styles.apiRows}>
        <div className={styles.apiGrid}>
          <div className={styles.dbParent}>
            <div className={styles.apiEntry}>
              <div className={styles.apiEntryPlaceholders}>09:14:22</div>
              <div className={styles.apiaichatcompletions}>
                /api/market/rates?type=exchange
              </div>
            </div>
            <div className={styles.apiValueRow}>
              <div className={styles.apiEntryPlaceholders}>54 ms</div>
              <div className={styles.apiValuePlaceholders}>200</div>
            </div>
          </div>
        </div>
        <div className={styles.apiRowsChild} />
      </div>
      <div className={styles.apiRows}>
        <div className={styles.apiGrid}>
          <div className={styles.dbParent}>
            <div className={styles.apiEntry}>
              <div className={styles.apiEntryPlaceholders}>09:14:22</div>
              <div className={styles.apiaichatcompletions}>
                /api/ai/chat/completions
              </div>
            </div>
            <div className={styles.apiValueRow}>
              <div className={styles.apiEntryPlaceholders}>988 ms</div>
              <div className={styles.apiValuePlaceholders}>200</div>
            </div>
          </div>
        </div>
        <div className={styles.apiRowsChild} />
      </div>
    </div>
  );
};

ApiContainer.propTypes = {
  className: PropTypes.string,
};

export default ApiContainer;
