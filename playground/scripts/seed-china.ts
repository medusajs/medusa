import { ExecArgs } from "@medusajs/framework/types"

export default async function seedChina({ container }: ExecArgs) {
  const logger = container.resolve("logger")
  logger.info("Starting China e-commerce seed...")

  // Seed Organization
  const orgModule = container.resolve("organizationModuleService") as any
  const org = await orgModule.createOrganizations({
    name: "Main Operations",
    code: "OPS001",
    org_type: "operation",
  })
  logger.info("Created organization: " + org.id)

  // Seed Brand
  const brandModule = container.resolve("brandModuleService") as any
  const brand = await brandModule.createBrands({
    name: "Test Brand",
    slug: "test-brand",
    org_id: org.id,
  })
  logger.info("Created brand: " + brand.id)

  // Seed Shop
  const shopModule = container.resolve("shopModuleService") as any
  const shop = await shopModule.createShops({
    shop_code: "TAOBAO_001",
    shop_name: "Test Taobao Shop",
    platform_type: "taobao",
    org_id: org.id,
  })
  logger.info("Created shop: " + shop.id)

  // Seed Basic Material
  const materialModule = container.resolve("materialModuleService") as any
  const basicMaterial = await materialModule.createBasicMaterials({
    material_code: "BM001",
    material_name: "Test T-Shirt",
    spu_code: "SPU001",
    material_type: "finished",
    org_id: org.id,
  })
  logger.info("Created basic material: " + basicMaterial.id)

  // Seed Sales Material
  const salesMaterial = await materialModule.createSalesMaterials({
    shop_id: shop.id,
    sales_code: "SM001",
    sales_name: "Test T-Shirt - Taobao",
    sales_type: "normal",
    basic_material: basicMaterial,
    org_id: org.id,
  })
  logger.info("Created sales material: " + salesMaterial.id)

  // Seed Platform SKU
  const platformMappingModule = container.resolve("platformMappingModuleService") as any
  const platformSku = await platformMappingModule.createPlatformSkus({
    shop_id: shop.id,
    platform_type: "taobao",
    platform_product_id: "123456789",
    platform_sku_id: "SKU123",
    platform_sku_code: "TEST001",
    sales_material_id: salesMaterial.id,
    platform_title: "Test T-Shirt on Taobao",
    platform_price: 99.99,
    mapping_status: "mapped",
  })
  logger.info("Created platform SKU: " + platformSku.id)

  // Seed Channel Price
  const channelPriceModule = container.resolve("channelPriceModuleService") as any
  const channelPrice = await channelPriceModule.createChannelPrices({
    sales_material_id: salesMaterial.id,
    shop_id: shop.id,
    price_type: "retail",
    currency_code: "CNY",
    amount: 99.99,
  })
  logger.info("Created channel price: " + channelPrice.id)

  logger.info("China e-commerce seed complete!")
  logger.info("Organization: " + org.id)
  logger.info("Brand: " + brand.id)
  logger.info("Shop: " + shop.id)
  logger.info("Basic Material: " + basicMaterial.id)
  logger.info("Sales Material: " + salesMaterial.id)
  logger.info("Platform SKU: " + platformSku.id)
  logger.info("Channel Price: " + channelPrice.id)
}
