import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./ProfileSetup.module.css";

const ProfileSetup = ({
  className = "",
  profileSetupJustifyContent,
  profileSetupPadding,
  divHeight,
  divDisplay,
}) => {
  const profileSetupStyle = useMemo(() => {
    return {
      justifyContent: profileSetupJustifyContent,
      padding: profileSetupPadding,
    };
  }, [profileSetupJustifyContent, profileSetupPadding]);

  const div10Style = useMemo(() => {
    return {
      height: divHeight,
      display: divDisplay,
    };
  }, [divHeight, divDisplay]);

  return (
    <div
      className={[styles.profileSetup, className].join(" ")}
      style={profileSetupStyle}
    >
      <div className={styles.rectangleParent}>
        <div className={styles.frameChild} />
        <img className={styles.imageIcon} alt="" src="/image@2x.png" />
        <div className={styles.imageControls}>
          <div className={styles.pictureUpload}>
            <div className={styles.uploadElements}>
              <div className={styles.div}>프로필 사진 업로드</div>
            </div>
            <div className={styles.div2} style={div10Style}>
              업로드 없으면 이니셜로 자동 표시됩니다
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProfileSetup.propTypes = {
  className: PropTypes.string,

  /** Style props */
  profileSetupJustifyContent: PropTypes.string,
  profileSetupPadding: PropTypes.string,
  divHeight: PropTypes.string,
  divDisplay: PropTypes.string,
};

export default ProfileSetup;
