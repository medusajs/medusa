import EconomicService from "../economic"

describe("economic service tests", () => {
  const options_ = {
    secret_token: "foo",
    agreement_token: "bar",
    customer_number_dk: 1,
    customer_number_eu: 1,
    customer_number_world: 1,
    unit_number: 1,
    payment_terms_number: 1,
    layout_number: 21,
    vatzone_number_eu: 2,
    vatzone_number_dk: 1,
    vatzone_number_world: 3,
    recipient_name: "Webshop customer",
    shipping_product: "shipping",
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  const orderServiceMock = {
    retrieve: async (orderid) => {
      if (orderid === "order no metadata") {
        return { metadata: {} }
      }
      if (orderid === "draft order no lines") {
        return {
          id: "draft order no lines",
          region_id: "dk",
          billing_address: { country_code: "dk" },
          discounts: [],
          items: [],
        }
      }
      if (orderid === "draft order") {
        return {
          id: "draft order",
          region_id: "dk",
          billing_address: { country_code: "dk" },
          shipping_methods: [{ price: 1000 }],
          discounts: [
            {
              rule: {
                type: "sale 10",
              },
              lineItem: {
                id: "0",
              },
            },
          ],
          items: [
            {
              id: "0",
              unit_price: 10000,
              variant: {
                sku: "10",
              },
              quantity: 1,
            },
          ],
        }
      }
      return { metadata: { economicDraftId: "123" } }
    },
    // setMetadata: jest.fn(),
    update: jest.fn(),
  }

  const totalsServiceMock = {
    getAllocationItemDiscounts: jest.fn(async (discount, order) => {
      return [
        {
          lineItem: {
            id: "0",
            unit_price: 10000,
            quantity: 1,
          },
          variant: {},
          amount: 100,
        },
      ]
    }),
  }

  const regionServiceMock = {
    retrieve: async (region_id) => {
      if (region_id === "dk") {
        return { currency_code: "DKK" }
      }
    },
  }

  const service = new EconomicService(
    {
      orderService: orderServiceMock,
      totalsService: totalsServiceMock,
      regionService: regionServiceMock,
    },
    options_
  )

  service.economic_ = {
    post: jest.fn(async (url, bookInvoiceRequest) => {
      if (url === "https://restapi.e-conomic.com/invoices/drafts") {
        return Promise.resolve({
          data: {
            draftInvoiceNumber: "10",
          },
        })
      }
      if (url === "https://restapi.e-conomic.com/invoices/booked") {
        return Promise.resolve(bookInvoiceRequest)
      }
      return Promise.resolve()
    }),
  }

  it("decides vat based on options given", () => {
    const danishCustomerAndVATNumber = service.decideCustomerAndVatNumber_("dk")

    expect(danishCustomerAndVATNumber).toEqual({
      vat: options_.vatzone_number_dk,
      customer: options_.customer_number_dk,
    })

    const euCustomerAndVATNumber = service.decideCustomerAndVatNumber_("de")

    expect(euCustomerAndVATNumber).toEqual({
      vat: options_.vatzone_number_eu,
      customer: options_.customer_number_eu,
    })

    const globalCustomerAndVATNumber = service.decideCustomerAndVatNumber_("us")

    expect(globalCustomerAndVATNumber).toEqual({
      vat: options_.vatzone_number_world,
      customer: options_.customer_number_world,
    })
  })

  describe("createEconomicLinesFromOrder", () => {
    it("Creates orderlines with correct discount", async () => {
      const order = {
        id: "draft order",
        discounts: [
          {
            rule: {
              type: "sale 10",
            },
            lineItem: {
              id: "0",
            },
          },
          {
            rule: {
              type: "free_shipping",
            },
            lineItem: {
              id: "1",
            },
          },
        ],
        items: [
          {
            id: "0",
            unit_price: 10000,
            variant: {
              sku: "10",
            },
            quantity: 1,
          },
        ],
      }

      const result = await service.createEconomicLinesFromOrder(order)

      expect(
        totalsServiceMock.getAllocationItemDiscounts
      ).toHaveBeenCalledTimes(1)
      expect(totalsServiceMock.getAllocationItemDiscounts).toHaveBeenCalledWith(
        {
          rule: {
            type: "sale 10",
          },
          lineItem: {
            id: "0",
          },
        },
        order
      )

      expect(result).toEqual([
        {
          lineNumber: 1,
          sortKey: 1,
          unit: {
            unitNumber: options_.unit_number,
          },
          product: {
            productNumber: "10",
          },
          quantity: 1,
          unitNetPrice: 99,
        },
      ])
    })
  })

  describe("createInvoiceFromOrder", () => {
    it("creates order with correct metadata", async () => {
      const order = {
        id: "draft order no lines",
        region_id: "dk",
        billing_address: { country_code: "dk" },
        shipping_methods: [],
        discounts: [],
        items: [],
      }
      const result = await service.createInvoiceFromOrder(order)

      expect(result).toMatchSnapshot({
        date: expect.any(String),
        currency: "DKK",
        paymentTerms: {
          paymentTermsNumber: options_.payment_terms_number,
        },
        references: {
          other: "draft order no lines",
        },
        customer: {
          customerNumber: options_.customer_number_dk,
        },
        recipient: {
          name: options_.recipient_name,
          vatZone: {
            vatZoneNumber: options_.vatzone_number_dk,
          },
        },
        layout: {
          layoutNumber: options_.layout_number,
        },
        lines: [],
      })
    })
  })

  describe("draftEconomicInvoice", () => {
    it("creates economic draft", async () => {
      const result = await service.draftEconomicInvoice("draft order")

      const expectedInvoice = await service.createInvoiceFromOrder(
        await orderServiceMock.retrieve("draft order")
      )

      expect(service.economic_.post).toHaveBeenCalledWith(
        "https://restapi.e-conomic.com/invoices/drafts",
        expectedInvoice
      )
      expect(orderServiceMock.update).toHaveBeenCalledWith("draft order", {
        metadata: { economicDraftId: "10" },
      })
      expect(result).toEqual({
        id: "draft order",
        region_id: "dk",
        shipping_methods: [
          {
            price: 1000,
          },
        ],
        billing_address: { country_code: "dk" },
        discounts: [
          {
            rule: {
              type: "sale 10",
            },
            lineItem: {
              id: "0",
            },
          },
        ],
        items: [
          {
            id: "0",
            unit_price: 10000,
            variant: {
              sku: "10",
            },
            quantity: 1,
          },
        ],
      })
    })
  })

  describe("bookEconomicInvoice", () => {
    it("failes if economicDraftId is not set in order metatdata", async () => {
      try {
        await service.bookEconomicInvoice("order no metadata")
      } catch (err) {
        expect(err.message).toEqual("The order does not have an invoice number")
      }
    })

    it("calls economic", async () => {
      await service.bookEconomicInvoice("order id")

      expect(service.economic_.post).toHaveBeenCalledTimes(1)
      expect(service.economic_.post).toHaveBeenCalledWith(
        `https://restapi.e-conomic.com/invoices/booked`,
        {
          draftInvoice: {
            draftInvoiceNumber: 123,
          },
        }
      )
    })
  })
})
