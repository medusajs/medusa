import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Unique,
} from "typeorm"

import { BaseEntity } from "../interfaces"
import { Cart } from "./cart"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"
import { generateEntityId } from "../utils"
import { FeatureFlagDecorators } from "../utils/feature-flag-decorators"
import OrderEditingFeatureFlag from "../loaders/feature-flags/order-editing"

export enum PaymentSessionStatus {
  AUTHORIZED = "authorized",
  PENDING = "pending",
  REQUIRES_MORE = "requires_more",
  ERROR = "error",
  CANCELED = "canceled",
}

@Unique("OneSelected", ["cart_id", "is_selected"])
// TODO: This uniq constraint should be updated once the order edit flag is dropped and should add a where clause on cart_id is not null
@Unique("UniqPaymentSessionCartIdProviderId", ["cart_id", "provider_id"])
@Entity()
export class PaymentSession extends BaseEntity {
  @Index()
  @Column({ nullable: true })
  cart_id: string | null

  @ManyToOne(() => Cart, (cart) => cart.payment_sessions)
  @JoinColumn({ name: "cart_id" })
  cart: Cart

  @Index()
  @Column()
  provider_id: string

  @Column({ type: "boolean", nullable: true })
  is_selected: boolean | null

  @DbAwareColumn({ type: "enum", enum: PaymentSessionStatus })
  status: string

  @DbAwareColumn({ type: "jsonb" })
  data: Record<string, unknown>

  @Column({ nullable: true })
  idempotency_key: string

  @FeatureFlagDecorators(OrderEditingFeatureFlag.key, [
    Column({ type: "integer", nullable: true }),
  ])
  amount: number

  @FeatureFlagDecorators(OrderEditingFeatureFlag.key, [
    Column({ type: resolveDbType("timestamptz"), nullable: true }),
  ])
  payment_authorized_at: Date

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "ps")
  }
}

/**
 * @schema PaymentSession
 * title: "Payment Session"
 * description: "Payment Sessions are created when a Customer initilizes the checkout flow, and can be used to hold the state of a payment flow. Each Payment Session is controlled by a Payment Provider, who is responsible for the communication with external payment services. Authorized Payment Sessions will eventually get promoted to Payments to indicate that they are authorized for capture/refunds/etc."
 * type: object
 * required:
 *   - cart_id
 *   - provider_id
 *   - status
 * properties:
 *   id:
 *     type: string
 *     description: The payment session's ID
 *     example: ps_01G901XNSRM2YS3ASN9H5KG3FZ
 *   cart_id:
 *     description: "The id of the Cart that the Payment Session is created for."
 *     type: string
 *     example: cart_01G8ZH853Y6TFXWPG5EYE81X63
 *   cart:
 *     description: A cart object. Available if the relation `cart` is expanded.
 *     type: object
 *   provider_id:
 *     description: "The id of the Payment Provider that is responsible for the Payment Session"
 *     type: string
 *     example: manual
 *   is_selected:
 *     description: "A flag to indicate if the Payment Session has been selected as the method that will be used to complete the purchase."
 *     type: boolean
 *     example: true
 *   status:
 *     description: "Indicates the status of the Payment Session. Will default to `pending`, and will eventually become `authorized`. Payment Sessions may have the status of `requires_more` to indicate that further actions are to be completed by the Customer."
 *     type: string
 *     enum:
 *       - authorized
 *       - pending
 *       - requires_more
 *       - error
 *       - canceled
 *     example: pending
 *   data:
 *     description: "The data required for the Payment Provider to identify, modify and process the Payment Session. Typically this will be an object that holds an id to the external payment session, but can be an empty object if the Payment Provider doesn't hold any state."
 *     type: object
 *     example: {}
 *   idempotency_key:
 *     type: string
 *     description: Randomly generated key used to continue the completion of a cart in case of failure.
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
 */
