import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { medusaClient } from '../api/medusaClient';
import { MOCK_REGIONS } from '../api/mockData';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  // App Mode: 'store' or 'admin'
  const [appMode, setAppMode] = useState(() => {
    const saved = localStorage.getItem('atelier_app_mode');
    return saved || 'store';
  });

  // Region & Currency (Defaults to India INR ₹)
  const [regions, setRegions] = useState(MOCK_REGIONS);
  const [selectedRegion, setSelectedRegion] = useState(() => {
    const saved = localStorage.getItem('atelier_region');
    return saved ? JSON.parse(saved) : MOCK_REGIONS[0]; // reg_in (India)
  });

  // Products & Collections
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Cart
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('atelier_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [discountCode, setDiscountCode] = useState('');
  const [discountRate, setDiscountRate] = useState(0);
  const [freeShippingPromo, setFreeShippingPromo] = useState(false);

  // Wishlist
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('atelier_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Customer Account & Authentication
  const [customer, setCustomer] = useState(() => {
    const saved = localStorage.getItem('medusa_active_customer');
    return saved ? JSON.parse(saved) : null;
  });

  // UI Drawers & Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filtering & Sorting
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCollection, setSelectedCollection] = useState('col_all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState(100000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [gridColumns, setGridColumns] = useState(3);

  // Medusa Backend Connectivity Status
  const [backendStatus, setBackendStatus] = useState({
    url: medusaClient.baseUrl,
    key: medusaClient.publishableKey,
    adminToken: medusaClient.adminToken,
    cashfreeAppId: medusaClient.cashfreeAppId,
    cashfreeSecret: medusaClient.cashfreeSecretKey,
    cashfreeEnv: medusaClient.cashfreeEnv,
    isLive: false,
    useMock: medusaClient.useMock,
    checking: false,
    reason: ''
  });

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', actionLabel = null, onAction = null) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, actionLabel, onAction }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Save app mode
  useEffect(() => {
    localStorage.setItem('atelier_app_mode', appMode);
  }, [appMode]);

  // Save cart
  useEffect(() => {
    localStorage.setItem('atelier_cart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist
  useEffect(() => {
    localStorage.setItem('atelier_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Save region
  useEffect(() => {
    localStorage.setItem('atelier_region', JSON.stringify(selectedRegion));
  }, [selectedRegion]);

  // Save customer
  useEffect(() => {
    if (customer) {
      localStorage.setItem('medusa_active_customer', JSON.stringify(customer));
    } else {
      localStorage.removeItem('medusa_active_customer');
      localStorage.removeItem('medusa_customer_jwt');
    }
  }, [customer]);

  // Check Medusa backend connectivity
  const checkBackendHealth = useCallback(async () => {
    setBackendStatus(prev => ({ ...prev, checking: true }));
    const health = await medusaClient.checkHealth();
    setBackendStatus(prev => ({
      ...prev,
      isLive: health.online,
      reason: health.reason || '',
      checking: false,
      useMock: medusaClient.useMock,
      url: medusaClient.baseUrl,
      key: medusaClient.publishableKey,
      adminToken: medusaClient.adminToken,
      cashfreeAppId: medusaClient.cashfreeAppId,
      cashfreeSecret: medusaClient.cashfreeSecretKey,
      cashfreeEnv: medusaClient.cashfreeEnv
    }));
    return health;
  }, []);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const [prods, cols, regs] = await Promise.all([
        medusaClient.getProducts(),
        medusaClient.getCollections(),
        medusaClient.getRegions()
      ]);
      setProducts(prods);
      setCollections(cols);
      if (regs && regs.length > 0) setRegions(regs);
    } catch (err) {
      console.error('Failed to load store data:', err);
      addToast('Error loading store catalogue', 'error');
    } finally {
      setIsLoadingProducts(false);
    }
  }, [addToast]);

  useEffect(() => {
    checkBackendHealth();
    fetchData();
  }, [checkBackendHealth, fetchData]);

  // Helper to format currency with Indian Numbering System for INR
  const formatPrice = useCallback((amount, customCurr = null) => {
    const curr = (customCurr || selectedRegion.currency_code || 'inr').toLowerCase();
    const symbol = selectedRegion.currency_symbol || (curr === 'inr' ? '₹' : '$');
    
    if (curr === 'inr') {
      return `${symbol}${Number(amount).toLocaleString('en-IN')}`;
    }
    if (curr === 'jpy' || curr === 'krw') {
      return `${symbol}${Math.round(amount).toLocaleString()}`;
    }
    return `${symbol}${Number(amount).toFixed(2)}`;
  }, [selectedRegion]);

  // Helper to extract product price for current currency
  const getProductPrice = useCallback((product) => {
    if (!product || !product.prices) return 14990;
    const curr = (selectedRegion.currency_code || 'inr').toLowerCase();
    return product.prices[curr] || product.prices.inr || product.prices.usd || 14990;
  }, [selectedRegion]);

  // Cart operations
  const addToCart = useCallback((product, options = {}) => {
    const selectedColor = options.color || product.colors?.[0]?.name || 'Standard';
    const selectedSize = options.size || product.sizes?.[0] || 'Standard';
    const quantity = options.quantity || 1;
    const variantId = options.variantId || product.variants?.[0]?.id || `var_${product.id}`;
    const price = getProductPrice(product);

    const lineItemId = `${product.id}-${selectedColor}-${selectedSize}`;

    setCart(prevCart => {
      const existing = prevCart.find(item => item.lineItemId === lineItemId);
      if (existing) {
        return prevCart.map(item =>
          item.lineItemId === lineItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            lineItemId,
            productId: product.id,
            title: product.title,
            handle: product.handle,
            thumbnail: product.thumbnail,
            selectedColor,
            selectedSize,
            quantity,
            price,
            prices: product.prices,
            variantId
          }
        ];
      }
    });

    addToast(`Added "${product.title}" to bag`, 'success', 'View Bag', () => setIsCartOpen(true));
  }, [getProductPrice, addToast]);

  const updateCartQuantity = useCallback((lineItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(lineItemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.lineItemId === lineItemId ? { ...item, quantity } : item
      )
    );
  }, []);

  const removeFromCart = useCallback((lineItemId) => {
    setCart(prevCart => prevCart.filter(item => item.lineItemId !== lineItemId));
    addToast('Item removed from bag', 'info');
  }, [addToast]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Discount code handler
  const applyPromoCode = useCallback((code) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return { success: false, message: 'Please enter a code' };

    if (cleanCode === 'MEDUSA10') {
      setDiscountCode('MEDUSA10');
      setDiscountRate(0.10);
      addToast('10% Medusa discount applied', 'success');
      return { success: true, message: '10% discount applied' };
    } else if (cleanCode === 'ATELIER20') {
      setDiscountCode('ATELIER20');
      setDiscountRate(0.20);
      addToast('20% Atelier Patron discount applied', 'success');
      return { success: true, message: '20% discount applied' };
    } else if (cleanCode === 'FREESHIP') {
      setDiscountCode('FREESHIP');
      setFreeShippingPromo(true);
      addToast('Complimentary shipping applied', 'success');
      return { success: true, message: 'Free shipping unlocked' };
    } else {
      addToast('Invalid promotion code', 'error');
      return { success: false, message: 'Invalid code. Try "MEDUSA10"' };
    }
  }, [addToast]);

  const removePromoCode = useCallback(() => {
    setDiscountCode('');
    setDiscountRate(0);
    setFreeShippingPromo(false);
    addToast('Promotion code removed', 'info');
  }, [addToast]);

  // Customer Auth
  const loginCustomer = async (email, password) => {
    const res = await medusaClient.customerLogin(email, password);
    if (res.success) {
      setCustomer(res.customer);
      setIsAuthModalOpen(false);
      addToast(`Welcome back, ${res.customer.first_name || 'Patron'}`, 'success');
    }
    return res;
  };

  const registerCustomer = async (data) => {
    const res = await medusaClient.customerRegister(data);
    if (res.success) {
      setCustomer(res.customer);
      setIsAuthModalOpen(false);
      addToast(`Account created. Welcome to Atelier!`, 'success');
    }
    return res;
  };

  const logoutCustomer = () => {
    setCustomer(null);
    setIsAccountDrawerOpen(false);
    addToast('Logged out of Atelier account', 'info');
  };

  // Financial calculations
  const currencyCode = (selectedRegion.currency_code || 'inr').toLowerCase();

  const cartSubtotal = cart.reduce((sum, item) => {
    const unitPrice = item.prices ? (item.prices[currencyCode] || item.prices.inr || item.prices.usd || item.price) : item.price;
    return sum + (unitPrice * item.quantity);
  }, 0);

  const discountAmount = cartSubtotal * discountRate;

  // Free shipping threshold: ₹15,000 in India, $200 in US, etc.
  const freeShippingThreshold = currencyCode === 'inr' ? 15000 : (currencyCode === 'jpy' ? 30000 : (currencyCode === 'gbp' ? 160 : (currencyCode === 'eur' ? 180 : 200)));
  const qualifiesForFreeShipping = freeShippingPromo || (cartSubtotal >= freeShippingThreshold);
  const shippingAmount = cart.length === 0 ? 0 : (qualifiesForFreeShipping ? 0 : (currencyCode === 'inr' ? 499 : 20));

  const estimatedTax = (cartSubtotal - discountAmount) * (selectedRegion.tax_rate || 0.18);
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingAmount + estimatedTax);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist operations
  const toggleWishlist = useCallback((product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        addToast(`Removed from saved items`, 'info');
        return prev.filter(item => item.id !== product.id);
      } else {
        addToast(`Saved "${product.title}" to wishlist`, 'success');
        return [...prev, product];
      }
    });
  }, [addToast]);

  const isFavorite = useCallback((productId) => {
    return wishlist.some(item => item.id === productId);
  }, [wishlist]);

  // Filtered Products computation
  const filteredProducts = products.filter(product => {
    if (product.status === 'draft') return false;
    if (selectedCollection !== 'col_all' && product.collection_id !== selectedCollection) return false;
    if (selectedCategory !== 'All' && product.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    const price = getProductPrice(product);
    if (price > priceRange) return false;
    if (inStockOnly && product.inventory_quantity <= 0) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = product.title.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchCat = product.category.toLowerCase().includes(q);
      const matchMat = product.material?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat && !matchMat) return false;
    }
    return true;
  }).sort((a, b) => {
    const priceA = getProductPrice(a);
    const priceB = getProductPrice(b);
    if (sortBy === 'price_asc') return priceA - priceB;
    if (sortBy === 'price_desc') return priceB - priceA;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'newest') return b.badge === 'New Arrival' ? 1 : -1;
    return 0;
  });

  return (
    <StoreContext.Provider
      value={{
        // App Mode (Storefront vs Admin)
        appMode,
        setAppMode,

        // State
        products,
        filteredProducts,
        collections,
        regions,
        selectedRegion,
        setSelectedRegion,
        isLoadingProducts,
        cart,
        cartSubtotal,
        discountCode,
        discountRate,
        discountAmount,
        shippingAmount,
        qualifiesForFreeShipping,
        freeShippingThreshold,
        estimatedTax,
        cartTotal,
        totalCartCount,
        wishlist,
        selectedProduct,
        setSelectedProduct,

        // Customer Auth
        customer,
        loginCustomer,
        registerCustomer,
        logoutCustomer,

        // Modal states
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isSearchOpen,
        setIsSearchOpen,
        isBackendModalOpen,
        setIsBackendModalOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAccountDrawerOpen,
        setIsAccountDrawerOpen,

        // Filters
        selectedCategory,
        setSelectedCategory,
        selectedCollection,
        setSelectedCollection,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        priceRange,
        setPriceRange,
        inStockOnly,
        setInStockOnly,
        gridColumns,
        setGridColumns,

        // Actions
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyPromoCode,
        removePromoCode,
        toggleWishlist,
        isFavorite,
        formatPrice,
        getProductPrice,
        fetchData,

        // Backend & Cashfree Config
        backendStatus,
        checkBackendHealth,
        setBackendConfig: (url, key, token, forceMock) => {
          medusaClient.setBackendConfig(url, key, token, forceMock);
          checkBackendHealth();
          fetchData();
        },
        setCashfreeConfig: (appId, secret, env) => {
          medusaClient.setCashfreeConfig(appId, secret, env);
          checkBackendHealth();
        },

        // Toasts
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
