import PropTypes from "prop-types";
import styles from "./SignUpBg.module.css";

const SignUpBg = ({ className = "" }) => {
  return (
    <section className={[styles.bg, className].join(" ")}>
      <div className={styles.bgChild} />
      <div className={styles.signupButtonArea}>
        <div className={styles.buttonContainerParent}>
          <div className={styles.buttonContainer}>
            <img
              className={styles.image11Icon}
              loading="lazy"
              alt=""
              src="/image-11@2x.png"
            />
          </div>
          <h2 className={styles.signUp}>Sign Up</h2>
        </div>
      </div>
      <div className={styles.nameArea}>
        <div className={styles.nameContainer}>
          <div className={styles.div}>?씠由?</div>
          <div className={styles.nameInput}>
            <img className={styles.bgIcon} alt="" src="/Background.svg" />
            <input className={styles.input} placeholder="?솉湲몃룞" type="text" />
          </div>
        </div>
      </div>
      <div className={styles.inputFields}>
        <div className={styles.div}>?씠硫붿씪</div>
        <div className={styles.nameInput}>
          <img className={styles.bgIcon} alt="" src="/Background.svg" />
          <input
            className={styles.input}
            placeholder="example@gmail.com"
            type="text"
          />
        </div>
      </div>
      <div className={styles.inputFields2}>
        <div className={styles.div3}>?궗踰?</div>
        <div className={styles.nameInput}>
          <img className={styles.bgIcon} alt="" src="/Background.svg" />
          <input
            className={styles.input}
            placeholder="WPB-012890"
            type="text"
          />
        </div>
      </div>
      <div className={styles.passwordArea}>
        <div className={styles.div}>鍮꾨??踰덊샇</div>
        <div className={styles.passwordInput}>
          <img className={styles.bgIcon4} alt="" src="/Background.svg" />
          <img className={styles.hideIcon} alt="" src="/Hide@2x.png" />
          <img className={styles.dotIcon} alt="" src="/Dot.svg" />
        </div>
      </div>
      <div className={styles.termsArea}>
        <input className={styles.termsContainer} type="checkbox" />
        <div className={styles.byCreatingAnContainer}>
          <span>{`By creating an account you agree to the `}</span>
          <span className={styles.termsOfUse}>terms of use</span>
          <span>{` and our `}</span>
          <span className={styles.termsOfUse}>privacy policy.</span>
        </div>
      </div>
      <div className={styles.nameArea}>
        <div className={styles.buttonContainer2}>
          <button className={styles.button}>
            <img className={styles.bgIcon5} alt="" src="/Background.svg" />
            <div className={styles.createAccount}>Create account</div>
          </button>
          <div className={styles.loginArea}>
            <div className={styles.div}>
              <span>{`Already have an account? `}</span>
              <span className={styles.logIn}>Log in</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

SignUpBg.propTypes = {
  className: PropTypes.string,
};

export default SignUpBg;
