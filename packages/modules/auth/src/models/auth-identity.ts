import {
  BeforeCreate,
  Collection,
  Entity,
  OnInit,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"
import ProviderIdentity from "./provider-identity"

@Entity()
export default class AuthIdentity {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @OneToMany(() => ProviderIdentity, (o) => o.auth_identity)
  provider_identities = new Collection<ProviderIdentity>(this)

  @Property({ columnType: "jsonb", nullable: true })
  app_metadata: Record<string, unknown> | null

  @BeforeCreate()
  @OnInit()
  onCreate() {
    this.id = generateEntityId(this.id, "authid")
  }
}
