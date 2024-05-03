import { DAL } from "@medusajs/types"
import {
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
  PriceListStatus,
  PriceListType,
  Searchable,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  Enum,
  Filter,
  ManyToMany,
  OneToMany,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import Price from "./price"
import PriceListRule from "./price-list-rule"
import RuleType from "./rule-type"

type OptionalFields =
  | "starts_at"
  | "ends_at"
  | DAL.SoftDeletableEntityDateColumns

const tableName = "price_list"
const PriceListDeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: tableName,
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

export const PriceListIdPrefix = "plist"

@Entity({ tableName })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class PriceList {
  [OptionalProps]: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Searchable()
  @Property({ columnType: "text" })
  title: string

  @Searchable()
  @Property({ columnType: "text" })
  description: string

  @Enum({ items: () => PriceListStatus, default: PriceListStatus.DRAFT })
  status: PriceListStatus

  @Enum({ items: () => PriceListType, default: PriceListType.SALE })
  type: PriceListType

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  starts_at: Date | null = null

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  ends_at: Date | null = null

  @OneToMany(() => Price, (price) => price.price_list, {
    cascade: [Cascade.PERSIST, "soft-remove" as Cascade],
  })
  prices = new Collection<Price>(this)

  @OneToMany(() => PriceListRule, (pr) => pr.price_list, {
    cascade: [Cascade.PERSIST, "soft-remove" as Cascade],
  })
  price_list_rules = new Collection<PriceListRule>(this)

  @ManyToMany({
    entity: () => RuleType,
    pivotEntity: () => PriceListRule,
  })
  rule_types = new Collection<RuleType>(this)

  @Property({ columnType: "integer", default: 0 })
  rules_count: number = 0

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

  @PriceListDeletedAtIndex.MikroORMIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, PriceListIdPrefix)
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, PriceListIdPrefix)
  }
}
