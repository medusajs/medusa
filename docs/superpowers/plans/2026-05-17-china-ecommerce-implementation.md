# China E-commerce Adaptation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adapt Medusa for Chinese e-commerce by adding 7 new modules and extending 3 existing modules, enabling multi-platform shop management, material hierarchy, platform SKU mapping, and channel pricing.

**Architecture:** Pure modular approach — each new entity (Brand, Organization, Material, Shop, PlatformMapping, ChannelPrice, StoreInventory) gets its own module following Medusa conventions. Existing Product, Variant, and InventoryItem modules are extended with new fields. Cross-module relationships use Link module definitions.

**Tech Stack:** TypeScript, MikroORM, Medusa Framework (model.define, MedusaService, createStep/createWorkflow), PostgreSQL

---

## Phase 0: Foundation

### Task 1: Create china branch from playground

- [ ] **Step 1: Create and switch to china branch**

```bash
git checkout playground
git checkout -b china
```

- [ ] **Step 2: Verify branch**

```bash
git branch --show-current
# Expected: china
```

- [ ] **Step 3: Initial commit marker**

```bash
git commit --allow-empty -m "chore: initialize china branch for e-commerce adaptation"
```

---

### Task 2: Create Brand module scaffold

**Files:**
- Create: `packages/modules/brand/src/models/brand.ts`
- Create: `packages/modules/brand/src/services/brand-module-service.ts`
- Create: `packages/modules/brand/src/repositories/brand.ts`
- Create: `packages/modules/brand/src/index.ts`
- Create: `packages/modules/brand/src/types/index.ts`
- Create: `packages/modules/brand/package.json`
- Create: `packages/modules/brand/tsconfig.json`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@medusajs/brand",
  "version": "0.0.1",
  "description": "Medusa Brand module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsc --build",
    "watch": "tsc --build --watch",
    "test": "jest"
  },
  "dependencies": {
    "@medusajs/framework": "^2.0.0",
    "@medusajs/utils": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["dist", "node_modules", "**/__tests__"]
}
```

- [ ] **Step 3: Create Brand model**

```typescript
// packages/modules/brand/src/models/brand.ts
import { model } from "@medusajs/framework/utils"

const Brand = model
  .define("Brand", {
    id: model.id({ prefix: "brand" }).primaryKey(),
    name: model.text().searchable(),
    slug: model.text().unique(),
    logo_url: model.text().nullable(),
    description: model.text().nullable(),
    org_id: model.text().nullable(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_brand_slug_unique",
      on: ["slug"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default Brand
```

- [ ] **Step 4: Create Brand types**

```typescript
// packages/modules/brand/src/types/index.ts
export interface CreateBrandDTO {
  name: string
  slug: string
  logo_url?: string
  description?: string
  org_id?: string
  metadata?: Record<string, unknown>
}

export interface UpdateBrandDTO {
  name?: string
  slug?: string
  logo_url?: string
  description?: string
  org_id?: string
  metadata?: Record<string, unknown>
}
```

- [ ] **Step 5: Create Brand repository**

```typescript
// packages/modules/brand/src/repositories/brand.ts
import { DALUtils } from "@medusajs/framework/utils"

export class BrandRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  "Brand"
) {}
```

- [ ] **Step 6: Create Brand module service**

```typescript
// packages/modules/brand/src/services/brand-module-service.ts
import {
  MedusaService,
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
} from "@medusajs/framework/utils"
import { Context, DAL } from "@medusajs/framework/types"
import Brand from "../models/brand"
import { CreateBrandDTO, UpdateBrandDTO } from "../types"

export class BrandModuleService extends MedusaService<{
  Brand: { dto: CreateBrandDTO; updateDto: UpdateBrandDTO }
}>({ Brand }) {
  // MedusaService provides CRUD: create, update, delete, list, retrieve
}
```

- [ ] **Step 7: Create module index**

```typescript
// packages/modules/brand/src/index.ts
import { Module, Modules } from "@medusajs/framework/utils"
import { BrandModuleService } from "./services/brand-module-service"

export default Module(Modules.BRAND, {
  service: BrandModuleService,
})
```

- [ ] **Step 8: Commit**

```bash
git add packages/modules/brand/
git commit -m "feat(brand): add brand module scaffold with model, service, and types"
```

---

### Task 3: Create Organization module scaffold

**Files:**
- Create: `packages/modules/organization/src/models/organization.ts`
- Create: `packages/modules/organization/src/services/organization-module-service.ts`
- Create: `packages/modules/organization/src/repositories/organization.ts`
- Create: `packages/modules/organization/src/index.ts`
- Create: `packages/modules/organization/src/types/index.ts`
- Create: `packages/modules/organization/package.json`
- Create: `packages/modules/organization/tsconfig.json`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@medusajs/organization",
  "version": "0.0.1",
  "description": "Medusa Organization module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsc --build",
    "watch": "tsc --build --watch",
    "test": "jest"
  },
  "dependencies": {
    "@medusajs/framework": "^2.0.0",
    "@medusajs/utils": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["dist", "node_modules", "**/__tests__"]
}
```

- [ ] **Step 3: Create Organization model**

```typescript
// packages/modules/organization/src/models/organization.ts
import { model } from "@medusajs/framework/utils"

const Organization = model
  .define("Organization", {
    id: model.id({ prefix: "org" }).primaryKey(),
    name: model.text().searchable(),
    code: model.text().unique(),
    parent_id: model.text().nullable(),
    org_type: model.enum(["brand_bu", "operation", "department"]),
    status: model.enum(["active", "inactive"]).default("active"),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_organization_code_unique",
      on: ["code"],
      unique: true,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_organization_parent_id",
      on: ["parent_id"],
      where: "deleted_at IS NULL",
    },
  ])

export default Organization
```

- [ ] **Step 4: Create Organization types**

```typescript
// packages/modules/organization/src/types/index.ts
export interface CreateOrganizationDTO {
  name: string
  code: string
  parent_id?: string
  org_type: "brand_bu" | "operation" | "department"
  status?: "active" | "inactive"
  metadata?: Record<string, unknown>
}

export interface UpdateOrganizationDTO {
  name?: string
  code?: string
  parent_id?: string
  org_type?: "brand_bu" | "operation" | "department"
  status?: "active" | "inactive"
  metadata?: Record<string, unknown>
}
```

- [ ] **Step 5: Create Organization repository**

```typescript
// packages/modules/organization/src/repositories/organization.ts
import { DALUtils } from "@medusajs/framework/utils"

export class OrganizationRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  "Organization"
) {}
```

- [ ] **Step 6: Create Organization module service**

```typescript
// packages/modules/organization/src/services/organization-module-service.ts
import {
  MedusaService,
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
} from "@medusajs/framework/utils"
import { Context, DAL } from "@medusajs/framework/types"
import Organization from "../models/organization"
import { CreateOrganizationDTO, UpdateOrganizationDTO } from "../types"

export class OrganizationModuleService extends MedusaService<{
  Organization: { dto: CreateOrganizationDTO; updateDto: UpdateOrganizationDTO }
}>({ Organization }) {}
```

- [ ] **Step 7: Create module index**

```typescript
// packages/modules/organization/src/index.ts
import { Module, Modules } from "@medusajs/framework/utils"
import { OrganizationModuleService } from "./services/organization-module-service"

export default Module(Modules.ORGANIZATION, {
  service: OrganizationModuleService,
})
```

- [ ] **Step 8: Commit**

```bash
git add packages/modules/organization/
git commit -m "feat(organization): add organization module scaffold with model, service, and types"
```

---

### Task 4: Create Shop module scaffold

**Files:**
- Create: `packages/modules/shop/src/models/shop.ts`
- Create: `packages/modules/shop/src/services/shop-module-service.ts`
- Create: `packages/modules/shop/src/repositories/shop.ts`
- Create: `packages/modules/shop/src/index.ts`
- Create: `packages/modules/shop/src/types/index.ts`
- Create: `packages/modules/shop/package.json`
- Create: `packages/modules/shop/tsconfig.json`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@medusajs/shop",
  "version": "0.0.1",
  "description": "Medusa Shop module for multi-platform management",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsc --build",
    "watch": "tsc --build --watch",
    "test": "jest"
  },
  "dependencies": {
    "@medusajs/framework": "^2.0.0",
    "@medusajs/utils": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["dist", "node_modules", "**/__tests__"]
}
```

- [ ] **Step 3: Create Shop model**

```typescript
// packages/modules/shop/src/models/shop.ts
import { model } from "@medusajs/framework/utils"

const PlatformType = [
  "taobao",
  "douyin",
  "jd",
  "pdd",
  "wechat",
  "xiaohongshu",
  "other",
] as const

const Shop = model
  .define("Shop", {
    id: model.id({ prefix: "shop" }).primaryKey(),
    shop_code: model.text().unique(),
    shop_name: model.text().searchable(),
    platform_type: model.enum(PlatformType),
    platform_shop_id: model.text().nullable(),
    org_id: model.text().nullable(),
    status: model.enum(["active", "inactive"]).default("active"),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_shop_code_unique",
      on: ["shop_code"],
      unique: true,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_shop_platform_type",
      on: ["platform_type"],
      where: "deleted_at IS NULL",
    },
  ])

export default Shop
```

- [ ] **Step 4: Create Shop types**

```typescript
// packages/modules/shop/src/types/index.ts
export type PlatformType =
  | "taobao"
  | "douyin"
  | "jd"
  | "pdd"
  | "wechat"
  | "xiaohongshu"
  | "other"

export interface CreateShopDTO {
  shop_code: string
  shop_name: string
  platform_type: PlatformType
  platform_shop_id?: string
  org_id?: string
  status?: "active" | "inactive"
  metadata?: Record<string, unknown>
}

export interface UpdateShopDTO {
  shop_code?: string
  shop_name?: string
  platform_type?: PlatformType
  platform_shop_id?: string
  org_id?: string
  status?: "active" | "inactive"
  metadata?: Record<string, unknown>
}
```

- [ ] **Step 5: Create Shop repository**

```typescript
// packages/modules/shop/src/repositories/shop.ts
import { DALUtils } from "@medusajs/framework/utils"

export class ShopRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  "Shop"
) {}
```

- [ ] **Step 6: Create Shop module service**

```typescript
// packages/modules/shop/src/services/shop-module-service.ts
import { MedusaService } from "@medusajs/framework/utils"
import Shop from "../models/shop"
import { CreateShopDTO, UpdateShopDTO } from "../types"

