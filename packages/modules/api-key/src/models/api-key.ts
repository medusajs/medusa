import {
  Searchable,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"

import {
  BeforeCreate,
  Entity,
  Enum,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

const TypeIndex = createPsqlIndexStatementHelper({
  tableName: "api_key",
  columns: "type",
})

const TokenIndex = createPsqlIndexStatementHelper({
  tableName: "api_key",
  columns: "token",
  unique: true,
})

@Entity()
export default class ApiKey {
  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  @TokenIndex.MikroORMIndex()
  token: string

  @Property({ columnType: "text" })
  salt: string

  @Searchable()
  @Property({ columnType: "text" })
  redacted: string

  @Searchable()
  @Property({ columnType: "text" })
  title: string

  @Property({ columnType: "text" })
  @Enum({ items: ["publishable", "secret"] })
  @TypeIndex.MikroORMIndex()
  type: "publishable" | "secret"

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  last_used_at: Date | null = null

  @Property({ columnType: "text" })
  created_by: string

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
  updated_at?: Date

  @Property({ columnType: "text", nullable: true })
  revoked_by: string | null = null

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  revoked_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "apk")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "apk")
  }
}
