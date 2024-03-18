import { DALUtils, generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  Filter,
  Index,
  ManyToOne,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import PriceSet from "./price-set"
import RuleType from "./rule-type"

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class PriceSetRuleType {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @ManyToOne(() => PriceSet, {
    onDelete: "cascade",
    index: "IDX_price_set_rule_type_price_set_id",
  })
  price_set: PriceSet

  @ManyToOne(() => RuleType, {
    index: "IDX_price_set_rule_type_rule_type_id",
  })
  rule_type: RuleType

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

  @Index({ name: "IDX_price_set_rule_type_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "psrt")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "psrt")
  }
}
