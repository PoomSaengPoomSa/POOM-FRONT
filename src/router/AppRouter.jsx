import { Navigate, Route, Routes, Outlet } from "react-router-dom";

import AppLayout from "../layouts/AppLayout.jsx";

import AuthPage from "../pages/auth/AuthPage.jsx";
import SignUpPage from "../pages/auth/SignUpPage.jsx";


import CalendarPage from "../pages/calendar/CalendarPage.jsx";
import ProfilePage from "../pages/profile/ProfilePage.jsx";
import EconomyPage from "../pages/economy/EconomyPage.jsx";
import MemoPage from "../pages/memo/MemoPage.jsx";
import AdminPage from "../pages/admin/AdminPage.jsx";

// New Admin Dashboards
import AdminSystemDashboard1 from "../pages/admin/AdminSystemDashboard1.jsx";
import AdminSystemDashboard2 from "../pages/admin/AdminSystemDashboard2.jsx";
import AdminEmployeeDashboard from "../pages/admin/AdminEmployeeDashboard.jsx";
import AdminPermissionSettings from "../pages/admin/AdminPermissionSettings.jsx";

// New News Bucket Page
// New News Bucket Page
import NewsBucketMessageDraft from "../pages/news/NewsBucketMessageDraft.jsx";

// Phase 2: Auth and Calendar New Pages
import SignUpNew from "../pages/auth/SignUpNew.jsx";
import LoginDeveloper from "../pages/auth/LoginDeveloper.jsx";
import LoginPb from "../pages/auth/LoginPb.jsx";
import WeeklyCalendar from "../pages/calendar/WeeklyCalendar.jsx";
import MonthlyCalendar from "../pages/calendar/MonthlyCalendar.jsx";

// Phase 3: Customer Management and News Bucket Pages
import NewsBucket from "../pages/news/NewsBucket.jsx";
import CustomerRegistration1 from "../pages/customer/CustomerRegistration1.jsx";
import CustomerRegistration2 from "../pages/customer/CustomerRegistration2.jsx";
import CustomerMemoAssistant from "../pages/customer/CustomerMemoAssistant.jsx";
import CustomerVisitBriefing from "../pages/customer/CustomerVisitBriefing.jsx";
import CustomerProfile from "../pages/customer/CustomerProfile.jsx";
import CustomerDashboard from "../pages/customer/CustomerDashboard.jsx";

// Phase 4: Calendar (Day) and Trend Archives
import DailyCalendar from "../pages/calendar/DailyCalendar.jsx";
import { CalendarProvider } from "../pages/calendar/CalendarContext.jsx";
import TrendArchive from "../pages/trend/TrendArchive.jsx";
import EconomicIndicatorArchive from "../pages/trend/EconomicIndicatorArchive.jsx";
import EconomicIndicatorLlmReport from "../pages/trend/EconomicIndicatorLlmReport.jsx";
import NewsArchive from "../pages/trend/NewsArchive.jsx";
import NewsArchiveDetails from "../pages/trend/NewsArchiveDetails.jsx";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login-pb" replace />} />

      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/signup" element={<SignUpPage />} />

      {/* Phase 2 Auth Routes */}
      <Route path="/sign-up" element={<SignUpNew />} />
      <Route path="/login-developer" element={<LoginDeveloper />} />
      <Route path="/login-pb" element={<LoginPb />} />

      <Route element={<AppLayout />}>

        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/economy" element={<EconomyPage />} />
        <Route path="/memo" element={<MemoPage />} />
        <Route path="/admin" element={<AdminPage />} />
        
        {/* New Routes */}
        <Route path="/admin-system-dashboard-1" element={<AdminSystemDashboard1 />} />
        <Route path="/admin-system-dashboard-2" element={<AdminSystemDashboard2 />} />
        <Route path="/admin-employee-dashboard" element={<AdminEmployeeDashboard />} />
        <Route path="/admin-permission-settings" element={<AdminPermissionSettings />} />
        <Route path="/news-bucket-message-draft" element={<NewsBucketMessageDraft />} />
        
        {/* Phase 2 Calendar Routes */}
        <Route element={<CalendarProvider><Outlet /></CalendarProvider>}>
          <Route path="/daily-calendar" element={<DailyCalendar />} />
          <Route path="/weekly-calendar" element={<WeeklyCalendar />} />
          <Route path="/monthly-calendar" element={<MonthlyCalendar />} />
        </Route>

        {/* Phase 3 & 5 Customer Management Routes */}
        <Route path="/news-bucket-bucket" element={<NewsBucket />} />
        <Route path="/customer-management-registration-1" element={<CustomerRegistration1 />} />
        <Route path="/customer-management-registration-2" element={<CustomerRegistration2 />} />
        <Route path="/customer-management-memo-assistant" element={<CustomerMemoAssistant />} />
        <Route path="/customer-management-visit-briefing" element={<CustomerVisitBriefing />} />
        <Route path="/customer-management-profile" element={<CustomerProfile />} />
        <Route path="/customer-management-dashboard-2" element={<CustomerDashboard />} />

        {/* Phase 4 & 5 Trend Routes */}
        <Route path="/trend-archive" element={<TrendArchive />} />
        <Route path="/economic-indicator-archive" element={<EconomicIndicatorArchive />} />
        <Route path="/economic-indicator-archive-llm-report" element={<EconomicIndicatorLlmReport />} />
        <Route path="/news-archive" element={<NewsArchive />} />
        <Route path="/news-archive-details" element={<NewsArchiveDetails />} />
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
