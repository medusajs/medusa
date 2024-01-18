import {
  BeforeCreate,
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { generateEntityId, PaymentSessionStatus } from "@medusajs/utils"

import PaymentCollection from "./payment-collection"
import Payment from "./payment"

@Entity({ tableName: "payment_session" })
export default class PaymentSession {
  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  currency_code: string

  @Property({
    columnType: "numeric",
    serializer: Number,
  })
  amount: number

  @Property({ columnType: "text" })
  provider_id: string

  @Property({ columnType: "jsonb", nullable: true })
  data: Record<string, unknown> | null = null

  @Enum({
    items: () => PaymentSessionStatus,
  })
  status: PaymentSessionStatus

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  authorized_at: Date | null = null

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
