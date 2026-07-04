export const cowpediaTopics = [
  {
    slug: 'cow-basics',
    title: 'Cow Basics & Science',
    subtitle: 'The fundamentals behind indigenous cows, milk quality, and traditional dairy wisdom',
    description: 'Everything you need to know about cows, desi breeds, milk types, and how cow care influences dairy quality.',
    cta: 'Explore Cow Basics',
  },
  {
    slug: 'breeds-milk-types',
    title: 'Breeds & Milk Types',
    subtitle: 'Understand Gir, Sahiwal, indigenous breeds, A2 milk, and regional dairy differences',
    description: 'How cow breeds, milk types, and feeding practices influence nutrition, texture, and everyday dairy use.',
    cta: 'Explore Cow Breeds',
  },
  {
    slug: 'feeding-nutrition',
    title: 'Feeding & Nutrition',
    subtitle: 'Grass, fodder, minerals, seasonal care, and how diet shapes milk quality',
    description: 'A practical look at cow diets, grass-fed care, mineral balance, hydration, and nutrition-led milk quality.',
    cta: 'Explore Cow Nutrition',
  },
  {
    slug: 'ethical-dairy-farming',
    title: 'Ethical Dairy & Farming',
    subtitle: 'Transparent farm practices, animal welfare, milking methods, and clean dairy systems',
    description: 'Modern and traditional ways to care for cows while maintaining hygiene, trust, and responsible dairy practices.',
    cta: 'Explore Ethical Dairy',
  },
  {
    slug: 'calf-care-health',
    title: 'Calf Care & Health',
    subtitle: 'Daily health, immunity, veterinary care, seasonal routines, and calf-first dairy practices',
    description: 'Guidance on cow and calf health, immunity, seasonal care, daily observation, and gentle handling.',
    cta: 'Explore Cow Health',
  },
  {
    slug: 'culture-traditions',
    title: 'Cow Culture & Traditions',
    subtitle: 'The spiritual, cultural, and historical place of cows in Indian households and rituals',
    description: 'The cultural, spiritual, and historical role of cows in Indian traditions, festivals, rituals, and rural life.',
    cta: 'Explore Cow Traditions',
  },
  {
    slug: 'buying-testing',
    title: 'Buying, Storing & Testing',
    subtitle: 'How to evaluate milk, ghee, farm claims, sourcing, freshness, and purity signals',
    description: 'How to choose trustworthy dairy products, ask better sourcing questions, and understand purity confidence.',
    cta: 'Learn How to Choose',
  },
  {
    slug: 'farmer-economics',
    title: 'Cow Business & Farmer Economics',
    subtitle: 'An inside view of dairy farming, milk pricing, breed economics, and supply chains',
    description: 'An inside view of cow-based dairy economics, farmer realities, pricing, policies, and supply chains.',
    cta: 'Explore Dairy Industry',
  },
  {
    slug: 'divinedhenu-specials',
    title: 'DivineDhenu Knowledge Specials',
    subtitle: 'Exclusive insights into DivineDhenu sourcing, testing, transparency, and care practices',
    description: 'Exclusive insights into DivineDhenu sourcing, cow care, testing, research, and transparency practices.',
    cta: 'Explore DivineDhenu Insights',
  },
];

export const getCowpediaTopic = (slug) => cowpediaTopics.find((topic) => topic.slug === slug);
