import {
  BeforeCreate,
  Entity,
  OnInit,
  PrimaryKey,
  Property,
  Index,
  Filter,
  OptionalProps,
} from "@mikro-orm/core"

import { DALUtils, generateEntityId } from "@medusajs/utils"
import { DAL } from "@medusajs/types"

type OptionalFields =
  | "metadata"
  | "accepted"
  | DAL.SoftDeletableEntityDateColumns
@Entity({ tableName: "invite" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class Invite {
  [OptionalProps]: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id: string

  @Index({
    name: "invite_user_identifier_index",
    expression: `create unique index "invite_user_identifier_index" on "invite" ("user_identifier") where deleted_at is null;`,
  })
  @Property({ columnType: "text" })
  user_identifier: string

  @Property({ columnType: "boolean" })
  accepted: boolean = false

  @Property({ columnType: "text" })
  token: string

  @Property({ columnType: "timestamptz" })
  expires_at: Date

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

  @Index({ name: "IDX_invite_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at?: Date

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "invite")
  }

  @BeforeCreate()
  beforeCreate() {
    this.id = generateEntityId(this.id, "invite")
  }
}
