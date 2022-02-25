import _ from "lodash"
import { IdMap, MockRepository, MockManager } from "medusa-test-utils"
import CartService from "../cart"
import { InventoryServiceMock } from "../__mocks__/inventory"
import { MedusaError } from "medusa-core-utils"

const eventBusService = {
  emit: jest.fn(),
  withTransaction: function () {
    return this
  },
}

describe("CartService", () => {
  const totalsService = {
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
      })
      result = await cartService.retrieve(IdMap.getId("emptyCart"))
    })

    it("calls cart model functions", () => {
      expect(cartRepository.findOneWithRelations).toHaveBeenCalledTimes(1)
      expect(cartRepository.findOneWithRelations).toHaveBeenCalledWith(
        undefined,
        {
          where: { id: IdMap.getId("emptyCart") },
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

  describe("deleteMetadata", () => {
    const cartRepository = MockRepository({
      findOne: (id) => {
        if (id === "empty") {
          return Promise.resolve({
            metadata: {},
          })
        }
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
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls updateOne with correct params", async () => {
      const id = "testCart"
      await cartService.deleteMetadata(id, "existing")

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(cartRepository.findOne).toBeCalledTimes(1)
      expect(cartRepository.findOne).toBeCalledWith(id)

      expect(cartRepository.save).toBeCalledTimes(1)
      expect(cartRepository.save).toBeCalledWith({
        metadata: {},
      })
    })

    it("works when metadata is empty", async () => {
      const id = "empty"
      await cartService.deleteMetadata(id, "existing")

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(cartRepository.findOne).toBeCalledTimes(1)
      expect(cartRepository.findOne).toBeCalledWith(id)

      expect(cartRepository.save).toBeCalledTimes(1)
      expect(cartRepository.save).toBeCalledWith({
        metadata: {},
      })
    })

    it("throw error on invalid key type", async () => {
      try {
        await cartService.deleteMetadata("testCart", 1234)
      } catch (err) {
        expect(err.message).toEqual(
          "Key type is invalid. Metadata keys must be strings"
        )
      }
    })
  })

  describe("create", () => {
    const regionService = {
      retrieve: () => {
        return {
          id: IdMap.getId("testRegion"),
          countries: [{ iso_2: "us" }],
        }
      },
    }

    const addressRepository = MockRepository({ create: (c) => c })
    const cartRepository = MockRepository()
    const customerService = {
      retrieveByEmail: jest.fn().mockReturnValue(
        Promise.resolve({
          id: IdMap.getId("customer"),
          email: "email@test.com",
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
      regionService,
      eventBusService,
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
      })

      expect(cartRepository.save).toHaveBeenCalledTimes(1)
    })

    it("creates a cart with a prefilled shipping address", async () => {
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

    it("creates a cart with a prefilled shipping address", async () => {
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
      update: jest.fn(),
      create: jest.fn(),
      withTransaction: function () {
        return this
      },
    }

    const shippingOptionService = {
      deleteShippingMethod: jest.fn(),
      withTransaction: function () {
        return this
      },
    }

    const inventoryService = {
      ...InventoryServiceMock,
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
      eventBusService,
      shippingOptionService,
      inventoryService,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully creates new line item", async () => {
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
      }

      await cartService.addLineItem(IdMap.getId("cartWithLine"), lineItem)

      expect(lineItemService.update).toHaveBeenCalledTimes(2)
      expect(lineItemService.update).toHaveBeenCalledWith(
        IdMap.getId("merger"),
        {
          quantity: 2,
        }
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
      deleteShippingMethod: jest.fn(),
      withTransaction: function () {
        return this
      },
    }

    const cartService = new CartService({
      manager: MockManager,
      totalsService,
      cartRepository,
      lineItemService,
      shippingOptionService,
      eventBusService,
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

      expect(shippingOptionService.deleteShippingMethod).toHaveBeenCalledTimes(
        1
      )
      expect(shippingOptionService.deleteShippingMethod).toHaveBeenCalledWith({
        id: IdMap.getId("ship-method"),
        shipping_option: {
          profile_id: IdMap.getId("prevPro"),
        },
      })
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
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("retrieves correctly", async () => {
      cartService.setPaymentSessions = jest.fn()
      await cartService.update("withpays", {})

      expect(cartRepository.findOneWithRelations).toHaveBeenCalledWith(
        [
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
          "discounts.rule.valid_for",
          "discounts.regions",
          "items.tax_lines",
          "region.tax_rates",
        ],
        {
          where: { id: "withpays" },
        }
      )
    })
  })

  describe("updateLineItem", () => {
    const lineItemService = {
      update: jest.fn(),
      withTransaction: function () {
        return this
      },
    }
    const inventoryService = {
      ...InventoryServiceMock,
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
          items: [
            {
              id: IdMap.getId("existing"),
              variant_id: IdMap.getId("good"),
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
      inventoryService,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully updates existing line item", async () => {
      await cartService.updateLineItem(
        IdMap.getId("cartWithLine"),
        IdMap.getId("existing"),
        { quantity: 2 }
      )

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(lineItemService.update).toHaveBeenCalledTimes(1)
      expect(lineItemService.update).toHaveBeenCalledWith(
        IdMap.getId("existing"),
        { quantity: 2 }
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
      retrieveByEmail: jest.fn().mockImplementation((email) => {
        if (email === "no@mail.com") {
          return Promise.reject()
        }
        return Promise.resolve({
          id: IdMap.getId("existing"),
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
      expect(cartRepository.save).toHaveBeenCalledWith({
        customer_id: IdMap.getId("existing"),
        customer: {
          id: IdMap.getId("existing"),
          email: "test@testdom.com",
        },
        email: "test@testdom.com",
        discount_total: 0,
        shipping_total: 0,
        subtotal: 0,
        tax_total: 0,
        total: 0,
      })
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
      expect(cartRepository.save).toHaveBeenCalledWith({
        customer_id: IdMap.getId("newCus"),
        customer: { id: IdMap.getId("newCus"), email: "no@mail.com" },
        email: "no@mail.com",
        discount_total: 0,
        shipping_total: 0,
        subtotal: 0,
        tax_total: 0,
        total: 0,
      })
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
        country_code: "US",
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

      expect(cartRepository.save).toHaveBeenCalledWith({
        region: { countries: [{ iso_2: "us" }] },
        discount_total: 0,
        shipping_total: 0,
        subtotal: 0,
        tax_total: 0,
        total: 0,
        billing_address: address,
      })
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

      expect(cartRepository.save).toHaveBeenCalledWith({
        region: { countries: [{ iso_2: "us" }] },
        discount_total: 0,
        shipping_total: 0,
        subtotal: 0,
        tax_total: 0,
        total: 0,
        shipping_address: address,
      })
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
    }
    const cartRepository = MockRepository({
      findOneWithRelations: () =>
        Promise.resolve({
          items: [
            {
              id: IdMap.getId("testitem"),
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
    const cartService = new CartService({
      manager: MockManager,
      paymentProviderService,
      addressRepository,
      totalsService,
      cartRepository,
      regionService,
      lineItemService,
      productVariantService,
      eventBusService,
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
      expect(cartRepository.save).toHaveBeenCalledWith({
        region_id: "region",
        region: {
          id: "region",
          countries: [{ iso_2: "us" }],
        },
        shipping_address: {
          country_code: "us",
        },
        items: [IdMap.getId("testitem"), null],
        payment_session: null,
        payment_sessions: [],
        gift_cards: [],
        discount_total: 0,
        shipping_total: 0,
        subtotal: 0,
        tax_total: 0,
        total: 0,
        discounts: [
          {
            id: IdMap.getId("stays"),
            regions: [{ id: IdMap.getId("region-us") }],
          },
        ],
      })
    })
  })

  describe("setPaymentSession", () => {
    const cartRepository = MockRepository({
      findOneWithRelations: () => {
        return Promise.resolve({
          region: {
            payment_providers: [
              {
                id: "test-provider",
              },
            ],
          },
          payment_sessions: [
            {
              id: IdMap.getId("test-session"),
              provider_id: "test-provider",
            },
          ],
        })
      },
    })

    const paymentSessionRepository = MockRepository({})

    const cartService = new CartService({
      manager: MockManager,
      paymentSessionRepository,
      totalsService,
      cartRepository,
      eventBusService,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully sets a payment method", async () => {
      await cartService.setPaymentSession(
        IdMap.getId("cartWithLine"),
        "test-provider"
      )

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )
      expect(paymentSessionRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("test-session"),
        provider_id: "test-provider",
        is_selected: true,
      })
    })

    it("fails if the region does not contain the provider_id", async () => {
      await expect(
        cartService.setPaymentSession(IdMap.getId("cartWithLine"), "unknown")
      ).rejects.toThrow(`The payment method is not available in this region`)
    })
  })

  describe("setPaymentSessions", () => {
    const cart1 = {
      total: 100,
      payment_sessions: [],
      region: {
        payment_providers: [{ id: "provider_1" }, { id: "provider_2" }],
      },
    }

    const cart2 = {
      total: 100,
      payment_sessions: [{ provider_id: "provider_1" }],
      region: {
        payment_providers: [{ id: "provider_1" }, { id: "provider_2" }],
      },
    }

    const cart3 = {
      total: 100,
      payment_sessions: [
        { provider_id: "provider_1" },
        { provider_id: "not_in_region" },
      ],
      region: {
        payment_providers: [{ id: "provider_1" }, { id: "provider_2" }],
      },
    }

    const cart4 = {
      total: 0,
      payment_sessions: [
        { provider_id: "provider_1" },
        { provider_id: "provider_2" },
      ],
      region: {
        payment_providers: [{ id: "provider_1" }, { id: "provider_2" }],
      },
    }

    const cart5 = {
      total: -1,
      payment_sessions: [
        { provider_id: "provider_1" },
        { provider_id: "provider_2" },
      ],
      region: {
        payment_providers: [{ id: "provider_1" }, { id: "provider_2" }],
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

    const cartService = new CartService({
      manager: MockManager,
      totalsService,
      cartRepository,
      paymentProviderService,
      eventBusService,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("initializes payment sessions for each of the providers", async () => {
      await cartService.setPaymentSessions(IdMap.getId("cartWithLine"))

      expect(paymentProviderService.createSession).toHaveBeenCalledTimes(2)
      expect(paymentProviderService.createSession).toHaveBeenCalledWith(
        "provider_1",
        cart1
      )
      expect(paymentProviderService.createSession).toHaveBeenCalledWith(
        "provider_2",
        cart1
      )
    })

    it("filters sessions not available in the region", async () => {
      await cartService.setPaymentSessions(IdMap.getId("cart-to-filter"))

      expect(paymentProviderService.createSession).toHaveBeenCalledTimes(1)
      expect(paymentProviderService.updateSession).toHaveBeenCalledTimes(1)
      expect(paymentProviderService.deleteSession).toHaveBeenCalledTimes(1)
      expect(paymentProviderService.deleteSession).toHaveBeenCalledWith({
        provider_id: "not_in_region",
      })
    })

    it("removes if cart total === 0", async () => {
      await cartService.setPaymentSessions(IdMap.getId("cart-remove"))

      expect(paymentProviderService.updateSession).toHaveBeenCalledTimes(0)
      expect(paymentProviderService.createSession).toHaveBeenCalledTimes(0)
      expect(paymentProviderService.deleteSession).toHaveBeenCalledTimes(2)
      expect(paymentProviderService.deleteSession).toHaveBeenCalledWith({
        provider_id: "provider_1",
      })
      expect(paymentProviderService.deleteSession).toHaveBeenCalledWith({
        provider_id: "provider_2",
      })
    })

    it("removes if cart total < 0", async () => {
      await cartService.setPaymentSessions(IdMap.getId("cart-negative"))

      expect(paymentProviderService.updateSession).toHaveBeenCalledTimes(0)
      expect(paymentProviderService.createSession).toHaveBeenCalledTimes(0)
      expect(paymentProviderService.deleteSession).toHaveBeenCalledTimes(2)
      expect(paymentProviderService.deleteSession).toHaveBeenCalledWith({
        provider_id: "provider_1",
      })
      expect(paymentProviderService.deleteSession).toHaveBeenCalledWith({
        provider_id: "provider_2",
      })
    })
  })

  describe("findCustomShippingOption", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    let cartService = new CartService({})

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
      items: [{ id: "line", profile: "profile1" }],
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
      deleteShippingMethod: jest.fn(),
      withTransaction: function () {
        return this
      },
    }

    const customShippingOptionService = {
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
      expect(shippingOptionService.deleteShippingMethod).toHaveBeenCalledWith({
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

      expect(shippingOptionService.deleteShippingMethod).toHaveBeenCalledTimes(
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

      expect(shippingOptionService.deleteShippingMethod).toHaveBeenCalledTimes(
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
          })
        }
        return Promise.resolve({
          id: IdMap.getId("cart"),
          discounts: [],
          region_id: IdMap.getId("good"),
        })
      },
    })

    const discountService = {
      retrieveByCode: jest.fn().mockImplementation((code) => {
        if (code === "US10") {
          return Promise.resolve({
            regions: [{ id: IdMap.getId("bad") }],
          })
        }
        if (code === "limit-reached") {
          return Promise.resolve({
            id: IdMap.getId("limit-reached"),
            code: "limit-reached",
            regions: [{ id: IdMap.getId("good") }],
            rule: {},
            usage_count: 2,
            usage_limit: 2,
          })
        }
        if (code === "null-count") {
          return Promise.resolve({
            id: IdMap.getId("null-count"),
            code: "null-count",
            regions: [{ id: IdMap.getId("good") }],
            rule: {},
            usage_count: null,
            usage_limit: 2,
          })
        }
        if (code === "FREESHIPPING") {
          return Promise.resolve({
            id: IdMap.getId("freeship"),
            code: "FREESHIPPING",
            regions: [{ id: IdMap.getId("good") }],
            rule: {
              type: "free_shipping",
            },
          })
        }
        if (code === "EarlyDiscount") {
          return Promise.resolve({
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
          return Promise.resolve({
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
          return Promise.resolve({
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
          return Promise.resolve({
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
          return Promise.resolve({
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
        return Promise.resolve({
          id: IdMap.getId("10off"),
          code: "10%OFF",
          regions: [{ id: IdMap.getId("good") }],
          rule: {
            type: "percentage",
          },
        })
      }),
    }

    const cartService = new CartService({
      manager: MockManager,
      totalsService,
      cartRepository,
      discountService,
      eventBusService,
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
      expect(cartRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("cart"),
        region_id: IdMap.getId("good"),
        discount_total: 0,
        shipping_total: 0,
        subtotal: 0,
        tax_total: 0,
        total: 0,
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
    })

    it("successfully applies discount to cart and removes old one", async () => {
      await cartService.update(IdMap.getId("with-d"), {
        discounts: [{ code: "10%OFF" }],
      })

      expect(cartRepository.save).toHaveBeenCalledTimes(1)
      expect(cartRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("cart"),
        region_id: IdMap.getId("good"),
        discount_total: 0,
        shipping_total: 0,
        subtotal: 0,
        tax_total: 0,
        total: 0,
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
    })

    it("successfully applies free shipping", async () => {
      await cartService.update(IdMap.getId("with-d"), {
        discounts: [{ code: "10%OFF" }, { code: "FREESHIPPING" }],
      })

      expect(discountService.retrieveByCode).toHaveBeenCalledTimes(2)
      expect(cartRepository.save).toHaveBeenCalledTimes(1)
      expect(cartRepository.save).toHaveBeenCalledWith({
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
        discount_total: 0,
        shipping_total: 0,
        subtotal: 0,
        tax_total: 0,
        total: 0,
        region_id: IdMap.getId("good"),
      })
    })

    it("successfully applies discount with usage count null", async () => {
      await cartService.update(IdMap.getId("cart"), {
        discounts: [{ code: "null-count" }],
      })

      expect(discountService.retrieveByCode).toHaveBeenCalledTimes(1)
      expect(cartRepository.save).toHaveBeenCalledTimes(1)
      expect(cartRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("cart"),
        discounts: [
          {
            id: IdMap.getId("null-count"),
            code: "null-count",
            regions: [{ id: IdMap.getId("good") }],
            usage_count: 0,
            usage_limit: 2,
            rule: {},
          },
        ],
        discount_total: 0,
        shipping_total: 0,
        subtotal: 0,
        tax_total: 0,
        total: 0,
        region_id: IdMap.getId("good"),
      })
    })

    it("successfully applies valid discount with expiration date to cart", async () => {
      await cartService.update(IdMap.getId("fr-cart"), {
        discounts: [
          {
            code: "ValidDiscount",
          },
        ],
      })
      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(cartRepository.save).toHaveBeenCalledTimes(1)
      expect(cartRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("cart"),
        region_id: IdMap.getId("good"),
        discount_total: 0,
        shipping_total: 0,
        subtotal: 0,
        tax_total: 0,
        total: 0,
        discounts: [
          {
            id: IdMap.getId("10off"),
            code: "10%OFF",
            regions: [{ id: IdMap.getId("good") }],
            rule: {
              type: "percentage",
            },
            starts_at: expect.any(Date),
            ends_at: expect.any(Date),
          },
        ],
      })
    })

    it("throws if discount is applied too before it's valid", async () => {
      await expect(
        cartService.update(IdMap.getId("cart"), {
          discounts: [{ code: "EarlyDiscount" }],
        })
      ).rejects.toThrow("Discount is not valid yet")
    })

    it("throws if expired discount is applied", async () => {
      await expect(
        cartService.update(IdMap.getId("cart"), {
          discounts: [{ code: "ExpiredDiscount" }],
        })
      ).rejects.toThrow("Discount is expired")
    })

    it("throws if expired dynamic discount is applied", async () => {
      await expect(
        cartService.update(IdMap.getId("cart"), {
          discounts: [{ code: "ExpiredDynamicDiscount" }],
        })
      ).rejects.toThrow("Discount is expired")
    })

    it("throws if expired dynamic discount is applied after ends_at", async () => {
      await expect(
        cartService.update(IdMap.getId("cart"), {
          discounts: [{ code: "ExpiredDynamicDiscountEndDate" }],
        })
      ).rejects.toThrow("Discount is expired")
    })

    it("throws if discount limit is reached", async () => {
      await expect(
        cartService.update(IdMap.getId("cart"), {
          discounts: [{ code: "limit-reached" }],
        })
      ).rejects.toThrow("Discount has been used maximum allowed times")
    })

    it("throws if discount is not available in region", async () => {
      await expect(
        cartService.update(IdMap.getId("cart"), {
          discounts: [{ code: "US10" }],
        })
      ).rejects.toThrow("The discount is not available in current region")
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
          region_id: IdMap.getId("good"),
        })
      },
    })

    const cartService = new CartService({
      manager: MockManager,
      totalsService,
      cartRepository,
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully removes discount", async () => {
      await cartService.removeDiscount(IdMap.getId("fr-cart"), "1234")

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(cartRepository.save).toHaveBeenCalledTimes(1)
      expect(cartRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("cart"),
        region_id: IdMap.getId("good"),
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
})
