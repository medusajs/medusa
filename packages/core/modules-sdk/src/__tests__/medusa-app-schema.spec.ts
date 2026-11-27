import { setBuildManifest } from "@medusajs/utils"
import {
  cleanAndMergeSchema,
  getLastMergedSchemaInput,
  getLoadedSchema,
  getLoadedSchemaHash,
  mergeLoadedSchema,
} from "../medusa-app"
import { MedusaModule } from "../medusa-module"

describe("schema merging", () => {
  const productSchema = `type Product { id: ID! }`
  const orderSchema = `type Order { id: ID! }`

  function registerJoinerConfigs() {
    // Registered out of alphabetical order, as concurrently loaded modules are
    MedusaModule.setJoinerConfig("order", {
      serviceName: "order",
      schema: orderSchema,
    } as any)
    MedusaModule.setJoinerConfig("product", {
      serviceName: "product",
      schema: productSchema,
    } as any)
  }

  beforeEach(() => {
    MedusaModule.clearInstances()
    registerJoinerConfigs()
  })

  afterEach(() => {
    setBuildManifest(undefined)
  })

  it("keeps the registration order in getLoadedSchema", () => {
    expect(getLoadedSchema()).toBe(`${orderSchema}\n${productSchema}`)

    MedusaModule.clearInstances()
    MedusaModule.setJoinerConfig("product", {
      serviceName: "product",
      schema: productSchema,
    } as any)
    MedusaModule.setJoinerConfig("order", {
      serviceName: "order",
      schema: orderSchema,
    } as any)

    expect(getLoadedSchema()).toBe(`${productSchema}\n${orderSchema}`)
  })

  it("hashes the schemas independently of the registration order", () => {
    const hash = getLoadedSchemaHash()

    MedusaModule.clearInstances()
    MedusaModule.setJoinerConfig("product", {
      serviceName: "product",
      schema: productSchema,
    } as any)
    MedusaModule.setJoinerConfig("order", {
      serviceName: "order",
      schema: orderSchema,
    } as any)

    expect(getLoadedSchemaHash()).toBe(hash)
  })

  it("changes the hash when a schema changes", () => {
    const hash = getLoadedSchemaHash()
    MedusaModule.setJoinerConfig("order", {
      serviceName: "order",
      schema: `type Order { id: ID! total: Int }`,
    } as any)

    expect(getLoadedSchemaHash()).not.toBe(hash)
  })

  it("merges normally without a manifest, remembering the real input", () => {
    const input = getLoadedSchema()
    const { schema } = cleanAndMergeSchema(input)

    expect(Object.keys(schema.getTypeMap())).toEqual(
      expect.arrayContaining(["Product", "Order"])
    )
    expect(getLastMergedSchemaInput()).toBe(input)
  })

  it("uses the precomputed type definitions when the hash matches", () => {
    setBuildManifest({
      graphqlSchema: {
        inputHash: getLoadedSchemaHash(),
        typeDefs: `type Precomputed { id: ID! } type Query { precomputed: Precomputed }`,
        notFound: { Foo: { bar: "baz" } },
      },
    })

    const { schema, notFound } = cleanAndMergeSchema(getLoadedSchema())

    expect(schema.getType("Precomputed")).toBeDefined()
    expect(schema.getType("Product")).toBeUndefined()
    expect(notFound).toEqual({ Foo: { bar: "baz" } })
    expect(getLastMergedSchemaInput()).toBe(getLoadedSchema())
  })

  it("falls back to merging when the hash does not match", () => {
    setBuildManifest({
      graphqlSchema: {
        inputHash: "stale",
        typeDefs: `type Precomputed { id: ID! }`,
        notFound: {},
      },
    })

    const { schema } = cleanAndMergeSchema(getLoadedSchema())

    expect(schema.getType("Precomputed")).toBeUndefined()
    expect(schema.getType("Product")).toBeDefined()
  })

  it("mergeLoadedSchema returns the merged type definitions", () => {
    const { typeDefs } = mergeLoadedSchema(getLoadedSchema())
    expect(typeDefs.kind).toBe("Document")
  })
})
