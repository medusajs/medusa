import { DALUtils, generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  Filter,
  ManyToOne,
  OnInit,
  PrimaryKey
} from "@mikro-orm/core"
import LineItem from "./line-item"
import TaxLine from "./tax-line"

@Entity({ tableName: "cart_line_item_tax_line" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class LineItemTaxLine extends TaxLine {
  @PrimaryKey({ columnType: "text" })
  line_item_id: string

  @ManyToOne(() => LineItem, {
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
