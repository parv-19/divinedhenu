Create image upload system using Multer + Cloudinary.

Requirements:
1. Configure Cloudinary in src/config/cloudinary.js
2. Configure Multer memory storage
3. Allow only image files:
   - jpg
   - jpeg
   - png
   - webp
4. Max file size: 5MB
5. Create upload middleware:
   uploadSingle(fieldName)
   uploadMultiple(fieldName, maxCount)

Routes:
POST /api/admin/upload/single
POST /api/admin/upload/multiple
DELETE /api/admin/upload/:publicId

All upload routes must be protected by admin auth.

When image uploads:
- Upload to Cloudinary folder: aaroma-rituals
- Return url and publicId
- For multiple upload return array

Also create utility:
deleteFromCloudinary(publicId)

Important:
Use buffer upload stream, not local disk permanent storage.
Clean error handling for invalid file type and large file size.