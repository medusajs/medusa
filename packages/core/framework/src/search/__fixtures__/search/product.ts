import { defineSearchIndex } from "@medusajs/utils"

export const productIndex = defineSearchIndex({
  name: "product",
  entity: "product",
  fields: {
    id: { type: "keyword", filterable: true },
    title: { type: "text", searchable: true },
  },
  async *seed() {},
})
