import mongoose from "mongoose"
import { IdMap } from "medusa-test-utils"
import CartService from "../cart"
import {
  PaymentProviderServiceMock,
  DefaultProviderMock,
} from "../__mocks__/payment-provider"
import { ProductVariantServiceMock } from "../__mocks__/product-variant"
import { RegionServiceMock } from "../__mocks__/region"
import { EventBusServiceMock } from "../__mocks__/event-bus"
import { CustomerServiceMock } from "../__mocks__/customer"
import { ShippingOptionServiceMock } from "../__mocks__/shipping-option"
import { TotalsServiceMock } from "../__mocks__/totals"
import { ShippingProfileServiceMock } from "../__mocks__/shipping-profile"
import { CartModelMock, carts } from "../../models/__mocks__/cart"
import { LineItemServiceMock } from "../__mocks__/line-item"
import { DiscountModelMock, discounts } from "../../models/__mocks__/discount"
import { DiscountServiceMock } from "../__mocks__/discount"
import idMap from "medusa-test-utils/dist/id-map"

describe("CartService", () => {
  describe("retrieve", () => {
    let result
    beforeAll(async () => {
      jest.clearAllMocks()
      const cartService = new CartService({
        cartModel: CartModelMock,
      })
      result = await cartService.retrieve(IdMap.getId("emptyCart"))
    })

    it("calls cart model functions", () => {
      expect(CartModelMock.findOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.findOne).toHaveBeenCalledWith({
        _id: IdMap.getId("emptyCart"),
      })
    })

    it("returns the cart", () => {
      expect(result).toEqual(carts.emptyCart)
    })
  })

  describe("setMetadata", () => {
    const cartService = new CartService({
      cartModel: CartModelMock,
      eventBusService: EventBusServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls updateOne with correct params", async () => {
      const id = mongoose.Types.ObjectId()
      await cartService.setMetadata(`${id}`, "metadata", "testMetadata")

      expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
      expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(CartModelMock.updateOne).toBeCalledTimes(1)
      expect(CartModelMock.updateOne).toBeCalledWith(
        { _id: `${id}` },
        { $set: { "metadata.metadata": "testMetadata" } }
      )
    })

    it("throw error on invalid key type", async () => {
      const id = mongoose.Types.ObjectId()

      try {
        await cartService.setMetadata(`${id}`, 1234, "nono")
      } catch (err) {
        expect(err.message).toEqual(
          "Key type is invalid. Metadata keys must be strings"
        )
      }
    })
  })

  describe("deleteMetadata", () => {
    const cartService = new CartService({
      cartModel: CartModelMock,
      eventBusService: EventBusServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls updateOne with correct params", async () => {
      const id = mongoose.Types.ObjectId()
      await cartService.deleteMetadata(`${id}`, "metadata")

      expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
      expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(CartModelMock.updateOne).toBeCalledTimes(1)
      expect(CartModelMock.updateOne).toBeCalledWith(
        { _id: `${id}` },
        { $unset: { "metadata.metadata": "" } }
      )
    })

    it("throw error on invalid key type", async () => {
      const id = mongoose.Types.ObjectId()

      try {
        await cartService.deleteMetadata(`${id}`, 1234)
      } catch (err) {
        expect(err.message).toEqual(
          "Key type is invalid. Metadata keys must be strings"
        )
      }
    })
  })

  describe("create", () => {
    const cartService = new CartService({
      cartModel: CartModelMock,
      regionService: RegionServiceMock,
      eventBusService: EventBusServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully creates a cart", async () => {
      await cartService.create({
        region_id: IdMap.getId("testRegion"),
      })

      expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
      expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
        "cart.created",
        expect.any(Object)
      )

      expect(CartModelMock.create).toHaveBeenCalledTimes(1)
      expect(CartModelMock.create).toHaveBeenCalledWith({
        region_id: IdMap.getId("testRegion"),
      })
    })
  })

  describe("addLineItem", () => {
    const cartService = new CartService({
      cartModel: CartModelMock,
      productVariantService: ProductVariantServiceMock,
      lineItemService: LineItemServiceMock,
      eventBusService: EventBusServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully creates new line item", async () => {
      const lineItem = {
        title: "New Line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        content: {
          unit_price: 123,
          variant: {
            _id: IdMap.getId("can-cover"),
          },
          product: {
            _id: IdMap.getId("product"),
          },
          quantity: 1,
        },
        quantity: 10,
      }

      await cartService.addLineItem(IdMap.getId("emptyCart"), lineItem)

      expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
      expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("emptyCart"),
        },
        {
          $push: {
            items: {
              ...lineItem,
              has_shipping: false,
            },
          },
        }
      )
    })

    it("successfully merges existing line item", async () => {
      const lineItem = {
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        content: {
          unit_price: 123,
          variant: {
            _id: IdMap.getId("can-cover"),
          },
          product: {
            _id: IdMap.getId("product"),
          },
          quantity: 1,
        },
        quantity: 10,
      }

      await cartService.addLineItem(IdMap.getId("cartWithLine"), lineItem)

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("cartWithLine"),
        },
        {
          $push: {
            items: {
              title: "merge line",
              description: "This is a new line",
              thumbnail: "test-img-yeah.com/thumb",
              has_shipping: false,
              content: {
                unit_price: 123,
                variant: {
                  _id: IdMap.getId("can-cover"),
                },
                product: {
                  _id: IdMap.getId("product"),
                },
                quantity: 1,
              },
              quantity: 10,
            },
          },
        }
      )
    })

    it("successfully adds multi-content line", async () => {
      const lineItem = {
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        content: [
          {
            unit_price: 123,
            variant: {
              _id: IdMap.getId("can-cover"),
            },
            product: {
              _id: IdMap.getId("product"),
            },
            quantity: 1,
          },
          {
            unit_price: 123,
            variant: {
              _id: IdMap.getId("can-cover"),
            },
            product: {
              _id: IdMap.getId("product"),
            },
            quantity: 1,
          },
        ],
        quantity: 10,
      }

      await cartService.addLineItem(IdMap.getId("cartWithLine"), lineItem)

      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("cartWithLine"),
        },
        {
          $push: {
            items: {
              ...lineItem,
              has_shipping: false,
            },
          },
        }
      )
    })

    it("throws if inventory isn't covered", async () => {
      const lineItem = {
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        quantity: 1,
        content: {
          variant: {
            _id: IdMap.getId("cannot-cover"),
          },
          product: {
            _id: IdMap.getId("product"),
          },
          quantity: 1,
          unit_price: 1234,
        },
      }

      try {
        await cartService.addLineItem(IdMap.getId("cartWithLine"), lineItem)
      } catch (err) {
        expect(err.message).toEqual(
          `Inventory doesn't cover the desired quantity`
        )
      }
    })

    it("throws if inventory isn't covered multi-line", async () => {
      const lineItem = {
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        quantity: 1,
        content: [
          {
            variant: {
              _id: IdMap.getId("can-cover"),
            },
            product: {
              _id: IdMap.getId("product"),
            },
            quantity: 1,
            unit_price: 1234,
          },
          {
            variant: {
              _id: IdMap.getId("cannot-cover"),
            },
            product: {
              _id: IdMap.getId("product"),
            },
            quantity: 1,
            unit_price: 1234,
          },
        ],
      }

      try {
        await cartService.addLineItem(IdMap.getId("cartWithLine"), lineItem)
      } catch (err) {
        expect(err.message).toEqual(
          `Inventory doesn't cover the desired quantity`
        )
      }
    })
  })

  describe("removeLineItem", () => {
    const cartService = new CartService({
      cartModel: CartModelMock,
      productVariantService: ProductVariantServiceMock,
      lineItemService: LineItemServiceMock,
      eventBusService: EventBusServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully removes a line item", async () => {
      await cartService.removeLineItem(
        IdMap.getId("cartWithLine"),
        IdMap.getId("itemToRemove")
      )

      expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
      expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("cartWithLine"),
        },
        {
          $pull: { items: { _id: IdMap.getId("itemToRemove") } },
        }
      )
    })

    it("successfully decrements quantity if more than 1", async () => {
      await cartService.removeLineItem(
        IdMap.getId("cartWithLine"),
        IdMap.getId("existingLine")
      )

      expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
      expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("cartWithLine"),
        },
        {
          $pull: { items: { _id: IdMap.getId("existingLine") } },
        }
      )
    })

    it("resolves if line item is not in cart", async () => {
      await cartService.removeLineItem(
        IdMap.getId("cartWithLine"),
        IdMap.getId("nonExisting")
      )

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(0)
    })
  })

  describe("updateLineItem", () => {
    const cartService = new CartService({
      cartModel: CartModelMock,
      productVariantService: ProductVariantServiceMock,
      lineItemService: LineItemServiceMock,
      eventBusService: EventBusServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully updates existing line item", async () => {
      const lineItem = {
        title: "update line",
        description: "This is a new line",
        thumbnail: "https://test-img-yeah.com/thumb",
        content: {
          unit_price: 123,
          variant: {
            _id: IdMap.getId("can-cover"),
          },
          product: {
            _id: IdMap.getId("product"),
          },
          quantity: 1,
        },
        quantity: 2,
      }

      await cartService.updateLineItem(
        IdMap.getId("cartWithLine"),
        IdMap.getId("existingLine"),
        lineItem
      )

      expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
      expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("cartWithLine"),
          "items._id": IdMap.getId("existingLine"),
        },
        {
          $set: { "items.$": lineItem },
        }
      )
    })

    it("throws if inventory isn't covered", async () => {
      const lineItem = {
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        quantity: 1,
        content: {
          variant: {
            _id: IdMap.getId("cannot-cover"),
          },
          product: {
            _id: IdMap.getId("product"),
          },
          quantity: 1,
          unit_price: 1234,
        },
      }

      try {
        await cartService.updateLineItem(
          IdMap.getId("cartWithLine"),
          IdMap.getId("existingLine"),
          lineItem
        )
      } catch (err) {
        expect(err.message).toEqual(
          `Inventory doesn't cover the desired quantity`
        )
      }
    })
  })

  describe("updateEmail", () => {
    const cartService = new CartService({
      cartModel: CartModelMock,
      eventBusService: EventBusServiceMock,
      customerService: CustomerServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully updates an email", async () => {
      await cartService.updateEmail(
        IdMap.getId("emptyCart"),
        "test@testdom.com"
      )

      expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(2)
      expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
        "cart.customer_updated",
        expect.any(Object)
      )
      expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("emptyCart"),
        },
        {
          $set: {
            email: "test@testdom.com",
            customer_id: IdMap.getId("testdom"),
          },
        }
      )
    })

    it("throws on invalid email", async () => {
      try {
        await cartService.updateEmail(IdMap.getId("emptyCart"), "test@test")
      } catch (err) {
        expect(err.message).toEqual("The email is not valid")
      }

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(0)
    })
  })

  describe("updateBillingAddress", () => {
    const cartService = new CartService({
      cartModel: CartModelMock,
      eventBusService: EventBusServiceMock,
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

      await cartService.updateBillingAddress(IdMap.getId("emptyCart"), address)

      expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
      expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("emptyCart"),
        },
        {
          $set: { billing_address: address },
        }
      )
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

      try {
        await cartService.updateBillingAddress(
          IdMap.getId("emptyCart"),
          address
        )
      } catch (err) {
        expect(err.message).toEqual(`"first_name" is required`)
      }

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(0)
    })
  })

  describe("updateShippingAddress", () => {
    const cartService = new CartService({
      cartModel: CartModelMock,
      eventBusService: EventBusServiceMock,
      regionService: RegionServiceMock,
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

      await cartService.updateShippingAddress(IdMap.getId("emptyCart"), address)

      expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
      expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("emptyCart"),
        },
        {
          $set: { shipping_address: address },
        }
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
        cartService.updateShippingAddress(IdMap.getId("emptyCart"), address)
      ).rejects.toThrow("Shipping country must be in the cart region")

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(0)
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
        cartService.updateShippingAddress(IdMap.getId("emptyCart"), address)
      ).rejects.toThrow(`"first_name" is required`)

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(0)
    })
  })

  describe("setRegion", () => {
    const cartService = new CartService({
      cartModel: CartModelMock,
      regionService: RegionServiceMock,
      productVariantService: ProductVariantServiceMock,
      eventBusService: EventBusServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully set new region", async () => {
      await cartService.setRegion(
        IdMap.getId("fr-cart"),
        IdMap.getId("region-us")
      )

      expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
      expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("fr-cart"),
        },
        {
          $set: {
            region_id: IdMap.getId("region-us"),
            shipping_methods: [],
            shipping_address: {
              country_code: "US",
            },
            items: [
              {
                _id: IdMap.getId("line"),
                title: "merge line",
                description: "This is a new line",
                thumbnail: "test-img-yeah.com/thumb",
                has_shipping: false,
                content: [
                  {
                    unit_price: 10,
                    variant: {
                      _id: IdMap.getId("eur-8-us-10"),
                    },
                    product: {
                      _id: IdMap.getId("product1"),
                    },
                    quantity: 1,
                  },
                  {
                    unit_price: 12,
                    variant: {
                      _id: IdMap.getId("eur-10-us-12"),
                    },
                    product: {
                      _id: IdMap.getId("product1"),
                    },
                    quantity: 1,
                  },
                ],
                quantity: 10,
              },
              {
                _id: IdMap.getId("existingLine"),
                title: "merge line",
                description: "This is a new line",
                thumbnail: "test-img-yeah.com/thumb",
                has_shipping: false,
                content: {
                  unit_price: 12,
                  variant: {
                    _id: IdMap.getId("eur-10-us-12"),
                  },
                  product: {
                    _id: IdMap.getId("product2"),
                  },
                  quantity: 1,
                },
                quantity: 10,
              },
            ],
          },
        }
      )
    })

    it("successfully set new region", async () => {
      await cartService.setRegion(
        IdMap.getId("complete-cart"),
        IdMap.getId("region-us")
      )

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("complete-cart"),
        },
        {
          $set: {
            items: [],
            region_id: IdMap.getId("region-us"),
            shipping_methods: [],
            payment_sessions: [],
            payment_method: undefined,
            shipping_address: {
              first_name: "hi",
              last_name: "you",
              country_code: "US",
              city: "of lights",
              address_1: "You bet street",
              postal_code: "4242",
            },
          },
        }
      )
    })

    it("filters items that don't have region prices", async () => {
      await cartService.setRegion(
        IdMap.getId("cartWithLine"),
        IdMap.getId("testRegion")
      )

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("cartWithLine"),
        },
        {
          $set: {
            region_id: IdMap.getId("testRegion"),
            items: [],
          },
        }
      )
    })
  })

  describe("setPaymentMethod", () => {
    const cartService = new CartService({
      cartModel: CartModelMock,
      regionService: RegionServiceMock,
      paymentProviderService: PaymentProviderServiceMock,
      eventBusService: EventBusServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully sets a payment method", async () => {
      const paymentMethod = {
        provider_id: "default_provider",
        data: {
          money_id: "success",
        },
      }

      await cartService.setPaymentMethod(
        IdMap.getId("cartWithLine"),
        paymentMethod
      )

      expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
      expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(RegionServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(RegionServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("testRegion")
      )

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("cartWithLine"),
        },
        {
          $set: { payment_method: paymentMethod },
        }
      )
    })

    it("fails if the region does not contain the provider_id", async () => {
      const paymentMethod = {
        provider_id: "unknown_provider",
        data: {
          money_id: "success",
        },
      }

      try {
        await cartService.setPaymentMethod(
          IdMap.getId("cartWithLine"),
          paymentMethod
        )
      } catch (err) {
        expect(RegionServiceMock.retrieve).toHaveBeenCalledTimes(1)
        expect(RegionServiceMock.retrieve).toHaveBeenCalledWith(
          IdMap.getId("testRegion")
        )

        expect(err.message).toEqual(
          `The payment method is not available in this region`
        )
      }
    })
  })

  describe("setPaymentSessions", () => {
    const cartService = new CartService({
      cartModel: CartModelMock,
      regionService: RegionServiceMock,
      paymentProviderService: PaymentProviderServiceMock,
      totalsService: TotalsServiceMock,
      eventBusService: EventBusServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("initializes payment sessions for each of the providers", async () => {
      await cartService.setPaymentSessions(IdMap.getId("cartWithLine"))

      expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
      expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(PaymentProviderServiceMock.createSession).toHaveBeenCalledTimes(2)
      expect(PaymentProviderServiceMock.createSession).toHaveBeenCalledWith(
        "default_provider",
        carts.cartWithLine
      )
      expect(PaymentProviderServiceMock.createSession).toHaveBeenCalledWith(
        "unregistered",
        carts.cartWithLine
      )

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("cartWithLine"),
        },
        {
          $set: {
            payment_sessions: [
              {
                provider_id: "default_provider",
                data: {
                  id: "default_provider_session",
                  cartId: IdMap.getId("cartWithLine"),
                },
              },
              {
                provider_id: "unregistered",
                data: {
                  id: "unregistered_session",
                  cartId: IdMap.getId("cartWithLine"),
                },
              },
            ],
          },
        }
      )
    })

    it("updates payment sessions for existing sessions", async () => {
      await cartService.setPaymentSessions(IdMap.getId("cartWithPaySessions"))

      expect(PaymentProviderServiceMock.createSession).toHaveBeenCalledTimes(0)

      expect(PaymentProviderServiceMock.updateSession).toHaveBeenCalledTimes(2)
      expect(PaymentProviderServiceMock.updateSession).toHaveBeenCalledWith(
        {
          provider_id: "default_provider",
          data: {
            id: "default_provider_session",
          },
        },
        carts.cartWithPaySessions
      )
      expect(PaymentProviderServiceMock.updateSession).toHaveBeenCalledWith(
        {
          provider_id: "unregistered",
          data: {
            id: "unregistered_session",
          },
        },
        carts.cartWithPaySessions
      )

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("cartWithPaySessions"),
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
                provider_id: "unregistered",
                data: {
                  id: "unregistered_session_updated",
                },
              },
            ],
          },
        }
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

  describe("retrievePaymentSession", () => {
    const cartService = new CartService({
      cartModel: CartModelMock,
      eventBusService: EventBusServiceMock,
    })

    let res

    describe("it retrieves the correct payment session", () => {
      beforeAll(async () => {
        jest.clearAllMocks()
        res = await cartService.retrievePaymentSession(
          IdMap.getId("cartWithPaySessions"),
          "default_provider"
        )
      })

      it("retrieves the cart", () => {
        expect(CartModelMock.findOne).toHaveBeenCalledTimes(1)
        expect(CartModelMock.findOne).toHaveBeenCalledWith({
          _id: IdMap.getId("cartWithPaySessions"),
        })
      })

      it("finds the correct payment session", () => {
        expect(res.provider_id).toEqual("default_provider")
        expect(res.data).toEqual({
          id: "default_provider_session",
        })
      })
    })

    describe("it fails when provider doesn't match open session", () => {
      beforeAll(async () => {
        jest.clearAllMocks()
        try {
          await cartService.retrievePaymentSession(
            IdMap.getId("cartWithPaySessions"),
            "nono"
          )
        } catch (err) {
          res = err
        }
      })

      it("retrieves the cart", () => {
        expect(CartModelMock.findOne).toHaveBeenCalledTimes(1)
        expect(CartModelMock.findOne).toHaveBeenCalledWith({
          _id: IdMap.getId("cartWithPaySessions"),
        })
      })

      it("throws invalid data errro", () => {
        expect(res.message).toEqual(
          "The provider_id did not match any open payment sessions"
        )
      })
    })
  })

  describe("addShippingMethod", () => {
    const cartService = new CartService({
      cartModel: CartModelMock,
      shippingProfileService: ShippingProfileServiceMock,
      shippingOptionService: ShippingOptionServiceMock,
      eventBusService: EventBusServiceMock,
    })

    describe("successfully adds the shipping method", () => {
      const data = {
        id: "testshipperid",
        extra: "yes",
      }

      beforeAll(async () => {
        jest.clearAllMocks()
        const cartId = IdMap.getId("cartWithPaySessions")
        await cartService.addShippingMethod(
          cartId,
          IdMap.getId("freeShipping"),
          data
        )
      })

      it("validates option", () => {
        expect(
          ShippingOptionServiceMock.validateCartOption
        ).toHaveBeenCalledWith(
          IdMap.getId("freeShipping"),
          carts.cartWithPaySessions
        )
      })

      it("validates fulfillment data", () => {
        expect(
          ShippingOptionServiceMock.validateFulfillmentData
        ).toHaveBeenCalledWith(
          IdMap.getId("freeShipping"),
          data,
          carts.cartWithPaySessions
        )
      })

      it("gets shipping profile", () => {
        expect(ShippingProfileServiceMock.list).toHaveBeenCalledWith({
          shipping_options: IdMap.getId("freeShipping"),
        })
      })

      it("updates cart", () => {
        expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
        expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
          "cart.updated",
          expect.any(Object)
        )

        expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
        expect(CartModelMock.updateOne).toHaveBeenCalledWith(
          {
            _id: IdMap.getId("cartWithPaySessions"),
          },
          {
            $set: {
              items: [
                {
                  _id: IdMap.getId("existingLine"),
                  title: "merge line",
                  description: "This is a new line",
                  has_shipping: true,
                  thumbnail: "test-img-yeah.com/thumb",
                  content: {
                    unit_price: 123,
                    variant: {
                      _id: IdMap.getId("can-cover"),
                    },
                    product: {
                      _id: IdMap.getId("product"),
                    },
                    quantity: 1,
                  },
                  quantity: 10,
                },
              ],
              shipping_methods: [
                {
                  _id: IdMap.getId("freeShipping"),
                  price: 0,
                  provider_id: "default_provider",
                  profile_id: IdMap.getId("default_profile"),
                  data,
                },
              ],
            },
          }
        )
      })
    })

    describe("successfully overrides existing profile shipping method", () => {
      const data = {
        id: "testshipperid",
      }

      beforeAll(async () => {
        jest.clearAllMocks()
        const cartId = IdMap.getId("fr-cart")
        await cartService.addShippingMethod(
          cartId,
          IdMap.getId("freeShipping"),
          data
        )
      })

      it("updates cart", () => {
        expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
        expect(CartModelMock.updateOne).toHaveBeenCalledWith(
          {
            _id: IdMap.getId("fr-cart"),
          },
          {
            $set: {
              items: carts.frCart.items.map(i => ({
                ...i,
                has_shipping: false,
              })),
              shipping_methods: [
                {
                  _id: IdMap.getId("freeShipping"),
                  price: 0,
                  provider_id: "default_provider",
                  profile_id: IdMap.getId("default_profile"),
                  data: {
                    id: "testshipperid",
                  },
                },
              ],
            },
          }
        )
      })
    })

    describe("successfully adds additional shipping method", () => {
      const data = {
        id: "additional_shipper_id",
      }

      beforeAll(async () => {
        jest.clearAllMocks()
        const cartId = IdMap.getId("fr-cart")
        await cartService.addShippingMethod(
          cartId,
          IdMap.getId("additional"),
          data
        )
      })

      it("updates cart", () => {
        expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
        expect(CartModelMock.updateOne).toHaveBeenCalledWith(
          {
            _id: IdMap.getId("fr-cart"),
          },
          {
            $set: {
              items: carts.frCart.items.map(i => ({
                ...i,
                has_shipping: false,
              })),
              shipping_methods: [
                {
                  _id: IdMap.getId("freeShipping"),
                  profile_id: IdMap.getId("default_profile"),
                },
                {
                  _id: IdMap.getId("additional"),
                  price: 0,
                  profile_id: IdMap.getId("additional_profile"),
                  provider_id: "default_provider",
                  data,
                },
              ],
            },
          }
        )
      })
    })

    describe("throws if no profile", () => {
      let res
      beforeAll(async () => {
        jest.clearAllMocks()
        const cartId = IdMap.getId("fr-cart")
        try {
          await cartService.addShippingMethod(cartId, IdMap.getId("fail"), {})
        } catch (err) {
          res = err
        }
      })

      it("throw error", () => {
        expect(res.message).toEqual(
          "Shipping Method must belong to a shipping profile"
        )
      })
    })
  })

  describe("applyDiscount", () => {
    const cartService = new CartService({
      cartModel: CartModelMock,
      discountService: DiscountServiceMock,
      eventBusService: EventBusServiceMock,
    })
    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully applies discount to cart", async () => {
      await cartService.applyDiscount(IdMap.getId("fr-cart"), "10%OFF")
      expect(CartModelMock.findOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.findOne).toHaveBeenCalledWith({
        _id: IdMap.getId("fr-cart"),
      })

      expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
      expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
        "cart.updated",
        expect.any(Object)
      )

      expect(DiscountServiceMock.retrieveByCode).toHaveBeenCalledTimes(1)
      expect(DiscountServiceMock.retrieveByCode).toHaveBeenCalledWith("10%OFF")

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("fr-cart"),
        },
        {
          $push: { discounts: discounts.total10Percent },
        }
      )
    })

    it("successfully applies discount to cart and removes old one", async () => {
      await cartService.applyDiscount(
        IdMap.getId("discount-cart-with-existing"),
        "10%OFF"
      )
      expect(CartModelMock.findOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.findOne).toHaveBeenCalledWith({
        _id: IdMap.getId("discount-cart-with-existing"),
      })

      expect(DiscountServiceMock.retrieveByCode).toHaveBeenCalledTimes(1)
      expect(DiscountServiceMock.retrieveByCode).toHaveBeenCalledWith("10%OFF")

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("discount-cart-with-existing"),
        },
        {
          $push: { discounts: discounts.total10Percent },
          $pull: { discounts: { _id: IdMap.getId("item10Percent") } },
        }
      )
    })

    it("successfully applies free shipping", async () => {
      await cartService.applyDiscount(
        IdMap.getId("discount-cart-with-existing"),
        "FREESHIPPING"
      )
      expect(CartModelMock.findOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.findOne).toHaveBeenCalledWith({
        _id: IdMap.getId("discount-cart-with-existing"),
      })

      expect(DiscountServiceMock.retrieveByCode).toHaveBeenCalledTimes(1)
      expect(DiscountServiceMock.retrieveByCode).toHaveBeenCalledWith(
        "FREESHIPPING"
      )

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("discount-cart-with-existing"),
        },
        {
          $push: { discounts: discounts.freeShipping },
        }
      )
    })

    it("successfully resolves ", async () => {
      await cartService.applyDiscount(
        IdMap.getId("discount-cart-with-existing"),
        "FREESHIPPING"
      )
      expect(CartModelMock.findOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.findOne).toHaveBeenCalledWith({
        _id: IdMap.getId("discount-cart-with-existing"),
      })

      expect(DiscountServiceMock.retrieveByCode).toHaveBeenCalledTimes(1)
      expect(DiscountServiceMock.retrieveByCode).toHaveBeenCalledWith(
        "FREESHIPPING"
      )

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("discount-cart-with-existing"),
        },
        {
          $push: { discounts: discounts.freeShipping },
        }
      )
    })

    it("throws if discount is not available in region", async () => {
      try {
        await cartService.applyDiscount(
          IdMap.getId("discount-cart-with-existing"),
          "US10"
        )
      } catch (error) {
        expect(error.message).toEqual(
          "The discount is not available in current region"
        )
      }
    })
  })
})
