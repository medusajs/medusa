import { DAL } from "@medusajs/types"
import { DALUtils, generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  Filter,
  Index,
  OnInit,
  OneToOne,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { PriceSetMoneyAmount } from "./index"

type OptionalFields = DAL.SoftDeletableEntityDateColumns

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
class MoneyAmount {
  [OptionalProps]?: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({
    columnType: "text",
    index: "IDX_money_amount_currency_code",
  })
  currency_code: string

  @Property({
    columnType: "numeric",
    serializer: Number,
  })
  amount: number

  @Property({ columnType: "numeric", nullable: true })
  min_quantity: number | null

  @Property({ columnType: "numeric", nullable: true })
  max_quantity: number | null

  @OneToOne({
    entity: () => PriceSetMoneyAmount,
    mappedBy: (psma) => psma.money_amount,
  })
  price_set_money_amount: PriceSetMoneyAmount

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

  @Index({ name: "IDX_money_amount_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ma")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ma")
  }
}

export default MoneyAmount
