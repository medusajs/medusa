import _ from "lodash"
import { IdMap, MockRepository, MockManager } from "medusa-test-utils"
import DraftOrderService from "../draft-order"

const eventBusService = {
  emit: jest.fn(),
  withTransaction: function() {
    return this
  },
}

describe("DraftOrderService", () => {
  const totalsService = {
    getTotal: o => {
      return o.total || 0
    },
    getSubtotal: o => {
      return o.subtotal || 0
    },
    getTaxTotal: o => {
      return o.tax_total || 0
    },
    getDiscountTotal: o => {
      return o.discount_total || 0
    },
    getShippingTotal: o => {
      return o.shipping_total || 0
    },
    getGiftCardTotal: o => {
      return o.gift_card_total || 0
    },
  }

  describe("create", () => {
    let result

    const regionService = {
      retrieve: () =>
        Promise.resolve({ id: "test-region", countries: [{ iso_2: "dk" }] }),
      withTransaction: function() {
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
      withTransaction: function() {
        return this
      },
    }

    const lineItemService = {
      generate: jest.fn().mockImplementation(() =>
        Promise.resolve({
          title: "test-item",
          variant_id: "test-variant",
        })
      ),
      create: jest.fn(),
      withTransaction: function() {
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
      withTransaction: function() {
        return this
      },
    }

    const cartService = {
      create: jest.fn().mockImplementation(data =>
        Promise.resolve({
          id: "test-cart",
          ...data,
        })
      ),
      addShippingMethod: jest.fn(),
      withTransaction: function() {
        return this
      },
    }

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

    const addressRepository = MockRepository({
      create: addr => ({
        ...addr,
      }),
    })

    const draftOrderRepository = MockRepository({
      create: d => ({
        ...d,
      }),
      save: d => ({
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
      productVariantService,
      draftOrderRepository,
      addressRepository,
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("creates a draft order", async () => {
      await draftOrderService.create(testOrder)

      expect(draftOrderRepository.create).toHaveBeenCalledTimes(1)
      expect(draftOrderRepository.create).toHaveBeenCalledWith({
        cart_id: "test-cart",
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
        "test-cart",
        "test-option",
        {}
      )

      expect(lineItemService.generate).toHaveBeenCalledTimes(1)
      expect(lineItemService.generate).toHaveBeenCalledWith(
        "test-variant",
        "test-region",
        2,
        { metadata: {}, unit_price: undefined }
      )

      expect(lineItemService.create).toHaveBeenCalledTimes(1)
      expect(lineItemService.create).toHaveBeenCalledWith({
        cart_id: "test-cart",
        title: "test-item",
        variant_id: "test-variant",
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

    it("fails on missing items", async () => {
      try {
        await draftOrderService.create({
          region_id: "test-region",
          items: [],
        })
      } catch (error) {
        expect(error.message).toEqual(
          `Items are required to create a draft order`
        )
      }
    })
  })
})
