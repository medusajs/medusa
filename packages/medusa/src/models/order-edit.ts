import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm"

import OrderEditingFeatureFlag from "../loaders/feature-flags/order-editing"
import { FeatureFlagEntity } from "../utils/feature-flag-decorators"
import { resolveDbType } from "../utils/db-aware-column"
import { OrderItemChange } from "./order-item-change"
import { SoftDeletableEntity } from "../interfaces"
import { generateEntityId } from "../utils"
import { LineItem } from "./line-item"
import { Order } from "./order"

@FeatureFlagEntity(OrderEditingFeatureFlag.key)
export class OrderEdit extends SoftDeletableEntity {
  @Column()
  order_id: string

  @ManyToOne(() => Order, (o) => o.edits)
  @JoinColumn({ name: "order_id" })
  order: Order

  @OneToMany(() => OrderItemChange, (oic) => oic.order_edit, {
    cascade: true,
  })
  changes: OrderItemChange[]

  @Column({ nullable: true })
  internal_note?: string

  @Column({ nullable: true })
  created_by: string // customer or user ID

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @Column({ nullable: true })
  requested_by?: string // customer or user ID

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  requested_at?: Date

  @Column({ nullable: true })
  confirmed_by?: string // customer or user ID

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  confirmed_at?: Date

  @Column({ nullable: true })
  declined_by?: string // customer or user ID

  @Column({ nullable: true })
  declined_reason?: string

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  declined_at?: Date

  @Column({ nullable: true })
  canceled_by?: string

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  canceled_at?: Date

  // Computed
  subtotal: number
  discount_total?: number
  tax_total: number
  total: number
  difference_due: number

  items: LineItem[]

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "oe")
  }
}
