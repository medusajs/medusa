import { generateEntityId } from "@medusajs/utils"
import { PricingTypes } from "@medusajs/types"
import {
  BeforeCreate,
  Entity,
  Enum,
  ManyToOne,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

type OptionalFields =
  | "default_priority"
  | "kind"
  | "is_dynamic"
  
@Entity()
class RuleType {
  [OptionalProps]?: OptionalFields 

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  name: string

  @Property({ columnType: "text" })
  key_value: string

  @Property({ columnType: "integer", default: 0 })
  default_priority: number
  
  @Enum({
    items: () => PricingTypes.RuleTypeKind,
    default: PricingTypes.RuleTypeKind.FILTER,
  })
  kind: PricingTypes.RuleTypeKind
  
  @Property({ columnType: "boolean", default: false })
  is_dynamic: boolean

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "rt")
  }
}

export default RuleType
