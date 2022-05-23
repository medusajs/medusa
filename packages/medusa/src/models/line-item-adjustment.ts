import {
  Entity,
  BeforeInsert,
  Index,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from "typeorm"
import { DbAwareColumn } from "../utils/db-aware-column"
import { Discount } from "./discount"
import { LineItem } from "./line-item"
import { generateEntityId } from "../utils/generate-entity-id"

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

  @ManyToOne(() => LineItem, (li) => li.adjustments, { onDelete: "CASCADE" })
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
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "lia")
  }
}
