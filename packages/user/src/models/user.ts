import {
  BeforeCreate,
  Entity,
  OnInit,
  PrimaryKey,
  Property,
  Index,
  OptionalProps,
  Filter,
} from "@mikro-orm/core"

import { DALUtils, generateEntityId } from "@medusajs/utils"
import { DAL } from "@medusajs/types"
import { createPsqlIndexStatementHelper } from "@medusajs/utils"

const userEmailIndexName = "IDX_user_email"
const userEmailIndexStatement = createPsqlIndexStatementHelper({
  name: userEmailIndexName,
  tableName: "user",
  columns: "email",
  where: "deleted_at IS NULL",
})

const userDeletedAtIndexName = "IDX_user_deleted_at"
const userDeletedAtIndexStatement = createPsqlIndexStatementHelper({
  name: userDeletedAtIndexName,
  tableName: "user",
  columns: "deleted_at",
})

type OptionalFields =
  | "first_name"
  | "last_name"
  | "metadata"
  | "avatar_url"
  | DAL.SoftDeletableEntityDateColumns
@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class User {
  [OptionalProps]?: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", nullable: true })
  first_name: string

  @Property({ columnType: "text", nullable: true })
  last_name: string

  @Property({ columnType: "text" })
  @Index({
    name: userEmailIndexName,
    expression: userEmailIndexStatement,
  })
  email: string

  @Property({ columnType: "text", nullable: true })
  avatar_url: string

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

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
  deleted_at?: Date

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "user")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "user")
  }
}
