jest.unmock("axios")

import BrightpearlService from "../brightpearl"
import { mockCreateOrder, mockCreateCredit } from "../../utils/brightpearl"
import MockAdapter from "axios-mock-adapter"

jest.mock("../../utils/brightpearl")

const order = {
  region: {
    tax_code: "1234",
  },
  items: [
    {
      title: "Test",
      variant: {
        sku: "TEST",
      },
      unit_price: 1100,
      quantity: 2,
    },
  ],
  shipping_total: 12399,
  shipping_methods: [
    {
      name: "standard",
      price: 12399,
    },
  ],
  payment_method: {
    id: "123",
  },
  tax_rate: 23.1,
  currency_code: "DKK",
  display_id: "1234",
  id: "12355",
  discounts: [],
  shipping_address: {
    first_name: "Test",
    last_name: "Testson",
    address_1: "Test",
    address_2: "TEst",
    postal_code: "1234",
    country_code: "DK",
    phone: "12345678",
  },
  email: "test@example.com",
}

const krwOrder = {
  region: {
    tax_code: "1234",
  },
  items: [
    {
      title: "Test",
      variant: {
        sku: "TEST",
      },
      unit_price: 1100,
      quantity: 2,
    },
  ],
  shipping_total: 12399,
  shipping_methods: [
    {
      name: "standard",
      price: 12399,
    },
  ],
  payment_method: {
    id: "123",
  },
  tax_rate: 0,
  currency_code: "KRW",
  display_id: "1234",
  id: "12355",
  discounts: [],
  shipping_address: {
    first_name: "Test",
    last_name: "Testson",
    address_1: "Test",
    address_2: "TEst",
    postal_code: "1234",
    country_code: "DK",
    phone: "12345678",
  },
  email: "test@example.com",
}

const roundingOrder = {
  region: {
    tax_code: "1234",
  },
  items: [
    {
      id: "rounding-item",
      title: "Test",
      allow_discounts: true,
      variant: {
        sku: "TEST",
      },
      unit_price: 31600,
      quantity: 1,
    },
  ],
  shipping_total: 0,
  shipping_methods: [
    {
      name: "standard",
      price: 0,
    },
  ],
  discounts: [
    {
      code: "testdiscount",
      rule: {
        type: "percentage",
        allocation: "total",
        value: 50,
      },
    },
  ],
  payment_method: {
    id: "123",
  },
  tax_rate: 25,
  currency_code: "DKK",
  display_id: "1234",
  id: "rounding",
  shipping_address: {
    first_name: "Test",
    last_name: "Testson",
    address_1: "Test",
    address_2: "TEst",
    postal_code: "1234",
    country_code: "DK",
    phone: "12345678",
  },
  email: "test@example.com",
}

const OrderService = {
  retrieve: (id) => {
    if (id === "rounding") {
      return Promise.resolve(roundingOrder)
    }
    return Promise.resolve(order)
  },
  update: () => {
    return Promise.resolve()
  },
}

const TotalsService = {
  getTotal: () => {
    return Promise.resolve(123)
  },
  getShippingMethodTotals: () => {
    return {
      price: 0,
      discount_total: 0,
      tax_total: 0,
    }
  },
  getLineItemTotals: () => {
    return {
      subtotal: 15800,
      discount_total: 0,
      tax_total: 3950,
    }
  },
  getLineDiscounts: (o) => {
    if (o.id === "rounding") {
      return [
        {
          item: { id: "rounding-item", quantity: 1 },
          amount: 15800,
        },
      ]
    }
    return []
  },
  getShippingTotal: (o) => {
    if (o.id === "rounding") {
      return 0
    }
    return 12399
  },
  rounded: (value) => {
    return Math.round(value)
    // const decimalPlaces = 4
    // return Number(
    //   Math.round(parseFloat(value + "e" + decimalPlaces)) + "e-" + decimalPlaces
    // )
  },
}

const OAuthService = {
  retrieveByName: () => {
    return Promise.resolve({
      data: {
        access_token: "12345",
      },
    })
  },
}

const RegionService = {
  retrieve: () => {
    return Promise.resolve({
      tax_code: "1234",
    })
  },
}

