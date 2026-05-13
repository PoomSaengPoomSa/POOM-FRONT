import { Link } from "react-router-dom";
import { EyeOff } from "lucide-react";
import "./AuthNew.css";

export default function SignUpNew() {
  return (
    <div className="auth-new-layout">
      <div className="auth-new-card">
        {/* Form Section */}
        <div className="auth-new-form-section">
          <div className="auth-new-logo-area">
            <div className="auth-new-logo"></div>
            <h1 className="auth-new-title">Sign Up</h1>
          </div>

          <div className="auth-new-form-group">
            <label className="auth-new-label">이름</label>
            <div className="auth-new-input-wrap">
              <input type="text" className="auth-new-input" placeholder="홍길동" />
            </div>
          </div>

          <div className="auth-new-form-group">
            <label className="auth-new-label">이메일</label>
            <div className="auth-new-input-wrap">
              <input type="email" className="auth-new-input" placeholder="example@gmail.com" />
            </div>
          </div>

          <div className="auth-new-form-group">
            <label className="auth-new-label">사번</label>
            <div className="auth-new-input-wrap">
              <input type="text" className="auth-new-input" placeholder="WPB-012890" />
            </div>
          </div>

          <div className="auth-new-form-group">
            <label className="auth-new-label">비밀번호</label>
            <div className="auth-new-input-wrap">
              <input type="password" className="auth-new-input" placeholder="••••••••" />
              <EyeOff size={16} className="auth-new-icon" />
            </div>
          </div>

          <div className="auth-new-options">
            <input type="checkbox" className="auth-new-checkbox" />
            <span className="auth-new-options-text">
              By creating an account you agree to the <Link to="#" className="auth-new-link">terms of use</Link> and our <Link to="#" className="auth-new-link">privacy policy.</Link>
            </span>
          </div>

          <button className="auth-new-btn">Create account</button>

          <div className="auth-new-footer">
            Already have an account? <Link to="/login-pb" className="auth-new-link">Log in</Link>
          </div>
        </div>

        {/* Blank Right Section */}
        <div className="auth-new-image-section"></div>
      </div>
    </div>
  );
}
