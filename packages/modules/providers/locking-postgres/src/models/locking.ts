import { model } from "@zjedene-medusa/framework/utils"

const Locking = model.define("Locking", {
  id: model.id({ prefix: "lk" }).primaryKey(),
  owner_id: model.text().nullable(),
  expiration: model.dateTime().nullable(),
})

export default Locking
