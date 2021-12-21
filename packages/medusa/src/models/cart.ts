/**
 * @schema cart
 * title: "Cart"
 * description: "Represents a user cart"
 * x-resourceId: cart
 * properties:
 *   id:
 *     type: string
 *   email:
 *     type: string
 *   billing_address_id:
 *     type: string
 *   billing_address:
 *     $ref: "#/components/schemas/address"
 *   shipping_address_id:
 *     type: string
 *   shipping_address:
 *     $ref: "#/components/schemas/address"
 *   items:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/line_item"
 *   region_id:
 *     type: string
 *   region:
 *     $ref: "#/components/schemas/region"
 *   discounts:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/region"
 *   gift_cards:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/gift_card"
 *   customer_id:
 *     type: string
 *   customer:
 *     $ref: "#/components/schemas/customer"
 *   payment_session:
 *     $ref: "#/components/schemas/payment_session"
 *   payment_sessions:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/payment_session"
 *   payment:
 *     $ref: "#/components/schemas/payment"
 *   shipping_methods:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/shipping_method"
 *   type:
 *     type: string
 *     enum:
 *       - default
 *       - swap
 *       - payment_link
 *   completed_at:
 *     type: string
 *     format: date-time
 *   created_at:
 *     type: string
 *     format: date-time
 *   updated_at:
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     format: date-time
 *   metadata:
 *     type: object
 *   shipping_total:
 *     type: integer
 *   discount_total:
 *     type: integer
 *   tax_total:
 *     type: integer
 *   subtotal:
 *     type: integer
 *   refundable_amount:
 *     type: integer
 *   gift_card_total:
 *     type: integer
 */

import {
  AfterLoad,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm"
import { ulid } from "ulid"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"
import { Address } from "./address"
import { Customer } from "./customer"
import { Discount } from "./discount"
import { GiftCard } from "./gift-card"
import { LineItem } from "./line-item"
import { Payment } from "./payment"
import { PaymentSession } from "./payment-session"
import { Region } from "./region"
import { ShippingMethod } from "./shipping-method"

export enum CartType {
  DEFAULT = "default",
  SWAP = "swap",
  DRAFT_ORDER = "draft_order",
  PAYMENT_LINK = "payment_link",
  CLAIM = "claim",
}

@Entity()
export class Cart {
  @PrimaryColumn()
  id: string

  readonly object = "cart"

  @Column({ nullable: true })
  email: string

  @Index()
  @Column({ nullable: true })
  billing_address_id: string

  @ManyToOne(() => Address, {
    cascade: ["insert", "remove", "soft-remove"],
  })
  @JoinColumn({ name: "billing_address_id" })
  billing_address: Address

  @Index()
  @Column({ nullable: true })
  shipping_address_id: string

  @ManyToOne(() => Address, {
    cascade: ["insert", "remove", "soft-remove"],
  })
  @JoinColumn({ name: "shipping_address_id" })
  shipping_address: Address | null

  @OneToMany(() => LineItem, (lineItem) => lineItem.cart, {
    cascade: ["insert", "remove"],
  })
  items: LineItem[]

  @Index()
  @Column()
  region_id: string

  @ManyToOne(() => Region)
  @JoinColumn({ name: "region_id" })
  region: Region

  @ManyToMany(() => Discount)
  @JoinTable({
    name: "cart_discounts",
    joinColumn: {
      name: "cart_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "discount_id",
      referencedColumnName: "id",
    },
  })
  discounts: Discount[]

  @ManyToMany(() => GiftCard)
  @JoinTable({
    name: "cart_gift_cards",
    joinColumn: {
      name: "cart_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "gift_card_id",
      referencedColumnName: "id",
    },
  })
  gift_cards: GiftCard[]

  @Index()
  @Column({ nullable: true })
  customer_id: string

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customer_id" })
  customer: Customer

  payment_session: PaymentSession | null

  @OneToMany(() => PaymentSession, (paymentSession) => paymentSession.cart, {
    cascade: true,
  })
  payment_sessions: PaymentSession[]

  @Index()
  @Column({ nullable: true })
  payment_id: string

  @OneToOne(() => Payment)
  @JoinColumn({ name: "payment_id" })
  payment: Payment

  @OneToMany(() => ShippingMethod, (method) => method.cart, {
    cascade: ["soft-remove", "remove"],
  })
  shipping_methods: ShippingMethod[]

  @DbAwareColumn({ type: "enum", enum: CartType, default: "default" })
  type: CartType

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  completed_at: Date

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  payment_authorized_at: Date

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @DeleteDateColumn({ type: resolveDbType("timestamptz") })
  deleted_at: Date

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: any

  @Column({ nullable: true })
  idempotency_key: string

  @DbAwareColumn({ type: "jsonb", nullable: true })
  context: any

  shipping_total?: number
  discount_total?: number
  tax_total?: number | null
  refunded_total?: number
  total?: number
  subtotal?: number
  refundable_amount?: number
  gift_card_total?: number

  @BeforeInsert()
  private beforeInsert(): undefined | void {
    if (this.id) {
      return
    }
    const id = ulid()
    this.id = `cart_${id}`
  }

  @AfterLoad()
  private afterLoad(): void {
    if (this.payment_sessions) {
      this.payment_session = this.payment_sessions.find((p) => p.is_selected)!
    }
  }
}
