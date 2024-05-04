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

import { BaseEntity } from "../interfaces/models/base-entity"
import { generateEntityId } from "../utils/generate-entity-id"
import { ClaimOrder } from "./claim-order"
import { Order } from "./order"
import { ReturnItem } from "./return-item"
import { ShippingMethod } from "./shipping-method"
import { Swap } from "./swap"

/**
 * @enum
 *
 * The return's status.
 */
export enum ReturnStatus {
  /**
   * The return is requested.
   */
  REQUESTED = "requested",
  /**
   * The return is received.
   */
  RECEIVED = "received",
  /**
   * The return is awaiting action.
   */
  REQUIRES_ACTION = "requires_action",
  /**
   * The return is canceled.
   */
  CANCELED = "canceled",
}

@Entity()
export class Return extends BaseEntity {
  @DbAwareColumn({
    type: "enum",
    enum: ReturnStatus,
    default: ReturnStatus.REQUESTED,
  })
  status: ReturnStatus

  @OneToMany(() => ReturnItem, (item) => item.return_order, {
    eager: true,
    cascade: ["insert", "update"],
  })
  items: Relation<ReturnItem>[]

  @Index()
  @Column({ nullable: true, type: "text" })
  swap_id: string | null

  @OneToOne(() => Swap, (swap) => swap.return_order)
  @JoinColumn({ name: "swap_id" })
  swap: Relation<Swap>

  @Index()
  @Column({ nullable: true, type: "text" })
  claim_order_id: string | null

  @OneToOne(() => ClaimOrder, (co) => co.return_order)
  @JoinColumn({ name: "claim_order_id" })
  claim_order: Relation<ClaimOrder>

  @Index()
  @Column({ nullable: true, type: "text" })
  order_id: string | null

  @ManyToOne(() => Order, (o) => o.returns)
  @JoinColumn({ name: "order_id" })
  order: Relation<Order>

  @OneToOne(() => ShippingMethod, (method) => method.return_order, {
    cascade: true,
  })
  shipping_method: Relation<ShippingMethod>

  @Index()
  @Column({ nullable: true, type: "text" })
  location_id: string | null

  @DbAwareColumn({ type: "jsonb", nullable: true })
  shipping_data: Record<string, unknown>

  @Column({ type: "int" })
  refund_amount: number

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  received_at: Date

  @Column({ type: "boolean", nullable: true })
  no_notification: boolean | null

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @Column({ nullable: true, type: "text" })
  idempotency_key: string | null

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "ret")
  }
}

/**
 * @schema Return
 * title: "Return"
 * description: "A Return holds information about Line Items that a Customer wishes to send back, along with how the items will be returned. Returns can also be used as part of a Swap or a Claim."
 * type: object
 * required:
 *   - claim_order_id
 *   - created_at
 *   - id
 *   - idempotency_key
 *   - location_id
 *   - metadata
 *   - no_notification
 *   - order_id
 *   - received_at
 *   - refund_amount
 *   - shipping_data
 *   - status
 *   - swap_id
 *   - updated_at
 * properties:
 *   id:
 *     description: The return's ID
 *     type: string
 *     example: ret_01F0YET7XPCMF8RZ0Y151NZV2V
 *   status:
 *     description: Status of the Return.
 *     type: string
 *     enum:
 *       - requested
 *       - received
 *       - requires_action
 *       - canceled
 *     default: requested
 *   items:
 *     description: The details of the items that the customer is returning.
 *     type: array
 *     x-expandable: "items"
 *     items:
 *       $ref: "#/components/schemas/ReturnItem"
 *   swap_id:
 *     description: The ID of the swap that the return may belong to.
 *     nullable: true
 *     type: string
 *     example: null
 *   swap:
 *     description: The details of the swap that the return may belong to.
 *     x-expandable: "swap"
 *     nullable: true
 *     $ref: "#/components/schemas/Swap"
 *   claim_order_id:
 *     description: The ID of the claim that the return may belong to.
 *     nullable: true
 *     type: string
 *     example: null
 *   claim_order:
 *     description: The details of the claim that the return may belong to.
 *     x-expandable: "claim_order"
 *     nullable: true
 *     $ref: "#/components/schemas/ClaimOrder"
 *   order_id:
 *     description: The ID of the order that the return was created for.
 *     nullable: true
 *     type: string
 *     example: order_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   order:
 *     description: The details of the order that the return was created for.
 *     x-expandable: "order"
 *     nullable: true
 *     $ref: "#/components/schemas/Order"
 *   shipping_method:
 *     description: The details of the Shipping Method that will be used to send the Return back. Can be null if the Customer will handle the return shipment themselves.
 *     x-expandable: "shipping_method"
 *     nullable: true
 *     $ref: "#/components/schemas/ShippingMethod"
 *   shipping_data:
 *     description: Data about the return shipment as provided by the Fulfilment Provider that handles the return shipment.
 *     nullable: true
 *     type: object
 *     example: {}
 *   location_id:
 *     description: The ID of the stock location the return will be added back.
 *     nullable: true
 *     type: string
 *     example: sloc_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   refund_amount:
 *     description: The amount that should be refunded as a result of the return.
 *     type: integer
 *     example: 1000
 *   no_notification:
 *     description: When set to true, no notification will be sent related to this return.
 *     nullable: true
 *     type: boolean
 *     example: false
 *   idempotency_key:
 *     description: Randomly generated key used to continue the completion of the return in case of failure.
 *     nullable: true
 *     type: string
 *     externalDocs:
 *       url: https://docs.medusajs.com/development/idempotency-key/overview.md
 *       description: Learn more how to use the idempotency key.
 *   received_at:
 *     description: The date with timezone at which the return was received.
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
 *   metadata:
 *     description: An optional key-value map with additional details
 *     nullable: true
 *     type: object
 *     example: {car: "white"}
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 */
