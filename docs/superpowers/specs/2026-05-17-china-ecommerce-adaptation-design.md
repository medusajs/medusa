# Medusa 中国电商化适配设计文档

> 日期：2026-05-17
> 分支：china（从 playground 分叉）
> 状态：设计完成，待实施

---

## 一、概述

### 1.1 目标

将 Medusa 从 DTC 单一品牌官网定位升级为中国多平台电商运营中台，支持：
- 多平台店铺管理（淘宝、抖音、京东、拼多多、微信、小红书等）
- 物料分层体系（基础物料 + 销售物料）
- 平台 SKU 通用映射
- 组合/复杂商品形态
- 渠道差异化定价
- 门店/O2O 库存管理
- 税务与发票对接
- 多组织架构

### 1.2 设计原则

1. **纯模块化架构** - 新功能作为独立模块，遵循 Medusa 现有模式
2. **通用平台映射** - 不硬编码平台专属字段，通过枚举扩展
3. **保留 Medusa 核心** - Pricing、Inventory 模块保持独立
4. **渐进式实施** - 分 4 个阶段，从 MVP 到完整系统
5. **向后兼容** - 扩展现有模块时添加新字段，不破坏现有功能

---

## 二、架构设计

### 2.1 模块结构

```
packages/modules/
├── brand/              # NEW - 品牌管理
├── organization/       # NEW - 组织架构（品牌事业部、运营组织）
├── material/           # NEW - 物料体系（基础物料、销售物料、组合明细）
├── shop/               # NEW - 多平台店铺管理
├── platform-mapping/   # NEW - 平台 SKU 映射、同步任务
├── channel-price/      # NEW - 渠道价格
├── store-inventory/    # NEW - 门店/O2O 库存
├── product/            # EXTEND - 添加 spu_code、unit、product_type 等
├── inventory/          # EXTEND - 添加 alert_stock、stock_controlled
└── link-modules/       # EXTEND - 新增链接定义
```

### 2.2 模块依赖关系

```
Brand ←──┐
         │
Organization ←── Shop ←── PlatformMapping
         │                    │
         ↓                    ↓
Material (Basic + Sales) ←── ChannelPrice
         │
         ├──→ Product (via Link)
         ├──→ Variant (via Link)
         └──→ StoreInventory
```

### 2.3 关键设计决策

| 决策 | 说明 |
|------|------|
| 保留 Medusa Pricing 模块 | 销售价、促销价仍走 PriceSet / Price / PriceList |
| Variant 层增加 cost_price + market_price | 成本价和划线价是后台管理高频字段，内聚便于查询 |
| 库存走 Inventory 模块 | 保持 Medusa 库存解耦设计，通过 Link 关联 |
| 平台映射走通用表 | 新增平台只需扩展枚举值，无需改表结构 |
| 基础物料与 Product 通过 Link 关联 | 不破坏 Medusa Product 表结构 |
| 规格仍走 ProductOption / ProductOptionValue | 不引入 serialize 存储方式，保持关系型设计 |

---

## 三、数据模型

### 3.1 新模块：Brand（品牌）

**表名：** `brand`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string (prefix: "brand") | 主键 |
| name | string (required) | 品牌名称 |
| slug | string (unique) | URL 友好标识 |
| logo_url | string (nullable) | 品牌 Logo URL |
| description | string (nullable) | 品牌描述 |
| org_id | string (FK → Organization) | 归属组织 |
| metadata | json (nullable) | 扩展字段 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |
| deleted_at | datetime (nullable) | 软删除时间 |

### 3.2 新模块：Organization（组织）

**表名：** `organization`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string (prefix: "org") | 主键 |
| name | string (required) | 组织名称 |
| code | string (unique) | 组织编码 |
| parent_id | string (self FK, nullable) | 上级组织（支持层级） |
| org_type | enum ['brand_bu', 'operation', 'department'] | 组织类型 |
| status | enum ['active', 'inactive'] | 状态 |
| metadata | json (nullable) | 扩展字段 |
| created_at / updated_at / deleted_at | timestamps | 时间戳 |

