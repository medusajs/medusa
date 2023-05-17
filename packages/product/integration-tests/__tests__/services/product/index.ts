import { TestDatabase } from "../../../utils"
import {
  ProductService,
  ProductTagService,
  ProductVariantService,
} from "@services"
import { ProductRepository } from "@repositories"
import { Product, ProductCategory, ProductVariant } from "@models"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Collection } from "@mikro-orm/core"
import { ProductDTO } from "@medusajs/types"

import {
  assignCategoriesToProduct,
  createCategories,
  createProductAndTags,
  createProductVariants,
} from "../../../__fixtures__/product"
import {
  categoriesData,
  productsData,
  variantsData,
} from "../../../__fixtures__/product/data"

const productVariantService = {
  list: jest.fn(),
} as unknown as ProductVariantService
const productTagService = {
  list: jest.fn(),
} as unknown as ProductTagService

describe("Product Service", () => {
  let service: ProductService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager
  let products!: Product[]
  let variants!: ProductVariant[]
  let categories!: ProductCategory[]

  beforeEach(async () => {
    await TestDatabase.setupDatabase()
    repositoryManager = await TestDatabase.forkManager()

    const productRepository = new ProductRepository({
      manager: repositoryManager,
    })

    service = new ProductService({
      productRepository,
      productVariantService,
      productTagService,
    })
  })

  afterEach(async () => {
    await TestDatabase.clearDatabase()
  })

  describe("list", () => {
    describe("relation: tags", () => {
      beforeEach(async () => {
        testManager = await TestDatabase.forkManager()

        products = await createProductAndTags(testManager, productsData)
      })

      it("filter by id and including relations", async () => {
        const productsResult = await service.list(
          {
            id: products[0].id,
          },
          {
            relations: ["tags"],
          }
        )

        productsResult.forEach((product, index) => {
          const tags = product.tags.toArray()

          expect(product).toEqual(
            expect.objectContaining({
              id: productsData[index].id,
              title: productsData[index].title,
            })
          )

          tags.forEach((tag, tagIndex) => {
            expect(tag).toEqual(
              expect.objectContaining({
                ...productsData[index].tags[tagIndex],
              })
            )
          })
        })
      })

      it("filter by id and without relations", async () => {
        const productsResult = await service.list({
          id: products[0].id,
        })

        productsResult.forEach((product, index) => {
          const tags = product.tags.getItems(false)

          expect(product).toEqual(
            expect.objectContaining({
              id: productsData[index].id,
              title: productsData[index].title,
            })
          )

          expect(tags.length).toBe(0)
        })
      })
    })

    describe("relation: categories", () => {
      let workingProduct: Product
      let workingCategory: ProductCategory

      beforeEach(async () => {
        testManager = await TestDatabase.forkManager()

        products = await createProductAndTags(testManager, productsData)
        workingProduct = products.find((p) => p.id === "test-1") as Product

        categories = await createCategories(testManager, categoriesData)
        workingCategory = categories.find(
          (c) => c.id === "category-1"
        ) as ProductCategory

        workingProduct = await assignCategoriesToProduct(
          testManager,
          workingProduct,
          categories
        )
      })

      it("filter by categories relation and scope fields", async () => {
        const products = await service.list(
          {
            id: workingProduct.id,
            categories: { id: [workingCategory.id] },
          },
          {
            select: [
              "title",
              "categories.name",
              "categories.handle",
            ] as (keyof ProductDTO)[],
            relations: ["categories"],
          }
        )

        const product = products.find(
          (p) => p.id === workingProduct.id
        ) as unknown as Product

        expect(product).toEqual(
          expect.objectContaining({
            id: workingProduct.id,
            title: workingProduct.title,
          })
        )

        expect(product.categories.toArray()).toEqual([
          {
            id: workingCategory.id,
            name: workingCategory.name,
            handle: workingCategory.name.split(" ").join("-"),
          },
        ])
      })

      it("returns empty array when querying for a category that doesnt exist", async () => {
        const products = await service.list(
          {
            id: workingProduct.id,
            categories: { id: ["category-doesnt-exist-id"] },
          },
          {
            select: [
              "title",
              "categories.name",
              "categories.handle",
            ] as (keyof ProductDTO)[],
            relations: ["categories"],
          }
        )

        expect(products).toEqual([])
      })

      it("filter by categories.parent_category and categories.category_children relation and scope fields", async () => {
        const products = await service.list(
          {
            id: workingProduct.id,
          },
          {
            select: [
              "categories.name",
              "categories.category_children.name",
              "categories.parent_category.name",
            ] as unknown as (keyof ProductDTO)[],
            relations: [
              "categories",
              "categories.category_children",
              "categories.parent_category",
            ],
          }
        )

        const product = products.find(
          (p) => p.id === workingProduct.id
        ) as unknown as Product

        expect(product).toEqual(
          expect.objectContaining({
            id: workingProduct.id,
            categories: expect.any(Collection<ProductCategory>),
          })
        )

        expect(product.categories.toArray()).toEqual([
          {
            id: workingCategory.id,
            name: workingCategory.name,
            category_children: [
              {
                id: workingCategory.category_children[0].id,
                name: workingCategory.category_children[0].name,
                parent_category: workingCategory.id,
              },
            ],
            parent_category: {
              id: workingCategory.parent_category?.id,
              name: workingCategory.parent_category?.name,
            },
          },
        ])
      })
    })

    describe("relation: variants", () => {
      beforeEach(async () => {
        testManager = await TestDatabase.forkManager()

        products = await createProductAndTags(testManager, productsData)
        variants = await createProductVariants(testManager, variantsData)
      })

      it("filter by id and including relations", async () => {
        const productsResult = await service.list(
          {
            id: products[0].id,
          },
          {
            relations: ["variants"],
          }
        )

        productsResult.forEach((product, index) => {
          const variants = product.variants.toArray()

          expect(product).toEqual(
            expect.objectContaining({
              id: productsData[index].id,
              title: productsData[index].title,
            })
          )

          variants.forEach((variant, variantIndex) => {
            const expectedVariant = variantsData.filter(
              (d) => d.product.id === product.id
            )[variantIndex]

            const variantProduct = variant.product

            expect(variant).toEqual(
              expect.objectContaining({
                id: expectedVariant.id,
                sku: expectedVariant.sku,
                title: expectedVariant.title,
              })
            )
          })
        })
      })
    })
  })
})
