import {
  BeforeCreate,
  Entity,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"

type OptionalFields = "provider_metadata" | "app_metadata" | "user_metadata"

@Entity()
@Unique({
  properties: ["provider", "entity_id"],
  name: "IDX_auth_identity_provider_entity_id",
})
export default class AuthIdentity {
  [OptionalProps]: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  entity_id: string

  @Property({ columnType: "text" })
  provider: string

  @Property({ columnType: "jsonb", nullable: true })
  user_metadata: Record<string, unknown> | null

  @Property({ columnType: "jsonb", nullable: true })
  app_metadata: Record<string, unknown> | null

  @Property({ columnType: "jsonb", nullable: true })
  provider_metadata: Record<string, unknown> | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "authid")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "authid")
  }
}