### 3.3 新模块：Material（物料）

#### BasicMaterial（基础物料）

**表名：** `basic_material`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string (prefix: "bm") | 主键 |
| material_code | string (unique) | 基础物料编码 |
| material_name | string | 基础物料名称 |
| spu_code | string (indexed) | 款号（关联 Product） |
| material_type | enum ['finished', 'semi', 'normal', 'box', 'virtual'] | 物料类型 |
| category_id | string (nullable) | 物料分类 |
| sn_managed | boolean (default: false) | SN 码管理 |
| stock_controlled | boolean (default: true) | 库存管控 |
| tax_rate | decimal (nullable) | 开票税率 |
| tax_name | string (nullable) | 开票名称 |
| tax_code | string (nullable) | 税收分类编码 |
| omnichannel | boolean (default: false) | 全渠道商品 |
| o2o_enabled | boolean (default: false) | 支持门店销售 |
| color | string (nullable) | 颜色 |
| size | string (nullable) | 尺码 |
| source | enum ['local', 'api'] | 数据来源 |
| org_id | string (FK → Organization) | 归属组织 |
| metadata | json (nullable) | 扩展字段 |
| timestamps + soft_delete | | |

#### SalesMaterial（销售物料）

**表名：** `sales_material`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string (prefix: "sm") | 主键 |
| shop_id | string (FK → Shop) | 所属店铺 |
| sales_code | string | 销售物料编码 |
| sales_name | string | 销售物料名称 |
| sales_type | enum ['normal', 'combo', 'gift', 'choice', 'box', 'lucky_bag'] | 销售类型 |
| material_id | string (FK → BasicMaterial, nullable) | 关联基础物料 |
| is_bound | boolean (default: false) | 是否绑定基础物料 |
| customer_class_id | string (nullable) | 客户分类 |
| org_id | string (FK → Organization) | 运营组织 |
| tax_rate / tax_name / tax_code | | 渠道维度税务（可覆盖） |
| source | enum ['local', 'api'] | 数据来源 |
| status | enum ['active', 'inactive'] | 状态 |
| metadata | json (nullable) | 扩展字段 |
| timestamps + soft_delete | | |

#### ComboItem（组合物料明细）

**表名：** `combo_item`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string (prefix: "combo") | 主键 |
| parent_material_id | string (FK → BasicMaterial) | 父物料 |
| child_material_id | string (FK → BasicMaterial) | 子物料 |
| quantity | number | 数量 |
| is_optional | boolean (default: false) | 是否可选 |
| sort_order | number (default: 0) | 排序 |
| timestamps | | |

### 3.4 新模块：Shop（店铺）

**表名：** `shop`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string (prefix: "shop") | 主键 |
| shop_code | string (unique) | 店铺编码 |
| shop_name | string | 店铺名称 |
| platform_type | enum ['taobao', 'douyin', 'jd', 'pdd', 'wechat', 'xiaohongshu', 'other'] | 平台类型 |
| platform_shop_id | string (nullable) | 平台侧店铺 ID |
| org_id | string (FK → Organization) | 归属组织 |
| status | enum ['active', 'inactive'] | 状态 |
| metadata | json (nullable) | 扩展字段 |
| timestamps + soft_delete | | |

### 3.5 新模块：PlatformMapping（平台映射）

#### PlatformSku（平台 SKU 映射）

