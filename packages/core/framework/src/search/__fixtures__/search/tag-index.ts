import { defineSearchIndex } from "@medusajs/utils"

// The file name matters: "-index.ts" must not be mistaken for a barrel file
// and skipped.
export const tagIndex = defineSearchIndex({
  name: "tag",
  entity: "tag",
  fields: {
    id: { type: "keyword", filterable: true },
    value: { type: "text", searchable: true },
  },
  async *seed() {},
})
