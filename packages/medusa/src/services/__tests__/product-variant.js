import mongoose from "mongoose"
import { IdMap } from "medusa-test-utils"
import ProductVariantService from "../product-variant"
import { ProductVariantModelMock } from "../../models/__mocks__/product-variant"
import { ProductServiceMock } from "../__mocks__/product"

describe("ProductVariantService", () => {
  describe("retrieve", () => {
    describe("successfully get product variant", () => {
      let res
      beforeAll(async () => {
        const productVariantService = new ProductVariantService({
          productVariantModel: ProductVariantModelMock,
        })

        res = await productVariantService.retrieve(IdMap.getId("validId"))
      })

      afterAll(() => {
        jest.clearAllMocks()
      })

      it("calls model layer findOne", () => {
        expect(ProductVariantModelMock.findOne).toHaveBeenCalledTimes(1)
        expect(ProductVariantModelMock.findOne).toHaveBeenCalledWith({
          _id: IdMap.getId("validId"),
        })
      })

      it("returns correct variant", () => {
        expect(res.title).toEqual("test")
      })
    })

    describe("query fail", () => {
      let res
      beforeAll(async () => {
        const productVariantService = new ProductVariantService({
          productVariantModel: ProductVariantModelMock,
        })

        await productVariantService
          .retrieve(IdMap.getId("failId"))
          .catch(err => {
            res = err
          })
      })

      afterAll(() => {
        jest.clearAllMocks()
      })

      it("calls model layer findOne", () => {
        expect(ProductVariantModelMock.findOne).toHaveBeenCalledTimes(1)
        expect(ProductVariantModelMock.findOne).toHaveBeenCalledWith({
          _id: IdMap.getId("failId"),
        })
      })

      it("model query throws error", () => {
        expect(res.name).toEqual("database_error")
        expect(res.message).toEqual("test error")
      })
    })
  })
  describe("createDraft", () => {
    beforeAll(() => {
      jest.clearAllMocks()
      const productVariantService = new ProductVariantService({
        productVariantModel: ProductVariantModelMock,
      })

      productVariantService.createDraft({
        title: "Test Prod",
        image: "test-image",
        options: [],
        prices: [
          {
            currency_code: "usd",
            amount: 100,
          },
        ],
      })
    })

    it("calls model layer create", () => {
      expect(ProductVariantModelMock.create).toHaveBeenCalledTimes(1)
      expect(ProductVariantModelMock.create).toHaveBeenCalledWith({
        title: "Test Prod",
        image: "test-image",
        options: [],
        prices: [
          {
            currency_code: "usd",
            amount: 100,
          },
        ],
        published: false,
      })
    })
  })

  describe("publishVariant", () => {
    beforeAll(() => {
      jest.clearAllMocks()
      const productVariantService = new ProductVariantService({
        productVariantModel: ProductVariantModelMock,
      })

      productVariantService.publish(IdMap.getId("variantId"))
    })

    it("calls model layer create", () => {
      expect(ProductVariantModelMock.create).toHaveBeenCalledTimes(0)
      expect(ProductVariantModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(ProductVariantModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("variantId") },
        { $set: { published: true } }
      )
    })
  })

  describe("update", () => {
    const productVariantService = new ProductVariantService({
      productVariantModel: ProductVariantModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls updateOne with correct params", async () => {
      const id = mongoose.Types.ObjectId()

      await productVariantService.update(`${id}`, { title: "new title" })

      expect(ProductVariantModelMock.updateOne).toBeCalledTimes(1)
      expect(ProductVariantModelMock.updateOne).toBeCalledWith(
        { _id: `${id}` },
        { $set: { title: "new title" } },
        { runValidators: true }
      )
    })

    it("throw error on invalid variant id type", async () => {
      try {
        await productVariantService.update(19314235, { title: "new title" })
      } catch (err) {
        expect(err.message).toEqual(
          "The variantId could not be casted to an ObjectId"
        )
      }
    })

    it("throws error when trying to update metadata", async () => {
      const id = mongoose.Types.ObjectId()
      try {
        await productVariantService.update(`${id}`, {
          metadata: { key: "value" },
        })
      } catch (err) {
        expect(err.message).toEqual("Use setMetadata to update metadata fields")
      }
    })
  })

  describe("decorate", () => {
    const productVariantService = new ProductVariantService({
      productVariantModel: ProductVariantModelMock,
    })

    const fakeVariant = {
      _id: "1234",
      title: "test",
      image: "test-image",
      prices: [
        {
          currency_code: "usd",
          amount: 100,
        },
      ],
      metadata: { testKey: "testValue" },
      published: true,
    }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("returns decorated product", async () => {
      const decorated = await productVariantService.decorate(fakeVariant, [])
      expect(decorated).toEqual({
        _id: "1234",
        metadata: { testKey: "testValue" },
      })
    })

    it("returns decorated product with handle", async () => {
      const decorated = await productVariantService.decorate(fakeVariant, [
        "prices",
      ])
      expect(decorated).toEqual({
        _id: "1234",
        metadata: { testKey: "testValue" },
        prices: [
          {
            currency_code: "usd",
            amount: 100,
          },
        ],
      })
    })
  })

  describe("setMetadata", () => {
    const productVariantService = new ProductVariantService({
      productVariantModel: ProductVariantModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls updateOne with correct params", async () => {
      const id = mongoose.Types.ObjectId()
      await productVariantService.setMetadata(
        `${id}`,
        "metadata",
        "testMetadata"
      )

      expect(ProductVariantModelMock.updateOne).toBeCalledTimes(1)
      expect(ProductVariantModelMock.updateOne).toBeCalledWith(
        { _id: `${id}` },
        { $set: { "metadata.metadata": "testMetadata" } }
      )
    })

    it("throw error on invalid key type", async () => {
      const id = mongoose.Types.ObjectId()

      try {
        await productVariantService.setMetadata(`${id}`, 1234, "nono")
      } catch (err) {
        expect(err.message).toEqual(
          "Key type is invalid. Metadata keys must be strings"
        )
      }
    })

    it("throws error on invalid variantId type", async () => {
      try {
        await productVariantService.setMetadata("fakeVariantId", 1234, "nono")
      } catch (err) {
        expect(err.message).toEqual(
          "The variantId could not be casted to an ObjectId"
        )
      }
    })
  })

  describe("addOptionValue", () => {
    const productVariantService = new ProductVariantService({
      productVariantModel: ProductVariantModelMock,
      productService: ProductServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("it successfully adds option value", async () => {
      await productVariantService.addOptionValue(
        IdMap.getId("testVariant"),
        IdMap.getId("testOptionId"),
        "testValue"
      )

      expect(ProductVariantModelMock.updateOne).toBeCalledTimes(1)
      expect(ProductVariantModelMock.updateOne).toBeCalledWith(
        { _id: IdMap.getId("testVariant") },
        {
          $push: {
            options: {
              option_id: IdMap.getId("testOptionId"),
              value: "testValue",
            },
          },
        }
      )
    })

    it("it successfully casts numeric option value to string", async () => {
      await productVariantService.addOptionValue(
        IdMap.getId("testVariant"),
        IdMap.getId("testOptionId"),
        1234
      )

      expect(ProductVariantModelMock.updateOne).toBeCalledTimes(1)
      expect(ProductVariantModelMock.updateOne).toBeCalledWith(
        { _id: IdMap.getId("testVariant") },
        {
          $push: {
            options: {
              option_id: IdMap.getId("testOptionId"),
              value: "1234",
            },
          },
        }
      )
    })

    it("throw error if product with variant does not exist", async () => {
      try {
        await productVariantService.addOptionValue(
          IdMap.getId("failId"),
          IdMap.getId("testOptionId"),
          "testValue"
        )
      } catch (err) {
        expect(err.message).toEqual(
          `Products with variant: ${IdMap.getId("failId")} was not found`
        )
      }
    })

    it("throw error if product does not have option id", async () => {
      try {
        await productVariantService.addOptionValue(
          IdMap.getId("testVariant"),
          IdMap.getId("failOptionId"),
          "testValue"
        )
      } catch (err) {
        expect(err.message).toEqual(
          `Associated product does not have option: ${IdMap.getId(
            "failOptionId"
          )}`
        )
      }
    })

    it("throw error if option value is not string", async () => {
      try {
        await productVariantService.addOptionValue(
          IdMap.getId("testVariant"),
          IdMap.getId("testOptionId"),
          {}
        )
      } catch (err) {
        expect(err.message).toEqual(
          `Option value is not of type string or number`
        )
      }
    })
  })

  describe("deleteOptionValue", () => {
    const productVariantService = new ProductVariantService({
      productVariantModel: ProductVariantModelMock,
      productService: ProductServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully deletes option value from variant", async () => {
      await productVariantService.deleteOptionValue(
        IdMap.getId("testVariant"),
        IdMap.getId("testing")
      )

      expect(ProductVariantModelMock.updateOne).toBeCalledTimes(1)
      expect(ProductVariantModelMock.updateOne).toBeCalledWith(
        { _id: IdMap.getId("testVariant") },
        { $pull: { options: { option_id: IdMap.getId("testing") } } }
      )
    })

    it("throw error if product still has the option id of the option value we are trying to delete", async () => {
      try {
        await productVariantService.deleteOptionValue(
          IdMap.getId("testVariant"),
          IdMap.getId("testOptionId")
        )
      } catch (err) {
        expect(err.message).toEqual(
          `Associated product has option with id: ${IdMap.getId(
            "testOptionId"
          )}`
        )
      }
    })
  })

  describe("delete", () => {
    const productVariantService = new ProductVariantService({
      productVariantModel: ProductVariantModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("deletes all variants and product successfully", async () => {
      await productVariantService.delete(IdMap.getId("deleteId"))

      expect(ProductVariantModelMock.deleteOne).toBeCalledTimes(1)
      expect(ProductVariantModelMock.deleteOne).toBeCalledWith({
        _id: IdMap.getId("deleteId"),
      })
    })
  })
})
