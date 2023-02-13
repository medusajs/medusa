import _ from "lodash"
import { asClass, asValue, createContainer } from "awilix"
import { MedusaError } from "medusa-core-utils"
import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import { FlagRouter } from "../../utils/flag-router"
import CartService from "../cart"
import { ProductVariantInventoryServiceMock } from "../__mocks__/product-variant-inventory"
import { LineItemAdjustmentServiceMock } from "../__mocks__/line-item-adjustment"
import { newTotalsServiceMock } from "../__mocks__/new-totals"
import { taxProviderServiceMock } from "../__mocks__/tax-provider"
import { PaymentSessionStatus } from "../../models"
import { NewTotalsService, TaxProviderService } from "../index"
import { cacheServiceMock } from "../__mocks__/cache"
import { EventBusServiceMock } from "../__mocks__/event-bus"
import { PaymentProviderServiceMock } from "../__mocks__/payment-provider"
import { ProductServiceMock } from "../__mocks__/product"
import { ProductVariantServiceMock } from "../__mocks__/product-variant"
import { RegionServiceMock } from "../__mocks__/region"
import { LineItemServiceMock } from "../__mocks__/line-item"
import { ShippingOptionServiceMock } from "../__mocks__/shipping-option"
import { CustomerServiceMock } from "../__mocks__/customer"
import TaxCalculationStrategy from "../../strategies/tax-calculation"
import SystemTaxService from "../system-tax"
import { IsNull, Not } from "typeorm"

const eventBusService = {
  emit: jest.fn(),
  withTransaction: function () {
    return this
  },
}

