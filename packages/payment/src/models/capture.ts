import {
  BeforeCreate,
  Entity,
  ManyToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"
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

  @ManyToOne(() => Payment, {
    onDelete: "cascade",
    index: "IDX_capture_payment_id",
    fieldName: "payment_id",
  })
  payment!: Payment

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
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "capt")
  }
}
