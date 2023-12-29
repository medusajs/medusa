import { Entity, ManyToOne, Property, Unique } from "@mikro-orm/core"
import LineItem from "./line-item"
import TaxLine from "./tax-line"

@Entity({ tableName: "line_item_tax_line" })
@Unique({ properties: ["item_id", "tax_line_id"] })
export class LineItemTaxLine {
  @Property({ columnType: "text" })
  item_id: string

  @Property({ columnType: "text" })
  tax_line_id: string

  @ManyToOne(() => LineItem, {
    fieldName: "item_id",
  })
  item: LineItem

  @ManyToOne(() => TaxLine, {
    fieldName: "tax_line_id",
  })
  tax_line: TaxLine
}
