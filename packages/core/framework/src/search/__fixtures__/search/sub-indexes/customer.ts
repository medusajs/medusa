import { defineSearchIndex } from "@medusajs/utils"

export const customerIndex = defineSearchIndex({
  name: "customer",
  entity: "customer",
  fields: {
    id: { type: "keyword", filterable: true },
    email: { type: "keyword", searchable: true },
  },
  async *seed() {},
})
