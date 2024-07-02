import { StoreTypes } from "@medusajs/types"

export const createStoreFixture: StoreTypes.CreateStoreDTO = {
  name: "Test store",
  supported_currencies: [
    { currency_code: "usd" },
    { currency_code: "eur", is_default: true },
  ],
  default_sales_channel_id: "test-sales-channel",
  default_region_id: "test-region",
  metadata: {
    test: "test",
  },
}
