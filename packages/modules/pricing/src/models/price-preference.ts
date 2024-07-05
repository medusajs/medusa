import {
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  Filter,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

export const uniquePreferenceRuleIndexName =
  "IDX_price_preference_attribute_value"
const UniquePreferenceRuleIndexStatement = createPsqlIndexStatementHelper({
  name: uniquePreferenceRuleIndexName,
  tableName: "price_preference",
  columns: ["attribute", "value"],
  unique: true,
  where: "deleted_at IS NULL",
})

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "price_preference",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
@UniquePreferenceRuleIndexStatement.MikroORMIndex()
export default class PricePreference {
  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  attribute: string

  @Property({ columnType: "text", nullable: true })
  value: string | null = null

  @Property({ default: false })
  is_tax_inclusive: boolean

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

  @DeletedAtIndex.MikroORMIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "prpref")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "prpref")
  }
}
