# Playground / Dev Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a self-contained `playground/` directory to the Medusa monorepo that provides a one-command demo environment and development validation sandbox without modifying existing packages.

**Architecture:** The playground is a standalone Medusa application that lives in `playground/` and references monorepo packages via yarn workspace protocol. It includes Docker Compose services (PostgreSQL + Redis), a seed script for demo data, and CLI scripts for setup and development.

**Tech Stack:** TypeScript, Medusa 2.x, Docker Compose, PostgreSQL 16, Redis 7, yarn workspaces

---

## File Structure

| File | Responsibility |
|------|---------------|
| `playground/package.json` | Workspace deps, CLI scripts, project metadata |
| `playground/tsconfig.json` | TypeScript config extending monorepo base |
| `playground/.gitignore` | Ignore `.env`, `.medusa/`, `node_modules/`, `dist/` |
| `playground/.env.template` | Template for required environment variables |
| `playground/docker-compose.yml` | PostgreSQL 16 + Redis 7 services |
| `playground/medusa-config.ts` | Full module configuration with all core modules enabled |
| `playground/src/scripts/seed.ts` | Demo data seed script (default export function) |
| `playground/data/categories.json` | Product category definitions |
| `playground/data/products.json` | Products with variants, options, and prices |
| `playground/data/customers.json` | Customer records with addresses |
| Root `package.json` | Add `"playground"` to workspaces.packages array |

---

## Task 1: Create playground directory skeleton

**Files:**
- Create: `playground/package.json`
- Create: `playground/tsconfig.json`
- Create: `playground/.gitignore`
- Create: `playground/.env.template`

### Step 1: Create `playground/package.json`

```json
{
  "name": "@medusajs/playground",
  "version": "2.15.2",
  "private": true,
  "description": "Medusa playground for demo and development validation",
  "scripts": {
    "dev": "medusa develop",
    "start": "medusa start",
    "db:setup": "medusa db setup",
    "db:migrate": "medusa db migrate",
    "db:sync-links": "medusa db sync-links",
    "seed": "medusa exec ./src/scripts/seed.ts",
    "setup": "docker compose up -d && sleep 5 && yarn db:setup && yarn db:migrate && yarn db:sync-links && yarn seed",
    "clean": "docker compose down -v && docker compose up -d"
  },
  "dependencies": {
    "@medusajs/medusa": "workspace:*",
    "@medusajs/framework": "workspace:*",
    "@medusajs/core-flows": "workspace:*",
    "@medusajs/admin-bundler": "workspace:*",
    "@medusajs/utils": "workspace:*",
    "@medusajs/file-local": "workspace:*",
    "@medusajs/notification-local": "workspace:*",
    "@medusajs/fulfillment-manual": "workspace:*",
    "@medusajs/auth-emailpass": "workspace:*",
    "@medusajs/workflow-engine-inmemory": "workspace:*",
    "@medusajs/cache-inmemory": "workspace:*",
    "@medusajs/event-bus-local": "workspace:*",
    "@medusajs/api-key": "workspace:*",
    "@medusajs/auth": "workspace:*",
    "@medusajs/cart": "workspace:*",
    "@medusajs/currency": "workspace:*",
    "@medusajs/customer": "workspace:*",
    "@medusajs/draft-order": "workspace:*",
    "@medusajs/fulfillment": "workspace:*",
    "@medusajs/inventory": "workspace:*",
    "@medusajs/locking": "workspace:*",
    "@medusajs/notification": "workspace:*",
    "@medusajs/order": "workspace:*",
    "@medusajs/payment": "workspace:*",
    "@medusajs/pricing": "workspace:*",
    "@medusajs/product": "workspace:*",
    "@medusajs/promotion": "workspace:*",
    "@medusajs/region": "workspace:*",
    "@medusajs/sales-channel": "workspace:*",
    "@medusajs/settings": "workspace:*",
    "@medusajs/stock-location": "workspace:*",
    "@medusajs/store": "workspace:*",
    "@medusajs/tax": "workspace:*",
    "@medusajs/translation": "workspace:*",
    "@medusajs/user": "workspace:*",
    "@medusajs/rbac": "workspace:*",
    "express": "^4.21.0",
    "pg": "8.16.3"
  },
  "devDependencies": {
    "@types/node": "^20.12.11",
    "typescript": "^5.6.2"
  },
  "engines": {
    "node": ">=20"
  }
}
```

