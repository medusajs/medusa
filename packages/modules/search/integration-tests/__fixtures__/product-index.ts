import "@medusajs/framework/modules-sdk"
import { SearchTypes } from "@medusajs/framework/types"
import { defineSearchIndex, search } from "@medusajs/framework/utils"

export type TestProduct = {
  id: string
  title: string
  handle: string
  description: string
  status: string
  brand: string
  min_price: number
  created_at: Date
  tags: string[]
  variants: { sku: string; color: string }[]
}

/**
 * Stands in for the source of truth a real `seed` would read through
 * `query.graph`. Tests mutate it and reindex to prove the index follows.
 */
export const dataset: { products: TestProduct[] } = { products: [] }

export const baseProducts: TestProduct[] = [
  {
    id: "prod_1",
    title: "Red running shoe",
    handle: "red-running-shoe",
    description: "A breathable shoe for long distances",
    status: "published",
    brand: "acme",
    min_price: 100,
    created_at: new Date("2026-01-01T00:00:00.000Z"),
    tags: ["shoe", "sport"],
    variants: [
      { sku: "SHOE-RED-41", color: "red" },
      { sku: "SHOE-RED-42", color: "red" },
    ],
  },
  {
    id: "prod_2",
    title: "Blue running shirt",
    handle: "blue-running-shirt",
    description: "A light shirt for warm weather",
    status: "published",
    brand: "borg",
    min_price: 50,
    created_at: new Date("2026-02-01T00:00:00.000Z"),
    tags: ["shirt", "sport"],
    variants: [{ sku: "SHIRT-BLUE-M", color: "blue" }],
  },
  {
    id: "prod_3",
    title: "Green wool hat",
    handle: "green-wool-hat",
    description: "A warm hat for the winter",
    status: "draft",
    brand: "acme",
    min_price: 200,
    created_at: new Date("2026-03-01T00:00:00.000Z"),
    tags: ["hat"],
    variants: [
      { sku: "HAT-GREEN-S", color: "green" },
      { sku: "HAT-GREEN-L", color: "olive" },
    ],
  },
]

export function resetDataset(products: TestProduct[] = baseProducts): void {
  dataset.products = products.map((product) => ({ ...product }))
  consumedEvents.length = 0
}

// What `consume` was handed, so the tests can assert how the module routed.
export const consumedEvents: { event: string; index: string }[] = []

// Declared exactly like user code: `defineSearchIndex` compiles the DSL schema
// and returns the normalized definition the test runner passes as options.
export const productIndex: SearchTypes.SearchIndexDefinition =
  defineSearchIndex({
    name: "product",
    entity: "product",
    fields: search.define({
      id: search.keyword().filterable(),
      title: search.text().searchable({ weight: 3 }).sortable(),
      handle: search.keyword().filterable(),
      // Indexed for matching but never returned, so the split between engine
      // fields and `query.graph` fields is observable.
      description: search.text().searchable().retrievable(false),
      status: search.keyword().filterable().facetable(),
      brand: search.keyword().filterable().facetable().sortable(),
      min_price: search.float().filterable().sortable().facetable(),
      created_at: search.date().filterable().sortable(),
      tags: search.keyword().array().filterable().facetable(),
      variants: search
        .object({
          sku: search.keyword().searchable().filterable(),
          color: search.keyword().filterable().facetable(),
        })
        .array(),
    }),
    events: ["product.created", "product.updated", "product.deleted"],
    // Reads the document out of the dataset rather than off the event, the way a
    // real definition reads through `query.graph`: an event carries an id.
    async consume(event, { index }) {
      consumedEvents.push({ event: event.name, index: index.name })

      const id = (event.data as { id: string }).id

      if (event.name === "product.deleted") {
        return [{ action: "delete", filters: { id: [id] } }]
      }

      const product = dataset.products.find((candidate) => candidate.id === id)

      // Gone by the time the event was handled; the delete that follows removes it.
      if (!product) {
        return []
      }

      return [{ action: "upsert", documents: [product] }]
    },
    // eslint-disable-next-line require-yield
    async *seed({ filters }) {
      const ids = (filters?.ids as string[]) ?? undefined

      const products = ids
        ? dataset.products.filter((product) => ids.includes(product.id))
        : dataset.products

      // Two batches, so the streaming path and the sync cursor both get exercised.
      const half = Math.ceil(products.length / 2) || 1

      for (let i = 0; i < products.length; i += half) {
        yield products.slice(i, i + half)
      }
    },
  })
