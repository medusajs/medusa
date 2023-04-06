import { MockManager, MockRepository } from "medusa-test-utils"
import { EventBusServiceMock } from "../__mocks__/event-bus"
import DraftOrderService from "../draft-order"
import { LineItemAdjustmentServiceMock } from "../__mocks__/line-item-adjustment"

const eventBusService = {
  emit: jest.fn(),
  withTransaction: function () {
    return this
  },
}

describe("DraftOrderService", () => {
  describe("create", () => {
    const regionService = {
      retrieve: () =>
        Promise.resolve({ id: "test-region", countries: [{ iso_2: "dk" }] }),
      withTransaction: function () {
        return this
      },
    }

    const shippingOptionService = {
      createShippingMethod: jest.fn().mockImplementation(() =>
        Promise.resolve({
          shipping_option: {
            profile_id: "test-profile",
          },
        })
      ),
      withTransaction: function () {
        return this
      },
    }

    const lineItemService = {
      generate: jest.fn().mockImplementation(() =>
        Promise.resolve([
          {
            title: "test-item",
            variant_id: "test-variant",
          },
        ])
      ),
      create: jest.fn().mockImplementation((data) => data),
      withTransaction: function () {
        return this
      },
    }

    const productVariantService = {
      retrieve: () =>
        Promise.resolve({
          id: "test-variant",
          product: {
            profile_id: "test-profile",
          },
        }),
      withTransaction: function () {
        return this
      },
    }

    const testOrder = {
      region_id: "test-region",
      shipping_address_id: "test-shipping",
      billing_address_id: "test-billing",
      customer_id: "test-customer",
      items: [
        { id: "test", variant_id: "test-variant", quantity: 2, metadata: {} },
      ],
      shipping_methods: [
        {
          option_id: "test-option",
          data: {},
        },
      ],
    }

    const cartService = {
      create: jest.fn().mockImplementation((data) =>
        Promise.resolve({
          id: "test-cart",
          ...data,
        })
      ),
      retrieve: jest.fn().mockReturnValue(
        Promise.resolve({
          id: "test-cart",
          ...testOrder,
        })
      ),
      retrieveWithTotals: jest.fn().mockReturnValue(
        Promise.resolve({
          id: "test-cart",
          ...testOrder,
        })
      ),
      update: jest.fn(),
      applyDiscount: jest.fn(),
      addShippingMethod: jest.fn(),
      withTransaction: function () {
        return this
      },
    }

    const addressRepository = MockRepository({
      create: (addr) => ({
        ...addr,
      }),
    })

    const draftOrderRepository = MockRepository({
      create: (d) => ({
        ...d,
      }),
      save: (d) => ({
        id: "test-draft-order",
        ...d,
      }),
    })

    const draftOrderService = new DraftOrderService({
      manager: MockManager,
      regionService,
      cartService,
      shippingOptionService,
      lineItemService,
      lineItemAdjustmentService: LineItemAdjustmentServiceMock,
      productVariantService,
      draftOrderRepository,
      addressRepository,
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("creates a draft order", async () => {
      const cartId = "test-cart"
      const title = "test-item"

      await draftOrderService.create(testOrder)

      expect(draftOrderRepository.create).toHaveBeenCalledTimes(1)
      expect(draftOrderRepository.create).toHaveBeenCalledWith({
        cart_id: cartId,
      })

      expect(cartService.create).toHaveBeenCalledTimes(1)
      expect(cartService.create).toHaveBeenCalledWith({
        region_id: "test-region",
        shipping_address_id: "test-shipping",
        billing_address_id: "test-billing",
        customer_id: "test-customer",
        type: "draft_order",
      })

      expect(cartService.addShippingMethod).toHaveBeenCalledTimes(1)
      expect(cartService.addShippingMethod).toHaveBeenCalledWith(
        {
          id: "test-cart",
          ...testOrder,
        },
        "test-option",
        {}
      )

      expect(lineItemService.generate).toHaveBeenCalledTimes(1)
      expect(lineItemService.generate).toHaveBeenCalledWith(
        [
          {
            variantId: "test-variant",
            quantity: 2,
            metadata: {},
            unit_price: undefined,
          },
        ],
        {
          region_id: "test-region",
        }
      )

      expect(lineItemService.create).toHaveBeenCalledTimes(1)
      expect(lineItemService.create).toHaveBeenCalledWith([
        {
          cart_id: cartId,
          title,
          variant_id: "test-variant",
        },
      ])

      expect(cartService.applyDiscount).toHaveBeenCalledTimes(0)
    })

    it("creates a draft order with a discount", async () => {
      const cartId = "test-cart"
      const title = "test-item"

      const originalTestOrder = { ...testOrder }

      testOrder["discounts"] = [{ code: "TEST" }]
      await draftOrderService.create(testOrder)

      expect(draftOrderRepository.create).toHaveBeenCalledTimes(1)
      expect(draftOrderRepository.create).toHaveBeenCalledWith({
        cart_id: cartId,
      })

      expect(cartService.create).toHaveBeenCalledTimes(1)
      expect(cartService.create).toHaveBeenCalledWith({
        region_id: "test-region",
        shipping_address_id: "test-shipping",
        billing_address_id: "test-billing",
        customer_id: "test-customer",
        type: "draft_order",
      })

      expect(cartService.addShippingMethod).toHaveBeenCalledTimes(1)
      expect(cartService.addShippingMethod).toHaveBeenCalledWith(
        {
          id: "test-cart",
          ...originalTestOrder,
        },
        "test-option",
        {}
      )

      expect(lineItemService.generate).toHaveBeenCalledTimes(1)
      expect(lineItemService.generate).toHaveBeenCalledWith(
        [
          {
            variantId: "test-variant",
            quantity: 2,
            metadata: {},
            unit_price: undefined,
          },
        ],
        {
          region_id: "test-region",
        }
      )

      expect(lineItemService.create).toHaveBeenCalledTimes(1)
      expect(lineItemService.create).toHaveBeenCalledWith([
        {
          cart_id: cartId,
          title,
          variant_id: "test-variant",
        },
      ])

      expect(cartService.update).toHaveBeenCalledTimes(1)
      expect(cartService.update).toHaveBeenCalledWith(cartId, {
        discounts: testOrder.discounts,
      })
    })

    it("fails on missing region", async () => {
      try {
        await draftOrderService.create({
          items: [],
        })
      } catch (error) {
        expect(error.message).toEqual(
          `region_id is required to create a draft order`
        )
      }
    })

    it("creating a draft order without items is allowed", async () => {
      await draftOrderService.create({
        region_id: "test-region",
        items: [],
        shipping_methods: [],
      })
    })
  })

  describe("update", () => {
    const testOrder = {
      region_id: "test-region",
      shipping_address_id: "test-shipping",
      billing_address_id: "test-billing",
      customer_id: "test-customer",
      items: [{ variant_id: "test-variant", quantity: 2, metadata: {} }],
      shipping_methods: [
        {
          option_id: "test-option",
          data: {},
        },
      ],
    }

    const completedOrder = {
      status: "completed",
      ...testOrder,
    }

    const draftOrderRepository = MockRepository({
      create: (d) => ({
        ...d,
      }),
      save: (d) => ({
        id: "test-draft-order",
        ...d,
      }),
      findOne: (q) => {
        switch (q.where.id) {
          case "completed":
            return Promise.resolve(completedOrder)
          default:
            return Promise.resolve(testOrder)
        }
      },
    })

    const draftOrderService = new DraftOrderService({
      manager: MockManager,
      regionService: undefined,
      cartService: undefined,
      shippingOptionService: undefined,
      lineItemService: undefined,
      lineItemAdjustmentService: LineItemAdjustmentServiceMock,
      productVariantService: undefined,
      draftOrderRepository,
      addressRepository: undefined,
      eventBusService: EventBusServiceMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls draftOrder model functions", async () => {
      await draftOrderService.update("test-draft-order", {
        no_notification_order: true,
      })

      expect(draftOrderRepository.save).toHaveBeenCalledTimes(1)
      expect(draftOrderRepository.save).toHaveBeenCalledWith({
        no_notification_order: true,
        billing_address_id: "test-billing",
        customer_id: "test-customer",
        items: [
          {
            metadata: {},
            quantity: 2,
            variant_id: "test-variant",
          },
        ],
        region_id: "test-region",
        shipping_address_id: "test-shipping",
        shipping_methods: [
          {
            data: {},
            option_id: "test-option",
          },
        ],
      })
    })

    it("fails to update draftOrder when already complete", async () => {
      await expect(draftOrderService.update("completed", {})).rejects.toThrow(
        "Can't update a draft order which is complete"
      )
    })
  })
})
