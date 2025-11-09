# Authentication Quick Reference

## 🔥 Most Common Patterns

### 1. Protect a Route
```typescript
<Route
  path="/users"
  element={
    <ProtectedRoute requiredPermission="users:read">
      <UsersPage />
    </ProtectedRoute>
  }
/>
```

### 2. Check Permission in Component
```typescript
const { checkPermission } = usePermissions();

{checkPermission('users:create') && <button>Add User</button>}
```

### 3. Check User Role
```typescript
const { isSuperAdmin, isTeamActor, isAgentActor } = usePermissions();

{isSuperAdmin && <AdminPanel />}
```

### 4. Get Current User
```typescript
const { user, isAuthenticated } = useAuth();

{isAuthenticated && <p>Welcome {user.first_name}</p>}
```

### 5. Logout
```typescript
const { logout } = useAuth();

<button onClick={logout}>Logout</button>
```

---

## 📋 usePermissions() Hook

```typescript
const {
  checkPermission,    // (permission: string) => boolean
  isSuperAdmin,       // boolean
  isTeamActor,        // boolean
  isAgentActor,       // boolean
  permissions,        // string[]
  role,               // { id, name }
  isLoading,         // boolean
} = usePermissions();
```

---

## 📋 useAuth() Hook

```typescript
const {
  user,              // LoginUser | null
  isAuthenticated,   // boolean
  isLoading,         // boolean
  login,             // (email, password) => Promise<void>
  logout,            // () => void
  fetchUser,         // () => Promise<void>
} = useAuth();
```

---

## 🎯 Actor Types

```typescript
type Actor = 'super-admin' | 'team-actor' | 'agent-actor';
```

**Examples:**
- `requiredActor="super-admin"`
- `requiredActor={['super-admin', 'team-actor']}`

---

## ⚡ Permission Naming Convention

Format: `resource:action`

**Examples:**
- `users:read`
- `users:create`
- `users:update`
- `users:delete`
- `roles:read`
- `roles:create`
- `roles:update`
- `roles:delete`

---

## 🚨 Error Handling

**401 Unauthorized:**
- Token expired or invalid
- Auto-redirects to `/signin`
- Clears token from localStorage

**403 Forbidden:**
- User lacks required permission
- Logs warning to console
- Stays on current page

---

## 💡 Tips

1. **Loading States:** Always handle `isLoading` from `usePermissions()`
2. **Backend Validation:** Frontend checks are for UX only - always validate on backend
3. **Cache:** Role permissions cached for 5 minutes
4. **Console Warnings:** Check browser console for access denial messages
5. **Multiple Actors:** Use array for OR logic: `['super-admin', 'team-actor']`
