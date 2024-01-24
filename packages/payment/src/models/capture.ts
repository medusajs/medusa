import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  ManyToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import BigNumber from "bignumber.js"
import Payment from "./payment"

type OptionalCaptureProps = "created_at"

@Entity({ tableName: "capture" })
export default class Capture {
  [OptionalProps]?: OptionalCaptureProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({
    columnType: "numeric",
    serializer: Number,
  })
  amount: number

  @Property({
    columnType: "jsonb",
    serializer: (val) => ({
      ...val,
      value: BigNumber(val.value),
    }),
  })
  raw_amount: Record<string, unknown>

  @ManyToOne(() => Payment, {
    onDelete: "cascade",
    index: "IDX_capture_payment_id",
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
    this.id = generateEntityId(this.id, "capt")

    if (!this.raw_amount) {
      this.raw_amount = {
        value: BigNumber(this.amount),
        precision: 2,
      }
    }
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "capt")

    if (!this.raw_amount) {
      this.raw_amount = {
        value: BigNumber(this.amount),
        precision: 2,
      }
    }
  }
}
