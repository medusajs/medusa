import { BigNumberRawValue, DAL } from "@medusajs/types"
import {
  BigNumber,
  DALUtils,
  MikroOrmBigNumberProperty,
  PaymentCollectionStatus,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  Enum,
  Filter,
  ManyToMany,
  OnInit,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import Payment from "./payment"
import PaymentProvider from "./payment-provider"
import PaymentSession from "./payment-session"

type OptionalPaymentCollectionProps = "status" | DAL.EntityDateColumns

@Entity({ tableName: "payment_collection" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class PaymentCollection {
  [OptionalProps]?: OptionalPaymentCollectionProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  currency_code: string

  @MikroOrmBigNumberProperty()
  amount: BigNumber | number

  @Property({ columnType: "jsonb" })
  raw_amount: BigNumberRawValue

  @MikroOrmBigNumberProperty({ nullable: true })
  authorized_amount: BigNumber | number | null = null

  @Property({ columnType: "jsonb", nullable: true })
  raw_authorized_amount: BigNumberRawValue | null = null

  @MikroOrmBigNumberProperty({ nullable: true })
  captured_amount: BigNumber | number | null = null

  @Property({ columnType: "jsonb", nullable: true })
  raw_captured_amount: BigNumberRawValue | null = null

  @MikroOrmBigNumberProperty({ nullable: true })
  refunded_amount: BigNumber | number | null = null

  @Property({ columnType: "jsonb", nullable: true })
  raw_refunded_amount: BigNumberRawValue | null = null

  @Property({ columnType: "text", index: "IDX_payment_collection_region_id" })
  region_id: string

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
  deleted_at: Date | null = null

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  completed_at: Date | null = null

  @Enum({
    items: () => PaymentCollectionStatus,
    default: PaymentCollectionStatus.NOT_PAID,
  })
  status: PaymentCollectionStatus = PaymentCollectionStatus.NOT_PAID

  @ManyToMany(() => PaymentProvider)
  payment_providers = new Collection<PaymentProvider>(this)

  @OneToMany(() => PaymentSession, (ps) => ps.payment_collection, {
    cascade: [Cascade.PERSIST, "soft-remove"] as any,
  })
  payment_sessions = new Collection<PaymentSession>(this)

  @OneToMany(() => Payment, (payment) => payment.payment_collection, {
    cascade: [Cascade.PERSIST, "soft-remove"] as any,
  })
  payments = new Collection<Payment>(this)

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "pay_col")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "pay_col")
  }
}
