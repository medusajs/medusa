import { OpenAPIObject, TagObject } from "openapi3-ts/oas30"
import { mergeBaseIntoOAS } from "../utils/merge-oas"

const buildOas = (tags?: TagObject[]): OpenAPIObject =>
  ({
    openapi: "3.0.0",
    info: { title: "Test", version: "1.0.0" },
    paths: {},
    ...(tags ? { tags } : {}),
  }) as OpenAPIObject

const medusaTags = (): TagObject[] => [
  { name: "Orders", description: "Medusa orders" },
  { name: "Products", description: "Medusa products" },
]

describe("mergeBaseIntoOAS", () => {
  it("should keep the target tags when the base declares no tags", () => {
    const target = buildOas(medusaTags())
    mergeBaseIntoOAS(target, buildOas())

    expect(target.tags).toEqual(medusaTags())
  })

  it("should keep the target tags when the base declares an empty tags list", () => {
    const target = buildOas(medusaTags())
    mergeBaseIntoOAS(target, buildOas([]))

    expect(target.tags).toEqual(medusaTags())
  })

  it("should append a single base tag after the target tags", () => {
    const target = buildOas(medusaTags())
    mergeBaseIntoOAS(target, buildOas([{ name: "Custom A" }]))

    expect(target.tags).toEqual([...medusaTags(), { name: "Custom A" }])
  })

  it("should keep each target tag once when the base declares several tags", () => {
    const target = buildOas(medusaTags())
    mergeBaseIntoOAS(
      target,
      buildOas([{ name: "Custom A" }, { name: "Custom B" }])
    )

    expect(target.tags).toEqual([
      ...medusaTags(),
      { name: "Custom A" },
      { name: "Custom B" },
    ])
  })

  it("should replace a target tag with the same-named base tag only once", () => {
    const target = buildOas(medusaTags())
    mergeBaseIntoOAS(
      target,
      buildOas([
        { name: "Orders", description: "Custom orders" },
        { name: "Custom A" },
      ])
    )

    expect(target.tags).toEqual([
      { name: "Orders", description: "Custom orders" },
      { name: "Products", description: "Medusa products" },
      { name: "Custom A" },
    ])
  })
})
