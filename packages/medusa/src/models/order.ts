import {
  Entity,
  Generated,
  BeforeInsert,
  Column,
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

import { Address } from "./address"
import { LineItem } from "./line-item"
import { Currency } from "./currency"
import { Customer } from "./customer"
import { Region } from "./region"
import { Discount } from "./discount"
import { GiftCard } from "./gift-card"
import { Payment } from "./payment"
import { Cart } from "./cart"
import { Fulfillment } from "./fulfillment"
import { Return } from "./return"
import { Refund } from "./refund"
import { Swap } from "./swap"
import { ShippingMethod } from "./shipping-method"

export enum OrderStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  ARCHIVED = "archived",
  CANCELED = "canceled",
  REQUIRES_ACTION = "requires_action",
}

export enum FulfillmentStatus {
  NOT_FULFILLED = "not_fulfilled",
  PARTIALLY_FULFILLED = "partially_fulfilled",
  FULFILLED = "fulfilled",
  PARTIALLY_SHIPPED = "partially_shipped",
  SHIPPED = "shipped",
  PARTIALLY_RETURNED = "partially_returned",
  RETURNED = "returned",
  CANCELED = "canceled",
  REQUIRES_ACTION = "requires_action",
}

export enum PaymentStatus {
  NOT_PAID = "not_paid",
  AWAITING = "awaiting",
  CAPTURED = "captured",
  PARTIALLY_REFUNDED = "partially_refunded",
  REFUNDED = "refunded",
  CANCELED = "canceled",
  REQUIRES_ACTION = "requires_action",
}

@Entity()
export class Order {
  @PrimaryColumn()
  id: string

  @Column({ type: "enum", enum: OrderStatus, default: "pending" })
  status: OrderStatus

  @Column({ type: "enum", enum: FulfillmentStatus, default: "not_fulfilled" })
  fulfillment_status: FulfillmentStatus

  @Column({ type: "enum", enum: PaymentStatus, default: "not_paid" })
  payment_status: PaymentStatus

  @Column()
  @Generated("increment")
  display_id: number

  @Column()
  cart_id: string

  @OneToOne(() => Cart)
  @JoinColumn({ name: "cart_id" })
  cart: Cart

  @Column()
  customer_id: string

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customer_id" })
  customer: Customer

  @Column()
  email: string

  @Column({ nullable: true })
  billing_address_id: string

  @ManyToOne(() => Address, { cascade: true })
  @JoinColumn({ name: "billing_address_id" })
  billing_address: Address

  @Column({ nullable: true })
  shipping_address_id: string

  @ManyToOne(() => Address, { cascade: true })
  @JoinColumn({ name: "shipping_address_id" })
  shipping_address: Address

  @Column()
  region_id: string

  @ManyToOne(() => Region)
  @JoinColumn({ name: "region_id" })
  region: Region

  @Column()
  currency_code: string

  @ManyToOne(() => Currency)
  @JoinColumn({ name: "currency_code", referencedColumnName: "code" })
  currency: Currency

  @Column({ type: "int" })
  tax_rate: number

  @ManyToMany(() => Discount)
  @JoinTable({
    name: "order_discounts",
    joinColumn: {
      name: "order_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "discount_id",
      referencedColumnName: "id",
    },
  })
  discounts: Discount

  @ManyToMany(() => GiftCard)
  @JoinTable({
    name: "order_gift_cards",
    joinColumn: {
      name: "order_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "gift_card_id",
      referencedColumnName: "id",
    },
  })
  gift_cards: GiftCard

  @OneToMany(
    () => ShippingMethod,
    method => method.order,
    { cascade: true }
  )
  shipping_methods: ShippingMethod[]

  @OneToMany(
    () => Payment,
    payment => payment.order,
    { cascade: true }
  )
  payments: Payment[]

  @OneToMany(
    () => Fulfillment,
    fulfillment => fulfillment.order,
    { cascade: true }
  )
  fulfillments: Fulfillment[]

  @OneToMany(
    () => Return,
    ret => ret.order,
    { cascade: true }
  )
  returns: Return[]

  @OneToMany(
    () => Refund,
    ref => ref.order,
    { cascade: true }
  )
  refunds: Refund[]

  @OneToMany(
    () => Swap,
    swap => swap.order,
    { cascade: true }
  )
  swaps: Swap[]

  @OneToMany(
    () => LineItem,
    lineItem => lineItem.order,
    { cascade: true }
  )
  items: LineItem[]

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

  // Total fields
  shipping_total: number
  discount_total: number
  tax_total: number
  refunded_total: number
  total: number
  subtotal: number
  refundable_amount: number

  @BeforeInsert()
  private beforeInsert() {
    const id = randomize("Aa0", 24)
    this.id = `order_${id}`
  }
}
