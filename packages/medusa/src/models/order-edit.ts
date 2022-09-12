import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm"

import { FeatureFlagEntity } from "../utils/feature-flag-decorators"
import { resolveDbType } from "../utils/db-aware-column"
import { OrderItemChange } from "./order-item-change"
import { SoftDeletableEntity } from "../interfaces"
import { generateEntityId } from "../utils"
import { LineItem } from "./line-item"
import { Order } from "./order"
import { User } from "./user"

@FeatureFlagEntity("order_editing")
export class OrderEdit extends SoftDeletableEntity {
  @ManyToOne(() => Order, (o) => o.edits)
  @JoinColumn({ name: "order_id" })
  order: Order

  @OneToMany(() => OrderItemChange, (oic) => oic.order_edit, {
    eager: true,
    cascade: true,
  })
  changes: OrderItemChange[]

  @Column({ nullable: true })
  internal_note?: string

  @Column()
  created_by: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  created_by_user: User

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @Column({ nullable: true })
  requested_by?: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  requested_by_user: User

  @CreateDateColumn({ type: resolveDbType("timestamptz"), nullable: true })
  requested_at?: Date

  @Column({ nullable: true })
  confirmed_by?: string // customer or user ID

  @CreateDateColumn({ type: resolveDbType("timestamptz"), nullable: true })
  confirmed_at?: Date

  @Column({ nullable: true })
  declined_by?: string // customer or user ID

  @Column({ nullable: true })
  declined_reason?: string

  @CreateDateColumn({ type: resolveDbType("timestamptz"), nullable: true })
  declined_at?: Date

  @Column({ nullable: true })
  canceled_by?: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "canceled_by" })
  canceled_by_user: User

  @CreateDateColumn({ type: resolveDbType("timestamptz"), nullable: true })
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
