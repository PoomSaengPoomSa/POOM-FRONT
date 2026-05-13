import { Link } from "react-router-dom";
import { EyeOff } from "lucide-react";
import "./AuthNew.css";

export default function LoginDeveloper() {
  return (
    <div className="auth-new-layout">
      <div className="auth-new-card">
        {/* Form Section */}
        <div className="auth-new-form-section">
          <div className="auth-new-logo-area">
            <div className="auth-new-logo"></div>
            <h1 className="auth-new-title">Log in</h1>
          </div>

          <div className="auth-new-tabs">
            <Link to="/login-pb" className="auth-new-tab">Private Banker</Link>
            <Link to="/login-developer" className="auth-new-tab active">Developer</Link>
          </div>

          <div className="auth-new-form-group">
            <label className="auth-new-label">이메일</label>
            <div className="auth-new-input-wrap">
              <input type="email" className="auth-new-input" placeholder="example@gmail.com" />
            </div>
          </div>

          <div className="auth-new-form-group">
            <label className="auth-new-label">비밀번호</label>
            <div className="auth-new-input-wrap">
              <input type="password" className="auth-new-input" placeholder="••••••••" />
              <EyeOff size={16} className="auth-new-icon" />
            </div>
          </div>

          <div className="auth-new-options" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" className="auth-new-checkbox" />
              <span className="auth-new-options-text">Remember me</span>
            </div>
            <Link to="#" className="auth-new-link" style={{ fontSize: 11 }}>Reset Password?</Link>
          </div>

          <Link to="/admin-system-dashboard-1" style={{ width: '100%', textDecoration: 'none' }}>
            <button className="auth-new-btn">Log in</button>
          </Link>

          <div className="auth-new-footer">
            Don't have account yet? <Link to="/sign-up" className="auth-new-link">New Account</Link>
          </div>
        </div>

        {/* Blank Right Section */}
        <div className="auth-new-image-section"></div>
      </div>
    </div>
  );
}
