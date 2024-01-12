import {
  BeforeCreate,
  Collection,
  Entity,
  Enum,
  Filter,
  ManyToMany,
  OneToMany,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { DAL } from "@medusajs/types"

import { DALUtils, generateEntityId } from "@medusajs/utils"
import PaymentProvider from "./payment-provider"
import PaymentSession from "./payment-session"
import Payment from "./payment"

/**
 * @enum
 *
 * The payment collection's status.
 */
export enum PaymentCollectionStatus {
  /**
   * The payment collection isn't paid.
   */
  NOT_PAID = "not_paid",
  /**
   * The payment collection is awaiting payment.
   */
  AWAITING = "awaiting",
  /**
   * The payment collection is authorized.
   */
  AUTHORIZED = "authorized",
  /**
   * Some of the payments in the payment collection are authorized.
   */
  PARTIALLY_AUTHORIZED = "partially_authorized",
  /**
   * The payment collection is canceled.
   */
  CANCELED = "canceled",
}

type OptionalPaymentCollectionProps =
  | "currency_code"
  | "authorized_amount"
  | "refunded_amount"
  | "region_id"
  | "completed_at"
  | DAL.SoftDeletableEntityDateColumns

@Entity({ tableName: "payment-collection" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class PaymentCollection {
  [OptionalProps]?: OptionalPaymentCollectionProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text", nullable: true })
  currency_code: string | null

  @Property({
    columnType: "numeric",
    serializer: Number,
  })
  amount: number

  @Property({
    columnType: "numeric",
    nullable: true,
    serializer: Number,
  })
  authorized_amount: number | null

  @Property({
    columnType: "numeric",
    nullable: true,
    serializer: Number,
  })
  refunded_amount: number | null

  @Property({ columnType: "text", nullable: true })
  region_id?: string | null

  @Property({
    onCreate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  created_at: Date

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  updated_at: Date

  @Property({
    columnType: "timestamptz",
    nullable: true,
    index: "IDX_payment_collection_deleted_at",
  })
  deleted_at: Date | null

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  completed_at: Date | null

  @Enum({
    items: () => PaymentCollectionStatus,
    default: PaymentCollectionStatus.NOT_PAID,
  })
  status: PaymentCollectionStatus = PaymentCollectionStatus.NOT_PAID

  @ManyToMany(() => PaymentProvider)
  payment_providers = new Collection<PaymentProvider>(this)

  @OneToMany(() => PaymentSession, (ps) => ps.payment_collection, {
    orphanRemoval: true,
  })
  payment_sessions = new Collection<PaymentSession>(this)

  @OneToMany(() => Payment, (payment) => payment.payment_collection, {
    orphanRemoval: true,
  })
  payments = new Collection<Payment>(this)

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "paycol")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "paycol")
  }
}
