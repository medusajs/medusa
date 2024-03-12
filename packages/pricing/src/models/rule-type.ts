import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Collection,
  Entity,
  ManyToMany,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import PriceSet from "./price-set"

type OptionalFields = "default_priority"

@Entity()
class RuleType {
  [OptionalProps]?: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  name: string

  @Property({ columnType: "text", index: "IDX_rule_type_rule_attribute" })
  rule_attribute: string

  @Property({ columnType: "integer", default: 0 })
  default_priority: number

  @ManyToMany(() => PriceSet, (priceSet) => priceSet.rule_types)
  price_sets = new Collection<PriceSet>(this)

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

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "rul-typ")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "rul-typ")
  }
}

export default RuleType
