import { IdMap, MockRepository, MockManager } from "medusa-test-utils"
import ProductService from "../product"
import { FlagRouter } from "../../utils/flag-router";

const eventBusService = {
  emit: jest.fn(),
  withTransaction: function() {
    return this
  },
}

const mockUpsertTags = jest.fn().mockImplementation((data) =>
  Promise.resolve(
    data.map(({ value, id }) => ({
      value,
      id: id || (value === "title" ? "tag-1" : "tag-2"),
    }))
  )
)

const mockUpsertType = jest.fn().mockImplementation((value) => {
  const productType = {
    id: "type",
    value: value,
  }
  return Promise.resolve(productType)
})

describe("ProductService", () => {
  describe("retrieve", () => {
    const productRepo = MockRepository({
      findOneWithRelations: (rels, query) => {
        if (query.where.id === "test id with variants") {
          return {
            id: "test id with variants",
            variants: [
              { id: "test_321", title: "Green" },
              { id: "test_123", title: "Blue" },
            ],
          }
        }
        if (query.where.id === "test id one variant") {
          return {
            id: "test id one variant",
            variants: [{ id: "test_123", title: "Blue" }],
          }
        }
        return Promise.resolve({ id: IdMap.getId("ironman") })
      },
    })

    const productService = new ProductService({
      manager: MockManager,
      productRepository: productRepo,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully retrieves a product", async () => {
      const result = await productService.retrieve(IdMap.getId("ironman"))

      expect(productRepo.findOneWithRelations).toHaveBeenCalledTimes(1)
      expect(productRepo.findOneWithRelations).toHaveBeenCalledWith(undefined, {
        where: { id: IdMap.getId("ironman") },
      })

      expect(result.id).toEqual(IdMap.getId("ironman"))
    })
  })

  describe("create", () => {
    const productRepository = MockRepository({
      create: (product) => ({
        id: IdMap.getId("ironman"),
        title: "Suit",
        options: [],
        collection: { id: IdMap.getId("cat"), title: "Suits" },
        variants: product.variants,
      }),
      findOneWithRelations: () => ({
        id: IdMap.getId("ironman"),
        title: "Suit",
        options: [],
        collection: { id: IdMap.getId("cat"), title: "Suits" },
      }),
    })

    const productTagRepository = MockRepository({
      findOne: () => Promise.resolve(undefined),
      create: (data) => {
        if (data.value === "title") {
          return { id: "tag-1", value: "title" }
        }

        if (data.value === "title2") {
          return { id: "tag-2", value: "title2" }
        }
      },
    })
    productTagRepository.upsertTags = mockUpsertTags
    const productTypeRepository = MockRepository({
      findOne: () => Promise.resolve(undefined),
      create: (data) => {
        return { id: "type", value: "type1" }
      },
    })
    productTypeRepository.upsertType = mockUpsertType

    const productCollectionService = {
      withTransaction: function() {
        return this
      },
      retrieve: (id) =>
        Promise.resolve({ id: IdMap.getId("cat"), title: "Suits" }),
    }

    const productService = new ProductService({
      manager: MockManager,
      productRepository,
      eventBusService,
      productCollectionService,
      productTagRepository,
      productTypeRepository,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully create a product", async () => {
      await productService.create({
        title: "Suit",
        options: [],
        tags: [{ value: "title" }, { value: "title2" }],
        type: "type-1",
        variants: [
          {
            id: "test1",
            title: "green",
          },
          {
            id: "test2",
            title: "blue",
          },
        ],
      })

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "product.created",
        expect.any(Object)
      )

      expect(productRepository.create).toHaveBeenCalledTimes(1)
      expect(productRepository.create).toHaveBeenCalledWith({
        title: "Suit",
        variants: [
          {
            id: "test1",
            title: "green",
          },
          {
            id: "test2",
            title: "blue",
          },
        ],
      })

      expect(productTagRepository.upsertTags).toHaveBeenCalledTimes(1)

      expect(productTypeRepository.upsertType).toHaveBeenCalledTimes(1)

      expect(productRepository.save).toHaveBeenCalledTimes(1)
      expect(productRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("ironman"),
        title: "Suit",
        options: [],
        tags: [
          {
            id: "tag-1",
            value: "title",
          },
          {
            id: "tag-2",
            value: "title2",
          },
        ],
        type_id: "type",
        collection: {
          id: IdMap.getId("cat"),
          title: "Suits",
        },
        variants: [
          {
            id: "test1",
            title: "green",
          },
          {
            id: "test2",
            title: "blue",
          },
        ],
      })
    })
  })

  describe("update", () => {
    const productRepository = MockRepository({
      findOneWithRelations: (rels, query) => {
        if (query.where.id === IdMap.getId("ironman&co")) {
          return Promise.resolve({
            id: IdMap.getId("ironman&co"),
            variants: [{ id: IdMap.getId("green"), title: "Green" }],
          })
        }
        if (query.where.id === "prod_status") {
          return Promise.resolve({
            id: "prod_status",
            status: "draft",
          })
        }
        if (query.where.id === "123") {
          return undefined
        }
        if (query.where.id === "ranking test") {
          return Promise.resolve({
            id: "ranking test",
            variants: [
              { id: "test_321", title: "Greener", variant_rank: 1 },
              { id: "test_123", title: "Blueer", variant_rank: 0 },
            ],
          })
        }
        return Promise.resolve({ id: IdMap.getId("ironman") })
      },
    })

    const productTypeRepository = MockRepository({
      findOne: () => Promise.resolve(undefined),
      create: (data) => {
        return { id: "type", value: "type1" }
      },
    })
    productTypeRepository.upsertType = mockUpsertType

    const productVariantRepository = MockRepository()

    const productVariantService = {
      withTransaction: function() {
        return this
      },
      update: (variant, update) => {
        if (variant.id) {
          return update
        }
        return Promise.resolve()
      },
    }

    const productTagRepository = MockRepository({
      findOne: (data) => {
        if (data.where.value === "test") {
          return Promise.resolve({ id: IdMap.getId("test"), value: "test" })
        }
        if (data.where.value === "test2") {
          return Promise.resolve({ id: IdMap.getId("test2"), value: "test2" })
        }
      },
    })
    productTagRepository.upsertTags = mockUpsertTags

    const cartRepository = MockRepository({
      findOne: (data) => {
        return Promise.resolve({})
      },
    })

    const priceSelectionStrategy = {
      withTransaction: (manager) => {
        return this
      },
      calculateVariantPrice: (variantId, context) => {
        return {
          originalPrice: null,
          calculatedPrice: null,
          prices: [],
        }
      },
    }

    const productService = new ProductService({
      manager: MockManager,
      productRepository,
      productVariantService,
      productVariantRepository,
      productTagRepository,
      productTypeRepository,
      eventBusService,
      cartRepository,
      priceSelectionStrategy,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully updates product metadata", async () => {
      await productService.update(IdMap.getId("ironman"), {
        metadata: { some_key: "some_value" },
      })

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "product.updated",
        expect.any(Object)
      )

      expect(productRepository.save).toHaveBeenCalledTimes(1)
      expect(productRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("ironman"),
        metadata: { some_key: "some_value" },
      })
    })

    it("successfully updates product variants", async () => {
      await productService.update(IdMap.getId("ironman&co"), {
        variants: [{ id: IdMap.getId("green"), title: "Greener" }],
      })

      // The update of variants will be tested in product variant test file
      // Here we just test, that the function reaches its end when updating
      // variants
      expect(productRepository.save).toHaveBeenCalledTimes(1)
    })

    it("successfully updates product status", async () => {
      await productService.update(IdMap.getId("ironman"), {
        status: "published",
      })

      expect(productRepository.save).toHaveBeenCalledTimes(1)
      expect(productRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("ironman"),
        status: "published",
      })
    })

    it("successfully updates product", async () => {
      await productService.update(IdMap.getId("ironman"), {
        title: "Full suit",
        collection: {
          id: IdMap.getId("test"),
          value: "test",
        },
      })

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "product.updated",
        expect.any(Object)
      )

      expect(productRepository.save).toHaveBeenCalledTimes(1)
      expect(productRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("ironman"),
        title: "Full suit",
        collection: {
          id: IdMap.getId("test"),
          value: "test",
        },
      })
    })

    it("successfully updates variant ranking", async () => {
      await productService.update("ranking test", {
        variants: [
          { id: "test_321", title: "Greener", variant_rank: 1 },
          { id: "test_123", title: "Blueer", variant_rank: 0 },
        ],
      })

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "product.updated",
        expect.any(Object)
      )

      expect(productRepository.save).toHaveBeenCalledTimes(1)
      expect(productRepository.save).toHaveBeenCalledWith({
        id: "ranking test",
        variants: [
          { id: "test_321", title: "Greener", variant_rank: 0 },
          { id: "test_123", title: "Blueer", variant_rank: 1 },
        ],
      })
    })

    it("successfully updates tags", async () => {
      await productService.update(IdMap.getId("ironman"), {
        tags: [
          { id: IdMap.getId("test"), value: "test" },
          { id: IdMap.getId("test2"), value: "test2" },
        ],
      })

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "product.updated",
        expect.any(Object)
      )

      expect(productRepository.save).toHaveBeenCalledTimes(1)
      expect(productRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("ironman"),
        tags: [
          { id: IdMap.getId("test"), value: "test" },
          { id: IdMap.getId("test2"), value: "test2" },
        ],
      })
    })

    it("throws on non existing product", async () => {
      try {
        await productService.update("123", { title: "new title" })
      } catch (err) {
        expect(err.message).toEqual("Product with id: 123 was not found")
      }
    })

    it("throws on wrong variant in update", async () => {
      try {
        await productService.update(IdMap.getId("ironman&co"), {
          variants: [
            { id: IdMap.getId("yellow") },
            { id: IdMap.getId("green") },
          ],
        })
      } catch (err) {
        expect(err.message).toEqual(
          `Variant with id: ${IdMap.getId(
            "yellow"
          )} is not associated with this product`
        )
      }
    })
  })

  describe("delete", () => {
    const productRepository = MockRepository({
      findOne: () => Promise.resolve({ id: IdMap.getId("ironman") }),
    })

    const productService = new ProductService({
      manager: MockManager,
      eventBusService,
      productRepository,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })
    it("successfully deletes product", async () => {
      await productService.delete(IdMap.getId("ironman"))

      expect(productRepository.softRemove).toBeCalledTimes(1)
      expect(productRepository.softRemove).toBeCalledWith({
        id: IdMap.getId("ironman"),
      })

      expect(eventBusService.emit).toBeCalledTimes(1)
      expect(eventBusService.emit).toBeCalledWith("product.deleted", {
        id: IdMap.getId("ironman"),
      })
    })
  })

  describe("addOption", () => {
    const productRepository = MockRepository({
      findOneWithRelations: (query) =>
        Promise.resolve({
          id: IdMap.getId("ironman"),
          options: [{ title: "Color" }],
          variants: [{ id: IdMap.getId("green") }],
        }),
    })

    const productVariantService = {
      withTransaction: function() {
        return this
      },
      addOptionValue: jest.fn(),
    }

    const productOptionRepository = MockRepository({
      create: () =>
        Promise.resolve({ id: IdMap.getId("Material"), title: "Material" }),
    })

    const productService = new ProductService({
      manager: MockManager,
      productRepository,
      productOptionRepository,
      productVariantService,
      eventBusService,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("creates product option", async () => {
      await productService.addOption(IdMap.getId("ironman"), "Material")

      expect(productOptionRepository.create).toHaveBeenCalledWith({
        title: "Material",
        product_id: IdMap.getId("ironman"),
      })
      expect(productOptionRepository.create).toHaveBeenCalledTimes(1)

      expect(productOptionRepository.save).toHaveBeenCalledTimes(1)

      expect(productVariantService.addOptionValue).toHaveBeenCalledTimes(1)
      expect(productVariantService.addOptionValue).toHaveBeenCalledWith(
        IdMap.getId("green"),
        IdMap.getId("Material"),
        "Default Value"
      )

      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith(
        "product.updated",
        expect.any(Object)
      )
    })

    it("throws on duplicate option", async () => {
      try {
        await productService.addOption(
          IdMap.getId("productWithVariantsFail"),
          "Color"
        )
      } catch (err) {
        expect(err.message).toBe(
          "An option with the title: Color already exists"
        )
      }
    })
  })

  describe("reorderVariants", () => {
    const productRepository = MockRepository({
      findOneWithRelations: (query) =>
        Promise.resolve({
          id: IdMap.getId("ironman"),
          variants: [{ id: IdMap.getId("green") }, { id: IdMap.getId("blue") }],
        }),
    })

    const productService = new ProductService({
      manager: MockManager,
      productRepository,
      eventBusService,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("reorders variants", async () => {
      await productService.reorderVariants(IdMap.getId("ironman"), [
        IdMap.getId("blue"),
        IdMap.getId("green"),
      ])

      expect(productRepository.save).toBeCalledTimes(1)
      expect(productRepository.save).toBeCalledWith({
        id: IdMap.getId("ironman"),
        variants: [{ id: IdMap.getId("blue") }, { id: IdMap.getId("green") }],
      })
    })

    it("throws if a variant id is not in the products variants", async () => {
      try {
        await productService.reorderVariants(IdMap.getId("ironman"), [
          IdMap.getId("yellow"),
          IdMap.getId("blue"),
        ])
      } catch (err) {
        expect(err.message).toEqual(
          `Product has no variant with id: ${IdMap.getId("yellow")}`
        )
      }
    })

    it("throws if order length and product variant lengths differ", async () => {
      try {
        await productService.reorderVariants(IdMap.getId("ironman"), [
          IdMap.getId("blue"),
        ])
      } catch (err) {
        expect(err.message).toEqual(
          `Product variants and new variant order differ in length.`
        )
      }
    })
  })

  describe("updateOption", () => {
    const productRepository = MockRepository({
      findOneWithRelations: (query) =>
        Promise.resolve({
          id: IdMap.getId("ironman"),
          options: [
            { id: IdMap.getId("material"), title: "Material" },
            { id: IdMap.getId("color"), title: "Color" },
          ],
        }),
    })

    const productOptionRepository = MockRepository({
      findOne: () =>
        Promise.resolve({ id: IdMap.getId("color"), title: "Color" }),
    })

    const productService = new ProductService({
      manager: MockManager,
      productRepository,
      productOptionRepository,
      eventBusService,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("updates option title", async () => {
      await productService.updateOption(
        IdMap.getId("ironman"),
        IdMap.getId("color"),
        {
          title: "Suit color",
        }
      )

      expect(productOptionRepository.save).toBeCalledTimes(1)
      expect(productOptionRepository.save).toBeCalledWith({
        id: IdMap.getId("color"),
        title: "Suit color",
      })
    })

    it("throws if option title exists", async () => {
      try {
        await productService.updateOption(
          IdMap.getId("ironman"),
          IdMap.getId("color"),
          {
            title: "Color",
          }
        )
      } catch (err) {
        expect(err.message).toEqual("An option with title Color already exists")
      }
    })

    it("throws if option doesn't exist", async () => {
      try {
        await productService.updateOption(
          IdMap.getId("ironman"),
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

  describe("deleteOption", () => {
    const productRepository = MockRepository({
      findOneWithRelations: (query) =>
        Promise.resolve({
          id: IdMap.getId("ironman"),
          variants: [
            {
              id: IdMap.getId("red"),
              options: [
                {
                  id: IdMap.getId("option1"),
                  option_id: IdMap.getId("color"),
                  value: "red",
                },
                {
                  id: IdMap.getId("option2"),
                  option_id: IdMap.getId("size"),
                  value: "large",
                },
              ],
            },
            {
              id: IdMap.getId("red2"),
              options: [
                {
                  id: IdMap.getId("option2"),
                  option_id: IdMap.getId("color"),
                  value: "red",
                },
                {
                  id: IdMap.getId("option1"),
                  option_id: IdMap.getId("size"),
                  value: "small",
                },
              ],
            },
          ],
        }),
    })

    const productOptionRepository = MockRepository({
      findOne: (query) => {
        if (query.where.id === IdMap.getId("material")) {
          return undefined
        }
        return Promise.resolve({ id: IdMap.getId("color"), title: "Color" })
      },
    })

    const productService = new ProductService({
      manager: MockManager,
      productRepository,
      productOptionRepository,
      eventBusService,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("deletes an option from a product", async () => {
      await productService.deleteOption(
        IdMap.getId("ironman"),
        IdMap.getId("color")
      )

      expect(productOptionRepository.softRemove).toBeCalledTimes(1)
      expect(productOptionRepository.softRemove).toBeCalledWith({
        id: IdMap.getId("color"),
        title: "Color",
      })
    })

    it("resolve if product option does not exist", async () => {
      await productService.deleteOption(
        IdMap.getId("ironman"),
        IdMap.getId("material")
      )

      expect(productOptionRepository.save).not.toBeCalled()
    })

    it("throw if variant option values are not equal", async () => {
      try {
        await productService.deleteOption(
          IdMap.getId("ironman"),
          IdMap.getId("color")
        )
      } catch (error) {
        expect(error.message).toBe(
          "To delete an option, first delete all variants, such that when option is deleted, no duplicate variants will exist."
        )
      }
    })
  })
})
