import { describe, it, expect } from "vitest"
import type { OpenAPI } from "types"
import tagToMarkdown from "../tag-to-markdown"
import schemaSectionToMarkdown from "../schema-section-to-markdown"
import { MarkdownContext } from "../shared"

const ctx: MarkdownContext = {
  area: "store",
  baseUrl: "https://docs.medusajs.com",
  basePath: "/api",
}

describe("tagToMarkdown", () => {
  it("renders heading, description and a sorted API Routes index", () => {
    const tag = {
      name: "Carts",
      description: "Cart endpoints.",
      externalDocs: { url: "https://example.com", description: "Guide" },
    } as unknown as OpenAPI.TagObject

    const paths = {
      "/store/carts/{id}": {
        post: {
          operationId: "post",
          summary: "Update Cart",
          "x-path": "/store/carts/update-cart",
        },
        get: {
          operationId: "get",
          summary: "Get a Cart",
          "x-path": "/store/carts/get-a-cart",
        },
      },
    } as unknown as OpenAPI.PathsObject

    const md = tagToMarkdown(tag, paths, ctx)
    expect(md).toContain("# Carts")
    expect(md).toContain("Cart endpoints.")
    expect(md).toContain("Related guide: [Guide](https://example.com)")
    expect(md).toContain("## API Routes")
    // GET is ordered before POST
    const getIdx = md.indexOf("GET /store/carts/{id}")
    const postIdx = md.indexOf("POST /store/carts/{id}")
    expect(getIdx).toBeGreaterThan(-1)
    expect(getIdx).toBeLessThan(postIdx)
    expect(md).toContain(
      "[Get a Cart](https://docs.medusajs.com/api/store/carts/get-a-cart)"
    )
  })
})

describe("schemaSectionToMarkdown", () => {
  it("renders singularized heading, note, fields and example", () => {
    const schema = {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "The ID." },
        name: { type: "string", description: "The name." },
      },
    } as unknown as OpenAPI.SchemaObject

    const md = schemaSectionToMarkdown(schema, "Carts", ctx)
    expect(md).toContain("## Cart Object")
    expect(md).toContain("Commerce Modules Documentation")
    expect(md).toContain("### Fields")
    expect(md).toContain("`id`: string")
    // full example includes non-required fields too
    expect(md).toContain("### The Cart Object")
    expect(md).toContain("```json")
    expect(md).toContain("name")
  })
})
