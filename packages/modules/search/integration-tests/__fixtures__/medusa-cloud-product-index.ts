import { SearchTypes } from "@medusajs/framework/types"

export const products: SearchTypes.SearchDocument[] = [
  {
    id: "prod_medusa_1",
    title: "Red running shoe",
    status: "published",
    price: 100,
    tags: ["shoe", "sport"],
  },
  {
    id: "prod_medusa_2",
    title: "Blue running shirt",
    status: "published",
    price: 50,
    tags: ["shirt", "sport"],
  },
]

export const productIndex: SearchTypes.SearchIndexDefinition = {
  name: `medusa_product_${Date.now()}`,
  entity: "product",
  provider: "search-medusa",
  fields: {
    id: { type: "keyword", filterable: true },
    title: { type: "text", searchable: true },
    status: { type: "keyword", filterable: true, facetable: true },
    price: { type: "float", filterable: true, sortable: true },
    tags: { type: "keyword", array: true, filterable: true, facetable: true },
  },
  async *seed() {
    yield [{ action: "upsert", documents: products }]
  },
}

const VECTOR_DIMENSIONS = 768

/** A vector pointing along the given leading values, zero everywhere else. */
export const vector = (...head: number[]): number[] => [
  ...head,
  ...new Array(VECTOR_DIMENSIONS - head.length).fill(0),
]

export const vectorProducts: SearchTypes.SearchDocument[] = [
  {
    id: "prod_vector_1",
    title: "Red running shoe",
    category: "shoes",
    embedding: vector(1, 0),
  },
  {
    id: "prod_vector_2",
    title: "Blue cotton shirt",
    category: "shirts",
    embedding: vector(0, 1),
  },
  // Close to prod_vector_1 in meaning, shares no word with "red shoe".
  {
    id: "prod_vector_3",
    title: "Crimson sneaker",
    category: "shoes",
    embedding: vector(0.9, 0.1),
  },
]

export const vectorProductIndex: SearchTypes.SearchIndexDefinition = {
  name: `medusa_vector_product_${Date.now()}`,
  entity: "product",
  provider: "search-medusa",
  fields: {
    id: { type: "keyword", filterable: true },
    title: { type: "text", searchable: true },
    category: { type: "keyword", filterable: true },
    embedding: { type: "vector", dimensions: VECTOR_DIMENSIONS },
  },
  async *seed() {
    yield [{ action: "upsert", documents: vectorProducts }]
  },
}

export const embeddedProductIndex: SearchTypes.SearchIndexDefinition = {
  name: `medusa_embedded_product_${Date.now()}`,
  entity: "product",
  provider: "search-medusa",
  fields: {
    id: { type: "keyword", filterable: true },
    title: { type: "text", searchable: true },
    embedding: { type: "vector", dimensions: VECTOR_DIMENSIONS, embed: true },
  },
  async *seed() {
    yield [
      {
        action: "upsert",
        documents: vectorProducts.map(({ id, title }) => ({
          id,
          title,
          embedding: title,
        })),
      },
    ]
  },
}
