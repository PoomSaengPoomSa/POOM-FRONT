import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  padding: "10px 12px",
  borderRadius: 10,
  textDecoration: "none",
  color: isActive ? "white" : "black",
  background: isActive ? "#0083ca" : "transparent",
});

export default function AppTopNav() {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "white",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <nav
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "10px 16px",
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <NavLink to="/pb/dashboard" style={linkStyle}>
          대시보드
        </NavLink>
        <NavLink to="/calendar" style={linkStyle}>
          캘린더
        </NavLink>
        <NavLink to="/trends" style={linkStyle}>
          트렌드
        </NavLink>
        <NavLink to="/economy" style={linkStyle}>
          경제지표
        </NavLink>
        <NavLink to="/memo" style={linkStyle}>
          메모
        </NavLink>
        <NavLink to="/profile" style={linkStyle}>
          프로필
        </NavLink>
        <NavLink to="/admin" style={linkStyle}>
          관리자
        </NavLink>

        <div style={{ flex: 1 }} />
        <NavLink to="/auth" style={linkStyle}>
          로그아웃(임시)
        </NavLink>
      </nav>
    </div>
  );
}
