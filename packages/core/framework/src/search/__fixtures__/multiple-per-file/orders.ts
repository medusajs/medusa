import { defineSearchIndex } from "@medusajs/utils"

// Two indexes out of one file: they share a caller path, so nothing may key off
// the file alone.

export const orderIndex = defineSearchIndex({
  name: "order",
  entity: "order",
  fields: {
    id: { type: "keyword", filterable: true },
    display_id: { type: "integer", sortable: true },
  },
  async *seed() {},
})

export const returnIndex = defineSearchIndex({
  name: "return",
  entity: "return",
  fields: {
    id: { type: "keyword", filterable: true },
    status: { type: "keyword", filterable: true },
  },
  async *seed() {},
})
