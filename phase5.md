Create complete Category admin API.

Admin routes:
POST /api/admin/categories
GET /api/admin/categories
GET /api/admin/categories/:id
PUT /api/admin/categories/:id
DELETE /api/admin/categories/:id

Public routes:
GET /api/categories
GET /api/categories/:slug

Admin should be able to:
- Add category
- Upload category image
- Edit category
- Delete category
- Active/inactive category
- Set sort order

Important:
- Category slug should auto-generate from name
- Slug should be unique
- Do not allow deleting category if products exist in that category
- Public API should only return active categories
- Admin API should return all categories

Use clean controller/service structure.