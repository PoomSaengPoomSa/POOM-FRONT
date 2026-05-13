import { Outlet } from "react-router-dom";

export default function AppLayout() {
  // 변환된 페이지들이 자체 헤더/메뉴를 갖고 있어
  // 전역 네비를 강제로 얹으면 원본 UI가 깨지는 경우가 많습니다.
  return <Outlet />;
}

