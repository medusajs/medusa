# ATELIER — Enterprise Medusa Storefront & Admin Control Plane

A production-grade, enterprise-standard React ecommerce platform designed to consume all **Medusa v2 / v1 headless commerce APIs**, complete with an integrated **Enterprise Admin Module** for configuring products, orders, promotions, customers, multi-region currencies, and telemetry.

---

## 🏛️ Architecture Overview

The platform operates across two seamlessly synchronized modules:

1. **Enterprise Luxury Storefront** (Consumer Facing)
   - Minimalist Swiss/Scandinavian luxury aesthetic with dark and light themes.
   - Dynamic variant matrix (color swatches, sizing, live inventory trackers).
   - Real-time catalog filtering, multi-category taxonomy, and `⌘K` global search.
   - Slide-out Cart Drawer with dynamic currency conversion and free-shipping progress indicators.
   - 3-step checkout with Stripe & Medusa Payment Provider integration.
   - Patron Account Portal (Sign in, Register, Saved Address Book, Order History with live tracking).

2. **Enterprise Admin Module / Control Plane** (Store Management)
   - One-click toggle between **Storefront View** and **Admin OS** via the top navigation bar.
   - **Executive KPI Dashboard**: Real-time gross revenue, order volume, Average Order Value (AOV), sales trends chart, and low-inventory warnings.
   - **Catalog & Inventory Manager**: Create, edit, publish/draft, and delete artifacts with multi-currency pricing tiers (`USD $`, `EUR €`, `GBP £`, `JPY ¥`).
   - **Orders & Fulfillment Dispatch**: Filter orders (Pending, Shipped, Delivered), inspect line items, assign carrier tracking numbers (DHL, FedEx), and transition order states.
   - **Customer Directory (CRM)**: Manage registered patrons, track Lifetime Value (LTV), address records, and purchase history.
   - **Promotions & Campaign Engine**: Create and manage percentage, fixed-amount, and free-shipping discount codes (`MEDUSA10`, `ATELIER20`, `FREESHIP`).
   - **Medusa Engine Settings & Sync**: Configure backend URLs, publishable API keys, admin secret tokens, and export/import full JSON store backups.
   - **Interactive API Inspector**: Live developer tool for executing and benchmarking Medusa Store and Admin REST endpoints with JSON payload preview.

---

## 🔌 Medusa API Endpoints Consumed

### Storefront APIs (`/store/*`)
| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/store/products` | `GET` | List all catalog artifacts with collection & category filters |
| `/store/products/:id` | `GET` | Fetch detailed product metadata, multi-angle images & variants |
| `/store/collections` | `GET` | Retrieve curated collections and handle routing |
| `/store/regions` | `GET` | Fetch international tax rates and currency symbols |
| `/store/shipping-options` | `GET` | Calculate shipping methods and thresholds |
| `/store/carts` | `POST` | Initialize localized customer cart |
| `/store/carts/:id/line-items`| `POST` | Add, update quantity, or remove cart items |
| `/store/carts/:id/complete` | `POST` | Authorize payment sessions and complete checkout |
| `/store/auth` | `POST` | Customer authentication and JWT session creation |
| `/store/customers` | `POST` | Register new customer accounts |
| `/store/customers/me/orders`| `GET` | Fetch customer order history and dispatch status |

### Admin APIs (`/admin/*`)
| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/admin/products` | `GET`, `POST` | Catalog CRUD and multi-region pricing matrix |
| `/admin/orders` | `GET`, `POST` | Order fulfillment, tracking assignment, and captures |
| `/admin/customers` | `GET` | Customer directory, LTV metrics, and address lookup |
| `/admin/discounts` | `GET`, `POST`, `DELETE`| Create and manage promotional discount rules |
| `/admin/store` | `GET`, `POST` | Store settings, currencies, and backend sync |

---

## 🚀 Quick Start

### 1. Start the Storefront:
```bash
cd storefront
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 2. Connect to your Medusa Backend:
1. Ensure your Medusa backend is running (typically on `http://localhost:9000`):
   ```bash
   npx @medusajs/medusa-cli develop
   ```
2. In the top bar of the application, click **Medusa Server** or open **Admin OS -> Store & Medusa Settings**.
3. Set your backend URL (e.g. `http://localhost:9000`) and Publishable API Key.
4. Click **Test Connection** & **Update Engine Parameters**.
