import ShipbobFulfillmentService from "../shipbob-fulfillment"

describe("ShipbobFulfillmentService", () => {
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
      const shipbob = new ShipbobFulfillmentService(
        {
          orderService,
          claimService,
          swapService,
        },
        {}
      )

      const order = {
        reference_id: 'order_test.ful_test',
        shipments: [
          {
            id: 1009099,
            location: {
              id: 3,
              name: 'Cicero (IL)',
            },
            tracking: {
              carrier: 'USPS',
              tracking_number: '860C8CDC8F0B4FC7AB69AC86C20539EC',
              carrier_service: 'Priority',
              tracking_url: 'https://www.example.com/tracking?id=860C8CDC8F0B4FC7AB69AC86C20539EC',
            },
            products: [
              {
                id: 0,
                reference_id: 'TShirtBlueM',
                name: 'Medium Blue T-Shirt',
                sku: 'TShirtBlueM',
                inventory_items: [
                  {
                    id: 0,
                    name: 'Medium Blue T-Shirt',
                    quantity: 0,
                    lot: '22222',
                    expiration_date: '2020-04-09T00:50:01Z',
                    serial_numbers: [
                        'string',
                    ],
                    is_dangerous_goods: true,
                  },
                ]
              },
            ],
          },
        ],
      }

      await shipbob.orderShipped(order)

      expect(claimService.createShipment).toHaveBeenCalledTimes(0)
      expect(swapService.createShipment).toHaveBeenCalledTimes(0)

      expect(orderService.createShipment).toHaveBeenCalledTimes(1)
      expect(orderService.createShipment).toHaveBeenCalledWith(
        "order_test",
        "ful_test",
        [
          {
            url: 'https://www.example.com/tracking?id=860C8CDC8F0B4FC7AB69AC86C20539EC',
            tracking_number: '860C8CDC8F0B4FC7AB69AC86C20539EC',
            metadata: {
              carrier: 'USPS',
              tracking_number: '860C8CDC8F0B4FC7AB69AC86C20539EC',
              carrier_service: 'Priority',
              tracking_url: 'https://www.example.com/tracking?id=860C8CDC8F0B4FC7AB69AC86C20539EC',
            },
          },
        ],
        {
          metadata: {
            shipbob_shipments: [
              {
                id: 1009099,
                location: {
                  id: 3,
                  name: 'Cicero (IL)',
                },
                tracking: {
                  carrier: 'USPS',
                  tracking_number: '860C8CDC8F0B4FC7AB69AC86C20539EC',
                  carrier_service: 'Priority',
                  tracking_url: 'https://www.example.com/tracking?id=860C8CDC8F0B4FC7AB69AC86C20539EC',
                },
                products: [
                  {
                    id: 0,
                    reference_id: 'TShirtBlueM',
                    name: 'Medium Blue T-Shirt',
                    sku: 'TShirtBlueM',
                    inventory_items: [
                      {
                        id: 0,
                        name: 'Medium Blue T-Shirt',
                        quantity: 0,
                        lot: '22222',
                        expiration_date: '2020-04-09T00:50:01Z',
                        serial_numbers: [
                            'string',
                        ],
                        is_dangerous_goods: true,
                      },
                    ]
                  },
                ],
              },
            ],
          },
        },
      )
    })

    it("creates a claim shipment", async () => {
      const shipbob = new ShipbobFulfillmentService(
        {
          orderService,
          claimService,
          swapService,
        },
        {}
      )

      const order = {
        reference_id: 'claim_test.ful_test',
        shipments: [
          {
            id: 1009099,
            location: {
              id: 3,
              name: 'Cicero (IL)',
            },
            tracking: {
              carrier: 'USPS',
              tracking_number: '860C8CDC8F0B4FC7AB69AC86C20539EC',
              carrier_service: 'Priority',
              tracking_url: 'https://www.example.com/tracking?id=860C8CDC8F0B4FC7AB69AC86C20539EC',
            },
            products: [
              {
                id: 0,
                reference_id: 'TShirtBlueM',
                name: 'Medium Blue T-Shirt',
                sku: 'TShirtBlueM',
                inventory_items: [
                  {
                    id: 0,
                    name: 'Medium Blue T-Shirt',
                    quantity: 0,
                    lot: '22222',
                    expiration_date: '2020-04-09T00:50:01Z',
                    serial_numbers: [
                        'string',
                    ],
                    is_dangerous_goods: true,
                  },
                ]
              },
            ],
          },
        ],
      }

      await shipbob.orderShipped(order)

      expect(orderService.createShipment).toHaveBeenCalledTimes(0)
      expect(swapService.createShipment).toHaveBeenCalledTimes(0)

      expect(claimService.createShipment).toHaveBeenCalledTimes(1)
      expect(claimService.createShipment).toHaveBeenCalledWith(
        "claim_test",
        "ful_test",
        [
          {
            url: 'https://www.example.com/tracking?id=860C8CDC8F0B4FC7AB69AC86C20539EC',
            tracking_number: '860C8CDC8F0B4FC7AB69AC86C20539EC',
            metadata: {
              carrier: 'USPS',
              tracking_number: '860C8CDC8F0B4FC7AB69AC86C20539EC',
              carrier_service: 'Priority',
              tracking_url: 'https://www.example.com/tracking?id=860C8CDC8F0B4FC7AB69AC86C20539EC',
            },
          },
        ],
        {
          metadata: {
            shipbob_shipments: [
              {
                id: 1009099,
                location: {
                  id: 3,
                  name: 'Cicero (IL)',
                },
                tracking: {
                  carrier: 'USPS',
                  tracking_number: '860C8CDC8F0B4FC7AB69AC86C20539EC',
                  carrier_service: 'Priority',
                  tracking_url: 'https://www.example.com/tracking?id=860C8CDC8F0B4FC7AB69AC86C20539EC',
                },
                products: [
                  {
                    id: 0,
                    reference_id: 'TShirtBlueM',
                    name: 'Medium Blue T-Shirt',
                    sku: 'TShirtBlueM',
                    inventory_items: [
                      {
                        id: 0,
                        name: 'Medium Blue T-Shirt',
                        quantity: 0,
                        lot: '22222',
                        expiration_date: '2020-04-09T00:50:01Z',
                        serial_numbers: [
                            'string',
                        ],
                        is_dangerous_goods: true,
                      },
                    ]
                  },
                ],
              },
            ],
          },
        },
      )
    })

    it("creates a swap shipment", async () => {
      const shipbob = new ShipbobFulfillmentService(
        {
          orderService,
          claimService,
          swapService,
        },
        {}
      )

      const order = {
        reference_id: 'swap_test.ful_test',
        shipments: [
          {
            id: 1009099,
            location: {
              id: 3,
              name: 'Cicero (IL)',
            },
            tracking: {
              carrier: 'USPS',
              tracking_number: '860C8CDC8F0B4FC7AB69AC86C20539EC',
              carrier_service: 'Priority',
              tracking_url: 'https://www.example.com/tracking?id=860C8CDC8F0B4FC7AB69AC86C20539EC',
            },
            products: [
              {
                id: 0,
                reference_id: 'TShirtBlueM',
                name: 'Medium Blue T-Shirt',
                sku: 'TShirtBlueM',
                inventory_items: [
                  {
                    id: 0,
                    name: 'Medium Blue T-Shirt',
                    quantity: 0,
                    lot: '22222',
                    expiration_date: '2020-04-09T00:50:01Z',
                    serial_numbers: [
                        'string',
                    ],
                    is_dangerous_goods: true,
                  },
                ]
              },
            ],
          },
        ],
      }

      await shipbob.orderShipped(order)

      expect(orderService.createShipment).toHaveBeenCalledTimes(0)
      expect(claimService.createShipment).toHaveBeenCalledTimes(0)

      expect(swapService.createShipment).toHaveBeenCalledTimes(1)
      expect(swapService.createShipment).toHaveBeenCalledWith(
        "swap_test",
        "ful_test",
        [
          {
            url: 'https://www.example.com/tracking?id=860C8CDC8F0B4FC7AB69AC86C20539EC',
            tracking_number: '860C8CDC8F0B4FC7AB69AC86C20539EC',
            metadata: {
              carrier: 'USPS',
              tracking_number: '860C8CDC8F0B4FC7AB69AC86C20539EC',
              carrier_service: 'Priority',
              tracking_url: 'https://www.example.com/tracking?id=860C8CDC8F0B4FC7AB69AC86C20539EC',
            },
          },
        ],
        {
          metadata: {
            shipbob_shipments: [
              {
                id: 1009099,
                location: {
                  id: 3,
                  name: 'Cicero (IL)',
                },
                tracking: {
                  carrier: 'USPS',
                  tracking_number: '860C8CDC8F0B4FC7AB69AC86C20539EC',
                  carrier_service: 'Priority',
                  tracking_url: 'https://www.example.com/tracking?id=860C8CDC8F0B4FC7AB69AC86C20539EC',
                },
                products: [
                  {
                    id: 0,
                    reference_id: 'TShirtBlueM',
                    name: 'Medium Blue T-Shirt',
                    sku: 'TShirtBlueM',
                    inventory_items: [
                      {
                        id: 0,
                        name: 'Medium Blue T-Shirt',
                        quantity: 0,
                        lot: '22222',
                        expiration_date: '2020-04-09T00:50:01Z',
                        serial_numbers: [
                            'string',
                        ],
                        is_dangerous_goods: true,
                      },
                    ]
                  },
                ],
              },
            ],
          },
        },
      )
    })
  })
})
