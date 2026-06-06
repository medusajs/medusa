import { model } from "@zjedene-medusa/framework/utils"
import { IndexMetadataStatus } from "../utils/index-metadata-status"

const IndexMetadata = model
  .define("IndexMetadata", {
    id: model.id({ prefix: "idxmeta" }).primaryKey(),
    entity: model.text(),
    fields: model.text(),
    fields_hash: model.text(),
    status: model
      .enum(IndexMetadataStatus)
      .default(IndexMetadataStatus.PENDING),
  })
  .indexes([
    {
      name: "IDX_index_metadata_entity",
      on: ["entity"],
      unique: true,
    },
  ])

export default IndexMetadata
