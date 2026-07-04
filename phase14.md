Make Ritual Finder dynamic.

Backend:
Add field to Product:
- ritualMoods: array of strings

Possible moods:
- Calm
- Focus
- Prayer
- Freshness
- Sleep
- Gifting

Public API:
GET /api/products/by-mood/:mood

Admin:
Product form should allow selecting ritual moods.

Frontend:
Ritual Finder quiz should call:
GET /api/products/by-mood/Calm
GET /api/products/by-mood/Focus
etc.

Show 3 to 6 recommended products.
If no products found, show a clean empty state.

Keep design premium.