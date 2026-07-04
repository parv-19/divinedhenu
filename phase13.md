Now remove dependency on static products.js for public website.

Create frontend service:
src/services/api.js

Use public API endpoints:
GET /api/products
GET /api/products/:slug
GET /api/products/bestsellers
GET /api/products/featured
GET /api/categories
GET /api/banners?position=home_hero
GET /api/offers/active
GET /api/reviews/featured
GET /api/site-settings

Update these pages/components:
- Home
- Shop
- ProductDetails
- Navbar
- Footer
- OfferStrip
- ShopByRitual
- Bestsellers
- RitualFinderQuiz
- Reviews

Requirements:
- Use loading skeletons
- Use error states
- Use empty states
- Maintain same design
- Product details page should fetch by slug
- Shop page filters should call API with query params
- Categories should come from backend
- Offer marquee should come from backend
- Homepage banner should come from backend
- Footer content should come from site settings API

Keep static fallback only if API fails, but prefer dynamic backend data.