# Tymor Dashboard

A comprehensive Role-Based Access Control (RBAC) dashboard for managing the Tymor Technologies website. Serves as a headless CMS at `dashboard.tymortech.com` providing content via REST APIs to `tymortech.com`.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Access dashboard at: **http://localhost:3000**


## 🎯 Key Features

- **Headless CMS**: REST APIs for blogs and pages
- **Role-Based Access**: Super Admin & Content Admin roles
- **Blog Management**: Categories, tags, SEO optimization
- **Dynamic Pages**: Manage service pages, about pages, etc.
- **Analytics Dashboard**: Traffic, views, device tracking
- **Activity Logging**: Complete audit trail
- **Protected User System**: Root admin cannot be deleted

## 📡 Public API Endpoints

```javascript
// Blogs
GET  /api/public/blogs                    // All published blogs
GET  /api/public/blogs/{slug}             // Single blog

// Pages  
GET  /api/public/pages                    // All published pages
GET  /api/public/pages/{slug}             // Single page

// Navigation
GET  /api/public/navigation               // Menu items
```

## 💻 Tech Stack

- **Framework**: Next.js 14 + TypeScript
- **Database**: MongoDB Atlas
- **Auth**: NextAuth.js
- **UI**: Radix UI + Tailwind CSS
- **Forms**: React Hook Form + Zod

## 📚 Documentation

- **ALL_DATA.md** - Complete project documentation
- **INTEGRATION.md** - Integration guide for tymortech-re-main


**Domain**: `dashboard.tymortech.com`

See **ALL_DATA.md** for complete deployment instructions.

## 📦 Environment Variables

```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://dashboard.tymortech.com
NEXT_PUBLIC_MAIN_SITE=https://tymortech.com
```

## 🔗 Links

- Dashboard: https://dashboard.tymortech.com
- Main Site: https://tymortech.com

---

Built with ❤️ by Tymor Technologies
