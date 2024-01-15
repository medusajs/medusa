import {
  BeforeCreate,
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { DAL } from "@medusajs/types"
import { generateEntityId } from "@medusajs/utils"

import PaymentCollection from "./payment-collection"
import Payment from "./payment"

/**
 * @enum
 *
 * The status of a payment session.
 */
export enum PaymentSessionStatus {
  /**
   * The payment is authorized.
   */
  AUTHORIZED = "authorized",
  /**
   * The payment is pending.
   */
  PENDING = "pending",
  /**
   * The payment requires an action.
   */
  REQUIRES_MORE = "requires_more",
  /**
   * An error occurred while processing the payment.
   */
  ERROR = "error",
  /**
   * The payment is canceled.
   */
  CANCELED = "canceled",
}

type OptionalPaymentSessionProps =
  | "currency_code"
  | "data"
  | "is_selected"
  | "authorized_at"
  | DAL.EntityDateColumns

@Entity({ tableName: "payment_session" })
export default class PaymentSession {
  [OptionalProps]?: OptionalPaymentSessionProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text", nullable: true })
  currency_code: string | null

  @Property({
    columnType: "numeric",
    serializer: Number,
  })
  amount: number

  @Property({ columnType: "text" })
  provider_id: string

  @Property({ columnType: "jsonb", nullable: true })
  data?: Record<string, unknown> | null

  @Enum({
    items: () => PaymentSessionStatus,
  })
  status: PaymentSessionStatus

  @Property({ columnType: "boolean", nullable: true })
  is_selected: boolean | null

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  authorized_at: Date | null

  @ManyToOne({
    index: "IDX_payment_session_payment_collection_id",
    fieldName: "payment_collection_id",
  })
  payment_collection!: PaymentCollection

  @OneToOne({
    entity: () => Payment,
    mappedBy: (payment) => payment.session,
    cascade: ["soft-remove"] as any,
  })
  payment!: Payment

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "payses")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "payses")
  }
}
