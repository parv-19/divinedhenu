You are a senior MERN stack developer.

My current project is a React + Vite ecommerce website for an incense/fragrance brand. It is currently static using local products.js data.

Now convert it into a CMS-style ecommerce system with:
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT admin auth
- Cloudinary image upload
- Multer for multipart image upload

Create a separate backend folder:

backend/
  src/
    config/
      db.js
      cloudinary.js
    models/
    controllers/
    routes/
    middleware/
    utils/
    app.js
    server.js
  uploads/
  .env
  package.json

Install required packages:
express
mongoose
dotenv
cors
bcryptjs
jsonwebtoken
multer
cloudinary
express-validator
slugify

Create basic Express server.
Connect MongoDB using Mongoose.
Add global error handler.
Add not found middleware.
Add CORS for frontend URL.
Use /api prefix for all routes.

Create .env.example with:
PORT=5000
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
FRONTEND_URL=http://localhost:5173

Make sure npm run dev starts backend properly.