export class ShopModuleService extends MedusaService<{
  Shop: { dto: CreateShopDTO; updateDto: UpdateShopDTO }
}>({ Shop }) {}
```

- [ ] **Step 7: Create module index**

```typescript
// packages/modules/shop/src/index.ts
import { Module, Modules } from "@medusajs/framework/utils"
import { ShopModuleService } from "./services/shop-module-service"

export default Module(Modules.SHOP, {
  service: ShopModuleService,
})
```

- [ ] **Step 8: Commit**

```bash
git add packages/modules/shop/
git commit -m "feat(shop): add shop module scaffold for multi-platform management"
```

---

### Task 5: Create Material module scaffold

**Files:**
- Create: `packages/modules/material/src/models/basic-material.ts`
- Create: `packages/modules/material/src/models/sales-material.ts`
- Create: `packages/modules/material/src/models/combo-item.ts`
- Create: `packages/modules/material/src/services/material-module-service.ts`
- Create: `packages/modules/material/src/repositories/basic-material.ts`
- Create: `packages/modules/material/src/repositories/sales-material.ts`
- Create: `packages/modules/material/src/repositories/combo-item.ts`
- Create: `packages/modules/material/src/index.ts`
- Create: `packages/modules/material/src/types/index.ts`
- Create: `packages/modules/material/package.json`
- Create: `packages/modules/material/tsconfig.json`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@medusajs/material",
  "version": "0.0.1",
  "description": "Medusa Material module for basic and sales materials",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsc --build",
    "watch": "tsc --build --watch",
    "test": "jest"
  },
  "dependencies": {
    "@medusajs/framework": "^2.0.0",
    "@medusajs/utils": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["dist", "node_modules", "**/__tests__"]
}
```

- [ ] **Step 3: Create BasicMaterial model**

```typescript
// packages/modules/material/src/models/basic-material.ts
import { model } from "@medusajs/framework/utils"
import SalesMaterial from "./sales-material"
import ComboItem from "./combo-item"

const MaterialType = ["finished", "semi", "normal", "box", "virtual"] as const
const SourceType = ["local", "api"] as const

const BasicMaterial = model
  .define("BasicMaterial", {
    id: model.id({ prefix: "bm" }).primaryKey(),
    material_code: model.text().unique(),
    material_name: model.text().searchable(),
    spu_code: model.text().nullable(),
    material_type: model.enum(MaterialType).default("normal"),
    category_id: model.text().nullable(),
    sn_managed: model.boolean().default(false),
    stock_controlled: model.boolean().default(true),
    tax_rate: model.float().nullable(),
    tax_name: model.text().nullable(),
    tax_code: model.text().nullable(),
    omnichannel: model.boolean().default(false),
    o2o_enabled: model.boolean().default(false),
    color: model.text().nullable(),
    size: model.text().nullable(),
    source: model.enum(SourceType).default("local"),
    org_id: model.text().nullable(),
    metadata: model.json().nullable(),
    sales_materials: model.hasMany(() => SalesMaterial, {
      mappedBy: "basic_material",
    }),
    parent_combo_items: model.hasMany(() => ComboItem, {
      mappedBy: "parent_material",
    }),
    child_combo_items: model.hasMany(() => ComboItem, {
      mappedBy: "child_material",
    }),
  })
  .indexes([
    {
      name: "IDX_basic_material_code_unique",
      on: ["material_code"],
      unique: true,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_basic_material_spu_code",
      on: ["spu_code"],
      where: "deleted_at IS NULL",
    },
  ])

export default BasicMaterial
```

- [ ] **Step 4: Create SalesMaterial model**

```typescript
// packages/modules/material/src/models/sales-material.ts
import { model } from "@medusajs/framework/utils"
import BasicMaterial from "./basic-material"

const SalesType = [
  "normal",
  "combo",
  "gift",
  "choice",
  "box",
  "lucky_bag",
] as const
const SourceType = ["local", "api"] as const

const SalesMaterial = model
  .define("SalesMaterial", {
    id: model.id({ prefix: "sm" }).primaryKey(),
    shop_id: model.text(),
    sales_code: model.text(),
    sales_name: model.text().searchable(),
    sales_type: model.enum(SalesType).default("normal"),
    material_id: model.text().nullable(),
    is_bound: model.boolean().default(false),
    customer_class_id: model.text().nullable(),
    org_id: model.text().nullable(),
    tax_rate: model.float().nullable(),
    tax_name: model.text().nullable(),
    tax_code: model.text().nullable(),
    source: model.enum(SourceType).default("local"),
    status: model.enum(["active", "inactive"]).default("active"),
    metadata: model.json().nullable(),
    basic_material: model
      .belongsTo(() => BasicMaterial, {
        mappedBy: "sales_materials",
      })
      .nullable(),
  })
  .indexes([
    {
      name: "IDX_sales_material_shop_code",
      on: ["shop_id", "sales_code"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default SalesMaterial
```

- [ ] **Step 5: Create ComboItem model**

