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
import Bonusoffer from "./pages/Bonusoffer";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { RouternonePage, Data } from "./context/RouternonePage";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Protected routes under AppLayout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />

            <Route
              path="customers"
              element={
                <ProtectedRoute requiredPermission="customer:read">
                  <Customer />
                </ProtectedRoute>
              }
            />

            <Route
              path="agents"
              element={
                <ProtectedRoute requiredPermission="agents:read">
                  <Agent />
                </ProtectedRoute>
              }
            />

            <Route
              path="users"
              element={
                <ProtectedRoute requiredPermission="users:read">
                  <User />
                </ProtectedRoute>
              }
            />

            <Route path="profile" element={<UserProfiles />} />

            <Route
              path="bonuns-offer/*"
              element={
                <ProtectedRoute requiredPermission="bonusoffer:read">
                  <Bonusoffer />
                </ProtectedRoute>
              }
            />

            {/* Dynamically injected routes */}
            {RouternonePage.map((route: Data) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>

          {/* Public routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
