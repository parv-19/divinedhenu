Create all CMS database models using Mongoose.

Models needed:

1. AdminUser
Fields:
- name
- email
- password
- role: super_admin/admin
- isActive
- lastLogin

2. Category
Fields:
- name
- slug
- description
- image: { url, publicId }
- isActive
- sortOrder
- seoTitle
- seoDescription

3. Product
Fields:
- name
- slug
- category: ObjectId ref Category
- price
- originalPrice
- shortDescription
- description
- images: array of { url, publicId, alt }
- moodTags: array
- ritualUse
- fragranceNotes: array
- ingredients
- howToUse
- stock
- sku
- isBestseller
- isFeatured
- isActive
- metaTitle
- metaDescription

4. Banner
Fields:
- title
- subtitle
- buttonText
- buttonLink
- image: { url, publicId }
- position: home_hero/shop_top
- isActive
- sortOrder

5. Offer
Fields:
- text
- type: marquee/coupon/banner
- discountPercent
- couponCode
- isActive
- startDate
- endDate

6. Review
Fields:
- customerName
- city
- rating
- message
- product: ObjectId ref Product
- isActive
- isFeatured

7. SiteSetting
Fields:
- brandName
- logo: { url, publicId }
- email
- phone
- whatsapp
- instagram
- facebook
- youtube
- address
- footerText
- newsletterTitle
- newsletterDescription

Important:
- Add timestamps to every schema.
- Add slug generation where needed.
- Add proper validation.
- Product category should use Mongoose ref and populate support.
- Do not break existing frontend naming style.