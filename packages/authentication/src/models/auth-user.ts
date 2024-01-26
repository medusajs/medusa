import {
  BeforeCreate,
  Cascade,
  Entity,
  Index,
  ManyToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core"

import AuthProvider from "./auth-provider"
import { generateEntityId } from "@medusajs/utils"

type OptionalFields = "provider_metadata" | "app_metadata" | "user_metadata"

@Entity()
@Unique({ properties: ["provider","entity_id" ], name: "IDX_auth_user_provider_entity_id" })
export default class AuthUser {
  [OptionalProps]: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  entity_id: string

  @ManyToOne(() => AuthProvider, {
    joinColumn: "provider",
    fieldName: "provider_id",
    cascade: [Cascade.REMOVE],
  })
  provider: AuthProvider

  @Property({ columnType: "jsonb", nullable: true })
  user_metadata: Record<string, unknown> | null

  @Property({ columnType: "jsonb", nullable: true })
  app_metadata: Record<string, unknown> | null

  @Property({ columnType: "jsonb", nullable: true })
  provider_metadata: Record<string, unknown> | null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "authusr")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "authusr")
  }
}
