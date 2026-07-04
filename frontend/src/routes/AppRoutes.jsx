// Centralized route definitions.
//
// The /dashboard/* tree uses React Router's nested-route pattern:
// DashboardLayout (sidebar + topbar + <Outlet/>) is the parent element,
// wrapped once in ProtectedRoute, with each sidebar destination as a
// child route rendered into the Outlet.

import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyEmail from "../pages/VerifyEmail";
import ProtectedRoute from "../features/auth/ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardHome from "../pages/dashboard/DashboardHome";
import UploadResume from "../pages/dashboard/UploadResume";
import Analysis from "../pages/dashboard/Analysis";
import ResumeChat from "../pages/dashboard/ResumeChat";
import Interview from "../pages/dashboard/Interview";
import CoverLetter from "../pages/dashboard/CoverLetter";
import History from "../pages/dashboard/History";
import Profile from "../pages/dashboard/Profile";
import Settings from "../pages/dashboard/Settings";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requireVerified>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="upload" element={<UploadResume />} />
        <Route path="analysis" element={<Analysis />} />
        <Route path="resume-chat" element={<ResumeChat />} />
        <Route path="interview" element={<Interview />} />
        <Route path="cover-letter" element={<CoverLetter />} />
        <Route path="history" element={<History />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
