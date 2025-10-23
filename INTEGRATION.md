# Tymor Dashboard Integration Guide for tymortech-re-main

This guide explains how to integrate the Tymor Dashboard CMS with the **tymortech-re-main** project (tymortech.com) to manage blogs and dynamic pages.

---

## 🎯 Overview

Your dashboard at `dashboard.tymortech.com` will serve as a headless CMS that provides:
- **Blog Management**: Create, edit, and publish blog posts
- **Dynamic Pages**: Manage service pages, about pages, etc.
- **Real-time Updates**: Content changes appear immediately on your website

**Architecture:**
```
tymortech-re-main (Frontend - tymortech.com)
    ↓ Fetches content via REST API
dashboard.tymortech.com (Headless CMS)
    ↓ Stores in
MongoDB Atlas (Database)
```

---

## 🔗 API Endpoints

### Base URL
- **Development**: `http://localhost:3000`
- **Production**: `https://dashboard.tymortech.com`

### Available Endpoints

#### 1. Blogs API

**Get All Blogs**
```
GET /api/public/blogs?limit={number}&page={number}&category={string}&search={string}
```

**Get Single Blog**
```
GET /api/public/blogs/{slug}
```

#### 2. Pages API

**Get All Pages**
```
GET /api/public/pages?limit={number}
```

**Get Single Page**
```
GET /api/public/pages/{slug}
```

---

## 📝 API Response Formats

### Blog List Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "How AI is Transforming IT Services",
      "slug": "how-ai-transforming-it-services",
      "content": "<p>Full HTML content here...</p>",
      "excerpt": "A brief summary of the blog post (max 300 chars)",
      "featuredImage": "https://example.com/image.jpg",
      "author": "John Doe",
      "categories": ["AI", "Technology"],
      "tags": ["machine-learning", "automation"],
      "status": "published",
      "seo": {
        "title": "How AI is Transforming IT Services | Tymor Technologies",
        "description": "Discover how AI is revolutionizing IT services...",
        "keywords": ["ai", "it services", "automation"],
        "ogTitle": "How AI is Transforming IT Services",
        "ogDescription": "Discover how AI is revolutionizing...",
        "ogImage": "https://example.com/og-image.jpg",
        "canonicalUrl": "https://tymortech.com/blog/how-ai-transforming-it-services"
      },
      "views": 342,
      "publishedAt": "2025-01-15T10:30:00.000Z",
      "createdAt": "2025-01-15T09:00:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 24,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

### Single Blog Response

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "How AI is Transforming IT Services",
    "slug": "how-ai-transforming-it-services",
    "content": "<p>Full HTML content...</p>",
    "excerpt": "Brief summary...",
    "featuredImage": "https://example.com/image.jpg",
    "author": "John Doe",
    "categories": ["AI", "Technology"],
    "tags": ["machine-learning"],
    "seo": { /* SEO metadata */ },
    "views": 343,
    "publishedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

### Page Response

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Managed IT Services",
    "slug": "managed-it-services",
    "content": "<div>Full HTML content for the page...</div>",
    "excerpt": "Brief description of this service...",
    "featuredImage": "https://example.com/services-hero.jpg",
    "seo": {
      "title": "Managed IT Services | Tymor Technologies",
      "description": "Comprehensive IT management services...",
      "keywords": ["managed it", "it services"],
      "ogTitle": "Professional Managed IT Services",
      "ogDescription": "24/7 IT support and management...",
      "ogImage": "https://example.com/og-services.jpg",
      "canonicalUrl": "https://tymortech.com/services/managed-it"
    },
    "publishedAt": "2025-01-10T00:00:00.000Z"
  }
}
```

---

## 💻 Integration Code Examples

### 1. Blog Listing Page

**Vanilla JavaScript:**

```javascript
// blog-listing.js
async function loadBlogs(page = 1, limit = 9) {
  try {
    const response = await fetch(
      `https://dashboard.tymortech.com/api/public/blogs?limit=${limit}&page=${page}`
    );
    const result = await response.json();
    
    if (result.success) {
      displayBlogs(result.data);
      displayPagination(result.pagination);
    } else {
      console.error('Failed to load blogs');
    }
  } catch (error) {
    console.error('Error loading blogs:', error);
  }
}

