import { asClass, asValue, createContainer } from "awilix"
import { ProductService } from "@services"

const container = createContainer()
container.register({
  productRepository: asValue({
    find: jest.fn().mockResolvedValue([]),
    findAndCount: jest.fn().mockResolvedValue([[], 0]),
  }),
  productVariantService: asValue({
    list: jest.fn().mockResolvedValue([]),
  }),
  productTagService: asValue({
    list: jest.fn().mockResolvedValue([]),
  }),
  productService: asClass(ProductService),
})

describe("Product service", function () {
  beforeEach(function () {
    jest.clearAllMocks()
  })

  it("should list products", async function () {
    const productService = container.resolve("productService")
    const productRepository = container.resolve("productRepository")

    const filters = {}
    const config = {
      relations: [],
    }

    await productService.list(filters, config)

    expect(productRepository.find).toHaveBeenCalledWith({
      where: {},
      options: {
        populate: [],
      },
    })
  })

  it("should list products with filters", async function () {
    const productService = container.resolve("productService")
    const productRepository = container.resolve("productRepository")

    const filters = {
      tags: ["test"],
    }
    const config = {
      relations: [],
    }

    await productService.list(filters, config)

    expect(productRepository.find).toHaveBeenCalledWith({
      where: {
        tags: { value: { $in: filters.tags } },
      },
      options: {
        populate: [],
      },
    })
  })

  it("should list products with filters and relations", async function () {
    const productService = container.resolve("productService")
    const productRepository = container.resolve("productRepository")

    const filters = {
      tags: ["test"],
    }
    const config = {
      relations: ["tags"],
    }

    await productService.list(filters, config)

    expect(productRepository.find).toHaveBeenCalledWith({
      where: {
        tags: { value: { $in: filters.tags } },
      },
      options: {
        populate: ["tags"],
      },
    })
  })
})
