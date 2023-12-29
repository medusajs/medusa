import { Entity, ManyToOne, PrimaryKey, Unique } from "@mikro-orm/core"
import LineItem from "./line-item"
import TaxLine from "./tax-line"

@Entity({ tableName: "line_item_tax_line" })
@Unique({ properties: ["line_item_id", "tax_line_id"] })
export default class LineItemTaxLine {
  @PrimaryKey({ columnType: "text" })
  line_item_id: string

  @PrimaryKey({ columnType: "text" })
  tax_line_id: string

  @ManyToOne(() => LineItem, {
    fieldName: "line_item_id",
  })
  line_item: LineItem

  @ManyToOne(() => TaxLine, {
    fieldName: "tax_line_id",
  })
  tax_line: TaxLine
}
