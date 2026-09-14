import { defineSearchIndex, search } from "@medusajs/utils"

// The file name matters: "-index.ts" must not be mistaken for a barrel file
// and skipped.
export const tagIndex = defineSearchIndex({
  name: "tag",
  entity: "tag",
  fields: search.define({
    id: search.keyword().filterable(),
    value: search.text().searchable(),
  }),
  async *seed() {},
})
