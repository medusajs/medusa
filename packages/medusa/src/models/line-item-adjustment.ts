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
@Index(["discount_id", "item_id"], {
  unique: true,
  where: `"discount_id" IS NOT NULL`,
})
export class LineItemAdjustment {
  @PrimaryColumn()
  id: string

  @Index()
  @Column()
  item_id: string

  @ManyToOne(
    () => LineItem,
    (li) => li.adjustments,
    { onDelete: "CASCADE" }
  )
  @JoinColumn({ name: "item_id" })
  item: LineItem

  @Column()
  description: string

  @ManyToOne(() => Discount)
  @JoinColumn({ name: "discount_id" })
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
