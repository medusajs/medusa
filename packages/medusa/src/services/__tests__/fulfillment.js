import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import FulfillmentService from "../fulfillment"
import { ProductVariantInventoryServiceMock } from "../__mocks__/product-variant-inventory"

describe("FulfillmentService", () => {
  describe("createFulfillment", () => {
    const fulfillmentRepository = MockRepository({})

    const fulfillmentProviderService = {
      createFulfillment: jest.fn().mockImplementation((data) => {
        return Promise.resolve(data)
      }),
    }

    const shippingProfileService = {
      retrieve: jest.fn().mockImplementation((data) => {
        return Promise.resolve({
          id: IdMap.getId("default"),
          name: "default_profile",
          products: [IdMap.getId("product")],
          shipping_options: [],
        })
      }),
    }

    const lineItemRepository = {
      create: jest.fn().mockImplementation((data) => {
        return data
      }),
    }

    const fulfillmentService = new FulfillmentService({
      manager: MockManager,
      fulfillmentProviderService,
      fulfillmentRepository,
      shippingProfileService,
      lineItemRepository,
      productVariantInventoryService: ProductVariantInventoryServiceMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully create a fulfillment", async () => {
      await fulfillmentService.createFulfillment(
        {
          shipping_methods: [
            {
              shipping_option: {
                profile_id: IdMap.getId("default"),
                provider_id: "GLS Express",
              },
            },
          ],
          items: [{ id: IdMap.getId("test-line"), quantity: 9 }],
        },
        [
          {
            item_id: IdMap.getId("test-line"),
            quantity: 9,
          },
        ],
        { order_id: "test", metadata: {} }
      )

      expect(fulfillmentRepository.create).toHaveBeenCalledTimes(1)
      expect(fulfillmentRepository.create).toHaveBeenCalledWith({
        order_id: "test",
        provider_id: "GLS Express",
        items: [{ item_id: IdMap.getId("test-line"), quantity: 9 }],
        data: expect.anything(),
        metadata: {},
      })
    })

    it("throws if too many items are requested fulfilled", async () => {
      await expect(
        fulfillmentService.createFulfillment(
          {
            shipping_methods: [
              {
                profile_id: IdMap.getId("default"),
                provider_id: "GLS Express",
              },
            ],
            items: [
              {
                id: IdMap.getId("test-line"),
                quantity: 10,
                fulfilled_quantity: 0,
              },
            ],
          },
          [
            {
              item_id: IdMap.getId("test-line"),
              quantity: 12,
            },
          ]
        )
      ).rejects.toThrow("Cannot fulfill more items than have been purchased")
    })
  })

  describe("cancelFulfillment", () => {
    const fulfillmentRepository = MockRepository({
      findOne: () =>
        Promise.resolve({
          canceled_at: new Date(),
          items: [{ item_id: 1, quantity: 2 }],
        }),
      save: (f) => f,
    })

    const lineItemService = {
      retrieve: jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve({ id: 1, fulfilled_quantity: 2 })
        ),
      update: jest.fn(),
      withTransaction: function () {
        return this
      },
    }

    const fulfillmentProviderService = {
      cancelFulfillment: (f) => f,
    }

    const fulfillmentService = new FulfillmentService({
      manager: MockManager,
      fulfillmentProviderService,
      fulfillmentRepository,
      lineItemService,
      productVariantInventoryService: ProductVariantInventoryServiceMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("correctly cancels fulfillment", async () => {
      await fulfillmentService.cancelFulfillment(IdMap.getId("fulfillment"))

      expect(fulfillmentRepository.save).toHaveBeenCalledTimes(1)
      expect(fulfillmentRepository.save).toHaveBeenCalledWith({
        canceled_at: expect.any(Date),
        items: expect.any(Array),
      })

      expect(lineItemService.retrieve).toHaveBeenCalledTimes(1)
      expect(lineItemService.retrieve).toHaveBeenCalledWith(1)
      expect(lineItemService.update).toHaveBeenCalledTimes(1)
      expect(lineItemService.update).toHaveBeenCalledWith(1, {
        fulfilled_quantity: 0,
      })
    })
  })

  describe("createShipment", () => {
    const trackingLinkRepository = MockRepository({ create: (c) => c })
    const fulfillmentRepository = MockRepository({
      findOne: (q) => {
        switch (q.where.id) {
          case IdMap.getId("canceled"):
            return Promise.resolve({ canceled_at: new Date() })
          default:
            return Promise.resolve({ id: IdMap.getId("fulfillment") })
        }
      },
    })

    const fulfillmentService = new FulfillmentService({
      manager: MockManager,
      fulfillmentRepository,
      trackingLinkRepository,
    })

    const now = new Date()
    beforeEach(async () => {
      jest.clearAllMocks()
      jest.spyOn(global, "Date").mockImplementationOnce(() => now)
    })

    it("calls order model functions", async () => {
      await fulfillmentService.createShipment(
        IdMap.getId("fulfillment"),
        [{ tracking_number: "1234" }, { tracking_number: "2345" }],
        {}
      )

      expect(fulfillmentRepository.save).toHaveBeenCalledTimes(1)
      expect(fulfillmentRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("fulfillment"),
        tracking_links: [
          { tracking_number: "1234" },
          { tracking_number: "2345" },
        ],
        metadata: {},
        shipped_at: now,
      })
    })

    it("fails when status is canceled", async () => {
      await expect(
        fulfillmentService.createShipment(
          IdMap.getId("canceled"),
          [({ tracking_number: "1234" }, { tracking_number: "2345" })],
          {}
        )
      ).rejects.toThrow("Fulfillment has been canceled")
    })
  })
})
