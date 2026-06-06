import { model } from "@zjedene-medusa/framework/utils"
import { TaxRegion } from "@models"

const TaxProvider = model.define("TaxProvider", {
  id: model.id().primaryKey(),
  is_enabled: model.boolean().default(true),
  regions: model.hasMany(() => TaxRegion, {
    mappedBy: "provider",
  }),
})

export default TaxProvider
