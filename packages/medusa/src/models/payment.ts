import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"

import { Swap } from "./swap"
import { Currency } from "./currency"
import { Cart } from "./cart"
import { Order } from "./order"
import { BaseEntity } from "../interfaces/models/base-entity"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class Payment extends BaseEntity {
  @Index()
  @Column({ nullable: true })
  swap_id: string

  @OneToOne(() => Swap)
  @JoinColumn({ name: "swap_id" })
  swap: Swap

  @Index()
  @Column({ nullable: true })
  cart_id: string

  @OneToOne(() => Cart)
  @JoinColumn({ name: "cart_id" })
  cart: Cart

  @Index()
  @Column({ nullable: true })
  order_id: string

  @ManyToOne(() => Order, (order) => order.payments)
  @JoinColumn({ name: "order_id" })
  order: Order

  @Column({ type: "int" })
  amount: number

  @Column()
  currency_code: string

  @ManyToOne(() => Currency)
  @JoinColumn({ name: "currency_code", referencedColumnName: "code" })
  currency: Currency

  @Column({ type: "int", default: 0 })
  amount_refunded: number

  @Index()
  @Column()
  provider_id: string

  @DbAwareColumn({ type: "jsonb" })
  data: Record<string, unknown>

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  captured_at: Date | string

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  canceled_at: Date | string

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @Column({ nullable: true })
  idempotency_key: string

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "pay")
  }
}

/**
 * @schema payment
 * title: "Payment"
 * description: "Payments represent an amount authorized with a given payment method, Payments can be captured, canceled or refunded."
 * x-resourceId: payment
 * properties:
 *   id:
 *     description: "The id of the Payment. This value will be prefixed with `pay_`."
 *     type: string
 *   swap_id:
 *     description: "The id of the Swap that the Payment is used for."
 *     type: string
 *   order_id:
 *     description: "The id of the Order that the Payment is used for."
 *     type: string
 *   cart_id:
 *     description: "The id of the Cart that the Payment Session is created for."
 *     type: string
 *   amount:
 *     description: "The amount that the Payment has been authorized for."
 *     type: integer
 *   currency_code:
 *     description: "The 3 character ISO currency code that the Payment is completed in."
 *     type: string
 *   amount_refunded:
 *     description: "The amount of the original Payment amount that has been refunded back to the Customer."
 *     type: integer
 *   provider_id:
 *     description: "The id of the Payment Provider that is responsible for the Payment"
 *     type: string
 *   data:
 *     description: "The data required for the Payment Provider to identify, modify and process the Payment. Typically this will be an object that holds an id to the external payment session, but can be an empty object if the Payment Provider doesn't hold any state."
 *     type: object
 *   captured_at:
 *     description: "The date with timezone at which the Payment was captured."
 *     type: string
 *     format: date-time
 *   canceled_at:
 *     description: "The date with timezone at which the Payment was canceled."
 *     type: string
 *     format: date-time
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
