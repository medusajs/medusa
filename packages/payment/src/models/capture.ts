import {
  BeforeCreate,
  Entity,
  ManyToOne,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"
import Payment from "./payment"

@Entity({ tableName: "capture" })
export default class Capture {
  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({
    columnType: "numeric",
    serializer: Number,
  })
  amount: number

  @ManyToOne(() => Payment, {
    onDelete: "cascade",
    fieldName: "payment_id",
  })
  payment: Payment

  @Property({
    onCreate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  created_at: Date

  @Property({ nullable: true })
  created_by: string | null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "capture")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "capture")
  }
}
