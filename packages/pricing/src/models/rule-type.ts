import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

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

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "rul-typ")
  }
}

export default RuleType
