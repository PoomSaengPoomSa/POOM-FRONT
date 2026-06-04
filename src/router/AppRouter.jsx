import { Navigate, Route, Routes, Outlet } from "react-router-dom";

import AppLayout from "../layouts/AppLayout.jsx";



// New Admin Dashboards
import AdminSystemDashboard from "../pages/admin/AdminSystemDashboard.jsx";
import AdminEmployeeDashboard from "../pages/admin/AdminEmployeeDashboard.jsx";
import AdminPermissionSettings from "../pages/admin/AdminPermissionSettings.jsx";



// Phase 2: Auth and Calendar New Pages
import SignUpPage from "../pages/auth/SignUpPage.jsx";
import LoginPage from "../pages/auth/LoginPage.jsx";

import MainPage from "../pages/main/MainPage.jsx";

// Phase 3: Customer Management and News Bucket Pages
import NotificationCenter from "../pages/notification/NotificationCenter.jsx";
import CustomerInfo from "../pages/customer/CustomerInfo.jsx";
import CounselingAssistant from "../pages/assistant/CounselingAssistant.jsx";
import CustomerDashboard from "../pages/customer/CustomerDashboard.jsx";

// Phase 4: Calendar (Day) and Trend Archives
import { CalendarProvider } from "../pages/calendar/CalendarContext.jsx";
import TrendArchive from "../pages/trend/TrendArchive.jsx";
import EconomicIndicatorArchive from "../pages/trend/EconomicIndicatorArchive.jsx";
import EconomicIndicatorLlmReport from "../pages/trend/EconomicIndicatorLlmReport.jsx";
import NewsArchive from "../pages/trend/NewsArchive.jsx";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Phase 2 Auth Routes */}
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login-pb" element={<Navigate to="/login" replace />} />
      <Route path="/login-developer" element={<Navigate to="/login" replace />} />

      <Route element={<AppLayout />}>

        <Route path="/calendar" element={<Navigate to="/main" replace />} />
        <Route path="/admin" element={<AdminPermissionSettings />} />
        
        {/* New Routes */}
        <Route path="/admin-system-dashboard" element={<AdminSystemDashboard />} />
        <Route path="/admin-employee-dashboard" element={<AdminEmployeeDashboard />} />
        <Route path="/admin-permission-settings" element={<AdminPermissionSettings />} />
        
        {/* Phase 2 Calendar Routes */}
        <Route element={<CalendarProvider><Outlet /></CalendarProvider>}>
          <Route path="/main" element={<MainPage />} />
        </Route>

        {/* Phase 3 & 5 Customer Management Routes */}
        <Route path="/notifications" element={<NotificationCenter />} />
        <Route path="/customer-info" element={<CustomerInfo />} />
        <Route path="/counseling-assistant" element={<CounselingAssistant />} />
        <Route path="/customer-management-dashboard" element={<CustomerDashboard />} />

        {/* Phase 4 & 5 Trend Routes */}
        <Route path="/trend-archive" element={<TrendArchive />} />
        <Route path="/economic-indicator-archive" element={<EconomicIndicatorArchive />} />
        <Route path="/economic-indicator-archive-llm-report" element={<EconomicIndicatorLlmReport />} />
        <Route path="/news-archive" element={<NewsArchive />} />
      </Route>

      <Route
        path="*"
        element={
          <div style={{ padding: 24 }}>
            <h1>페이지 준비 중</h1>
            <p>라우팅이 아직 연결되지 않았습니다. TODO를 확인해주세요.</p>
          </div>
        }
      />
    </Routes>
  );
}
