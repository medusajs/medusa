import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import Currency from "./currency"
import PriceList from "./price-list"
import PriceSet from "./price-set"
import { generateEntityId } from "@medusajs/utils"

@Entity()
class MoneyAmount {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", nullable: true })
  currency_code?: string

  @ManyToMany({
    entity: () => PriceSet,
    mappedBy: (ps) => ps.money_amounts,
  })
  price_sets = new Collection<PriceSet>(this)

  @ManyToOne(() => Currency, {
    nullable: true,
    index: "IDX_money_amount_currency_code",
    fieldName: "currency_code",
  })
  currency?: Currency

  @Property({ columnType: "numeric", nullable: true })
  amount?: number

  @Property({ columnType: "numeric", nullable: true })
  min_quantity?: number | null

  @Property({ columnType: "numeric", nullable: true })
  max_quantity?: number | null

  @Property({ columnType: "text", nullable: true })
  price_list_id: string | null

  @ManyToOne({
    entity: () => PriceList,
    nullable: true,
    cascade: [Cascade.REMOVE],
    index: "IDX_money_amount_price_list_id",
  })
  price_list: PriceList | null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ma")
  }
}

export default MoneyAmount
