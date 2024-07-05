import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  Relation,
} from "typeorm"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"

import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"
import { Address } from "./address"
import { Cart } from "./cart"
import { Fulfillment } from "./fulfillment"
import { LineItem } from "./line-item"
import { Order } from "./order"
import { Payment } from "./payment"
import { Return } from "./return"
import { ShippingMethod } from "./shipping-method"

/**
 * @enum
 *
 * The swap's fulfillment status.
 */
export enum SwapFulfillmentStatus {
  /**
   * The swap's items aren't fulfilled.
   */
  NOT_FULFILLED = "not_fulfilled",
  /**
   * The swap's items are fulfilled.
   */
  FULFILLED = "fulfilled",
  /**
   * The swap's items are shipped.
   */
  SHIPPED = "shipped",
  /**
   * Some of the swap's items are shipped.
   */
  PARTIALLY_SHIPPED = "partially_shipped",
  /**
   * The swap's fulfillments are canceled.
   */
  CANCELED = "canceled",
  /**
   * The swap's fulfillments require an action.
   */
  REQUIRES_ACTION = "requires_action",
}

/**
 * @enum
 *
 * The swap's payment status.
 */
export enum SwapPaymentStatus {
  /**
   * The swap's additional payment isn't paid.
   */
  NOT_PAID = "not_paid",
  /**
   * The swap is additional awaiting payment.
   */
  AWAITING = "awaiting",
  /**
   * The swap's additional payment is captured.
   */
  CAPTURED = "captured",
  /**
   * The swap's additional payment is confirmed.
   */
  CONFIRMED = "confirmed",
  /**
   * The swap's additional payment is canceled.
   */
  CANCELED = "canceled",
  /**
   * The negative difference amount between the returned item(s) and the new one(s) has been refuneded.
   */
  DIFFERENCE_REFUNDED = "difference_refunded",
  /**
   * Some of the negative difference amount between the returned item(s) and the new one(s) has been refuneded.
   */
  PARTIALLY_REFUNDED = "partially_refunded",
  /**
   * The amount in the associated order has been refunded.
   */
  REFUNDED = "refunded",
  /**
   * The swap's payment requires an action.
   */
  REQUIRES_ACTION = "requires_action",
}

@Entity()
export class Swap extends SoftDeletableEntity {
  @DbAwareColumn({ type: "enum", enum: SwapFulfillmentStatus })
  fulfillment_status: SwapFulfillmentStatus

  @DbAwareColumn({ type: "enum", enum: SwapPaymentStatus })
  payment_status: SwapPaymentStatus

  @Index()
  @Column({ type: "string" })
  order_id: string

  @ManyToOne(() => Order, (o) => o.swaps)
  @JoinColumn({ name: "order_id" })
  order: Relation<Order>

  @OneToMany(() => LineItem, (item) => item.swap, { cascade: ["insert"] })
  additional_items: Relation<LineItem>[]

  @OneToOne(() => Return, (ret) => ret.swap, { cascade: ["insert"] })
  return_order: Relation<Return>

  @OneToMany(() => Fulfillment, (fulfillment) => fulfillment.swap, {
    cascade: ["insert"],
  })
  fulfillments: Relation<Fulfillment>[]

  @OneToOne(() => Payment, (p) => p.swap, { cascade: ["insert"] })
  payment: Relation<Payment>

  @Column({ type: "int", nullable: true })
  difference_due: number

  @Column({ nullable: true })
  shipping_address_id: string

  @ManyToOne(() => Address, { cascade: ["insert"] })
  @JoinColumn({ name: "shipping_address_id" })
  shipping_address: Relation<Address>

  @OneToMany(() => ShippingMethod, (method) => method.swap, {
    cascade: ["insert"],
  })
  shipping_methods: Relation<ShippingMethod>[]

  @Column({ nullable: true })
  cart_id: string

  @OneToOne(() => Cart)
  @JoinColumn({ name: "cart_id" })
  cart: Relation<Cart>

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  confirmed_at: Date

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  canceled_at: Date

  @Column({ type: "boolean", nullable: true })
  no_notification: boolean

  @Column({ type: "boolean", default: false })
  allow_backorder: boolean

  @Column({ nullable: true })
  idempotency_key: string

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "swap")
  }
}

