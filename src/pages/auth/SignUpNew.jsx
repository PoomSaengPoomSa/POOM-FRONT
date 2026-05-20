import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import "./AuthNew.css";

export default function SignUpNew() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignUp = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("이름을 입력해 주세요.");
      return;
    }
    if (!email.trim()) {
      setError("이메일을 입력해 주세요.");
      return;
    }
    if (!id.trim()) {
      setError("사번을 입력해 주세요.");
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

    // Simulate successful signup
    setSuccess("회원가입이 완료되었습니다! 잠시 후 로그인 페이지로 이동합니다.");
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="auth-new-layout">
      <div className="auth-new-card">
        {/* Form Section */}
        <div className="auth-new-form-section">
          <div className="auth-new-logo-area">
            {/* High-Fidelity POOM Smiley Logo */}
            <img src="/poom-logo.png" alt="POOM Logo" style={{ height: "50px", marginBottom: "8px", objectFit: "contain" }} />
            <h1 className="auth-new-title">Sign Up</h1>
          </div>

          <form onSubmit={handleSignUp} style={{ width: "100%" }}>
            {/* Elegant Alerts for Errors / Success */}
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

            {success && (
              <div 
                className="auth-success-alert"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#f0fdf4",
                  border: "1px solid #dcfce7",
                  color: "#15803d",
                  padding: "12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  marginBottom: "16px",
                  lineHeight: "1.4"
                }}
              >
                <CheckCircle size={16} style={{ flexShrink: 0 }} />
                <span>{success}</span>
              </div>
            )}

            <div className="auth-new-form-group">
              <label className="auth-new-label">이름</label>
              <div className="auth-new-input-wrap">
                <input 
                  type="text" 
                  className="auth-new-input" 
                  placeholder="홍길동" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-new-form-group">
              <label className="auth-new-label">이메일</label>
              <div className="auth-new-input-wrap">
                <input 
                  type="email" 
                  className="auth-new-input" 
                  placeholder="example@gmail.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-new-form-group">
              <label className="auth-new-label">사번</label>
              <div className="auth-new-input-wrap">
                <input 
                  type="text" 
                  className="auth-new-input" 
                  placeholder="WPB-012890" 
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

            <div className="auth-new-options" style={{ marginTop: "16px" }}>
              <input 
                type="checkbox" 
                id="signup-agree"
                className="auth-new-checkbox" 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <label htmlFor="signup-agree" className="auth-new-options-text" style={{ cursor: "pointer", userSelect: "none" }}>
                By creating an account you agree to the <Link to="#" className="auth-new-link">terms of use</Link> and our <Link to="#" className="auth-new-link">privacy policy.</Link>
              </label>
            </div>

            <button type="submit" className="auth-new-btn" style={{ marginTop: "8px", width: "100%" }}>
              Create account
            </button>
          </form>

          <div className="auth-new-footer" style={{ marginTop: "16px" }}>
            Already have an account? <Link to="/login" className="auth-new-link">Log in</Link>
          </div>
        </div>

        {/* Blank Right Section */}
        <div className="auth-new-image-section"></div>
      </div>
    </div>
  );
}
