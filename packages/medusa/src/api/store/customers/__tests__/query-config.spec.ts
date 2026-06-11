import { defaultStoreCustomerAddressFields } from "../query-config"

describe("store customer address query config", () => {
  it("includes address_name in default customer address fields", () => {
    expect(defaultStoreCustomerAddressFields).toContain("address_name")
  })
})
