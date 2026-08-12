import { defineSearchIndex, search } from "@medusajs/utils"

export const customerIndex = defineSearchIndex({
  name: "customer",
  entity: "customer",
  fields: search.define({
    id: search.keyword().filterable(),
    email: search.keyword().searchable(),
  }),
  async *seed() {},
})
