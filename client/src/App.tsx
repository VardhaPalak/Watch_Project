import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import AnnouncementBar from "./components/layout/AnnouncementBar";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import CartDrawer from "./components/layout/CartDrawer";
import WhatsAppFab from "./components/enquiry/WhatsAppFab";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";

const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Enquiry = lazy(() => import("./pages/Enquiry"));
const Account = lazy(() => import("./pages/Account"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const Brands = lazy(() => import("./pages/Brands"));
const Collections = lazy(() => import("./pages/Collections"));
const Legal = lazy(() => import("./pages/Legal"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminEnquiries = lazy(() => import("./pages/admin/Enquiries"));
const AdminEnquiryDetail = lazy(() => import("./pages/admin/EnquiryDetail"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminTeam = lazy(() => import("./pages/admin/Team"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Loader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-jet-black">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-gold border-t-transparent" />
    </div>
  );
}

function Storefront() {
  return (
    <div className="flex min-h-screen flex-col bg-jet-black">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/enquiry" element={<Enquiry />} />
            <Route path="/account" element={<Account />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/legal/:slug" element={<Legal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppFab />
    </div>
  );
}

function AdminApp() {
  return (
    <AuthProvider>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="enquiries/:id" element={<AdminEnquiryDetail />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="team" element={<AdminTeam />} />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CurrencyProvider>
          <WishlistProvider>
            <CartProvider>
              <ScrollToTop />
              <Routes>
                <Route path="/admin/*" element={<AdminApp />} />
                <Route path="*" element={<Storefront />} />
              </Routes>
            </CartProvider>
          </WishlistProvider>
        </CurrencyProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
