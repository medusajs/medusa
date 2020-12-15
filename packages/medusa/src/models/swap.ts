import {
  Entity,
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
import randomize from "randomatic"

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

  @ManyToOne(
    () => Order,
    o => o.swaps
  )
  @JoinColumn({ name: "order_id" })
  order: Order

  @OneToMany(
    () => LineItem,
    item => item.swap,
    { cascade: true }
  )
  additional_items: LineItem

  @OneToOne(
    () => Return,
    ret => ret.swap,
    { cascade: true }
  )
  @JoinColumn({ name: "return_id" })
  return_order: Return

  @OneToMany(
    () => Fulfillment,
    fulfillment => fulfillment.swap,
    { cascade: true }
  )
  fulfillments: Fulfillment

  @OneToOne(
    () => Payment,
    p => p.swap,
    { cascade: true }
  )
  payment: Payment

  @Column({ nullable: true })
  shipping_address_id: string

  @ManyToOne(() => Address, { cascade: true })
  @JoinColumn({ name: "shipping_address_id" })
  shipping_address: Address

  @OneToMany(
    () => ShippingMethod,
    method => method.swap,
    { cascade: true }
  )
  shipping_methods: ShippingMethod[]

  @Column({ nullable: true })
  cart_id: string

  @OneToOne(() => Cart)
  @JoinColumn({ name: "cart_id" })
  cart: Cart

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @DeleteDateColumn({ type: "timestamptz" })
  deleted_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    const id = randomize("Aa0", 24)
    this.id = `swap_${id}`
  }
}
