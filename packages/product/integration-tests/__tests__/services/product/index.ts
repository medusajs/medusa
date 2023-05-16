import { TestDatabase } from "../../../utils"
import {
  ProductService,
  ProductTagService,
  ProductVariantService,
} from "@services"
import { ProductRepository } from "@repositories"
import { Product } from "@models"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { productsData } from "../../../__fixtures__/product/data"

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
})
