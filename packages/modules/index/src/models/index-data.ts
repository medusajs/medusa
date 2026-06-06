import { model } from "@zjedene-medusa/framework/utils"

const IndexData = model.define("IndexData", {
  id: model.text().primaryKey(),
  name: model.text().primaryKey(),
  data: model.json().default({}),
  staled_at: model.dateTime().nullable(),
  // document_tsv: model.tsvector(), NOTE: This is not supported and it is here for reference of its counter part in the migration
})

export default IndexData
