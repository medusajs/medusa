import { DAL } from "@medusajs/types"
import { DALUtils, generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  Filter,
  Index,
  ManyToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import PriceListRule from "./price-list-rule"

type OptionalFields = DAL.SoftDeletableEntityDateColumns

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class PriceListRuleValue {
  [OptionalProps]?: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @ManyToOne(() => PriceListRule, {
    onDelete: "cascade",
    fieldName: "price_list_rule_id",
    index: "IDX_price_list_rule_price_list_rule_value_id",
  })
  price_list_rule: PriceListRule

  @Property({ columnType: "text" })
  value: string

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

  @Index({ name: "IDX_price_list_rule_value_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "plrv")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "plrv")
  }
}
