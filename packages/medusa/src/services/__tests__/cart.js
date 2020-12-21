import _ from "lodash"
import { IdMap, MockRepository, MockManager } from "medusa-test-utils"
import CartService from "../cart"

const eventBusService = {
  emit: jest.fn(),
  withTransaction: function() {
    return this
  },
}

describe("CartService", () => {
  describe("retrieve", () => {
    let result
    const cartRepository = MockRepository({
      findOne: () => Promise.resolve({ id: IdMap.getId("emptyCart") }),
    })
    beforeAll(async () => {
      jest.clearAllMocks()
      const cartService = new CartService({
        manager: MockManager,
        cartRepository,
      })
      result = await cartService.retrieve(IdMap.getId("emptyCart"))
    })

    it("calls cart model functions", () => {
      expect(cartRepository.findOne).toHaveBeenCalledTimes(1)
      expect(cartRepository.findOne).toHaveBeenCalledWith({
        where: { id: IdMap.getId("emptyCart") },
        relations: [],
      })
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
      findOne: id => {
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
          countries: [{ country_code: "us" }],
        }
      },
    }

    const cartRepository = MockRepository()
    const cartService = new CartService({
      manager: MockManager,
      cartRepository,
      regionService,
      eventBusService,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully creates a cart", async () => {
      await cartService.create({
        region_id: IdMap.getId("testRegion"),
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
          country_code: "us",
        },
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
      withTransaction: function() {
        return this
      },
    }
    const productVariantService = {
      canCoverQuantity: jest
        .fn()
        .mockImplementation(id => id !== IdMap.getId("cannot-cover")),
    }

    const cartRepository = MockRepository({
      findOne: q => {
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
      cartRepository,
      lineItemService,
      productVariantService,
      eventBusService,
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
        has_shipping: true,
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

      expect(lineItemService.update).toHaveBeenCalledTimes(1)
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
      ).rejects.toThrow(`Inventory doesn't cover the desired quantity`)
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
      ).rejects.toThrow(`Inventory doesn't cover the desired quantity`)
    })
  })

  describe("removeLineItem", () => {
    const shippingMethodRepository = MockRepository()
    const lineItemService = {
      delete: jest.fn(),
      withTransaction: function() {
        return this
      },
    }
    const cartRepository = MockRepository({
      findOne: q => {
        if (q.where.id === IdMap.getId("withShipping")) {
          return Promise.resolve({
            shipping_methods: [
              {
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
    const cartService = new CartService({
      manager: MockManager,
      cartRepository,
      lineItemService,
      shippingMethodRepository,
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

      expect(shippingMethodRepository.remove).toHaveBeenCalledTimes(1)
      expect(shippingMethodRepository.remove).toHaveBeenCalledWith({
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

  describe("updateLineItem", () => {
    const lineItemService = {
      update: jest.fn(),
      withTransaction: function() {
        return this
      },
    }
    const productVariantService = {
      canCoverQuantity: jest
        .fn()
        .mockImplementation(id => id !== IdMap.getId("cannot-cover")),
    }

    const cartRepository = MockRepository({
      findOne: q => {
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
      cartRepository,
      productVariantService,
      lineItemService,
      eventBusService,
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
      retrieveByEmail: jest.fn().mockImplementation(email => {
        if (email === "no@mail.com") {
          return Promise.reject()
        }
        return Promise.resolve({ id: IdMap.getId("existing") })
      }),
      create: jest
        .fn()
        .mockReturnValue(Promise.resolve({ id: IdMap.getId("newCus") })),
      withTransaction: function() {
        return this
      },
    }
    const cartRepository = MockRepository({
      findOne: () => Promise.resolve({}),
    })
    const cartService = new CartService({
      manager: MockManager,
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
        "cart.customer_updated",
        expect.any(Object)
      )
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(cartRepository.save).toHaveBeenCalledTimes(1)
      expect(cartRepository.save).toHaveBeenCalledWith({
        customer_id: IdMap.getId("existing"),
        email: "test@testdom.com",
      })
    })

    it("creates a new customer", async () => {
      await cartService.update(IdMap.getId("emptyCart"), {
        email: "no@Mail.com",
      })

      expect(eventBusService.emit).toHaveBeenCalledTimes(2)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "cart.customer_updated",
        expect.any(Object)
      )
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(cartRepository.save).toHaveBeenCalledTimes(1)
      expect(cartRepository.save).toHaveBeenCalledWith({
        customer_id: IdMap.getId("newCus"),
        email: "no@mail.com",
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
      findOne: () => Promise.resolve({}),
    })
    const cartService = new CartService({
      manager: MockManager,
      cartRepository,
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

      expect(cartRepository.save).toHaveBeenCalledTimes(1)
      expect(cartRepository.save).toHaveBeenCalledWith({
        billing_address: { ...address, country_code: "us" },
      })
    })

    it("throws on invalid address", async () => {
      const address = {
        last_name: "James",
        address_1: "24 Dunks Drive",
        city: "Los Angeles",
        country_code: "US",
        province: "CA",
        postal_code: "93011",
      }

      await expect(
        cartService.update(IdMap.getId("emptyCart"), {
          billing_address: address,
        })
      ).rejects.toThrow(`"first_name" is required`)
    })
  })

  describe("updateShippingAddress", () => {
    const cartRepository = MockRepository({
      findOne: () => Promise.resolve({}),
    })
    const regionService = {
      retrieve: () => {
        return {
          id: IdMap.getId("testRegion"),
          countries: [{ country_code: "us" }],
        }
      },
    }

    const cartService = new CartService({
      manager: MockManager,
      cartRepository,
      eventBusService,
      regionService,
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

      expect(cartRepository.save).toHaveBeenCalledTimes(1)
      expect(cartRepository.save).toHaveBeenCalledWith({
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

    it("throws on invalid address", async () => {
      const address = {
        // Missing first_name
        last_name: "James",
        address_1: "24 Dunks Drive",
        city: "Los Angeles",
        country_code: "US",
        province: "CA",
        postal_code: "93011",
      }

      await expect(
        cartService.update(IdMap.getId("emptyCart"), {
          shipping_address: address,
        })
      ).rejects.toThrow(`"first_name" is required`)
    })
  })

  describe("setRegion", () => {
    const lineItemService = {
      update: jest.fn(),
      delete: jest.fn(),
      withTransaction: function() {
        return this
      },
    }
    const productVariantService = {
      getRegionPrice: jest.fn().mockImplementation(id => {
        if (id === IdMap.getId("fail")) {
          return Promise.reject()
        }
        return Promise.resolve(100)
      }),
    }
    const regionService = {
      retrieve: jest.fn().mockReturnValue(
        Promise.resolve({
          countries: [{ country_code: "us" }],
        })
      ),
    }
    const cartRepository = MockRepository({
      findOne: () =>
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
    const cartService = new CartService({
      manager: MockManager,
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
        region_id: IdMap.getId("region-us"),
        shipping_address: {
          country_code: "us",
        },
        items: [
          {
            id: IdMap.getId("testitem"),
          },
          {
            id: IdMap.getId("fail"),
            variant_id: IdMap.getId("fail"),
          },
        ],
        payment_sessions: [],
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
      findOne: () => {
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

    const cartService = new CartService({
      manager: MockManager,
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
      expect(cartRepository.save).toHaveBeenCalledTimes(1)
      expect(cartRepository.save).toHaveBeenCalledWith({
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
        payment_session_id: IdMap.getId("test-session"),
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
      payment_sessions: [],
      region: {
        payment_providers: [{ id: "provider_1" }, { id: "provider_2" }],
      },
    }

    const cart2 = {
      payment_sessions: [{ provider_id: "provider_1" }],
      region: {
        payment_providers: [{ id: "provider_1" }, { id: "provider_2" }],
      },
    }

    const cartRepository = MockRepository({
      findOne: q => {
        if (q.where.id === IdMap.getId("cart-with-session")) {
          return Promise.resolve(cart2)
        }
        return Promise.resolve(cart1)
      },
    })

    const paymentProviderService = {
      deleteSession: jest.fn(),
      updateSession: jest.fn(),
      createSession: jest.fn(),
      withTransaction: function() {
        return this
      },
    }

    const totalsService = {
      getTotal: cart => (cart.id === IdMap.getId("free") ? 0 : 100),
    }

    const cartService = new CartService({
      manager: MockManager,
      cartRepository,
      paymentProviderService,
      totalsService,
      eventBusService,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("initializes payment sessions for each of the providers", async () => {
      await cartService.setPaymentSessions(IdMap.getId("cartWithLine"))

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

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

    it("updates payment sessions for existing sessions", async () => {
      await cartService.setPaymentSessions(IdMap.getId("cart-with-session"))

      expect(paymentProviderService.createSession).toHaveBeenCalledTimes(1)

      expect(paymentProviderService.updateSession).toHaveBeenCalledTimes(1)
      expect(paymentProviderService.updateSession).toHaveBeenCalledWith(
        {
          provider_id: "provider_1",
        },
        cart2
      )
    })

    it("filters sessions not available in the region", async () => {
      await cartService.setPaymentSessions(
        IdMap.getId("cartWithPaySessionsDifRegion")
      )

      expect(PaymentProviderServiceMock.createSession).toHaveBeenCalledTimes(1)

      expect(PaymentProviderServiceMock.updateSession).toHaveBeenCalledTimes(1)
      expect(PaymentProviderServiceMock.updateSession).toHaveBeenCalledWith(
        {
          provider_id: "default_provider",
          data: {
            id: "default_provider_session",
          },
        },
        carts.cartWithPaySessionsDifRegion
      )
      expect(PaymentProviderServiceMock.createSession).toHaveBeenCalledWith(
        "france-provider",
        carts.cartWithPaySessionsDifRegion
      )

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("cartWithPaySessionsDifRegion"),
        },
        {
          $set: {
            payment_sessions: [
              {
                provider_id: "default_provider",
                data: {
                  id: "default_provider_session_updated",
                },
              },
              {
                provider_id: "france-provider",
                data: {
                  id: "france-provider_session",
                  cartId: IdMap.getId("cartWithPaySessionsDifRegion"),
                },
              },
            ],
          },
        }
      )
    })
  })

  //describe("retrievePaymentSession", () => {
  //  const cartService = new CartService({
  //    cartModel: CartModelMock,
  //    eventBusService,
  //  })

  //  let res

  //  describe("it retrieves the correct payment session", () => {
  //    beforeAll(async () => {
  //      jest.clearAllMocks()
  //      res = await cartService.retrievePaymentSession(
  //        IdMap.getId("cartWithPaySessions"),
  //        "default_provider"
  //      )
  //    })

  //    it("retrieves the cart", () => {
  //      expect(CartModelMock.findOne).toHaveBeenCalledTimes(1)
  //      expect(CartModelMock.findOne).toHaveBeenCalledWith({
  //        _id: IdMap.getId("cartWithPaySessions"),
  //      })
  //    })

  //    it("finds the correct payment session", () => {
  //      expect(res.provider_id).toEqual("default_provider")
  //      expect(res.data).toEqual({
  //        id: "default_provider_session",
  //      })
  //    })
  //  })

  //  describe("it fails when provider doesn't match open session", () => {
  //    beforeAll(async () => {
  //      jest.clearAllMocks()
  //      try {
  //        await cartService.retrievePaymentSession(
  //          IdMap.getId("cartWithPaySessions"),
  //          "nono"
  //        )
  //      } catch (err) {
  //        res = err
  //      }
  //    })

  //    it("retrieves the cart", () => {
  //      expect(CartModelMock.findOne).toHaveBeenCalledTimes(1)
  //      expect(CartModelMock.findOne).toHaveBeenCalledWith({
  //        _id: IdMap.getId("cartWithPaySessions"),
  //      })
  //    })

  //    it("throws invalid data errro", () => {
  //      expect(res.message).toEqual(
  //        "The provider_id did not match any open payment sessions"
  //      )
  //    })
  //  })
  //})

  //describe("addShippingMethod", () => {
  //  const cartService = new CartService({
  //    cartModel: CartModelMock,
  //    shippingProfileService: ShippingProfileServiceMock,
  //    shippingOptionService: ShippingOptionServiceMock,
  //    eventBusService,
  //  })

  //  describe("successfully adds the shipping method", () => {
  //    const data = {
  //      id: "testshipperid",
  //      extra: "yes",
  //    }

  //    beforeAll(async () => {
  //      jest.clearAllMocks()
  //      const cartId = IdMap.getId("cartWithPaySessions")
  //      await cartService.addShippingMethod(
  //        cartId,
  //        IdMap.getId("freeShipping"),
  //        data
  //      )
  //    })

  //    it("validates option", () => {
  //      expect(
  //        ShippingOptionServiceMock.validateCartOption
  //      ).toHaveBeenCalledWith(
  //        IdMap.getId("freeShipping"),
  //        carts.cartWithPaySessions
  //      )
  //    })

  //    it("validates fulfillment data", () => {
  //      expect(
  //        ShippingOptionServiceMock.validateFulfillmentData
  //      ).toHaveBeenCalledWith(
  //        IdMap.getId("freeShipping"),
  //        data,
  //        carts.cartWithPaySessions
  //      )
  //    })

  //    it("gets shipping profile", () => {
  //      expect(ShippingProfileServiceMock.list).toHaveBeenCalledWith({
  //        shipping_options: IdMap.getId("freeShipping"),
  //      })
  //    })

  //    it("updates cart", () => {
  //      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
  //      expect(eventBusService.emit).toHaveBeenCalledWith(
  //        "cart.updated",
  //        expect.any(Object)
  //      )

  //      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
  //      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
  //        {
  //          _id: IdMap.getId("cartWithPaySessions"),
  //        },
  //        {
  //          $set: {
  //            items: [
  //              {
  //                _id: IdMap.getId("existingLine"),
  //                title: "merge line",
  //                description: "This is a new line",
  //                has_shipping: true,
  //                thumbnail: "test-img-yeah.com/thumb",
  //                content: {
  //                  unit_price: 123,
  //                  variant: {
  //                    _id: IdMap.getId("can-cover"),
  //                  },
  //                  product: {
  //                    _id: IdMap.getId("product"),
  //                  },
  //                  quantity: 1,
  //                },
  //                quantity: 10,
  //              },
  //            ],
  //            shipping_methods: [
  //              {
  //                _id: IdMap.getId("freeShipping"),
  //                price: 0,
  //                provider_id: "default_provider",
  //                profile_id: IdMap.getId("default_profile"),
  //                data,
  //              },
  //            ],
  //          },
  //        }
  //      )
  //    })
  //  })

  //  describe("successfully overrides existing profile shipping method", () => {
  //    const data = {
  //      id: "testshipperid",
  //    }

  //    beforeAll(async () => {
  //      jest.clearAllMocks()
  //      const cartId = IdMap.getId("fr-cart")
  //      await cartService.addShippingMethod(
  //        cartId,
  //        IdMap.getId("freeShipping"),
  //        data
  //      )
  //    })

  //    it("updates cart", () => {
  //      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
  //      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
  //        {
  //          _id: IdMap.getId("fr-cart"),
  //        },
  //        {
  //          $set: {
  //            items: carts.frCart.items.map(i => ({
  //              ...i,
  //              has_shipping: false,
  //            })),
  //            shipping_methods: [
  //              {
  //                _id: IdMap.getId("freeShipping"),
  //                price: 0,
  //                provider_id: "default_provider",
  //                profile_id: IdMap.getId("default_profile"),
  //                data: {
  //                  id: "testshipperid",
  //                },
  //              },
  //            ],
  //          },
  //        }
  //      )
  //    })
  //  })

  //  describe("successfully adds additional shipping method", () => {
  //    const data = {
  //      id: "additional_shipper_id",
  //    }

  //    beforeAll(async () => {
  //      jest.clearAllMocks()
  //      const cartId = IdMap.getId("fr-cart")
  //      await cartService.addShippingMethod(
  //        cartId,
  //        IdMap.getId("additional"),
  //        data
  //      )
  //    })

  //    it("updates cart", () => {
  //      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
  //      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
  //        {
  //          _id: IdMap.getId("fr-cart"),
  //        },
  //        {
  //          $set: {
  //            items: carts.frCart.items.map(i => ({
  //              ...i,
  //              has_shipping: false,
  //            })),
  //            shipping_methods: [
  //              {
  //                _id: IdMap.getId("freeShipping"),
  //                profile_id: IdMap.getId("default_profile"),
  //              },
  //              {
  //                _id: IdMap.getId("additional"),
  //                price: 0,
  //                profile_id: IdMap.getId("additional_profile"),
  //                provider_id: "default_provider",
  //                data,
  //              },
  //            ],
  //          },
  //        }
  //      )
  //    })
  //  })

  //  describe("throws if no profile", () => {
  //    let res
  //    beforeAll(async () => {
  //      jest.clearAllMocks()
  //      const cartId = IdMap.getId("fr-cart")
  //      try {
  //        await cartService.addShippingMethod(cartId, IdMap.getId("fail"), {})
  //      } catch (err) {
  //        res = err
  //      }
  //    })

  //    it("throw error", () => {
  //      expect(res.message).toEqual(
  //        "Shipping Method must belong to a shipping profile"
  //      )
  //    })
  //  })
  //})

  //describe("applyDiscount", () => {
  //  const cartService = new CartService({
  //    cartModel: CartModelMock,
  //    discountService: DiscountServiceMock,
  //    eventBusService,
  //  })
  //  beforeEach(async () => {
  //    jest.clearAllMocks()
  //  })

  //  it("successfully applies discount to cart", async () => {
  //    await cartService.applyDiscount(IdMap.getId("fr-cart"), "10%OFF")
  //    expect(CartModelMock.findOne).toHaveBeenCalledTimes(1)
  //    expect(CartModelMock.findOne).toHaveBeenCalledWith({
  //      _id: IdMap.getId("fr-cart"),
  //    })

  //    expect(eventBusService.emit).toHaveBeenCalledTimes(1)
  //    expect(eventBusService.emit).toHaveBeenCalledWith(
  //      "cart.updated",
  //      expect.any(Object)
  //    )

  //    expect(DiscountServiceMock.retrieveByCode).toHaveBeenCalledTimes(1)
  //    expect(DiscountServiceMock.retrieveByCode).toHaveBeenCalledWith("10%OFF")

  //    expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
  //    expect(CartModelMock.updateOne).toHaveBeenCalledWith(
  //      {
  //        _id: IdMap.getId("fr-cart"),
  //      },
  //      {
  //        $push: { discounts: discounts.total10Percent },
  //      }
  //    )
  //  })

  //  it("successfully applies discount to cart and removes old one", async () => {
  //    await cartService.applyDiscount(
  //      IdMap.getId("discount-cart-with-existing"),
  //      "10%OFF"
  //    )
  //    expect(CartModelMock.findOne).toHaveBeenCalledTimes(1)
  //    expect(CartModelMock.findOne).toHaveBeenCalledWith({
  //      _id: IdMap.getId("discount-cart-with-existing"),
  //    })

  //    expect(DiscountServiceMock.retrieveByCode).toHaveBeenCalledTimes(1)
  //    expect(DiscountServiceMock.retrieveByCode).toHaveBeenCalledWith("10%OFF")

  //    expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
  //    expect(CartModelMock.updateOne).toHaveBeenCalledWith(
  //      {
  //        _id: IdMap.getId("discount-cart-with-existing"),
  //      },
  //      {
  //        $push: { discounts: discounts.total10Percent },
  //        $pull: { discounts: { _id: IdMap.getId("item10Percent") } },
  //      }
  //    )
  //  })

  //  it("successfully applies free shipping", async () => {
  //    await cartService.applyDiscount(
  //      IdMap.getId("discount-cart-with-existing"),
  //      "FREESHIPPING"
  //    )
  //    expect(CartModelMock.findOne).toHaveBeenCalledTimes(1)
  //    expect(CartModelMock.findOne).toHaveBeenCalledWith({
  //      _id: IdMap.getId("discount-cart-with-existing"),
  //    })

  //    expect(DiscountServiceMock.retrieveByCode).toHaveBeenCalledTimes(1)
  //    expect(DiscountServiceMock.retrieveByCode).toHaveBeenCalledWith(
  //      "FREESHIPPING"
  //    )

  //    expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
  //    expect(CartModelMock.updateOne).toHaveBeenCalledWith(
  //      {
  //        _id: IdMap.getId("discount-cart-with-existing"),
  //      },
  //      {
  //        $push: { discounts: discounts.freeShipping },
  //      }
  //    )
  //  })

  //  it("successfully resolves ", async () => {
  //    await cartService.applyDiscount(
  //      IdMap.getId("discount-cart-with-existing"),
  //      "FREESHIPPING"
  //    )
  //    expect(CartModelMock.findOne).toHaveBeenCalledTimes(1)
  //    expect(CartModelMock.findOne).toHaveBeenCalledWith({
  //      _id: IdMap.getId("discount-cart-with-existing"),
  //    })

  //    expect(DiscountServiceMock.retrieveByCode).toHaveBeenCalledTimes(1)
  //    expect(DiscountServiceMock.retrieveByCode).toHaveBeenCalledWith(
  //      "FREESHIPPING"
  //    )

  //    expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
  //    expect(CartModelMock.updateOne).toHaveBeenCalledWith(
  //      {
  //        _id: IdMap.getId("discount-cart-with-existing"),
  //      },
  //      {
  //        $push: { discounts: discounts.freeShipping },
  //      }
  //    )
  //  })

  //  it("throws if discount is not available in region", async () => {
  //    try {
  //      await cartService.applyDiscount(
  //        IdMap.getId("discount-cart-with-existing"),
  //        "US10"
  //      )
  //    } catch (error) {
  //      expect(error.message).toEqual(
  //        "The discount is not available in current region"
  //      )
  //    }
  //  })
  //})
})
