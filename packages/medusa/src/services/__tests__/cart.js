import mongoose from "mongoose"
import { IdMap } from "medusa-test-utils"
import CartService from "../cart"
import { ProductVariantServiceMock } from "../__mocks__/product-variant"
import { RegionServiceMock } from "../__mocks__/region"
import { CartModelMock, carts } from "../../models/__mocks__/cart"

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
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls updateOne with correct params", async () => {
      const id = mongoose.Types.ObjectId()
      await cartService.setMetadata(`${id}`, "metadata", "testMetadata")

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

  describe("addLineItem", () => {
    const cartService = new CartService({
      cartModel: CartModelMock,
      productVariantService: ProductVariantServiceMock,
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

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("emptyCart"),
        },
        {
          $push: { items: lineItem },
        }
      )
    })

    it("successfully defaults quantity of content to 1", async () => {
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
        },
        quantity: 10,
      }

      await cartService.addLineItem(IdMap.getId("emptyCart"), lineItem)

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("emptyCart"),
        },
        {
          $push: {
            items: {
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
          "items._id": IdMap.getId("existingLine"),
        },
        {
          $set: { "items.$.quantity": 20 },
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
          $push: { items: lineItem },
        }
      )
    })

    it("throws if line item not validated", async () => {
      const lineItem = {
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
      }

      try {
        await cartService.addLineItem(IdMap.getId("cartWithLine"), lineItem)
      } catch (err) {
        expect(err.message).toEqual(`"content" is required`)
      }
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

  describe("updateEmail", () => {
    const cartService = new CartService({
      cartModel: CartModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully updates an email", async () => {
      await cartService.updateEmail(
        IdMap.getId("emptyCart"),
        "test@testdom.com"
      )

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("emptyCart"),
        },
        {
          $set: { email: "test@testdom.com" },
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
      }

      await cartService.updateBillingAddress(IdMap.getId("emptyCart"), address)

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
        expect(err.message).toEqual("The address is not valid")
      }

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(0)
    })
  })

  describe("updateShippingAddress", () => {
    const cartService = new CartService({
      cartModel: CartModelMock,
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
      }

      await cartService.updateShippingAddress(IdMap.getId("emptyCart"), address)

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
        await cartService.updateShippingAddress(
          IdMap.getId("emptyCart"),
          address
        )
      } catch (err) {
        expect(err.message).toEqual("The address is not valid")
      }

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(0)
    })
  })

  describe("setRegion", () => {
    const cartService = new CartService({
      cartModel: CartModelMock,
      regionService: RegionServiceMock,
      productVariantService: ProductVariantServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully set new region", async () => {
      await cartService.setRegion(
        IdMap.getId("fr-cart"),
        IdMap.getId("region-us")
      )

      expect(CartModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(CartModelMock.updateOne).toHaveBeenCalledWith(
        {
          _id: IdMap.getId("fr-cart"),
        },
        {
          $set: {
            region_id: IdMap.getId("region-us"),
            items: [
              {
                _id: IdMap.getId("line"),
                title: "merge line",
                description: "This is a new line",
                thumbnail: "test-img-yeah.com/thumb",
                content: [
                  {
                    unit_price: 10,
                    variant: {
                      _id: IdMap.getId("eur-8-us-10"),
                    },
                    product: {
                      _id: IdMap.getId("product"),
                    },
                    quantity: 1,
                  },
                  {
                    unit_price: 12,
                    variant: {
                      _id: IdMap.getId("eur-10-us-12"),
                    },
                    product: {
                      _id: IdMap.getId("product"),
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
                content: {
                  unit_price: 12,
                  variant: {
                    _id: IdMap.getId("eur-10-us-12"),
                  },
                  product: {
                    _id: IdMap.getId("product"),
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
            region_id: IdMap.getId("region-us"),
            shipping_method: undefined,
            payment_method: undefined,
            shipping_address: {
              first_name: "hi",
              last_name: "you",
              country_code: "",
              city: "of lights",
              address_1: "You bet street",
              postal_code: "4242",
            },
            billing_address: {
              first_name: "hi",
              last_name: "you",
              country_code: "",
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
})
