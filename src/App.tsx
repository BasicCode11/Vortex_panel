import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import User from "./pages/Users/User";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";

import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
// import { RouternonePage, Data } from "./context/RouternonePage";

import RolePermission from "./pages/Roles/RolePermission";
import AddPage from "./pages/Roles/AddPage";
import EditPage from "./pages/Roles/EditPage";


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
              path="role-permission"
              element={
                <ProtectedRoute requiredPermission="roles:read" requiredActor={['super-admin','team-actor']}>
                  <RolePermission />
                </ProtectedRoute>
              }
            />
            <Route
              path="role-permission/new"
              element={
                <ProtectedRoute requiredPermission="roles:create" requiredActor={['super-admin','team-actor']}>
                  <AddPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="role-permission/:id/edit"
              element={
                <ProtectedRoute requiredPermission="roles:update" requiredActor={['super-admin','team-actor']}>
                  <EditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute requiredPermission="users:read" requiredActor={['super-admin','team-actor']}>
                  <User />
                </ProtectedRoute>
              }
            />

            <Route path="profile" element={<UserProfiles />} />

        
            {/* Dynamically injected routes */}
            {/* {RouternonePage.map((route: Data) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))} */}

          </Route>

          {/* Public routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
