import {
  Entity,
  Generated,
  BeforeInsert,
  Index,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
  OneToMany,
} from "typeorm"
import { ulid } from "ulid"
import { Address } from "./address"

import { Cart } from "./cart"
import { Customer } from "./customer"
import { Discount } from "./discount"
import { LineItem } from "./line-item"
import { Order } from "./order"
import { Payment } from "./payment"
import { Region } from "./region"
import { ShippingMethod } from "./shipping-method"

enum DraftOrderStatus {
  OPEN = "open",
  AWAITING = "awaiting",
  COMPLETED = "completed",
}

@Entity()
export class DraftOrder {
  @PrimaryColumn()
  id: string

  @Column({ type: "enum", enum: DraftOrderStatus, default: "open" })
  status: DraftOrderStatus

  @Index()
  @Column()
  @Generated("increment")
  display_id: number

  @Index()
  @Column({ nullable: true })
  cart_id: string

  @OneToOne(() => Cart)
  @JoinColumn({ name: "cart_id" })
  cart: Cart

  @Index()
  @Column({ nullable: true })
  order_id: string

  @OneToOne(() => Order)
  @JoinColumn({ name: "order_id" })
  order: Order

  @Column({ nullable: true, type: "timestamptz" })
  canceled_at: Date

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  @Column({ nullable: true })
  idempotency_key: string

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `dorder_${id}`
  }
}
