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
import { resolveDbType, DbAwareColumn } from "../utils/db-aware-column"

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
  CONFIRMED = "confirmed",
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

  @DbAwareColumn({ type: "enum", enum: FulfillmentStatus })
  fulfillment_status: FulfillmentStatus

  @DbAwareColumn({ type: "enum", enum: PaymentStatus })
  payment_status: PaymentStatus

  @Index()
  @Column({ type: "string" })
  order_id: string

  @ManyToOne(
    () => Order,
    (o) => o.swaps
  )
  @JoinColumn({ name: "order_id" })
  order: Order

  @OneToMany(
    () => LineItem,
    (item) => item.swap,
    { cascade: ["insert"] }
  )
  additional_items: LineItem[]

  @OneToOne(
    () => Return,
    (ret) => ret.swap,
    { cascade: ["insert"] }
  )
  return_order: Return

  @OneToMany(
    () => Fulfillment,
    (fulfillment) => fulfillment.swap,
    { cascade: ["insert"] }
  )
  fulfillments: Fulfillment[]

  @OneToOne(
    () => Payment,
    (p) => p.swap,
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
    (method) => method.swap,
    { cascade: ["insert"] }
  )
  shipping_methods: ShippingMethod[]

  @Column({ nullable: true })
  cart_id: string

  @OneToOne(() => Cart)
  @JoinColumn({ name: "cart_id" })
  cart: Cart

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  confirmed_at: Date

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @DeleteDateColumn({ type: resolveDbType("timestamptz") })
  deleted_at: Date

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  canceled_at: Date

  @Column({ type: "boolean", nullable: true })
  no_notification: Boolean

  @Column({ type: "boolean", default: false })
  allow_backorder: Boolean

  @DbAwareColumn({ type: "jsonb", nullable: true })
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

/**
 * @schema swap
 * title: "Swap"
 * description: "Swaps can be created when a Customer wishes to exchange Products that they have purchased to different Products. Swaps consist of a Return of previously purchased Products and a Fulfillment of new Products, the amount paid for the Products being returned will be used towards payment for the new Products. In the case where the amount paid for the the Products being returned exceed the amount to be paid for the new Products, a Refund will be issued for the difference."
 * x-resourceId: swap
 * properties:
 *   id:
 *     description: "The id of the Swap. This value will be prefixed with `swap_`."
 *     type: string
 *   fulfillment_status:
 *     description: "The status of the Fulfillment of the Swap."
 *     type: string
 *     enum:
 *       - not_fulfilled
 *       - partially_fulfilled
 *       - fulfilled
 *       - partially_shipped
 *       - shipped
 *       - partially_returned
 *       - returned
 *       - canceled
 *       - requires_action
 *   payment_status:
 *     description: "The status of the Payment of the Swap. The payment may either refer to the refund of an amount or the authorization of a new amount."
 *     type: string
 *     enum:
 *       - not_paid
 *       - awaiting
 *       - captured
 *       - canceled
 *       - difference_refunded
 *       - requires_action
 *   order_id:
 *     description: "The id of the Order where the Line Items to be returned where purchased."
 *     type: string
 *   additional_items:
 *     description: "The new Line Items to ship to the Customer."
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/line_item"
 *   return_order:
 *     description: "The Return that is issued for the return part of the Swap."
 *     anyOf:
 *       - $ref: "#/components/schemas/return"
 *   fulfillments:
 *     description: "The Fulfillments used to send the new Line Items."
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/fulfillment"
 *   payment:
 *     description: "The Payment authorized when the Swap requires an additional amount to be charged from the Customer."
 *     anyOf:
 *       - $ref: "#/components/schemas/payment"
 *   difference_due:
 *     description: "The difference that is paid or refunded as a result of the Swap. May be negative when the amount paid for the returned items exceed the total of the new Products."
 *     type: integer
 *   shipping_address:
 *     description: "The Address to send the new Line Items to - in most cases this will be the same as the shipping address on the Order."
 *     anyOf:
 *       - $ref: "#/components/schemas/address"
 *   shipping_methods:
 *     description: "The Shipping Methods used to fulfill the addtional items purchased."
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/shipping_method"
 *   cart_id:
 *     description: "The id of the Cart that the Customer will use to confirm the Swap."
 *     type: string
 *   allow_backorder:
 *     description: "If true, swaps can be completed with items out of stock"
 *     type: boolean
 *   confirmed_at:
 *     description: "The date with timezone at which the Swap was confirmed by the Customer."
 *     type: string
 *     format: date-time
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: "The date with timezone at which the resource was last updated."
 *     type: string
 *     format: date-time
 *   canceled_at:
 *     description: "The date with timezone at which the Swap was canceled."
 *     type: string
 *     format: date-time
 *   no_notification:
 *     description: "If set to true, no notification will be sent related to this swap"
 *     type: boolean
 *   metadata:
 *     description: "An optional key-value map with additional information."
 *     type: object
 */
