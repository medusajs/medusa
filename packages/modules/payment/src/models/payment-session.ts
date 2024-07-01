import { BigNumberRawValue } from "@medusajs/types"
import {
  BigNumber,
  generateEntityId,
  MikroOrmBigNumberProperty,
  PaymentSessionStatus,
} from "@medusajs/utils"
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
  Rel,
} from "@mikro-orm/core"
import Payment from "./payment"
import PaymentCollection from "./payment-collection"

@Entity({ tableName: "payment_session" })
export default class PaymentSession {
  [OptionalProps]?: "status" | "data"

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  currency_code: string

  @MikroOrmBigNumberProperty()
  amount: BigNumber | number

  @Property({
    columnType: "jsonb",
  })
  raw_amount: BigNumberRawValue

  @Property({ columnType: "text" })
  provider_id: string

  @Property({ columnType: "jsonb" })
  data: Record<string, unknown> = {}

  @Property({ columnType: "jsonb", nullable: true })
  context: Record<string, unknown> | null

  @Enum({
    items: () => PaymentSessionStatus,
  })
  status: PaymentSessionStatus = PaymentSessionStatus.PENDING

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  authorized_at: Date | null = null

  @ManyToOne(() => PaymentCollection, {
    persist: false,
  })
  payment_collection: Rel<PaymentCollection>

  @ManyToOne({
    entity: () => PaymentCollection,
    columnType: "text",
    index: "IDX_payment_session_payment_collection_id",
    fieldName: "payment_collection_id",
    mapToPk: true,
  })
  payment_collection_id: string

  @OneToOne({
    entity: () => Payment,
    nullable: true,
    mappedBy: "payment_session",
  })
  payment?: Rel<Payment> | null

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
    index: "IDX_payment_session_deleted_at",
  })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "payses")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "payses")
  }
}
