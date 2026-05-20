import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import "./AuthNew.css";

// Mock Database for Users and Roles
const MOCK_USERS = [
  { id: "admin", password: "admin", role: "admin", name: "관리자" },
  { id: "developer", password: "admin", role: "admin", name: "개발자" },
  { id: "admin@poom.com", password: "admin", role: "admin", name: "어드민" },
  { id: "WPB-012890", password: "user123", role: "user", name: "김재욱" },
  { id: "user", password: "user", role: "user", name: "홍길동" },
  { id: "user123", password: "user", role: "user", name: "사용자" }
];

export default function LoginNew() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
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

    // Lookup user in mock database
    const user = MOCK_USERS.find(
      (u) => u.id.toLowerCase() === id.trim().toLowerCase() && u.password === password
    );

    if (user) {
      // Successful login - route based on role
      if (user.role === "admin") {
        navigate("/admin-system-dashboard-1");
      } else {
        navigate("/daily-calendar");
      }
    } else {
      setError("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <div className="auth-new-layout">
      <div className="auth-new-card">
        {/* Form Section */}
        <div className="auth-new-form-section">
          <div className="auth-new-logo-area">
            {/* High-Fidelity POOM Smiley Logo */}
            <svg width="140" height="60" viewBox="0 0 140 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: "8px" }}>
              {/* P */}
              <text x="10" y="44" font-family="'Inter', 'Outfit', sans-serif" font-weight="900" font-size="42" fill="#0284c7" letterSpacing="1">P</text>
              
              {/* Smiley Face */}
              {/* Left Eye */}
              <circle cx="62" cy="22" r="5" fill="#0284c7" />
              {/* Right Eye */}
              <circle cx="82" cy="22" r="5" fill="#0284c7" />
              {/* Smile Mouth Arc */}
              <path d="M 58 34 A 15 15 0 0 0 86 34" stroke="#0284c7" strokeWidth="5" strokeLinecap="round" fill="none" />
              
              {/* M */}
              <text x="98" y="44" font-family="'Inter', 'Outfit', sans-serif" font-weight="900" font-size="42" fill="#0284c7" letterSpacing="1">M</text>
            </svg>
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
                id="agree-terms"
                className="auth-new-checkbox" 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <label htmlFor="agree-terms" className="auth-new-options-text" style={{ cursor: "pointer", userSelect: "none" }}>
                By creating an account you agree to the <Link to="#" className="auth-new-link">terms of use</Link> and our <Link to="#" className="auth-new-link">privacy policy.</Link>
              </label>
            </div>

            <button type="submit" className="auth-new-btn" style={{ marginTop: "8px", width: "100%" }}>
              Log in
            </button>
          </form>

          {/* Test Account Helper Grid */}
          <div 
            className="auth-test-helper"
            style={{
              marginTop: "16px",
              padding: "12px",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "11px"
            }}
          >
            <div style={{ fontWeight: "600", color: "#475569", marginBottom: "6px" }}>🔑 테스트 계정 안내</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", color: "#64748b" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>사용자(PB): <strong>WPB-012890</strong></span>
                <span>비밀번호: <strong>user123</strong></span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>관리자(Admin): <strong>admin</strong></span>
                <span>비밀번호: <strong>admin</strong></span>
              </div>
            </div>
          </div>

          <div className="auth-new-footer" style={{ marginTop: "24px" }}>
            Don't have account yet? <Link to="/sign-up" className="auth-new-link">New Account</Link>
          </div>
        </div>

        {/* Blank Right Section */}
        <div className="auth-new-image-section"></div>
      </div>
    </div>
  );
}
