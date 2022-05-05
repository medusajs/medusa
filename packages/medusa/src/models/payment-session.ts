import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Unique,
} from "typeorm"
import { BaseEntity } from "../interfaces/models/base-entity"
import { DbAwareColumn } from "../utils/db-aware-column"
import { Cart } from "./cart"
import { generateEntityId } from "../utils/generate-entity-id"

export enum PaymentSessionStatus {
  AUTHORIZED = "authorized",
  PENDING = "pending",
  REQUIRES_MORE = "requires_more",
  ERROR = "error",
  CANCELED = "canceled",
}

@Unique("OneSelected", ["cart_id", "is_selected"])
@Entity()
export class PaymentSession extends BaseEntity {
  @Index()
  @Column()
  cart_id: string

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

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "ps")
  }
}

/**
 * @schema payment_session
 * title: "Payment Session"
 * description: "Payment Sessions are created when a Customer initilizes the checkout flow, and can be used to hold the state of a payment flow. Each Payment Session is controlled by a Payment Provider, who is responsible for the communication with external payment services. Authorized Payment Sessions will eventually get promoted to Payments to indicate that they are authorized for capture/refunds/etc."
 * x-resourceId: payment_session
 * properties:
 *   id:
 *     description: "The id of the Payment Session. This value will be prefixed with `ps_`."
 *     type: string
 *   cart_id:
 *     description: "The id of the Cart that the Payment Session is created for."
 *     type: string
 *   provider_id:
 *     description: "The id of the Payment Provider that is responsible for the Payment Session"
 *     type: string
 *   is_selected:
 *     description: "A flag to indicate if the Payment Session has been selected as the method that will be used to complete the purchase."
 *     type: boolean
 *   status:
 *     description: "Indicates the status of the Payment Session. Will default to `pending`, and will eventually become `authorized`. Payment Sessions may have the status of `requires_more` to indicate that further actions are to be completed by the Customer."
 *     type: string
 *     enum:
 *       - authorized
 *       - pending
 *       - requires_more
 *       - error
 *       - canceled
 *   data:
 *     description: "The data required for the Payment Provider to identify, modify and process the Payment Session. Typically this will be an object that holds an id to the external payment session, but can be an empty object if the Payment Provider doesn't hold any state."
 *     type: object
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: "The date with timezone at which the resource was last updated."
 *     type: string
 *     format: date-time
 */