```typescript
// packages/modules/material/src/models/combo-item.ts
import { model } from "@medusajs/framework/utils"
import BasicMaterial from "./basic-material"

const ComboItem = model
  .define("ComboItem", {
    id: model.id({ prefix: "combo" }).primaryKey(),
    parent_material_id: model.text(),
    child_material_id: model.text(),
    quantity: model.number().default(1),
    is_optional: model.boolean().default(false),
    sort_order: model.number().default(0),
    parent_material: model.belongsTo(() => BasicMaterial, {
      mappedBy: "parent_combo_items",
    }),
    child_material: model.belongsTo(() => BasicMaterial, {
      mappedBy: "child_combo_items",
    }),
  })
  .indexes([
    {
      name: "IDX_combo_item_parent",
      on: ["parent_material_id"],
      where: "deleted_at IS NULL",
    },
  ])

export default ComboItem
```

- [ ] **Step 6: Create Material types**

```typescript
// packages/modules/material/src/types/index.ts
export type MaterialType = "finished" | "semi" | "normal" | "box" | "virtual"
export type SalesType =
  | "normal"
  | "combo"
  | "gift"
  | "choice"
  | "box"
  | "lucky_bag"
export type SourceType = "local" | "api"

export interface CreateBasicMaterialDTO {
  material_code: string
  material_name: string
  spu_code?: string
  material_type?: MaterialType
  category_id?: string
  sn_managed?: boolean
  stock_controlled?: boolean
  tax_rate?: number
  tax_name?: string
  tax_code?: string
  omnichannel?: boolean
  o2o_enabled?: boolean
  color?: string
  size?: string
  source?: SourceType
  org_id?: string
  metadata?: Record<string, unknown>
}

export interface UpdateBasicMaterialDTO
  extends Partial<CreateBasicMaterialDTO> {}

export interface CreateSalesMaterialDTO {
  shop_id: string
  sales_code: string
  sales_name: string
  sales_type?: SalesType
  material_id?: string
  is_bound?: boolean
  customer_class_id?: string
  org_id?: string
  tax_rate?: number
  tax_name?: string
  tax_code?: string
  source?: SourceType
  status?: "active" | "inactive"
  metadata?: Record<string, unknown>
}

export interface UpdateSalesMaterialDTO
  extends Partial<CreateSalesMaterialDTO> {}

export interface CreateComboItemDTO {
  parent_material_id: string
  child_material_id: string
  quantity?: number
  is_optional?: boolean
  sort_order?: number
}

export interface UpdateComboItemDTO extends Partial<CreateComboItemDTO> {}
```

- [ ] **Step 7: Create Material repositories**

```typescript
// packages/modules/material/src/repositories/basic-material.ts
import { DALUtils } from "@medusajs/framework/utils"

export class BasicMaterialRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  "BasicMaterial"
) {}
```

```typescript
// packages/modules/material/src/repositories/sales-material.ts
import { DALUtils } from "@medusajs/framework/utils"

export class SalesMaterialRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  "SalesMaterial"
) {}
```

```typescript
// packages/modules/material/src/repositories/combo-item.ts
import { DALUtils } from "@medusajs/framework/utils"

export class ComboItemRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  "ComboItem"
) {}
```

- [ ] **Step 8: Create Material module service**

```typescript
// packages/modules/material/src/services/material-module-service.ts
import { MedusaService } from "@medusajs/framework/utils"
import BasicMaterial from "../models/basic-material"
import SalesMaterial from "../models/sales-material"
import ComboItem from "../models/combo-item"
import {
  CreateBasicMaterialDTO,
  UpdateBasicMaterialDTO,
  CreateSalesMaterialDTO,
  UpdateSalesMaterialDTO,
  CreateComboItemDTO,
  UpdateComboItemDTO,
} from "../types"

export class MaterialModuleService extends MedusaService<{
  BasicMaterial: {
    dto: CreateBasicMaterialDTO
    updateDto: UpdateBasicMaterialDTO
  }
  SalesMaterial: {
    dto: CreateSalesMaterialDTO
    updateDto: UpdateSalesMaterialDTO
  }
  ComboItem: { dto: CreateComboItemDTO; updateDto: UpdateComboItemDTO }
}>({ BasicMaterial, SalesMaterial, ComboItem }) {}
```

- [ ] **Step 9: Create module index**

```typescript
// packages/modules/material/src/index.ts
import { Module, Modules } from "@medusajs/framework/utils"
import { MaterialModuleService } from "./services/material-module-service"

export default Module(Modules.MATERIAL, {
  service: MaterialModuleService,
})
```

- [ ] **Step 10: Commit**

```bash
git add packages/modules/material/
git commit -m "feat(material): add material module with basic material, sales material, and combo item"
```

---

### Task 6: Create PlatformMapping module scaffold

**Files:**
- Create: `packages/modules/platform-mapping/src/models/platform-sku.ts`
- Create: `packages/modules/platform-mapping/src/models/platform-sync-task.ts`
- Create: `packages/modules/platform-mapping/src/services/platform-mapping-module-service.ts`
- Create: `packages/modules/platform-mapping/src/repositories/platform-sku.ts`
- Create: `packages/modules/platform-mapping/src/repositories/platform-sync-task.ts`
- Create: `packages/modules/platform-mapping/src/index.ts`
- Create: `packages/modules/platform-mapping/src/types/index.ts`
- Create: `packages/modules/platform-mapping/package.json`
- Create: `packages/modules/platform-mapping/tsconfig.json`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@medusajs/platform-mapping",
  "version": "0.0.1",
  "description": "Medusa Platform Mapping module for multi-platform SKU management",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsc --build",
    "watch": "tsc --build --watch",
    "test": "jest"
  },
  "dependencies": {
    "@medusajs/framework": "^2.0.0",
    "@medusajs/utils": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["dist", "node_modules", "**/__tests__"]
}
```

- [ ] **Step 3: Create PlatformSku model**

```typescript
// packages/modules/platform-mapping/src/models/platform-sku.ts
import { model } from "@medusajs/framework/utils"

const PlatformType = [
  "taobao",
  "douyin",
  "jd",
  "pdd",
  "wechat",
  "xiaohongshu",
  "other",
] as const