function displayBlogs(blogs) {
  const blogGrid = document.getElementById('blog-grid');
  blogGrid.innerHTML = '';
  
  blogs.forEach(blog => {
    const blogCard = createBlogCard(blog);
    blogGrid.appendChild(blogCard);
  });
}

function createBlogCard(blog) {
  const card = document.createElement('div');
  card.className = 'blog-card';
  
  const publishDate = new Date(blog.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  card.innerHTML = `
    ${blog.featuredImage ? `
      <div class="blog-image">
        <img src="${blog.featuredImage}" alt="${blog.title}" loading="lazy">
      </div>
    ` : ''}
    <div class="blog-content">
      <div class="blog-meta">
        <span class="author">${blog.author}</span>
        <span class="date">${publishDate}</span>
      </div>
      <h3>${blog.title}</h3>
      <p class="excerpt">${blog.excerpt || ''}</p>
      <div class="blog-tags">
        ${blog.categories.map(cat => `<span class="tag">${cat}</span>`).join('')}
      </div>
      <a href="/blog/${blog.slug}" class="read-more">Read More →</a>
    </div>
  `;
  
  return card;
}

function displayPagination(pagination) {
  const paginationContainer = document.getElementById('pagination');
  paginationContainer.innerHTML = '';
  
  for (let i = 1; i <= pagination.pages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.className = i === pagination.page ? 'active' : '';
    button.onclick = () => loadBlogs(i);
    paginationContainer.appendChild(button);
  }
}

// Load blogs when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadBlogs();
});
```

**HTML Structure:**

```html
<!-- blog-listing.html -->
<section class="blog-section">
  <div class="container">
    <h1>Latest Insights</h1>
    <div id="blog-grid" class="blog-grid">
      <!-- Blog cards will be inserted here -->
    </div>
    <div id="pagination" class="pagination">
      <!-- Pagination buttons will be inserted here -->
    </div>
  </div>
</section>

<script src="blog-listing.js"></script>
```

---

### 2. Single Blog Post Page

**Vanilla JavaScript:**

```javascript
// blog-single.js
async function loadBlogPost() {
  // Get slug from URL
  const pathParts = window.location.pathname.split('/');
  const slug = pathParts[pathParts.length - 1];
  
  if (!slug) {
    window.location.href = '/blog';
    return;
  }
  
  try {
    const response = await fetch(
      `https://dashboard.tymortech.com/api/public/blogs/${slug}`
    );
    const result = await response.json();
    
    if (result.success) {
      displayBlogPost(result.data);
      updateSEO(result.data.seo);
    } else {
      showError('Blog post not found');
    }
  } catch (error) {
    console.error('Error loading blog post:', error);
    showError('Failed to load blog post');
  }
}

function displayBlogPost(blog) {
  // Update title
  document.getElementById('blog-title').textContent = blog.title;
  
  // Update meta information
  document.getElementById('blog-author').textContent = blog.author;
  
  const publishDate = new Date(blog.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  document.getElementById('blog-date').textContent = publishDate;
  
  // Update featured image
  if (blog.featuredImage) {
    document.getElementById('featured-image').innerHTML = `
      <img src="${blog.featuredImage}" alt="${blog.title}">
    `;
  }
  
  // Update content
  document.getElementById('blog-content').innerHTML = blog.content;
  
  // Update categories
  if (blog.categories && blog.categories.length > 0) {
    const categoriesHtml = blog.categories
      .map(cat => `<span class="category-tag">${cat}</span>`)
      .join('');
    document.getElementById('blog-categories').innerHTML = categoriesHtml;
  }
  
  // Update tags
  if (blog.tags && blog.tags.length > 0) {
    const tagsHtml = blog.tags
      .map(tag => `<span class="tag">#${tag}</span>`)
      .join('');
    document.getElementById('blog-tags').innerHTML = tagsHtml;
  }
}

function updateSEO(seo) {
  // Update page title
  document.title = seo.title || 'Blog | Tymor Technologies';
  
  // Update meta description
  updateMetaTag('name', 'description', seo.description);
  updateMetaTag('name', 'keywords', seo.keywords?.join(', '));
  
  // Update Open Graph tags
  updateMetaTag('property', 'og:title', seo.ogTitle);
  updateMetaTag('property', 'og:description', seo.ogDescription);
  updateMetaTag('property', 'og:image', seo.ogImage);
  
  // Update canonical URL
  if (seo.canonicalUrl) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = seo.canonicalUrl;
  }
}

