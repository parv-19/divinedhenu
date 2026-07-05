import axios from 'axios';
import { getFallbackBlogBySlug, getFallbackBlogs } from '../data/blogContent.js';
import { categories as fallbackCategories, products as fallbackProducts } from '../data/products.js';

export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

const api = axios.create({ baseURL: API_BASE_URL });

export const getImageValue = (product) => (
  product?.image || product?.images?.[0]?.url || product?.images?.[0] || ''
);

export const normalizeProduct = (product) => {
  const categoryName = typeof product.category === 'string' ? product.category : product.category?.name;
  return {
    ...product,
    id: product.id || product._id,
    category: categoryName || 'Ritual Fragrance',
    categorySlug: product.category?.slug || '',
    image: getImageValue(product),
    stockStatus: product.stockStatus || (product.stock <= 0 ? 'Out of stock' : product.stock <= 5 ? 'Low stock' : 'In stock'),
    moodTags: product.moodTags || [],
    ritualMoods: product.ritualMoods || [],
    fragranceNotes: product.fragranceNotes || [],
  };
};

export const normalizeBlog = (blog) => ({
  ...blog,
  id: blog.id || blog._id,
  heroImageUrl: blog.heroImage?.url || '',
  featuredProducts: (blog.featuredProducts || []).filter(Boolean).map(normalizeProduct),
});

export const fallback = {
  products: fallbackProducts.map(normalizeProduct),
  categories: fallbackCategories,
  blogs: getFallbackBlogs({ limit: 100 }).map(normalizeBlog),
};

export const publicApi = {
  async getProducts(params = {}) {
    const { data } = await api.get('/products', { params });
    return {
      products: (data.products || []).map(normalizeProduct),
      pagination: data.pagination,
    };
  },
  async getProduct(slug) {
    const { data } = await api.get(`/products/${slug}`);
    return normalizeProduct(data.product);
  },
  async getBestsellers() {
    const { data } = await api.get('/products/bestsellers');
    return (data.products || []).map(normalizeProduct);
  },
  async getProductsByMood(mood) {
    const { data } = await api.get(`/products/by-mood/${encodeURIComponent(mood)}`);
    return (data.products || []).map(normalizeProduct);
  },
  async getCategories() {
    const { data } = await api.get('/categories');
    return data.categories || [];
  },
  async getBanners(position) {
    const { data } = await api.get('/banners', { params: { position } });
    return data.banners || [];
  },
  async getOffers() {
    const { data } = await api.get('/offers/active');
    return data.offers || [];
  },
  async getReviews() {
    const { data } = await api.get('/reviews/featured');
    return data.reviews || [];
  },
  async getSiteSettings() {
    const { data } = await api.get('/site-settings');
    return data.settings;
  },
  async getBlogs(params = {}) {
    const { data } = await api.get('/blogs', { params });
    const blogs = (data.blogs || []).map(normalizeBlog);
    return {
      blogs: blogs.length ? blogs : getFallbackBlogs(params).map(normalizeBlog),
      pagination: data.pagination,
    };
  },
  async getBlog(slug) {
    try {
      const { data } = await api.get(`/blogs/${slug}`);
      return normalizeBlog(data.blog);
    } catch (error) {
      const fallbackBlog = getFallbackBlogBySlug(slug);
      if (fallbackBlog) return normalizeBlog(fallbackBlog);
      throw error;
    }
  },
  async createOrder(payload) {
    const { data } = await api.post('/orders', payload);
    return data.order;
  },
};

export default api;
