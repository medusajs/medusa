import {
  BeforeCreate,
  Entity,
  ManyToOne,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"
import Region from "./region"

@Entity({ tableName: "region_country" })
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

  @ManyToOne({
    entity: () => Region,
    fieldName: "region_id",
    index: "IDX_country_region_id",
    nullable: true,
  })
  region: Region | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "reg_ctry")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "reg_ctry")
  }
}