function updateMetaTag(attribute, name, content) {
  if (!content) return;
  
  let tag = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function showError(message) {
  document.getElementById('blog-container').innerHTML = `
    <div class="error-message">
      <h2>${message}</h2>
      <a href="/blog">← Back to Blog</a>
    </div>
  `;
}

// Load blog post when page loads
document.addEventListener('DOMContentLoaded', loadBlogPost);
```

**HTML Structure:**

```html
<!-- blog-single.html -->
<article class="blog-post">
  <div class="container">
    <div id="featured-image" class="featured-image"></div>
    
    <header class="blog-header">
      <div id="blog-categories" class="categories"></div>
      <h1 id="blog-title"></h1>
      <div class="blog-meta">
        <span class="author">By <span id="blog-author"></span></span>
        <span class="date" id="blog-date"></span>
      </div>
    </header>
    
    <div id="blog-content" class="blog-content">
      <!-- Blog content will be inserted here -->
    </div>
    
    <footer class="blog-footer">
      <div id="blog-tags" class="tags"></div>
    </footer>
  </div>
</article>

<script src="blog-single.js"></script>
```

---

### 3. Dynamic Pages (Services, About, etc.)

**Vanilla JavaScript:**

```javascript
// dynamic-page.js
async function loadDynamicPage(slug) {
  try {
    const response = await fetch(
      `https://dashboard.tymortech.com/api/public/pages/${slug}`
    );
    const result = await response.json();
    
    if (result.success) {
      displayPage(result.data);
      updateSEO(result.data.seo);
    } else {
      showError('Page not found');
    }
  } catch (error) {
    console.error('Error loading page:', error);
    showError('Failed to load page');
  }
}

function displayPage(page) {
  // Update page title
  document.getElementById('page-title').textContent = page.title;
  
  // Update featured image (if any)
  if (page.featuredImage) {
    document.getElementById('page-hero').innerHTML = `
      <img src="${page.featuredImage}" alt="${page.title}">
    `;
  }
  
  // Update page content
  document.getElementById('page-content').innerHTML = page.content;
}

// Example: Load "managed-it-services" page
document.addEventListener('DOMContentLoaded', () => {
  loadDynamicPage('managed-it-services');
});
```

**HTML Structure:**

```html
<!-- dynamic-page.html -->
<div class="dynamic-page">
  <div id="page-hero" class="page-hero"></div>
  
  <div class="container">
    <h1 id="page-title"></h1>
    <div id="page-content" class="page-content">
      <!-- Page content will be inserted here -->
    </div>
  </div>
</div>

<script src="dynamic-page.js"></script>
```

---

### 4. Blog Search & Filter

```javascript
// blog-search.js
async function searchBlogs(searchTerm, category = null) {
  let url = `https://dashboard.tymortech.com/api/public/blogs?limit=20`;
  
  if (searchTerm) {
    url += `&search=${encodeURIComponent(searchTerm)}`;
  }
  
  if (category) {
    url += `&category=${encodeURIComponent(category)}`;
  }
  
  try {
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success) {
      displayBlogs(result.data);
      displayResultsCount(result.pagination.total);
    }
  } catch (error) {
    console.error('Error searching blogs:', error);
  }
}

function displayResultsCount(count) {
  document.getElementById('results-count').textContent = 
    `${count} blog post${count !== 1 ? 's' : ''} found`;
}

// Setup search form
document.getElementById('search-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const searchTerm = document.getElementById('search-input').value;
  searchBlogs(searchTerm);
});

