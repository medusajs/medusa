import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import idMap from "medusa-test-utils/dist/id-map"
import ReturnService from "../return"
import { ProductVariantInventoryServiceMock } from "../__mocks__/product-variant-inventory"
describe("ReturnService", () => {
  describe("receive", () => {
    const returnRepository = MockRepository({
      findOne: (query) => {
        switch (query.where.id) {
          case IdMap.getId("test-return-2"):
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
          case IdMap.getId("test-return-3"):
            return Promise.resolve({
              status: "canceled",
            })
          default:
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
        }
      },
    })

    const totalsService = {
      getTotal: jest.fn().mockImplementation((cart) => {
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
      withTransaction: function () {
        return this
      },
    }

    const lineItemService = {
      retrieve: jest.fn().mockImplementation((data) => {
        return Promise.resolve({ ...data, returned_quantity: 0 })
      }),
      update: jest.fn(),
      withTransaction: function () {
        return this
      },
    }

    // const inventoryService = {
    //   adjustInventory: jest.fn((variantId, quantity) => {
    //     return Promise.resolve({})
    //   }),
    //   confirmInventory: jest.fn((variantId, quantity) => {
    //     if (quantity < 10) {
    //       return true
    //     } else {
    //       return false
    //     }
    //   }),
    //   withTransaction: function () {
    //     return this
    //   },
    // }

    const returnService = new ReturnService({
      manager: MockManager,
      totalsService,
      lineItemService,
      orderService,
      returnRepository,
      productVariantInventoryService: ProductVariantInventoryServiceMock,
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

      expect(
        ProductVariantInventoryServiceMock.adjustInventory
      ).toHaveBeenCalledTimes(1)
      expect(
        ProductVariantInventoryServiceMock.adjustInventory
      ).toHaveBeenCalledWith("test-variant", undefined, 10)
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

      expect(
        ProductVariantInventoryServiceMock.adjustInventory
      ).toHaveBeenCalledTimes(2)
      expect(
        ProductVariantInventoryServiceMock.adjustInventory
      ).toHaveBeenCalledWith("test-variant", undefined, 10)
      expect(
        ProductVariantInventoryServiceMock.adjustInventory
      ).toHaveBeenCalledWith("test-variant-2", undefined, 10)

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

    it("fails to receive a return which has been canceled", async () => {
      await expect(
        returnService.receive(IdMap.getId("test-return-3"), [
          { item_id: IdMap.getId("test-line"), quantity: 10 },
          { item_id: IdMap.getId("test-line-2"), quantity: 10 },
        ])
      ).rejects.toThrow("Cannot receive a canceled return")
    })
  })

  describe("canceled", () => {
    const returnRepository = MockRepository({
      findOne: (query) => {
        switch (query.where.id) {
          case IdMap.getId("test-return"):
            return Promise.resolve({
              status: "pending",
              refund_amount: 0,
            })
          case IdMap.getId("test-return-2"):
            return Promise.resolve({
              status: "received",
              refund_amount: 0,
            })
          default:
            return Promise.resolve({})
        }
      },
      save: (f) => f,
    })

    const returnService = new ReturnService({
      manager: MockManager,
      returnRepository,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully cancels return", async () => {
      await returnService.cancel(IdMap.getId("test-return"))

      expect(returnRepository.save).toHaveBeenCalledTimes(1)
      expect(returnRepository.save).toHaveBeenCalledWith({
        status: "canceled",
        refund_amount: 0,
      })
    })

    it("fails to cancel return when already received", async () => {
      await expect(
        returnService.cancel(IdMap.getId("test-return-2"))
      ).rejects.toThrow("Can't cancel a return which has been returned")
    })
  })

  describe("fulfilled", () => {
    const returnRepository = MockRepository({
      findOne: (query) => {
        switch (query.where.id) {
          case IdMap.getId("test-return"):
            return Promise.resolve({
              status: "canceled",
            })
          default:
            return Promise.resolve({})
        }
      },
    })

    const returnService = new ReturnService({
      manager: MockManager,
      returnRepository,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("fails to fulfill when return is canceled", async () => {
      await expect(
        returnService.fulfill(IdMap.getId("test-return"))
      ).rejects.toThrow("Cannot fulfill a canceled return")
    })
  })

  describe("update", () => {
    const returnRepository = MockRepository({
      findOne: (query) => {
        switch (query.where.id) {
          case IdMap.getId("test-return"):
            return Promise.resolve({
              status: "canceled",
            })
          default:
            return Promise.resolve({})
        }
      },
    })

    const returnService = new ReturnService({
      manager: MockManager,
      returnRepository,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("fails to update when return is canceled", async () => {
      await expect(
        returnService.update(IdMap.getId("test-return"), {})
      ).rejects.toThrow("Cannot update a canceled return")
    })
  })
})
