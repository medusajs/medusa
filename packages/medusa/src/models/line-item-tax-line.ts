import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Unique,
} from "typeorm"

import { TaxLine } from "./tax-line"
import { LineItem } from "./line-item"
import { generateAndApplyEntityId } from "../utils/generate-and-apply-entity-id"

@Entity()
@Unique(["item_id", "code"])
export class LineItemTaxLine extends TaxLine {
  @Index()
  @Column()
  item_id: string

  @ManyToOne(() => LineItem, (li) => li.tax_lines)
  @JoinColumn({ name: "item_id" })
  item: LineItem

  @BeforeInsert()
  private beforeInsert(): void {
    generateAndApplyEntityId(this, "id", "litl")
  }
}
