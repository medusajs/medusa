import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { medusaClient } from '../api/medusaClient';
import { useStore } from './StoreContext';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const { addToast, fetchData: refreshStorefront } = useStore();

  // Active Admin View Tab
  const [adminTab, setAdminTab] = useState('dashboard'); // dashboard, products, orders, customers, discounts, settings, api

  // Data States
  const [adminProducts, setAdminProducts] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminCustomers, setAdminCustomers] = useState([]);
  const [adminDiscounts, setAdminDiscounts] = useState([]);
  const [adminAnalytics, setAdminAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Selected entities for modals / inspection
  const [editingProduct, setEditingProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);

  // Search & Filter within Admin
  const [adminSearch, setAdminSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Load all admin data
  const loadAdminData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [prods, ords, custs, discs, analytics] = await Promise.all([
        medusaClient.getAdminProducts(),
        medusaClient.getAdminOrders(),
        medusaClient.getAdminCustomers(),
        medusaClient.getAdminDiscounts(),
        medusaClient.getAdminAnalytics()
      ]);
      setAdminProducts(prods);
      setAdminOrders(ords);
      setAdminCustomers(custs);
      setAdminDiscounts(discs);
      setAdminAnalytics(analytics);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      addToast('Error loading admin control plane', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  // Product Operations
  const saveProduct = async (productData) => {
    try {
      const res = await medusaClient.saveAdminProduct(productData);
      if (res.success) {
        setAdminProducts(res.products);
        setIsProductModalOpen(false);
        setEditingProduct(null);
        addToast(`Product "${productData.title}" saved successfully`, 'success');
        refreshStorefront();
      }
    } catch (err) {
      addToast('Failed to save product', 'error');
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to remove this artifact from the catalog?')) return;
    try {
      const res = await medusaClient.deleteAdminProduct(productId);
      if (res.success) {
        setAdminProducts(res.products);
        addToast('Product removed from catalogue', 'info');
        refreshStorefront();
      }
    } catch (err) {
      addToast('Failed to delete product', 'error');
    }
  };

  const toggleProductStatus = async (productId) => {
    const prod = adminProducts.find(p => p.id === productId);
    if (!prod) return;
    const newStatus = prod.status === 'published' ? 'draft' : 'published';
    await saveProduct({ ...prod, status: newStatus });
  };

  // Order Operations
  const updateOrderStatus = async (orderId, updates) => {
    try {
      const res = await medusaClient.updateAdminOrderStatus(orderId, updates);
      if (res.success) {
        setAdminOrders(res.orders);
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(prev => ({ ...prev, ...updates }));
        }
        addToast(`Order #${orderId} updated`, 'success');
      }
    } catch (err) {
      addToast('Failed to update order', 'error');
    }
  };

  // Discount Operations
  const saveDiscount = async (discountData) => {
    try {
      const res = await medusaClient.saveAdminDiscount(discountData);
      if (res.success) {
        setAdminDiscounts(res.discounts);
        setIsDiscountModalOpen(false);
        addToast(`Discount "${discountData.code}" created`, 'success');
      }
    } catch (err) {
      addToast('Failed to save promotion code', 'error');
    }
  };

  const toggleDiscountActive = async (discountId) => {
    const disc = adminDiscounts.find(d => d.id === discountId);
    if (!disc) return;
    await saveDiscount({ ...disc, is_active: !disc.is_active });
  };

  const deleteDiscount = async (discountId) => {
    try {
      const res = await medusaClient.deleteAdminDiscount(discountId);
      if (res.success) {
        setAdminDiscounts(res.discounts);
        addToast('Discount code deleted', 'info');
      }
    } catch (err) {
      addToast('Failed to delete discount', 'error');
    }
  };

  // Store Export / Backup
  const exportStoreData = () => {
    const data = {
      exported_at: new Date().toISOString(),
      products: adminProducts,
      orders: adminOrders,
      customers: adminCustomers,
      discounts: adminDiscounts,
      backend_config: {
        url: medusaClient.baseUrl,
        publishableKey: medusaClient.publishableKey
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atelier-medusa-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    addToast('Store configuration & data exported', 'success');
  };

  return (
    <AdminContext.Provider
      value={{
        adminTab,
        setAdminTab,
        adminProducts,
        adminOrders,
        adminCustomers,
        adminDiscounts,
        adminAnalytics,
        isLoading,
        adminSearch,
        setAdminSearch,
        orderStatusFilter,
        setOrderStatusFilter,

        // Modals & Selected
        editingProduct,
        setEditingProduct,
        isProductModalOpen,
        setIsProductModalOpen,
        selectedOrder,
        setSelectedOrder,
        isOrderModalOpen,
        setIsOrderModalOpen,
        selectedCustomer,
        setSelectedCustomer,
        isCustomerModalOpen,
        setIsCustomerModalOpen,
        isDiscountModalOpen,
        setIsDiscountModalOpen,

        // Actions
        loadAdminData,
        saveProduct,
        deleteProduct,
        toggleProductStatus,
        updateOrderStatus,
        saveDiscount,
        toggleDiscountActive,
        deleteDiscount,
        exportStoreData
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