// Setup category filter
document.querySelectorAll('.category-filter').forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.category;
    searchBlogs(null, category);
  });
});
```

**HTML Structure:**

```html
<!-- Blog search and filter -->
<div class="blog-controls">
  <form id="search-form">
    <input type="text" id="search-input" placeholder="Search blogs...">
    <button type="submit">Search</button>
  </form>
  
  <div class="category-filters">
    <button class="category-filter" data-category="Technology">Technology</button>
    <button class="category-filter" data-category="AI">AI</button>
    <button class="category-filter" data-category="Security">Security</button>
  </div>
  
  <div id="results-count"></div>
</div>
```

---

### 5. Latest Blogs Widget (For Homepage)

```javascript
// latest-blogs-widget.js
async function loadLatestBlogs(limit = 3) {
  try {
    const response = await fetch(
      `https://dashboard.tymortech.com/api/public/blogs?limit=${limit}`
    );
    const result = await response.json();
    
    if (result.success) {
      const widget = document.getElementById('latest-blogs-widget');
      widget.innerHTML = result.data.map(blog => `
        <div class="blog-widget-item">
          ${blog.featuredImage ? `
            <img src="${blog.featuredImage}" alt="${blog.title}">
          ` : ''}
          <h4><a href="/blog/${blog.slug}">${blog.title}</a></h4>
          <p>${blog.excerpt?.substring(0, 100)}...</p>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading latest blogs:', error);
  }
}

// Load when page loads
document.addEventListener('DOMContentLoaded', () => loadLatestBlogs(3));
```

---

## 🎨 CSS Styling Examples

```css
/* Blog Grid */
.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.blog-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.blog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.blog-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.blog-content {
  padding: 1.5rem;
}

.blog-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.blog-card h3 {
  margin: 0.5rem 0;
  color: #0066cc;
}

.excerpt {
  color: #555;
  line-height: 1.6;
}

.blog-tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.tag {
  background: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.read-more {
  color: #0066cc;
  text-decoration: none;
  font-weight: 600;
  display: inline-block;
  margin-top: 1rem;
}

/* Single Blog Post */
.blog-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.featured-image img {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.blog-header {
  margin-bottom: 2rem;
}

.categories {
  margin-bottom: 1rem;
}

.category-tag {
  background: #0066cc;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  margin-right: 0.5rem;
}

.blog-content {
  line-height: 1.8;
  font-size: 1.125rem;
}

.blog-content h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.blog-content img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

/* Pagination */
.pagination {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 3rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.pagination button.active {
  background: #0066cc;
  color: white;
  border-color: #0066cc;
}
```

---

## 🔐 Dashboard Access & Content Management

### Login to Dashboard

1. **URL**: `https://dashboard.tymortech.com/auth/signin`
2. **Credentials**:
   - Email: `hsandilya@tymortech.com`
   - Password: `Harsh@1232@`

### Creating a Blog Post

1. Go to **Dashboard → Blogs → Create Blog Post**
2. Fill in:
   - **Title**: "How AI is Transforming IT Services"
   - **Slug**: Auto-generated or custom (e.g., `how-ai-transforming-it-services`)
   - **Content**: Rich text editor with HTML support
   - **Excerpt**: Brief summary (max 300 chars)
   - **Featured Image**: Upload or paste URL
   - **Author**: Your name
   - **Categories**: Technology, AI, etc.
   - **Tags**: Keywords for SEO
   - **SEO Meta**: Custom title, description, OG tags
   - **Status**: Draft or Published
3. Click **"Create Blog Post"**
4. Blog appears immediately on tymortech.com

### Creating a Dynamic Page

1. Go to **Dashboard → Pages → Create Page**
2. Fill in:
   - **Title**: "Managed IT Services"
   - **Slug**: `managed-it-services`
   - **Content**: Full HTML content
   - **SEO Meta**: Page-specific SEO tags
   - **Status**: Published
3. Click **"Create Page"**
4. Fetch on tymortech.com using the slug

---

## 🚀 Deployment Steps

### 1. Deploy Dashboard to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 2. Configure Custom Domain

In Vercel dashboard:
1. Add domain: `dashboard.tymortech.com`
2. Add CNAME record in DNS:
   - **Type**: CNAME
   - **Name**: `dashboard`
   - **Value**: `cname.vercel-dns.com`

### 3. Set Environment Variables

In Vercel, add:
```env
MONGODB_URI=mongodb+srv:
NEXTAUTH_SECRET=Bk....
NEXTAUTH_URL=https://dashboard.tymortech.com
NEXT_PUBLIC_SITE_URL=https://dashboard.tymortech.com
NEXT_PUBLIC_MAIN_SITE=https://tymortech.com
NEXT_PUBLIC_DASHBOARD_URL=https://dashboard.tymortech.com
```

---

## 🧪 Testing

### Test APIs Locally

```bash
# Get all blogs
curl http://localhost:3000/api/public/blogs

# Get single blog
curl http://localhost:3000/api/public/blogs/my-blog-slug

# Get all pages
curl http://localhost:3000/api/public/pages

# Get single page
curl http://localhost:3000/api/public/pages/managed-it-services
```

### Test in Browser

Open: `http://localhost:3000/integration-example.html`

This shows a working example of blog integration.

---

## ❓ Troubleshooting

### CORS Errors

If you get CORS errors:
1. Verify `NEXT_PUBLIC_MAIN_SITE` is set to `https://tymortech.com`
2. Check middleware configuration
3. Ensure requests come from the correct domain

### Blog Not Showing

1. Verify blog is **Published** (not Draft)
2. Check browser console for errors
3. Test API endpoint directly in browser
4. Verify slug is correct

### SEO Not Working

1. Make sure SEO fields are filled in dashboard
2. Call `updateSEO()` function after loading content
3. Check meta tags in browser inspector

---

## 📊 Content Best Practices

### Blog Posts

- **Title**: Clear, descriptive, 50-60 characters
- **Slug**: Short, lowercase, hyphens (e.g., `ai-in-it-services`)
- **Excerpt**: Compelling summary, 150-200 characters
- **Featured Image**: 1200x630px for best OG preview
- **Categories**: 1-3 relevant categories
- **Tags**: 3-5 relevant keywords
- **Content**: Well-formatted HTML with headings, images, lists

### Dynamic Pages

- **Slug**: Match your URL structure
- **Content**: Include proper heading hierarchy (H2, H3)
- **SEO Title**: Include primary keyword, under 60 chars
- **SEO Description**: Compelling, 150-160 characters
- **Images**: Optimize for web (compressed)

---

## ✅ Quick Reference

### API Endpoints Quick List

```javascript
// Blogs
GET  /api/public/blogs                    // All blogs
GET  /api/public/blogs?limit=6&page=1     // Paginated
GET  /api/public/blogs?category=AI        // By category
GET  /api/public/blogs?search=security    // Search
GET  /api/public/blogs/{slug}             // Single blog

// Pages
GET  /api/public/pages                    // All pages
GET  /api/public/pages/{slug}             // Single page
```

### Common Fetch Examples

```javascript
// Latest 6 blogs for homepage
fetch('https://dashboard.tymortech.com/api/public/blogs?limit=6')

// AI category blogs
fetch('https://dashboard.tymortech.com/api/public/blogs?category=AI')

// Search blogs
fetch('https://dashboard.tymortech.com/api/public/blogs?search=cloud')

// Get specific blog
fetch('https://dashboard.tymortech.com/api/public/blogs/my-blog-slug')

// Get services page
fetch('https://dashboard.tymortech.com/api/public/pages/managed-it-services')
```

---

## 🎯 Summary

**What You Can Do:**

✅ Manage all blog content from one dashboard  
✅ Create and edit dynamic pages  
✅ SEO-optimized content with custom meta tags  
✅ Real-time content updates  
✅ Blog search and filtering  
✅ View analytics and metrics  
✅ No database needed on tymortech.com  

**The Workflow:**

1. Login to `dashboard.tymortech.com`
2. Create/edit blogs or pages
3. Click "Publish"
4. Content appears on tymortech.com instantly
5. Monitor views and analytics in dashboard

---

**Dashboard**: https://dashboard.tymortech.com  
**Login**: hsandilya@tymortech.com  
**Password**: Harsh@1232@  
**Support**: Check DEPLOYMENT_GUIDE.md for detailed setup instructions