**表名：** `platform_sku`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string (prefix: "psku") | 主键 |
| shop_id | string (FK → Shop) | 关联店铺 |
| platform_type | enum (同 Shop) | 平台类型 |
| platform_product_id | string | 平台商品 ID |
| platform_sku_id | string | 平台 SKU ID |
| platform_sku_code | string (nullable) | 平台货号 |
| sales_material_id | string (FK → SalesMaterial, nullable) | 关联销售物料 |
| variant_id | string (FK → ProductVariant, nullable) | 关联 Variant |
| platform_title | string (nullable) | 平台标题 |
| platform_price | decimal (nullable) | 平台售价 |
| platform_properties | json (nullable) | 平台规格属性 |
| sync_status | enum ['pending', 'success', 'failed'] | 同步状态 |
| mapping_status | enum ['unmapped', 'mapped'] | 映射状态 |
| listing_status | enum ['listed', 'delisted'] | 上架状态 |
| last_sync_at | datetime (nullable) | 最后同步时间 |
| metadata | json (nullable) | 扩展字段 |
| timestamps | | |

#### PlatformSyncTask（平台同步任务）

**表名：** `platform_sync_task`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string (prefix: "psync") | 主键 |
| shop_id | string (FK → Shop) | 目标店铺 |
| platform_type | enum (同 Shop) | 平台类型 |
| action | enum ['create', 'update', 'delist', 'delete'] | 同步动作 |
| payload | json | 同步数据快照 |
| status | enum ['pending', 'processing', 'success', 'failed'] | 任务状态 |
| error_msg | text (nullable) | 失败原因 |
| retry_count | number (default: 0) | 重试次数 |
| timestamps | | |

### 3.6 新模块：ChannelPrice（渠道价格）

**表名：** `channel_price`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string (prefix: "chprice") | 主键 |
| sales_material_id | string (FK → SalesMaterial) | 销售物料 |
| shop_id | string (FK → Shop, nullable) | 店铺（空=默认价） |
| customer_class_id | string (nullable) | 客户分类 |
| price_type | enum ['retail', 'wholesale', 'supply'] | 价格类型 |
| currency_code | string (default: 'CNY') | 币种 |
| amount | decimal | 金额 |
| start_at / end_at | datetime (nullable) | 生效时间 |
| min_quantity / max_quantity | number (nullable) | 起批量 |
| metadata | json (nullable) | 扩展字段 |
| timestamps | | |

### 3.7 新模块：StoreInventory（门店库存）

**表名：** `store_inventory`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string (prefix: "sinv") | 主键 |
| location_id | string (FK → StockLocation) | 门店/仓库位置 |
| material_id | string (FK → BasicMaterial) | 基础物料 |
| online_stock | number (default: 0) | 线上可售库存 |
| online_reserved | number (default: 0) | 线上冻结库存 |
| share_stock | number (default: 0) | 共享库存 |
| share_reserved | number (default: 0) | 共享冻结库存 |
| in_transit_stock | number (default: 0) | 在途库存 |
| store_mode | enum ['normal', 'discount'] | 门店模式 |
| metadata | json (nullable) | 扩展字段 |
| timestamps | | |

### 3.8 现有模块扩展

#### Product 新增字段

| 字段 | 类型 | 说明 |
|------|------|------|
| spu_code | string (nullable, indexed) | SPU 编码 |
| brand_id | string (FK → Brand, nullable) | 品牌 |
| brief | text (nullable) | 商品简介 |
| unit | string (nullable) | 计量单位 |
| product_type | enum ['normal', 'bind', 'combo', 'gift'] (default: 'normal') | 商品类型 |
| sn_managed | boolean (default: false) | SN 码管理 |
| published_at | datetime (nullable) | 上架时间 |
| unpublished_at | datetime (nullable) | 下架时间 |
| sort_order | number (default: 0) | 排序权重 |
| visibility | enum ['visible', 'hidden'] (default: 'visible') | 可见性 |

#### ProductVariant 新增字段

| 字段 | 类型 | 说明 |
|------|------|------|
| sku_code | string (nullable, indexed) | SKU 编码 |
| unit | string (nullable) | 计量单位 |
| cost_price | decimal (nullable) | 成本价 |
| market_price | decimal (nullable) | 市场价/划线价 |
| alert_stock | number (nullable) | 安全库存阈值 |
| purchase_limit | number (nullable) | 限购数量 |
| spec_info | string (nullable) | 规格信息文本 |

