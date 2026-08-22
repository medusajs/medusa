import React from 'react';
import { useStore } from './context/StoreContext';
import { useAdmin } from './context/AdminContext';

// Storefront Components
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import CategoryPills from './components/CategoryPills';
import ProductGrid from './components/ProductGrid';
import EditorialSection from './components/EditorialSection';
import Footer from './components/Footer';

// Modals & Drawers
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import SearchModal from './components/SearchModal';
import CheckoutModal from './components/CheckoutModal';
import CustomerAuthModal from './components/CustomerAuthModal';
import CustomerAccountDrawer from './components/CustomerAccountDrawer';
import BackendStatusModal from './components/BackendStatusModal';
import ToastContainer from './components/ToastContainer';

// Admin Module Components
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProducts from './components/admin/AdminProducts';
import AdminOrders from './components/admin/AdminOrders';
import AdminCustomers from './components/admin/AdminCustomers';
import AdminDiscounts from './components/admin/AdminDiscounts';
import AdminSettings from './components/admin/AdminSettings';
import AdminApiInspector from './components/admin/AdminApiInspector';

export default function App() {
  const { appMode } = useStore();
  const { adminTab } = useAdmin();

  return (
    <div className="store-app">
      {appMode === 'admin' ? (
        /* ===================================================
           ENTERPRISE ADMIN MODULE / CONTROL PLANE
           =================================================== */
        <AdminLayout>
          {adminTab === 'dashboard' && <AdminDashboard />}
          {adminTab === 'products' && <AdminProducts />}
          {adminTab === 'orders' && <AdminOrders />}
          {adminTab === 'customers' && <AdminCustomers />}
          {adminTab === 'discounts' && <AdminDiscounts />}
          {adminTab === 'settings' && <AdminSettings />}
          {adminTab === 'api' && <AdminApiInspector />}
        </AdminLayout>
      ) : (
        /* ===================================================
           ENTERPRISE LUXURY STOREFRONT
           =================================================== */
        <>
          <AnnouncementBar />
          <Navbar />
          <main>
            <HeroBanner />
            <CategoryPills />
            <ProductGrid />
            <EditorialSection />
          </main>
          <Footer />
        </>
      )}

      {/* Global Modals & Drawers */}
      <ProductModal />
      <CartDrawer />
      <WishlistDrawer />
      <SearchModal />
      <CheckoutModal />
      <CustomerAuthModal />
      <CustomerAccountDrawer />
      <BackendStatusModal />
      <ToastContainer />
    </div>
  );
}
