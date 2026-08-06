import { SearchTypes } from "@medusajs/types"
import { ProductEvents } from "@medusajs/utils"

const BATCH_SIZE = 100

const PRODUCT_FIELDS = ["id", "title", "handle", "status"]

const productIndex: SearchTypes.SearchIndexDefinition = {
  name: "product",
  entity: "product",
  fields: {
    id: { type: "keyword", filterable: true },
    title: { type: "text", searchable: { weight: 3 }, sortable: true },
    handle: { type: "keyword", filterable: true },
    status: { type: "keyword", filterable: true, facetable: true },
  },

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

      yield data as SearchTypes.SearchDocument[]

      if (data.length < BATCH_SIZE) {
        return
      }

      skip += BATCH_SIZE
    }
  },
}

export default [productIndex]
