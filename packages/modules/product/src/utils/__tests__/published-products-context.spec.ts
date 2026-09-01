import {
  applyPublishedProductsContext,
  extractPublishedProductsContext,
} from "../published-products-context"

const enabledContext = { context: { products: { published: true } } }

describe("extractPublishedProductsContext", () => {
  it("drops the context from the filters", () => {
    const result = extractPublishedProductsContext({
      value: "tag",
      ...enabledContext,
    })

    expect(result.filters).toEqual({ value: "tag" })
    expect(result.publishedOnly).toBe(true)
  })

  it("reports disabled when the flag is absent", () => {
    const result = extractPublishedProductsContext({
      context: { region_id: "reg_1" },
    })

    expect(result.filters).toEqual({})
    expect(result.publishedOnly).toBe(false)
  })

  it("ignores a products namespace without the flag", () => {
    const result = extractPublishedProductsContext({
      context: { products: { something_else: true } },
    })

    expect(result.publishedOnly).toBe(false)
  })

  it("leaves filters without a context alone", () => {
    const filters = { value: "tag" }
    const result = extractPublishedProductsContext(filters)

    expect(result.filters).toBe(filters)
    expect(result.publishedOnly).toBe(false)
  })

  it("handles undefined filters", () => {
    expect(extractPublishedProductsContext(undefined)).toEqual({
      filters: undefined,
      publishedOnly: false,
    })
  })
})

describe("applyPublishedProductsContext", () => {
  it("constrains a products relation", () => {
    const { filters, config } = applyPublishedProductsContext(enabledContext, {
      relations: ["products"],
    })

    expect(filters).toEqual({})
    expect((config as any).options.populateWhere).toEqual({
      products: { status: "published" },
    })
  })

  it("constrains a nested products relation", () => {
    const { config } = applyPublishedProductsContext(enabledContext, {
      relations: ["category_children", "category_children.products"],
    })

    expect((config as any).options.populateWhere).toEqual({
      category_children: { products: { status: "published" } },
    })
  })

  it("constrains every products path at once", () => {
    const { config } = applyPublishedProductsContext(enabledContext, {
      relations: ["products", "category_children.products"],
    })

    expect((config as any).options.populateWhere).toEqual({
      products: { status: "published" },
      category_children: { products: { status: "published" } },
    })
  })

  it("does not constrain paths that hang off products", () => {
    const { config } = applyPublishedProductsContext(enabledContext, {
      relations: ["products", "products.variants"],
    })

    expect((config as any).options.populateWhere).toEqual({
      products: { status: "published" },
    })
  })

  it("keeps populateWhere the caller already set", () => {
    const { config } = applyPublishedProductsContext(enabledContext, {
      relations: ["products"],
      options: { populateWhere: { images: { rank: 0 } } },
    } as any)

    expect((config as any).options.populateWhere).toEqual({
      images: { rank: 0 },
      products: { status: "published" },
    })
  })

  it("is a no-op without the context", () => {
    const config = { relations: ["products"] }
    const result = applyPublishedProductsContext({ value: "tag" }, config)

    expect(result.config).toBe(config)
  })

  it("is a no-op when no products relation was requested", () => {
    const config = { relations: ["category_children"] }
    const result = applyPublishedProductsContext(enabledContext, config)

    expect(result.config).toBe(config)
  })
})
