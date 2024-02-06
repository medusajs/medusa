import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

@Entity({ tableName: "region_currency" })
export default class Currency {
  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  code: string

  @Property({ columnType: "text" })
  symbol: string

  @Property({ columnType: "text" })
  symbol_native: string

  @Property({ columnType: "text" })
  name: string

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "reg_curr")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "reg_curr")
  }
}
