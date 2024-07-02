import { DAL, PromotionTypeValues } from "@medusajs/types"
import {
  DALUtils,
  PromotionUtils,
  Searchable,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Collection,
  Entity,
  Enum,
  Filter,
  Index,
  ManyToMany,
  ManyToOne,
  OnInit,
  OneToOne,
  OptionalProps,
  PrimaryKey,
  Property,
  Rel,
  Unique,
} from "@mikro-orm/core"
import ApplicationMethod from "./application-method"
import Campaign from "./campaign"
import PromotionRule from "./promotion-rule"

type OptionalFields = "is_automatic" | DAL.SoftDeletableEntityDateColumns
type OptionalRelations = "application_method" | "campaign"

@Entity({ tableName: "promotion" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class Promotion {
  [OptionalProps]?: OptionalFields | OptionalRelations

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Searchable()
  @Property({ columnType: "text" })
  @Index({ name: "IDX_promotion_code" })
  @Unique({
    name: "IDX_promotion_code_unique",
    properties: ["code"],
  })
  code: string

  @ManyToOne(() => Campaign, {
    columnType: "text",
    fieldName: "campaign_id",
    nullable: true,
    mapToPk: true,
  })
  campaign_id: string | null = null

  @ManyToOne(() => Campaign, { persist: false })
  campaign: Rel<Campaign> | null

  @Property({ columnType: "boolean", default: false })
  is_automatic: boolean = false

  @Index({ name: "IDX_promotion_type" })
  @Enum(() => PromotionUtils.PromotionType)
  type: PromotionTypeValues

  @OneToOne({
    entity: () => ApplicationMethod,
    mappedBy: (am) => am.promotion,
    cascade: ["soft-remove"] as any,
  })
  application_method: Rel<ApplicationMethod>

  @ManyToMany(() => PromotionRule, "promotions", {
    owner: true,
    pivotTable: "promotion_promotion_rule",
    cascade: ["soft-remove"] as any,
  })
  rules = new Collection<Rel<PromotionRule>>(this)

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
    this.id = generateEntityId(this.id, "promo")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "promo")
  }
}
