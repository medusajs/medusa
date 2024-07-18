import { DAL } from "@medusajs/types"
import {
  DALUtils,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Entity,
  Filter,
  ManyToOne,
  OnInit,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core"

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "return_reason",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const ValueIndex = createPsqlIndexStatementHelper({
  tableName: "return_reason",
  columns: "value",
  where: "deleted_at IS NOT NULL",
})

const ParentIndex = createPsqlIndexStatementHelper({
  tableName: "return_reason",
  columns: "parent_return_reason_id",
  where: "deleted_at IS NOT NULL",
})

type OptionalOrderProps = "parent_return_reason" | DAL.ModelDateColumns

@Entity({ tableName: "return_reason" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class ReturnReason {
  [OptionalProps]?: OptionalOrderProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  @ValueIndex.MikroORMIndex()
  value: string

  @Property({ columnType: "text" })
  label: string

  @Property({ columnType: "text", nullable: true })
  description: string | null = null

  @Property({ columnType: "text", nullable: true })
  @ParentIndex.MikroORMIndex()
  parent_return_reason_id?: string | null

  @ManyToOne({
    entity: () => ReturnReason,
    fieldName: "parent_return_reason_id",
    nullable: true,
    cascade: [Cascade.PERSIST],
  })
  parent_return_reason?: Rel<ReturnReason> | null

  @OneToMany(
    () => ReturnReason,
    (return_reason) => return_reason.parent_return_reason,
    { cascade: [Cascade.PERSIST] }
  )
  return_reason_children: Rel<ReturnReason>[]

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

  @Property({ columnType: "timestamptz", nullable: true })
  @DeletedAtIndex.MikroORMIndex()
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "rr")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "rr")
  }
}
