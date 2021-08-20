import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm"
import { ulid } from "ulid"
import { resolveDbType, DbAwareColumn } from "../utils/db-aware-column"
import { Cart } from "./cart"

export enum PaymentSessionStatus {
  AUTHORIZED = "authorized",
  PENDING = "pending",
  REQUIRES_MORE = "requires_more",
  ERROR = "error",
  CANCELED = "canceled",
}

@Unique("OneSelected", ["cart_id", "is_selected"])
@Entity()
export class PaymentSession {
  @PrimaryColumn()
  id: string

  @Index()
  @Column()
  cart_id: string

  @ManyToOne(
    () => Cart,
    cart => cart.payment_sessions
  )
  @JoinColumn({ name: "cart_id" })
  cart: Cart

  @Index()
  @Column()
  provider_id: string

  @Column({ nullable: true })
  is_selected: boolean

  @DbAwareColumn({ type: "enum", enum: PaymentSessionStatus })
  status: string

  @DbAwareColumn({ type: "jsonb" })
  data: any

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @Column({ nullable: true })
  idempotency_key: string

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `ps_${id}`
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
