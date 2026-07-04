Create CMS APIs for homepage dynamic content.

Banner Admin Routes:
POST /api/admin/banners
GET /api/admin/banners
PUT /api/admin/banners/:id
DELETE /api/admin/banners/:id
PATCH /api/admin/banners/:id/status

Public:
GET /api/banners?position=home_hero

Offer Admin Routes:
POST /api/admin/offers
GET /api/admin/offers
PUT /api/admin/offers/:id
DELETE /api/admin/offers/:id
PATCH /api/admin/offers/:id/status

Public:
GET /api/offers/active

Review Admin Routes:
POST /api/admin/reviews
GET /api/admin/reviews
PUT /api/admin/reviews/:id
DELETE /api/admin/reviews/:id
PATCH /api/admin/reviews/:id/status

Public:
GET /api/reviews/featured

Requirements:
- Admin can control homepage hero banner
- Admin can control offer marquee text
- Admin can add/edit/delete reviews
- Public APIs only return active content
- Sort by sortOrder where available