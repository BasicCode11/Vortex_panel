# Frontend Authentication & Authorization Guide

## Overview
This guide explains the complete authentication and authorization system implemented in the Vortex Panel frontend application.

---

## 🔐 Authentication Flow

### 1. Login Process

```
User enters email & password
         ↓
POST /api/login
         ↓
Receive: { access_token, refresh_token, user: {...} }
         ↓
Store access_token in localStorage
         ↓
Fetch user details with GET /api/me
         ↓
Store user in AuthContext
         ↓
Redirect to dashboard
```

**Implementation:**
- **Service:** `src/services/api/authService.ts`
- **Context:** `src/context/AuthContext.tsx`
- **Component:** `src/components/auth/SignInForm.tsx`

### 2. Token Management

**Token Storage:**
```typescript
// Token is stored in localStorage
localStorage.setItem('access_token', token);
localStorage.getItem('access_token');
localStorage.removeItem('access_token');
```

**Automatic Token Injection:**
```typescript
// All API requests automatically include the token
apiRequest.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3. Session Validation

**On App Load:**
1. Check if `access_token` exists in localStorage
2. If exists, call `GET /api/me` to validate and fetch user
3. If valid, set user in AuthContext
4. If invalid (401), clear token and redirect to `/signin`

---

## 🛡️ Authorization System

### Permission-Based Access Control (PBAC)

#### How It Works:

1. **User has a Role** (e.g., "Super Admin", "Team Actor", "Agent Actor")
2. **Each Role has Permissions** (e.g., "users:read", "roles:create")
3. **Routes check permissions** before rendering components

#### Permission Checking Flow:

```
User logs in
     ↓
AuthContext stores user with role: { id: 7, name: "super admin" }
     ↓
usePermissions() hook automatically fetches role details
     ↓
GET /api/roles/:id returns { id, name, permissions: [...] }
     ↓
Extract permission names: ["users:read", "users:create", ...]
     ↓
checkPermission() validates if user has required permission
     ↓
ProtectedRoute allows or denies access
```

---

## 📁 Key Files & Components

### 1. **AuthContext** (`src/context/AuthContext.tsx`)

Manages global authentication state.

```typescript
interface AuthContextType {
  user: LoginUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}
```

**Usage:**
```typescript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated && <p>Welcome, {user.first_name}!</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

### 2. **usePermissions Hook** (`src/hooks/usePermission.ts`)

Provides permission checking capabilities.

```typescript
const {
  checkPermission,      // Function to check specific permission
  isSuperAdmin,         // Boolean: is user super admin?
  isTeamActor,          // Boolean: is user team actor?
  isAgentActor,         // Boolean: is user agent actor?
  permissions,          // Array of permission strings
  role,                 // User's role object
  isLoading,           // Boolean: permissions loading?
} = usePermissions();
```

**How It Works:**
1. Gets user from AuthContext
2. Fetches full role details (with permissions) from API using `GET /api/roles/:id`
3. Caches role data for 5 minutes using React Query
4. Extracts permission names from role
5. Provides helper functions to check permissions

**Example Usage:**
```typescript
import { usePermissions } from '../hooks/usePermission';

function UsersPage() {
  const { checkPermission, isSuperAdmin } = usePermissions();
  
  const canCreateUser = checkPermission('users:create');
  const canDeleteUser = checkPermission('users:delete');
  
  return (
    <div>
      {canCreateUser && <button>Add User</button>}
      {canDeleteUser && <button>Delete User</button>}
      {isSuperAdmin && <button>Admin Panel</button>}
    </div>
  );
}
```

---

### 3. **ProtectedRoute** (`src/components/auth/ProtectedRoute.tsx`)

Wrapper component that protects routes from unauthorized access.

**Props:**
```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;       // e.g., "users:read"
  requiredActor?: Actor | Actor[];   // e.g., "super-admin" or ["super-admin", "team-actor"]
}

type Actor = 'super-admin' | 'team-actor' | 'agent-actor';
```

**Features:**
- ✅ Shows loading spinner while checking auth
- ✅ Redirects to `/signin` if not authenticated
- ✅ Redirects to `/` if missing required permission
- ✅ Redirects to `/` if not the required actor type
- ✅ Logs warnings to console when access is denied

