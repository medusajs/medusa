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
})
