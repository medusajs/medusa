import { StoreTypes } from "@medusajs/framework/types"

export const createStoreFixture: StoreTypes.CreateStoreDTO = {
  name: "Test store",
  supported_currencies: [
    { currency_code: "usd" },
    { currency_code: "eur", is_default: true },
  ],
  supported_locales: [
    { locale_code: "fr-FR" },
    { locale_code: "en-US" },
  ],
  default_sales_channel_id: "test-sales-channel",
  default_region_id: "test-region",
  metadata: {
    test: "test",
  },
}
