import {
  BeforeCreate,
  Entity,
  ManyToOne,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import {
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import AuthIdentity from "./auth-identity"

const providerEntityIdIndexName = "IDX_provider_identity_provider_entity_id"
const providerEntityIdIndexStatement = createPsqlIndexStatementHelper({
  name: providerEntityIdIndexName,
  tableName: "provider_identity",
  columns: ["entity_id", "provider"],
  unique: true,
})

const authIdentityIndexName = "IDX_provider_identity_auth_identity_id"
const authIdentityIndexStatement = createPsqlIndexStatementHelper({
  name: authIdentityIndexName,
  tableName: "provider_identity",
  columns: ["auth_identity_id"],
})

@Entity()
@providerEntityIdIndexStatement.MikroORMIndex()
@authIdentityIndexStatement.MikroORMIndex()
export default class ProviderIdentity {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  entity_id: string

  @Property({ columnType: "text" })
  provider: string

  @ManyToOne(() => AuthIdentity, {
    columnType: "text",
    fieldName: "auth_identity_id",
    mapToPk: true,
    onDelete: "cascade",
  })
  auth_identity_id: string

  @ManyToOne(() => AuthIdentity, {
    persist: false,
  })
  auth_identity: AuthIdentity

  @Property({ columnType: "jsonb", nullable: true })
  user_metadata: Record<string, unknown> | null

  @Property({ columnType: "jsonb", nullable: true })
  provider_metadata: Record<string, unknown> | null = null

  @BeforeCreate()
  @OnInit()
  onCreate() {
    this.id = generateEntityId(this.id, "provid")
    this.auth_identity_id ??= this.auth_identity?.id ?? null
  }
}