**Example Usage:**
```typescript
// In App.tsx or routes file
<Route
  path="/users"
  element={
    <ProtectedRoute 
      requiredPermission="users:read" 
      requiredActor={['super-admin', 'team-actor']}
    >
      <UsersPage />
    </ProtectedRoute>
  }
/>
```

---

### 4. **Axios Interceptors** (`src/services/api/axios.ts`)

Handles automatic token injection and error responses.

**Request Interceptor:**
- Automatically adds `Authorization: Bearer <token>` to all requests

**Response Interceptor:**
- **401 Unauthorized:** Clears token, redirects to `/signin`
- **403 Forbidden:** Logs warning (insufficient permissions)

---

## 🎯 Common Use Cases

### Use Case 1: Protect a Route

```typescript
// Require specific permission
<Route
  path="/roles"
  element={
    <ProtectedRoute requiredPermission="roles:read">
      <RolesPage />
    </ProtectedRoute>
  }
/>

// Require specific actor role
<Route
  path="/admin"
  element={
    <ProtectedRoute requiredActor="super-admin">
      <AdminPanel />
    </ProtectedRoute>
  }
/>

// Require both permission AND actor
<Route
  path="/users"
  element={
    <ProtectedRoute 
      requiredPermission="users:create"
      requiredActor={['super-admin', 'team-actor']}
    >
      <CreateUserPage />
    </ProtectedRoute>
  }
/>
```

---

### Use Case 2: Conditional UI Based on Permissions

```typescript
function Toolbar() {
  const { checkPermission } = usePermissions();
  
  return (
    <div>
      {checkPermission('users:create') && (
        <button>Add User</button>
      )}
      
      {checkPermission('users:delete') && (
        <button>Delete User</button>
      )}
      
      {checkPermission('roles:update') && (
        <button>Edit Roles</button>
      )}
    </div>
  );
}
```

---

### Use Case 3: Check User Role Type

```typescript
function Dashboard() {
  const { isSuperAdmin, isTeamActor, isAgentActor } = usePermissions();
  
  if (isSuperAdmin) {
    return <SuperAdminDashboard />;
  }
  
  if (isTeamActor) {
    return <TeamActorDashboard />;
  }
  
  if (isAgentActor) {
    return <AgentActorDashboard />;
  }
  
  return <DefaultDashboard />;
}
```

---

### Use Case 4: Programmatic Navigation with Auth Check

```typescript
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const handleAction = () => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    
    // Perform authenticated action
    navigate('/protected-page');
  };
  
  return <button onClick={handleAction}>Go</button>;
}
```

---

## 🔧 API Endpoints Used

| Endpoint | Method | Purpose | Returns |
|----------|--------|---------|---------|
| `/api/login` | POST | Authenticate user | `{ access_token, refresh_token, user }` |
| `/api/me` | GET | Get current user details | `{ user: {...}, addresses: [...] }` |
| `/api/roles/:id` | GET | Get role with permissions | `{ id, name, permissions: [...] }` |
| `/api/forgot-password` | POST | Send reset code | `{ message }` |
| `/api/verify-reset-code` | POST | Verify code | `{ reset_token }` |
| `/api/reset-password` | POST | Reset password | `{ message }` |

---

## 🧪 Testing Permission System

### Test Checklist:

**Authentication:**
- [ ] Login with valid credentials works
- [ ] Login with invalid credentials shows error
- [ ] Token is stored in localStorage after login
- [ ] Refresh page maintains logged-in state
- [ ] Logout clears token and redirects to signin
- [ ] Accessing protected route while logged out redirects to signin

**Authorization:**
- [ ] User with permission can access protected route
- [ ] User without permission is redirected to home
- [ ] Super admin can access all super-admin routes
- [ ] Team actor can access team-actor routes
- [ ] Agent actor can access agent-actor routes
- [ ] UI elements show/hide based on permissions
- [ ] API returns 403 when user lacks permission
- [ ] 403 error is logged but doesn't crash app

**Edge Cases:**
- [ ] Expired token redirects to signin
- [ ] Invalid token redirects to signin
- [ ] Role without any permissions handled gracefully
- [ ] User with deleted role handled gracefully
- [ ] Loading states show while fetching permissions
- [ ] Permission changes reflect immediately after role update

