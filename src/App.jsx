import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import AdminLayout from './admin/components/AdminLayout.jsx';
import ProtectedAdminRoute from './admin/components/ProtectedAdminRoute.jsx';
import Banners from './admin/pages/Banners.jsx';
import BannerForm from './admin/pages/BannerForm.jsx';
import Categories from './admin/pages/Categories.jsx';
import CategoryForm from './admin/pages/CategoryForm.jsx';
import BlogForm from './admin/pages/BlogForm.jsx';
import Blogs from './admin/pages/Blogs.jsx';
import Combos from './admin/pages/Combos.jsx';
import Dashboard from './admin/pages/Dashboard.jsx';
import Login from './admin/pages/Login.jsx';
import CustomerLogin from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Offers from './admin/pages/Offers.jsx';
import OfferForm from './admin/pages/OfferForm.jsx';
import Orders from './admin/pages/Orders.jsx';
import ProductForm from './admin/pages/ProductForm.jsx';
import Products from './admin/pages/Products.jsx';
import Reviews from './admin/pages/Reviews.jsx';
import Settings from './admin/pages/Settings.jsx';
import Navbar from './components/layout/Navbar.jsx';
import MobileBottomNav from './components/layout/MobileBottomNav.jsx';
import Footer from './components/layout/Footer.jsx';
import WhatsAppChat from './components/layout/WhatsAppChat.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import About from './pages/About.jsx';
import Blog from './pages/Blog.jsx';
import BlogDetails from './pages/BlogDetails.jsx';
import Contact from './pages/Contact.jsx';
import CowPedia from './pages/CowPedia.jsx';
import CowPediaTopic from './pages/CowPediaTopic.jsx';
import LegalPage from './pages/LegalPage.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const redirectPath = window.sessionStorage.getItem('divinedhenu:spa-redirect');
    if (!redirectPath) return;

    window.sessionStorage.removeItem('divinedhenu:spa-redirect');
    if (redirectPath !== location.pathname) {
      navigate(redirectPath, { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-ritual-background text-ritual-text">
      {!isAdminRoute ? <Navbar /> : null}
      <main className={!isAdminRoute ? 'pb-16 lg:pb-0' : ''}>
        <Routes>
          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<Login />} />
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="categories" element={<Categories />} />
              <Route path="categories/new" element={<CategoryForm />} />
              <Route path="categories/edit/:id" element={<CategoryForm />} />
              <Route path="products" element={<Products />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/edit/:id" element={<ProductForm />} />
              <Route path="orders" element={<Orders />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="blogs/new" element={<BlogForm />} />
              <Route path="blogs/edit/:id" element={<BlogForm />} />
              <Route path="combos" element={<Combos />} />
              <Route path="banners" element={<Banners />} />
              <Route path="banners/new" element={<BannerForm />} />
              <Route path="banners/edit/:id" element={<BannerForm />} />
              <Route path="offers" element={<Offers />} />
              <Route path="offers/new" element={<OfferForm />} />
              <Route path="offers/edit/:id" element={<OfferForm />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/collections/agarbatti" element={<Shop />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetails />} />
          <Route path="/cowpedia" element={<CowPedia />} />
          <Route path="/cowpedia/:topicSlug" element={<CowPediaTopic />} />
          <Route path="/cowpedia/:topicSlug/:slug" element={<BlogDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/:policySlug" element={<LegalPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminRoute ? <Footer /> : null}
      {!isAdminRoute ? <WhatsAppChat /> : null}
      {!isAdminRoute ? <MobileBottomNav /> : null}
    </div>
  );
}
