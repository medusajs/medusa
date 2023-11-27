import { mockContainer, nonExistingProductId } from "../__fixtures__/product"

describe("Product service", function () {
  beforeEach(function () {
    jest.clearAllMocks()
  })

  it("should retrieve a product", async function () {
    const productService = mockContainer.resolve("productService")
    const productRepository = mockContainer.resolve("productRepository")
    const productId = "existing-product"

    await productService.retrieve(productId)

    expect(productRepository.find).toHaveBeenCalledWith(
      {
        where: {
          id: productId,
        },
        options: {
          fields: undefined,
          limit: undefined,
          offset: 0,
          populate: [],
          withDeleted: undefined,
        },
      },
      expect.any(Object)
    )
  })

  it("should fail to retrieve a product", async function () {
    const productService = mockContainer.resolve("productService")
    const productRepository = mockContainer.resolve("productRepository")

    const err = await productService
      .retrieve(nonExistingProductId)
      .catch((e) => e)

    expect(productRepository.find).toHaveBeenCalledWith(
      {
        where: {
          id: nonExistingProductId,
        },
        options: {
          fields: undefined,
          limit: undefined,
          offset: 0,
          populate: [],
          withDeleted: undefined,
        },
      },
      expect.any(Object)
    )

    expect(err.message).toBe(
      `Product with id: ${nonExistingProductId} was not found`
    )
  })

  it("should list products", async function () {
    const productService = mockContainer.resolve("productService")
    const productRepository = mockContainer.resolve("productRepository")

    const filters = {}
    const config = {
      relations: [],
    }

    await productService.list(filters, config)

    expect(productRepository.find).toHaveBeenCalledWith(
      {
        where: {},
        options: {
          fields: undefined,
          limit: 15,
          offset: 0,
          populate: [],
          withDeleted: undefined,
        },
      },
      expect.any(Object)
    )
  })

  it("should list products with filters", async function () {
    const productService = mockContainer.resolve("productService")
    const productRepository = mockContainer.resolve("productRepository")

    const filters = {
      tags: {
        value: {
          $in: ["test"],
        },
      },
    }
    const config = {
      relations: [],
    }

    await productService.list(filters, config)

    expect(productRepository.find).toHaveBeenCalledWith(
      {
        where: {
          tags: {
            value: {
              $in: ["test"],
            },
          },
        },
        options: {
          fields: undefined,
          limit: 15,
          offset: 0,
          populate: [],
          withDeleted: undefined,
        },
      },
      expect.any(Object)
    )
  })

  it("should list products with filters and relations", async function () {
    const productService = mockContainer.resolve("productService")
    const productRepository = mockContainer.resolve("productRepository")

    const filters = {
      tags: {
        value: {
          $in: ["test"],
        },
      },
    }
    const config = {
      relations: ["tags"],
    }

    await productService.list(filters, config)

    expect(productRepository.find).toHaveBeenCalledWith(
      {
        where: {
          tags: {
            value: {
              $in: ["test"],
            },
          },
        },
        options: {
          fields: undefined,
          limit: 15,
          offset: 0,
          withDeleted: undefined,
          populate: ["tags"],
        },
      },
      expect.any(Object)
    )
  })

  it("should list and count the products with filters and relations", async function () {
    const productService = mockContainer.resolve("productService")
    const productRepository = mockContainer.resolve("productRepository")

    const filters = {
      tags: {
        value: {
          $in: ["test"],
        },
      },
    }
    const config = {
      relations: ["tags"],
    }

    await productService.listAndCount(filters, config)

    expect(productRepository.findAndCount).toHaveBeenCalledWith(
      {
        where: {
          tags: {
            value: {
              $in: ["test"],
            },
          },
        },
        options: {
          fields: undefined,
          limit: 15,
          offset: 0,
          withDeleted: undefined,
          populate: ["tags"],
        },
      },
      expect.any(Object)
    )
  })
})
