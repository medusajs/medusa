import { 
  MOCK_PRODUCTS, 
  MOCK_REGIONS, 
  MOCK_COLLECTIONS, 
  MOCK_SHIPPING_OPTIONS, 
  MOCK_ORDERS, 
  MOCK_CUSTOMERS, 
  MOCK_DISCOUNTS, 
  MOCK_ANALYTICS 
} from './mockData';

const DEFAULT_BACKEND_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_MEDUSA_BACKEND_URL) || 'http://localhost:9000';
const DEFAULT_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_MEDUSA_PUBLISHABLE_KEY) || '';
const DEFAULT_ADMIN_TOKEN = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_MEDUSA_ADMIN_TOKEN) || '';

export class MedusaEnterpriseClient {
  constructor() {
    this.baseUrl = localStorage.getItem('medusa_backend_url') || DEFAULT_BACKEND_URL;
    this.publishableKey = localStorage.getItem('medusa_publishable_key') || DEFAULT_API_KEY;
    this.adminToken = localStorage.getItem('medusa_admin_token') || DEFAULT_ADMIN_TOKEN;
    this.customerToken = localStorage.getItem('medusa_customer_jwt') || '';
    
    // Cashfree PG Settings
    this.cashfreeAppId = localStorage.getItem('medusa_cashfree_app_id') || 'TEST103849201';
    this.cashfreeSecretKey = localStorage.getItem('medusa_cashfree_secret') || 'cfsk_ma_test_884920194829';
    this.cashfreeEnv = localStorage.getItem('medusa_cashfree_env') || 'sandbox'; // 'sandbox' or 'production'

    this.isLiveConnected = false;
    this.lastHealthCheck = null;
    this.useMock = localStorage.getItem('medusa_force_mock') === 'true' || false;
  }

  setBackendConfig(url, publishableKey, adminToken, forceMock = false) {
    this.baseUrl = url.replace(/\/$/, '');
    this.publishableKey = publishableKey;
    this.adminToken = adminToken;
    this.useMock = forceMock;
    localStorage.setItem('medusa_backend_url', this.baseUrl);
    localStorage.setItem('medusa_publishable_key', this.publishableKey);
    localStorage.setItem('medusa_admin_token', this.adminToken);
    localStorage.setItem('medusa_force_mock', forceMock ? 'true' : 'false');
  }

  setCashfreeConfig(appId, secretKey, env = 'sandbox') {
    this.cashfreeAppId = appId;
    this.cashfreeSecretKey = secretKey;
    this.cashfreeEnv = env;
    localStorage.setItem('medusa_cashfree_app_id', appId);
    localStorage.setItem('medusa_cashfree_secret', secretKey);
    localStorage.setItem('medusa_cashfree_env', env);
  }

  getStoreHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.publishableKey) {
      headers['x-publishable-api-key'] = this.publishableKey;
    }
    if (this.customerToken) {
      headers['Authorization'] = `Bearer ${this.customerToken}`;
    }
    return headers;
  }

  getAdminHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.adminToken) {
      headers['Authorization'] = `Bearer ${this.adminToken}`;
    }
    return headers;
  }

  async checkHealth() {
    if (this.useMock) {
      this.isLiveConnected = false;
      this.lastHealthCheck = new Date().toISOString();
      return { online: false, reason: 'Standalone enterprise demo mode' };
    }
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(`${this.baseUrl}/store/products?limit=1`, {
        headers: this.getStoreHeaders(),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        this.isLiveConnected = true;
        this.lastHealthCheck = new Date().toISOString();
        return { online: true, status: res.status };
      } else {
        this.isLiveConnected = false;
        return { online: false, status: res.status, reason: `HTTP ${res.status}` };
      }
    } catch (err) {
      this.isLiveConnected = false;
      return { online: false, reason: err.message || 'Connection failed' };
    }
  }

  // ==========================================
  // STOREFRONT APIs (Consumer Facing)
  // ==========================================

  transformProduct(p) {
    const defaultThumbnail = p.thumbnail || p.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85';
    const images = (p.images && p.images.length > 0) ? p.images.map(img => img.url || img) : [defaultThumbnail];
    
    let inrPrice = 14990;
    let usdPrice = 180;
    let eurPrice = 160;
    let gbpPrice = 140;
    let jpyPrice = 28000;

    if (p.variants && p.variants[0]?.prices) {
      p.variants[0].prices.forEach(pr => {
        const code = pr.currency_code?.toLowerCase();
        const amt = pr.amount ? (pr.amount > 1000 && !['jpy','krw','inr'].includes(code) ? pr.amount / 100 : pr.amount) : 100;
        if (code === 'inr') inrPrice = amt;
        if (code === 'usd') usdPrice = amt;
        if (code === 'eur') eurPrice = amt;
        if (code === 'gbp') gbpPrice = amt;
        if (code === 'jpy') jpyPrice = amt;
      });
    }

    return {
      id: p.id,
      title: p.title,
      subtitle: p.subtitle || p.description?.slice(0, 80) + '...' || 'Curated Atelier piece',
      handle: p.handle,
      description: p.description || 'No description provided.',
      material: p.material || p.metadata?.material || 'Curated premium material',
      origin: p.origin_country || p.metadata?.origin || 'Imported',
      collection_id: p.collection_id || 'col_all',
      category: p.categories?.[0]?.name || p.collection?.title || 'Apparel',
      badge: p.metadata?.badge || (p.discountable ? 'Available' : 'Exclusive'),
      status: p.status || 'published',
      thumbnail: defaultThumbnail,
      images: images,
      prices: {
        inr: p.prices?.inr || inrPrice || (usdPrice * 85),
        usd: p.prices?.usd || usdPrice,
        eur: p.prices?.eur || eurPrice,
        gbp: p.prices?.gbp || gbpPrice,
        jpy: p.prices?.jpy || jpyPrice
      },
      inventory_quantity: p.inventory_quantity !== undefined ? p.inventory_quantity : (p.variants?.reduce((sum, v) => sum + (v.inventory_quantity || 10), 0) || 20),
      rating: p.rating || p.metadata?.rating || 4.9,
      reviews_count: p.reviews_count || p.metadata?.reviews_count || 18,
      colors: p.colors || p.metadata?.colors || [{ name: "Default", hex: "#1D1D1F" }],
      sizes: p.sizes || p.options?.find(o => o.title?.toLowerCase().includes('size'))?.values?.map(v => v.value) || ['Standard'],
      variants: p.variants || [{ id: `var_${p.id}`, title: 'Default', sku: p.handle || 'MEDUSA' }]
    };
  }

  async getProducts(params = {}) {
    if (!this.useMock) {
      try {
        const queryParams = new URLSearchParams();
        if (params.limit) queryParams.set('limit', params.limit);
        if (params.category_id) queryParams.set('category_id', params.category_id);
        if (params.collection_id) queryParams.set('collection_id', params.collection_id);
        if (params.q) queryParams.set('q', params.q);

        const res = await fetch(`${this.baseUrl}/store/products?${queryParams.toString()}`, {
          headers: this.getStoreHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          if (data.products && data.products.length > 0) {
            this.isLiveConnected = true;
            return data.products.map(p => this.transformProduct(p));
          }
        }
      } catch (err) {
        console.warn('Live products fetch failed, using internal data store:', err);
      }
    }

    const localProds = localStorage.getItem('medusa_admin_products');
    let list = localProds ? JSON.parse(localProds) : [...MOCK_PRODUCTS];

    if (params.collection_id && params.collection_id !== 'col_all') {
      list = list.filter(p => p.collection_id === params.collection_id);
    }
    if (params.category && params.category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === params.category.toLowerCase());
    }
    if (params.q) {
      const qLower = params.q.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(qLower) ||
        p.description.toLowerCase().includes(qLower) ||
        p.category.toLowerCase().includes(qLower)
      );
    }
    return list;
  }

  async getProduct(idOrHandle) {
    if (!this.useMock) {
      try {
        const res = await fetch(`${this.baseUrl}/store/products/${idOrHandle}`, {
          headers: this.getStoreHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          if (data.product) return this.transformProduct(data.product);
        }
      } catch (e) {}
    }
    const prods = await this.getProducts();
    return prods.find(p => p.id === idOrHandle || p.handle === idOrHandle) || prods[0];
  }

  async getRegions() {
    if (!this.useMock) {
      try {
        const res = await fetch(`${this.baseUrl}/store/regions`, {
          headers: this.getStoreHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          if (data.regions && data.regions.length > 0) return data.regions;
        }
      } catch (e) {}
    }
    return MOCK_REGIONS;
  }

  async getCollections() {
    if (!this.useMock) {
      try {
        const res = await fetch(`${this.baseUrl}/store/collections`, {
          headers: this.getStoreHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          if (data.collections && data.collections.length > 0) {
            return [{ id: 'col_all', title: 'All Artifacts', handle: 'all' }, ...data.collections];
          }
        }
      } catch (e) {}
    }
    return MOCK_COLLECTIONS;
  }

  async getShippingOptions(cartId) {
    if (!this.useMock) {
      try {
        const res = await fetch(`${this.baseUrl}/store/shipping-options/${cartId || ''}`, {
          headers: this.getStoreHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          if (data.shipping_options && data.shipping_options.length > 0) return data.shipping_options;
        }
      } catch (e) {}
    }
    return MOCK_SHIPPING_OPTIONS;
  }

  // ==========================================
  // CASHFREE PAYMENTS INTEGRATION
  // ==========================================

  async createCashfreeOrderSession(orderPayload) {
    // If connected to Medusa with Cashfree Plugin (medusa-payment-cashfree)
    if (!this.useMock) {
      try {
        const res = await fetch(`${this.baseUrl}/store/carts/${orderPayload.cart_id}/payment-sessions`, {
          method: 'POST',
          headers: this.getStoreHeaders(),
          body: JSON.stringify({ provider_id: 'cashfree' })
        });
        if (res.ok) {
          const data = await res.json();
          return data;
        }
      } catch (err) {
        console.warn('Cashfree payment session endpoint call fallback:', err);
      }
    }

    // Cashfree PG Order Token simulation (PG Order Session ID)
    const cfOrderId = `cf_order_${Date.now()}`;
    const paymentSessionId = `session_${Math.random().toString(36).substring(2, 15)}`;
    
    return {
      order_id: cfOrderId,
      payment_session_id: paymentSessionId,
      order_token: `cf_tok_${Math.random().toString(36).substring(2, 18)}`,
      order_amount: orderPayload.amount,
      order_currency: orderPayload.currency || 'INR',
      customer_details: {
        customer_id: orderPayload.customer_id || `cus_${Date.now()}`,
        customer_name: orderPayload.customer_name,
        customer_email: orderPayload.customer_email,
        customer_phone: orderPayload.customer_phone
      },
      order_meta: {
        return_url: `${window.location.origin}/order-status?order_id=${cfOrderId}`,
        notify_url: `${this.baseUrl}/cashfree/webhook`
      },
      environment: this.cashfreeEnv
    };
  }

  async completeCart(cartId, orderData) {
    if (!this.useMock) {
      try {
        const res = await fetch(`${this.baseUrl}/store/carts/${cartId}/complete`, {
          method: 'POST',
          headers: this.getStoreHeaders(),
          body: JSON.stringify(orderData || {})
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {}
    }

    const orderId = `ord_01J${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      id: orderId,
      display_id: Math.floor(1045 + Math.random() * 9000),
      status: 'pending',
      fulfillment_status: 'not_fulfilled',
      payment_status: 'captured',
      payment_provider: orderData?.payment_provider || 'cashfree',
      payment_reference: orderData?.payment_reference || `CF_PAY_${Math.floor(100000 + Math.random() * 900000)}`,
      created_at: new Date().toISOString(),
      currency_code: orderData?.currency_code || 'inr',
      total: orderData?.total || 24990,
      subtotal: orderData?.subtotal || 21177.96,
      tax_total: orderData?.tax_total || 3812.04,
      discount_total: orderData?.discount_total || 0,
      shipping_total: orderData?.shipping_total || 0,
      tracking_number: null,
      customer: {
        id: `cus_${Date.now()}`,
        email: orderData?.email || 'aditya.sharma@bangalore-tech.in',
        first_name: orderData?.first_name || 'Aditya',
        last_name: orderData?.last_name || 'Sharma',
        phone: orderData?.phone || '+91 98450 12345'
      },
      shipping_address: orderData?.shipping_address || {
        address_1: 'Villa 14, Palm Meadows, Whitefield',
        city: 'Bengaluru',
        postal_code: '560066',
        country_code: 'in'
      },
      items: orderData?.items || []
    };

    // Save to local admin orders list
    const existingOrders = JSON.parse(localStorage.getItem('medusa_admin_orders') || '[]');
    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem('medusa_admin_orders', JSON.stringify(updatedOrders));

    return { type: 'order', data: newOrder };
  }

  // ==========================================
  // CUSTOMER AUTH & ACCOUNT APIs
  // ==========================================

  async customerLogin(email, password) {
    if (!this.useMock) {
      try {
        const res = await fetch(`${this.baseUrl}/store/auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        if (res.ok) {
          const data = await res.json();
          this.customerToken = data.customer?.id || 'demo_token';
          localStorage.setItem('medusa_customer_jwt', this.customerToken);
          return { success: true, customer: data.customer };
        }
      } catch (e) {}
    }

    const found = MOCK_CUSTOMERS.find(c => c.email.toLowerCase() === email.toLowerCase()) || {
      id: `cus_${Date.now()}`,
      email: email,
      first_name: email.split('@')[0],
      last_name: 'Patron',
      phone: '+91 98450 12345',
      tier: 'VIP Patron',
      orders_count: 1,
      total_spent: 53490.00,
      created_at: new Date().toISOString(),
      addresses: [
        { id: "addr_def", address_1: "Villa 14, Palm Meadows, Whitefield", city: "Bengaluru", postal_code: "560066", country_code: "in", is_default: true }
      ]
    };
    this.customerToken = `jwt_${found.id}`;
    localStorage.setItem('medusa_customer_jwt', this.customerToken);
    localStorage.setItem('medusa_active_customer', JSON.stringify(found));
    return { success: true, customer: found };
  }

  async customerRegister(customerData) {
    if (!this.useMock) {
      try {
        const res = await fetch(`${this.baseUrl}/store/customers`, {
          method: 'POST',
          headers: this.getStoreHeaders(),
          body: JSON.stringify(customerData)
        });
        if (res.ok) {
          const data = await res.json();
          return { success: true, customer: data.customer };
        }
      } catch (e) {}
    }

    const newCustomer = {
      id: `cus_${Date.now()}`,
      first_name: customerData.first_name,
      last_name: customerData.last_name,
      email: customerData.email,
      phone: customerData.phone || '+91 98000 00000',
      tier: 'New Member',
      orders_count: 0,
      total_spent: 0.00,
      created_at: new Date().toISOString(),
      addresses: []
    };
    localStorage.setItem('medusa_active_customer', JSON.stringify(newCustomer));
    return { success: true, customer: newCustomer };
  }

  // ==========================================
  // ADMIN MODULE APIs (Store Configuration)
  // ==========================================

  async getAdminProducts() {
    if (!this.useMock) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/products`, {
          headers: this.getAdminHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          if (data.products) return data.products.map(p => this.transformProduct(p));
        }
      } catch (e) {}
    }
    const local = localStorage.getItem('medusa_admin_products');
    return local ? JSON.parse(local) : MOCK_PRODUCTS;
  }

  async saveAdminProduct(product) {
    const products = await this.getAdminProducts();
    let updated;
    if (product.id) {
      updated = products.map(p => p.id === product.id ? { ...p, ...product } : p);
    } else {
      const newProd = {
        ...product,
        id: `prod_${Date.now()}`,
        handle: product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        created_at: new Date().toISOString(),
        rating: 5.0,
        reviews_count: 0,
        status: product.status || 'published'
      };
      updated = [newProd, ...products];
    }
    localStorage.setItem('medusa_admin_products', JSON.stringify(updated));
    return { success: true, products: updated };
  }

  async deleteAdminProduct(productId) {
    const products = await this.getAdminProducts();
    const updated = products.filter(p => p.id !== productId);
    localStorage.setItem('medusa_admin_products', JSON.stringify(updated));
    return { success: true, products: updated };
  }

  async getAdminOrders() {
    if (!this.useMock) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/orders`, {
          headers: this.getAdminHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          if (data.orders) return data.orders;
        }
      } catch (e) {}
    }
    const local = localStorage.getItem('medusa_admin_orders');
    return local ? JSON.parse(local) : MOCK_ORDERS;
  }

  async updateAdminOrderStatus(orderId, updates) {
    const orders = await this.getAdminOrders();
    const updated = orders.map(o => o.id === orderId ? { ...o, ...updates } : o);
    localStorage.setItem('medusa_admin_orders', JSON.stringify(updated));
    return { success: true, orders: updated };
  }

  async getAdminCustomers() {
    if (!this.useMock) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/customers`, {
          headers: this.getAdminHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          if (data.customers) return data.customers;
        }
      } catch (e) {}
    }
    const local = localStorage.getItem('medusa_admin_customers');
    return local ? JSON.parse(local) : MOCK_CUSTOMERS;
  }

  async getAdminDiscounts() {
    if (!this.useMock) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/discounts`, {
          headers: this.getAdminHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          if (data.discounts) return data.discounts;
        }
      } catch (e) {}
    }
    const local = localStorage.getItem('medusa_admin_discounts');
    return local ? JSON.parse(local) : MOCK_DISCOUNTS;
  }

  async saveAdminDiscount(discount) {
    const discounts = await this.getAdminDiscounts();
    let updated;
    if (discount.id) {
      updated = discounts.map(d => d.id === discount.id ? { ...d, ...discount } : d);
    } else {
      const newDisc = {
        ...discount,
        id: `disc_${Date.now()}`,
        code: discount.code.toUpperCase(),
        usage_count: 0,
        is_active: true,
        created_at: new Date().toISOString()
      };
      updated = [newDisc, ...discounts];
    }
    localStorage.setItem('medusa_admin_discounts', JSON.stringify(updated));
    return { success: true, discounts: updated };
  }

  async deleteAdminDiscount(id) {
    const discounts = await this.getAdminDiscounts();
    const updated = discounts.filter(d => d.id !== id);
    localStorage.setItem('medusa_admin_discounts', JSON.stringify(updated));
    return { success: true, discounts: updated };
  }

  async getAdminAnalytics() {
    return MOCK_ANALYTICS;
  }
}

export const medusaClient = new MedusaEnterpriseClient();
