import { MedusaContainer } from "@medusajs/types"
import * as utils from "@medusajs/utils"
import { Query } from "../query"

jest.mock("@medusajs/utils", () => ({
  ...jest.requireActual("@medusajs/utils"),
  applyTranslations: jest.fn(),
}))

const mockApplyTranslations = utils.applyTranslations as jest.Mock

function createMockRemoteJoiner(queryResult: any = []) {
  return {
    query: jest.fn().mockResolvedValue(queryResult),
  }
}

function createMockContainer(): MedusaContainer {
  return {
    resolve: jest.fn(),
  } as unknown as MedusaContainer
}

function createQueryInstance(
  queryResult: any = [],
  container: MedusaContainer = createMockContainer()
) {
  return {
    query: new Query({
      remoteJoiner: createMockRemoteJoiner(queryResult) as any,
      joinerConfigs: [],
      indexModule: null as any,
      container,
    }),
    container,
  }
}

describe("Query.graph locale integration", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("when locale option is provided", () => {
    it("should call applyTranslations with the correct locale code", async () => {
      const mockContainer = createMockContainer()
      const { query } = createQueryInstance(
        [{ id: "prod_1", title: "Test" }],
        mockContainer
      )

      await query.graph(
        { entity: "product", fields: ["id", "title"] },
        { locale: "fr-FR" }
      )

      expect(mockApplyTranslations).toHaveBeenCalledTimes(1)
      expect(mockApplyTranslations).toHaveBeenCalledWith({
        localeCode: "fr-FR",
        objects: expect.any(Array),
        container: mockContainer,
      })
    })

    it("should call applyTranslations with the result data array", async () => {
      const resultData = [
        { id: "prod_1", title: "Product 1" },
        { id: "prod_2", title: "Product 2" },
      ]
      const { query } = createQueryInstance(resultData)

      await query.graph(
        { entity: "product", fields: ["id", "title"] },
        { locale: "en-US" }
      )

      expect(mockApplyTranslations).toHaveBeenCalledWith(
        expect.objectContaining({
          objects: resultData,
        })
      )
    })

    it("should call applyTranslations with the container instance", async () => {
      const mockContainer = createMockContainer()
      const { query } = createQueryInstance([], mockContainer)

      await query.graph(
        { entity: "product", fields: ["id"] },
        { locale: "de-DE" }
      )

      expect(mockApplyTranslations).toHaveBeenCalledWith(
        expect.objectContaining({
          container: mockContainer,
        })
      )
    })

    it("should call applyTranslations for paginated results", async () => {
      const paginatedResult = {
        rows: [{ id: "prod_1" }, { id: "prod_2" }],
        metadata: { skip: 0, take: 10, count: 2 },
      }
      const { query } = createQueryInstance(paginatedResult)

      await query.graph(
        {
          entity: "product",
          fields: ["id"],
          pagination: { skip: 0, take: 10 },
        },
        { locale: "es-ES" }
      )

      expect(mockApplyTranslations).toHaveBeenCalledWith(
        expect.objectContaining({
          objects: paginatedResult.rows,
        })
      )
    })
  })

  describe("when locale option is NOT provided", () => {
    it("should NOT call applyTranslations when options is undefined", async () => {
      const { query } = createQueryInstance([{ id: "prod_1" }])

      await query.graph({ entity: "product", fields: ["id"] })

      expect(mockApplyTranslations).not.toHaveBeenCalled()
    })

    it("should NOT call applyTranslations when options is an empty object", async () => {
      const { query } = createQueryInstance([{ id: "prod_1" }])

      await query.graph({ entity: "product", fields: ["id"] }, {})

      expect(mockApplyTranslations).not.toHaveBeenCalled()
    })

    it("should NOT call applyTranslations when locale is explicitly undefined", async () => {
      const { query } = createQueryInstance([{ id: "prod_1" }])

      await query.graph(
        { entity: "product", fields: ["id"] },
        { locale: undefined }
      )

      expect(mockApplyTranslations).not.toHaveBeenCalled()
    })

    it("should NOT call applyTranslations when other options are provided but locale is missing", async () => {
      const { query } = createQueryInstance([{ id: "prod_1" }])

      await query.graph(
        { entity: "product", fields: ["id"] },
        { throwIfKeyNotFound: true }
      )

      expect(mockApplyTranslations).not.toHaveBeenCalled()
    })
  })

  describe("applyTranslations parameter validation", () => {
    it("should pass empty array to applyTranslations when query returns empty array", async () => {
      const mockContainer = createMockContainer()
      const { query } = createQueryInstance([], mockContainer)

      await query.graph(
        { entity: "product", fields: ["id"] },
        { locale: "fr-FR" }
      )

      expect(mockApplyTranslations).toHaveBeenCalledWith({
        localeCode: "fr-FR",
        objects: [],
        container: mockContainer,
      })
    })

    it("should preserve all three parameters correctly", async () => {
      const resultData = [{ id: "test_1" }]
      const mockContainer = createMockContainer()
      const { query } = createQueryInstance(resultData, mockContainer)

      await query.graph(
        { entity: "product", fields: ["id"] },
        { locale: "pt-BR" }
      )

      const callArgs = mockApplyTranslations.mock.calls[0][0]
      expect(callArgs).toHaveProperty("localeCode", "pt-BR")
      expect(callArgs).toHaveProperty("objects", resultData)
      expect(callArgs).toHaveProperty("container", mockContainer)
    })

    it("should work with different locale formats", async () => {
      const { query } = createQueryInstance([{ id: "prod_1" }])

      const locales = ["en", "en-US", "zh-Hans-CN", "pt-BR"]

      for (const locale of locales) {
        jest.clearAllMocks()
        await query.graph({ entity: "product", fields: ["id"] }, { locale })

        expect(mockApplyTranslations).toHaveBeenCalledWith(
          expect.objectContaining({ localeCode: locale })
        )
      }
    })
  })

  describe("return value behavior with locale", () => {
    it("should return the result after applyTranslations is called", async () => {
      const resultData = [{ id: "prod_1", title: "Original" }]
      const { query } = createQueryInstance(resultData)

      const result = await query.graph(
        { entity: "product", fields: ["id", "title"] },
        { locale: "fr-FR" }
      )

      expect(result).toEqual({
        data: resultData,
        metadata: undefined,
      })
    })

    it("should return the same reference that was passed to applyTranslations", async () => {
      const resultData = [{ id: "prod_1" }]
      const { query } = createQueryInstance(resultData)

      const result = await query.graph(
        { entity: "product", fields: ["id"] },
        { locale: "de-DE" }
      )

      const passedObjects = mockApplyTranslations.mock.calls[0][0].objects
      expect(result.data).toBe(passedObjects)
    })
  })
})
