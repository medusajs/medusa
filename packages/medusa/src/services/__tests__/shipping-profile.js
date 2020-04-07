import mongoose from "mongoose"
import { IdMap } from "medusa-test-utils"
import ShippingProfileService from "../shipping-profile"
import { ShippingProfileModelMock } from "../../models/__mocks__/shipping-profile"
import { ProductServiceMock, products } from "../__mocks__/product"
import {
  ShippingOptionServiceMock,
  shippingOptions,
} from "../__mocks__/shipping-option"

describe("ShippingProfileService", () => {
  describe("retrieve", () => {
    describe("successfully get profile", () => {
      let res
      beforeAll(async () => {
        const profileService = new ShippingProfileService({
          shippingProfileModel: ShippingProfileModelMock,
        })

        res = await profileService.retrieve(IdMap.getId("validId"))
      })

      afterAll(() => {
        jest.clearAllMocks()
      })

      it("calls model layer findOne", () => {
        expect(ShippingProfileModelMock.findOne).toHaveBeenCalledTimes(1)
        expect(ShippingProfileModelMock.findOne).toHaveBeenCalledWith({
          _id: IdMap.getId("validId"),
        })
      })

      it("returns correct product", () => {
        expect(res.name).toEqual("Default Profile")
      })
    })

    describe("query fail", () => {
      let res
      beforeAll(async () => {
        const profileService = new ShippingProfileService({
          shippingProfileModel: ShippingProfileModelMock,
        })

        await profileService.retrieve(IdMap.getId("failId")).catch(err => {
          res = err
        })
      })

      afterAll(() => {
        jest.clearAllMocks()
      })

      it("calls model layer findOne", () => {
        expect(ShippingProfileModelMock.findOne).toHaveBeenCalledTimes(1)
        expect(ShippingProfileModelMock.findOne).toHaveBeenCalledWith({
          _id: IdMap.getId("failId"),
        })
      })

      it("model query throws error", () => {
        expect(res.name).toEqual("not_found")
      })
    })
  })

  describe("decorate", () => {
    const profileService = new ShippingProfileService({
      shippingProfileModel: ShippingProfileModelMock,
      productService: ProductServiceMock,
      shippingOptionService: ShippingOptionServiceMock,
    })

    const fakeProfile = {
      _id: "1234",
      name: "Fake",
      products: [IdMap.getId("product1")],
      shipping_options: [IdMap.getId("franceShipping")],
      metadata: {},
    }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("returns decorated profile", async () => {
      const decorated = await profileService.decorate(
        fakeProfile,
        [],
        ["shipping_options"]
      )
      expect(decorated).toEqual({
        _id: "1234",
        metadata: {},
        shipping_options: [shippingOptions.franceShipping],
      })
    })

    it("returns decorated profile with name", async () => {
      const decorated = await profileService.decorate(
        fakeProfile,
        ["name"],
        ["products"]
      )
      expect(decorated).toEqual({
        _id: "1234",
        metadata: {},
        name: "Fake",
        products: [products.product1],
      })
    })
  })

  describe("setMetadata", () => {
    const profileService = new ShippingProfileService({
      shippingProfileModel: ShippingProfileModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls updateOne with correct params", async () => {
      const id = mongoose.Types.ObjectId()
      await profileService.setMetadata(`${id}`, "metadata", "testMetadata")

      expect(ShippingProfileModelMock.updateOne).toBeCalledTimes(1)
      expect(ShippingProfileModelMock.updateOne).toBeCalledWith(
        { _id: `${id}` },
        { $set: { "metadata.metadata": "testMetadata" } }
      )
    })

    it("throw error on invalid key type", async () => {
      const id = mongoose.Types.ObjectId()

      try {
        await profileService.setMetadata(`${id}`, 1234, "nono")
      } catch (err) {
        expect(err.message).toEqual(
          "Key type is invalid. Metadata keys must be strings"
        )
      }
    })

    it("throws error on invalid profileId type", async () => {
      try {
        await profileService.setMetadata("fakeProfileId", 1234, "nono")
      } catch (err) {
        expect(err.message).toEqual(
          "The profileId could not be casted to an ObjectId"
        )
      }
    })
  })

  describe("update", () => {
    const profileService = new ShippingProfileService({
      shippingProfileModel: ShippingProfileModelMock,
      productService: ProductServiceMock,
      shippingOptionService: ShippingOptionServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls updateOne with correct params", async () => {
      const id = IdMap.getId("validId")

      await profileService.update(`${id}`, { name: "new title" })

      expect(ShippingProfileModelMock.updateOne).toBeCalledTimes(1)
      expect(ShippingProfileModelMock.updateOne).toBeCalledWith(
        { _id: `${id}` },
        { $set: { name: "new title" } },
        { runValidators: true }
      )
    })

    it("calls updateOne products", async () => {
      const id = IdMap.getId("validId")

      await profileService.update(`${id}`, {
        products: [IdMap.getId("product1"), IdMap.getId("product1")],
      })

      expect(ProductServiceMock.retrieve).toBeCalledTimes(1)
      expect(ProductServiceMock.retrieve).toBeCalledWith(
        IdMap.getId("product1")
      )

      expect(ShippingProfileModelMock.updateOne).toBeCalledTimes(1)
      expect(ShippingProfileModelMock.updateOne).toBeCalledWith(
        { _id: `${id}` },
        { $set: { products: [IdMap.getId("product1")] } },
        { runValidators: true }
      )
    })

    it("calls updateOne products", async () => {
      const id = IdMap.getId("profile1")

      await profileService.update(`${id}`, {
        products: [IdMap.getId("validId")],
      })

      expect(ProductServiceMock.retrieve).toBeCalledTimes(1)
      expect(ProductServiceMock.retrieve).toBeCalledWith(IdMap.getId("validId"))

      expect(ShippingProfileModelMock.updateOne).toBeCalledTimes(2)
      expect(ShippingProfileModelMock.updateOne).toBeCalledWith(
        { _id: IdMap.getId("validId") },
        { $pull: { products: IdMap.getId("validId") } }
      )
      expect(ShippingProfileModelMock.updateOne).toBeCalledWith(
        { _id: `${id}` },
        { $set: { products: [IdMap.getId("validId")] } },
        { runValidators: true }
      )
    })

    it("calls updateOne with shipping options", async () => {
      const id = IdMap.getId("profile1")

      await profileService.update(`${id}`, {
        shipping_options: [IdMap.getId("validId")],
      })

      expect(ShippingOptionServiceMock.retrieve).toBeCalledTimes(1)
      expect(ShippingOptionServiceMock.retrieve).toBeCalledWith(
        IdMap.getId("validId")
      )

      expect(ShippingProfileModelMock.updateOne).toBeCalledTimes(2)
      expect(ShippingProfileModelMock.updateOne).toBeCalledWith(
        { _id: IdMap.getId("validId") },
        { $pull: { shipping_options: IdMap.getId("validId") } }
      )
      expect(ShippingProfileModelMock.updateOne).toBeCalledWith(
        { _id: `${id}` },
        { $set: { shipping_options: [IdMap.getId("validId")] } },
        { runValidators: true }
      )
    })

    it("calls updateOne with shipping options", async () => {
      const id = IdMap.getId("validId")

      await profileService.update(`${id}`, {
        shipping_options: [IdMap.getId("validId")],
      })

      expect(ShippingOptionServiceMock.retrieve).toBeCalledTimes(1)
      expect(ShippingOptionServiceMock.retrieve).toBeCalledWith(
        IdMap.getId("validId")
      )

      expect(ShippingProfileModelMock.updateOne).toBeCalledTimes(1)
      expect(ShippingProfileModelMock.updateOne).toBeCalledWith(
        { _id: `${id}` },
        { $set: { shipping_options: [IdMap.getId("validId")] } },
        { runValidators: true }
      )
    })

    it("throw error on invalid product id type", async () => {
      await expect(
        profileService.update(19314235, { name: "new title" })
      ).rejects.toThrow("The profileId could not be casted to an ObjectId")
    })

    it("throws error when trying to update metadata", async () => {
      const id = IdMap.getId("validId")
      await expect(
        profileService.update(`${id}`, { metadata: { key: "value" } })
      ).rejects.toThrow("Use setMetadata to update metadata fields")
    })
  })

  describe("delete", () => {
    const profileService = new ShippingProfileService({
      shippingProfileModel: ShippingProfileModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("deletes the profile successfully", async () => {
      await profileService.delete(IdMap.getId("validId"))

      expect(ShippingProfileModelMock.deleteOne).toBeCalledTimes(1)
      expect(ShippingProfileModelMock.deleteOne).toBeCalledWith({
        _id: IdMap.getId("validId"),
      })
    })

    it("is idempotent", async () => {
      await profileService.delete(IdMap.getId("delete"))

      expect(ShippingProfileModelMock.deleteOne).toBeCalledTimes(0)
    })
  })

  describe("addProduct", () => {
    const profileService = new ShippingProfileService({
      shippingProfileModel: ShippingProfileModelMock,
      productService: ProductServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("add product to profile successfully", async () => {
      await profileService.addProduct(
        IdMap.getId("validId"),
        IdMap.getId("product2")
      )

      expect(ProductServiceMock.retrieve).toBeCalledTimes(1)
      expect(ProductServiceMock.retrieve).toBeCalledWith(
        IdMap.getId("product2")
      )
      expect(ShippingProfileModelMock.findOne).toBeCalledTimes(1)
      expect(ShippingProfileModelMock.findOne).toBeCalledWith({
        _id: IdMap.getId("validId"),
      })

      expect(ShippingProfileModelMock.updateOne).toBeCalledTimes(1)
      expect(ShippingProfileModelMock.updateOne).toBeCalledWith(
        { _id: IdMap.getId("validId") },
        { $push: { products: IdMap.getId("product2") } }
      )
    })

    it("is idempotent", async () => {
      await profileService.addProduct(
        IdMap.getId("validId"),
        IdMap.getId("validId")
      )

      expect(ProductServiceMock.retrieve).toBeCalledTimes(1)
      expect(ProductServiceMock.retrieve).toBeCalledWith(IdMap.getId("validId"))
      expect(ShippingProfileModelMock.findOne).toBeCalledTimes(1)
      expect(ShippingProfileModelMock.findOne).toBeCalledWith({
        _id: IdMap.getId("validId"),
      })

      expect(ShippingProfileModelMock.updateOne).toBeCalledTimes(0)
    })
  })

  describe("addShippingOption", () => {
    const profileService = new ShippingProfileService({
      shippingProfileModel: ShippingProfileModelMock,
      shippingOptionService: ShippingOptionServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("add shipping option to profile successfully", async () => {
      await profileService.addShippingOption(
        IdMap.getId("validId"),
        IdMap.getId("freeShipping")
      )

      expect(ShippingOptionServiceMock.retrieve).toBeCalledTimes(1)
      expect(ShippingOptionServiceMock.retrieve).toBeCalledWith(
        IdMap.getId("freeShipping")
      )
      expect(ShippingProfileModelMock.findOne).toBeCalledTimes(1)
      expect(ShippingProfileModelMock.findOne).toBeCalledWith({
        _id: IdMap.getId("validId"),
      })

      expect(ShippingProfileModelMock.updateOne).toBeCalledTimes(1)
      expect(ShippingProfileModelMock.updateOne).toBeCalledWith(
        { _id: IdMap.getId("validId") },
        { $push: { shipping_options: IdMap.getId("freeShipping") } }
      )
    })

    it("add product is idempotent", async () => {
      await profileService.addShippingOption(
        IdMap.getId("validId"),
        IdMap.getId("validId")
      )

      expect(ShippingOptionServiceMock.retrieve).toBeCalledTimes(1)
      expect(ShippingOptionServiceMock.retrieve).toBeCalledWith(
        IdMap.getId("validId")
      )
      expect(ShippingProfileModelMock.findOne).toBeCalledTimes(1)
      expect(ShippingProfileModelMock.findOne).toBeCalledWith({
        _id: IdMap.getId("validId"),
      })

      expect(ShippingProfileModelMock.updateOne).toBeCalledTimes(0)
    })
  })

  describe("removeShippingOption", () => {
    const profileService = new ShippingProfileService({
      shippingProfileModel: ShippingProfileModelMock,
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("deletes a shipping option from a profile", async () => {
      await profileService.removeShippingOption(
        IdMap.getId("validId"),
        IdMap.getId("validId")
      )

      expect(ShippingProfileModelMock.updateOne).toBeCalledTimes(1)
      expect(ShippingProfileModelMock.updateOne).toBeCalledWith(
        { _id: IdMap.getId("validId") },
        { $pull: { shipping_options: IdMap.getId("validId") } }
      )
    })
  })

  describe("removeProduct", () => {
    const profileService = new ShippingProfileService({
      shippingProfileModel: ShippingProfileModelMock,
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("deletes a product from a profile", async () => {
      await profileService.removeProduct(
        IdMap.getId("validId"),
        IdMap.getId("validId")
      )

      expect(ShippingProfileModelMock.updateOne).toBeCalledTimes(1)
      expect(ShippingProfileModelMock.updateOne).toBeCalledWith(
        { _id: IdMap.getId("validId") },
        { $pull: { products: IdMap.getId("validId") } }
      )
    })

    it("if product does not exist, do nothing", async () => {
      await profileService.removeProduct(
        IdMap.getId("validId"),
        IdMap.getId("produt")
      )

      expect(ShippingProfileModelMock.updateOne).not.toBeCalled()
    })
  })

  describe("create", () => {
    const profileService = new ShippingProfileService({
      shippingProfileModel: ShippingProfileModelMock,
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("successfully creates a new shipping profile", async () => {
      await profileService.create({
        name: "New Profile",
      })

      expect(ShippingProfileModelMock.create).toHaveBeenCalledTimes(1)
      expect(ShippingProfileModelMock.create).toHaveBeenCalledWith({
        name: "New Profile",
      })
    })

    it("throws if trying to create with products", async () => {
      await expect(
        profileService.create({
          name: "New Profile",
          products: ["144"],
        })
      ).rejects.toThrow(
        "Please add products and shipping_options after creating Shipping Profiles"
      )
    })
  })
})
