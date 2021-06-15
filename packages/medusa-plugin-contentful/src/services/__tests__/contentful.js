import ContentfulService from "../contentful"
import { MockEnvironment } from "../../../__mocks__/contentful-management"

jest.mock("contentful-management")

describe("contentfulService", () => {
  const redisClient = {
    set: jest.fn(),
    get: jest.fn(),
  }

  const ProductVariantService = {
    retrieve: jest.fn(() =>
      Promise.resolve({
        id: "variant_medusa",
        title: "testvar",
      })
    ),
  }

  const ProductService = {
    retrieve: jest.fn(() =>
      Promise.resolve({
        id: "product_medusa",
        title: "test",
        subtitle: "subtest",
        description: "something long",
        variants: [
          {
            id: "variant_medusa",
            title: "testvar",
          },
        ],
      })
    ),
  }

  describe("createProductInContentful", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("resolves", async () => {
      const contentfulService = new ContentfulService(
        {
          redisClient,
          productVariantService: ProductVariantService,
          productService: ProductService,
        },
        {}
      )

      await contentfulService.updateProductInContentful({
        id: "testId",
        fields: ["title"],
      })
    })
  })
  describe("createImageAssets", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully creates assets", async () => {
      const contentfulService = new ContentfulService(
        {
          redisClient,
        },
        {}
      )

      await contentfulService.createImageAssets({
        title: "testprod",
        images: [{ url: "test123" }],
      })

      expect(MockEnvironment.createAsset).toHaveBeenCalledTimes(1)
      expect(MockEnvironment.createAsset).toHaveBeenCalledWith({
        fields: {
          title: {
            "en-US": `testprod - 0`,
          },
          description: {
            "en-US": "",
          },
          file: {
            "en-US": {
              contentType: "image/xyz",
              fileName: "test123",
              upload: "test123",
            },
          },
        },
      })
    })
  })
})
