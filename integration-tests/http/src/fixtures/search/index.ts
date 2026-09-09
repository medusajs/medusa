import "@medusajs/modules-sdk"
import {
  defineSearchIndex,
  graphConsume,
  graphSeed,
  ProductEvents,
  search,
} from "@medusajs/utils"

const BATCH_SIZE = 100

const PRODUCT_FIELDS = ["id", "title", "handle", "status", "sales_channels.id"]
const CUSTOMER_FIELDS = ["id", "email", "first_name", "last_name"]

const productFields = search.define({
  id: search.keyword().filterable(),
  title: search.text().searchable({ weight: 3 }).sortable(),
  handle: search.keyword().filterable(),
  status: search.keyword().filterable().facetable(),
  sales_channel_ids: search.keyword().array().filterable(),
})

/**
 * Products come off `query.graph` with their sales channels as rows, and the
 * index wants them as a flat array of ids — which is all a `transform` is for.
 */
const toProductDocument = (product: any) => ({
  id: product.id,
  title: product.title,
  handle: product.handle,
  status: product.status,
  sales_channel_ids: (product.sales_channels ?? []).map(
    (channel: any) => channel.id
  ),
})

// Declared like user code: `defineSearchIndex` compiles the DSL schemas and
// registers the definitions, and medusa-config passes the returned (normalized)
// definitions to the Search Module as options. Paging, catch-up, read-back and
// soft deletes all come from `graphSeed` / `graphConsume`.
const productIndex = defineSearchIndex({
  name: "product",
  entity: "product",
  fields: productFields,

  events: [
    ProductEvents.PRODUCT_CREATED,
    ProductEvents.PRODUCT_UPDATED,
    ProductEvents.PRODUCT_DELETED,
  ],

  consume: graphConsume<typeof productFields>({
    fields: PRODUCT_FIELDS,
    transform: toProductDocument,
  }),

  seed: graphSeed<typeof productFields>({
    fields: PRODUCT_FIELDS,
    batch_size: BATCH_SIZE,
    transform: toProductDocument,
  }),
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

      yield [{ action: "upsert", documents: data }]

      if (data.length < BATCH_SIZE) {
        return
      }

      skip += BATCH_SIZE
    }
  },
})

export default [productIndex, customerIndex]
