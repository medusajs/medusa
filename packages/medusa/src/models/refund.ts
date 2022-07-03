import {
  Entity,
  BeforeInsert,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { BaseEntity } from "../interfaces/models/base-entity"
import { DbAwareColumn } from "../utils/db-aware-column"

import { Order } from "./order"
import { generateEntityId } from "../utils/generate-entity-id"

export enum RefundReason {
  DISCOUNT = "discount",
  RETURN = "return",
  SWAP = "swap",
  CLAIM = "claim",
  OTHER = "other",
}

@Entity()
export class Refund extends BaseEntity {
  @Index()
  @Column()
  order_id: string

  @ManyToOne(() => Order, (order) => order.payments)
  @JoinColumn({ name: "order_id" })
  order: Order

  @Column({ type: "int" })
  amount: number

  @Column({ nullable: true })
  note: string

  @DbAwareColumn({ type: "enum", enum: RefundReason })
  reason: string

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @Column({ nullable: true })
  idempotency_key: string

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "ref")
  }
}

/**
 * @schema refund
 * title: "Refund"
 * description: "Refund represent an amount of money transfered back to the Customer for a given reason. Refunds may occur in relation to Returns, Swaps and Claims, but can also be initiated by a store operator."
 * x-resourceId: refund
 * properties:
 *   id:
 *     description: "The id of the Refund. This value will be prefixed with `ref_`."
 *     type: string
 *   order_id:
 *     description: "The id of the Order that the Refund is related to."
 *     type: string
 *   amount:
 *     description: "The amount that has be refunded to the Customer."
 *     type: integer
 *   note:
 *     description: "An optional note explaining why the amount was refunded."
 *     type: string
 *   reason:
 *     description: "The reason given for the Refund, will automatically be set when processed as part of a Swap, Claim or Return."
 *     type: string
 *     enum:
 *       - discount
 *       - return
 *       - swap
 *       - claim
 *       - other
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: "The date with timezone at which the resource was last updated."
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: "An optional key-value map with additional information."
 *     type: object
 */
