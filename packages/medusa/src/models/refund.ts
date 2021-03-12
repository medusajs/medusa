import {
  Entity,
  BeforeInsert,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { ulid } from "ulid"

import { Currency } from "./currency"
import { Cart } from "./cart"
import { Order } from "./order"

export enum RefundReason {
  DISCOUNT = "discount",
  RETURN = "return",
  SWAP = "swap",
  CLAIM = "claim",
  OTHER = "other",
}

@Entity()
export class Refund {
  @PrimaryColumn()
  id: string

  @Index()
  @Column()
  order_id: string

  @ManyToOne(
    () => Order,
    order => order.payments
  )
  @JoinColumn({ name: "order_id" })
  order: Order

  @Column({ type: "int" })
  amount: number

  @Column({ nullable: true })
  note: string

  @Column({ type: "enum", enum: RefundReason })
  reason: string

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  @Column({ nullable: true })
  idempotency_key: string

  @BeforeInsert()
  private beforeInsert() {
    const id = ulid()
    this.id = `ref_${id}`
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
