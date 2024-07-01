import { model } from "@medusajs/utils"
import Region from "./region"

const Country = model
  .define(
    { name: "Country", tableName: "region_country" },
    {
      iso_2: model.text().searchable().primaryKey(),
      iso_3: model.text(),
      num_code: model.text(),
      name: model.text().searchable(),
      display_name: model.text(),
      region: model
        .belongsTo(() => Region, { mappedBy: "countries" })
        .nullable(),
      metadata: model.json().nullable(),
    }
  )
  .indexes([
    {
      // TODO: Remove ts-ignore when field inference takes into account the nullable property
      // @ts-ignore
      on: ["region_id", "iso_2"],
      unique: true,
    },
  ])

export default Country
