import { DALUtils, generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  Filter,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

@Entity({ tableName: "adjustment_line" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class AdjustmentLine {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", nullable: true })
  description: string | null

  @Property({ columnType: "text", nullable: true })
  promotion_id: string | null

  @Property({ columnType: "text" })
  code: string

  @Property({ columnType: "numeric" })
  amount: number

  @Property({ columnType: "text", nullable: true })
  provider_id: string | null

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
    this.id = generateEntityId(this.id, "adjli")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "adjli")
  }
}
