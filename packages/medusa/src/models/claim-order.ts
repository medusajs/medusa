import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  Relation,
  UpdateDateColumn,
} from "typeorm"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"

import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"
import { Address } from "./address"
import { ClaimItem } from "./claim-item"
import { Fulfillment } from "./fulfillment"
import { LineItem } from "./line-item"
import { Order } from "./order"
import { Return } from "./return"
import { ShippingMethod } from "./shipping-method"

/**
 * @enum
 *
 * The claim's type.
 */
export enum ClaimType {
  /**
   * The claim refunds an amount to the customer.
   */
  REFUND = "refund",
  /**
   * The claim replaces the returned item with a new one.
   */
  REPLACE = "replace",
}

/**
 * @enum
 *
 * The claim's payment status
 */
export enum ClaimPaymentStatus {
  /**
   * The payment status isn't set, which is typically used when the claim's type is `replace`.
   */
  NA = "na",
  /**
   * The payment isn't refunded.
   */
  NOT_REFUNDED = "not_refunded",
  /**
   * The payment is refunded.
   */
  REFUNDED = "refunded",
}

/**
 * @enum
 *
 * The claim's fulfillment status.
 */
export enum ClaimFulfillmentStatus {
  /**
   * The claim's replacement items are not fulfilled.
   */
  NOT_FULFILLED = "not_fulfilled",
  /**
   * Some of the claim's replacement items, but not all, are fulfilled.
   */
  PARTIALLY_FULFILLED = "partially_fulfilled",
  /**
   * The claim's replacement items are fulfilled.
   */
  FULFILLED = "fulfilled",
  /**
   * Some of the claim's replacement items, but not all, are shipped.
   */
  PARTIALLY_SHIPPED = "partially_shipped",
  /**
   * The claim's replacement items are shipped.
   */
  SHIPPED = "shipped",
  /**
   * Some of the claim's items, but not all, are returned.
   */
  PARTIALLY_RETURNED = "partially_returned",
  /**
   * The claim's items are returned.
   */
  RETURNED = "returned",
  /**
   * The claim's fulfillments are canceled.
   */
  CANCELED = "canceled",
  /**
   * The claim's fulfillment requires action.
   */
  REQUIRES_ACTION = "requires_action",
}

@Entity()
export class ClaimOrder extends SoftDeletableEntity {
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

  @OneToMany(() => ClaimItem, (ci) => ci.claim_order)
  claim_items: Relation<ClaimItem>[]

  @OneToMany(() => LineItem, (li) => li.claim_order, { cascade: ["insert"] })
  additional_items: Relation<LineItem>[]

  @DbAwareColumn({ type: "enum", enum: ClaimType })
  type: Relation<ClaimType>

  @Index()
  @Column()
  order_id: string

  @ManyToOne(() => Order, (o) => o.claims)
  @JoinColumn({ name: "order_id" })
  order: Relation<Order>

  @OneToOne(() => Return, (ret) => ret.claim_order)
  return_order: Relation<Return>

  @Index()
  @Column({ nullable: true })
  shipping_address_id: string

  @ManyToOne(() => Address, { cascade: ["insert"] })
  @JoinColumn({ name: "shipping_address_id" })
  shipping_address: Relation<Address>

  @OneToMany(() => ShippingMethod, (method) => method.claim_order, {
    cascade: ["insert"],
  })
  shipping_methods: Relation<ShippingMethod>[]

  @OneToMany(() => Fulfillment, (fulfillment) => fulfillment.claim_order, {
    cascade: ["insert"],
  })
  fulfillments: Relation<Fulfillment>[]

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
  no_notification: boolean

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @Column({ nullable: true })
  idempotency_key: string

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "claim")
  }
}

/**
 * @schema ClaimOrder
 * title: "Claim"
 * description: "A Claim represents a group of faulty or missing items. It consists of claim items that refer to items in the original order that should be replaced or refunded. It also includes details related to shipping and fulfillment."
 * type: object
 * required:
 *   - canceled_at
 *   - created_at
 *   - deleted_at
 *   - fulfillment_status
 *   - id
 *   - idempotency_key
 *   - metadata
 *   - no_notification
 *   - order_id
 *   - payment_status
 *   - refund_amount
 *   - shipping_address_id
 *   - type
 *   - updated_at
 * properties:
 *   id:
 *     description: The claim's ID
 *     type: string
 *     example: claim_01G8ZH853Y6TFXWPG5EYE81X63
 *   type:
 *     description: The claim's type
 *     type: string
 *     enum:
 *       - refund
 *       - replace
 *   payment_status:
 *     description: The status of the claim's payment
 *     type: string
 *     enum:
 *       - na
 *       - not_refunded
 *       - refunded
 *     default: na
 *   fulfillment_status:
 *     description: The claim's fulfillment status
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
 *     default: not_fulfilled
 *   claim_items:
 *     description: The details of the items that should be replaced or refunded.
 *     type: array
 *     x-expandable: "claim_items"
 *     items:
 *       $ref: "#/components/schemas/ClaimItem"
 *   additional_items:
 *     description: The details of the new items to be shipped when the claim's type is `replace`
 *     type: array
 *     x-expandable: "additional_items"
 *     items:
 *       $ref: "#/components/schemas/LineItem"
 *   order_id:
 *     description: The ID of the order that the claim comes from.
 *     type: string
 *     example: order_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   order:
 *     description: The details of the order that this claim was created for.
 *     x-expandable: "order"
 *     nullable: true
 *     $ref: "#/components/schemas/Order"
 *   return_order:
 *     description: The details of the return associated with the claim if the claim's type is `replace`.
 *     x-expandable: "return_order"
 *     nullable: true
 *     $ref: "#/components/schemas/Return"
 *   shipping_address_id:
 *     description: The ID of the address that the new items should be shipped to
 *     nullable: true
 *     type: string
 *     example: addr_01G8ZH853YPY9B94857DY91YGW
 *   shipping_address:
 *     description: The details of the address that new items should be shipped to.
 *     x-expandable: "shipping_address"
 *     nullable: true
 *     $ref: "#/components/schemas/Address"
 *   shipping_methods:
 *     description: The details of the shipping methods that the claim order will be shipped with.
 *     type: array
 *     x-expandable: "shipping_methods"
 *     items:
 *       $ref: "#/components/schemas/ShippingMethod"
 *   fulfillments:
 *     description: The fulfillments of the new items to be shipped
 *     type: array
 *     x-expandable: "fulfillments"
 *     items:
 *       $ref: "#/components/schemas/Fulfillment"
 *   refund_amount:
 *     description: The amount that will be refunded in conjunction with the claim
 *     nullable: true
 *     type: integer
 *     example: 1000
 *   canceled_at:
 *     description: The date with timezone at which the claim was canceled.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: The date with timezone at which the resource was deleted.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: An optional key-value map with additional details
 *     nullable: true
 *     type: object
 *     example: {car: "white"}
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 *   no_notification:
 *     description: Flag for describing whether or not notifications related to this should be send.
 *     nullable: true
 *     type: boolean
 *     example: false
 *   idempotency_key:
 *     description: Randomly generated key used to continue the completion of the cart associated with the claim in case of failure.
 *     nullable: true
 *     type: string
 *     externalDocs:
 *       url: https://docs.medusajs.com/development/idempotency-key/overview.md
 *       description: Learn more how to use the idempotency key.
 */
