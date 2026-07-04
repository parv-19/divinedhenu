    Create complete Product admin API.

Admin routes:
POST /api/admin/products
GET /api/admin/products
GET /api/admin/products/:id
PUT /api/admin/products/:id
DELETE /api/admin/products/:id
PATCH /api/admin/products/:id/status
PATCH /api/admin/products/:id/featured
PATCH /api/admin/products/:id/bestseller

Public routes:
GET /api/products
GET /api/products/:slug
GET /api/products/bestsellers
GET /api/products/featured
GET /api/products/by-category/:categorySlug

Product create/edit should support:
- name
- category
- price
- originalPrice
- shortDescription
- description
- multiple images
- moodTags
- ritualUse
- fragranceNotes
- ingredients
- howToUse
- stock
- sku
- isBestseller
- isFeatured
- isActive
- metaTitle
- metaDescription

Admin product list filters:
- search
- category
- isActive
- isBestseller
- isFeatured
- stock status
- pagination
- sort by newest, priceLow, priceHigh

Public product list filters:
- search
- category
- mood
- minPrice
- maxPrice
- sort
- pagination

Important:
- Product slug should auto-generate from name
- Populate category in product response
- If product image is removed, delete it from Cloudinary too
- Public routes should only show active products