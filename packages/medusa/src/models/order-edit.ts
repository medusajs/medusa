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
} from "typeorm"

import { BaseEntity } from "../interfaces"
import { generateEntityId } from "../utils"
import { resolveDbType } from "../utils/db-aware-column"

import { LineItem, Order, OrderItemChange, PaymentCollection } from "."

export enum OrderEditStatus {
  CONFIRMED = "confirmed",
  DECLINED = "declined",
  REQUESTED = "requested",
  CREATED = "created",
  CANCELED = "canceled",
}

@Entity()
export class OrderEdit extends BaseEntity {
  @Index()
  @Column()
  order_id: string

  @ManyToOne(() => Order, (o) => o.edits)
  @JoinColumn({ name: "order_id" })
  order: Order

  @OneToMany(() => OrderItemChange, (oic) => oic.order_edit, {
    cascade: true,
  })
  changes: OrderItemChange[]

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
  items: LineItem[]

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

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "oe")
  }

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
 * description: "Order edit keeps track of order items changes."
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
 *     description: Available if the relation `order` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/Order"
 *   changes:
 *     description: Available if the relation `changes` is expanded.
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
 *     description: Available if the relation `items` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/LineItem"
 *   payment_collection_id:
 *     description: The ID of the payment collection
 *     nullable: true
 *     type: string
 *     example: paycol_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   payment_collection:
 *     description: Available if the relation `payment_collection` is expanded.
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
