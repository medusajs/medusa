import {
  Entity,
  BeforeInsert,
  Index,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from "typeorm"
import { ulid } from "ulid"
import { DbAwareColumn } from "../utils/db-aware-column"
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

  @Column({ nullable: true })
  resource_id: string

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

