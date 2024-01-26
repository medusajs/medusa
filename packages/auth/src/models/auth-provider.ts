import {
  Entity,
  Enum,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import { ProviderDomain } from "../types/repositories/auth-provider"

type OptionalFields = "domain" | "is_active" | "config"

@Entity()
export default class AuthProvider {
  [OptionalProps]: OptionalFields

  @PrimaryKey({ columnType: "text" })
  provider!: string

  @Property({ columnType: "text" })
  name: string

  @Enum({ items: () => ProviderDomain, default: ProviderDomain.ALL })
  domain: ProviderDomain = ProviderDomain.ALL

  @Property({ columnType: "jsonb", nullable: true })
  config: Record<string, unknown> | null = null

  @Property({ columnType: "boolean", default: false })
  is_active = false
}
