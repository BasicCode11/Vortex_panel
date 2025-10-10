import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import User from "./pages/Users/User";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Agent from "./pages/Agents/Agent";
import Customer from "./pages/Customers/Customer";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Protected Dashboard Routes */}
          <Route element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index path="/" element={<Home />} />
            <Route path="/customers" element={
              <ProtectedRoute requiredPermission="customer:read">
                <Customer />
              </ProtectedRoute>
            } />
            <Route path="/agents" element={
              <ProtectedRoute requiredPermission="agents:read">
                <Agent />
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute requiredPermission="users:read">
                <User />
              </ProtectedRoute>} />
            <Route path="/profile" element={<UserProfiles />} />
          </Route>

          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
