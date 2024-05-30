import { DAL } from "@medusajs/types"
import {
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
  RuleOperator,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  Enum,
  Filter,
  ManyToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import ShippingOption from "./shipping-option"

type ShippingOptionRuleOptionalProps = DAL.SoftDeletableEntityDateColumns

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "shipping_option_rule",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const ShippingOptionIdIndex = createPsqlIndexStatementHelper({
  tableName: "shipping_option_rule",
  columns: "shipping_option_id",
  where: "deleted_at IS NULL",
})

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class ShippingOptionRule {
  [OptionalProps]?: ShippingOptionRuleOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  attribute: string

  @Enum({
    items: () => Object.values(RuleOperator),
    columnType: "text",
  })
  operator: Lowercase<keyof typeof RuleOperator>

  @Property({ columnType: "jsonb", nullable: true })
  value: string | string[] | null = null

  @ManyToOne(() => ShippingOption, {
    type: "text",
    mapToPk: true,
    fieldName: "shipping_option_id",
    onDelete: "cascade",
  })
  @ShippingOptionIdIndex.MikroORMIndex()
  shipping_option_id: string

  @ManyToOne(() => ShippingOption, {
    persist: false,
  })
  shipping_option: ShippingOption

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
    this.id = generateEntityId(this.id, "sorul")
    this.shipping_option_id ??= this.shipping_option?.id
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "sorul")
    this.shipping_option_id ??= this.shipping_option?.id
  }
}
