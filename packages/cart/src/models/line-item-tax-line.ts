import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  ManyToOne,
  OnInit,
  Property,
} from "@mikro-orm/core"
import LineItem from "./line-item"
import TaxLine from "./tax-line"

@Entity({ tableName: "cart_line_item_tax_line" })
export default class LineItemTaxLine extends TaxLine {
  @ManyToOne(() => LineItem, {
    onDelete: "cascade",
    nullable: true,
    index: "IDX_tax_line_item_id",
  })
  item: LineItem | null

  @Property({ columnType: "text" })
  item_id: string

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "calitxl")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "calitxl")
  }
}
