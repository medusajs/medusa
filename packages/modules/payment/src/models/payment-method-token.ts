import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

@Entity({ tableName: "payment_method_token" })
export default class PaymentMethodToken {
  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  provider_id: string

  @Property({ columnType: "jsonb", nullable: true })
  data: Record<string, unknown> | null = null

  @Property({ columnType: "text" })
  name: string

  @Property({ columnType: "text", nullable: true })
  type_detail: string | null = null

  @Property({ columnType: "text", nullable: true })
  description_detail: string | null = null

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
    index: "IDX_payment_method_token_deleted_at",
  })
  deleted_at: Date | null = null

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "paymttok")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "paymttok")
  }
}
