import { StoreTypes } from "@medusajs/types"

export const createStoreFixture: StoreTypes.CreateStoreDTO = {
  name: "Test store",
  default_sales_channel_id: "test-sales-channel",
  default_region_id: "test-region",
  metadata: {
    test: "test",
  },
}
