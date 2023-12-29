import { TransactionState } from "@medusajs/orchestration"
import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  Enum,
  Index,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core"

type OptionalFields = "deleted_at"

@Entity()
@Unique({
  name: "IDX_workflow_execution_workflow_id_transaction_id_unique",
  properties: ["workflow_id", "transaction_id"],
})
export default class WorkflowExecution {
  [OptionalProps]?: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  @Index({ name: "IDX_workflow_execution_workflow_id" })
  workflow_id: string

  @Property({ columnType: "text" })
  @Index({ name: "IDX_workflow_execution_transaction_id" })
  transaction_id: string

  @Property({ columnType: "jsonb", nullable: true })
  definition: string

  @Property({ columnType: "jsonb", nullable: true })
  context?: Record<string, unknown> | null

  @Index({ name: "IDX_workflow_execution_state" })
  @Enum(() => TransactionState)
  state: TransactionState

  @Property({
    onCreate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  created_at?: Date

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  updated_at?: Date

  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at?: Date

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "wo")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "wo")
  }
}
