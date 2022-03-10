import {
  Entity,
  BeforeInsert,
  Index,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  OneToOne,
} from "typeorm"
import { ulid } from "ulid"
import { DbAwareColumn } from "../utils/db-aware-column"
import { Discount } from "./discount"
import { LineItem } from "./line-item"

@Entity()
export class LineItemAdjustment {
  @PrimaryColumn()
  id: string

  @Index()
  @Column()
  item_id: string

  @ManyToOne(() => LineItem, (li) => li.adjustments)
  @JoinColumn({ name: "item_id" })
  item: LineItem

  @Column()
  description: string

  @OneToOne(() => Discount)
  @JoinColumn({ name: 'discount_id'})
  discount: Discount

  @Index()
  @Column({ nullable: true })
  discount_id: string

  @Column({ type: "int" })
  amount: number

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `lia_${id}`
  }
}