#### InventoryItem 新增字段

| 字段 | 类型 | 说明 |
|------|------|------|
| alert_stock | number (nullable) | 安全库存阈值 |
| stock_controlled | boolean (default: true) | 库存管控 |

---

## 四、Link 模块定义

在 `packages/modules/link-modules/src/definitions/` 中新增：

| 文件名 | 关系 |
|--------|------|
| brand-product.ts | Brand ←→ Product |
| organization-brand.ts | Organization ←→ Brand |
| organization-shop.ts | Organization ←→ Shop |
| basic-material-product.ts | BasicMaterial ←→ Product (via spu_code) |
| sales-material-basic-material.ts | SalesMaterial ←→ BasicMaterial |
| sales-material-shop.ts | SalesMaterial ←→ Shop |
| platform-sku-shop.ts | PlatformSku ←→ Shop |
| platform-sku-sales-material.ts | PlatformSku ←→ SalesMaterial |
| platform-sku-variant.ts | PlatformSku ←→ ProductVariant |
| channel-price-sales-material.ts | ChannelPrice ←→ SalesMaterial |
| store-inventory-basic-material.ts | StoreInventory ←→ BasicMaterial |
| store-inventory-location.ts | StoreInventory ←→ StockLocation |

---

## 五、API 路由设计

### 5.1 新增路由

| 模块 | 路由前缀 | 方法 |
|------|----------|------|
| Brand | /admin/brands | CRUD |
| Organization | /admin/organizations | CRUD |
| BasicMaterial | /admin/basic-materials | CRUD |
| SalesMaterial | /admin/sales-materials | CRUD |
| Shop | /admin/shops | CRUD |
| PlatformSku | /admin/platform-skus | CRUD + /sync |
| ChannelPrice | /admin/channel-prices | CRUD |
| StoreInventory | /admin/store-inventories | CRUD |

### 5.2 扩展现有路由

**Product API:**
- `POST /admin/products` - 接受新字段
- `PATCH /admin/products/:id` - 接受新字段

**Variant API:**
- `POST /admin/products/:id/variants` - 接受新字段
- `PATCH /admin/products/:id/variants/:variant_id` - 接受新字段

---

## 六、工作流设计

### 6.1 新模块工作流

每个新模块包含：
- `create-{entity}-workflow` - 创建 + 事件
- `update-{entity}-workflow` - 更新 + 事件
- `delete-{entity}-workflow` - 删除（带补偿）+ 事件

### 6.2 特殊工作流

- `create-basic-material-workflow` - 创建基础物料 + 链接 Product
- `create-sales-material-workflow` - 创建销售物料 + 链接 BasicMaterial + Shop
- `create-platform-sku-workflow` - 创建映射 + 链接 Shop + SalesMaterial/Variant
- `sync-platform-sku-workflow` - 同步任务 + 状态更新

---

## 七、测试策略

### 7.1 单元测试

每个模块的 `__tests__/` 目录：
- Service 方法测试（mock repository）
- 验证逻辑测试
- 工具函数测试

### 7.2 集成测试

`packages/*/integration-tests/__tests__/`：
- Module Service 集成测试
- Workflow 集成测试

### 7.3 HTTP 集成测试

`integration-tests/http/__tests__/admin/`：
- 每个新模块的 API 路由测试
- 扩展路由的测试

---

## 八、实施阶段

### Phase 0: 基础设施（第 1 周）

1. 从 `playground` 分叉 `china` 分支
2. 创建模块目录结构
3. 注册模块到 `medusa-config.ts`
4. 创建初始迁移

### Phase 1: P0 - MVP（第 2-4 周）

