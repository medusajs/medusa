import { BigNumberRawValue } from "@medusajs/types"
import {
  BigNumber,
  MikroOrmBigNumberProperty,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  ManyToOne,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import Payment from "./payment"

@Entity({ tableName: "refund" })
export default class Refund {
  @PrimaryKey({ columnType: "text" })
  id: string

  @MikroOrmBigNumberProperty()
  amount: BigNumber | number

  @Property({ columnType: "jsonb" })
  raw_amount: BigNumberRawValue

  @ManyToOne(() => Payment, {
    onDelete: "cascade",
    index: "IDX_refund_payment_id",
    fieldName: "payment_id",
  })
  payment!: Payment

  @Property({
    onCreate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  created_at: Date

  @Property({
    onCreate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  updated_at: Date

  @Property({
    columnType: "timestamptz",
    nullable: true,
    index: "IDX_refund_deleted_at",
  })
  deleted_at: Date | null = null

  @Property({ columnType: "text", nullable: true })
  created_by: string | null = null

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ref")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ref")
  }
}
