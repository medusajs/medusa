import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import idMap from "medusa-test-utils/dist/id-map"
import ReturnService from "../return"
import { InventoryServiceMock } from "../__mocks__/inventory"

describe("ReturnService", () => {
  // describe("requestReturn", () => {
  //   const returnRepository = MockRepository({})

  //   const fulfillmentProviderService = {
  //     createReturn: jest.fn().mockImplementation(data => {
  //       return Promise.resolve(data)
  //     }),
  //   }

  //   const shippingOptionService = {
  //     retrieve: jest.fn().mockImplementation(data => {
  //       return Promise.resolve({
  //         id: IdMap.getId("default"),
  //         name: "default_profile",
  //         provider_id: "default",
  //       })
  //     }),
  //   }

  //   const totalsService = {
  //     getTotal: jest.fn().mockImplementation(cart => {
  //       return 1000
  //     }),
  //     getSubtotal: jest.fn().mockImplementation(cart => {
  //       return 75
  //     }),
  //     getRefundTotal: jest.fn().mockImplementation((order, lineItems) => {
  //       return 1000
  //     }),
  //     getRefundedTotal: jest.fn().mockImplementation((order, lineItems) => {
  //       return 0
  //     }),
  //   }

  //   const returnService = new ReturnService({
  //     manager: MockManager,
  //     totalsService,
  //     shippingOptionService,
  //     fulfillmentProviderService,
  //     returnRepository,
  //   })

  //   beforeEach(async () => {
  //     jest.clearAllMocks()
  //   })

  //   it("successfully requests a return", async () => {
  //     await returnService.requestReturn(
  //       {
  //         id: IdMap.getId("test-order"),
  //         items: [{ id: IdMap.getId("existingLine"), quantity: 10 }],
  //         tax_rate: 0.25,
  //         payment_status: "captured",
  //       },
  //       [
  //         {
  //           item_id: IdMap.getId("existingLine"),
  //           quantity: 10,
  //         },
  //       ],
  //       { id: "some-shipping-method", price: 150 }
  //     )

  //     expect(returnRepository.create).toHaveBeenCalledTimes(1)
  //     expect(returnRepository.create).toHaveBeenCalledWith({
  //       status: "requested",
  //       items: [],
  //       order_id: IdMap.getId("test-order"),
  //       shipping_method: {
  //         id: "some-shipping-method",
  //         price: 150,
  //       },
  //       shipping_data: {
  //         id: "some-shipping-method",
  //         price: 150,
  //       },
  //       refund_amount: 1000 - 150 * (1 + 0.25),
  //     })
  //   })

  //   it("successfully requests a return with custom refund amount", async () => {
  //     await returnService.requestReturn(
  //       {
  //         id: IdMap.getId("test-order"),
  //         items: [{ id: IdMap.getId("existingLine"), quantity: 10 }],
  //         tax_rate: 0.25,
  //         payment_status: "captured",
  //       },
  //       [
  //         {
  //           item_id: IdMap.getId("existingLine"),
  //           quantity: 10,
  //         },
  //       ],
  //       { id: "some-shipping-method", price: 150 },
  //       500
  //     )

  //     expect(returnRepository.create).toHaveBeenCalledTimes(1)
  //     expect(returnRepository.create).toHaveBeenCalledWith({
  //       status: "requested",
  //       items: [],
  //       order_id: IdMap.getId("test-order"),
  //       shipping_method: {
  //         id: "some-shipping-method",
  //         price: 150,
  //       },
  //       shipping_data: expect.anything(),
  //       refund_amount: 500 - 150 * (1 + 0.25),
  //     })
  //   })

  //   it("throws if refund amount is above captured amount", async () => {
  //     try {
  //       await returnService.requestReturn(
  //         {
  //           id: IdMap.getId("test-order"),
  //           items: [{ id: IdMap.getId("existingLine"), quantity: 10 }],
  //           tax_rate: 0.25,
  //           payment_status: "captured",
  //         },
  //         [
  //           {
  //             item_id: IdMap.getId("existingLine"),
  //             quantity: 10,
  //           },
  //         ],
  //         { id: "some-shipping-method", price: 150 },
  //         2000
  //       )
  //     } catch (error) {
  //       expect(error.message).toBe(
  //         "Cannot refund more than the original payment"
  //       )
  //     }
  //   })
  // })

  describe("receive", () => {
    const returnRepository = MockRepository({
      findOne: query => {
        if (query.where.id === IdMap.getId("test-return-2")) {
          return Promise.resolve({
            id: IdMap.getId("test-return-2"),
            status: "requested",
            order: {
              id: IdMap.getId("test-order"),
              items: [
                { id: IdMap.getId("test-line"), quantity: 10 },
                { id: IdMap.getId("test-line-2"), quantity: 10 },
              ],
            },
            items: [
              {
                item_id: IdMap.getId("test-line"),
                quantity: 10,
              },
            ],
          })
        }
        return Promise.resolve({
          id: IdMap.getId("test-return"),
          status: "requested",
          order: {
            id: IdMap.getId("test-order"),
            items: [{ id: IdMap.getId("test-line"), quantity: 10 }],
          },
          items: [
            {
              item_id: IdMap.getId("test-line"),
              quantity: 10,
            },
          ],
        })
      },
    })

    const totalsService = {
      getTotal: jest.fn().mockImplementation(cart => {
        return 1000
      }),
      getRefundedTotal: jest.fn().mockImplementation((order, lineItems) => {
        return 0
      }),
    }

    const orderService = {
      retrieve: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          items: [
            {
              id: IdMap.getId("test-line"),
              quantity: 10,
              returned_quantity: 0,
              variant_id: "test-variant",
            },
            {
              id: IdMap.getId("test-line-2"),
              quantity: 10,
              returned_quantity: 0,
              variant_id: "test-variant-2",
            },
          ],
          payments: [{ id: "payment_test" }],
        })
      }),
      withTransaction: function() {
        return this
      },
    }

    const lineItemService = {
      retrieve: jest.fn().mockImplementation(data => {
        return Promise.resolve({ ...data, returned_quantity: 0 })
      }),
      update: jest.fn(),
      withTransaction: function() {
        return this
      },
    }

    const inventoryService = {
      adjustInventory: jest.fn((variantId, quantity) => {
        return Promise.resolve({})
      }),
      confirmInventory: jest.fn((variantId, quantity) => {
        if (quantity < 10) {
          return true
        } else {
          return false
        }
      }),
      withTransaction: function() {
        return this
      },
    }

    const returnService = new ReturnService({
      manager: MockManager,
      totalsService,
      lineItemService,
      orderService,
      returnRepository,
      inventoryService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully receives a return", async () => {
      await returnService.receive(
        IdMap.getId("test-return"),
        [{ item_id: IdMap.getId("test-line"), quantity: 10 }],
        1000
      )

      expect(returnRepository.save).toHaveBeenCalledTimes(1)
      expect(returnRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("test-return"),
        order: {
          id: IdMap.getId("test-order"),
          items: [{ id: IdMap.getId("test-line"), quantity: 10 }],
        },
        status: "received",
        items: [
          {
            item_id: IdMap.getId("test-line"),
            quantity: 10,
            is_requested: true,
            received_quantity: 10,
            requested_quantity: 10,
          },
        ],
        refund_amount: 1000,
        received_at: expect.anything(),
      })

      expect(lineItemService.update).toHaveBeenCalledTimes(1)
      expect(lineItemService.update).toHaveBeenCalledWith(
        IdMap.getId("test-line"),
        {
          returned_quantity: 10,
        }
      )

      expect(inventoryService.adjustInventory).toHaveBeenCalledTimes(1)
      expect(inventoryService.adjustInventory).toHaveBeenCalledWith(
        "test-variant",
        10
      )
    })

    it("successfully receives a return with requires_action status", async () => {
      await returnService.receive(
        IdMap.getId("test-return-2"),
        [
          { item_id: IdMap.getId("test-line"), quantity: 10 },
          { item_id: IdMap.getId("test-line-2"), quantity: 10 },
        ],
        1000
      )

      expect(inventoryService.adjustInventory).toHaveBeenCalledTimes(2)
      expect(inventoryService.adjustInventory).toHaveBeenCalledWith(
        "test-variant",
        10
      )
      expect(inventoryService.adjustInventory).toHaveBeenCalledWith(
        "test-variant-2",
        10
      )

      expect(returnRepository.save).toHaveBeenCalledTimes(1)
      expect(returnRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("test-return-2"),
        order: {
          id: IdMap.getId("test-order"),
          items: [
            { id: IdMap.getId("test-line"), quantity: 10 },
            { id: IdMap.getId("test-line-2"), quantity: 10 },
          ],
        },
        status: "requires_action",
        items: [
          {
            item_id: IdMap.getId("test-line"),
            quantity: 10,
            is_requested: true,
            received_quantity: 10,
            requested_quantity: 10,
          },
          {
            return_id: IdMap.getId("test-return-2"),
            item_id: IdMap.getId("test-line-2"),
            quantity: 10,
            is_requested: false,
            received_quantity: 10,
            metadata: {},
          },
        ],
        refund_amount: 1000,
        received_at: expect.anything(),
      })
    })
  })
})
