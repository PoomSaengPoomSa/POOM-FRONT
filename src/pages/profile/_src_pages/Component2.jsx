import styles from "./Component2.module.css";

const Component2 = () => {
  return (
    <div className={styles.div}>
      <form className={styles.bg}>
        <div className={styles.bg2} />
        <div className={styles.placeholder}>
          <img
            className={styles.image11Icon}
            loading="lazy"
            alt=""
            src="/image-111@2x.png"
          />
        </div>
        <div className={styles.loginForm}>
          <h1 className={styles.logIn}>Log in</h1>
        </div>
        <div className={styles.developerInfo}>
          <button className={styles.pb} type="submit">
            <img className={styles.bgIcon} alt="" src="/.svg" />
            <div className={styles.pb2}>Private Banker</div>
          </button>
          <button className={styles.developer} type="submit">
            <img className={styles.bgIcon2} alt="" src="/.svg" />
            <b className={styles.developer2}>Developer</b>
          </button>
        </div>
        <div className={styles.bgInner}>
          <div className={styles.frameChild} />
        </div>
        <div className={styles.emailInput}>
          <div className={styles.div2}>이메일</div>
          <div className={styles.emailField}>
            <img className={styles.bgIcon3} alt="" src="/.svg" />
            <input
              className={styles.examplegmailcom}
              placeholder="example@gmail.com"
              type="text"
            />
          </div>
        </div>
        <div className={styles.passwordInput}>
          <div className={styles.div2}>비밀번호</div>
          <div className={styles.passwordField}>
            <img className={styles.bgIcon4} alt="" src="/.svg" />
            <img className={styles.hideIcon} alt="" src="/Hide@2x.png" />
            <img className={styles.dotIcon} alt="" src="/Dot.svg" />
          </div>
        </div>
        <div className={styles.rememberContainerParent}>
          <div className={styles.rememberContainer}>
            <input className={styles.checkboxContainer} type="checkbox" />
            <div className={styles.rememberMe}>Remember me</div>
          </div>
          <div className={styles.resetPassword}>Reset Password?</div>
        </div>
        <div className={styles.loginAction}>
          <button className={styles.button} type="submit">
            <img className={styles.bgIcon5} alt="" src="/.svg" />
            <div className={styles.logIn2}>Log in</div>
          </button>
        </div>
        <div className={styles.accountPrompt}>
          <div className={styles.dontHaveAccountContainer}>
            <span className={styles.dontHaveAccount}>
              Don’t have account yet?
            </span>
            <span className={styles.span}>{`  `}</span>
            <span className={styles.newAccount}>New Account</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Component2;
