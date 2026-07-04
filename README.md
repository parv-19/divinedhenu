# DivineDhenu CMS Ecommerce

A full CMS-style MERN ecommerce project for a ritual fragrance and incense brand. The public React storefront now reads from the backend APIs, while the admin panel manages products, categories, homepage content, reviews, offers, and site settings.

## Features

- React + Vite storefront with cart and dynamic catalog
- Admin panel with JWT login and protected routes
- Product, category, banner, offer, review, and site setting CMS APIs
- MongoDB + Mongoose models with validation and slugs
- Cloudinary image uploads through Multer memory storage
- Dashboard stats endpoint
- Ritual Finder recommendations by product mood
- Demo seed data for local testing

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, lucide-react
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth: JWT, bcryptjs
- Uploads: Multer, Cloudinary
- Deployment targets: Vercel frontend, Render backend, MongoDB Atlas, Cloudinary

## Folder Structure

```text
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
  package.json

src/
  admin/
    components/
    pages/
    services/
  components/
  pages/
  services/
```

## Environment Variables

Frontend `.env`:

```text
VITE_API_URL=http://localhost:5000/api
```

Backend `backend/.env`:

```text
PORT=5000
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
FRONTEND_URL=http://localhost:5173
```

Use a strong `JWT_SECRET` in production.

## Local Setup

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

Run backend:

```bash
cd backend
npm run dev
```

Run frontend:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`. Backend runs at `http://localhost:5000`.

## Seed Data

Seed demo CMS data:

```bash
cd backend
npm run seed
```

Clear seed data:

```bash
cd backend
npm run seed:clear
```

Default seeded admin:

```text
Email: admin@divinedhenu.test
Password: Admin@12345
```

If you do not seed, create the first admin manually:

```text
POST /api/admin/auth/setup
```

Body:

```json
{
  "name": "Admin",
  "email": "admin@example.com",
  "password": "Admin@12345"
}
```

## Main API Routes

- Public products: `GET /api/products`
- Product details: `GET /api/products/:slug`
- Mood recommendations: `GET /api/products/by-mood/:mood`
- Public categories: `GET /api/categories`
- Public banners: `GET /api/banners?position=home_hero`
- Active offers: `GET /api/offers/active`
- Featured reviews: `GET /api/reviews/featured`
- Site settings: `GET /api/site-settings`
- Admin login: `POST /api/admin/auth/login`
- Admin dashboard: `GET /api/admin/dashboard/stats`

## Deployment

### Backend on Render

Use `render.yaml` or create a Render Web Service manually:

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Add all backend environment variables
- Set `FRONTEND_URL` to your Vercel URL

### Frontend on Vercel

- Build command: `npm run build`
- Output directory: `dist`
- Add `VITE_API_URL` with your Render backend URL, ending in `/api`

### Database and Images

- Use MongoDB Atlas for `MONGO_URI`
- Use Cloudinary for image upload credentials
- Make sure Atlas network access allows your deployment host

## Production Checklist

- Replace local `JWT_SECRET`
- Verify MongoDB Atlas connection
- Verify Cloudinary upload/delete
- Run `npm run build`
- Seed only if demo content is desired
- Confirm public APIs return active content only
- Confirm admin routes require JWT
