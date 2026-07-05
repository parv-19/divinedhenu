const cowpediaImages = {
  'cow-basics': 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=1200&q=80',
  'breeds-milk-types': 'https://images.unsplash.com/photo-1545468800-85cc9bc6ecf7?auto=format&fit=crop&w=1200&q=80',
  'feeding-nutrition': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  'ethical-dairy-farming': 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80',
  'calf-care-health': 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1200&q=80',
  'culture-traditions': 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=1200&q=80',
  'buying-testing': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=1200&q=80',
  'farmer-economics': 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80',
  'divinedhenu-specials': 'https://images.unsplash.com/photo-1582515073490-39981397c445?auto=format&fit=crop&w=1200&q=80',
};

export const fallbackBlogs = [
  {
    id: 'fallback-blog-1',
    title: 'How to Choose Incense for Daily Puja',
    slug: 'how-to-choose-incense-for-daily-puja',
    excerpt: 'A simple guide to choosing fragrance notes, burn formats, and ritual pairings for a peaceful daily puja routine.',
    section: 'blog',
    publishedAt: '2026-06-28T00:00:00.000Z',
    heroImage: {
      url: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=1200&q=80',
      alt: 'Incense smoke in a calm ritual setting',
    },
    contentBlocks: [
      { type: 'paragraph', text: 'Daily puja fragrance should feel clean, devotional, and comfortable for the whole room. Start with softer notes such as sandalwood, rose, camphor, or vetiver before moving to heavier resin profiles.' },
      { type: 'heading', text: 'Match fragrance to the moment' },
      { type: 'paragraph', text: 'Morning rituals work well with fresh citrus, tulsi, and camphor notes. Evening rituals can carry deeper woods, amber, and myrrh.' },
      { type: 'image', image: { url: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=1200&q=80', alt: 'Lit incense for home fragrance' } },
      { type: 'paragraph', text: 'A CMS-managed blog lets you publish guides like this, add product recommendations, and update seasonal ritual content from the admin panel.' },
    ],
    featuredProducts: [],
  },
  {
    id: 'fallback-blog-2',
    title: 'Dhoop, Incense, and Havan Cups: What Fits Your Ritual?',
    slug: 'dhoop-incense-and-havan-cups-what-fits-your-ritual',
    excerpt: 'Understand the difference between popular ritual fragrance formats and when to use each one at home.',
    section: 'blog',
    publishedAt: '2026-06-20T00:00:00.000Z',
    heroImage: {
      url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80',
      alt: 'Warm ritual fragrance setup',
    },
    contentBlocks: [
      { type: 'paragraph', text: 'Incense is light and everyday-friendly, dhoop is deeper and more devotional, while havan cups are designed for auspicious fire rituals.' },
      { type: 'heading', text: 'Build a fragrance routine' },
      { type: 'list', items: ['Use incense for daily ambience.', 'Use dhoop for prayer and meditation.', 'Use havan cups for festivals, griha pravesh, and special rituals.'] },
    ],
    featuredProducts: [],
  },
];

export const fallbackCowpediaPosts = Object.entries(cowpediaImages).map(([topic, image], index) => ({
  id: `fallback-cowpedia-${topic}`,
  title: [
    'Understanding Indigenous Cow Wisdom',
    'A2 Milk and Breed Identity',
    'Feeding Practices That Shape Milk Quality',
    'What Ethical Dairy Means in Practice',
    'Calf-First Care and Daily Health Signals',
    'Cows in Indian Ritual and Culture',
    'How to Read Milk and Ghee Quality Claims',
    'The Economics Behind Responsible Dairy',
    'DivineDhenu Notes on Transparency and Care',
  ][index],
  slug: [
    'understanding-indigenous-cow-wisdom',
    'a2-milk-and-breed-identity',
    'feeding-practices-that-shape-milk-quality',
    'what-ethical-dairy-means-in-practice',
    'calf-first-care-and-daily-health-signals',
    'cows-in-indian-ritual-and-culture',
    'how-to-read-milk-and-ghee-quality-claims',
    'the-economics-behind-responsible-dairy',
    'divinedhenu-notes-on-transparency-and-care',
  ][index],
  excerpt: 'A CMS-ready knowledge article preview for CowPedia. Replace or expand it from the admin dashboard after your first production login.',
  section: 'cowpedia',
  topic,
  publishedAt: `2026-06-${String(18 - index).padStart(2, '0')}T00:00:00.000Z`,
  heroImage: {
    url: image,
    alt: 'Indian cow and dairy knowledge article',
  },
  contentBlocks: [
    { type: 'paragraph', text: 'CowPedia is designed as a structured CMS knowledge base. Each topic can contain long-form articles, images, product links, and educational content managed from the admin panel.' },
    { type: 'heading', text: 'A practical knowledge layer' },
    { type: 'paragraph', text: 'Use this article as a starting point, then update it with your farm practices, sourcing details, testing methods, and brand-specific learning content.' },
    { type: 'image', image: { url: image, alt: 'CowPedia knowledge visual' } },
  ],
  featuredProducts: [],
}));

export const fallbackAllBlogs = [...fallbackBlogs, ...fallbackCowpediaPosts];

export const getFallbackBlogs = ({ section, topic, limit = 24 } = {}) => {
  let result = [...fallbackAllBlogs];
  if (section) result = result.filter((blog) => blog.section === section);
  if (topic) result = result.filter((blog) => blog.topic === topic);
  return result.slice(0, Number(limit) || 24);
};

export const getFallbackBlogBySlug = (slug) => fallbackAllBlogs.find((blog) => blog.slug === slug);

export const getCowpediaTopicImage = (slug) => cowpediaImages[slug];
