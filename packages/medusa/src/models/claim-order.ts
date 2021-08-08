import {
  Entity,
  BeforeInsert,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  PrimaryColumn,
  Index,
  OneToOne,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm"
import { ulid } from "ulid"
import { resolveDbType, DbAwareColumn } from "../utils/db-aware-column"

import { Fulfillment } from "./fulfillment"
import { LineItem } from "./line-item"
import { ClaimItem } from "./claim-item"
import { Order } from "./order"
import { Return } from "./return"
import { ShippingMethod } from "./shipping-method"
import { Address } from "./address"

export enum ClaimType {
  REFUND = "refund",
  REPLACE = "replace",
}

export enum ClaimPaymentStatus {
  NA = "na",
  NOT_REFUNDED = "not_refunded",
  REFUNDED = "refunded",
}

export enum ClaimFulfillmentStatus {
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

@Entity()
export class ClaimOrder {
  @PrimaryColumn()
  id: string

  @DbAwareColumn({
    type: "enum",
    enum: ClaimPaymentStatus,
    default: ClaimPaymentStatus.NA,
  })
  payment_status: ClaimPaymentStatus

  @DbAwareColumn({
    type: "enum",
    enum: ClaimFulfillmentStatus,
    default: ClaimFulfillmentStatus.NOT_FULFILLED,
  })
  fulfillment_status: ClaimFulfillmentStatus

  @OneToMany(
    () => ClaimItem,
    ci => ci.claim_order
  )
  claim_items: ClaimItem[]

  @OneToMany(
    () => LineItem,
    li => li.claim_order,
    { cascade: ["insert"] }
  )
  additional_items: LineItem[]

  @DbAwareColumn({ type: "enum", enum: ClaimType })
  type: ClaimType

  @Index()
  @Column()
  order_id: string

  @ManyToOne(
    () => Order,
    o => o.claims
  )
  @JoinColumn({ name: "order_id" })
  order: Order

  @OneToOne(
    () => Return,
    ret => ret.claim_order
  )
  return_order: Return

  @Index()
  @Column({ nullable: true })
  shipping_address_id: string

  @ManyToOne(() => Address, { cascade: ["insert"] })
  @JoinColumn({ name: "shipping_address_id" })
  shipping_address: Address

  @OneToMany(
    () => ShippingMethod,
    method => method.claim_order,
    { cascade: ["insert"] }
  )
  shipping_methods: ShippingMethod[]

  @OneToMany(
    () => Fulfillment,
    fulfillment => fulfillment.claim_order,
    { cascade: ["insert"] }
  )
  fulfillments: Fulfillment[]

  @Column({ type: "int", nullable: true })
  refund_amount: number

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  canceled_at: Date

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @DeleteDateColumn({ type: resolveDbType("timestamptz") })
  deleted_at: Date

  @Column({ type: "boolean", nullable: true })
  no_notification: Boolean

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: any

  @Column({ nullable: true })
  idempotency_key: string

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `claim_${id}`
  }
}

/**
 * @schema claim_order
 * title: "Claim Order"
 * description: "Claim Orders represent a group of faulty or missing items. Each claim order consists of a subset of items associated with an original order, and can contain additional information about fulfillments and returns."
 * x-resourceId: claim_order
 * properties:
 *   id:
 *     type: string
 *   type:
 *     type: string
 *     enum:
 *       - refund
 *       - replace
 *   payment_status:
 *     type: string
 *     enum:
 *       - na
 *       - not_refunded
 *       - refunded
 *   fulfillment_status:
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
 *   claim_items:
 *     description: "The items that have been claimed"
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/claim_item"
 *   additional_items:
 *     description: "Refers to the new items to be shipped when the claim order has the type `replace`"
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/line_item"
 *   order_id:
 *     description: "The id of the order that the claim comes from."
 *     type: string
 *   return_order:
 *     description: "Holds information about the return if the claim is to be returned"
 *     $ref: "#/components/schemas/return"
 *   shipping_address_id:
 *     description: "The id of the address that the new items should be shipped to"
 *     type: string
 *   shipping_address:
 *     description: "The address that the new items should be shipped to"
 *     $ref: "#/components/schemas/address"
 *   shipping_methods:
 *     description: "The shipping methods that the claim order will be shipped with."
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/shipping_method"
 *   fulfillments:
 *     description: "The fulfillments of the new items to be shipped"
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/fulfillment"
 *   refund_amount:
 *     description: "The amount that will be refunded in conjunction with the claim"
 *     type: integer
 *   created_at:
 *     type: string
 *     format: date-time
 *   updated_at:
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     format: date-time
 *   no_notification:
 *     description: "Flag for describing whether or not notifications related to this should be send."
 *     type: boolean
 *   metadata:
 *     type: object
 */
