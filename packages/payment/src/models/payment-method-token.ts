import {
  BeforeCreate,
  Entity,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"

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
