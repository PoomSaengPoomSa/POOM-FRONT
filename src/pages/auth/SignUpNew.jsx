import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle, ChevronDown } from "lucide-react";
import "./AuthNew.css";
import { api } from "../../api";

const REGIONS = ["서울", "경기", "인천", "부산", "대구", "대전", "광주", "제주"];
const BRANCHES = [
  { name: "강남역금융센터", region: "서울" },
  { name: "종로금융센터", region: "서울" },
  { name: "여의도중앙지점", region: "서울" },
  { name: "분당금융센터", region: "경기" },
  { name: "송도스마트밸리지점", region: "인천" },
  { name: "부산중앙지점", region: "부산" },
  { name: "대구지점", region: "대구" },
  { name: "대전지점", region: "대전" },
  { name: "광주지점", region: "광주" },
  { name: "제주지점", region: "제주" }
];

export default function SignUpNew() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const getTodayFormatted = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd}`;
  };
  const [startDate, setStartDate] = useState(getTodayFormatted());
  const [id, setId] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [region, setRegion] = useState("서울");
  const [branch, setBranch] = useState("종로금융센터");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegionChange = (selectedRegion) => {
    setRegion(selectedRegion);
    const filtered = BRANCHES.filter((b) => b.region === selectedRegion);
    if (filtered.length > 0) {
      const isCurrentBranchInNewRegion = filtered.some((b) => b.name === branch);
      if (!isCurrentBranchInNewRegion) {
        setBranch(filtered[0].name);
      }
    }
  };

  const handleBranchChange = (selectedBranchName) => {
    setBranch(selectedBranchName);
    const found = BRANCHES.find((b) => b.name === selectedBranchName);
    if (found) {
      setRegion(found.region);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("이름을 입력해 주세요.");
      return;
    }
    if (!id.trim()) {
      setError("사번을 입력해 주세요.");
      return;
    }
    if (!email.trim()) {
      setError("이메일을 입력해 주세요.");
      return;
    }
    if (!phone.trim()) {
      setError("전화 번호를 입력해 주세요.");
      return;
    }
    if (!startDate.trim()) {
      setError("입사일을 입력해 주세요.");
      return;
    }
    if (!birthDate.trim()) {
      setError("생일을 입력해 주세요.");
      return;
    }
    if (!password) {
      setError("비밀번호를 입력해 주세요.");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!agreeTerms) {
      setError("서비스 이용약관 및 개인정보 처리방침에 동의해 주세요.");
      return;
    }

    try {
      await api.auth.signup({
        id,
        password,
        name,
        email,
        number: phone,
        startDate,
        birthDate,
        region,
        branch,
      });

      setSuccess("회원가입이 완료되었습니다! 잠시 후 로그인 페이지로 이동합니다.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "회원가입 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  const filteredBranches = BRANCHES.filter((b) => b.region === region);

  return (
    <div className="auth-new-layout">
      <div className="auth-new-card auth-signup-card">
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

            {/* 2-Column Responsive Grid */}
            <div className="auth-signup-grid">
              {/* Item 1: 이름 */}
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

              {/* Item 2: 사번 */}
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

              {/* Item 3: 이메일 */}
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

              {/* Item 3-2: 전화 번호 */}
              <div className="auth-new-form-group">
                <label className="auth-new-label">전화 번호</label>
                <div className="auth-new-input-wrap">
                  <input 
                    type="text" 
                    className="auth-new-input" 
                    placeholder="010-1234-5678" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Item 4-1: 입사일 */}
              <div className="auth-new-form-group">
                <label className="auth-new-label">입사일</label>
                <div className="auth-new-input-wrap">
                  <input 
                    type="text" 
                    className="auth-new-input" 
                    placeholder="2026.05.22" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Item 4-2: 생일 */}
              <div className="auth-new-form-group">
                <label className="auth-new-label">생일</label>
                <div className="auth-new-input-wrap">
                  <input 
                    type="text" 
                    className="auth-new-input" 
                    placeholder="2002.05.04" 
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Item 5: 근무 주소 (Select) */}
              <div className="auth-new-form-group">
                <label className="auth-new-label">근무 주소</label>
                <div className="auth-new-select-wrapper">
                  <select 
                    className="auth-new-select" 
                    value={region}
                    onChange={(e) => handleRegionChange(e.target.value)}
                  >
                    {REGIONS.map((reg) => (
                      <option key={reg} value={reg}>{reg}</option>
                    ))}
                  </select>
                  <div className="auth-new-select-icon">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              {/* Item 6: 지점 (Select) */}
              <div className="auth-new-form-group">
                <label className="auth-new-label">지점</label>
                <div className="auth-new-select-wrapper">
                  <select 
                    className="auth-new-select" 
                    value={branch}
                    onChange={(e) => handleBranchChange(e.target.value)}
                  >
                    {filteredBranches.map((br) => (
                      <option key={br.name} value={br.name}>{br.name}</option>
                    ))}
                  </select>
                  <div className="auth-new-select-icon">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              {/* Item 7: 비밀번호 */}
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

              {/* Item 8: 비밀번호 확인 */}
              <div className="auth-new-form-group">
                <label className="auth-new-label">비밀번호 확인</label>
                <div className="auth-new-input-wrap">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    className="auth-new-input" 
                    placeholder="••••••••" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <div 
                    className="auth-new-icon" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </div>
                </div>
              </div>
            </div>

            {/* Centered Agree Terms */}
            <div className="auth-new-options" style={{ marginTop: "24px", justifyContent: "center" }}>
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

            {/* Centered Create Account Button with fixed elegant width */}
            <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <button type="submit" className="auth-new-btn" style={{ marginTop: "12px", width: "320px" }}>
                Create account
              </button>
            </div>
          </form>

          {/* Centered Footer */}
          <div className="auth-new-footer" style={{ marginTop: "16px", textAlign: "center" }}>
            Already have an account? <Link to="/login" className="auth-new-link">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
