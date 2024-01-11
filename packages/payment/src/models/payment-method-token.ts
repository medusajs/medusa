import {
  BeforeCreate,
  Entity,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"

@Entity({ tableName: "payment-method-token" })
export default class PaymentMethodToken {
  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "jsonb", nullable: true })
  data?: Record<string, unknown> | null

  @Property()
  name: string

  @Property()
  type_detail: string

  @Property()
  description_detail: string

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

  @Property({ columnType: "text" })
  provider_id: string

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "pmt")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "pmt")
  }
}
