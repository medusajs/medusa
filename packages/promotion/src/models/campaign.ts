import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Collection,
  Entity,
  OnInit,
  OneToMany,
  OneToOne,
  OptionalProps,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core"
import CampaignBudget from "./campaign-budget"
import Promotion from "./promotion"

type OptionalFields =
  | "description"
  | "currency"
  | "created_at"
  | "updated_at"
  | "deleted_at"

type OptionalRelations = "budget"

@Entity()
export default class Campaign {
  [OptionalProps]?: OptionalFields | OptionalRelations

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  name: string

  @Property({ columnType: "text", nullable: true })
  description: string | null

  @Property({ columnType: "text", nullable: true })
  currency: string | null

  @Property({ columnType: "text" })
  @Unique({
    name: "IDX_campaign_identifier_unique",
    properties: ["campaign_identifier"],
  })
  campaign_identifier: string

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  starts_at: Date | null

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  ends_at: Date | null

  @OneToOne({
    entity: () => CampaignBudget,
    mappedBy: (cb) => cb.campaign,
    cascade: ["soft-remove"] as any,
    nullable: true,
  })
  budget: CampaignBudget | null

  @OneToMany(() => Promotion, (promotion) => promotion.campaign, {
    orphanRemoval: true,
  })
  promotions = new Collection<Promotion>(this)

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
    this.id = generateEntityId(this.id, "procamp")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "promocamp")
  }
}
