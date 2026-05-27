import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { api } from "../../api";
import "./AuthNew.css";



export default function LoginNew() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!id.trim()) {
      setError("아이디를 입력해 주세요.");
      return;
    }
    if (!password) {
      setError("비밀번호를 입력해 주세요.");
      return;
    }
    if (!agreeTerms) {
      setError("서비스 이용약관 및 개인정보 처리방침에 동의해 주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 실제 백엔드 API 연동
      const user = await api.auth.login(id.trim(), password);
      setIsSubmitting(false);

      if (user.role === "admin") {
        navigate("/admin-system-dashboard-1");
      } else {
        navigate("/daily-calendar");
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || "아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  };


  return (
    <div className="auth-new-layout">
      <div className="auth-new-card">
        {/* Form Section */}
        <div className="auth-new-form-section">
          <div className="auth-new-logo-area">
            {/* High-Fidelity POOM Smiley Logo */}
            <img src="/poom-logo.png" alt="POOM Logo" style={{ height: "50px", marginBottom: "16px", objectFit: "contain" }} />
            <h1 className="auth-new-title">Log in</h1>
          </div>

          <form onSubmit={handleLogin} style={{ width: "100%" }}>
            {/* Elegant Alert for Errors */}
            {error && (
              <div
                className="auth-error-alert"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fee2e2",
                  color: "#ef4444",
                  padding: "12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  marginBottom: "16px",
                  lineHeight: "1.4"
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <div className="auth-new-form-group">
              <label className="auth-new-label">아이디</label>
              <div className="auth-new-input-wrap">
                <input
                  type="text"
                  className="auth-new-input"
                  placeholder="user1"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-new-form-group">
              <label className="auth-new-label">비밀번호</label>
              <div className="auth-new-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  className="auth-new-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  className="auth-new-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </div>
              </div>
            </div>

            <div className="auth-new-options" style={{ marginTop: "32px" }}>
              <input
                type="checkbox"
                id="agree-terms"
                className="auth-new-checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <label htmlFor="agree-terms" className="auth-new-options-text" style={{ cursor: "pointer", userSelect: "none" }}>
                By creating an account you agree to the <Link to="#" className="auth-new-link">terms of use</Link> and our <Link to="#" className="auth-new-link">privacy policy.</Link>
              </label>
            </div>

            <button type="submit" className="auth-new-btn" style={{ marginTop: "20px", width: "100%" }} disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="auth-new-footer" style={{ marginTop: "36px" }}>
            Don't have account yet? <Link to="/sign-up" className="auth-new-link">New Account</Link>
          </div>
        </div>

        {/* Blank Right Section */}
        <div className="auth-new-image-section"></div>
      </div>
    </div>
  );
}
