import {
  BeforeCreate,
  Collection,
  Entity,
  Filter,
  ManyToOne,
  OneToMany,
  OneToOne,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import { DALUtils, generateEntityId } from "@medusajs/utils"
import Refund from "./refund"
import Capture from "./capture"
import PaymentSession from "./payment-session"
import PaymentCollection from "./payment-collection"

@Entity({ tableName: "payment" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class Payment {
  @PrimaryKey({ columnType: "text" })
  id: string

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

  @Property()
  provider_id: string

  @Property({ nullable: true })
  currency_code: string | null

  @Property({ nullable: true })
  cart_id: string | null

  @Property({ nullable: true })
  order_id: string | null

  @Property({ nullable: true })
  customer_id: string | null

  @Property({ columnType: "jsonb", nullable: true })
  data?: Record<string, unknown> | null

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
    index: "IDX_payment_deleted_at",
  })
  deleted_at: Date | null

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  captured_at: Date | null

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  canceled_at: Date | null

  @OneToMany(() => Refund, (refund) => refund.payment, {
    orphanRemoval: true,
  })
  refunds = new Collection<Refund>(this)

  @OneToMany(() => Capture, (capture) => capture.payment, {
    orphanRemoval: true,
  })
  captures = new Collection<Capture>(this)

  @ManyToOne({
    fieldName: "payment_collection_id",
  })
  payment_collection!: PaymentCollection

  @OneToOne({ owner: true, fieldName: "session_id" })
  session: PaymentSession

  /** COMPUTED PROPERTIES START **/

  // captured_amount: number // sum of the associated captures
  // refunded_amount: number // sum of the associated refunds

  /** COMPUTED PROPERTIES END **/

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "pay")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "pay")
  }
}
