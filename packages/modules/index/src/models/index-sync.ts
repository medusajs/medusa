import { model } from "@zjedene-medusa/framework/utils"

const IndexSync = model
  .define("IndexSync", {
    id: model.id({ prefix: "idxsync" }).primaryKey(),
    entity: model.text(),
    last_key: model.text().nullable(),
  })
  .indexes([
    {
      name: "IDX_index_sync_entity",
      on: ["entity"],
      unique: true,
    },
  ])

export default IndexSync
