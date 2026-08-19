import "@medusajs/modules-sdk"
import { defineSearchIndex, ProductEvents, search } from "@medusajs/utils"

const BATCH_SIZE = 100

const PRODUCT_FIELDS = ["id", "title", "handle", "status"]
const CUSTOMER_FIELDS = ["id", "email", "first_name", "last_name"]

// Declared like user code: `defineSearchIndex` compiles the DSL schemas and
// registers the definitions, and medusa-config passes the returned (normalized)
// definitions to the Search Module as options.
const productIndex = defineSearchIndex({
  name: "product",
  entity: "product",
  fields: search.define({
    id: search.keyword().filterable(),
    title: search.text().searchable({ weight: 3 }).sortable(),
    handle: search.keyword().filterable(),
    status: search.keyword().filterable().facetable(),
  }),

  events: [
    ProductEvents.PRODUCT_CREATED,
    ProductEvents.PRODUCT_UPDATED,
    ProductEvents.PRODUCT_DELETED,
  ],

  // An event carries an id, so the row is read back through `query.graph`. A
  // delete cannot be read back and goes by filter instead.
  async consume(event, { container }) {
    const id = (event.data as { id: string }).id

    if (event.name === ProductEvents.PRODUCT_DELETED) {
      return [{ action: "delete", filters: { id: [id] } }]
    }

    const { data } = await container.query.graph({
      entity: "product",
      fields: PRODUCT_FIELDS,
      filters: { id },
    })

    // Gone between the event and now; the delete that follows removes it.
    if (!data.length) {
      return []
    }

    return [{ action: "upsert", documents: data }]
  },

  // Reads the source of truth the same way, for a full rebuild.
  async *seed({ container, filters }) {
    let skip = 0

    while (true) {
      const { data } = await container.query.graph({
        entity: "product",
        fields: PRODUCT_FIELDS,
        filters: filters ?? {},
        pagination: { skip, take: BATCH_SIZE, order: { id: "ASC" } },
      })

      if (!data.length) {
        return
      }

      yield data

      if (data.length < BATCH_SIZE) {
        return
      }

      skip += BATCH_SIZE
    }
  },
})

/**
 * A second index, so grouped results across entities are observable. No `events`:
 * ingestion is covered by the product index, and this one is filled by a reindex.
 */
const customerIndex = defineSearchIndex({
  name: "customer",
  entity: "customer",
  fields: search.define({
    id: search.keyword().filterable(),
    email: search.keyword().searchable(),
    first_name: search.text().searchable(),
    last_name: search.text().searchable(),
  }),

  async *seed({ container, filters }) {
    let skip = 0

    while (true) {
      const { data } = await container.query.graph({
        entity: "customer",
        fields: CUSTOMER_FIELDS,
        filters: filters ?? {},
        pagination: { skip, take: BATCH_SIZE, order: { id: "ASC" } },
      })

      if (!data.length) {
        return
      }

      yield data

      if (data.length < BATCH_SIZE) {
        return
      }

      skip += BATCH_SIZE
    }
  },
})

export default [productIndex, customerIndex]
