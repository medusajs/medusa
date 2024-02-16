import {
  BeforeCreate,
  Entity,
  Unique,
  ManyToOne,
  OnInit,
  PrimaryKey,
  Property,
  Index,
} from "@mikro-orm/core"

import {
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import Region from "./region"

// We don't need a partial index on deleted_at here since we don't support soft deletes on countries
const regionIdIsoIndexName = "IDX_region_country_region_id_iso_2_unique"
const regionIdIsoIndexStatement = createPsqlIndexStatementHelper({
  name: regionIdIsoIndexName,
  tableName: "region_country",
  columns: ["region_id", "iso_2"],
  unique: true,
})

@Entity({ tableName: "region_country" })
@Index({
  name: regionIdIsoIndexName,
  expression: regionIdIsoIndexStatement,
})
export default class Country {
  @PrimaryKey({ columnType: "text" })
  id: string

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
    nullable: true,
  })
  region?: Region | null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "reg_ctry")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "reg_ctry")
  }
}
