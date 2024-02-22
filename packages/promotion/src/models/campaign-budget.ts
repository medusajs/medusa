import { CampaignBudgetTypeValues, DAL } from "@medusajs/types"
import { DALUtils, PromotionUtils, generateEntityId } from "@medusajs/utils"
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

@Entity({ tableName: "campaign_budget" })
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

  @Property({
    columnType: "numeric",
    nullable: true,
    serializer: Number,
    default: null,
  })
  limit: number | null = null

  @Property({
    columnType: "numeric",
    serializer: Number,
    default: 0,
  })
  used: number

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
