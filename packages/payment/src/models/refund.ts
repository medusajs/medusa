import {
  BeforeCreate,
  Entity,
  ManyToOne,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"
import BigNumber from "bignumber.js"
import Payment from "./payment"

@Entity({ tableName: "refund" })
export default class Refund {
  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({
    columnType: "numeric",
    serializer: Number,
  })
  amount: number

  @Property({ columnType: "jsonb" })
  raw_amount: Record<string, unknown>

  @ManyToOne(() => Payment, {
    onDelete: "cascade",
    index: "IDX_refund_payment_id",
    fieldName: "payment_id",
  })
  payment: Payment

  @Property({
    onCreate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  created_at: Date

  @Property({ columnType: "text", nullable: true })
  created_by: string | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ref")

    if (!this.raw_amount) {
      this.raw_amount = {
        value: BigNumber(this.amount),
        precision: 2,
      }
    }
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ref")

    if (!this.raw_amount) {
      this.raw_amount = {
        value: BigNumber(this.amount),
        precision: 2,
      }
    }
  }
}
