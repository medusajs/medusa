import {
  Entity,
  BeforeInsert,
  Index,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { ulid } from "ulid"

import { TaxLine } from "./tax-line"
import { LineItem } from "./line-item"

@Entity()
export class LineItemAdjustment extends TaxLine {
  @Index()
  @Column()
  item_id: string

  @ManyToOne(() => LineItem, (li) => li.adjustments)
  @JoinColumn({ name: "item_id" })
  item: LineItem

  @Column()
  description: string

  @Column({ nullable: true })
  resource_id: string

  @Column({ type: "int" })
  amount: number

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `lia_${id}`
  }
}

