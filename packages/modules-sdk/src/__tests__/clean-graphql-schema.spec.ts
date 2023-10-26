import { cleanGraphQLSchema } from "../utils/clean-graphql-schema"

describe("Clean Graphql Schema", function () {
  it("Should keep the schema intact if all entities are available", function () {
    const schemaStr = `
      type Product {
        id: ID!
        title: String!
        variants: [Variant]!
      }
      type Variant {
        id: ID!
        title: String!
        product_id: ID!
        product: Product!
      }
    `
    const { schema, notFound } = cleanGraphQLSchema(schemaStr)

    expect(schema.replace(/\s/g, "")).toEqual(schemaStr.replace(/\s/g, ""))
    expect(notFound).toEqual({})
  })

  it("Should remove fields where the relation doesn't exist", function () {
    const schemaStr = `
      type Product {
        id: ID!
        title: String!
        variants: [Variant!]!
        profile: ShippingProfile!
      }
    `
    const expectedStr = `
      type Product {
        id: ID!
        title: String!
      }
    `
    const { schema, notFound } = cleanGraphQLSchema(schemaStr)

    expect(schema.replace(/\s/g, "")).toEqual(expectedStr.replace(/\s/g, ""))
    expect(notFound).toEqual({
      Product: { variants: "Variant", profile: "ShippingProfile" },
    })
  })

  it("Should remove fields where the relation doesn't exist and flag extended entity where the main entity doesn't exist", function () {
    const schemaStr = `
      scalar JSON
      type Product {
        id: ID!
        title: String!
        variants: [Variant!]!
        profile: ShippingProfile!
      }

      extend type Variant {
        metadata: JSON
      }
    `
    const expectedStr = `
      scalar JSON
      type Product {
        id: ID!
        title: String!
      }
    `
    const { schema, notFound } = cleanGraphQLSchema(schemaStr)

    expect(schema.replace(/\s/g, "")).toEqual(expectedStr.replace(/\s/g, ""))
    expect(notFound).toEqual({
      Product: { variants: "Variant", profile: "ShippingProfile" },
      Variant: { __extended: "" },
    })
  })

  it("Should remove fields from extend where the relation doesn't exist", function () {
    const schemaStr = `
      scalar JSON
      type Product {
        id: ID!
        title: String!
        variants: [Variant!]!
        profile: ShippingProfile!
      }

      extend type Product {
        variants: [Variant!]!
        profile: ShippingProfile!
        metadata: JSON
      }
    `
    const expectedStr = `
      scalar JSON
      type Product {
        id: ID!
        title: String!
      }

      extend type Product {
        metadata: JSON
      }
    `
    const { schema, notFound } = cleanGraphQLSchema(schemaStr)

    expect(schema.replace(/\s/g, "")).toEqual(expectedStr.replace(/\s/g, ""))
    expect(notFound).toEqual({
      Product: { variants: "Variant", profile: "ShippingProfile" },
    })
  })
})
