import mongoose from "mongoose"
import { IdMap } from "medusa-test-utils"
import ProductService from "../product"
import { ProductModelMock } from "../../models/__mocks__/product"
import {
  ProductVariantServiceMock,
  variants,
} from "../__mocks__/product-variant"
import { EventBusServiceMock } from "../__mocks__/event-bus"

describe("ProductService", () => {
  describe("retrieve", () => {
    describe("successfully get product", () => {
      let res
      beforeAll(async () => {
        const productService = new ProductService({
          productModel: ProductModelMock,
          eventBusService: EventBusServiceMock,
        })

        res = await productService.retrieve(IdMap.getId("validId"))
      })

      afterAll(() => {
        jest.clearAllMocks()
      })

      it("calls model layer findOne", () => {
        expect(ProductModelMock.findOne).toHaveBeenCalledTimes(1)
        expect(ProductModelMock.findOne).toHaveBeenCalledWith({
          _id: IdMap.getId("validId"),
        })
      })

      it("returns correct product", () => {
        expect(res.title).toEqual("test")
      })
    })

    describe("query fail", () => {
      let res
      beforeAll(async () => {
        const productService = new ProductService({
          productModel: ProductModelMock,
          eventBusService: EventBusServiceMock,
        })

        await productService.retrieve(IdMap.getId("failId")).catch(err => {
          res = err
        })
      })

      afterAll(() => {
        jest.clearAllMocks()
      })

      it("calls model layer findOne", () => {
        expect(ProductModelMock.findOne).toHaveBeenCalledTimes(1)
        expect(ProductModelMock.findOne).toHaveBeenCalledWith({
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
      const productService = new ProductService({
        productModel: ProductModelMock,
        eventBusService: EventBusServiceMock,
      })

      productService.createDraft({
        title: "Test Prod",
        description: "Test Descript",
        tags: "Teststst",
        handle: "1234",
        images: [],
        options: [],
        variants: [],
        metadata: {},
      })
    })

    it("calls model layer create", () => {
      expect(ProductModelMock.create).toHaveBeenCalledTimes(1)
      expect(ProductModelMock.create).toHaveBeenCalledWith({
        title: "Test Prod",
        description: "Test Descript",
        tags: "Teststst",
        handle: "1234",
        images: [],
        options: [],
        variants: [],
        metadata: {},
        published: false,
      })
    })
  })

  describe("publishProduct", () => {
    const productId = mongoose.Types.ObjectId()

    beforeAll(() => {
      jest.clearAllMocks()
      const productService = new ProductService({
        productModel: ProductModelMock,
        productVariantService: ProductVariantServiceMock,
        eventBusService: EventBusServiceMock,
      })

      productService.publish(IdMap.getId("productId"))
    })

    it("calls model layer create", () => {
      expect(ProductModelMock.create).toHaveBeenCalledTimes(0)
      expect(ProductModelMock.updateOne).toHaveBeenCalledTimes(1)
      expect(ProductModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("productId") },
        { $set: { published: true } }
      )
    })
  })

  describe("decorate", () => {
    const productService = new ProductService({
      productModel: ProductModelMock,
      productVariantService: ProductVariantServiceMock,
      eventBusService: EventBusServiceMock,
    })

    const fakeProduct = {
      _id: IdMap.getId("fakeId"),
      variants: ["1", "2", "3"],
      tags: "testtag1, testtag2",
      handle: "test-product",
      metadata: { testKey: "testValue" },
    }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("returns decorated product", async () => {
      const decorated = await productService.decorate(
        fakeProduct,
        [],
        ["variants"]
      )
      expect(decorated).toEqual({
        _id: IdMap.getId("fakeId"),
        metadata: { testKey: "testValue" },
        variants: [variants.one, variants.two, variants.three],
      })
    })

    it("returns decorated product with handle", async () => {
      const decorated = await productService.decorate(
        fakeProduct,
        ["handle"],
        ["variants"]
      )
      expect(decorated).toEqual({
        _id: IdMap.getId("fakeId"),
        metadata: { testKey: "testValue" },
        handle: "test-product",
        variants: [variants.one, variants.two, variants.three],
      })
    })

    it("returns decorated product with handle and tags", async () => {
      const decorated = await productService.decorate(fakeProduct, [
        "handle",
        "tags",
      ])
      expect(decorated).toEqual({
        _id: IdMap.getId("fakeId"),
        metadata: { testKey: "testValue" },
        tags: "testtag1, testtag2",
        handle: "test-product",
      })
    })

    it("returns decorated product with metadata", async () => {
      const decorated = await productService.decorate(fakeProduct, [])
      expect(decorated).toEqual({
        _id: IdMap.getId("fakeId"),
        metadata: { testKey: "testValue" },
      })
    })
  })

  describe("setMetadata", () => {
    const productService = new ProductService({
      productModel: ProductModelMock,
      eventBusService: EventBusServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls updateOne with correct params", async () => {
      const id = mongoose.Types.ObjectId()
      await productService.setMetadata(`${id}`, "metadata", "testMetadata")

      expect(ProductModelMock.updateOne).toBeCalledTimes(1)
      expect(ProductModelMock.updateOne).toBeCalledWith(
        { _id: `${id}` },
        { $set: { "metadata.metadata": "testMetadata" } }
      )
    })

    it("throw error on invalid key type", async () => {
      const id = mongoose.Types.ObjectId()

      try {
        await productService.setMetadata(`${id}`, 1234, "nono")
      } catch (err) {
        expect(err.message).toEqual(
          "Key type is invalid. Metadata keys must be strings"
        )
      }
    })

    it("throws error on invalid productId type", async () => {
      try {
        await productService.setMetadata("fakeProductId", 1234, "nono")
      } catch (err) {
        expect(err.message).toEqual(
          "The productId could not be casted to an ObjectId"
        )
      }
    })
  })

  describe("update", () => {
    const productService = new ProductService({
      productModel: ProductModelMock,
      eventBusService: EventBusServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls updateOne with correct params", async () => {
      const id = mongoose.Types.ObjectId()

      await productService.update(`${id}`, { title: "new title" })

      expect(ProductModelMock.updateOne).toBeCalledTimes(1)
      expect(ProductModelMock.updateOne).toBeCalledWith(
        { _id: `${id}` },
        { $set: { title: "new title" } },
        { runValidators: true }
      )
    })

    it("throw error on invalid product id type", async () => {
      try {
        await productService.update(19314235, { title: "new title" })
      } catch (err) {
        expect(err.message).toEqual(
          "The productId could not be casted to an ObjectId"
        )
      }
    })

    it("throws error when trying to update metadata", async () => {
      const id = mongoose.Types.ObjectId()
      try {
        await productService.update(`${id}`, { metadata: { key: "value" } })
      } catch (err) {
        expect(err.message).toEqual("Use setMetadata to update metadata fields")
      }
    })

    it("throws error when trying to update variants", async () => {
      const id = mongoose.Types.ObjectId()
      try {
        await productService.update(`${id}`, { variants: ["1", "2"] })
      } catch (err) {
        expect(err.message).toEqual(
          "Use addVariant, reorderVariants, removeVariant to update Product Variants"
        )
      }
    })
  })

  describe("delete", () => {
    const productService = new ProductService({
      productModel: ProductModelMock,
      productVariantService: ProductVariantServiceMock,
      eventBusService: EventBusServiceMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("deletes all variants and product successfully", async () => {
      await productService.delete(IdMap.getId("deleteId"))

      expect(ProductVariantServiceMock.delete).toBeCalledTimes(2)
      expect(ProductVariantServiceMock.delete).toBeCalledWith("1")
      expect(ProductVariantServiceMock.delete).toBeCalledWith("2")

      expect(ProductModelMock.deleteOne).toBeCalledTimes(1)
      expect(ProductModelMock.deleteOne).toBeCalledWith({
        _id: IdMap.getId("deleteId"),
      })
    })
  })

  describe("createVariant", () => {
    const productService = new ProductService({
      productModel: ProductModelMock,
      productVariantService: ProductVariantServiceMock,
      eventBusService: EventBusServiceMock,
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("add variant to product successfilly", async () => {
      await productService.createVariant(IdMap.getId("variantProductId"), {
        title: "variant1",
        options: [
          {
            option_id: IdMap.getId("color_id"),
            value: "blue",
          },
          {
            option_id: IdMap.getId("size_id"),
            value: "160",
          },
        ],
      })

      expect(ProductVariantServiceMock.createDraft).toBeCalledTimes(1)
      expect(ProductVariantServiceMock.createDraft).toBeCalledWith({
        title: "variant1",
        options: [
          {
            option_id: IdMap.getId("color_id"),
            value: "blue",
          },
          {
            option_id: IdMap.getId("size_id"),
            value: "160",
          },
        ],
      })

      expect(ProductModelMock.findOne).toBeCalledTimes(2)
      expect(ProductModelMock.findOne).toBeCalledWith({
        _id: IdMap.getId("variantProductId"),
      })

      expect(ProductModelMock.updateOne).toBeCalledTimes(1)
      expect(ProductModelMock.updateOne).toBeCalledWith(
        { _id: IdMap.getId("variantProductId") },
        { $push: { variants: expect.stringMatching(/.*/) } }
      )
    })

    it("add variant to product successfully", async () => {
      await productService.createVariant(
        IdMap.getId("productWithFourVariants"),
        {
          title: "variant1",
          options: [
            {
              option_id: IdMap.getId("color_id"),
              value: "blue",
            },
            {
              option_id: IdMap.getId("size_id"),
              value: "1600",
            },
          ],
        }
      )

      expect(ProductVariantServiceMock.createDraft).toBeCalledTimes(1)
      expect(ProductVariantServiceMock.createDraft).toBeCalledWith({
        title: "variant1",
        options: [
          {
            option_id: IdMap.getId("color_id"),
            value: "blue",
          },
          {
            option_id: IdMap.getId("size_id"),
            value: "1600",
          },
        ],
      })

      expect(ProductModelMock.findOne).toBeCalledTimes(2)
      expect(ProductModelMock.findOne).toBeCalledWith({
        _id: IdMap.getId("productWithFourVariants"),
      })

      expect(ProductModelMock.updateOne).toBeCalledTimes(1)
      expect(ProductModelMock.updateOne).toBeCalledWith(
        { _id: IdMap.getId("productWithFourVariants") },
        { $push: { variants: expect.stringMatching(/.*/) } }
      )
    })

    it("throws error if option id is not present in product", async () => {
      await expect(
        productService.createVariant(IdMap.getId("variantProductId"), {
          title: "variant3",
          options: [
            {
              option_id: "invalid_id",
              value: "blue",
            },
            {
              option_id: IdMap.getId("size_id"),
              value: "150",
            },
          ],
        })
      ).rejects.toThrow("Variant options do not contain value for Color")
    })

    it("throws error if product variant options is empty", async () => {
      await expect(
        productService.createVariant(IdMap.getId("variantProductId"), {
          title: "variant3",
          options: [],
        })
      ).rejects.toThrow(
        "Product options length does not match variant options length. Product has 2 and variant has 0."
      )
    })

    it("throws error if product options is empty and product variant contains options", async () => {
      await expect(
        productService.createVariant(IdMap.getId("emptyVariantProductId"), {
          title: "variant1",
          options: [
            {
              option_id: IdMap.getId("color_id"),
              value: "blue",
            },
            {
              option_id: IdMap.getId("size_id"),
              value: "160",
            },
          ],
        })
      ).rejects.toThrow(
        "Product options length does not match variant options length. Product has 0 and variant has 2."
      )
    })

    it("throws error if option values of added variant already exists", async () => {
      await expect(
        productService.createVariant(IdMap.getId("productWithVariants"), {
          title: "variant3",
          options: [
            {
              option_id: IdMap.getId("color_id"),
              value: "blue",
            },
            {
              option_id: IdMap.getId("size_id"),
              value: "150",
            },
          ],
        })
      ).rejects.toThrow("Variant with provided options already exists")
    })
  })

  describe("addOption", () => {
    const productService = new ProductService({
      productModel: ProductModelMock,
      productVariantService: ProductVariantServiceMock,
      eventBusService: EventBusServiceMock,
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("creates variant option values and adds option", async () => {
      await productService.addOption(
        IdMap.getId("productWithVariants"),
        "Material"
      )

      expect(ProductVariantServiceMock.addOptionValue).toHaveBeenCalledTimes(3)
      expect(ProductVariantServiceMock.addOptionValue).toHaveBeenCalledWith(
        "1",
        expect.anything(),
        "Default Value"
      )
      expect(ProductVariantServiceMock.addOptionValue).toHaveBeenCalledWith(
        "3",
        expect.anything(),
        "Default Value"
      )
      expect(ProductVariantServiceMock.addOptionValue).toHaveBeenCalledWith(
        "4",
        expect.anything(),
        "Default Value"
      )

      expect(ProductModelMock.updateOne).toHaveBeenCalledWith(
        { _id: IdMap.getId("productWithVariants") },
        {
          $push: {
            options: {
              _id: expect.anything(),
              title: "Material",
              product_id: IdMap.getId("productWithVariants"),
            },
          },
        }
      )
    })

    it("cleans up after fail", async () => {
      try {
        await productService.addOption(
          IdMap.getId("productWithVariantsFail"),
          "Material"
        )
      } catch (err) {
        expect(err)
      }

      expect(ProductVariantServiceMock.addOptionValue).toHaveBeenCalledTimes(3)
      expect(ProductVariantServiceMock.addOptionValue).toHaveBeenCalledWith(
        "1",
        expect.anything(),
        "Default Value"
      )
      expect(ProductVariantServiceMock.addOptionValue).toHaveBeenCalledWith(
        "3",
        expect.anything(),
        "Default Value"
      )
      expect(ProductVariantServiceMock.addOptionValue).toHaveBeenCalledWith(
        "4",
        expect.anything(),
        "Default Value"
      )

      expect(ProductVariantServiceMock.deleteOptionValue).toHaveBeenCalledTimes(
        3
      )
      expect(ProductVariantServiceMock.deleteOptionValue).toHaveBeenCalledWith(
        "1",
        expect.anything()
      )
      expect(ProductVariantServiceMock.deleteOptionValue).toHaveBeenCalledWith(
        "3",
        expect.anything()
      )
      expect(ProductVariantServiceMock.deleteOptionValue).toHaveBeenCalledWith(
        "4",
        expect.anything()
      )
    })
  })

  describe("deleteOption", () => {
    const productService = new ProductService({
      productModel: ProductModelMock,
      productVariantService: ProductVariantServiceMock,
      eventBusService: EventBusServiceMock,
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("deletes an option from a product", async () => {
      await productService.deleteOption(
        IdMap.getId("productWithVariants"),
        IdMap.getId("color_id")
      )

      expect(ProductModelMock.updateOne).toBeCalledTimes(1)
      expect(ProductModelMock.updateOne).toBeCalledWith(
        { _id: IdMap.getId("productWithVariants") },
        { $pull: { options: { _id: IdMap.getId("color_id") } } }
      )
      expect(ProductVariantServiceMock.deleteOptionValue).toBeCalledTimes(3)
      expect(ProductVariantServiceMock.deleteOptionValue).toBeCalledWith(
        "1",
        IdMap.getId("color_id")
      )
      expect(ProductVariantServiceMock.deleteOptionValue).toBeCalledWith(
        "3",
        IdMap.getId("color_id")
      )
      expect(ProductVariantServiceMock.deleteOptionValue).toBeCalledWith(
        "4",
        IdMap.getId("color_id")
      )
    })

    it("if option does not exist, do nothing", async () => {
      await productService.deleteOption(
        IdMap.getId("productWithVariants"),
        IdMap.getId("option_id")
      )

      expect(ProductModelMock.updateOne).not.toBeCalled()
    })

    it("throw if variant option values are not equal", async () => {
      try {
        await productService.deleteOption(
          IdMap.getId("productWithFourVariants"),
          IdMap.getId("size_id")
        )
      } catch (err) {
        expect(err.message).toEqual(
          "To delete an option, first delete all variants, such that when option is deleted, no duplicate variants will exist. For more info check MEDUSA.com"
        )
      }

      expect(ProductModelMock.updateOne).not.toBeCalled()
    })
  })

  describe("deleteVariant", () => {
    const productService = new ProductService({
      productModel: ProductModelMock,
      productVariantService: ProductVariantServiceMock,
      eventBusService: EventBusServiceMock,
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("removes variant from product", async () => {
      await productService.deleteVariant(
        IdMap.getId("productWithVariants"),
        "1"
      )

      expect(ProductVariantServiceMock.delete).toBeCalledTimes(1)
      expect(ProductVariantServiceMock.delete).toBeCalledWith("1")

      expect(ProductModelMock.updateOne).toBeCalledTimes(1)
      expect(ProductModelMock.updateOne).toBeCalledWith(
        { _id: IdMap.getId("productWithVariants") },
        { $pull: { variants: "1" } }
      )
    })
  })

  describe("updateOption", () => {
    const productService = new ProductService({
      productModel: ProductModelMock,
      productVariantService: ProductVariantServiceMock,
      eventBusService: EventBusServiceMock,
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("updates title", async () => {
      await productService.updateOption(
        IdMap.getId("productWithVariants"),
        IdMap.getId("color_id"),
        {
          title: "Shoe Color",
        }
      )

      expect(ProductModelMock.updateOne).toBeCalledTimes(1)
      expect(ProductModelMock.updateOne).toBeCalledWith(
        {
          _id: IdMap.getId("productWithVariants"),
          "options._id": IdMap.getId("color_id"),
        },
        { $set: { "options.$.title": "Shoe Color" } }
      )
    })

    it("throws if option title exists", async () => {
      try {
        await productService.updateOption(
          IdMap.getId("productWithVariants"),
          IdMap.getId("color_id"),
          {
            title: "Size",
          }
        )
      } catch (err) {
        expect(err.message).toEqual("An option with title Size already exists")
      }
    })

    it("throws if option doesn't exist", async () => {
      try {
        await productService.updateOption(
          IdMap.getId("productWithVariants"),
          IdMap.getId("material"),
          {
            title: "Size",
          }
        )
      } catch (err) {
        expect(err.message).toEqual(
          `Product has no option with id: ${IdMap.getId("material")}`
        )
      }
    })
  })

  describe("reorderOptions", () => {
    const productService = new ProductService({
      productModel: ProductModelMock,
      productVariantService: ProductVariantServiceMock,
      eventBusService: EventBusServiceMock,
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("reorders options", async () => {
      await productService.reorderOptions(IdMap.getId("productWithVariants"), [
        IdMap.getId("size_id"),
        IdMap.getId("color_id"),
      ])

      expect(ProductModelMock.updateOne).toBeCalledTimes(1)
      expect(ProductModelMock.updateOne).toBeCalledWith(
        {
          _id: IdMap.getId("productWithVariants"),
        },
        {
          $set: {
            options: [
              {
                _id: IdMap.getId("size_id"),
                title: "Size",
              },
              {
                _id: IdMap.getId("color_id"),
                title: "Color",
              },
            ],
          },
        }
      )
    })

    it("throws if one option id is not in the product options", async () => {
      try {
        await productService.reorderOptions(
          IdMap.getId("productWithVariants"),
          [IdMap.getId("size_id"), IdMap.getId("material")]
        )
      } catch (err) {
        expect(err.message).toEqual(
          `Product has no option with id: ${IdMap.getId("material")}`
        )
      }
    })

    it("throws if order length and product option lengths differ", async () => {
      try {
        await productService.reorderOptions(
          IdMap.getId("productWithVariants"),
          [
            IdMap.getId("size_id"),
            IdMap.getId("color_id"),
            IdMap.getId("material"),
          ]
        )
      } catch (err) {
        expect(err.message).toEqual(
          `Product options and new options order differ in length. To delete or add options use removeOption or addOption`
        )
      }
    })
  })

  describe("reorderVariants", () => {
    const productService = new ProductService({
      productModel: ProductModelMock,
      productVariantService: ProductVariantServiceMock,
      eventBusService: EventBusServiceMock,
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("reorders variants", async () => {
      await productService.reorderVariants(IdMap.getId("productWithVariants"), [
        "3",
        "4",
        "1",
      ])

      expect(ProductModelMock.updateOne).toBeCalledTimes(1)
      expect(ProductModelMock.updateOne).toBeCalledWith(
        {
          _id: IdMap.getId("productWithVariants"),
        },
        {
          $set: {
            variants: ["3", "4", "1"],
          },
        }
      )
    })

    it("throws if a variant id is not in the products variants", async () => {
      try {
        await productService.reorderVariants(
          IdMap.getId("productWithVariants"),
          ["1", "2", "3"]
        )
      } catch (err) {
        expect(err.message).toEqual(`Product has no variant with id: 2`)
      }
    })

    it("throws if order length and product variant lengths differ", async () => {
      try {
        await productService.reorderVariants(
          IdMap.getId("productWithVariants"),
          ["1", "2", "3", "4"]
        )
      } catch (err) {
        expect(err.message).toEqual(
          `Product variants and new variant order differ in length. To delete or add variants use removeVariant or addVariant`
        )
      }
    })
  })

  describe("updateOptionValue", () => {
    const productService = new ProductService({
      productModel: ProductModelMock,
      productVariantService: ProductVariantServiceMock,
      eventBusService: EventBusServiceMock,
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("successfully updates an option value", async () => {
      await productService.updateOptionValue(
        IdMap.getId("productWithVariants"),
        "1",
        IdMap.getId("color_id"),
        "Blue"
      )

      expect(ProductVariantServiceMock.updateOptionValue).toBeCalledTimes(1)
      expect(ProductVariantServiceMock.updateOptionValue).toBeCalledWith(
        "1",
        IdMap.getId("color_id"),
        "Blue"
      )
    })

    it("throws product-variant relationship isn't valid", async () => {
      await expect(
        productService.updateOptionValue(
          IdMap.getId("productWithFourVariants"),
          "invalid_variant",
          IdMap.getId("color_id"),
          "Blue"
        )
      ).rejects.toThrow("The variant could not be found in the product")
    })

    it("throws if combination exists", async () => {
      await expect(
        productService.updateOptionValue(
          IdMap.getId("productWithFourVariants"),
          "1",
          IdMap.getId("color_id"),
          "black"
        )
      ).rejects.toThrow(
        "A variant with the given option value combination already exist"
      )
    })
  })
})
