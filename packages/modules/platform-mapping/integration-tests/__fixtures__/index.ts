export const createPlatformSkuFixture = (shopId: string) => ({
  shop_id: shopId,
  platform_type: "taobao" as const,
  platform_product_id: "123456789",
  platform_sku_id: "SKU123",
  platform_sku_code: "TEST001",
  platform_title: "Test Product on Taobao",
  platform_price: 99.99,
  mapping_status: "mapped" as const,
  listing_status: "listed" as const,
})

export const createPlatformSyncTaskFixture = (shopId: string) => ({
  shop_id: shopId,
  platform_type: "taobao" as const,
  action: "create" as const,
  payload: { product_id: "123" },
  status: "success" as const,
})