### Step 2: Create `playground/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "Node16",
    "moduleResolution": "Node16",
    "esModuleInterop": true,
    "strict": true,
    "strictNullChecks": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": ".",
    "declaration": false,
    "sourceMap": true
  },
  "include": [
    "src/**/*",
    "medusa-config.ts",
    "data/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

### Step 3: Create `playground/.gitignore`

```
.env
.medusa/
dist/
node_modules/
*.log
uploads/
static/
```

### Step 4: Create `playground/.env.template`

```bash
# Database
DATABASE_URL=postgres://postgres:password@localhost:5432/medusa_playground

# Redis (optional - inmemory providers used by default)
REDIS_URL=redis://localhost:6379

# Secrets
JWT_SECRET=playground-jwt-secret
COOKIE_SECRET=playground-cookie-secret

# CORS
STORE_CORS=http://localhost:8000
ADMIN_CORS=http://localhost:9000,http://localhost:5173
AUTH_CORS=http://localhost:8000,http://localhost:9000,http://localhost:5173

# Logging
LOG_LEVEL=info
```

### Step 5: Commit

```bash
git add playground/package.json playground/tsconfig.json playground/.gitignore playground/.env.template
git commit -m "chore(playground): add project skeleton and config files

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 2: Create Docker Compose and environment setup

**Files:**
- Create: `playground/docker-compose.yml`

### Step 1: Create `playground/docker-compose.yml`

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    container_name: medusa-playground-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: medusa_playground
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: medusa-playground-redis
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

### Step 2: Commit

```bash
git add playground/docker-compose.yml
git commit -m "chore(playground): add docker-compose for postgres and redis

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 3: Create Medusa configuration

**Files:**
- Create: `playground/medusa-config.ts`

### Step 1: Create `playground/medusa-config.ts`

```typescript
import { defineConfig, Modules } from "@medusajs/utils"
import path from "path"

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS,
      adminCors: process.env.ADMIN_CORS,
      authCors: process.env.AUTH_CORS,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
  },
  admin: {
    disable: false,
  },
  modules: {
    [Modules.FILE]: {
      resolve: "@medusajs/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-local",
            id: "local",
            options: {
              upload_dir: path.join(process.cwd(), ".medusa", "uploads"),
              private_upload_dir: path.join(process.cwd(), ".medusa", "private"),
            },
          },
        ],
      },
    },
    [Modules.NOTIFICATION]: {
      resolve: "@medusajs/notification",
      options: {
        providers: [
          {
            resolve: "@medusajs/notification-local",
            id: "local",
            options: {
              name: "Local Notification Provider",
              channels: ["feed"],
            },
          },
        ],
      },
    },
    [Modules.FULFILLMENT]: {
      resolve: "@medusajs/fulfillment",
      options: {
        providers: [
          {
            resolve: "@medusajs/fulfillment-manual",
            id: "manual",
          },
        ],
      },
    },
    [Modules.AUTH]: {
      resolve: "@medusajs/auth",
      options: {
        providers: [
          {
            resolve: "@medusajs/auth-emailpass",
            id: "emailpass",
          },
        ],
      },
    },
    [Modules.CACHE]: {
      resolve: "@medusajs/cache-inmemory",
    },
    [Modules.EVENT_BUS]: {
      resolve: "@medusajs/event-bus-local",
    },
    [Modules.WORKFLOW_ENGINE]: {
      resolve: "@medusajs/workflow-engine-inmemory",
    },
  },
})
```

### Step 2: Commit

```bash
git add playground/medusa-config.ts
git commit -m "feat(playground): add medusa configuration with all core modules

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 4: Register playground in root workspaces

**Files:**
- Modify: Root `package.json`

### Step 1: Modify root `package.json`

Add `"playground"` to the `workspaces.packages` array (after `"packages/*"`):

```json
{
  "workspaces": {
    "packages": [
      "packages/medusa",
      "packages/medusa-test-utils",
      "packages/modules/*",
      "packages/modules/providers/*",
      "packages/plugins/*",
      "packages/core/*",
      "packages/framework/*",
      "packages/cli/*",
      "packages/cli/oas/*",
      "packages/*",
      "packages/admin/*",
      "packages/design-system/*",
      "packages/generated/*",
      "integration-tests/**/*",
      "playground"
    ]
  }
}
```

**Exact change:** In root `package.json`, insert `"playground"` as the last item in the `workspaces.packages` array.

### Step 2: Commit

```bash
git add package.json
git commit -m "chore: add playground to yarn workspaces

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 5: Create demo data files

**Files:**
- Create: `playground/data/categories.json`
- Create: `playground/data/products.json`
- Create: `playground/data/customers.json`

### Step 1: Create `playground/data/categories.json`

```json
[
  {
    "name": "Electronics",
    "handle": "electronics",
    "description": "Electronic devices and accessories",
    "is_active": true
  },
  {
    "name": "Clothing",
    "handle": "clothing",
    "description": "Apparel and fashion items",
    "is_active": true
  },
  {
    "name": "Home & Garden",
    "handle": "home-garden",
    "description": "Home decor and gardening supplies",
    "is_active": true
  },
  {
    "name": "Sports",
    "handle": "sports",
    "description": "Sports equipment and accessories",
    "is_active": true
  },
  {
    "name": "Books",
    "handle": "books",
    "description": "Physical and digital books",
    "is_active": true
  }
]
```

### Step 2: Create `playground/data/products.json`

```json
[
  {
    "title": "Wireless Bluetooth Headphones",
    "handle": "wireless-bluetooth-headphones",
    "description": "Premium over-ear headphones with active noise cancellation and 30-hour battery life.",
    "subtitle": "Premium Audio Experience",
    "is_giftcard": false,
    "discountable": true,
    "status": "published",
    "category_handle": "electronics",
    "options": [
      {
        "title": "Color",
        "values": ["Black", "Silver", "Blue"]
      }
    ],
    "variants": [
      {
        "title": "Black",
        "sku": "WBH-BLK-001",
        "prices": [
          { "amount": 29900, "currency_code": "usd" },
          { "amount": 27900, "currency_code": "eur" }
        ],
        "options": [{ "value": "Black" }]
      },
      {
        "title": "Silver",
        "sku": "WBH-SLV-001",
        "prices": [
          { "amount": 29900, "currency_code": "usd" },
          { "amount": 27900, "currency_code": "eur" }
        ],
        "options": [{ "value": "Silver" }]
      },
      {
        "title": "Blue",
        "sku": "WBH-BLU-001",
        "prices": [
          { "amount": 30900, "currency_code": "usd" },
          { "amount": 28900, "currency_code": "eur" }
        ],
        "options": [{ "value": "Blue" }]
      }
    ]
  },
  {
    "title": "Classic Cotton T-Shirt",
    "handle": "classic-cotton-t-shirt",
    "description": "Soft, breathable 100% organic cotton t-shirt available in multiple sizes.",
    "subtitle": "Everyday Essential",
    "is_giftcard": false,
    "discountable": true,
    "status": "published",
    "category_handle": "clothing",
    "options": [
      {
        "title": "Size",
        "values": ["S", "M", "L", "XL"]
      },
      {
        "title": "Color",
        "values": ["White", "Black", "Navy"]
      }
    ],
    "variants": [
      {
        "title": "S / White",
        "sku": "CCT-S-WHT-001",
        "prices": [
          { "amount": 2900, "currency_code": "usd" }
        ],
        "options": [{ "value": "S" }, { "value": "White" }]
      },
      {
        "title": "M / White",
        "sku": "CCT-M-WHT-001",
        "prices": [
          { "amount": 2900, "currency_code": "usd" }
        ],
        "options": [{ "value": "M" }, { "value": "White" }]
      },
      {
        "title": "L / Black",
        "sku": "CCT-L-BLK-001",
        "prices": [
          { "amount": 2900, "currency_code": "usd" }
        ],
        "options": [{ "value": "L" }, { "value": "Black" }]
      },
      {
        "title": "XL / Navy",
        "sku": "CCT-XL-NVY-001",
        "prices": [
          { "amount": 3200, "currency_code": "usd" }
        ],
        "options": [{ "value": "XL" }, { "value": "Navy" }]
      }
    ]
  },
  {
    "title": "Ceramic Coffee Mug Set",
    "handle": "ceramic-coffee-mug-set",
    "description": "Set of 4 handcrafted ceramic mugs, microwave and dishwasher safe.",
    "subtitle": "Morning Coffee Essential",
    "is_giftcard": false,
    "discountable": true,
    "status": "published",
    "category_handle": "home-garden",
    "options": [
      {
        "title": "Color",
        "values": ["Cream", "Sage", "Terracotta"]
      }
    ],
    "variants": [
      {
        "title": "Cream",
        "sku": "CCM-CRM-001",
        "prices": [
          { "amount": 4500, "currency_code": "usd" }
        ],
        "options": [{ "value": "Cream" }]
      },
      {
        "title": "Sage",
        "sku": "CCM-SGE-001",
        "prices": [
          { "amount": 4500, "currency_code": "usd" }
        ],
        "options": [{ "value": "Sage" }]
      }
    ]
  },
  {
    "title": "Yoga Mat Premium",
    "handle": "yoga-mat-premium",
    "description": "Extra thick non-slip yoga mat with carrying strap, 6mm thickness.",
    "subtitle": "Find Your Balance",
    "is_giftcard": false,
    "discountable": true,
    "status": "published",
    "category_handle": "sports",
    "options": [
      {
        "title": "Color",
        "values": ["Purple", "Teal", "Charcoal"]
      }
    ],
    "variants": [
      {
        "title": "Purple",
        "sku": "YMP-PRP-001",
        "prices": [
          { "amount": 5500, "currency_code": "usd" }
        ],
        "options": [{ "value": "Purple" }]
      },
      {
        "title": "Teal",
        "sku": "YMP-TL-001",
        "prices": [
          { "amount": 5500, "currency_code": "usd" }
        ],
        "options": [{ "value": "Teal" }]
      }
    ]
  },
  {
    "title": "Programming TypeScript",
    "handle": "programming-typescript",
    "description": "Comprehensive guide to TypeScript programming by Boris Cherny.",
    "subtitle": "Master TypeScript",
    "is_giftcard": false,
    "discountable": true,
    "status": "published",
    "category_handle": "books",
    "options": [
      {
        "title": "Format",
        "values": ["Hardcover", "Paperback", "E-book"]
      }
    ],
    "variants": [
      {
        "title": "Hardcover",
        "sku": "PTS-HC-001",
        "prices": [
          { "amount": 4999, "currency_code": "usd" }
        ],
        "options": [{ "value": "Hardcover" }]
      },
      {
        "title": "Paperback",
        "sku": "PTS-PB-001",
        "prices": [
          { "amount": 3499, "currency_code": "usd" }
        ],
        "options": [{ "value": "Paperback" }]
      },
      {
        "title": "E-book",
        "sku": "PTS-EB-001",
        "prices": [
          { "amount": 2499, "currency_code": "usd" }
        ],
        "options": [{ "value": "E-book" }]
      }
    ]
  }
]
```

### Step 3: Create `playground/data/customers.json`

```json
[
  {
    "email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1-555-0101",
    "addresses": [
      {
        "first_name": "John",
        "last_name": "Doe",
        "address_1": "123 Maple Street",
        "city": "Springfield",
        "province": "Illinois",
        "postal_code": "62701",
        "country_code": "us",
        "phone": "+1-555-0101"
      }
    ]
  },
  {
    "email": "jane.smith@example.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "phone": "+1-555-0102",
    "addresses": [
      {
        "first_name": "Jane",
        "last_name": "Smith",
        "address_1": "456 Oak Avenue",
        "city": "Austin",
        "province": "Texas",
        "postal_code": "78701",
        "country_code": "us",
        "phone": "+1-555-0102"
      }
    ]
  },
  {
    "email": "alice.wong@example.com",
    "first_name": "Alice",
    "last_name": "Wong",
    "phone": "+44-20-7946-0958",
    "addresses": [
      {
        "first_name": "Alice",
        "last_name": "Wong",
        "address_1": "78 High Street",
        "city": "London",
        "postal_code": "SW1A 1AA",
        "country_code": "gb",
        "phone": "+44-20-7946-0958"
      }
    ]
  },
  {
    "email": "bob.muller@example.com",
    "first_name": "Bob",
    "last_name": "Muller",
    "phone": "+49-30-12345678",
    "addresses": [
      {
        "first_name": "Bob",
        "last_name": "Muller",
        "address_1": "Unter den Linden 1",
        "city": "Berlin",
        "postal_code": "10117",
        "country_code": "de",
        "phone": "+49-30-12345678"
      }
    ]
  },
  {
    "email": "carol.dubois@example.com",
    "first_name": "Carol",
    "last_name": "Dubois",
    "phone": "+33-1-42-86-82-82",
    "addresses": [
      {
        "first_name": "Carol",
        "last_name": "Dubois",
        "address_1": "12 Rue de Rivoli",
        "city": "Paris",
        "postal_code": "75001",
        "country_code": "fr",
        "phone": "+33-1-42-86-82-82"
      }
    ]
  }
]
```

### Step 4: Commit

```bash
git add playground/data/
git commit -m "feat(playground): add demo data for products, categories, and customers

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 6: Create seed script

**Files:**
- Create: `playground/src/scripts/seed.ts`

### Step 1: Create `playground/src/scripts/seed.ts`

```typescript
import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/utils"
import { createDefaultsWorkflow } from "@medusajs/core-flows"
import categoriesData from "../../data/categories.json"
import productsData from "../../data/products.json"
import customersData from "../../data/customers.json"

export default async function seed({ container }: ExecArgs) {
  const logger = container.resolve("logger")
  logger.info("Starting playground seed...")

  // Step 1: Create default store, region, currency, sales channel
  logger.info("Creating default store infrastructure...")
  await createDefaultsWorkflow(container).run()

  // Resolve modules
  const productModule = container.resolve(Modules.PRODUCT)
  const customerModule = container.resolve(Modules.CUSTOMER)
  const pricingModule = container.resolve(Modules.PRICING)

  // Step 2: Create categories
  logger.info("Creating product categories...")
  const categories = await productModule.createProductCategories(
    categoriesData.map((cat) => ({
      name: cat.name,
      handle: cat.handle,
      description: cat.description,
      is_active: cat.is_active,
    }))
  )

  const categoryByHandle = new Map(categories.map((c) => [c.handle, c.id]))

  // Step 3: Create products with variants
  logger.info("Creating products...")
  for (const productInput of productsData) {
    const categoryId = categoryByHandle.get(productInput.category_handle)

    const product = await productModule.createProducts({
      title: productInput.title,
      handle: productInput.handle,
      description: productInput.description,
      subtitle: productInput.subtitle,
      is_giftcard: productInput.is_giftcard,
      discountable: productInput.discountable,
      status: productInput.status,
      categories: categoryId ? [{ id: categoryId }] : undefined,
      options: productInput.options.map((opt) => ({
        title: opt.title,
        values: opt.values.map((v) => ({ value: v })),
      })),
    })

    // Create variants for the product
    for (const variantInput of productInput.variants) {
      const variant = await productModule.createProductVariants({
        product_id: product.id,
        title: variantInput.title,
        sku: variantInput.sku,
        options: variantInput.options.map((opt, idx) => ({
          option_id: product.options[idx].id,
          value: opt.value,
        })),
      })

      // Create prices for the variant
      for (const priceInput of variantInput.prices) {
        await pricingModule.createPriceSets({
          prices: [
            {
              amount: priceInput.amount,
              currency_code: priceInput.currency_code,
            },
          ],
        })
      }
    }
  }

  // Step 4: Create customers
  logger.info("Creating customers...")
  for (const customerInput of customersData) {
    await customerModule.createCustomers({
      email: customerInput.email,
      first_name: customerInput.first_name,
      last_name: customerInput.last_name,
      phone: customerInput.phone,
      addresses: customerInput.addresses.map((addr) => ({
        first_name: addr.first_name,
        last_name: addr.last_name,
        address_1: addr.address_1,
        city: addr.city,
        province: addr.province,
        postal_code: addr.postal_code,
        country_code: addr.country_code,
        phone: addr.phone,
      })),
    })
  }

  logger.info("Playground seed completed successfully!")
}
```

### Step 2: Commit

```bash
git add playground/src/scripts/seed.ts
git commit -m "feat(playground): add seed script for demo data

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 7: Install dependencies and verify setup

**Files:**
- None (runtime verification)

### Step 1: Run yarn install

```bash
cd /Users/huhui/Projects/medusa
yarn install
```

Expected: Yarn resolves workspace dependencies for `playground/`, creating `playground/node_modules/` with symlinks to monorepo packages.

### Step 2: Verify workspace resolution

```bash
ls -la /Users/huhui/Projects/medusa/playground/node_modules/@medusajs/medusa 2>/dev/null && echo "OK: medusa resolved" || echo "FAIL: medusa not resolved"
```

Expected: Symlink pointing to `../../../packages/medusa`.

### Step 3: Verify docker compose config

```bash
cd /Users/huhui/Projects/medusa/playground
docker compose config > /dev/null && echo "OK: docker compose config valid" || echo "FAIL: docker compose config invalid"
```

Expected: `OK: docker compose config valid`

### Step 4: Commit

No file changes to commit for this task — it is runtime verification only.

---

## Spec Coverage Check

| Spec Requirement | Task |
|-----------------|------|
| Self-contained `playground/` directory | Task 1, 2, 3, 5, 6 |
| Yarn workspace references to monorepo packages | Task 1 (`package.json`), Task 4 |
| Docker Compose for PostgreSQL + Redis | Task 2 |
| `medusa-config.ts` with all core modules | Task 3 |
| Seed script with medium demo data | Task 5, 6 |
| CLI scripts (`setup`, `dev`, `seed`, etc.) | Task 1 (`package.json`) |
| Environment variable template | Task 1 (`.env.template`) |
| Zero modifications to existing packages | Task 4 (only adds to workspace config), all others are new files |

---

## Placeholder Scan

- No "TBD", "TODO", "implement later" found.
- No vague instructions like "add appropriate error handling".
- All code blocks contain complete, copy-pasteable code.
- All file paths are exact.

---

## Type Consistency Check

- `ExecArgs` from `@medusajs/framework/types` used in seed script — matches Medusa 2.x API.
- `Modules` from `@medusajs/utils` — matches existing codebase usage.
- `createDefaultsWorkflow` from `@medusajs/core-flows` — standard Medusa workflow.
- Module service method names (`createProductCategories`, `createProducts`, `createProductVariants`, `createCustomers`) match Medusa module SDK conventions.
