import SegmentService from "../segment"

jest.mock("analytics-node")

const orderFactory = (config = {}) => {
  return {
    id: "12355",
    display_id: "1234",
    cart_id: "cart_13",
    region_id: "reg_123",
    items: [
      {
        title: "Test",
        variant: {
          product_id: "prod_123",
          sku: "TEST",
        },
        unit_price: 1100,
        quantity: 2,
      },
    ],
    shipping_methods: [
      {
        name: "standard",
        price: 12399,
      },
    ],
    payments: [
      {
        id: "123",
      },
    ],
    tax_rate: 23.1,
    currency_code: "DKK",
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
    subtotal: 2200,
    total: 12399,
    tax_total: 0,
    shipping_total: 12399,
    discount_total: 0,
    gift_card_total: 0,
    ...config,
  }
}

describe("SegmentService", () => {
  const ProductService = {
    retrieve: () =>
      Promise.resolve({
        collection: { title: "Collection" },
        type: { value: "Type" },
        subtitle: "Subtitle",
      }),
  }

  const TotalsService = {
    getLineItemTotals: (item) => {
      return {
        total: item.unit_price,
        tax_total: 0,
      }
    },
  }

  describe("buildOrder", () => {
    const segmentService = new SegmentService(
      {
        productService: ProductService,
        totalsService: TotalsService,
      },
      { account: "test" }
    )

    segmentService.getReportingValue = async (_, v) => {
      const num = v
      return Promise.resolve(Number(Math.round(num + "e2") + "e-2"))
    }

    it("successfully builds sales order", async () => {
      jest.clearAllMocks()

      const order = orderFactory()
      const segmentOrder = await segmentService.buildOrder(order)

      expect(segmentOrder).toEqual({
        checkout_id: "cart_13",
        coupon: undefined,
        currency: "DKK",
        discount: 0,
        email: "test@example.com",
        order_id: "12355",
        payment_provider: "",
        products: [
          {
            category: "Collection",
            name: "Test",
            price: 5.5,
            product_id: "prod_123",
            quantity: 2,
            reporting_revenue: 11,
            sku: "",
            subtitle: "Subtitle",
            type: "Type",
            variant: "TEST",
          },
        ],
        region_id: "reg_123",
        reporting_discount: 0,
        reporting_revenue: 123.99,
        reporting_shipping: 123.99,
        reporting_subtotal: 22,
        reporting_tax: 0,
        reporting_total: 123.99,
        revenue: 123.99,
        shipping: 123.99,
        shipping_city: undefined,
        shipping_country: "DK",
        shipping_methods: [
          {
            name: "standard",
            price: 12399,
          },
        ],
        subtotal: 22,
        tax: 0,
        total: 123.99,
      })
    })

    it("successfully adds return reason and note on buildOrder", async () => {
      jest.clearAllMocks()

      const order = orderFactory()
      order.items = order.items.map((i) => {
        i.note = "testing 1234"
        i.reason = {
          value: "test_reason",
          id: "rr_test",
        }
        return i
      })
      const segmentOrder = await segmentService.buildOrder(order)

      expect(segmentOrder).toEqual({
        checkout_id: "cart_13",
        coupon: undefined,
        currency: "DKK",
        discount: 0,
        email: "test@example.com",
        order_id: "12355",
        payment_provider: "",
        products: [
          {
            category: "Collection",
            name: "Test",
            price: 5.5,
            product_id: "prod_123",
            quantity: 2,
            reporting_revenue: 11,
            sku: "",
            subtitle: "Subtitle",
            type: "Type",
            variant: "TEST",
            reason_id: "rr_test",
            reason_value: "test_reason",
            note: "testing 1234",
          },
        ],
        region_id: "reg_123",
        reporting_discount: 0,
        reporting_revenue: 123.99,
        reporting_shipping: 123.99,
        reporting_subtotal: 22,
        reporting_tax: 0,
        reporting_total: 123.99,
        revenue: 123.99,
        shipping: 123.99,
        shipping_city: undefined,
        shipping_country: "DK",
        shipping_methods: [
          {
            name: "standard",
            price: 12399,
          },
        ],
        subtotal: 22,
        tax: 0,
        total: 123.99,
      })
    })

    it("successfully builds order with zero decimal currency", async () => {
      jest.clearAllMocks()

      const order = orderFactory({ currency_code: "krw" })
      const segmentOrder = await segmentService.buildOrder(order)

      expect(segmentOrder).toEqual({
        checkout_id: "cart_13",
        coupon: undefined,
        currency: "KRW",
        discount: 0,
        email: "test@example.com",
        order_id: "12355",
        payment_provider: "",
        products: [
          {
            category: "Collection",
            name: "Test",
            price: 550,
            product_id: "prod_123",
            quantity: 2,
            reporting_revenue: 1100,
            sku: "",
            subtitle: "Subtitle",
            type: "Type",
            variant: "TEST",
          },
        ],
        region_id: "reg_123",
        reporting_discount: 0,
        reporting_revenue: 12399,
        reporting_shipping: 12399,
        reporting_subtotal: 2200,
        reporting_tax: 0,
        reporting_total: 12399,
        revenue: 12399,
        shipping: 12399,
        shipping_city: undefined,
        shipping_country: "DK",
        shipping_methods: [
          {
            name: "standard",
            price: 12399,
          },
        ],
        subtotal: 2200,
        tax: 0,
        total: 12399,
      })
    })
  })
})
