Create Site Settings CMS API.

Admin routes:
GET /api/admin/site-settings
PUT /api/admin/site-settings

Public route:
GET /api/site-settings

Admin should control:
- Brand name
- Logo
- Email
- Phone
- WhatsApp number
- Instagram link
- Facebook link
- YouTube link
- Address
- Footer text
- Newsletter title
- Newsletter description
- SEO default title
- SEO default description

Important:
- There should be only one SiteSetting document
- If no settings exist, create default settings automatically
- Logo upload should support Cloudinary image object