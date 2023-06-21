import { TestDatabase } from "../../../utils"
import { ProductVariantService } from "@services"
import { ProductVariantRepository } from "@repositories"
import { Product, ProductTag, ProductVariant } from "@models"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Collection } from "@mikro-orm/core"
import { ProductTypes } from "@medusajs/types"
import { ProductOption } from "@medusajs/client-types"
import {
  createOptions,
  createProductAndTags,
  createProductVariants,
} from "../../../__fixtures__/product"
import { productsData, variantsData } from "../../../__fixtures__/product/data"

describe("ProductVariant Service", () => {
  let service: ProductVariantService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager
  let variantOne: ProductVariant
  let variantTwo: ProductVariant
  let productOne: Product

  beforeEach(async () => {
    await TestDatabase.setupDatabase()
    repositoryManager = await TestDatabase.forkManager()

    const productVariantRepository = new ProductVariantRepository({
      manager: repositoryManager,
    })

    service = new ProductVariantService({ productVariantRepository })
  })

  afterEach(async () => {
    await TestDatabase.clearDatabase()
  })

  describe("list", () => {
    beforeEach(async () => {
      testManager = await TestDatabase.forkManager()

      productOne = testManager.create(Product, {
        id: "product-1",
        title: "product 1",
        status: ProductTypes.ProductStatus.PUBLISHED,
      })

      variantOne = testManager.create(ProductVariant, {
        id: "test-1",
        title: "variant 1",
        inventory_quantity: 10,
        product: productOne,
      })

      variantTwo = testManager.create(ProductVariant, {
        id: "test-2",
        title: "variant",
        inventory_quantity: 10,
        product: productOne,
      })

      await testManager.persistAndFlush([variantOne, variantTwo])
    })

    it("selecting by properties, scopes out the results", async () => {
      const results = await service.list({
        id: variantOne.id,
      })

      expect(results).toEqual([
        expect.objectContaining({
          id: variantOne.id,
          title: "variant 1",
          inventory_quantity: "10",
        }),
      ])
    })

    it("passing a limit, scopes the result to the limit", async () => {
      const results = await service.list(
        {},
        {
          take: 1,
        }
      )

      expect(results).toEqual([
        expect.objectContaining({
          id: variantOne.id,
        }),
      ])
    })

    it("passing populate, scopes the results of the response", async () => {
      const results = await service.list(
        {
          id: "test-1",
        },
        {
          select: ["id", "title", "product.title"] as any,
          relations: ["product"],
        }
      )

      expect(results).toEqual([
        expect.objectContaining({
          id: "test-1",
          title: "variant 1",
          product: expect.objectContaining({
            id: "product-1",
            title: "product 1",
            tags: expect.any(Collection<ProductTag>),
            variants: expect.any(Collection<ProductVariant>),
          }),
        }),
      ])

      expect(JSON.parse(JSON.stringify(results))).toEqual([
        {
          id: "test-1",
          title: "variant 1",
          product_id: "product-1",
          product: {
            id: "product-1",
            title: "product 1",
          },
        },
      ])
    })
  })

  describe("relation: options", () => {
    let products: Product[]
    let variants: ProductVariant[]
    let options: ProductOption[]

    beforeEach(async () => {
      testManager = await TestDatabase.forkManager()

      products = (await createProductAndTags(
        testManager,
        productsData
      )) as Product[]
      variants = (await createProductVariants(
        testManager,
        variantsData
      )) as ProductVariant[]

      options = await createOptions(testManager, [
        {
          id: "test-option-1",
          title: "size",
          product: products[0],
          values: [
            { id: "value-1", value: "XS", variant: products[0].variants[0] },
            { id: "value-1", value: "XL", variant: products[0].variants[0] },
          ],
        },
        {
          id: "test-option-2",
          title: "color",
          product: products[0],
          value: "blue",
          variant: products[0].variants[0],
        },
      ])
    })

    it("filter by options relation", async () => {
      const variants = await service.list(
        { options: { id: ["value-1"] } },
        { relations: ["options"] }
      )

      expect(JSON.parse(JSON.stringify(variants))).toEqual([
        expect.objectContaining({
          id: "test-1",
          title: "variant title",
          sku: "sku 1",
        }),
      ])
    })
  })
})
