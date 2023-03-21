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

  describe("preparePackage", () => {
    const items = [
      {
        quantity: 1,
        item:{
          variant : {
            weight: null, 
            length: null,
            height: null,
            width: null,
            product: {
              weight: 11,
              length: 11,
              height: 11,
              width: 11,
            }
          }
        }
      },
      {
        quantity: 2,
        item: {
          variant : { 
            weight: 9,
            length: 4,
            height: 4,
            width: 4,
          }
        }
      },
      {
        quantity: 4,
        item: {
          variant : {
            weight: 16,
            length: 16,
            height: 16,
            width: 16,
          }
        }
      }
    ];

    it("prepare package with default options", async () => {
      const webshipper = new WebshipperFulfillmentService(
        {
          orderService,
          claimService,
          swapService,
        },
        {}
      )

      expect(webshipper.preparePackage(items)).toEqual({
        dimensions: {
          height: 15,
          length: 15,
          unit: "cm",
          width: 15,
        },
        weight: 500,
        weight_unit: "g",
      });
    })

    it("prepare package without auto_calculate_dimensions and auto_calculate_weight, with options", async () => {
      const webshipper = new WebshipperFulfillmentService(
        {
          orderService,
          claimService,
          swapService,
        },
        { 
          weight_unit: 'oz',
          dimensions_unit: 'in',
          default_weight: 600,
          auto_calculate_weight: false,
          default_dimensions: {
            width: 20,
            height: 20,
            length: 20,
          },
          auto_calculate_dimensions: false,
        }
      )
      
      expect(webshipper.preparePackage(items)).toEqual({
        dimensions: {
          height: 20,
          length: 20,
          unit: "in",
          width: 20,
        },
        weight: 600,
        weight_unit: "oz",
      });
    })

    it("prepare package without auto_calculate_dimensions and auto_calculate_weight, with invalid options", async () => {
      const webshipper = new WebshipperFulfillmentService(
        {
          orderService,
          claimService,
          swapService,
        },
        { 
          weight_unit: "ozzzz",
          dimensions_unit: "innnn",
          default_weight: false,
          auto_calculate_weight: 23,
          default_dimensions: {
            width: '20',
            height: '20',
            length: '20',
          },
          auto_calculate_dimensions: 34,
        }
      )
      
      expect(webshipper.preparePackage(items)).toEqual({
        dimensions: {
          height: 15,
          length: 15,
          unit: "cm",
          width: 15,
        },
        weight: 500,
        weight_unit: "g",
      });
    })

    it("prepare package with auto_calculate_dimensions and without auto_calculate_weight, with options", async () => {
      const webshipper = new WebshipperFulfillmentService(
        {
          orderService,
          claimService,
          swapService,
        },
        { 
          weight_unit: "g",
          dimensions_unit: "cm",
          default_weight: 600,
          auto_calculate_weight: false,
          default_dimensions: {
            width: 20,
            height: 20,
            length: 20,
          },
          auto_calculate_dimensions: true,
        }
      )

      expect(webshipper.preparePackage(items)).toEqual({
        dimensions: {
          height: 16,
          length: 16,
          unit: "cm",
          width: 16,
        },
        weight: 600,
        weight_unit: "g",
      });
    })

    it("prepare package without auto_calculate_dimensions and with auto_calculate_weight, with options", async () => {
      const webshipper = new WebshipperFulfillmentService(
        {
          orderService,
          claimService,
          swapService,
        },
        { 
          weight_unit: "g",
          dimensions_unit: "cm",
          default_weight: 600,
          auto_calculate_weight: true,
          default_dimensions: {
            width: 20,
            height: 20,
            length: 20,
          },
          auto_calculate_dimensions: false,
        }
      )

      expect(webshipper.preparePackage(items)).toEqual({
        dimensions: {
          height: 20,
          length: 20,
          unit: "cm",
          width: 20,
        },
        weight: 93,
        weight_unit: "g",
      });
    })
  })
})
