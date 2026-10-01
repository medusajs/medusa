import { SearchTypes } from "@medusajs/framework/types"

export type TestProduct = {
  id: string
  title: string
  handle: string
  description: string
  status: string
  brand: string
  min_price: number
  sizes: number[]
  created_at: Date
  updated_at: Date
  deleted_at?: Date
  // Stands in for a hard-removed source row — distinct from `deleted_at`,
  // which is just a regular filterable field here. Only used by the
  // catch-up-reseed tests.
  removed?: boolean
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
    sizes: [41, 42],
    created_at: new Date("2026-01-01T00:00:00.000Z"),
    updated_at: new Date("2026-01-01T00:00:00.000Z"),
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
    sizes: [38],
    created_at: new Date("2026-02-01T00:00:00.000Z"),
    updated_at: new Date("2026-03-01T00:00:00.000Z"),
    deleted_at: new Date("2026-03-01T00:00:00.000Z"),
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
    sizes: [],
    created_at: new Date("2026-03-01T00:00:00.000Z"),
    updated_at: new Date("2026-03-01T00:00:00.000Z"),
    tags: ["hat"],
    variants: [
      { sku: "HAT-GREEN-S", color: "green" },
      { sku: "HAT-GREEN-L", color: "olive" },
    ],
  },
]

export function resetDataset(products: TestProduct[] = baseProducts): void {
  dataset.products = products.map((product) => ({ ...product }))
  onBulkSeedStart = undefined
}

// Simulates a live update landing on the source of truth mid-build.
export function touchProduct(id: string, changes: Partial<TestProduct> = {}): void {
  const index = dataset.products.findIndex((product) => product.id === id)
  if (index === -1) {
    return
  }
  dataset.products[index] = {
    ...dataset.products[index],
    ...changes,
    updated_at: new Date(),
  }
}

// Simulates a live delete landing on the source of truth mid-build.
export function removeProduct(id: string): void {
  touchProduct(id, { removed: true })
}

// Test seam: called once a bulk (unscoped) seed has taken its snapshot of
// `dataset.products` but before it's done writing, so a test can simulate a
// live write landing mid-build — one the bulk pass' own snapshot missed, and
// only the catch-up pass (a fresh, later read) can still pick up.
let onBulkSeedStart: (() => void | Promise<void>) | undefined

export function setOnBulkSeedStart(
  hook: (() => void | Promise<void>) | undefined
): void {
  onBulkSeedStart = hook
}

export const productIndex: SearchTypes.SearchIndexDefinition = {
  name: "product",
  entity: "product",
  fields: {
    id: { type: "keyword", filterable: true },
    title: { type: "text", searchable: { weight: 3 }, sortable: true },
    handle: { type: "keyword", filterable: true },
    description: { type: "text", searchable: true },
    status: { type: "keyword", filterable: true, facetable: true },
    brand: {
      type: "keyword",
      filterable: true,
      facetable: true,
      sortable: true,
    },
    min_price: {
      type: "float",
      filterable: true,
      sortable: true,
      facetable: { types: ["value", "range", "stats"] },
    },
    sizes: { type: "integer", array: true, filterable: true },
    created_at: { type: "date", filterable: true, sortable: true },
    deleted_at: { type: "date", filterable: true },
    tags: { type: "keyword", array: true, filterable: true, facetable: true },
    variants: {
      type: "object",
      array: true,
      fields: {
        sku: { type: "keyword", searchable: true, filterable: true },
        color: { type: "keyword", filterable: true, facetable: true },
      },
    },
  },
  events: ["product.created", "product.updated", "product.deleted"],
  async consume(event) {
    const id = (event.data as { id: string }).id

    if (event.name === "product.deleted") {
      return [{ action: "delete", filters: { id: [id] } }]
    }

    const product = dataset.products.find((candidate) => candidate.id === id)

    if (!product) {
      return []
    }

    return [{ action: "upsert", documents: [product] }]
  },
  async *seed({ filters, catchup }) {
    const ids = (filters?.ids as string[]) ?? undefined
    const scoped = !!ids || !!catchup

    let candidates = dataset.products
    if (ids) {
      candidates = candidates.filter((product) => ids.includes(product.id))
    }
    if (catchup) {
      candidates = candidates.filter(
        (product) => product.updated_at >= catchup.since
      )
    }
    if (!scoped) {
      // An unscoped (full) seed never re-adds what the source removed — the
      // target either started empty (swap) or was cleared first (in-place).
      candidates = candidates.filter((product) => !product.removed)

      if (onBulkSeedStart) {
        const hook = onBulkSeedStart
        onBulkSeedStart = undefined
        await hook()
      }
    }

    // Two batches, so the streaming path gets exercised.
    const half = Math.ceil(candidates.length / 2) || 1

    for (let i = 0; i < candidates.length; i += half) {
      const batch = candidates.slice(i, i + half)
      const mutations: SearchTypes.SearchMutation[] = []

      const upserts = batch.filter((product) => !product.removed)
      if (upserts.length) {
        mutations.push({ action: "upsert", documents: upserts })
      }

      for (const product of batch) {
        if (product.removed) {
          mutations.push({ action: "delete", filters: { id: [product.id] } })
        }
      }

      yield mutations
    }
  },
}
