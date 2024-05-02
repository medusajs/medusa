import { DAL, PromotionRuleOperatorValues } from "@medusajs/types"
import { DALUtils, PromotionUtils, generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  Enum,
  Filter,
  Index,
  ManyToMany,
  OnInit,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import ApplicationMethod from "./application-method"
import Promotion from "./promotion"
import PromotionRuleValue from "./promotion-rule-value"

type OptionalFields = "description" | DAL.SoftDeletableEntityDateColumns
type OptionalRelations = "values" | "promotions"

@Entity({ tableName: "promotion_rule" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class PromotionRule {
  [OptionalProps]?: OptionalFields | OptionalRelations

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", nullable: true })
  description: string | null = null

  @Index({ name: "IDX_promotion_rule_attribute" })
  @Property({ columnType: "text" })
  attribute: string

  @Index({ name: "IDX_promotion_rule_operator" })
  @Enum(() => PromotionUtils.PromotionRuleOperator)
  operator: PromotionRuleOperatorValues

  @OneToMany(() => PromotionRuleValue, (prv) => prv.promotion_rule, {
    cascade: [Cascade.REMOVE],
  })
  values = new Collection<PromotionRuleValue>(this)

  @ManyToMany(() => Promotion, (promotion) => promotion.rules)
  promotions = new Collection<Promotion>(this)

  @ManyToMany(
    () => ApplicationMethod,
    (applicationMethod) => applicationMethod.target_rules
  )
  method_target_rules = new Collection<ApplicationMethod>(this)

  @ManyToMany(
    () => ApplicationMethod,
    (applicationMethod) => applicationMethod.buy_rules
  )
  method_buy_rules = new Collection<ApplicationMethod>(this)

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
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "prorul")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "prorul")
  }
}