describe("CartService", () => {
  const totalsService = {
    withTransaction: function () {
      return this
    },
    getShippingMethodTotals: (m) => {
      return m
    },
    getLineItemTotals: (i) => {
      return i
    },
    getCalculationContext: () => {},
    getTotal: (o) => {
      return o.total || 0
    },
    getSubtotal: (o) => {
      return o.subtotal || 0
    },
    getTaxTotal: (o) => {
      return o.tax_total || 0
    },
    getDiscountTotal: (o) => {
      return o.discount_total || 0
    },
    getShippingTotal: (o) => {
      return o.shipping_total || 0
    },
    getGiftCardTotal: (o) => {
      return o.gift_card_total || 0
    },
  }

  describe("retrieve", () => {
    let result
    const cartRepository = MockRepository({
      findOneWithRelations: () =>
        Promise.resolve({ id: IdMap.getId("emptyCart") }),
    })
    beforeAll(async () => {
      jest.clearAllMocks()
      const cartService = new CartService({
        manager: MockManager,
        totalsService,
        cartRepository,
        taxProviderService: taxProviderServiceMock,
        newTotalsService: newTotalsServiceMock,
        featureFlagRouter: new FlagRouter({}),
      })
      result = await cartService.retrieve(IdMap.getId("emptyCart"))
    })

    it("calls cart model functions", () => {
      expect(cartRepository.findOneWithRelations).toHaveBeenCalledTimes(1)
      expect(cartRepository.findOneWithRelations).toHaveBeenCalledWith(
        undefined,
        {
          where: { id: IdMap.getId("emptyCart") },
          select: undefined,
          relations: undefined,
        }
      )
    })
  })

  describe("setMetadata", () => {
    const cartRepository = MockRepository({
      findOne: () => {
        return Promise.resolve({
          metadata: {
            existing: "something",
          },
        })
      },
    })
    const cartService = new CartService({
      manager: MockManager,
      totalsService,
      cartRepository,
      eventBusService,
      taxProviderService: taxProviderServiceMock,
      newTotalsService: newTotalsServiceMock,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls updateOne with correct params", async () => {
      const id = "testCart"
      await cartService.setMetadata(id, "metadata", "testMetadata")

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(cartRepository.findOne).toBeCalledTimes(1)
      expect(cartRepository.findOne).toBeCalledWith(id)

      expect(cartRepository.save).toBeCalledTimes(1)
      expect(cartRepository.save).toBeCalledWith({
        metadata: {
          existing: "something",
          metadata: "testMetadata",
        },
      })
    })

    it("throw error on invalid key type", async () => {
      const id = "testCart"
      try {
        await cartService.setMetadata(id, 1234, "nono")
      } catch (err) {
        expect(err.message).toEqual(
          "Key type is invalid. Metadata keys must be strings"
        )
      }
    })
  })

  describe("create", () => {
    const regionService = {
      withTransaction: function () {
        return this
      },
      retrieve: () => {
        return {
          id: IdMap.getId("testRegion"),
          countries: [{ iso_2: "us" }],
        }
      },
    }

    const addressRepository = MockRepository({
      create: (c) => c,
      findOne: (id) => {
        return {
          id,
          first_name: "LeBron",
          last_name: "James",
          address_1: "Dunk St",
          city: "Dunkville",
          province: "CA",
          postal_code: "12345",
          country_code: "us",
        }
      },
    })
    const cartRepository = MockRepository()
    const customerService = {
      retrieveUnregisteredByEmail: jest.fn().mockReturnValue(
        Promise.resolve({
          id: IdMap.getId("customer"),
          email: "email@test.com",
          has_account: false,
        })
      ),
      retrieveRegisteredByEmail: jest.fn().mockReturnValue(
        Promise.resolve({
          id: IdMap.getId("customer"),
          email: "email@test.com",
          has_account: true,
        })
      ),
      withTransaction: function () {
        return this
      },
    }
    const cartService = new CartService({
      manager: MockManager,
      addressRepository,
      totalsService,
      cartRepository,
      customerService,
      newTotalsService: newTotalsServiceMock,
      regionService,
      eventBusService,
      taxProviderService: taxProviderServiceMock,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully creates a cart", async () => {
      await cartService.create({
        region_id: IdMap.getId("testRegion"),
        email: "email@test.com",
      })

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "cart.created",
        expect.any(Object)
      )

      expect(addressRepository.create).toHaveBeenCalledTimes(1)
      expect(addressRepository.create).toHaveBeenCalledWith({
        country_code: "us",
      })

      expect(cartRepository.create).toHaveBeenCalledTimes(1)
      expect(cartRepository.create).toHaveBeenCalledWith({
        region_id: IdMap.getId("testRegion"),
        shipping_address: {
          country_code: "us",
        },
        customer_id: IdMap.getId("customer"),
        email: "email@test.com",
        customer: expect.any(Object),
        context: expect.any(Object),
      })

      expect(cartRepository.save).toHaveBeenCalledTimes(1)
    })

    it("should throw shipping country not in region", async () => {
      const res = cartService.create({
        region_id: IdMap.getId("testRegion"),
        shipping_address: {
          first_name: "LeBron",
          last_name: "James",
          address_1: "Dunk St",
          city: "Dunkville",
          province: "CA",
          postal_code: "12345",
          country_code: "pt",
        },
      })

      await expect(res).rejects.toThrow("Shipping country not in region")
    })

    it("a cart with a prefilled shipping address", async () => {
      await cartService.create({
        region_id: IdMap.getId("testRegion"),
        shipping_address: {
          first_name: "LeBron",
          last_name: "James",
          address_1: "Dunk St",
          city: "Dunkville",
          province: "CA",
          postal_code: "12345",
          country_code: "us",
        },
      })

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "cart.created",
        expect.any(Object)
      )

      expect(cartRepository.create).toHaveBeenCalledTimes(1)
      expect(cartRepository.create).toHaveBeenCalledWith({
        context: {},
        region_id: IdMap.getId("testRegion"),
        shipping_address: {
          first_name: "LeBron",
          last_name: "James",
          address_1: "Dunk St",
          city: "Dunkville",
          province: "CA",
          postal_code: "12345",
          country_code: "us",
        },
      })

      expect(cartRepository.save).toHaveBeenCalledTimes(1)
    })
  })

  describe("addLineItem", () => {
    const lineItemService = {
      update: jest.fn().mockImplementation(() => Promise.resolve()),
      list: jest.fn().mockImplementation(() => Promise.resolve([])),
      create: jest.fn(),
      withTransaction: function () {
        return this
      },
    }

    const shippingOptionService = {
      deleteShippingMethods: jest.fn(),
      withTransaction: function () {
        return this
      },
    }

    const productVariantService = {
      retrieve: jest.fn(),
      withTransaction: function () {
        return this
      },
    }

    const productVariantInventoryService = {
      ...ProductVariantInventoryServiceMock,
      confirmInventory: jest
        .fn()
        .mockImplementation((variantId, _quantity, options) => {
          if (variantId !== IdMap.getId("cannot-cover")) {
            return true
          } else {
            throw new MedusaError(
              MedusaError.Types.NOT_ALLOWED,
              `Variant with id: ${variantId} does not have the required inventory`
            )
          }
        }),
    }

    const cartRepository = MockRepository({
      findOneWithRelations: (rels, q) => {
        if (q.where.id === IdMap.getId("cartWithLine")) {
          return Promise.resolve({
            id: IdMap.getId("cartWithLine"),
            items: [
              {
                id: IdMap.getId("merger"),
                title: "will merge",
                variant_id: IdMap.getId("existing"),
                should_merge: true,
                quantity: 1,
              },
            ],
          })
        }
        return Promise.resolve({
          id: IdMap.getId("emptyCart"),
          shipping_methods: [
            {
              shipping_option: {
                profile_id: IdMap.getId("testProfile"),
              },
            },
          ],
          items: [],
        })
      },
    })

    const cartService = new CartService({
      manager: MockManager,
      totalsService,
      cartRepository,
      lineItemService: {
        ...lineItemService,
        list: jest.fn().mockImplementation((where) => {
          if (
            where.cart_id === IdMap.getId("cartWithLine") &&
            where.variant_id === IdMap.getId("existing") &&
            where.should_merge
          ) {
            return Promise.resolve([
              {
                ...where,
                id: IdMap.getId("merger"),
                quantity: 1,
                metadata: {},
              },
            ])
          }

          return Promise.resolve([])
        }),
      },
      lineItemRepository: MockRepository(),
      newTotalsService: newTotalsServiceMock,
      eventBusService,
      shippingOptionService,
      productVariantInventoryService,
      productVariantService,
      lineItemAdjustmentService: LineItemAdjustmentServiceMock,
      taxProviderService: taxProviderServiceMock,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("creates a new line item and emits a created event", async () => {
      const lineItem = {
        title: "New Line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        variant_id: IdMap.getId("can-cover"),
        unit_price: 123,
        quantity: 10,
      }
      await cartService.addLineItem(IdMap.getId("emptyCart"), _.clone(lineItem))

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(lineItemService.create).toHaveBeenCalledTimes(1)
      expect(lineItemService.create).toHaveBeenCalledWith({
        ...lineItem,
        has_shipping: false,
        cart_id: IdMap.getId("emptyCart"),
      })

      expect(
        LineItemAdjustmentServiceMock.createAdjustments
      ).toHaveBeenCalledTimes(1)
      expect(
        LineItemAdjustmentServiceMock.createAdjustments
      ).toHaveBeenCalledWith(
        expect.objectContaining({ id: IdMap.getId("emptyCart") })
      )
    })

    it("successfully creates new line item with shipping", async () => {
      const lineItem = {
        title: "New Line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        should_merge: true,
        variant_id: IdMap.getId("can-cover"),
        variant: {
          product: {
            profile_id: IdMap.getId("testProfile"),
          },
        },
        unit_price: 123,
        quantity: 10,
      }

      await cartService.addLineItem(IdMap.getId("emptyCart"), _.clone(lineItem))

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(lineItemService.create).toHaveBeenCalledTimes(1)
      expect(lineItemService.create).toHaveBeenCalledWith({
        ...lineItem,
        has_shipping: false,
        cart_id: IdMap.getId("emptyCart"),
      })

      expect(
        LineItemAdjustmentServiceMock.createAdjustments
      ).toHaveBeenCalledTimes(1)
      expect(
        LineItemAdjustmentServiceMock.createAdjustments
      ).toHaveBeenCalledWith(
        expect.objectContaining({ id: IdMap.getId("emptyCart") })
      )
    })

    it("successfully merges existing line item", async () => {
      const lineItem = {
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        unit_price: 123,
        variant_id: IdMap.getId("existing"),
        should_merge: true,
        quantity: 1,
        metadata: {},
      }

      await cartService.addLineItem(IdMap.getId("cartWithLine"), lineItem)

      expect(lineItemService.update).toHaveBeenCalledTimes(2)
      expect(lineItemService.update).toHaveBeenNthCalledWith(
        1,
        IdMap.getId("merger"),
        {
          quantity: 2,
        }
      )

      expect(LineItemAdjustmentServiceMock.delete).toHaveBeenCalledTimes(1)
      expect(LineItemAdjustmentServiceMock.delete).toHaveBeenCalledWith({
        item_id: [IdMap.getId("merger")],
        discount_id: expect.objectContaining(Not(IsNull())),
      })

      expect(
        LineItemAdjustmentServiceMock.createAdjustments
      ).toHaveBeenCalledTimes(1)
      expect(
        LineItemAdjustmentServiceMock.createAdjustments
      ).toHaveBeenCalledWith(
        expect.objectContaining({ id: IdMap.getId("cartWithLine") })
      )
    })

    it("throws if inventory isn't covered", async () => {
      const lineItem = {
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        quantity: 1,
        variant_id: IdMap.getId("cannot-cover"),
      }

      await expect(
        cartService.addLineItem(IdMap.getId("cartWithLine"), lineItem)
      ).rejects.toThrow(
        `Variant with id: ${IdMap.getId(
          "cannot-cover"
        )} does not have the required inventory`
      )
    })
  })

  describe("addLineItem w. SalesChannel", () => {
    const lineItemService = {
      update: jest.fn().mockImplementation(() => Promise.resolve()),
      create: jest.fn(),
      list: jest.fn().mockImplementation(() => Promise.resolve([])),
      withTransaction: function () {
        return this
      },
    }

    const shippingOptionService = {
      deleteShippingMethods: jest.fn(),
      withTransaction: function () {
        return this
      },
    }

    const productVariantService = {
      retrieve: jest.fn(),
      withTransaction: function () {
        return this
      },
    }

    const productVariantInventoryService = {
      ...ProductVariantInventoryServiceMock,
      confirmInventory: jest.fn().mockImplementation((variantId, _quantity) => {
        if (variantId !== IdMap.getId("cannot-cover")) {
          return true
        } else {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            `Variant with id: ${variantId} does not have the required inventory`
          )
        }
      }),
    }

    const cartRepository = MockRepository({
      findOneWithRelations: (rels, q) => {
        if (q.where.id === IdMap.getId("cartWithLine")) {
          return Promise.resolve({
            id: IdMap.getId("cartWithLine"),
            items: [
              {
                id: IdMap.getId("merger"),
                title: "will merge",
                variant_id: IdMap.getId("existing"),
                should_merge: true,
                quantity: 1,
              },
            ],
          })
        }
        return Promise.resolve({
          id: IdMap.getId("emptyCart"),
          shipping_methods: [
            {
              shipping_option: {
                profile_id: IdMap.getId("testProfile"),
              },
            },
          ],
          items: [],
        })
      },
    })

    const cartService = new CartService({
      manager: MockManager,
      totalsService,
      cartRepository,
      lineItemService,
      lineItemRepository: MockRepository(),
      newTotalsService: newTotalsServiceMock,
      eventBusService,
      shippingOptionService,
      productVariantInventoryService,
      productVariantService,
      lineItemAdjustmentService: LineItemAdjustmentServiceMock,
      taxProviderService: taxProviderServiceMock,
      featureFlagRouter: new FlagRouter({ sales_channels: true }),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("validates if cart and variant's product belong to the same sales channel if flag is passed", async () => {
      const validateSpy = jest
        .spyOn(cartService, "validateLineItem")
        .mockImplementation(() => Promise.resolve(true))

      const lineItem = {
        title: "New Line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        variant_id: IdMap.getId("can-cover"),
        unit_price: 123,
        quantity: 10,
      }

      await cartService.addLineItem(IdMap.getId("cartWithLine"), lineItem, {
        validateSalesChannels: false,
      })

      expect(cartService.validateLineItem).not.toHaveBeenCalled()

      await cartService.addLineItem(IdMap.getId("cartWithLine"), lineItem)

      expect(cartService.validateLineItem).toHaveBeenCalledTimes(1)

      validateSpy.mockClear()
    })
  })

  describe("removeLineItem", () => {
    const lineItemService = {
      delete: jest.fn(),
      update: jest.fn(),
      withTransaction: function () {
        return this
      },
    }
    const cartRepository = MockRepository({
      findOneWithRelations: (rels, q) => {
        if (q.where.id === IdMap.getId("withShipping")) {
          return Promise.resolve({
            shipping_methods: [
              {
                id: IdMap.getId("ship-method"),
                shipping_option: {
                  profile_id: IdMap.getId("prevPro"),
                },
              },
            ],
            items: [
              {
                id: IdMap.getId("itemToRemove"),
                variant_id: IdMap.getId("existing"),
                variant: {
                  product: {
                    profile_id: IdMap.getId("prevPro"),
                  },
                },
              },
            ],
          })
        }
        return Promise.resolve({
          shipping_methods: [],
          items: [
            {
              id: IdMap.getId("itemToRemove"),
            },
          ],
        })
      },
    })

    const shippingOptionService = {
      deleteShippingMethods: jest.fn(),
      withTransaction: function () {
        return this
      },
    }

    const cartService = new CartService({
      manager: MockManager,
      totalsService,
      cartRepository,
      lineItemService,
      lineItemRepository: MockRepository(),
      newTotalsService: newTotalsServiceMock,
      shippingOptionService,
      eventBusService,
      lineItemAdjustmentService: LineItemAdjustmentServiceMock,
      taxProviderService: taxProviderServiceMock,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully removes a line item", async () => {
      await cartService.removeLineItem(
        IdMap.getId("cartWithLine"),
        IdMap.getId("itemToRemove")
      )

      expect(lineItemService.delete).toHaveBeenCalledTimes(1)
      expect(lineItemService.delete).toHaveBeenCalledWith(
        IdMap.getId("itemToRemove")
      )

      expect(LineItemAdjustmentServiceMock.delete).toHaveBeenCalledTimes(1)
      expect(LineItemAdjustmentServiceMock.delete).toHaveBeenCalledWith({
        item_id: [IdMap.getId("itemToRemove")],
        discount_id: expect.objectContaining(Not(IsNull())),
      })

      expect(
        LineItemAdjustmentServiceMock.createAdjustments
      ).toHaveBeenCalledTimes(1)
      expect(
        LineItemAdjustmentServiceMock.createAdjustments
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [{ id: IdMap.getId("itemToRemove") }],
        })
      )

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )
    })

    it("removes shipping method if not necessary", async () => {
      await cartService.removeLineItem(
        IdMap.getId("withShipping"),
        IdMap.getId("itemToRemove")
      )

      expect(shippingOptionService.deleteShippingMethods).toHaveBeenCalledTimes(
        1
      )
      expect(shippingOptionService.deleteShippingMethods).toHaveBeenCalledWith([
        {
          id: IdMap.getId("ship-method"),
          shipping_option: {
            profile_id: IdMap.getId("prevPro"),
          },
        },
      ])

      expect(LineItemAdjustmentServiceMock.delete).toHaveBeenCalledTimes(1)
      expect(LineItemAdjustmentServiceMock.delete).toHaveBeenCalledWith({
        item_id: [IdMap.getId("itemToRemove")],
        discount_id: expect.objectContaining(Not(IsNull())),
      })

      expect(
        LineItemAdjustmentServiceMock.createAdjustments
      ).toHaveBeenCalledTimes(1)
      expect(
        LineItemAdjustmentServiceMock.createAdjustments
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [expect.objectContaining({ id: IdMap.getId("itemToRemove") })],
        })
      )
    })

    it("resolves if line item is not in cart", async () => {
      await cartService.removeLineItem(
        IdMap.getId("cartWithLine"),
        IdMap.getId("nonExisting")
      )

      expect(lineItemService.delete).toHaveBeenCalledTimes(0)
    })
  })

  describe("update", () => {
    const cartRepository = MockRepository({
      findOneWithRelations: (rels, q) => {
        if (q.where.id === "withpays") {
          return Promise.resolve({
            payment_sessions: [
              {
                id: "test",
              },
            ],
          })
        }
      },
    })

    const cartService = new CartService({
      manager: MockManager,
      cartRepository,
      totalsService,
      eventBusService,
      taxProviderService: taxProviderServiceMock,
      newTotalsService: newTotalsServiceMock,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("retrieves correctly", async () => {
      cartService.setPaymentSessions = jest.fn()
      await cartService.update("withpays", {})

      expect(cartRepository.findOneWithRelations).toHaveBeenCalledWith(
        expect.arrayContaining([
          "items",
          "shipping_methods",
          "shipping_address",
          "billing_address",
          "gift_cards",
          "customer",
          "region",
          "payment_sessions",
          "region.countries",
          "discounts",
          "discounts.rule",
          "discounts.regions",
        ]),
        {
          where: { id: "withpays" },
        }
      )
    })
  })

  describe("updateLineItem", () => {
    const lineItemService = {
      update: jest.fn().mockImplementation(() =>
        Promise.resolve({
          id: IdMap.getId("existing"),
          variant_id: IdMap.getId("good"),
          quantity: 1,
        })
      ),
      retrieve: jest.fn().mockImplementation((lineItemId) => {
        if (lineItemId === IdMap.getId("existing")) {
          return Promise.resolve({
            id: lineItemId,
            cart_id: IdMap.getId("cannot"),
            variant_id: IdMap.getId("cannot-cover"),
          })
        }
        return Promise.resolve({
          id: lineItemId,
          cart_id: IdMap.getId("cartWithLine"),
          is_return: false,
        })
      }),
      withTransaction: function () {
        return this
      },
    }
    const productVariantInventoryService = {
      ...ProductVariantInventoryServiceMock,
      confirmInventory: jest
        .fn()
        .mockImplementation((id) => id !== IdMap.getId("cannot-cover")),
    }

    const cartRepository = MockRepository({
      findOneWithRelations: (rels, q) => {
        if (q.where.id === IdMap.getId("cannot")) {
          return Promise.resolve({
            items: [
              {
                id: IdMap.getId("existing"),
                variant_id: IdMap.getId("cannot-cover"),
                quantity: 1,
              },
            ],
          })
        }
        return Promise.resolve({
          id: IdMap.getId("cartWithLine"),
          total: 100,
          items: [
            {
              id: IdMap.getId("existingUpdate"),
              variant_id: IdMap.getId("good"),
              subtotal: 100,
              quantity: 1,
            },
          ],
        })
      },
    })
    const cartService = new CartService({
      manager: MockManager,
      totalsService,
      cartRepository,
      lineItemService,
      eventBusService,
      newTotalsService: newTotalsServiceMock,
      productVariantInventoryService,
      lineItemAdjustmentService: LineItemAdjustmentServiceMock,
      taxProviderService: taxProviderServiceMock,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully updates existing line item", async () => {
      await cartService.updateLineItem(
        IdMap.getId("cartWithLine"),
        IdMap.getId("existingUpdate"),
        { quantity: 2 }
      )

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(lineItemService.update).toHaveBeenCalledTimes(1)
      expect(lineItemService.update).toHaveBeenCalledWith(
        IdMap.getId("existingUpdate"),
        { quantity: 2 }
      )

      expect(LineItemAdjustmentServiceMock.delete).toHaveBeenCalledTimes(1)
      expect(LineItemAdjustmentServiceMock.delete).toHaveBeenCalledWith({
        item_id: [IdMap.getId("existingUpdate")],
        discount_id: expect.objectContaining(Not(IsNull())),
      })

      expect(
        LineItemAdjustmentServiceMock.createAdjustments
      ).toHaveBeenCalledTimes(1)
      expect(
        LineItemAdjustmentServiceMock.createAdjustments
      ).toHaveBeenCalledWith(
        expect.objectContaining({ id: IdMap.getId("cartWithLine") })
      )
    })

    it("throws if inventory isn't covered", async () => {
      await expect(
        cartService.updateLineItem(
          IdMap.getId("cannot"),
          IdMap.getId("existing"),
          { quantity: 2 }
        )
      ).rejects.toThrow(`Inventory doesn't cover the desired quantity`)
    })
  })

  describe("updateEmail", () => {
    const customerService = {
      retrieveUnregisteredByEmail: jest.fn().mockImplementation((email) => {
        if (email === "no@mail.com") {
          return Promise.reject()
        }
        return Promise.resolve({
          id: IdMap.getId("existing"),
          has_account: false,
          email,
        })
      }),
      create: jest.fn().mockImplementation((data) =>
        Promise.resolve({
          id: IdMap.getId("newCus"),
          email: data.email,
        })
      ),
      withTransaction: function () {
        return this
      },
    }
    const cartRepository = MockRepository({
      findOneWithRelations: () => Promise.resolve({}),
    })
    const cartService = new CartService({
      manager: MockManager,
      totalsService,
      cartRepository,
      eventBusService,
      customerService,
      newTotalsService: newTotalsServiceMock,
      taxProviderService: taxProviderServiceMock,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully updates an email", async () => {
      await cartService.update(IdMap.getId("emptyCart"), {
        email: "test@testDom.com",
      })

      expect(eventBusService.emit).toHaveBeenCalledTimes(2)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(cartRepository.save).toHaveBeenCalledTimes(1)
      expect(cartRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          customer_id: IdMap.getId("existing"),
          customer: {
            id: IdMap.getId("existing"),
            email: "test@testdom.com",
            has_account: false,
          },
          email: "test@testdom.com",
        })
      )
    })

    it("creates a new customer", async () => {
      await cartService.update(IdMap.getId("emptyCart"), {
        email: "no@Mail.com",
      })

      expect(eventBusService.emit).toHaveBeenCalledTimes(2)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(cartRepository.save).toHaveBeenCalledTimes(1)
      expect(cartRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          customer_id: IdMap.getId("newCus"),
          customer: { id: IdMap.getId("newCus"), email: "no@mail.com" },
          email: "no@mail.com",
        })
      )
    })

    it("throws on invalid email", async () => {
      await expect(
        cartService.update(IdMap.getId("emptyCart"), { email: "test@test" })
      ).rejects.toThrow("The email is not valid")
    })
  })

  describe("updateBillingAddress", () => {
    const cartRepository = MockRepository({
      findOneWithRelations: () =>
        Promise.resolve({
          region: { countries: [{ iso_2: "us" }] },
        }),
    })

    const addressRepository = MockRepository({ create: (c) => c })

    const cartService = new CartService({
      manager: MockManager,
      totalsService,
      cartRepository,
      addressRepository,
      eventBusService,
      newTotalsService: newTotalsServiceMock,
      taxProviderService: taxProviderServiceMock,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully updates billing address", async () => {
      const address = {
        first_name: "LeBron",
        last_name: "James",
        address_1: "24 Dunks Drive",
        city: "Los Angeles",
        country_code: "us",
        province: "CA",
        postal_code: "93011",
        phone: "+1 (222) 333 4444",
      }

      await cartService.update(IdMap.getId("emptyCart"), {
        billing_address: address,
      })

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(addressRepository.create).toHaveBeenCalledTimes(1)
      expect(addressRepository.create).toHaveBeenCalledWith({
        ...address,
        country_code: "us",
      })

      expect(cartRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          region: { countries: [{ iso_2: "us" }] },
          billing_address: address,
        })
      )
    })
  })

  describe("updateShippingAddress", () => {
    const cartRepository = MockRepository({
      findOneWithRelations: () =>
        Promise.resolve({
          region: { countries: [{ iso_2: "us" }] },
        }),
    })
    const addressRepository = MockRepository({ create: (c) => c })

    const cartService = new CartService({
      manager: MockManager,
      addressRepository,
      totalsService,
      cartRepository,
      eventBusService,
      newTotalsService: newTotalsServiceMock,
      taxProviderService: taxProviderServiceMock,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully updates shipping address", async () => {
      const address = {
        first_name: "LeBron",
        last_name: "James",
        address_1: "24 Dunks Drive",
        city: "Los Angeles",
        country_code: "us",
        province: "CA",
        postal_code: "93011",
        phone: "+1 (222) 333 4444",
      }

      await cartService.update(IdMap.getId("emptyCart"), {
        shipping_address: address,
      })

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(addressRepository.create).toHaveBeenCalledTimes(1)
      expect(addressRepository.create).toHaveBeenCalledWith({
        ...address,
      })

      expect(cartRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          region: { countries: [{ iso_2: "us" }] },
          shipping_address: address,
        })
      )
    })

    it("throws if country not in region", async () => {
      const address = {
        first_name: "LeBron",
        last_name: "James",
        address_1: "24 Dunks Drive",
        city: "Los Angeles",
        country_code: "ru",
        province: "CA",
        postal_code: "93011",
        phone: "+1 (222) 333 4444",
      }

      await expect(
        cartService.update(IdMap.getId("emptyCart"), {
          shipping_address: address,
        })
      ).rejects.toThrow("Shipping country must be in the cart region")
    })
  })

  describe("setRegion", () => {
    const lineItemService = {
      update: jest.fn((r) => r),
      delete: jest.fn(),
      withTransaction: function () {
        return this
      },
    }
    const addressRepository = MockRepository({ create: (c) => c })
    const productVariantService = {
      getRegionPrice: jest.fn().mockImplementation((id) => {
        if (id === IdMap.getId("fail")) {
          return Promise.reject()
        }
        return Promise.resolve(100)
      }),
    }
    const regionService = {
      retrieve: jest.fn().mockReturnValue(
        Promise.resolve({
          id: "region",
          countries: [{ iso_2: "us" }],
        })
      ),
      withTransaction: function () {
        return this
      },
    }
    const cartRepository = MockRepository({
      findOneWithRelations: () =>
        Promise.resolve({
          items: [
            {
              id: IdMap.getId("testitem"),
              variant_id: IdMap.getId("good"),
            },
            {
              id: IdMap.getId("fail"),
              variant_id: IdMap.getId("fail"),
            },
          ],
          payment_sessions: [{ id: IdMap.getId("removes") }],
          discounts: [
            {
              id: IdMap.getId("stays"),
              regions: [{ id: IdMap.getId("region-us") }],
            },
            {
              id: IdMap.getId("removes"),
              regions: [],
            },
          ],
        }),
    })
    const paymentProviderService = {
      deleteSession: jest.fn(),
      updateSession: jest.fn(),
      createSession: jest.fn(),
      withTransaction: function () {
        return this
      },
    }

    const priceSelectionStrat = {
      withTransaction: function () {
        return this
      },
      calculateVariantPrice: async (variantId, context) => {
        if (variantId === IdMap.getId("fail")) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Money amount for variant with id ${variantId} in region ${context.region_id} does not exist`
          )
        } else {
          return { calculatedPrice: 100 }
        }
      },
    }
    const cartService = new CartService({
      manager: MockManager,
      paymentProviderService,
      addressRepository,
      totalsService,
      cartRepository,
      newTotalsService: newTotalsServiceMock,
      regionService,
      lineItemService,
      lineItemAdjustmentService: LineItemAdjustmentServiceMock,
      productVariantService,
      eventBusService,
      paymentSessionRepository: MockRepository(),
      priceSelectionStrategy: priceSelectionStrat,
      taxProviderService: taxProviderServiceMock,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully set new region", async () => {
      await cartService.update(IdMap.getId("fr-cart"), {
        region_id: IdMap.getId("region-us"),
      })

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(lineItemService.delete).toHaveBeenCalledTimes(1)
      expect(lineItemService.delete).toHaveBeenCalledWith(IdMap.getId("fail"))

      expect(lineItemService.update).toHaveBeenCalledTimes(1)
      expect(lineItemService.update).toHaveBeenCalledWith(
        IdMap.getId("testitem"),
        {
          unit_price: 100,
          has_shipping: false,
        }
      )

      expect(cartRepository.save).toHaveBeenCalledTimes(1)
      expect(cartRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          region_id: "region",
          region: {
            id: "region",
            countries: [{ iso_2: "us" }],
          },
          shipping_address: {
            country_code: "us",
          },
          items: [IdMap.getId("testitem")],
          payment_session: null,
          payment_sessions: [],
          gift_cards: [],
          discounts: [
            {
              id: IdMap.getId("stays"),
              regions: [{ id: IdMap.getId("region-us") }],
            },
          ],
        })
      )
    })
  })

  describe("setPaymentSession", () => {
    const cartRepository = MockRepository({
      findOneWithRelations: (rels, q) => {
        if (q.where.id === IdMap.getId("cartWithLine")) {
          return Promise.resolve({
            total: 100,
            customer: {},
            region: {
              currency_code: "usd",
              payment_providers: [
                {
                  id: "test-provider",
                },
              ],
            },
            items: [],
            shipping_methods: [],
            payment_sessions: [
              {
                id: IdMap.getId("test-session"),
                provider_id: "test-provider",
              },
            ],
          })
        } else if (q.where.id === IdMap.getId("cartWithLine2")) {
          return Promise.resolve({
            total: 100,
            customer: {},
            region: {
              currency_code: "usd",
              payment_providers: [
                {
                  id: "test-provider",
                },
              ],
            },
            items: [],
            shipping_methods: [],
            payment_sessions: [
              {
                id: IdMap.getId("test-session"),
                provider_id: "test-provider",
                is_initiated: true,
              },
            ],
          })
        }
      },
    })

    const paymentSessionRepository = MockRepository({})

    const paymentProviderService = {
      deleteSession: jest.fn(),
      updateSession: jest.fn(),
      createSession: jest.fn().mockImplementation(() => {
        return { id: IdMap.getId("test-session") }
      }),
      withTransaction: function () {
        return this
      },
    }

    const cartService = new CartService({
      manager: MockManager,
      paymentSessionRepository,
      paymentProviderService,
      totalsService,
      cartRepository,
      eventBusService,
      taxProviderService: taxProviderServiceMock,
      newTotalsService: newTotalsServiceMock,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully sets a payment method and create it remotely", async () => {
      const providerId = "test-provider"

      await cartService.setPaymentSession(
        IdMap.getId("cartWithLine"),
        providerId
      )

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        CartService.Events.UPDATED,
        expect.any(Object)
      )

      expect(paymentProviderService.createSession).toHaveBeenCalledWith({
        cart: expect.any(Object),
        customer: expect.any(Object),
        amount: expect.any(Number),
        currency_code: expect.any(String),
        provider_id: providerId,
        payment_session_id: IdMap.getId("test-session"),
      })
      expect(paymentSessionRepository.update).toHaveBeenCalledWith(
        IdMap.getId("test-session"),
        {
          is_selected: true,
          is_initiated: true,
        }
      )
    })

    it("successfully sets a payment method and update it remotely", async () => {
      const providerId = "test-provider"

      await cartService.setPaymentSession(
        IdMap.getId("cartWithLine2"),
        providerId
      )

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        CartService.Events.UPDATED,
        expect.any(Object)
      )

      expect(paymentProviderService.updateSession).toHaveBeenCalledWith(
        expect.objectContaining({
          id: IdMap.getId("test-session"),
        }),
        {
          cart: expect.any(Object),
          customer: expect.any(Object),
          amount: expect.any(Number),
          currency_code: expect.any(String),
          provider_id: providerId,
          payment_session_id: IdMap.getId("test-session"),
        }
      )
    })

    it("fails if the region does not contain the provider_id", async () => {
      await expect(
        cartService.setPaymentSession(IdMap.getId("cartWithLine"), "unknown")
      ).rejects.toThrow(`The payment method is not available in this region`)
    })
  })

  describe("setPaymentSessions", () => {
    const provider1Id = "provider_1"
    const provider2Id = "provider_2"

    const cart1 = {
      total: 100,
      items: [{ subtotal: 100 }],
      shipping_methods: [],
      payment_sessions: [],
      region: {
        payment_providers: [{ id: provider1Id }, { id: provider2Id }],
      },
    }

    const cart2 = {
      total: 100,
      items: [],
      shipping_methods: [],
      payment_sessions: [{ provider_id: provider1Id }],
      region: {
        payment_providers: [{ id: provider1Id }, { id: provider2Id }],
      },
    }

    const cart3 = {
      total: 100,
      items: [{ subtotal: 100 }],
      shipping_methods: [{ subtotal: 100 }],
      payment_sessions: [
        { provider_id: provider1Id },
        { provider_id: "not_in_region" },
      ],
      region: {
        payment_providers: [{ id: provider1Id }, { id: provider2Id }],
      },
    }

    const cart4 = {
      total: 0,
      items: [{ total: 0 }],
      shipping_methods: [],
      payment_sessions: [
        { provider_id: provider1Id },
        { provider_id: provider2Id },
      ],
      region: {
        payment_providers: [{ id: provider1Id }, { id: provider2Id }],
      },
    }

    const cart5 = {
      total: 100,
      items: [{ subtotal: 100 }],
      shipping_methods: [],
      payment_sessions: [
        { provider_id: provider1Id, is_initiated: true },
        { provider_id: provider2Id, is_selected: true, is_initiated: true },
      ],
      region: {
        payment_providers: [{ id: provider1Id }, { id: provider2Id }],
      },
    }

    const cartRepository = MockRepository({
      findOneWithRelations: (rels, q) => {
        if (q.where.id === IdMap.getId("cart-to-filter")) {
          return Promise.resolve(cart3)
        }
        if (q.where.id === IdMap.getId("cart-with-session")) {
          return Promise.resolve(cart2)
        }
        if (q.where.id === IdMap.getId("cart-remove")) {
          return Promise.resolve(cart4)
        }
        if (q.where.id === IdMap.getId("cart-negative")) {
          return Promise.resolve(cart4)
        }
        if (
          q.where.id === IdMap.getId("cartWithMixedSelectedInitiatedSessions")
        ) {
          return Promise.resolve(cart5)
        }
        return Promise.resolve(cart1)
      },
    })

    const paymentProviderService = {
      deleteSession: jest.fn(),
      updateSession: jest.fn(),
      createSession: jest.fn(),
      withTransaction: function () {
        return this
      },
    }

    const paymentSessionRepositoryMock = MockRepository({})

    const cartService = new CartService({
      manager: MockManager,
      paymentSessionRepository: paymentSessionRepositoryMock,
      totalsService,
      cartRepository,
      paymentProviderService,
      eventBusService,
      taxProviderService: taxProviderServiceMock,
      newTotalsService: newTotalsServiceMock,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("initializes payment sessions for each of the providers", async () => {
      await cartService.setPaymentSessions(IdMap.getId("cartWithLine"))

      expect(paymentSessionRepositoryMock.create).toHaveBeenCalledTimes(2)
      expect(paymentSessionRepositoryMock.save).toHaveBeenCalledTimes(2)

      expect(paymentSessionRepositoryMock.create).toHaveBeenCalledWith({
        cart_id: IdMap.getId("cartWithLine"),
        status: PaymentSessionStatus.PENDING,
        amount: cart1.total,
        provider_id: provider1Id,
        data: {},
      })

      expect(paymentSessionRepositoryMock.create).toHaveBeenCalledWith({
        cart_id: IdMap.getId("cartWithLine"),
        status: PaymentSessionStatus.PENDING,
        amount: cart1.total,
        provider_id: provider2Id,
        data: {},
      })
    })

    it("delete or update payment sessions remotely depending if they are selected and/or initiated", async () => {
      await cartService.setPaymentSessions(
        IdMap.getId("cartWithMixedSelectedInitiatedSessions")
      )

      // Selected, update
      expect(paymentProviderService.updateSession).toHaveBeenCalledTimes(1)
      expect(paymentProviderService.updateSession).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          provider_id: provider2Id,
        })
      )

      // Not selected, but initiated, delete
      expect(paymentProviderService.deleteSession).toHaveBeenCalledTimes(1)
      expect(paymentProviderService.deleteSession).toHaveBeenCalledWith(
        expect.objectContaining({
          provider_id: provider1Id,
        })
      )

      expect(paymentSessionRepositoryMock.save).toHaveBeenCalledTimes(1)
    })

    it("filters sessions not available in the region", async () => {
      await cartService.setPaymentSessions(IdMap.getId("cart-to-filter"))

      expect(paymentSessionRepositoryMock.create).toHaveBeenCalledTimes(1)
      expect(paymentSessionRepositoryMock.save).toHaveBeenCalledTimes(2) // create and update
      expect(paymentSessionRepositoryMock.delete).toHaveBeenCalledTimes(1)
      expect(paymentSessionRepositoryMock.delete).toHaveBeenCalledWith({
        provider_id: "not_in_region",
      })
    })

    it("removes if cart total === 0", async () => {
      await cartService.setPaymentSessions(IdMap.getId("cart-remove"))

      expect(paymentSessionRepositoryMock.delete).toHaveBeenCalledTimes(2)

      expect(paymentSessionRepositoryMock.delete).toHaveBeenCalledWith({
        provider_id: provider1Id,
      })
      expect(paymentSessionRepositoryMock.delete).toHaveBeenCalledWith({
        provider_id: provider2Id,
      })
    })

    it("removes if cart total < 0", async () => {
      await cartService.setPaymentSessions(IdMap.getId("cart-negative"))

      expect(paymentSessionRepositoryMock.delete).toHaveBeenCalledTimes(2)

      expect(paymentSessionRepositoryMock.delete).toHaveBeenCalledWith({
        provider_id: provider1Id,
      })
      expect(paymentSessionRepositoryMock.delete).toHaveBeenCalledWith({
        provider_id: provider2Id,
      })
    })
  })

  describe("findCustomShippingOption", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    const cartService = new CartService({})

    it("given a cart with custom shipping options and a shipping option id corresponding to a custom shipping option, then it should return a custom shipping option", async () => {
      const cartCSO = [
        { id: "cso-test", shipping_option_id: "test-so", price: 20 },
      ]
      const result = cartService.findCustomShippingOption(cartCSO, "test-so")

      expect(result).toEqual({
        id: "cso-test",
        shipping_option_id: "test-so",
        price: 20,
      })
    })

    it("given a cart with empty custom shipping options and shipping option id, then it should return undefined", async () => {
      const cartCSO = []

      const result = cartService.findCustomShippingOption(cartCSO, "test-so")

      expect(result).toBeUndefined()
    })

    it("given a cart with custom shipping options and a shipping option id that does not belong to the cart, then it should throw an invalid error", async () => {
      const cartCSO = [
        { id: "cso-test", shipping_option_id: "test-so", price: 500 },
      ]

      expect(() => {
        cartService.findCustomShippingOption(cartCSO, "some-other-so")
      }).toThrow(Error)
    })
  })

  describe("addShippingMethod", () => {
    const buildCart = (id, config = {}) => {
      return {
        id: IdMap.getId(id),
        items: (config.items || []).map((i) => ({
          id: IdMap.getId(i.id),
          variant: {
            product: {
              profile_id: IdMap.getId(i.profile),
            },
          },
        })),
        shipping_methods: (config.shipping_methods || []).map((m) => ({
          id: IdMap.getId(m.id),
          shipping_option: {
            profile_id: IdMap.getId(m.profile),
          },
        })),
        discounts: [],
      }
    }

    const cart1 = buildCart("cart")
    const cart2 = buildCart("existing", {
      shipping_methods: [{ id: "ship1", profile: "profile1" }],
    })
    const cart3 = buildCart("lines", {
      items: [{ id: "line", profile: "profile1", subtotal: 100 }],
    })
    const cartWithCustomSO = buildCart("cart-with-custom-so")

    const cartRepository = MockRepository({
      findOneWithRelations: (rels, q) => {
        switch (q.where.id) {
          case IdMap.getId("lines"):
            return Promise.resolve(cart3)
          case IdMap.getId("existing"):
            return Promise.resolve(cart2)
          case IdMap.getId("cart-with-custom-so"):
            return Promise.resolve(cartWithCustomSO)
          default:
            return Promise.resolve(cart1)
        }
      },
    })

    const lineItemService = {
      update: jest.fn(),
      withTransaction: function () {
        return this
      },
    }
    const shippingOptionService = {
      createShippingMethod: jest.fn().mockImplementation((id) => {
        return Promise.resolve({
          shipping_option: {
            profile_id: id,
          },
        })
      }),
      deleteShippingMethods: jest.fn(),
      withTransaction: function () {
        return this
      },
    }

    const customShippingOptionService = {
      withTransaction: function () {
        return this
      },
      list: jest.fn().mockImplementation(({ cart_id }) => {
        if (cart_id === IdMap.getId("cart-with-custom-so")) {
          return [
            {
              id: "cso-test",
              shipping_profile_id: "test-so",
              cart_id: IdMap.getId("cart-with-custom-so"),
            },
          ]
        }
      }),
    }

    const cartService = new CartService({
      manager: MockManager,
      totalsService,
      cartRepository,
      shippingOptionService,
      lineItemService,
      eventBusService,
      customShippingOptionService,
      newTotalsService: newTotalsServiceMock,
      taxProviderService: taxProviderServiceMock,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully adds the shipping method", async () => {
      const data = {
        id: "test",
        extra: "yes",
      }

      await cartService.addShippingMethod(
        IdMap.getId("cart"),
        IdMap.getId("option"),
        data
      )
      expect(shippingOptionService.createShippingMethod).toHaveBeenCalledWith(
        IdMap.getId("option"),
        data,
        { cart: cart1 }
      )
    })

    it("successfully overrides existing profile shipping method", async () => {
      const data = {
        id: "testshipperid",
      }
      await cartService.addShippingMethod(
        IdMap.getId("existing"),
        IdMap.getId("profile1"),
        data
      )
      expect(shippingOptionService.createShippingMethod).toHaveBeenCalledWith(
        IdMap.getId("profile1"),
        data,
        { cart: cart2 }
      )
      expect(shippingOptionService.deleteShippingMethods).toHaveBeenCalledWith({
        id: IdMap.getId("ship1"),
        shipping_option: {
          profile_id: IdMap.getId("profile1"),
        },
      })
    })

    it("successfully adds additional shipping method", async () => {
      const data = {
        id: "additional_shipper_id",
      }

      await cartService.addShippingMethod(
        IdMap.getId("existing"),
        IdMap.getId("additional"),
        data
      )

      expect(shippingOptionService.deleteShippingMethods).toHaveBeenCalledTimes(
        0
      )
      expect(shippingOptionService.createShippingMethod).toHaveBeenCalledTimes(
        1
      )
      expect(shippingOptionService.createShippingMethod).toHaveBeenCalledWith(
        IdMap.getId("additional"),
        data,
        { cart: cart2 }
      )
    })

    it("updates item shipping", async () => {
      const data = {
        id: "shipper",
      }

      await cartService.addShippingMethod(
        IdMap.getId("lines"),
        IdMap.getId("profile1"),
        data
      )

      expect(shippingOptionService.deleteShippingMethods).toHaveBeenCalledTimes(
        0
      )
      expect(shippingOptionService.createShippingMethod).toHaveBeenCalledTimes(
        1
      )
      expect(shippingOptionService.createShippingMethod).toHaveBeenCalledWith(
        IdMap.getId("profile1"),
        data,
        { cart: cart3 }
      )

      expect(lineItemService.update).toHaveBeenCalledTimes(1)
      expect(lineItemService.update).toHaveBeenCalledWith(IdMap.getId("line"), {
        has_shipping: true,
      })
    })

    it("successfully adds a shipping method from a custom shipping option and custom price", async () => {
      const data = {
        id: "test",
        extra: "yes",
      }

      cartService.findCustomShippingOption = jest
        .fn()
        .mockImplementation((cartCustomShippingOptions) => {
          return {
            price: 0,
          }
        })

      await cartService.addShippingMethod(
        IdMap.getId("cart-with-custom-so"),
        IdMap.getId("test-so"),
        data
      )
      expect(shippingOptionService.createShippingMethod).toHaveBeenCalledWith(
        IdMap.getId("test-so"),
        data,
        {
          cart_id: IdMap.getId("cart-with-custom-so"),
          price: 0,
        }
      )
    })
  })

  describe("applyDiscount", () => {
    const getOffsetDate = (offset) => {
      const date = new Date()
      date.setDate(date.getDate() + offset)
      return date
    }

    const cartRepository = MockRepository({
      findOneWithRelations: (rels, q) => {
        if (q.where.id === IdMap.getId("with-d")) {
          return Promise.resolve({
            id: IdMap.getId("cart"),
            discounts: [
              {
                code: "1234",
                rule: {
                  type: "fixed",
                },
              },
              {
                code: "FS1234",
                rule: {
                  type: "free_shipping",
                },
              },
            ],
            region_id: IdMap.getId("good"),
            items: [
              {
                id: "li1",
                quantity: 2,
                unit_price: 1000,
              },
              {
                id: "li2",
                quantity: 1,
                unit_price: 500,
              },
            ],
          })
        }
        if (q.where.id === "with-d-and-customer") {
          return Promise.resolve({
            id: "with-d-and-customer",
            discounts: [
              {
                code: "ApplicableForCustomer",
                rule: {
                  type: "fixed",
                },
              },
            ],
            region_id: IdMap.getId("good"),
          })
        }
        return Promise.resolve({
          id: IdMap.getId("cart"),
          discounts: [],
          region_id: IdMap.getId("good"),
          items: [
            {
              id: "li1",
              quantity: 2,
              unit_price: 1000,
            },
            {
              id: "li2",
              quantity: 1,
              unit_price: 500,
            },
          ],
        })
      },
    })

    const discountService = {
      withTransaction: function () {
        return this
      },
      listByCodes: jest.fn().mockImplementation((code) => {
        const codes = Array.isArray(code) ? code : [code]

        const data = []

        for (const code of codes) {
          if (code === "US10") {
            data.push({
              regions: [{ id: IdMap.getId("bad") }],
            })
          }
          if (code === "limit-reached") {
            data.push({
              id: IdMap.getId("limit-reached"),
              code: "limit-reached",
              regions: [{ id: IdMap.getId("good") }],
              rule: {},
              usage_count: 2,
              usage_limit: 2,
            })
          }
          if (code === "null-count") {
            data.push({
              id: IdMap.getId("null-count"),
              code: "null-count",
              regions: [{ id: IdMap.getId("good") }],
              rule: {},
              usage_count: null,
              usage_limit: 2,
            })
          }
          if (code === "FREESHIPPING") {
            data.push({
              id: IdMap.getId("freeship"),
              code: "FREESHIPPING",
              regions: [{ id: IdMap.getId("good") }],
              rule: {
                type: "free_shipping",
              },
            })
          }
          if (code === "EarlyDiscount") {
            data.push({
              id: IdMap.getId("10off"),
              code: "10%OFF",
              regions: [{ id: IdMap.getId("good") }],
              rule: {
                type: "percentage",
              },
              starts_at: getOffsetDate(1),
              ends_at: getOffsetDate(10),
            })
          }
          if (code === "ExpiredDiscount") {
            data.push({
              id: IdMap.getId("10off"),
              code: "10%OFF",
              regions: [{ id: IdMap.getId("good") }],
              rule: {
                type: "percentage",
              },
              ends_at: getOffsetDate(-1),
              starts_at: getOffsetDate(-10),
            })
          }
          if (code === "ExpiredDynamicDiscount") {
            data.push({
              id: IdMap.getId("10off"),
              code: "10%OFF",
              is_dynamic: true,
              regions: [{ id: IdMap.getId("good") }],
              rule: {
                type: "percentage",
              },
              starts_at: getOffsetDate(-10),
              ends_at: getOffsetDate(-1),
            })
          }
          if (code === "ExpiredDynamicDiscountEndDate") {
            data.push({
              id: IdMap.getId("10off"),
              is_dynamic: true,
              code: "10%OFF",
              regions: [{ id: IdMap.getId("good") }],
              rule: {
                type: "percentage",
              },
              starts_at: getOffsetDate(-10),
              ends_at: getOffsetDate(-3),
              valid_duration: "P0Y0M1D",
            })
          }
          if (code === "ValidDiscount") {
            data.push({
              id: IdMap.getId("10off"),
              code: "10%OFF",
              regions: [{ id: IdMap.getId("good") }],
              rule: {
                type: "percentage",
              },
              starts_at: getOffsetDate(-10),
              ends_at: getOffsetDate(10),
            })
          }
          if (code === "ApplicableForCustomer") {
            data.push({
              id: "ApplicableForCustomer",
              code: "ApplicableForCustomer",
              regions: [{ id: IdMap.getId("good") }],
              rule: {
                id: "test-rule",
                type: "percentage",
              },
              starts_at: getOffsetDate(-10),
              ends_at: getOffsetDate(10),
            })
          }

          if (!data.length) {
            data.push({
              id: IdMap.getId("10off"),
              code: "10%OFF",
              regions: [{ id: IdMap.getId("good") }],
              rule: {
                type: "percentage",
              },
            })
          }
        }

        if (Array.isArray(code)) {
          return Promise.resolve(data)
        }

        return Promise.resolve(data[0])
      }),
      canApplyForCustomer: jest
        .fn()
        .mockImplementation((ruleId, customerId) => {
          if (ruleId === "test-rule") {
            return Promise.resolve(true)
          }
          if (!customerId) {
            return Promise.resolve(false)
          }
          return Promise.resolve(false)
        }),
      validateDiscountForCartOrThrow: jest
        .fn()
        .mockImplementation((cart, discount) => {
          return Promise.resolve({ hasErrors: () => false })
        }),
    }

    const cartService = new CartService({
      manager: MockManager,
      totalsService,
      cartRepository,
      discountService,
      eventBusService,
      lineItemAdjustmentService: LineItemAdjustmentServiceMock,
      taxProviderService: taxProviderServiceMock,
      newTotalsService: newTotalsServiceMock,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully applies discount to cart", async () => {
      await cartService.update(IdMap.getId("fr-cart"), {
        discounts: [
          {
            code: "10%OFF",
          },
        ],
      })
      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(cartRepository.save).toHaveBeenCalledTimes(1)
      expect(cartRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: IdMap.getId("cart"),
          region_id: IdMap.getId("good"),
          items: [
            {
              id: "li1",
              quantity: 2,
              unit_price: 1000,
            },
            {
              id: "li2",
              quantity: 1,
              unit_price: 500,
            },
          ],
          discounts: [
            {
              id: IdMap.getId("10off"),
              code: "10%OFF",
              regions: [{ id: IdMap.getId("good") }],
              rule: {
                type: "percentage",
              },
            },
          ],
        })
      )

      expect(LineItemAdjustmentServiceMock.delete).toHaveBeenCalledTimes(1)
      expect(LineItemAdjustmentServiceMock.delete).toHaveBeenCalledWith({
        item_id: ["li1", "li2"],
        discount_id: expect.objectContaining(Not(IsNull())),
      })

      expect(
        LineItemAdjustmentServiceMock.createAdjustments
      ).toHaveBeenCalledTimes(1)
      expect(
        LineItemAdjustmentServiceMock.createAdjustments
      ).toHaveBeenCalledWith(
        expect.objectContaining({ id: IdMap.getId("cart") })
      )
    })

    it("successfully applies discount to cart and removes old one", async () => {
      await cartService.update(IdMap.getId("with-d"), {
        discounts: [{ code: "10%OFF" }],
      })

      expect(cartRepository.save).toHaveBeenCalledTimes(1)
      expect(cartRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: IdMap.getId("cart"),
          region_id: IdMap.getId("good"),
          items: [
            {
              id: "li1",
              quantity: 2,
              unit_price: 1000,
            },
            {
              id: "li2",
              quantity: 1,
              unit_price: 500,
            },
          ],
          discounts: [
            {
              id: IdMap.getId("10off"),
              code: "10%OFF",
              regions: [{ id: IdMap.getId("good") }],
              rule: {
                type: "percentage",
              },
            },
          ],
        })
      )

      expect(LineItemAdjustmentServiceMock.delete).toHaveBeenCalledTimes(1)
      expect(LineItemAdjustmentServiceMock.delete).toHaveBeenCalledWith({
        item_id: ["li1", "li2"],
        discount_id: expect.objectContaining(Not(IsNull())),
      })

      expect(
        LineItemAdjustmentServiceMock.createAdjustments
      ).toHaveBeenCalledTimes(1)
      expect(
        LineItemAdjustmentServiceMock.createAdjustments
      ).toHaveBeenCalledWith(
        expect.objectContaining({ id: IdMap.getId("cart") })
      )
    })

    it("successfully applies free shipping", async () => {
      await cartService.update(IdMap.getId("with-d"), {
        discounts: [{ code: "10%OFF" }, { code: "FREESHIPPING" }],
      })

      expect(discountService.listByCodes).toHaveBeenCalledTimes(1)
      expect(cartRepository.save).toHaveBeenCalledTimes(1)
      expect(cartRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: IdMap.getId("cart"),
          discounts: [
            {
              id: IdMap.getId("10off"),
              code: "10%OFF",
              regions: [{ id: IdMap.getId("good") }],
              rule: {
                type: "percentage",
              },
            },
            {
              id: IdMap.getId("freeship"),
              code: "FREESHIPPING",
              regions: [{ id: IdMap.getId("good") }],
              rule: {
                type: "free_shipping",
              },
            },
          ],
          items: [
            {
              id: "li1",
              quantity: 2,
              unit_price: 1000,
            },
            {
              id: "li2",
              quantity: 1,
              unit_price: 500,
            },
          ],
          region_id: IdMap.getId("good"),
        })
      )

      expect(LineItemAdjustmentServiceMock.delete).toHaveBeenCalledTimes(1)
      expect(LineItemAdjustmentServiceMock.delete).toHaveBeenCalledWith({
        item_id: ["li1", "li2"],
        discount_id: expect.objectContaining(Not(IsNull())),
      })

      expect(
        LineItemAdjustmentServiceMock.createAdjustments
      ).toHaveBeenCalledTimes(1)
      expect(
        LineItemAdjustmentServiceMock.createAdjustments
      ).toHaveBeenCalledWith(
        expect.objectContaining({ id: IdMap.getId("cart") })
      )
    })

    it("successfully applies discount with a check for customer applicableness", async () => {
      await cartService.update("with-d-and-customer", {
        discounts: [
          {
            code: "ApplicableForCustomer",
          },
        ],
      })
      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(cartRepository.save).toHaveBeenCalledTimes(1)
      expect(cartRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "with-d-and-customer",
          region_id: IdMap.getId("good"),
          discounts: [
            {
              id: "ApplicableForCustomer",
              code: "ApplicableForCustomer",
              regions: [{ id: IdMap.getId("good") }],
              rule: {
                id: "test-rule",
                type: "percentage",
              },
              starts_at: expect.any(Date),
              ends_at: expect.any(Date),
            },
          ],
        })
      )
    })

    it("successfully remove all discounts that have been applied", async () => {
      await cartService.update(IdMap.getId("with-d"), {
        discounts: [],
      })

      expect(LineItemAdjustmentServiceMock.delete).toHaveBeenCalledTimes(1)
      expect(
        LineItemAdjustmentServiceMock.createAdjustments
      ).toHaveBeenCalledTimes(1)

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(cartRepository.save).toHaveBeenCalledTimes(1)
      expect(cartRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: IdMap.getId("cart"),
          region_id: IdMap.getId("good"),
          items: [
            {
              id: "li1",
              quantity: 2,
              unit_price: 1000,
            },
            {
              id: "li2",
              quantity: 1,
              unit_price: 500,
            },
          ],
          discounts: [],
        })
      )
    })
  })

  describe("removeDiscount", () => {
    const cartRepository = MockRepository({
      findOneWithRelations: (rels, q) => {
        return Promise.resolve({
          id: IdMap.getId("cart"),
          discounts: [
            {
              code: "1234",
              rule: {
                type: "fixed",
              },
            },
            {
              code: "FS1234",
              rule: {
                type: "free_shipping",
              },
            },
          ],
          items: [],
          region_id: IdMap.getId("good"),
        })
      },
    })

    const cartService = new CartService({
      manager: MockManager,
      totalsService,
      cartRepository,
      eventBusService,
      lineItemAdjustmentService: LineItemAdjustmentServiceMock,
      taxProviderService: taxProviderServiceMock,
      newTotalsService: newTotalsServiceMock,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully removes discount", async () => {
      await cartService.removeDiscount(IdMap.getId("fr-cart"), "1234")

      expect(LineItemAdjustmentServiceMock.delete).toHaveBeenCalledTimes(1)
      expect(
        LineItemAdjustmentServiceMock.createAdjustments
      ).toHaveBeenCalledTimes(1)

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(cartRepository.save).toHaveBeenCalledTimes(1)
      expect(cartRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("cart"),
        region_id: IdMap.getId("good"),
        items: [],
        discounts: [
          {
            code: "FS1234",
            rule: {
              type: "free_shipping",
            },
          },
        ],
      })
    })
  })

  describe("decorateTotals integration", () => {
    const legacyTotalServiceMock = {
      ...totalsService,
      getCalculationContext: () => ({
        shipping_methods: [],
        region: {
          tax_rate: 10,
          currency_code: "eur",
        },
        allocation_map: {},
      }),
    }
    // TODO: extract that to a fixture to be used in this file in the rest of the tests. Needs some update on the registration
    // as it is for now adapted to this case
    const container = createContainer()
    container
      .register("manager", asValue(MockManager))
      .register("paymentSessionRepository", asValue(MockRepository({})))
      .register("addressRepository", asValue(MockRepository({})))
      .register("cartRepository", asValue(MockRepository({})))
      .register("lineItemRepository", asValue(MockRepository({})))
      .register("shippingMethodRepository", asValue(MockRepository({})))
      .register("paymentProviderService", asValue(PaymentProviderServiceMock))
      .register("productService", asValue(ProductServiceMock))
      .register("productVariantService", asValue(ProductVariantServiceMock))
      .register("regionService", asValue(RegionServiceMock))
      .register("lineItemService", asValue(LineItemServiceMock))
      .register("shippingOptionService", asValue(ShippingOptionServiceMock))
      .register("customerService", asValue(CustomerServiceMock))
      .register("discountService", asValue({}))
      .register("giftCardService", asValue({}))
      .register("totalsService", asValue(legacyTotalServiceMock))
      .register("customShippingOptionService", asValue({}))
      .register("lineItemAdjustmentService", asValue({}))
      .register("priceSelectionStrategy", asValue({}))
      .register("productVariantInventoryService", asValue({}))
      .register("salesChannelService", asValue({}))
      .register("storeService", asValue({}))
      .register("featureFlagRouter", asValue(new FlagRouter({})))
      .register("taxRateService", asValue({}))
      .register("systemTaxService", asValue(new SystemTaxService()))
      .register("tp_test", asValue("good"))
      .register("cacheService", asValue(cacheServiceMock))
      .register("taxProviderRepository", asValue(MockRepository))
      .register(
        "lineItemTaxLineRepository",
        asValue(MockRepository({ create: (d) => d }))
      )
      .register("shippingMethodTaxLineRepository", asValue(MockRepository))
      .register("eventBusService", asValue(EventBusServiceMock))
      // Register the real class for the service below to do the integration tests
      .register("taxCalculationStrategy", asClass(TaxCalculationStrategy))
      .register("taxProviderService", asClass(TaxProviderService))
      .register("newTotalsService", asClass(NewTotalsService))
      .register("cartService", asClass(CartService))

    const cartService = container.resolve("cartService")

    it("should decorate totals with a cart containing custom items", async () => {
      const cart = {
        id: IdMap.getId("cartWithPaySessions"),
        region_id: IdMap.getId("testRegion"),
        items: [
          {
            id: IdMap.getId("existingLine"),
            title: "merge line",
            description: "This is a new line",
            thumbnail: "test-img-yeah.com/thumb",
            variant_id: null,
            unit_price: 100,
            quantity: 10,
          },
        ],
        shipping_address: {},
        billing_address: {},
        discounts: [],
        region: {
          tax_rate: 10,
          currency_code: "eur",
        },
        gift_cards: [],
      }

      const totals = await cartService.decorateTotals(cart, {
        force_taxes: true,
      })

      expect(totals.total).toEqual(1000)
      expect(totals.subtotal).toEqual(1000)
    })
  })
})
