Now create the admin panel inside the existing React frontend.

Routes:
/admin/login
/admin/dashboard
/admin/categories
/admin/categories/new
/admin/categories/edit/:id
/admin/products
/admin/products/new
/admin/products/edit/:id
/admin/banners
/admin/offers
/admin/reviews
/admin/settings

Create admin layout:
src/admin/
  components/
    AdminLayout.jsx
    AdminSidebar.jsx
    AdminTopbar.jsx
    ProtectedAdminRoute.jsx
    ImageUploader.jsx
    ConfirmDialog.jsx
    DataTable.jsx
  pages/
    Login.jsx
    Dashboard.jsx
    Categories.jsx
    CategoryForm.jsx
    Products.jsx
    ProductForm.jsx
    Banners.jsx
    Offers.jsx
    Reviews.jsx
    Settings.jsx
  services/
    adminApi.js

Admin UI style:
- Keep same premium warm theme
- But dashboard should be clean and practical
- Sidebar navigation
- Topbar with admin name and logout
- Cards for stats
- Tables for list pages
- Forms for create/edit

Use Axios for API calls.
Store JWT token in localStorage.
Add axios interceptor to attach Authorization Bearer token.