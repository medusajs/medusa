import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm"

import { BaseEntity } from "../interfaces/models/base-entity"
import { DbAwareColumn } from "../utils/db-aware-column"
import { generateEntityId } from "../utils/generate-entity-id"
import { Order } from "./order"
import { Payment } from "./payment"

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
  @Column({ nullable: true })
  order_id: string

  @Index()
  @Column({ nullable: true })
  payment_id: string

  @ManyToOne(() => Order, (order) => order.payments)
  @JoinColumn({ name: "order_id" })
  order: Order

  @OneToOne(() => Payment, { nullable: true })
  @JoinColumn({ name: "payment_id" })
  payment: Payment

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
 * @schema Refund
 * title: "Refund"
 * description: "Refund represent an amount of money transfered back to the Customer for a given reason. Refunds may occur in relation to Returns, Swaps and Claims, but can also be initiated by a store operator."
 * type: object
 * required:
 *   - amount
 *   - created_at
 *   - id
 *   - idempotency_key
 *   - metadata
 *   - note
 *   - order_id
 *   - payment_id
 *   - reason
 *   - updated_at
 * properties:
 *   id:
 *     description: The refund's ID
 *     type: string
 *     example: ref_01G1G5V27GYX4QXNARRQCW1N8T
 *   order_id:
 *     description: The id of the Order that the Refund is related to.
 *     nullable: true
 *     type: string
 *     example: order_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   order:
 *     description: An order object. Available if the relation `order` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/Order"
 *   payment_id:
 *     description: The payment's ID if available
 *     nullable: true
 *     type: string
 *     example: pay_01G8ZCC5W42ZNY842124G7P5R9
 *   payment:
 *     description: Available if the relation `payment` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/Payment"
 *   amount:
 *     description: The amount that has be refunded to the Customer.
 *     type: integer
 *     example: 1000
 *   note:
 *     description: An optional note explaining why the amount was refunded.
 *     nullable: true
 *     type: string
 *     example: I didn't like it
 *   reason:
 *     description: The reason given for the Refund, will automatically be set when processed as part of a Swap, Claim or Return.
 *     type: string
 *     enum:
 *       - discount
 *       - return
 *       - swap
 *       - claim
 *       - other
 *     example: return
 *   idempotency_key:
 *     description: Randomly generated key used to continue the completion of the refund in case of failure.
 *     nullable: true
 *     type: string
 *     externalDocs:
 *       url: https://docs.medusajs.com/modules/carts-and-checkout/cart.md#idempotency-key
 *       description: Learn more how to use the idempotency key.
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
 */
