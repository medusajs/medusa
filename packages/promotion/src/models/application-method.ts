import {
  ApplicationMethodAllocationValues,
  ApplicationMethodTargetTypeValues,
  ApplicationMethodTypeValues,
} from "@medusajs/types"
import { PromotionUtils, generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Collection,
  Entity,
  Enum,
  Index,
  ManyToMany,
  OnInit,
  OneToOne,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import Promotion from "./promotion"
import PromotionRule from "./promotion-rule"

type OptionalFields =
  | "value"
  | "max_quantity"
  | "allocation"
  | "created_at"
  | "updated_at"
  | "deleted_at"

@Entity()
export default class ApplicationMethod {
  [OptionalProps]?: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "numeric", nullable: true, serializer: Number })
  value?: string | null

  @Property({ columnType: "numeric", nullable: true, serializer: Number })
  max_quantity?: number | null

  @Index({ name: "IDX_application_method_type" })
  @Enum(() => PromotionUtils.ApplicationMethodType)
  type: ApplicationMethodTypeValues

  @Index({ name: "IDX_application_method_target_type" })
  @Enum(() => PromotionUtils.ApplicationMethodTargetType)
  target_type: ApplicationMethodTargetTypeValues

  @Index({ name: "IDX_application_method_allocation" })
  @Enum({
    items: () => PromotionUtils.ApplicationMethodAllocation,
    nullable: true,
  })
  allocation?: ApplicationMethodAllocationValues

  @OneToOne({
    entity: () => Promotion,
  })
  promotion: Promotion

  @ManyToMany(() => PromotionRule, "application_methods", {
    owner: true,
    pivotTable: "application_method_promotion_rule",
    cascade: ["soft-remove"] as any,
  })
  target_rules = new Collection<PromotionRule>(this)

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
  deleted_at: Date | null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "proappmet")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "proappmet")
  }
}
