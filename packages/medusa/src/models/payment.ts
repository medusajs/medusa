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

import { BaseEntity } from "../interfaces/models/base-entity"
import { Cart } from "./cart"
import { Currency } from "./currency"
import { Order } from "./order"
import { Swap } from "./swap"
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
 * required:
 *   - amount
 *   - currency_code
 *   - provider_id
 * properties:
 *   id:
 *     type: string
 *     description: The payment's ID
 *     example: pay_01G2SJNT6DEEWDFNAJ4XWDTHKE
 *   swap_id:
 *     description: "The ID of the Swap that the Payment is used for."
 *     type: string
 *     example: null
 *   swap:
 *     description: A swap object. Available if the relation `swap` is expanded.
 *     type: object
 *   cart_id:
 *     description: "The id of the Cart that the Payment Session is created for."
 *     type: string
 *   cart:
 *     description: A cart object. Available if the relation `cart` is expanded.
 *     type: object
 *   order_id:
 *     description: "The ID of the Order that the Payment is used for."
 *     type: string
 *     example: order_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   order:
 *     description: An order object. Available if the relation `order` is expanded.
 *     type: object
 *   amount:
 *     description: "The amount that the Payment has been authorized for."
 *     type: integer
 *     example: 100
 *   currency_code:
 *     description: "The 3 character ISO currency code that the Payment is completed in."
 *     type: string
 *     example: usd
 *     externalDocs:
 *       url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *       description: See a list of codes.
 *   currency:
 *     description: Available if the relation `currency` is expanded.
 *     $ref: "#/components/schemas/currency"
 *   amount_refunded:
 *     description: "The amount of the original Payment amount that has been refunded back to the Customer."
 *     type: integer
 *     example: 0
 *   provider_id:
 *     description: "The id of the Payment Provider that is responsible for the Payment"
 *     type: string
 *     example: manual
 *   data:
 *     description: "The data required for the Payment Provider to identify, modify and process the Payment. Typically this will be an object that holds an id to the external payment session, but can be an empty object if the Payment Provider doesn't hold any state."
 *     type: object
 *     example: {}
 *   captured_at:
 *     description: "The date with timezone at which the Payment was captured."
 *     type: string
 *     format: date-time
 *   canceled_at:
 *     description: "The date with timezone at which the Payment was canceled."
 *     type: string
 *     format: date-time
 *   idempotency_key:
 *     type: string
 *     description: Randomly generated key used to continue the completion of a payment in case of failure.
 *     externalDocs:
 *       url: https://docs.medusajs.com/advanced/backend/payment/overview#idempotency-key
 *       description: Learn more how to use the idempotency key.
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
