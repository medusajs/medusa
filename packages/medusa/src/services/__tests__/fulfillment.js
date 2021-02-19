import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import FulfillmentService from "../fulfillment"

describe("FulfillmentService", () => {
  describe("createFulfillment", () => {
    const fulfillmentRepository = MockRepository({})

    const fulfillmentProviderService = {
      createFulfillment: jest.fn().mockImplementation(data => {
        return Promise.resolve(data)
      }),
    }

    const shippingProfileService = {
      retrieve: jest.fn().mockImplementation(data => {
        return Promise.resolve({
          id: IdMap.getId("default"),
          name: "default_profile",
          products: [IdMap.getId("product")],
          shipping_options: [],
        })
      }),
    }

    const fulfillmentService = new FulfillmentService({
      manager: MockManager,
      fulfillmentProviderService,
      fulfillmentRepository,
      shippingProfileService,
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
          items: [{ id: IdMap.getId("test-line"), quantity: 10 }],
        },
        [
          {
            item_id: IdMap.getId("test-line"),
            quantity: 10,
          },
        ],
        { order_id: "test", metadata: {} }
      )

      expect(fulfillmentRepository.create).toHaveBeenCalledTimes(1)
      expect(fulfillmentRepository.create).toHaveBeenCalledWith({
        order_id: "test",
        provider_id: "GLS Express",
        items: [{ item_id: IdMap.getId("test-line"), quantity: 10 }],
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

  describe("createShipment", () => {
    const trackingLinkRepository = MockRepository({ create: c => c })
    const fulfillmentRepository = MockRepository({
      findOne: () => Promise.resolve({ id: IdMap.getId("fulfillment") }),
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
  })
})
