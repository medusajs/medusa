import { defineSearchIndex, search } from "@medusajs/utils"

// Two indexes out of one file: they share a caller path, so nothing may key off
// the file alone.

export const orderIndex = defineSearchIndex({
  name: "order",
  entity: "order",
  fields: search.define({
    id: search.keyword().filterable(),
    display_id: search.integer().sortable(),
  }),
  async *seed() {},
})

export const returnIndex = defineSearchIndex({
  name: "return",
  entity: "return",
  fields: search.define({
    id: search.keyword().filterable(),
    status: search.keyword().filterable(),
  }),
  async *seed() {},
})