const PlatformSku = model
  .define("PlatformSku", {
    id: model.id({ prefix: "psku" }).primaryKey(),
    shop_id: model.text(),
    platform_type: model.enum(PlatformType),
    platform_product_id: model.text(),
    platform_sku_id: model.text(),
    platform_sku_code: model.text().nullable(),
    sales_material_id: model.text().nullable(),
    variant_id: model.text().nullable(),
    platform_title: model.text().nullable(),
    platform_price: model.float().nullable(),
    platform_properties: model.json().nullable(),
    sync_status: model
      .enum(["pending", "success", "failed"])
      .default("pending"),
    mapping_status: model
      .enum(["unmapped", "mapped"])
      .default("unmapped"),
    listing_status: model
      .enum(["listed", "delisted"])
      .default("listed"),
    last_sync_at: model.dateTime().nullable(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_platform_sku_shop_platform",
      on: ["shop_id", "platform_type", "platform_sku_id"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default PlatformSku
```

- [ ] **Step 4: Create PlatformSyncTask model**

```typescript
// packages/modules/platform-mapping/src/models/platform-sync-task.ts
import { model } from "@medusajs/framework/utils"

const PlatformType = [
  "taobao",
  "douyin",
  "jd",
  "pdd",
  "wechat",
  "xiaohongshu",
  "other",
] as const

const PlatformSyncTask = model
  .define("PlatformSyncTask", {
    id: model.id({ prefix: "psync" }).primaryKey(),
    shop_id: model.text(),
    platform_type: model.enum(PlatformType),
    action: model.enum(["create", "update", "delist", "delete"]),
    payload: model.json(),
    status: model
      .enum(["pending", "processing", "success", "failed"])
      .default("pending"),
    error_msg: model.text().nullable(),
    retry_count: model.number().default(0),
  })
  .indexes([
    {
      name: "IDX_platform_sync_task_status",
      on: ["status"],
      where: "deleted_at IS NULL",
    },
  ])

export default PlatformSyncTask
```

- [ ] **Step 5: Create PlatformMapping types**

```typescript
// packages/modules/platform-mapping/src/types/index.ts
export type PlatformType =
  | "taobao"
  | "douyin"
  | "jd"
  | "pdd"
  | "wechat"
  | "xiaohongshu"
  | "other"

export interface CreatePlatformSkuDTO {
  shop_id: string
  platform_type: PlatformType
  platform_product_id: string
  platform_sku_id: string
  platform_sku_code?: string
  sales_material_id?: string
  variant_id?: string
  platform_title?: string
  platform_price?: number
  platform_properties?: Record<string, unknown>
  sync_status?: "pending" | "success" | "failed"
  mapping_status?: "unmapped" | "mapped"
  listing_status?: "listed" | "delisted"
  last_sync_at?: Date
  metadata?: Record<string, unknown>
}

export interface UpdatePlatformSkuDTO extends Partial<CreatePlatformSkuDTO> {}

export interface CreatePlatformSyncTaskDTO {
  shop_id: string
  platform_type: PlatformType
  action: "create" | "update" | "delist" | "delete"
  payload: Record<string, unknown>
  status?: "pending" | "processing" | "success" | "failed"
  error_msg?: string
  retry_count?: number
}

export interface UpdatePlatformSyncTaskDTO
  extends Partial<CreatePlatformSyncTaskDTO> {}
```

- [ ] **Step 6: Create PlatformMapping repositories**

```typescript
// packages/modules/platform-mapping/src/repositories/platform-sku.ts
import { DALUtils } from "@medusajs/framework/utils"

export class PlatformSkuRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  "PlatformSku"
) {}
```

```typescript
// packages/modules/platform-mapping/src/repositories/platform-sync-task.ts
import { DALUtils } from "@medusajs/framework/utils"

export class PlatformSyncTaskRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  "PlatformSyncTask"
) {}
```

- [ ] **Step 7: Create PlatformMapping module service**

```typescript
// packages/modules/platform-mapping/src/services/platform-mapping-module-service.ts
import { MedusaService } from "@medusajs/framework/utils"
import PlatformSku from "../models/platform-sku"
import PlatformSyncTask from "../models/platform-sync-task"
import {
  CreatePlatformSkuDTO,
  UpdatePlatformSkuDTO,
  CreatePlatformSyncTaskDTO,
  UpdatePlatformSyncTaskDTO,
} from "../types"

export class PlatformMappingModuleService extends MedusaService<{
  PlatformSku: {
    dto: CreatePlatformSkuDTO
    updateDto: UpdatePlatformSkuDTO
  }
  PlatformSyncTask: {
    dto: CreatePlatformSyncTaskDTO
    updateDto: UpdatePlatformSyncTaskDTO
  }
}>({ PlatformSku, PlatformSyncTask }) {}
```

- [ ] **Step 8: Create module index**

```typescript
// packages/modules/platform-mapping/src/index.ts
import { Module, Modules } from "@medusajs/framework/utils"
import { PlatformMappingModuleService } from "./services/platform-mapping-module-service"

export default Module(Modules.PLATFORM_MAPPING, {
  service: PlatformMappingModuleService,
})
```

- [ ] **Step 9: Commit**

```bash
git add packages/modules/platform-mapping/
git commit -m "feat(platform-mapping): add platform mapping module with platform sku and sync task"
```

---

### Task 7: Create ChannelPrice module scaffold

**Files:**
- Create: `packages/modules/channel-price/src/models/channel-price.ts`
- Create: `packages/modules/channel-price/src/services/channel-price-module-service.ts`
- Create: `packages/modules/channel-price/src/repositories/channel-price.ts`
- Create: `packages/modules/channel-price/src/index.ts`
- Create: `packages/modules/channel-price/src/types/index.ts`
- Create: `packages/modules/channel-price/package.json`
- Create: `packages/modules/channel-price/tsconfig.json`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@medusajs/channel-price",
  "version": "0.0.1",
  "description": "Medusa Channel Price module for multi-channel pricing",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsc --build",
    "watch": "tsc --build --watch",
    "test": "jest"
  },
  "dependencies": {
    "@medusajs/framework": "^2.0.0",
    "@medusajs/utils": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["dist", "node_modules", "**/__tests__"]
}
```

- [ ] **Step 3: Create ChannelPrice model**

```typescript
// packages/modules/channel-price/src/models/channel-price.ts
import { model } from "@medusajs/framework/utils"

const ChannelPrice = model
  .define("ChannelPrice", {
    id: model.id({ prefix: "chprice" }).primaryKey(),
    sales_material_id: model.text(),
    shop_id: model.text().nullable(),
    customer_class_id: model.text().nullable(),
    price_type: model.enum(["retail", "wholesale", "supply"]),
    currency_code: model.text().default("CNY"),
    amount: model.float(),
    start_at: model.dateTime().nullable(),
    end_at: model.dateTime().nullable(),
    min_quantity: model.number().nullable(),
    max_quantity: model.number().nullable(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_channel_price_sales_material",
      on: ["sales_material_id"],
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_channel_price_shop",
      on: ["shop_id"],
      where: "deleted_at IS NULL",
    },
  ])

export default ChannelPrice
```

- [ ] **Step 4: Create ChannelPrice types**

```typescript
// packages/modules/channel-price/src/types/index.ts
export interface CreateChannelPriceDTO {
  sales_material_id: string
  shop_id?: string
  customer_class_id?: string
  price_type: "retail" | "wholesale" | "supply"
  currency_code?: string
  amount: number
  start_at?: Date
  end_at?: Date
  min_quantity?: number
  max_quantity?: number
  metadata?: Record<string, unknown>
}

export interface UpdateChannelPriceDTO extends Partial<CreateChannelPriceDTO> {}
```

- [ ] **Step 5: Create ChannelPrice repository**

```typescript
// packages/modules/channel-price/src/repositories/channel-price.ts
import { DALUtils } from "@medusajs/framework/utils"

export class ChannelPriceRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  "ChannelPrice"
) {}
```

- [ ] **Step 6: Create ChannelPrice module service**

```typescript
// packages/modules/channel-price/src/services/channel-price-module-service.ts
import { MedusaService } from "@medusajs/framework/utils"
import ChannelPrice from "../models/channel-price"
import { CreateChannelPriceDTO, UpdateChannelPriceDTO } from "../types"

export class ChannelPriceModuleService extends MedusaService<{
  ChannelPrice: {
    dto: CreateChannelPriceDTO
    updateDto: UpdateChannelPriceDTO
  }
}>({ ChannelPrice }) {}
```

- [ ] **Step 7: Create module index**

```typescript
// packages/modules/channel-price/src/index.ts
import { Module, Modules } from "@medusajs/framework/utils"
import { ChannelPriceModuleService } from "./services/channel-price-module-service"

export default Module(Modules.CHANNEL_PRICE, {
  service: ChannelPriceModuleService,
})
```

- [ ] **Step 8: Commit**

```bash
git add packages/modules/channel-price/
git commit -m "feat(channel-price): add channel price module for multi-channel pricing"
```

---

### Task 8: Create StoreInventory module scaffold

**Files:**
- Create: `packages/modules/store-inventory/src/models/store-inventory.ts`
- Create: `packages/modules/store-inventory/src/services/store-inventory-module-service.ts`
- Create: `packages/modules/store-inventory/src/repositories/store-inventory.ts`
- Create: `packages/modules/store-inventory/src/index.ts`
- Create: `packages/modules/store-inventory/src/types/index.ts`
- Create: `packages/modules/store-inventory/package.json`
- Create: `packages/modules/store-inventory/tsconfig.json`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@medusajs/store-inventory",
  "version": "0.0.1",
  "description": "Medusa Store Inventory module for O2O store inventory",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsc --build",
    "watch": "tsc --build --watch",
    "test": "jest"
  },
  "dependencies": {
    "@medusajs/framework": "^2.0.0",
    "@medusajs/utils": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["dist", "node_modules", "**/__tests__"]
}
```

- [ ] **Step 3: Create StoreInventory model**

```typescript
// packages/modules/store-inventory/src/models/store-inventory.ts
import { model } from "@medusajs/framework/utils"

const StoreInventory = model
  .define("StoreInventory", {
    id: model.id({ prefix: "sinv" }).primaryKey(),
    location_id: model.text(),
    material_id: model.text(),
    online_stock: model.number().default(0),
    online_reserved: model.number().default(0),
    share_stock: model.number().default(0),
    share_reserved: model.number().default(0),
    in_transit_stock: model.number().default(0),
    store_mode: model.enum(["normal", "discount"]).default("normal"),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_store_inventory_location_material",
      on: ["location_id", "material_id"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default StoreInventory
```

- [ ] **Step 4: Create StoreInventory types**

```typescript
// packages/modules/store-inventory/src/types/index.ts
export interface CreateStoreInventoryDTO {
  location_id: string
  material_id: string
  online_stock?: number
  online_reserved?: number
  share_stock?: number
  share_reserved?: number
  in_transit_stock?: number
  store_mode?: "normal" | "discount"
  metadata?: Record<string, unknown>
}

export interface UpdateStoreInventoryDTO
  extends Partial<CreateStoreInventoryDTO> {}
```

- [ ] **Step 5: Create StoreInventory repository**

```typescript
// packages/modules/store-inventory/src/repositories/store-inventory.ts
import { DALUtils } from "@medusajs/framework/utils"

export class StoreInventoryRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  "StoreInventory"
) {}
```

- [ ] **Step 6: Create StoreInventory module service**

```typescript
// packages/modules/store-inventory/src/services/store-inventory-module-service.ts
import { MedusaService } from "@medusajs/framework/utils"
import StoreInventory from "../models/store-inventory"
import { CreateStoreInventoryDTO, UpdateStoreInventoryDTO } from "../types"

export class StoreInventoryModuleService extends MedusaService<{
  StoreInventory: {
    dto: CreateStoreInventoryDTO
    updateDto: UpdateStoreInventoryDTO
  }
}>({ StoreInventory }) {}
```

- [ ] **Step 7: Create module index**

```typescript
// packages/modules/store-inventory/src/index.ts
import { Module, Modules } from "@medusajs/framework/utils"
import { StoreInventoryModuleService } from "./services/store-inventory-module-service"

export default Module(Modules.STORE_INVENTORY, {
  service: StoreInventoryModuleService,
})
```

- [ ] **Step 8: Commit**

```bash
git add packages/modules/store-inventory/
git commit -m "feat(store-inventory): add store inventory module for O2O store management"
```

---

### Task 9: Register new modules in Modules enum

**Files:**
- Modify: `packages/core/utils/src/modules-sdk/registration-key.ts`

- [ ] **Step 1: Add new module keys to Modules enum**

Check the current Modules enum and add:

```typescript
// Add to the Modules enum
BRAND = "brand",
ORGANIZATION = "organization",
SHOP = "shop",
MATERIAL = "material",
PLATFORM_MAPPING = "platformMapping",
CHANNEL_PRICE = "channelPrice",
STORE_INVENTORY = "storeInventory",
```

- [ ] **Step 2: Commit**

```bash
git add packages/core/utils/src/modules-sdk/registration-key.ts
git commit -m "feat(framework): register new china e-commerce module keys in Modules enum"
```

---

### Task 10: Register modules in medusa-config.ts

**Files:**
- Modify: `playground/medusa-config.ts`

- [ ] **Step 1: Import and register new modules**

Add to medusa-config.ts modules configuration:

```typescript
modules: [
  // ... existing modules
  {
    resolve: "@medusajs/brand",
  },
  {
    resolve: "@medusajs/organization",
  },
  {
    resolve: "@medusajs/shop",
  },
  {
    resolve: "@medusajs/material",
  },
  {
    resolve: "@medusajs/platform-mapping",
  },
  {
    resolve: "@medusajs/channel-price",
  },
  {
    resolve: "@medusajs/store-inventory",
  },
],
```

- [ ] **Step 2: Commit**

```bash
git add playground/medusa-config.ts
git commit -m "chore(playground): register new china e-commerce modules in config"
```

---

## Phase 1: P0 - MVP (Product Enhancement + Brand + Shop + PlatformMapping)

### Task 11: Extend Product model with china e-commerce fields

**Files:**
- Modify: `packages/modules/product/src/models/product.ts`

- [ ] **Step 1: Add new fields to Product model**

```typescript
// Add to Product model definition
spu_code: model.text().nullable(),
brand_id: model.text().nullable(),
brief: model.text().nullable(),
unit: model.text().nullable(),
product_type: model
  .enum(["normal", "bind", "combo", "gift"])
  .default("normal"),
sn_managed: model.boolean().default(false),
published_at: model.dateTime().nullable(),
unpublished_at: model.dateTime().nullable(),
sort_order: model.number().default(0),
visibility: model.enum(["visible", "hidden"]).default("visible"),
```

- [ ] **Step 2: Add index for spu_code**

```typescript
// Add to indexes array
{
  name: "IDX_product_spu_code",
  on: ["spu_code"],
  unique: false,
  where: "deleted_at IS NULL",
},
```

- [ ] **Step 3: Commit**

```bash
git add packages/modules/product/src/models/product.ts
git commit -m "feat(product): add china e-commerce fields (spu_code, brand_id, unit, product_type, etc.)"
```

---

### Task 12: Extend ProductVariant model with china e-commerce fields

**Files:**
- Modify: `packages/modules/product/src/models/product-variant.ts`

- [ ] **Step 1: Add new fields to ProductVariant model**

```typescript
// Add to ProductVariant model definition
sku_code: model.text().nullable(),
unit: model.text().nullable(),
cost_price: model.float().nullable(),
market_price: model.float().nullable(),
alert_stock: model.number().nullable(),
purchase_limit: model.number().nullable(),
spec_info: model.text().nullable(),
```

- [ ] **Step 2: Add index for sku_code**

```typescript
// Add to indexes array
{
  name: "IDX_product_variant_sku_code_unique",
  on: ["sku_code"],
  unique: true,
  where: "deleted_at IS NULL",
},
```

- [ ] **Step 3: Commit**

```bash
git add packages/modules/product/src/models/product-variant.ts
git commit -m "feat(product): add china e-commerce fields to variant (sku_code, cost_price, market_price, etc.)"
```

---

### Task 13: Extend InventoryItem model with china e-commerce fields

**Files:**
- Modify: `packages/modules/inventory/src/models/inventory-item.ts`

- [ ] **Step 1: Add new fields to InventoryItem model**

```typescript
// Add to InventoryItem model definition
alert_stock: model.number().nullable(),
stock_controlled: model.boolean().default(true),
```

- [ ] **Step 2: Commit**

```bash
git add packages/modules/inventory/src/models/inventory-item.ts
git commit -m "feat(inventory): add china e-commerce fields (alert_stock, stock_controlled)"
```

---

### Task 14: Add Brand API routes

**Files:**
- Create: `packages/medusa/src/api/admin/brands/route.ts`
- Create: `packages/medusa/src/api/admin/brands/[id]/route.ts`
- Create: `packages/medusa/src/api/admin/brands/validators.ts`
- Create: `packages/medusa/src/api/admin/brands/query-config.ts`

- [ ] **Step 1: Create validators**

```typescript
// packages/medusa/src/api/admin/brands/validators.ts
import { z } from "zod"

export const AdminCreateBrand = z.object({
  name: z.string(),
  slug: z.string(),
  logo_url: z.string().optional(),
  description: z.string().optional(),
  org_id: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export const AdminUpdateBrand = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  logo_url: z.string().optional(),
  description: z.string().optional(),
  org_id: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export const AdminBrandParams = z.object({
  id: z.string(),
})
```

- [ ] **Step 2: Create query config**

```typescript
// packages/medusa/src/api/admin/brands/query-config.ts
export const defaultAdminBrandFields = [
  "id",
  "name",
  "slug",
  "logo_url",
  "description",
  "org_id",
  "metadata",
  "created_at",
  "updated_at",
]

export const defaultAdminBrandRelations = []

export const allowedAdminBrandRelations = []

export const allowedAdminBrandFields = defaultAdminBrandFields
```

- [ ] **Step 3: Create list/create route**

```typescript
// packages/medusa/src/api/admin/brands/route.ts
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { AdminCreateBrand } from "./validators"
import { defaultAdminBrandFields } from "./query-config"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const brandModule = req.scope.resolve(Modules.BRAND)
  const [brands, count] = await brandModule.listAndCount(
    req.filterableFields,
    req.queryConfig
  )

  res.json({
    brands,
    count,
    offset: req.queryConfig.pagination?.offset || 0,
    limit: req.queryConfig.pagination?.limit || 20,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const brandModule = req.scope.resolve(Modules.BRAND)
  const brand = await brandModule.createBrands(req.validatedBody)

  res.status(200).json({ brand })
}
```

- [ ] **Step 4: Create get/update/delete route**

```typescript
// packages/medusa/src/api/admin/brands/[id]/route.ts
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { AdminUpdateBrand } from "../validators"
import { defaultAdminBrandFields } from "../query-config"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const brandModule = req.scope.resolve(Modules.BRAND)
  const brand = await brandModule.retrieveBrand(req.params.id, req.queryConfig)

  res.json({ brand })
}

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const brandModule = req.scope.resolve(Modules.BRAND)
  const brand = await brandModule.updateBrands(req.params.id, req.validatedBody)

  res.json({ brand })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const brandModule = req.scope.resolve(Modules.BRAND)
  await brandModule.deleteBrands(req.params.id)

  res.status(200).json({
    id: req.params.id,
    object: "brand",
    deleted: true,
  })
}
```

- [ ] **Step 5: Add middleware**

```typescript
// packages/medusa/src/api/admin/brands/middlewares.ts
import { MiddlewareRoute } from "@medusajs/framework/http"
import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { AdminCreateBrand, AdminUpdateBrand } from "./validators"
import { defaultAdminBrandFields } from "./query-config"

export const adminBrandRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/brands",
    middlewares: [
      validateAndTransformQuery(
        { fields: defaultAdminBrandFields },
        { isList: true }
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/brands",
    middlewares: [validateAndTransformBody(AdminCreateBrand)],
  },
  {
    method: ["GET"],
    matcher: "/admin/brands/:id",
    middlewares: [
      validateAndTransformQuery(
        { fields: defaultAdminBrandFields },
        { isList: false }
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/brands/:id",
    middlewares: [validateAndTransformBody(AdminUpdateBrand)],
  },
]
```

- [ ] **Step 6: Commit**

```bash
git add packages/medusa/src/api/admin/brands/
git commit -m "feat(api): add admin brand CRUD routes with validators and middleware"
```

---

### Task 15: Add Shop API routes

**Files:**
- Create: `packages/medusa/src/api/admin/shops/route.ts`
- Create: `packages/medusa/src/api/admin/shops/[id]/route.ts`
- Create: `packages/medusa/src/api/admin/shops/validators.ts`
- Create: `packages/medusa/src/api/admin/shops/query-config.ts`
- Create: `packages/medusa/src/api/admin/shops/middlewares.ts`

- [ ] **Step 1: Create validators**

```typescript
// packages/medusa/src/api/admin/shops/validators.ts
import { z } from "zod"

const PlatformType = z.enum([
  "taobao",
  "douyin",
  "jd",
  "pdd",
  "wechat",
  "xiaohongshu",
  "other",
])

export const AdminCreateShop = z.object({
  shop_code: z.string(),
  shop_name: z.string(),
  platform_type: PlatformType,
  platform_shop_id: z.string().optional(),
  org_id: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  metadata: z.record(z.unknown()).optional(),
})

export const AdminUpdateShop = z.object({
  shop_code: z.string().optional(),
  shop_name: z.string().optional(),
  platform_type: PlatformType.optional(),
  platform_shop_id: z.string().optional(),
  org_id: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  metadata: z.record(z.unknown()).optional(),
})
```

- [ ] **Step 2: Create query config**

```typescript
// packages/medusa/src/api/admin/shops/query-config.ts
export const defaultAdminShopFields = [
  "id",
  "shop_code",
  "shop_name",
  "platform_type",
  "platform_shop_id",
  "org_id",
  "status",
  "metadata",
  "created_at",
  "updated_at",
]

export const defaultAdminShopRelations = []
export const allowedAdminShopRelations = []
export const allowedAdminShopFields = defaultAdminShopFields
```

- [ ] **Step 3: Create list/create route**

```typescript
// packages/medusa/src/api/admin/shops/route.ts
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const shopModule = req.scope.resolve(Modules.SHOP)
  const [shops, count] = await shopModule.listAndCount(
    req.filterableFields,
    req.queryConfig
  )

  res.json({
    shops,
    count,
    offset: req.queryConfig.pagination?.offset || 0,
    limit: req.queryConfig.pagination?.limit || 20,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const shopModule = req.scope.resolve(Modules.SHOP)
  const shop = await shopModule.createShops(req.validatedBody)

  res.status(200).json({ shop })
}
```

- [ ] **Step 4: Create get/update/delete route**

```typescript
// packages/medusa/src/api/admin/shops/[id]/route.ts
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const shopModule = req.scope.resolve(Modules.SHOP)
  const shop = await shopModule.retrieveShop(req.params.id, req.queryConfig)

  res.json({ shop })
}

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const shopModule = req.scope.resolve(Modules.SHOP)
  const shop = await shopModule.updateShops(req.params.id, req.validatedBody)

  res.json({ shop })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const shopModule = req.scope.resolve(Modules.SHOP)
  await shopModule.deleteShops(req.params.id)

  res.status(200).json({
    id: req.params.id,
    object: "shop",
    deleted: true,
  })
}
```

- [ ] **Step 5: Add middleware**

```typescript
// packages/medusa/src/api/admin/shops/middlewares.ts
import { MiddlewareRoute } from "@medusajs/framework/http"
import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { AdminCreateShop, AdminUpdateShop } from "./validators"
import { defaultAdminShopFields } from "./query-config"

export const adminShopRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/shops",
    middlewares: [
      validateAndTransformQuery(
        { fields: defaultAdminShopFields },
        { isList: true }
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/shops",
    middlewares: [validateAndTransformBody(AdminCreateShop)],
  },
  {
    method: ["GET"],
    matcher: "/admin/shops/:id",
    middlewares: [
      validateAndTransformQuery(
        { fields: defaultAdminShopFields },
        { isList: false }
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/shops/:id",
    middlewares: [validateAndTransformBody(AdminUpdateShop)],
  },
]
```

- [ ] **Step 6: Commit**

```bash
git add packages/medusa/src/api/admin/shops/
git commit -m "feat(api): add admin shop CRUD routes with validators and middleware"
```

---

### Task 16: Add PlatformSku API routes

**Files:**
- Create: `packages/medusa/src/api/admin/platform-skus/route.ts`
- Create: `packages/medusa/src/api/admin/platform-skus/[id]/route.ts`
- Create: `packages/medusa/src/api/admin/platform-skus/validators.ts`
- Create: `packages/medusa/src/api/admin/platform-skus/query-config.ts`
- Create: `packages/medusa/src/api/admin/platform-skus/middlewares.ts`

- [ ] **Step 1: Create validators**

```typescript
// packages/medusa/src/api/admin/platform-skus/validators.ts
import { z } from "zod"

const PlatformType = z.enum([
  "taobao",
  "douyin",
  "jd",
  "pdd",
  "wechat",
  "xiaohongshu",
  "other",
])

export const AdminCreatePlatformSku = z.object({
  shop_id: z.string(),
  platform_type: PlatformType,
  platform_product_id: z.string(),
  platform_sku_id: z.string(),
  platform_sku_code: z.string().optional(),
  sales_material_id: z.string().optional(),
  variant_id: z.string().optional(),
  platform_title: z.string().optional(),
  platform_price: z.number().optional(),
  platform_properties: z.record(z.unknown()).optional(),
  sync_status: z.enum(["pending", "success", "failed"]).optional(),
  mapping_status: z.enum(["unmapped", "mapped"]).optional(),
  listing_status: z.enum(["listed", "delisted"]).optional(),
  metadata: z.record(z.unknown()).optional(),
})

export const AdminUpdatePlatformSku = AdminCreatePlatformSku.partial()
```

- [ ] **Step 2: Create query config**

```typescript
// packages/medusa/src/api/admin/platform-skus/query-config.ts
export const defaultAdminPlatformSkuFields = [
  "id",
  "shop_id",
  "platform_type",
  "platform_product_id",
  "platform_sku_id",
  "platform_sku_code",
  "sales_material_id",
  "variant_id",
  "platform_title",
  "platform_price",
  "platform_properties",
  "sync_status",
  "mapping_status",
  "listing_status",
  "last_sync_at",
  "metadata",
  "created_at",
  "updated_at",
]

export const defaultAdminPlatformSkuRelations = []
export const allowedAdminPlatformSkuRelations = []
export const allowedAdminPlatformSkuFields = defaultAdminPlatformSkuFields
```

- [ ] **Step 3: Create list/create route**

```typescript
// packages/medusa/src/api/admin/platform-skus/route.ts
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const platformMappingModule = req.scope.resolve(Modules.PLATFORM_MAPPING)
  const [platformSkus, count] =
    await platformMappingModule.listAndCountPlatformSkus(
      req.filterableFields,
      req.queryConfig
    )

  res.json({
    platform_skus: platformSkus,
    count,
    offset: req.queryConfig.pagination?.offset || 0,
    limit: req.queryConfig.pagination?.limit || 20,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const platformMappingModule = req.scope.resolve(Modules.PLATFORM_MAPPING)
  const platformSku =
    await platformMappingModule.createPlatformSkus(req.validatedBody)

  res.status(200).json({ platform_sku: platformSku })
}
```

- [ ] **Step 4: Create get/update/delete route**

```typescript
// packages/medusa/src/api/admin/platform-skus/[id]/route.ts
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const platformMappingModule = req.scope.resolve(Modules.PLATFORM_MAPPING)
  const platformSku =
    await platformMappingModule.retrievePlatformSku(
      req.params.id,
      req.queryConfig
    )

  res.json({ platform_sku: platformSku })
}

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const platformMappingModule = req.scope.resolve(Modules.PLATFORM_MAPPING)
  const platformSku =
    await platformMappingModule.updatePlatformSkus(
      req.params.id,
      req.validatedBody
    )

  res.json({ platform_sku: platformSku })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const platformMappingModule = req.scope.resolve(Modules.PLATFORM_MAPPING)
  await platformMappingModule.deletePlatformSkus(req.params.id)

  res.status(200).json({
    id: req.params.id,
    object: "platform_sku",
    deleted: true,
  })
}
```

- [ ] **Step 5: Add middleware**

```typescript
// packages/medusa/src/api/admin/platform-skus/middlewares.ts
import { MiddlewareRoute } from "@medusajs/framework/http"
import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { AdminCreatePlatformSku, AdminUpdatePlatformSku } from "./validators"
import { defaultAdminPlatformSkuFields } from "./query-config"

export const adminPlatformSkuRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/platform-skus",
    middlewares: [
      validateAndTransformQuery(
        { fields: defaultAdminPlatformSkuFields },
        { isList: true }
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/platform-skus",
    middlewares: [validateAndTransformBody(AdminCreatePlatformSku)],
  },
  {
    method: ["GET"],
    matcher: "/admin/platform-skus/:id",
    middlewares: [
      validateAndTransformQuery(
        { fields: defaultAdminPlatformSkuFields },
        { isList: false }
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/platform-skus/:id",
    middlewares: [validateAndTransformBody(AdminUpdatePlatformSku)],
  },
]
```

- [ ] **Step 6: Commit**

```bash
git add packages/medusa/src/api/admin/platform-skus/
git commit -m "feat(api): add admin platform SKU CRUD routes with validators and middleware"
```

---

### Task 17: Add Brand workflow

**Files:**
- Create: `packages/core/core-flows/src/brand/steps/create-brand.ts`
- Create: `packages/core/core-flows/src/brand/steps/update-brand.ts`
- Create: `packages/core/core-flows/src/brand/steps/delete-brand.ts`
- Create: `packages/core/core-flows/src/brand/workflows/create-brand.ts`
- Create: `packages/core/core-flows/src/brand/workflows/update-brand.ts`
- Create: `packages/core/core-flows/src/brand/workflows/delete-brand.ts`
- Create: `packages/core/core-flows/src/brand/index.ts`

- [ ] **Step 1: Create create-brand step**

```typescript
// packages/core/core-flows/src/brand/steps/create-brand.ts
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const createBrandStep = createStep(
  "create-brand",
  async (input: { name: string; slug: string; [key: string]: unknown }, { container }) => {
    const brandModule = container.resolve(Modules.BRAND)
    const brand = await brandModule.createBrands(input)
    return new StepResponse(brand, brand.id)
  },
  async (brandId, { container }) => {
    if (!brandId) return
    const brandModule = container.resolve(Modules.BRAND)
    await brandModule.deleteBrands(brandId)
  }
)
```

- [ ] **Step 2: Create update-brand step**

```typescript
// packages/core/core-flows/src/brand/steps/update-brand.ts
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const updateBrandStep = createStep(
  "update-brand",
  async (input: { id: string; [key: string]: unknown }, { container }) => {
    const brandModule = container.resolve(Modules.BRAND)
    const brand = await brandModule.updateBrands(input.id, input)
    return new StepResponse(brand, brand)
  },
  async (originalBrand, { container }) => {
    if (!originalBrand) return
    const brandModule = container.resolve(Modules.BRAND)
    await brandModule.updateBrands(originalBrand.id, originalBrand)
  }
)
```

- [ ] **Step 3: Create delete-brand step**

```typescript
// packages/core/core-flows/src/brand/steps/delete-brand.ts
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const deleteBrandStep = createStep(
  "delete-brand",
  async (input: { id: string }, { container }) => {
    const brandModule = container.resolve(Modules.BRAND)
    const brand = await brandModule.retrieveBrand(input.id)
    await brandModule.deleteBrands(input.id)
    return new StepResponse(void 0, brand)
  },
  async (brand, { container }) => {
    if (!brand) return
    const brandModule = container.resolve(Modules.BRAND)
    await brandModule.createBrands(brand)
  }
)
```

- [ ] **Step 4: Create create-brand workflow**

```typescript
// packages/core/core-flows/src/brand/workflows/create-brand.ts
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createBrandStep } from "../steps/create-brand"

export const createBrandWorkflow = createWorkflow(
  "create-brand",
  (input: WorkflowData<{ name: string; slug: string; [key: string]: unknown }>) => {
    const brand = createBrandStep(input)
    return new WorkflowResponse(brand)
  }
)
```

- [ ] **Step 5: Create update-brand workflow**

```typescript
// packages/core/core-flows/src/brand/workflows/update-brand.ts
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateBrandStep } from "../steps/update-brand"

export const updateBrandWorkflow = createWorkflow(
  "update-brand",
  (input: WorkflowData<{ id: string; [key: string]: unknown }>) => {
    const brand = updateBrandStep(input)
    return new WorkflowResponse(brand)
  }
)
```

- [ ] **Step 6: Create delete-brand workflow**

```typescript
// packages/core/core-flows/src/brand/workflows/delete-brand.ts
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deleteBrandStep } from "../steps/delete-brand"

export const deleteBrandWorkflow = createWorkflow(
  "delete-brand",
  (input: WorkflowData<{ id: string }>) => {
    deleteBrandStep(input)
    return new WorkflowResponse(void 0)
  }
)
```

- [ ] **Step 7: Create brand index**

```typescript
// packages/core/core-flows/src/brand/index.ts
export * from "./steps/create-brand"
export * from "./steps/update-brand"
export * from "./steps/delete-brand"
export * from "./workflows/create-brand"
export * from "./workflows/update-brand"
export * from "./workflows/delete-brand"
```

- [ ] **Step 8: Commit**

```bash
git add packages/core/core-flows/src/brand/
git commit -m "feat(core-flows): add brand workflows with steps and compensation"
```

---

### Task 18: Add Link module definitions

**Files:**
- Create: `packages/modules/link-modules/src/definitions/brand-product.ts`
- Create: `packages/modules/link-modules/src/definitions/organization-brand.ts`
- Create: `packages/modules/link-modules/src/definitions/organization-shop.ts`
- Create: `packages/modules/link-modules/src/definitions/sales-material-shop.ts`
- Create: `packages/modules/link-modules/src/definitions/platform-sku-shop.ts`
- Create: `packages/modules/link-modules/src/definitions/platform-sku-variant.ts`
- Modify: `packages/modules/link-modules/src/definitions/index.ts`

- [ ] **Step 1: Create brand-product link**

```typescript
// packages/modules/link-modules/src/definitions/brand-product.ts
import { defineLink, Modules } from "@medusajs/framework/utils"

export default defineLink(
  {
    linkable: {
      serviceName: Modules.BRAND,
      aliases: [{ name: "brand" }],
    },
    field: "brand_id",
  },
  {
    linkable: {
      serviceName: Modules.PRODUCT,
      aliases: [{ name: "product" }],
    },
    field: "brand_id",
  }
)
```

- [ ] **Step 2: Create organization-brand link**

```typescript
// packages/modules/link-modules/src/definitions/organization-brand.ts
import { defineLink, Modules } from "@medusajs/framework/utils"

export default defineLink(
  {
    linkable: {
      serviceName: Modules.ORGANIZATION,
      aliases: [{ name: "organization" }],
    },
    field: "org_id",
  },
  {
    linkable: {
      serviceName: Modules.BRAND,
      aliases: [{ name: "brand" }],
    },
    field: "org_id",
  }
)
```

- [ ] **Step 3: Create organization-shop link**

```typescript
// packages/modules/link-modules/src/definitions/organization-shop.ts
import { defineLink, Modules } from "@medusajs/framework/utils"

export default defineLink(
  {
    linkable: {
      serviceName: Modules.ORGANIZATION,
      aliases: [{ name: "organization" }],
    },
    field: "org_id",
  },
  {
    linkable: {
      serviceName: Modules.SHOP,
      aliases: [{ name: "shop" }],
    },
    field: "org_id",
  }
)
```

- [ ] **Step 4: Create sales-material-shop link**

```typescript
// packages/modules/link-modules/src/definitions/sales-material-shop.ts
import { defineLink, Modules } from "@medusajs/framework/utils"

export default defineLink(
  {
    linkable: {
      serviceName: Modules.MATERIAL,
      aliases: [{ name: "sales_material" }],
    },
    field: "shop_id",
  },
  {
    linkable: {
      serviceName: Modules.SHOP,
      aliases: [{ name: "shop" }],
    },
    field: "id",
  }
)
```

- [ ] **Step 5: Create platform-sku-shop link**

```typescript
// packages/modules/link-modules/src/definitions/platform-sku-shop.ts
import { defineLink, Modules } from "@medusajs/framework/utils"

export default defineLink(
  {
    linkable: {
      serviceName: Modules.PLATFORM_MAPPING,
      aliases: [{ name: "platform_sku" }],
    },
    field: "shop_id",
  },
  {
    linkable: {
      serviceName: Modules.SHOP,
      aliases: [{ name: "shop" }],
    },
    field: "id",
  }
)
```

- [ ] **Step 6: Create platform-sku-variant link**

```typescript
// packages/modules/link-modules/src/definitions/platform-sku-variant.ts
import { defineLink, Modules } from "@medusajs/framework/utils"

export default defineLink(
  {
    linkable: {
      serviceName: Modules.PLATFORM_MAPPING,
      aliases: [{ name: "platform_sku" }],
    },
    field: "variant_id",
  },
  {
    linkable: {
      serviceName: Modules.PRODUCT,
      aliases: [{ name: "product_variant" }],
    },
    field: "variant_id",
  }
)
```

- [ ] **Step 7: Update link definitions index**

Add imports to `packages/modules/link-modules/src/definitions/index.ts`:

```typescript
export { default as brandProduct } from "./brand-product"
export { default as organizationBrand } from "./organization-brand"
export { default as organizationShop } from "./organization-shop"
export { default as salesMaterialShop } from "./sales-material-shop"
export { default as platformSkuShop } from "./platform-sku-shop"
export { default as platformSkuVariant } from "./platform-sku-variant"
```

- [ ] **Step 8: Commit**

```bash
git add packages/modules/link-modules/src/definitions/
git commit -m "feat(link-modules): add link definitions for china e-commerce modules"
```

---

### Task 19: Create seed script for testing

**Files:**
- Create: `playground/scripts/seed-china.ts`

- [ ] **Step 1: Create seed script**

```typescript
// playground/scripts/seed-china.ts
import { createMedusaApp } from "@medusajs/framework"

async function seedChina() {
  const app = await createMedusaApp()

  // Seed Organization
  const orgModule = app.container.resolve("organizationModuleService")
  const org = await orgModule.createOrganizations({
    name: "Main Operations",
    code: "OPS001",
    org_type: "operation",
  })
  console.log("Created organization:", org.id)

  // Seed Brand
  const brandModule = app.container.resolve("brandModuleService")
  const brand = await brandModule.createBrands({
    name: "Test Brand",
    slug: "test-brand",
    org_id: org.id,
  })
  console.log("Created brand:", brand.id)

  // Seed Shop
  const shopModule = app.container.resolve("shopModuleService")
  const shop = await shopModule.createShops({
    shop_code: "TAOBAO_001",
    shop_name: "Test Taobao Shop",
    platform_type: "taobao",
    org_id: org.id,
  })
  console.log("Created shop:", shop.id)

  console.log("China e-commerce seed complete!")
  process.exit(0)
}

seedChina().catch(console.error)
```

- [ ] **Step 2: Commit**

```bash
git add playground/scripts/seed-china.ts
git commit -m "chore(playground): add seed script for china e-commerce testing"
```

---

## Phase 2-4: Future Tasks (Out of Scope for This Plan)

The following phases will be planned in detail after Phase 0 and Phase 1 are complete:

**Phase 2 (P1 - Core):**
- Material API routes
- StoreInventory API routes
- Material + StoreInventory workflows
- StoreInventory link definitions

**Phase 3 (P2 - Advanced):**
- Organization API routes
- ComboItem workflows
- ChannelPrice API routes + workflows
- ChannelPrice link definitions

**Phase 4 (P3 - Polish):**
- PlatformSyncTask workflows
- SN management
- Purchase limit validation

---

## Self-Review Checklist

1. **Spec coverage:** All Phase 0 and Phase 1 requirements from the spec are covered by tasks.
2. **Placeholder scan:** No TBD, TODO, or "implement later" found. All code blocks are complete.
3. **Type consistency:** Module names, service names, and field names are consistent across all tasks.
