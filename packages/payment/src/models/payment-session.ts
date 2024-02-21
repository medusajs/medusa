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
import {
  BigNumber,
  BigNumberField,
  generateEntityId,
  PaymentSessionStatus,
} from "@medusajs/utils"

import PaymentCollection from "./payment-collection"
import Payment from "./payment"

@Entity({ tableName: "payment_session" })
export default class PaymentSession {
  [OptionalProps]?: "status" | "data"

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  currency_code: string

  @Property({ columnType: "numeric" })
  @BigNumberField()
  amount: BigNumber | number

  /*@Property({
    columnType: "numeric",
    fieldName: "amount",
  })
  amount_: BigNumber | number

  @Property({ persist: false, getter: true })
  get amount(): BigNumber | number {
    if (!this.amount_ && !this.raw_amount_) {
      return 0
    }

    return !this.raw_amount_ && isString(this.amount_)
      ? new BigNumber(this.raw_amount_ ?? this.amount_).numeric
      : this.amount_
  }

  set amount(value: number) {
    this.amount_ = value
  }

  @Property({ columnType: "jsonb", fieldName: "raw_amount" })
  raw_amount_: BigNumberRawValue

  @Property({ persist: false, getter: true })
  get raw_amount(): BigNumberRawValue {
    if (!this.amount_ && !this.raw_amount_) {
      return new BigNumber(0).raw!
    }

    return !this.raw_amount_ && isString(this.amount_)
      ? new BigNumber(this.raw_amount_ ?? this.amount_).raw!
      : this.raw_amount_
  }*/

  /*set raw_amount(value: BigNumberRawValue) {
    this.raw_amount_ = value
  }*/

  @Property({ columnType: "text" })
  provider_id: string

  @Property({ columnType: "jsonb" })
  data: Record<string, unknown> = {}

  @Enum({
    items: () => PaymentSessionStatus,
  })
  status: PaymentSessionStatus = PaymentSessionStatus.PENDING

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  authorized_at: Date | null = null

  @ManyToOne({
    index: "IDX_payment_session_payment_collection_id",
    fieldName: "payment_collection_id",
    onDelete: "cascade",
  })
  payment_collection!: PaymentCollection

  @OneToOne({
    entity: () => Payment,
    mappedBy: (payment) => payment.payment_session,
    cascade: ["soft-remove"] as any,
    nullable: true,
  })
  payment?: Payment | null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "payses")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "payses")
  }
}
