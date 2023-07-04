import WebshipperFulfillmentService from "../webshipper-fulfillment"

describe("WebshipperFulfillmentService", () => {
  const orderService = {
    createShipment: jest.fn(),
  }
  const swapService = {
    createShipment: jest.fn(),
  }
  const claimService = {
    createShipment: jest.fn(),
  }

  const totalsService = {
    getLineItemTotals: jest.fn().mockImplementation(() => {
      return {
        unit_price: 1000,
        tax_lines: [
          {
            rate: 20,
          },
        ],
      }
    }),
  }

  describe("handleWebhook", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("creates an order shipment", async () => {
      const webshipper = new WebshipperFulfillmentService(
        {
          orderService,
          claimService,
          swapService,
        },
        {}
      )

      webshipper.retrieveRelationship = () => {
        return {
          data: {
            attributes: {
              ext_ref: "order_test.ful_test",
            },
          },
        }
      }

      const body = {
        data: {
          attributes: {
            tracking_links: [
              {
                url: "https://test/1134",
                number: "12324245345",
              },
              {
                url: "https://test/1234",
                number: "12324245345",
              },
            ],
          },
          relationships: {
            order: {
              id: "order",
            },
          },
        },
      }

      await webshipper.handleWebhook("", body)

      expect(claimService.createShipment).toHaveBeenCalledTimes(0)
      expect(swapService.createShipment).toHaveBeenCalledTimes(0)

      expect(orderService.createShipment).toHaveBeenCalledTimes(1)
      expect(orderService.createShipment).toHaveBeenCalledWith(
        "order_test",
        "ful_test",
        [
          {
            url: "https://test/1134",
            tracking_number: "12324245345",
          },
          {
            url: "https://test/1234",
            tracking_number: "12324245345",
          },
        ]
      )
    })

    it("creates a claim shipment", async () => {
      const webshipper = new WebshipperFulfillmentService(
        {
          orderService,
          claimService,
          swapService,
        },
        {}
      )

      webshipper.retrieveRelationship = () => {
        return {
          data: {
            attributes: {
              ext_ref: "claim_test.ful_test",
            },
          },
        }
      }

      const body = {
        data: {
          attributes: {
            tracking_links: [
              {
                url: "https://test/1134",
                number: "12324245345",
              },
              {
                url: "https://test/1234",
                number: "12324245345",
              },
            ],
          },
          relationships: {
            order: {
              id: "order",
            },
          },
        },
      }

      await webshipper.handleWebhook("", body)

      expect(orderService.createShipment).toHaveBeenCalledTimes(0)
      expect(swapService.createShipment).toHaveBeenCalledTimes(0)

      expect(claimService.createShipment).toHaveBeenCalledTimes(1)
      expect(claimService.createShipment).toHaveBeenCalledWith(
        "claim_test",
        "ful_test",
        [
          {
            url: "https://test/1134",
            tracking_number: "12324245345",
          },
          {
            url: "https://test/1234",
            tracking_number: "12324245345",
          },
        ]
      )
    })

    it("creates a swap shipment", async () => {
      const webshipper = new WebshipperFulfillmentService(
        {
          orderService,
          claimService,
          swapService,
        },
        {}
      )

      webshipper.retrieveRelationship = () => {
        return {
          data: {
            attributes: {
              ext_ref: "swap_test.ful_test",
            },
          },
        }
      }

      const body = {
        data: {
          attributes: {
            tracking_links: [
              {
                url: "https://test/1134",
                number: "12324245345",
              },
              {
                url: "https://test/1234",
                number: "12324245345",
              },
            ],
          },
          relationships: {
            order: {
              id: "order",
            },
          },
        },
      }

      await webshipper.handleWebhook("", body)

      expect(orderService.createShipment).toHaveBeenCalledTimes(0)
      expect(claimService.createShipment).toHaveBeenCalledTimes(0)

      expect(swapService.createShipment).toHaveBeenCalledTimes(1)
      expect(swapService.createShipment).toHaveBeenCalledWith(
        "swap_test",
        "ful_test",
        [
          {
            url: "https://test/1134",
            tracking_number: "12324245345",
          },
          {
            url: "https://test/1234",
            tracking_number: "12324245345",
          },
        ]
      )
    })
  })

  describe("buildWebshipperItem", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    const medusaItem = {
      id: "item_id",
      title: "item_title",
      quantity: 1,
    }

    const order = {
      currency_code: "dkk",
    }

    it("builds a webshipper item", async () => {
      const webshipper = new WebshipperFulfillmentService(
        {
          totalsService,
        },
        {}
      )

      let item
      try {
        item = await webshipper.buildWebshipperItem(medusaItem, 1, order)
      } catch (error) {
        console.log(error)
      }

      expect(item).toEqual({
        ext_ref: "item_id",
        description: "item_title",
        quantity: 1,
        unit_price: 10,
        vat_percent: 20,
      })
    })

    it("builds a webshipper item with additional props from variant", async () => {
      const webshipper = new WebshipperFulfillmentService(
        {
          totalsService,
        },
        {}
      )

      medusaItem.variant = {}
      medusaItem.variant.origin_country = "DK"
      medusaItem.variant.sku = "sku"
      medusaItem.variant.hs_code = "hs"

      let item
      try {
        item = await webshipper.buildWebshipperItem(medusaItem, 1, order)
      } catch (error) {
        console.log(error)
      }

      expect(item).toEqual({
        ext_ref: "item_id",
        description: "item_title",
        quantity: 1,
        unit_price: 10,
        vat_percent: 20,
        country_of_origin: "DK",
        sku: "sku",
        tarif_number: "hs",
      })
    })

    it("builds a webshipper item with additional props from product", async () => {
      const webshipper = new WebshipperFulfillmentService(
        {
          totalsService,
        },
        {}
      )

      medusaItem.variant = {}
      medusaItem.variant.product = {}
      medusaItem.variant.product.origin_country = "DK"
      medusaItem.variant.product.hs_code = "test"

      let item
      try {
        item = await webshipper.buildWebshipperItem(medusaItem, 1, order)
      } catch (error) {
        console.log(error)
      }

      expect(item).toEqual({
        ext_ref: "item_id",
        description: "item_title",
        quantity: 1,
        unit_price: 10,
        vat_percent: 20,
        country_of_origin: "DK",
        tarif_number: "test",
      })
    })
  })
})
