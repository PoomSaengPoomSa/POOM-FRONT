import { useNavigate } from "react-router-dom";
import Bg1 from "../../ui/Bg1";
import styles from "./AuthPage.module.css";

export default function AuthPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.root}>
      <Bg1
        onLogin={() => navigate("/daily-calendar")}
        onSignUp={() => navigate("/auth/signup")}
      />
    </div>
  );
}

