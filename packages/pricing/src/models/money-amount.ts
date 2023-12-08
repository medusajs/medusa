import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Collection,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToOne,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import Currency from "./currency"
import { PriceSetMoneyAmount } from "./index"
import PriceSet from "./price-set"

@Entity()
class MoneyAmount {
  [OptionalProps]?:
    | "created_at"
    | "updated_at"
    | "deleted_at"
    | "price_set_money_amount"

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", nullable: true })
  currency_code?: string

  @ManyToMany({
    entity: () => PriceSet,
    mappedBy: (ps) => ps.money_amounts,
  })
  price_sets = new Collection<PriceSet>(this)

  @OneToOne({
    entity: () => PriceSetMoneyAmount,
    mappedBy: (psma) => psma.money_amount,
  })
  price_set_money_amount: PriceSetMoneyAmount

  @ManyToOne(() => Currency, {
    nullable: true,
    index: "IDX_money_amount_currency_code",
    fieldName: "currency_code",
  })
  currency?: Currency

  @Property({ columnType: "numeric", nullable: true, serializer: Number })
  amount?: number

  @Property({ columnType: "numeric", nullable: true })
  min_quantity?: number | null

  @Property({ columnType: "numeric", nullable: true })
  max_quantity?: number | null

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
  deleted_at: Date

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ma")
  }
}

export default MoneyAmount
