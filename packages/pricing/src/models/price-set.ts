import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
} from "@mikro-orm/core"

import MoneyAmount from "./money-amount"

@Entity()
export default class PriceSet {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @ManyToMany(() => MoneyAmount)
  money_amounts: Collection<MoneyAmount> = new Collection<MoneyAmount>(this)

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ps")
  }
}
