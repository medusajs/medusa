import { ExecArgs } from "@medusajs/framework/types"
import { Logger } from "@medusajs/types"

export default async function seedChina({ container }: ExecArgs) {
  const logger = container.resolve<Logger>("logger")
  logger.info("Starting China e-commerce seed...")

  // Seed Organization
  const orgModule = container.resolve("organization") as any
  const org = await orgModule.createOrganizations({
    name: "Main Operations",
    code: "OPS001",
    org_type: "operation",
  })
  logger.info("Created organization: " + org.id)

  // Seed Brand
  const brandModule = container.resolve("brand") as any
  const brand = await brandModule.createBrands({
    name: "Test Brand",
    slug: "test-brand",
    org_id: org.id,
  })
  logger.info("Created brand: " + brand.id)

  // Seed Shop - Taobao
  const shopModule = container.resolve("shop") as any
  const shopTaobao = await shopModule.createShops({
    shop_code: "TAOBAO_001",
    shop_name: "Test Taobao Shop",
    platform_type: "taobao",
    org_id: org.id,
  })
  logger.info("Created Taobao shop: " + shopTaobao.id)

  // Seed Shop - Douyin
  const shopDouyin = await shopModule.createShops({
    shop_code: "DOUYIN_001",
    shop_name: "Test Douyin Shop",
    platform_type: "douyin",
    org_id: org.id,
  })
  logger.info("Created Douyin shop: " + shopDouyin.id)

  // Seed Basic Material
  const materialModule = container.resolve("material") as any
  const basicMaterial = await materialModule.createBasicMaterials({
    material_code: "BM001",
    material_name: "Test T-Shirt",
    spu_code: "SPU001",
    material_type: "finished",
    sn_managed: false,
    stock_controlled: true,
    tax_rate: 13,
    tax_name: "服装",
    tax_code: "104020101",
    omnichannel: true,
    o2o_enabled: true,
    color: "Black",
    size: "L",
    org_id: org.id,
  })
  logger.info("Created basic material: " + basicMaterial.id)

  // Seed Sales Material - Taobao
  const salesMaterialTaobao = await materialModule.createSalesMaterials({
    shop_id: shopTaobao.id,
    sales_code: "SM_TB001",
    sales_name: "Test T-Shirt - Taobao",
    sales_type: "normal",
    material_id: basicMaterial.id,
    is_bound: true,
    tax_rate: 13,
    tax_name: "服装",
    tax_code: "104020101",
    status: "active",
    org_id: org.id,
  })
  logger.info("Created Taobao sales material: " + salesMaterialTaobao.id)

  // Seed Sales Material - Douyin
  const salesMaterialDouyin = await materialModule.createSalesMaterials({
    shop_id: shopDouyin.id,
    sales_code: "SM_DY001",
    sales_name: "Test T-Shirt - Douyin",
    sales_type: "normal",
    material_id: basicMaterial.id,
    is_bound: true,
    tax_rate: 13,
    tax_name: "服装",
    tax_code: "104020101",
    status: "active",
    org_id: org.id,
  })
  logger.info("Created Douyin sales material: " + salesMaterialDouyin.id)

  // Seed Platform SKU - Taobao
  const platformMappingModule = container.resolve("platform_mapping") as any
  const platformSkuTaobao = await platformMappingModule.createPlatformSkus({
    shop_id: shopTaobao.id,
    platform_type: "taobao",
    platform_product_id: "123456789",
    platform_sku_id: "SKU123",
    platform_sku_code: "TEST001",
    sales_material_id: salesMaterialTaobao.id,
    platform_title: "Test T-Shirt on Taobao",
    platform_price: 99.99,
    mapping_status: "mapped",
    listing_status: "listed",
  })
  logger.info("Created Taobao platform SKU: " + platformSkuTaobao.id)

  // Seed Platform SKU - Douyin
  const platformSkuDouyin = await platformMappingModule.createPlatformSkus({
    shop_id: shopDouyin.id,
    platform_type: "douyin",
    platform_product_id: "987654321",
    platform_sku_id: "SKU456",
    platform_sku_code: "TEST002",
    sales_material_id: salesMaterialDouyin.id,
    platform_title: "Test T-Shirt on Douyin",
    platform_price: 89.99,
    mapping_status: "mapped",
    listing_status: "listed",
  })
  logger.info("Created Douyin platform SKU: " + platformSkuDouyin.id)

  // Seed Platform Sync Task
  const syncTask = await platformMappingModule.createPlatformSyncTasks({
    shop_id: shopTaobao.id,
    platform_type: "taobao",
    action: "create",
    payload: { product_id: platformSkuTaobao.platform_product_id },
    status: "success",
  })
  logger.info("Created platform sync task: " + syncTask.id)

  // Seed Channel Price - Taobao retail
  const channelPriceModule = container.resolve("channel_price") as any
  const channelPriceRetail = await channelPriceModule.createChannelPrices({
    sales_material_id: salesMaterialTaobao.id,
    shop_id: shopTaobao.id,
    price_type: "retail",
    currency_code: "CNY",
    amount: 99.99,
    min_quantity: 1,
    max_quantity: 100,
  })
  logger.info("Created retail channel price: " + channelPriceRetail.id)

  // Seed Channel Price - Taobao wholesale
  const channelPriceWholesale = await channelPriceModule.createChannelPrices({
    sales_material_id: salesMaterialTaobao.id,
    shop_id: shopTaobao.id,
    price_type: "wholesale",
    currency_code: "CNY",
    amount: 79.99,
    min_quantity: 50,
    max_quantity: 500,
  })
  logger.info("Created wholesale channel price: " + channelPriceWholesale.id)

  // Seed Store Inventory
  const storeInventoryModule = container.resolve("store_inventory") as any
  const storeInventory = await storeInventoryModule.createStoreInventories({
    location_id: "store_001",
    material_id: basicMaterial.id,
    online_stock: 100,
    online_reserved: 10,
    share_stock: 50,
    share_reserved: 5,
    in_transit_stock: 20,
    store_mode: "normal",
  })
  logger.info("Created store inventory: " + storeInventory.id)

  // Seed Combo Item (optional - for combo product demo)
  const comboParent = await materialModule.createBasicMaterials({
    material_code: "BM002",
    material_name: "Summer Gift Box",
    spu_code: "SPU002",
    material_type: "box",
    sn_managed: false,
    stock_controlled: true,
    org_id: org.id,
  })
  logger.info("Created combo parent material: " + comboParent.id)

  const comboItem = await materialModule.createComboItems({
    parent_material_id: comboParent.id,
    child_material_id: basicMaterial.id,
    quantity: 2,
    is_optional: false,
    sort_order: 1,
  })
  logger.info("Created combo item: " + comboItem.id)

  logger.info("")
  logger.info("=== China e-commerce seed complete! ===")
  logger.info("Organization: " + org.id)
  logger.info("Brand: " + brand.id)
  logger.info("Taobao Shop: " + shopTaobao.id)
  logger.info("Douyin Shop: " + shopDouyin.id)
  logger.info("Basic Material: " + basicMaterial.id)
  logger.info("Taobao Sales Material: " + salesMaterialTaobao.id)
  logger.info("Douyin Sales Material: " + salesMaterialDouyin.id)
  logger.info("Taobao Platform SKU: " + platformSkuTaobao.id)
  logger.info("Douyin Platform SKU: " + platformSkuDouyin.id)
  logger.info("Platform Sync Task: " + syncTask.id)
  logger.info("Retail Channel Price: " + channelPriceRetail.id)
  logger.info("Wholesale Channel Price: " + channelPriceWholesale.id)
  logger.info("Store Inventory: " + storeInventory.id)
  logger.info("Combo Parent: " + comboParent.id)
  logger.info("Combo Item: " + comboItem.id)
}
