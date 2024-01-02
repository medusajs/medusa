import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Entity,
  ManyToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import AuthProvider from "./auth-provider"

type OptionalFields = "password_hash" | "app_metadata" | "user_metadata"

@Entity()
export default class AuthUser {
  [OptionalProps]: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", index: "IDX_auth_user_email" })
  email: string

  @Property({
    columnType: "text",
    nullable: true,
    hidden: true,
  })
  password_hash: string | null

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

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "authusr")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "authusr")
  }
}
