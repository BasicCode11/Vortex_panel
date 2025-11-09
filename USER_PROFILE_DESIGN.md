# User Profile Card Design

## ✨ Enhanced UserMetaCard Component

### Overview
A modern, responsive user profile card that displays comprehensive user information with beautiful UI/UX.

---

## 🎨 Design Features

### Main Profile Card

#### **1. Avatar Section**
- **Profile Picture Display**: Shows user's uploaded picture or gradient placeholder
- **Initials Fallback**: Displays user initials when no picture is available
- **Verification Badge**: Green checkmark badge for verified email addresses
- **Responsive**: 96px (24rem) avatar on all screen sizes

#### **2. User Information**
- **Full Name**: Large, prominent display (2xl font)
- **Email Address**: Secondary gray text below name
- **Responsive Layout**: Stacks on mobile, horizontal on desktop

#### **3. Info Pills (Badges)**
Beautiful, colorful badges displaying:
- **Role Badge**: Primary color with icon
- **Phone Badge**: Gray with phone icon (only shown if phone exists)
- **Email Verified Badge**: Green with shield icon (only shown if verified)

#### **4. Metadata**
- **Join Date**: Formatted date with calendar icon
- **Last Updated**: Formatted date with clock icon
- **Separator**: Vertical line between items on desktop

#### **5. Edit Button**
- Outline style button with edit icon
- Opens modal for editing profile
- Hover effects for better UX

---

## 📝 Edit Profile Modal

### Sections:

#### **1. Profile Picture Upload**
- Current avatar display
- "Upload Photo" button
- File size/type information
- Background highlight section

#### **2. Personal Information Form**
- **First Name** (editable, required)
- **Last Name** (editable, required)
- **Email** (read-only, disabled with note)
- **Phone Number** (editable, optional)

#### **3. Account Information (Read-only)**
Display-only information cards:
- **Role**: User's current role
- **Email Verified Status**: Verified/Not Verified with badge
- **Member Since**: Account creation date

#### **4. Action Buttons**
- **Cancel**: Outline button, closes modal
- **Save Changes**: Primary button, submits form
- Equal width buttons (flex-1)

---

## 🎨 Color Scheme

### Light Mode:
- Background: White
- Text: Gray-800
- Borders: Gray-200
- Pills: Color-specific backgrounds (primary, green, gray)

### Dark Mode:
- Background: Gray-900/800
- Text: White/Gray-300
- Borders: Gray-700
- Pills: Transparent backgrounds with borders

---

## 📱 Responsive Design

### Mobile (< 1024px):
- Avatar centered
- Text centered
- Pills centered and wrapped
- Full-width edit button
- Stacked metadata

### Desktop (≥ 1024px):
- Avatar left-aligned
- Text left-aligned
- Pills left-aligned
- Inline edit button
- Horizontal metadata with separators

---

## 🔍 Data Structure

```typescript
interface User {
  id: number;
  uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  role: {
    id: number;
    name: string;
  };
  phone: string;
  picture: string | null;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}
```

---

## ✅ Features Implemented

### Main Card:
- ✅ Avatar display with fallback to initials
- ✅ Verification badge overlay
- ✅ Full name display
- ✅ Email address display
- ✅ Role badge with icon
- ✅ Phone badge (conditional)
- ✅ Email verified badge (conditional)
- ✅ Join date with icon
- ✅ Last updated date with icon
- ✅ Edit button with icon
- ✅ Loading state with spinner
- ✅ Error state with icon
- ✅ Responsive layout
- ✅ Dark mode support

### Edit Modal:
- ✅ Profile picture section
- ✅ Upload photo button (placeholder)
- ✅ Editable first name field
- ✅ Editable last name field
- ✅ Read-only email field
- ✅ Editable phone field
- ✅ Role display (read-only)
- ✅ Email verification status
- ✅ Member since date
- ✅ Cancel button
- ✅ Save changes button
- ✅ Responsive modal
- ✅ Dark mode support

---

## 🎯 UI Components Used

- `<Modal>` - Custom modal component
- `<Button>` - Custom button with variants
- `<Input>` - Custom input field
- `<Label>` - Form label component
- `<LoadingSpinner>` - Loading indicator
- SVG icons (Heroicons style)

---

## 💡 UX Improvements

1. **Visual Hierarchy**: Clear separation of information
2. **Status Indicators**: Immediate visual feedback for verification status
3. **Tooltips**: Icons help users understand data types
4. **Conditional Rendering**: Only show relevant information
5. **Loading States**: Smooth loading experience
6. **Error Handling**: Friendly error messages
7. **Accessibility**: Semantic HTML and ARIA labels
8. **Color Coding**: Different colors for different data types

---

## 🚀 Future Enhancements

### Potential Features:
- [ ] Actual file upload functionality
- [ ] Image cropping tool
- [ ] Profile completion percentage
- [ ] Activity timeline
- [ ] Social media links section
- [ ] Two-factor authentication toggle
- [ ] Password change modal
- [ ] Account deletion option
- [ ] Export profile data
- [ ] Profile privacy settings

---

## 📸 Component Structure

```
UserMetaCard
├── Loading State
│   └── LoadingSpinner
├── Error State
│   └── Error Message with Icon
└── Success State
    ├── Profile Card
    │   ├── Avatar Section
    │   │   ├── Profile Picture / Initials
    │   │   └── Verification Badge
    │   ├── User Details
    │   │   ├── Full Name
    │   │   ├── Email
    │   │   ├── Info Pills
    │   │   │   ├── Role Badge
    │   │   │   ├── Phone Badge
    │   │   │   └── Verified Badge
    │   │   └── Metadata
    │   │       ├── Join Date
    │   │       └── Last Updated
    │   └── Edit Button
    └── Edit Modal
        ├── Profile Picture Upload
        ├── Personal Info Form
        │   ├── First Name
        │   ├── Last Name
        │   ├── Email (disabled)
        │   └── Phone
        ├── Account Info (read-only)
        │   ├── Role
        │   ├── Email Verified
        │   └── Member Since
        └── Action Buttons
            ├── Cancel
            └── Save Changes
```

---

## 🔧 Helper Functions

### `getInitials()`
Extracts first and last name initials for avatar fallback.

### `formatDate(dateString)`
Formats ISO date strings to readable format (e.g., "October 31, 2025").

---

## 🎨 Design Principles

1. **Consistency**: Follows TailAdmin design system
2. **Clarity**: Information is easy to scan
3. **Feedback**: Visual feedback for all actions
4. **Flexibility**: Adapts to different screen sizes
5. **Accessibility**: Semantic HTML and proper contrast
6. **Performance**: Lazy loading and optimized renders

---

## ✨ Summary

The UserMetaCard component provides a comprehensive, beautiful, and user-friendly interface for displaying and editing user profile information. It follows modern design patterns, supports dark mode, and is fully responsive across all devices.
