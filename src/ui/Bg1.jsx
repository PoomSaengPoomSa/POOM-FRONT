import PropTypes from "prop-types";
import styles from "./Bg1.module.css";

const Bg1 = ({ className = "", onLogin, onSignUp }) => {
  return (
    <form
      className={[styles.bg, className].join(" ")}
      onSubmit={(e) => {
        e.preventDefault();
        onLogin?.();
      }}
    >
      <div className={styles.bg2} />
      <div className={styles.image11Wrapper}>
        <img
          className={styles.image11Icon}
          loading="lazy"
          alt=""
          src="/image-111@2x.png"
        />
      </div>
      <div className={styles.logInWrapper}>
        <h1 className={styles.logIn}>Log in</h1>
      </div>

      <div className={styles.developerInfo}>
        <button className={styles.pb} type="button">
          <img className={styles.bgIcon} alt="" src="/Background.svg" />
          <b className={styles.pb2}>Private Banker</b>
        </button>
        <button className={styles.developer} type="button">
          <img className={styles.bgIcon2} alt="" src="/Background.svg" />
          <div className={styles.developer2}>Developer</div>
        </button>
      </div>

      <div className={styles.bgInner}>
        <div className={styles.frameChild} />
      </div>

      <div className={styles.parent}>
        <div className={styles.div}>사번</div>
        <div className={styles.bgParent}>
          <img className={styles.bgIcon3} alt="" src="/Background.svg" />
          <input
            className={styles.wpb012890}
            placeholder="WPB-012890"
            type="text"
          />
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.div}>비밀번호</div>
        <div className={styles.bgGroup}>
          <img className={styles.bgIcon4} alt="" src="/Background.svg" />
          <img className={styles.hideIcon} alt="" src="/Hide@2x.png" />
          <img className={styles.dotIcon} alt="" src="/Dot.svg" />
        </div>
      </div>

      <div className={styles.rememberMeContainerParent}>
        <div className={styles.rememberMeContainer}>
          <input className={styles.frameInput} type="checkbox" />
          <div className={styles.rememberMe}>Remember me</div>
        </div>
        <button className={styles.resetPassword} type="button">
          Reset Password?
        </button>
      </div>

      <div className={styles.buttonWrapper}>
        <button className={styles.button} type="submit">
          <img className={styles.bgIcon5} alt="" src="/Background.svg" />
          <div className={styles.logIn2}>Log in</div>
        </button>
      </div>

      <div className={styles.dontHaveAccountYetNewAcWrapper}>
        <button
          className={styles.dontHaveAccountContainer}
          type="button"
          onClick={onSignUp}
        >
          <span className={styles.dontHaveAccount}>Don&apos;t have account yet?</span>
          <span className={styles.span}>{`  `}</span>
          <span className={styles.newAccount}>New Account</span>
        </button>
      </div>
    </form>
  );
};

Bg1.propTypes = {
  className: PropTypes.string,
  onLogin: PropTypes.func,
  onSignUp: PropTypes.func,
};

export default Bg1;
