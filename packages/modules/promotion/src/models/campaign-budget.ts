import {
  BigNumberRawValue,
  CampaignBudgetTypeValues,
  DAL,
} from "@medusajs/types"
import {
  BigNumber,
  DALUtils,
  MikroOrmBigNumberProperty,
  PromotionUtils,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  Enum,
  Filter,
  Index,
  OnInit,
  OneToOne,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import Campaign from "./campaign"

type OptionalFields =
  | "description"
  | "limit"
  | "used"
  | DAL.SoftDeletableEntityDateColumns

@Entity({ tableName: "promotion_campaign_budget" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class CampaignBudget {
  [OptionalProps]?: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Index({ name: "IDX_campaign_budget_type" })
  @Enum(() => PromotionUtils.CampaignBudgetType)
  type: CampaignBudgetTypeValues

  @OneToOne({
    entity: () => Campaign,
  })
  campaign: Campaign | null = null

  @Property({ columnType: "text", nullable: true })
  currency_code: string | null = null

  @MikroOrmBigNumberProperty({ nullable: true })
  limit: BigNumber | number | null = null

  @Property({ columnType: "jsonb", nullable: true })
  raw_limit: BigNumberRawValue | null = null

  @MikroOrmBigNumberProperty({ default: 0 })
  used: BigNumber | number = 0

  @Property({ columnType: "jsonb" })
  raw_used: BigNumberRawValue

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
    this.id = generateEntityId(this.id, "probudg")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "probudg")
  }
}
