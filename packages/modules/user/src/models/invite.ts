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
  DALUtils,
  createPsqlIndexStatementHelper,
  generateEntityId,
  Searchable,
} from "@medusajs/utils"

const inviteEmailIndexName = "IDX_invite_email"
const inviteEmailIndexStatement = createPsqlIndexStatementHelper({
  name: inviteEmailIndexName,
  tableName: "invite",
  columns: "email",
  where: "deleted_at IS NULL",
  unique: true,
}).expression

const inviteTokenIndexName = "IDX_invite_token"
const inviteTokenIndexStatement = createPsqlIndexStatementHelper({
  name: inviteTokenIndexName,
  tableName: "invite",
  columns: "token",
  where: "deleted_at IS NULL",
}).expression

const inviteDeletedAtIndexName = "IDX_invite_deleted_at"
const inviteDeletedAtIndexStatement = createPsqlIndexStatementHelper({
  name: inviteDeletedAtIndexName,
  tableName: "invite",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
}).expression

type OptionalFields =
  | "metadata"
  | "accepted"
  | DAL.SoftDeletableModelDateColumns
@Entity({ tableName: "invite" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class Invite {
  [OptionalProps]: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id: string

  @Index({
    name: inviteEmailIndexName,
    expression: inviteEmailIndexStatement,
  })
  @Searchable()
  @Property({ columnType: "text" })
  email: string

  @Property({ columnType: "boolean" })
  accepted: boolean = false

  @Index({
    name: inviteTokenIndexName,
    expression: inviteTokenIndexStatement,
  })
  @Property({ columnType: "text" })
  token: string

  @Property({ columnType: "timestamptz" })
  expires_at: Date

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
    name: inviteDeletedAtIndexName,
    expression: inviteDeletedAtIndexStatement,
  })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "invite")
  }

  @BeforeCreate()
  beforeCreate() {
    this.id = generateEntityId(this.id, "invite")
  }
}
