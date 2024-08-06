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
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import Payment from "./payment"

type OptionalCaptureProps = "created_at"

@Entity({ tableName: "capture" })
export default class Capture {
  [OptionalProps]?: OptionalCaptureProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @MikroOrmBigNumberProperty()
  amount: BigNumber | number

  @Property({ columnType: "jsonb" })
  raw_amount: BigNumberRawValue

  @ManyToOne(() => Payment, {
    onDelete: "cascade",
    index: "IDX_capture_payment_id",
    fieldName: "payment_id",
  })
  payment!: Payment

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

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
    index: "IDX_capture_deleted_at",
  })
  deleted_at: Date | null = null

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