/**
 * @schema Swap
 * title: "Swap"
 * description: "A swap can be created when a Customer wishes to exchange Products that they have purchased with different Products. It consists of a Return of previously purchased Products and a Fulfillment of new Products. It also includes information on any additional payment or refund required based on the difference between the exchanged products."
 * type: object
 * required:
 *   - allow_backorder
 *   - canceled_at
 *   - cart_id
 *   - confirmed_at
 *   - created_at
 *   - deleted_at
 *   - difference_due
 *   - fulfillment_status
 *   - id
 *   - idempotency_key
 *   - metadata
 *   - no_notification
 *   - order_id
 *   - payment_status
 *   - shipping_address_id
 *   - updated_at
 * properties:
 *   id:
 *     description: The swap's ID
 *     type: string
 *     example: swap_01F0YET86Y9G92D3YDR9Y6V676
 *   fulfillment_status:
 *     description: The status of the Fulfillment of the Swap.
 *     type: string
 *     enum:
 *       - not_fulfilled
 *       - fulfilled
 *       - shipped
 *       - partially_shipped
 *       - canceled
 *       - requires_action
 *     example: not_fulfilled
 *   payment_status:
 *     description: The status of the Payment of the Swap. The payment may either refer to the refund of an amount or the authorization of a new amount.
 *     type: string
 *     enum:
 *       - not_paid
 *       - awaiting
 *       - captured
 *       - confirmed
 *       - canceled
 *       - difference_refunded
 *       - partially_refunded
 *       - refunded
 *       - requires_action
 *     example: not_paid
 *   order_id:
 *     description: The ID of the order that the swap belongs to.
 *     type: string
 *     example: order_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   order:
 *     description: The details of the order that the swap belongs to.
 *     x-expandable: "order"
 *     nullable: true
 *     $ref: "#/components/schemas/Order"
 *   additional_items:
 *     description: The details of the new products to send to the customer, represented as line items.
 *     type: array
 *     x-expandable: "additional_items"
 *     items:
 *       $ref: "#/components/schemas/LineItem"
 *   return_order:
 *     description: The details of the return that belongs to the swap, which holds the details on the items being returned.
 *     x-expandable: "return_order"
 *     nullable: true
 *     $ref: "#/components/schemas/Return"
 *   fulfillments:
 *     description: The details of the fulfillments that are used to send the new items to the customer.
 *     x-expandable: "fulfillments"
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/Fulfillment"
 *   payment:
 *     description: The details of the additional payment authorized by the customer when `difference_due` is positive.
 *     x-expandable: "payment"
 *     nullable: true
 *     $ref: "#/components/schemas/Payment"
 *   difference_due:
 *     description: The difference amount between the order’s original total and the new total imposed by the swap. If its value is negative, a refund must be issues to the customer. If it's positive, additional payment must be authorized by the customer. Otherwise, no payment processing is required.
 *     nullable: true
 *     type: integer
 *     example: 0
 *   shipping_address_id:
 *     description: The Address to send the new Line Items to - in most cases this will be the same as the shipping address on the Order.
 *     nullable: true
 *     type: string
 *     example: addr_01G8ZH853YPY9B94857DY91YGW
 *   shipping_address:
 *     description: The details of the shipping address that the new items should be sent to.
 *     x-expandable: "shipping_address"
 *     nullable: true
 *     $ref: "#/components/schemas/Address"
 *   shipping_methods:
 *     description: The details of the shipping methods used to fulfill the additional items purchased.
 *     type: array
 *     x-expandable: "shipping_methods"
 *     items:
 *       $ref: "#/components/schemas/ShippingMethod"
 *   cart_id:
 *     description: The ID of the cart that the customer uses to complete the swap.
 *     nullable: true
 *     type: string
 *     example: cart_01G8ZH853Y6TFXWPG5EYE81X63
 *   cart:
 *     description: The details of the cart that the customer uses to complete the swap.
 *     x-expandable: "cart"
 *     nullable: true
 *     $ref: "#/components/schemas/Cart"
 *   confirmed_at:
 *     description: The date with timezone at which the Swap was confirmed by the Customer.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   canceled_at:
 *     description: The date with timezone at which the Swap was canceled.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   no_notification:
 *     description: If set to true, no notification will be sent related to this swap
 *     nullable: true
 *     type: boolean
 *     example: false
 *   allow_backorder:
 *     description: If true, swaps can be completed with items out of stock
 *     type: boolean
 *     default: false
 *   idempotency_key:
 *     description: Randomly generated key used to continue the completion of the swap in case of failure.
 *     nullable: true
 *     type: string
 *     externalDocs:
 *       url: https://docs.medusajs.com/development/idempotency-key/overview.md
 *       description: Learn more how to use the idempotency key.
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
 */
