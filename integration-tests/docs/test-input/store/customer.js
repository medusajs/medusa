const {
  Region,
  ProductOption,
  Product,
  ProductVariant,
  ShippingProfile,
  MoneyAmount,
  Cart,
} = require("@medusajs/medusa")

module.exports = {
  operationId: "GetCustomersCustomer",
  buildEndpoint: _ => `/store/customers/me`,
  setup: async (manager, api) => {
    const response = await api.post("/store/customers", {
      first_name: "Ada",
      last_name: "Lovelace",
      email: "ada@com.com",
      password: "test",
    })

    const authResponse = await api.post("/store/auth", {
      email: "ada@com.com",
      password: "test",
    })

    const [authCookie] = authResponse.headers["set-cookie"][0].split(";")

    return {
      headers: {
        Cookie: authCookie,
      },
    }
  },
  snapshotMatch: {
    customer: {
      id: expect.stringMatching(/^cus_*/),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    },
  },
}
