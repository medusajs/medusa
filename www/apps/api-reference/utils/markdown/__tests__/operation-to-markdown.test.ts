import { describe, it, expect } from "vitest"
import type { OpenAPI } from "types"
import operationToMarkdown from "../operation-to-markdown"

const baseSpecs = {
  components: {
    securitySchemes: {
      api_token: { type: "http", "x-displayName": "API Token" },
    },
  },
} as unknown as OpenAPI.ExpandedDocument

const buildOptions = () => ({
  area: "admin" as const,
  baseUrl: "https://docs.medusajs.com",
  basePath: "/api",
  endpointPath: "/admin/products/{id}",
  method: "post",
  baseSpecs,
})

describe("operationToMarkdown", () => {
  it("renders heading, method+path, description and sections", () => {
    const operation = {
      operationId: "postProductsId",
      summary: "Update Product",
      description: "Updates a product.",
      security: [{ api_token: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "The product ID.",
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title"],
              properties: { title: { type: "string" } },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "OK",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { id: { type: "string" } },
              },
            },
          },
        },
      },
      "x-codeSamples": [{ lang: "bash", label: "cURL", source: "curl ..." }],
      "x-workflow": "updateProductsWorkflow",
    } as unknown as OpenAPI.Operation

    const md = operationToMarkdown(operation, buildOptions())

    expect(md).toContain("## Update Product")
    expect(md).toContain("`POST /admin/products/{id}`")
    expect(md).toContain("Updates a product.")
    expect(md).toContain("**Authorization:** API Token")
    expect(md).toContain(
      "Workflow: [updateProductsWorkflow](https://docs.medusajs.com/resources/references/medusa-workflows/updateProductsWorkflow)"
    )
    expect(md).toContain("### Path Parameters")
    expect(md).toContain("### Request Body")
    expect(md).toContain("### Responses")
    expect(md).toContain("#### 200 OK")
    expect(md).toContain("### Code Samples")
    expect(md).toContain("```bash")
    // example generated from the 200 response schema
    expect(md).toContain("### Example")
  })

  it("marks deprecated/since/badges in the heading", () => {
    const operation = {
      operationId: "getThing",
      summary: "Get Thing",
      deprecated: true,
      "x-since": "2.5.0",
      "x-badges": [{ text: "beta", description: "Beta feature" }],
      responses: {},
    } as unknown as OpenAPI.Operation

    const md = operationToMarkdown(operation, {
      ...buildOptions(),
      method: "get",
    })
    expect(md).toContain("## Get Thing (deprecated, since v2.5.0, beta)")
    // badge description is preserved as a note (not dropped)
    expect(md).toContain("> **beta:** Beta feature")
  })

  it("normalizes code-sample fence languages", () => {
    const operation = {
      operationId: "op",
      summary: "Op",
      responses: {},
      "x-codeSamples": [
        { lang: "JavaScript", label: "JS SDK", source: "const a = 1" },
        { lang: "Shell", label: "cURL", source: "curl x" },
      ],
    } as unknown as OpenAPI.Operation

    const md = operationToMarkdown(operation, {
      ...buildOptions(),
      method: "get",
    })
    expect(md).toContain("```js\nconst a = 1")
    expect(md).toContain("```bash\ncurl x")
    expect(md).not.toContain("```JavaScript")
    expect(md).not.toContain("```Shell")
  })

  it("does not double-wrap an already-fenced event payload", () => {
    const operation = {
      operationId: "op",
      summary: "Op",
      responses: {},
      "x-events": [
        {
          name: "cart.created",
          description: "Emitted when a cart is created.",
          payload: "```ts\n{\n  id,\n}\n```",
        },
      ],
    } as unknown as OpenAPI.Operation

    const md = operationToMarkdown(operation, {
      ...buildOptions(),
      method: "get",
    })
    expect(md).toContain("```ts\n{\n  id,\n}\n```")
    // no ```json wrapper around the already-fenced payload
    expect(md).not.toContain("```json\n```ts")
  })

  it("shows Empty response for responses without content", () => {
    const operation = {
      operationId: "del",
      summary: "Delete",
      responses: { "200": { description: "OK" } },
    } as unknown as OpenAPI.Operation

    const md = operationToMarkdown(operation, {
      ...buildOptions(),
      method: "delete",
    })
    expect(md).toContain("#### 200 OK")
    expect(md).toContain("Empty response")
  })
})
