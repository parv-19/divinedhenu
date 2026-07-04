Build the full Shop page.

Features:
1. Product grid
2. Category filter
3. Mood filter
4. Sort by:
   - Featured
   - Price low to high
   - Price high to low
   - Bestsellers
5. Search by product name
6. Product count
7. Empty state if no products found

Use products.js data.

Shop page layout:
- Left sidebar filters on desktop
- Top filter drawer on mobile
- Product grid on right

Categories:
- All
- Incense Cones
- Bambooless Dhoop
- Bambooless Incense
- Havan Cups
- Ritual Gift Sets
- Bestsellers

Mood filters:
- Calm
- Focus
- Prayer
- Fresh
- Sleep
- Gifting

Make URL query support:
If user visits /shop?category=Incense%20Cones, filter should apply automatically.

Use clean React state.
Do not add backend yet.