import { describe, it, expect } from "vitest"
import type { OpenAPI } from "types"
import schemaToMarkdown from "../schema-to-markdown"
import { MarkdownContext } from "../shared"

const ctx: MarkdownContext = {
  area: "store",
  baseUrl: "https://docs.medusajs.com",
  basePath: "/api",
}

describe("schemaToMarkdown", () => {
  it("renders object properties with required-first ordering and flags", () => {
    const schema = {
      type: "object",
      required: ["id"],
      properties: {
        name: { type: "string", description: "the name" },
        id: { type: "string", description: "the id" },
      },
    } as unknown as OpenAPI.SchemaObject

    const md = schemaToMarkdown(schema, ctx)
    const lines = md.split("\n")
    // required `id` comes before optional `name`
    expect(lines[0]).toContain("`id`: string")
    expect(lines[0]).not.toContain("optional")
    expect(lines[1]).toContain("`name`: string")
    expect(lines[1]).toContain("(optional)")
    expect(md).toContain("— The id")
  })

  it("renders enum, default, and example metadata", () => {
    const schema = {
      type: "object",
      required: ["status"],
      properties: {
        status: {
          type: "string",
          enum: ["pending", "completed"],
          default: "pending",
          example: "completed",
        },
      },
    } as unknown as OpenAPI.SchemaObject

    const md = schemaToMarkdown(schema, ctx)
    expect(md).toContain('Default: `"pending"`')
    expect(md).toContain('Enum: `"pending"`, `"completed"`')
    expect(md).toContain('Example: `"completed"`')
  })

  it("renders arrays of objects and nests item fields", () => {
    const schema = {
      type: "object",
      required: ["items"],
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            required: ["quantity"],
            properties: {
              quantity: { type: "number", description: "how many" },
            },
          },
        },
      },
    } as unknown as OpenAPI.SchemaObject

    const md = schemaToMarkdown(schema, ctx)
    expect(md).toContain("`items`: Array of objects")
    // nested field is indented under the array property
    expect(md).toMatch(/\n {2}- `quantity`: number/)
  })

  it("merges allOf object members", () => {
    const schema = {
      type: "object",
      required: ["combined"],
      properties: {
        combined: {
          allOf: [
            { type: "object", properties: { a: { type: "string" } } },
            {
              type: "object",
              required: ["b"],
              properties: { b: { type: "number" } },
            },
          ],
        },
      },
    } as unknown as OpenAPI.SchemaObject

    const md = schemaToMarkdown(schema, ctx)
    expect(md).toMatch(/\n {2}- `a`: string/)
    expect(md).toMatch(/\n {2}- `b`: number/)
  })

  it("renders oneOf members as options with type and description", () => {
    const schema = {
      type: "object",
      required: ["value"],
      properties: {
        value: {
          oneOf: [
            { type: "string", title: "AsString", description: "As a string." },
            { type: "number", title: "AsNumber" },
          ],
        },
      },
    } as unknown as OpenAPI.SchemaObject

    const md = schemaToMarkdown(schema, ctx)
    expect(md).toContain("`value`: AsString or AsNumber")
    // each option shows its type and (if present) description — not dropped
    expect(md).toContain("**Option 1**: string — As a string.")
    expect(md).toContain("**Option 2**: number")
  })

  it("absolutizes internal externalDocs links with base url + base path", () => {
    const schema = {
      type: "object",
      required: ["field"],
      properties: {
        field: {
          type: "string",
          externalDocs: {
            url: "/store/foo",
            description: "Read More",
          },
        },
      },
    } as unknown as OpenAPI.SchemaObject

    const md = schemaToMarkdown(schema, ctx)
    expect(md).toContain(
      "Related guide: [Read More](https://docs.medusajs.com/api/store/foo)"
    )
  })
})