---

## 🚀 Best Practices

### 1. **Always Use ProtectedRoute for Sensitive Pages**
```typescript
// ❌ Bad: No protection
<Route path="/admin" element={<AdminPage />} />

// ✅ Good: Protected
<Route path="/admin" element={
  <ProtectedRoute requiredPermission="admin:access">
    <AdminPage />
  </ProtectedRoute>
} />
```

### 2. **Double-Check Permissions on Backend**
Frontend authorization is for UX only. Always validate permissions on the backend API.

### 3. **Use Specific Permissions**
```typescript
// ❌ Vague
requiredPermission="users"

// ✅ Specific
requiredPermission="users:create"
requiredPermission="users:read"
requiredPermission="users:delete"
```

### 4. **Handle Loading States**
```typescript
const { checkPermission, isLoading } = usePermissions();

if (isLoading) {
  return <LoadingSpinner />;
}

return checkPermission('users:read') ? <UsersTable /> : <AccessDenied />;
```

### 5. **Cache Role Permissions**
The `usePermissions` hook automatically caches role permissions for 5 minutes using React Query. This prevents unnecessary API calls.

---

## 🐛 Troubleshooting

### Issue: "User always redirected to signin"
**Solution:** Check browser console for errors. Likely causes:
- Token expired or invalid
- `/api/me` endpoint returning error
- CORS issues blocking API requests

### Issue: "Permission check always returns false"
**Solution:**
1. Verify user's role has the required permission in database
2. Check `GET /api/roles/:id` returns permissions array
3. Ensure permission name matches exactly (case-sensitive)
4. Clear React Query cache: `queryClient.clear()`

### Issue: "ProtectedRoute shows blank page"
**Solution:**
- Check if `requiredActor` matches user's role name exactly
- Role names are case-insensitive but must match: "super admin", "team actor", "agent actor"
- Check console for warning messages

### Issue: "Permissions not updating after role change"
**Solution:**
- Clear React Query cache: `queryClient.invalidateQueries(['role'])`
- Or wait 5 minutes for cache to expire
- Or logout and login again

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                   User Login                        │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  AuthContext                                        │
│  - Stores user object                               │
│  - Manages authentication state                     │
│  - Provides login/logout functions                  │
└─────────────────┬───────────────────────────────────┘
                  │
         ┌────────┴────────┐
         │                 │
         ▼                 ▼
┌──────────────┐   ┌──────────────────┐
│ useAuth()    │   │ usePermissions() │
│ Hook         │   │ Hook             │
└──────┬───────┘   └────────┬─────────┘
       │                    │
       │                    │ Fetches role details
       │                    │ GET /api/roles/:id
       │                    ▼
       │           ┌─────────────────┐
       │           │ React Query     │
       │           │ Cache (5 min)   │
       │           └────────┬────────┘
       │                    │
       │                    │ Extracts permissions
       │                    ▼
       │           ┌─────────────────┐
       │           │ permissions: [] │
       │           │ ["users:read",  │
       │           │  "roles:create"]│
       │           └────────┬────────┘
       │                    │
       └────────┬───────────┘
                │
                ▼
       ┌─────────────────┐
       │ ProtectedRoute  │
       │ Component       │
       │                 │
       │ Checks:         │
       │ 1. Auth         │
       │ 2. Permission   │
       │ 3. Actor Role   │
       └────────┬────────┘
                │
       ┌────────┴────────┐
       │                 │
       ▼                 ▼
   ✅ Allow        ❌ Redirect
  <Component>     to /signin or /
```

---

## 📝 Summary

**Key Components:**
- ✅ `AuthContext` - Global auth state
- ✅ `usePermissions()` - Permission checking
- ✅ `ProtectedRoute` - Route protection
- ✅ Axios interceptors - Auto token & error handling

**Security Features:**
- ✅ Token-based authentication
- ✅ Automatic token injection
- ✅ Permission-based access control
- ✅ Role-based access control
- ✅ Auto redirect on 401/403
- ✅ Loading states during auth checks
- ✅ Cached permissions for performance

**Best Practices:**
- ✅ Always protect sensitive routes
- ✅ Validate permissions on backend too
- ✅ Use specific permission names
- ✅ Handle loading states properly
- ✅ Log access denials for debugging
