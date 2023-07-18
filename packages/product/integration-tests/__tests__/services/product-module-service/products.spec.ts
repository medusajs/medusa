import { MedusaModule } from "@medusajs/modules-sdk"
import { Product, ProductCategory, ProductCollection, ProductType, ProductVariant } from "@models"
import { IProductModuleService, ProductTypes } from "@medusajs/types"

import { initialize } from "../../../../src"
import { DB_URL, TestDatabase } from "../../../utils"
import { buildProductAndRelationsData } from "../../../__fixtures__/product/data/create-product"
import { createProductCategories } from "../../../__fixtures__/product-category"
import { createCollections, createTypes } from "../../../__fixtures__/product"

const beforeEach_ = async () => {
  await TestDatabase.setupDatabase()
  return await TestDatabase.forkManager()
}

const afterEach_ = async () => {
  await TestDatabase.clearDatabase()
}

describe("ProductModuleService products", function () {
  describe("update", function () {
    let module: IProductModuleService
    let productOne: Product
    let productTwo: Product
    let productCategoryOne: ProductCategory
    let productCategoryTwo: ProductCategory
    let productCollectionOne: ProductCollection
    let productCollectionTwo: ProductCollection
    let variantOne: ProductVariant
    let variantTwo: ProductVariant
    let variantThree: ProductVariant
    let productTypeOne: ProductType
    let productTypeTwo: ProductType
    let images = ["image-1"]

    const productCategoriesData = [{
      id: "test-1",
      name: "category 1",
    }, {
      id: "test-2",
      name: "category 2",
    }]

    const productCollectionsData = [
      {
        id: "test-1",
        title: "col 1",
      },
      {
        id: "test-2",
        title: "col 2",
      },
    ]

    const productTypesData = [
      {
        id: "type-1",
        value: "type 1",
      },
      {
        id: "type-2",
        value: "type 2",
      },
    ]

    const tagsData = [{
      id: "tag-1",
      value: "tag 1",
    }]

    beforeEach(async () => {
      const testManager = await beforeEach_()

      const collections = await createCollections(
        testManager,
        productCollectionsData
      )

      productCollectionOne = collections[0]
      productCollectionTwo = collections[1]

      const types = await createTypes(
        testManager,
        productTypesData,
      )

      productTypeOne = types[0]
      productTypeTwo = types[1]

      const categories = (await createProductCategories(
        testManager,
        productCategoriesData
      ))

      productCategoryOne = categories[0]
      productCategoryTwo = categories[1]

      productOne = testManager.create(Product, {
        id: "product-1",
        title: "product 1",
        status: ProductTypes.ProductStatus.PUBLISHED,
      })

      productTwo = testManager.create(Product, {
        id: "product-2",
        title: "product 2",
        status: ProductTypes.ProductStatus.PUBLISHED,
        categories: [productCategoryOne],
        collection_id: productCollectionOne.id,
        tags: tagsData,
      })

      variantOne = testManager.create(ProductVariant, {
        id: "variant-1",
        title: "variant 1",
        inventory_quantity: 10,
        product: productOne,
      })

      variantTwo = testManager.create(ProductVariant, {
        id: "variant-2",
        title: "variant 2",
        inventory_quantity: 10,
        product: productTwo,
      })

      variantThree = testManager.create(ProductVariant, {
        id: "variant-3",
        title: "variant 3",
        inventory_quantity: 10,
        product: productTwo,
      })

      await testManager.persistAndFlush([productOne, productTwo])

      MedusaModule.clearInstances()

      module = await initialize({
        database: {
          clientUrl: DB_URL,
          schema: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
        },
      })
    })

    afterEach(afterEach_)

    it("should update a product and upsert relations that are not created yet", async () => {
      const data = buildProductAndRelationsData({
        images,
        thumbnail: images[0],
      })

      const updateData = {
        ...data,
        id: productOne.id,
        title: "updated title"
      }

      const updatedProducts = await module.update([updateData])
      expect(updatedProducts).toHaveLength(1)

      const product = await module.retrieve(updateData.id, {
        relations: ["images", "variants", "options", "options.values", "variants.options", "tags", "type",]
      })

      expect(product.images).toHaveLength(1)
      expect(product.variants[0].options).toHaveLength(1)
      expect(product.tags).toHaveLength(1)
      expect(product.variants).toHaveLength(1)

      expect(product).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: "updated title",
          description: updateData.description,
          subtitle: updateData.subtitle,
          is_giftcard: updateData.is_giftcard,
          discountable: updateData.discountable,
          thumbnail: images[0],
          status: updateData.status,
          images: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              url: images[0],
            }),
          ]),
          options: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              title: updateData.options[0].title,
              values: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  value: updateData.variants[0].options?.[0].value,
                }),
              ]),
            }),
          ]),
          tags: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              value: updateData.tags[0].value,
            }),
          ]),
          type: expect.objectContaining({
            id: expect.any(String),
            value: updateData.type.value,
          }),
          variants: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              title: updateData.variants[0].title,
              sku: updateData.variants[0].sku,
              allow_backorder: false,
              manage_inventory: true,
              inventory_quantity: "100",
              variant_rank: "0",
              options: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  value: updateData.variants[0].options?.[0].value,
                }),
              ]),
            }),
          ]),
        })
      )
    })

    it("should add relationships to a product", async () => {
      const updateData = {
        id: productOne.id,
        categories: [{
          id: productCategoryOne.id
        }],
        collection_id: productCollectionOne.id,
        type_id: productTypeOne.id
      }

      await module.update([updateData])

      const product = await module.retrieve(updateData.id, {
        relations: ["categories", "collection", "type"]
      })

      expect(product).toEqual(
        expect.objectContaining({
          id: productOne.id,
          categories: [
            expect.objectContaining({
              id: productCategoryOne.id
            })
          ],
          collection: expect.objectContaining({
            id: productCollectionOne.id
          }),
          type: expect.objectContaining({
            id: productTypeOne.id
          })
        })
      )
    })

    it("should upsert a product type when type object is passed", async () => {
      let updateData = {
        id: productTwo.id,
        type: {
          id: productTypeOne.id,
          value: productTypeOne.value
        }
      }

      await module.update([updateData])

      let product = await module.retrieve(updateData.id, {
        relations: ["type"]
      })

      expect(product).toEqual(
        expect.objectContaining({
          id: productTwo.id,
          type: expect.objectContaining({
            id: productTypeOne.id
          })
        })
      )

      updateData = {
        id: productTwo.id,
        type: {
          id: "new-type-id",
          value: "new-type-value"
        }
      }

      await module.update([updateData])

      product = await module.retrieve(updateData.id, {
        relations: ["type"]
      })

      expect(product).toEqual(
        expect.objectContaining({
          id: productTwo.id,
          type: expect.objectContaining({
            ...updateData.type
          })
        })
      )
    })

    it("should replace relationships of a product", async () => {
      const newTagData = {
        id: "tag-2",
        value: "tag 2",
      }

      const updateData = {
        id: productTwo.id,
        categories: [{
          id: productCategoryTwo.id
        }],
        collection_id: productCollectionTwo.id,
        type_id: productTypeTwo.id,
        tags: [newTagData],
      }

      await module.update([updateData])

      const product = await module.retrieve(updateData.id, {
        relations: ["categories", "collection", "tags", "type"]
      })

      expect(product).toEqual(
        expect.objectContaining({
          id: productTwo.id,
          categories: [
            expect.objectContaining({
              id: productCategoryTwo.id
            })
          ],
          collection: expect.objectContaining({
            id: productCollectionTwo.id
          }),
          tags: [
            expect.objectContaining({
              id: newTagData.id,
              value: newTagData.value
            })
          ],
          type: expect.objectContaining({
            id: productTypeTwo.id
          })
        })
      )
    })

    it("should remove relationships of a product", async () => {
      const updateData = {
        id: productTwo.id,
        categories: [],
        collection_id: null,
        type_id: null,
        tags: []
      }

      await module.update([updateData])

      const product = await module.retrieve(updateData.id, {
        relations: ["categories", "collection", "tags"]
      })

      expect(product).toEqual(
        expect.objectContaining({
          id: productTwo.id,
          categories: [],
          tags: [],
          collection: null,
          type: null
        })
      )
    })

    it("should throw an error when product ID does not exist", async () => {
      let error
      const updateData = {
        id: "does-not-exist",
        title: "test"
      }

      try {
        await module.update([updateData])
      } catch (e) {
        error = e.message
      }

      expect(error).toEqual(`Product with id "does-not-exist" not found`)
    })

    it("should update, create and delete variants", async () => {
      const updateData = {
        id: productTwo.id,
        // Note: VariantThree is already assigned to productTwo, that should be deleted
        variants: [{
          id: variantTwo.id,
          title: "updated-variant"
        }, {
          title: "created-variant"
        }]
      }

      await module.update([updateData])

      const product = await module.retrieve(updateData.id, {
        relations: ["variants"]
      })

      expect(product.variants).toHaveLength(2)
      expect(product).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          variants: expect.arrayContaining([
            expect.objectContaining({
              id: variantTwo.id,
              title: "updated-variant",
            }),
            expect.objectContaining({
              id: expect.any(String),
              title: "created-variant",
            }),
          ]),
        })
      )
    })

    it("should throw an error when variant with id does not exist", async () => {
      let error

      const updateData = {
        id: productTwo.id,
        // Note: VariantThree is already assigned to productTwo, that should be deleted
        variants: [{
          id: "does-not-exist",
          title: "updated-variant"
        }, {
          title: "created-variant"
        }]
      }

      try {
        await module.update([updateData])
      } catch (e) {
        error = e
      }

      await module.retrieve(updateData.id, {
        relations: ["variants"]
      })

      expect(error.message).toEqual(`ProductVariant with id "does-not-exist" not found`)
    })
  })
})
