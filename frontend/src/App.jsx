import { Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import StudentDashboard from "./pages/student/StudentDashboard";
import MyOrders from "./pages/student/MyOrders";
import CreateOrder from "./pages/student/CreateOrder";
import Profile from "./pages/student/Profile";

import GuardDashboard from "./pages/guard/GuardDashboard";
import PendingDeliveries from "./pages/guard/PendingDeliveries";
import Handover from "./pages/guard/Handover";
import GuardAbout from "./pages/guard/GuardAbout";
import ChatPage from "./pages/ChatPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Overview from "./pages/admin/Overview";
import AllOrders from "./pages/admin/AllOrders";
import Users from "./pages/admin/Users";
import Analytics from "./pages/admin/Analytics";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route element={<PrivateRoute allowedRoles={["student"]} />}>
        <Route path="/student" element={<StudentDashboard />}>
          <Route index element={<Navigate to="my-orders" replace />} />
          <Route path="my-orders" element={<MyOrders />} />
          <Route path="create-order" element={<CreateOrder />} />
          <Route path="pickup-token" element={<Navigate to="/student/my-orders" replace />} />
          <Route path="profile" element={<Profile />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={["guard"]} />}>
        <Route path="/guard" element={<GuardDashboard />}>
          <Route index element={<Navigate to="pending-deliveries" replace />} />
          <Route path="pending-deliveries" element={<PendingDeliveries />} />
          <Route path="verify-delivery" element={<Navigate to="/guard/pending-deliveries" replace />} />
          <Route path="handover" element={<Handover />} />
          <Route path="verify-token" element={<Navigate to="/guard/handover" replace />} />
          <Route path="about" element={<GuardAbout />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="all-orders" element={<AllOrders />} />
          <Route path="users" element={<Users />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
