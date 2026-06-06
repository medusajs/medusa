import { model } from "@zjedene-medusa/framework/utils"

const IndexRelation = model.define("IndexRelation", {
  id: model.autoincrement().primaryKey(),
  pivot: model.text(),
  parent_name: model.text(),
  parent_id: model.text(),
  child_name: model.text(),
  child_id: model.text(),
  staled_at: model.dateTime().nullable(),
})

export default IndexRelation
