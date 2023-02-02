import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"

import { BaseEntity } from "../interfaces/models/base-entity"
import { ClaimOrder } from "./claim-order"
import { Order } from "./order"
import { ReturnItem } from "./return-item"
import { ShippingMethod } from "./shipping-method"
import { Swap } from "./swap"
import { generateEntityId } from "../utils/generate-entity-id"

export enum ReturnStatus {
  REQUESTED = "requested",
  RECEIVED = "received",
  REQUIRES_ACTION = "requires_action",
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
    cascade: ["insert"],
  })
  items?: ReturnItem[]

  @Index()
  @Column({ nullable: true, type: "text" })
  swap_id: string | null

  @OneToOne(() => Swap, (swap) => swap.return_order)
  @JoinColumn({ name: "swap_id" })
  swap?: Swap | null

  @Index()
  @Column({ nullable: true, type: "text" })
  claim_order_id: string | null

  @OneToOne(() => ClaimOrder, (co) => co.return_order)
  @JoinColumn({ name: "claim_order_id" })
  claim_order?: ClaimOrder | null

  @Index()
  @Column({ nullable: true, type: "text" })
  order_id: string | null

  @ManyToOne(() => Order, (o) => o.returns)
  @JoinColumn({ name: "order_id" })
  order?: Order | null

  @OneToOne(() => ShippingMethod, (method) => method.return_order, {
    cascade: true,
  })
  shipping_method?: ShippingMethod | null

  @DbAwareColumn({ type: "jsonb", nullable: true })
  shipping_data: Record<string, unknown> | null

  @Index()
  @Column({ nullable: true, type: "text" })
  location_id: string | null

  @Column({ type: "int" })
  refund_amount: number

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  received_at: Date | null

  @Column({ type: "boolean", nullable: true })
  no_notification: boolean | null

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @Column({ nullable: true, type: "text" })
  idempotency_key: string | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "ret")
  }
}

/**
 * @schema Return
 * title: "Return"
 * description: "Return orders hold information about Line Items that a Customer wishes to send back, along with how the items will be returned. Returns can be used as part of a Swap."
 * type: object
 * required:
 *   - refund_amount
 * properties:
 *   id:
 *     type: string
 *     description: The return's ID
 *     example: ret_01F0YET7XPCMF8RZ0Y151NZV2V
 *   status:
 *     description: "Status of the Return."
 *     type: string
 *     enum:
 *       - requested
 *       - received
 *       - requires_action
 *       - canceled
 *     default: requested
 *   items:
 *     description: The Return Items that will be shipped back to the warehouse. Available if the relation `items` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/ReturnItem"
 *   swap_id:
 *     description: "The ID of the Swap that the Return is a part of."
 *     type: string
 *     example: null
 *   swap:
 *     description: A swap object. Available if the relation `swap` is expanded.
 *     type: object
 *   order_id:
 *     description: "The ID of the Order that the Return is made from."
 *     type: string
 *     example: order_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   order:
 *     description: An order object. Available if the relation `order` is expanded.
 *     type: object
 *   claim_order_id:
 *     description: "The ID of the Claim that the Return is a part of."
 *     type: string
 *     example: null
 *   claim_order:
 *     description: A claim order object. Available if the relation `claim_order` is expanded.
 *     type: object
 *   shipping_method:
 *     description: The Shipping Method that will be used to send the Return back. Can be null if the Customer facilitates the return shipment themselves. Available if the relation `shipping_method` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/ShippingMethod"
 *   shipping_data:
 *     description: "Data about the return shipment as provided by the Fulfilment Provider that handles the return shipment."
 *     type: object
 *     example: {}
 *   refund_amount:
 *     description: "The amount that should be refunded as a result of the return."
 *     type: integer
 *     example: 1000
 *   no_notification:
 *     description: "When set to true, no notification will be sent related to this return."
 *     type: boolean
 *     example: false
 *   idempotency_key:
 *     type: string
 *     description: Randomly generated key used to continue the completion of the return in case of failure.
 *     externalDocs:
 *       url: https://docs.medusajs.com/advanced/backend/payment/overview#idempotency-key
 *       description: Learn more how to use the idempotency key.
 *   received_at:
 *     description: "The date with timezone at which the return was received."
 *     type: string
 *     format: date-time
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 */
