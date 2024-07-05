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
  properties: ["provider", "scope", "entity_id"],
  name: "IDX_auth_user_provider_scope_entity_id",
})
export default class AuthUser {
  [OptionalProps]: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  entity_id: string

  @Property({ columnType: "text" })
  provider: string

  @Property({ columnType: "text" })
  scope: string

  @Property({ columnType: "jsonb", nullable: true })
  user_metadata: Record<string, unknown> | null

  @Property({ columnType: "jsonb" })
  app_metadata: Record<string, unknown> = {}

  @Property({ columnType: "jsonb", nullable: true })
  provider_metadata: Record<string, unknown> | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "authusr")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "authusr")
  }
}
