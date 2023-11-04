import AlgoliaService from "../algolia"
import {
  category,
  indexSettingsCustomProductTransformer,
  indexSettingsDefault,
  product,
  tag,
  transformedCategory,
  transformedProductCustom,
  transformedProductDefault,
} from "../../__fixtures__/data"

describe("Algolia Service", () => {
  const algoliaService = new AlgoliaService(
    {},
    {
      adminApiKey: "TEST_ADMIN_API_KEY",
      applicationId: "TEST_APPLICATION_ID",
      settings: indexSettingsDefault,
    }
  )

  it("should run index custom transformer when it is defined", async () => {
    const result = await algoliaService.getTransformedDocuments("categories", [
      category,
    ])

    expect(result).toEqual([transformedCategory])
  })

  it("should run index custom transformer for product when it is defined", async () => {
    const algoliaServiceCustomTransformer = new AlgoliaService(
      {},
      {
        adminApiKey: "TEST_ADMIN_API_KEY",
        applicationId: "TEST_APPLICATION_ID",
        settings: indexSettingsCustomProductTransformer,
      }
    )
    const result =
      await algoliaServiceCustomTransformer.getTransformedDocuments(
        "products",
        [product]
      )

    expect(result).toEqual([transformedProductCustom])
  })

  it("should run default transformer for product index when custom transformer is not defined", async () => {
    const result = await algoliaService.getTransformedDocuments("products", [
      product,
    ])

    expect(result).toEqual([transformedProductDefault])
  })

  it("should return document as is if no transformer is defined", async () => {
    const result = await algoliaService.getTransformedDocuments("tags", [tag])

    expect(result).toEqual([tag])
  })
})
