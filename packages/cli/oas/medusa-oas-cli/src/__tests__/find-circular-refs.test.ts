import { OpenAPIObject } from "openapi3-ts/oas30"
import { findCircularRefs } from "../utils/find-circular-refs"

const buildOas = (schemas: Record<string, unknown>): OpenAPIObject =>
  ({
    openapi: "3.0.0",
    info: { title: "Test", version: "1.0.0" },
    paths: {},
    components: { schemas },
  }) as OpenAPIObject

describe("findCircularRefs", () => {
  it("should report only the ref that closes a cycle between two schemas", () => {
    const oas = buildOas({
      Order: {
        type: "object",
        properties: { customer: { $ref: "#/components/schemas/Customer" } },
      },
      Customer: {
        type: "object",
        properties: { order: { $ref: "#/components/schemas/Order" } },
      },
    })

    expect(findCircularRefs(oas)).toEqual([
      "#/components/schemas/Customer/properties/order",
    ])
  })

  it("should report a schema that references itself", () => {
    const oas = buildOas({
      Category: {
        type: "object",
        properties: {
          children: {
            type: "array",
            items: { $ref: "#/components/schemas/Category" },
          },
        },
      },
    })

    expect(findCircularRefs(oas)).toEqual([
      "#/components/schemas/Category/properties/children/items",
    ])
  })

  it("should report a cycle once when several schemas reference it", () => {
    const oas = buildOas({
      Cart: {
        type: "object",
        properties: { order: { $ref: "#/components/schemas/Order" } },
      },
      Return: {
        type: "object",
        properties: { order: { $ref: "#/components/schemas/Order" } },
      },
      Order: {
        type: "object",
        properties: { customer: { $ref: "#/components/schemas/Customer" } },
      },
      Customer: {
        type: "object",
        properties: { order: { $ref: "#/components/schemas/Order" } },
      },
    })

    expect(findCircularRefs(oas)).toEqual([
      "#/components/schemas/Customer/properties/order",
    ])
  })

  it("should return nothing for a spec without cycles", () => {
    const oas = buildOas({
      Order: {
        type: "object",
        properties: { customer: { $ref: "#/components/schemas/Customer" } },
      },
      Customer: {
        type: "object",
        properties: { email: { type: "string" } },
      },
    })

    expect(findCircularRefs(oas)).toEqual([])
  })

  it("should skip external refs", () => {
    const oas = buildOas({
      Order: {
        type: "object",
        properties: { customer: { $ref: "./customer.yaml#/Customer" } },
      },
    })

    expect(findCircularRefs(oas)).toEqual([])
  })
})
