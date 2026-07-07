import { defaultAdminCustomerAddressFields } from "../query-config"

describe("admin customer address query config", () => {
  it("includes address_name in default customer address fields", () => {
    expect(defaultAdminCustomerAddressFields).toContain("address_name")
  })
})
