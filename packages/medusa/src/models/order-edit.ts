import {
  AfterLoad,
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

import { BaseEntity } from "../interfaces"
import { generateEntityId } from "../utils"
import { resolveDbType } from "../utils/db-aware-column"

import { LineItem, Order, OrderItemChange, PaymentCollection } from "."

/**
 * @enum
 *
 * The order edit's status.
 */
export enum OrderEditStatus {
  /**
   * The order edit is confirmed.
   */
  CONFIRMED = "confirmed",
  /**
   * The order edit is declined.
   */
  DECLINED = "declined",
  /**
   * The order edit is requested.
   */
  REQUESTED = "requested",
  /**
   * The order edit is created.
   */
  CREATED = "created",
  /**
   * The order edit is canceled.
   */
  CANCELED = "canceled",
}

@Entity()
export class OrderEdit extends BaseEntity {
  @Index()
  @Column()
  order_id: string

  @ManyToOne(() => Order, (o) => o.edits)
  @JoinColumn({ name: "order_id" })
  order: Relation<Order>

  @OneToMany(() => OrderItemChange, (oic) => oic.order_edit, {
    cascade: true,
  })
  changes: Relation<OrderItemChange>[]

  @Column({ nullable: true })
  internal_note?: string

  @Column()
  created_by: string // customer, user, third party, etc.

  @Column({ nullable: true })
  requested_by?: string // customer or user ID

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  requested_at?: Date

  @Column({ nullable: true })
  confirmed_by?: string // customer or user ID

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  confirmed_at?: Date

  @Column({ nullable: true })
  declined_by?: string // customer or user ID

  @Column({ nullable: true })
  declined_reason?: string

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  declined_at?: Date

  @Column({ nullable: true })
  canceled_by?: string

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  canceled_at?: Date

  @OneToMany(() => LineItem, (lineItem) => lineItem.order_edit)
  items: Relation<LineItem>[]

  @Index()
  @Column({ nullable: true })
  payment_collection_id: string

  @OneToOne(() => PaymentCollection)
  @JoinColumn({ name: "payment_collection_id" })
  payment_collection: PaymentCollection

  // Computed
  shipping_total: number
  discount_total: number
  tax_total: number | null
  total: number
  subtotal: number
  gift_card_total: number
  gift_card_tax_total: number

  difference_due: number

  status: OrderEditStatus

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "oe")
  }

  /**
   * @apiIgnore
   */
  @AfterLoad()
  loadStatus(): void {
    if (this.requested_at) {
      this.status = OrderEditStatus.REQUESTED
    }
    if (this.declined_at) {
      this.status = OrderEditStatus.DECLINED
    }
    if (this.confirmed_at) {
      this.status = OrderEditStatus.CONFIRMED
    }
    if (this.canceled_at) {
      this.status = OrderEditStatus.CANCELED
    }

    this.status = this.status ?? OrderEditStatus.CREATED
  }
}

/**
 * @schema OrderEdit
 * title: "Order Edit"
 * description: "Order edit allows modifying items in an order, such as adding, updating, or deleting items from the original order. Once the order edit is confirmed, the changes are reflected on the original order."
 * type: object
 * required:
 *   - canceled_at
 *   - canceled_by
 *   - confirmed_by
 *   - confirmed_at
 *   - created_at
 *   - created_by
 *   - declined_at
 *   - declined_by
 *   - declined_reason
 *   - id
 *   - internal_note
 *   - order_id
 *   - payment_collection_id
 *   - requested_at
 *   - requested_by
 *   - status
 *   - updated_at
 * properties:
 *   id:
 *     description: The order edit's ID
 *     type: string
 *     example: oe_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   order_id:
 *     description: The ID of the order that is edited
 *     type: string
 *     example: order_01G2SG30J8C85S4A5CHM2S1NS2
 *   order:
 *     description: The details of the order that this order edit was created for.
 *     x-expandable: "order"
 *     nullable: true
 *     $ref: "#/components/schemas/Order"
 *   changes:
 *     description: The details of all the changes on the original order's line items.
 *     x-expandable: "changes"
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/OrderItemChange"
 *   internal_note:
 *     description: An optional note with additional details about the order edit.
 *     nullable: true
 *     type: string
 *     example: Included two more items B to the order.
 *   created_by:
 *     description: The unique identifier of the user or customer who created the order edit.
 *     type: string
 *   requested_by:
 *     description: The unique identifier of the user or customer who requested the order edit.
 *     nullable: true
 *     type: string
 *   requested_at:
 *     description: The date with timezone at which the edit was requested.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   confirmed_by:
 *     description: The unique identifier of the user or customer who confirmed the order edit.
 *     nullable: true
 *     type: string
 *   confirmed_at:
 *     description: The date with timezone at which the edit was confirmed.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   declined_by:
 *     description: The unique identifier of the user or customer who declined the order edit.
 *     nullable: true
 *     type: string
 *   declined_at:
 *     description: The date with timezone at which the edit was declined.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   declined_reason:
 *     description: An optional note why  the order edit is declined.
 *     nullable: true
 *     type: string
 *   canceled_by:
 *     description: The unique identifier of the user or customer who cancelled the order edit.
 *     nullable: true
 *     type: string
 *   canceled_at:
 *     description: The date with timezone at which the edit was cancelled.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   subtotal:
 *     description: The total of subtotal
 *     type: integer
 *     example: 8000
 *   discount_total:
 *     description: The total of discount
 *     type: integer
 *     example: 800
 *   shipping_total:
 *     description: The total of the shipping amount
 *     type: integer
 *     example: 800
 *   gift_card_total:
 *     description: The total of the gift card amount
 *     type: integer
 *     example: 800
 *   gift_card_tax_total:
 *     description: The total of the gift card tax amount
 *     type: integer
 *     example: 800
 *   tax_total:
 *     description: The total of tax
 *     type: integer
 *     example: 0
 *   total:
 *     description: The total amount of the edited order.
 *     type: integer
 *     example: 8200
 *   difference_due:
 *     description: The difference between the total amount of the order and total amount of edited order.
 *     type: integer
 *     example: 8200
 *   status:
 *     description: The status of the order edit.
 *     type: string
 *     enum:
 *       - confirmed
 *       - declined
 *       - requested
 *       - created
 *       - canceled
 *   items:
 *     description: The details of the cloned items from the original order with the new changes. Once the order edit is confirmed, these line items are associated with the original order.
 *     type: array
 *     x-expandable: "items"
 *     items:
 *       $ref: "#/components/schemas/LineItem"
 *   payment_collection_id:
 *     description: The ID of the payment collection
 *     nullable: true
 *     type: string
 *     example: paycol_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   payment_collection:
 *     description: The details of the payment collection used to authorize additional payment if necessary.
 *     x-expandable: "payment_collection"
 *     nullable: true
 *     $ref: "#/components/schemas/PaymentCollection"
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 */
