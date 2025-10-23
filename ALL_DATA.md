# Tymor Dashboard - Complete Project Documentation

**Version**: 1.0.0  
**Last Updated**: October 16, 2025  
**Project Type**: Headless CMS Dashboard  
**Deployment**: dashboard.tymortech.com

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Features](#features)
5. [User Roles & Permissions](#user-roles--permissions)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Authentication & Security](#authentication--security)
9. [Installation & Setup](#installation--setup)
10. [Deployment](#deployment)
11. [Environment Variables](#environment-variables)
12. [Protected User System](#protected-user-system)
13. [File Structure](#file-structure)

---

## Overview

The Tymor Dashboard is a production-ready headless CMS built specifically for Tymor Technologies. It serves content via REST APIs to the main website while providing a powerful admin interface for content management.

### Purpose
- Manage blog posts and dynamic pages
- Track analytics and user activity
- Provide role-based access control
- Serve content via public APIs

### Key Stats
- **Frontend**: Next.js 14 with TypeScript
- **Database**: MongoDB Atlas (Cloud)
- **Auth**: NextAuth.js with JWT
- **UI**: Radix UI + Tailwind CSS
- **Deployment**: Vercel

---

## Architecture

```
┌─────────────────────────────────────────┐
│         tymortech.com                    │
│       (Main Website)                     │
└──────────────┬──────────────────────────┘
               │
               │ REST API Calls
               ▼
┌─────────────────────────────────────────┐
│   dashboard.tymortech.com                │
│   (Headless CMS Dashboard)               │
│                                          │
│  ┌────────────┐     ┌────────────┐     │
│  │   Admin    │     │   Public   │     │
│  │  Routes    │     │    APIs    │     │
│  │ (Protected)│     │   (Open)   │     │
│  └────────────┘     └────────────┘     │
└──────────────┬──────────────────────────┘
               │
               │ Database Connection
               ▼
┌─────────────────────────────────────────┐
│       MongoDB Atlas                      │
│    (Cloud Database)                      │
│                                          │
│  • Users     • Blogs     • Pages        │
│  • Analytics • Activity Logs             │
└─────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
- **Framework**: Next.js 14.1.0 (App Router)
- **Language**: TypeScript 5.x
- **UI Library**: Radix UI (headless components)
- **Styling**: Tailwind CSS 3.3.0
- **Icons**: Lucide React 0.344.0
- **Forms**: React Hook Form 7.50.0
- **Validation**: Zod 3.22.4

### Backend
- **Runtime**: Node.js 18+
- **API**: Next.js API Routes
- **Database**: MongoDB 6.3.0 with Mongoose 8.1.1
- **Auth**: NextAuth.js 4.24.5
- **Password**: bcryptjs 2.4.3

### DevOps
- **Deployment**: Vercel
- **Database Host**: MongoDB Atlas
- **Version Control**: Git
- **Package Manager**: npm

---

## Features

### 🔐 Authentication & Authorization
- **NextAuth.js** integration with credentials provider
- **JWT-based sessions** (30-day expiration)
- **bcrypt password hashing** (10 salt rounds)
- **Role-based access control** (RBAC)
- **Protected routes** with middleware
- **Secure API endpoints**

### 📝 Content Management

#### Blog Management
- ✅ Create, edit, delete blog posts
- ✅ Rich text content support (HTML)
- ✅ Categories and tags system
- ✅ Featured images
- ✅ Author attribution
- ✅ Draft/Published/Archived status
- ✅ View counter
- ✅ SEO optimization (meta tags, OG tags)
- ✅ Custom URL slugs
- ✅ Publication timestamps

#### Page Management
- ✅ Create dynamic pages
- ✅ Full HTML content support
- ✅ SEO metadata
- ✅ Featured images
- ✅ Status management
- ✅ Custom slugs
- ✅ Excerpt/summary

### 👥 User Management (Super Admin Only)
- ✅ Invite new users
- ✅ Assign roles (Super Admin / Content Admin)
- ✅ View all users
- ✅ Delete users
- ✅ Track invitations
- ✅ Active/inactive status
- ✅ **Protected user system** (prevent deletion of root admin)

### 📊 Analytics Dashboard
- ✅ Page view tracking
- ✅ Time-based filtering (7/30/90 days)
- ✅ Top pages by views
- ✅ Traffic sources (referrers)
- ✅ Device breakdown (mobile/desktop)
- ✅ Browser statistics
- ✅ Geographic data (countries)
- ✅ Real-time data collection

### 📋 Activity Logging
- ✅ Complete audit trail
- ✅ Track all CRUD operations
- ✅ User attribution
- ✅ Timestamps
- ✅ Entity type filtering
- ✅ Action details

### 🌐 Public API (Headless CMS)
- ✅ REST API endpoints for blogs
- ✅ REST API endpoints for pages
- ✅ Navigation menu API
- ✅ CORS configured for tymortech.com
- ✅ Pagination support
- ✅ Search and filtering
- ✅ No authentication required

---

## User Roles & Permissions

### Super Admin

**Full System Access**

| Feature | Permission |
|---------|-----------|
| Create pages | ✅ |
| Edit own pages | ✅ |
| Edit others' pages | ✅ |
| Delete own pages | ✅ |
| Delete others' pages | ✅ |
| Create blogs | ✅ |
| Edit own blogs | ✅ |
| Edit others' blogs | ✅ |
| Delete own blogs | ✅ |
| Delete others' blogs | ✅ |
| View analytics | ✅ |
| View activity logs | ✅ (all) |
| Invite users | ✅ |
| Manage users | ✅ |
| Delete users | ✅ |

### Content Admin

**Limited Access - Own Content Only**

| Feature | Permission |
|---------|-----------|
| Create pages | ✅ |
| Edit own pages | ✅ |
| Edit others' pages | ❌ |
| Delete own pages | ✅ |
| Delete others' pages | ❌ |
| Create blogs | ✅ |
| Edit own blogs | ✅ |
| Edit others' blogs | ❌ |
| Delete own blogs | ✅ |
| Delete others' blogs | ❌ |
| View analytics | ✅ |
| View activity logs | ✅ (filtered) |
| Invite users | ❌ |
| Manage users | ❌ |
| Delete users | ❌ |

---

## Database Schema

### User Model

```typescript
{
  _id: ObjectId,
  name: string,                    // Full name
  email: string,                   // Unique email (lowercase)
  password: string,                // bcrypt hashed
  role: "super_admin" | "content_admin",
  avatar?: string,                 // Profile image URL
  isActive: boolean,               // Account status
  isProtected?: boolean,           // Prevents deletion (root admin)
  invitedBy?: ObjectId,            // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: email, role, isProtected

### Blog Model

```typescript
{
  _id: ObjectId,
  title: string,                   // Blog title
  slug: string,                    // URL slug (unique, lowercase)
  content: string,                 // HTML content
  excerpt?: string,                // Brief summary (max 300)
  featuredImage?: string,          // Image URL
  author: string,                  // Author name
  categories: string[],            // Category tags
  tags: string[],                  // SEO tags
  status: "draft" | "published" | "archived",
  seo: {
    title: string,
    description: string,
    keywords: string[],
    ogTitle?: string,
    ogDescription?: string,
    ogImage?: string,
    canonicalUrl?: string
  },
  views: number,                   // View counter
  createdBy: ObjectId,             // Reference to User
  updatedBy?: ObjectId,            // Reference to User
  publishedAt?: Date,              // Publication timestamp
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: slug, status, createdBy, createdAt, categories, tags

### Page Model

```typescript
{
  _id: ObjectId,
  title: string,                   // Page title
  slug: string,                    // URL slug (unique, lowercase)
  content: string,                 // HTML content
  excerpt?: string,                // Brief summary (max 300)
  featuredImage?: string,          // Image URL
  status: "draft" | "published" | "archived",
  seo: {
    title: string,
    description: string,
    keywords: string[],
    ogTitle?: string,
    ogDescription?: string,
    ogImage?: string,
    canonicalUrl?: string
  },
  createdBy: ObjectId,             // Reference to User
  updatedBy?: ObjectId,            // Reference to User
  publishedAt?: Date,              // Publication timestamp
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: slug, status, createdBy, createdAt

### Analytics Model

```typescript
{
  _id: ObjectId,
  page: string,                    // Page URL
  pageTitle?: string,              // Page title
  referrer?: string,               // Referring URL
  userAgent: string,               // Browser user agent
  device?: string,                 // Device type (mobile/desktop)
  browser?: string,                // Browser name
  country?: string,                // Country code
  sessionId?: string,              // Session identifier
  createdAt: Date
}
```

**Indexes**: page, createdAt, device, browser, country

### ActivityLog Model

```typescript
{
  _id: ObjectId,
  userId: ObjectId,                // Reference to User
  action: string,                  // Action description
  entityType: "page" | "blog" | "user" | "settings",
  entityId?: ObjectId,             // Reference to entity
  details?: string,                // Additional context
  createdAt: Date
}
```

**Indexes**: userId, entityType, createdAt

---

## API Endpoints

### Public APIs (No Authentication Required)

#### Blogs

```
GET  /api/public/blogs
     ?limit=10              // Number of results
     &page=1                // Page number
     &category=Technology   // Filter by category
     &tag=AI                // Filter by tag
     &search=cloud          // Search term

Response: {
  success: true,
  data: [...],
  pagination: { total, page, limit, pages }
}
```

```
GET  /api/public/blogs/[slug]

Response: {
  success: true,
  data: { ...blog }
}
```

#### Pages

```
GET  /api/public/pages
     ?limit=50              // Number of results

Response: {
  success: true,
  data: [...]
}
```

```
GET  /api/public/pages/[slug]

Response: {
  success: true,
  data: { ...page }
}
```

#### Navigation

```
GET  /api/public/navigation

Response: {
  success: true,
  data: [...]
}
```

### Protected APIs (Authentication Required)

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

#### Users (Super Admin Only)
- `GET /api/users` - List all users
- `POST /api/users` - Invite new user
- `GET /api/users/[id]` - Get user details
- `PATCH /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

#### Blogs (Role-Based Access)
- `GET /api/blogs` - List blogs (filtered by role)
- `POST /api/blogs` - Create blog
- `GET /api/blogs/[id]` - Get blog details
- `PATCH /api/blogs/[id]` - Update blog
- `DELETE /api/blogs/[id]` - Delete blog

#### Pages (Role-Based Access)
- `GET /api/pages` - List pages (filtered by role)
- `POST /api/pages` - Create page
- `GET /api/pages/[id]` - Get page details
- `PATCH /api/pages/[id]` - Update page
- `DELETE /api/pages/[id]` - Delete page

#### Analytics
- `GET /api/analytics?days=30` - Get analytics data
- `POST /api/analytics` - Track page view

#### Activity Logs
- `GET /api/activity-logs?entityType=page` - Get activity logs

---

## Authentication & Security

### Password Security
- **Hashing**: bcryptjs with 10 salt rounds
- **Min Length**: 6 characters
- **Storage**: Never stored in plain text
- **Validation**: Server-side verification

### Session Management
- **Type**: JWT (JSON Web Tokens)
- **Duration**: 30 days
- **Strategy**: Stateless JWT strategy
- **Refresh**: Automatic on valid session

### RBAC Implementation
- **Middleware**: Route protection at middleware level
- **API Guards**: Permission checks in every API route
- **Client-side**: UI elements hidden based on role
- **Server-side**: All operations validated server-side

### Protected User System
- **Purpose**: Prevent deletion of root admin
- **Field**: `isProtected: true` in User model
- **Protection**: Cannot be deleted via API
- **Modification**: Limited to name and password only
- **Implementation**: Checked in DELETE and PATCH routes

### CORS Configuration
- **Public APIs**: Allow requests from `tymortech.com`
- **Admin APIs**: No CORS (same domain)
- **Methods**: GET for content, POST for leads
- **Headers**: Content-Type allowed

---

## Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Git

### Local Development

```bash
# 1. Clone repository
git clone <repo-url>
cd tymordashboard

# 2. Install dependencies
npm install

# 3. Create .env.local
# See Environment Variables section

# 4. Run development server
npm run dev

# Access at http://localhost:3000
```

### Default Admin User

**Email**: `hsandilya@tymortech.com`  
**Password**: `Harsh@1232@`  
**Role**: Super Admin  
**Protected**: Yes (Cannot be deleted)

---

## Deployment

### Vercel Deployment

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod
```

### Post-Deployment Steps

1. **Configure Custom Domain**
   - Add `dashboard.tymortech.com` in Vercel
   - Add CNAME record in DNS:
     - Type: CNAME
     - Name: `dashboard`
     - Value: `cname.vercel-dns.com`

2. **Set Environment Variables** (in Vercel dashboard)
   - See Environment Variables section

3. **Verify MongoDB Connection**
   - Check MongoDB Atlas IP whitelist
   - Test connection string

4. **Test Public APIs**
   ```bash
   curl https://dashboard.tymortech.com/api/public/blogs
   ```

---

## Environment Variables

### Required Variables

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://tymor_db_user:3VUctauSWqAjH8Vp@dashboard.tagiab0.mongodb.net/tymor-dashboard?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_SECRET=BkqTbgTdak8rHPhltV8n/uN04jWYa4/ARaX+WRMoOJ8=
NEXTAUTH_URL=https://dashboard.tymortech.com

# Site URLs
NEXT_PUBLIC_SITE_URL=https://dashboard.tymortech.com
NEXT_PUBLIC_MAIN_SITE=https://tymortech.com
NEXT_PUBLIC_DASHBOARD_URL=https://dashboard.tymortech.com
```

### Variable Descriptions

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `NEXTAUTH_SECRET` | Secret key for JWT signing (32+ chars) | Generated via `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Dashboard public URL | `https://dashboard.tymortech.com` |
| `NEXT_PUBLIC_SITE_URL` | Same as NEXTAUTH_URL | `https://dashboard.tymortech.com` |
| `NEXT_PUBLIC_MAIN_SITE` | Main website URL (for CORS) | `https://tymortech.com` |
| `NEXT_PUBLIC_DASHBOARD_URL` | Dashboard URL | `https://dashboard.tymortech.com` |

---

## Protected User System

### Overview
The protected user system ensures that the root administrator account cannot be deleted, providing fail-safe access to the dashboard.

### Protected User Details
- **Name**: Harsh Sandiya
- **Email**: `hsandilya@tymortech.com`
- **Password**: `Harsh@1232@`
- **Role**: Super Admin
- **Protection**: `isProtected: true`

### Protection Features

#### Cannot Be Deleted
- ❌ Via admin dashboard
- ❌ Via API calls
- ❌ By any super admin
- ✅ Only via direct database access

#### Limited Modifications
- ✅ Password can be changed
- ✅ Name can be updated
- ❌ Email cannot be changed
- ❌ Role cannot be changed
- ❌ Account cannot be deactivated
- ❌ Protection cannot be removed via API

### Implementation

```typescript
// In DELETE route
const userToDelete = await User.findById(id);
if (userToDelete.isProtected) {
  return res.status(403).json({
    error: "This user is protected and cannot be deleted by anyone"
  });
}

// In PATCH route
const userToUpdate = await User.findById(id);
if (userToUpdate.isProtected) {
  if (updates.role || updates.email || updates.isProtected === false) {
    return res.status(403).json({
      error: "This user is protected. Only name and password can be updated."
    });
  }
}
```

---

## File Structure

```
tymordashboard/
├── src/
│   ├── app/
│   │   ├── api/                      # API Routes
│   │   │   ├── public/               # Public APIs (no auth)
│   │   │   │   ├── blogs/
│   │   │   │   │   ├── route.ts      # GET /api/public/blogs
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── route.ts  # GET /api/public/blogs/[slug]
│   │   │   │   ├── pages/
│   │   │   │   │   ├── route.ts      # GET /api/public/pages
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── route.ts  # GET /api/public/pages/[slug]
│   │   │   │   └── navigation/
│   │   │   │       └── route.ts      # GET /api/public/navigation
│   │   │   ├── auth/                 # Authentication
│   │   │   │   ├── [...nextauth]/
│   │   │   │   │   └── route.ts      # NextAuth handler
│   │   │   │   └── register/
│   │   │   │       └── route.ts      # User registration
│   │   │   ├── blogs/                # Blog CRUD (protected)
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── pages/                # Page CRUD (protected)
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── users/                # User management (protected)
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── analytics/route.ts    # Analytics data
│   │   │   ├── activity-logs/route.ts # Activity logs
│   │   │   ├── navigation/route.js   # Navigation management
│   │   │   ├── settings/route.js     # Settings
│   │   │   ├── upload/route.ts       # File upload
│   │   │   └── leads/route.js        # Leads management
│   │   ├── auth/                     # Auth Pages
│   │   │   ├── signin/page.tsx       # Sign in page
│   │   │   └── error/page.tsx        # Auth error page
│   │   ├── dashboard/                # Dashboard Pages
│   │   │   ├── layout.tsx            # Dashboard layout
│   │   │   ├── page.tsx              # Dashboard home
│   │   │   ├── blogs/                # Blog management UI
│   │   │   │   ├── page.tsx          # List blogs
│   │   │   │   ├── new/page.tsx      # Create blog
│   │   │   │   └── [id]/page.tsx     # Edit blog
│   │   │   ├── pages/                # Page management UI
│   │   │   │   ├── page.tsx          # List pages
│   │   │   │   ├── new/page.tsx      # Create page
│   │   │   │   └── [id]/page.tsx     # Edit page
│   │   │   ├── users/page.tsx        # User management
│   │   │   ├── analytics/page.tsx    # Analytics dashboard
│   │   │   ├── activity/page.tsx     # Activity logs
│   │   │   ├── navigation/page.jsx   # Navigation editor
│   │   │   ├── settings/page.jsx     # Settings
│   │   │   └── leads/page.jsx        # Leads viewer
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home (redirects to dashboard)
│   │   ├── globals.css               # Global styles
│   │   └── providers.tsx             # Context providers
│   ├── components/
│   │   ├── dashboard/                # Dashboard components
│   │   │   ├── Navbar.tsx            # Top navigation
│   │   │   └── Sidebar.tsx           # Side navigation
│   │   ├── admin/                    # Admin components
│   │   │   ├── AdminNav.jsx          
│   │   │   └── AdminSidebar.jsx
│   │   └── ui/                       # Radix UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       ├── textarea.tsx
│   │       ├── toast.tsx
│   │       ├── toaster.tsx
│   │       ├── use-toast.ts
│   │       └── alert-dialog.tsx
│   ├── lib/
│   │   ├── mongodb.ts                # MongoDB connection
│   │   ├── auth.ts                   # NextAuth config
│   │   ├── permissions.ts            # RBAC utilities
│   │   └── utils.ts                  # Helper functions
│   ├── models/                       # Mongoose models
│   │   ├── User.ts
│   │   ├── Blog.ts
│   │   ├── Page.ts
│   │   ├── Analytics.ts
│   │   └── ActivityLog.ts
│   ├── types/
│   │   └── next-auth.d.ts            # NextAuth type extensions
│   └── middleware.ts                 # Auth middleware
├── public/
│   ├── integration-example.html      # API integration demo
│   └── logo.png
├── data/                             # JSON data files
│   ├── blogs.json
│   ├── leads.json
│   ├── navigation.json
│   ├── pages.json
│   └── settings.json
├── scripts/
│   └── create-admin.js               # Admin creation script
├── lib/
│   └── fileUtils.js                  # File utilities
├── .env.local                        # Environment variables (not in git)
├── .gitignore
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
├── postcss.config.js                 # PostCSS configuration
├── package.json                      # Dependencies
├── README.md                         # Quick start guide
├── ALL_DATA.md                       # This file
└── INTEGRATION.md                    # Integration guide
```

---

## Performance & Optimization

### Database
- **Indexes**: Strategic indexes on frequently queried fields
- **Queries**: Optimized Mongoose queries
- **Connection**: Connection pooling via Mongoose
- **Caching**: Built-in MongoDB caching

### Frontend
- **SSR**: Server-side rendering for dashboard pages
- **Code Splitting**: Automatic code splitting by Next.js
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Next.js Image component

### API
- **Response Time**: < 200ms average
- **Rate Limiting**: Consider implementing for production
- **Caching**: Consider Redis for high-traffic scenarios

---

## Troubleshooting

### MongoDB Connection Errors
```bash
# Check MongoDB Atlas
# - Verify IP whitelist includes 0.0.0.0/0
# - Check username/password
# - Test connection string
```

### NextAuth Errors
```bash
# Verify environment variables
# - NEXTAUTH_SECRET must be set
# - NEXTAUTH_URL must match deployment URL
# - Check if session is expired
```

### Permission Errors
```bash
# Check user role in database
# Verify middleware configuration
# Check API route permissions
```

### CORS Errors
```bash
# Verify NEXT_PUBLIC_MAIN_SITE is set correctly
# Check middleware configuration
# Ensure requests come from correct domain
```

---

## Best Practices

### Content Management
1. Always fill SEO metadata
2. Use descriptive slugs
3. Set appropriate status (draft/published)
4. Add featured images (1200x630px)
5. Keep excerpts under 200 characters

### Security
1. Change default admin password after deployment
2. Use strong passwords (12+ characters)
3. Regularly review user access
4. Monitor activity logs
5. Keep dependencies updated

### Performance
1. Optimize images before upload
2. Use appropriate database indexes
3. Monitor API response times
4. Regular database backups

---

## Future Enhancements

### Planned Features
- [ ] Email notifications
- [ ] Rich text editor (WYSIWYG)
- [ ] Image upload and management
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] API rate limiting
- [ ] Webhook support
- [ ] Export/Import functionality

### Considerations
- Redis caching layer
- CDN for static assets
- Image optimization service
- Search functionality (Algolia)
- Comment system for blogs

---

## Support & Contacts

**Dashboard**: https://dashboard.tymortech.com  
**Main Site**: https://tymortech.com  
**Email**: admin@tymortech.com  
**Login**: hsandilya@tymortech.com  

---

## License

Copyright © 2025 Tymor Technologies. All Rights Reserved.

---

**Document Version**: 1.0.0  
**Last Updated**: October 16, 2025  
**Maintained By**: Tymor Technologies Development Team