1. **扩展 Product 模块** - 添加 spu_code、brand_id、unit、product_type 等
2. **扩展 ProductVariant** - 添加 sku_code、cost_price、market_price 等
3. **创建 Brand 模块** - 完整 CRUD + 链接到 Product
4. **创建 Shop 模块** - 完整 CRUD
5. **创建 PlatformMapping 模块** - PlatformSku CRUD + 链接

### Phase 2: P1 - 核心（第 5-8 周）

1. **创建 Material 模块** - BasicMaterial + SalesMaterial CRUD
2. **扩展 InventoryItem** - 添加 alert_stock、stock_controlled
3. **创建 StoreInventory 模块** - 完整 CRUD + 链接
4. **添加税务字段** - BasicMaterial + SalesMaterial

### Phase 3: P2 - 进阶（第 9-14 周）

1. **创建 Organization 模块** - 支持层级 + 链接
2. **扩展 Material 模块** - 添加 ComboItem
3. **创建 ChannelPrice 模块** - 完整 CRUD + 链接

### Phase 4: P3 - 完善（第 15-17 周）

1. **扩展 PlatformMapping** - 添加 PlatformSyncTask
2. **SN 码管理** - 扩展订单履约
3. **限购验证** - 扩展购物车/结账工作流
4. **种子脚本和文档**

---

## 九、排除项

以下 OMS 历史遗留设计**不在新系统中采纳**：

| 排除项 | 原因 | 替代方案 |
|--------|------|----------|
| 硬编码平台字段 | 加平台改表结构 | platform_sku 通用映射表 |
| p_1 ~ p_28 预置扩展字段 | 僵化、无法查询 | metadata JSON 字段 |
| spec_desc serialize 存储 | 无法 SQL 查询 | 关系型规格表 |
| 价格分散在 5+ 张表 | 查询复杂 | 统一 Channel Price 模块 |
| 库存分散在 4+ 张表 | 难以汇总 | 统一 Inventory 模块 |

---

## 十、数据模型关系总图

```
+-----------------+
|  BasicMaterial  |  <-- 基础物料（物理商品维度）
|  (基础物料层)    |
+--------+--------+
         | 1:N
         v
+-----------------+     +-----------------+
|    Product      |<----| ProductVariant  |  <-- Medusa 原有（目录展示层）
|    (SPU层)      | 1:N |    (SKU层)      |
+-----------------+     +--------+--------+
                                 |
         +-----------------------+-----------------------+
         |                       |                       |
         v                       v                       v
+-----------------+    +-----------------+    +-----------------+
|  SalesMaterial  |    |   PlatformSku   |    |  InventoryItem  |
|  (销售物料层)    |    |  (平台映射层)    |    |    (库存层)     |
|                 |    |                 |    |                 |
| . 组合/赠品定义 |    | . shop_id       |    | . 仓库库存      |
| . 渠道价格      |    | . platform_type |    | . 门店库存      |
| . 税务信息      |    | . platform_sku  |    | . 安全库存      |
+-----------------+    +-----------------+    +-----------------+
```

---

## 附录 A：平台类型枚举

```typescript
enum PlatformType {
  TAOBAO = "taobao",
  DOUYIN = "douyin",
  JD = "jd",
  PDD = "pdd",
  WECHAT = "wechat",
  XIAOHONGSHU = "xiaohongshu",
  OTHER = "other",
}
```

## 附录 B：物料类型枚举

```typescript
enum MaterialType {
  FINISHED = "finished",    // 成品
  SEMI = "semi",            // 半成品
  NORMAL = "normal",        // 普通
  BOX = "box",              // 礼盒
  VIRTUAL = "virtual",      // 虚拟
}

enum SalesMaterialType {
  NORMAL = "normal",        // 普通商品
  COMBO = "combo",          // 组合商品
  GIFT = "gift",            // 赠品
  CHOICE = "choice",        // 多选一
  BOX = "box",              // 礼盒
  LUCKY_BAG = "lucky_bag",  // 福袋/盲盒
}
```
