import {
  Entity,
  Index,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from "typeorm"
import { ulid } from "ulid"

import { Order } from "./order"
import { Fulfillment } from "./fulfillment"
import { Address } from "./address"
import { LineItem } from "./line-item"
import { Return } from "./return"
import { Cart } from "./cart"
import { Payment } from "./payment"
import { ShippingMethod } from "./shipping-method"

export enum FulfillmentStatus {
  NOT_FULFILLED = "not_fulfilled",
  FULFILLED = "fulfilled",
  SHIPPED = "shipped",
  CANCELED = "canceled",
  REQUIRES_ACTION = "requires_action",
}

export enum PaymentStatus {
  NOT_PAID = "not_paid",
  AWAITING = "awaiting",
  CAPTURED = "captured",
  CANCELED = "canceled",
  DIFFERENCE_REFUNDED = "difference_refunded",
  PARTIALLY_REFUNDED = "partially_refunded",
  REFUNDED = "refunded",
  REQUIRES_ACTION = "requires_action",
}

@Entity()
export class Swap {
  @PrimaryColumn()
  id: string

  @Column({ type: "enum", enum: FulfillmentStatus })
  fulfillment_status: FulfillmentStatus

  @Column({ type: "enum", enum: PaymentStatus })
  payment_status: PaymentStatus

  @Index()
  @Column({ type: "string" })
  order_id: string

  @ManyToOne(
    () => Order,
    o => o.swaps
  )
  @JoinColumn({ name: "order_id" })
  order: Order

  @OneToMany(
    () => LineItem,
    item => item.swap,
    { cascade: ["insert"] }
  )
  additional_items: LineItem

  @OneToOne(
    () => Return,
    ret => ret.swap,
    { cascade: ["insert"] }
  )
  return_order: Return

  @OneToMany(
    () => Fulfillment,
    fulfillment => fulfillment.swap,
    { cascade: ["insert"] }
  )
  fulfillments: Fulfillment[]

  @OneToOne(
    () => Payment,
    p => p.swap,
    { cascade: ["insert"] }
  )
  payment: Payment

  @Column({ type: "int", nullable: true })
  difference_due: number

  @Column({ nullable: true })
  shipping_address_id: string

  @ManyToOne(() => Address, { cascade: ["insert"] })
  @JoinColumn({ name: "shipping_address_id" })
  shipping_address: Address

  @OneToMany(
    () => ShippingMethod,
    method => method.swap,
    { cascade: ["insert"] }
  )
  shipping_methods: ShippingMethod[]

  @Column({ nullable: true })
  cart_id: string

  @OneToOne(() => Cart)
  @JoinColumn({ name: "cart_id" })
  cart: Cart

  @Column({ type: "timestamptz", nullable: true })
  confirmed_at: Date

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @DeleteDateColumn({ type: "timestamptz" })
  deleted_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  @Column({ nullable: true })
  idempotency_key: string

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `swap_${id}`
  }
}