describe("BrightpearlService", () => {
  describe("getClient", () => {
    it("creates client", async () => {
      let token = "bad"
      const oauth = {
        refreshToken: () => {
          token = "good"
          return Promise.resolve({
            data: {
              access_token: "good",
            },
          })
        },
        retrieveByName: () => {
          return Promise.resolve({
            data: {
              access_token: token,
            },
          })
        },
      }

      const bpService = new BrightpearlService({ oauthService: oauth }, {})
      const client = await bpService.getClient()

      const mockServer = new MockAdapter(client.client)

      mockServer.onGet("/success").reply(() => {
        return [200]
      })
      mockServer.onGet("/fail").reply((req) => {
        if (req.headers.Authorization === "Bearer good") {
          return [200]
        }
        return [401]
      })

      await client.test.fail()
      await client.test.fail()
    })
  })

  describe("rounding", () => {
    const bpService = new BrightpearlService(
      {
        orderService: OrderService,
        totalsService: TotalsService,
        oauthService: OAuthService,
        regionService: RegionService,
      },
      { account: "test" }
    )

    it("rounds correctly", async () => {
      jest.clearAllMocks()
      await bpService.createSalesOrder("rounding")

      expect(mockCreateOrder).toHaveBeenCalledTimes(1)
      expect(mockCreateOrder).toHaveBeenCalledWith({
        currency: { code: "DKK" },
        ref: "1234",
        externalRef: "rounding",
        channelId: "1",
        installedIntegrationInstanceId: undefined,
        statusId: "3",
        customer: {
          id: "12345",
          address: {
            addressFullName: "Test Testson",
            addressLine1: "Test",
            addressLine2: "TEst",
            postalCode: "1234",
            countryIsoCode: "DK",
            telephone: "12345678",
            email: "test@example.com",
          },
        },
        delivery: {
          shippingMethodId: 0,
          address: {
            addressFullName: "Test Testson",
            addressLine1: "Test",
            addressLine2: "TEst",
            postalCode: "1234",
            countryIsoCode: "DK",
            telephone: "12345678",
            email: "test@example.com",
          },
        },
        rows: [
          {
            name: "Test",
            net: 158,
            tax: 39.5,
            quantity: 1,
            taxCode: "1234",
            externalRef: "rounding-item",
            nominalCode: "4000",
          },
          {
            name: "Shipping: standard",
            quantity: 1,
            net: 0,
            tax: 0,
            taxCode: "1234",
            nominalCode: "4040",
          },
        ],
      })
    })

    it("rounds correctly", async () => {
      jest.clearAllMocks()
      await bpService.createSalesOrder("rounding")

      expect(mockCreateOrder).toHaveBeenCalledTimes(1)
      expect(mockCreateOrder).toHaveBeenCalledWith({
        currency: { code: "DKK" },
        ref: "1234",
        externalRef: "rounding",
        channelId: "1",
        installedIntegrationInstanceId: undefined,
        statusId: "3",
        customer: {
          id: "12345",
          address: {
            addressFullName: "Test Testson",
            addressLine1: "Test",
            addressLine2: "TEst",
            postalCode: "1234",
            countryIsoCode: "DK",
            telephone: "12345678",
            email: "test@example.com",
          },
        },
        delivery: {
          shippingMethodId: 0,
          address: {
            addressFullName: "Test Testson",
            addressLine1: "Test",
            addressLine2: "TEst",
            postalCode: "1234",
            countryIsoCode: "DK",
            telephone: "12345678",
            email: "test@example.com",
          },
        },
        rows: [
          {
            name: "Test",
            net: 158,
            tax: 39.5,
            quantity: 1,
            taxCode: "1234",
            externalRef: "rounding-item",
            nominalCode: "4000",
          },
          {
            name: "Shipping: standard",
            quantity: 1,
            net: 0,
            tax: 0,
            taxCode: "1234",
            nominalCode: "4040",
          },
        ],
      })
    })
  })

  describe("bpnum_", () => {
    const bpService = new BrightpearlService(
      {
        orderService: OrderService,
        totalsService: TotalsService,
        oauthService: OAuthService,
        regionService: RegionService,
      },
      { account: "test" }
    )

    it("sales credit diff. calc - KRW", async () => {
      jest.clearAllMocks()
      const total = 100000
      const refund_amount = 100000
      const difference = bpService.bpnum_(refund_amount, "krw") - total
      expect(difference).toEqual(0)
    })

    it("sales credit diff. calc - DKK", async () => {
      jest.clearAllMocks()
      const total = 100000
      const refund_amount = 100000
      const difference = bpService.bpnum_(refund_amount, "dkk") - total
      expect(difference).toEqual(-99000)
    })
  })
})
