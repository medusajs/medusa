import { ExecArgs } from "@medusajs/framework/types"
import { Logger } from "@medusajs/types"
import { Modules } from "@medusajs/framework/utils"

export default async function seedChina({ container }: ExecArgs) {
  const logger = container.resolve<Logger>("logger")
  logger.info("Starting China e-commerce seed...")

  // Create admin user (idempotent)
  const authService = container.resolve(Modules.AUTH)
  const workflowService = container.resolve(Modules.WORKFLOW_ENGINE)
  const userModule = container.resolve(Modules.USER) as any

  const adminEmail = "admin@example.com"
  const adminPassword = "supersecret"

  const existingUsers = await userModule.listUsers({ email: adminEmail })
  if (existingUsers.length > 0) {
    logger.info("Admin user already exists, skipping: " + adminEmail)
  } else {
    const { result: users } = await workflowService.run(
      "create-users-workflow",
      {
        input: {
          users: [{ email: adminEmail }],
        },
      }
    )

    const user = users[0]

    const { authIdentity, error } = await authService.register("emailpass", {
      body: { email: adminEmail, password: adminPassword },
    })

    if (error) {
      logger.error("Failed to create auth identity: " + error)
      throw new Error(error)
    }

    await authService.updateAuthIdentities({
      id: authIdentity!.id,
      app_metadata: { user_id: user.id },
    })

    logger.info("Admin user created: " + adminEmail + " / " + adminPassword)
  }

  // Seed Organization (idempotent)
  const orgModule = container.resolve("organization") as any
  let org = (await orgModule.listOrganizations({ code: "OPS001" }))[0]
  if (!org) {
    org = await orgModule.createOrganizations({
      name: "Main Operations",
      code: "OPS001",
      org_type: "operation",
    })
    logger.info("Created organization: " + org.id)
  } else {
    logger.info("Organization already exists: " + org.id)
  }

  // Seed Brand (idempotent)
  const brandModule = container.resolve("brand") as any
  let brand = (await brandModule.listBrands({ slug: "test-brand" }))[0]
  if (!brand) {
    brand = await brandModule.createBrands({
      name: "Test Brand",
      slug: "test-brand",
      org_id: org.id,
    })
    logger.info("Created brand: " + brand.id)
  } else {
    logger.info("Brand already exists: " + brand.id)
  }

  // Seed Shop - Taobao (idempotent)
  const shopModule = container.resolve("shop") as any
  let shopTaobao = (await shopModule.listShops({ shop_code: "TAOBAO_001" }))[0]
  if (!shopTaobao) {
    shopTaobao = await shopModule.createShops({
      shop_code: "TAOBAO_001",
      shop_name: "Test Taobao Shop",
      platform_type: "taobao",
      org_id: org.id,
    })
    logger.info("Created Taobao shop: " + shopTaobao.id)
  } else {
    logger.info("Taobao shop already exists: " + shopTaobao.id)
  }

  // Seed Shop - Douyin (idempotent)
  let shopDouyin = (await shopModule.listShops({ shop_code: "DOUYIN_001" }))[0]
  if (!shopDouyin) {
    shopDouyin = await shopModule.createShops({
      shop_code: "DOUYIN_001",
      shop_name: "Test Douyin Shop",
      platform_type: "douyin",
      org_id: org.id,
    })
    logger.info("Created Douyin shop: " + shopDouyin.id)
  } else {
    logger.info("Douyin shop already exists: " + shopDouyin.id)
  }

  // Seed Basic Material (idempotent)
  const materialModule = container.resolve("material") as any
  let basicMaterial = (
    await materialModule.listBasicMaterials({ material_code: "BM001" })
  )[0]
  if (!basicMaterial) {
    basicMaterial = await materialModule.createBasicMaterials({
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
  } else {
    logger.info("Basic material already exists: " + basicMaterial.id)
  }

  // Seed Sales Material - Taobao (idempotent)
  let salesMaterialTaobao = (
    await materialModule.listSalesMaterials({ sales_code: "SM_TB001" })
  )[0]
  if (!salesMaterialTaobao) {
    salesMaterialTaobao = await materialModule.createSalesMaterials({
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
  } else {
    logger.info("Taobao sales material already exists: " + salesMaterialTaobao.id)
  }

  // Seed Sales Material - Douyin (idempotent)
  let salesMaterialDouyin = (
    await materialModule.listSalesMaterials({ sales_code: "SM_DY001" })
  )[0]
  if (!salesMaterialDouyin) {
    salesMaterialDouyin = await materialModule.createSalesMaterials({
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
  } else {
    logger.info("Douyin sales material already exists: " + salesMaterialDouyin.id)
  }

  // Seed Platform SKU - Taobao (idempotent)
  const platformMappingModule = container.resolve("platform_mapping") as any
  let platformSkuTaobao = (
    await platformMappingModule.listPlatformSkus({ platform_sku_id: "SKU123" })
  )[0]
  if (!platformSkuTaobao) {
    platformSkuTaobao = await platformMappingModule.createPlatformSkus({
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
  } else {
    logger.info("Taobao platform SKU already exists: " + platformSkuTaobao.id)
  }

  // Seed Platform SKU - Douyin (idempotent)
  let platformSkuDouyin = (
    await platformMappingModule.listPlatformSkus({ platform_sku_id: "SKU456" })
  )[0]
  if (!platformSkuDouyin) {
    platformSkuDouyin = await platformMappingModule.createPlatformSkus({
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
  } else {
    logger.info("Douyin platform SKU already exists: " + platformSkuDouyin.id)
  }

  // Seed Platform Sync Task (always creates new)
  const syncTask = await platformMappingModule.createPlatformSyncTasks({
    shop_id: shopTaobao.id,
    platform_type: "taobao",
    action: "create",
    payload: { product_id: platformSkuTaobao.platform_product_id },
    status: "success",
  })
  logger.info("Created platform sync task: " + syncTask.id)

  // Seed Channel Price - Taobao retail (idempotent)
  const channelPriceModule = container.resolve("channel_price") as any
  let channelPriceRetail = (
    await channelPriceModule.listChannelPrices({
      sales_material_id: salesMaterialTaobao.id,
      price_type: "retail",
    })
  )[0]
  if (!channelPriceRetail) {
    channelPriceRetail = await channelPriceModule.createChannelPrices({
      sales_material_id: salesMaterialTaobao.id,
      shop_id: shopTaobao.id,
      price_type: "retail",
      currency_code: "CNY",
      amount: 99.99,
      min_quantity: 1,
      max_quantity: 100,
    })
    logger.info("Created retail channel price: " + channelPriceRetail.id)
  } else {
    logger.info("Retail channel price already exists: " + channelPriceRetail.id)
  }

  // Seed Channel Price - Taobao wholesale (idempotent)
  let channelPriceWholesale = (
    await channelPriceModule.listChannelPrices({
      sales_material_id: salesMaterialTaobao.id,
      price_type: "wholesale",
    })
  )[0]
  if (!channelPriceWholesale) {
    channelPriceWholesale = await channelPriceModule.createChannelPrices({
      sales_material_id: salesMaterialTaobao.id,
      shop_id: shopTaobao.id,
      price_type: "wholesale",
      currency_code: "CNY",
      amount: 79.99,
      min_quantity: 50,
      max_quantity: 500,
    })
    logger.info("Created wholesale channel price: " + channelPriceWholesale.id)
  } else {
    logger.info(
      "Wholesale channel price already exists: " + channelPriceWholesale.id
    )
  }

  // Seed Store Inventory (idempotent)
  const storeInventoryModule = container.resolve("store_inventory") as any
  let storeInventory = (
    await storeInventoryModule.listStoreInventories({
      location_id: "store_001",
      material_id: basicMaterial.id,
    })
  )[0]
  if (!storeInventory) {
    storeInventory = await storeInventoryModule.createStoreInventories({
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
  } else {
    logger.info("Store inventory already exists: " + storeInventory.id)
  }

  // Seed Combo Parent Material (idempotent)
  let comboParent = (
    await materialModule.listBasicMaterials({ material_code: "BM002" })
  )[0]
  if (!comboParent) {
    comboParent = await materialModule.createBasicMaterials({
      material_code: "BM002",
      material_name: "Summer Gift Box",
      spu_code: "SPU002",
      material_type: "box",
      sn_managed: false,
      stock_controlled: true,
      org_id: org.id,
    })
    logger.info("Created combo parent material: " + comboParent.id)
  } else {
    logger.info("Combo parent material already exists: " + comboParent.id)
  }

  // Seed Combo Item (idempotent)
  let comboItem = (
    await materialModule.listComboItems({
      parent_material_id: comboParent.id,
      child_material_id: basicMaterial.id,
    })
  )[0]
  if (!comboItem) {
    comboItem = await materialModule.createComboItems({
      parent_material_id: comboParent.id,
      child_material_id: basicMaterial.id,
      quantity: 2,
      is_optional: false,
      sort_order: 1,
    })
    logger.info("Created combo item: " + comboItem.id)
  } else {
    logger.info("Combo item already exists: " + comboItem.id)
  }

  logger.info("")
  logger.info("=== China e-commerce seed complete! ===")
  logger.info("Admin User: " + adminEmail + " / " + adminPassword)
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
