import {
  BeforeCreate,
  Entity,
  Filter,
  Index,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import { DAL } from "@medusajs/types"
import {
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
  Searchable,
} from "@medusajs/utils"

const userEmailIndexName = "IDX_user_email"
const userEmailIndexStatement = createPsqlIndexStatementHelper({
  name: userEmailIndexName,
  unique: true,
  tableName: "user",
  columns: "email",
  where: "deleted_at IS NULL",
})

const userDeletedAtIndexName = "IDX_user_deleted_at"
const userDeletedAtIndexStatement = createPsqlIndexStatementHelper({
  name: userDeletedAtIndexName,
  tableName: "user",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
}).expression

type OptionalFields =
  | "first_name"
  | "last_name"
  | "metadata"
  | "avatar_url"
  | DAL.SoftDeletableModelDateColumns

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class User {
  [OptionalProps]?: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  first_name: string | null = null

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  last_name: string | null = null

  @userEmailIndexStatement.MikroORMIndex()
  @Searchable()
  @Property({ columnType: "text" })
  email: string

  @Property({ columnType: "text", nullable: true })
  avatar_url: string | null = null

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

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
  updated_at: Date

  @Index({
    name: userDeletedAtIndexName,
    expression: userDeletedAtIndexStatement,
  })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at?: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "user")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "user")
  }
}
