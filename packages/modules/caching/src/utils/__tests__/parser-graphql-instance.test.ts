import { GraphQLUtils } from "@medusajs/framework/utils"
import { CacheInvalidationParser } from "../parser"

jest.mock("@medusajs/framework/utils", () => {
  const actual = jest.requireActual("@medusajs/framework/utils")
  let graphqlCopy
  jest.isolateModules(() => {
    graphqlCopy = jest.requireActual("graphql")
  })

  return {
    ...actual,
    GraphQLUtils: { ...actual.GraphQLUtils, ...graphqlCopy },
  }
})

describe("CacheInvalidationParser graphql instance", () => {
  it("should parse entities from a schema built with the graphql instance of @medusajs/framework/utils", () => {
    const schema = GraphQLUtils.buildSchema(`
      type Product {
        id: ID!
        title: String
        collection: ProductCollection
      }

      type ProductCollection {
        id: ID!
        title: String
      }
    `)

    const parser = new CacheInvalidationParser(schema, [
      { idPrefixToEntityName: { prod: "Product" } },
    ])

    const entities = parser.parseObjectForEntities({
      id: "prod_123",
      title: "Product",
      collection: { id: "pcol_123", title: "Collection" },
    })

    expect(entities).toEqual([
      { type: "Product", id: "prod_123", isInArray: false },
      { type: "ProductCollection", id: "pcol_123", isInArray: false },
    ])
  })
})
