import { MedusaModule } from "@medusajs/modules-sdk"
import { Product, ProductCategory } from "@models"
import { IProductModuleService, ProductTypes } from "@medusajs/types"

import { initialize } from "../../../../src"
import { DB_URL, TestDatabase } from "../../../utils"
import { buildProductAndRelationsData } from "../../../__fixtures__/product/data/create-product"
import { createProductCategories } from "../../../__fixtures__/product-category"

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
    let productCategoryOne: ProductCategory
    let images = ["image-1"]

    beforeEach(async () => {
      const testManager = await beforeEach_()
      const productCategoriesData = [{
        id: "test-1",
        name: "category 1",
      }]

      productCategoryOne = (await createProductCategories(
        testManager,
        productCategoriesData
      ))[0]

      productOne = testManager.create(Product, {
        id: "product-1",
        title: "product 1",
        status: ProductTypes.ProductStatus.PUBLISHED,
      })

      await testManager.persistAndFlush([productOne])

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

    it.only("should add categories to a product", async () => {
      const updateData = {
        id: productOne.id,
        categories: [{
          id: productCategoryOne?.id
        }]
      }
console.log("start updating")
      await module.update([updateData])
      const product = await module.retrieve(updateData.id, {
        relations: ["categories"]
      })
console.log("done updating - ", product)

      console.log("product - ", product)

      // expect(product).toEqual(
      //   expect.objectContaining({

      //   })
      // )
    })
  })
})
