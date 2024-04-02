import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core"

import { createPsqlIndexStatementHelper } from "@medusajs/utils"
import Region from "./region"

// We don't need a partial index on deleted_at here since we don't support soft deletes on countries
const regionIdIsoIndexName = "IDX_region_country_region_id_iso_2_unique"
const RegionIdIsoIndexStatement = createPsqlIndexStatementHelper({
  name: regionIdIsoIndexName,
  tableName: "region_country",
  columns: ["region_id", "iso_2"],
  unique: true,
})

RegionIdIsoIndexStatement.MikroORMIndex()
@Entity({ tableName: "region_country" })
export default class Country {
  @PrimaryKey({ columnType: "text" })
  @Property({ columnType: "text" })
  iso_2: string

  @Property({ columnType: "text" })
  iso_3: string

  @Property({ columnType: "int" })
  num_code: number

  @Property({ columnType: "text" })
  name: string

  @Property({ columnType: "text" })
  display_name: string

  @Property({ columnType: "text", nullable: true })
  region_id?: string | null = null

  @ManyToOne({
    entity: () => Region,
    fieldName: "region_id",
    nullable: true,
    onDelete: "set null",
  })
  region?: Region | null
}
