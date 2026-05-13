import { Link } from "react-router-dom";

export default function SignUpPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>회원가입</h1>
      <p>TODO: 회원가입 페이지 디자인/폼 연결</p>
      <Link to="/auth">로그인으로 돌아가기</Link>
    </div>
  );
}
