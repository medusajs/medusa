import { generateEntityId } from "@medusajs/utils"
import { BeforeCreate, Entity, ManyToOne, OnInit } from "@mikro-orm/core"
import LineItem from "./line-item"
import TaxLine from "./tax-line"

@Entity({ tableName: "cart_line_item_tax_line" })
export default class LineItemTaxLine extends TaxLine {
  @ManyToOne(() => LineItem, {
    joinColumn: "line_item",
    fieldName: "line_item_id",
  })
  line_item: LineItem

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "calitxl")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "calitxl")
  }
}
